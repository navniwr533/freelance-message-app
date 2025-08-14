import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom'

export default function ErrorBoundary() {
  const err = useRouteError();
  let title = 'Something went wrong';
  let detail: string | undefined;

  if (isRouteErrorResponse(err)) {
    title = `${err.status} ${err.statusText}`;
    detail = typeof err.data === 'string' ? err.data : undefined;
  } else if (err instanceof Error) {
    detail = err.message;
  }

  return (
    <section style={{ padding: '3rem 1.2rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{title}</h1>
      {detail && <p style={{ marginTop: 8, opacity: 0.8 }}>{detail}</p>}
      <p style={{ marginTop: 12 }}>
        <Link to="/">Go back home</Link>
      </p>
    </section>
  );
}
