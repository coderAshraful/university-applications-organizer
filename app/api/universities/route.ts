import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { CreateUniversityInput } from '@/types';

// GET /api/universities - Get all universities
export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');

    const where: any = { userId };
    if (status) where.status = status;
    if (category) where.category = category;

    const universities = await prisma.university.findMany({
      where,
      include: {
        requirements: {
          orderBy: { deadline: 'asc' },
        },
        deadlines: {
          orderBy: { date: 'asc' },
        },
      },
      orderBy: [
        { status: 'asc' },
        { applicationDeadline: 'asc' },
      ],
    });

    return NextResponse.json({ data: universities });
  } catch (error) {
    console.error('Error fetching universities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch universities' },
      { status: 500 }
    );
  }
}

// POST /api/universities - Create a new university
export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body: CreateUniversityInput = await request.json();

    // Validate required fields
    if (!body.name || !body.location || !body.program) {
      return NextResponse.json(
        { error: 'Missing required fields: name, location, program' },
        { status: 400 }
      );
    }

    // Convert string dates to Date objects
    const data: any = { ...body, userId };
    if (data.applicationDeadline) {
      data.applicationDeadline = new Date(data.applicationDeadline);
    }
    if (data.earlyDeadline) {
      data.earlyDeadline = new Date(data.earlyDeadline);
    }
    if (data.decisionDate) {
      data.decisionDate = new Date(data.decisionDate);
    }
    if (data.financialAidDeadline) {
      data.financialAidDeadline = new Date(data.financialAidDeadline);
    }

    const university = await prisma.university.create({
      data,
      include: {
        requirements: true,
        deadlines: true,
      },
    });

    return NextResponse.json({ data: university }, { status: 201 });
  } catch (error) {
    console.error('Error creating university:', error);
    return NextResponse.json(
      { error: 'Failed to create university' },
      { status: 500 }
    );
  }
}
