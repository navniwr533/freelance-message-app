import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import jwt from 'jsonwebtoken';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const secret = process.env.LICENSE_JWT_SECRET;
  if (!stripeSecret || !secret) return res.status(500).json({ error: 'Missing STRIPE_SECRET_KEY or LICENSE_JWT_SECRET' });

  const sessionId = req.query.session_id as string;
  if (!sessionId) return res.status(400).json({ error: 'Missing session_id' });

  try {
    const stripe = new Stripe(stripeSecret, { apiVersion: '2024-06-20' });
  const session = await stripe.checkout.sessions.retrieve(sessionId);
    // If no customer id, nothing to issue
    if (!session || session.payment_status !== 'paid') return res.status(400).json({ error: 'Session not paid' });

    // Determine expiry from subscription period end
    let exp: number | undefined;
    let plan: 'pro-monthly' | 'pro-yearly' = 'pro-yearly';
    if (session.subscription) {
      const sub = await stripe.subscriptions.retrieve(session.subscription as string);
      exp = sub.current_period_end; // epoch seconds
      if (sub.items?.data?.[0]?.plan?.interval === 'month') plan = 'pro-monthly';
      else plan = 'pro-yearly';
    }
    if (!exp) {
      // Fallback: 1 year
      exp = Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60;
      plan = 'pro-yearly';
    }
    const token = jwt.sign({ plan, exp }, secret);
    return res.status(200).json({ token, plan, exp });
  } catch (err: any) {
    console.error('Retrieve license error:', err);
    return res.status(500).json({ error: err?.message || 'Failed to retrieve license' });
  }
}
