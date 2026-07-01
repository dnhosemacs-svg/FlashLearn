-- FlashLearn — esquema inicial PostgreSQL (Neon)
-- Dominio: usuarios, colecciones (private | shared | public), flashcards de vocabulario.
--
-- Ejecutar una vez en la base de datos vacía:
--   psql "$DATABASE_URL" -f server/db/schema.sql
--
-- Decisiones de producto reflejadas aquí:
--   - Colección private: dueño único (owner_id), CRUD solo del dueño.
--   - Colección shared: creada por admin; usuarios en collection_access (solo lectura).
--   - Colección public: creada por admin; lectura para cualquier usuario autenticado.
--   - Flashcards: question + answer; la inversión ES↔EN es solo en la UI de estudio.

-- ---------------------------------------------------------------------------
-- Extensiones
-- ---------------------------------------------------------------------------

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------------
-- Tipos enumerados
-- ---------------------------------------------------------------------------

CREATE TYPE user_role AS ENUM ('user', 'admin');

CREATE TYPE collection_visibility AS ENUM ('private', 'shared', 'public');

CREATE TYPE collection_access_permission AS ENUM ('read');

-- ---------------------------------------------------------------------------
-- Usuarios (sincronizados desde el proveedor de auth, p. ej. Clerk + Google)
-- ---------------------------------------------------------------------------

CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- ID externo del proveedor de auth (Clerk: "sub" del JWT).
  auth_provider_id TEXT NOT NULL,
  email         TEXT NOT NULL,
  name          TEXT,
  avatar_url    TEXT,
  role          user_role NOT NULL DEFAULT 'user',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT users_auth_provider_id_unique UNIQUE (auth_provider_id),
  CONSTRAINT users_email_unique UNIQUE (email),
  CONSTRAINT users_email_lowercase CHECK (email = lower(email))
);

COMMENT ON TABLE users IS 'Perfiles de usuario. El rol admin se asigna en la app (p. ej. ADMIN_EMAILS).';
COMMENT ON COLUMN users.auth_provider_id IS 'Identificador estable del proveedor OAuth (no el email).';

CREATE INDEX users_role_idx ON users (role);

-- ---------------------------------------------------------------------------
-- Colecciones
-- ---------------------------------------------------------------------------

CREATE TABLE collections (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  description     TEXT,
  -- Dueño de colecciones private. NULL en colecciones oficiales (shared/public).
  owner_id        UUID REFERENCES users (id) ON DELETE CASCADE,
  visibility      collection_visibility NOT NULL DEFAULT 'private',
  -- Quién creó el registro (usuario en private, admin en shared/public).
  created_by_id   UUID NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT collections_name_not_blank CHECK (char_length(trim(name)) > 0),
  CONSTRAINT collections_visibility_owner_rules CHECK (
    (visibility = 'private' AND owner_id IS NOT NULL)
    OR (visibility IN ('shared', 'public') AND owner_id IS NULL)
  )
);

COMMENT ON TABLE collections IS 'Agrupaciones de flashcards. private = personal; shared/public = contenido oficial admin.';
COMMENT ON COLUMN collections.owner_id IS 'Solo en private. En shared/public debe ser NULL.';

CREATE INDEX collections_owner_id_idx ON collections (owner_id) WHERE owner_id IS NOT NULL;
CREATE INDEX collections_visibility_idx ON collections (visibility);
CREATE INDEX collections_created_by_id_idx ON collections (created_by_id);

-- Nombre único por usuario en colecciones privadas.
CREATE UNIQUE INDEX collections_private_name_per_owner_unique
  ON collections (owner_id, lower(trim(name)))
  WHERE visibility = 'private';

-- Nombre único entre colecciones oficiales (shared + public).
CREATE UNIQUE INDEX collections_official_name_unique
  ON collections (lower(trim(name)))
  WHERE visibility IN ('shared', 'public');

-- ---------------------------------------------------------------------------
-- Acceso a colecciones shared (solo lectura)
-- ---------------------------------------------------------------------------

