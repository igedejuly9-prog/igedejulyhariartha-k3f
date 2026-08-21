import { pgTable, serial, text, numeric, integer, date, timestamp } from "drizzle-orm/pg-core"

export const pelanggan = pgTable("pelanggan", {
  id: serial("id").primaryKey(),
  nama: text("nama").notNull(),
  telepon: text("telepon"),
  alamat: text("alamat"),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
})

export const kapal = pgTable("kapal", {
  id: serial("id").primaryKey(),
  nama: text("nama").notNull(),
  kapasitas: numeric("kapasitas").notNull().default("0"),
  status: text("status").notNull().default("aktif"),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
})

export const rute = pgTable("rute", {
  id: serial("id").primaryKey(),
  pelabuhanAsal: text("pelabuhanAsal").notNull(),
  pelabuhanTujuan: text("pelabuhanTujuan").notNull(),
  kapalId: integer("kapalId"),
  tanggalBerangkat: date("tanggalBerangkat"),
  tanggalTiba: date("tanggalTiba"),
  status: text("status").notNull().default("dijadwalkan"),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
})

export const pengiriman = pgTable("pengiriman", {
  id: serial("id").primaryKey(),
  pelangganId: integer("pelangganId"),
  ruteId: integer("ruteId"),
  kapalId: integer("kapalId"),
  jenisMuatan: text("jenisMuatan").notNull(),
  berat: numeric("berat").notNull().default("0"),
  tarif: numeric("tarif").notNull().default("0"),
  status: text("status").notNull().default("menunggu"),
  tanggal: date("tanggal").notNull().defaultNow(),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
})

export const pembayaran = pgTable("pembayaran", {
  id: serial("id").primaryKey(),
  pengirimanId: integer("pengirimanId"),
  jumlah: numeric("jumlah").notNull().default("0"),
  metode: text("metode").notNull().default("transfer"),
  status: text("status").notNull().default("belum"),
  tanggal: date("tanggal").notNull().defaultNow(),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
})
