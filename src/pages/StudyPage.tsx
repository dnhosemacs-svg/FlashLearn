import { useEffect, useMemo, useState } from 'react'
import StudyCard from '../components/features/study/StudyCard'
import StudyControls from '../components/features/study/StudyControls'
import EmptyState from '../components/ui/EmptyState'
import type { Flashcard } from '../types/domain'

const FLASHCARDS_STORAGE_KEY = 'flashlearn.flashcards'

function loadStoredFlashcards(): Flashcard[] {
  const stored = localStorage.getItem(FLASHCARDS_STORAGE_KEY)
  if (!stored) return []

  try {
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function shuffleArray<T>(items: T[]) {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export default function StudyPage() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isRevealed, setIsRevealed] = useState(false)
  const currentFlashcard = useMemo(
    () => flashcards[currentIndex],
    [flashcards, currentIndex],
  )
  
  const studyStats = useMemo(() => {
    const total = flashcards.length
    const current = total === 0 ? 0 : currentIndex + 1
    const progressPercent = total === 0 ? 0 : Math.round((current / total) * 100)
  
    const revealedLabel = isRevealed ? 'Respuesta visible' : 'Respuesta oculta'
  
    return {
      total,
      current,
      progressPercent,
      revealedLabel,
    }
  }, [flashcards.length, currentIndex, isRevealed])

  useEffect(() => {
    setFlashcards(loadStoredFlashcards())
  }, [])

  useEffect(() => {
    const handleFocus = () => {
      setFlashcards(loadStoredFlashcards())
    }
  
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  useEffect(() => {
    if (flashcards.length === 0) {
      setCurrentIndex(0)
      setIsRevealed(false)
      return
    }
  
    if (currentIndex > flashcards.length - 1) {
      setCurrentIndex(flashcards.length - 1)
      setIsRevealed(false)
    }
  }, [flashcards, currentIndex])

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
    setIsRevealed(false)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, flashcards.length - 1))
    setIsRevealed(false)
  }

  const handleReveal = () => {
    setIsRevealed((prev) => !prev)
  }

  const handleShuffle = () => {
    setFlashcards((prev) => shuffleArray(prev))
    setCurrentIndex(0)
    setIsRevealed(false)
  }

  if (flashcards.length === 0) {
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
          canNext={currentIndex < flashcards.length - 1}
          isRevealed={isRevealed}
        />
      </section>
    </main>
  )
}