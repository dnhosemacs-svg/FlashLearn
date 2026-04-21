import { Theme } from '@carbon/react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/collections', label: 'Colecciones' },
  { to: '/study', label: 'Estudio' },
  { to: '/about', label: 'Acerca' },
  { to: '/settings', label: 'Ajustes' },
]

export default function MainNav() {
  return (
    // Carbon Theme unifica tokens visuales en todo el encabezado.
    <Theme theme="g10">
      <header className="app-shell__nav" aria-label="FlashLearn">
        <nav className="app-shell__nav-content">
          <NavLink to="/" end className="app-shell__brand">
            FlashLearn
          </NavLink>
          {/* Renderizado declarativo de rutas de navegación. */}
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `app-shell__link ${isActive ? 'app-shell__link--active' : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>
    </Theme>
  )
}
