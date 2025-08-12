import type { VercelRequest, VercelResponse } from '@vercel/node';
import Razorpay from 'razorpay';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  const amtMonthly = parseInt(process.env.RAZORPAY_AMOUNT_MONTHLY_INR || '0', 10);
  const amtYearly = parseInt(process.env.RAZORPAY_AMOUNT_YEARLY_INR || '0', 10);
  if (!key_id || !key_secret) return res.status(500).json({ error: 'Missing RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET' });

  const { plan } = (req.body || {}) as { plan?: 'monthly'|'yearly' };
  const amount = plan === 'monthly' ? amtMonthly : amtYearly;
  if (!amount || amount <= 0) return res.status(500).json({ error: 'Missing or invalid Razorpay amounts' });

  try {
    const razorpay = new Razorpay({ key_id, key_secret });
    const order = await razorpay.orders.create({
      amount, // in paise
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      notes: { plan: plan || 'yearly' },
      payment_capture: 1,
    });
    return res.status(200).json({ orderId: order.id, keyId: key_id, amount, currency: 'INR' });
  } catch (err: any) {
    console.error('Razorpay create order error:', err);
    return res.status(500).json({ error: err?.message || 'Failed to create order' });
  }
}
