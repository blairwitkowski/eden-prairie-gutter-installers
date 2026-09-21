import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import path from 'node:path';

const site = JSON.parse(fs.readFileSync('./src/data/site.json', 'utf8'));

// Pages with index:false stay out of the sitemap.
const noindex = new Set();
const dir = './src/content/pages';
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.md'))) {
  const txt = fs.readFileSync(path.join(dir, f), 'utf8');
  const fm = txt.split('---')[1] || '';
  if (/^index:\s*false/m.test(fm)) {
    const slug = (fm.match(/^slug:\s*"?([^"\n]*)"?/m) || [])[1] || '';
    noindex.add(slug ? `/${slug}/` : '/');
  }
}

export default defineConfig({
  site: site.siteUrl,
  outDir: './dist/public',
  trailingSlash: 'always',
  build: { format: 'directory' },
  vite: {
    server: {
      allowedHosts: true,
    },
  },
  integrations: [
    sitemap({ filter: (page) => !noindex.has(new URL(page).pathname) }),
  ],
});
