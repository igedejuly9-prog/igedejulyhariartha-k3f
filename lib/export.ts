export function exportToCSV(filename: string, rows: Record<string, unknown>[], headers?: string[]) {
  if (!rows.length) return
  const cols = headers ?? Object.keys(rows[0])
  const escape = (val: unknown) => {
    const s = val === null || val === undefined ? "" : String(val)
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
      return `"${s.replace(/"/g, '""')}"`
    }
    return s
  }
  const csv = [
    cols.join(","),
    ...rows.map((row) => cols.map((c) => escape(row[c])).join(",")),
  ].join("\n")

  // BOM so Excel reads UTF-8 correctly
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
