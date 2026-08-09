# Pockets

Pockets subdivides one bank account into multiple "funds" and tracks the transactions inside each fund.

## Language

**Privacy Mode**:
A persisted, app-wide user preference. When on, it replaces every displayed money amount with a masked amount, including amounts derived from a balance (such as the estimated monthly interest). It does not change non-monetary UI, such as the chart's slice proportions.
_Avoid_: mask mode, hide balances, blur mode, incognito mode

**Masked amount**:
The fixed placeholder shown instead of a real currency value when Privacy Mode is on (`$****`). Its length does not change with the real value's digit count, so it does not reveal the value's magnitude.
_Avoid_: hidden amount, obscured value
