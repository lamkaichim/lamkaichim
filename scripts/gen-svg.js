const fs   = require('fs');
const path = require('path');

/* ---------- random colour helpers ---------- */
function randomDarkHex () {
  const rnd = () => Math.floor(Math.random() * 128)
                    .toString(16).padStart(2, '0');
  return `#${rnd()}${rnd()}${rnd()}`;
}
function randomLightHex () {
  const rnd = () => Math.floor(128 + Math.random() * 128)
                    .toString(16).padStart(2, '0');
  return `#${rnd()}${rnd()}${rnd()}`;
}

/* ---------- paths ---------- */
const tplPath = path.join(__dirname, '../assets/splash_template.svg');
const outPath = path.join(__dirname, '../assets/splash.svg');

/* ---------- read template ---------- */
let svg = fs.readFileSync(tplPath, 'utf8');

/* ---------- colour map ---------- */
const colors = {
  COLOR_BG:    randomDarkHex(),
  COLOR_BG2:   randomDarkHex(),
  COLOR_BG3:   randomDarkHex(),
  COLOR_BG4:   randomDarkHex(),
  COLOR_TEXT1: randomLightHex(),
  COLOR_TEXT2: randomLightHex(),
  COLOR_TEXT3: randomLightHex(),
  COLOR_TEXT4: randomLightHex(),
};

/* ---------- placeholder substitution ---------- */
for (const [key, value] of Object.entries(colors)) {
  //   {{COLOR_BG}}  ->  #8e0f3a
  const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
  svg = svg.replace(regex, value);             // global replace :contentReference[oaicite:2]{index=2}
}

/* ---------- write out ---------- */
fs.writeFileSync(outPath, svg, 'utf8');
console.log('Generated SVG with colors:', colors);
