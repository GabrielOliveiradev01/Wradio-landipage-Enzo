"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Camera,
  Star,
  Download,
  Share2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  CalendarDays,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDarkMode } from "@/context/DarkModeContext";
import { ptBr } from "@/lib/i18n";

const t = ptBr.app.examsTable;

type ExamStatus = "Gerando Laudo" | "Finalizado" | "Não concluído";

interface Exam {
  id: number;
  name: string;
  status: ExamStatus;
  date: string;
}

const MOCK_EXAMS: Exam[] = [
  { id: 1, name: "...", status: "Gerando Laudo", date: "09/03/2026 16:23" },
  { id: 2, name: "...", status: "Gerando Laudo", date: "09/03/2026 16:22" },
  { id: 3, name: "...", status: "Gerando Laudo", date: "09/03/2026 16:22" },
  {
    id: 4,
    name: "Exame Não Informado...",
    status: "Finalizado",
    date: "09/03/2026 16:20",
  },
  { id: 5, name: "...", status: "Gerando Laudo", date: "09/03/2026 16:18" },
];

const FILTERS = t.filters;

type Filter = (typeof FILTERS)[number];

const MONTH_NAMES = t.monthNames;

const WEEKDAYS = t.weekdays;

function getStatusStyle(status: ExamStatus, darkMode: boolean): string {
  if (status === "Finalizado") return "text-green-500 font-medium";
  if (status === "Não concluído") return "text-yellow-500";
  return darkMode ? "text-zinc-500" : "text-gray-500";
}

function parseExamDate(dateStr: string): Date {
  const [datePart, timePart] = dateStr.split(" ");
  const [day, month, year] = datePart.split("/").map(Number);
  const [hours, minutes] = (timePart ?? "0:0").split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes);
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function endOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}

interface DateRange {
  start: Date | null;
  end: Date | null;
}

