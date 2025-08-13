import { motion } from 'framer-motion';

const palette = {
  sand: '#D6A99D',
  cream: '#FBF3D5',
  mint: '#D6DAC8',
  sage: '#9CAFAA',
  black: '#18181b',
  purple: '#7c3aed',
  white: '#fff',
};

const items = [
  { title: 'Strategy', desc: 'Positioning, messaging, and offer shaping for better client fit.' },
  { title: 'Design', desc: 'Tasteful UI and clear UX that feel effortless and fast.' },
  { title: 'Development', desc: 'Modern stacks, fast delivery, and smooth deploys.' },
  { title: 'Content', desc: 'Words that sound human, helpful, and on-brand.' },
];

export default function Capabilities() {
  return (
    <section style={{ padding: '5rem 1.2rem', background: palette.black }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.h3 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ color: palette.cream, fontWeight: 900, fontSize: 'clamp(1.5rem, 3.2vw, 2.2rem)', letterSpacing: '-0.6px', marginBottom: 18 }}>
          Capabilities
        </motion.h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
          {items.map((it, i) => (
            <motion.div key={it.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px 0px -20% 0px' }} transition={{ duration: 0.5, delay: i * 0.06 }}
              style={{ background: palette.cream, color: palette.black, borderRadius: 14, padding: '1.1rem 1.1rem', border: `2px solid ${palette.sand}`, boxShadow: `0 10px 24px ${palette.sand}22` }}>
              <div style={{ fontWeight: 900, color: palette.purple, letterSpacing: '-0.3px' }}>{it.title}</div>
              <div style={{ opacity: 0.8, marginTop: 6 }}>{it.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
