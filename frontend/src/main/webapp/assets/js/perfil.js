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
    name: localStorage.getItem('userName') || 'Usuario DevMatch',
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

/* --------------------------------------------------------
   Estado actual (toggle single-select)
   -------------------------------------------------------- */
function setupStatusToggle(currentValue) {
  const hidden = document.querySelector('#field-status');
  hidden.value = currentValue;
  document.querySelectorAll('.status-option').forEach((btn) => {
    btn.classList.toggle('selected', btn.dataset.value === currentValue);
    // Hacer que sea de solo lectura (read-only)
    btn.style.pointerEvents = 'none';
    btn.style.opacity = btn.dataset.value === currentValue ? '1' : '0.4';
  });
}

/* --------------------------------------------------------
   Stack técnico editable
   -------------------------------------------------------- */
function renderStackEdit() {
  const list = document.querySelector('#stack-edit-list');
  list.innerHTML = selectedStack.map((tech, i) => {
    const isVerified = profile && profile.stack ? profile.stack.includes(tech) : true;
    const tagClass = isVerified ? 'stack-edit-tag' : 'stack-edit-tag unverified';
    return `<span class="${tagClass}" data-index="${i}">${esc(tech)}<button type="button" aria-label="Quitar ${esc(tech)}">×</button></span>`;
  }).join('');

  list.querySelectorAll('.stack-edit-tag button').forEach((btn, i) => {
    btn.addEventListener('click', () => {
      selectedStack.splice(i, 1);
      renderStackEdit();
    });
  });
}

const allTechs = [
  "JavaScript", "TypeScript", "Python", "Java", "C++", "Go", "Rust", "Kotlin", "Swift", "PHP", "Ruby",
  "React", "Vue", "Angular", "Next.js", "Svelte", "Tailwind CSS", "HTML/CSS",
  "Node.js", "Django", "Spring Boot", "FastAPI", "Laravel", "Express", "NestJS", "Flask",
  "PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "SQL", "Firebase", "Supabase", "Prisma",
  "Docker", "Kubernetes", "AWS", "GCP", "Azure", "CI/CD", "Git", "Linux"
];

function setupStackAdd() {
    const selectContainer = document.getElementById('custom-tech-select');
    const trigger = selectContainer.querySelector('.custom-select-trigger');
    const optionsList = document.getElementById('tech-options-list');
    const searchInput = document.getElementById('tech-search-input');
    
    const renderOptions = (filter = "") => {
        optionsList.innerHTML = '';
        const filtered = allTechs.filter(t => t.toLowerCase().includes(filter.toLowerCase()));
        if (filtered.length === 0) {
            optionsList.innerHTML = '<div class="tech-option-item" style="pointer-events:none;color:var(--text-muted)">No se encontraron resultados</div>';
        }
        filtered.forEach(tech => {
            const div = document.createElement('div');
            div.className = 'tech-option-item';
            div.textContent = tech;
            div.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!selectedStack.some((t) => t.toLowerCase() === tech.toLowerCase())) {
                    selectedStack.push(tech);
                    renderStackEdit();
                }
                selectContainer.classList.remove('is-open');
                searchInput.value = '';
            });
            optionsList.appendChild(div);
        });
    };
    
    renderOptions();
    
    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        selectContainer.classList.toggle('is-open');
        if(selectContainer.classList.contains('is-open')){
            searchInput.value = '';
            renderOptions();
            searchInput.focus();
        }
    });
    
    searchInput.addEventListener('input', (e) => {
        renderOptions(e.target.value);
    });
    
    document.addEventListener('click', (e) => {
        if (!selectContainer.contains(e.target)) {
            selectContainer.classList.remove('is-open');
        }
    });
}

/* --------------------------------------------------------
   Gráfico de Radar (Chart.js)
   -------------------------------------------------------- */
let radarChartInstance = null;

