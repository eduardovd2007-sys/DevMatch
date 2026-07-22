const fs = require('fs');

function fixNavbar() {
    let file = 'c:/Users/eduar/Downloads/DevMatch-main (1)/DevMatch-main/src/main/webapp/assets/js/navbar.js';
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(
        /return \{ name: 'Alejandro López', handle: 'alejandro_l', initials: 'AL' \};/g,
        `const realName = localStorage.getItem('userName');
  if (realName) {
    const initials = realName.substring(0, 2).toUpperCase();
    return { name: realName, handle: realName.toLowerCase().replace(/ /g, '_'), initials: initials };
  }
  return { name: 'Alejandro López', handle: 'alejandro_l', initials: 'AL' };`
    );
    fs.writeFileSync(file, content);
}

fixNavbar();
console.log('Fixed navbar fallback!');
