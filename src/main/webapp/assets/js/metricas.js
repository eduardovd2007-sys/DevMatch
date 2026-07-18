/* ==========================================================
   metricas.js
   Vista "Métricas del Proyecto" de un proyecto del líder.
   Mismo patrón que sprints.js / postulantes.js:
   - Si window.DevMatchApi.enabled === true  -> usa fetch (Spring Boot),
     GET /api/lider/proyectos/{id}/metricas.
   - Si está en false                        -> modo demo con sessionStorage,
     con datos semilla SOLO la primera vez que se abre un proyecto.
   Todos los gráficos (radar, matriz, dona, línea) se generan en SVG
   puro a partir de la forma de datos de abajo, así que en cuanto la
   API entregue números reales no hay que tocar el render, solo el
   objeto que consume cada función build*().
   ========================================================== */

const params = new URLSearchParams(window.location.search);
const PROJECT_ID = params.get('proyecto');

function metricsKey(projectId) { return `devmatch_metricas_${projectId}`; }

function esc(text) {
  const element = document.createElement('span');
  element.textContent = text ?? '';
  return element.innerHTML;
}

const SVG_NS = 'http://www.w3.org/2000/svg';
function svgEl(tag, attrs = {}) {
  const el = document.createElementNS(SVG_NS, tag);
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
  return el;
}
function svgTitle(text) {
  const title = svgEl('title');
  title.textContent = text;
  return title;
}

/* --------------------------------------------------------
   Datos demo (solo si el proyecto no tiene métricas guardadas
   todavía y la API sigue apagada). Refleja el mismo layout que
   la vista de Figma: 6 ejes de balance técnico, matriz SPR1-SPR6,
   dona de horas por rol e historial de 3 disciplinas.
   -------------------------------------------------------- */
function seedDemoMetrics() {
  return {
    balance: [
      { label: 'Backend', value: 96 },
      { label: 'Frontend', value: 84 },
      { label: 'AI/ML', value: 79 },
      { label: 'DevOps', value: 86 },
      { label: 'DB', value: 90 },
      { label: 'Testing', value: 76 }
    ],
    sprintWindows: {
      sprints: ['SPR1', 'SPR2', 'SPR3', 'SPR4', 'SPR5', 'SPR6'],
      rows: [
        { role: 'Backend', cells: ['opt', 'opt', 'warn', 'opt', 'opt', 'opt'] },
        { role: 'Frontend', cells: ['opt', 'warn', 'opt', 'opt', 'vacio', 'opt'] },
        { role: 'AI / ML', cells: ['warn', 'opt', 'opt', 'no_disponible', 'opt', 'opt'] },
        { role: 'DevOps', cells: ['opt', 'opt', 'opt', 'warn', 'opt', 'no_disponible'] },
        { role: 'Testing', cells: ['vacio', 'opt', 'opt', 'opt', 'warn', 'opt'] },
        { role: 'DB/Infra', cells: ['opt', 'no_disponible', 'warn', 'opt', 'opt', 'opt'] }
      ]
    },
    hoursByRole: [
      { role: 'Backend', pct: 35, color: '#2ee6a6' },
      { role: 'Frontend', pct: 25, color: '#7c8cff' },
      { role: 'AI / ML', pct: 20, color: '#f0c94a' },
      { role: 'DevOps', pct: 12, color: '#ff4d5e' },
      { role: 'Testing', pct: 8, color: '#4ac8f0' }
    ],
    totalHours: 1240,
    sprintHistory: {
      sprints: ['SPR1', 'SPR2', 'SPR3', 'SPR4', 'SPR5', 'SPR6'],
      series: [
        { name: 'Backend', color: '#2ee6a6', values: [35, 48, 63, 73, 80, 90] },
        { name: 'Frontend', color: '#7c8cff', values: [38, 47, 50, 57, 62, 70] },
        { name: 'AI/ML', color: '#f0c94a', values: [22, 32, 42, 52, 60, 68] }
      ]
    }
  };
}

function readDemoMetrics(projectId) {
  try {
    const saved = JSON.parse(sessionStorage.getItem(metricsKey(projectId)));
    if (saved !== null) return saved;
  } catch { /* noop */ }
  const seeded = seedDemoMetrics();
  sessionStorage.setItem(metricsKey(projectId), JSON.stringify(seeded));
  return seeded;
}

/* --------------------------------------------------------
   Radar / hexágono: "Balance técnico actual del equipo"
   -------------------------------------------------------- */
