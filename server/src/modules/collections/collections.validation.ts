import type { CreateCollectionInput, UpdateCollectionInput } from './collections.types.js'

export function validateCreateCollection(body: unknown): { ok: true; data: CreateCollectionInput } | { ok: false; error: string } {
  if (typeof body !== 'object' || body === null) return { ok: false, error: 'Body inválido' }

  const raw = body as Record<string, unknown>
  const name = typeof raw.name === 'string' ? raw.name.trim() : ''
  const description =
    typeof raw.description === 'string' ? raw.description.trim() || undefined : undefined

  if (!name) return { ok: false, error: 'name es obligatorio' }

  return { ok: true, data: { name, description } }
}

export function validateUpdateCollection(body: unknown): { ok: true; data: UpdateCollectionInput } | { ok: false; error: string } {
  return validateCreateCollection(body)
}