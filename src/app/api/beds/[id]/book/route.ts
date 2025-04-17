import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';

let db: any = null;

async function getDb() {
  if (!db) {
    const client = await clientPromise;
    db = client.db();
  }
  return db;
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { patientName, age, contact, medicalReason } = await request.json();

    if (!patientName || !age || !contact || !medicalReason) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const bedId = new ObjectId(params.id);

    // Check if bed exists and is available
    const bed = await db.collection('beds').findOne({ _id: bedId });
    if (!bed) {
      return NextResponse.json(
        { error: 'Bed not found' },
        { status: 404 }
      );
    }

    if (bed.status === 'occupied') {
      return NextResponse.json(
        { error: 'Bed is already occupied' },
        { status: 400 }
      );
    }

    // Update bed status and add patient information
    const result = await db.collection('beds').updateOne(
      { _id: bedId },
      {
        $set: {
          status: 'occupied',
          patient: {
            name: patientName,
            age: parseInt(age),
            contact,
            medicalReason,
          },
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Bed not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Bed booked successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in POST /api/beds/[id]/book:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 