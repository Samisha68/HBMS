"use client"

import type { User } from "next-auth"
import { signOut } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/ components/ui/card"
import { Button } from "@/app/ components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/ components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/ components/ui/table"
import { BedDouble, LogOut, Menu, Users } from "lucide-react"

interface DashboardContentProps {
  data: {
    totalBeds: number
    occupiedBeds: number
    availableBeds: number
    icuBeds: {
      total: number
      occupied: number
    }
    generalBeds: {
      total: number
      occupied: number
    }
    pediatricBeds: {
      total: number
      occupied: number
    }
    recentAdmissions: {
      id: string
      name: string
      bedId: string
      department: string
      admissionDate: string
    }[]
  }
  user: User
}

export default function DashboardContent({ data, user }: DashboardContentProps) {
  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        <div className="flex items-center gap-2">
          <BedDouble className="h-6 w-6" />
          <h1 className="text-lg font-semibold md:text-xl">Hospital Bed Management</h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Avatar>
            <AvatarImage src={user?.image || undefined} alt={user?.name || "User"} />
            <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <div className="text-sm font-medium">{user?.name}</div>
            <div className="text-xs text-muted-foreground">{user?.email}</div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => signOut()}>
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Log out</span>
          </Button>
        </div>
      </header>
      <main className="flex-1 space-y-4 p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Beds</CardTitle>
              <BedDouble className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalBeds}</div>
              <p className="text-xs text-muted-foreground">
                {data.occupiedBeds} occupied, {data.availableBeds} available
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">ICU Beds</CardTitle>
              <BedDouble className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.icuBeds.occupied}/{data.icuBeds.total}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round((data.icuBeds.occupied / data.icuBeds.total) * 100)}% occupancy rate
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">General Beds</CardTitle>
              <BedDouble className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.generalBeds.occupied}/{data.generalBeds.total}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round((data.generalBeds.occupied / data.generalBeds.total) * 100)}% occupancy rate
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Pediatric Beds</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.pediatricBeds.occupied}/{data.pediatricBeds.total}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round((data.pediatricBeds.occupied / data.pediatricBeds.total) * 100)}% occupancy rate
              </p>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Recent Admissions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Bed ID</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Admission Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentAdmissions.map((admission) => (
                  <TableRow key={admission.id}>
                    <TableCell className="font-medium">{admission.id}</TableCell>
                    <TableCell>{admission.name}</TableCell>
                    <TableCell>{admission.bedId}</TableCell>
                    <TableCell>{admission.department}</TableCell>
                    <TableCell>{admission.admissionDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

