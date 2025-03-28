import { redirect } from 'next/navigation'
import DashboardContent from '@/app/ components/dashboard-content'
import { getCurrentUser } from '@/app/lib/auth'

export default async function DashboardPage() {
  // Get the current authenticated user
  const user = await getCurrentUser()
  
  // If not authenticated, redirect to sign in page
  if (!user) {
    redirect('/auth/signin')
  }
  
  return <DashboardContent user={user} data={{
    totalBeds: 0,
    occupiedBeds: 0,
    availableBeds: 0,
    icuBeds: {
      total: 0,
      occupied: 0
    },
    generalBeds: {
      total: 0,
      occupied: 0
    },
    pediatricBeds: {
      total: 0,
      occupied: 0
    },
    recentAdmissions: []
  }} />
}