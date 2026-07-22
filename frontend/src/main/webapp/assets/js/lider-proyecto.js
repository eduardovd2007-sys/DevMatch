const LEADER_PROJECTS_KEY = 'devmatch_leader_projects';

// Sin datos de ejemplo: el estado inicial es vacío (como en el Figma
// "Hub_Proyectos_Reposo"). Los proyectos solo aparecen cuando el usuario
// los registra desde el modal, o cuando Java los devuelva desde la BD.
const starterProjects = [];

function readDemoLeaderProjects() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(LEADER_PROJECTS_KEY));
    return saved === null ? starterProjects : saved;
  } catch { return starterProjects; }
}

function saveLeaderProjects(projects) {
  sessionStorage.setItem(LEADER_PROJECTS_KEY, JSON.stringify(projects));
}

function esc(text) {
  const element = document.createElement('span');
  element.textContent = text;
  return element.innerHTML;
}

window.deleteProject = async function(projectId) {
  if(!confirm("¿Estás seguro que deseas eliminar este proyecto permanentemente?")) return;
  try {
    if (window.DevMatchApi && window.DevMatchApi.enabled) {
      const resp = await fetch(`${window.DEVMATCH_CONFIG.API_URL}/projects/${projectId}`, { method: 'DELETE' });
      if(!resp.ok) throw new Error("Fallo la eliminación");
      await loadLeaderProjects();
    } else {
      let projects = readDemoLeaderProjects();
      projects = projects.filter(p => String(p.id) !== String(projectId));
      saveLeaderProjects(projects);
      renderLeaderProjects(projects);
    }
  } catch(e) {
    alert("Error al eliminar proyecto: " + e.message);
  }
};

/* --------------------------------------------------------
   Cada tarjeta lleva: window-bar (los 3 puntitos) +
   leader-card-body (quien lleva el padding real del contenido).
   -------------------------------------------------------- */
function renderLeaderProjects(projects) {
  const target = document.querySelector('#leader-projects');

  if (!projects.length) {
    target.innerHTML = `
      <button class="empty-project-card" type="button" id="empty-new-project">
        <div class="plus-icon">＋</div>
        <strong>No tienes proyectos</strong>
        <b>Crea una nueva iniciativa</b>
        <small>Click para iniciar</small>
      </button>`;
    document.querySelector('#empty-new-project').addEventListener('click', openForm);
    return;
  }

  target.innerHTML = projects.map((project) => `
    <article class="leader-card" data-leader-project-id="${esc(project.id)}">
      <div class="leader-card-body">
        <div class="card-status">
          <span class="status-indicator"></span> ACTIVE_BUILD 
          <span class="project-id-badge">#${esc(project.id)}</span>
        </div>
        <h2>${esc(project.title)}</h2>
        <p>${esc(project.description)}</p>
        
        <div class="project-mini-data">
          <div class="data-item">
            <span class="data-label">PLAZO</span>
            <strong>${esc(project.duration)}</strong>
          </div>
          <div class="data-item">
            <span class="data-label">EQUIPO</span>
            <strong>${esc(project.team)}</strong>
          </div>
        </div>

        <div class="leader-tags">
          ${project.tags.map((tag) => `<span>${esc(tag)}</span>`).join('')}
        </div>
        
        <div class="card-actions">
          <button type="button" class="card-secondary" data-action="metricas">Métricas</button>
          <button type="button" class="card-secondary" data-action="sprints">Sprints</button>
          <button type="button" class="card-secondary" style="color: #ff3b30; border-color: #ff3b30;" onclick="deleteProject('${esc(project.id)}')">Eliminar</button>
        </div>
        <button type="button" class="card-applicants" data-action="postulantes">Revisar Postulantes</button>
      </div>
    </article>`).join('') + `
    <button class="new-initiative-card" type="button" id="grid-new-project">
      <div class="plus-icon">＋</div>
      <strong>Crear nueva iniciativa</strong>
    </button>`;

  document.querySelector('#grid-new-project').addEventListener('click', openForm);

  // Navegación hacia las vistas de detalle del proyecto (Métricas / Sprints / Postulantes).
  // Cada tarjeta lleva su id en data-leader-project-id; se propaga por query string
  // para que metricas.js / sprints.js / postulantes.js sepan de qué proyecto pedir datos a la API.
  target.querySelectorAll('.leader-card').forEach((card) => {
    const projectId = card.dataset.leaderProjectId;
    card.querySelector('[data-action="metricas"]').addEventListener('click', () => {
      window.location.href = `metricas-proyecto.html?proyecto=${encodeURIComponent(projectId)}`;
    });
    card.querySelector('[data-action="sprints"]').addEventListener('click', () => {
      window.location.href = `sprints.html?proyecto=${encodeURIComponent(projectId)}`;
    });
    card.querySelector('[data-action="postulantes"]').addEventListener('click', () => {
      window.location.href = `postulantes.html?proyecto=${encodeURIComponent(projectId)}`;
    });
  });
}

/* ===============================
   Modal del formulario "Registrar Nueva Iniciativa"
   =============================== */
const modal = document.querySelector('#leader-modal');

function openForm() {
  modal.classList.add('is-visible');
  modal.setAttribute('aria-hidden', 'false');
  setTimeout(() => document.querySelector('[name="title"]').focus(), 100);
}

function closeForm() {
  modal.classList.remove('is-visible');
  modal.setAttribute('aria-hidden', 'true');
}

