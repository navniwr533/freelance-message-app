import { useParams, Link } from 'react-router-dom'
import { cases } from './data'
import { useEffect } from 'react'

export default function CasePage() {
  const { slug } = useParams<{ slug: string }>()
  const c = (slug && cases[slug]) || null
  if (!c) {
    return (
      <section className="container" style={{ padding: '4rem 0' }}>
        <h1 className="h2">Case not found</h1>
        <p style={{ marginTop: 12 }}><Link to="/">Go back home</Link></p>
      </section>
    )
  }
  useEffect(() => {
    const prev = document.title
    document.title = `${c.name} — Case`
    return () => { document.title = prev }
  }, [c.name])
  return (
    <section style={{ padding: '3rem 1.2rem' }}>
      <div className="container" style={{ maxWidth: 1000 }}>
        <h1 className="h2" style={{ marginBottom: 6 }}>{c.name}</h1>
        <div className="muted" style={{ marginBottom: 16 }}>{c.tag}</div>
        {c.img && (
          <img
            src={c.img}
            srcSet={`${c.img}&w=640 640w, ${c.img}&w=1024 1024w, ${c.img}&w=1600 1600w`}
            sizes="(max-width: 768px) 100vw, 1000px"
            alt={c.name}
            loading="lazy"
            style={{ width: '100%', borderRadius: 16, border: '2px solid #D6A99D' }}
          />
        )}
        <p style={{ marginTop: 16 }}>{c.summary}</p>
        {c.gallery && (
          <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
            {c.gallery.map((g, i) => (
              <figure key={i} style={{ margin: 0 }}>
                <img
                  src={`${g.src}`}
                  srcSet={`${g.src}&w=480 480w, ${g.src}&w=768 768w, ${g.src}&w=1200 1200w`}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  alt={g.alt}
                  loading="lazy"
                  style={{ width: '100%', borderRadius: 12, border: '1px solid #D6A99D55' }}
                />
                {g.credit && (
                  <figcaption style={{ fontSize: 12, color: '#ffffffaa', marginTop: 4 }}>
                    {g.credit.url ? <a href={g.credit.url} target="_blank" rel="noreferrer" style={{ color: '#ffffffaa' }}>{g.credit.text}</a> : g.credit.text}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        )}
        <p style={{ marginTop: 16 }}>
          <Link to="/">← Back to home</Link>
        </p>
      </div>
    </section>
  )
}
