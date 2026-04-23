import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/collections', label: 'Colecciones' },
  { to: '/study', label: 'Estudio' },
  { to: '/about', label: 'Acerca' },
  { to: '/settings', label: 'Ajustes' },
]

export default function MainNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="app-shell__nav" aria-label="FlashLearn">
      <nav className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-5 py-6 md:flex-row md:items-center md:justify-start md:gap-8 md:px-8">
        <div className="flex items-center justify-between gap-3 md:flex-none">
          <NavLink
            to="/"
            end
            className="text-xl font-bold text-[var(--fl-heading)]"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            FlashLearn
          </NavLink>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-md border border-[var(--fl-border)] bg-[color-mix(in_oklab,var(--fl-surface-1)_82%,transparent)] px-2 py-1 text-sm font-medium text-[var(--fl-text-soft)] transition-colors hover:bg-[color-mix(in_oklab,var(--fl-surface-accent)_55%,white)] hover:text-[var(--fl-heading)] md:hidden"
            aria-expanded={isMobileMenuOpen}
            aria-controls="main-nav-links"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            Menú
            <img
              src="/arrow-down-s-fill.svg"
              alt=""
              aria-hidden="true"
              className={`h-[1.1rem] w-[1.1rem] text-[var(--fl-heading)] transition-transform ${
                isMobileMenuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>
        <div
          id="main-nav-links"
          className={`${isMobileMenuOpen ? 'flex' : 'hidden'} flex-col gap-2 md:flex md:flex-row md:items-center md:gap-2`}
        >
          {/* Renderizado declarativo de rutas de navegación. */}
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `app-shell__link ${isActive ? 'app-shell__link--active' : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  )
}
