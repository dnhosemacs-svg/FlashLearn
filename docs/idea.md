# Idea del proyecto: FlashLearn

## Idea general (aplicación web)

**FlashLearn** es una micro‑app web de **tarjetas de estudio** (flashcards) pensada para repasar conceptos de forma rápida: creas tarjetas de *pregunta / respuesta*, las guardas en el navegador y las estudias en modo repaso.

Inspiración: microapps enfocadas a una sola necesidad, con una interfaz ligera y directa.

---

## Problema que intenta resolver

Muchos estudiantes necesitan repasar contenidos en ratos cortos (transporte, descansos, antes de un examen) sin depender de aplicaciones pesadas, con registro obligatorio o de pago.

FlashLearn intenta resolver:

- **Repaso rápido y frecuente** sin fricción.
- **Organización mínima** (colecciones) sin complejidad.
- **Acceso inmediato** desde cualquier navegador.

---

## Usuario objetivo

- **Estudiantes** (secundaria, universidad).
- **Autodidactas** que aprenden por su cuenta (idiomas, programación, etc.).
- Personas que preparan **oposiciones o certificaciones**.

---

## Datos y almacenamiento

No es necesario usar base de datos:

- **LocalStorage** para guardar tarjetas y colecciones en el navegador.
- **API (opcional)** para generar tarjetas automáticamente o cargar ejemplos de estudio.

---

## Funcionalidades principales

- **Crear tarjetas** con formato *pregunta / respuesta*.
- **Editar y eliminar** tarjetas.
- **Agrupar en colecciones** (temas o asignaturas).
- **Guardar y cargar** colecciones desde **LocalStorage**.
- **Modo estudio**:
  - Mostrar pregunta.
  - Revelar respuesta.
  - Pasar a la siguiente tarjeta.
- **Barajar tarjetas** para evitar memorizar por orden.

---

## Funcionalidades opcionales

(Basadas en el concepto inicial y ampliadas con detalles prácticos.)

- **Generación automática de tarjetas** mediante una **API**:
  - A partir de un texto pegado por el usuario (apuntes).
  - O a partir de un tema/keyword.
- **Compartir colecciones** mediante un enlace:
  - Exportar a JSON.
  - Importar desde JSON o desde una URL.

---

## Posibles mejoras futuras

- **Sincronización** entre dispositivos (más adelante): cuenta opcional o integración con un servicio externo.
- **Estadísticas de estudio**:
  - Tiempo de estudio, rachas, aciertos.
  - Progreso por colección.
- **Búsqueda y filtros**:
  - Buscar por palabra clave en pregunta/respuesta.
  - Etiquetas (tags) por tarjeta.
- **Accesibilidad y UX**:
  - Atajos de teclado en modo estudio.
  - Mejoras de contraste y soporte para lectores de pantalla.
- **PWA / offline**:
  - Instalable como app.
  - Funciona sin conexión.
- **Plantillas** de tarjetas (idiomas, definiciones, fórmulas).
- **Importar desde CSV** (para migrar desde otras apps).

