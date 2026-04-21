import { useState } from 'react'
import ButtonCarbon from '../../ui-carbon/ButtonCarbon'
import CardCarbon from '../../ui-carbon/CardCarbon'
import InputCarbon from '../../ui-carbon/InputCarbon'
import type { CreateCollectionInput } from '../../../types/domain'

interface CollectionFormProps {
  onSubmit: (data: CreateCollectionInput) => void
  isSubmitting?: boolean
  mode?: 'create' | 'edit'
  initialValues?: {
    name: string
    description?: string
  }
  submitLabel?: string
  onCancel?: () => void
  existingNames?: string[]
  currentName?: string
}

export default function CollectionForm({
  onSubmit,
  isSubmitting = false,
  mode = 'create',
  initialValues,
  submitLabel,
  onCancel,
  existingNames = [],
  currentName,
}: CollectionFormProps) {
  const [name, setName] = useState(initialValues?.name ?? '')
  const [description, setDescription] = useState(initialValues?.description ?? '')
  const [nameError, setNameError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // Se sanea input para validar y persistir datos consistentes.
    const trimmedName = name.trim()
    const trimmedDescription = description.trim()

    if (!trimmedName) {
      setNameError('El nombre es obligatorio')
      setSuccessMessage('')
      return
    }

    const normalizedName = trimmedName.toLowerCase()
    const normalizedCurrent = (currentName ?? '').trim().toLowerCase()

    // Evita colisiones por nombre ignorando mayúsculas/minúsculas y espacios.
    const isDuplicate =
      normalizedName !== normalizedCurrent &&
      existingNames.some((n) => n.trim().toLowerCase() === normalizedName)

    if (isDuplicate) {
      setNameError('Ya existe una colección con ese nombre')
      setSuccessMessage('')
      return
    }

    setNameError('')
    onSubmit({
      name: trimmedName,
      description: trimmedDescription || undefined,
    })

    setSuccessMessage(
      mode === 'edit'
        ? 'Colección actualizada correctamente.'
        : 'Colección creada correctamente.',
    )

    // En modo creación se limpia el formulario para carga rápida de más elementos.
    if (mode === 'create') {
      setName('')
      setDescription('')
    }
  }

  return (
    <CardCarbon
      title={mode === 'edit' ? 'Editar coleccion' : 'Nueva coleccion'}
      description={
        mode === 'edit'
          ? 'Actualiza los datos de la coleccion seleccionada.'
          : 'Crea una coleccion para agrupar tarjetas de estudio.'
      }
      variant="elevated"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputCarbon
          id="collection-name"
          label="Nombre"
          value={name}
          error={nameError}
          placeholder="Ej: React Hooks"
          onChange={(event) => {
            setName(event.target.value)
            if (nameError) setNameError('')
          }}
        />

        <InputCarbon
          id="collection-description"
          label="Descripcion (opcional)"
          value={description}
          placeholder="Ej: Hooks y patrones de React"
          onChange={(event) => setDescription(event.target.value)}
        />

        {successMessage ? <p className="text-sm text-green-700">{successMessage}</p> : null}

        <div className="flex flex-wrap gap-2">
          <ButtonCarbon type="submit" isLoading={isSubmitting}>
            {submitLabel ?? (mode === 'edit' ? 'Guardar cambios' : 'Guardar coleccion')}
          </ButtonCarbon>
          {mode === 'edit' && onCancel ? (
            <ButtonCarbon type="button" variant="ghost" onClick={onCancel}>
              Cancelar edicion
            </ButtonCarbon>
          ) : null}
        </div>
      </form>
    </CardCarbon>
  )
}
