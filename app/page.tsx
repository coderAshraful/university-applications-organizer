import StatsOverview from '@/components/dashboard/StatsOverview';
import UpcomingDeadlines from '@/components/dashboard/UpcomingDeadlines';
import QuickActions from '@/components/dashboard/QuickActions';
import { DashboardStats, UpcomingDeadline } from '@/types';
import { prisma } from '@/lib/db';

async function getDashboardData() {
  try {
    // Fetch stats directly from DB
    const universities = await prisma.university.findMany({ select: { status: true } });
    const stats: DashboardStats = {
      total: universities.length,
      considering: universities.filter(u => u.status === 'considering').length,
      applied: universities.filter(u => u.status === 'applied').length,
      accepted: universities.filter(u => u.status === 'accepted').length,
      waitlisted: universities.filter(u => u.status === 'waitlisted').length,
      rejected: universities.filter(u => u.status === 'rejected').length,
      enrolled: universities.filter(u => u.status === 'enrolled').length,
    };

    // Fetch upcoming deadlines directly from DB
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const rawDeadlines = await prisma.deadline.findMany({
      where: { completed: false, date: { lte: futureDate } },
      include: { university: { select: { id: true, name: true } } },
      orderBy: { date: 'asc' },
    });

    const deadlines: UpcomingDeadline[] = rawDeadlines.map(d => {
      const diffDays = Math.ceil((new Date(d.date).getTime() - Date.now()) / 86400000);
      return { id: d.id, title: d.title, date: d.date, type: d.type as UpcomingDeadline['type'], universityId: d.universityId, universityName: d.university.name, daysUntil: diffDays };
    });

    return { stats, deadlines };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return {
      stats: { total: 0, considering: 0, applied: 0, accepted: 0, waitlisted: 0, rejected: 0, enrolled: 0 },
      deadlines: [],
    };
  }
}

export default async function DashboardPage() {
  const { stats, deadlines } = await getDashboardData();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Dashboard</h1>
          <p className="text-lg text-slate-600">
            Track your university applications and stay on top of deadlines
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <QuickActions />
        </div>

        {/* Stats Overview */}
        <div className="mb-8">
          <StatsOverview stats={stats} />
        </div>

        {/* Upcoming Deadlines */}
        <div>
          <UpcomingDeadlines deadlines={deadlines} />
        </div>

        {/* Empty State */}
        {stats.total === 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-md border border-slate-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">🎓</div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Welcome to Your University Applications Organizer!
              </h2>
              <p className="text-slate-600 mb-6">
                Get started by adding your first university. Track deadlines, requirements,
                and stay organized throughout your application journey.
              </p>
              <a
                href="/universities"
                className="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors shadow-md hover:shadow-lg"
              >
                Add Your First University
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
