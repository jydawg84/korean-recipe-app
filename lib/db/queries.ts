import { desc, and, eq, isNull } from 'drizzle-orm';
import { db } from './drizzle';
import { activityLogs, teamMembers, teams, users, recipes } from './schema';
import type { RecipeData } from './schema';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/session';

export async function getUser() {
  const sessionCookie = (await cookies()).get('session');
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  const sessionData = await verifyToken(sessionCookie.value);
  if (
    !sessionData ||
    !sessionData.user ||
    typeof sessionData.user.id !== 'number'
  ) {
    return null;
  }

  if (new Date(sessionData.expires) < new Date()) {
    return null;
  }

  const user = await db
    .select()
    .from(users)
    .where(and(eq(users.id, sessionData.user.id), isNull(users.deletedAt)))
    .limit(1);

  if (user.length === 0) {
    return null;
  }

  return user[0];
}

export async function getTeamByStripeCustomerId(customerId: string) {
  const result = await db
    .select()
    .from(teams)
    .where(eq(teams.stripeCustomerId, customerId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updateTeamSubscription(
  teamId: number,
  subscriptionData: {
    stripeSubscriptionId: string | null;
    stripeProductId: string | null;
    planName: string | null;
    subscriptionStatus: string;
  }
) {
  await db
    .update(teams)
    .set({
      ...subscriptionData,
      updatedAt: new Date()
    })
    .where(eq(teams.id, teamId));
}

export async function getUserWithTeam(userId: number) {
  const result = await db
    .select({
      user: users,
      teamId: teamMembers.teamId
    })
    .from(users)
    .leftJoin(teamMembers, eq(users.id, teamMembers.userId))
    .where(eq(users.id, userId))
    .limit(1);

  return result[0];
}

export async function getActivityLogs() {
  const user = await getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  return await db
    .select({
      id: activityLogs.id,
      action: activityLogs.action,
      timestamp: activityLogs.timestamp,
      ipAddress: activityLogs.ipAddress,
      userName: users.name
    })
    .from(activityLogs)
    .leftJoin(users, eq(activityLogs.userId, users.id))
    .where(eq(activityLogs.userId, user.id))
    .orderBy(desc(activityLogs.timestamp))
    .limit(10);
}

export async function getTeamForUser() {
  const user = await getUser();
  if (!user) {
    return null;
  }

  const result = await db.query.teamMembers.findFirst({
    where: eq(teamMembers.userId, user.id),
    with: {
      team: {
        with: {
          teamMembers: {
            with: {
              user: {
                columns: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          }
        }
      }
    }
  });

  return result?.team || null;
}

// ─── Recipe queries ───────────────────────────────────────────────────────────

export async function getUserRecipes(userId: number) {
  return await db
    .select()
    .from(recipes)
    .where(eq(recipes.userId, userId))
    .orderBy(desc(recipes.createdAt));
}

export async function getSavedRecipes(userId: number) {
  return await db
    .select()
    .from(recipes)
    .where(and(eq(recipes.userId, userId), eq(recipes.isSaved, true)))
    .orderBy(desc(recipes.createdAt));
}

export async function getRecipeById(id: number, userId: number) {
  const result = await db
    .select()
    .from(recipes)
    .where(and(eq(recipes.id, id), eq(recipes.userId, userId)))
    .limit(1);

  return result[0] || null;
}

export async function createRecipe(
  userId: number,
  recipeData: RecipeData,
  scanInput: string
) {
  const [recipe] = await db
    .insert(recipes)
    .values({
      userId,
      recipeData: JSON.stringify(recipeData),
      scanInput,
      isSaved: false
    })
    .returning();

  return recipe;
}

export async function toggleSaveRecipe(id: number, userId: number, isSaved: boolean) {
  await db
    .update(recipes)
    .set({ isSaved })
    .where(and(eq(recipes.id, id), eq(recipes.userId, userId)));
}

export async function incrementScanCount(userId: number) {
  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (user.length > 0) {
    await db
      .update(users)
      .set({ scanCount: user[0].scanCount + 1 })
      .where(eq(users.id, userId));
  }
}

export async function setLifetimeAccess(teamId: number) {
  await db
    .update(teams)
    .set({ lifetimeAccess: true, updatedAt: new Date() })
    .where(eq(teams.id, teamId));
}
