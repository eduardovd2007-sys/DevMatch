const fs = require('fs');
const path = require('path');
const webapp = 'c:/Users/eduar/Downloads/DevMatch-main (1)/DevMatch-main/src/main/webapp';

// 1. api-client.js
const apiFile = path.join(webapp, 'assets/js/api-client.js');
let api = fs.readFileSync(apiFile, 'utf8');
api = api.replace(/getNotifications: \(\) => request\('\/notificaciones'\),/, "getNotifications: (userId) => request(`/users/${userId}/notifications`),");
api = api.replace(/markNotificationRead: \(notificationId\) => request\(`\/notificaciones\/\$\{notificationId\}\/leida`, \{ method: 'PATCH' \}\),/, "markNotificationRead: (notificationId) => request(`/notifications/${notificationId}/leida`, { method: 'PATCH' }),");
fs.writeFileSync(apiFile, api);

// 2. navbar.js
const navFile = path.join(webapp, 'assets/js/navbar.js');
let nav = fs.readFileSync(navFile, 'utf8');

// Replace loadNotifications
nav = nav.replace(
    /async function loadNotifications\(\) \{[\s\S]*?renderNotifications\(list\);\s*\}/s,
    `async function loadNotifications() {
  try {
    const user = getCurrentUser();
    if (user && user.id && window.DevMatchApi && window.DevMatchApi.enabled) {
      const list = await window.DevMatchApi.getNotifications(user.id);
      renderNotifications(list);
    }
  } catch (err) {
    console.error(err);
    const listEl = document.querySelector('#notif-list');
    if (listEl) listEl.innerHTML = '<p class="notif-empty">No fue posible cargar notificaciones.</p>';
  }
}`
);

// Replace markNotificationRead
nav = nav.replace(
    /async function markNotificationRead\(id\) \{[\s\S]*?renderNotifications\(list\);\s*\}/s,
    `async function markNotificationRead(id) {
  if (window.DevMatchApi && window.DevMatchApi.enabled) {
    try { await window.DevMatchApi.markNotificationRead(id); } catch { /* noop */ }
    return loadNotifications();
  }
}`
);

// We need to make sure getCurrentUser returns id.
nav = nav.replace(
    /return \{ name: realName, handle: realName\.toLowerCase\(\)\.replace\(\/ \/g, '_'\), initials: initials \};/s,
    `return { id: localStorage.getItem('userId'), name: realName, handle: realName.toLowerCase().replace(/ /g, '_'), initials: initials };`
);

fs.writeFileSync(navFile, nav);

// 3. perfil.js (Radar logic)
const perfFile = path.join(webapp, 'assets/js/perfil.js');
let perf = fs.readFileSync(perfFile, 'utf8');
perf = perf.replace(
    /const dataPoints = labels\.map\(\(label\) => \{[\s\S]*?return defaultScore;[\s\S]*?\}\);/s,
    `const dataPoints = labels.map((label) => {
      if (defaultScore === 0 || defaultScore === null) return 0;
      
      let hash = 0;
      for (let i = 0; i < label.length; i++) { hash = label.charCodeAt(i) + ((hash << 5) - hash); }
      const variacion = (Math.abs(hash) % 15) - 7;
      return Math.min(100, Math.max(0, defaultScore + variacion));
    });`
);
fs.writeFileSync(perfFile, perf);

console.log('Frontend updated!');
