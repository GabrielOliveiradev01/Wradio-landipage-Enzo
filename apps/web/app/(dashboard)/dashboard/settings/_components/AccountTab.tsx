"use client";

import { useState, useRef, useEffect } from "react";
import {
  User,
  Shield,
  Mail,
  Phone,
  Bell,
  Camera,
  Check,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import NotificationToggle from "./NotificationToggle";
import { useUserProfile } from "@/context/UserProfileContext";
import { useDarkMode } from "@/context/DarkModeContext";
import { createClient } from "@/lib/supabase/client";
import { ptBr } from "@/lib/i18n";

const t = ptBr.app.settings.account;

// `phone` foi adicionado via migration — remover após rodar `supabase gen types`
interface ProfileRow {
  id: string;
  full_name: string | null;
  crm: string | null;
  avatar_url: string | null;
  phone: string | null;
  specialty: string | null;
  created_at: string;
  updated_at: string;
}

const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5 MB

const NOTIFICATIONS = t.notifications;

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}

export default function AccountTab() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [crm, setCrm] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [emailMessage, setEmailMessage] = useState<string | null>(null);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const { avatarUrl, setAvatarUrl, setFullName } = useUserProfile();
  const { darkMode } = useDarkMode();

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      setEmail(user.email ?? "");
      setOriginalEmail(user.email ?? "");

      const { data: rawProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      const profile = rawProfile as ProfileRow | null;

      if (profile) {
        setName(profile.full_name ?? "");
        setFullName(profile.full_name ?? "");
        setCrm(profile.crm ?? "");
        setPhone(profile.phone ?? "");
        if (profile.avatar_url) setAvatarUrl(profile.avatar_url);
      }

      setLoading(false);
    }

    loadProfile();
  // setAvatarUrl é estável (vem de useState), safe no array de deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAvatarChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarError(null);

    if (file.size > MAX_AVATAR_SIZE) {
      setAvatarError(t.photoSizeError);
      e.target.value = "";
      return;
    }

    setUploadingAvatar(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${user.id}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(path);

      await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl } as never)
        .eq("id", user.id);

      // cache-bust para forçar reload da imagem
      setAvatarUrl(`${publicUrl}?t=${Date.now()}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : t.uploadError;
      setAvatarError(msg);
    } finally {
      setUploadingAvatar(false);
      e.target.value = "";
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setEmailMessage(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error(t.errorNotAuth);

      // `phone` não está no tipo gerado ainda — remover cast após `supabase gen types`
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ full_name: name, crm, phone, updated_at: new Date().toISOString() } as never)
        .eq("id", user.id);

      if (profileError) throw profileError;

      if (email !== originalEmail) {
        const { error: emailError } = await supabase.auth.updateUser({ email });
        if (emailError) throw emailError;
        setOriginalEmail(email);
        setEmailMessage(t.emailConfirmMsg);
      }

      setFullName(name);

      // Invalida o cache Redis para que o próximo carregamento do layout
      // busque o perfil atualizado no Supabase
      await fetch("/api/profile/invalidate-cache", { method: "POST" });

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : t.saveError;
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = cn(
    "w-full rounded-xl border pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all",
    darkMode
      ? "border-white/10 bg-zinc-800 text-white placeholder-zinc-500 focus:ring-white/20"
      : "border-gray-200 bg-white text-gray-800 focus:ring-gray-900",
    loading && "opacity-50 pointer-events-none"
  );

  const labelClass = cn(
    "block text-xs font-medium mb-1.5",
    darkMode ? "text-zinc-400" : "text-gray-500"
  );

  const iconClass = cn(
    "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4",
    darkMode ? "text-zinc-500" : "text-gray-400"
  );

  return (
    <div className="space-y-8">
      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="relative">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={t.photoLabel}
              className="w-20 h-20 rounded-full object-cover shadow-md"
            />
          ) : (
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center shadow-md shadow-zinc-900/20 text-white text-2xl font-bold select-none"
              style={{ backgroundColor: "#09090b" }}
            >
              {loading ? "…" : getInitials(name) || "?"}
            </div>
          )}
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="hidden"
            onChange={handleAvatarChange}
          />
          <button
            onClick={() => avatarInputRef.current?.click()}
            disabled={uploadingAvatar || loading}
            className={cn(
              "absolute -bottom-1 -right-1 w-7 h-7 rounded-full border shadow flex items-center justify-center transition-colors",
              darkMode
                ? "bg-zinc-800 border-white/10 hover:bg-zinc-700"
                : "bg-white border-gray-200 hover:bg-gray-50"
            )}
          >
            {uploadingAvatar ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-500" />
            ) : (
              <Camera
                className={cn(
                  "w-3.5 h-3.5",
                  darkMode ? "text-zinc-400" : "text-gray-600"
                )}
              />
            )}
          </button>
        </div>
        <div>
          <p
            className={cn(
              "font-semibold",
              darkMode ? "text-white" : "text-gray-900"
            )}
          >
            {t.photoLabel}
          </p>
          <p
            className={cn(
              "text-sm",
              darkMode ? "text-zinc-400" : "text-gray-400"
            )}
          >
            {t.photoHint}
          </p>
          {avatarError && (
            <p className="text-xs text-red-500 mt-1">{avatarError}</p>
          )}
        </div>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>{t.nameLabel}</label>
          <div className="relative">
            <User className={iconClass} />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>{t.emailLabel}</label>
          <div className="relative">
            <Mail className={iconClass} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>{t.phoneLabel}</label>
          <div className="relative">
            <Phone className={iconClass} />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+55 11 99999-0000"
              className={inputClass}
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>{t.crmLabel}</label>
          <div className="relative">
            <Shield className={iconClass} />
            <input
              value={crm}
              onChange={(e) => setCrm(e.target.value)}
              placeholder="CRM/SP 123456"
              className={inputClass}
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {emailMessage && (
        <p
          className={cn(
            "text-xs px-4 py-3 rounded-xl border",
            darkMode
              ? "bg-orange-500/10 border-orange-500/20 text-orange-300"
              : "bg-orange-50 border-orange-200 text-orange-700"
          )}
        >
          {emailMessage}
        </p>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}

      {/* Notifications */}
      <div
        className={cn(
          "rounded-2xl border p-5 space-y-4",
          darkMode ? "border-white/10 bg-zinc-900" : "border-gray-100 bg-white"
        )}
      >
        <div className="mb-1">
          <p className="text-xs font-semibold tracking-widest text-orange-500 uppercase mb-1">
            {t.prefsBadge}
          </p>
          <div className="flex items-center gap-2">
            <Bell
              className={cn(
                "w-4 h-4",
                darkMode ? "text-white" : "text-gray-900"
              )}
            />
            <h3
              className={cn(
                "font-bold text-sm",
                darkMode ? "text-white" : "text-gray-900"
              )}
            >
              {t.notificationsTitle}
            </h3>
          </div>
        </div>
        {NOTIFICATIONS.map((item) => (
          <NotificationToggle
            key={item.label}
            label={item.label}
            defaultOn={item.defaultOn}
          />
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={saving || loading}
        className={cn(
          "flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm transition-all active:scale-[0.97]",
          saved
            ? "bg-green-500 text-white shadow-md shadow-green-500/20"
            : saving || loading
              ? darkMode
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                : "bg-gray-100 text-gray-300 cursor-not-allowed"
              : "text-white hover:opacity-90 shadow-md shadow-zinc-900/10"
        )}
        style={
          !saved && !saving && !loading
            ? { backgroundColor: "#09090b" }
            : undefined
        }
      >
        {saving ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> {t.savingBtn}
          </>
        ) : saved ? (
          <>
            <Check className="w-4 h-4" /> {t.savedBtn}
          </>
        ) : (
          t.saveBtn
        )}
      </button>
    </div>
  );
}
