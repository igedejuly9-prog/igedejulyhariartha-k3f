"use client"

import { useState, useTransition } from "react"
import { Plus, Pencil } from "lucide-react"
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
import { formatAngka } from "@/lib/format"
import { createKapal, updateKapal, deleteKapal } from "@/app/actions/kapal"

type Kapal = {
  id: number
  nama: string
  kapasitas: string
  status: string
}

const STATUS = ["aktif", "berlayar", "perawatan", "nonaktif"]

const badgeVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  aktif: "default",
  berlayar: "secondary",
  perawatan: "outline",
  nonaktif: "destructive",
}

export function KapalClient({ data }: { data: Kapal[] }) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Kapal | null>(null)
  const [nama, setNama] = useState("")
  const [kapasitas, setKapasitas] = useState("")
  const [status, setStatus] = useState("aktif")
  const [isPending, startTransition] = useTransition()

  function bukaTambah() {
    setEditing(null)
    setNama("")
    setKapasitas("")
    setStatus("aktif")
    setOpen(true)
  }

  function bukaEdit(k: Kapal) {
    setEditing(k)
    setNama(k.nama)
    setKapasitas(String(k.kapasitas))
    setStatus(k.status)
    setOpen(true)
  }

  function simpan() {
    if (!nama.trim()) {
      toast.error("Nama kapal wajib diisi")
      return
    }
    startTransition(async () => {
      try {
        const payload = { nama, kapasitas: Number(kapasitas) || 0, status }
        if (editing) {
          await updateKapal(editing.id, payload)
          toast.success("Kapal diperbarui")
        } else {
          await createKapal(payload)
          toast.success("Kapal ditambahkan")
        }
        setOpen(false)
      } catch {
        toast.error("Gagal menyimpan data")
      }
    })
  }

  const exportRows = data.map((k) => ({
    ID: k.id,
    Nama: k.nama,
    "Kapasitas (ton)": k.kapasitas,
    Status: k.status,
  }))

  return (
    <div className="print-area">
      <PageHeader title="Kapal / Armada" description="Kelola data kapal dan armada Anda.">
        <ExportButtons filename="data-kapal" rows={exportRows} />
        <Button size="sm" onClick={bukaTambah} className="no-print">
          <Plus className="size-4" />
          Tambah Kapal
        </Button>
      </PageHeader>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Nama Kapal</TableHead>
              <TableHead>Kapasitas</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="no-print w-24 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  Belum ada data kapal.
                </TableCell>
              </TableRow>
            ) : (
              data.map((k, i) => (
                <TableRow key={k.id}>
                  <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                  <TableCell className="font-medium">{k.nama}</TableCell>
                  <TableCell>{formatAngka(k.kapasitas)} ton</TableCell>
                  <TableCell>
                    <Badge variant={badgeVariant[k.status] ?? "outline"} className="capitalize">
                      {k.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="no-print text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => bukaEdit(k)}>
                        <Pencil className="size-4" />
                        <span className="sr-only">Ubah</span>
                      </Button>
                      <ConfirmDelete label={`kapal "${k.nama}"`} onConfirm={() => deleteKapal(k.id)} />
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
            <DialogTitle>{editing ? "Ubah Kapal" : "Tambah Kapal"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-1.5">
              <Label htmlFor="nama">Nama Kapal</Label>
              <Input id="nama" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="cth. KM Bahari Jaya" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="kapasitas">Kapasitas (ton)</Label>
              <Input
                id="kapasitas"
                type="number"
                value={kapasitas}
                onChange={(e) => setKapasitas(e.target.value)}
                placeholder="cth. 1500"
              />
            </div>
            <div className="grid gap-1.5">
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
