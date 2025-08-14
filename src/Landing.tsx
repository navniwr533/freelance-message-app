import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const palette = {
  sand: '#CBB59C',   // accent
  cream: '#FFF9F0',  // light surface
  mint: '#E9E1D8',   // soft ui
  sage: '#B9AFA5',   // warm grey
  black: '#141414',  // ink
  purple: '#8B6F4E', // brand (bronze)
  white: '#fff',
};

type Props = { onStart: () => void };

// SpreadText component with ultra-smooth blur animation
function SpreadText({ text }: { text: string }) {
  const words = text.split(' ');
  
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem' }}>
      {words.map((word, wordIndex) => (
        <div key={wordIndex} style={{ display: 'flex' }}>
          {word.split('').map((letter, letterIndex) => (
            <motion.span
              key={`${wordIndex}-${letterIndex}`}
              initial={{ 
                opacity: 0, 
                filter: 'blur(4px)',
                y: 15,
                scale: 0.9
              }}
              animate={{ 
                opacity: 1, 
                filter: 'blur(0px)',
                y: 0,
                scale: 1
              }}
              transition={{
                duration: 0.4,
                delay: 0.2 + (wordIndex * 0.05) + (letterIndex * 0.015),
                ease: [0.16, 1, 0.3, 1]
              }}
              style={{
                display: 'inline-block',
                fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                fontWeight: 800,
                letterSpacing: '-1px',
                marginRight: letter === ' ' ? '0.3em' : '0.02em',
                willChange: 'transform, opacity, filter',
              }}
            >
              {letter}
            </motion.span>
          ))}
          {wordIndex < words.length - 1 && (
            <span style={{ width: '0.3em' }} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function Landing({ onStart }: Props) {
  // Simple parallax on mouse
  const shouldReduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
  
  // Pause effects when section not in viewport to keep scrolling smooth
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { threshold: 0.01 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (shouldReduce || !active) return; // respect OS reduced motion and visibility
    const el = ref.current; if (!el) return;
    let raf = 0;
    let targetX = 0, targetY = 0, x = 0, y = 0;
    const tick = () => {
      // gentle easing
      x += (targetX - x) * 0.08;
      y += (targetY - y) * 0.08;
      el.style.setProperty('--px', String(x));
      el.style.setProperty('--py', String(y));
      raf = requestAnimationFrame(tick);
    };
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      targetX = (e.clientX - (r.left + r.width / 2)) / r.width;
      targetY = (e.clientY - (r.top + r.height / 2)) / r.height;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, [shouldReduce, active]);
  return (
    <section 
      ref={ref} 
      style={{ 
        position: 'relative', 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        overflow: 'hidden', 
        background: `linear-gradient(180deg, ${palette.cream} 0%, #F5F1EA 60%, #F2ECE3 100%)`, 
        willChange: 'transform',
        transform: 'translate3d(0, 0, 0)',
        backfaceVisibility: 'hidden'
      }}
    >
      
      {/* Main Content */}
      <>
        {/* subtle gradient bg */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ 
            position: 'absolute', 
            inset: 0, 
            background: `radial-gradient(80% 60% at 70% 20%, ${palette.purple}22 0%, transparent 50%), radial-gradient(60% 50% at 20% 80%, ${palette.sand}22 0%, transparent 60%)`, 
            mixBlendMode: 'multiply',
            willChange: 'opacity'
          }} 
        />

        {/* top nav */}
        <div style={{ 
          position: 'absolute', 
          top: 'clamp(12px, 3vw, 18px)', 
          left: 'clamp(12px, 3vw, 18px)', 
          right: 'clamp(12px, 3vw, 18px)', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          zIndex: 2,
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <motion.div 
            initial={{ opacity: 0, y: -8 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.3, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} 
            style={{ 
              color: palette.black, 
              fontWeight: 700, 
              letterSpacing: '-0.5px',
              fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
              willChange: 'transform, opacity'
            }}
          >
            IFOXY studios
          </motion.div>
          <motion.button 
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            onClick={onStart} 
            whileHover={{ scale: 1.04, transition: { duration: 0.15 } }} 
            whileTap={{ scale: 0.98, transition: { duration: 0.1 } }} 
            style={{ 
              background: 'transparent', 
              color: palette.purple, 
              border: `1.5px solid ${palette.purple}`, 
              borderRadius: 10, 
              padding: 'clamp(0.45rem, 2vw, 0.55rem) clamp(0.7rem, 2.5vw, 0.9rem)', 
              fontWeight: 700,
              fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
              cursor: 'pointer',
              minHeight: '44px',
              willChange: 'transform'
            }}
          >
            Open App
          </motion.button>
        </div>

        {/* headline with letter spread animation */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ 
            textAlign: 'center', 
            padding: '0 clamp(1rem, 3vw, 1.2rem)', 
            zIndex: 1, 
            transform: 'translate3d(calc(var(--px,0) * 4px), calc(var(--py,0) * 4px), 0)', 
            willChange: 'transform, opacity',
            maxWidth: '900px',
            width: '100%'
          }}
        >
          <div className="h1" style={{ 
            color: palette.purple, 
            lineHeight: 1,
            fontSize: 'clamp(2.2rem, 8vw, 4rem)'
          }}>
            <SpreadText text="Messages that win clients" />
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 0.9, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ 
              marginTop: 'clamp(0.8rem, 2vw, 1rem)', 
              color: palette.black, 
              fontSize: 'clamp(1rem, 2.4vw, 1.25rem)',
              willChange: 'transform, opacity',
              lineHeight: '1.4'
            }}
          >
            A tiny studio tool for fast, thoughtful communication.
          </motion.div>
          <motion.button 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            onClick={onStart} 
            whileHover={{ scale: 1.05, transition: { duration: 0.15 } }} 
            whileTap={{ scale: 0.96, transition: { duration: 0.1 } }} 
            style={{ 
              marginTop: 'clamp(1rem, 3vw, 1.4rem)', 
              background: 'transparent', 
              color: palette.purple, 
              border: `1.5px solid ${palette.purple}`, 
              borderRadius: 12, 
              padding: 'clamp(0.7rem, 2.5vw, 0.8rem) clamp(1rem, 3vw, 1.2rem)', 
              fontWeight: 800, 
              letterSpacing: '0.02em', 
              cursor: 'pointer',
              fontSize: 'clamp(0.9rem, 2.2vw, 1rem)',
              minHeight: '48px',
              willChange: 'transform'
            }}
          >
            Start crafting
          </motion.button>
        </motion.div>

        {/* marquee */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ duration: 0.4, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
          style={{ 
            position: 'absolute', 
            bottom: 'clamp(12px, 3vw, 20px)', 
            width: '100%', 
            overflow: 'hidden',
            willChange: 'opacity'
          }} 
          aria-hidden
        >
          <div 
            data-marquee
            style={{ 
              display: 'flex', 
              gap: 30, 
              whiteSpace: 'nowrap', 
              animation: 'marquee 12s linear infinite', 
              color: palette.purple, 
              fontWeight: 600,
              fontSize: 'clamp(0.75rem, 2vw, 0.9rem)',
              willChange: 'transform',
              transform: 'translate3d(0, 0, 0)',
              backfaceVisibility: 'hidden'
            }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} style={{ padding: '0 1rem' }}>Strategy · Tone · Clarity · Speed</span>
            ))}
          </div>
        </motion.div>
      </>
      
      <style>{`
        @keyframes marquee { 
          from { transform: translateX(0); } 
          to { transform: translateX(-50%); } 
        }
        
        /* Hardware acceleration for marquee */
        [data-marquee] {
          will-change: transform;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
        }
      `}</style>
    </section>
  );
}
