import Link from 'next/link';
import { Clock, ChefHat, Heart } from 'lucide-react';
import type { RecipeData } from '@/lib/db/schema';

interface RecipeCardProps {
  id: number;
  recipe: RecipeData;
  isSaved: boolean;
  createdAt: Date;
}

export function RecipeCard({ id, recipe, isSaved, createdAt }: RecipeCardProps) {
  const totalTime = recipe.prepTime + recipe.cookTime;
  const dateStr = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });

  return (
    <Link href={`/recipe/${id}`} className="block group">
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-200">
        {/* Colourful header */}
        <div
          className={`h-28 bg-gradient-to-br ${recipe.color || 'from-amber-400 to-orange-500'} flex items-center justify-center relative`}
        >
          <span className="text-5xl">{recipe.emoji}</span>
          {isSaved && (
            <div className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 shadow-sm">
              <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-gray-900 text-sm leading-tight">
              {recipe.nameRomanized}
            </h3>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                recipe.difficulty === 'Easy'
                  ? 'bg-green-100 text-green-700'
                  : recipe.difficulty === 'Medium'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {recipe.difficulty}
            </span>
          </div>
          <p className="text-xs text-gray-400 mb-2">{recipe.nameKorean}</p>
          <p className="text-xs text-gray-600 line-clamp-2 mb-3 leading-relaxed">
            {recipe.description}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {totalTime}m
              </span>
              <span className="flex items-center gap-1">
                <ChefHat className="h-3 w-3" /> {recipe.servings} servings
              </span>
            </div>
            <span>{dateStr}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
