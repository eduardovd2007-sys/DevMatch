/* ==========================================================
   sprints.js
   Vista "Sprints" de un proyecto del líder.
   Mismo patrón que lider-proyecto.js / postulaciones.js:
   - Si window.DevMatchApi.enabled === true  -> usa fetch (Spring Boot).
   - Si está en false                        -> modo demo con sessionStorage,
     con datos semilla SOLO la primera vez que se abre un proyecto,
     para poder probar la interacción sin backend.
   ========================================================== */

const SPRINT_COUNT = 3;
const params = new URLSearchParams(window.location.search);
const PROJECT_ID = params.get('proyecto');

function tasksKey(projectId) { return `devmatch_sprints_${projectId}`; }

function esc(text) {
  const element = document.createElement('span');
  element.textContent = text ?? '';
  return element.innerHTML;
}

/* --------------------------------------------------------
   Datos demo: SOLO se usan si el proyecto no tiene tareas
   guardadas todavía y la API sigue apagada. En cuanto Spring
   Boot esté activo (meta devmatch-api-base), esta función
   deja de invocarse porque loadTasks() llama directo a la API.
   -------------------------------------------------------- */
function seedDemoTasks(projectId) {
  return [
    { id: 'TASK-001', sprint: 1, nombre: 'Creación del Figma', encargado: 'Francisco Raúl', inicio: '2026-02-20', fin: '2026-05-01', estado: 'hecho' },
    { id: 'TASK-002', sprint: 2, nombre: 'Traspasar base de datos en MySQL', encargado: 'Yahaziel Díaz', inicio: '2026-05-13', fin: '2026-05-15', estado: 'en_proceso' },
    { id: 'TASK-003', sprint: 2, nombre: 'Elaboración de vistas móviles', encargado: 'L. César', inicio: '2026-07-12', fin: '2026-09-12', estado: 'no_iniciada' }
  ];
}

function readDemoTasks(projectId) {
  try {
    const saved = JSON.parse(sessionStorage.getItem(tasksKey(projectId)));
    if (saved !== null) return saved;
  } catch { /* noop */ }
  const seeded = seedDemoTasks(projectId);
  saveDemoTasks(projectId, seeded);
  return seeded;
}

function saveDemoTasks(projectId, tasks) {
  sessionStorage.setItem(tasksKey(projectId), JSON.stringify(tasks));
}

/* --------------------------------------------------------
   Utilidades de fecha / estado
   -------------------------------------------------------- */
