'use client'
import { withAuth } from '@/components/withAuth'

function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <h1>Dashboard</h1>
    </div>
  )
}

export default withAuth(DashboardPage)
