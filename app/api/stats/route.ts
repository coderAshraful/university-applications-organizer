import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ApiResponse, DashboardStats } from '@/types';

export async function GET(request: NextRequest) {
  try {
    // Get all universities with their status
    const universities = await prisma.university.findMany({
      select: {
        status: true,
      },
    });

    // Count universities by status
    const stats: DashboardStats = {
      total: universities.length,
      considering: universities.filter(u => u.status === 'considering').length,
      applied: universities.filter(u => u.status === 'applied').length,
      accepted: universities.filter(u => u.status === 'accepted').length,
      waitlisted: universities.filter(u => u.status === 'waitlisted').length,
      rejected: universities.filter(u => u.status === 'rejected').length,
      enrolled: universities.filter(u => u.status === 'enrolled').length,
    };

    const response: ApiResponse<DashboardStats> = {
      data: stats,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching stats:', error);

    const response: ApiResponse<DashboardStats> = {
      error: 'Failed to fetch statistics',
    };

    return NextResponse.json(response, { status: 500 });
  }
}
