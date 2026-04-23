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
      <nav className="app-shell__nav-content">
        <div className="app-shell__nav-top">
          <NavLink to="/" end className="app-shell__brand" onClick={() => setIsMobileMenuOpen(false)}>
            FlashLearn
          </NavLink>
          <button
            type="button"
            className="app-shell__menu-toggle md:hidden"
            aria-expanded={isMobileMenuOpen}
            aria-controls="main-nav-links"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            Menú
            <img
              src="/arrow-down-s-fill.svg"
              alt=""
              aria-hidden="true"
              className={`app-shell__menu-icon ${isMobileMenuOpen ? 'app-shell__menu-icon--open' : ''}`}
            />
          </button>
        </div>
        <div
          id="main-nav-links"
          className={`app-shell__links ${isMobileMenuOpen ? 'app-shell__links--open' : ''}`}
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
