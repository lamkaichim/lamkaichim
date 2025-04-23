// gen.svg.js
const fs = require('fs');                       // Node.js 文件系统模块 :contentReference[oaicite:1]{index=1}
const tplPath = 'assets/splash_template.svg';
const outPath = 'assets/splash.svg';
let svg = fs.readFileSync(tplPath, 'utf8');     // 读取模板 :contentReference[oaicite:2]{index=2}

// 段落数据
const segments = [
  { id: 1, text: 'I am Stephen Lam', next: 2 },
  { id: 2, text: 'Hi How are you',   next: 3 },
  { id: 3, text: 'Let\'s talk',      next: 4 },
  { id: 4, text: 'I can\'t wait',    next: 1 },
];

// 单段模板函数，利用 ES6 模板字面量生成代码块 :contentReference[oaicite:3]{index=3}
function renderSegment({ id, text, next }) {
  const visBegin = id === 1 ? 'visible' : 'hidden';
  const drawBegin = id === 1
    ? '0s;loop.end+0.1s'
    : `seg${id-1}del.end`;
  return `
  <g id="seg${id}" visibility="${visBegin}">
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
          fill="#${id===1?'b6a5f7': id===2?'f3f6cb': id===3?'8591bc':'98d5b3'}">
      <textPath href="#p${id}">${text}</textPath>
      <animate attributeName="fill"
               begin="seg${id}del.begin"
               dur="1s"
               values="#${id===1?'b6a5f7': id===2?'f3f6cb': id===3?'8591bc':'98d5b3'};\
#${id===1?'f3f6cb': id===2?'8591bc': id===3?'98d5b3':'b6a5f7'}"
               keyTimes="0;1"
               calcMode="spline"
               keySplines="0.42 0 1 1"
               fill="remove" />
    </text>
  </g>`;
}

// 渲染所有段落并替换模板占位
const allSegments = segments.map(renderSegment).join('\n');
svg = svg.replace('<!-- SEGMENTS -->', allSegments);

// 写出最终 SVG
fs.writeFileSync(outPath, svg, 'utf8');         // 同步写入文件 :contentReference[oaicite:4]{index=4}
console.log('Generated splash.svg with optimized segments.');
