"use server"

import { db } from "@/lib/db"
import { pengiriman, pembayaran, kapal, pelanggan } from "@/lib/db/schema"
import { and, gte, lte, sql } from "drizzle-orm"

export type Ringkasan = {
  totalPengiriman: number
  totalPendapatan: number
  totalDiterima: number
  totalPelanggan: number
  totalKapal: number
  totalBerat: number
}

export async function getRingkasan(dari?: string, sampai?: string): Promise<Ringkasan> {
  const filters = []
  if (dari) filters.push(gte(pengiriman.tanggal, dari))
  if (sampai) filters.push(lte(pengiriman.tanggal, sampai))
  const where = filters.length ? and(...filters) : undefined

  const [kirim] = await db
    .select({
      jumlah: sql<number>`count(*)::int`,
      pendapatan: sql<number>`coalesce(sum(${pengiriman.tarif}), 0)::float`,
      berat: sql<number>`coalesce(sum(${pengiriman.berat}), 0)::float`,
    })
    .from(pengiriman)
    .where(where)

  const bayarFilters = []
  if (dari) bayarFilters.push(gte(pembayaran.tanggal, dari))
  if (sampai) bayarFilters.push(lte(pembayaran.tanggal, sampai))
  const [bayar] = await db
    .select({
      diterima: sql<number>`coalesce(sum(${pembayaran.jumlah}), 0)::float`,
    })
    .from(pembayaran)
    .where(bayarFilters.length ? and(...bayarFilters) : undefined)

  const [pel] = await db.select({ n: sql<number>`count(*)::int` }).from(pelanggan)
  const [kp] = await db.select({ n: sql<number>`count(*)::int` }).from(kapal)

  return {
    totalPengiriman: kirim?.jumlah ?? 0,
    totalPendapatan: kirim?.pendapatan ?? 0,
    totalDiterima: bayar?.diterima ?? 0,
    totalPelanggan: pel?.n ?? 0,
    totalKapal: kp?.n ?? 0,
    totalBerat: kirim?.berat ?? 0,
  }
}

export type TitikBulan = { bulan: string; pendapatan: number; jumlah: number }

export async function getPendapatanBulanan(dari?: string, sampai?: string): Promise<TitikBulan[]> {
  const filters = []
  if (dari) filters.push(gte(pengiriman.tanggal, dari))
  if (sampai) filters.push(lte(pengiriman.tanggal, sampai))
  const where = filters.length ? and(...filters) : undefined

  const rows = await db
    .select({
      bulan: sql<string>`to_char(${pengiriman.tanggal}, 'YYYY-MM')`,
      pendapatan: sql<number>`coalesce(sum(${pengiriman.tarif}), 0)::float`,
      jumlah: sql<number>`count(*)::int`,
    })
    .from(pengiriman)
    .where(where)
    .groupBy(sql`to_char(${pengiriman.tanggal}, 'YYYY-MM')`)
    .orderBy(sql`to_char(${pengiriman.tanggal}, 'YYYY-MM')`)

  return rows
}

export type StatusRute = { status: string; jumlah: number }

export async function getStatusPengiriman(dari?: string, sampai?: string): Promise<StatusRute[]> {
  const filters = []
  if (dari) filters.push(gte(pengiriman.tanggal, dari))
  if (sampai) filters.push(lte(pengiriman.tanggal, sampai))
  const where = filters.length ? and(...filters) : undefined

  return db
    .select({
      status: pengiriman.status,
      jumlah: sql<number>`count(*)::int`,
    })
    .from(pengiriman)
    .where(where)
    .groupBy(pengiriman.status)
}
