/**
 * communityService.ts
 *
 * Todas as operações de leitura e escrita da comunidade contra o Supabase.
 * Utiliza o cliente browser (SSR) — deve ser chamado apenas em Client Components.
 */

import { createClient as _createClient } from "@/lib/supabase/client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createClient = () => _createClient() as any;

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface CommunityAttachment {
  id: string;
  file_url: string;
  file_name: string;
  file_type: "image" | "pdf" | "audio";
  file_size: number;
}

export interface CommunityReaction {
  emoji: string;
  count: number;
  reacted: boolean; // true se o usuário atual reagiu
}

export interface CommunityMessage {
  id: string;
  content: string;
  created_at: string;
  author: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    specialty: string | null;
  };
  attachments: CommunityAttachment[];
  reactions: CommunityReaction[];
}

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "audio/webm",
  "audio/ogg",
  "audio/mp4",
  "audio/wav",
  "audio/mpeg",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

// ─── Mensagens ───────────────────────────────────────────────────────────────

/**
 * Carrega as últimas 50 mensagens com perfil do autor, anexos e reações.
 */
export async function fetchMessages(currentUserId: string): Promise<CommunityMessage[]> {
  const supabase = createClient();

  const { data: rows, error } = await supabase
    .from("community_messages")
    .select(`
      id,
      content,
      created_at,
      author:profiles!community_messages_author_id_fkey (
        id,
        full_name,
        avatar_url,
        specialty
      ),
      community_attachments (
        id,
        file_url,
        file_name,
        file_type,
        file_size
      ),
      community_reactions (
        emoji,
        user_id
      )
    `)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw new Error(error.message);

  // Inverter para exibir do mais antigo ao mais recente
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const messages = ((rows ?? []) as any[]).reverse();

  return messages.map((row) => {
    const author = Array.isArray(row.author) ? row.author[0] : row.author;

    // Agrupa reações por emoji
    const reactionMap = new Map<string, { count: number; reacted: boolean }>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const r of (row.community_reactions ?? []) as any[]) {
      const existing = reactionMap.get(r.emoji) ?? { count: 0, reacted: false };
      reactionMap.set(r.emoji, {
        count: existing.count + 1,
        reacted: existing.reacted || r.user_id === currentUserId,
      });
    }

    return {
      id: row.id,
      content: row.content,
      created_at: row.created_at,
      author: {
        id: author?.id ?? "",
        full_name: author?.full_name ?? null,
        avatar_url: author?.avatar_url ?? null,
        specialty: author?.specialty ?? null,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      attachments: (row.community_attachments ?? []).map((a: any) => ({
        id: a.id,
        file_url: a.file_url,
        file_name: a.file_name,
        file_type: a.file_type as "image" | "pdf" | "audio",
        file_size: a.file_size,
      })),
      reactions: Array.from(reactionMap.entries()).map(([emoji, data]) => ({
        emoji,
        count: data.count,
        reacted: data.reacted,
      })),
    };
  });
}

// ─── Enviar mensagem ──────────────────────────────────────────────────────────

/**
 * Cria uma nova mensagem. Se houver arquivos, faz upload antes de inserir.
 */
export async function sendMessage(
  authorId: string,
  content: string,
  files: File[] = [],
): Promise<CommunityMessage> {
  const supabase = createClient();

  // 1. Inserir mensagem
  const { data: message, error: msgError } = await supabase
    .from("community_messages")
    .insert({ author_id: authorId, content })
    .select("id, content, created_at")
    .single();

  if (msgError || !message) throw new Error(msgError?.message ?? "Erro ao enviar mensagem");

  // 2. Upload de anexos (se houver)
  const attachments: CommunityAttachment[] = [];
  if (files.length > 0) {
    const uploaded = await uploadAttachments(authorId, message.id, files);
    attachments.push(...uploaded);
  }

  // 3. Buscar perfil do autor
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, specialty")
    .eq("id", authorId)
    .single();

  return {
    id: message.id,
    content: message.content,
    created_at: message.created_at,
    author: {
      id: authorId,
      full_name: profile?.full_name ?? null,
      avatar_url: profile?.avatar_url ?? null,
      specialty: profile?.specialty ?? null,
    },
    attachments,
    reactions: [],
  };
}

// ─── Upload de anexos ─────────────────────────────────────────────────────────

export function validateFiles(files: File[]): string | null {
  for (const file of files) {
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return `Tipo não permitido: ${file.name}. Aceitos: imagens, PDF e áudio.`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `Arquivo muito grande: ${file.name}. Máximo: 10 MB.`;
    }
  }
  return null;
}

