"use client"

import { useState, useTransition } from "react"
import { Plus, Pencil, ArrowRight } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { PageHeader } from "@/components/page-header"
import { ExportButtons } from "@/components/export-buttons"
import { ConfirmDelete } from "@/components/confirm-delete"
import { formatTanggal } from "@/lib/format"
import { createRute, updateRute, deleteRute } from "@/app/actions/rute"

type Rute = {
  id: number
  pelabuhanAsal: string
  pelabuhanTujuan: string
  kapalId: number | null
  kapalNama: string | null
  tanggalBerangkat: string | null
  tanggalTiba: string | null
  status: string
}

type KapalOpt = { id: number; nama: string }

const STATUS = ["dijadwalkan", "berlayar", "selesai", "batal"]

const badgeVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  dijadwalkan: "outline",
  berlayar: "secondary",
  selesai: "default",
  batal: "destructive",
}

export function RuteClient({ data, kapalList }: { data: Rute[]; kapalList: KapalOpt[] }) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Rute | null>(null)
  const [asal, setAsal] = useState("")
  const [tujuan, setTujuan] = useState("")
  const [kapalId, setKapalId] = useState<string>("none")
  const [berangkat, setBerangkat] = useState("")
  const [tiba, setTiba] = useState("")
  const [status, setStatus] = useState("dijadwalkan")
  const [isPending, startTransition] = useTransition()

  function bukaTambah() {
    setEditing(null)
    setAsal("")
    setTujuan("")
    setKapalId("none")
    setBerangkat("")
    setTiba("")
    setStatus("dijadwalkan")
    setOpen(true)
  }

  function bukaEdit(r: Rute) {
    setEditing(r)
    setAsal(r.pelabuhanAsal)
    setTujuan(r.pelabuhanTujuan)
    setKapalId(r.kapalId ? String(r.kapalId) : "none")
    setBerangkat(r.tanggalBerangkat ?? "")
    setTiba(r.tanggalTiba ?? "")
    setStatus(r.status)
    setOpen(true)
  }

  function simpan() {
    if (!asal.trim() || !tujuan.trim()) {
      toast.error("Pelabuhan asal dan tujuan wajib diisi")
      return
    }
    startTransition(async () => {
      try {
        const payload = {
          pelabuhanAsal: asal,
          pelabuhanTujuan: tujuan,
          kapalId: kapalId === "none" ? null : Number(kapalId),
          tanggalBerangkat: berangkat || null,
          tanggalTiba: tiba || null,
          status,
        }
        if (editing) {
          await updateRute(editing.id, payload)
          toast.success("Rute diperbarui")
        } else {
          await createRute(payload)
          toast.success("Rute ditambahkan")
        }
        setOpen(false)
      } catch {
        toast.error("Gagal menyimpan data")
      }
    })
  }

  const exportRows = data.map((r) => ({
    ID: r.id,
    Asal: r.pelabuhanAsal,
    Tujuan: r.pelabuhanTujuan,
    Kapal: r.kapalNama ?? "",
    Berangkat: r.tanggalBerangkat ?? "",
    Tiba: r.tanggalTiba ?? "",
    Status: r.status,
  }))

  return (
    <div className="print-area">
      <PageHeader title="Jadwal & Rute" description="Kelola jadwal pelayaran dan rute pelabuhan.">
        <ExportButtons filename="data-rute" rows={exportRows} />
        <Button size="sm" onClick={bukaTambah} className="no-print">
          <Plus className="size-4" />
          Tambah Rute
        </Button>
      </PageHeader>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Rute</TableHead>
              <TableHead>Kapal</TableHead>
              <TableHead>Berangkat</TableHead>
              <TableHead>Tiba</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="no-print w-24 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  Belum ada data rute.
                </TableCell>
              </TableRow>
            ) : (
              data.map((r, i) => (
                <TableRow key={r.id}>
                  <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                  <TableCell className="font-medium">
                    <span className="inline-flex items-center gap-1.5">
                      {r.pelabuhanAsal}
                      <ArrowRight className="size-3.5 text-muted-foreground" />
                      {r.pelabuhanTujuan}
                    </span>
                  </TableCell>
                  <TableCell>{r.kapalNama || "-"}</TableCell>
                  <TableCell>{formatTanggal(r.tanggalBerangkat)}</TableCell>
                  <TableCell>{formatTanggal(r.tanggalTiba)}</TableCell>
                  <TableCell>
                    <Badge variant={badgeVariant[r.status] ?? "outline"} className="capitalize">
                      {r.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="no-print text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => bukaEdit(r)}>
                        <Pencil className="size-4" />
                        <span className="sr-only">Ubah</span>
                      </Button>
                      <ConfirmDelete
                        label={`rute ${r.pelabuhanAsal} - ${r.pelabuhanTujuan}`}
                        onConfirm={() => deleteRute(r.id)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Ubah Rute" : "Tambah Rute"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="asal">Pelabuhan Asal</Label>
              <Input id="asal" value={asal} onChange={(e) => setAsal(e.target.value)} placeholder="cth. Surabaya" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="tujuan">Pelabuhan Tujuan</Label>
              <Input id="tujuan" value={tujuan} onChange={(e) => setTujuan(e.target.value)} placeholder="cth. Makassar" />
            </div>
            <div className="grid gap-1.5 sm:col-span-2">
              <Label htmlFor="kapal">Kapal</Label>
              <Select value={kapalId} onValueChange={setKapalId}>
                <SelectTrigger id="kapal">
                  <SelectValue placeholder="Pilih kapal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Tidak ditentukan</SelectItem>
                  {kapalList.map((k) => (
                    <SelectItem key={k.id} value={String(k.id)}>
                      {k.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="berangkat">Tanggal Berangkat</Label>
              <Input id="berangkat" type="date" value={berangkat} onChange={(e) => setBerangkat(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="tiba">Tanggal Tiba</Label>
              <Input id="tiba" type="date" value={tiba} onChange={(e) => setTiba(e.target.value)} />
            </div>
            <div className="grid gap-1.5 sm:col-span-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Batal
            </Button>
            <Button onClick={simpan} disabled={isPending}>
              {isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
