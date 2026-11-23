// Vercel build step (see vercel.json): copy ONLY the public site into dist/.
// It is an allowlist: anything not named here (data/, content/, design/, qa/, scripts/,
// cv/ sources, the ATS text, assets/legacy/ ...) is never deployed, so it cannot be served.
// The pages themselves are already generated and committed (node scripts/build.mjs); this
// step only copies files, so the Vercel build needs no dependencies.
import { cpSync, rmSync, mkdirSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const OUT = 'dist';
const PUBLIC = [
  'index.html',
  '404.html',
  'projects',
  'assets/css',
  'assets/js',
  'assets/fonts',
  'assets/img',
  'favicon.ico',
  'Chamod_Tharusha_Alwis_CV_Nov2026.pdf', // current CV; the old Chamod_Tharusha_Alwis.pdf is not deployed (vercel.json redirects its URL here)
  'sitemap.xml',
  'robots.txt',
];

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT);
for (const p of PUBLIC) {
  if (!existsSync(p)) { console.error(`stage: missing ${p}`); process.exit(1); }
  cpSync(p, join(OUT, p), { recursive: true });
}

const walk = d => readdirSync(d).flatMap(f => statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]);
const files = walk(OUT);
console.log(`stage: ${files.length} files in ${OUT}/`);
files.forEach(f => console.log('  ' + f.slice(OUT.length + 1)));
