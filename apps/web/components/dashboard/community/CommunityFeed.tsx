"use client";

import { Fragment, useState, useRef, useEffect, useMemo } from "react";
import {
  Send,
  Paperclip,
  ImageIcon,
  X,
  Hash,
  Mic,
  Square,
  Trash2,
  Users,
  Smile,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react";
import { cn } from "@/lib/utils";
import UserProfileModal, { UserProfile } from "./UserProfileModal";
import { useDarkMode } from "@/context/DarkModeContext";
import { createClient } from "@/lib/supabase/client";
import {
  fetchMessages,
  sendMessage,
  validateFiles,
  toggleReaction,
  subscribeToMessages,
  deleteMessage,
  type CommunityMessage,
} from "@/lib/services/communityService";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface PostAttachment {
  name: string;
  url: string;
  type: "image" | "pdf" | "audio";
}

interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorInitials: string;
  authorColor: string;
  authorSpecialty?: string | null;
  isMe: boolean;
  content: string;
  attachments?: PostAttachment[];
  timestamp: Date;
  reactions?: { emoji: string; count: number; reacted: boolean }[];
}


// ─── Helpers ──────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "bg-violet-500",
  "bg-sky-500",
  "bg-emerald-500",
  "bg-rose-500",
  "bg-amber-500",
  "bg-cyan-500",
  "bg-pink-500",
  "bg-indigo-500",
];

function getAvatarColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function toPost(msg: CommunityMessage, currentUserId: string): CommunityPost {
  const isMe = msg.author.id === currentUserId;
  return {
    id: msg.id,
    authorId: msg.author.id,
    authorName: msg.author.full_name ?? "Usuário",
    authorInitials: getInitials(msg.author.full_name),
    authorColor: isMe ? "bg-orange-500" : getAvatarColor(msg.author.id),
    authorSpecialty: msg.author.specialty,
    isMe,
    content: msg.content,
    attachments: msg.attachments.map((a) => ({
      name: a.file_name,
      url: a.file_url,
      type: a.file_type as "image" | "pdf" | "audio",
    })),
    timestamp: new Date(msg.created_at),
    reactions: msg.reactions,
  };
}

