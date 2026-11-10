/**
 * Security regression check for session signing, /api/chat auth and rate limits.
 *
 *   npm run test:security
 *
 * Parts 1–2 are pure (no database, no network: Gemini is stubbed).
 * Part 3 exercises the real mock-login handler and needs a THROWAWAY local
 * Postgres (seeded with `npm run db:seed`). It refuses to run against any
 * non-local DATABASE_URL so it can never write to production.
 */
/* eslint-disable @typescript-eslint/no-explicit-any -- test fakes for Vercel req/res */
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';

process.env.TOKEN_SECRET = process.env.TEST_TOKEN_SECRET || 'test-secret-for-security-check-only';
delete process.env.VERCEL_ENV;

const { createSessionToken, verifySessionToken, resolveTokenSecret, TOKEN_TTL_MS } = await import(
  '../api/lib/auth.js'
);
const { consume, resetRateLimits } = await import('../api/lib/rate-limit.js');

let passed = 0;
let failed = 0;
async function check(name: string, fn: () => unknown | Promise<unknown>) {
  try {
    await fn();
    passed++;
    console.log(`PASS  ${name}`);
  } catch (err: any) {
    failed++;
    console.log(`FAIL  ${name}\n      ${err?.message || err}`);
  }
}

// ---------- tiny Vercel req/res fakes ----------
function makeReq(opts: { method?: string; token?: string | null; body?: unknown; ip?: string; query?: any }) {
  const headers: Record<string, string> = { 'x-forwarded-for': opts.ip || '203.0.113.10' };
  if (opts.token) headers.authorization = `Bearer ${opts.token}`;
  return { method: opts.method || 'POST', headers, body: opts.body ?? {}, query: opts.query || {}, cookies: {} } as any;
}
function makeRes() {
  const res: any = {
    statusCode: 200,
    headers: {} as Record<string, string>,
    body: undefined as any,
    status(c: number) { this.statusCode = c; return this; },
    setHeader(k: string, v: string) { this.headers[k.toLowerCase()] = v; return this; },
    json(b: unknown) { this.body = b; return this; },
    send(b: unknown) { this.body = b; return this; },
    end() { return this; },
  };
  return res;
}

const base = { userId: 'u_alice', tenantId: 't_demo', role: 'STUDENT' as const, email: 'alice@wildmind.edu', name: 'Alice' };
const b64url = (o: unknown) => Buffer.from(JSON.stringify(o)).toString('base64url');

