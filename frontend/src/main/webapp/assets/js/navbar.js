/* ==========================================================
   navbar.js
   Lógica compartida del navbar: dropdown de avatar (Mi Perfil /
   Cerrar sesión) y panel de notificaciones (campana).
   Se incluye en TODAS las páginas, justo después de api-client.js:

     <script src="/js/api-client.js"></script>
     <script src="/js/navbar.js"></script>
     <script src="/js/tu-vista.js"></script>

   Requiere que el <nav> tenga este markup (reemplaza el .nav-right
   actual en cada HTML):

   <div class="nav-right">
     <div class="nav-bell-wrap">
       <button type="button" class="nav-bell" id="nav-bell-btn" aria-label="Notificaciones">
         <img src="/assets/img/campana.png" alt="" width="20" height="20">
         <span class="bell-badge" id="bell-badge" hidden>0</span>
       </button>
       <div class="notif-dropdown" id="notif-dropdown" aria-hidden="true">
         <div class="notif-dropdown-head">
           <span>Notificaciones</span>
           <span class="notif-badge-pill" id="notif-count-pill">0 nuevas</span>
         </div>
         <div class="notif-list" id="notif-list"></div>
       </div>
     </div>
     <div class="nav-avatar-wrap">
       <button type="button" class="avatar" id="nav-avatar-btn">AL</button>
       <div class="avatar-dropdown" id="avatar-dropdown" aria-hidden="true">
         <div class="avatar-dropdown-head">
           <div class="avatar">AL</div>
           <strong id="avatar-dropdown-name">Alejandro López</strong>
         </div>
         <a href="perfil.html" class="avatar-dropdown-item"><span class="ico">☰</span>Mi Perfil</a>
         <button type="button" class="avatar-dropdown-item avatar-dropdown-item--danger" id="logout-btn"><span class="ico">✖</span>Cerrar Sesión</button>
       </div>
     </div>
   </div>
   ========================================================== */

const NOTIF_KEY = 'devmatch_notificaciones';
const USER_KEY = 'devmatch_user';

function navEsc(text) {
  const el = document.createElement('span');
  el.textContent = text ?? '';
  return el.innerHTML;
}

function getCurrentUser() {
  const realName = localStorage.getItem('userName');
  if (realName) {
    const initials = realName.substring(0, 2).toUpperCase();
    let uid = localStorage.getItem('currentUserId');
    uid = (uid && uid !== 'null' && uid !== 'undefined') ? uid : 1;
    return { 
      id: uid, 
      name: realName, 
      handle: realName.toLowerCase().replace(/ /g, '_'), 
      initials: initials 
    };
  }
  // Fallback si no hay sesion
  return { id: 1, name: 'Invitado', handle: 'invitado', initials: 'IN' };
}

function paintUserInNav() {
  const user = getCurrentUser();
  document.querySelectorAll('#nav-avatar-btn, .avatar-dropdown-head .avatar').forEach((el) => {
    el.textContent = user.initials;
  });
  const nameEl = document.querySelector('#avatar-dropdown-name');
  if (nameEl) nameEl.textContent = user.name;
}

function timeAgo(ts) {
  const diffMin = Math.max(1, Math.round((Date.now() - ts) / 60000));
  if (diffMin < 60) return `hace ${diffMin} min`;
  const diffH = Math.round(diffMin / 60);
  if (diffH < 24) return `hace ${diffH} h`;
  return `hace ${Math.round(diffH / 24)} d`;
}

function renderNotifications(list) {
  const listEl = document.querySelector('#notif-list');
  const badge = document.querySelector('#bell-badge');
  const pill = document.querySelector('#notif-count-pill');
  if (!listEl) return;

  const unread = list.filter((n) => !n.leida).length;

  if (badge) {
    if (unread > 0) { badge.hidden = false; badge.textContent = unread > 9 ? '9+' : unread; }
    else badge.hidden = true;
  }
  if (pill) pill.textContent = `${unread} nueva${unread === 1 ? '' : 's'}`;

  if (!list.length) {
    listEl.innerHTML = '<p class="notif-empty">Sin notificaciones por ahora.</p>';
    return;
  }

  listEl.innerHTML = list.slice().sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()).map((n) => `
    <article class="notif-item${n.leida ? ' is-read' : ''}" data-type="${navEsc(n.tipo)}" data-id="${navEsc(n.id)}">
      <span class="notif-tag">${navEsc(n.tipo.replace('_', ' '))}</span>
      <span class="notif-time">${navEsc(timeAgo(new Date(n.fecha).getTime()))}</span>
      <span class="notif-title">${n.titulo}</span>
      <div class="notif-meta">${navEsc(n.meta)}</div>
    </article>`).join('');

  listEl.querySelectorAll('.notif-item').forEach((item) => {
    item.addEventListener('click', () => markNotificationRead(item.dataset.id));
  });
}

async function markNotificationRead(id) {
  if (window.DevMatchApi && window.DevMatchApi.enabled) {
    try { await window.DevMatchApi.markNotificationRead(id); } catch { /* noop */ }
    return loadNotifications();
  }
}

async function loadNotifications() {
  try {
    const user = getCurrentUser();
    if (user && user.id && user.id !== 'null' && user.id !== 'undefined' && window.DevMatchApi && window.DevMatchApi.enabled) {
      const list = await window.DevMatchApi.getNotifications(user.id);
      renderNotifications(list);
    }
  } catch (err) {
    console.error(err);
    const listEl = document.querySelector('#notif-list');
    if (listEl) listEl.innerHTML = '<p class="notif-empty">No fue posible cargar notificaciones.</p>';
  }
}

function setupDropdown(btnSelector, panelSelector, onOpen) {
  const btn = document.querySelector(btnSelector);
  const panel = document.querySelector(panelSelector);
  if (!btn || !panel) return;

  btn.addEventListener('click', (event) => {
    event.stopPropagation();
    const willOpen = !panel.classList.contains('is-open');
    document.querySelectorAll('.notif-dropdown.is-open, .avatar-dropdown.is-open').forEach((open) => {
      open.classList.remove('is-open');
      open.setAttribute('aria-hidden', 'true');
    });
    if (willOpen) {
      panel.classList.add('is-open');
      panel.setAttribute('aria-hidden', 'false');
      if (onOpen) onOpen();
    }
  });
}

document.addEventListener('click', (event) => {
  if (!event.target.closest('.nav-bell-wrap, .nav-avatar-wrap')) {
    document.querySelectorAll('.notif-dropdown.is-open, .avatar-dropdown.is-open').forEach((open) => {
      open.classList.remove('is-open');
      open.setAttribute('aria-hidden', 'true');
    });
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    document.querySelectorAll('.notif-dropdown.is-open, .avatar-dropdown.is-open').forEach((open) => {
      open.classList.remove('is-open');
      open.setAttribute('aria-hidden', 'true');
    });
  }
});

document.querySelector('#logout-btn')?.addEventListener('click', () => {
  if (confirm('¿Cerrar sesión?')) {
    window.location.href = '../index.html';
  }
});

setupDropdown('#nav-bell-btn', '#notif-dropdown', loadNotifications);
setupDropdown('#nav-avatar-btn', '#avatar-dropdown');
paintUserInNav();
