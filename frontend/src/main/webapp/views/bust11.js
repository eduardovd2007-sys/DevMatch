const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
for (let f of files) {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/href="\.\.\/assets\/css\/base\.css(\?v=\d+)?"/g, 'href="../assets/css/base.css?v=20"');
  content = content.replace(/href="\.\.\/assets\/css\/proyectos\.css(\?v=\d+)?"/g, 'href="../assets/css/proyectos.css?v=20"');
  fs.writeFileSync(f, content);
}
console.log('Cache busted to v20');
