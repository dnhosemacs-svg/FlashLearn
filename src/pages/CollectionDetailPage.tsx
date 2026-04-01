import { Link, useParams } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'

export default function CollectionDetailPage() {
  const { collectionId } = useParams<{ collectionId: string }>()

  return (
    <main className="min-h-screen p-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Detalle de colección</h1>
          <p className="mt-2 text-slate-300">ID: {collectionId}</p>
        </div>
        <Link to="/collections">
          <Button variant="ghost">Volver</Button>
        </Link>
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card
          title="Crear tarjeta"
          description="Aquí irá FlashcardForm en el siguiente paso."
          variant="elevated"
        >
          <p className="text-sm text-slate-400">
            Placeholder de formulario de flashcards.
          </p>
        </Card>

        <Card
          title="Tarjetas de la colección"
          description="Aquí irá FlashcardList en el siguiente paso."
        >
          <EmptyState
            title="Sin tarjetas todavía"
            description="Añade tu primera tarjeta para empezar a estudiar."
          />
        </Card>
      </section>
    </main>
  )
}