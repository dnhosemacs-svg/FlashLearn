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

  const stats = useMemo(() => {
    const total = allFlashcards.length
    const withTags = allFlashcards.filter((card) => (card.tags?.length ?? 0) > 0).length
    const withoutTags = total - withTags

    return { total, withTags, withoutTags }
  }, [allFlashcards])

  if (network.status === 'loading' && allFlashcards.length === 0) {
    return (
      <CardCarbon title={title} description={description} variant="elevated">
        <SpinnerCarbon label="Cargando resumen" />
      </CardCarbon>
    )
  }

  if (network.status === 'error') {
    return (
      <CardCarbon title={title} description={description} variant="elevated">
        <p className="text-sm text-red-800">{network.error ?? 'Error desconocido'}</p>
      </CardCarbon>
    )
  }

  return (
    <CardCarbon title={title} description={description} variant="elevated">
      <dl className="grid gap-2 text-sm text-slate-700 sm:grid-cols-3">
        <div className="rounded-lg border border-indigo-200 bg-white/70 p-3">
          <dt className="text-slate-600">Total</dt>
          <dd className="mt-1 text-lg font-semibold text-slate-900">{stats.total}</dd>
        </div>
        <div className="rounded-lg border border-indigo-200 bg-white/70 p-3">
          <dt className="text-slate-600">Con tags</dt>
          <dd className="mt-1 text-lg font-semibold text-slate-900">{stats.withTags}</dd>
        </div>
        <div className="rounded-lg border border-indigo-200 bg-white/70 p-3">
          <dt className="text-slate-600">Sin tags</dt>
          <dd className="mt-1 text-lg font-semibold text-slate-900">{stats.withoutTags}</dd>
        </div>
      </dl>
    </CardCarbon>
  )
}
