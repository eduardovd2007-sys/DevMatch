const fs = require('fs');
const path = require('path');

const webapp = 'c:/Users/eduar/Downloads/DevMatch-main (1)/DevMatch-main/src/main/webapp';

function fixFile(file) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    
    // Fix navbar.js
    if (file.endsWith('navbar.js')) {
        content = content.replace(
            /function getCurrentUser\(\) \{[\s\S]*?return \{ name: 'Alejandro López', handle: 'alejandro_l', initials: 'AL' \};\s*\}/,
            `function getCurrentUser() {
  const realName = localStorage.getItem('userName');
  if (realName) {
    const initials = realName.substring(0, 2).toUpperCase();
    return { name: realName, handle: realName.toLowerCase().replace(/ /g, '_'), initials: initials };
  }
  return { name: 'Alejandro López', handle: 'alejandro_l', initials: 'AL' };
}`
        );
        content = content.replace(/function navEsc.*?\}\s*\}/s, `function navEsc(text) {
  const el = document.createElement('span');
  el.textContent = text ?? '';
  return el.innerHTML;
}`);
        content = content.replace(/const NOTIF_KEY[\s\S]*?function navEsc/s, `const NOTIF_KEY = 'devmatch_notificaciones';
const USER_KEY = 'devmatch_user';

function navEsc`);

        // add paintUserInNav back
        if (!content.includes('function paintUserInNav')) {
             content = content.replace('function getCurrentUser', `function paintUserInNav() {
  const user = getCurrentUser();
  document.querySelectorAll('#nav-avatar-btn, .avatar-dropdown-head .avatar').forEach((el) => {
    el.textContent = user.initials;
  });
  const nameEl = document.querySelector('#avatar-dropdown-name');
  if (nameEl) nameEl.textContent = user.name;
}

function getCurrentUser`);
        }
    }

    // Fix perfil.js
    if (file.endsWith('perfil.js')) {
        content = content.replace(/name: 'Alejandro López',/g, "name: localStorage.getItem('userName') || 'Usuario DevMatch',");
    }

    fs.writeFileSync(file, content);
}

fixFile(path.join(webapp, 'assets/js/navbar.js'));
fixFile(path.join(webapp, 'assets/js/perfil.js'));

console.log("Fixed!");
