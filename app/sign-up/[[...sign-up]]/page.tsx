import { SignUp } from '@clerk/nextjs';
import { GraduationCap } from 'lucide-react';

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center justify-center">
      <div className="mb-8 flex flex-col items-center">
        <GraduationCap className="h-12 w-12 text-orange-500 mb-3" />
        <h1 className="text-3xl font-bold text-slate-900">University Applications</h1>
      </div>
      <SignUp />
    </main>
  );
}
