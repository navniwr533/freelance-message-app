import { motion } from 'framer-motion';

const palette = {
  sand: '#CBB59C',
  cream: '#FFF9F0',
  mint: '#E9E1D8',
  sage: '#B9AFA5',
  black: '#141414',
  purple: '#8B6F4E',
  white: '#fff',
};

const cols = [
  { h: 'Message Strategy', p: 'Clarify goals, choose tone, and shape a message that earns replies.' },
  { h: 'Client Outreach', p: 'Cold emails, upwork replies, intros—personal, short, on-point.' },
  { h: 'Follow‑ups', p: 'Polite nudges that move deals forward without sounding pushy.' },
];

export default function Services() {
  return (
    <section id="services" style={{ padding: '5rem 1.2rem', background: '#F5F1EA' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
  <motion.h3 initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ color: palette.purple, fontWeight: 900, fontSize: 'clamp(1.5rem, 3.2vw, 2.2rem)', letterSpacing: '-0.6px', marginBottom: 18 }}>Services</motion.h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
          {cols.map((c, i) => (
            <motion.div key={c.h} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.05 }}
              style={{ background: palette.cream, color: palette.black, borderRadius: 14, padding: '1.1rem 1.1rem', border: `1.5px solid ${palette.sand}`, boxShadow: `0 10px 24px rgba(0,0,0,0.06)` }}>
              <div style={{ fontWeight: 900, color: palette.purple, letterSpacing: '-0.3px' }}>{c.h}</div>
              <div style={{ opacity: 0.85, marginTop: 6 }}>{c.p}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
