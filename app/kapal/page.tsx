import { AppShell } from "@/components/app-shell"
import { KapalClient } from "@/components/kapal/kapal-client"
import { getKapal } from "@/app/actions/kapal"

export const dynamic = "force-dynamic"

export default async function KapalPage() {
  const data = await getKapal()
  return (
    <AppShell>
      <KapalClient data={data} />
    </AppShell>
  )
}
