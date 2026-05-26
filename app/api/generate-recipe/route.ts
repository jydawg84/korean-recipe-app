import { NextRequest, NextResponse } from 'next/server';
import {
  getUser,
  getTeamForUser,
  createRecipe,
  incrementScanCount
} from '@/lib/db/queries';
import type { RecipeData } from '@/lib/db/schema';

// ─── Demo recipes ─────────────────────────────────────────────────────────────
const DEMO_RECIPES: RecipeData[] = [
  {
    name: 'Doenjang Jjigae (된장찌개)',
    nameKorean: '된장찌개',
    nameRomanized: 'Doenjang Jjigae',
    nameEnglish: 'Korean Fermented Soybean Paste Stew',
    description:
      'The ultimate Korean comfort stew — deeply savoury, umami-packed, and made with fermented soybean paste, soft tofu, zucchini, and mushrooms. This is the dish every Korean mum makes at least once a week.',
    category: 'jjigae',
    difficulty: 'Easy',
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    emoji: '🍲',
    color: 'from-amber-400 to-orange-500',
    ingredients: [
      { amount: '3 cups', item: 'water or anchovy broth', note: 'broth adds more depth' },
      { amount: '2 tbsp', item: 'doenjang (Korean fermented soybean paste)' },
      { amount: '1 tsp', item: 'gochujang (optional)', note: 'for a little heat' },
      { amount: '200g', item: 'firm tofu', note: 'cut into 2cm cubes' },
      { amount: '1 medium', item: 'zucchini', note: 'sliced into half-moons' },
      { amount: '100g', item: 'mushrooms', note: 'shiitake or button, sliced' },
      { amount: '1 medium', item: 'potato', note: 'peeled and cubed (optional)' },
      { amount: '3 cloves', item: 'garlic', note: 'minced' },
      { amount: '2 stalks', item: 'green onion', note: 'chopped' },
      { amount: '1 tsp', item: 'sesame oil', note: 'to finish' }
    ],
    instructions: [
      {
        step: 1,
        title: 'Prepare the broth base',
        text: 'Bring 3 cups of water or anchovy broth to a boil in a medium pot. Add the minced garlic.',
        tip: 'For a richer stew, make quick anchovy broth: simmer 5-6 dried anchovies for 10 minutes.'
      },
      {
        step: 2,
        title: 'Dissolve the doenjang',
        text: 'Add 2 tbsp doenjang to the boiling broth. Use the back of a spoon to dissolve it fully. Add gochujang if using. Taste and adjust — it should be salty and complex.',
        tip: 'Start with 1.5 tbsp and add more to taste. Different doenjang brands vary in saltiness.'
      },
      {
        step: 3,
        title: 'Add vegetables',
        text: 'Add potato cubes (if using) first and cook for 5 minutes. Then add zucchini and mushrooms. Simmer on medium for 5 more minutes.',
        tip: 'Cut everything roughly the same size so they cook evenly.'
      },
      {
        step: 4,
        title: 'Add tofu and finish',
        text: 'Gently add tofu cubes. Simmer for 3 minutes — don\'t stir too vigorously or tofu will break. Add green onion.',
        tip: 'Add the sesame oil right before serving for the best aroma.'
      },
      {
        step: 5,
        title: 'Serve',
        text: 'Drizzle with sesame oil. Serve bubbling hot alongside a bowl of rice and kimchi. The stew should be deeply savoury, not watery.',
        tip: 'In Korea, doenjang jjigae is always served in the earthenware pot (뚝배기) it was cooked in.'
      }
    ],
    nutrition: {
      calories: 145,
      protein: '11g',
      carbs: '12g',
      fat: '6g',
      fiber: '2g'
    },
    toddlerTips:
      'Reduce doenjang to 1 tbsp and skip the gochujang entirely for a milder flavour your little one will love. The soft tofu and tender vegetables are perfect for toddlers.',
    toddlerIngredientSwaps: [
      'Use 1 tbsp doenjang instead of 2',
      'Skip the gochujang',
      'Cut tofu into smaller pieces',
      'Make sure zucchini is fully cooked soft'
    ],
    shoppingList: ['doenjang (Korean soybean paste)', 'firm tofu', 'zucchini', 'shiitake mushrooms', 'sesame oil'],
    tags: ['comfort food', 'weeknight dinner', 'vegetarian-adaptable', 'quick']
  },
  {
    name: 'Kimchi Jjigae (김치찌개)',
    nameKorean: '김치찌개',
    nameRomanized: 'Kimchi Jjigae',
    nameEnglish: 'Kimchi Stew',
    description:
      'A bold, spicy, tangy stew made with well-fermented kimchi and pork. This is Korea\'s most beloved stew, perfect for cold days and using up old kimchi.',
    category: 'jjigae',
    difficulty: 'Easy',
    prepTime: 10,
    cookTime: 25,
    servings: 4,
    emoji: '🌶️',
    color: 'from-red-400 to-rose-600',
    ingredients: [
      { amount: '300g', item: 'aged kimchi', note: 'the older the better — at least 2 weeks' },
      { amount: '200g', item: 'pork belly or shoulder', note: 'sliced into bite-sized pieces' },
      { amount: '200g', item: 'firm tofu', note: 'cut into thick slabs' },
      { amount: '2 cups', item: 'kimchi juice + water', note: '½ cup kimchi brine, 1.5 cups water' },
      { amount: '1 tbsp', item: 'gochugaru (Korean chili flakes)' },
      { amount: '1 tbsp', item: 'soy sauce' },
      { amount: '1 tsp', item: 'sugar' },
      { amount: '3 cloves', item: 'garlic', note: 'minced' },
      { amount: '1 stalk', item: 'green onion', note: 'chopped' },
      { amount: '1 tsp', item: 'sesame oil' }
    ],
    instructions: [
      {
        step: 1,
        title: 'Brown the pork',
        text: 'In a pot over medium-high heat, cook the pork pieces until slightly browned, about 3 minutes. No need for oil if using pork belly.',
        tip: 'Browning adds depth to the final stew.'
      },
      {
        step: 2,
        title: 'Add kimchi and spice',
        text: 'Add the kimchi and gochugaru. Stir and cook together with the pork for 2 minutes so the kimchi becomes aromatic.',
      },
      {
        step: 3,
        title: 'Add liquid and simmer',
        text: 'Pour in the kimchi brine and water. Add garlic, soy sauce, and sugar. Bring to a boil, then reduce to a simmer for 15 minutes.',
        tip: 'The longer it simmers, the richer the flavour. 20-30 minutes is ideal.'
      },
      {
        step: 4,
        title: 'Add tofu and serve',
        text: 'Add tofu slabs and simmer 3 more minutes. Add green onion and sesame oil. Serve with a big bowl of rice.',
      }
    ],
    nutrition: {
      calories: 220,
      protein: '18g',
      carbs: '8g',
      fat: '13g',
      fiber: '3g'
    },
    toddlerTips:
      'Make a small separate portion using young, less-spicy kimchi. Skip extra gochugaru. Rinse the kimchi briefly under water to reduce spiciness before cooking.',
    toddlerIngredientSwaps: [
      'Use young/fresh kimchi instead of aged',
      'Skip gochugaru entirely',
      'Reduce kimchi brine to ¼ cup and use more water',
      'Serve the pork and tofu separately before adding spices'
    ],
    shoppingList: ['aged kimchi', 'pork belly', 'gochugaru', 'tofu', 'sesame oil'],
    tags: ['spicy', 'comfort food', 'pork', 'fermented']
  },
  {
    name: 'Bibimbap (비빔밥)',
    nameKorean: '비빔밥',
    nameRomanized: 'Bibimbap',
    nameEnglish: 'Korean Mixed Rice Bowl',
    description:
      'A vibrant, colourful bowl of steamed rice topped with an array of sautéed and seasoned vegetables, a fried egg, and a drizzle of gochujang sauce. Mix everything together and enjoy!',
    category: 'rice',
    difficulty: 'Medium',
    prepTime: 20,
    cookTime: 20,
    servings: 2,
    emoji: '🥗',
    color: 'from-green-400 to-emerald-500',
    ingredients: [
      { amount: '2 cups', item: 'cooked short-grain rice', note: 'warm' },
      { amount: '2', item: 'eggs' },
      { amount: '100g', item: 'spinach', note: 'blanched and squeezed dry' },
      { amount: '1 cup', item: 'bean sprouts', note: 'blanched' },
      { amount: '1 medium', item: 'carrot', note: 'julienned' },
      { amount: '100g', item: 'mushrooms', note: 'sliced and sautéed' },
      { amount: '1 medium', item: 'zucchini', note: 'julienned' },
      { amount: '2 tbsp', item: 'gochujang', note: 'for the sauce' },
      { amount: '1 tbsp', item: 'sesame oil' },
      { amount: '1 tsp', item: 'sugar' },
      { amount: '2 tsp', item: 'soy sauce' },
      { amount: '1 tbsp', item: 'sesame seeds' }
    ],
    instructions: [
      {
        step: 1,
        title: 'Season vegetables separately',
        text: 'Season blanched spinach with ½ tsp sesame oil, salt, garlic. Season bean sprouts with ½ tsp sesame oil, salt. Sauté carrot, zucchini, and mushrooms separately with a pinch of salt.',
        tip: 'Each topping is seasoned and cooked separately — this is the secret to great bibimbap.'
      },
      {
        step: 2,
        title: 'Make gochujang sauce',
        text: 'Mix 2 tbsp gochujang, 1 tbsp sesame oil, 1 tsp sugar, 1 tsp soy sauce, and 1 tbsp water until smooth.',
      },
      {
        step: 3,
        title: 'Fry eggs sunny-side up',
        text: 'Fry eggs in a little sesame oil, keeping yolk runny.',
        tip: 'The runny yolk mixes into the rice and acts as a sauce.'
      },
      {
        step: 4,
        title: 'Assemble and mix',
        text: 'Place rice in a bowl. Arrange all vegetable toppings in sections around the bowl. Place egg in the centre. Add a dollop of gochujang sauce. Sprinkle sesame seeds. Mix everything together before eating!',
        tip: 'For authentic bibimbap, use a hot stone bowl (dolsot) — the rice crisps up at the bottom!'
      }
    ],
    nutrition: {
      calories: 380,
      protein: '14g',
      carbs: '58g',
      fat: '12g',
      fiber: '5g'
    },
    toddlerTips:
      'Skip the gochujang sauce and instead use a tiny bit of sesame oil and soy sauce. Toddlers love the colourful veggies arranged separately so they can explore different tastes.',
    toddlerIngredientSwaps: [
      'Skip gochujang sauce entirely',
      'Use just sesame oil and soy sauce for seasoning',
      'Cut vegetables smaller',
      'Scramble the egg instead of leaving it runny'
    ],
    shoppingList: ['gochujang', 'sesame oil', 'sesame seeds', 'short-grain rice', 'bean sprouts'],
    tags: ['colourful', 'healthy', 'vegetarian', 'balanced meal']
  },
  {
    name: 'Japchae (잡채)',
    nameKorean: '잡채',
    nameRomanized: 'Japchae',
    nameEnglish: 'Korean Glass Noodles',
    description:
      'Sweet, savoury glass noodles stir-fried with colourful vegetables and beef. A festive Korean dish that\'s equally wonderful for weeknight dinners.',
    category: 'noodle',
    difficulty: 'Medium',
    prepTime: 20,
    cookTime: 20,
    servings: 4,
    emoji: '🍜',
    color: 'from-purple-400 to-violet-500',
    ingredients: [
      { amount: '200g', item: 'dangmyeon (sweet potato glass noodles)' },
      { amount: '150g', item: 'beef sirloin', note: 'thinly sliced, or substitute mushrooms' },
      { amount: '1 medium', item: 'carrot', note: 'julienned' },
      { amount: '1 medium', item: 'onion', note: 'thinly sliced' },
      { amount: '100g', item: 'spinach', note: 'blanched' },
      { amount: '100g', item: 'mushrooms', note: 'shiitake, sliced' },
      { amount: '3 tbsp', item: 'soy sauce' },
      { amount: '2 tbsp', item: 'sesame oil' },
      { amount: '1.5 tbsp', item: 'sugar' },
      { amount: '2 cloves', item: 'garlic', note: 'minced' },
      { amount: '1 tbsp', item: 'sesame seeds' }
    ],
    instructions: [
      {
        step: 1,
        title: 'Cook the noodles',
        text: 'Boil glass noodles in salted water for 6-8 minutes until tender but slightly chewy. Drain, rinse with cold water, and cut into 15cm lengths. Toss with 1 tsp sesame oil.',
        tip: 'Don\'t overcook — these noodles should have a slight bite.'
      },
      {
        step: 2,
        title: 'Marinate and cook beef',
        text: 'Marinate beef with 1 tbsp soy sauce, ½ tbsp sugar, 1 tsp sesame oil, garlic for 10 minutes. Stir-fry in a hot pan 2-3 minutes.',
      },
      {
        step: 3,
        title: 'Sauté vegetables',
        text: 'Sauté each vegetable separately in a little oil: onion until soft, carrot until tender, mushrooms until golden. Season each lightly with salt.',
        tip: 'Cooking separately keeps each ingredient\'s colour and texture perfect.'
      },
      {
        step: 4,
        title: 'Combine and season',
        text: 'In a large bowl or wok, combine noodles, beef, and all vegetables. Add remaining soy sauce, sugar, sesame oil. Toss gently but thoroughly. Add spinach last. Garnish with sesame seeds.',
      }
    ],
    nutrition: {
      calories: 320,
      protein: '16g',
      carbs: '42g',
      fat: '9g',
      fiber: '4g'
    },
    toddlerTips:
      'Japchae is naturally mild and loved by toddlers! Just reduce soy sauce slightly. Cut noodles shorter for little ones to manage more easily.',
    toddlerIngredientSwaps: [
      'Cut noodles shorter (5-8cm)',
      'Reduce soy sauce to 2 tbsp',
      'Skip sesame seeds if nut allergy concerns'
    ],
    shoppingList: ['dangmyeon (glass noodles)', 'shiitake mushrooms', 'sesame oil', 'soy sauce'],
    tags: ['noodles', 'festive', 'crowd-pleaser', 'meal prep']
  },
  {
    name: 'Sundubu Jjigae (순두부찌개)',
    nameKorean: '순두부찌개',
    nameRomanized: 'Sundubu Jjigae',
    nameEnglish: 'Soft Tofu Stew',
    description:
      'A silky, spicy stew made with uncurdled soft tofu and your choice of seafood, pork, or vegetables. One of Korea\'s most popular restaurant dishes, easily made at home in 20 minutes.',
    category: 'jjigae',
    difficulty: 'Easy',
    prepTime: 5,
    cookTime: 15,
    servings: 2,
    emoji: '🥣',
    color: 'from-orange-400 to-red-500',
    ingredients: [
      { amount: '1 tube', item: 'sundubu (uncurdled soft tofu)', note: 'about 300g' },
      { amount: '150g', item: 'seafood mix or pork', note: 'shrimp, clams, or pork belly' },
      { amount: '1.5 tbsp', item: 'gochugaru (Korean chili flakes)' },
      { amount: '1 tbsp', item: 'sesame oil' },
      { amount: '2 cups', item: 'water or broth' },
      { amount: '2 cloves', item: 'garlic', note: 'minced' },
      { amount: '1 tsp', item: 'fish sauce or soy sauce' },
      { amount: '2', item: 'eggs', note: 'one per bowl' },
      { amount: '2 stalks', item: 'green onion', note: 'chopped' },
      { amount: '½ tsp', item: 'sugar' }
    ],
    instructions: [
      {
        step: 1,
        title: 'Make the base',
        text: 'Heat sesame oil in a small pot. Add gochugaru and garlic. Stir-fry 30 seconds over medium heat — the oil will turn red and become fragrant.',
        tip: 'This step is key. Blooming chili in oil creates the signature flavour.'
      },
      {
        step: 2,
        title: 'Add protein and liquid',
        text: 'Add seafood or pork. Stir quickly, then pour in broth/water. Add fish sauce and sugar. Bring to a boil.',
      },
      {
        step: 3,
        title: 'Add tofu and egg',
        text: 'Add tofu in large scoops using a spoon. Simmer 3 minutes. Crack an egg directly into the bubbling stew. Let it cook to your liking (slightly runny is traditional).',
        tip: 'Serve in the earthenware pot while it\'s still bubbling.'
      },
      {
        step: 4,
        title: 'Serve immediately',
        text: 'Garnish with green onion. Serve with a bowl of steamed rice. Eat the stew while it\'s still boiling in the pot!',
      }
    ],
    nutrition: {
      calories: 195,
      protein: '19g',
      carbs: '7g',
      fat: '11g',
      fiber: '1g'
    },
    toddlerTips:
      'This can be made beautifully mild! Simply skip the gochugaru and use just garlic, a little sesame oil, broth, and tofu. It becomes a delicate, nutritious tofu soup toddlers love.',
    toddlerIngredientSwaps: [
      'Skip gochugaru entirely',
      'Use vegetable broth instead of seafood broth',
      'Skip fish sauce, use ½ tsp soy sauce instead',
      'Fully cook the egg'
    ],
    shoppingList: ['sundubu (soft tofu tube)', 'gochugaru', 'sesame oil', 'seafood mix or pork', 'fish sauce'],
    tags: ['quick', 'spicy', 'protein-rich', 'restaurant favourite']
  },
  {
    name: 'Pajeon (파전)',
    nameKorean: '파전',
    nameRomanized: 'Pajeon',
    nameEnglish: 'Korean Green Onion Pancake',
    description:
      'A crispy, savoury Korean pancake loaded with green onions. A beloved rainy-day snack in Korea — the sound of rain is said to remind Koreans of the sizzle of pajeon in a pan.',
    category: 'banchan',
    difficulty: 'Easy',
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    emoji: '🥞',
    color: 'from-green-400 to-lime-500',
    ingredients: [
      { amount: '1 cup', item: 'all-purpose flour' },
      { amount: '¼ cup', item: 'rice flour', note: 'for crispiness (can use all AP flour)' },
      { amount: '1 cup', item: 'ice cold water', note: 'cold water = crispier pancake' },
      { amount: '1', item: 'egg' },
      { amount: '½ tsp', item: 'salt' },
      { amount: '8-10 stalks', item: 'green onion', note: 'cut to pan width' },
      { amount: '100g', item: 'seafood mix (optional)', note: 'shrimp, squid — makes haemul pajeon' },
      { amount: '3 tbsp', item: 'neutral oil', note: 'vegetable or sunflower oil' },
      { amount: '2 tbsp', item: 'soy sauce', note: 'for dipping sauce' },
      { amount: '1 tbsp', item: 'rice vinegar', note: 'for dipping sauce' },
      { amount: '1 tsp', item: 'sesame oil', note: 'for dipping sauce' }
    ],
    instructions: [
      {
        step: 1,
        title: 'Make the batter',
        text: 'Whisk flour, rice flour, salt, egg, and ice cold water until just combined. Don\'t overmix — lumps are fine.',
        tip: 'Using ice water creates a lighter, crispier result. Cold batter = better crunch!'
      },
      {
        step: 2,
        title: 'Make the dipping sauce',
        text: 'Mix soy sauce, rice vinegar, sesame oil, and a pinch of gochugaru. Set aside.',
      },
      {
        step: 3,
        title: 'Cook the pancake',
        text: 'Heat 2-3 tbsp oil in a frying pan until shimmering. Lay green onions flat in the pan. Pour batter over them. Add seafood on top if using. Cook on medium-high 3-4 minutes until bottom is golden and crispy.',
        tip: 'Use more oil than you think — a generous amount of oil is what creates the crispy exterior.'
      },
      {
        step: 4,
        title: 'Flip and finish',
        text: 'Flip carefully and cook another 2-3 minutes. The pancake should be golden brown and crispy on both sides. Cut into pieces and serve with dipping sauce.',
        tip: 'Press down gently while cooking the second side for maximum crispiness.'
      }
    ],
    nutrition: {
      calories: 210,
      protein: '6g',
      carbs: '28g',
      fat: '9g',
      fiber: '1g'
    },
    toddlerTips:
      'Kids love pajeon! Skip the seafood for a simpler, mild version. You can add grated carrot or corn kernels to the batter for extra nutrition. Serve cut into small squares.',
    toddlerIngredientSwaps: [
      'Skip seafood',
      'Add ¼ cup grated carrot or corn to batter',
      'Cut into small bite-sized squares',
      'Serve dipping sauce on the side (or skip it)'
    ],
    shoppingList: ['rice flour', 'green onions', 'rice vinegar', 'neutral oil'],
    tags: ['snack', 'crispy', 'easy', 'rainy day', 'vegetarian']
  }
];