function buildRadar(container, axes) {
  container.innerHTML = '';
  if (!axes || !axes.length) {
    container.innerHTML = '<p class="metric-loading">Sin datos de balance técnico todavía.</p>';
    return;
  }

  const size = 320;
  const cx = size / 2;
  const cy = size / 2 - 6;
  const maxR = 100;
  const n = axes.length;

  const angleOf = (i) => (i * (360 / n) - 90) * (Math.PI / 180);
  const pointAt = (i, r) => ({ x: cx + r * Math.cos(angleOf(i)), y: cy + r * Math.sin(angleOf(i)) });

  const svg = svgEl('svg', { class: 'radar-svg', viewBox: `0 0 ${size} ${size - 20}`, width: '100%', height: '300' });

  // Anillos de referencia (25/50/75/100%)
  [0.25, 0.5, 0.75, 1].forEach((fraction) => {
    const points = axes.map((_, i) => { const p = pointAt(i, maxR * fraction); return `${p.x},${p.y}`; }).join(' ');
    svg.appendChild(svgEl('polygon', { class: 'radar-grid', points }));
  });

  // Ejes
  axes.forEach((_, i) => {
    const p = pointAt(i, maxR);
    svg.appendChild(svgEl('line', { class: 'radar-axis', x1: cx, y1: cy, x2: p.x, y2: p.y }));
  });

  // Polígono de datos
  const dataPoints = axes.map((axis, i) => pointAt(i, maxR * (Math.max(0, Math.min(100, axis.value)) / 100)));
  svg.appendChild(svgEl('polygon', { class: 'radar-shape', points: dataPoints.map((p) => `${p.x},${p.y}`).join(' ') }));

  // Vértices con tooltip nativo
  dataPoints.forEach((p, i) => {
    const point = svgEl('circle', { class: 'radar-point', cx: p.x, cy: p.y, r: 4 });
    point.appendChild(svgTitle(`${axes[i].label}: ${axes[i].value}%`));
    svg.appendChild(point);
  });

  // Etiquetas de eje
  axes.forEach((axis, i) => {
    const p = pointAt(i, maxR + 20);
    const angleDeg = i * (360 / n);
    let anchor = 'middle';
    if (angleDeg > 10 && angleDeg < 170) anchor = 'start';
    else if (angleDeg > 190 && angleDeg < 350) anchor = 'end';
    const text = svgEl('text', { x: p.x, y: p.y, 'text-anchor': anchor, 'dominant-baseline': 'middle' });
    text.textContent = axis.label;
    svg.appendChild(text);
  });

  const wrap = document.createElement('div');
  wrap.className = 'radar-wrap';
  wrap.appendChild(svg);
  container.appendChild(wrap);
}

/* --------------------------------------------------------
   Matriz: "Ventanas óptimas de sprint"
   -------------------------------------------------------- */
const MATRIX_LABEL = { opt: 'OPT', warn: 'WARN', no_disponible: '—', vacio: '' };

function buildMatrix(container, data) {
  container.innerHTML = '';
  if (!data || !data.rows || !data.rows.length) {
    container.innerHTML = '<p class="metric-loading">Sin datos de sprints todavía.</p>';
    return;
  }

  const wrap = document.createElement('div');
  wrap.className = 'matrix-wrap';

  const headCells = data.sprints.map((sprint) => `<th>${esc(sprint)}</th>`).join('');
  const bodyRows = data.rows.map((row) => {
    const cells = row.cells.map((status, i) => {
      const cls = `matrix-cell matrix-cell--${status}`;
      const label = MATRIX_LABEL[status] ?? '';
      const title = status === 'vacio' ? `${esc(row.role)} · ${esc(data.sprints[i])}: sin dato` : `${esc(row.role)} · ${esc(data.sprints[i])}: ${label}`;
      return `<td><div class="${cls}" title="${title}">${esc(label)}</div></td>`;
    }).join('');
    return `<tr><td class="matrix-role">${esc(row.role)}</td>${cells}</tr>`;
  }).join('');

  wrap.innerHTML = `
    <table class="matrix-table">
      <thead><tr><th class="matrix-role-head"></th>${headCells}</tr></thead>
      <tbody>${bodyRows}</tbody>
    </table>
    <div class="matrix-legend">
      <span><i class="opt"></i>Óptimo</span>
      <span><i class="warn"></i>Atención</span>
      <span><i class="no_disponible"></i>No disponible</span>
    </div>`;

  container.appendChild(wrap);
}

/* --------------------------------------------------------
   Dona: "Distribución de horas por rol"
   -------------------------------------------------------- */
function buildDonut(container, roles, totalHours) {
  container.innerHTML = '';
  if (!roles || !roles.length) {
    container.innerHTML = '<p class="metric-loading">Sin datos de horas todavía.</p>';
    return;
  }

  const size = 190;
  const r = 70;
  const strokeWidth = 26;
  const circumference = 2 * Math.PI * r;
  const cx = size / 2;
  const cy = size / 2;

  const svg = svgEl('svg', { viewBox: `0 0 ${size} ${size}`, width: size, height: size });
  const rotated = svgEl('g', { transform: `rotate(-90 ${cx} ${cy})` });

  let offset = 0;
  roles.forEach((role) => {
    const dash = (role.pct / 100) * circumference;
    const circle = svgEl('circle', {
      class: 'donut-segment',
      cx, cy, r,
      fill: 'none',
      stroke: role.color,
      'stroke-width': strokeWidth,
      'stroke-dasharray': `${dash} ${circumference - dash}`,
      'stroke-dashoffset': -offset
    });
    circle.appendChild(svgTitle(`${role.role}: ${role.pct}%`));
    rotated.appendChild(circle);
    offset += dash;
  });

  svg.appendChild(rotated);

  const holder = document.createElement('div');
  holder.className = 'donut-svg-holder';
  holder.appendChild(svg);
  const center = document.createElement('div');
  center.className = 'donut-center';
  center.innerHTML = `<strong>${esc(totalHours)}</strong><span>hrs / sprint</span>`;
  holder.appendChild(center);

  const legend = document.createElement('div');
  legend.className = 'donut-legend';
  legend.innerHTML = roles.map((role) => `
    <div class="donut-legend-item">
      <i style="background:${esc(role.color)}"></i>
      <b>${esc(role.role)}</b>
      <span class="pct">${role.pct}%</span>
    </div>`).join('');

  const wrap = document.createElement('div');
  wrap.className = 'donut-wrap';
  wrap.append(holder, legend);
  container.appendChild(wrap);
}

