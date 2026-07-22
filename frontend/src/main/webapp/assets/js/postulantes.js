/* ==========================================================
   postulantes.js
   Vista "Postulantes al Proyecto" de un proyecto del líder.
   Mismo patrón que lider-proyecto.js / postulaciones.js:
   - Si window.DevMatchApi.enabled === true  -> usa fetch (Spring Boot).
   - Si está en false                        -> modo demo con sessionStorage,
     con datos semilla SOLO la primera vez que se abre un proyecto.
   ========================================================== */

const params = new URLSearchParams(window.location.search);
const PROJECT_ID = params.get('proyecto');

function applicantsKey(projectId) { return `devmatch_postulantes_${projectId}`; }

function esc(text) {
  const element = document.createElement('span');
  element.textContent = text ?? '';
  return element.innerHTML;
}

/* --------------------------------------------------------
   Datos demo (solo si el proyecto no tiene postulantes
   guardados todavía y la API sigue apagada).
   -------------------------------------------------------- */
function seedDemoApplicants() {
  return [
    { id: 'CAND-001', nombre: 'Carlos Fletcher', usuario: '@c_fletcher', experiencia: '4 yrs exp', match: 92, stack: ['Python', 'FastAPI', 'React', 'LLMs'], estado: 'nuevo' },
    { id: 'CAND-002', nombre: 'Valentina Orozco', usuario: '@val_orozco', experiencia: '6 yrs exp', match: 89, stack: ['Python', 'ML/AI', 'PostgreSQL'], estado: 'revision' },
    { id: 'CAND-003', nombre: 'Mateo Ríos', usuario: '@mateo_dev', experiencia: '3 yrs exp', match: 86, stack: ['React', 'Node.js', 'OpenAI'], estado: 'revision' },
    { id: 'CAND-004', nombre: 'Lucía Mendoza', usuario: '@lucia_m', experiencia: '2 yrs exp', match: 78, stack: ['React', 'TypeScript', 'CSS'], estado: 'nuevo' },
    { id: 'CAND-005', nombre: 'Diego Vargas', usuario: '@d_vargas', experiencia: '5 yrs exp', match: 74, stack: ['FastAPI', 'Go', 'Redis'], estado: 'revision' },
    { id: 'CAND-006', nombre: 'Sofía Castellanos', usuario: '@s_castle', experiencia: '2 yrs exp', match: 68, stack: ['Python', 'Pandas', 'SQL'], estado: 'pendiente' },
    { id: 'CAND-007', nombre: 'Andrés Molina', usuario: '@a_molina', experiencia: '1 yr exp', match: 61, stack: ['React', 'Firebase', 'Tailwind'], estado: 'pendiente' }
  ];
}

function readDemoApplicants(projectId) {
  try {
    const saved = JSON.parse(sessionStorage.getItem(applicantsKey(projectId)));
    if (saved !== null) return saved;
  } catch { /* noop */ }
  const seeded = seedDemoApplicants();
  saveDemoApplicants(projectId, seeded);
  return seeded;
}

function saveDemoApplicants(projectId, applicants) {
  sessionStorage.setItem(applicantsKey(projectId), JSON.stringify(applicants));
}

/* --------------------------------------------------------
   Utilidades
   -------------------------------------------------------- */
const ESTADO_META = {
  nuevo: { label: 'Nuevo Candidato', pill: 'status-pill--green' },
  revision: { label: 'En revisión', pill: 'status-pill--yellow' },
  pendiente: { label: 'Pendiente', pill: 'status-pill--muted' },
  aceptado: { label: 'Aceptado', pill: 'status-pill--green' },
  rechazado: { label: 'Rechazado', pill: 'status-pill--red' }
};
const CYCLE_ESTADOS = ['nuevo', 'revision', 'pendiente'];

function nextCycleEstado(current) {
  const index = CYCLE_ESTADOS.indexOf(current);
  return index === -1 ? CYCLE_ESTADOS[0] : CYCLE_ESTADOS[(index + 1) % CYCLE_ESTADOS.length];
}

