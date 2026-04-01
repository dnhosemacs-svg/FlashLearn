import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main className="page-shell">
      <h1 className="page-title">404</h1>
      <p className="page-subtitle">Página no encontrada</p>
      <Link to="/" className="mt-4 inline-block underline">
        Volver al inicio
      </Link>
    </main>
  )
}