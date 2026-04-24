import { useEffect, useState } from 'react'
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
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 768px)').matches : false,
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)')
    const updateDesktopState = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches)
      if (event.matches) {
        setIsMobileMenuOpen(false)
      }
    }

    setIsDesktop(mediaQuery.matches)
    mediaQuery.addEventListener('change', updateDesktopState)

    return () => {
      mediaQuery.removeEventListener('change', updateDesktopState)
    }
  }, [])

  return (
    <header className="app-shell__nav" aria-label="FlashLearn">
      <nav
        className="app-shell__nav-content"
        style={
          isDesktop
            ? {
                display: 'grid',
                gridTemplateColumns: 'auto minmax(0, 1fr)',
                alignItems: 'center',
              }
            : undefined
        }
      >
        <div className="app-shell__nav-top">
          <NavLink
            to="/"
            end
            className="app-shell__brand"
            style={{ fontWeight: 800, fontSize: '1.25rem', lineHeight: '1.75rem' }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
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
          style={isDesktop ? { display: 'flex', flexDirection: 'row', alignItems: 'center' } : undefined}
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
