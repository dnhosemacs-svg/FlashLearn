import type { CreateFlashcardInput, UpdateFlashcardInput } from './flashcards.types.js'

function normalizeTags(raw: unknown): string[] | undefined {
  // Limpia tags inválidos/vacíos para mantener shape estable.
  if (!Array.isArray(raw)) return undefined
  const tags = raw.filter((v): v is string => typeof v === 'string').map((t) => t.trim()).filter(Boolean)
  return tags.length ? tags : undefined
}

export function validateCreateFlashcard(body: unknown): { ok: true; data: CreateFlashcardInput } | { ok: false; error: string } {
  // Valida requeridos de creación y normaliza texto entrante.
  if (typeof body !== 'object' || body === null) return { ok: false, error: 'Body inválido' }
  const raw = body as Record<string, unknown>

  const collectionId = typeof raw.collectionId === 'string' ? raw.collectionId.trim() : ''
  const question = typeof raw.question === 'string' ? raw.question.trim() : ''
  const answer = typeof raw.answer === 'string' ? raw.answer.trim() : ''
  const tags = normalizeTags(raw.tags)

  if (!collectionId) return { ok: false, error: 'collectionId es obligatorio' }
  if (!question) return { ok: false, error: 'question es obligatorio' }
  if (!answer) return { ok: false, error: 'answer es obligatorio' }

  return { ok: true, data: { collectionId, question, answer, tags } }
}

export function validateUpdateFlashcard(body: unknown): { ok: true; data: UpdateFlashcardInput } | { ok: false; error: string } {
  if (typeof body !== 'object' || body === null) return { ok: false, error: 'Body inválido' }
  const raw = body as Record<string, unknown>

  const question = typeof raw.question === 'string' ? raw.question.trim() : ''
  const answer = typeof raw.answer === 'string' ? raw.answer.trim() : ''
  const tags = normalizeTags(raw.tags)

  if (!question) return { ok: false, error: 'question es obligatorio' }
  if (!answer) return { ok: false, error: 'answer es obligatorio' }

  return { ok: true, data: { question, answer, tags } }
}