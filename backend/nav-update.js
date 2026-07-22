const fs = require('fs');
const path = require('path');

const viewsDir = 'c:/Users/eduar/Downloads/DevMatch-main (1)/DevMatch-main/src/main/webapp/views';
const files = fs.readdirSync(viewsDir).filter(f => f.endsWith('.html') && f !== 'home.html' && f !== 'login.html' && f !== 'registro.html');

files.forEach(f => {
    const p = path.join(viewsDir, f);
    let c = fs.readFileSync(p, 'utf8');
    
    // Si tiene navbar y no tiene todavía el link de Inicio
    if (c.includes('<ul class="nav-links">') && !c.includes('home.html">Inicio</a>')) {
        // Soporte para \r\n o \n
        c = c.replace('<ul class="nav-links">\r\n', '<ul class="nav-links">\r\n      <li><a href="home.html">Inicio</a></li>\r\n');
        c = c.replace('<ul class="nav-links">\n', '<ul class="nav-links">\n      <li><a href="home.html">Inicio</a></li>\n');
        fs.writeFileSync(p, c);
        console.log(`Updated ${f}`);
    }
});
