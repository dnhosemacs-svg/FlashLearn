import { useCallback, useEffect, useMemo, useState } from 'react'
import FlashcardsSummary from '../components/features/flashcards/FlashcardsSummary'
import StudyCard from '../components/features/study/StudyCard'
import StudyControls from '../components/features/study/StudyControls'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import Spinner from '../components/ui/Spinner'
import { useFlashcardsContext } from '../context/useFlashcardsContext'
import type { Flashcard } from '../types/domain'
import { useCollectionsContext } from '../context/useCollectionsContext'

function shuffleArray<T>(items: T[]) {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export default function StudyPage() {
  const { flashcards: loadedFlashcards, network, refresh } = useFlashcardsContext()
  const { collections } = useCollectionsContext()
  /** Orden local al barajar; se resetea cuando cambian las tarjetas cargadas. */
  const [sessionOrder, setSessionOrder] = useState<Flashcard[] | null>(null)
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('all')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isRevealed, setIsRevealed] = useState(false)
  
  const filteredFlashcards = useMemo(() => {
    if (selectedCollectionId === 'all') return loadedFlashcards
    return loadedFlashcards.filter((c) => c.collectionId === selectedCollectionId)
  }, [loadedFlashcards, selectedCollectionId])
  
  const deck = useMemo(() => {
    if (!sessionOrder) return filteredFlashcards
    const availableIds = new Set(filteredFlashcards.map((card) => card.id))
    return sessionOrder.filter((card) => availableIds.has(card.id))
  }, [sessionOrder, filteredFlashcards])

  const maxIndex = Math.max(deck.length - 1, 0)
  const effectiveIndex = Math.min(currentIndex, maxIndex)
  const currentFlashcard = useMemo(() => deck[effectiveIndex], [deck, effectiveIndex])

  const studyStats = useMemo(() => {
    const total = deck.length
    const current = total === 0 ? 0 : effectiveIndex + 1
    const progressPercent = total === 0 ? 0 : Math.round((current / total) * 100)

    const revealedLabel = isRevealed ? 'Respuesta visible' : 'Respuesta oculta'

    return {
      total,
      current,
      progressPercent,
      revealedLabel,
    }
  }, [deck.length, effectiveIndex, isRevealed])

  useEffect(() => {
    const handleFocus = () => {
      void refresh()
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [refresh])

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
    setIsRevealed(false)
  }, [])

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, deck.length - 1))
    setIsRevealed(false)
  }, [deck.length])

  const handleReveal = useCallback(() => {
    setIsRevealed((prev) => !prev)
  }, [])

  const handleShuffle = useCallback(() => {
    setSessionOrder(() => shuffleArray([...filteredFlashcards]))
    setCurrentIndex(0)
    setIsRevealed(false)
  }, [filteredFlashcards])

  if (network.status === 'loading' && loadedFlashcards.length === 0) {
    return (
      <main className="page-shell">
        <h1 className="page-title">Estudio</h1>
        <p className="page-subtitle">Modo estudio</p>
        <div className="mt-8 flex justify-center">
          <Spinner label="Cargando tarjetas" />
        </div>
      </main>
    )
  }

  if (network.status === 'error') {
    return (
      <main className="page-shell">
        <h1 className="page-title">Estudio</h1>
        <p className="page-subtitle">Modo estudio</p>
        <section className="section-stack">
          <EmptyState
            title="No se pudieron cargar las tarjetas"
            description={network.error ?? 'Error desconocido'}
            action={
              <Button type="button" onClick={() => void refresh()}>
                Reintentar
              </Button>
            }
          />
        </section>
      </main>
    )
  }

  if (deck.length === 0) {
    return (
      <main className="page-shell">
        <h1 className="page-title">Estudio</h1>
        <p className="page-subtitle">Modo estudio</p>
        <section className="section-stack">
          <EmptyState
            title="No hay tarjetas para estudiar"
            description="Crea tarjetas en una colección para empezar."
          />
        </section>
      </main>
    )
  }

  return (
    <main className="page-shell">
      <h1 className="page-title">Estudio</h1>
      <p className="page-subtitle">Practica con tus flashcards</p>

      <div className="mt-4 lg:mx-auto lg:max-w-3xl">
        <FlashcardsSummary title="Resumen del mazo" description="Estadísticas globales de tus tarjetas." />
      </div>

      <section className="section-stack lg:mx-auto lg:max-w-3xl">
        <p className="text-sm text-slate-600">
          Progreso: {studyStats.current} / {studyStats.total} ({studyStats.progressPercent}%) ·{' '}
          {studyStats.revealedLabel}
        </p>

        <div className="mt-4 lg:mx-auto lg:max-w-3xl">
          <label className="block text-sm font-medium text-slate-700">
            Colección
          </label>
          <select
            value={selectedCollectionId}
            onChange={(e) => {
              setSelectedCollectionId(e.target.value)
              setSessionOrder(null)
              setCurrentIndex(0)
              setIsRevealed(false)
            }}
            className="mt-2 w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="all">Todas las colecciones</option>
            {collections.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {currentFlashcard && (
          <StudyCard flashcard={currentFlashcard} isRevealed={isRevealed} />
        )}

        <StudyControls
          onPrev={handlePrev}
          onNext={handleNext}
          onReveal={handleReveal}
          onShuffle={handleShuffle}
          canPrev={effectiveIndex > 0}
          canNext={effectiveIndex < deck.length - 1}
          isRevealed={isRevealed}
        />
      </section>
    </main>
  )
}
