"use client";

import { useState } from "react";
import {
  ChevronRight,
  Download,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDarkMode } from "@/context/DarkModeContext";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { deleteAccount } from "../actions";
import { ptBr } from "@/lib/i18n";
import TermsModal from "./TermsModal";

const t = ptBr.app.settings.privacy;

const PRIVACY_TOGGLES = t.privacyToggles;
const LEGAL_LINKS = t.legalLinks;

function PrivacyToggle({
  label,
  description,
  defaultOn,
  darkMode,
}: {
  label: string;
  description: string;
  defaultOn: boolean;
  darkMode: boolean;
}) {
  const [on, setOn] = useState(defaultOn);

  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 pb-4 border-b last:border-0 last:pb-0",
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
          {label}
        </p>
        <p
          className={cn(
            "text-xs mt-0.5",
            darkMode ? "text-zinc-500" : "text-gray-400"
          )}
        >
          {description}
        </p>
      </div>
      <button
        onClick={() => setOn((v) => !v)}
        className="flex-shrink-0 mt-0.5 transition-colors"
      >
        {on ? (
          <ToggleRight className="w-6 h-6 text-orange-500" />
        ) : (
          <ToggleLeft
            className={cn(
              "w-6 h-6",
              darkMode ? "text-zinc-600" : "text-gray-300"
            )}
          />
        )}
      </button>
    </div>
  );
}

export default function PrivacyTab() {
  const { darkMode } = useDarkMode();
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [termsOpen, setTermsOpen] = useState(false);

  const handleDeleteAccount = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      const result = await deleteAccount();
      if (result.error) {
        setDeleteError(result.error);
        return;
      }
      // Conta deletada com sucesso — encerra sessão local e redireciona
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
    } catch {
      setDeleteError(t.deleteError);
    } finally {
      setDeleting(false);
    }
  };

  const cardClass = cn(
    "rounded-2xl border p-6",
    darkMode ? "border-white/10 bg-zinc-900" : "border-gray-100 bg-white"
  );

  return (
    <div className="space-y-8">
      {/* Privacy toggles */}
      <div className={cn(cardClass, "space-y-5")}>
        <div>
          <p className="text-xs font-semibold tracking-widest text-orange-500 uppercase mb-1">
            {t.controlBadge}
          </p>
          <h3
            className={cn(
              "font-bold",
              darkMode ? "text-white" : "text-gray-900"
            )}
          >
            {t.prefsTitle}
          </h3>
        </div>
        {PRIVACY_TOGGLES.map((item) => (
          <PrivacyToggle key={item.label} {...item} darkMode={darkMode} />
        ))}
      </div>

      {/* Data */}
      <div className={cn(cardClass, "space-y-4")}>
        <div>
          <p className="text-xs font-semibold tracking-widest text-orange-500 uppercase mb-1">
            {t.dataBadge}
          </p>
          <h3
            className={cn(
              "font-bold",
              darkMode ? "text-white" : "text-gray-900"
            )}
          >
            {t.dataTitle}
          </h3>
        </div>
        <p
          className={cn(
            "text-sm",
            darkMode ? "text-zinc-400" : "text-gray-400"
          )}
        >
          {t.dataSubtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          {/* Exportar — ainda não implementado */}
          <div className="relative">
            <button
              disabled
              className={cn(
                "flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all shadow-sm cursor-not-allowed opacity-50",
                darkMode
                  ? "border-white/10 bg-zinc-800 text-zinc-200"
                  : "border-gray-200 bg-white text-gray-700"
              )}
            >
              <Download className="w-4 h-4" />
              {t.exportBtn}
            </button>
            <span
              className={cn(
                "absolute -top-2 -right-2 text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
                darkMode
                  ? "bg-zinc-700 text-zinc-400"
                  : "bg-gray-100 text-gray-400"
              )}
            >
              {t.comingSoon}
            </span>
          </div>

          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-red-500/30 bg-red-500/10 text-sm font-semibold text-red-500 hover:bg-red-500/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              {t.deleteBtn}
            </button>
          ) : (
            <div
              className={cn(
                "flex flex-col gap-3 p-4 rounded-xl border",
                darkMode
                  ? "border-red-500/30 bg-red-500/10"
                  : "border-red-200 bg-red-50"
              )}
            >
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 font-medium">
                  {t.deleteWarning}
                </p>
              </div>
              {deleteError && (
                <p className="text-xs text-red-500">{deleteError}</p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors disabled:opacity-60"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />{" "}
                      {t.deletingBtn}
                    </>
                  ) : (
                    t.deleteConfirmBtn
                  )}
                </button>
                <button
                  onClick={() => {
                    setConfirmDelete(false);
                    setDeleteError(null);
                  }}
                  disabled={deleting}
                  className={cn(
                    "px-4 py-2 rounded-lg text-xs font-semibold transition-colors",
                    darkMode
                      ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                      : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                  )}
                >
                  {t.cancelBtn}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Policy links */}
      <div className={cn(cardClass, "space-y-3")}>
        <div>
          <p className="text-xs font-semibold tracking-widest text-orange-500 uppercase mb-1">
            {t.legalBadge}
          </p>
          <h3
            className={cn(
              "font-bold mb-1",
              darkMode ? "text-white" : "text-gray-900"
            )}
          >
            {t.legalTitle}
          </h3>
        </div>
        {LEGAL_LINKS.map(({ label, href }) => {
          const isTerms = label === "Termos de Uso";
          return isTerms ? (
            <button
              key={label}
              onClick={() => setTermsOpen(true)}
              className={cn(
                "flex w-full items-center justify-between py-1 text-sm transition-colors",
                darkMode
                  ? "text-zinc-400 hover:text-white"
                  : "text-gray-700 hover:text-gray-900"
              )}
            >
              {label}
              <ChevronRight
                className={cn(
                  "w-4 h-4",
                  darkMode ? "text-zinc-600" : "text-gray-400"
                )}
              />
            </button>
          ) : (
            <a
              key={label}
              href={href}
              className={cn(
                "flex items-center justify-between py-1 text-sm transition-colors",
                darkMode
                  ? "text-zinc-400 hover:text-white"
                  : "text-gray-700 hover:text-gray-900"
              )}
            >
              {label}
              <ChevronRight
                className={cn(
                  "w-4 h-4",
                  darkMode ? "text-zinc-600" : "text-gray-400"
                )}
              />
            </a>
          );
        })}
      </div>

      <TermsModal open={termsOpen} onClose={() => setTermsOpen(false)} />
    </div>
  );
}