function formatTime(date: Date) {
  const diffMin = Math.floor((Date.now() - date.getTime()) / 60000);
  if (diffMin < 1) return "agora";
  if (diffMin < 60) return `${diffMin}min atrás`;
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function getDateLabel(date: Date): string {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "Hoje";
  if (date.toDateString() === yesterday.toDateString()) return "Ontem";
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

function groupPostsByDate(posts: CommunityPost[]): { label: string; items: CommunityPost[] }[] {
  const map = new Map<string, { label: string; items: CommunityPost[] }>();
  for (const post of posts) {
    const key = post.timestamp.toDateString();
    if (!map.has(key)) {
      map.set(key, { label: getDateLabel(post.timestamp), items: [] });
    }
    map.get(key)!.items.push(post);
  }
  return Array.from(map.values());
}

const PRESET_REACTIONS = ["👍", "❤️", "😂", "😮", "😢"];

// ─── AudioPlayer ──────────────────────────────────────────────────────────────

function AudioPlayer({ src, isMe, darkMode }: { src: string; isMe: boolean; darkMode: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    const el = audioRef.current;
    if (!el) return;
    el.paused ? el.play() : el.pause();
  };

  const toggleMute = () => {
    const el = audioRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
  };

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  const timeColor = isMe
    ? "rgba(255,255,255,0.45)"
    : darkMode
      ? "rgba(255,255,255,0.3)"
      : "rgba(0,0,0,0.35)";
  const muteColor = isMe
    ? "rgba(255,255,255,0.5)"
    : darkMode
      ? "rgba(255,255,255,0.3)"
      : "rgba(0,0,0,0.35)";
  const muteHover = isMe ? "rgba(255,255,255,0.85)" : darkMode ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.65)";
  const playBg = isMe ? "rgba(255,255,255,0.12)" : darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const playBgHover = isMe ? "rgba(255,255,255,0.2)" : darkMode ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.12)";

  return (
    <div className="flex items-center gap-2.5" style={{ minWidth: 0 }}>
      <audio
        ref={audioRef}
        src={src}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => { setPlaying(false); setElapsed(0); }}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
        onTimeUpdate={() => setElapsed(audioRef.current?.currentTime ?? 0)}
      />

      {/* Play / Pause */}
      <button
        onClick={togglePlay}
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
        style={{ background: playBg, color: isMe ? "rgba(255,255,255,0.9)" : darkMode ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.65)" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = playBgHover)}
        onMouseLeave={(e) => (e.currentTarget.style.background = playBg)}
      >
        {playing
          ? <Pause className="w-3.5 h-3.5 fill-current" />
          : <Play className="w-3.5 h-3.5 fill-current translate-x-px" />}
      </button>

      {/* Tempo */}
      <span
        className="text-[11px] font-mono tabular-nums flex-shrink-0"
        style={{ color: timeColor }}
      >
        {fmt(elapsed)}{duration > 0 && ` / ${fmt(duration)}`}
      </span>

      {/* Mute / Unmute */}
      <button
        onClick={toggleMute}
        className="flex-shrink-0 transition-colors"
        style={{ color: muted ? muteHover : muteColor }}
        onMouseEnter={(e) => (e.currentTarget.style.color = muteHover)}
        onMouseLeave={(e) => (e.currentTarget.style.color = muted ? muteHover : muteColor)}
      >
        {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>
    </div>
  );
}

// ─── PostBubble ───────────────────────────────────────────────────────────────

function PostBubble({
  post,
  onReact,
  onAvatarClick,
  onDelete,
  darkMode,
}: {
  post: CommunityPost;
  onReact: (postId: string, emoji: string) => void;
  onAvatarClick: (post: CommunityPost) => void;
  onDelete: (post: CommunityPost) => void;
  darkMode: boolean;
}) {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showPicker) return;
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showPicker]);

  const canOpenProfile = !post.isMe;

  const Avatar = (
    <button
      onClick={() => canOpenProfile && onAvatarClick(post)}
      title={canOpenProfile ? `Ver perfil de ${post.authorName}` : undefined}
      className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-white text-[11px] font-bold transition-transform",
        post.authorColor,
        canOpenProfile &&
          "hover:scale-110 cursor-pointer ring-2 ring-transparent hover:ring-gray-900",
        !canOpenProfile && "cursor-default",
      )}
    >
      {post.authorInitials}
    </button>
  );

  return (
    <div className={cn("flex gap-3 group", post.isMe && "flex-row-reverse")}>
      {!post.isMe && Avatar}

      <div
        className={cn(
          "flex flex-col gap-1 max-w-[72%] md:max-w-[60%]",
          post.isMe && "items-end",
        )}
      >
        {!post.isMe && (
          <span
            className={cn(
              "text-[11px] font-semibold px-1",
              darkMode ? "text-zinc-400" : "text-gray-500",
            )}
          >
            {post.authorName}
          </span>
        )}

        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-sm",
            post.isMe
              ? "text-white rounded-tr-sm"
              : cn(
                  "rounded-tl-sm shadow-sm",
                  darkMode
                    ? "bg-zinc-800 border border-white/10 text-zinc-100"
                    : "bg-white border border-gray-100 text-gray-800",
                ),
          )}
          style={post.isMe ? { backgroundColor: "#09090b" } : undefined}
        >
          {post.content.trim() && (
            <p className="leading-relaxed whitespace-pre-wrap">{post.content.trim()}</p>
          )}

          {post.attachments && post.attachments.length > 0 && (
            <div className="mt-2 flex flex-col gap-1.5">
              {post.attachments.map((att, i) =>
                att.type === "image" ? (
                  <a key={i} href={att.url} target="_blank" rel="noopener noreferrer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={att.url}
                      alt={att.name}
                      className="max-w-full rounded-lg max-h-48 object-cover"
                    />
                  </a>
                ) : att.type === "audio" ? (
                  <AudioPlayer key={i} src={att.url} isMe={post.isMe} darkMode={darkMode} />
                ) : (
                  <a
                    key={i}
                    href={att.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "flex items-center gap-1 text-xs px-2.5 py-1 rounded-full transition-colors w-fit",
                      post.isMe
                        ? "bg-white/10 text-zinc-300 hover:bg-white/20"
                        : darkMode
                          ? "bg-zinc-700 text-zinc-300 border border-zinc-600 hover:bg-zinc-600"
                          : "bg-gray-100 text-gray-600 border border-gray-100 hover:bg-gray-200",
                    )}
                  >
                    📎 {att.name}
                  </a>
                ),
              )}
            </div>
          )}

          <p
            className={cn(
              "text-[10px] mt-1.5",
              post.isMe
                ? "text-zinc-500 text-right"
                : darkMode
                  ? "text-zinc-500"
                  : "text-gray-400",
            )}
          >
            {formatTime(post.timestamp)}
          </p>
        </div>

        {post.reactions && post.reactions.filter((r) => r.count > 0).length > 0 && (
          <div className="flex flex-wrap gap-1 px-1">
            {post.reactions
              .filter((r) => r.count > 0)
              .map((r) => (
                <button
                  key={r.emoji}
                  onClick={() => onReact(post.id, r.emoji)}
                  className={cn(
                    "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-all",
                    r.reacted
                      ? "border-gray-900 text-white"
                      : darkMode
                        ? "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:bg-zinc-700"
                        : "bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50",
                  )}
                  style={r.reacted ? { backgroundColor: "#09090b" } : undefined}
                >
                  <span>{r.emoji}</span>
                  <span className="font-medium">{r.count}</span>
                </button>
              ))}
          </div>
        )}
      </div>

      {/* Reaction picker */}
      <div className="relative self-center flex-shrink-0" ref={pickerRef}>
        <button
          onClick={() => setShowPicker((s) => !s)}
          title="Reagir à mensagem"
          className={cn(
            "opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg",
            showPicker && "opacity-100",
            darkMode
              ? "text-zinc-500 hover:text-zinc-300 hover:bg-white/10"
              : "text-gray-400 hover:text-gray-600 hover:bg-gray-100",
          )}
        >
          <Smile className="w-3.5 h-3.5" />
        </button>

        {showPicker && (
          <div
            className={cn(
              "absolute bottom-full mb-1.5 flex gap-0.5 p-1.5 rounded-2xl shadow-lg border z-20",
              post.isMe ? "right-0" : "left-0",
              darkMode
                ? "bg-zinc-800 border-white/10 shadow-black/40"
                : "bg-white border-gray-200 shadow-gray-200/60",
            )}
          >
            {PRESET_REACTIONS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  onReact(post.id, emoji);
                  setShowPicker(false);
                }}
                className={cn(
                  "text-lg p-1 rounded-xl transition-all hover:scale-125",
                  darkMode ? "hover:bg-zinc-700" : "hover:bg-gray-100",
                )}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>

      {post.isMe && (
        <button
          onClick={() => onDelete(post)}
          title="Apagar mensagem"
          className={cn(
            "opacity-0 group-hover:opacity-100 transition-opacity self-center p-1.5 rounded-lg text-zinc-500 hover:text-red-500",
            darkMode ? "hover:bg-red-950/30" : "hover:bg-red-50",
          )}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}

      {post.isMe && Avatar}
    </div>
  );
}

