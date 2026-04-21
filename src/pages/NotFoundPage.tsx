import { useNavigate } from 'react-router-dom'
import ButtonCarbon from '../components/ui-carbon/ButtonCarbon'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <main className="page-shell">
      <h1 className="page-title">404</h1>
      <p className="page-subtitle">La página que buscas no existe.</p>

      <section className="section-stack mt-6 max-w-xl">
        <p className="text-slate-700">
          Puede que la URL esté mal escrita o que la página haya cambiado de ruta.
        </p>

        <div>
          <ButtonCarbon type="button" onClick={() => navigate('/')}>
            Volver al inicio
          </ButtonCarbon>
        </div>
      </section>
    </main>
  )
}