import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { UpdateDeadlineInput } from '@/types';

type RouteContext = {
  params: Promise<{ id: string }>;
};

// PATCH /api/deadlines/[id] - Update a deadline
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await context.params;
    const body: UpdateDeadlineInput = await request.json();

    // Check if deadline exists and belongs to this user's university
    const existingDeadline = await prisma.deadline.findUnique({
      where: { id },
      include: { university: { select: { userId: true } } },
    });

    if (!existingDeadline || existingDeadline.university.userId !== userId) {
      return NextResponse.json(
        { error: 'Deadline not found' },
        { status: 404 }
      );
    }

    // Convert string date to Date object
    const data: any = { ...body };
    if (data.date) {
      data.date = new Date(data.date);
    }

    const deadline = await prisma.deadline.update({
      where: { id },
      data,
    });

    return NextResponse.json({ data: deadline });
  } catch (error) {
    console.error('Error updating deadline:', error);
    return NextResponse.json(
      { error: 'Failed to update deadline' },
      { status: 500 }
    );
  }
}

// DELETE /api/deadlines/[id] - Delete a deadline
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await context.params;

    // Check if deadline exists and belongs to this user's university
    const existingDeadline = await prisma.deadline.findUnique({
      where: { id },
      include: { university: { select: { userId: true } } },
    });

    if (!existingDeadline || existingDeadline.university.userId !== userId) {
      return NextResponse.json(
        { error: 'Deadline not found' },
        { status: 404 }
      );
    }

    await prisma.deadline.delete({
      where: { id },
    });

    return NextResponse.json(
      { data: { message: 'Deadline deleted successfully' } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting deadline:', error);
    return NextResponse.json(
      { error: 'Failed to delete deadline' },
      { status: 500 }
    );
  }
}
