import { AppShell } from "@/components/app-shell"
import { DashboardClient } from "@/components/dashboard/dashboard-client"
import { getRingkasan, getPendapatanBulanan, getStatusPengiriman } from "@/app/actions/laporan"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const [ringkasan, bulanan, status] = await Promise.all([
    getRingkasan(),
    getPendapatanBulanan(),
    getStatusPengiriman(),
  ])

  return (
    <AppShell>
      <DashboardClient
        initialRingkasan={ringkasan}
        initialBulanan={bulanan}
        initialStatus={status}
      />
    </AppShell>
  )
}
