import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json();

    if (!status || !['Available', 'Occupied', 'Under Maintenance'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const bed = await db.collection('beds').findOne({ _id: new ObjectId(params.id) });
    if (!bed) {
      return NextResponse.json(
        { error: 'Bed not found' },
        { status: 404 }
      );
    }

    const result = await db.collection('beds').updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          status,
          lastUpdated: new Date(),
          ...(status === 'Available' && { patient: null })
        }
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'Failed to update bed status' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ...bed,
      status,
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('Error updating bed status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 