/* Datos de demostración. Java podrá sustituirlos por el resultado de GET /api/proyectos/recomendados. */
let projects = {
  'PRJ-014': { title: 'Sistema de Gestión de Inventarios', company: 'LogiTech Solutions', published: 'hace 2 días', match: 92, duration: '10 sem', availability: 'Plazo: full-time', roles: '2 roles', roleDetail: 'Backend + Frontend', sprint: 'Sprint 01', start: 'Inicio: inmediato', description: 'Sistema ERP modular para gestión de inventario en tiempo real. El equipo construirá endpoints REST con Java Spring Boot, una interfaz de usuario con React y una capa de reportería analítica.', stack: ['Java', 'Spring Boot', 'React', 'MySQL', 'Maven', 'REST APIs', 'Docker'], requirements: ['Mínimo 2 años de experiencia en Java o Spring Boot', 'Conocimiento de patrones REST y diseño de APIs', 'Experiencia con React y manejo de estado'] },
  'PRJ-019': { title: 'App de Salud Mental', company: 'MindBridge Labs', published: 'hace 1 día', match: 78, duration: '12 sem', availability: 'Plazo: híbrido', roles: '1 rol', roleDetail: 'Flutter Developer', sprint: 'Sprint 02', start: 'Inicio: 4 agosto', description: 'Aplicación de acompañamiento emocional que permite registrar hábitos, consultar recursos de bienestar y conectar con profesionales de forma segura.', stack: ['Flutter', 'Firebase', 'Dart', 'UX Research', 'Figma'], requirements: ['Experiencia construyendo interfaces móviles accesibles', 'Conocimiento de Firebase Authentication y Firestore', 'Sensibilidad para diseñar productos centrados en las personas'] },
  'PRJ-022': { title: 'Plataforma E-Commerce B2B', company: 'Comercial Nexus', published: 'hace 3 días', match: 74, duration: '14 sem', availability: 'Plazo: full-time', roles: '2 roles', roleDetail: 'Frontend + Integraciones', sprint: 'Sprint 01', start: 'Inicio: inmediato', description: 'Portal de compras empresariales con catálogos por volumen, precios personalizados y pagos integrados para distribuidores.', stack: ['Next.js', 'TypeScript', 'Stripe', 'PostgreSQL', 'Tailwind CSS'], requirements: ['Dominio de TypeScript y componentes reutilizables', 'Experiencia integrando APIs de pago', 'Conocimiento de flujos de compra y pruebas de interfaz'] },
  'PRJ-008': { title: 'Motor de Matching IA', company: 'TalentFlow AI', published: 'hace 5 días', match: 71, duration: '16 sem', availability: 'Plazo: remoto', roles: '1 rol', roleDetail: 'Backend / IA', sprint: 'Investigación', start: 'Inicio: 11 agosto', description: 'Servicio inteligente para recomendar perfiles y oportunidades mediante señales de habilidades, experiencia y preferencias de cada usuario.', stack: ['Python', 'FastAPI', 'LLMs', 'PostgreSQL', 'Docker'], requirements: ['Experiencia creando APIs con Python', 'Bases de recuperación de información o modelos de lenguaje', 'Capacidad para medir y documentar la calidad de recomendaciones'] },
  'PRJ-031': { title: 'Dashboard Analítico IoT', company: 'SensorGrid', published: 'hace 1 semana', match: 65, duration: '8 sem', availability: 'Plazo: part-time', roles: '2 roles', roleDetail: 'Frontend + Node.js', sprint: 'Sprint 03', start: 'Inicio: 18 agosto', description: 'Panel en tiempo real para visualizar lecturas de sensores, detectar alertas y administrar dispositivos conectados de una red industrial.', stack: ['React', 'Node.js', 'MQTT', 'Chart.js', 'MongoDB'], requirements: ['Experiencia consumiendo datos en tiempo real', 'Conocimiento de visualización de métricas', 'Manejo básico de mensajería pub/sub'] },
  'PRJ-037': { title: 'Sistema de Pagos Fintech', company: 'NovaPay', published: 'hace 4 días', match: 60, duration: '18 sem', availability: 'Plazo: full-time', roles: '1 rol', roleDetail: 'Backend Developer', sprint: 'Arquitectura', start: 'Inicio: 25 agosto', description: 'Plataforma de procesamiento de pagos diseñada para conciliación, trazabilidad de transacciones y notificaciones confiables.', stack: ['Go', 'PostgreSQL', 'Kafka', 'Redis', 'Docker'], requirements: ['Conocimiento de servicios concurrentes', 'Experiencia con bases de datos relacionales', 'Interés por sistemas seguros y observables'] }
};

const $ = (selector) => document.querySelector(selector);
let currentProjectId = 'PRJ-014';
let lastFocusedElement;

function matchClass(match) { return match >= 80 ? 'badge--green' : 'badge--yellow'; }

