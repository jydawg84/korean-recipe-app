import { checkoutAction, lifetimeCheckoutAction } from '@/lib/payments/actions';
import { Check, Zap, Sparkles } from 'lucide-react';
import { getStripePrices, getStripeProducts } from '@/lib/payments/stripe';
import { SubmitButton } from './submit-button';

// Prices are fresh for one hour max
export const revalidate = 3600;

export default async function PricingPage() {
  let monthlyPrice: { id?: string; unitAmount: number | null; interval?: string } | null = null;

  try {
    const [prices, products] = await Promise.all([
      getStripePrices(),
      getStripeProducts()
    ]);
    const monthly = products.find((p) =>
      p.name?.toLowerCase().includes('monthly') ||
      p.name?.toLowerCase().includes('korean')
    );
    const price = prices.find((p) => p.productId === monthly?.id);
    if (price) {
      monthlyPrice = { id: price.id, unitAmount: price.unitAmount, interval: price.interval };
    }
  } catch {
    // Stripe not configured — show default pricing
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Simple, Family-Friendly Pricing
        </h1>
        <p className="text-gray-500 text-lg">
          Start free — no credit card needed. Upgrade when you love it.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
        {/* Free */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Free</h2>
          <p className="text-sm text-gray-500 mb-4">Try it out</p>
          <div className="text-4xl font-bold text-gray-900 mb-6">
            $0
            <span className="text-base font-normal text-gray-400"> / forever</span>
          </div>
          <ul className="space-y-3 mb-8">
            {['2 recipe scans', 'Full recipe details', 'Toddler-friendly toggle', 'Shopping list'].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                <Check className="h-4 w-4 text-green-500 shrink-0" /> {f}
              </li>
            ))}
          </ul>
          <a
            href="/sign-up"
            className="block w-full text-center border border-orange-200 text-orange-600 hover:bg-orange-50 font-semibold py-2.5 rounded-full transition-colors text-sm"
          >
            Get Started Free
          </a>
        </div>

        {/* Monthly */}
        <div className="relative bg-orange-500 rounded-2xl p-6 shadow-xl shadow-orange-200">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
            ⭐ MOST POPULAR
          </span>
          <h2 className="text-xl font-bold text-white mb-1">Monthly</h2>
          <p className="text-sm text-orange-100 mb-4">Cancel anytime</p>
          <div className="text-4xl font-bold text-white mb-6">
            {monthlyPrice?.unitAmount
              ? `$${(monthlyPrice.unitAmount / 100).toFixed(2)}`
              : '$2.99'}
            <span className="text-base font-normal text-orange-100"> / mo</span>
          </div>
          <ul className="space-y-3 mb-8">
            {[
              'Unlimited recipe scans',
              'AI fridge photo scanning',
              'Save recipe library',
              'Shopping lists',
              'Toddler-friendly mode',
              'Priority support'
            ].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-white">
                <Check className="h-4 w-4 text-amber-200 shrink-0" /> {f}
              </li>
            ))}
          </ul>
          {monthlyPrice?.id ? (
            <form action={checkoutAction}>
              <input type="hidden" name="priceId" value={monthlyPrice.id} />
              <SubmitButton />
            </form>
          ) : (
            <div className="text-center p-3 bg-white/10 rounded-xl">
              <p className="text-white/80 text-xs">
                Set up a Stripe product named &quot;Korean Recipes Monthly&quot; at $2.99/mo to enable checkout.
              </p>
            </div>
          )}
        </div>

        {/* Lifetime */}
        <div className="bg-white rounded-2xl border-2 border-amber-300 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Lifetime</h2>
          <p className="text-sm text-gray-500 mb-4">Pay once, own forever</p>
          <div className="text-4xl font-bold text-gray-900 mb-6">
            $6.99
            <span className="text-base font-normal text-gray-400"> once</span>
          </div>
          <ul className="space-y-3 mb-8">
            {[
              'Everything in Monthly',
              'Pay once — no recurring',
              'All future features',
              'Best value for families'
            ].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                <Check className="h-4 w-4 text-orange-500 shrink-0" /> {f}
              </li>
            ))}
          </ul>
          <form action={lifetimeCheckoutAction}>
            <button
              type="submit"
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-2.5 rounded-full transition-colors text-sm flex items-center justify-center gap-2"
            >
              <Zap className="h-4 w-4" /> Get Lifetime Access
            </button>
          </form>
        </div>
      </div>

      {/* FAQ / note */}
      <p className="text-center text-sm text-gray-400 mt-10">
        Secure checkout via Stripe. All plans include a 30-day money-back guarantee.
        <br />
        Questions?{' '}
        <a href="mailto:support@homekoreanrecipes.com" className="text-orange-500 hover:underline">
          Contact support
        </a>
      </p>
    </main>
  );
}
