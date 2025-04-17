import { NextResponse } from 'next/server';
import { Collection, Db } from 'mongodb';
import clientPromise from '@/app/lib/mongodb';

interface Ward {
  id: string;
  name: string;
  beds: Bed[];
}

interface Bed {
  id: string;
  number: string;
  status: "AVAILABLE" | "OCCUPIED";
  ward: {
    id: string;
    name: string;
  };
  patient: Patient | null;
}

interface Patient {
  name: string;
  age: string;
  contact: string;
  reason: string;
}

interface BookBedRequest {
  bedId: string;
  wardId: string;
  patientData: Patient;
}

interface CollectionInfo {
  name: string;
  type: string;
  options: any;
  info: any;
  idIndex: any;
}

// Initial data for wards and beds
const initialWards: Ward[] = [
  {
    id: "ward_1",
    name: "General Ward",
    beds: Array.from({ length: 12 }, (_, i) => ({
      id: `gen_${i+1}`,
      number: `G${i+1}`,
      status: "AVAILABLE",
      ward: { id: "ward_1", name: "General Ward" },
      patient: null
    }))
  },
  {
    id: "ward_2",
    name: "ICU",
    beds: Array.from({ length: 6 }, (_, i) => ({
      id: `icu_${i+1}`,
      number: `ICU${i+1}`,
      status: "AVAILABLE",
      ward: { id: "ward_2", name: "ICU" },
      patient: null
    }))
  },
  {
    id: "ward_3",
    name: "Special Care",
    beds: Array.from({ length: 8 }, (_, i) => ({
      id: `spec_${i+1}`,
      number: `S${i+1}`,
      status: "AVAILABLE",
      ward: { id: "ward_3", name: "Special Care" },
      patient: null
    }))
  }
];

// Initialize the database with ward and bed data if it doesn't exist
async function initializeDatabase(db: Db) {
  try {
    console.log('Checking if wards collection exists...');
    const collections = await db.listCollections().toArray() as CollectionInfo[];
    const wardsCollectionExists = collections.some(col => col.name === 'wards');

    if (!wardsCollectionExists) {
      console.log('Creating wards collection...');
      await db.createCollection('wards');
    }

    const wardsCollection: Collection<Ward> = db.collection('wards');

    console.log('Checking for existing wards...');
    const wardsCount = await wardsCollection.countDocuments();
    console.log('Current wards count:', wardsCount);
    
    if (wardsCount === 0) {
      console.log('No wards found, initializing with default data...');
      const result = await wardsCollection.insertMany(initialWards);
      console.log('Initialization result:', result);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error in initializeDatabase:', error);
    throw error;
  }
}

export async function GET() {
  try {
    console.log('Starting GET request to /api/beds');
    const client = await clientPromise;
    console.log('MongoDB client connected');

    const db = client.db('hospital-bed');
    console.log('Using database: hospital-bed');

    try {
      // Ensure database is initialized
      const wasInitialized = await initializeDatabase(db);
      console.log('Database initialization status:', wasInitialized);

      // Fetch all wards with their beds
      const wardsCollection: Collection<Ward> = db.collection('wards');
      const wards = await wardsCollection.find({}).toArray();
      console.log(`Successfully fetched ${wards.length} wards`);

      return NextResponse.json(wards);
    } catch (dbError) {
      console.error('Database operation error:', dbError);
      throw dbError;
    }
  } catch (error) {
    console.error('Detailed error in GET /api/beds:', error);
    // Return a more specific error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: `Failed to fetch beds: ${errorMessage}` },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log('Starting POST request to /api/beds');
    const client = await clientPromise;
    console.log('MongoDB client connected');

    const db = client.db('hospital-bed');
    console.log('Using database: hospital-bed');
    
    const { bedId, wardId, patientData }: BookBedRequest = await request.json();
    console.log('Received booking request for bed:', bedId, 'in ward:', wardId);

    // Input validation
    if (!bedId || !wardId || !patientData) {
      console.log('Missing required fields in request');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate patient data
    if (!patientData.name || !patientData.age || !patientData.contact || !patientData.reason) {
      console.log('Missing patient data fields');
      return NextResponse.json(
        { error: 'All patient fields are required' },
        { status: 400 }
      );
    }

    console.log('Attempting to update bed status...');
    // Update the bed status and add patient data
    const wardsCollection: Collection<Ward> = db.collection('wards');
    const result = await wardsCollection.updateOne(
      {
        id: wardId,
        'beds.id': bedId,
        'beds.status': 'AVAILABLE' // Only allow booking if bed is available
      },
      {
        $set: {
          'beds.$.status': 'OCCUPIED',
          'beds.$.patient': patientData
        }
      }
    );

    console.log('Update result:', result);

    if (result.matchedCount === 0) {
      console.log('No matching bed found');
      return NextResponse.json(
        { error: 'Bed not found or not available' },
        { status: 404 }
      );
    }

    if (result.modifiedCount === 0) {
      console.log('Failed to modify bed status');
      return NextResponse.json(
        { error: 'Failed to update bed status' },
        { status: 500 }
      );
    }

    // Return updated wards data
    console.log('Fetching updated wards data...');
    const updatedWards = await wardsCollection.find({}).toArray();
    console.log('Successfully updated bed status');
    return NextResponse.json(updatedWards);
  } catch (error) {
    console.error('Detailed error in POST /api/beds:', error);
    // Return a more specific error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: `Failed to book bed: ${errorMessage}` },
      { status: 500 }
    );
  }
} 