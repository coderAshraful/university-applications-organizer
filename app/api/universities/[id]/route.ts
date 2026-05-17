import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
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
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await context.params;

    const university = await prisma.university.findUnique({
      where: { id, userId },
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
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await context.params;
    const body: UpdateUniversityInput = await request.json();

    // Check if university exists and belongs to this user
    const existingUniversity = await prisma.university.findUnique({
      where: { id, userId },
    });

    if (!existingUniversity) {
      return NextResponse.json(
        { error: 'University not found' },
        { status: 404 }
      );
    }

    // Whitelist updatable fields — never trust the raw body, which could
    // include userId and transfer ownership of the row to another user.
    const {
      name,
      location,
      program,
      status,
      category,
      ranking,
      acceptanceRate,
      websiteUrl,
      notes,
      researchNotes,
      applicationDeadline,
      earlyDeadline,
      decisionDate,
      tuition,
      applicationFee,
      estimatedCostOfLiving,
      financialAidDeadline,
      scholarshipNotes,
    } = body;
    const data: Record<string, unknown> = {};
    if (name !== undefined) data.name = name;
    if (location !== undefined) data.location = location;
    if (program !== undefined) data.program = program;
    if (status !== undefined) data.status = status;
    if (category !== undefined) data.category = category;
    if (ranking !== undefined) data.ranking = ranking;
    if (acceptanceRate !== undefined) data.acceptanceRate = acceptanceRate;
    if (websiteUrl !== undefined) data.websiteUrl = websiteUrl;
    if (notes !== undefined) data.notes = notes;
    if (researchNotes !== undefined) data.researchNotes = researchNotes;
    if (tuition !== undefined) data.tuition = tuition;
    if (applicationFee !== undefined) data.applicationFee = applicationFee;
    if (estimatedCostOfLiving !== undefined) data.estimatedCostOfLiving = estimatedCostOfLiving;
    if (scholarshipNotes !== undefined) data.scholarshipNotes = scholarshipNotes;
    if (applicationDeadline !== undefined) {
      data.applicationDeadline = applicationDeadline === null ? null : new Date(applicationDeadline);
    }
    if (earlyDeadline !== undefined) {
      data.earlyDeadline = earlyDeadline === null ? null : new Date(earlyDeadline);
    }
    if (decisionDate !== undefined) {
      data.decisionDate = decisionDate === null ? null : new Date(decisionDate);
    }
    if (financialAidDeadline !== undefined) {
      data.financialAidDeadline = financialAidDeadline === null ? null : new Date(financialAidDeadline);
    }

    const university = await prisma.university.update({
      where: { id, userId },
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
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await context.params;

    // Check if university exists and belongs to this user
    const existingUniversity = await prisma.university.findUnique({
      where: { id, userId },
    });

    if (!existingUniversity) {
      return NextResponse.json(
        { error: 'University not found' },
        { status: 404 }
      );
    }

    // Delete university (cascade will delete related requirements and deadlines)
    await prisma.university.delete({
      where: { id, userId },
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
