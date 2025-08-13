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

type Props = { onStart: () => void };

export default function Landing({ onStart }: Props) {
  return (
    <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      {/* subtle gradient bg */}
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(80% 60% at 70% 20%, ${palette.sand}33 0%, transparent 60%), radial-gradient(60% 50% at 20% 80%, ${palette.purple}22 0%, transparent 70%)` }} />

      {/* top nav */}
      <div style={{ position: 'absolute', top: 18, left: 18, right: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ color: palette.cream, fontWeight: 700, letterSpacing: '-0.5px' }}>
          FMG — Studio
        </motion.div>
        <motion.button onClick={onStart} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }} style={{ background: palette.purple, color: palette.white, border: 'none', borderRadius: 10, padding: '0.55rem 0.9rem', fontWeight: 700, boxShadow: `0 1px 10px ${palette.purple}44` }}>
          Open App
        </motion.button>
      </div>

      {/* headline */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} style={{ textAlign: 'center', padding: '0 1.2rem', zIndex: 1 }}>
        <div style={{ fontFamily: 'Poppins, Inter, Arial, sans-serif', fontWeight: 800, color: palette.cream, fontSize: 'clamp(2.2rem, 6vw, 5rem)', lineHeight: 1, textShadow: `0 4px 24px ${palette.black}` }}>
          Messages that win clients
        </div>
        <div style={{ marginTop: 14, color: palette.mint, fontSize: 'clamp(1rem, 2.4vw, 1.25rem)', opacity: 0.9 }}>
          A tiny studio tool for fast, thoughtful communication.
        </div>
        <motion.button onClick={onStart} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.96 }} style={{ marginTop: 22, background: `linear-gradient(90deg, ${palette.sand} 0%, ${palette.purple} 100%)`, color: palette.white, border: 'none', borderRadius: 12, padding: '0.8rem 1.2rem', fontWeight: 800, letterSpacing: '0.02em', boxShadow: `0 3px 16px ${palette.purple}33` }}>
          Start crafting
        </motion.button>
      </motion.div>

      {/* marquee */}
      <div style={{ position: 'absolute', bottom: 20, width: '100%', overflow: 'hidden', opacity: 0.9 }} aria-hidden>
        <div style={{ display: 'flex', gap: 30, whiteSpace: 'nowrap', animation: 'marquee 18s linear infinite', color: palette.sage, fontWeight: 600 }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} style={{ padding: '0 1rem' }}>Strategy · Tone · Clarity · Speed</span>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>
    </section>
  );
}
