const APPLICATIONS_KEY = 'devmatch_applications';

function getDemoApplications() {
  try { return JSON.parse(sessionStorage.getItem(APPLICATIONS_KEY)) || []; }
  catch { return []; }
}

function renderApplications(applications) {
  const content = document.querySelector('#applications-content');
  const badges = document.querySelector('#application-badges');
  document.querySelector('#applications-meta').textContent = `total: ${applications.length} · confirmadas: 0 · nuevas: ${applications.length}`;

  if (!applications.length) {
    badges.replaceChildren();
    content.innerHTML = `
      <section class="empty-state" aria-label="Sin postulaciones">
        <div><strong>NO TIENES POSTULACIONES REGISTRADAS</strong><p>Explora oportunidades y postúlate al proyecto que mejor se adapte a tu perfil.</p></div>
        <a class="btn empty-state-link" href="proyectos.html">→ Ir a Proyectos</a>
      </section>`;
    return;
  }

  badges.innerHTML = `<span class="badge badge--yellow">⧖ ${applications.length} en evaluación</span>`;
  const rows = applications.map((application, index) => `
    <tr class="evaluating">
      <td>${String(index + 1).padStart(2, '0')}</td>
      <td><div class="project-name">${application.title}</div><div class="project-sub">#${application.id} · ${application.company}</div></td>
      <td><span class="badge badge--yellow">● En evaluación</span></td>
      <td><span class="match-score yellow">${application.match}%</span></td>
      <td><div class="timeline-block">Aplicado<strong>${application.appliedAt}</strong></div></td>
      <td><button class="btn btn--outline" disabled>⏱️ Esperando...</button></td>
    </tr>`).join('');
  content.innerHTML = `<table><thead><tr><th>#</th><th>Proyecto</th><th>Estado</th><th>Match</th><th>Timeline</th><th>Acción</th></tr></thead><tbody><tr><td colspan="6" class="section-label">Postulaciones en evaluación</td></tr>${rows}</tbody></table>`;
}

async function loadApplications() {
  try {
    const applications = window.DevMatchApi.enabled ? await window.DevMatchApi.getApplications() : getDemoApplications();
    renderApplications(applications);
  } catch (error) {
    document.querySelector('#applications-content').innerHTML = '<section class="empty-state"><div><strong>NO SE PUDIERON CARGAR LAS POSTULACIONES</strong><p>Verifica la conexión con el servidor e inténtalo de nuevo.</p></div></section>';
  }
}

loadApplications();



