import { Fragment, type ReactNode } from "react";

function renderItalicSegments(text: string, keyOffset: string): ReactNode[] {
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((part, j) => {
    if (
      part.length >= 2 &&
      part.startsWith("*") &&
      part.endsWith("*") &&
      !part.startsWith("**")
    ) {
      return (
        <em key={`${keyOffset}-${j}`} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }
    return <Fragment key={`${keyOffset}-${j}`}>{part}</Fragment>;
  });
}

/** Fragment bez linków — **pogrubienie**, *kursywa*. */
function renderBoldItalicOnly(text: string, keyPrefix: string): ReactNode {
  const segments = text.split(/(\*\*[^*]+\*\*)/g);
  return segments.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      const inner = part.slice(2, -2);
      return (
        <strong
          key={`${keyPrefix}-b${i}`}
          className="font-bold"
        >
          {renderItalicSegments(inner, `${keyPrefix}-b${i}`)}
        </strong>
      );
    }
    return (
      <Fragment key={`${keyPrefix}-f${i}`}>
        {renderItalicSegments(part, `${keyPrefix}-f${i}`)}
      </Fragment>
    );
  });
}

function isSafeHref(href: string): boolean {
  const h = href.trim();
  if (!h) return false;
  if (h.startsWith("/") && !h.startsWith("//")) return true;
  if (h.startsWith("mailto:") && !h.includes("javascript:")) return true;
  if (h.startsWith("https://") || h.startsWith("http://")) return true;
  return false;
}

/** Tekst z linkami Markdown [etykieta](url) oraz pogrubieniem / kursywą. */
export function renderSiteMarkdownWithLinks(text: string, keyPrefix = "m"): ReactNode {
  if (!text) return null;
  const bits = text.split(/(\[[^\]]*\]\([^)]*\))/g);
  return bits.map((bit, i) => {
    const lm = bit.match(/^\[([^\]]*)\]\(([^)]*)\)$/);
    if (lm) {
      const href = lm[2].trim();
      if (!isSafeHref(href)) {
        return <Fragment key={`${keyPrefix}-bad${i}`}>{bit}</Fragment>;
      }
      const external = href.startsWith("http://") || href.startsWith("https://");
      return (
        <a
          key={`${keyPrefix}-a${i}`}
          href={href}
          className="underline font-semibold text-[var(--brown-color)] hover:opacity-80"
          {...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {renderBoldItalicOnly(lm[1], `${keyPrefix}-al${i}`)}
        </a>
      );
    }
    return (
      <Fragment key={`${keyPrefix}-t${i}`}>
        {renderBoldItalicOnly(bit, `${keyPrefix}-t${i}`)}
      </Fragment>
    );
  });
}

export function renderSiteMarkdown(text: string): ReactNode {
  return renderSiteMarkdownWithLinks(text, "r");
}

/** Akapit lub lista wypunktowana (każda niepusta linia zaczyna się od "- "). */
export function renderSiteMarkdownParagraph(text: string): ReactNode {
  const trimmed = text.trim();
  if (!trimmed) return null;
  const lines = trimmed.split(/\n/).map((l) => l.trimEnd());
  const nonEmpty = lines.filter((l) => l.trim().length > 0);
  if (
    nonEmpty.length >= 2 &&
    nonEmpty.every((l) => /^\s*-\s+/.test(l.trim()))
  ) {
    return (
      <ul className="list-disc list-inside space-y-1 my-2 text-left">
        {nonEmpty.map((line, i) => (
          <li key={i}>
            {renderSiteMarkdownWithLinks(
              line.replace(/^\s*-\s+/, "").trim(),
              `li-${i}`
            )}
          </li>
        ))}
      </ul>
    );
  }
  return (
    <p className="whitespace-pre-line text-base sm:text-lg leading-relaxed text-gray-700">
      {renderSiteMarkdownWithLinks(trimmed, "p")}
    </p>
  );
}
