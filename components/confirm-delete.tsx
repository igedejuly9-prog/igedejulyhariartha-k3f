"use client"

import { useState, useTransition } from "react"
import { Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function ConfirmDelete({
  label,
  onConfirm,
}: {
  label: string
  onConfirm: () => Promise<void>
}) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      try {
        await onConfirm()
        toast.success("Data berhasil dihapus")
        setOpen(false)
      } catch {
        toast.error("Gagal menghapus data")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
          <Trash2 className="size-4" />
          <span className="sr-only">Hapus</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus data?</DialogTitle>
          <DialogDescription>
            {`Anda yakin ingin menghapus ${label}? Tindakan ini tidak dapat dibatalkan.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
            Batal
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
            {isPending ? "Menghapus..." : "Hapus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
