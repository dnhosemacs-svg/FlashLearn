import { useEffect, useState } from 'react'
import Button from '../../ui/Button'
import Card from '../../ui/Card'
import Input from '../../ui/Input'
import type { CreateFlashcardInput } from '../../../types/domain'

interface FlashcardFormProps {
  onSubmit: (data: CreateFlashcardInput) => void
  mode?: 'create' | 'edit'
  initialValues?: {
    question: string
    answer: string
    tags?: string[]
  }
  submitLabel?: string
  onCancel?: () => void
}

export default function FlashcardForm({
  onSubmit,
  mode = 'create',
  initialValues,
  submitLabel,
  onCancel,
}: FlashcardFormProps) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [tagsText, setTagsText] = useState('')
  const [questionError, setQuestionError] = useState('')
  const [answerError, setAnswerError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    setQuestion(initialValues?.question ?? '')
    setAnswer(initialValues?.answer ?? '')
    setTagsText((initialValues?.tags ?? []).join(', '))
    setQuestionError('')
    setAnswerError('')
    setSuccessMessage('')
  }, [initialValues, mode])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const q = question.trim()
    const a = answer.trim()

    setQuestionError(q ? '' : 'La pregunta es obligatoria')
    setAnswerError(a ? '' : 'La respuesta es obligatoria')

    if (!q || !a) {
      setSuccessMessage('')
      return
    }

    const tags = tagsText
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)

    onSubmit({
      question: q,
      answer: a,
      tags: tags.length ? tags : undefined,
    })

    setSuccessMessage(mode === 'edit' ? 'Flashcard actualizada correctamente.' : 'Flashcard creada correctamente.')

    if (mode === 'create') {
      setQuestion('')
      setAnswer('')
      setTagsText('')
    }
  }

  return (
    <Card
      title={mode === 'edit' ? 'Editar flashcard' : 'Nueva flashcard'}
      description={mode === 'edit' ? 'Actualiza la tarjeta seleccionada' : 'Crea una tarjeta de estudio'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="flashcard-question"
          label="Pregunta"
          value={question}
          error={questionError}
          onChange={(e) => {
            setQuestion(e.target.value)
            if (questionError) setQuestionError('')
          }}
        />
        <Input
          id="flashcard-answer"
          label="Respuesta"
          value={answer}
          error={answerError}
          onChange={(e) => {
            setAnswer(e.target.value)
            if (answerError) setAnswerError('')
          }}
        />
        <Input
          id="flashcard-tags"
          label="Tags (opcional)"
          hint="Separados por coma"
          value={tagsText}
          onChange={(e) => setTagsText(e.target.value)}
        />

        {successMessage ? (
          <p className="text-sm text-green-700">{successMessage}</p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <Button type="submit">
            {submitLabel ?? (mode === 'edit' ? 'Guardar cambios' : 'Guardar flashcard')}
          </Button>
          {mode === 'edit' && onCancel ? (
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancelar edición
            </Button>
          ) : null}
        </div>
      </form>
    </Card>
  )
}