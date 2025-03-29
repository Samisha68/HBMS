"use client"

import type { User } from "next-auth"
import { signOut } from "next-auth/react"
import Link from "next/link"
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
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between bg-white dark:bg-gray-800 shadow-md px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <BedDouble className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-semibold md:text-xl">Hospital Bed Management</h1>
        </div>

        <nav className="hidden md:flex md:items-center md:gap-6">
          {[
            { href: "/", label: "Dashboard" },
            { href: "/beds", label: "Beds" },
            { href: "/auth/register", label: "Book Now!" }
          ].map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user?.image || undefined} alt={user?.name || "User"} />
            <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
          </Avatar>
          <div className="hidden md:block text-right">
            <div className="text-sm font-medium">{user?.name}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => signOut()}>
            <LogOut className="h-5 w-5 text-red-500" />
            <span className="sr-only">Log out</span>
          </Button>
        </div>
      </header>

      <main className="flex-1 space-y-6 p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Total Beds", value: data.totalBeds, occupied: data.occupiedBeds, available: data.availableBeds },
            { title: "ICU Beds", value: data.icuBeds.total, occupied: data.icuBeds.occupied },
            { title: "General Beds", value: data.generalBeds.total, occupied: data.generalBeds.occupied },
            { title: "Pediatric Beds", value: data.pediatricBeds.total, occupied: data.pediatricBeds.occupied }
          ].map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <BedDouble className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.occupied}/{stat.value}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {Math.round((stat.occupied / stat.value) * 100 || 0)}% occupancy rate
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-lg">
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
                {data.recentAdmissions.length > 0 ? (
                  data.recentAdmissions.map((admission) => (
                    <TableRow key={admission.id} className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <TableCell className="font-medium">{admission.id}</TableCell>
                      <TableCell>{admission.name}</TableCell>
                      <TableCell>{admission.bedId}</TableCell>
                      <TableCell>{admission.department}</TableCell>
                      <TableCell>{admission.admissionDate}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-gray-500 dark:text-gray-400">
                      No recent admissions
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
