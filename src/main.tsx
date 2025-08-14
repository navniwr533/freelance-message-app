import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Privacy from './Privacy'
import Terms from './Terms'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import CasePage from './cases/CasePage'
import NotFound from './NotFound'
import ErrorBoundary from './ErrorBoundary'

const router = createBrowserRouter([
  { path: '/', element: <App />, errorElement: <ErrorBoundary /> },
  { path: '/privacy', element: <Privacy />, errorElement: <ErrorBoundary /> },
  { path: '/terms', element: <Terms />, errorElement: <ErrorBoundary /> },
  { path: '/work/:slug', element: <CasePage />, errorElement: <ErrorBoundary /> },
  { path: '*', element: <NotFound />, errorElement: <ErrorBoundary /> },
], { basename: '/' })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
