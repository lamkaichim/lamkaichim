const fs = require('fs');
const path = require('path');

// 生成随机 6 位 HEX
function randomHex() {
  return Math.floor(Math.random() * 0xFFFFFF)
             .toString(16).padStart(6, '0');
}

// 模板路径与目标路径
const tplPath = path.join(__dirname, '../assets/splash_template.svg');
const outPath = path.join(__dirname, '../assets/splash.svg');

// 读取模板并替换占位符
let svg = fs.readFileSync(tplPath, 'utf8');
const colors = {
   COLOR_BG:   `#${randomHex()}`,
   COLOR_BG2:  `#${randomHex()}`,
   COLOR_BG3:  `#${randomHex()}`,
   COLOR_BG4:  `#${randomHex()}`,
   COLOR_TEXT1:`#${randomHex()}`,
   COLOR_TEXT2:`#${randomHex()}`,
   COLOR_TEXT3:`#${randomHex()}`,
   COLOR_TEXT4:`#${randomHex()}`
};
for (const [key, val] of Object.entries(colors)) {
  svg = svg.replace(new RegExp(`{{${key}}}`, 'g'), val);
}

// 写入新 SVG
fs.writeFileSync(outPath, svg, 'utf8');
console.log(`Generated SVG with colors:`, colors);
