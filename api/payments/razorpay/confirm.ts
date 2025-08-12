import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const secret = process.env.LICENSE_JWT_SECRET;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret || !key_secret) return res.status(500).json({ error: 'Missing LICENSE_JWT_SECRET or RAZORPAY_KEY_SECRET' });

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = (req.body || {}) as any;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing Razorpay confirmation fields' });
  }

  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expected = crypto.createHmac('sha256', key_secret).update(body).digest('hex');
  if (expected !== razorpay_signature) return res.status(400).json({ error: 'Invalid signature' });

  // Issue 1-month for monthly else 1-year for yearly
  const now = Math.floor(Date.now() / 1000);
  const exp = now + (plan === 'monthly' ? 30 * 24 * 60 * 60 : 365 * 24 * 60 * 60);
  const token = jwt.sign({ plan: plan === 'monthly' ? 'pro-monthly' : 'pro-yearly', exp }, secret);
  return res.status(200).json({ token, plan: plan === 'monthly' ? 'pro-monthly' : 'pro-yearly', exp });
}
