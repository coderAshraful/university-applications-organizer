import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Clear existing data
  await prisma.deadline.deleteMany();
  await prisma.requirement.deleteMany();
  await prisma.university.deleteMany();

  // Sample University 1: MIT (Reach)
  const mit = await prisma.university.create({
    data: {
      userId: 'seed_user',
      name: 'Massachusetts Institute of Technology',
      location: 'Cambridge, MA',
      program: 'Computer Science',
      status: 'applied',
      category: 'reach',
      ranking: 2,
      acceptanceRate: 4.0,
      websiteUrl: 'https://www.mit.edu',
      notes: 'Strong engineering program, highly competitive',
      researchNotes: 'Known for AI and robotics research. Check out CSAIL lab.',
      applicationDeadline: new Date('2026-01-01'),
      earlyDeadline: new Date('2025-11-01'),
      decisionDate: new Date('2026-03-14'),
      tuition: 57590,
      applicationFee: 85,
      estimatedCostOfLiving: 20000,
      financialAidDeadline: new Date('2026-02-15'),
      scholarshipNotes: 'Need-blind admissions, meets full demonstrated need',
      requirements: {
        create: [
          {
            type: 'essay',
            title: 'Personal Statement',
            description: 'Tell us about a time you solved a complex problem',
            completed: true,
            deadline: new Date('2025-12-15'),
            notes: 'Focused on robotics project from junior year',
          },
          {
            type: 'test_score',
            title: 'SAT Score',
            description: 'Official SAT scores',
            completed: true,
            deadline: new Date('2025-12-01'),
          },
          {
            type: 'recommendation',
            title: 'Teacher Recommendation - Math',
            description: 'Letter from math teacher',
            completed: true,
            deadline: new Date('2025-12-20'),
          },
          {
            type: 'recommendation',
            title: 'Teacher Recommendation - Science',
            description: 'Letter from science teacher',
            completed: false,
            deadline: new Date('2025-12-20'),
          },
        ],
      },
      deadlines: {
        create: [
          {
            title: 'Regular Application Deadline',
            date: new Date('2026-01-01'),
            type: 'application',
            description: 'Submit all materials through Common App',
            completed: true,
            reminderDays: 7,
          },
          {
            title: 'Financial Aid Deadline',
            date: new Date('2026-02-15'),
            type: 'financial_aid',
            description: 'CSS Profile and FAFSA submission',
            completed: false,
            reminderDays: 14,
          },
          {
            title: 'Decision Release',
            date: new Date('2026-03-14'),
            type: 'decision',
            description: 'Pi Day decisions',
            completed: false,
            reminderDays: 1,
          },
        ],
      },
    },
  });

  // Sample University 2: Stanford (Reach)
  const stanford = await prisma.university.create({
    data: {
      userId: 'seed_user',
      name: 'Stanford University',
      location: 'Stanford, CA',
      program: 'Artificial Intelligence',
      status: 'applied',
      category: 'reach',
      ranking: 3,
      acceptanceRate: 3.9,
      websiteUrl: 'https://www.stanford.edu',
      notes: 'Dream school - amazing AI program and Silicon Valley connections',
      researchNotes: 'Andrew Ng founded Stanford AI Lab. Strong industry connections.',
      applicationDeadline: new Date('2026-01-05'),
      decisionDate: new Date('2026-04-01'),
      tuition: 58416,
      applicationFee: 90,
      estimatedCostOfLiving: 22500,
      financialAidDeadline: new Date('2026-02-15'),
      requirements: {
        create: [
          {
            type: 'essay',
            title: 'What Matters to You and Why?',
            description: 'Stanford-specific essay prompt',
            completed: true,
            deadline: new Date('2026-01-05'),
          },
          {
            type: 'essay',
            title: 'Roommate Essay',
            description: 'Write a note to your future roommate',
            completed: false,
            deadline: new Date('2026-01-05'),
            notes: 'Make it personal and genuine',
          },
          {
            type: 'portfolio',
            title: 'Optional Portfolio',
            description: 'Showcase coding projects and research',
            completed: false,
            deadline: new Date('2026-01-05'),
          },
        ],
      },
      deadlines: {
        create: [
          {
            title: 'Application Deadline',
            date: new Date('2026-01-05'),
            type: 'application',
            description: 'Coalition Application deadline',
            completed: true,
            reminderDays: 7,
          },
          {
            title: 'Decision Date',
            date: new Date('2026-04-01'),
            type: 'decision',
            completed: false,
            reminderDays: 1,
          },
        ],
      },
    },
  });

  // Sample University 3: University of Washington (Target)
  const uw = await prisma.university.create({
    data: {
      userId: 'seed_user',
      name: 'University of Washington',
      location: 'Seattle, WA',
      program: 'Computer Science & Engineering',
      status: 'accepted',
      category: 'target',
      ranking: 26,
      acceptanceRate: 48.0,
      websiteUrl: 'https://www.washington.edu',
      notes: 'Great CS program, good internship opportunities in Seattle',
      researchNotes: 'Strong in HCI and systems. Amazon and Microsoft recruit heavily.',
      applicationDeadline: new Date('2025-11-15'),
      decisionDate: new Date('2026-03-15'),
      tuition: 39906,
      applicationFee: 80,
      estimatedCostOfLiving: 18000,
      financialAidDeadline: new Date('2026-02-28'),
      scholarshipNotes: 'Received Purple & Gold Scholarship - $10,000/year',
      requirements: {
        create: [
          {
            type: 'essay',
            title: 'Personal Insight Questions',
            description: 'Answer 4 out of 8 questions',
            completed: true,
            deadline: new Date('2025-11-15'),
          },
          {
            type: 'transcript',
            title: 'Official Transcript',
            description: 'Send through Parchment',
            completed: true,
            deadline: new Date('2025-11-15'),
          },
        ],
      },
      deadlines: {
        create: [
          {
            title: 'Early Action Deadline',
            date: new Date('2025-11-15'),
            type: 'application',
            completed: true,
            reminderDays: 7,
          },
          {
            title: 'Decision Release',
            date: new Date('2026-03-15'),
            type: 'decision',
            completed: true,
          },
          {
            title: 'Enrollment Deposit',
            date: new Date('2026-05-01'),
            type: 'deposit',
            description: '$300 non-refundable deposit',
            completed: false,
            reminderDays: 14,
          },
          {
            title: 'Housing Application',
            date: new Date('2026-05-15'),
            type: 'housing',
            description: 'Apply for on-campus housing',
            completed: false,
            reminderDays: 7,
          },
        ],
      },
    },
  });

  // Sample University 4: Georgia Tech (Target)
  const gatech = await prisma.university.create({
    data: {
      userId: 'seed_user',
      name: 'Georgia Institute of Technology',
      location: 'Atlanta, GA',
      program: 'Computer Science',
      status: 'considering',
      category: 'target',
      ranking: 38,
      acceptanceRate: 16.0,
      websiteUrl: 'https://www.gatech.edu',
      notes: 'Top CS program with good ROI. Great co-op program.',
      researchNotes: 'Strong in AI and cybersecurity. Very technical focus.',
      applicationDeadline: new Date('2026-01-04'),
      tuition: 33020,
      applicationFee: 75,
      estimatedCostOfLiving: 16000,
      requirements: {
        create: [
          {
            type: 'essay',
            title: 'Why Georgia Tech?',
            description: '300 word essay on fit with school',
            completed: false,
            deadline: new Date('2026-01-04'),
          },
        ],
      },
      deadlines: {
        create: [
          {
            title: 'Regular Decision Deadline',
            date: new Date('2026-01-04'),
            type: 'application',
            completed: false,
            reminderDays: 14,
          },
        ],
      },
    },
  });

  // Sample University 5: Purdue University (Safety)
  const purdue = await prisma.university.create({
    data: {
      userId: 'seed_user',
      name: 'Purdue University',
      location: 'West Lafayette, IN',
      program: 'Computer Science',
      status: 'accepted',
      category: 'safety',
      ranking: 51,
      acceptanceRate: 53.0,
      websiteUrl: 'https://www.purdue.edu',
      notes: 'Solid safety school, good reputation for engineering',
      researchNotes: 'Known for practical engineering education. Good industry connections.',
      applicationDeadline: new Date('2026-01-15'),
      decisionDate: new Date('2026-02-15'),
      tuition: 28794,
      applicationFee: 60,
      estimatedCostOfLiving: 14000,
      financialAidDeadline: new Date('2026-03-01'),
      scholarshipNotes: 'Received Presidential Scholarship - $15,000/year',
      requirements: {
        create: [
          {
            type: 'essay',
            title: 'Personal Statement',
            description: 'Common App essay',
            completed: true,
            deadline: new Date('2026-01-15'),
          },
          {
            type: 'test_score',
            title: 'ACT/SAT Scores',
            description: 'Optional but recommended',
            completed: true,
          },
        ],
      },
      deadlines: {
        create: [
          {
            title: 'Application Deadline',
            date: new Date('2026-01-15'),
            type: 'application',
            completed: true,
            reminderDays: 7,
          },
          {
            title: 'Decision Date',
            date: new Date('2026-02-15'),
            type: 'decision',
            completed: true,
          },
          {
            title: 'Acceptance Reply Date',
            date: new Date('2026-05-01'),
            type: 'deposit',
            description: 'Confirm enrollment and pay deposit',
            completed: false,
            reminderDays: 14,
          },
        ],
      },
    },
  });

  console.log('Database seeded successfully!');
  console.log(`Created universities:
  - ${mit.name} (${mit.category})
  - ${stanford.name} (${stanford.category})
  - ${uw.name} (${uw.category})
  - ${gatech.name} (${gatech.category})
  - ${purdue.name} (${purdue.category})
  `);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error seeding database:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
