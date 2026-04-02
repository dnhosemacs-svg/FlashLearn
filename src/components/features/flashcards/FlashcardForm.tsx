import { useState } from 'react'
import Button from '../../ui/Button'
import Card from '../../ui/Card'
import Input from '../../ui/Input'
import type { CreateFlashcardInput } from '../../../types/domain'

interface FlashcardFormProps {
  onSubmit: (data: CreateFlashcardInput) => void
}

export default function FlashcardForm({ onSubmit }: FlashcardFormProps) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [tagsText, setTagsText] = useState('')
  const [questionError, setQuestionError] = useState('')
  const [answerError, setAnswerError] = useState('')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const q = question.trim()
    const a = answer.trim()

    setQuestionError(q ? '' : 'La pregunta es obligatoria')
    setAnswerError(a ? '' : 'La respuesta es obligatoria')
    if (!q || !a) return

    const tags = tagsText
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)

    onSubmit({ question: q, answer: a, tags: tags.length ? tags : undefined })
    setQuestion('')
    setAnswer('')
    setTagsText('')
  }

  return (
    <Card title="Nueva flashcard" description="Crea una tarjeta de estudio">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
          id="flashcard-question" 
          label="Pregunta" 
          value={question} 
          error={questionError} 
          onChange={(e) => {
            setQuestion(e.target.value)
            if (questionError) setQuestionError('')
          }} />
        <Input 
          id="flashcard-answer" 
          label="Respuesta" 
          value={answer} error={answerError} 
          onChange={(e) => {
            setAnswer(e.target.value)
            if (answerError) setAnswerError('')
          }} />
        <Input 
        id="flashcard-tags" 
        label="Tags (opcional)" 
        hint="Separados por coma" 
        value={tagsText} 
        onChange={(e) => setTagsText(e.target.value)} />
        <Button type="submit">Guardar flashcard</Button>
      </form>
    </Card>
  )
}