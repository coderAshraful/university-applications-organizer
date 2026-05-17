import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { UpdateRequirementInput } from '@/types';

type RouteContext = {
  params: Promise<{ id: string }>;
};

// PATCH /api/requirements/[id] - Update a requirement
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await context.params;
    const body: UpdateRequirementInput = await request.json();

    // Check if requirement exists and belongs to this user's university
    const existingRequirement = await prisma.requirement.findUnique({
      where: { id },
      include: { university: { select: { userId: true } } },
    });

    if (!existingRequirement || existingRequirement.university.userId !== userId) {
      return NextResponse.json(
        { error: 'Requirement not found' },
        { status: 404 }
      );
    }

    // Whitelist updatable fields — never trust the raw body, which could
    // include universityId and reassign the row to another user's university.
    const { type, title, description, completed, deadline, notes } = body;
    const data: Record<string, unknown> = {};
    if (type !== undefined) data.type = type;
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (completed !== undefined) data.completed = completed;
    if (notes !== undefined) data.notes = notes;
    if (deadline !== undefined) {
      data.deadline = deadline === null ? null : new Date(deadline);
    }

    const requirement = await prisma.requirement.update({
      where: { id },
      data,
    });

    return NextResponse.json({ data: requirement });
  } catch (error) {
    console.error('Error updating requirement:', error);
    return NextResponse.json(
      { error: 'Failed to update requirement' },
      { status: 500 }
    );
  }
}

// DELETE /api/requirements/[id] - Delete a requirement
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await context.params;

    // Check if requirement exists and belongs to this user's university
    const existingRequirement = await prisma.requirement.findUnique({
      where: { id },
      include: { university: { select: { userId: true } } },
    });

    if (!existingRequirement || existingRequirement.university.userId !== userId) {
      return NextResponse.json(
        { error: 'Requirement not found' },
        { status: 404 }
      );
    }

    await prisma.requirement.delete({
      where: { id },
    });

    return NextResponse.json(
      { data: { message: 'Requirement deleted successfully' } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting requirement:', error);
    return NextResponse.json(
      { error: 'Failed to delete requirement' },
      { status: 500 }
    );
  }
}
