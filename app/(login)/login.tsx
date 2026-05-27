'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, AlertCircle, ChefHat } from 'lucide-react';
import { signIn, signUp } from './actions';
import { ActionState } from '@/lib/auth/middleware';

export function Login({ mode = 'signin' }: { mode?: 'signin' | 'signup' }) {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const priceId = searchParams.get('priceId');
  const inviteId = searchParams.get('inviteId');

  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    mode === 'signin' ? signIn : signUp,
    { error: '' }
  );

  const isSignUp = mode === 'signup';

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel (decorative, hidden on mobile) ─────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-400 flex-col items-center justify-center p-12 text-white relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-1/4 translate-y-1/4 pointer-events-none" />

        <div className="relative z-10 text-center max-w-sm">
          <div className="text-7xl mb-6">🥢</div>
          <h1 className="text-3xl font-bold mb-3 leading-tight">
            Authentic Korean Recipes, Made Easy
          </h1>
          <p className="text-white/80 text-base leading-relaxed mb-8">
            Snap your fridge or list your ingredients — get real home-style
            Korean recipes in seconds.
          </p>

          {/* Social proof / feature pills */}
          <div className="flex flex-wrap justify-center gap-2">
            {['🍲 Jjigae', '🥗 Bibimbap', '🍜 Japchae', '🌶️ Kimchi', '👶 Toddler-friendly'].map(
              (item) => (
                <span
                  key={item}
                  className="bg-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-full"
                >
                  {item}
                </span>
              )
            )}
          </div>

          {/* Free scan note */}
          <div className="mt-8 bg-white/20 rounded-2xl px-5 py-3 text-sm text-white/90">
            ✨ 2 free recipe scans — no credit card needed
          </div>
        </div>
      </div>

      {/* ── Right panel (form) ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-amber-50/40">
        <div className="w-full max-w-sm">
          {/* Logo (mobile only) */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <span className="text-3xl">🥢</span>
            <span className="font-bold text-gray-900 text-lg">
              Home Korean Recipes
            </span>
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-lg shadow-orange-100/60 border border-amber-100 px-8 py-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {isSignUp ? 'Create your account' : 'Welcome back!'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {isSignUp
                  ? 'Get 2 free recipe scans instantly'
                  : 'Sign in to your recipe library'}
              </p>
            </div>

            <form className="space-y-4" action={formAction} noValidate>
              {/* Hidden fields */}
              <input type="hidden" name="redirect" value={redirect ?? ''} />
              <input type="hidden" name="priceId" value={priceId ?? ''} />
              <input type="hidden" name="inviteId" value={inviteId ?? ''} />

              {/* Email */}
              <div>
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  defaultValue={state.email ?? ''}
                  required
                  maxLength={255}
                  className="mt-1.5 rounded-xl border-amber-200 focus-visible:ring-orange-300 focus-visible:border-orange-400 h-11"
                  placeholder="you@email.com"
                  disabled={pending}
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Password
                  </Label>
                  {!isSignUp && (
                    <span className="text-xs text-gray-400">Min 8 characters</span>
                  )}
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  defaultValue={state.password ?? ''}
                  required
                  minLength={8}
                  maxLength={100}
                  className="mt-1.5 rounded-xl border-amber-200 focus-visible:ring-orange-300 focus-visible:border-orange-400 h-11"
                  placeholder={isSignUp ? 'Choose a password (8+ chars)' : 'Your password'}
                  disabled={pending}
                />
              </div>

              {/* Error */}
              {state?.error && (
                <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{state.error}</span>
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={pending}
                className="w-full h-11 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md shadow-orange-100 mt-2"
              >
                {pending ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    {isSignUp ? 'Creating account…' : 'Signing in…'}
                  </>
                ) : isSignUp ? (
                  'Create Account & Start Cooking 🍲'
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </div>

          {/* Switch mode */}
          <p className="text-center text-sm text-gray-500 mt-6">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <Link
              href={`${isSignUp ? '/sign-in' : '/sign-up'}${
                redirect ? `?redirect=${redirect}` : ''
              }${priceId ? `${redirect ? '&' : '?'}priceId=${priceId}` : ''}`}
              className="font-semibold text-orange-600 hover:text-orange-700 hover:underline"
            >
              {isSignUp ? 'Sign in' : 'Create a free account'}
            </Link>
          </p>

          {/* Back to home */}
          <p className="text-center mt-3">
            <Link
              href="/"
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← Back to Home Korean Recipes
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
