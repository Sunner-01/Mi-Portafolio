import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const raw = execFileSync(
  process.execPath,
  ['node_modules/supabase/dist/supabase.js', 'status', '-o', 'json'],
  { encoding: 'utf8' },
);
const status = JSON.parse(raw.slice(raw.indexOf('{')));
const url = status.API_URL;
const anon = status.ANON_KEY || status.PUBLISHABLE_KEY;
const service = status.SERVICE_ROLE_KEY || status.SECRET_KEY;
if (!url || !anon || !service) throw new Error('Inicia primero Supabase local.');

writeFileSync(
  '.env',
  `SUPABASE_URL=${url}\nSUPABASE_ANON_KEY=${anon}\nSUPABASE_SERVICE_ROLE_KEY=${service}\nPORT=4301\n`,
);
writeFileSync('frontend/.env.local', 'API_INTERNAL_URL=http://127.0.0.1:4301\n');
console.log('Entorno local preparado. Las claves están fuera de Git.');
