"use server"

import { db } from "@/lib/db"
import { pelanggan } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function getPelanggan() {
  return db.select().from(pelanggan).orderBy(desc(pelanggan.id))
}

export async function createPelanggan(data: { nama: string; telepon?: string; alamat?: string }) {
  await db.insert(pelanggan).values({
    nama: data.nama,
    telepon: data.telepon || null,
    alamat: data.alamat || null,
  })
  revalidatePath("/pelanggan")
}

export async function updatePelanggan(
  id: number,
  data: { nama: string; telepon?: string; alamat?: string },
) {
  await db
    .update(pelanggan)
    .set({
      nama: data.nama,
      telepon: data.telepon || null,
      alamat: data.alamat || null,
    })
    .where(eq(pelanggan.id, id))
  revalidatePath("/pelanggan")
}

export async function deletePelanggan(id: number) {
  await db.delete(pelanggan).where(eq(pelanggan.id, id))
  revalidatePath("/pelanggan")
}
