import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Login } from '../login';

export const metadata: Metadata = {
  title: 'Create Account — Home Korean Recipes',
  description:
    'Sign up for free and get 2 AI-powered Korean recipe scans. No credit card required.'
};

export default function SignUpPage() {
  return (
    <Suspense>
      <Login mode="signup" />
    </Suspense>
  );
}
