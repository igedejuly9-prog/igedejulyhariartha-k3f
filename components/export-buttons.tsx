"use client"

import { FileDown, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { exportToCSV } from "@/lib/export"

export function ExportButtons({
  filename,
  rows,
  headers,
}: {
  filename: string
  rows: Record<string, unknown>[]
  headers?: string[]
}) {
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => exportToCSV(filename, rows, headers)}
        disabled={!rows.length}
      >
        <FileDown className="size-4" />
        Excel / CSV
      </Button>
      <Button variant="outline" size="sm" onClick={() => window.print()}>
        <Printer className="size-4" />
        Cetak / PDF
      </Button>
    </>
  )
}
