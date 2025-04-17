import { NextResponse } from 'next/server'
import clientPromise from '@/app/lib/mongodb'

interface Patient {
  name: string;
  age: string;
  contact: string;
  reason: string;
}

interface Bed {
  id: string;
  number: string;
  status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";
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

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('hospital-bed')
    
    const wardsData = await db.collection('wards').find({}).toArray()
    const wards = wardsData as unknown as Ward[]
    
    const allBeds = wards.flatMap(ward => ward.beds)
    const metrics = {
      total: allBeds.length,
      available: allBeds.filter((bed: Bed) => bed.status === "AVAILABLE").length,
      occupied: allBeds.filter((bed: Bed) => bed.status === "OCCUPIED").length,
      maintenance: allBeds.filter((bed: Bed) => bed.status === "MAINTENANCE").length,
      occupancyRate: allBeds.length > 0 
        ? ((allBeds.filter(bed => bed.status === "OCCUPIED").length / allBeds.length) * 100).toFixed(1)
        : 0,
      wardMetrics: wards.map(ward => ({
        name: ward.name,
        total: ward.beds.length,
        available: ward.beds.filter(bed => bed.status === "AVAILABLE").length,
        occupied: ward.beds.filter(bed => bed.status === "OCCUPIED").length
      }))
    }
    
    return NextResponse.json(metrics)
  } catch (error) {
    console.error('Error fetching metrics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    )
  }
} 