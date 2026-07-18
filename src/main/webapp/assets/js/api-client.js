/*
 * Puente entre la interfaz y Spring Boot.
 * En la maqueta el meta devmatch-api-base queda vacío y se usa el modo demo.
 * Al integrar, usar: <meta name="devmatch-api-base" content="/api">
 */
(function () {
  const apiBase = (document.querySelector('meta[name="devmatch-api-base"]')?.content || '').replace(/\/$/, '');

  async function request(path, options = {}) {
    const response = await fetch(`${apiBase}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
      body: options.body ? JSON.stringify(options.body) : undefined
    });
    if (!response.ok) throw new Error(`API ${response.status}`);
    if (response.status === 204) return null;
    return response.json();
  }

  window.DevMatchApi = {
    enabled: Boolean(apiBase),
    getRecommendations: () => request('/proyectos/recomendados'),
    getApplications: () => request('/postulaciones'),
    createApplication: (projectId) => request('/postulaciones', { method: 'POST', body: { proyectoId: projectId } }),
    getLeaderProjects: () => request('/lider/proyectos'),
    createLeaderProject: (project) => request('/lider/proyectos', { method: 'POST', body: project }),

    // Un solo proyecto del líder (para el breadcrumb de Sprints/Postulantes/Métricas)
    getLeaderProject: (projectId) => request(`/lider/proyectos/${projectId}`),

    // Sprints / tareas
    getProjectTasks: (projectId) => request(`/lider/proyectos/${projectId}/sprints`),
    createProjectTask: (projectId, task) => request(`/lider/proyectos/${projectId}/sprints`, { method: 'POST', body: task }),
    updateProjectTask: (projectId, taskId, changes) => request(`/lider/proyectos/${projectId}/sprints/${taskId}`, { method: 'PATCH', body: changes }),

    // Postulantes
    getProjectApplicants: (projectId) => request(`/lider/proyectos/${projectId}/postulantes`),
    updateApplicantStatus: (projectId, applicantId, changes) => request(`/lider/proyectos/${projectId}/postulantes/${applicantId}`, { method: 'PATCH', body: changes }),
    simulateApplicantMatch: (projectId, applicantId) => request(`/lider/proyectos/${projectId}/postulantes/${applicantId}/simular`, { method: 'POST' }),

    // Métricas
    getProjectMetrics: (projectId) => request(`/lider/proyectos/${projectId}/metricas`),

    // Notificaciones (campana del navbar)
    getNotifications: () => request('/notificaciones'),
    markNotificationRead: (notificationId) => request(`/notificaciones/${notificationId}/leida`, { method: 'PATCH' }),

    // Mi Perfil
    getProfile: () => request('/perfil'),
    updateProfile: (profile) => request('/perfil', { method: 'PUT', body: profile })
  };
}());

