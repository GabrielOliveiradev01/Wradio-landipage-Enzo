-- ─── Permitir leitura pública de perfis (necessário para exibir autores no feed) ───
-- A policy anterior só permitia o usuário ver o próprio perfil,
-- quebrando o join de autores em community_messages.
CREATE POLICY "Usuários autenticados veem perfis"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- ─── community_messages ───────────────────────────────────────────────────────

CREATE TABLE public.community_messages (
  id          UUID        NOT NULL DEFAULT gen_random_uuid(),
  author_id   UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content     TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);

ALTER TABLE public.community_messages ENABLE ROW LEVEL SECURITY;

-- Todos os usuários autenticados podem ler mensagens
CREATE POLICY "Usuários autenticados leem mensagens"
  ON public.community_messages FOR SELECT
  TO authenticated
  USING (true);

-- Usuário autenticado pode inserir mensagens como próprio autor
CREATE POLICY "Usuário insere próprias mensagens"
  ON public.community_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

-- Usuário pode apagar apenas as próprias mensagens
CREATE POLICY "Usuário apaga próprias mensagens"
  ON public.community_messages FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER community_messages_updated_at
  BEFORE UPDATE ON public.community_messages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── community_attachments ────────────────────────────────────────────────────

CREATE TABLE public.community_attachments (
  id          UUID        NOT NULL DEFAULT gen_random_uuid(),
  message_id  UUID        NOT NULL REFERENCES public.community_messages(id) ON DELETE CASCADE,
  file_url    TEXT        NOT NULL,
  file_name   TEXT        NOT NULL,
  file_type   TEXT        NOT NULL CHECK (file_type IN ('image', 'pdf')),
  file_size   BIGINT      NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);

ALTER TABLE public.community_attachments ENABLE ROW LEVEL SECURITY;

-- Todos autenticados leem anexos
CREATE POLICY "Usuários autenticados leem anexos"
  ON public.community_attachments FOR SELECT
  TO authenticated
  USING (true);

-- Usuário pode inserir anexos em mensagens que ele mesmo criou
CREATE POLICY "Usuário insere anexos nas próprias mensagens"
  ON public.community_attachments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.community_messages m
      WHERE m.id = message_id AND m.author_id = auth.uid()
    )
  );

-- Usuário pode apagar anexos das próprias mensagens
CREATE POLICY "Usuário apaga anexos das próprias mensagens"
  ON public.community_attachments FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.community_messages m
      WHERE m.id = message_id AND m.author_id = auth.uid()
    )
  );

-- ─── community_reactions ──────────────────────────────────────────────────────

CREATE TABLE public.community_reactions (
  id          UUID        NOT NULL DEFAULT gen_random_uuid(),
  message_id  UUID        NOT NULL REFERENCES public.community_messages(id) ON DELETE CASCADE,
  user_id     UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  emoji       TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id),
  UNIQUE (message_id, user_id, emoji)
);

ALTER TABLE public.community_reactions ENABLE ROW LEVEL SECURITY;

-- Todos autenticados leem reações
CREATE POLICY "Usuários autenticados leem reações"
  ON public.community_reactions FOR SELECT
  TO authenticated
  USING (true);

-- Usuário insere apenas as próprias reações
CREATE POLICY "Usuário insere próprias reações"
  ON public.community_reactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Usuário apaga apenas as próprias reações
CREATE POLICY "Usuário apaga próprias reações"
  ON public.community_reactions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ─── Storage bucket: community-attachments ────────────────────────────────────
-- Execute via Supabase Dashboard ou API de Storage, pois SQL não cria buckets diretamente.
-- Configuração recomendada:
--   bucket id:   community-attachments
--   public:      true
--   file size limit: 10485760  (10 MB)
--   allowed MIME types: image/jpeg, image/png, image/gif, image/webp, application/pdf
--
-- Políticas de storage (via Dashboard > Storage > Policies):
--   INSERT: bucket_id = 'community-attachments' AND auth.role() = 'authenticated'
--   SELECT: bucket_id = 'community-attachments'
--   DELETE: bucket_id = 'community-attachments' AND (storage.foldername(name))[1] = auth.uid()::text
