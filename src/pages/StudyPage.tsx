import { useCallback, useEffect, useMemo, useState } from 'react'
import StudyCard from '../components/features/study/StudyCard'
import StudyControls from '../components/features/study/StudyControls'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import Spinner from '../components/ui/Spinner'
import { useFlashcards } from '../hooks'
import type { Flashcard } from '../types/domain'

function shuffleArray<T>(items: T[]) {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export default function StudyPage() {
  const { flashcards: loadedFlashcards, network, refresh } = useFlashcards()
  /** Orden local al barajar; se resetea cuando cambian las tarjetas cargadas. */
  const [sessionOrder, setSessionOrder] = useState<Flashcard[] | null>(null)

  const deck = sessionOrder ?? loadedFlashcards

  useEffect(() => {
    setSessionOrder(null)
  }, [loadedFlashcards])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isRevealed, setIsRevealed] = useState(false)

  const currentFlashcard = useMemo(() => deck[currentIndex], [deck, currentIndex])

  const studyStats = useMemo(() => {
    const total = deck.length
    const current = total === 0 ? 0 : currentIndex + 1
    const progressPercent = total === 0 ? 0 : Math.round((current / total) * 100)

    const revealedLabel = isRevealed ? 'Respuesta visible' : 'Respuesta oculta'

    return {
      total,
      current,
      progressPercent,
      revealedLabel,
    }
  }, [deck.length, currentIndex, isRevealed])

  useEffect(() => {
    const handleFocus = () => {
      void refresh()
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [refresh])

  useEffect(() => {
    if (deck.length === 0) {
      setCurrentIndex(0)
      setIsRevealed(false)
      return
    }

    if (currentIndex > deck.length - 1) {
      setCurrentIndex(deck.length - 1)
      setIsRevealed(false)
    }
  }, [deck, currentIndex])

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
    setSessionOrder((prev) => shuffleArray([...(prev ?? loadedFlashcards)]))
    setCurrentIndex(0)
    setIsRevealed(false)
  }, [loadedFlashcards])

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

      <section className="section-stack lg:mx-auto lg:max-w-3xl">
        <p className="text-sm text-slate-600">
          Progreso: {studyStats.current} / {studyStats.total} ({studyStats.progressPercent}%) ·{' '}
          {studyStats.revealedLabel}
        </p>

        {currentFlashcard && (
          <StudyCard flashcard={currentFlashcard} isRevealed={isRevealed} />
        )}

        <StudyControls
          onPrev={handlePrev}
          onNext={handleNext}
          onReveal={handleReveal}
          onShuffle={handleShuffle}
          canPrev={currentIndex > 0}
          canNext={currentIndex < deck.length - 1}
          isRevealed={isRevealed}
        />
      </section>
    </main>
  )
}
