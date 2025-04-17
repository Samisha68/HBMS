"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface BedMetrics {
  total: number;
  available: number;
  occupied: number;
  maintenance: number;
  occupancyRate: string;
  wardMetrics: {
    name: string;
    total: number;
    available: number;
    occupied: number;
  }[];
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<BedMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchBedMetrics = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/metrics')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setMetrics(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch metrics'
      setError(errorMessage)
      console.error('Error fetching metrics:', err)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBedMetrics()
    // Poll every 30 seconds
    const interval = setInterval(fetchBedMetrics, 30000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading metrics...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center">
        <h2 className="text-xl font-semibold text-red-500">Failed to load metrics</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }

  if (!metrics) return null

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-8 text-3xl font-bold">Hospital Bed Dashboard</h1>
      
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Beds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.available}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Occupied</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.occupied}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{metrics.occupancyRate}%</div>
          </CardContent>
        </Card>
      </div>

      <h2 className="mb-4 text-2xl font-semibold">Ward Statistics</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {metrics.wardMetrics.map((ward) => (
          <Card key={ward.name}>
            <CardHeader>
              <CardTitle>{ward.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Beds:</span>
                  <span className="font-medium">{ward.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Available:</span>
                  <span className="font-medium text-green-600">{ward.available}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Occupied:</span>
                  <span className="font-medium text-red-600">{ward.occupied}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Occupancy Rate:</span>
                  <span className="font-medium text-blue-600">
                    {((ward.occupied / ward.total) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 