export function converPrice(price: number): string {
  return price?.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
  });
}
