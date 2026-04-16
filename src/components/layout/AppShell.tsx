import type { ReactNode } from 'react'
import MainNav from './MainNav'

interface AppShellProps {
  children: ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell">
      <MainNav />
      <div className="app-shell__body">
        <div className="app-shell__content">{children}</div>
      </div>
    </div>
  )
}
