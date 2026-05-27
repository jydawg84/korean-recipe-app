import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Login } from '../login';

export const metadata: Metadata = {
  title: 'Sign In — Home Korean Recipes',
  description: 'Sign in to your Home Korean Recipes account and access your recipe library.'
};

export default function SignInPage() {
  return (
    <Suspense>
      <Login mode="signin" />
    </Suspense>
  );
}
