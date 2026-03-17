"use client";

import { useState, Fragment } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ArrowRight, Check } from "lucide-react";
import {
  GraduationCap,
  Stethoscope,
  Award,
  BookOpen,
  Zap,
  Layers,
  Activity,
  Heart,
  Atom,
  LayoutGrid,
  Clock,
  BarChart2,
  CheckCircle2,
  FileText,
  Building2,
  Building,
  Monitor,
  Timer,
  Hourglass,
  AlertCircle,
  Scan,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ptBr } from "@/lib/i18n";

const t = ptBr.onboarding.steps;

const TOTAL_STEPS = 6;

const BR_STATES = [
  "AC","AL","AM","AP","BA","CE","DF","ES","GO","MA",
  "MG","MS","MT","PA","PB","PE","PI","PR","RJ","RN",
  "RO","RR","RS","SC","SE","SP","TO",
];

// Icon mapping: option id → icon component
const OPTION_ICONS: Record<string, React.ElementType> = {
  // Step 1 — especialidade
  generalista: Stethoscope,
  radiologista: Award,
  "pos-radiologia": GraduationCap,
  "pos-imaginologia": BookOpen,
  ultrassonografista: Activity,
  outro: LayoutGrid,
  // Step 2 — modalidades
  rx: Zap,
  tc: Layers,
  rm: Activity,
  us: Scan,
  // Step 3 — problemas
  tempo: Clock,
  volume: BarChart2,
  padronizacao: CheckCircle2,
  faturamento: FileText,
  equipe: Building2,
  // Step 4 — atendimento
  clinica: Scan,
  hospital: Building,
  telelaudo: Monitor,
  // Step 5 — tempo médio
  "10-15": Zap,
  "15-20": Timer,
  "20-25": Clock,
};

type Answers = Record<number, string | string[]>;

