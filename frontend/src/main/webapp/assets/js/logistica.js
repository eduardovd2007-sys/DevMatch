const grid = document.getElementById('scheduleGrid');
const freeCountEl = document.getElementById('freeCount');
const hours = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
const days = 5;

let isMouseDown = false;
let paintMode = 'busy';
let totalFree = hours.length * days;

// 1. Leer los datos del sessionStorage
const profileType = sessionStorage.getItem('profile_type') || 'student';
const workStart = sessionStorage.getItem('work_start');
const workEnd = sessionStorage.getItem('work_end');
const transitHours = parseInt(sessionStorage.getItem('transit_hours')) || 0;

// Actualizar la etiqueta visual del perfil (arriba a la derecha)
document.querySelector('.geo-profile').innerText = `geo_profile: '${profileType}'`;

// 2. Generar la matriz y aplicar bloqueos inteligentes
hours.forEach((hour, index) => {
    const hourLabel = document.createElement('div');
    hourLabel.className = 'grid-time-label';
    hourLabel.innerText = hour;
    grid.appendChild(hourLabel);

    // 3. Sistema de Bloqueo Inteligente
    let isLocked = false;

    // Bloqueo A: Jornada Laboral
    if (profileType === 'work_study' && workStart && workEnd) {
        if (hour >= workStart && hour <= workEnd) {
            isLocked = true;
        }
    }

    // Bloqueo B: Traslado (Foráneo)
    if (profileType === 'commuter' && transitHours > 0) {
        // Bloquea las primeras 'X' horas de la mañana o las últimas 'X' horas de la tarde
        if (index < transitHours || index >= (hours.length - transitHours)) {
            isLocked = true;
        }
    }

    // Crear los días de la semana (Lunes a Viernes)
    for (let i = 0; i < days; i++) {
        const cell = document.createElement('div');

        if (isLocked) {
            cell.className = 'grid-cell locked';
            totalFree--; // Descontamos esta hora del contador total
        } else {
            cell.className = 'grid-cell free';
        }

        cell.dataset.hour = hour;
        cell.dataset.day = i;

        // Eventos de pintado (ignorando celdas bloqueadas)
        cell.addEventListener('mousedown', function (e) {
            if (this.classList.contains('locked')) return;
            isMouseDown = true;
            paintMode = this.classList.contains('busy') ? 'free' : 'busy';
            toggleCell(this, paintMode);
        });

        cell.addEventListener('mouseenter', function (e) {
            if (isMouseDown && !this.classList.contains('locked')) {
                toggleCell(this, paintMode);
            }
        });

        grid.appendChild(cell);
    }
});

// Actualizamos el contador visual con las horas restantes
freeCountEl.innerText = totalFree;

// Limpiar el estado del ratón si se suelta fuera de la tabla
window.addEventListener('mouseup', () => { isMouseDown = false; });
grid.addEventListener('dragstart', (e) => e.preventDefault());

function toggleCell(cell, mode) {
    if (mode === 'busy' && cell.classList.contains('free')) {
        cell.classList.remove('free');
        cell.classList.add('busy');
        totalFree--;
    } else if (mode === 'free' && cell.classList.contains('busy')) {
        cell.classList.remove('busy');
        cell.classList.add('free');
        totalFree++;
    }
    freeCountEl.innerText = totalFree;
}

// 4. LÓGICA DE RECOLECCIÓN Y ENVÍO AL BACKEND
const botonGuardar = document.getElementById('btnFinish');

botonGuardar.addEventListener('click', async (evento) => {
    evento.preventDefault();

    // Ya tenemos el perfil logístico desde sessionStorage
    if (!profileType) {
        alert("No se encontró un perfil logístico. Por favor, regresa al paso anterior.");
        return;
    }

    // Escaneamos la cuadrícula buscando SOLO las celdas libres (clase .free)
    const celdasLibres = document.querySelectorAll('.grid-cell.free');
    const horarioDisponible = [];

    // Extraemos el día y la hora de cada celda verde
    celdasLibres.forEach(celda => {
        horarioDisponible.push({
            dia: celda.getAttribute('data-day'),
            hora: celda.getAttribute('data-hour')
        });
    });

    botonGuardar.innerText = "Guardando matriz...";
    botonGuardar.disabled = true;

    // Enviamos los datos al Backend
    try {
        const idUsuario = localStorage.getItem('currentUserId') || 1; // ID real del usuario en proceso

        const respuesta = await fetch(`${window.DEVMATCH_CONFIG.API_URL}/users/${idUsuario}/horario`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                perfil_logistico: profileType,
                horario: horarioDisponible
            })
        });

        const datos = await respuesta.json();

        if (respuesta.status === 200) {
            alert("¡Horario guardado con éxito en la base de datos!");
            console.log(datos);
            // Redirigir a la vista de Stack
            window.location.href = 'stack.html';
        } else {
            alert("Error al guardar: " + datos.error);
            botonGuardar.innerText = "Guardar Disponibilidad →";
            botonGuardar.disabled = false;
        }

    } catch (error) {
        console.error("Fallo la conexión con el servidor:", error);
        alert("No se pudo conectar con el servidor. Se simulará el guardado para continuar.");

        // --- SIMULACIÓN DE ÉXITO EN CASO DE NO HABER BACKEND ACTIVO ---
        console.log("Datos que se enviarían:", { perfil_logistico: profileType, horario: horarioDisponible });
        setTimeout(() => window.location.href = 'stack.html', 800);
    }
});
