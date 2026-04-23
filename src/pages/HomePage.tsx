import FlashcardsSummary from '../components/features/flashcards/FlashcardsSummary'
import Alert from '../components/ui/Alert'
import ButtonCarbon from '../components/ui-carbon/ButtonCarbon'
import SpinnerCarbon from '../components/ui-carbon/SpinnerCarbon'
import { useCollectionsContext } from '../context/useCollectionsContext'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const { collections, network, refresh } = useCollectionsContext()
  const navigate = useNavigate()
  
  return (
    <main className="page-shell">
      <h1 className="page-title">FlashLearn</h1>
      <p className="page-subtitle">Repasa con flashcards organizadas en colecciones.</p>

      <section className="section-stack mt-6 max-w-xl">
        {/* Estados de carga/error/éxito para resumen rápido de colecciones. */}
        {network.status === 'loading' && collections.length === 0 ? (
          <SpinnerCarbon label="Cargando resumen" />
        ) : network.status === 'error' ? (
          <Alert
            variant="danger"
            action={
              <ButtonCarbon type="button" variant="secondary" size="sm" onClick={() => void refresh()}>
                Reintentar
              </ButtonCarbon>
            }
          >
            {network.error}
          </Alert>
        ) : (
          <p className="text-muted">
            Tienes <strong className="text-[var(--fl-text)]">{collections.length}</strong>{' '}
            {collections.length === 1 ? 'colección' : 'colecciones'} en local.
          </p>
        )}

        <FlashcardsSummary />

        <div className="flex flex-wrap gap-3">
          {/* Acciones primarias para entrar al flujo de trabajo principal. */}
          <ButtonCarbon variant="primary" onClick={() => navigate('/collections')}>
            Ir a colecciones
          </ButtonCarbon>
          <ButtonCarbon variant="secondary" onClick={() => navigate('/study')}>
            Modo estudio
          </ButtonCarbon>
        </div>
      </section>
    </main>
  )
}
