import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">404</h1>
      <p className="mt-2 text-slate-300">Página no encontrada</p>
      <Link to="/" className="mt-4 inline-block underline">
        Volver al inicio
      </Link>
    </main>
  )
}