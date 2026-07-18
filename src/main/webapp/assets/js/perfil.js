/* ==========================================================
   perfil.js
   Vista "Mi Perfil". Mismo patrón que el resto de la app:
   - DevMatchApi.enabled === false -> sessionStorage (modo demo)
   - DevMatchApi.enabled === true  -> fetch real (getProfile/updateProfile)
   ========================================================== */

const PROFILE_KEY = 'devmatch_perfil';

function esc(text) {
  const el = document.createElement('span');
  el.textContent = text ?? '';
  return el.innerHTML;
}

/* --------------------------------------------------------
   Datos demo del perfil (solo la primera vez que se abre,
   igual que seedDemoMetrics en metricas.js)
   -------------------------------------------------------- */
function seedDemoProfile() {
  const today = new Date();
  return {
    name: 'Alejandro López',
    handle: 'alejandro_l',
    id: 'USR-0042',
    email: '253734@upChiapas.mx',
    status: 'foraneo',
    stack: ['Java', 'Spring Boot', 'React', 'PostgreSQL', 'Docker', 'Python'],
    notifPostulantes: true,
    notifResumen: false,
    // días marcados como "no disponible" dentro del mes visible (resto = disponible)
    calendarMonth: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`,
    blockedDays: [6, 7, 13, 14, 20, 21, 27, 28] // fines de semana como ejemplo inicial
  };
}

function readDemoProfile() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(PROFILE_KEY));
    if (saved !== null) return saved;
  } catch { /* noop */ }
  const seeded = seedDemoProfile();
  sessionStorage.setItem(PROFILE_KEY, JSON.stringify(seeded));
  return seeded;
}

function saveDemoProfile(profile) {
  sessionStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

let profile = null;
let selectedStack = [];
let calendarViewDate = new Date(); // mes que se está mostrando
let blockedDaysSet = new Set();

/* --------------------------------------------------------
   Estado actual (toggle single-select)
   -------------------------------------------------------- */
function setupStatusToggle(currentValue) {
  const hidden = document.querySelector('#field-status');
  hidden.value = currentValue;
  document.querySelectorAll('.status-option').forEach((btn) => {
    btn.classList.toggle('selected', btn.dataset.value === currentValue);
    btn.addEventListener('click', () => {
      document.querySelectorAll('.status-option').forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
      hidden.value = btn.dataset.value;
    });
  });
}

/* --------------------------------------------------------
   Stack técnico editable
   -------------------------------------------------------- */
function renderStackEdit() {
  const list = document.querySelector('#stack-edit-list');
  list.innerHTML = selectedStack.map((tech, i) => `
    <span class="stack-edit-tag" data-index="${i}">${esc(tech)}<button type="button" aria-label="Quitar ${esc(tech)}">×</button></span>
  `).join('');

  list.querySelectorAll('.stack-edit-tag button').forEach((btn, i) => {
    btn.addEventListener('click', () => {
      selectedStack.splice(i, 1);
      renderStackEdit();
    });
  });
}

function setupStackAdd() {
  const input = document.querySelector('#stack-add-input');
  input.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    const value = input.value.trim();
    if (!value) return;
    if (selectedStack.some((t) => t.toLowerCase() === value.toLowerCase())) {
      input.value = '';
      return;
    }
    selectedStack.push(value);
    input.value = '';
    renderStackEdit();
  });
}

/* --------------------------------------------------------
   Calendario de disponibilidad
   -------------------------------------------------------- */
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DOW = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];

function isSameMonth(date, year, month) {
  return date.getFullYear() === year && date.getMonth() === month;
}

function renderCalendar() {
  const year = calendarViewDate.getFullYear();
  const month = calendarViewDate.getMonth();
  document.querySelector('#cal-month-label').textContent = `${MESES[month]} ${year}`;

  const grid = document.querySelector('#calendar-grid');
  grid.innerHTML = DOW.map((d) => `<div class="calendar-dow">${d}</div>`).join('');

  const firstDay = new Date(year, month, 1);
  // Lunes = 0 ... Domingo = 6
  const leadingBlanks = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const isCurrentMonth = isSameMonth(today, year, month);

  for (let i = 0; i < leadingBlanks; i++) {
    grid.insertAdjacentHTML('beforeend', '<div class="calendar-day is-blank"></div>');
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const blocked = blockedDaysSet.has(day);
    const isToday = isCurrentMonth && today.getDate() === day;
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = `calendar-day ${blocked ? 'is-no-disponible' : 'is-disponible'}${isToday ? ' is-hoy' : ''}`;
    cell.textContent = day;
    cell.addEventListener('click', () => {
      if (blockedDaysSet.has(day)) blockedDaysSet.delete(day);
      else blockedDaysSet.add(day);
      renderCalendar();
      renderStats(daysInMonth);
    });
    grid.appendChild(cell);
  }

  renderStats(daysInMonth);
}

function renderStats(daysInMonth) {
  const bloqueados = blockedDaysSet.size;
  const disponibles = daysInMonth - bloqueados;
  const pct = daysInMonth ? Math.round((disponibles / daysInMonth) * 100) : 0;
  document.querySelector('#stat-disponibles').textContent = disponibles;
  document.querySelector('#stat-bloqueados').textContent = bloqueados;
  document.querySelector('#stat-porcentaje').textContent = `${pct}%`;
}

document.querySelector('#cal-prev').addEventListener('click', () => {
  calendarViewDate = new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() - 1, 1);
  renderCalendar();
});
document.querySelector('#cal-next').addEventListener('click', () => {
  calendarViewDate = new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() + 1, 1);
  renderCalendar();
});

/* --------------------------------------------------------
   Pintar el formulario con los datos cargados
   -------------------------------------------------------- */
function paintProfile(data) {
  profile = data;
  document.querySelector('#perfil-name-display').textContent = data.name;
  document.querySelector('#perfil-handle-display').textContent = `@${data.handle} · ID: ${data.id}`;
  document.querySelector('#perfil-avatar').textContent = data.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  document.querySelector('#field-name').value = data.name;
  document.querySelector('#field-email').value = data.email;
  setupStatusToggle(data.status);

  selectedStack = [...data.stack];
  renderStackEdit();

  document.querySelector('#pref-postulantes').checked = Boolean(data.notifPostulantes);
  document.querySelector('#pref-resumen').checked = Boolean(data.notifResumen);

  const [y, m] = (data.calendarMonth || '').split('-').map(Number);
  calendarViewDate = (y && m) ? new Date(y, m - 1, 1) : new Date();
  blockedDaysSet = new Set(data.blockedDays || []);
  renderCalendar();
}

/* --------------------------------------------------------
   Modales de resultado
   -------------------------------------------------------- */
function showModal(selector) {
  const modal = document.querySelector(selector);
  modal.classList.add('is-visible');
  modal.setAttribute('aria-hidden', 'false');
}
function hideModal(selector) {
  const modal = document.querySelector(selector);
  modal.classList.remove('is-visible');
  modal.setAttribute('aria-hidden', 'true');
}
document.querySelector('#perfil-success-close').addEventListener('click', () => hideModal('#perfil-success-modal'));
document.querySelector('#perfil-error-close').addEventListener('click', () => hideModal('#perfil-error-modal'));

/* --------------------------------------------------------
   Guardar cambios
   -------------------------------------------------------- */
document.querySelector('#perfil-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const daysInMonth = new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() + 1, 0).getDate();
  const updated = {
    ...profile,
    name: document.querySelector('#field-name').value.trim(),
    email: document.querySelector('#field-email').value.trim(),
    status: document.querySelector('#field-status').value,
    stack: [...selectedStack],
    notifPostulantes: document.querySelector('#pref-postulantes').checked,
    notifResumen: document.querySelector('#pref-resumen').checked,
    calendarMonth: `${calendarViewDate.getFullYear()}-${String(calendarViewDate.getMonth() + 1).padStart(2, '0')}`,
    blockedDays: [...blockedDaysSet]
  };

  const main = document.querySelector('#perfil-main');
  const subtitle = document.querySelector('#perfil-subtitle');
  const saveBtn = document.querySelector('#perfil-save-btn');
  main.classList.add('is-saving');
  subtitle.textContent = 'Ejecutando cambios, por favor espera…';
  saveBtn.disabled = true;

  try {
    if (window.DevMatchApi.enabled) {
      await window.DevMatchApi.updateProfile(updated);
    } else {
      saveDemoProfile(updated);
    }
    profile = updated;
    document.querySelector('#perfil-success-name').textContent = updated.name;
    showModal('#perfil-success-modal');
  } catch (error) {
    showModal('#perfil-error-modal');
  } finally {
    main.classList.remove('is-saving');
    subtitle.textContent = 'Modifica tus datos y disponibilidad';
    saveBtn.disabled = false;
  }
});

/* --------------------------------------------------------
   Carga inicial
   -------------------------------------------------------- */
async function loadProfile() {
  try {
    const data = window.DevMatchApi.enabled ? await window.DevMatchApi.getProfile() : readDemoProfile();
    paintProfile(data);
  } catch (error) {
    document.querySelector('#perfil-subtitle').textContent = 'No fue posible cargar tu perfil.';
  }
}

setupStackAdd();
loadProfile();


