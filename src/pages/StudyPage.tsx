import { useCallback, useEffect, useMemo, useState } from 'react'
import FlashcardsSummary from '../components/features/flashcards/FlashcardsSummary'
import StudyCard from '../components/features/study/StudyCard'
import StudyControls from '../components/features/study/StudyControls'
import ButtonCarbon from '../components/ui-carbon/ButtonCarbon'
import EmptyStateCarbon from '../components/ui-carbon/EmptyStateCarbon'
import SelectCarbon from '../components/ui-carbon/SelectCarbon'
import SpinnerCarbon from '../components/ui-carbon/SpinnerCarbon'
import { useFlashcardsContext } from '../context/useFlashcardsContext'
import type { Flashcard } from '../types/domain'
import { useCollectionsContext } from '../context/useCollectionsContext'

function shuffleArray<T>(items: T[]) {
  // Fisher-Yates para barajar sin sesgo estadístico.
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
    // Permite estudiar todo o solo la colección seleccionada.
    if (selectedCollectionId === 'all') return loadedFlashcards
    return loadedFlashcards.filter((c) => c.collectionId === selectedCollectionId)
  }, [loadedFlashcards, selectedCollectionId])
  
  const deck = useMemo(() => {
    // Mantiene el orden barajado solo para tarjetas aún disponibles tras filtrar.
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
    // Sincroniza datos cuando el usuario vuelve a enfocar la pestaña.
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
          <SpinnerCarbon label="Cargando tarjetas" />
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
          <EmptyStateCarbon
            title="No se pudieron cargar las tarjetas"
            description={network.error ?? 'Error desconocido'}
            action={
              <ButtonCarbon type="button" onClick={() => void refresh()}>
                Reintentar
              </ButtonCarbon>
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
          <EmptyStateCarbon
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
          <SelectCarbon
            id="study-collection-filter"
            label="Colección"
            value={selectedCollectionId}
            onChange={(value) => {
              // Cambiar colección reinicia avance y estado de revelado de la sesión.
              setSelectedCollectionId(value)
              setSessionOrder(null)
              setCurrentIndex(0)
              setIsRevealed(false)
            }}
            options={[
              { value: 'all', label: 'Todas las colecciones' },
              ...collections.map((c) => ({ value: c.id, label: c.name })),
            ]}
          />
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
