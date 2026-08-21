"use server"

import { db } from "@/lib/db"
import { pengiriman, pelanggan, kapal, rute } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function getPengiriman() {
  return db
    .select({
      id: pengiriman.id,
      pelangganId: pengiriman.pelangganId,
      pelangganNama: pelanggan.nama,
      ruteId: pengiriman.ruteId,
      pelabuhanAsal: rute.pelabuhanAsal,
      pelabuhanTujuan: rute.pelabuhanTujuan,
      kapalId: pengiriman.kapalId,
      kapalNama: kapal.nama,
      jenisMuatan: pengiriman.jenisMuatan,
      berat: pengiriman.berat,
      tarif: pengiriman.tarif,
      status: pengiriman.status,
      tanggal: pengiriman.tanggal,
    })
    .from(pengiriman)
    .leftJoin(pelanggan, eq(pengiriman.pelangganId, pelanggan.id))
    .leftJoin(kapal, eq(pengiriman.kapalId, kapal.id))
    .leftJoin(rute, eq(pengiriman.ruteId, rute.id))
    .orderBy(desc(pengiriman.id))
}

type PengirimanInput = {
  pelangganId?: number | null
  ruteId?: number | null
  kapalId?: number | null
  jenisMuatan: string
  berat: number
  tarif: number
  status: string
  tanggal: string
}

export async function createPengiriman(data: PengirimanInput) {
  await db.insert(pengiriman).values({
    pelangganId: data.pelangganId || null,
    ruteId: data.ruteId || null,
    kapalId: data.kapalId || null,
    jenisMuatan: data.jenisMuatan,
    berat: String(data.berat),
    tarif: String(data.tarif),
    status: data.status,
    tanggal: data.tanggal,
  })
  revalidatePath("/pengiriman")
}

export async function updatePengiriman(id: number, data: PengirimanInput) {
  await db
    .update(pengiriman)
    .set({
      pelangganId: data.pelangganId || null,
      ruteId: data.ruteId || null,
      kapalId: data.kapalId || null,
      jenisMuatan: data.jenisMuatan,
      berat: String(data.berat),
      tarif: String(data.tarif),
      status: data.status,
      tanggal: data.tanggal,
    })
    .where(eq(pengiriman.id, id))
  revalidatePath("/pengiriman")
}

export async function deletePengiriman(id: number) {
  await db.delete(pengiriman).where(eq(pengiriman.id, id))
  revalidatePath("/pengiriman")
}
