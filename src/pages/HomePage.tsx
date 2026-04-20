import FlashcardsSummary from '../components/features/flashcards/FlashcardsSummary'
import Alert from '../components/ui/Alert'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
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
        {network.status === 'loading' && collections.length === 0 ? (
          <Spinner label="Cargando resumen" size="sm" />
        ) : network.status === 'error' ? (
          <Alert
            variant="danger"
            action={
              <Button type="button" variant="secondary" size="sm" onClick={() => void refresh()}>
                Reintentar
              </Button>
            }
          >
            {network.error}
          </Alert>
        ) : (
          <p className="text-muted">
            Tienes <strong className="text-slate-800">{collections.length}</strong>{' '}
            {collections.length === 1 ? 'colección' : 'colecciones'} en local.
          </p>
        )}

        <FlashcardsSummary />

        <div className="flex flex-wrap gap-3">
            <Button variant="primary" onClick={() => navigate('/collections')}>Ir a colecciones</Button>
            <Button variant="secondary" onClick={() => navigate('/study')}>Modo estudio</Button>
        </div>
      </section>
    </main>
  )
}