console.log('\n== 1. Token signing ==');
await check('valid signed token verifies', () => {
  const t = createSessionToken(base);
  assert.match(t, /^v1\.[\w-]+\.[\w-]+$/);
  const p = verifySessionToken(t);
  assert.ok(p);
  assert.equal(p!.userId, 'u_alice');
  assert.equal(p!.role, 'STUDENT');
});
await check('tampered payload (role -> ADMIN) is rejected', () => {
  const [v, body, sig] = createSessionToken(base).split('.');
  const p = JSON.parse(Buffer.from(body, 'base64url').toString());
  p.role = 'ADMIN';
  assert.equal(verifySessionToken(`${v}.${b64url(p)}.${sig}`), null);
});
await check('tampered signature is rejected', () => {
  const t = createSessionToken(base);
  const flipped = t.slice(0, -2) + (t.endsWith('AA') ? 'BB' : 'AA');
  assert.equal(verifySessionToken(flipped), null);
});
await check('legacy unsigned base64 token is rejected', () => {
  const legacy = Buffer.from(JSON.stringify({ ...base, role: 'ADMIN', exp: Date.now() + 1e9 })).toString('base64');
  assert.equal(verifySessionToken(legacy), null);
});
await check('token signed with a different secret is rejected', () => {
  const body = b64url({ ...base, exp: Date.now() + 1000 });
  const sig = createHmac('sha256', 'attacker-guess').update(`v1.${body}`).digest('base64url');
  assert.equal(verifySessionToken(`v1.${body}.${sig}`), null);
});
await check('unsigned / empty-signature forms are rejected', () => {
  const body = b64url({ ...base, exp: Date.now() + 1000 });
  assert.equal(verifySessionToken(`v1.${body}.`), null);
  assert.equal(verifySessionToken(`v1.${body}`), null);
  assert.equal(verifySessionToken(`none.${body}.x`), null);
  assert.equal(verifySessionToken(''), null);
  assert.equal(verifySessionToken('garbage'), null);
  assert.equal(verifySessionToken('a'.repeat(10_000)), null);
});
await check('expired token is rejected', () => {
  const t = createSessionToken(base, Date.now() - TOKEN_TTL_MS - 1000);
  assert.equal(verifySessionToken(t), null);
});
await check('correctly signed token with implausible far-future expiry is rejected', () => {
  const body = b64url({ ...base, exp: Date.now() + 365 * 24 * 3600 * 1000 });
  const sig = createHmac('sha256', process.env.TOKEN_SECRET!).update(`v1.${body}`).digest('base64url');
  assert.equal(verifySessionToken(`v1.${body}.${sig}`), null);
});
await check('correctly signed token with unknown role is rejected', () => {
  const body = b64url({ ...base, role: 'ROOT', exp: Date.now() + 1000 });
  const sig = createHmac('sha256', process.env.TOKEN_SECRET!).update(`v1.${body}`).digest('base64url');
  assert.equal(verifySessionToken(`v1.${body}.${sig}`), null);
});
await check('deployed environment without TOKEN_SECRET fails closed', () => {
  const saved = process.env.TOKEN_SECRET;
  delete process.env.TOKEN_SECRET;
  process.env.VERCEL_ENV = 'production';
  try {
    assert.throws(() => resolveTokenSecret(), /TOKEN_SECRET must be set/);
  } finally {
    process.env.TOKEN_SECRET = saved;
    delete process.env.VERCEL_ENV;
  }
});
await check('rate limiter allows up to the limit then blocks', () => {
  resetRateLimits();
  const rule = { name: 'unit', limit: 3, windowMs: 60_000 };
  const now = 1_000_000;
  assert.equal(consume(rule, 'k', now).allowed, true);
  assert.equal(consume(rule, 'k', now).allowed, true);
  assert.equal(consume(rule, 'k', now).allowed, true);
  const r = consume(rule, 'k', now);
  assert.equal(r.allowed, false);
  assert.ok(r.retryAfterSec > 0);
  assert.equal(consume(rule, 'other', now).allowed, true, 'separate keys are independent');
  assert.equal(consume(rule, 'k', now + 60_001).allowed, true, 'window resets');
});

