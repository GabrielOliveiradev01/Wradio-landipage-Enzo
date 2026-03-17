"use client";

import { useState, useEffect, useRef } from "react";
import { Upload, Mic, MicOff, Zap, ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAudioRecorder } from "@/components/dashboard/chat/hooks/useAudioRecorder";
import { uploadExamImages, transcribeAudio } from "@/lib/services/uploadService";
import { useDarkMode } from "@/context/DarkModeContext";
import { ptBr } from "@/lib/i18n";

const t = ptBr.app.reportExpress.session;

const EXAM_TYPES = t.examTypes;

function LightningBolt() {
  return (
    <div className="relative w-14 h-14">
      <div className="absolute inset-0 rounded-2xl bg-orange-500/20 blur-md" />
      <div className="relative w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center ring-4 ring-orange-500/10">
        <svg
          viewBox="0 0 24 24"
          className="w-7 h-7"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13 2L4.5 13.5H12L11 22L19.5 10.5H12L13 2Z"
            fill="white"
            stroke="white"
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}

export default function ReportExpressSessionPage() {
  const [withoutImage, setWithoutImage] = useState(true);
  const [examType, setExamType] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { darkMode } = useDarkMode();

  const { isRecording, recordingTime, start: startRecording, stop: stopRecording } =
    useAudioRecorder(async (blob, durationText) => {
      void transcribeAudio;
      setDescription((prev) => (prev ? `${prev} ${durationText}` : durationText));
    });

  const handleSubmit = async () => {
    if (!examType) return;
    void uploadExamImages;
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleImageFiles = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).filter((f) =>
      f.type.startsWith("image/"),
    );
    const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
    setImages((prev) => [...prev, ...newFiles]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const timerDisplay = `${minutes} : ${String(secs).padStart(2, "0")}`;

  const labelClass = cn(
    "text-sm font-medium mb-1.5",
    darkMode ? "text-zinc-300" : "text-gray-700",
  );

  return (
    <div className="p-4 md:p-6 flex flex-col items-center w-full">
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4 mb-10 w-full max-w-4xl">
        <div className="flex items-center gap-4">
          <LightningBolt />
          <div>
            <h1
              className={cn(
                "text-2xl md:text-3xl font-bold",
                darkMode ? "text-white" : "text-gray-900",
              )}
            >
              Laudo Express
            </h1>
            <p
              className={cn(
                "text-xl font-semibold tabular-nums mt-1",
                darkMode ? "text-zinc-500" : "text-gray-400",
              )}
            >
              {timerDisplay}
            </p>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "w-full max-w-4xl border rounded-2xl p-5 shadow-sm flex flex-col gap-5 transition-colors duration-300",
          darkMode
            ? "bg-zinc-900 border-white/10"
            : "bg-gray-50 border-gray-200",
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Upload
              className={cn(
                "w-5 h-5 mt-0.5 flex-shrink-0",
                darkMode ? "text-zinc-500" : "text-gray-500",
              )}
            />
            <div>
              <p
                className={cn(
                  "font-semibold",
                  darkMode ? "text-white" : "text-gray-900",
                )}
              >
                {t.newReportTitle}
              </p>
              <p
                className={cn(
                  "text-sm mt-0.5",
                  darkMode ? "text-zinc-400" : "text-gray-400",
                )}
              >
                {t.newReportSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span
              className={cn(
                "text-sm whitespace-nowrap",
                darkMode ? "text-zinc-400" : "text-gray-600",
              )}
            >
              {withoutImage ? t.withoutImage : t.withImage}
            </span>
            <button
              role="switch"
              aria-checked={withoutImage}
              onClick={() => setWithoutImage((v) => !v)}
              className={cn(
                "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-300 focus:outline-none",
                withoutImage ? "bg-orange-500" : darkMode ? "bg-zinc-700" : "bg-gray-200",
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-5 w-5 mt-0.5 rounded-full bg-white shadow-md transition-transform duration-300",
                  withoutImage ? "translate-x-[22px]" : "translate-x-0.5",
                )}
              />
            </button>
          </div>
        </div>

        <div className="w-full">
          <p className={labelClass}>{t.examTypeLabel}</p>
          <select
            value={examType ?? ""}
            onChange={(e) => setExamType(e.target.value)}
            className={cn(
              "w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 appearance-none cursor-pointer transition-colors",
              darkMode
                ? "border-white/10 bg-zinc-800 text-white"
                : "border-gray-200 bg-white text-gray-800",
            )}
            style={{
              backgroundImage:
                darkMode
                  ? "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")"
                  : "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 12px center",
            }}
          >
            <option value="" disabled>
              {t.examTypePlaceholder}
            </option>
            {EXAM_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {examType && (
          <>
            <div>
              <p className={labelClass}>{t.descriptionLabel}</p>
              <div className="relative">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  placeholder={t.descriptionPlaceholder}
                  className={cn(
                    "w-full rounded-xl border px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors",
                    darkMode
                      ? "border-white/10 bg-zinc-800 text-white placeholder:text-zinc-600"
                      : "border-gray-200 bg-white text-gray-800 placeholder:text-gray-300",
                  )}
                />
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={cn(
                    "absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-colors",
                    isRecording
                      ? "bg-red-500 hover:bg-red-600 animate-pulse"
                      : "bg-orange-500 hover:bg-orange-600",
                  )}
                  aria-label={isRecording ? t.stopRecordingLabel : t.recordAudioLabel}
                  title={isRecording ? `Gravando… ${recordingTime}s` : t.recordAudioLabel}
                >
                  {isRecording ? (
                    <MicOff className="w-5 h-5 text-white" />
                  ) : (
                    <Mic className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>
            </div>

            {!withoutImage && (
              <div>
                <p className={labelClass}>{t.imagesLabel}</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleImageFiles(e.target.files)}
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    handleImageFiles(e.dataTransfer.files);
                  }}
                  className={cn(
                    "w-full rounded-xl border-2 border-dashed px-4 py-8 flex flex-col items-center gap-2 cursor-pointer transition-colors",
                    dragOver
                      ? "border-orange-400 bg-orange-50/20"
                      : darkMode
                        ? "border-zinc-700 bg-zinc-800 hover:border-orange-400 hover:bg-orange-500/10"
                        : "border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50/40",
                  )}
                >
                  <ImagePlus
                    className={cn(
                      "w-7 h-7",
                      darkMode ? "text-zinc-600" : "text-gray-300",
                    )}
                  />
                  <p
                    className={cn(
                      "text-sm text-center",
                      darkMode ? "text-zinc-500" : "text-gray-400",
                    )}
                  >
                    {t.imageDropHint}
                  </p>
                  <p
                    className={cn(
                      "text-xs",
                      darkMode ? "text-zinc-600" : "text-gray-300",
                    )}
                  >
                    {t.imageFormats}
                  </p>
                </div>

                {imagePreviews.length > 0 && (
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {imagePreviews.map((src, i) => (
                      <div
                        key={i}
                        className={cn(
                          "relative group rounded-xl overflow-hidden aspect-square border",
                          darkMode
                            ? "bg-zinc-800 border-zinc-700"
                            : "bg-gray-100 border-gray-200",
                        )}
                      >
                        <img
                          src={src}
                          alt={`Imagem ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(i);
                          }}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label={t.removeImageLabel}
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                className="py-3 px-6 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-semibold text-sm rounded-xl inline-flex items-center gap-2 transition-all duration-150 shadow-sm"
              >
                <Zap className="w-4 h-4 fill-white" />
                {t.submitBtn}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
