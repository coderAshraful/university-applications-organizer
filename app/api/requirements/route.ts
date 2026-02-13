import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { CreateRequirementInput } from '@/types';

// POST /api/requirements - Create a new requirement
export async function POST(request: NextRequest) {
  try {
    const body: CreateRequirementInput = await request.json();

    // Validate required fields
    if (!body.universityId || !body.type || !body.title) {
      return NextResponse.json(
        { error: 'Missing required fields: universityId, type, title' },
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
    if (data.deadline) {
      data.deadline = new Date(data.deadline);
    }

    const requirement = await prisma.requirement.create({
      data,
    });

    return NextResponse.json({ data: requirement }, { status: 201 });
  } catch (error) {
    console.error('Error creating requirement:', error);
    return NextResponse.json(
      { error: 'Failed to create requirement' },
      { status: 500 }
    );
  }
}
