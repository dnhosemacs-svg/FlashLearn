import { Outlet } from 'react-router-dom'
import AppShell from './components/layout/AppShell'

export default function App() {
  return (
    // Outlet renderiza la página activa dentro del shell común de la app.
    <AppShell>
      <Outlet />
    </AppShell>
  )
}
