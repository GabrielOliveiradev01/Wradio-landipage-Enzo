"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDarkMode } from "@/context/DarkModeContext";
import { createClient } from "@/lib/supabase/client";
import { ptBr } from "@/lib/i18n";

const t = ptBr.app.settings.security;

const SESSIONS = [
  { device: "Chrome · macOS", location: "São Paulo, SP", current: true },
  { device: "Safari · iPhone 15", location: "São Paulo, SP", current: false },
];

function PasswordField({
  label,
  value,
  onChange,
  show,
  onToggleShow,
  darkMode,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggleShow: () => void;
  darkMode: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className={cn(
          "block text-xs font-medium mb-1.5",
          darkMode ? "text-zinc-400" : "text-gray-500"
        )}
      >
        {label}
      </label>
      <div className="relative">
        <Lock
          className={cn(
            "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4",
            darkMode ? "text-zinc-500" : "text-gray-400"
          )}
        />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={cn(
            "w-full rounded-xl border pl-10 pr-11 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all",
            darkMode
              ? "border-white/10 bg-zinc-800 text-white placeholder-zinc-500 focus:ring-white/20"
              : "border-gray-200 bg-white text-gray-800 focus:ring-gray-900",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        />
        <button
          type="button"
          onClick={onToggleShow}
          disabled={disabled}
          className={cn(
            "absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors",
            darkMode
              ? "text-zinc-500 hover:text-zinc-300"
              : "text-gray-400 hover:text-gray-600"
          )}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

export default function SecurityTab() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revokingOthers, setRevokingOthers] = useState(false);
  const [revokedOthers, setRevokedOthers] = useState(false);
  const { darkMode } = useDarkMode();

  const handleSave = async () => {
    setError(null);

    if (!current || !newPass || !confirm) {
      setError(t.errFillAll);
      return;
    }
    if (newPass !== confirm) {
      setError(t.errMismatch);
      return;
    }
    if (newPass.length < 8) {
      setError(t.errTooShort);
      return;
    }

    setSaving(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user?.email) throw new Error(t.errUserNotFound);

      // Verifica a senha atual via re-autenticação
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: current,
      });

      if (signInError) {
        // Diferencia credencial errada de outros erros (rate-limit, rede, etc.)
        if (
          signInError.message.toLowerCase().includes("invalid login credentials") ||
          signInError.message.toLowerCase().includes("invalid credentials")
        ) {
          throw new Error(t.errCurrentPass);
        }
        throw new Error(t.errCannotVerify);
      }

      // Atualiza para a nova senha
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPass,
      });
      if (updateError) throw updateError;

      setCurrent("");
      setNewPass("");
      setConfirm("");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : t.errUpdate;
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleRevokeOtherSessions = async () => {
    setRevokingOthers(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut({ scope: "others" });
      setRevokedOthers(true);
    } finally {
      setRevokingOthers(false);
    }
  };

  const cardClass = cn(
    "rounded-2xl border p-6",
    darkMode ? "border-white/10 bg-zinc-900" : "border-gray-100 bg-white"
  );

  return (
    <div className="space-y-8">
      {/* Change password */}
      <div className={cn(cardClass, "space-y-5")}>
        <div>
          <p className="text-xs font-semibold tracking-widest text-orange-500 uppercase mb-1">
            {t.accessBadge}
          </p>
          <h3
            className={cn(
              "font-bold",
              darkMode ? "text-white" : "text-gray-900"
            )}
          >
            {t.changePassTitle}
          </h3>
        </div>

        <PasswordField
          label={t.currentPassLabel}
          value={current}
          onChange={setCurrent}
          show={showCurrent}
          onToggleShow={() => setShowCurrent((v) => !v)}
          darkMode={darkMode}
          disabled={saving}
        />
        <PasswordField
          label={t.newPassLabel}
          value={newPass}
          onChange={setNewPass}
          show={showNew}
          onToggleShow={() => setShowNew((v) => !v)}
          darkMode={darkMode}
          disabled={saving}
        />
        <PasswordField
          label={t.confirmPassLabel}
          value={confirm}
          onChange={setConfirm}
          show={showConfirm}
          onToggleShow={() => setShowConfirm((v) => !v)}
          darkMode={darkMode}
          disabled={saving}
        />

        {error && <p className="text-xs text-red-500">{error}</p>}

        <button
          onClick={handleSave}
          disabled={saving}
          className={cn(
            "flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm transition-all active:scale-[0.97]",
            saved
              ? "bg-green-500 text-white shadow-md shadow-green-500/20"
              : saving
                ? darkMode
                  ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                  : "bg-gray-100 text-gray-300 cursor-not-allowed"
                : "text-white hover:opacity-90 shadow-md shadow-zinc-900/10"
          )}
          style={!saved && !saving ? { backgroundColor: "#09090b" } : undefined}
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> {t.updatingBtn}
            </>
          ) : saved ? (
            <>
              <Check className="w-4 h-4" /> {t.updatedBtn}
            </>
          ) : (
            t.updateBtn
          )}
        </button>
      </div>

      {/* 2FA — em breve */}
      <div className={cardClass}>
        <div className="flex items-center justify-between">
          <div>
            <p
              className={cn(
                "font-bold",
                darkMode ? "text-white" : "text-gray-900"
              )}
            >
              {t.twoFactorTitle}
            </p>
            <p
              className={cn(
                "text-sm mt-0.5",
                darkMode ? "text-zinc-400" : "text-gray-400"
              )}
            >
              {t.twoFactorSubtitle}
            </p>
          </div>
          <span
            className={cn(
              "text-xs font-semibold px-2.5 py-1 rounded-full shrink-0",
              darkMode
                ? "bg-zinc-700 text-zinc-400"
                : "bg-gray-100 text-gray-400"
            )}
          >
            {t.comingSoon}
          </span>
        </div>
      </div>

      {/* Active sessions */}
      <div className={cn(cardClass, "space-y-4")}>
        <div>
          <p className="text-xs font-semibold tracking-widest text-orange-500 uppercase mb-1">
            {t.devicesBadge}
          </p>
          <h3
            className={cn(
              "font-bold",
              darkMode ? "text-white" : "text-gray-900"
            )}
          >
            {t.activeSessionsTitle}
          </h3>
        </div>
        {SESSIONS.map((session) => (
          <div
            key={session.device}
            className={cn(
              "flex items-center justify-between py-2 border-b last:border-0",
              darkMode ? "border-zinc-800" : "border-gray-100"
            )}
          >
            <div>
              <p
                className={cn(
                  "text-sm font-medium",
                  darkMode ? "text-zinc-200" : "text-gray-800"
                )}
              >
                {session.device}
              </p>
              <p
                className={cn(
                  "text-xs",
                  darkMode ? "text-zinc-500" : "text-gray-400"
                )}
              >
                {session.location}
              </p>
            </div>
            {session.current ? (
              <span
                className={cn(
                  "text-xs font-semibold px-2.5 py-1 rounded-full",
                  darkMode
                    ? "bg-green-500/10 text-green-400"
                    : "bg-green-100 text-green-700"
                )}
              >
                {t.sessionCurrentBadge}
              </span>
            ) : revokedOthers ? (
              <span
                className={cn(
                  "text-xs font-semibold",
                  darkMode ? "text-zinc-500" : "text-gray-400"
                )}
              >
                {t.sessionTerminated}
              </span>
            ) : (
              <button
                onClick={handleRevokeOtherSessions}
                disabled={revokingOthers}
                className="text-xs text-red-500 hover:text-red-400 font-medium transition-colors disabled:opacity-50"
              >
                {revokingOthers ? t.revokingBtn : t.revokeOthersBtn}
              </button>
            )}
          </div>
        ))}
        <p
          className={cn(
            "text-xs",
            darkMode ? "text-zinc-600" : "text-gray-400"
          )}
        >
          {t.revokeHint}
        </p>
      </div>
    </div>
  );
}