async function uploadAttachments(
  userId: string,
  messageId: string,
  files: File[],
): Promise<CommunityAttachment[]> {
  const supabase = createClient();
  const results: CommunityAttachment[] = [];

  for (const file of files) {
    const ext = file.name.split(".").pop();
    const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const path = `${userId}/${messageId}/${uniqueId}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("community-attachments")
      .upload(path, file, { contentType: file.type });

    if (uploadError) throw new Error(`Falha ao enviar ${file.name}: ${uploadError.message}`);

    const { data: urlData } = supabase.storage
      .from("community-attachments")
      .getPublicUrl(path);

    const fileType: "image" | "pdf" | "audio" = file.type.startsWith("audio/")
      ? "audio"
      : file.type === "application/pdf"
        ? "pdf"
        : "image";

    const { data: attachment, error: attachError } = await supabase
      .from("community_attachments")
      .insert({
        message_id: messageId,
        file_url: urlData.publicUrl,
        file_name: file.name,
        file_type: fileType,
        file_size: file.size,
      })
      .select("id, file_url, file_name, file_type, file_size")
      .single();

    if (attachError || !attachment) throw new Error(attachError?.message ?? "Erro ao salvar anexo");

    results.push({
      id: attachment.id,
      file_url: attachment.file_url,
      file_name: attachment.file_name,
      file_type: attachment.file_type as "image" | "pdf" | "audio",
      file_size: attachment.file_size,
    });
  }

  return results;
}

// ─── URL assinada para anexos (bucket privado) ────────────────────────────────

export async function getAttachmentUrl(filePath: string): Promise<string> {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from("community-attachments")
    .createSignedUrl(filePath, 60 * 60); // 1 hora

  if (error || !data) throw new Error("Erro ao gerar URL do anexo");
  return data.signedUrl;
}

// ─── Apagar mensagem ──────────────────────────────────────────────────────────

/**
 * Apaga uma mensagem e seus anexos do storage.
 * Só deve ser chamado pelo próprio autor.
 */
export async function deleteMessage(messageId: string, attachmentUrls: string[]): Promise<void> {
  const supabase = createClient();

  // Remover arquivos do storage
  if (attachmentUrls.length > 0) {
    const storagePrefix = "/object/public/community-attachments/";
    const paths = attachmentUrls
      .map((url) => {
        const idx = url.indexOf(storagePrefix);
        return idx !== -1 ? url.slice(idx + storagePrefix.length) : null;
      })
      .filter(Boolean) as string[];

    if (paths.length > 0) {
      await supabase.storage.from("community-attachments").remove(paths);
    }
  }

  const { error } = await supabase
    .from("community_messages")
    .delete()
    .eq("id", messageId);

  if (error) throw new Error(error.message);
}

// ─── Reações ──────────────────────────────────────────────────────────────────

/**
 * Adiciona ou remove uma reação (toggle).
 * Retorna true se adicionou, false se removeu.
 */
export async function toggleReaction(
  messageId: string,
  userId: string,
  emoji: string,
): Promise<boolean> {
  const supabase = createClient();

  // Verificar se já existe
  const { data: existing } = await supabase
    .from("community_reactions")
    .select("id")
    .eq("message_id", messageId)
    .eq("user_id", userId)
    .eq("emoji", emoji)
    .maybeSingle();

  if (existing) {
    await supabase.from("community_reactions").delete().eq("id", existing.id);
    return false;
  } else {
    await supabase
      .from("community_reactions")
      .insert({ message_id: messageId, user_id: userId, emoji });
    return true;
  }
}

// ─── Realtime ─────────────────────────────────────────────────────────────────

/**
 * Inscreve em novas mensagens em tempo real.
 * Retorna a função de unsubscribe.
 */
export function subscribeToMessages(
  currentUserId: string,
  onNewMessage: (message: CommunityMessage) => void,
) {
  const supabase = createClient();

  const channel = supabase
    .channel("community_messages_realtime")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "community_messages" },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async (payload: any) => {
        const row = payload.new as { id: string; author_id: string; content: string; created_at: string };

        // Pequeno delay para garantir que os attachments já foram commitados
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Buscar perfil e anexos da nova mensagem
        const [{ data: profile }, { data: attachmentRows }] = await Promise.all([
          supabase
            .from("profiles")
            .select("id, full_name, avatar_url, specialty")
            .eq("id", row.author_id)
            .single(),
          supabase
            .from("community_attachments")
            .select("id, file_url, file_name, file_type, file_size")
            .eq("message_id", row.id),
        ]);

        const message: CommunityMessage = {
          id: row.id,
          content: row.content,
          created_at: row.created_at,
          author: {
            id: row.author_id,
            full_name: profile?.full_name ?? null,
            avatar_url: profile?.avatar_url ?? null,
            specialty: profile?.specialty ?? null,
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          attachments: (attachmentRows ?? []).map((a: any) => ({
            id: a.id,
            file_url: a.file_url,
            file_name: a.file_name,
            file_type: a.file_type as "image" | "pdf" | "audio",
            file_size: a.file_size,
          })),
          reactions: [],
        };

        onNewMessage(message);
      },
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}