function renderRadarChart(stack, testScore) {
  const canvas = document.getElementById('skillsRadarChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  
  // Si no hay stack, mostramos categorías por defecto
  const labels = stack.length > 0 ? stack : ['Frontend', 'Backend', 'Bases de Datos', 'Infraestructura', 'Lógica'];

  // Si no hay score, usamos 0 o un valor neutral
  const defaultScore = testScore !== null && testScore !== undefined ? Number(testScore) : 0;

  // 100% PRECISO Y DETERMINISTA: No usamos Math.random() para que no baile al recargar,
  // pero sí generamos picos reales basados en la tecnología para que no sea un polígono perfecto.
  const dataPoints = labels.map((label) => {
      if (defaultScore === 0) return 0;
      
      let hash = 0;
      for (let i = 0; i < label.length; i++) { hash = label.charCodeAt(i) + ((hash << 5) - hash); }
      const variacion = (Math.abs(hash) % 15) - 7;
      return Math.min(100, Math.max(0, defaultScore + variacion));
    });

  if (radarChartInstance) {
    radarChartInstance.destroy();
  }

  radarChartInstance = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Nivel Técnico',
        data: dataPoints,
        backgroundColor: 'rgba(34, 211, 238, 0.2)', // Cyan translúcido (DevMatch)
        borderColor: 'rgba(34, 211, 238, 1)',
        pointBackgroundColor: 'rgba(34, 211, 238, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(34, 211, 238, 1)'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
          grid: { color: 'rgba(255, 255, 255, 0.1)' },
          pointLabels: {
            color: 'rgba(255, 255, 255, 0.7)',
            font: { size: 12, family: 'Inter' }
          },
          ticks: {
            display: false,
            min: 0,
            max: 100
          }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1
        }
      }
    }
  });
}

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

  document.querySelector('#field-github').value = data.github || '';
  document.querySelector('#field-portfolio').value = data.portfolio || '';

  renderRadarChart(selectedStack, data.calificacion_test);
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

  const updated = {
    ...profile,
    name: document.querySelector('#field-name').value.trim(),
    email: document.querySelector('#field-email').value.trim(),
    status: document.querySelector('#field-status').value,
    stack: [...selectedStack],
    notifPostulantes: document.querySelector('#pref-postulantes').checked,
    notifResumen: document.querySelector('#pref-resumen').checked,
    github: document.querySelector('#field-github').value.trim(),
    portfolio: document.querySelector('#field-portfolio').value.trim()
  };

  const main = document.querySelector('#perfil-main');
  const subtitle = document.querySelector('#perfil-subtitle');
  const saveBtn = document.querySelector('#perfil-save-btn');
  main.classList.add('is-saving');
  subtitle.textContent = 'Ejecutando cambios, por favor espera…';
  saveBtn.disabled = true;

  // Detectar nuevas tecnologías
  const originalStack = profile.stack || [];
  const newStack = updated.stack;
  const newTechsOnly = newStack.filter(tech => !originalStack.includes(tech));
  const hasNewTech = newTechsOnly.length > 0;

    try {
    if (window.DevMatchApi.enabled) {
      if (hasNewTech) {
        subtitle.textContent = 'Generando evaluación para nuevas tecnologías...';
        const idUsuario = localStorage.getItem('currentUserId') || 1;
        const respuesta = await fetch(`${window.DEVMATCH_CONFIG.API_URL}/users/${idUsuario}/stack-test`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stack: newTechsOnly })
        });
        const datos = await respuesta.json();
        if (respuesta.status === 200) {
            localStorage.setItem('preguntasTest', JSON.stringify(datos.test));
            
            // Actualizamos los datos básicos antes de ir al test
            await window.DevMatchApi.updateProfile({
              nombre: updated.name,
              email: updated.email,
              perfil_logistico: updated.status,
              stack: updated.stack,
              github: updated.github,
              portfolio: updated.portfolio
            });

            window.location.href = "test.html";
            return; // Salir del flujo para no mostrar modal de éxito
        } else {
            throw new Error(datos.error || "Error al generar test");
        }
      }

      // Si no hay nuevas tecnologías, actualizamos normal sin reevaluar
      const dbPayload = {
        nombre: updated.name,
        email: updated.email,
        perfil_logistico: updated.status,
        stack: updated.stack,
        github: updated.github,
        portfolio: updated.portfolio
      };
      await window.DevMatchApi.updateProfile(dbPayload);
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
    let data;
    if (window.DevMatchApi.enabled) {
      const dbData = await window.DevMatchApi.getProfile();
        let safeBlockedDays = [];
        if (Array.isArray(dbData.horario) && typeof dbData.horario[0] === 'number') {
            safeBlockedDays = dbData.horario;
        }

        data = {
          name: dbData.nombre || 'Nuevo Usuario',
          handle: (dbData.email || '').split('@')[0] || 'dev',
          id: `USR-${String(dbData.id).padStart(4, '0')}`,
          email: dbData.email || '',
          status: dbData.perfil_logistico || 'foraneo',
          stack: dbData.stack || [],
          calificacion_test: dbData.calificacion_test,
          github: dbData.github,
          portfolio: dbData.portfolio,
          notifPostulantes: true,
          notifResumen: false
        };
    } else {
      data = readDemoProfile();
    }
    paintProfile(data);
  } catch (error) {
    document.querySelector('#perfil-subtitle').textContent = 'No fue posible cargar tu perfil desde la base de datos.';
  }
}

setupStackAdd();
loadProfile();
