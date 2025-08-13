const palette = {
  sand: '#D6A99D',
  cream: '#FBF3D5',
  mint: '#D6DAC8',
  sage: '#9CAFAA',
  black: '#18181b',
  purple: '#7c3aed',
  white: '#fff',
};

export default function Contact() {
  return (
    <section id="contact" style={{ padding: '5rem 1.2rem', background: '#0f0f12', borderTop: `1px solid ${palette.sand}33` }}>
      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ color: palette.cream, fontWeight: 800, fontSize: 'clamp(1.4rem, 3vw, 2rem)', letterSpacing: '-0.5px' }}>Let’s work together</div>
        <div style={{ color: palette.mint, marginTop: 8, opacity: 0.9 }}>Small, focused projects ship fastest. Say hello —</div>
        <div style={{ marginTop: 16 }}>
          <a href="mailto:navni@example.com" style={{ background: `linear-gradient(90deg, ${palette.sand} 0%, ${palette.purple} 100%)`, color: palette.white, padding: '0.8rem 1.2rem', borderRadius: 12, fontWeight: 800, textDecoration: 'none', boxShadow: `0 3px 16px ${palette.purple}33` }}>navni@example.com</a>
        </div>
      </div>
    </section>
  );
}
