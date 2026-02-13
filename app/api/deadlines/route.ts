import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { CreateDeadlineInput, UpcomingDeadline } from '@/types';

// GET /api/deadlines - Get all deadlines with university info
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const upcomingDays = searchParams.get('upcoming');

    // Build where clause for upcoming deadlines
    const where: any = {
      completed: false,
    };

    if (upcomingDays) {
      const days = parseInt(upcomingDays);
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + days);

      where.date = {
        lte: futureDate,
      };
    }

    // Fetch deadlines with university information
    const deadlines = await prisma.deadline.findMany({
      where,
      include: {
        university: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Transform to UpcomingDeadline format
    const upcomingDeadlines: UpcomingDeadline[] = deadlines.map(deadline => {
      const now = new Date();
      const deadlineDate = new Date(deadline.date);
      const diffTime = deadlineDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        id: deadline.id,
        title: deadline.title,
        date: deadline.date,
        type: deadline.type,
        universityId: deadline.universityId,
        universityName: deadline.university.name,
        daysUntil: diffDays,
      };
    });

    return NextResponse.json({ data: upcomingDeadlines });
  } catch (error) {
    console.error('Error fetching deadlines:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deadlines' },
      { status: 500 }
    );
  }
}

// POST /api/deadlines - Create a new deadline
export async function POST(request: NextRequest) {
  try {
    const body: CreateDeadlineInput = await request.json();

    // Validate required fields
    if (!body.universityId || !body.title || !body.date || !body.type) {
      return NextResponse.json(
        { error: 'Missing required fields: universityId, title, date, type' },
        { status: 400 }
      );
    }

    // Check if university exists
    const university = await prisma.university.findUnique({
      where: { id: body.universityId },
    });

    if (!university) {
      return NextResponse.json(
        { error: 'University not found' },
        { status: 404 }
      );
    }

    // Convert string date to Date object
    const data: any = { ...body };
    data.date = new Date(data.date);

    const deadline = await prisma.deadline.create({
      data,
    });

    return NextResponse.json({ data: deadline }, { status: 201 });
  } catch (error) {
    console.error('Error creating deadline:', error);
    return NextResponse.json(
      { error: 'Failed to create deadline' },
      { status: 500 }
    );
  }
}
