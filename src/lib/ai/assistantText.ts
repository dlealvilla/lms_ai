/**
 * Normalise assistant text and (when inserting into the essay) turn
 * markdown into clean readable prose. Display uses a markdown renderer;
 * this module is deliberately dependency-free so tests can run in tsx.
 */

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  ndash: '–',
  mdash: '—',
  hellip: '…',
  rsquo: '’',
  lsquo: '‘',
  rdquo: '”',
  ldquo: '“',
};

/** Decode a single layer of HTML entities without touching the DOM. */
export function decodeHtmlEntities(input: string): string {
  return input.replace(/&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z][a-zA-Z0-9]+);/g, (match, body: string) => {
    if (body[0] === '#') {
      const codePoint =
        body[1] === 'x' || body[1] === 'X' ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10);
      if (!Number.isFinite(codePoint) || codePoint < 0 || codePoint > 0x10ffff) return match;
      try {
        return String.fromCodePoint(codePoint);
      } catch {
        return match;
      }
    }
    return NAMED_ENTITIES[body.toLowerCase()] ?? match;
  });
}

function looksDoubleEscapedNewlines(text: string): boolean {
  const literal = (text.match(/\\n/g) || []).length;
  const real = (text.match(/\n/g) || []).length;
  return literal >= 2 && literal > real;
}

function unwrapSingleFence(text: string): string {
  const trimmed = text.trim();
  const match = trimmed.match(/^```(?:[\w-]+)?\r?\n([\s\S]*?)\r?\n```$/);
  return match ? match[1] : text;
}

function stripSseArtefacts(text: string): string {
  const lines = text.split(/\r?\n/);
  const dataLines = lines.filter((line) => /^data:\s?/.test(line));
  // Only treat it as an SSE dump when most lines are data: prefixes.
  if (dataLines.length >= 2 && dataLines.length >= lines.filter((l) => l.trim()).length * 0.7) {
    const parts: string[] = [];
    for (const line of dataLines) {
      const payload = line.replace(/^data:\s?/, '').trim();
      if (!payload || payload === '[DONE]') continue;
      if (payload.startsWith('{')) {
        try {
          const obj = JSON.parse(payload) as Record<string, unknown>;
          const chunk =
            (typeof obj.text === 'string' && obj.text) ||
            (typeof obj.response === 'string' && obj.response) ||
            (typeof obj.content === 'string' && obj.content) ||
            '';
          if (chunk) {
            parts.push(chunk);
            continue;
          }
        } catch {
          // keep the raw payload
        }
      }
      parts.push(payload);
    }
    if (parts.length) return parts.join('');
  }
  return text;
}

/**
 * Clean encoding / streaming artefacts from an assistant payload
 * so it can be shown as readable markdown or plain text.
 */
export function normalizeAssistantText(input: string): string {
  if (!input) return '';
  let text = input.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\u0000/g, '');
  text = decodeHtmlEntities(text);
  text = stripSseArtefacts(text);
  if (looksDoubleEscapedNewlines(text)) {
    text = text.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
  }
  text = unwrapSingleFence(text);
  // Collapse runs of more than two blank lines.
  text = text.replace(/\n{3,}/g, '\n\n');
  return text.trim();
}

/**
 * Turn markdown into clean prose for insertion into the essay.
 * Keeps text and newlines; drops markers, tags, and link URLs.
 */
export function markdownToPlainText(input: string): string {
  let text = normalizeAssistantText(input);

  // Fenced code: keep the inner text, drop the fences.
  text = text.replace(/```[\w-]*\n?([\s\S]*?)```/g, (_m, inner: string) => inner.replace(/\s+$/, ''));

  // Images and links: keep the label.
  text = text.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1');
  text = text.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');

  // Strip HTML tags after entities have been decoded (text only).
  text = text.replace(/<\/?[^>]+>/g, '');

  // Headings, blockquotes, list markers, thematic breaks.
  text = text.replace(/^\s{0,3}#{1,6}\s+/gm, '');
  text = text.replace(/^\s{0,3}>\s?/gm, '');
  text = text.replace(/^\s{0,3}(?:[-*+]|\d+[.)])\s+/gm, '');
  text = text.replace(/^\s{0,3}(-{3,}|\*{3,}|_{3,})\s*$/gm, '');

  // Bold / italic / strikethrough / inline code. Apply from most wrapping to least.
  text = text.replace(/(\*\*|__)(.*?)\1/g, '$2');
  text = text.replace(/(\*|_)([^*_\n]+)\1/g, '$2');
  text = text.replace(/~~(.*?)~~/g, '$1');
  text = text.replace(/`([^`]+)`/g, '$1');

  text = text.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n');
  return text.trim();
}
