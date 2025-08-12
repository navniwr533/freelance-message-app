import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const secret = process.env.LICENSE_JWT_SECRET;
  if (!secret) return res.status(500).json({ error: 'Missing LICENSE_JWT_SECRET' });

  try {
    const { token } = req.body || {};
    if (!token) return res.status(400).json({ valid: false, reason: 'Missing token' });
    const decoded: any = jwt.verify(token, secret);
    return res.status(200).json({ valid: true, plan: decoded.plan, exp: decoded.exp });
  } catch (e: any) {
    return res.status(200).json({ valid: false, reason: e?.message || 'Invalid token' });
  }
}