/* --------------------------------------------------------
   Línea: "Historial de sprints"
   -------------------------------------------------------- */
function buildLineChart(container, data) {
  container.innerHTML = '';
  if (!data || !data.series || !data.series.length) {
    container.innerHTML = '<p class="metric-loading">Sin historial de sprints todavía.</p>';
    return;
  }

  const width = 640;
  const height = 260;
  const padLeft = 34;
  const padRight = 16;
  const padTop = 14;
  const padBottom = 28;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const maxValue = Math.max(100, ...data.series.flatMap((serie) => serie.values));
  const n = data.sprints.length;
  const xAt = (i) => padLeft + (n === 1 ? 0 : (i * chartW) / (n - 1));
  const yAt = (value) => padTop + chartH * (1 - value / maxValue);

  const svg = svgEl('svg', { class: 'line-svg', viewBox: `0 0 ${width} ${height}`, width: '100%', height: '260' });

  // Grid horizontal + etiquetas del eje Y
  [0, 25, 50, 75, 100].forEach((tick) => {
    const y = yAt(tick);
    svg.appendChild(svgEl('line', { class: 'line-grid', x1: padLeft, y1: y, x2: width - padRight, y2: y }));
    const label = svgEl('text', { x: padLeft - 10, y: y + 3, 'text-anchor': 'end' });
    label.textContent = tick;
    svg.appendChild(label);
  });

  // Etiquetas del eje X
  data.sprints.forEach((sprint, i) => {
    const label = svgEl('text', { x: xAt(i), y: height - 8, 'text-anchor': 'middle' });
    label.textContent = sprint;
    svg.appendChild(label);
  });

  // Series
  data.series.forEach((serie) => {
    const points = serie.values.map((value, i) => `${xAt(i)},${yAt(value)}`).join(' ');
    svg.appendChild(svgEl('polyline', { class: 'line-path', points, stroke: serie.color }));
    serie.values.forEach((value, i) => {
      const point = svgEl('circle', { class: 'line-point', cx: xAt(i), cy: yAt(value), r: 3.5, fill: serie.color });
      point.appendChild(svgTitle(`${data.sprints[i]} · ${serie.name}: ${value}`));
      svg.appendChild(point);
    });
  });

  const wrap = document.createElement('div');
  wrap.className = 'line-wrap';
  wrap.appendChild(svg);

  const legend = document.createElement('div');
  legend.className = 'line-legend';
  legend.innerHTML = data.series.map((serie) => `<span><i style="background:${esc(serie.color)}"></i>${esc(serie.name)}</span>`).join('');
  wrap.appendChild(legend);

  container.appendChild(wrap);
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
    const label = project ? `${project.title} · #${project.id}` : `#${PROJECT_ID}`;
    document.querySelector('#breadcrumb-project').textContent = label;
    document.querySelector('#session-meta').textContent = `workspace:/proyectos/${PROJECT_ID}/metricas · session:AL`;
  } catch {
    document.querySelector('#breadcrumb-project').textContent = `#${PROJECT_ID}`;
  }
}

/* --------------------------------------------------------
   Carga inicial
   -------------------------------------------------------- */
async function loadMetrics() {
  try {
    const metrics = window.DevMatchApi.enabled
      ? await window.DevMatchApi.getProjectMetrics(PROJECT_ID)
      : readDemoMetrics(PROJECT_ID);

    buildRadar(document.querySelector('#panel-radar'), metrics.balance);
    buildMatrix(document.querySelector('#panel-matrix'), metrics.sprintWindows);
    buildDonut(document.querySelector('#panel-donut'), metrics.hoursByRole, metrics.totalHours);
    buildLineChart(document.querySelector('#panel-line'), metrics.sprintHistory);
  } catch (error) {
    document.querySelectorAll('.panel-body').forEach((panel) => {
      panel.innerHTML = '<p class="metric-error">No fue posible cargar las métricas.</p>';
    });
  }
}

if (!PROJECT_ID) {
  document.querySelector('#breadcrumb-project').textContent = 'proyecto no especificado';
  document.querySelectorAll('.panel-body').forEach((panel) => {
    panel.innerHTML = '<p class="metric-error">Abre esta vista desde "Métricas del proyecto" en una tarjeta de Líder Proyecto.</p>';
  });
} else {
  loadProjectHeader();
  loadMetrics();
}



