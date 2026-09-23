# Tally

Tally tracks net worth over time: the total of what the user owns minus the total of what the user owes.

## Language

### What the user owns and owes

No noun covers both an asset and a liability. Say "asset or liability".

**Asset**:
A thing the user owns that has a worth, such as money in a bank, shares of a stock or a car. Every asset has exactly one asset type.
_Avoid_: item, entry, subject, account, holding, position

**Liability**:
A debt the user owes, such as a mortgage, a credit card or a loan. A liability has no type, and its worth is always a positive number.
_Avoid_: item, entry, subject, debt account, loan (as the general term)

### Asset types

**Bank**:
An asset type for money kept in a bank or held as cash on hand.
_Avoid_: cash, account, savings, checking (as the type name)

**Stock**:
An asset type for shares of one US-listed stock or ETF, identified by its ticker. Crypto is not a stock asset.
_Avoid_: security, investment, equity, position

**Physical**:
An asset type for any owned object that could be sold, such as a house, a car or jewelry.
_Avoid_: property, real estate, possession, tangible

**Ticker**:
The exchange symbol of a stock or ETF, such as `VTI`. Two stock assets with the same ticker share one price.
_Avoid_: symbol, code

### Worth over time

**Worth**:
The money one asset or liability counts for at one moment. A stock asset's worth is the shares of its holding times the price of its ticker; every other worth is a valuation.
_Avoid_: value, balance, amount

**Valuation**:
A dated worth that the user enters for one bank asset, physical asset or liability. A stock asset never has valuations.
_Avoid_: value, balance, snapshot, appraisal

**Holding**:
A dated share count for one stock asset. A purchase or a sale is a new holding.
_Avoid_: position, shares (as the record), lot, transaction

**Price**:
The closing price of one share of a ticker on one date. A price belongs to a ticker, never to an asset.
_Avoid_: quote, value, rate

**Carry-forward**:
The rule that a valuation, holding or price stays in effect from its date until a newer one replaces it. So the worth at any moment comes from the latest records at or before that moment.
_Avoid_: interpolation, gap-filling, fill-forward

**Backdating**:
Entering a valuation or holding with a date in the past. Prices are never backdated.
_Avoid_: historical entry, retroactive edit

**Stale price**:
A latest price that is older than the most recent weekday market close. A stale price still counts toward worth.
_Avoid_: old price, outdated price, missing price

**Unpriced**:
The state of a stock asset at a moment before its ticker has any price. Its worth at that moment is zero.
_Avoid_: stale, missing price, no data

### Lifecycle

**Archive**:
To mark an asset or liability as finished after its last valuation or holding brings its worth to zero. Its history stays, so past net worth does not change, and it never comes back.
_Avoid_: close, sell, hide, deactivate

**Delete**:
To erase an asset or liability that was created by mistake, together with all its history. It is never the way to record a sale or a payoff, because past net worth would change.
_Avoid_: remove

### Net worth

**Total assets**:
The sum of the worth of every asset at one moment.
_Avoid_: gross worth, asset balance

**Total liabilities**:
The sum of the worth of every liability at one moment.
_Avoid_: total debt, debt balance

**Net worth**:
Total assets minus total liabilities at one moment. It is always derived and never stored.
_Avoid_: balance, total, equity, wealth

### Display

**Privacy Mode**:
A persisted user preference. When on, it replaces every displayed money amount and every share count with a masked amount, because shares times a public price show the worth. It does not hide the shape of the chart lines.
_Avoid_: mask mode, hide balances, blur mode, incognito mode

**Masked amount**:
The fixed placeholder shown instead of a real money amount (`$****`) or share count when Privacy Mode is on. Its length does not change with the real number, so it does not show its size.
_Avoid_: hidden amount, obscured value
