const fs   = require('fs');
const path = require('path');

// --- Random color generators ---
function randomDarkHex() {
  const r = Math.floor(Math.random() * 128);
  const g = Math.floor(Math.random() * 128);
  const b = Math.floor(Math.random() * 128);
  return `#${[r,g,b].map(x => x.toString(16).padStart(2,'0')).join('')}`;
}
function randomLightHex() {
  const r = Math.floor(128 + Math.random() * 128);
  const g = Math.floor(128 + Math.random() * 128);
  const b = Math.floor(128 + Math.random() * 128);
  return `#${[r,g,b].map(x => x.toString(16).padStart(2,'0')).join('')}`;
}

// File paths
const tplPath = path.join(__dirname, '../assets/splash_template.svg');
const outPath = path.join(__dirname, '../assets/splash.svg');

// Read template
let svg = fs.readFileSync(tplPath, 'utf8');

// --- Color variables ---
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

// Replace CSS variable block in template
svg = svg.replace(
  /:root\s*{[\s\S]*?}/,
  `:root {
    --COLOR_BG:    ${colors.COLOR_BG};
    --COLOR_BG2:   ${colors.COLOR_BG2};
    --COLOR_BG3:   ${colors.COLOR_BG3};
    --COLOR_BG4:   ${colors.COLOR_BG4};
    --COLOR_TEXT1: ${colors.COLOR_TEXT1};
    --COLOR_TEXT2: ${colors.COLOR_TEXT2};
    --COLOR_TEXT3: ${colors.COLOR_TEXT3};
    --COLOR_TEXT4: ${colors.COLOR_TEXT4};
  }`
);

// --- Segment definitions ---
const segments = [
  { id: 1, text: 'I am Stephen Lam', fill: 'var(--COLOR_TEXT1)', nextFill: 'var(--COLOR_TEXT2)' },
  { id: 2, text: 'Hi How are you',   fill: 'var(--COLOR_TEXT2)', nextFill: 'var(--COLOR_TEXT3)' },
  { id: 3, text: "Let's talk",        fill: 'var(--COLOR_TEXT3)', nextFill: 'var(--COLOR_TEXT4)' },
  { id: 4, text: "I can't wait",     fill: 'var(--COLOR_TEXT4)', nextFill: 'var(--COLOR_TEXT1)' }
];

// Render a single segment block
function renderSegment({ id, text, fill, nextFill }) {
  const initialVis = id === 1 ? 'visible' : 'hidden';
  const drawBegin = id === 1 ? '0s;loop.end+0.1s' : `seg${id-1}del.end`;

  return `
  <g id="seg${id}" visibility="${initialVis}">
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
          fill="${fill}">
      <textPath href="#p${id}">${text}</textPath>
      <animate attributeName="fill"
               begin="seg${id}del.begin"
               dur="1s"
               values="${fill};${nextFill}"
               keyTimes="0;1"
               calcMode="spline"
               keySplines="0.42 0 1 1"
               fill="remove" />
    </text>
  </g>`;
}

// Generate and inject segments
const allSegments = segments.map(renderSegment).join('\n');
svg = svg.replace('<!-- SEGMENTS -->', allSegments);

// Write final SVG
fs.writeFileSync(outPath, svg, 'utf8');
console.log('Generated splash.svg with colors:', colors);