function selectProject(projectId) {
  document.querySelectorAll('.project-item').forEach((item) => {
    const active = item.dataset.projectId === projectId;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  renderProject(projectId);
}

function renderProjectList() {
  const ids = Object.keys(projects);
  $('#project-count').textContent = ids.length;
  $('#project-list-items').innerHTML = ids.map((id) => {
    const project = projects[id];
    const green = project.match >= 80;
    const stack = Array.isArray(project.stack) ? project.stack.slice(0, 3).join(' · ') : project.stack;
    return `<button class="project-item ${green ? 'match-green' : 'match-yellow'}" type="button" data-project-id="${id}" aria-pressed="false"><span class="item-top">${project.title} <span class="item-id">#${id}</span></span><span class="item-match ${green ? 'green' : 'yellow'}">${project.match}%</span><span class="item-stack">${stack}</span><span class="progress-track"><span class="progress-fill ${green ? 'green' : 'yellow'}" style="width: ${project.match}%;"></span></span></button>`;
  }).join('');
  document.querySelectorAll('.project-item').forEach((item) => item.addEventListener('click', () => selectProject(item.dataset.projectId)));
}

function renderProject(projectId) {
  const project = projects[projectId];
  if (!project) return;
  currentProjectId = projectId;
  const isGreen = project.match >= 80;
  $('#match-badge').className = `badge ${matchClass(project.match)}`;
  $('#match-badge').textContent = `✓ ${project.match}% Match`;
  $('#detail-title').textContent = project.title;
  $('#detail-subtitle').textContent = `#${projectId} · Empresa: ${project.company} · Publicado: ${project.published}`;
  $('#stat-duration').textContent = project.duration;
  $('#stat-availability').textContent = project.availability;
  $('#stat-roles').textContent = project.roles;
  $('#stat-role-detail').textContent = project.roleDetail;
  $('#stat-sprint').textContent = project.sprint;
  $('#stat-start').textContent = project.start;
  $('#stat-match').textContent = `${project.match}%`;
  $('#stat-match').classList.toggle('green', isGreen);
  $('#stat-match').classList.toggle('yellow', !isGreen);
  $('#detail-description').textContent = project.description;
  $('#detail-stack').replaceChildren(...project.stack.map((skill) => Object.assign(document.createElement('span'), { className: 'tag', textContent: skill })));
  $('#detail-requirements').replaceChildren(...project.requirements.map((requirement) => Object.assign(document.createElement('li'), { textContent: requirement })));
  const savedApplications = JSON.parse(sessionStorage.getItem('devmatch_applications') || '[]');
  const applied = $('#apply-button').dataset.applied === projectId || savedApplications.some((application) => application.id === projectId);
  $('#apply-button').disabled = applied;
  $('#apply-button').innerHTML = applied ? '✓ Postulación enviada' : 'Postularme <span aria-hidden="true">→</span>';
}

function closeSuccess() {
  $('#success-overlay').classList.remove('is-visible');
  $('#success-overlay').setAttribute('aria-hidden', 'true');
  if (lastFocusedElement) lastFocusedElement.focus();
}

$('#apply-button').addEventListener('click', async () => {
  const project = projects[currentProjectId];
  lastFocusedElement = document.activeElement;
  const applyButton = $('#apply-button');
  applyButton.disabled = true;
  applyButton.textContent = 'Enviando postulación...';
  try {
    if (window.DevMatchApi.enabled) {
      await window.DevMatchApi.createApplication(currentProjectId);
    } else {
      const key = 'devmatch_applications';
      const applications = JSON.parse(sessionStorage.getItem(key) || '[]');
      if (!applications.some((application) => application.id === currentProjectId)) {
        applications.push({ id: currentProjectId, title: project.title, company: project.company, match: project.match, appliedAt: 'ahora' });
        sessionStorage.setItem(key, JSON.stringify(applications));
      }
    }
  } catch (error) {
    applyButton.disabled = false;
    applyButton.innerHTML = 'Intentar de nuevo <span aria-hidden="true">→</span>';
    $('#success-message').textContent = 'No fue posible enviar tu postulación. Inténtalo nuevamente.';
    $('#success-overlay').classList.add('is-visible');
    $('#success-overlay').setAttribute('aria-hidden', 'false');
    return;
  }
  applyButton.dataset.applied = currentProjectId;
  applyButton.disabled = true;
  applyButton.innerHTML = '✓ Postulación enviada';
  $('#success-message').textContent = `Tu perfil fue postulado a “${project.title}”.`;
  $('#success-overlay').classList.add('is-visible');
  $('#success-overlay').setAttribute('aria-hidden', 'false');
  setTimeout(() => $('#success-close').focus(), 250);
});

$('#success-close').addEventListener('click', closeSuccess);
$('#success-overlay').addEventListener('click', (event) => { if (event.target === event.currentTarget) closeSuccess(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && $('#success-overlay').classList.contains('is-visible')) closeSuccess(); });

async function loadRecommendations() {
  if (window.DevMatchApi.enabled) {
    try {
      const response = await window.DevMatchApi.getRecommendations();
      if (Array.isArray(response) && response.length) {
        projects = Object.fromEntries(response.map((project) => [project.id, project]));
        currentProjectId = response[0].id;
      }
    } catch (error) {
      console.warn('No se cargaron recomendaciones del servidor; se muestran datos demo.', error);
    }
  }
  renderProjectList();
  selectProject(currentProjectId);
}

loadRecommendations();



