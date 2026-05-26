import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Camera,
  ChefHat,
  ShoppingCart,
  Baby,
  Clock,
  Star,
  ArrowRight,
  Sparkles,
  Heart,
  Utensils
} from 'lucide-react';

// ─── Sample recipe previews ───────────────────────────────────────────────────
const SAMPLE_RECIPES = [
  {
    emoji: '🍲',
    name: 'Doenjang Jjigae',
    korean: '된장찌개',
    desc: 'Hearty fermented soybean paste stew with tofu & zucchini',
    time: '30 min',
    difficulty: 'Easy',
    color: 'from-amber-400 to-orange-500'
  },
  {
    emoji: '🥗',
    name: 'Bibimbap',
    korean: '비빔밥',
    desc: 'Colorful mixed rice bowl with sautéed veggies & gochujang sauce',
    time: '40 min',
    difficulty: 'Medium',
    color: 'from-red-400 to-rose-500'
  },
  {
    emoji: '🥘',
    name: 'Japchae',
    korean: '잡채',
    desc: 'Glass noodles stir-fried with colorful vegetables & beef',
    time: '35 min',
    difficulty: 'Medium',
    color: 'from-emerald-400 to-teal-500'
  }
];

const FEATURES = [
  {
    icon: Camera,
    title: 'Snap Your Fridge',
    desc: 'Take a photo of your fridge or pantry and our AI instantly identifies your ingredients.'
  },
  {
    icon: Sparkles,
    title: 'AI Recipe Magic',
    desc: 'Get authentic home-style Korean recipes tailored exactly to what you have on hand.'
  },
  {
    icon: Utensils,
    title: 'Step-by-Step Guide',
    desc: 'Clear instructions with exact measurements — no more guessing Korean cooking ratios.'
  },
  {
    icon: Baby,
    title: 'Toddler-Friendly',
    desc: 'One-tap adaptation for little ones — less spice, softer textures, same great flavour.'
  },
  {
    icon: ShoppingCart,
    title: 'Shopping List',
    desc: "Auto-generated list of the few extra items you'll need. Nothing goes to waste."
  },
  {
    icon: Heart,
    title: 'Save & Build Library',
    desc: 'Save favourite recipes and build your own personal Korean recipe collection.'
  }
];