CREATE TABLE collection_access (
  collection_id   UUID NOT NULL REFERENCES collections (id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  permission      collection_access_permission NOT NULL DEFAULT 'read',
  granted_by_id   UUID NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
  granted_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  PRIMARY KEY (collection_id, user_id)
);

COMMENT ON TABLE collection_access IS 'Usuarios autorizados a leer una colección shared. Sin fila = sin acceso.';

CREATE INDEX collection_access_user_id_idx ON collection_access (user_id);

-- Solo colecciones shared pueden tener filas en collection_access.
CREATE OR REPLACE FUNCTION enforce_collection_access_visibility()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_visibility collection_visibility;
BEGIN
  SELECT visibility INTO v_visibility
  FROM collections
  WHERE id = NEW.collection_id;

  IF v_visibility IS DISTINCT FROM 'shared' THEN
    RAISE EXCEPTION
      'collection_access solo aplica a colecciones con visibility = shared (colección %)',
      NEW.collection_id;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER collection_access_visibility_check
  BEFORE INSERT OR UPDATE ON collection_access
  FOR EACH ROW
  EXECUTE FUNCTION enforce_collection_access_visibility();

-- ---------------------------------------------------------------------------
-- Flashcards (pregunta / respuesta; inversión en estudio vía UI)
-- ---------------------------------------------------------------------------

CREATE TABLE flashcards (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id   UUID NOT NULL REFERENCES collections (id) ON DELETE CASCADE,
  question        TEXT NOT NULL,
  answer          TEXT NOT NULL,
  tags            TEXT[] NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT flashcards_question_not_blank CHECK (char_length(trim(question)) > 0),
  CONSTRAINT flashcards_answer_not_blank CHECK (char_length(trim(answer)) > 0)
);

COMMENT ON TABLE flashcards IS 'Tarjetas de vocabulario. question/answer según cómo las cargue el autor (p. ej. ES/EN).';
COMMENT ON COLUMN flashcards.question IS 'Cara principal almacenada (p. ej. palabra en español).';
COMMENT ON COLUMN flashcards.answer IS 'Cara secundaria almacenada (p. ej. palabra en inglés).';

CREATE INDEX flashcards_collection_id_idx ON flashcards (collection_id);
CREATE INDEX flashcards_tags_gin_idx ON flashcards USING GIN (tags);

-- ---------------------------------------------------------------------------
-- updated_at automático
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER users_set_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER collections_set_updated_at
  BEFORE UPDATE ON collections
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER flashcards_set_updated_at
  BEFORE UPDATE ON flashcards
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- Vista: colecciones visibles para un usuario (lectura)
-- Uso en backend: WHERE user_id = $1
-- ---------------------------------------------------------------------------

CREATE OR REPLACE VIEW user_visible_collections AS
SELECT
  c.id,
  c.name,
  c.description,
  c.owner_id,
  c.visibility,
  c.created_by_id,
  c.created_at,
  c.updated_at,
  u.id AS user_id,
  CASE
    WHEN c.visibility = 'private' AND c.owner_id = u.id THEN 'owner'
    WHEN c.visibility = 'public' THEN 'public_reader'
    WHEN c.visibility = 'shared' AND ca.user_id IS NOT NULL THEN 'shared_reader'
    ELSE NULL
  END AS access_kind
FROM users u
CROSS JOIN collections c
LEFT JOIN collection_access ca
  ON ca.collection_id = c.id
 AND ca.user_id = u.id
WHERE
  (c.visibility = 'private' AND c.owner_id = u.id)
  OR c.visibility = 'public'
  OR (c.visibility = 'shared' AND ca.user_id IS NOT NULL);

COMMENT ON VIEW user_visible_collections IS
  'Proyección de lectura: colecciones que cada usuario puede listar/estudiar.';

-- ---------------------------------------------------------------------------
-- Vista: permiso de escritura sobre una colección
-- Uso: JOIN con collections + users para autorizar POST/PATCH/DELETE
-- ---------------------------------------------------------------------------

CREATE OR REPLACE VIEW user_writable_collections AS
SELECT
  c.id AS collection_id,
  u.id AS user_id,
  CASE
    WHEN c.visibility = 'private' AND c.owner_id = u.id THEN 'owner'
    WHEN c.visibility IN ('shared', 'public') AND u.role = 'admin' THEN 'admin'
    ELSE NULL
  END AS write_access
FROM collections c
CROSS JOIN users u
WHERE
  (c.visibility = 'private' AND c.owner_id = u.id)
  OR (c.visibility IN ('shared', 'public') AND u.role = 'admin');

COMMENT ON VIEW user_writable_collections IS
  'Colecciones que el usuario puede modificar. Shared/public: solo admin.';
