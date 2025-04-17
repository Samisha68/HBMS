"use client"

import { useState, useEffect } from "react"
import { BedIcon, X, Check, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Logo } from "@/components/ui/logo"

interface Patient {
  name: string;
  age: string;
  contact: string;
  reason: string;
}

type BedStatus = "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";

interface Bed {
  id: string;
  number: string;
  status: BedStatus;
  ward: {
    id: string;
    name: string;
  };
  patient?: Patient;
}

interface Ward {
  id: string;
  name: string;
  beds: Bed[];
}

export default function BedsPage() {
  const [mounted, setMounted] = useState(false)
  const [wards, setWards] = useState<Ward[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("all")
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [patientData, setPatientData] = useState<Patient>({
    name: '',
    age: '',
    contact: '',
    reason: ''
  })
  const { toast } = useToast()

  const fetchBeds = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/beds')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setWards(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch bed data'
      setError(errorMessage)
      console.error('Error fetching beds:', err)
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
    setMounted(true)
    fetchBeds()
    // Poll every 10 seconds
    const interval = setInterval(fetchBeds, 10000)
    return () => clearInterval(interval)
  }, [])

  const handleBookBed = async () => {
    if (!selectedBed) return

    try {
      setIsLoading(true)
      // Validate all required fields
      if (!patientData.name || !patientData.age || !patientData.contact || !patientData.reason) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        })
        return
      }

      const response = await fetch('/api/beds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bedId: selectedBed.id,
          wardId: selectedBed.ward.id,
          patientData
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to book bed')
      }

      setWards(data)
      setIsBookingOpen(false)
      setSelectedBed(null)
      setPatientData({ name: '', age: '', contact: '', reason: '' })

      toast({
        title: "Success",
        description: "Bed booked successfully",
      })
    } catch (err) {
      console.error('Error booking bed:', err)
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to book bed. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate stats for all beds
  const allBeds = wards.flatMap(ward => ward.beds)
  const availableBeds = allBeds.filter(bed => bed.status === "AVAILABLE").length
  const occupiedBeds = allBeds.filter(bed => bed.status === "OCCUPIED").length

  const getBedStatusColor = (status: BedStatus) => {
    switch (status) {
      case "AVAILABLE":
        return "hover:bg-green-100 border-green-200"
      case "OCCUPIED":
        return "bg-red-50 border-red-200"
      case "MAINTENANCE":
        return "bg-amber-50 border-amber-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  if (!mounted) {
    return null
  }

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading beds...</span>
      </div>
    )
  }

  if (error && wards.length === 0) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center">
        <X className="h-8 w-8 text-red-500" />
        <h2 className="mt-2 text-xl font-semibold">Failed to load beds</h2>
        <p className="text-muted-foreground">{error}</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex flex-col items-center text-center">
        <Logo size="large" className="mb-4" />
        <h1 className="text-3xl font-bold tracking-tight">Welcome to SwiftBed</h1>
        <p className="mt-2 text-muted-foreground">
          Streamlining Hospital Bed Management - Your comprehensive solution for efficient bed utilization
        </p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Beds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allBeds.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{availableBeds}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Occupied</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{occupiedBeds}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 grid w-full grid-cols-4">
          <TabsTrigger value="all">All Wards</TabsTrigger>
          {wards.map((ward) => (
            <TabsTrigger key={ward.id} value={ward.id}>
              {ward.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="all">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {wards.map((ward) => (
              <Card key={ward.id}>
                <CardHeader>
                  <CardTitle>{ward.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    {ward.beds.map((bed) => (
                      <div
                        key={bed.id}
                        className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors ${getBedStatusColor(bed.status)}`}
                        onClick={() => {
                          if (bed.status === "AVAILABLE") {
                            setSelectedBed(bed)
                            setIsBookingOpen(true)
                          }
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <BedIcon className="h-4 w-4" />
                          <span>Bed {bed.number}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {bed.status === "AVAILABLE" && <Check className="h-4 w-4" />}
                          {bed.status === "OCCUPIED" && (
                            <span className="text-sm">
                              {bed.patient?.name}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {wards.map((ward) => (
          <TabsContent key={ward.id} value={ward.id}>
            <Card>
              <CardHeader>
                <CardTitle>{ward.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {ward.beds.map((bed) => (
                    <div
                      key={bed.id}
                      className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors ${getBedStatusColor(bed.status)}`}
                      onClick={() => {
                        if (bed.status === "AVAILABLE") {
                          setSelectedBed(bed)
                          setIsBookingOpen(true)
                        }
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <BedIcon className="h-4 w-4" />
                        <span>Bed {bed.number}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {bed.status === "AVAILABLE" && <Check className="h-4 w-4" />}
                        {bed.status === "OCCUPIED" && (
                          <span className="text-sm">
                            {bed.patient?.name}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book Bed {selectedBed?.number}</DialogTitle>
            <DialogDescription>
              Enter patient details to book this bed. All fields are required.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Patient Name</Label>
              <Input
                id="name"
                value={patientData.name}
                onChange={(e) => setPatientData({ ...patientData, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                value={patientData.age}
                onChange={(e) => setPatientData({ ...patientData, age: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact">Contact Number</Label>
              <Input
                id="contact"
                value={patientData.contact}
                onChange={(e) => setPatientData({ ...patientData, contact: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reason">Medical Reason</Label>
              <Input
                id="reason"
                value={patientData.reason}
                onChange={(e) => setPatientData({ ...patientData, reason: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsBookingOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBookBed}>
              Book Bed
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
