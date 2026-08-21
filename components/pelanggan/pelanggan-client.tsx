"use client"

import { useState, useTransition } from "react"
import { Plus, Pencil } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { PageHeader } from "@/components/page-header"
import { ExportButtons } from "@/components/export-buttons"
import { ConfirmDelete } from "@/components/confirm-delete"
import { createPelanggan, updatePelanggan, deletePelanggan } from "@/app/actions/pelanggan"

type Pelanggan = {
  id: number
  nama: string
  telepon: string | null
  alamat: string | null
}

export function PelangganClient({ data }: { data: Pelanggan[] }) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Pelanggan | null>(null)
  const [nama, setNama] = useState("")
  const [telepon, setTelepon] = useState("")
  const [alamat, setAlamat] = useState("")
  const [isPending, startTransition] = useTransition()

  function bukaTambah() {
    setEditing(null)
    setNama("")
    setTelepon("")
    setAlamat("")
    setOpen(true)
  }

  function bukaEdit(p: Pelanggan) {
    setEditing(p)
    setNama(p.nama)
    setTelepon(p.telepon ?? "")
    setAlamat(p.alamat ?? "")
    setOpen(true)
  }

  function simpan() {
    if (!nama.trim()) {
      toast.error("Nama pelanggan wajib diisi")
      return
    }
    startTransition(async () => {
      try {
        if (editing) {
          await updatePelanggan(editing.id, { nama, telepon, alamat })
          toast.success("Pelanggan diperbarui")
        } else {
          await createPelanggan({ nama, telepon, alamat })
          toast.success("Pelanggan ditambahkan")
        }
        setOpen(false)
      } catch {
        toast.error("Gagal menyimpan data")
      }
    })
  }

  const exportRows = data.map((p) => ({
    ID: p.id,
    Nama: p.nama,
    Telepon: p.telepon ?? "",
    Alamat: p.alamat ?? "",
  }))

  return (
    <div className="print-area">
      <PageHeader title="Pelanggan" description="Kelola data pelanggan dan pengirim.">
        <ExportButtons filename="data-pelanggan" rows={exportRows} />
        <Button size="sm" onClick={bukaTambah} className="no-print">
          <Plus className="size-4" />
          Tambah Pelanggan
        </Button>
      </PageHeader>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Telepon</TableHead>
              <TableHead>Alamat</TableHead>
              <TableHead className="no-print w-24 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  Belum ada data pelanggan.
                </TableCell>
              </TableRow>
            ) : (
              data.map((p, i) => (
                <TableRow key={p.id}>
                  <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                  <TableCell className="font-medium">{p.nama}</TableCell>
                  <TableCell>{p.telepon || "-"}</TableCell>
                  <TableCell className="max-w-xs truncate">{p.alamat || "-"}</TableCell>
                  <TableCell className="no-print text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => bukaEdit(p)}>
                        <Pencil className="size-4" />
                        <span className="sr-only">Ubah</span>
                      </Button>
                      <ConfirmDelete
                        label={`pelanggan "${p.nama}"`}
                        onConfirm={() => deletePelanggan(p.id)}
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
            <DialogTitle>{editing ? "Ubah Pelanggan" : "Tambah Pelanggan"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-1.5">
              <Label htmlFor="nama">Nama</Label>
              <Input id="nama" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="cth. PT Maju Logistik" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="telepon">Telepon</Label>
              <Input id="telepon" value={telepon} onChange={(e) => setTelepon(e.target.value)} placeholder="cth. 0812xxxx" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="alamat">Alamat</Label>
              <Input id="alamat" value={alamat} onChange={(e) => setAlamat(e.target.value)} placeholder="Alamat lengkap" />
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
