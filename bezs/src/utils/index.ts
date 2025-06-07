export function formatNumber(amount: number) {
  return amount?.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });
}
