'use client';

import Link from 'next/link';
import { use, useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import {
  ScanLine,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
  ChefHat
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { signOut } from '@/app/(login)/actions';
import { useRouter, usePathname } from 'next/navigation';
import { User } from '@/lib/db/schema';
import useSWR, { mutate } from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const NAV_LINKS = [
  { href: '/scan', label: 'Scan', icon: ScanLine },
  { href: '/my-recipes', label: 'My Recipes', icon: BookOpen },
  { href: '/settings', label: 'Settings', icon: Settings }
];

function UserMenu() {
  const { data: user } = useSWR<User>('/api/user', fetcher);
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    mutate('/api/user');
    router.push('/');
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/pricing"
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          Pricing
        </Link>
        <Button asChild className="rounded-full bg-orange-500 hover:bg-orange-600 text-white" size="sm">
          <Link href="/sign-up">Sign Up</Link>
        </Button>
      </div>
    );
  }

  const initials = (user.name || user.email)
    .split(/[\s@]/)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="outline-none">
          <Avatar className="cursor-pointer size-9 ring-2 ring-orange-200 hover:ring-orange-400 transition-all">
            <AvatarFallback className="bg-orange-100 text-orange-700 font-bold text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-3 py-2 border-b border-gray-100">
          <p className="text-sm font-medium text-gray-900 truncate">{user.name || 'Chef'}</p>
          <p className="text-xs text-gray-500 truncate">{user.email}</p>
        </div>
        <DropdownMenuItem asChild className="mt-1 cursor-pointer">
          <Link href="/scan">
            <ScanLine className="mr-2 h-4 w-4" /> Scan Ingredients
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/my-recipes">
            <BookOpen className="mr-2 h-4 w-4" /> My Recipes
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/settings">
            <Settings className="mr-2 h-4 w-4" /> Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <form action={handleSignOut}>
          <button type="submit" className="w-full">
            <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </DropdownMenuItem>
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NavLink({ href, label, icon: Icon }: { href: string; label: string; icon: React.ComponentType<{ className?: string }> }) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
        isActive
          ? 'bg-orange-100 text-orange-700'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-amber-100/80 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/scan" className="flex items-center gap-2 shrink-0">
            <span className="text-xl">🥢</span>
            <span className="font-bold text-gray-900 hidden sm:block">
              Home Korean Recipes
            </span>
            <span className="font-bold text-gray-900 sm:hidden">HKR</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Suspense fallback={<div className="size-9 rounded-full bg-gray-100 animate-pulse" />}>
              <UserMenu />
            </Suspense>
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-500 hover:text-gray-900"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden pb-3 border-t border-gray-100 pt-3 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col min-h-screen bg-amber-50/20">
      <Header />
      <main className="flex-1">{children}</main>
    </section>
  );
}
