import FlashcardsSummary from '../components/features/flashcards/FlashcardsSummary'
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
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">
            <p>{network.error}</p>
            <Button type="button" className="mt-2" variant="secondary" size="sm" onClick={() => void refresh()}>
              Reintentar
            </Button>
          </div>
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
