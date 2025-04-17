import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Bed from '@/models/Bed';

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

    await connectDB();

    const bed = await Bed.findById(params.id);
    if (!bed) {
      return NextResponse.json(
        { error: 'Bed not found' },
        { status: 404 }
      );
    }

    bed.status = status;
    bed.lastUpdated = new Date();

    if (status === 'Available') {
      bed.patient = undefined;
    }

    await bed.save();

    return NextResponse.json(bed);
  } catch (error) {
    console.error('Error updating bed status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 