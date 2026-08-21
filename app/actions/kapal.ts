"use server"

import { db } from "@/lib/db"
import { kapal } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function getKapal() {
  return db.select().from(kapal).orderBy(desc(kapal.id))
}

export async function createKapal(data: { nama: string; kapasitas: number; status: string }) {
  await db.insert(kapal).values({
    nama: data.nama,
    kapasitas: String(data.kapasitas),
    status: data.status,
  })
  revalidatePath("/kapal")
}

export async function updateKapal(
  id: number,
  data: { nama: string; kapasitas: number; status: string },
) {
  await db
    .update(kapal)
    .set({ nama: data.nama, kapasitas: String(data.kapasitas), status: data.status })
    .where(eq(kapal.id, id))
  revalidatePath("/kapal")
}

export async function deleteKapal(id: number) {
  await db.delete(kapal).where(eq(kapal.id, id))
  revalidatePath("/kapal")
}
