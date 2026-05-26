import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getUser, getUserRecipes } from '@/lib/db/queries';
import { RecipeCard } from '@/components/recipe-card';
import { Button } from '@/components/ui/button';
import { ScanLine, BookOpen } from 'lucide-react';
import type { RecipeData } from '@/lib/db/schema';

export default async function MyRecipesPage() {
  const user = await getUser();
  if (!user) redirect('/sign-in');

  const rows = await getUserRecipes(user.id);
  const recipes = rows.map((r) => ({
    id: r.id,
    recipe: JSON.parse(r.recipeData) as RecipeData,
    isSaved: r.isSaved,
    createdAt: r.createdAt
  }));

  const saved = recipes.filter((r) => r.isSaved);
  const recent = recipes.filter((r) => !r.isSaved);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-orange-500" />
            My Recipe Library
          </h1>
          <p className="text-gray-500 mt-1">
            {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} generated
          </p>
        </div>
        <Button
          asChild
          className="rounded-full bg-orange-500 hover:bg-orange-600 text-white hidden sm:flex"
        >
          <Link href="/scan">
            <ScanLine className="mr-2 h-4 w-4" /> New Scan
          </Link>
        </Button>
      </div>

      {recipes.length === 0 ? (
        /* Empty state */
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🍲</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No recipes yet!</h2>
          <p className="text-gray-500 mb-6">
            Scan your ingredients to generate your first authentic Korean recipe.
          </p>
          <Button
            asChild
            className="rounded-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Link href="/scan">
              <ScanLine className="mr-2 h-4 w-4" /> Scan Ingredients
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Saved recipes */}
          {saved.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>❤️</span> Saved Favourites
                <span className="text-sm font-normal text-gray-400">({saved.length})</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {saved.map((r) => (
                  <RecipeCard key={r.id} {...r} />
                ))}
              </div>
            </section>
          )}

          {/* Recent unsaved */}
          {recent.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>🕐</span> Recently Generated
                <span className="text-sm font-normal text-gray-400">({recent.length})</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {recent.map((r) => (
                  <RecipeCard key={r.id} {...r} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Mobile scan button */}
      <div className="sm:hidden mt-8">
        <Button
          asChild
          className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold h-12"
        >
          <Link href="/scan">
            <ScanLine className="mr-2 h-5 w-5" /> Scan New Ingredients
          </Link>
        </Button>
      </div>
    </div>
  );
}
