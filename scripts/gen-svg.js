const fs   = require('fs');
const path = require('path');

// Random color generators
function randomDarkHex() {
  const r = Math.floor(Math.random() * 128);
  const g = Math.floor(Math.random() * 128);
  const b = Math.floor(Math.random() * 128);
  return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
}
function randomLightHex() {
  const r = Math.floor(128 + Math.random() * 128);
  const g = Math.floor(128 + Math.random() * 128);
  const b = Math.floor(128 + Math.random() * 128);
  return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
}

// Paths
const tplPath = path.join(__dirname, '../assets/splash_template.svg');
const outPath = path.join(__dirname, '../assets/splash.svg');

// Load template
let svg = fs.readFileSync(tplPath, 'utf8');

// Generate color variables
const colors = {
  COLOR_BG:    randomDarkHex(),
  COLOR_BG2:   randomDarkHex(),
  COLOR_BG3:   randomDarkHex(),
  COLOR_BG4:   randomDarkHex(),
  COLOR_TEXT1: randomLightHex(),
  COLOR_TEXT2: randomLightHex(),
  COLOR_TEXT3: randomLightHex(),
  COLOR_TEXT4: randomLightHex()
};

// Replace CSS variable definitions in <style>
svg = svg.replace(
  /:root\s*{[\s\S]*?}/,
  `:root {
    --COLOR_BG:     ${colors.COLOR_BG};
    --COLOR_BG2:    ${colors.COLOR_BG2};
    --COLOR_BG3:    ${colors.COLOR_BG3};
    --COLOR_BG4:    ${colors.COLOR_BG4};
    --COLOR_TEXT1:  ${colors.COLOR_TEXT1};
    --COLOR_TEXT2:  ${colors.COLOR_TEXT2};
    --COLOR_TEXT3:  ${colors.COLOR_TEXT3};
    --COLOR_TEXT4:  ${colors.COLOR_TEXT4};
  }`
);

// Define segments based on test.svg content
const segments = [
  { id: 1, text: 'I am Stephen Lam' },
  { id: 2, text: 'Hi How are you' },
  { id: 3, text: "Let's talk" },
  { id: 4, text: "I can't wait" }
];

// Render a single segment with full SMIL animation
function renderSegment({ id, text }) {
  const fillVar   = `var(--COLOR_TEXT${id})`;
  const nextVar   = `var(--COLOR_TEXT${(id % 4) + 1})`;
  const visStart  = id === 1 ? 'visible' : 'hidden';
  const drawBegin = id === 1 ? '0s;loop.end+0.1s' : `seg${id - 1}del.end`;

  return `
  <g id="seg${id}" visibility="${visStart}">
    <path id="p${id}" d="M0,50 H0" fill="none"/>
    <animate id="seg${id}draw" href="#p${id}" attributeName="d"
             values="M0,50 H0;M0,50 H500" dur="2s"
             begin="${drawBegin}" fill="freeze"/>
    <animate id="seg${id}del" href="#p${id}" attributeName="d"
             values="M0,50 H500;M0,50 H0" dur="1s"
             begin="seg${id}draw.end+0.5s" fill="freeze"/>
    <set attributeName="visibility" to="hidden" begin="seg${id}del.end+1s"/>
    <set href="#seg${id}" attributeName="visibility" to="visible" begin="loop.begin"/>

    <text id="text${id}" font-family="system-ui" font-size="32" font-weight="bold"
          text-anchor="middle" x="50%" y="50" dominant-baseline="middle"
          fill="${fillVar}">
      <textPath href="#p${id}">${text}</textPath>
      <animate attributeName="fill"
               begin="seg${id}del.begin"
               dur="1s"
               values="${fillVar};${nextVar}"
               keyTimes="0;1"
               calcMode="spline"
               keySplines="0.42 0 1 1"
               fill="remove" />
    </text>
  </g>`;
}

// Generate all segments and inject into template
const allSegments = segments.map(renderSegment).join('\n');
svg = svg.replace('<!-- SEGMENTS -->', allSegments);

// Write output
fs.writeFileSync(outPath, svg, 'utf8');
console.log('Generated splash.svg matching test.svg');

