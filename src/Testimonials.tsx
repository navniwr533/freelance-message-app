import React from 'react';

interface Testimonial {
  quote: string;
  name: string;
}

const palette = {
  sand: '#CBB59C',
  cream: '#FFF9F0',
  mint: '#E9E1D8',
  sage: '#B9AFA5',
  black: '#141414',
  purple: '#8B6F4E',
  white: '#fff',
};

// Three groups (rows) of testimonials - adapted for your site's content
const ROW_1: Testimonial[] = [
  { quote: 'Got us replies within hours. The tone felt natural and respectful.', name: 'A. Shah, Product Lead' },
  { quote: 'Follow‑ups were short and effective. Closed the deal in 3 days.', name: 'R. Singh, Founder' },
  { quote: 'Clear, client‑first language. Our outreach feels professional now.', name: 'M. Chen, PM' },
  { quote: 'Fixed our broken client communication before a big launch.', name: 'Sarah Mitchell' },
  { quote: 'Generated messages that actually win clients consistently.', name: 'David Chen' },
  { quote: 'Professional tone that converts prospects into paying clients.', name: 'Priya Kapoor' },
];

const ROW_2: Testimonial[] = [
  { quote: 'Messages feel human, not robotic. Clients love the authenticity.', name: 'Lucas Alvarez' },
  { quote: 'Fast turnaround—perfect proposals generated in seconds.', name: 'Elena Rossi' },
  { quote: 'Consistent messaging across all our client communications.', name: 'Omar Hassan' },
  { quote: 'Improved our response rates dramatically with better tone.', name: 'James Carter' },
  { quote: 'Professional messaging that matches our brand perfectly.', name: 'Isabella Flores' },
  { quote: 'Client acquisition messages that actually work in practice.', name: 'Arjun Patel' },
];

const ROW_3: Testimonial[] = [
  { quote: 'Refined our outreach system—communication finally works.', name: 'Mia Rodriguez' },
  { quote: 'Polished client interactions feel premium and professional.', name: 'Noah Fischer' },
  { quote: 'Handled edge cases other tools completely missed.', name: 'Sofia Martins' },
  { quote: 'Killed awkward phrasing that was hurting our conversions.', name: 'Daniel Brooks' },
  { quote: 'Streamlined messaging system—clients respond faster now.', name: 'Helen Park' },
  { quote: 'Great results with zero drama. Clean, effective communication.', name: 'Ana Pereira' },
];

// Duplicate each row multiple times for seamless infinite scrolling
const dup = (arr: Testimonial[]) => [...arr, ...arr, ...arr, ...arr];

const Row: React.FC<{ 
  data: Testimonial[]; 
  className: string; 
  reverse?: boolean; 
}> = ({ data, className, reverse }) => (
  <div className={`marquee-container ${className}`}>
    <div 
      className={`marquee-track ${
        reverse ? 'animate-marquee-right' : 'animate-marquee-left'
      }`}
    >
      {dup(data).map((t, i) => (
        <figure
          key={`${t.name}-${i}`}
          className="testimonial-card"
          style={{
            width: '320px',
            minWidth: '320px',
            flexShrink: 0,
            borderRadius: '12px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: `1.5px solid ${palette.sand}`,
            background: `${palette.cream}`,
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
            backdropFilter: 'blur(12px)',
            height: '140px',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            contain: 'layout style paint'
          }}
        >
          <blockquote 
            style={{ 
              fontSize: '14px',
              lineHeight: '1.5',
              color: palette.black,
              margin: 0,
              flex: 1,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            "{t.quote}"
          </blockquote>
          <figcaption 
            style={{ 
              marginTop: '1rem',
              fontSize: '12px',
              fontWeight: 500,
              color: palette.sage 
            }}
          >
            — {t.name}
          </figcaption>
        </figure>
      ))}
    </div>
    
    {/* Edge fades with your site's colors */}
    <div 
      style={{
        pointerEvents: 'none',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: '100px',
        background: `linear-gradient(to right, #F5F1EA 0%, rgba(245, 241, 234, 0.8) 60%, transparent 100%)`,
        zIndex: 1,
      }}
    />
    <div 
      style={{
        pointerEvents: 'none',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: '100px',
        background: `linear-gradient(to left, #F5F1EA 0%, rgba(245, 241, 234, 0.8) 60%, transparent 100%)`,
        zIndex: 1,
      }}
    />
  </div>
);

export default function Testimonials() {
  return (
    <>
      {/* Ultra-smooth 120fps marquee animations */}
      <style>{`
        /* Force hardware acceleration for optimal 120fps performance */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        @keyframes marquee-left {
          0% { transform: translate3d(0%, 0, 0); }
          100% { transform: translate3d(-25%, 0, 0); }
        }
        @keyframes marquee-right {
          0% { transform: translate3d(-25%, 0, 0); }
          100% { transform: translate3d(0%, 0, 0); }
        }
        
        .animate-marquee-left { 
          animation: marquee-left 60s linear infinite; 
          will-change: transform;
          backface-visibility: hidden;
          transform: translateZ(0);
          contain: layout style paint;
        }
        .animate-marquee-right { 
          animation: marquee-right 65s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
          transform: translateZ(0);
          contain: layout style paint;
        }
        
        /* Hover pause - only the hovered row pauses, others continue */
        .marquee-row:hover .animate-marquee-left,
        .marquee-row:hover .animate-marquee-right {
          animation-play-state: paused;
        }
        
        .testimonial-card {
          transition: all 0.12s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          will-change: transform;
          backface-visibility: hidden;
          transform: translateZ(0);
          contain: layout style paint;
        }
        
        .testimonial-card:hover {
          border-color: ${palette.purple} !important;
          transform: translate3d(0, -1px, 0);
          box-shadow: 0 8px 24px rgba(139, 111, 78, 0.1) !important;
        }
        
        /* 120fps optimized marquee containers */
        .marquee-container {
          overflow: hidden;
          position: relative;
          contain: layout style paint;
          mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
          transform: translateZ(0);
          will-change: auto;
        }
        
        .marquee-track {
          display: flex;
          gap: 1rem;
          width: max-content;
          will-change: transform;
          backface-visibility: hidden;
          contain: layout style paint;
          transform: translateZ(0);
        }
        
        /* Third row with different speed */
        .row-3 .animate-marquee-left {
          animation: marquee-left 55s linear infinite;
        }
      `}</style>
      
      <section 
        id="testimonials" 
        style={{ 
          padding: '4rem 0', 
          background: '#F5F1EA',
          borderTop: `1px solid ${palette.sand}55`,
          position: 'relative'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          <h3 
            style={{ 
              color: palette.purple, 
              fontWeight: 800, 
              marginBottom: '3rem', 
              letterSpacing: '-0.5px',
              textAlign: 'center',
              fontSize: 'clamp(1.5rem, 4vw, 2.2rem)'
            }}
          >
            What clients say
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <Row data={ROW_1} className="marquee-row row-1" />
            <Row data={ROW_2} className="marquee-row row-2" reverse />
            <Row data={ROW_3} className="marquee-row row-3" />
          </div>
        </div>
      </section>
    </>
  );
}
