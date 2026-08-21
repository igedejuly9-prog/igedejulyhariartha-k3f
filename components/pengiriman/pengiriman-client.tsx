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
import { formatRupiah, formatAngka, formatTanggal } from "@/lib/format"
import { createPengiriman, updatePengiriman, deletePengiriman } from "@/app/actions/pengiriman"

type Pengiriman = {
  id: number
  pelangganId: number | null
  pelangganNama: string | null
  ruteId: number | null
  pelabuhanAsal: string | null
  pelabuhanTujuan: string | null
  kapalId: number | null
  kapalNama: string | null
  jenisMuatan: string
  berat: string
  tarif: string
  status: string
  tanggal: string
}

type Opt = { id: number; label: string }

const STATUS = ["menunggu", "dikirim", "tiba", "selesai", "batal"]

const badgeVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  menunggu: "outline",
  dikirim: "secondary",
  tiba: "secondary",
  selesai: "default",
  batal: "destructive",
}

const today = () => new Date().toISOString().slice(0, 10)

export function PengirimanClient({
  data,
  pelangganList,
  ruteList,
  kapalList,
}: {
  data: Pengiriman[]
  pelangganList: Opt[]
  ruteList: Opt[]
  kapalList: Opt[]
}) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Pengiriman | null>(null)
  const [pelangganId, setPelangganId] = useState("none")
  const [ruteId, setRuteId] = useState("none")
  const [kapalId, setKapalId] = useState("none")
  const [jenisMuatan, setJenisMuatan] = useState("")
  const [berat, setBerat] = useState("")
  const [tarif, setTarif] = useState("")
  const [status, setStatus] = useState("menunggu")
  const [tanggal, setTanggal] = useState(today())
  const [isPending, startTransition] = useTransition()

  function bukaTambah() {
    setEditing(null)
    setPelangganId("none")
    setRuteId("none")
    setKapalId("none")
    setJenisMuatan("")
    setBerat("")
    setTarif("")
    setStatus("menunggu")
    setTanggal(today())
    setOpen(true)
  }

  function bukaEdit(p: Pengiriman) {
    setEditing(p)
    setPelangganId(p.pelangganId ? String(p.pelangganId) : "none")
    setRuteId(p.ruteId ? String(p.ruteId) : "none")
    setKapalId(p.kapalId ? String(p.kapalId) : "none")
    setJenisMuatan(p.jenisMuatan)
    setBerat(String(p.berat))
    setTarif(String(p.tarif))
    setStatus(p.status)
    setTanggal(p.tanggal)
    setOpen(true)
  }

  function simpan() {
    if (!jenisMuatan.trim()) {
      toast.error("Jenis muatan wajib diisi")
      return
    }
    startTransition(async () => {
      try {
        const payload = {
          pelangganId: pelangganId === "none" ? null : Number(pelangganId),
          ruteId: ruteId === "none" ? null : Number(ruteId),
          kapalId: kapalId === "none" ? null : Number(kapalId),
          jenisMuatan,
          berat: Number(berat) || 0,
          tarif: Number(tarif) || 0,
          status,
          tanggal,
        }
        if (editing) {
          await updatePengiriman(editing.id, payload)
          toast.success("Pengiriman diperbarui")
        } else {
          await createPengiriman(payload)
          toast.success("Pengiriman ditambahkan")
        }
        setOpen(false)
      } catch {
        toast.error("Gagal menyimpan data")
      }
    })
  }

  const exportRows = data.map((p) => ({
    ID: p.id,
    Tanggal: p.tanggal,
    Pelanggan: p.pelangganNama ?? "",
    Rute: p.pelabuhanAsal ? `${p.pelabuhanAsal} - ${p.pelabuhanTujuan}` : "",
    Kapal: p.kapalNama ?? "",
    Muatan: p.jenisMuatan,
    "Berat (ton)": p.berat,
    Tarif: p.tarif,
    Status: p.status,
  }))

  return (
    <div className="print-area">
      <PageHeader title="Pengiriman / Muatan" description="Kelola data pengiriman dan muatan.">
        <ExportButtons filename="data-pengiriman" rows={exportRows} />
        <Button size="sm" onClick={bukaTambah} className="no-print">
          <Plus className="size-4" />
          Tambah Pengiriman
        </Button>
      </PageHeader>

      <Card className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Pelanggan</TableHead>
              <TableHead>Muatan</TableHead>
              <TableHead>Rute</TableHead>
              <TableHead>Berat</TableHead>
              <TableHead>Tarif</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="no-print w-24 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="py-10 text-center text-muted-foreground">
                  Belum ada data pengiriman.
                </TableCell>
              </TableRow>
            ) : (
              data.map((p, i) => (
                <TableRow key={p.id}>
                  <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                  <TableCell className="whitespace-nowrap">{formatTanggal(p.tanggal)}</TableCell>
                  <TableCell className="font-medium">{p.pelangganNama || "-"}</TableCell>
                  <TableCell>{p.jenisMuatan}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {p.pelabuhanAsal ? `${p.pelabuhanAsal} - ${p.pelabuhanTujuan}` : "-"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{formatAngka(p.berat)} ton</TableCell>
                  <TableCell className="whitespace-nowrap">{formatRupiah(p.tarif)}</TableCell>
                  <TableCell>
                    <Badge variant={badgeVariant[p.status] ?? "outline"} className="capitalize">
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="no-print text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => bukaEdit(p)}>
                        <Pencil className="size-4" />
                        <span className="sr-only">Ubah</span>
                      </Button>
                      <ConfirmDelete
                        label={`pengiriman "${p.jenisMuatan}"`}
                        onConfirm={() => deletePengiriman(p.id)}
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
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Ubah Pengiriman" : "Tambah Pengiriman"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2 sm:grid-cols-2">
            <div className="grid gap-1.5 sm:col-span-2">
              <Label htmlFor="pelanggan">Pelanggan</Label>
              <Select value={pelangganId} onValueChange={setPelangganId}>
                <SelectTrigger id="pelanggan">
                  <SelectValue placeholder="Pilih pelanggan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Tidak ditentukan</SelectItem>
                  {pelangganList.map((o) => (
                    <SelectItem key={o.id} value={String(o.id)}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="rute">Rute</Label>
              <Select value={ruteId} onValueChange={setRuteId}>
                <SelectTrigger id="rute">
                  <SelectValue placeholder="Pilih rute" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Tidak ditentukan</SelectItem>
                  {ruteList.map((o) => (
                    <SelectItem key={o.id} value={String(o.id)}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="kapal">Kapal</Label>
              <Select value={kapalId} onValueChange={setKapalId}>
                <SelectTrigger id="kapal">
                  <SelectValue placeholder="Pilih kapal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Tidak ditentukan</SelectItem>
                  {kapalList.map((o) => (
                    <SelectItem key={o.id} value={String(o.id)}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="muatan">Jenis Muatan</Label>
              <Input id="muatan" value={jenisMuatan} onChange={(e) => setJenisMuatan(e.target.value)} placeholder="cth. Beras" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="tanggal">Tanggal</Label>
              <Input id="tanggal" type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="berat">Berat (ton)</Label>
              <Input id="berat" type="number" value={berat} onChange={(e) => setBerat(e.target.value)} placeholder="cth. 500" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="tarif">Tarif (Rp)</Label>
              <Input id="tarif" type="number" value={tarif} onChange={(e) => setTarif(e.target.value)} placeholder="cth. 45000000" />
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
