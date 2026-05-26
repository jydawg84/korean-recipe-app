'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Clock,
  Users,
  ChefHat,
  Heart,
  HeartOff,
  ShoppingCart,
  ArrowLeft,
  ScanLine,
  Baby,
  Leaf,
  Flame,
  Check,
  Info
} from 'lucide-react';
import type { RecipeData } from '@/lib/db/schema';

interface RecipeDisplayProps {
  recipe: RecipeData;
  recipeId: number;
  isSaved: boolean;
}

export default function RecipeDisplay({ recipe, recipeId, isSaved: initialSaved }: RecipeDisplayProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [isSaving, setIsSaving] = useState(false);
  const [toddlerMode, setToddlerMode] = useState(false);
  const [copiedList, setCopiedList] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/recipes/${recipeId}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isSaved: !saved })
      });
      if (res.ok) setSaved(!saved);
    } finally {
      setIsSaving(false);
    }
  };

  const copyShoppingList = async () => {
    const list = recipe.shoppingList.map((i) => `• ${i}`).join('\n');
    await navigator.clipboard.writeText(`Shopping list for ${recipe.nameRomanized}:\n\n${list}`);
    setCopiedList(true);
    setTimeout(() => setCopiedList(false), 2000);
  };

  const difficultyColor = {
    Easy: 'green',
    Medium: 'amber',
    Hard: 'red'
  }[recipe.difficulty] as 'green' | 'amber' | 'red';

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-16">
      {/* Back link */}
      <Link
        href="/scan"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-5 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Scanner
      </Link>

      {/* Hero card */}
      <div
        className={`rounded-3xl bg-gradient-to-br ${recipe.color || 'from-amber-400 to-orange-500'} p-8 text-white mb-6 shadow-xl`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="text-5xl mb-3">{recipe.emoji}</div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">{recipe.nameRomanized}</h1>
            <p className="text-white/80 text-lg font-medium mb-1">{recipe.nameKorean}</p>
            <p className="text-white/70 text-sm">{recipe.nameEnglish}</p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="ml-4 p-3 bg-white/20 hover:bg-white/30 rounded-full transition-all active:scale-95"
            title={saved ? 'Remove from saved' : 'Save recipe'}
          >
            {saved ? (
              <Heart className="h-6 w-6 fill-white text-white" />
            ) : (
              <HeartOff className="h-6 w-6 text-white" />
            )}
          </button>
        </div>

        {/* Stats bar */}
        <div className="mt-5 flex flex-wrap gap-3">
          <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1.5 text-sm">
            <Clock className="h-4 w-4" />
            <span>{recipe.prepTime + recipe.cookTime} min</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1.5 text-sm">
            <Users className="h-4 w-4" />
            <span>Serves {recipe.servings}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1.5 text-sm">
            <ChefHat className="h-4 w-4" />
            <span>{recipe.difficulty}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1.5 text-sm">
            <Flame className="h-4 w-4" />
            <span>{recipe.nutrition.calories} cal</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-base leading-relaxed mb-5">{recipe.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {recipe.tags?.map((tag) => (
          <Badge key={tag} variant="amber" className="rounded-full">
            {tag}
          </Badge>
        ))}
      </div>

      {/* Toddler toggle */}
      <div className="flex items-center justify-between bg-rose-50 border border-rose-200 rounded-2xl p-4 mb-6">
        <div className="flex items-center gap-2">
          <Baby className="h-5 w-5 text-rose-500" />
          <div>
            <p className="font-semibold text-gray-800 text-sm">Toddler-Friendly Mode</p>
            <p className="text-xs text-gray-500">Adjust recipe for little ones</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="toddler"
            checked={toddlerMode}
            onCheckedChange={setToddlerMode}
            className="data-[state=checked]:bg-rose-500"
          />
          <Label htmlFor="toddler" className="sr-only">Toddler mode</Label>
        </div>
      </div>

      {/* Toddler tips panel */}
      {toddlerMode && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 mb-6">
          <h3 className="font-bold text-rose-700 flex items-center gap-2 mb-3">
            <Baby className="h-4 w-4" /> Toddler Adaptation Tips
          </h3>
          <p className="text-gray-700 text-sm mb-3 leading-relaxed">{recipe.toddlerTips}</p>
          {recipe.toddlerIngredientSwaps?.length > 0 && (
            <ul className="space-y-1.5">
              {recipe.toddlerIngredientSwaps.map((swap) => (
                <li key={swap} className="flex items-start gap-2 text-sm text-gray-700">
                  <Check className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                  {swap}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Main tabs */}
      <Tabs defaultValue="ingredients">
        <TabsList className="w-full bg-amber-50 border border-amber-100 rounded-xl p-1 mb-5">
          <TabsTrigger
            value="ingredients"
            className="flex-1 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm rounded-lg"
          >
            Ingredients
          </TabsTrigger>
          <TabsTrigger
            value="instructions"
            className="flex-1 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm rounded-lg"
          >
            Instructions
          </TabsTrigger>
          <TabsTrigger
            value="nutrition"
            className="flex-1 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm rounded-lg"
          >
            Nutrition
          </TabsTrigger>
          <TabsTrigger
            value="shopping"
            className="flex-1 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm rounded-lg"
          >
            Shop
          </TabsTrigger>
        </TabsList>

        {/* Ingredients */}
        <TabsContent value="ingredients">
          <div className="space-y-1">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-gray-900 text-lg">
                Ingredients
                <span className="text-sm font-normal text-gray-400 ml-2">
                  for {recipe.servings} servings
                </span>
              </h2>
            </div>
            {recipe.ingredients.map((ing, i) => (
              <div
                key={i}
                className="flex items-start gap-3 py-2.5 border-b border-gray-100 last:border-0"
              >
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <Leaf className="h-3 w-3 text-orange-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-gray-800 text-sm">{ing.amount} </span>
                  <span className="text-gray-700 text-sm">{ing.item}</span>
                  {ing.note && (
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                      <Info className="h-3 w-3" /> {ing.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Instructions */}
        <TabsContent value="instructions">
          <div className="space-y-4">
            {recipe.instructions.map((inst) => (
              <div key={inst.step} className="flex gap-4">
                {/* Step number */}
                <div className="shrink-0">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${recipe.color || 'from-amber-400 to-orange-500'} flex items-center justify-center text-white font-bold text-sm shadow-sm`}
                  >
                    {inst.step}
                  </div>
                </div>
                {/* Content */}
                <div className="flex-1 pb-4 border-b border-gray-100 last:border-0">
                  <h3 className="font-bold text-gray-900 mb-1.5">{inst.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-2">{inst.text}</p>
                  {inst.tip && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-xs text-amber-800 flex gap-1.5">
                      <span className="text-base">💡</span>
                      <span>{inst.tip}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Nutrition */}
        <TabsContent value="nutrition">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Calories', value: `${recipe.nutrition.calories}`, unit: 'kcal', emoji: '🔥' },
              { label: 'Protein', value: recipe.nutrition.protein, unit: '', emoji: '💪' },
              { label: 'Carbohydrates', value: recipe.nutrition.carbs, unit: '', emoji: '🌾' },
              { label: 'Fat', value: recipe.nutrition.fat, unit: '', emoji: '🥑' },
              { label: 'Fibre', value: recipe.nutrition.fiber, unit: '', emoji: '🥦' }
            ].map((n) => (
              <div
                key={n.label}
                className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-center"
              >
                <div className="text-2xl mb-1">{n.emoji}</div>
                <div className="text-xl font-bold text-gray-900">
                  {n.value}{n.unit && <span className="text-sm font-normal"> {n.unit}</span>}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{n.label}</div>
              </div>
            ))}
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 text-center col-span-2 sm:col-span-1">
              <div className="text-2xl mb-1">⏱️</div>
              <div className="text-xl font-bold text-gray-900">
                {recipe.prepTime}
                <span className="text-sm font-normal"> min prep</span>
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                + {recipe.cookTime} min cook
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4 text-center">
            Approximate values per serving. Actual nutrition may vary based on ingredients.
          </p>
        </TabsContent>

        {/* Shopping list */}
        <TabsContent value="shopping">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 text-lg">Shopping List</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={copyShoppingList}
                className="rounded-full border-orange-200 text-orange-600 hover:bg-orange-50 text-xs"
              >
                {copiedList ? (
                  <><Check className="h-3 w-3 mr-1" /> Copied!</>
                ) : (
                  <><ShoppingCart className="h-3 w-3 mr-1" /> Copy list</>
                )}
              </Button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Items you&apos;ll likely need to buy — everything else is a pantry staple.
            </p>
            <div className="space-y-2">
              {recipe.shoppingList.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 p-3 bg-white border border-amber-100 rounded-xl"
                >
                  <div className="w-5 h-5 rounded border-2 border-orange-300 shrink-0" />
                  <span className="text-gray-800 text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Action buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className={`flex-1 rounded-xl h-12 font-bold ${
            saved
              ? 'bg-rose-500 hover:bg-rose-600 text-white'
              : 'bg-orange-500 hover:bg-orange-600 text-white'
          }`}
        >
          {saved ? (
            <><Heart className="mr-2 h-4 w-4 fill-white" /> Saved!</>
          ) : (
            <><Heart className="mr-2 h-4 w-4" /> Save Recipe</>
          )}
        </Button>
        <Button
          asChild
          variant="outline"
          className="flex-1 rounded-xl h-12 border-orange-200 text-orange-600 hover:bg-orange-50 font-bold"
        >
          <Link href="/scan">
            <ScanLine className="mr-2 h-4 w-4" /> Scan Again
          </Link>
        </Button>
      </div>
    </div>
  );
}
