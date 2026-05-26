'use server';

import { redirect } from 'next/navigation';
import {
  createCheckoutSession,
  createCustomerPortalSession,
  createLifetimeCheckoutSession
} from './stripe';
import { withTeam } from '@/lib/auth/middleware';
import { getTeamForUser } from '@/lib/db/queries';

export const checkoutAction = withTeam(async (formData, team) => {
  const priceId = formData.get('priceId') as string;
  await createCheckoutSession({ team: team, priceId });
});

export const customerPortalAction = withTeam(async (_, team) => {
  const portalSession = await createCustomerPortalSession(team);
  redirect(portalSession.url);
});

export async function lifetimeCheckoutAction() {
  const team = await getTeamForUser();
  await createLifetimeCheckoutSession(team);
}
