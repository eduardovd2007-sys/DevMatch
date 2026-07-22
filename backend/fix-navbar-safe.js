const fs = require('fs');
const file = 'c:/Users/eduar/Downloads/DevMatch-main (1)/DevMatch-main/src/main/webapp/assets/js/navbar.js';
let content = fs.readFileSync(file, 'utf8');

const originalGetCurrentUser = `function getCurrentUser() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(USER_KEY));
    if (saved) return saved;
  } catch { /* noop */ }
  return { name: 'Alejandro López', handle: 'alejandro_l', initials: 'AL' };
}`;

const replacementGetCurrentUser = `function getCurrentUser() {
  const realName = localStorage.getItem('userName');
  if (realName) {
    const initials = realName.substring(0, 2).toUpperCase();
    return { name: realName, handle: realName.toLowerCase().replace(/ /g, '_'), initials: initials };
  }

  try {
    const saved = JSON.parse(sessionStorage.getItem(USER_KEY));
    if (saved) return saved;
  } catch { /* noop */ }
  return { name: 'Alejandro López', handle: 'alejandro_l', initials: 'AL' };
}`;

content = content.replace(originalGetCurrentUser, replacementGetCurrentUser);
fs.writeFileSync(file, content);
console.log("navbar.js updated safely!");
