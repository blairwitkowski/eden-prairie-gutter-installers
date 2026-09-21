// Writes src/styles/preset.css from the "preset" in src/data/site.json.
// Change the look of the whole site by changing that one word.
import fs from 'node:fs';
const site = JSON.parse(fs.readFileSync('./src/data/site.json', 'utf8'));

const PRESETS = {
  copper: {
    fonts: ['@fontsource-variable/archivo/wdth', '@fontsource-variable/source-sans-3'],
    vars: { ink:'#18232B', ink2:'#22313B', tint:'#EAEFF1', text:'#2B3740', muted:'#5E6C76', accent:'#B4572A', accentDark:'#E8A272', footer:'#1B1D1F', radius:'4px',
      head:'"Archivo Variable",system-ui,sans-serif', wdth:'112', weight:'800', track:'-.02em', case:'none', body:'"Source Sans 3 Variable",system-ui,sans-serif', hero:'clamp(2.5rem,5.2vw,4.5rem)' },
  },
  iron: {
    fonts: ['@fontsource/barlow-condensed/600','@fontsource/barlow-condensed/700','@fontsource/barlow/400','@fontsource/barlow/500','@fontsource/barlow/600'],
    vars: { ink:'#1F2225', ink2:'#2A2E32', tint:'#F1EEE8', text:'#2C2F33', muted:'#666B70', accent:'#D9480F', accentDark:'#FF8A4C', footer:'#141516', radius:'0px',
      head:'"Barlow Condensed",system-ui,sans-serif', wdth:'100', weight:'700', track:'0', case:'uppercase', body:'"Barlow",system-ui,sans-serif', hero:'clamp(3rem,6.4vw,5.6rem)' },
  },
  marsh: {
    fonts: ['@fontsource-variable/fraunces','@fontsource-variable/karla'],
    vars: { ink:'#1D3A31', ink2:'#27493E', tint:'#EEF0E6', text:'#26332E', muted:'#5C6B64', accent:'#9A6A12', accentDark:'#E3BC62', footer:'#1C1F1D', radius:'8px',
      head:'"Fraunces Variable",Georgia,serif', wdth:'100', weight:'600', track:'-.015em', case:'none', body:'"Karla Variable",system-ui,sans-serif', hero:'clamp(2.4rem,4.8vw,4.1rem)' },
  },
  harbor: {
    fonts: ['@fontsource-variable/bitter','@fontsource-variable/public-sans'],
    vars: { ink:'#14284B', ink2:'#1D3763', tint:'#EEF2F8', text:'#25324A', muted:'#5B6880', accent:'#C2410C', accentDark:'#FDBA4D', footer:'#17191D', radius:'3px',
      head:'"Bitter Variable",Georgia,serif', wdth:'100', weight:'700', track:'-.01em', case:'none', body:'"Public Sans Variable",system-ui,sans-serif', hero:'clamp(2.4rem,4.9vw,4.2rem)' },
  },
  brick: {
    fonts: ['@fontsource-variable/big-shoulders-display','@fontsource-variable/work-sans'],
    vars: { ink:'#2A1C18', ink2:'#3A2721', tint:'#F5EFE7', text:'#33261F', muted:'#6E5F57', accent:'#A3331F', accentDark:'#F0A58F', footer:'#191614', radius:'2px',
      head:'"Big Shoulders Display Variable",system-ui,sans-serif', wdth:'100', weight:'800', track:'.005em', case:'uppercase', body:'"Work Sans Variable",system-ui,sans-serif', hero:'clamp(3rem,6.6vw,5.8rem)' },
  },
};

const name = PRESETS[site.preset] ? site.preset : 'copper';
const p = PRESETS[name];
const v = { ...p.vars };
if (site.brandAccent) v.accent = site.brandAccent;
if (site.brandAccentOnDark) v.accentDark = site.brandAccentOnDark;

const css = `/* Generated from site.json preset "${name}". Do not edit by hand. */
${p.fonts.map((f) => `@import "${f}";`).join('\n')}
:root{
  --ink:${v.ink}; --ink-2:${v.ink2}; --paper:#fff; --tint:${v.tint}; --text:${v.text}; --muted:${v.muted};
  --accent:${v.accent}; --accent-on-dark:${v.accentDark}; --footer:${v.footer}; --radius:${v.radius};
  --line:color-mix(in srgb, ${v.ink} 14%, transparent); --line-dark:rgba(255,255,255,.16);
  --head:${v.head}; --head-wdth:${v.wdth}; --head-weight:${v.weight}; --head-track:${v.track}; --head-case:${v.case};
  --body:${v.body}; --hero-size:${v.hero};
}
`;
fs.writeFileSync('./src/styles/preset.css', css);
console.log(`preset: ${name}`);
