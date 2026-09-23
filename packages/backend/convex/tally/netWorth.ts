import type { Doc, Id } from "../_generated/dataModel";
import { type QueryCtx, query } from "../_generated/server";
import type { SubjectId } from "../lib/tally";

/**
 * The Home chart of Tally: total assets, total liabilities and net worth over
 * the whole history. See apps/tally/CONTEXT.md for the terms.
 *
 * Net worth is never stored. At each sample point, the query takes the worth
 * of every asset and liability by carry-forward: the latest valuation, holding
 * and price at or before the point. It reads them through the `by_…_at`
 * indexes, so when two rows have the same `at` the row inserted last wins, as
 * it does for `currentWorth` and `currentShares`.
 *
 * Downsampling: the sample points cut the history into buckets, and the last
 * worth in a bucket is the carry-forward worth at the end of the bucket. There
 * are at most `MAX_POINTS` points, and never less than one day between two
 * points. The first point is at the oldest valuation or holding and the last
 * point is at the latest valuation, holding or price. A history shorter than
 * one day gives one point.
 *
 * Archived assets and liabilities need no special case. The archive rule makes
 * their last valuation or holding zero, so carry-forward gives their worth
 * before the archive and zero after it.
 *
 * Valuations and holdings are sparse, so the query reads all of them. Prices
 * are dense (one each weekday for each ticker), so the query reads only the one
 * price that each sample point needs. That is at most `MAX_POINTS` index reads
 * for each ticker, and Convex allows 4,096 in one query, so about 40 tickers is
 * the limit.
 */

const MAX_POINTS = 90;

const DAY_MS = 24 * 60 * 60 * 1000;

export type NetWorthPoint = {
  at: number;
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
};

/** All valuations of one asset or liability, oldest first. */
const getValuations = (ctx: QueryCtx, subjectId: SubjectId) =>
  ctx.db
    .query("tally_valuations")
    .withIndex("by_subject_at", (q) => q.eq("subjectId", subjectId))
    .collect();

/** All holdings of one stock asset, oldest first. */
const getHoldings = (ctx: QueryCtx, assetId: Id<"tally_assets">) =>
  ctx.db
    .query("tally_holdings")
    .withIndex("by_asset_at", (q) => q.eq("assetId", assetId))
    .collect();

/** The latest price of a ticker at or before `at`, or the latest of all. */
const getPrice = (ctx: QueryCtx, ticker: string, at?: number) =>
  ctx.db
    .query("tally_prices")
    .withIndex("by_ticker_at", (q) =>
      at === undefined
        ? q.eq("ticker", ticker)
        : q.eq("ticker", ticker).lte("at", at),
    )
    .order("desc")
    .first();

/** Up to `MAX_POINTS` evenly spaced times from `start` to `end`. */
const getSampleTimes = (start: number, end: number) => {
  const count = Math.min(MAX_POINTS, Math.floor((end - start) / DAY_MS) + 1);
  if (count === 1) return [end];
  return Array.from(
    { length: count },
    (_, index) => start + Math.round(((end - start) * index) / (count - 1)),
  );
};

/**
 * The carry-forward number of a history (valuations or holdings) at each time.
 * `rows` and `times` must be oldest first. Before the first row, the number is
 * zero.
 */
const carryForward = <T extends { at: number }>(
  rows: T[],
  times: number[],
  read: (row: T) => number,
) => {
  const values: number[] = [];
  let next = 0;
  let current = 0;
  for (const time of times) {
    while (next < rows.length && rows[next].at <= time) {
      current = read(rows[next]);
      next++;
    }
    values.push(current);
  }
  return values;
};

/** Adds series of the same length, point by point. */
const sumSeries = (length: number, series: number[][]) =>
  Array.from({ length }, (_, index) =>
    series.reduce((total, values) => total + values[index], 0),
  );

/**
 * The worth of all shares of one ticker at each time. A time with zero shares
 * reads no price. An unpriced time has a worth of zero.
 */
const getTickerWorths = (
  ctx: QueryCtx,
  ticker: string,
  shares: number[],
  times: number[],
) =>
  Promise.all(
    shares.map(async (count, index) => {
      if (count === 0) return 0;
      const price = await getPrice(ctx, ticker, times[index]);
      return count * (price?.price ?? 0);
    }),
  );

export const chart = query({
  args: {},
  handler: async (ctx): Promise<NetWorthPoint[]> => {
    const [assets, liabilities] = await Promise.all([
      ctx.db.query("tally_assets").collect(),
      ctx.db.query("tally_liabilities").collect(),
    ]);
    const stockAssets = assets.filter(
      (asset): asset is Extract<Doc<"tally_assets">, { type: "stock" }> =>
        asset.type === "stock",
    );
    const valuedAssets = assets.filter((asset) => asset.type !== "stock");
    const tickers = [...new Set(stockAssets.map((asset) => asset.ticker))];

    const [assetValuations, liabilityValuations, holdings, latestPrices] =
      await Promise.all([
        Promise.all(valuedAssets.map((asset) => getValuations(ctx, asset._id))),
        Promise.all(
          liabilities.map((liability) => getValuations(ctx, liability._id)),
        ),
        Promise.all(stockAssets.map((asset) => getHoldings(ctx, asset._id))),
        Promise.all(tickers.map((ticker) => getPrice(ctx, ticker))),
      ]);

    const histories = [...assetValuations, ...liabilityValuations, ...holdings];
    const firstAts = histories.flatMap((history) =>
      history.length ? [history[0].at] : [],
    );
    if (firstAts.length === 0) return [];
    const lastAts = [
      ...histories.flatMap((history) =>
        history.length ? [history[history.length - 1].at] : [],
      ),
      ...latestPrices.flatMap((price) => (price ? [price.at] : [])),
    ];
    const times = getSampleTimes(Math.min(...firstAts), Math.max(...lastAts));

    // Two stock assets with the same ticker share one price, so add their
    // shares first and read each price one time.
    const sharesByTicker = new Map<string, number[]>();
    stockAssets.forEach((asset, index) => {
      const shares = carryForward(holdings[index], times, (row) => row.shares);
      const otherShares = sharesByTicker.get(asset.ticker);
      sharesByTicker.set(
        asset.ticker,
        otherShares ? sumSeries(times.length, [otherShares, shares]) : shares,
      );
    });

    const stockWorths = await Promise.all(
      [...sharesByTicker].map(([ticker, shares]) =>
        getTickerWorths(ctx, ticker, shares, times),
      ),
    );
    const totalAssets = sumSeries(times.length, [
      ...assetValuations.map((history) =>
        carryForward(history, times, (row) => row.worth),
      ),
      ...stockWorths,
    ]);
    const totalLiabilities = sumSeries(
      times.length,
      liabilityValuations.map((history) =>
        carryForward(history, times, (row) => row.worth),
      ),
    );

    return times.map((at, index) => ({
      at,
      totalAssets: totalAssets[index],
      totalLiabilities: totalLiabilities[index],
      netWorth: totalAssets[index] - totalLiabilities[index],
    }));
  },
});
