import { Link, Outlet } from 'react-router-dom'

export default function App() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-800">
        <nav className="mx-auto flex max-w-5xl gap-6 p-4">
          <Link to="/">Inicio</Link>
          <Link to="/collections">Colecciones</Link>
          <Link to="/study">Estudio</Link>
        </nav>
      </header>

      <Outlet />
    </div>
  )
}
