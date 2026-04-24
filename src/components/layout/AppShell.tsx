import type { ReactNode } from 'react'
import MainNav from './MainNav'

interface AppShellProps {
  children: ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  return (
    // Shell principal: navegación persistente + área de contenido por ruta.
    <div className="app-shell">
      <MainNav />
      <div className="app-shell__body">
        <div
          className="app-shell__content"
          style={{ width: '100%', maxWidth: '64rem', marginInline: 'auto' }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
