import { useState } from 'react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import Input from '../components/ui/Input'

export default function CollectionsPage() {
  const [name, setName] = useState('')
  const [hasCollections, setHasCollections] = useState(false)

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">Colecciones</h1>
      <p className="mt-2 text-slate-300">Ejemplo visual de componentes reutilizables UI</p>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <Card
          title="Nueva coleccion"
          description="Prueba de Input + Button con variantes"
          variant="elevated"
          actions={
            <Button variant="ghost" size="sm">
              Limpiar
            </Button>
          }
        >
          <div className="space-y-4">
            <Input
              id="collection-name"
              label="Nombre de la coleccion"
              value={name}
              placeholder="Ej: React Hooks"
              hint="Minimo 2 caracteres"
              onChange={(event) => setName(event.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              <Button variant="primary">Guardar</Button>
              <Button variant="secondary">Vista previa</Button>
              <Button variant="danger">Eliminar</Button>
            </div>
          </div>
        </Card>

        {hasCollections ? (
          <Card title="Colecciones disponibles" description="Aqui apareceria el listado">
            <ul className="space-y-2 text-sm text-slate-200">
              <li className="rounded-md bg-slate-800 p-3">React Hooks</li>
              <li className="rounded-md bg-slate-800 p-3">TypeScript Basico</li>
            </ul>
          </Card>
        ) : (
          <EmptyState
            title="No hay colecciones aun"
            description="Crea tu primera coleccion para empezar a estudiar."
            action={
              <Button onClick={() => setHasCollections(true)} variant="primary">
                Crear coleccion de ejemplo
              </Button>
            }
          />
        )}
      </section>
    </main>
  )
}
