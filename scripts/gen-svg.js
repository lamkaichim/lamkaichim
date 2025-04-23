const fs   = require('fs');
const path = require('path');

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

const tplPath = path.join(__dirname, '../assets/splash_template.svg');
const outPath = path.join(__dirname, '../assets/splash.svg');

let svg = fs.readFileSync(tplPath, 'utf8');

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

// 只替换 <style> 中 :root {...} 块
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

fs.writeFileSync(outPath, svg, 'utf8');
console.log('Generated SVG with colors:', colors);
