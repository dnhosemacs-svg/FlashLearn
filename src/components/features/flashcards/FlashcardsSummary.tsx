import { useMemo } from 'react'
import { useFlashcardsContext } from '../../../context/useFlashcardsContext'
import CardCarbon from '../../ui-carbon/CardCarbon'
import SpinnerCarbon from '../../ui-carbon/SpinnerCarbon'

interface FlashcardsSummaryProps {
  title?: string
  description?: string
}

export default function FlashcardsSummary({
  title = 'Resumen de flashcards',
  description = 'Tarjetas disponibles en todas tus colecciones.',
}: FlashcardsSummaryProps) {
  const { allFlashcards, network } = useFlashcardsContext()

  // Estadísticas derivadas memorizadas para evitar recálculos en cada render.
  const stats = useMemo(() => {
    const total = allFlashcards.length
    const withTags = allFlashcards.filter((card) => (card.tags?.length ?? 0) > 0).length
    const withoutTags = total - withTags

    return { total, withTags, withoutTags }
  }, [allFlashcards])

  // Skeleton/loader solo cuando aún no hay datos iniciales.
  if (network.status === 'loading' && allFlashcards.length === 0) {
    return (
      <CardCarbon title={title} description={description} variant="elevated">
        <SpinnerCarbon label="Cargando resumen" />
      </CardCarbon>
    )
  }

  // Vista de error local para no romper el resto de la pantalla.
  if (network.status === 'error') {
    return (
      <CardCarbon title={title} description={description} variant="elevated">
        <p className="text-danger text-sm">{network.error ?? 'Error desconocido'}</p>
      </CardCarbon>
    )
  }

  return (
    <CardCarbon title={title} description={description} variant="elevated">
      <dl className="grid gap-2 text-sm text-[var(--fl-text-soft)] sm:grid-cols-3">
        <div className="surface-item" style={{ padding: '0.5rem 0.75rem' }}>
          <dt className="text-[var(--fl-text-muted)]">Total</dt>
          <dd className="mt-1 text-lg font-semibold text-[var(--fl-text)]">{stats.total}</dd>
        </div>
        <div className="surface-item" style={{ padding: '0.5rem 0.75rem' }}>
          <dt className="text-[var(--fl-text-muted)]">Con tags</dt>
          <dd className="mt-1 text-lg font-semibold text-[var(--fl-text)]">{stats.withTags}</dd>
        </div>
        <div className="surface-item" style={{ padding: '0.5rem 0.75rem' }}>
          <dt className="text-[var(--fl-text-muted)]">Sin tags</dt>
          <dd className="mt-1 text-lg font-semibold text-[var(--fl-text)]">{stats.withoutTags}</dd>
        </div>
      </dl>
    </CardCarbon>
  )
}
