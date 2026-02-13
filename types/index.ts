// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Database Model Types (matching Prisma schema)
export interface University {
  id: string;
  name: string;
  location: string;
  program: string;
  status: ApplicationStatus;
  category: string | null;
  ranking: number | null;
  acceptanceRate: number | null;
  websiteUrl: string | null;
  notes: string | null;
  researchNotes: string | null;
  applicationDeadline: Date | null;
  earlyDeadline: Date | null;
  decisionDate: Date | null;
  tuition: number | null;
  applicationFee: number | null;
  estimatedCostOfLiving: number | null;
  financialAidDeadline: Date | null;
  scholarshipNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
  requirements?: Requirement[];
  deadlines?: Deadline[];
  // Aliases for compatibility with existing components
  website?: string | null;
  applicationPortal?: string | null;
}

export interface Requirement {
  id: string;
  universityId: string;
  type: string;
  title: string;
  description: string | null;
  completed: boolean;
  deadline: Date | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Deadline {
  id: string;
  universityId: string;
  title: string;
  date: Date;
  type: string;
  description?: string | null;
  completed: boolean;
  reminderDays?: number | null;
  createdAt: Date;
  updatedAt: Date;
  notes?: string; // For compatibility with existing components
}

// University Types
export type ApplicationStatus =
  | 'considering'
  | 'applied'
  | 'accepted'
  | 'rejected'
  | 'waitlisted'
  | 'enrolled'
  | 'not-started'
  | 'in-progress'
  | 'submitted';

export type UniversityCategory = 'reach' | 'target' | 'safety';

export interface CreateUniversityInput {
  name: string;
  location: string;
  program: string;
  status?: ApplicationStatus;
  category?: UniversityCategory;
  ranking?: number;
  acceptanceRate?: number;
  websiteUrl?: string;
  notes?: string;
  researchNotes?: string;
  applicationDeadline?: Date | string;
  earlyDeadline?: Date | string;
  decisionDate?: Date | string;
  tuition?: number;
  applicationFee?: number;
  estimatedCostOfLiving?: number;
  financialAidDeadline?: Date | string;
  scholarshipNotes?: string;
}

export interface UpdateUniversityInput extends Partial<CreateUniversityInput> {}

// Requirement Types
export type RequirementType = 'essay' | 'test_score' | 'recommendation' | 'transcript' | 'portfolio' | 'other';

export interface CreateRequirementInput {
  universityId: string;
  type: RequirementType;
  title: string;
  description?: string;
  completed?: boolean;
  deadline?: Date | string;
  notes?: string;
}

export interface UpdateRequirementInput extends Partial<Omit<CreateRequirementInput, 'universityId'>> {}

// Deadline Types
export type DeadlineType = 'application' | 'financial_aid' | 'scholarship' | 'decision' | 'deposit' | 'housing' | 'other';

export interface CreateDeadlineInput {
  universityId: string;
  title: string;
  date: Date | string;
  type: DeadlineType;
  description?: string;
  completed?: boolean;
  reminderDays?: number;
}

export interface UpdateDeadlineInput extends Partial<Omit<CreateDeadlineInput, 'universityId'>> {}

// Dashboard Types
export interface DashboardStats {
  total: number;
  considering: number;
  applied: number;
  accepted: number;
  rejected: number;
  waitlisted: number;
  enrolled: number;
}

export interface UpcomingDeadline {
  id: string;
  title: string;
  date: Date;
  type: DeadlineType;
  universityId: string;
  universityName: string;
  daysUntil: number;
}