function formatDate(isoDate) {
  if (!isoDate) return '—';
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year.slice(2)}`;
}

function humanDuration(inicio, fin) {
  if (!inicio || !fin) return '—';
  const days = Math.max(1, Math.round((new Date(fin) - new Date(inicio)) / 86400000));
  if (days < 14) return `${days} días`;
  if (days < 60) return `${Math.round(days / 7)} semanas`;
  return `${Math.round(days / 30)} meses`;
}

const ESTADOS = ['no_iniciada', 'en_proceso', 'hecho'];
const ESTADO_META = {
  no_iniciada: { label: 'No iniciada', pill: 'status-pill--muted' },
  en_proceso: { label: 'En Proceso', pill: 'status-pill--yellow' },
  hecho: { label: 'Hecho', pill: 'status-pill--green' }
};

function nextEstado(current) {
  const index = ESTADOS.indexOf(current);
  return ESTADOS[(index + 1) % ESTADOS.length];
}

/* --------------------------------------------------------
   Estado de la pestaña de sprint, calculado a partir de
   las tareas que contiene (no es un campo fijo).
   -------------------------------------------------------- */
function sprintStatus(tasksInSprint) {
  if (!tasksInSprint.length) return 'no_iniciado';
  if (tasksInSprint.every((task) => task.estado === 'hecho')) return 'finalizada';
  if (tasksInSprint.some((task) => task.estado === 'en_proceso' || task.estado === 'hecho')) return 'en_curso';
  return 'no_iniciado';
}

const SPRINT_STATUS_LABEL = { finalizada: 'Finalizada', en_curso: 'En Curso', no_iniciado: 'No iniciado' };

let allTasks = [];
let activeSprint = 1;

/* --------------------------------------------------------
   Render
   -------------------------------------------------------- */
function renderTabs() {
  const tabsEl = document.querySelector('#sprint-tabs');
  let html = '';
  for (let sprint = 1; sprint <= SPRINT_COUNT; sprint += 1) {
    const status = sprintStatus(allTasks.filter((task) => task.sprint === sprint));
    html += `<button type="button" class="sprint-tab${sprint === activeSprint ? ' is-active' : ''}" data-status="${status}" data-sprint="${sprint}" role="tab" aria-selected="${sprint === activeSprint}">Sprint 0${sprint}: ${SPRINT_STATUS_LABEL[status]}</button>`;
  }
  tabsEl.innerHTML = html;
  tabsEl.querySelectorAll('.sprint-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      activeSprint = Number(tab.dataset.sprint);
      renderTabs();
      renderTable();
    });
  });
}

function taskRow(task, index) {
  const meta = ESTADO_META[task.estado] || ESTADO_META.no_iniciada;
  return `<tr data-task-id="${esc(task.id)}">
    <td>${String(index + 1).padStart(2, '0')}</td>
    <td><div class="task-name">${esc(task.nombre)}</div></td>
    <td>${esc(task.encargado)}</td>
    <td><div class="task-timeline">Inicio<strong>${formatDate(task.inicio)}</strong>Duración<strong>${humanDuration(task.inicio, task.fin)}</strong></div></td>
    <td><div class="task-dots"><span class="lit-gray"></span><span class="lit-yellow"></span><span class="lit-green"></span></div></td>
    <td><button type="button" class="status-pill ${meta.pill}" data-toggle-estado="${esc(task.id)}" title="Click para cambiar el estado">${meta.label}</button></td>
  </tr>`;
}

function renderTable() {
  const body = document.querySelector('#sprint-tasks-body');
  const tasksInSprint = allTasks.filter((task) => task.sprint === activeSprint);

  if (!tasksInSprint.length) {
    body.innerHTML = `<tr><td colspan="6"><div class="sprint-empty"><strong>Este sprint no tiene tareas todavía</strong>Usa "+ Ingresar Nueva Tarea" para comenzar a planearlo.</div></td></tr>`;
    return;
  }

  body.innerHTML = tasksInSprint.map((task, index) => taskRow(task, index)).join('');

  body.querySelectorAll('[data-toggle-estado]').forEach((button) => {
    button.addEventListener('click', () => toggleEstado(button.dataset.toggleEstado));
  });
}

/* --------------------------------------------------------
   Cambiar estado de una tarea (click en la pastilla).
   Optimista en UI; si la API rechaza el cambio, se revierte.
   -------------------------------------------------------- */
async function toggleEstado(taskId) {
  const task = allTasks.find((item) => item.id === taskId);
  if (!task) return;
  const previous = task.estado;
  task.estado = nextEstado(previous);
  renderTabs();
  renderTable();

  try {
    if (window.DevMatchApi.enabled) {
      await window.DevMatchApi.updateProjectTask(PROJECT_ID, taskId, { estado: task.estado });
    } else {
      saveDemoTasks(PROJECT_ID, allTasks);
    }
  } catch (error) {
    task.estado = previous;
    renderTabs();
    renderTable();
  }
}

/* --------------------------------------------------------
   Modal: registrar nueva tarea
   -------------------------------------------------------- */
const taskModal = document.querySelector('#task-modal');

function openTaskForm() {
  taskModal.classList.add('is-visible');
  taskModal.setAttribute('aria-hidden', 'false');
  setTimeout(() => document.querySelector('[name="nombre"]')?.focus(), 100);
}

function closeTaskForm() {
  taskModal.classList.remove('is-visible');
  taskModal.setAttribute('aria-hidden', 'true');
}

document.querySelector('#open-task-form').addEventListener('click', openTaskForm);
document.querySelector('#close-task-form').addEventListener('click', closeTaskForm);
taskModal.addEventListener('click', (event) => { if (event.target === taskModal) closeTaskForm(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') { closeTaskForm(); hideResultModal('#task-success-modal'); hideResultModal('#task-error-modal'); } });

function showResultModal(selector) {
  const modal = document.querySelector(selector);
  modal.classList.add('is-visible');
  modal.setAttribute('aria-hidden', 'false');
}
function hideResultModal(selector) {
  const modal = document.querySelector(selector);
  modal.classList.remove('is-visible');
  modal.setAttribute('aria-hidden', 'true');
}
document.querySelector('#task-success-close').addEventListener('click', () => hideResultModal('#task-success-modal'));
document.querySelector('#task-error-close').addEventListener('click', () => hideResultModal('#task-error-modal'));

document.querySelector('#task-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const inicio = data.get('inicio');
  const fin = data.get('fin');

  if (new Date(fin) <= new Date(inicio)) {
    document.querySelector('#task-date-error').style.display = 'block';
    return;
  }
  document.querySelector('#task-date-error').style.display = 'none';

  const task = {
    id: `TASK-${String(Date.now()).slice(-6)}`,
    sprint: activeSprint,
    nombre: data.get('nombre'),
    encargado: data.get('encargado'),
    inicio,
    fin,
    estado: 'no_iniciada'
  };

  try {
    if (window.DevMatchApi.enabled) {
      await window.DevMatchApi.createProjectTask(PROJECT_ID, task);
      await loadTasks();
    } else {
      allTasks.push(task);
      saveDemoTasks(PROJECT_ID, allTasks);
      renderTabs();
      renderTable();
    }
    event.currentTarget.reset();
    closeTaskForm();
    showResultModal('#task-success-modal');
  } catch (error) {
    showResultModal('#task-error-modal');
  }
});

/* --------------------------------------------------------
   Encabezado / breadcrumb con el nombre real del proyecto
   -------------------------------------------------------- */
async function loadProjectHeader() {
  try {
    let project = null;
    if (window.DevMatchApi.enabled) {
      project = await window.DevMatchApi.getLeaderProject(PROJECT_ID);
    } else {
      const projects = JSON.parse(sessionStorage.getItem('devmatch_leader_projects') || '[]');
      project = projects.find((item) => item.id === PROJECT_ID) || null;
    }
    const label = project ? `${project.title} · #${project.id}` : `#${PROJECT_ID}`;
    document.querySelector('#breadcrumb-project').textContent = label;
    document.querySelector('#session-meta').textContent = `workspace:/proyectos/${PROJECT_ID}/sprints · session:AL`;
  } catch {
    document.querySelector('#breadcrumb-project').textContent = `#${PROJECT_ID}`;
  }
}

/* --------------------------------------------------------
   Carga inicial
   -------------------------------------------------------- */
async function loadTasks() {
  try {
    allTasks = window.DevMatchApi.enabled
      ? await window.DevMatchApi.getProjectTasks(PROJECT_ID)
      : readDemoTasks(PROJECT_ID);

    const firstSprintWithTasks = allTasks.find((task) => task.sprint)?.sprint;
    activeSprint = firstSprintWithTasks || 1;

    renderTabs();
    renderTable();
  } catch (error) {
    document.querySelector('#sprint-tasks-body').innerHTML = '<tr><td colspan="6" class="load-error">No fue posible cargar las tareas del sprint.</td></tr>';
  }
}

if (!PROJECT_ID) {
  document.querySelector('#breadcrumb-project').textContent = 'proyecto no especificado';
  document.querySelector('#sprint-tasks-body').innerHTML = '<tr><td colspan="6" class="load-error">Abre esta vista desde "Sprints" en una tarjeta de Líder Proyecto.</td></tr>';
} else {
  loadProjectHeader();
  loadTasks();
}



