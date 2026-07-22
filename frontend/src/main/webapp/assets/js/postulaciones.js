const APPLICATIONS_KEY = 'devmatch_applications';

function getDemoApplications() {
  try { return JSON.parse(sessionStorage.getItem(APPLICATIONS_KEY)) || []; }
  catch { return []; }
}

function renderApplications(applications) {
  const content = document.querySelector('#applications-content');
  const badges = document.querySelector('#application-badges');

  const confirmadas = applications.filter(a => a.estado === 'aceptado').length;
  const nuevas = applications.length - confirmadas;

  document.querySelector('#applications-meta').textContent = `total: ${applications.length} · confirmadas: ${confirmadas} · nuevas: ${nuevas}`;

  if (!applications.length) {
    badges.replaceChildren();
    content.innerHTML = `
      <section class="empty-state" aria-label="Sin postulaciones">
        <strong>0 POSTULACIONES</strong>
        <p>Aún no te has postulado a ningún proyecto. El ecosistema está esperando tu talento. Explora las oportunidades disponibles.</p>
        <a class="empty-state-link" href="proyectos.html">Explorar Proyectos</a>
      </section>`;
    return;
  }

  let badgeHTML = '';
  if (nuevas > 0) badgeHTML += `<span class="badge badge--yellow">⏳ ${nuevas} en evaluación</span> `;
  if (confirmadas > 0) badgeHTML += `<span class="badge badge--green">✔ ${confirmadas} aceptada${confirmadas > 1 ? 's' : ''}</span>`;
  badges.innerHTML = badgeHTML;
  const ESTADO_UI = {
    nuevo: { badge: 'badge--yellow', label: '● Nuevo', cls: 'status-evaluating' },
    revision: { badge: 'badge--yellow', label: '● En evaluación', cls: 'status-evaluating' },
    pendiente: { badge: 'badge--yellow', label: '● Pendiente', cls: 'status-evaluating' },
    aceptado: { badge: 'badge--green', label: '✓ Aceptado', cls: 'status-aceptado' },
    rechazado: { badge: 'badge--red', label: '✕ Rechazado', cls: 'status-rechazado' }
  };

  const rows = applications.map((application, index) => {
    const st = ESTADO_UI[application.estado] || ESTADO_UI.pendiente;
    let actionButton = `<button class="btn btn--outline" disabled>⏱️ Esperando...</button>`;
    if (application.estado === 'aceptado') {
      if (application.linkContacto) {
        actionButton = `<a class="btn" style="background:var(--accent-green);color:var(--bg-dark);text-decoration:none;font-weight:700;padding:12px 24px;" href="${application.linkContacto}" target="_blank">Contactar Lider</a>`;
      } else {
        actionButton = `<button class="btn btn--outline" disabled>Revisa tu WhatsApp</button>`;
      }
    }

    return `
    <article class="app-card ${st.cls}">
      <div class="app-number">${String(index + 1).padStart(2, '0')}</div>
      <div>
        <div class="app-title">${application.title}</div>
        <div class="app-company">${application.id} · ${application.company}</div>
      </div>
      <div class="app-match">
        <span>Match Score</span>
        <strong class="yellow">${application.match}%</strong>
      </div>
      <div class="app-timeline">
        <span>Aplicado el</span>
        <strong>${application.appliedAt}</strong>
      </div>
      <div class="app-action">
        ${actionButton}
      </div>
    </article>`;
  }).join('');
  content.innerHTML = `<div class="app-grid">${rows}</div>`;
}

async function loadApplications() {
  try {
    let applications = [];
    if (window.DevMatchApi.enabled) {
      // 1. Obtenemos el perfil del usuario para cruzar habilidades
      const userProfile = await window.DevMatchApi.getProfile();
      const userStack = userProfile.stack || [];

      // 2. Obtenemos las postulaciones
      const dbApps = await window.DevMatchApi.getApplications();
      applications = dbApps.map(app => {
        const reqStack = app.proyecto.habilidades ? app.proyecto.habilidades.map(h => h.habilidad.nombre) : [];
        
        // Calculamos el match real: (Habilidades coincidentes / Total habilidades del proyecto)
        let matchScore = 100;
        if (reqStack.length > 0) {
          const coincidencias = reqStack.filter(skill => userStack.includes(skill)).length;
          matchScore = Math.round((coincidencias / reqStack.length) * 100);
        }

        return {
          id: `PRJ-${String(app.proyecto.id).padStart(3, '0')}`,
          title: app.proyecto.titulo,
          company: app.proyecto.creador ? app.proyecto.creador.nombre : 'Empresa Externa',
          match: matchScore, 
          estado: app.estado.toLowerCase() === 'en evaluación' ? 'revision' : app.estado.toLowerCase(),
          linkContacto: app.link_contacto || null,
          appliedAt: new Date(app.fecha_postulacion).toLocaleDateString()
        };
      });
    } else {
      applications = getDemoApplications();
    }
    renderApplications(applications);
  } catch (error) {
    document.querySelector('#applications-content').innerHTML = '<section class="empty-state"><div><strong>NO SE PUDIERON CARGAR LAS POSTULACIONES</strong><p>Verifica la conexión con el servidor e inténtalo de nuevo.</p></div></section>';
  }
}

loadApplications();



