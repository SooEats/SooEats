export type PaymentStatus =
  | "REQUIRES_PAYMENT"
  | "PROCESSING"
  | "SUCCEEDED"
  | "FAILED"
  | "CANCELED"
  | "REFUNDED";

export function formatPaymentStatus(status: PaymentStatus | string) {
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

export function canRetryPayment(status: PaymentStatus | string) {
  return status === "REQUIRES_PAYMENT" || status === "FAILED" || status === "CANCELED";
}

export function getPaymentStatusTone(status: PaymentStatus | string) {
  if (status === "SUCCEEDED") return "text-green-600";
  if (status === "PROCESSING") return "text-blue-600";
  if (status === "REFUNDED") return "text-purple-600";
  if (status === "FAILED" || status === "CANCELED") return "text-red-600";
  return "text-orange-600";
}
