import { useEffect, useState } from 'react'
import Button from '../../ui/Button'
import Card from '../../ui/Card'
import Input from '../../ui/Input'
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
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [nameError, setNameError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    setName(initialValues?.name ?? '')
    setDescription(initialValues?.description ?? '')
    setNameError('')
    setSuccessMessage('')
  }, [initialValues, mode])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedName = name.trim()
    const trimmedDescription = description.trim()

    if (!trimmedName) {
      setNameError('El nombre es obligatorio')
      setSuccessMessage('')
      return
    }

    const normalizedName = trimmedName.toLowerCase()
    const normalizedCurrent = (currentName ?? '').trim().toLowerCase()

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

    if (mode === 'create') {
      setName('')
      setDescription('')
    }
  }

  return (
    <Card
      title={mode === 'edit' ? 'Editar coleccion' : 'Nueva coleccion'}
      description={
        mode === 'edit'
          ? 'Actualiza los datos de la coleccion seleccionada.'
          : 'Crea una coleccion para agrupar tarjetas de estudio.'
      }
      variant="elevated"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
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

        <Input
          id="collection-description"
          label="Descripcion (opcional)"
          value={description}
          placeholder="Ej: Hooks y patrones de React"
          onChange={(event) => setDescription(event.target.value)}
        />

        {successMessage ? <p className="text-sm text-green-700">{successMessage}</p> : null}

        <div className="flex flex-wrap gap-2">
          <Button type="submit" isLoading={isSubmitting}>
            {submitLabel ?? (mode === 'edit' ? 'Guardar cambios' : 'Guardar coleccion')}
          </Button>
          {mode === 'edit' && onCancel ? (
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancelar edicion
            </Button>
          ) : null}
        </div>
      </form>
    </Card>
  )
}
