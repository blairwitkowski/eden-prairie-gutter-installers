import site from '../data/site.json';

const modules = import.meta.glob('../content/pages/*.md', { eager: true });
export const pages = Object.values(modules).map((m) => ({
  ...m.frontmatter,
  slug: m.frontmatter.slug || '',
  Content: m.Content,
}));

export { site };
export const href = (slug) => (slug ? `/${slug}/` : '/');
export const byType = (t) => pages.filter((p) => p.pageType === t);
export const findPage = (slug) => pages.find((p) => p.slug === slug);
export const hasPage = (slug) => pages.some((p) => p.slug === slug);
export const estimateHref = hasPage('estimate') ? '/estimate/' : hasPage('contact') ? '/contact/' : '/#estimate';
export const telHref = `tel:${site.phoneE164}`;
export const telClass = site.callTrackingClass || '';

// Wrap one phrase of a heading in the accent color. Text itself is never changed.
export function accent(text = '', phrase = '') {
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  if (!phrase || !text.includes(phrase)) return esc(text);
  const i = text.indexOf(phrase);
  return `${esc(text.slice(0, i))}<span class="hl">${esc(phrase)}</span>${esc(text.slice(i + phrase.length))}`;
}

export function crumbsFor(page) {
  const trail = [{ name: 'Home', to: '/' }];
  if (page.pageType === 'service' && hasPage('services')) trail.push({ name: 'Services', to: '/services/' });
  if (page.pageType === 'location' && hasPage('service-areas')) trail.push({ name: 'Service Area', to: '/service-areas/' });
  trail.push({ name: page.breadcrumbLabel || page.h1, to: href(page.slug) });
  return trail;
}

// Button wording. "Free" appears only if site.json says estimates are free.
export const estimateLabel = site.estimateLabel || (site.freeEstimates ? 'Get a free estimate' : 'Request an estimate');
export const estimateShort = site.estimateLabelShort || (site.freeEstimates ? 'Free estimate' : 'Estimate');
