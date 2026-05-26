'use client';

import { useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { customerPortalAction } from '@/lib/payments/actions';
import useSWR from 'swr';
import { User, TeamDataWithMembers } from '@/lib/db/schema';
import { updateAccount } from '@/app/(login)/actions';
import { useActionState } from 'react';
import {
  CreditCard,
  Shield,
  User as UserIcon,
  Loader2,
  CheckCircle,
  Crown,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

type ActionState = { error?: string; success?: string };

function AccountSection() {
  const { data: user } = useSWR<User>('/api/user', fetcher);
  const [state, action, isPending] = useActionState<ActionState, FormData>(
    updateAccount,
    {}
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserIcon className="h-5 w-5 text-orange-500" /> Account Details
        </CardTitle>
        <CardDescription>Update your name and email address.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              defaultValue={user?.name ?? ''}
              placeholder="Your name"
              className="mt-1 border-amber-200 focus-visible:ring-orange-300"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={user?.email ?? ''}
              placeholder="your@email.com"
              className="mt-1 border-amber-200 focus-visible:ring-orange-300"
            />
          </div>
          {state?.error && (
            <p className="text-sm text-red-600">{state.error}</p>
          )}
          {state?.success && (
            <p className="text-sm text-green-600 flex items-center gap-1">
              <CheckCircle className="h-4 w-4" /> {state.success}
            </p>
          )}
          <Button
            type="submit"
            disabled={isPending}
            className="rounded-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            {isPending ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…</>
            ) : (
              'Save Changes'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function SubscriptionSection() {
  const { data: team } = useSWR<TeamDataWithMembers>('/api/team', fetcher);
  const { data: user } = useSWR<User>('/api/user', fetcher);

  const isActive =
    team?.subscriptionStatus === 'active' ||
    team?.subscriptionStatus === 'trialing';
  const isLifetime = (team as any)?.lifetimeAccess;
  const hasPaid = isActive || isLifetime;
  const freeScansLeft = Math.max(0, 2 - (user?.scanCount ?? 0));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-orange-500" /> Subscription
        </CardTitle>
        <CardDescription>Manage your plan and billing.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current plan badge */}
        <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-2xl">
          <div className="flex items-center gap-3">
            {hasPaid ? (
              <Crown className="h-6 w-6 text-amber-500" />
            ) : (
              <Sparkles className="h-6 w-6 text-gray-400" />
            )}
            <div>
              <p className="font-semibold text-gray-900">
                {isLifetime ? 'Lifetime Access' : isActive ? (team?.planName ?? 'Active Plan') : 'Free Plan'}
              </p>
              <p className="text-xs text-gray-500">
                {isLifetime
                  ? 'Unlimited scans forever'
                  : isActive
                  ? team?.subscriptionStatus === 'trialing' ? 'Trial period active' : 'Billed monthly'
                  : `${freeScansLeft} free scan${freeScansLeft !== 1 ? 's' : ''} remaining`}
              </p>
            </div>
          </div>
          {isActive && !isLifetime && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
              Active
            </span>
          )}
          {isLifetime && (
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">
              Lifetime ✓
            </span>
          )}
        </div>

        {/* Upgrade prompt for free users */}
        {!hasPaid && (
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl">
            <p className="text-sm font-medium text-orange-800 mb-2">
              Upgrade for unlimited Korean recipes 🍜
            </p>
            <p className="text-xs text-orange-600 mb-3">
              From $2.99/month or $6.99 lifetime access
            </p>
            <Button
              asChild
              size="sm"
              className="rounded-full bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Link href="/pricing">View Plans</Link>
            </Button>
          </div>
        )}

        {/* Manage subscription (paid users) */}
        {isActive && !isLifetime && (
          <form action={customerPortalAction}>
            <Button type="submit" variant="outline" className="rounded-full w-full border-orange-200 text-orange-600 hover:bg-orange-50">
              Manage Subscription & Billing
            </Button>
          </form>
        )}

        {/* Restore purchase note */}
        <div className="text-xs text-gray-400 text-center">
          Purchased on another device?{' '}
          <button
            onClick={async () => {
              // Sign out and back in to restore
              window.location.href = '/sign-in';
            }}
            className="text-orange-500 hover:underline"
          >
            Sign in to restore access
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

function SecuritySection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-orange-500" /> Security
        </CardTitle>
        <CardDescription>Manage your password and account security.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild variant="outline" className="rounded-full border-orange-200 text-orange-600 hover:bg-orange-50">
          <Link href="/dashboard/security">Change Password</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Settings</h1>
      <div className="space-y-6">
        <Suspense fallback={<div className="h-48 bg-gray-100 rounded-2xl animate-pulse" />}>
          <AccountSection />
        </Suspense>
        <Suspense fallback={<div className="h-48 bg-gray-100 rounded-2xl animate-pulse" />}>
          <SubscriptionSection />
        </Suspense>
        <Suspense fallback={<div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />}>
          <SecuritySection />
        </Suspense>
      </div>
    </div>
  );
}
