const fs = require('fs');
let code = fs.readFileSync('../assets/js/navbar.js', 'utf8');

// 1. Add window.addNotification after loadNotifications
if (!code.includes('window.addNotification')) {
  code = code.replace(
    /async function loadNotifications\(\) \{[\s\S]*?\}\n\}/,
    `$&

window.addNotification = function(type, title, meta) {
  const list = readDemoNotifications();
  list.unshift({
    id: 'N_' + Date.now(),
    type: type,
    read: false,
    ts: Date.now(),
    title: title,
    meta: meta
  });
  saveDemoNotifications(list);
  renderNotifications(list);
};`
  );
}

// 2. Fix logout
code = code.replace(
  /document\.querySelector\('#logout-btn'\)\?\.addEventListener\('click', \(\) => \{[\s\S]*?\}\);/,
  `document.querySelector('#logout-btn')?.addEventListener('click', () => {
  if (confirm('¿Cerrar sesión?')) {
    localStorage.removeItem('currentUserId');
    localStorage.removeItem('userName');
    window.location.href = '../index.html';
  }
});`
);

// 3. Add loadNotifications at the end
if (!code.includes('loadNotifications();')) {
  code = code.replace(
    /paintUserInNav\(\);\n+$/,
    `paintUserInNav();\nloadNotifications();\n`
  );
}

fs.writeFileSync('../assets/js/navbar.js', code);
console.log("Navbar fixed");