function DateSeparator({ label, darkMode }: { label: string; darkMode: boolean }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className={cn("flex-1 h-px", darkMode ? "bg-zinc-800" : "bg-gray-100")} />
      <span className="text-[10px] font-semibold tracking-widest text-orange-500 uppercase">
        {label}
      </span>
      <div className={cn("flex-1 h-px", darkMode ? "bg-zinc-800" : "bg-gray-100")} />
    </div>
  );
}

// ─── CommunityFeed ────────────────────────────────────────────────────────────

export default function CommunityFeed() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showMembers, setShowMembers] = useState(false);
  const [activeProfile, setActiveProfile] = useState<UserProfile | null>(null);
  // undefined = auth ainda não verificada | null = não autenticado | string = autenticado
  const [currentUserId, setCurrentUserId] = useState<string | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const { darkMode } = useDarkMode();

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Obter usuário autenticado
  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data }) => setCurrentUserId(data.user?.id ?? null));
  }, []);

  // Carregar mensagens e subscrever ao realtime
  useEffect(() => {
    if (currentUserId === undefined) return; // auth ainda não resolveu
    if (currentUserId === null) {
      setIsLoading(false); // não autenticado
      return;
    }

    setIsLoading(true);
    fetchMessages(currentUserId)
      .then((msgs) => setPosts(msgs.map((m) => toPost(m, currentUserId))))
      .catch(() => {})
      .finally(() => setIsLoading(false));

    const unsubscribe = subscribeToMessages(currentUserId, (newMsg) => {
      setPosts((prev) => {
        if (prev.some((p) => p.id === newMsg.id)) return prev;
        return [...prev, toPost(newMsg, currentUserId)];
      });
    });

    return () => { unsubscribe(); };
  }, [currentUserId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [posts]);

  const participants = useMemo(() => {
    const seen = new Set<string>();
    return posts.filter((p) => {
      if (p.isMe || seen.has(p.authorId)) return false;
      seen.add(p.authorId);
      return true;
    });
  }, [posts]);

  const openProfile = (post: CommunityPost) => {
    const messagesInChannel = posts.filter((p) => p.authorId === post.authorId).length;
    setActiveProfile({
      name: post.authorName,
      initials: post.authorInitials,
      color: post.authorColor,
      specialty: post.authorSpecialty ?? null,
      messagesInChannel,
      featuredReports: [],
    });
  };

  const handleSend = async () => {
    if (!input.trim() && attachments.length === 0) return;
    if (!currentUserId || currentUserId === undefined) return;

    if (attachments.length > 0) {
      const err = validateFiles(attachments);
      if (err) {
        setSendError(err);
        return;
      }
    }

    const content = input.trim() || " ";
    const files = [...attachments];
    setInput("");
    setAttachments([]);
    setSendError(null);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    // Resetar inputs de arquivo para permitir reselecionar o mesmo arquivo
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (imageInputRef.current) imageInputRef.current.value = "";

    setIsSending(true);
    try {
      const sent = await sendMessage(currentUserId, content, files);
      setPosts((prev) => {
        if (prev.some((p) => p.id === sent.id)) {
          // O realtime já adicionou o post (sem anexos) — substituir pela versão completa
          return prev.map((p) => (p.id === sent.id ? toPost(sent, currentUserId) : p));
        }
        return [...prev, toPost(sent, currentUserId)];
      });
    } catch (err) {
      setSendError(err instanceof Error ? err.message : "Erro ao enviar mensagem");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 128) + "px";
    }
  };

  const handleFileChange = (files: FileList | null) => {
    if (!files) return;
    setAttachments((prev) => [...prev, ...Array.from(files)]);
  };

  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      const isInsecure = window.location.protocol !== "https:" && window.location.hostname !== "localhost";
      setSendError(
        isInsecure
          ? "Gravação de áudio requer conexão segura (HTTPS). Acesse o app via HTTPS para usar esta função."
          : "Seu navegador não expõe a API de microfone. Verifique as permissões ou tente recarregar a página.",
      );
      return;
    }

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      const error = err as DOMException;
      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        setSendError("Permissão de microfone negada. Clique no cadeado na barra de endereço e permita o acesso ao microfone.");
      } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
        setSendError("Nenhum microfone encontrado no dispositivo.");
      } else if (error.name === "NotReadableError") {
        setSendError("Microfone em uso por outro aplicativo.");
      } else {
        setSendError(`Erro ao acessar microfone: ${error.message || error.name}`);
      }
      return;
    }

    const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
      ? "audio/webm;codecs=opus"
      : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/ogg";

    const mediaRecorder = new MediaRecorder(stream, { mimeType });
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const normalizedMimeType = mimeType.split(";")[0]; // strip codec params, e.g. "audio/webm;codecs=opus" → "audio/webm"
      const blob = new Blob(audioChunksRef.current, { type: normalizedMimeType });
      const ext = mimeType.includes("ogg") ? "ogg" : "webm";
      const file = new File([blob], `audio-${Date.now()}.${ext}`, { type: normalizedMimeType });
      setAttachments((prev) => [...prev, file]);
      stream.getTracks().forEach((t) => t.stop());
    };

    mediaRecorder.start();
    setIsRecording(true);
    setRecordingSeconds(0);
    recordingTimerRef.current = setInterval(() => {
      setRecordingSeconds((s) => s + 1);
    }, 1000);
  };

  const stopRecording = (cancel = false) => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    const mr = mediaRecorderRef.current;
    if (mr && mr.state !== "inactive") {
      if (cancel) {
        mr.ondataavailable = null;
        mr.onstop = () => {
          mr.stream?.getTracks().forEach((t) => t.stop());
        };
      }
      mr.stop();
    }
    setIsRecording(false);
    setRecordingSeconds(0);
  };

  const handleDelete = async (post: CommunityPost) => {
    if (!post.isMe) return;
    // Remoção otimista
    setPosts((prev) => prev.filter((p) => p.id !== post.id));
    try {
      const attachmentUrls = (post.attachments ?? []).map((a) => a.url);
      await deleteMessage(post.id, attachmentUrls);
    } catch {
      // Reverter em caso de erro
      fetchMessages(currentUserId!).then((msgs) =>
        setPosts(msgs.map((m) => toPost(m, currentUserId!))),
      );
    }
  };

  const handleReact = async (postId: string, emoji: string) => {
    if (!currentUserId || currentUserId === undefined) return;

    // Atualização otimista
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const existing = p.reactions?.find((r) => r.emoji === emoji);
        if (!existing) {
          return {
            ...p,
            reactions: [...(p.reactions ?? []), { emoji, count: 1, reacted: true }],
          };
        }
        return {
          ...p,
          reactions: p.reactions?.map((r) =>
            r.emoji === emoji
              ? { ...r, count: r.reacted ? r.count - 1 : r.count + 1, reacted: !r.reacted }
              : r,
          ),
        };
      }),
    );

    try {
      await toggleReaction(postId, currentUserId, emoji);
    } catch {
      // Reverter em caso de erro
      fetchMessages(currentUserId).then((msgs) =>
        setPosts(msgs.map((m) => toPost(m, currentUserId))),
      );
    }
  };

  return (
    <>
      {activeProfile && (
        <UserProfileModal profile={activeProfile} onClose={() => setActiveProfile(null)} />
      )}

      <div className="flex h-full overflow-hidden">
        <div className="flex flex-col flex-1 min-w-0">
          {/* Header */}
          <div
            className={cn(
              "flex-shrink-0 flex items-center justify-between gap-3 px-5 py-3.5 border-b transition-colors duration-300",
              darkMode ? "border-white/10 bg-[#1c1c1e]" : "border-gray-200 bg-white",
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "#09090b" }}
              >
                <Hash className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-semibold tracking-widest text-orange-500 uppercase leading-none mb-1">
                  Canal · Wradio
                </p>
                <p
                  className={cn(
                    "text-sm font-bold leading-none",
                    darkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  geral
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowMembers((s) => !s)}
              title={showMembers ? "Ocultar membros" : "Ver membros online"}
              className={cn(
                "hidden md:flex p-2 rounded-lg transition-colors",
                showMembers
                  ? darkMode
                    ? "bg-white/10 text-white"
                    : "bg-gray-100 text-gray-900"
                  : darkMode
                    ? "text-zinc-500 hover:text-zinc-300 hover:bg-white/10"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100",
              )}
            >
              <Users className="w-4 h-4" />
            </button>
          </div>

          {/* Feed */}
          <div
            className={cn(
              "flex-1 overflow-y-auto px-4 py-5 space-y-4 transition-colors duration-300",
              darkMode ? "bg-[#111113]" : "bg-gray-50/60",
            )}
          >
            {isLoading ? (
              <>
                <DateSeparator label="Hoje" darkMode={darkMode} />
                <div className="flex justify-center py-8">
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 border-t-transparent animate-spin",
                      darkMode ? "border-zinc-500" : "border-gray-300",
                    )}
                  />
                </div>
              </>
            ) : posts.length === 0 ? (
              <>
                <DateSeparator label="Hoje" darkMode={darkMode} />
                <p
                  className={cn(
                    "text-center text-xs py-8",
                    darkMode ? "text-zinc-600" : "text-gray-400",
                  )}
                >
                  Nenhuma mensagem ainda. Seja o primeiro a escrever!
                </p>
              </>
            ) : (
              groupPostsByDate(posts).map(({ label, items }) => (
                <Fragment key={label}>
                  <DateSeparator label={label} darkMode={darkMode} />
                  {items.map((post) => (
                    <PostBubble
                      key={post.id}
                      post={post}
                      onReact={handleReact}
                      onAvatarClick={openProfile}
                      onDelete={handleDelete}
                      darkMode={darkMode}
                    />
                  ))}
                </Fragment>
              ))
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div
            className={cn(
              "border-t px-4 py-3 flex-shrink-0 transition-colors duration-300",
              darkMode ? "border-white/10 bg-[#1c1c1e]" : "border-gray-100 bg-white",
            )}
          >
            {sendError && (
              <div
                className={cn(
                  "mb-2.5 flex items-center justify-between text-xs text-red-500 px-3 py-2 rounded-lg",
                  darkMode ? "bg-red-950/30" : "bg-red-50",
                )}
              >
                <span>{sendError}</span>
                <button onClick={() => setSendError(null)}>
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {attachments.map((file, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs border",
                      darkMode
                        ? "bg-zinc-800 border-white/10 text-zinc-300"
                        : "bg-gray-100 border-gray-200 text-gray-600",
                    )}
                  >
                    <span className="max-w-[120px] truncate">{file.name}</span>
                    <button
                      onClick={() =>
                        setAttachments((prev) => prev.filter((_, idx) => idx !== i))
                      }
                      className={cn(
                        "transition-colors",
                        darkMode
                          ? "text-zinc-500 hover:text-zinc-300"
                          : "text-gray-400 hover:text-gray-700",
                      )}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-end gap-2">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/gif,image/webp,application/pdf"
                className="hidden"
                onChange={(e) => handleFileChange(e.target.files)}
              />
              <input
                ref={imageInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e.target.files)}
              />

              {isRecording ? (
                <>
                  {/* UI de gravação */}
                  <div
                    className={cn(
                      "flex items-center gap-3 flex-1 rounded-xl border px-4 py-2.5",
                      darkMode
                        ? "border-red-500/30 bg-red-950/20"
                        : "border-red-200 bg-red-50",
                    )}
                    style={{ minHeight: "42px" }}
                  >
                    <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse flex-shrink-0" />
                    <span
                      className={cn(
                        "text-sm font-mono font-semibold tabular-nums",
                        darkMode ? "text-red-400" : "text-red-600",
                      )}
                    >
                      {String(Math.floor(recordingSeconds / 60)).padStart(2, "0")}:
                      {String(recordingSeconds % 60).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "text-xs",
                        darkMode ? "text-zinc-500" : "text-gray-400",
                      )}
                    >
                      Gravando áudio...
                    </span>
                  </div>

                  {/* Cancelar */}
                  <button
                    onClick={() => stopRecording(true)}
                    title="Cancelar gravação"
                    className={cn(
                      "p-2.5 rounded-xl flex-shrink-0 transition-colors",
                      darkMode
                        ? "text-zinc-500 hover:text-zinc-300 hover:bg-white/10"
                        : "text-gray-400 hover:text-gray-600 hover:bg-gray-100",
                    )}
                  >
                    <X className="w-[18px] h-[18px]" />
                  </button>

                  {/* Parar e anexar */}
                  <button
                    onClick={() => stopRecording(false)}
                    title="Parar gravação"
                    className="p-2.5 rounded-xl text-white flex-shrink-0 transition-all hover:opacity-90 active:scale-[0.97] shadow-md shadow-zinc-900/10"
                    style={{ backgroundColor: "#09090b" }}
                  >
                    <Square className="w-[18px] h-[18px] fill-current" />
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-0.5 pb-0.5">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      title="Anexar arquivo"
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        darkMode
                          ? "text-zinc-500 hover:text-zinc-300 hover:bg-white/10"
                          : "text-gray-400 hover:text-gray-600 hover:bg-gray-100",
                      )}
                    >
                      <Paperclip className="w-[18px] h-[18px]" />
                    </button>
                    <button
                      onClick={() => imageInputRef.current?.click()}
                      title="Adicionar imagem"
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        darkMode
                          ? "text-zinc-500 hover:text-zinc-300 hover:bg-white/10"
                          : "text-gray-400 hover:text-gray-600 hover:bg-gray-100",
                      )}
                    >
                      <ImageIcon className="w-[18px] h-[18px]" />
                    </button>
                    <button
                      onClick={startRecording}
                      title="Gravar áudio"
                      disabled={!currentUserId}
                      className={cn(
                        "p-2 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
                        darkMode
                          ? "text-zinc-500 hover:text-zinc-300 hover:bg-white/10"
                          : "text-gray-400 hover:text-gray-600 hover:bg-gray-100",
                      )}
                    >
                      <Mic className="w-[18px] h-[18px]" />
                    </button>
                  </div>

                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      currentUserId == null ? "Faça login para participar..." : "Mensagem para #geral..."
                    }
                    disabled={!currentUserId || isSending}
                    rows={1}
                    className={cn(
                      "flex-1 resize-none rounded-xl border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all overflow-y-auto leading-relaxed disabled:opacity-50 disabled:cursor-not-allowed",
                      darkMode
                        ? "border-white/10 bg-zinc-800 text-white placeholder-zinc-500 focus:ring-white/20"
                        : "border-gray-200 text-gray-800 placeholder-gray-400 focus:ring-gray-900",
                    )}
                    style={{ minHeight: "42px", maxHeight: "128px" }}
                  />

                  <button
                    onClick={handleSend}
                    disabled={(!input.trim() && attachments.length === 0) || !currentUserId || isSending}
                    className={cn(
                      "p-2.5 rounded-xl text-white transition-all flex-shrink-0 pb-[9px] hover:opacity-90 shadow-md shadow-zinc-900/10 active:scale-[0.97] disabled:cursor-not-allowed",
                      (!input.trim() && attachments.length === 0) || !currentUserId || isSending
                        ? darkMode
                          ? "bg-zinc-700"
                          : "bg-gray-100"
                        : "",
                    )}
                    style={
                      (input.trim() || attachments.length > 0) && currentUserId && !isSending
                        ? { backgroundColor: "#09090b" }
                        : undefined
                    }
                    title="Enviar mensagem"
                  >
                    <Send className="w-[18px] h-[18px]" />
                  </button>
                </>
              )}
            </div>

            {!isRecording && (
              <p
                className={cn(
                  "text-[10px] mt-2 text-center",
                  darkMode ? "text-zinc-600" : "text-gray-300",
                )}
              >
                Shift + Enter para nova linha · Enter para enviar
              </p>
            )}
          </div>
        </div>

        {/* Sidebar membros */}
        {showMembers && (
          <div
            className={cn(
              "hidden md:flex flex-col w-56 flex-shrink-0 border-l transition-colors duration-300",
              darkMode ? "border-white/10 bg-[#1c1c1e]" : "border-gray-100 bg-white",
            )}
          >
            <div
              className={cn(
                "px-4 py-3.5 border-b",
                darkMode ? "border-white/10" : "border-gray-100",
              )}
            >
              <p className="text-[10px] font-semibold tracking-widest text-orange-500 uppercase">
                Participantes — {participants.length}
              </p>
            </div>
            <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
              {participants.length === 0 ? (
                <p
                  className={cn(
                    "text-[11px] px-2 py-3 text-center",
                    darkMode ? "text-zinc-600" : "text-gray-400",
                  )}
                >
                  Nenhum participante ainda.
                </p>
              ) : (
                participants.map((p) => (
                  <button
                    key={p.authorId}
                    onClick={() => openProfile(p)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-2 py-2 rounded-xl transition-colors",
                      darkMode ? "hover:bg-white/5" : "hover:bg-gray-50",
                    )}
                  >
                    <div
                      className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0",
                        p.authorColor,
                      )}
                    >
                      {p.authorInitials}
                    </div>
                    <span
                      className={cn(
                        "text-xs font-medium truncate",
                        darkMode ? "text-zinc-300" : "text-gray-700",
                      )}
                    >
                      {p.authorName}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
