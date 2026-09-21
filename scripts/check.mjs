// Post-build checks. Run with: npm run check
import fs from 'node:fs'; import path from 'node:path';
const site = JSON.parse(fs.readFileSync('./src/data/site.json', 'utf8'));
const dist = './dist/public'; const problems = []; const notes = [];
const files = []; (function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); fs.statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') && files.push(p); } })(dist);
const routeOf = (f) => '/' + path.relative(dist, f).replace(/index\.html$/, '').replace(/\\/g, '/');
const routes = new Set(files.map(routeOf));
const titles = new Map(); const h1s = new Map();
const allowed = [...(site.allowedExternalDomains || []), new URL(site.siteUrl).hostname.replace(/^www\./, ''), 'googletagmanager.com'];
for (const f of files) {
  const html = fs.readFileSync(f, 'utf8'); const route = routeOf(f);
  if (route.startsWith('/404')) continue;
  const h1 = [...html.matchAll(/<h1[\s>]/g)].length; if (h1 !== 1) problems.push(`${route}: ${h1} <h1> tags`);
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || ''; if (!title) problems.push(`${route}: no title`);
  if (titles.has(title)) problems.push(`${route}: duplicate title with ${titles.get(title)}`); titles.set(title, route);
  const h1t = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1]?.replace(/<[^>]+>/g, '').trim();
  if (h1t && h1s.has(h1t)) problems.push(`${route}: duplicate H1 with ${h1s.get(h1t)}`); if (h1t) h1s.set(h1t, route);
  if (h1t && h1t.toLowerCase() === title.toLowerCase()) problems.push(`${route}: title and H1 identical`);
  for (const m of html.matchAll(/<a [^>]*href="([^"#]+)(#[^"]*)?"/g)) {
    const u = m[1];
    if (u.startsWith('/')) { if (!u.endsWith('/')) problems.push(`${route}: internal link missing trailing slash ${u}`); else if (!routes.has(u)) problems.push(`${route}: broken internal link ${u}`); }
    else if (u.startsWith('http')) { const h = new URL(u).hostname.replace(/^www\./, ''); if (!allowed.some((d) => h === d || h.endsWith('.' + d))) problems.push(`${route}: external domain not on allowlist: ${h}`); }
  }
  if (/"@type":"LocalBusiness"/.test(html)) problems.push(`${route}: generic LocalBusiness schema`);
  if (/aggregateRating/.test(html)) problems.push(`${route}: aggregateRating in schema`);
  if (/name="generator"/.test(html)) problems.push(`${route}: generator meta tag present`);
  for (const bad of ['lorem ipsum', 'TODO', '[PHONE]', '{{', 'example.com', '555-01']) if (html.includes(bad)) problems.push(`${route}: placeholder text "${bad}"`);
  const missing = [...html.matchAll(/Add photo: ([^<]+)</g)].map((m) => m[1]); if (missing.length) notes.push(`${route}: missing photos: ${[...new Set(missing)].join(', ')}`);
  if (![...html.matchAll(/<img /g)].length && !/thank-you|privacy|terms|accessibility|disclaimer|complaints/.test(route)) notes.push(`${route}: no images on this page`);
}
console.log(`Pages checked: ${files.length}`);
notes.forEach((n) => console.log('NOTE  ' + n)); problems.forEach((p) => console.log('FAIL  ' + p));
console.log(problems.length ? `RESULT: ${problems.length} problem(s)` : 'RESULT: PASS'); process.exit(problems.length ? 1 : 0);
