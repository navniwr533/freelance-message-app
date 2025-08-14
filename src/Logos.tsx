const palette = {
  sand: '#CBB59C',
  cream: '#FFF9F0',
  mint: '#E9E1D8',
  sage: '#B9AFA5',
  black: '#141414',
  purple: '#8B6F4E',
  white: '#fff',
};

export default function Logos() {
  const logos = ['Acme', 'North', 'Delta', 'Peak', 'Vista', 'Orbit', 'Shift', 'Nova'];
  return (
    <section style={{ padding: '1.5rem 1.2rem', background: '#F5F1EA', borderTop: `1px solid ${palette.sand}55` }}>
      <div className="logo-marquee">
        <div className="logo-track" aria-hidden="true">
          {[...logos, ...logos].map((l, i) => (
            <div key={`${l}-${i}`} className="logo-pill" style={{ textAlign: 'center', padding: '0.6rem', minWidth: 120 }}>{l}</div>
          ))}
        </div>
      </div>
    </section>
  );
}
