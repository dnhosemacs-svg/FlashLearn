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
}

export default function CollectionForm({
  onSubmit,
  isSubmitting = false,
  mode = 'create',
  initialValues,
  submitLabel,
  onCancel,
}: CollectionFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [nameError, setNameError] = useState('')

  useEffect(() => {
    setName(initialValues?.name ?? '')
    setDescription(initialValues?.description ?? '')
    setNameError('')
  }, [initialValues])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedName = name.trim()
    const trimmedDescription = description.trim()

    if (!trimmedName) {
      setNameError('El nombre es obligatorio')
      return
    }

    setNameError('')
    onSubmit({
      name: trimmedName,
      description: trimmedDescription || undefined,
    })

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
