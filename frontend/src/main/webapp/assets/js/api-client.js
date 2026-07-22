/*
 * Puente entre la interfaz y Spring Boot.
 * En la maqueta el meta devmatch-api-base queda vacío y se usa el modo demo.
 * Al integrar, usar: <meta name="devmatch-api-base" content="/api">
 */
(function () {
  // Leemos de config si existe, o auto-descubrimos el hostname
  const apiBase = (window.DEVMATCH_CONFIG && window.DEVMATCH_CONFIG.API_URL) 
                  ? window.DEVMATCH_CONFIG.API_URL 
                  : `http://${window.location.hostname}:3000/api`;
  
  // Extraemos el ID del usuario actual
  function getUserId() {
    const uid = localStorage.getItem('currentUserId');
    return (uid && uid !== 'null' && uid !== 'undefined') ? uid : 1;
  }
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
    enabled: true, // Forzamos true para que use la API real siempre
    
    // Rutas dinámicas para el usuario actual
    getRecommendations: () => request(`/users/${getUserId()}/matches`),
    getApplications: () => request(`/users/${getUserId()}/applications`),
    createApplication: (projectId) => request(`/applications`, { method: 'POST', body: { usuarioId: getUserId(), proyectoId: projectId } }),
    getProfile: () => request(`/users/${getUserId()}`),
    updateProfile: (profile) => request(`/users/${getUserId()}`, { method: 'PUT', body: profile }),
    
    getLeaderProjects: () => request(`/lider/proyectos?userId=${getUserId()}`),
    createLeaderProject: (project) => request('/lider/proyectos', { method: 'POST', body: { ...project, creadorId: getUserId() } }),

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
    getNotifications: (userId) => request(`/users/${userId}/notifications`),
    markNotificationRead: (notificationId) => request(`/notifications/${notificationId}/leida`, { method: 'PATCH' }),

    // Otras funciones...
  };
}());

