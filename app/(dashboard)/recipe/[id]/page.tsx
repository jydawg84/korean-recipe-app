import { notFound, redirect } from 'next/navigation';
import { getUser, getRecipeById } from '@/lib/db/queries';
import type { RecipeData } from '@/lib/db/schema';
import RecipeDisplay from './recipe-display';

export default async function RecipePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser();
  if (!user) redirect('/sign-in');

  const recipeRow = await getRecipeById(Number(id), user.id);
  if (!recipeRow) notFound();

  const recipeData: RecipeData = JSON.parse(recipeRow.recipeData);

  return (
    <RecipeDisplay
      recipe={recipeData}
      recipeId={recipeRow.id}
      isSaved={recipeRow.isSaved}
    />
  );
}