const AVATAR_COLORS = ['#2ee6a6', '#7c8cff', '#f0c94a', '#ff4d5e', '#4ac8f0', '#c88af0'];
function avatarColor(name) {
  const sum = [...name].reduce((total, char) => total + char.charCodeAt(0), 0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}
function initials(name) {
  return name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

function matchClass(match) {
  if (match > 85) return 'high';
  if (match >= 60) return 'mid';
  return 'low';
}

let allApplicants = [];
let sortDescending = true;

/* --------------------------------------------------------
   Render
   -------------------------------------------------------- */
function applicantRow(applicant) {
  const meta = ESTADO_META[applicant.estado] || ESTADO_META.pendiente;
  return `<div class="applicant-row" data-applicant-id="${esc(applicant.id)}">
    <div class="applicant-candidate">
      <div class="mini-avatar" style="background:${avatarColor(applicant.nombre)}">${esc(initials(applicant.nombre))}</div>
      <div>
        <div class="applicant-name">${esc(applicant.nombre)}</div>
        <div class="applicant-sub">${esc(applicant.usuario)} · ${esc(applicant.experiencia)}</div>
      </div>
    </div>
    <div class="applicant-match ${matchClass(applicant.match)}">${applicant.match}%</div>
    <div class="applicant-stack">${applicant.stack.map((tech) => `<span>${esc(tech)}</span>`).join('')}</div>
    <button type="button" class="status-pill ${meta.pill}" data-toggle-estado="${esc(applicant.id)}" title="Click para cambiar el estado de revisión">${meta.label}</button>
    <button type="button" class="applicant-action" data-open-detail="${esc(applicant.id)}">Ver_Perfil</button>
  </div>`;
}

function renderApplicants() {
  const body = document.querySelector('#applicants-body');
  const total = document.querySelector('#applicants-total');
  const subtitle = document.querySelector('#applicants-subtitle');

  total.textContent = `total: ${allApplicants.length}`;
  subtitle.textContent = `Revisando ${allApplicants.length} candidato${allApplicants.length === 1 ? '' : 's'} en cola`;

  if (!allApplicants.length) {
    body.innerHTML = `<div class="applicants-empty"><strong>Todavía no hay postulantes</strong>En cuanto un candidato aplique a este proyecto aparecerá aquí.</div>`;
    return;
  }

  const sorted = [...allApplicants].sort((a, b) => (sortDescending ? b.match - a.match : a.match - b.match));
  const top = sorted.filter((applicant) => applicant.match > 85);
  const standard = sorted.filter((applicant) => applicant.match >= 60 && applicant.match <= 85);
  const low = sorted.filter((applicant) => applicant.match < 60);

  const section = (label, list) => list.length
    ? `<div class="applicants-group-label"><span>${label}</span><span>${list.length} resultado${list.length === 1 ? '' : 's'}</span></div>${list.map(applicantRow).join('')}`
    : '';

  body.innerHTML = [
    section('// TOP CANDIDATOS — MATCH &gt; 85%', top),
    section('// CANDIDATOS ESTÁNDAR — MATCH 60-85%', standard),
    section('// EN EVALUACIÓN — MATCH &lt; 60%', low)
  ].join('');

  body.querySelectorAll('[data-toggle-estado]').forEach((button) => {
    button.addEventListener('click', () => toggleEstado(button.dataset.toggleEstado));
  });
  body.querySelectorAll('[data-open-detail]').forEach((button) => {
    button.addEventListener('click', () => openDetail(button.dataset.openDetail));
  });
}

document.querySelector('#sort-match').addEventListener('click', () => {
  sortDescending = !sortDescending;
  document.querySelector('#sort-match').textContent = sortDescending ? '⤒ Mayor Match' : '⤓ Menor Match';
  renderApplicants();
});

/* --------------------------------------------------------
   Cambiar estado de revisión (click en la pastilla de la fila)
   -------------------------------------------------------- */
async function toggleEstado(applicantId) {
  const applicant = allApplicants.find((item) => String(item.id) === String(applicantId));
  if (!applicant) return;
  const previous = applicant.estado;
  applicant.estado = nextCycleEstado(previous);
  renderApplicants();

  try {
    if (window.DevMatchApi.enabled) {
      await window.DevMatchApi.updateApplicantStatus(PROJECT_ID, applicantId, { estado: applicant.estado });
    } else {
      saveDemoApplicants(PROJECT_ID, allApplicants);
      if (window.addNotification) {
        window.addNotification(
          'estado_postulacion', 
          `Tu postulación a <b>PRJ-${PROJECT_ID}</b> pasó a revisión`, 
          `estado: ${applicant.estado.toUpperCase()}`
        );
      }
    }
  } catch (error) {
    applicant.estado = previous;
    renderApplicants();
  }
}

/* --------------------------------------------------------
   Modal de detalle / simular match / aceptar / rechazar
   -------------------------------------------------------- */
const applicantModal = document.querySelector('#applicant-modal');

function closeDetail() {
  applicantModal.classList.remove('is-visible');
  applicantModal.setAttribute('aria-hidden', 'true');
}
document.querySelector('#close-applicant-modal').addEventListener('click', closeDetail);
applicantModal.addEventListener('click', (event) => { if (event.target === applicantModal) closeDetail(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeDetail(); });

function renderDetailBody(applicant) {
  const meta = ESTADO_META[applicant.estado] || ESTADO_META.pendiente;
  document.querySelector('#applicant-modal-body').innerHTML = `
    <div class="applicant-detail-header">
      <div class="mini-avatar" style="background:${avatarColor(applicant.nombre)}">${esc(initials(applicant.nombre))}</div>
      <div>
        <h2>${esc(applicant.nombre)}</h2>
        <p>${esc(applicant.usuario)} · Perfil: ${esc(applicant.experiencia)}</p>
      </div>
    </div>
    <div class="applicant-detail-meta">
      <div><strong>${applicant.match}%</strong><span>Match actual</span></div>
      <div><strong class="${meta.pill}" style="font-size:.8rem;">${meta.label}</strong><span>Estado</span></div>
    </div>
    <div class="applicant-stack">${applicant.stack.map((tech) => `<span>${esc(tech)}</span>`).join('')}</div>
    
    <div style="width:100%; max-width:280px; margin: 24px auto;">
      <canvas id="applicantRadar"></canvas>
    </div>
    
    <div id="whatsapp-prompt" style="display:none; margin-top: 20px; padding: 16px; background: var(--bg-panel-2); border-radius: 8px; border: 1px solid var(--border-subtle);">
      <p style="margin-bottom: 12px; color: var(--text-primary); font-size: .82rem;">Introduce el link de WhatsApp para el contacto:</p>
      <input type="url" id="wa-link-input" placeholder="https://wa.me/..." style="width: 100%; padding: 10px 12px; background: var(--bg-dark); border: 1px solid var(--border-subtle); color: var(--accent-green); border-radius: 6px; margin-bottom: 16px; font-family: var(--font-mono); font-size: .75rem; outline: none;">
      <div class="applicant-detail-actions" style="margin-top: 0; grid-template-columns: 1fr 1fr;">
        <button type="button" class="action-accept" id="confirm-wa-btn">✓ Confirmar</button>
        <button type="button" class="action-reject" id="cancel-wa-btn">✕ Cancelar</button>
      </div>
    </div>

    <div class="applicant-detail-actions" id="main-actions">
      <button type="button" class="action-accept" id="detail-accept">✓ Aprobar Evaluación</button>
      <button type="button" class="action-reject" id="detail-reject">✕ Rechazar</button>
    </div>
    <div class="applicant-simulate-log" id="detail-log"></div>`;

  document.querySelector('#detail-accept').addEventListener('click', () => {
    document.querySelector('#main-actions').style.display = 'none';
    document.querySelector('#whatsapp-prompt').style.display = 'block';
  });

  document.querySelector('#confirm-wa-btn').addEventListener('click', () => {
    const link = document.querySelector('#wa-link-input').value;
    if (link.trim() === '') {
      alert('Debes ingresar un link válido.');
      return;
    }
    setApplicantEstado(applicant.id, 'aceptado', link.trim());
  });

  document.querySelector('#cancel-wa-btn').addEventListener('click', () => {
    // Si cancela, regresa a las acciones principales sin cambiar estado
    document.querySelector('#whatsapp-prompt').style.display = 'none';
    document.querySelector('#main-actions').style.display = 'flex';
  });

  document.querySelector('#detail-reject').addEventListener('click', () => setApplicantEstado(applicant.id, 'rechazado'));
}

function openDetail(applicantId) {
  const applicant = allApplicants.find((item) => String(item.id) === String(applicantId));
  if (!applicant) return;
  renderDetailBody(applicant);
  applicantModal.classList.add('is-visible');
  applicantModal.setAttribute('aria-hidden', 'false');

  if (window.applicantChartInstance) {
    window.applicantChartInstance.destroy();
  }
  
  const ctx = document.getElementById('applicantRadar').getContext('2d');
  
  // Generating deterministic mock scores based on tech name length (score between 6 and 10)
  const data = applicant.stack.map(tech => 6 + (tech.length % 5)); 
  
  window.applicantChartInstance = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: applicant.stack,
      datasets: [{
        label: 'Dominio',
        data: data,
        backgroundColor: 'rgba(46, 230, 166, 0.2)',
        borderColor: '#2ee6a6',
        pointBackgroundColor: '#2ee6a6',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#2ee6a6'
      }]
    },
    options: {
      scales: {
        r: {
          angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
          grid: { color: 'rgba(255, 255, 255, 0.1)' },
          pointLabels: { color: '#8892b0', font: { size: 11, family: 'Courier New' } },
          ticks: { display: false, min: 0, max: 10 }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

async function setApplicantEstado(applicantId, estado, linkContacto = null) {
  const applicant = allApplicants.find((item) => String(item.id) === String(applicantId));
  if (!applicant) return;
  const previous = applicant.estado;
  applicant.estado = estado;

  try {
    if (window.DevMatchApi.enabled) {
      await window.DevMatchApi.updateApplicantStatus(PROJECT_ID, applicantId, { estado, link_contacto: linkContacto });
    } else {
      saveDemoApplicants(PROJECT_ID, allApplicants);
      if (window.addNotification) {
        let text = `estado: ${estado.toUpperCase()}`;
        if (linkContacto) text += ` · Contacto: ${linkContacto}`;
        window.addNotification(
          'estado_postulacion', 
          `Tu postulación a <b>PRJ-${PROJECT_ID}</b> pasó a ${estado}`, 
          text
        );
      }
    }
    renderApplicants();
    closeDetail();
  } catch (error) {
    applicant.estado = previous;
  }
}

/* --------------------------------------------------------
   "Simular Match": mientras no hay backend con el motor de
   matching real, este botón deja explícito en el propio modal
   que es una simulación local, y usa el endpoint dedicado en
   cuanto la API está activa.
   -------------------------------------------------------- */
async function simulateMatch(applicantId) {
  const applicant = allApplicants.find((item) => item.id === applicantId);
  if (!applicant) return;
  const log = document.querySelector('#detail-log');
  log.classList.add('is-visible');
  log.textContent = '> Recalculando compatibilidad de stack...';

  try {
    if (window.DevMatchApi.enabled) {
      const result = await window.DevMatchApi.simulateApplicantMatch(PROJECT_ID, applicantId);
      applicant.match = result.match;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 500));
      applicant.match = Math.min(99, Math.max(40, applicant.match + Math.round((Math.random() - 0.4) * 6)));
      saveDemoApplicants(PROJECT_ID, allApplicants);
    }
    log.textContent = `> Nuevo match calculado: ${applicant.match}% ✔`;
    renderApplicants();
    renderDetailBody(applicant);
    document.querySelector('#detail-log').classList.add('is-visible');
    document.querySelector('#detail-log').textContent = `> Nuevo match calculado: ${applicant.match}% ✔`;
  } catch (error) {
    log.textContent = '> No fue posible simular el match. Intenta de nuevo.';
  }
}

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
    const label = project ? `${project.titulo || project.title} · #${project.id}` : `#${PROJECT_ID}`;
    document.querySelector('#breadcrumb-project').textContent = label;
    document.querySelector('#session-meta').textContent = `workspace:/proyectos/${PROJECT_ID}/postulantes · session:AL`;
  } catch {
    document.querySelector('#breadcrumb-project').textContent = `#${PROJECT_ID}`;
  }
}

/* --------------------------------------------------------
   Carga inicial
   -------------------------------------------------------- */
async function loadApplicants() {
  try {
    if (window.DevMatchApi.enabled) {
      const dbApplicants = await window.DevMatchApi.getProjectApplicants(PROJECT_ID);
      
      // Necesitamos el proyecto actual para saber qué stack requiere y calcular el match
      const project = await window.DevMatchApi.getLeaderProject(PROJECT_ID);
      const reqStack = project.habilidades ? project.habilidades.map(h => h.habilidad.nombre) : [];

      allApplicants = dbApplicants.map(app => {
        const userStackObj = app.usuario.stack;
        let userStack = [];
        if (Array.isArray(userStackObj)) userStack = userStackObj;
        else if (typeof userStackObj === 'string') {
          try { userStack = JSON.parse(userStackObj); } catch (e) {}
        }

        let matchScore = 100;
        if (reqStack.length > 0) {
          const coincidencias = reqStack.filter(skill => userStack.includes(skill)).length;
          matchScore = Math.round((coincidencias / reqStack.length) * 100);
        }

        return {
          id: app.id,
          nombre: app.usuario.nombre,
          usuario: `@USR-${String(app.usuario.id).padStart(3, '0')}`,
          experiencia: app.usuario.perfil_logistico || 'No especificado',
          match: matchScore,
          stack: userStack.length ? userStack : ['Sin tecnologías'],
          estado: app.estado.toLowerCase() === 'en evaluación' ? 'revision' : app.estado.toLowerCase()
        };
      });
    } else {
      allApplicants = readDemoApplicants(PROJECT_ID);
    }
    renderApplicants();
  } catch (error) {
    document.querySelector('#applicants-body').innerHTML = '<p class="load-error">No fue posible cargar los postulantes.</p>';
  }
}

if (!PROJECT_ID) {
  document.querySelector('#breadcrumb-project').textContent = 'proyecto no especificado';
  document.querySelector('#applicants-body').innerHTML = '<p class="load-error">Abre esta vista desde "Ver Postulantes" en una tarjeta de Líder Proyecto.</p>';
} else {
  loadProjectHeader();
  loadApplicants();
}