const DISHES = [
  '된장찌개', '김치찌개', '비빔밥', '잡채', '불고기',
  '떡볶이', '순두부찌개', '파전', '갈비찜', '삼겹살'
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── Nav ───────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-amber-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🥢</span>
            <span className="font-bold text-gray-900 text-lg">
              Home Korean Recipes
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sign in
            </Link>
            <Button asChild className="rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-sm">
              <Link href="/sign-up">Start Free</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50 via-orange-50/40 to-white">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-200/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <Sparkles className="h-4 w-4" />
              AI-Powered Korean Home Cooking
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Turn Your Fridge Into{' '}
              <span className="text-orange-500">Authentic Korean</span>{' '}
              Home Meals
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
              Snap your pantry or type what you have. Get real home-style Korean
              recipes — jjigae, banchan, bibimbap and more — with step-by-step
              photos, exact measurements, shopping lists, and toddler-friendly
              adaptations.
            </p>

            {/* CTA row */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-orange-500 hover:bg-orange-600 text-white px-8 shadow-md shadow-orange-200"
              >
                <Link href="/sign-up">
                  Start for Free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-orange-200 text-orange-700 hover:bg-orange-50"
              >
                <Link href="#how-it-works">See How It Works</Link>
              </Button>
            </div>

            <p className="mt-4 text-sm text-gray-400">
              2 free recipe scans · No credit card required
            </p>
          </div>

          {/* Floating dish bubbles */}
          <div className="mt-16 flex flex-wrap justify-center gap-2 max-w-xl mx-auto">
            {DISHES.map((dish) => (
              <span
                key={dish}
                className="px-3 py-1.5 bg-white border border-amber-200 text-gray-700 text-sm rounded-full shadow-sm font-medium"
              >
                {dish}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              From Fridge to Table in 3 Steps
            </h2>
            <p className="text-gray-500 text-lg">
              No Korean cooking experience needed.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: '01',
                icon: '📸',
                title: 'Snap or List',
                desc: 'Take a photo of your fridge/pantry, or simply type what ingredients you have on hand.'
              },
              {
                step: '02',
                icon: '🤖',
                title: 'AI Finds Your Recipe',
                desc: 'Our AI matches your ingredients to the most delicious authentic Korean home dish you can make right now.'
              },
              {
                step: '03',
                icon: '🍽️',
                title: 'Cook with Confidence',
                desc: 'Follow clear step-by-step instructions with exact Korean measurements and techniques.'
              }
            ].map((item) => (
              <div key={item.step} className="relative text-center">
                {/* Connector line */}
                <div className="absolute top-10 left-1/2 w-full h-0.5 bg-amber-100 hidden md:block -z-10" />
                <div className="w-20 h-20 bg-amber-50 border-2 border-amber-200 rounded-2xl mx-auto mb-4 flex items-center justify-center text-4xl shadow-sm">
                  {item.icon}
                </div>
                <span className="text-xs font-bold text-orange-400 tracking-widest uppercase">
                  Step {item.step}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mt-1 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section className="py-20 bg-amber-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Everything You Need to Cook Korean at Home
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sample recipes ────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Recipes You&apos;ll Actually Make
            </h2>
            <p className="text-gray-500 text-lg">
              Real home-cooked dishes — not restaurant food.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {SAMPLE_RECIPES.map((r) => (
              <div
                key={r.name}
                className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer"
              >
                <div
                  className={`h-36 bg-gradient-to-br ${r.color} flex items-center justify-center`}
                >
                  <span className="text-6xl">{r.emoji}</span>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-gray-900">{r.name}</h3>
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                      {r.difficulty}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2 font-medium">{r.korean}</p>
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">{r.desc}</p>
                  <div className="flex items-center gap-1 text-gray-400 text-xs">
                    <Clock className="h-3 w-3" />
                    <span>{r.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button
              asChild
              className="rounded-full bg-orange-500 hover:bg-orange-600 text-white px-8"
            >
              <Link href="/sign-up">
                Get My First Recipe Free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Simple, Family-Friendly Pricing
            </h2>
            <p className="text-gray-500">Start free. Upgrade when you love it.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {/* Free tier */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 text-xl mb-1">Free</h3>
              <div className="text-3xl font-bold text-gray-900 mb-4">
                $0
                <span className="text-base font-normal text-gray-400"> forever</span>
              </div>
              <ul className="space-y-2 mb-6">
                {['2 recipe scans', 'Full recipe details', 'Toddler-friendly toggle'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-green-500">✓</span>{f}
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="w-full rounded-full">
                <Link href="/sign-up">Get Started Free</Link>
              </Button>
            </div>

            {/* Monthly */}
            <div className="bg-orange-500 rounded-2xl p-6 shadow-lg shadow-orange-200 relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-white text-xs font-bold px-3 py-1 rounded-full">
                MOST POPULAR
              </span>
              <h3 className="font-bold text-white text-xl mb-1">Monthly</h3>
              <div className="text-3xl font-bold text-white mb-4">
                $2.99
                <span className="text-base font-normal text-orange-100"> / month</span>
              </div>
              <ul className="space-y-2 mb-6">
                {['Unlimited scans', 'AI image scanning', 'Save recipe library', 'Shopping lists', 'Priority support'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-white">
                    <span className="text-amber-200">✓</span>{f}
                  </li>
                ))}
              </ul>
              <Button asChild className="w-full rounded-full bg-white text-orange-500 hover:bg-orange-50 font-bold">
                <Link href="/sign-up">Start Monthly</Link>
              </Button>
            </div>

            {/* Lifetime */}
            <div className="bg-white rounded-2xl p-6 border border-amber-200 shadow-sm">
              <h3 className="font-bold text-gray-900 text-xl mb-1">Lifetime</h3>
              <div className="text-3xl font-bold text-gray-900 mb-4">
                $6.99
                <span className="text-base font-normal text-gray-400"> one-time</span>
              </div>
              <ul className="space-y-2 mb-6">
                {['Everything in Monthly', 'Pay once, use forever', 'All future features', 'Family sharing ready'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-orange-500">✓</span>{f}
                  </li>
                ))}
              </ul>
              <Button asChild className="w-full rounded-full bg-orange-500 hover:bg-orange-600 text-white">
                <Link href="/sign-up">Get Lifetime Access</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="py-20 bg-orange-500">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="text-5xl mb-4">🥢</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Cook Like a Korean Mom?
          </h2>
          <p className="text-orange-100 text-lg mb-8">
            Join thousands of home cooks discovering authentic Korean flavours
            with ingredients already in their kitchen.
          </p>
          <Button
            asChild
            size="lg"
            className="rounded-full bg-white text-orange-500 hover:bg-orange-50 font-bold px-10 shadow-lg"
          >
            <Link href="/sign-up">
              Start Cooking for Free <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="py-8 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <span>🥢</span>
            <span className="font-medium text-white">Home Korean Recipes</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/sign-in" className="hover:text-white transition-colors">Sign In</Link>
            <Link href="/sign-up" className="hover:text-white transition-colors">Sign Up</Link>
          </div>
          <p>© {new Date().getFullYear()} Home Korean Recipes</p>
        </div>
      </footer>
    </div>
  );
}
