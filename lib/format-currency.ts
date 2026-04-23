/** Default display for parsed prompt costs (`cost_value` interpreted as USD). */

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 8,
});

export function formatUsd(amount: number): string {
  if (!Number.isFinite(amount)) return usd.format(0);
  return usd.format(amount);
}
