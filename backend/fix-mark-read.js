const fs = require('fs');

const webapp = 'c:/Users/eduar/Downloads/DevMatch-main (1)/DevMatch-main/src/main/webapp';
const path = require('path');

const navbarFile = path.join(webapp, 'assets/js/navbar.js');
let navContent = fs.readFileSync(navbarFile, 'utf8');

// Replace markNotificationRead completely
navContent = navContent.replace(
    /async function markNotificationRead\(id\) \{[\s\S]*?renderNotifications\(list\);\s*\}/s,
    `async function markNotificationRead(id) {
  const list = readDemoNotifications().map((n) => (n.id === id ? { ...n, read: true } : n));
  saveDemoNotifications(list);
  renderNotifications(list);
}`
);

fs.writeFileSync(navbarFile, navContent);
console.log("Fixed markNotificationRead!");
