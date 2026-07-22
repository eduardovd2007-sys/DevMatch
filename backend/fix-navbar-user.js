const fs = require('fs');
const file = 'c:/Users/eduar/Downloads/DevMatch-main (1)/DevMatch-main/src/main/webapp/assets/js/navbar.js';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(
    /function getCurrentUser\(\) \{[\s\S]*?return \{ name: 'Alejandro López', handle: 'alejandro_l', initials: 'AL' \};\s*\}/s,
    `function getCurrentUser() {
  const realName = localStorage.getItem('userName');
  if (realName) {
    const initials = realName.substring(0, 2).toUpperCase();
    return { 
      id: localStorage.getItem('currentUserId'), 
      name: realName, 
      handle: realName.toLowerCase().replace(/ /g, '_'), 
      initials: initials 
    };
  }
  // Fallback si no hay sesion
  return { name: 'Invitado', handle: 'invitado', initials: 'IN' };
}`
);

fs.writeFileSync(file, c);
console.log('Fixed getCurrentUser in navbar.js!');
