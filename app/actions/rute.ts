"use server"

import { db } from "@/lib/db"
import { rute, kapal } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function getRute() {
  return db
    .select({
      id: rute.id,
      pelabuhanAsal: rute.pelabuhanAsal,
      pelabuhanTujuan: rute.pelabuhanTujuan,
      kapalId: rute.kapalId,
      kapalNama: kapal.nama,
      tanggalBerangkat: rute.tanggalBerangkat,
      tanggalTiba: rute.tanggalTiba,
      status: rute.status,
    })
    .from(rute)
    .leftJoin(kapal, eq(rute.kapalId, kapal.id))
    .orderBy(desc(rute.id))
}

type RuteInput = {
  pelabuhanAsal: string
  pelabuhanTujuan: string
  kapalId?: number | null
  tanggalBerangkat?: string | null
  tanggalTiba?: string | null
  status: string
}

export async function createRute(data: RuteInput) {
  await db.insert(rute).values({
    pelabuhanAsal: data.pelabuhanAsal,
    pelabuhanTujuan: data.pelabuhanTujuan,
    kapalId: data.kapalId || null,
    tanggalBerangkat: data.tanggalBerangkat || null,
    tanggalTiba: data.tanggalTiba || null,
    status: data.status,
  })
  revalidatePath("/rute")
}

export async function updateRute(id: number, data: RuteInput) {
  await db
    .update(rute)
    .set({
      pelabuhanAsal: data.pelabuhanAsal,
      pelabuhanTujuan: data.pelabuhanTujuan,
      kapalId: data.kapalId || null,
      tanggalBerangkat: data.tanggalBerangkat || null,
      tanggalTiba: data.tanggalTiba || null,
      status: data.status,
    })
    .where(eq(rute.id, id))
  revalidatePath("/rute")
}

export async function deleteRute(id: number) {
  await db.delete(rute).where(eq(rute.id, id))
  revalidatePath("/rute")
}
