const palette = {
  sand: '#CBB59C',
  cream: '#FFF9F0',
  mint: '#E9E1D8',
  sage: '#B9AFA5',
  black: '#141414',
  purple: '#8B6F4E',
  white: '#fff',
};

export default function Testimonials() {
  const items = [
  { q: 'Got us replies within hours. The tone felt natural and respectful.', a: 'A. Shah, Product Lead' },
  { q: 'Follow‑ups were short and effective. Closed the deal in 3 days.', a: 'R. Singh, Founder' },
  { q: 'Clear, client‑first language. Our outreach feels professional now.', a: 'M. Chen, PM' },
  ];
  return (
    <section style={{ padding: '4rem 1.2rem', background: '#F5F1EA', borderTop: `1px solid ${palette.sand}55` }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <h3 style={{ color: palette.purple, fontWeight: 800, marginBottom: 18, letterSpacing: '-0.5px' }}>What clients say</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
          {items.map((t) => (
            <div key={t.a} style={{ border: `1.5px solid ${palette.sand}`, borderRadius: 14, padding: '1rem', color: palette.black, background: palette.cream, boxShadow: '0 10px 24px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '1.02rem' }}>&ldquo;{t.q}&rdquo;</div>
              <div style={{ marginTop: 8, color: palette.sage }}>{t.a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