// ─── Keyword matching ─────────────────────────────────────────────────────────
const RECIPE_KEYWORDS: Record<string, string[]> = {
  'Doenjang Jjigae': ['doenjang', 'soybean paste', 'miso', 'tofu', 'zucchini', 'courgette', 'mushroom'],
  'Kimchi Jjigae': ['kimchi', 'pork', 'belly', 'spicy stew'],
  'Bibimbap': ['rice', 'egg', 'carrot', 'spinach', 'bean sprout', 'gochujang', 'mixed'],
  'Japchae': ['glass noodle', 'dangmyeon', 'sweet potato noodle', 'noodle', 'beef', 'carrot'],
  'Sundubu Jjigae': ['soft tofu', 'sundubu', 'seafood', 'shrimp', 'clam', 'silken'],
  'Pajeon': ['green onion', 'spring onion', 'scallion', 'flour', 'pancake', 'pa']
};

function pickBestRecipe(ingredients: string): RecipeData {
  const lower = ingredients.toLowerCase();
  let bestScore = 0;
  let bestName = 'Doenjang Jjigae';

  for (const [name, keywords] of Object.entries(RECIPE_KEYWORDS)) {
    const score = keywords.filter((kw) => lower.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestName = name;
    }
  }

  return DEMO_RECIPES.find((r) => r.nameEnglish.includes(bestName) || r.nameRomanized.includes(bestName))
    ?? DEMO_RECIPES[0];
}

