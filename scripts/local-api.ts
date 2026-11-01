/**
 * Local API adapter for Folio testing (not for production).
 * Loads Vercel serverless handlers under Node http.
 */
import http from 'node:http';
import { URL } from 'node:url';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const PORT = Number(process.env.API_PORT || 3001);

type Handler = (req: any, res: any) => any;

async function loadHandler(rel: string): Promise<Handler> {
  const abs = path.join(root, rel);
  const mod = await import(pathToFileURL(abs).href + `?t=${Date.now()}`);
  return mod.default as Handler;
}

function makeVercelRes(nodeRes: http.ServerResponse) {
  const res: any = {
    statusCode: 200,
    headersSent: false,
    status(code: number) {
      this.statusCode = code;
      nodeRes.statusCode = code;
      return this;
    },
    setHeader(k: string, v: string) {
      nodeRes.setHeader(k, v);
      return this;
    },
    json(body: unknown) {
      if (!nodeRes.headersSent) {
        nodeRes.setHeader('Content-Type', 'application/json');
        nodeRes.statusCode = this.statusCode;
      }
      nodeRes.end(JSON.stringify(body));
      this.headersSent = true;
      return this;
    },
    send(body: unknown) {
      if (typeof body === 'object') return this.json(body);
      nodeRes.statusCode = this.statusCode;
      nodeRes.end(body as string);
      this.headersSent = true;
      return this;
    },
    end(body?: unknown) {
      nodeRes.statusCode = this.statusCode;
      nodeRes.end(body as any);
      this.headersSent = true;
      return this;
    },
  };
  return res;
}

async function readBody(req: http.IncomingMessage): Promise<any> {
  const chunks: Buffer[] = [];
  for await (const c of req) chunks.push(c as Buffer);
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return {};
  const ct = req.headers['content-type'] || '';
  if (ct.includes('application/json')) {
    try { return JSON.parse(raw); } catch { return {}; }
  }
  return raw;
}

function parseQuery(url: URL): Record<string, string | string[]> {
  const q: Record<string, string | string[]> = {};
  url.searchParams.forEach((v, k) => {
    if (k in q) {
      const cur = q[k];
      q[k] = Array.isArray(cur) ? [...cur, v] : [cur as string, v];
    } else q[k] = v;
  });
  return q;
}

const server = http.createServer(async (nodeReq, nodeRes) => {
  nodeRes.setHeader('Access-Control-Allow-Origin', '*');
  nodeRes.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  nodeRes.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,DELETE,OPTIONS');
  if (nodeReq.method === 'OPTIONS') {
    nodeRes.statusCode = 204;
    nodeRes.end();
    return;
  }

  try {
    const host = nodeReq.headers.host || `127.0.0.1:${PORT}`;
    const url = new URL(nodeReq.url || '/', `http://${host}`);
    const pathname = url.pathname;
    const body = ['POST', 'PATCH', 'PUT'].includes(nodeReq.method || '')
      ? await readBody(nodeReq)
      : undefined;

    let handler: Handler | null = null;
    let query: Record<string, any> = parseQuery(url);

    if (pathname === '/api/health') {
      handler = await loadHandler('api/health.ts');
    } else if (pathname === '/api/chat') {
      handler = await loadHandler('api/chat.ts');
    } else if (pathname === '/api/auth/mock-login') {
      handler = await loadHandler('api/auth/mock-login.ts');
    } else if (pathname === '/api/teacher/pdf-upload') {
      handler = await loadHandler('api/teacher/pdf-upload.ts');
    } else if (pathname.startsWith('/api/teacher/')) {
      handler = await loadHandler('api/teacher/[[...path]].ts');
      const rest = pathname.replace(/^\/api\/teacher\/?/, '');
      query = { ...query, path: rest ? rest.split('/').filter(Boolean) : [] };
    } else if (pathname.startsWith('/api/student/')) {
      handler = await loadHandler('api/student/[[...path]].ts');
      const rest = pathname.replace(/^\/api\/student\/?/, '');
      query = { ...query, path: rest ? rest.split('/').filter(Boolean) : [] };
    } else if (pathname.startsWith('/api/admin/')) {
      handler = await loadHandler('api/admin/[[...path]].ts');
      const rest = pathname.replace(/^\/api\/admin\/?/, '');
      query = { ...query, path: rest ? rest.split('/').filter(Boolean) : [] };
    } else if (pathname.startsWith('/api/cron/')) {
      handler = await loadHandler('api/cron/auto-close-assessments.ts');
    }

    if (!handler) {
      nodeRes.statusCode = 404;
      nodeRes.setHeader('Content-Type', 'application/json');
      nodeRes.end(JSON.stringify({ error: 'Not found', path: pathname }));
      return;
    }

    const req: any = {
      method: nodeReq.method,
      url: nodeReq.url,
      headers: nodeReq.headers,
      body,
      query,
      cookies: {},
    };
    const res = makeVercelRes(nodeRes);
    await handler(req, res);
    if (!res.headersSent && !nodeRes.writableEnded) {
      nodeRes.end();
    }
  } catch (err: any) {
    console.error('local-api error', err);
    if (!nodeRes.headersSent) {
      nodeRes.statusCode = 500;
      nodeRes.setHeader('Content-Type', 'application/json');
      nodeRes.end(JSON.stringify({ error: err?.message || 'Internal error' }));
    }
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`LOCAL_API_READY http://127.0.0.1:${PORT}`);
});