function CalendarGrid({
  month,
  year,
  range,
  hovered,
  onDayClick,
  onDayHover,
  darkMode,
}: {
  month: number;
  year: number;
  range: DateRange;
  hovered: Date | null;
  onDayClick: (d: Date) => void;
  onDayHover: (d: Date | null) => void;
  darkMode: boolean;
}) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const effectiveEnd = range.end ?? hovered;

  const isInRange = (d: Date) => {
    if (!range.start || !effectiveEnd) return false;
    const s = startOfDay(range.start);
    const e = startOfDay(effectiveEnd);
    const [lo, hi] = s <= e ? [s, e] : [e, s];
    const day = startOfDay(d);
    return day > lo && day < hi;
  };

  const isEdge = (d: Date, edge: "start" | "end") => {
    const target = edge === "start" ? range.start : (range.end ?? hovered);
    if (!target) return false;
    return startOfDay(d).getTime() === startOfDay(target).getTime();
  };

  return (
    <div>
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((w) => (
          <div
            key={w}
            className={cn(
              "text-center text-[10px] font-semibold py-1",
              darkMode ? "text-zinc-500" : "text-gray-400",
            )}
          >
            {w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} className="h-8" />;
          const d = new Date(year, month, day);
          const inRange = isInRange(d);
          const isStart = isEdge(d, "start");
          const isEnd = isEdge(d, "end");
          const isToday =
            startOfDay(d).getTime() === startOfDay(new Date()).getTime();

          return (
            <button
              key={day}
              onClick={() => onDayClick(d)}
              onMouseEnter={() => onDayHover(d)}
              onMouseLeave={() => onDayHover(null)}
              className={cn(
                "h-8 w-full text-sm transition-colors relative",
                inRange && (darkMode ? "bg-zinc-700 text-zinc-200" : "bg-gray-100 text-gray-700"),
                (isStart || isEnd) &&
                  "bg-orange-500 text-white font-semibold rounded-lg z-10",
                !inRange &&
                  !isStart &&
                  !isEnd &&
                  cn(
                    "rounded-lg",
                    darkMode
                      ? "hover:bg-zinc-700 text-zinc-300"
                      : "hover:bg-gray-100 text-gray-700",
                  ),
                isToday && !isStart && !isEnd && "font-bold text-orange-500",
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DateRangePicker({
  range,
  onChange,
  onClose,
  darkMode,
}: {
  range: DateRange;
  onChange: (r: DateRange) => void;
  onClose: () => void;
  darkMode: boolean;
}) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [hovered, setHovered] = useState<Date | null>(null);
  const [picking, setPicking] = useState<"start" | "end">("start");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const shiftMonth = (delta: number) => {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m > 11) { m = 0; y++; }
    if (m < 0) { m = 11; y--; }
    setViewMonth(m);
    setViewYear(y);
  };

  const handleDayClick = (d: Date) => {
    if (picking === "start") {
      onChange({ start: d, end: null });
      setPicking("end");
    } else {
      const s = range.start!;
      const [lo, hi] = s <= d ? [s, d] : [d, s];
      onChange({ start: lo, end: hi });
      setPicking("start");
    }
  };

  const formatDate = (d: Date | null) =>
    d
      ? `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`
      : "—";

  const handleClear = () => {
    onChange({ start: null, end: null });
    setPicking("start");
  };

  return (
    <div
      ref={ref}
      className={cn(
        "absolute right-0 top-full mt-2 z-50 border rounded-2xl shadow-xl p-4 w-72 select-none transition-colors",
        darkMode
          ? "bg-zinc-900 border-white/10"
          : "bg-white border-gray-200",
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={handleClear}
          className={cn(
            "text-xs transition-colors hover:text-red-500",
            darkMode ? "text-zinc-500" : "text-gray-400",
          )}
        >
          {t.calendarClear}
        </button>
        <span
          className={cn(
            "text-xs font-semibold",
            darkMode ? "text-zinc-300" : "text-gray-600",
          )}
        >
          {t.calendarSelectPeriod}
        </span>
        <button
          onClick={onClose}
          className={cn(
            "transition-colors",
            darkMode
              ? "text-zinc-500 hover:text-zinc-300"
              : "text-gray-400 hover:text-gray-700",
          )}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div
          className={cn(
            "flex-1 text-center text-xs py-1.5 rounded-lg border transition-colors",
            picking === "start"
              ? darkMode
                ? "border-white/30 bg-zinc-800 text-white font-semibold"
                : "border-gray-900 bg-gray-50 text-gray-900 font-semibold"
              : darkMode
                ? "border-zinc-700 text-zinc-400"
                : "border-gray-200 text-gray-600",
          )}
        >
          {formatDate(range.start)}
        </div>
        <ChevronRight
          className={cn(
            "w-3 h-3 flex-shrink-0",
            darkMode ? "text-zinc-600" : "text-gray-400",
          )}
        />
        <div
          className={cn(
            "flex-1 text-center text-xs py-1.5 rounded-lg border transition-colors",
            picking === "end"
              ? darkMode
                ? "border-white/30 bg-zinc-800 text-white font-semibold"
                : "border-gray-900 bg-gray-50 text-gray-900 font-semibold"
              : darkMode
                ? "border-zinc-700 text-zinc-400"
                : "border-gray-200 text-gray-600",
          )}
        >
          {formatDate(range.end)}
        </div>
      </div>

      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => shiftMonth(-1)}
          className={cn(
            "p-1 rounded-lg transition-colors",
            darkMode
              ? "hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200"
              : "hover:bg-gray-100 text-gray-500 hover:text-gray-900",
          )}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span
          className={cn(
            "text-sm font-semibold",
            darkMode ? "text-zinc-200" : "text-gray-700",
          )}
        >
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button
          onClick={() => shiftMonth(1)}
          className={cn(
            "p-1 rounded-lg transition-colors",
            darkMode
              ? "hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200"
              : "hover:bg-gray-100 text-gray-500 hover:text-gray-900",
          )}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <CalendarGrid
        month={viewMonth}
        year={viewYear}
        range={range}
        hovered={picking === "end" ? hovered : null}
        onDayClick={handleDayClick}
        onDayHover={setHovered}
        darkMode={darkMode}
      />

      {range.start && range.end && (
        <p
          className={cn(
            "text-center text-[10px] mt-3",
            darkMode ? "text-zinc-500" : "text-gray-400",
          )}
        >
          {formatDate(range.start)} → {formatDate(range.end)}
        </p>
      )}
    </div>
  );
}

function DateNavigator({
  date,
  onPrev,
  onNext,
  onCalendarClick,
  hasActiveRange,
  darkMode,
}: {
  date: Date;
  onPrev: () => void;
  onNext: () => void;
  onCalendarClick: () => void;
  hasActiveRange: boolean;
  darkMode: boolean;
}) {
  const formatted = `${date.getDate()} de ${MONTH_NAMES[date.getMonth()]}`;

  return (
    <div
      className={cn(
        "flex items-center justify-between px-6 py-3 border-b",
        darkMode ? "border-white/10" : "border-gray-100",
      )}
    >
      <button
        onClick={onPrev}
        className={cn(
          "p-1 transition-colors rounded-lg",
          darkMode
            ? "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800"
            : "text-gray-400 hover:text-gray-900 hover:bg-gray-50",
        )}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "font-bold text-base",
            darkMode ? "text-white" : "text-gray-900",
          )}
        >
          {formatted}
        </span>
        <button
          onClick={onCalendarClick}
          title={t.calendarSelectPeriod}
          className={cn(
            "p-1 rounded-lg transition-colors",
            hasActiveRange
              ? darkMode
                ? "text-white bg-zinc-700"
                : "text-gray-900 bg-gray-100"
              : darkMode
                ? "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800"
                : "text-gray-400 hover:text-gray-900 hover:bg-gray-50",
          )}
        >
          <CalendarDays className="w-4 h-4" />
        </button>
      </div>
      <button
        onClick={onNext}
        className={cn(
          "p-1 transition-colors rounded-lg",
          darkMode
            ? "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800"
            : "text-gray-400 hover:text-gray-900 hover:bg-gray-50",
        )}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

function FilterTabs({
  active,
  onChange,
  darkMode,
}: {
  active: Filter;
  onChange: (f: Filter) => void;
  darkMode: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-6 py-4 border-b overflow-x-auto scrollbar-none md:justify-center",
        darkMode ? "border-white/10" : "border-gray-100",
      )}
    >
      {FILTERS.map((filter) => (
        <button
          key={filter}
          onClick={() => onChange(filter)}
          className={cn(
            "px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex-shrink-0 active:scale-[0.97]",
            active === filter
              ? "text-white"
              : darkMode
                ? "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200",
          )}
          style={active === filter ? { backgroundColor: "#09090b" } : undefined}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}

function ExamRow({ exam, darkMode }: { exam: Exam; darkMode: boolean }) {
  const [starred, setStarred] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <tr
      className={cn(
        "border-b last:border-0 transition-colors",
        darkMode
          ? "border-zinc-800 hover:bg-zinc-800/50"
          : "border-gray-100 hover:bg-gray-50/60",
      )}
    >
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <Camera
            className={cn(
              "w-4 h-4 flex-shrink-0",
              darkMode ? "text-zinc-600" : "text-gray-400",
            )}
          />
          <span
            className={cn(
              "text-sm truncate max-w-[240px]",
              darkMode ? "text-zinc-300" : "text-gray-700",
            )}
          >
            {exam.name}
          </span>
        </div>
      </td>
      <td className="py-4 px-4">
        <span className={cn("text-sm", getStatusStyle(exam.status, darkMode))}>
          {exam.status}
        </span>
      </td>
      <td className="py-4 px-4">
        <span
          className={cn(
            "text-sm",
            darkMode ? "text-zinc-500" : "text-gray-500",
          )}
        >
          {exam.date}
        </span>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => setStarred(!starred)}
            title={t.titleFavorite}
            className={cn(
              "transition-colors",
              darkMode
                ? "text-zinc-600 hover:text-zinc-300"
                : "text-gray-400 hover:text-gray-700",
            )}
          >
            <Star
              className={cn(
                "w-4 h-4",
                starred && "fill-orange-400 text-orange-400",
              )}
            />
          </button>
          <button
            title={t.titleDownload}
            className={cn(
              "transition-colors",
              darkMode
                ? "text-zinc-600 hover:text-zinc-300"
                : "text-gray-400 hover:text-gray-700",
            )}
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            title={t.titleShare}
            className={cn(
              "transition-colors",
              darkMode
                ? "text-zinc-600 hover:text-zinc-300"
                : "text-gray-400 hover:text-gray-700",
            )}
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setSaved(!saved)}
            title={t.titleSave}
            className={cn(
              "transition-colors",
              darkMode
                ? "text-zinc-600 hover:text-zinc-300"
                : "text-gray-400 hover:text-gray-700",
            )}
          >
            <Bookmark
              className={cn(
                "w-4 h-4",
                saved && "fill-orange-400 text-orange-400",
              )}
            />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function ExamsTable() {
  const [activeFilter, setActiveFilter] = useState<Filter>("Hoje");
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    start: null,
    end: null,
  });
  const { darkMode } = useDarkMode();

  const shiftDate = (days: number) => {
    setCurrentDate((prev) => {
      const next = new Date(prev);
      next.setDate(next.getDate() + days);
      return next;
    });
  };

  const filteredExams = MOCK_EXAMS.filter((exam) => {
    if (!dateRange.start || !dateRange.end) return true;
    const examDate = parseExamDate(exam.date);
    return (
      examDate >= startOfDay(dateRange.start) &&
      examDate <= endOfDay(dateRange.end)
    );
  });

  const hasActiveRange = !!(dateRange.start && dateRange.end);

  return (
    <div
      className={cn(
        "border rounded-2xl overflow-hidden shadow-sm max-w-full transition-colors duration-300",
        darkMode ? "bg-zinc-900 border-white/10" : "bg-white border-gray-200",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between px-4 md:px-6 py-4 border-b",
          darkMode ? "border-white/10" : "border-gray-100",
        )}
      >
        <Link
          href="#"
          className={cn(
            "text-xs md:text-sm underline underline-offset-2 transition-colors",
            darkMode
              ? "text-zinc-400 hover:text-white"
              : "text-gray-600 hover:text-gray-900",
          )}
        >
          {t.viewAll}
        </Link>
        <div className="flex flex-col items-center gap-1">
          <SlidersHorizontal
            className={cn(
              "w-4 h-4",
              darkMode ? "text-zinc-400" : "text-gray-700",
            )}
          />
          <span
            className={cn(
              "text-[9px] md:text-[10px] font-semibold tracking-widest uppercase",
              darkMode ? "text-zinc-500" : "text-gray-500",
            )}
          >
            {t.todayLabel}
          </span>
        </div>
        <Link
          href="#"
          className={cn(
            "text-xs md:text-sm underline underline-offset-2 transition-colors",
            darkMode
              ? "text-zinc-400 hover:text-white"
              : "text-gray-600 hover:text-gray-900",
          )}
        >
          {t.savedTab}
        </Link>
      </div>

      <div className="relative">
        <DateNavigator
          date={currentDate}
          onPrev={() => shiftDate(-1)}
          onNext={() => shiftDate(1)}
          onCalendarClick={() => setShowPicker((v) => !v)}
          hasActiveRange={hasActiveRange}
          darkMode={darkMode}
        />
        {showPicker && (
          <div className="absolute left-1/2 -translate-x-1/2 top-full z-50">
            <DateRangePicker
              range={dateRange}
              onChange={setDateRange}
              onClose={() => setShowPicker(false)}
              darkMode={darkMode}
            />
          </div>
        )}
      </div>

      <FilterTabs active={activeFilter} onChange={setActiveFilter} darkMode={darkMode} />

      {hasActiveRange && (
        <div
          className={cn(
            "flex items-center justify-between px-6 py-2 border-b",
            darkMode ? "bg-zinc-800 border-white/10" : "bg-gray-50 border-gray-100",
          )}
        >
          <span
            className={cn(
              "text-xs font-medium",
              darkMode ? "text-zinc-300" : "text-gray-700",
            )}
          >
            {t.periodLabel}{" "}
            {`${String(dateRange.start!.getDate()).padStart(2, "0")}/${String(dateRange.start!.getMonth() + 1).padStart(2, "0")}/${dateRange.start!.getFullYear()}`}
            {" → "}
            {`${String(dateRange.end!.getDate()).padStart(2, "0")}/${String(dateRange.end!.getMonth() + 1).padStart(2, "0")}/${dateRange.end!.getFullYear()}`}
          </span>
          <button
            onClick={() => setDateRange({ start: null, end: null })}
            className={cn(
              "text-[10px] font-medium transition-colors hover:text-red-500",
              darkMode ? "text-zinc-500" : "text-gray-500",
            )}
          >
            {t.clearFilter}
          </button>
        </div>
      )}

      <div className="overflow-x-auto -mx-0">
        <div className="min-w-[600px] w-full">
          <table className="w-full">
            <thead>
              <tr
                className={cn(
                  "border-b",
                  darkMode ? "border-white/10" : "border-gray-100",
                )}
              >
                <th
                  className={cn(
                    "text-left py-3 px-4 text-[10px] md:text-xs font-medium tracking-wide",
                    darkMode ? "text-zinc-500" : "text-gray-400",
                  )}
                >
                  {t.colExams}
                </th>
                <th
                  className={cn(
                    "text-left py-3 px-4 text-[10px] md:text-xs font-medium tracking-wide",
                    darkMode ? "text-zinc-500" : "text-gray-400",
                  )}
                >
                  {t.colStatus}
                </th>
                <th
                  className={cn(
                    "text-left py-3 px-4 text-[10px] md:text-xs font-medium tracking-wide",
                    darkMode ? "text-zinc-500" : "text-gray-400",
                  )}
                >
                  {t.colDate}
                </th>
                <th
                  className={cn(
                    "text-right py-3 px-4 text-[10px] md:text-xs font-medium tracking-wide",
                    darkMode ? "text-zinc-500" : "text-gray-400",
                  )}
                >
                  {t.colActions}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredExams.length > 0 ? (
                filteredExams.map((exam) => (
                  <ExamRow key={exam.id} exam={exam} darkMode={darkMode} />
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className={cn(
                      "py-10 text-center text-sm",
                      darkMode ? "text-zinc-600" : "text-gray-400",
                    )}
                  >
                    {t.emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div
        className={cn(
          "md:hidden px-4 py-2 text-[10px] text-center border-t",
          darkMode
            ? "bg-zinc-800/50 text-zinc-600 border-white/10"
            : "bg-gray-100/50 text-gray-400 border-gray-100",
        )}
      >
        {t.scrollHint}
      </div>
    </div>
  );
}
