import { NavLink, Outlet } from 'react-router-dom'

const navLinkClass = ({ isActive }: { isActive: boolean }) => 
  isActive
  ? 'font-semibold text-indigo-700 underline underline-offset-4'
  : 'text-slate-700 hover:text-indigo-700'

export default function App() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-800">
        <nav className="mx-auto flex max-w-5xl gap-6 p-4">
          <NavLink to="/" end className={navLinkClass}>
            Inicio
          </NavLink>
          <NavLink to="/collections" className={navLinkClass}>
            Colecciones
          </NavLink>
          <NavLink to="/study" className={navLinkClass}>
            Estudio
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            Acerca
          </NavLink>
          <NavLink to="/settings" className={navLinkClass}>
            Ajustes
          </NavLink>
        </nav>
      </header>

      <Outlet />
    </div>
  )
}
