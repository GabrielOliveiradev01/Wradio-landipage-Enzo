-- Adiciona suporte a áudio na tabela de anexos da comunidade

-- 1. Remover constraint antiga de file_type
ALTER TABLE public.community_attachments
  DROP CONSTRAINT IF EXISTS community_attachments_file_type_check;

-- 2. Adicionar nova constraint incluindo 'audio'
ALTER TABLE public.community_attachments
  ADD CONSTRAINT community_attachments_file_type_check
  CHECK (file_type IN ('image', 'pdf', 'audio'));

-- Nota: atualizar o bucket community-attachments no Supabase Dashboard para
-- permitir os seguintes tipos de MIME adicionais:
--   audio/webm, audio/ogg, audio/mp4, audio/wav, audio/mpeg
