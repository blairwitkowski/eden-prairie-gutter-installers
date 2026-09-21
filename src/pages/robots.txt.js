import site from '../data/site.json';
export const GET = () => new Response(`User-agent: *\nAllow: /\n\nSitemap: ${site.siteUrl.replace(/\/$/, '')}/sitemap-index.xml\n`, { headers: { 'Content-Type': 'text/plain' } });
