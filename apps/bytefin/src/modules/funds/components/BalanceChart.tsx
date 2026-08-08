"use client";

import {
  ChartContainer,
  ChartTooltip,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@bytefin/ui/components";
import { PieChart as PieChartIcon } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import type { Account, Fund } from "@/modules/funds/interfaces";
import { EmptyState } from "@/modules/shared/components";
import { useLocalization } from "@/modules/shared/hooks";

interface BalanceChartProps {
  account: Account;
  funds: Fund[];
}

const COLORS = [
  "var(--chart-0)",
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
];

interface BalanceChartTooltipPayload {
  name?: string;
  value?: number;
}

interface BalanceChartTooltipProps {
  active?: boolean;
  coordinate?: {
    x?: number;
    y?: number;
  };
  payload?: BalanceChartTooltipPayload[];
}

const BalanceChartTooltip = ({
  active,
  coordinate,
  payload,
}: BalanceChartTooltipProps) => {
  const data = payload?.[0];
  const formattedValue = (data?.value ?? 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <TooltipProvider>
      <Tooltip open={Boolean(active && data)}>
        <TooltipTrigger asChild>
          <span
            className="pointer-events-none absolute block size-1"
            style={{
              left: coordinate?.x ?? 0,
              top: coordinate?.y ?? 0,
              transform: "translate(-50%, -50%)",
            }}
          />
        </TooltipTrigger>
        <TooltipContent side="top" align="center" className="text-center">
          <span className="block font-heading">{data?.name}</span>
          <span className="block font-mono tabular-nums">{formattedValue}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const BalanceChart = ({ account, funds }: BalanceChartProps) => {
  const { t } = useLocalization();

  const chartData = funds.map((fund, index) => ({
    name: fund.name,
    value: fund.balance,
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <section className="w-full ">
      {funds.length === 0 ? (
        <EmptyState
          icon={PieChartIcon}
          title={t("balanceChart.noFundsYet")}
          description={t("balanceChart.noFundsDescription")}
        />
      ) : account.balance === 0 ? (
        <EmptyState
          icon={PieChartIcon}
          title={t("balanceChart.noTransactionsYet")}
          description={t("balanceChart.noTransactionsDescription")}
        />
      ) : (
        <ChartContainer
          className="relative mx-auto aspect-square max-h-[250px]"
          config={{}}
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              position={{ x: 0, y: 0 }}
              content={<BalanceChartTooltip />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-lg font-bold"
                        >
                          {account.balance.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      )}
    </section>
  );
};
