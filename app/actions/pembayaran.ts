"use server"

import { db } from "@/lib/db"
import { pembayaran, pengiriman, pelanggan } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function getPembayaran() {
  return db
    .select({
      id: pembayaran.id,
      pengirimanId: pembayaran.pengirimanId,
      jenisMuatan: pengiriman.jenisMuatan,
      pelangganNama: pelanggan.nama,
      jumlah: pembayaran.jumlah,
      metode: pembayaran.metode,
      status: pembayaran.status,
      tanggal: pembayaran.tanggal,
    })
    .from(pembayaran)
    .leftJoin(pengiriman, eq(pembayaran.pengirimanId, pengiriman.id))
    .leftJoin(pelanggan, eq(pengiriman.pelangganId, pelanggan.id))
    .orderBy(desc(pembayaran.id))
}

type PembayaranInput = {
  pengirimanId?: number | null
  jumlah: number
  metode: string
  status: string
  tanggal: string
}

export async function createPembayaran(data: PembayaranInput) {
  await db.insert(pembayaran).values({
    pengirimanId: data.pengirimanId || null,
    jumlah: String(data.jumlah),
    metode: data.metode,
    status: data.status,
    tanggal: data.tanggal,
  })
  revalidatePath("/pembayaran")
}

export async function updatePembayaran(id: number, data: PembayaranInput) {
  await db
    .update(pembayaran)
    .set({
      pengirimanId: data.pengirimanId || null,
      jumlah: String(data.jumlah),
      metode: data.metode,
      status: data.status,
      tanggal: data.tanggal,
    })
    .where(eq(pembayaran.id, id))
  revalidatePath("/pembayaran")
}

export async function deletePembayaran(id: number) {
  await db.delete(pembayaran).where(eq(pembayaran.id, id))
  revalidatePath("/pembayaran")
}
