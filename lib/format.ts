export function formatRupiah(value: number | string | null | undefined): string {
  const n = typeof value === "string" ? Number(value) : (value ?? 0)
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n || 0)
}

export function formatAngka(value: number | string | null | undefined): string {
  const n = typeof value === "string" ? Number(value) : (value ?? 0)
  return new Intl.NumberFormat("id-ID").format(n || 0)
}

export function formatTanggal(value: string | Date | null | undefined): string {
  if (!value) return "-"
  const d = typeof value === "string" ? new Date(value) : value
  if (Number.isNaN(d.getTime())) return "-"
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d)
}
