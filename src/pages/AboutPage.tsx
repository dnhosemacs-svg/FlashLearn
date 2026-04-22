export default function AboutPage() {
  return (
    <main className="page-shell">
      {/* Página informativa estática sobre propósito y arquitectura del proyecto. */}
      <h1 className="page-title">Acerca de FlashLearn</h1>
      <p className="page-subtitle">Micro-app para crear colecciones y estudiar con flashcards.</p>

      <section className="section-stack max-w-2xl">
        <p className="text-muted">
          FlashLearn está pensada para practicar de forma rápida con tarjetas de estudio organizadas por colecciones.
          En esta fase, la persistencia se realiza en almacenamiento local y la arquitectura está preparada para migrar
          a API sin romper el contrato de los hooks y contextos.
        </p>
      </section>
    </main>
  )
}
