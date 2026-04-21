import { useState } from 'react'
import ButtonCarbon from '../../ui-carbon/ButtonCarbon'
import CardCarbon from '../../ui-carbon/CardCarbon'
import InputCarbon from '../../ui-carbon/InputCarbon'
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
  const [question, setQuestion] = useState(initialValues?.question ?? '')
  const [answer, setAnswer] = useState(initialValues?.answer ?? '')
  const [tagsText, setTagsText] = useState((initialValues?.tags ?? []).join(', '))
  const [questionError, setQuestionError] = useState('')
  const [answerError, setAnswerError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

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
    <CardCarbon
      title={mode === 'edit' ? 'Editar flashcard' : 'Nueva flashcard'}
      description={mode === 'edit' ? 'Actualiza la tarjeta seleccionada' : 'Crea una tarjeta de estudio'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputCarbon
          id="flashcard-question"
          label="Pregunta"
          value={question}
          error={questionError}
          onChange={(e) => {
            setQuestion(e.target.value)
            if (questionError) setQuestionError('')
          }}
        />
        <InputCarbon
          id="flashcard-answer"
          label="Respuesta"
          value={answer}
          error={answerError}
          onChange={(e) => {
            setAnswer(e.target.value)
            if (answerError) setAnswerError('')
          }}
        />
        <InputCarbon
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
          <ButtonCarbon type="submit">
            {submitLabel ?? (mode === 'edit' ? 'Guardar cambios' : 'Guardar flashcard')}
          </ButtonCarbon>
          {mode === 'edit' && onCancel ? (
            <ButtonCarbon type="button" variant="ghost" onClick={onCancel}>
              Cancelar edición
            </ButtonCarbon>
          ) : null}
        </div>
      </form>
    </CardCarbon>
  )
}