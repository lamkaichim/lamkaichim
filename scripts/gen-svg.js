const fs = require('fs');
const path = require('path');

// 生成暗／亮色辅助函数
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

// 模板与输出文件路径
const tplPath = path.join(__dirname, '../assets/splash_template.svg');
const outPath = path.join(__dirname, '../assets/splash.svg');

// 读取模板
let svg = fs.readFileSync(tplPath, 'utf8');

// 随机生成配色
const colors = {
  COLOR_BG1:   randomDarkHex(),
  COLOR_BG2:   randomDarkHex(),
  COLOR_BG3:   randomDarkHex(),
  COLOR_BG4:   randomDarkHex(),
  COLOR_TEXT1: randomLightHex(),
  COLOR_TEXT2: randomLightHex(),
  COLOR_TEXT3: randomLightHex(),
  COLOR_TEXT4: randomLightHex()
};

// 替换占位符并写入新文件
for (const [key, val] of Object.entries(colors)) {
  svg = svg.replace(new RegExp(`{{${key}}}`, 'g'), val);
}
fs.writeFileSync(outPath, svg, 'utf8');

console.log('Generated SVG with colors:', colors);
