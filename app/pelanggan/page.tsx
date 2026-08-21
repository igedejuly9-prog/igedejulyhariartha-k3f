import { AppShell } from "@/components/app-shell"
import { PelangganClient } from "@/components/pelanggan/pelanggan-client"
import { getPelanggan } from "@/app/actions/pelanggan"

export const dynamic = "force-dynamic"

export default async function PelangganPage() {
  const data = await getPelanggan()
  return (
    <AppShell>
      <PelangganClient data={data} />
    </AppShell>
  )
}