// ─── Claude generation ────────────────────────────────────────────────────────
async function generateWithClaude(
  ingredients: string,
  imageBase64?: string,
  imageType?: string
): Promise<RecipeData> {
  const Anthropic = (await import('@anthropic-ai/sdk')).default;
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const systemPrompt = `You are an expert Korean home cooking chef specialising in authentic home-style Korean cuisine.
Given a list of ingredients, you suggest one perfect authentic Korean home recipe.

IMPORTANT: Return ONLY a valid JSON object — no markdown, no commentary, no code fences.

Use this exact structure:
{
  "name": "Recipe Name (한국어)",
  "nameKorean": "한국어",
  "nameRomanized": "Romanized Name",
  "nameEnglish": "English Name",
  "description": "2-3 sentence description (warm, homey tone)",
  "category": "jjigae|banchan|main|rice|noodle|soup|snack",
  "difficulty": "Easy|Medium|Hard",
  "prepTime": <number in minutes>,
  "cookTime": <number in minutes>,
  "servings": <number>,
  "emoji": "<single food emoji>",
  "color": "from-amber-400 to-orange-500",
  "ingredients": [
    { "amount": "2 tbsp", "item": "ingredient name", "note": "optional tip" }
  ],
  "instructions": [
    { "step": 1, "title": "Step title", "text": "Detailed instruction", "tip": "optional Korean cooking tip" }
  ],
  "nutrition": {
    "calories": <number>,
    "protein": "<Xg>",
    "carbs": "<Xg>",
    "fat": "<Xg>",
    "fiber": "<Xg>"
  },
  "toddlerTips": "How to adapt for toddlers (reduce spice, texture changes, etc.)",
  "toddlerIngredientSwaps": ["swap 1", "swap 2"],
  "shoppingList": ["item not in pantry", "another item"],
  "tags": ["tag1", "tag2"]
}

Focus on HOME COOKING (not restaurant food). Use authentic Korean techniques and proportions.
The ingredients provided are what the user HAS — suggest a recipe that uses most of them.
The shoppingList should only include 2-5 KEY items they'd need to BUY that they probably don't have.`;

  const userContent: Array<{type: string; text?: string; source?: {type: string; media_type: string; data: string}}> = [];

  if (imageBase64) {
    userContent.push({
      type: 'image',
      source: {
        type: 'base64',
        media_type: imageType || 'image/jpeg',
        data: imageBase64
      }
    } as {type: string; source: {type: string; media_type: string; data: string}});
    userContent.push({
      type: 'text',
      text: 'Based on the ingredients visible in this photo, suggest the best authentic Korean home recipe I can make. Return only the JSON.'
    });
  } else {
    userContent.push({
      type: 'text',
      text: `My ingredients: ${ingredients}\n\nSuggest the best authentic Korean home recipe I can make with these. Return only the JSON.`
    });
  }

  const response = await client.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 3000,
    system: systemPrompt,
    messages: [{ role: 'user', content: userContent as Parameters<typeof client.messages.create>[0]['messages'][0]['content'] }]
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  // Strip potential markdown code fences
  const cleaned = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
  return JSON.parse(cleaned) as RecipeData;
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check access
  const team = await getTeamForUser();
  const hasActiveSubscription =
    team?.subscriptionStatus === 'active' ||
    team?.subscriptionStatus === 'trialing';
  const hasLifetimeAccess = team?.lifetimeAccess === true;
  const hasFreeScans = user.scanCount < 2;
  const hasAccess = hasActiveSubscription || hasLifetimeAccess || hasFreeScans;

  if (!hasAccess) {
    return NextResponse.json(
      { error: 'Payment required', needsPayment: true },
      { status: 402 }
    );
  }

  try {
    const body = await request.json();
    const { ingredients, image, imageType, type } = body as {
      ingredients?: string;
      image?: string;
      imageType?: string;
      type: 'text' | 'image';
    };

    let recipe: RecipeData;
    const scanInput = type === 'text' ? (ingredients ?? '') : '[image scan]';

    if (process.env.ANTHROPIC_API_KEY) {
      // Use Claude AI
      recipe = await generateWithClaude(
        ingredients ?? '',
        type === 'image' ? image : undefined,
        imageType
      );
    } else {
      // Demo fallback
      recipe = pickBestRecipe(ingredients ?? '');
    }

    // Save recipe to DB
    const saved = await createRecipe(user.id, recipe, scanInput);

    // Increment scan count for free users
    await incrementScanCount(user.id);

    return NextResponse.json({ recipeId: saved.id });
  } catch (error) {
    console.error('Recipe generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate recipe. Please try again.' },
      { status: 500 }
    );
  }
}
