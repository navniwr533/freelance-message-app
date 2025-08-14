import { motion } from 'framer-motion';

const palette = {
  sand: '#CBB59C',   // accent
  cream: '#FFF9F0',  // light surface
  mint: '#E9E1D8',   // soft ui
  sage: '#B9AFA5',   // warm grey
  black: '#141414',  // ink
  purple: '#8B6F4E', // brand (bronze)
  white: '#fff',
};

const items = [
  { title: 'Tone Control', desc: 'Friendly, formal, concise, apologetic, thankful—switch in one click.' },
  { title: 'Context Use', desc: 'Understands client context and your intent; avoids placeholders.' },
  { title: 'Polish & Clarity', desc: 'Cuts fluff, keeps it human, and highlights value.' },
  { title: 'Fast Iteration', desc: 'Generate, tweak, resend—no limits, no paywall.' },
];

export default function Capabilities() {
  return (
    <section style={{ padding: '5rem 1.2rem', background: '#F5F1EA' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.h3 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ color: palette.purple, fontWeight: 900, fontSize: 'clamp(1.5rem, 3.2vw, 2.2rem)', letterSpacing: '-0.6px', marginBottom: 18 }}>
          Capabilities
        </motion.h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -20% 0px' }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              style={{
                background: palette.cream,
                color: palette.black,
                borderRadius: 14,
                padding: '1.1rem 1.1rem',
                border: `1.5px solid ${palette.sand}`,
                boxShadow: `0 10px 24px rgba(0,0,0,0.06)`,
              }}
            >
              <div style={{ fontWeight: 900, color: palette.purple, letterSpacing: '-0.3px' }}>{it.title}</div>
              <div style={{ opacity: 0.8, marginTop: 6 }}>{it.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
