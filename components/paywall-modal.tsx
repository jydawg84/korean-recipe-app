'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, Zap, Lock } from 'lucide-react';
import { lifetimeCheckoutAction, checkoutAction } from '@/lib/payments/actions';
import { useFormStatus } from 'react-dom';

function CheckoutButton({
  variant,
  children
}: {
  variant: 'monthly' | 'lifetime';
  children: React.ReactNode;
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className={
        variant === 'monthly'
          ? 'w-full rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold'
          : 'w-full rounded-full bg-gray-900 hover:bg-gray-800 text-white font-bold'
      }
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Redirecting…
        </span>
      ) : (
        children
      )}
    </Button>
  );
}

interface PaywallModalProps {
  open: boolean;
  onClose: () => void;
  monthlyPriceId?: string;
}

export function PaywallModal({ open, onClose, monthlyPriceId }: PaywallModalProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-orange-500 to-amber-500 px-6 pt-8 pb-6 text-white text-center">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Lock className="h-7 w-7 text-white" />
          </div>
          <DialogTitle className="text-white text-2xl font-bold mb-1">
            You&apos;ve used your 2 free scans!
          </DialogTitle>
          <DialogDescription className="text-orange-100 text-sm">
            Unlock unlimited Korean recipes — for less than a bowl of ramen 🍜
          </DialogDescription>
        </div>

        {/* Plans */}
        <div className="p-6 space-y-4">
          {/* Monthly */}
          <div className="relative rounded-2xl border-2 border-orange-400 p-5 bg-orange-50">
            <span className="absolute -top-3 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              MOST POPULAR
            </span>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-bold text-gray-900 text-lg">Monthly</p>
                <p className="text-sm text-gray-500">Cancel anytime</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold text-gray-900">$2.99</span>
                <span className="text-gray-500 text-sm">/mo</span>
              </div>
            </div>
            <ul className="space-y-1.5 mb-4">
              {['Unlimited recipe scans', 'AI image scanning', 'Save recipes library', 'Shopping lists'].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="h-4 w-4 text-orange-500 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            {monthlyPriceId ? (
              <form action={checkoutAction}>
                <input type="hidden" name="priceId" value={monthlyPriceId} />
                <CheckoutButton variant="monthly">
                  <Sparkles className="mr-2 h-4 w-4" /> Start Monthly – $2.99/mo
                </CheckoutButton>
              </form>
            ) : (
              <Button
                asChild
                className="w-full rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold"
              >
                <a href="/pricing">Start Monthly – $2.99/mo</a>
              </Button>
            )}
          </div>

          {/* Lifetime */}
          <div className="rounded-2xl border border-gray-200 p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-bold text-gray-900 text-lg">Lifetime Access</p>
                <p className="text-sm text-gray-500">Pay once, cook forever</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold text-gray-900">$6.99</span>
                <span className="text-gray-500 text-sm"> once</span>
              </div>
            </div>
            <ul className="space-y-1.5 mb-4">
              {['Everything in Monthly', 'All future features', 'Best value for families'].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="h-4 w-4 text-gray-500 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <form action={lifetimeCheckoutAction}>
              <CheckoutButton variant="lifetime">
                <Zap className="mr-2 h-4 w-4" /> Get Lifetime Access – $6.99
              </CheckoutButton>
            </form>
          </div>

          <p className="text-center text-xs text-gray-400">
            Secure payment via Stripe · 30-day money-back guarantee
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
