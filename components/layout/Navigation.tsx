'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  School,
  Calendar,
  GraduationCap,
  ChevronDown,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useUser, useClerk, useAuth } from '@clerk/nextjs';
import { useState, useEffect } from 'react';

const navItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Universities',
    href: '/universities',
    icon: School,
  },
  {
    name: 'Timeline',
    href: '/timeline',
    icon: Calendar,
  },
];

function UserMenu() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { isLoaded } = useAuth();
  const [open, setOpen] = useState(false);

  if (!isLoaded) {
    return <div className="h-9 w-9 rounded-full bg-slate-700 animate-pulse" />;
  }

  const initials = user
    ? [user.firstName, user.lastName]
        .filter(Boolean)
        .map(n => n![0])
        .join('')
        .toUpperCase() || user.emailAddresses[0]?.emailAddress[0].toUpperCase()
    : '';

  const fullName = user?.fullName || user?.emailAddresses[0]?.emailAddress || '';
  const email = user?.emailAddresses[0]?.emailAddress || '';

  return (
    <div className="relative">
        <button
          onClick={() => setOpen(prev => !prev)}
          className="flex items-center space-x-1 focus:outline-none"
        >
          <div className="h-9 w-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm select-none">
            {initials}
          </div>
          <ChevronDown className="h-4 w-4 text-slate-300" />
        </button>

        {open && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            {/* Dropdown */}
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 z-20 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-sm font-semibold text-slate-900 truncate">{fullName}</p>
                <p className="text-xs text-slate-500 truncate">{email}</p>
              </div>
              <button
                onClick={() => signOut({ redirectUrl: '/sign-in' })}
                className="w-full flex items-center space-x-2 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </button>
            </div>
          </>
        )}
      </div>
  );
}

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useUser();
  const { signOut } = useClerk();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const fullName = user?.fullName || user?.emailAddresses[0]?.emailAddress || '';
  const email = user?.emailAddresses[0]?.emailAddress || '';

  return (
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <GraduationCap className="h-8 w-8 text-orange-400 group-hover:text-orange-300 transition-colors" />
            <span className="text-xl font-bold text-white group-hover:text-orange-300 transition-colors">
              University Applications
            </span>
          </Link>

          {/* Desktop Navigation Links + User Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200",
                    isActive
                      ? "bg-orange-500 text-white shadow-md"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            <div className="ml-3 hidden md:block">
              <UserMenu />
            </div>
          </div>

          {/* Hamburger button (mobile only) */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="md:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-700">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200",
                    isActive
                      ? "bg-orange-500 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="border-t border-slate-700 px-4 py-3">
            <div className="flex items-center space-x-3 px-4 py-2 mb-1">
              <div className="h-9 w-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm select-none flex-shrink-0">
                {user
                  ? ([user.firstName, user.lastName]
                      .filter(Boolean)
                      .map(n => n![0])
                      .join('')
                      .toUpperCase() || user.emailAddresses[0]?.emailAddress[0].toUpperCase())
                  : ''}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{fullName}</p>
                <p className="text-xs text-slate-400 truncate">{email}</p>
              </div>
            </div>
            <button
              onClick={() => signOut({ redirectUrl: '/sign-in' })}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors font-medium"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