console.log('\n== 2. /api/chat (Gemini stubbed, no network) ==');
process.env.GEMINI_API_KEY = 'stub-key-not-real';
const realFetch = globalThis.fetch;
let geminiCalls = 0;
globalThis.fetch = (async (input: any) => {
  const url = typeof input === 'string' ? input : input?.url;
  if (String(url).includes('generativelanguage.googleapis.com')) {
    geminiCalls++;
    return new Response(
      JSON.stringify({ candidates: [{ content: { role: 'model', parts: [{ text: 'stubbed reply' }] }, finishReason: 'STOP', index: 0 }] }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  }
  throw new Error(`Unexpected network call in test: ${url}`);
}) as typeof fetch;

const { default: chatHandler, CHAT_RATE_LIMITS } = await import('../api/chat.js');
const chatBody = { prompt: 'Hello', chatHistory: [{ role: 'student', content: 'Hello' }] };

await check('no token -> 401, Gemini not called', async () => {
  resetRateLimits();
  geminiCalls = 0;
  const res = makeRes();
  await chatHandler(makeReq({ body: chatBody }), res);
  assert.equal(res.statusCode, 401);
  assert.equal(geminiCalls, 0);
});
await check('forged legacy token -> 401', async () => {
  const forged = Buffer.from(JSON.stringify({ ...base, exp: Date.now() + 1e9 })).toString('base64');
  const res = makeRes();
  await chatHandler(makeReq({ token: forged, body: chatBody }), res);
  assert.equal(res.statusCode, 401);
});
await check('tampered signed token -> 401', async () => {
  const [v, body] = createSessionToken(base).split('.');
  const res = makeRes();
  await chatHandler(makeReq({ token: `${v}.${body}.AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA`, body: chatBody }), res);
  assert.equal(res.statusCode, 401);
});
await check('valid session -> 200 with AI reply', async () => {
  geminiCalls = 0;
  const res = makeRes();
  await chatHandler(makeReq({ token: createSessionToken(base), body: chatBody }), res);
  assert.equal(res.statusCode, 200, JSON.stringify(res.body));
  assert.equal(res.body.response, 'stubbed reply');
  assert.equal(geminiCalls, 1);
});
await check(`per-user rate limit triggers after ${CHAT_RATE_LIMITS.userBurst.limit} msgs / 5 min`, async () => {
  resetRateLimits();
  const token = createSessionToken({ ...base, userId: 'u_spammer' });
  let lastOk = 0;
  for (let i = 1; i <= CHAT_RATE_LIMITS.userBurst.limit; i++) {
    const res = makeRes();
    await chatHandler(makeReq({ token, body: chatBody }), res);
    assert.equal(res.statusCode, 200, `request ${i} should pass`);
    lastOk = i;
  }
  const res = makeRes();
  await chatHandler(makeReq({ token, body: chatBody }), res);
  assert.equal(res.statusCode, 429);
  assert.ok(Number(res.headers['retry-after']) > 0);
  // A different user on another network is unaffected.
  const other = makeRes();
  await chatHandler(makeReq({ token: createSessionToken({ ...base, userId: 'u_bob' }), ip: '198.51.100.7', body: chatBody }), other);
  assert.equal(other.statusCode, 200);
  console.log(`      (${lastOk} allowed, next one got 429)`);
});
await check('normal demo pace (20 messages) never hits the limit', async () => {
  resetRateLimits();
  const token = createSessionToken(base);
  for (let i = 0; i < 20; i++) {
    const res = makeRes();
    await chatHandler(makeReq({ token, body: chatBody }), res);
    assert.equal(res.statusCode, 200);
  }
});
globalThis.fetch = realFetch;

console.log('\n== 3. Demo login end-to-end (local throwaway DB only) ==');
const dbUrl = process.env.DATABASE_URL || '';
const isLocalDb = /@(127\.0\.0\.1|localhost)(:\d+)?\//.test(dbUrl);
if (!dbUrl) {
  console.log('SKIP  DATABASE_URL not set (set it to a local seeded Postgres to run this part)');
} else if (!isLocalDb) {
  console.log('SKIP  DATABASE_URL is not localhost — refusing to touch a non-local database');
} else {
  resetRateLimits();
  const { default: login } = await import('../api/auth/mock-login.js');
  const { default: studentApi } = await import('../api/student/[[...path]].js');
  const { default: adminApi } = await import('../api/admin/[[...path]].js');
  const { prisma } = await import('../api/lib/db.js');

  const doLogin = async (body: unknown, ip?: string) => {
    const res = makeRes();
    await login(makeReq({ body, ip }), res);
    return res;
  };

  for (const [email, role] of [
    ['alice@wildmind.edu', 'STUDENT'],
    ['bob@wildmind.edu', 'STUDENT'],
    ['charlie@wildmind.edu', 'STUDENT'],
    ['teacher@wildmind.edu', 'TEACHER'],
    ['admin@wildmind.edu', 'ADMIN'],
  ] as const) {
    await check(`demo login ${email} as ${role} (same request the UI sends) -> 200 + signed token`, async () => {
      const res = await doLogin({ email, role, tenantSlug: 'wildmind-academy' });
      assert.equal(res.statusCode, 200, JSON.stringify(res.body));
      assert.equal(res.body.user.role, role);
      const p = verifySessionToken(res.body.token);
      assert.ok(p, 'token verifies');
      assert.equal(p!.role, role);
    });
  }
  await check('lower-case role alias still accepted (existing compat)', async () => {
    const res = await doLogin({ email: 'alice@wildmind.edu', role: 'student' });
    assert.equal(res.statusCode, 200);
  });
  await check('student session works on student API; forged admin token rejected on admin API', async () => {
    const s = await doLogin({ email: 'alice@wildmind.edu', role: 'STUDENT', tenantSlug: 'wildmind-academy' });
    const r1 = makeRes();
    await studentApi(makeReq({ method: 'GET', token: s.body.token, query: { path: ['courses'] } }), r1);
    assert.equal(r1.statusCode, 200, JSON.stringify(r1.body));

    const p = verifySessionToken(s.body.token)!;
    const forged = Buffer.from(JSON.stringify({ ...p, role: 'ADMIN' })).toString('base64');
    const r2 = makeRes();
    await adminApi(makeReq({ method: 'GET', token: forged, query: { path: ['stats'] } }), r2);
    assert.equal(r2.statusCode, 401);

    const [v, body, sig] = s.body.token.split('.');
    const edited = JSON.parse(Buffer.from(body, 'base64url').toString());
    edited.role = 'ADMIN';
    const r3 = makeRes();
    await adminApi(makeReq({ method: 'GET', token: `${v}.${b64url(edited)}.${sig}`, query: { path: ['stats'] } }), r3);
    assert.equal(r3.statusCode, 401);

    const r4 = makeRes();
    await adminApi(makeReq({ method: 'GET', token: s.body.token, query: { path: ['stats'] } }), r4);
    assert.equal(r4.statusCode, 403, 'real student token is forbidden on admin API');
  });
  await check('SUPER_ADMIN cannot be requested via mock login', async () => {
    const res = await doLogin({ email: 'admin@wildmind.edu', role: 'SUPER_ADMIN' });
    assert.equal(res.statusCode, 400);
    const u = await prisma.user.findFirst({ where: { email: 'admin@wildmind.edu' } });
    assert.equal(u?.role, 'ADMIN', 'admin account role unchanged');
  });
  await check('other tenant slugs are refused', async () => {
    const res = await doLogin({ email: 'x@evil.test', role: 'ADMIN', tenantSlug: 'someone-else' });
    assert.equal(res.statusCode, 404);
  });
  await check('non-string / oversized email refused', async () => {
    assert.equal((await doLogin({ email: { $ne: 1 }, role: 'STUDENT' })).statusCode, 400);
    assert.equal((await doLogin({ email: 'a'.repeat(300) + '@x.test', role: 'STUDENT' })).statusCode, 400);
    assert.equal((await doLogin({ email: 'no-at-sign', role: 'STUDENT' })).statusCode, 400);
  });
  await check('new email still gets a demo account (behaviour kept; owner decision)', async () => {
    const email = `newvisitor${Date.now()}@example.test`;
    const res = await doLogin({ email, role: 'STUDENT', tenantSlug: 'wildmind-academy' });
    assert.equal(res.statusCode, 200);
    assert.ok(verifySessionToken(res.body.token));
  });
  await check('mock-login per-IP limit triggers', async () => {
    resetRateLimits();
    const { MOCK_LOGIN_RATE_LIMITS } = await import('../api/auth/mock-login.js');
    let got429 = false;
    for (let i = 0; i <= MOCK_LOGIN_RATE_LIMITS.ipLogin.limit; i++) {
      const res = await doLogin({ email: 'no-at-sign', role: 'STUDENT' }, '192.0.2.55');
      if (res.statusCode === 429) { got429 = true; break; }
    }
    assert.ok(got429);
    const other = await doLogin({ email: 'alice@wildmind.edu', role: 'STUDENT' }, '192.0.2.56');
    assert.equal(other.statusCode, 200, 'other IPs unaffected');
  });
  await prisma.$disconnect();
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
