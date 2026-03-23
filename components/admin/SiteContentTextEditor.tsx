"use client";

import { useRef, useCallback, useState, type CSSProperties } from "react";
import { Bold, Italic, Link2, List, Eye, EyeOff } from "lucide-react";
import { renderSiteMarkdown } from "@/lib/renderSiteMarkdown";

type PreviewVariant = "default" | "hero";

type Props = {
  value: string;
  onChange: (next: string) => void;
  rows?: number;
  placeholder?: string;
  className?: string;
  style?: CSSProperties;
  /** Włącz panel podglądu (Markdown → jak na stronie) */
  preview?: boolean;
  /** Start z otwartym podglądem (np. hero) */
  defaultPreviewOpen?: boolean;
  /** Większa typografia w podglądzie — jak nagłówek hero */
  previewVariant?: PreviewVariant;
};

export function SiteContentTextEditor({
  value,
  onChange,
  rows = 6,
  placeholder,
  className = "",
  style,
  preview = false,
  defaultPreviewOpen = false,
  previewVariant = "default",
}: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [showPreview, setShowPreview] = useState(
    preview ? defaultPreviewOpen : false
  );

  const focusSelect = useCallback((start: number, end: number) => {
    requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(start, end);
    });
  }, []);

  const wrapBold = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const sel = value.slice(start, end);
    if (sel.length === 0) {
      const ins = "****";
      const next = `${value.slice(0, start)}${ins}${value.slice(end)}`;
      onChange(next);
      focusSelect(start + 2, start + 2);
      return;
    }
    const next = `${value.slice(0, start)}**${sel}**${value.slice(end)}`;
    onChange(next);
    focusSelect(start + 2, start + 2 + sel.length);
  }, [value, onChange, focusSelect]);

  const wrapItalic = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const sel = value.slice(start, end);
    if (sel.length === 0) {
      const ph = "kursywa";
      const ins = `*${ph}*`;
      const next = `${value.slice(0, start)}${ins}${value.slice(end)}`;
      onChange(next);
      focusSelect(start + 1, start + 1 + ph.length);
      return;
    }
    const next = `${value.slice(0, start)}*${sel}*${value.slice(end)}`;
    onChange(next);
    focusSelect(start + 1, start + 1 + sel.length);
  }, [value, onChange, focusSelect]);

  const insertLink = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const hadSel = end > start;
    const sel = hadSel ? value.slice(start, end) : "tekst";
    const url =
      typeof window !== "undefined"
        ? window.prompt("Adres URL (https://… lub /ścieżka)", "https://")
        : null;
    if (url === null) return;
    const u = url.trim() || "https://";
    const ins = `[${sel}](${u})`;
    const next = `${value.slice(0, start)}${ins}${value.slice(end)}`;
    onChange(next);
    if (!hadSel) {
      focusSelect(start + 1, start + 1 + sel.length);
    } else {
      focusSelect(start + ins.length, start + ins.length);
    }
  }, [value, onChange, focusSelect]);

  const toggleListLines = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    let start = el.selectionStart;
    let end = el.selectionEnd;
    if (start > end) [start, end] = [end, start];

    const lineStart = (pos: number) => {
      const i = value.lastIndexOf("\n", Math.max(0, pos - 1));
      return i === -1 ? 0 : i + 1;
    };
    const lineEnd = (pos: number) => {
      const i = value.indexOf("\n", pos);
      return i === -1 ? value.length : i;
    };

    const rangeStart = lineStart(start);
    const rangeEnd =
      start === end ? lineEnd(start) : lineEnd(Math.max(end - 1, start));

    const block = value.slice(rangeStart, rangeEnd);
    const lines = block.split("\n");
    const significant = lines.filter((l) => l.trim().length > 0);
    const allBulleted =
      significant.length > 0 &&
      significant.every((l) => /^\s*-\s/.test(l));

    const nextLines = lines.map((ln) => {
      if (ln.trim() === "") return ln;
      if (allBulleted) return ln.replace(/^\s*-\s+/, "");
      return /^\s*-\s/.test(ln) ? ln : `- ${ln}`;
    });
    const nextBlock = nextLines.join("\n");
    const next = value.slice(0, rangeStart) + nextBlock + value.slice(rangeEnd);
    onChange(next);
    focusSelect(rangeStart, rangeStart + nextBlock.length);
  }, [value, onChange, focusSelect]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      const k = e.key.toLowerCase();
      if (k === "b") {
        e.preventDefault();
        wrapBold();
      } else if (k === "i") {
        e.preventDefault();
        wrapItalic();
      } else if (k === "k") {
        e.preventDefault();
        insertLink();
      }
    },
    [wrapBold, wrapItalic, insertLink]
  );

  const btn =
    "inline-flex items-center justify-center p-2 rounded border border-gray-300 bg-white text-gray-800 hover:bg-gray-100 hover:border-black transition-colors disabled:opacity-40";

  const previewBoxClass =
    previewVariant === "hero"
      ? "text-xl sm:text-3xl text-center font-normal whitespace-pre-line text-gray-900 leading-tight"
      : "text-base text-gray-800 whitespace-pre-line leading-relaxed";

  return (
    <div className="rounded-lg border-2 border-gray-200 overflow-hidden focus-within:border-black transition-colors">
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-200">
        <button
          type="button"
          className={btn}
          title="Pogrubienie (**tekst**) — Ctrl+B"
          onMouseDown={(e) => e.preventDefault()}
          onClick={wrapBold}
        >
          <Bold className="w-4 h-4" strokeWidth={2.5} />
        </button>
        <button
          type="button"
          className={btn}
          title="Kursywa (*tekst*) — Ctrl+I"
          onMouseDown={(e) => e.preventDefault()}
          onClick={wrapItalic}
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          className={btn}
          title="Link [tekst](url) — Ctrl+K"
          onMouseDown={(e) => e.preventDefault()}
          onClick={insertLink}
        >
          <Link2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          className={btn}
          title="Lista wypunktowana (linie z „- ”)"
          onMouseDown={(e) => e.preventDefault()}
          onClick={toggleListLines}
        >
          <List className="w-4 h-4" />
        </button>
        {preview && (
          <button
            type="button"
            className={`${btn} ml-auto gap-1.5 px-3 min-h-[2.25rem]`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setShowPreview((v) => !v)}
          >
            {showPreview ? (
              <EyeOff className="w-4 h-4 shrink-0" />
            ) : (
              <Eye className="w-4 h-4 shrink-0" />
            )}
            <span className="text-sm font-medium">
              {showPreview ? "Ukryj podgląd" : "Podgląd"}
            </span>
          </button>
        )}
      </div>
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        rows={rows}
        placeholder={placeholder}
        style={style}
        className={`w-full px-3 py-2 border-0 rounded-none bg-white text-black focus:ring-0 focus:outline-none resize-y min-h-[3rem] ${className}`}
      />
      {preview && showPreview && (
        <div className="border-t-2 border-gray-200 bg-stone-50 px-3 py-3 sm:px-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
            Podgląd na stronie
          </p>
          <div className="rounded-lg border border-gray-200 bg-white px-4 py-4 shadow-inner">
            <div className={previewBoxClass} style={style}>
              {renderSiteMarkdown(value || "")}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
