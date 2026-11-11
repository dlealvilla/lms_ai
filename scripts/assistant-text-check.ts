/**
 * Unit checks for assistant text normalisation and markdown-to-prose.
 * Run with: npx tsx scripts/assistant-text-check.ts
 */
import assert from 'node:assert/strict';
import { decodeHtmlEntities, markdownToPlainText, normalizeAssistantText } from '../src/lib/ai/assistantText.ts';

let passed = 0;
let failed = 0;

async function check(name: string, fn: () => unknown | Promise<unknown>) {
  try {
    await fn();
    passed += 1;
    console.log(`  ok  ${name}`);
  } catch (err) {
    failed += 1;
    console.error(`  FAIL  ${name}`);
    console.error(err);
  }
}

await check('leaves clean prose unchanged', () => {
  assert.equal(normalizeAssistantText('A clear sentence.'), 'A clear sentence.');
  assert.equal(markdownToPlainText('A clear sentence.'), 'A clear sentence.');
});

await check('decodes HTML entities once, including numeric', () => {
  assert.equal(decodeHtmlEntities('Tom &amp; Jane &lt;3 &#39;quotes&#39; &#x2014; yes'), "Tom & Jane <3 'quotes' — yes");
  assert.equal(normalizeAssistantText('Use A &amp; B'), 'Use A & B');
});

await check('does not decode a second amp layer (no infinite loop)', () => {
  assert.equal(decodeHtmlEntities('&amp;amp;'), '&amp;');
});

await check('unwraps a single wrapping code fence', () => {
  const raw = '```markdown\n**Hello** world\n```';
  assert.equal(normalizeAssistantText(raw), '**Hello** world');
});

await check('unescapes literal \\\\n when the payload has almost no real newlines', () => {
  const raw = 'First line.\\n\\nSecond line.';
  assert.equal(normalizeAssistantText(raw), 'First line.\n\nSecond line.');
});

await check('does not unescape isolated \\\\n in otherwise normal text', () => {
  const raw = 'In code, write \\n for a newline.';
  assert.equal(normalizeAssistantText(raw), raw);
});

await check('strips SSE data: artefacts into one message', () => {
  const raw = 'data: {"text":"Hello "}\ndata: {"text":"world"}\ndata: [DONE]';
  assert.equal(normalizeAssistantText(raw), 'Hello world');
});

await check('markdownToPlainText drops markers, keeps words', () => {
  const raw = [
    '# Opening',
    '',
    '**The Industrial Revolution** transformed daily life. Consider:',
    '',
    '- Factory work replaced home crafts',
    '- Cities grew `faster` than housing',
    '',
    '> Steam power made goods cheaper.',
    '',
    'See [the notes](https://example.com) for more.',
  ].join('\n');
  const plain = markdownToPlainText(raw);
  assert.equal(plain.includes('#'), false, plain);
  assert.equal(plain.includes('**'), false, plain);
  assert.equal(plain.includes('`'), false, plain);
  assert.equal(plain.includes(']('), false, plain);
  assert.match(plain, /The Industrial Revolution transformed daily life/);
  assert.match(plain, /Factory work replaced home crafts/);
  assert.match(plain, /Cities grew faster than housing/);
  assert.match(plain, /Steam power made goods cheaper/);
  assert.match(plain, /See the notes for more/);
  assert.doesNotMatch(plain, /example\.com/);
});

await check('strips raw HTML tags so they cannot render', () => {
  const plain = markdownToPlainText('Hello <script>alert(1)</script> world');
  assert.equal(plain.includes('<script>'), false);
  assert.match(plain, /Hello\s+alert\(1\)\s+world/);
});

await check('trims BOM and collapses extra blank lines', () => {
  assert.equal(normalizeAssistantText('\uFEFFHello\n\n\n\nthere'), 'Hello\n\nthere');
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
