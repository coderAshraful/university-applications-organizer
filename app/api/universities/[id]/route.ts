import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { UpdateUniversityInput } from '@/types';

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET /api/universities/[id] - Get a single university by ID
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const university = await prisma.university.findUnique({
      where: { id },
      include: {
        requirements: {
          orderBy: { deadline: 'asc' },
        },
        deadlines: {
          orderBy: { date: 'asc' },
        },
      },
    });

    if (!university) {
      return NextResponse.json(
        { error: 'University not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: university });
  } catch (error) {
    console.error('Error fetching university:', error);
    return NextResponse.json(
      { error: 'Failed to fetch university' },
      { status: 500 }
    );
  }
}

// PATCH /api/universities/[id] - Update a university
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const body: UpdateUniversityInput = await request.json();

    // Check if university exists
    const existingUniversity = await prisma.university.findUnique({
      where: { id },
    });

    if (!existingUniversity) {
      return NextResponse.json(
        { error: 'University not found' },
        { status: 404 }
      );
    }

    // Convert string dates to Date objects
    const data: any = { ...body };
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

    const university = await prisma.university.update({
      where: { id },
      data,
      include: {
        requirements: true,
        deadlines: true,
      },
    });

    return NextResponse.json({ data: university });
  } catch (error) {
    console.error('Error updating university:', error);
    return NextResponse.json(
      { error: 'Failed to update university' },
      { status: 500 }
    );
  }
}

// DELETE /api/universities/[id] - Delete a university
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    // Check if university exists
    const existingUniversity = await prisma.university.findUnique({
      where: { id },
    });

    if (!existingUniversity) {
      return NextResponse.json(
        { error: 'University not found' },
        { status: 404 }
      );
    }

    // Delete university (cascade will delete related requirements and deadlines)
    await prisma.university.delete({
      where: { id },
    });

    return NextResponse.json(
      { data: { message: 'University deleted successfully' } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting university:', error);
    return NextResponse.json(
      { error: 'Failed to delete university' },
      { status: 500 }
    );
  }
}
