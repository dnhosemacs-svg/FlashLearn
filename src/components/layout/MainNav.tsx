import {
  Header,
  HeaderContainer,
  HeaderMenuItem,
  HeaderName,
  HeaderNavigation,
} from '@carbon/react'
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
    <HeaderContainer
      render={() => (
        <Header aria-label="FlashLearn">
          <HeaderName href="/" prefix="">
            FlashLearn
          </HeaderName>

          <HeaderNavigation aria-label="FlashLearn navegación">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end}>
                {({ isActive }) => (
                  <HeaderMenuItem isCurrentPage={isActive}>
                    {link.label}
                  </HeaderMenuItem>
                )}
              </NavLink>
            ))}
          </HeaderNavigation>
        </Header>
      )}
    />
  )
}
