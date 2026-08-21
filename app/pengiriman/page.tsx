import { AppShell } from "@/components/app-shell"
import { PengirimanClient } from "@/components/pengiriman/pengiriman-client"
import { getPengiriman } from "@/app/actions/pengiriman"
import { getPelanggan } from "@/app/actions/pelanggan"
import { getRute } from "@/app/actions/rute"
import { getKapal } from "@/app/actions/kapal"

export const dynamic = "force-dynamic"

export default async function PengirimanPage() {
  const [data, pelanggan, rute, kapal] = await Promise.all([
    getPengiriman(),
    getPelanggan(),
    getRute(),
    getKapal(),
  ])
  return (
    <AppShell>
      <PengirimanClient data={data} pelanggan={pelanggan} rute={rute} kapal={kapal} />
    </AppShell>
  )
}
