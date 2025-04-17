"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BedIcon, Users, Clock, AlertTriangle, TrendingUp, Activity, BedDouble, CalendarClock } from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/ui/logo"

interface DashboardMetrics {
  totalBeds: number
  occupiedBeds: number
  availableBeds: number
  maintenanceBeds: number
  averageStayDuration: string
  turnoverRate: string
  waitingList: number
  occupancyRate: string
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalBeds: 120,
    occupiedBeds: 0,
    availableBeds: 120,
    maintenanceBeds: 0,
    averageStayDuration: "0 days",
    turnoverRate: "0%",
    waitingList: 0,
    occupancyRate: "0%"
  })

  const fetchBedMetrics = async () => {
    try {
      const response = await fetch('/api/metrics')
      if (!response.ok) {
        throw new Error('Failed to fetch metrics')
      }
      const data = await response.json()
      
      // Calculate metrics based on actual bed data
      const totalBeds = data.beds.length
      const occupiedBeds = data.beds.filter((bed: any) => bed.status === 'occupied').length
      const maintenanceBeds = data.beds.filter((bed: any) => bed.status === 'maintenance').length
      const availableBeds = totalBeds - occupiedBeds - maintenanceBeds
      const occupancyRate = totalBeds > 0 ? `${Math.round((occupiedBeds / totalBeds) * 100)}%` : "0%"
      
      setMetrics({
        totalBeds,
        occupiedBeds,
        availableBeds,
        maintenanceBeds,
        averageStayDuration: data.averageStayDuration || "0 days",
        turnoverRate: data.turnoverRate || "0%",
        waitingList: data.waitingList || 0,
        occupancyRate
      })
    } catch (error) {
      console.error('Error fetching metrics:', error)
    }
  }

  useEffect(() => {
    fetchBedMetrics()
    // Set up an interval to refresh metrics every minute
    const intervalId = setInterval(fetchBedMetrics, 60000)
    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col items-center space-y-4 text-center">
        <Logo size="large" className="mb-2" />
        <h1 className="text-4xl font-bold tracking-tight">Welcome to SwiftBed</h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Streamlining Hospital Bed Utilization - Your comprehensive bed management solution
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Beds</CardTitle>
            <BedDouble className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalBeds}</div>
            <p className="text-xs text-muted-foreground">
              Across all departments
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.occupancyRate}</div>
            <p className="text-xs text-muted-foreground">
              Current utilization
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Stay</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.averageStayDuration}</div>
            <p className="text-xs text-muted-foreground">
              Per patient
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waiting List</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.waitingList}</div>
            <p className="text-xs text-muted-foreground">
              Patients waiting
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Bed Status Overview</CardTitle>
            <CardDescription>
              Current bed allocation across departments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-full bg-secondary rounded-lg h-4 overflow-hidden flex">
                  <div 
                    className="bg-green-500 h-full" 
                    style={{ width: `${(metrics.availableBeds / metrics.totalBeds) * 100}%` }}
                  />
                  <div 
                    className="bg-red-500 h-full" 
                    style={{ width: `${(metrics.occupiedBeds / metrics.totalBeds) * 100}%` }}
                  />
                  <div 
                    className="bg-yellow-500 h-full" 
                    style={{ width: `${(metrics.maintenanceBeds / metrics.totalBeds) * 100}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span>Available ({metrics.availableBeds})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span>Occupied ({metrics.occupiedBeds})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span>Maintenance ({metrics.maintenanceBeds})</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Link 
                href="/beds" 
                className="flex flex-col items-center justify-center p-4 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
              >
                <BedIcon className="h-6 w-6 mb-2 text-primary" />
                <span className="text-sm font-medium">Manage Beds</span>
              </Link>
              <button 
                className="flex flex-col items-center justify-center p-4 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
                onClick={() => alert("Feature coming soon!")}
              >
                <Activity className="h-6 w-6 mb-2 text-primary" />
                <span className="text-sm font-medium">View Analytics</span>
              </button>
              <button 
                className="flex flex-col items-center justify-center p-4 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
                onClick={() => alert("Feature coming soon!")}
              >
                <CalendarClock className="h-6 w-6 mb-2 text-primary" />
                <span className="text-sm font-medium">Schedule</span>
              </button>
              <button 
                className="flex flex-col items-center justify-center p-4 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
                onClick={() => alert("Feature coming soon!")}
              >
                <AlertTriangle className="h-6 w-6 mb-2 text-primary" />
                <span className="text-sm font-medium">Report Issue</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}