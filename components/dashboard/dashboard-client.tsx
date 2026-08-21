"use client"

import { useState, useTransition } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Cell,
  Pie,
  PieChart,
} from "recharts"
import { Package, Wallet, Users, Ship, Scale, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PageHeader } from "@/components/page-header"
import { ExportButtons } from "@/components/export-buttons"
import { formatRupiah, formatAngka } from "@/lib/format"
import {
  getRingkasan,
  getPendapatanBulanan,
  getStatusPengiriman,
  type Ringkasan,
  type TitikBulan,
  type StatusRute,
} from "@/app/actions/laporan"

const STATUS_COLOR: Record<string, string> = {
  menunggu: "var(--color-chart-5)",
  dikirim: "var(--color-chart-2)",
  tiba: "var(--color-chart-3)",
  selesai: "var(--color-chart-1)",
}

function bulanLabel(ym: string) {
  const [y, m] = ym.split("-")
  const nama = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"]
  return `${nama[Number(m) - 1]} ${y}`
}

export function DashboardClient({
  initialRingkasan,
  initialBulanan,
  initialStatus,
}: {
  initialRingkasan: Ringkasan
  initialBulanan: TitikBulan[]
  initialStatus: StatusRute[]
}) {
  const [dari, setDari] = useState("")
  const [sampai, setSampai] = useState("")
  const [ringkasan, setRingkasan] = useState(initialRingkasan)
  const [bulanan, setBulanan] = useState(initialBulanan)
  const [status, setStatus] = useState(initialStatus)
  const [isPending, startTransition] = useTransition()

  function terapkan() {
    startTransition(async () => {
      const d = dari || undefined
      const s = sampai || undefined
      const [r, b, st] = await Promise.all([
        getRingkasan(d, s),
        getPendapatanBulanan(d, s),
        getStatusPengiriman(d, s),
      ])
      setRingkasan(r)
      setBulanan(b)
      setStatus(st)
    })
  }

  function reset() {
    setDari("")
    setSampai("")
    startTransition(async () => {
      const [r, b, st] = await Promise.all([
        getRingkasan(),
        getPendapatanBulanan(),
        getStatusPengiriman(),
      ])
      setRingkasan(r)
      setBulanan(b)
      setStatus(st)
    })
  }

  const stats = [
    {
      label: "Total Pengiriman",
      value: formatAngka(ringkasan.totalPengiriman),
      icon: Package,
    },
    {
      label: "Total Pendapatan",
      value: formatRupiah(ringkasan.totalPendapatan),
      icon: TrendingUp,
    },
    {
      label: "Pembayaran Diterima",
      value: formatRupiah(ringkasan.totalDiterima),
      icon: Wallet,
    },
    {
      label: "Total Muatan",
      value: `${formatAngka(ringkasan.totalBerat)} ton`,
      icon: Scale,
    },
    {
      label: "Pelanggan",
      value: formatAngka(ringkasan.totalPelanggan),
      icon: Users,
    },
    {
      label: "Armada Kapal",
      value: formatAngka(ringkasan.totalKapal),
      icon: Ship,
    },
  ]

  const barData = bulanan.map((b) => ({ ...b, label: bulanLabel(b.bulan) }))
  const pieData = status.map((s) => ({
    name: s.status,
    value: s.jumlah,
    fill: STATUS_COLOR[s.status] ?? "var(--color-chart-4)",
  }))

  const exportRows = bulanan.map((b) => ({
    Bulan: bulanLabel(b.bulan),
    "Jumlah Pengiriman": b.jumlah,
    Pendapatan: b.pendapatan,
  }))

  return (
    <div className="print-area">
      <PageHeader
        title="Dashboard"
        description="Ringkasan kinerja bisnis angkutan laut Anda."
      >
        <ExportButtons filename="laporan-pendapatan" rows={exportRows} />
      </PageHeader>

      {/* Filter periode */}
      <Card className="no-print mb-6">
        <CardContent className="flex flex-col gap-4 py-4 sm:flex-row sm:items-end">
          <div className="grid gap-1.5">
            <Label htmlFor="dari">Dari Tanggal</Label>
            <Input id="dari" type="date" value={dari} onChange={(e) => setDari(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="sampai">Sampai Tanggal</Label>
            <Input
              id="sampai"
              type="date"
              value={sampai}
              onChange={(e) => setSampai(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={terapkan} disabled={isPending}>
              {isPending ? "Memuat..." : "Terapkan"}
            </Button>
            <Button variant="outline" onClick={reset} disabled={isPending}>
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stat cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.label}>
              <CardContent className="flex items-center gap-4 py-5">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Icon className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-muted-foreground">{s.label}</p>
                  <p className="truncate font-heading text-lg font-bold text-foreground">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-heading">Pendapatan per Bulan</CardTitle>
            <CardDescription>Total tarif pengiriman berdasarkan bulan.</CardDescription>
          </CardHeader>
          <CardContent>
            {barData.length ? (
              <ChartContainer
                config={{
                  pendapatan: { label: "Pendapatan", color: "var(--color-chart-1)" },
                }}
                className="h-[280px] w-full"
              >
                <BarChart data={barData} margin={{ left: 12, right: 12 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    width={70}
                    fontSize={11}
                    tickFormatter={(v) => `${(v / 1_000_000).toLocaleString("id-ID")} jt`}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent formatter={(v) => formatRupiah(Number(v))} />}
                  />
                  <Bar dataKey="pendapatan" fill="var(--color-pendapatan)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ChartContainer>
            ) : (
              <p className="py-12 text-center text-sm text-muted-foreground">Belum ada data.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Status Pengiriman</CardTitle>
            <CardDescription>Distribusi status pengiriman.</CardDescription>
          </CardHeader>
          <CardContent>
            {pieData.length ? (
              <ChartContainer config={{}} className="mx-auto h-[280px] w-full">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90}>
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            ) : (
              <p className="py-12 text-center text-sm text-muted-foreground">Belum ada data.</p>
            )}
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              {pieData.map((p) => (
                <div key={p.name} className="flex items-center gap-1.5 text-xs">
                  <span className="size-2.5 rounded-full" style={{ background: p.fill }} />
                  <span className="capitalize text-muted-foreground">
                    {p.name} ({p.value})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
