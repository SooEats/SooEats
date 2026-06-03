export function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: currency.toUpperCase(),
    currencyDisplay: "code",
  }).format(amount);
}
