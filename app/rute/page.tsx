import { AppShell } from "@/components/app-shell"
import { RuteClient } from "@/components/rute/rute-client"
import { getRute } from "@/app/actions/rute"
import { getKapal } from "@/app/actions/kapal"

export const dynamic = "force-dynamic"

export default async function RutePage() {
  const [data, kapal] = await Promise.all([getRute(), getKapal()])
  const kapalList = kapal.map((k) => ({ id: k.id, nama: k.nama }))
  return (
    <AppShell>
      <RuteClient data={data} kapalList={kapalList} />
    </AppShell>
  )
}
