import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import jwt from 'jsonwebtoken';

export const config = {
  api: { bodyParser: false },
};

function buffer(req: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    req.on('data', (chunk: Uint8Array) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const licenseSecret = process.env.LICENSE_JWT_SECRET;
  if (!stripeSecret || !webhookSecret || !licenseSecret) return res.status(500).send('Missing Stripe secrets');

  const buf = await buffer(req);
  const sig = (req.headers['stripe-signature'] as string) || '';

  const stripe = new Stripe(stripeSecret, { apiVersion: '2024-06-20' });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    // We could persist, but we issue token via /retrieve-license after redirect
    // Alternatively, you could email the token.
  }

  res.json({ received: true });
}
