"use client"

import { useState, useEffect } from "react"
import { BedIcon, X, Check, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/ components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/ components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/app/ components/ui/dialog"
import { Button } from "@/app/ components/ui/button"
import { Input } from "@/app/ components/ui/input"
import { Label } from "@/app/ components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/ components/ui/select"

type Bed = {
  id: string
  bedNumber: string
  status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE"
  ward: {
    id: string
    name: string
  }
  patient?: {
    id: string
    firstName: string
    lastName: string
    medicalRecordNumber: string
  } | null
}

type Ward = {
  id: string
  name: string
  beds: Bed[]
}

export default function BedsPage() {
  const [wards, setWards] = useState<Ward[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<string>("all")
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null)
  const [bookingDialog, setBookingDialog] = useState(false)
  const [patientData, setPatientData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "MALE",
    phoneNumber: "",
    medicalRecordNumber: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Fetch beds data
  useEffect(() => {
    const fetchBeds = async () => {
      try {
        // In a real app, replace with actual API call
        // const response = await fetch('/api/beds?hospitalId=hospital_1')
        // const data = await response.json()
        
        // Mock data for demonstration
        const mockWards = [
          {
            id: "ward_1",
            name: "General Ward",
            beds: Array.from({ length: 12 }, (_, i) => ({
              id: `gen_${i+1}`,
              bedNumber: `G${i+1}`,
              status: i < 7 ? "AVAILABLE" : i < 10 ? "OCCUPIED" : "MAINTENANCE",
              ward: { id: "ward_1", name: "General Ward" },
              patient: i < 7 ? null : {
                id: `patient_${i}`,
                firstName: "Patient",
                lastName: `${i+1}`,
                medicalRecordNumber: `MRN${1000+i}`
              }
            } as Bed))
          },
          {
            id: "ward_2",
            name: "ICU",
            beds: Array.from({ length: 6 }, (_, i) => ({
              id: `icu_${i+1}`,
              bedNumber: `ICU${i+1}`,
              status: i < 2 ? "AVAILABLE" : "OCCUPIED",
              ward: { id: "ward_2", name: "ICU" },
              patient: i < 2 ? null : {
                id: `patient_icu_${i}`,
                firstName: "Critical",
                lastName: `Patient ${i+1}`,
                medicalRecordNumber: `MRN${2000+i}`
              }
            } as Bed))
          },
          {
            id: "ward_3",
            name: "Pediatric Ward",
            beds: Array.from({ length: 8 }, (_, i) => ({
              id: `ped_${i+1}`,
              bedNumber: `P${i+1}`,
              status: i < 4 ? "AVAILABLE" : i < 7 ? "OCCUPIED" : "MAINTENANCE",
              ward: { id: "ward_3", name: "Pediatric Ward" },
              patient: i < 4 ? null : {
                id: `patient_ped_${i}`,
                firstName: "Child",
                lastName: `${i+1}`,
                medicalRecordNumber: `MRN${3000+i}`
              }
            } as Bed))
          }
        ];
        
        setWards(mockWards);
        setActiveTab(mockWards[0].id);
      } catch (error) {
        console.error("Error fetching beds:", error);
        setError("Failed to load beds data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBeds();
  }, []);

  const handleBedClick = (bed: Bed) => {
    setSelectedBed(bed);
    if (bed.status === "AVAILABLE") {
      // Show booking dialog for available beds
      setBookingDialog(true);
    } else if (bed.status === "OCCUPIED") {
      // Show bed details for occupied beds
      // Could add discharge functionality here
    }
  };

  const handleBookBed = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBed) return;
    
    setIsSubmitting(true);
    setError("");
    
    try {
      // In a real app, this would be an API call
      // await fetch('/api/admit-patient', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     ...patientData,
      //     bedId: selectedBed.id,
      //     hospitalId: 'hospital_1'
      //   })
      // });
      
      // Simulate successful booking
      setTimeout(() => {
        // Update local state to reflect the change
        setWards(prevWards => 
          prevWards.map(ward => ({
            ...ward,
            beds: ward.beds.map(bed => 
              bed.id === selectedBed.id 
                ? { 
                    ...bed, 
                    status: "OCCUPIED" as const,
                    patient: {
                      id: `new_patient_${Date.now()}`,
                      firstName: patientData.firstName,
                      lastName: patientData.lastName,
                      medicalRecordNumber: patientData.medicalRecordNumber
                    }
                  } 
                : bed
            )
          }))
        );
        
        // Close dialog and reset form
        setBookingDialog(false);
        setSelectedBed(null);
        setPatientData({
          firstName: "",
          lastName: "",
          dateOfBirth: "",
          gender: "MALE",
          phoneNumber: "",
          medicalRecordNumber: ""
        });
        setIsSubmitting(false);
      }, 1000);
      
    } catch (error) {
      console.error("Error booking bed:", error);
      setError("Failed to book bed. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Calculate stats for all beds
  const allBeds = wards.flatMap(ward => ward.beds);
  const availableBeds = allBeds.filter(bed => bed.status === "AVAILABLE").length;
  const occupiedBeds = allBeds.filter(bed => bed.status === "OCCUPIED").length;
  const maintenanceBeds = allBeds.filter(bed => bed.status === "MAINTENANCE").length;

  const getBedStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-100 border-green-500 text-green-700 hover:bg-green-200";
      case "OCCUPIED":
        return "bg-red-100 border-red-500 text-red-700 hover:bg-red-200";
      case "MAINTENANCE":
        return "bg-amber-100 border-amber-500 text-amber-700 hover:bg-amber-200";
      default:
        return "bg-gray-100";
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading beds...</span>
      </div>
    );
  }

  if (error && wards.length === 0) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <X className="h-8 w-8 text-red-500" />
        <h2 className="mt-2 text-xl font-semibold">Failed to load beds</h2>
        <p className="text-muted-foreground">{error}</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold">Bed Management</h1>
      
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
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{maintenanceBeds}</div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mx-auto max-w-5xl">
        <CardHeader>
          <CardTitle>Bed Status by Ward</CardTitle>
          <CardDescription>
            Click on an available bed to admit a patient. Green beds are available, red beds are occupied.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              {wards.map(ward => (
                <TabsTrigger key={ward.id} value={ward.id}>
                  {ward.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {wards.map(ward => (
              <TabsContent key={ward.id} value={ward.id} className="mt-0">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {ward.beds.map(bed => (
                    <div
                      key={bed.id}
                      className={`flex cursor-pointer flex-col items-center rounded-lg border-2 p-4 transition-colors ${getBedStatusColor(bed.status)}`}
                      onClick={() => handleBedClick(bed)}
                    >
                      <BedIcon className="mb-2 h-8 w-8" />
                      <span className="font-medium">{bed.bedNumber}</span>
                      <span className="mt-1 text-xs">
                        {bed.status === "AVAILABLE" ? "Available" : 
                         bed.status === "OCCUPIED" ? "Occupied" : "Maintenance"}
                      </span>
                      {bed.patient && (
                        <span className="mt-1 text-xs truncate max-w-full">
                          {bed.patient.firstName} {bed.patient.lastName}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Booking Dialog */}
      <Dialog open={bookingDialog} onOpenChange={setBookingDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Admit Patient to Bed {selectedBed?.bedNumber}</DialogTitle>
            <DialogDescription>
              Enter the patient details to assign them to this bed.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleBookBed}>
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    value={patientData.firstName}
                    onChange={(e) => setPatientData({...patientData, firstName: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    value={patientData.lastName}
                    onChange={(e) => setPatientData({...patientData, lastName: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="medicalRecordNumber">Medical Record Number</Label>
                <Input 
                  id="medicalRecordNumber" 
                  value={patientData.medicalRecordNumber}
                  onChange={(e) => setPatientData({...patientData, medicalRecordNumber: e.target.value})}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input 
                    id="dateOfBirth" 
                    type="date" 
                    value={patientData.dateOfBirth}
                    onChange={(e) => setPatientData({...patientData, dateOfBirth: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select 
                    value={patientData.gender} 
                    onValueChange={(value) => setPatientData({...patientData, gender: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input 
                  id="phoneNumber" 
                  value={patientData.phoneNumber}
                  onChange={(e) => setPatientData({...patientData, phoneNumber: e.target.value})}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setBookingDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Admit Patient</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}