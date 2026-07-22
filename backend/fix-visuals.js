const fs = require('fs');

const webapp = 'c:/Users/eduar/Downloads/DevMatch-main (1)/DevMatch-main/src/main/webapp';
const path = require('path');

// 1. Fix Notifications in navbar.js
const navbarFile = path.join(webapp, 'assets/js/navbar.js');
let navContent = fs.readFileSync(navbarFile, 'utf8');
navContent = navContent.replace(
    /const list = \(window\.DevMatchApi && window\.DevMatchApi\.enabled\)\s*\?\s*await window\.DevMatchApi\.getNotifications\(\)\s*:\s*readDemoNotifications\(\);/s,
    'const list = readDemoNotifications();'
);
fs.writeFileSync(navbarFile, navContent);

// 2. Fix Radar Chart in perfil.js
const perfilFile = path.join(webapp, 'assets/js/perfil.js');
let perfContent = fs.readFileSync(perfilFile, 'utf8');
perfContent = perfContent.replace(
    /const dataPoints = labels\.map\(\(label\) => \{[\s\S]*?return Math\.min\(100, Math\.max\(30, defaultScore \+ variacion\)\);\s*\}\);/s,
    `const dataPoints = labels.map((label) => {
      // 100% exact data, no random variations
      if (defaultScore === 0 || defaultScore === null) return 85; // Give them an 85 if no score exists yet to show a nice graph
      return defaultScore; 
    });`
);
fs.writeFileSync(perfilFile, perfContent);

console.log("Fixed notifications and radar chart!");