document.querySelector('#open-project-form').addEventListener('click', openForm);
document.querySelector('#close-project-form').addEventListener('click', closeForm);
modal.addEventListener('click', (event) => { if (event.target === modal) closeForm(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeForm(); });

/* ===============================
   Selector de stack (tags clicables tipo checkbox)
   =============================== */
const stackHiddenInput = document.querySelector('#stack-hidden');
let selectedStack = {}; // ahora es un diccionario: { "React": "Básico" }

document.querySelectorAll('.stack-tag').forEach((tagButton) => {
  tagButton.addEventListener('click', () => {
    const tech = tagButton.dataset.tech;
    
    // Máquina de estados: Ninguno -> Básico -> Autónomo -> Experto -> Ninguno
    if (!selectedStack[tech]) {
      selectedStack[tech] = 'Básico';
      tagButton.classList.add('selected', 'level-basico');
      tagButton.innerHTML = `${tech} <span class="tech-level">[Básico]</span>`;
    } else if (selectedStack[tech] === 'Básico') {
      selectedStack[tech] = 'Autónomo';
      tagButton.classList.replace('level-basico', 'level-autonomo');
      tagButton.innerHTML = `${tech} <span class="tech-level">[Autónomo]</span>`;
    } else if (selectedStack[tech] === 'Autónomo') {
      selectedStack[tech] = 'Experto';
      tagButton.classList.replace('level-autonomo', 'level-experto');
      tagButton.innerHTML = `${tech} <span class="tech-level">[Experto]</span>`;
    } else {
      delete selectedStack[tech];
      tagButton.classList.remove('selected', 'level-experto');
      tagButton.innerHTML = tech;
    }

    const stackArray = Object.keys(selectedStack).map(k => ({ nombre: k, nivel: selectedStack[k] }));
    stackHiddenInput.value = JSON.stringify(stackArray);
  });
});

function resetStackPicker() {
  selectedStack = {};
  stackHiddenInput.value = '';
  document.querySelectorAll('.stack-tag.selected').forEach((tag) => {
    tag.classList.remove('selected', 'level-basico', 'level-autonomo', 'level-experto');
    tag.innerHTML = tag.dataset.tech;
  });
}

/* ===============================
   Modales de resultado: éxito / error
   =============================== */
function showResultModal(modalSelector) {
  const resultModal = document.querySelector(modalSelector);
  resultModal.classList.add('is-visible');
  resultModal.setAttribute('aria-hidden', 'false');
}

function hideResultModal(modalSelector) {
  const resultModal = document.querySelector(modalSelector);
  resultModal.classList.remove('is-visible');
  resultModal.setAttribute('aria-hidden', 'true');
}

document.querySelector('#success-close').addEventListener('click', () => hideResultModal('#success-modal'));
document.querySelector('#error-close').addEventListener('click', () => hideResultModal('#error-modal'));

/* ===============================
   Envío del formulario
   =============================== */
document.querySelector('#leader-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  let stackArray = [];
  try { stackArray = JSON.parse(data.get('stack')); } catch(e) {}
  
  if (stackArray.length === 0) {
    document.querySelector('#stack-error').style.display = 'block';
    return;
  }
  document.querySelector('#stack-error').style.display = 'none';

  const project = {
    id: `PRJ-${String(Date.now()).slice(-3)}`,
    title: data.get('title'),
    description: data.get('description'),
    stack: data.get('stack'),
    duration: data.get('duration'),
    team: data.get('team'),
    horas_requeridas: parseInt(data.get('hours')) || 15,
    tags: stackArray.map((t) => t.nombre),
    stackLevels: stackArray
  };

  try {
    if (window.DevMatchApi.enabled) {
      const resp = await window.DevMatchApi.createLeaderProject(project);
      if (resp && resp.proyecto && resp.proyecto.id) {
        project.id = `PRJ-${String(resp.proyecto.id).padStart(3, '0')}`;
      }
      await loadLeaderProjects();
    } else {
      const projects = readDemoLeaderProjects();
      saveLeaderProjects([...projects, project]);
      renderLeaderProjects([...projects, project]);
    }

    form.reset();
    resetStackPicker();
    closeForm();

    // Llenar el modal de éxito con los datos reales del proyecto recién creado
    document.querySelector('#success-subtitle').textContent = `> ${project.title} · #${project.id}`;
    document.querySelector('#success-log').innerHTML = `
      <div>&gt; Inicializar repositorio... <span class="log-ok">[ LISTO ]</span></div>
      <div>&gt; Repositorio hecho <span class="log-ok">devmatch/dev/proyectos/${project.id.toLowerCase()}</span></div>
      <div>&gt; Conocimiento de Perfil requerido: ${project.tags.map((tech) => `[${tech}]`).join(' ')}</div>
      <div>&gt; <span class="log-ok">Proyecto ${project.id} creado con éxito ✔</span></div>
    `;
    document.querySelector('#result-id').textContent = `#${project.id}`;
    document.querySelector('#result-vacancies').textContent = project.team;

    showResultModal('#success-modal');
  } catch (error) {
    console.error(error);
    document.querySelector('#error-modal h2').textContent = `Error: ${error.message}`;
    showResultModal('#error-modal');
  }
});

/* ===============================
   Carga inicial
   =============================== */
async function loadLeaderProjects() {
  try {
    renderLeaderProjects(window.DevMatchApi.enabled ? await window.DevMatchApi.getLeaderProjects() : readDemoLeaderProjects());
  } catch (error) {
    document.querySelector('#leader-projects').innerHTML = '<p class="load-error">No fue posible cargar los proyectos.</p>';
  }
}

loadLeaderProjects();