export default function StepsPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Answers>({});
  const [crm, setCrm] = useState({ uf: "", number: "" });
  const [crmError, setCrmError] = useState("");

  const step = t.questions[currentStep - 1];

  function selectSingle(id: string) {
    setAnswers((prev) => ({ ...prev, [currentStep]: id }));
  }

  function toggleMulti(id: string) {
    setAnswers((prev) => {
      const current = (prev[currentStep] as string[]) ?? [];
      const next = current.includes(id)
        ? current.filter((v) => v !== id)
        : [...current, id];
      return { ...prev, [currentStep]: next };
    });
  }

  function isSelected(id: string): boolean {
    const answer = answers[currentStep];
    if (Array.isArray(answer)) return answer.includes(id);
    return answer === id;
  }

  function canProceed(): boolean {
    if (step.type === "crm") return crm.uf !== "" && crm.number.length >= 4;
    if (step.type === "multi") {
      const answer = answers[currentStep] as string[] | undefined;
      return !!answer && answer.length > 0;
    }
    return !!answers[currentStep];
  }

  function handleNext() {
    if (currentStep < TOTAL_STEPS) setCurrentStep((s) => s + 1);
    else router.push("/dashboard");
  }

  function handleBack() {
    if (currentStep === 1) router.push("/welcome");
    else setCurrentStep((s) => s - 1);
  }

  function validateCRM() {
    if (!/^\d+$/.test(crm.number)) {
      setCrmError(t.crmErrorDigitsOnly);
      return false;
    }
    if (crm.number.length < 4 || crm.number.length > 7) {
      setCrmError(t.crmErrorInvalidLength);
      return false;
    }
    setCrmError("");
    return true;
  }

  function handleFinish() {
    if (!validateCRM()) return;
    router.push("/dashboard");
  }

  return (
    <div className="w-full max-w-md">
      {/* Stepper */}
      <div className="flex items-center mb-10">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <Fragment key={i}>
            <div
              className={cn(
                "w-2 h-2 rounded-full shrink-0 transition-all duration-300",
                i + 1 < currentStep
                  ? "bg-gray-900"
                  : i + 1 === currentStep
                  ? "bg-orange-500 scale-125"
                  : "bg-gray-200"
              )}
            />
            {i < TOTAL_STEPS - 1 && (
              <div className="flex-1 h-px mx-2 bg-gray-100 overflow-hidden relative">
                <div
                  className="absolute inset-0 bg-gray-900 transition-transform duration-500 origin-left"
                  style={{ transform: `scaleX(${i + 1 < currentStep ? 1 : 0})` }}
                />
              </div>
            )}
          </Fragment>
        ))}
      </div>

      <p className="text-xs font-semibold tracking-widest text-orange-500 uppercase mb-3">
        {t.stepLabel} {currentStep} {t.stepOf} {TOTAL_STEPS}
      </p>

      <h2 className="text-3xl font-bold text-gray-900 leading-snug mb-2">
        {step.title}
      </h2>
      {step.subtitle && (
        <p className="text-sm text-gray-400 mb-8">{step.subtitle}</p>
      )}

      {step.type !== "crm" ? (
        <div className="space-y-2">
          {step.options.map((option) => {
            const Icon = OPTION_ICONS[option.id] ?? LayoutGrid;
            const selected = isSelected(option.id);
            return (
              <button
                key={option.id}
                onClick={() =>
                  step.type === "multi"
                    ? toggleMulti(option.id)
                    : selectSingle(option.id)
                }
                className={cn(
                  "w-full flex items-center gap-4 px-5 py-4 rounded-2xl border text-left transition-all duration-200 active:scale-[0.99] group",
                  selected
                    ? "border-transparent text-white"
                    : "border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white"
                )}
                style={selected ? { backgroundColor: "#09090b" } : undefined}
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                    selected ? "bg-white/10" : "bg-white"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4 transition-colors",
                      selected ? "text-orange-400" : "text-gray-400"
                    )}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm font-medium leading-none mb-1",
                      selected ? "text-white" : "text-gray-800"
                    )}
                  >
                    {option.label}
                  </p>
                  {"sublabel" in option && option.sublabel && (
                    <p
                      className={cn(
                        "text-xs leading-tight",
                        selected ? "text-zinc-400" : "text-gray-400"
                      )}
                    >
                      {option.sublabel}
                    </p>
                  )}
                </div>

                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                    selected
                      ? "bg-orange-500 border-orange-500"
                      : "border-gray-200 group-hover:border-gray-300"
                  )}
                >
                  {selected && <Check className="w-3 h-3 text-white" />}
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                {t.crmStateLabel}
              </label>
              <select
                value={crm.uf}
                onChange={(e) => {
                  setCrm((prev) => ({ ...prev, uf: e.target.value }));
                  setCrmError("");
                }}
                className="w-full px-3 py-3.5 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition bg-white"
              >
                <option value="">UF</option>
                {BR_STATES.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                {t.crmNumberLabel}
              </label>
              <input
                type="text"
                value={crm.number}
                onChange={(e) => {
                  setCrm((prev) => ({ ...prev, number: e.target.value }));
                  setCrmError("");
                }}
                placeholder="Ex: 123456"
                maxLength={7}
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
              />
            </div>
          </div>

          {crmError && (
            <p className="text-xs text-red-500 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {crmError}
            </p>
          )}

          <div className="bg-gray-50 rounded-xl px-5 py-4 border border-gray-100">
            <p className="text-xs text-gray-400 leading-relaxed">
              {t.crmInfo}
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-10">
        <button
          onClick={handleBack}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          {t.backBtn}
        </button>

        <button
          onClick={currentStep < TOTAL_STEPS ? handleNext : handleFinish}
          disabled={!canProceed()}
          className={cn(
            "flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.97]",
            canProceed()
              ? "text-white hover:opacity-90 shadow-md shadow-zinc-900/10"
              : "bg-gray-100 text-gray-300 cursor-not-allowed"
          )}
          style={canProceed() ? { backgroundColor: "#09090b" } : undefined}
        >
          {currentStep < TOTAL_STEPS ? t.nextBtn : t.finishBtn}
          {currentStep < TOTAL_STEPS ? (
            <ArrowRight className="w-3.5 h-3.5" />
          ) : (
            <Check className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}
