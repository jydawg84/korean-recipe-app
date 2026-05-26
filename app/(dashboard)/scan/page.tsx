'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PaywallModal } from '@/components/paywall-modal';
import {
  Camera,
  FileText,
  Loader2,
  Upload,
  Sparkles,
  X,
  Image as ImageIcon,
  ChefHat,
  Lightbulb
} from 'lucide-react';

const EXAMPLE_INGREDIENTS = [
  'Tofu, zucchini, mushrooms, doenjang paste, green onion, garlic',
  'Kimchi, pork belly, tofu, gochugaru, sesame oil',
  'Rice, eggs, spinach, bean sprouts, carrots, gochujang',
  'Glass noodles, beef, spinach, mushrooms, soy sauce, sesame oil'
];

export default function ScanPage() {
  const router = useRouter();
  const [ingredients, setIngredients] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.');
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target?.result as string);
    reader.readAsDataURL(file);
    setError(null);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleGenerate = async (type: 'text' | 'image') => {
    const input = type === 'text' ? ingredients.trim() : '';
    if (type === 'text' && !input) {
      setError('Please enter your ingredients first.');
      return;
    }
    if (type === 'image' && !image) {
      setError('Please upload a photo first.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const body =
        type === 'text'
          ? { ingredients: input, type: 'text' }
          : {
              image: image!.split(',')[1], // strip data: prefix
              imageType: imageFile?.type || 'image/jpeg',
              type: 'image'
            };

      const res = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.status === 402) {
        setShowPaywall(true);
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to generate recipe');
      }

      const { recipeId } = await res.json();
      router.push(`/recipe/${recipeId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Paywall */}
      <PaywallModal open={showPaywall} onClose={() => setShowPaywall(false)} />

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-2xl mb-4">
          <ChefHat className="h-8 w-8 text-orange-500" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          What&apos;s in Your Kitchen?
        </h1>
        <p className="text-gray-500">
          Snap your fridge or list your ingredients — we&apos;ll find the perfect Korean recipe.
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="text" className="w-full">
        <TabsList className="w-full bg-amber-50 border border-amber-100 p-1 rounded-xl mb-6">
          <TabsTrigger
            value="text"
            className="flex-1 data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm rounded-lg gap-2"
          >
            <FileText className="h-4 w-4" />
            Type Ingredients
          </TabsTrigger>
          <TabsTrigger
            value="image"
            className="flex-1 data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm rounded-lg gap-2"
          >
            <Camera className="h-4 w-4" />
            Photo Scan
          </TabsTrigger>
        </TabsList>

        {/* Text input tab */}
        <TabsContent value="text">
          <div className="space-y-4">
            <div>
              <Textarea
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="e.g. tofu, zucchini, doenjang paste, green onion, garlic, mushrooms..."
                className="min-h-[140px] text-base border-amber-200 focus-visible:ring-orange-300 focus-visible:border-orange-400 rounded-xl"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-400 mt-1.5">
                Separate ingredients with commas. Be as specific as you like!
              </p>
            </div>

            {/* Example prompts */}
            <div>
              <p className="text-xs font-medium text-gray-400 mb-2 flex items-center gap-1">
                <Lightbulb className="h-3 w-3" /> Try an example:
              </p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_INGREDIENTS.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => setIngredients(ex)}
                    className="text-xs bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 px-3 py-1.5 rounded-full transition-colors text-left"
                  >
                    {ex.split(',').slice(0, 3).join(', ')}…
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={() => handleGenerate('text')}
              disabled={isLoading || !ingredients.trim()}
              className="w-full rounded-xl h-12 bg-orange-500 hover:bg-orange-600 text-white font-bold text-base shadow-md shadow-orange-100"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Finding your recipe…
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Korean Recipe
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        {/* Image tab */}
        <TabsContent value="image">
          <div className="space-y-4">
            {!image ? (
              <div
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer ${
                  isDragging
                    ? 'border-orange-400 bg-orange-50'
                    : 'border-amber-200 hover:border-orange-300 hover:bg-amber-50/50'
                }`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-14 h-14 bg-orange-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <ImageIcon className="h-7 w-7 text-orange-400" />
                </div>
                <p className="font-medium text-gray-700 mb-1">
                  Drop a photo here, or click to browse
                </p>
                <p className="text-sm text-gray-400 mb-4">
                  Take a picture of your open fridge, pantry, or counter
                </p>
                <div className="flex gap-2 justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full border-orange-200 text-orange-600 hover:bg-orange-50"
                  >
                    <Upload className="mr-2 h-4 w-4" /> Upload Photo
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full border-orange-200 text-orange-600 hover:bg-orange-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.capture = 'environment';
                      input.onchange = (ev) => {
                        const f = (ev.target as HTMLInputElement).files?.[0];
                        if (f) handleFile(f);
                      };
                      input.click();
                    }}
                  >
                    <Camera className="mr-2 h-4 w-4" /> Take Photo
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileInput}
                />
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border border-amber-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt="Your ingredients"
                  className="w-full max-h-64 object-cover"
                />
                <button
                  onClick={() => { setImage(null); setImageFile(null); }}
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-3">
                  <p className="text-white text-sm font-medium">Photo ready ✓</p>
                </div>
              </div>
            )}

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800 flex gap-2">
              <span className="text-lg shrink-0">💡</span>
              <p>
                For best results, make sure your photo is well-lit and ingredients are visible.
                {!process.env.NEXT_PUBLIC_HAS_AI && (
                  <span className="block mt-1 text-amber-600">
                    AI image scanning requires an Anthropic API key. Alternatively, switch to &quot;Type Ingredients&quot;.
                  </span>
                )}
              </p>
            </div>

            <Button
              onClick={() => handleGenerate('image')}
              disabled={isLoading || !image}
              className="w-full rounded-xl h-12 bg-orange-500 hover:bg-orange-600 text-white font-bold text-base shadow-md shadow-orange-100"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Scanning your fridge…
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Scan &amp; Get Recipe
                </>
              )}
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Error */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Loading overlay */}
      {isLoading && (
        <div className="mt-6 p-6 bg-orange-50 border border-orange-100 rounded-2xl text-center">
          <div className="flex justify-center gap-2 text-3xl mb-3 animate-bounce">
            <span>🥘</span>
            <span>🥢</span>
            <span>🍲</span>
          </div>
          <p className="font-medium text-orange-700">
            Our AI chef is crafting your recipe…
          </p>
          <p className="text-sm text-orange-500 mt-1">
            Finding the perfect authentic Korean dish for your ingredients
          </p>
        </div>
      )}

      {/* Bottom hint */}
      <p className="text-center text-xs text-gray-400 mt-8">
        Your first 2 scans are free. Unlock unlimited scans from $2.99/month.
      </p>
    </div>
  );
}
