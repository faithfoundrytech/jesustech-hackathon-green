import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Therapist from '@/models/therapist';
import { generateTherapistEmbedding } from '@/utils/therapist-embeddings';

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();

    console.log(data);
    // Generate embedding for the new therapist
    const embedding = await generateTherapistEmbedding(data);
    
    // Create therapist with embedding
    const therapist = await Therapist.create({
      ...data,
      embedding
    });
    
    return NextResponse.json(therapist, { status: 201 });
  } catch (error) {
    console.error('Error creating therapist:', error);
    return NextResponse.json(
      { error: 'Failed to create therapist' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    await connectDB();
    
    // Get pagination parameters from URL
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await Therapist.countDocuments({});

    // Get paginated therapists
    const therapists = await Therapist.find({})
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return NextResponse.json({
      data: therapists,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching therapists:', error);
    return NextResponse.json(
      { error: 'Failed to fetch therapists' },
      { status: 500 }
    );
  }
} 