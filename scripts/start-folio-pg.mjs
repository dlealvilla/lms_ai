import EmbeddedPostgres from 'embedded-postgres';
import { mkdirSync } from 'fs';
mkdirSync('/tmp/folio-pgdata', { recursive: true });
const pg = new EmbeddedPostgres({
  databaseDir: '/tmp/folio-pgdata',
  user: 'postgres',
  password: 'postgres',
  port: 54329,
  persistent: true,
});
console.log('initialising...');
await pg.initialise();
console.log('starting...');
await pg.start();
try { await pg.createDatabase('wildmind'); } catch (e) { console.log('createDatabase:', e.message); }
console.log('EMBEDDED_PG_READY postgresql://postgres:postgres@127.0.0.1:54329/wildmind');
setInterval(() => {}, 1 << 30);
