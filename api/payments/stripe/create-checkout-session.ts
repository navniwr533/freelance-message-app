import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const plan = (req.body && req.body.plan) as 'monthly' | 'yearly' | undefined;
  const overridePrice = (req.body && req.body.priceId) as string | undefined;
  const priceMonthly = process.env.STRIPE_PRICE_MONTHLY;
  const priceYearly = process.env.STRIPE_PRICE_YEARLY;
  const priceId = overridePrice || (plan === 'monthly' ? priceMonthly : priceYearly);
  const appBase = process.env.APP_BASE_URL || 'http://localhost:5175';
  if (!stripeSecret || !priceId) {
    return res.status(500).json({ error: 'Missing STRIPE_SECRET_KEY or STRIPE_PRICE_MONTHLY/STRIPE_PRICE_YEARLY or APP_BASE_URL' });
  }

  try {
    const stripe = new Stripe(stripeSecret, { apiVersion: '2024-06-20' });
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appBase}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appBase}/cancel`,
      metadata: { plan: plan || (priceId === priceMonthly ? 'monthly' : 'yearly') },
      allow_promotion_codes: true,
    });
    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe create session error:', err);
    return res.status(500).json({ error: err?.message || 'Failed to create checkout session' });
  }
}
