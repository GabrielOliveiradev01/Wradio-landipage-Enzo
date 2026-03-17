"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ptBr } from "@/lib/i18n";

const t = ptBr.auth.register;

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setPasswordError(t.errorPasswordMismatch);
      return;
    }
    setPasswordError("");
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, full_name: name }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? t.errorDefault);
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push("/welcome");
    router.refresh();
  };

  return (
    <div className="w-full max-w-sm">
      <p className="text-xs font-semibold tracking-widest text-orange-500 uppercase mb-5">
        {t.badge}
      </p>

      <h1 className="text-4xl font-bold text-gray-900 leading-[1.15] mb-4">
        {t.headingLine1}
        <br />
        {t.headingLine2}
      </h1>

      <p className="text-gray-400 text-sm leading-relaxed mb-10">
        {t.subtitle}
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="name"
            className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2"
          >
            {t.nameLabel}
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.namePlaceholder}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2"
          >
            {t.emailLabel}
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.emailPlaceholder}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2"
          >
            {t.passwordLabel}
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.passwordPlaceholder}
              required
              minLength={8}
              className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2"
          >
            {t.confirmPasswordLabel}
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (passwordError) setPasswordError("");
              }}
              placeholder={t.confirmPasswordPlaceholder}
              required
              minLength={8}
              className={`w-full px-4 py-3 pr-11 rounded-xl border text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:border-transparent transition text-sm ${
                passwordError
                  ? "border-red-300 focus:ring-red-400"
                  : "border-gray-200 focus:ring-orange-400"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {passwordError && (
            <p className="mt-1.5 text-xs text-red-500">{passwordError}</p>
          )}
        </div>

        {error && (
          <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || oauthLoading}
          className="w-full py-4 rounded-2xl font-semibold text-sm text-white flex items-center justify-center gap-2.5 transition-all hover:opacity-90 active:scale-[0.98] mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: "#09090b" }}
        >
          {loading ? t.loadingBtn : t.submitBtn}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>

      <p className="text-center text-xs text-gray-400 mt-8">
        {t.hasAccount}{" "}
        <Link
          href="/login"
          className="text-orange-500 font-semibold hover:text-orange-600 transition-colors"
        >
          {t.loginLink}
        </Link>
      </p>
    </div>
  );
}
