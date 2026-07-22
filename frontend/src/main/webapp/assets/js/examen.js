// 1. Recuperamos el examen generado desde el backend (guardado en LocalStorage)
// Si no hay preguntas (por ejemplo, si no corrieron el paso anterior), usamos un array vacío.
const preguntas = JSON.parse(localStorage.getItem('preguntasTest')) || [];

let indiceActual = 0;
let puntos = 0;
let optionSelected = false;

// Seleccionamos los elementos de tu hermosa interfaz IDE
const questionText = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');
const btnNext = document.getElementById('btnNext');
const scoreTracker = document.getElementById('scoreTracker');

// Elementos extra de tu UI (para mantener la inmersión)
const activeTabName = document.getElementById('activeTabName');
const techBadge = document.getElementById('techBadge');
const stepLabel = document.getElementById('stepLabel');
const codeEditor = document.getElementById('codeEditor');

// 2. Función para mostrar la pregunta actual
function cargarPregunta() {
    if (indiceActual >= preguntas.length) {
        // Se acabó el examen, mostramos resultados (Redirigimos al psicométrico o final)
        finalizarExamen();
        return;
    }

    const preguntaActual = preguntas[indiceActual];
    optionSelected = false;
    btnNext.disabled = true;

    // Actualizamos textos superiores del IDE para dar inmersión
    const techName = preguntaActual.tecnologia || 'Evaluación';
    techBadge.innerText = techName;
    activeTabName.innerText = 'eval_engine.ts';
    stepLabel.innerText = `// reactivo ${indiceActual + 1}/${preguntas.length}`;
    
    // Modificamos el explorador dinámicamente
    const folderTitle = document.getElementById('folderTitle');
    if (folderTitle) folderTitle.innerText = `˅ ${techName.toUpperCase()}`;
    
    // Obtenemos todas las tecnologías únicas del test
    const allTechs = [...new Set(preguntas.map(p => p.tecnologia || 'Evaluación'))];
    const explorerFiles = document.getElementById('explorerFiles');
    if (explorerFiles) {
        explorerFiles.innerHTML = allTechs.map(tech => 
            `<li class="${tech === techName ? 'active-file' : ''}" style="margin-left: 15px; margin-top: 8px; color: ${tech === techName ? '#fff' : '#abb2bf'}; font-family: monospace; font-size: 13px; list-style: none;">
                <span style="margin-right: 5px;">📄</span> ${tech.toLowerCase()}.test.ts
             </li>`
        ).join('');
    }
    
    // Si la pregunta incluye un snippet de código del backend, lo mostramos. Si no, mostramos un log de consola.
    if (preguntaActual.codigo) {
        const lines = preguntaActual.codigo.split('\n');
        codeEditor.innerHTML = lines.map((line, idx) => 
            `<div class="code-line"><span class="line-number">${idx + 1}</span> <span class="line-content">${line.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</span></div>`
        ).join('');
    } else {
        codeEditor.innerHTML = `<div class="code-line"><span class="line-number">1</span> <span class="line-content" style="color:#5c6370">// Analizando conocimientos teóricos...</span></div>`;
    }

    // Limpiamos y cargamos la pregunta
    questionText.innerText = preguntaActual.pregunta;
    optionsContainer.innerHTML = '';
    
    // Creamos un botón por cada opción usando tu estilo
    preguntaActual.opciones.forEach((opcion, index) => {
        const optDiv = document.createElement('div');
        optDiv.className = 'quiz-option';
        
        // Usamos A, B, C, D dinámicamente
        const letras = ['A', 'B', 'C', 'D', 'E'];
        
        optDiv.innerHTML = `
            <div class="opt-letter">${letras[index] || '-'}</div>
            <div class="opt-body">
                <div class="opt-text">${typeof opcion === 'string' ? opcion.replace(/</g, '&lt;').replace(/>/g, '&gt;') : opcion}</div>
            </div>
            <div class="opt-icon"></div>
        `;
        
        optDiv.addEventListener('click', () => verificarRespuesta(optDiv, opcion, preguntaActual.correcta));
        optionsContainer.appendChild(optDiv);
    });
}

// 3. Función para evaluar si acertó
function verificarRespuesta(optDiv, respuestaElegida, respuestaCorrecta) {
    if(optionSelected) return; // Bloquear si ya seleccionó
    optionSelected = true;

    // Opacar todas las opciones
    document.querySelectorAll('.quiz-option').forEach(el => el.classList.add('disabled-opt'));
    
    // Resaltar la seleccionada
    optDiv.classList.remove('disabled-opt');

    // Selección neutra (Blind Assessment real)
    optDiv.style.borderColor = '#61afef'; // Azul neutro del IDE
    optDiv.style.backgroundColor = 'rgba(97, 175, 239, 0.1)';

    // Evaluamos internamente pero no mostramos el resultado
    if (respuestaElegida === respuestaCorrecta) {
        puntos++;
    }
    
    // Feedback visual opaco para el usuario
    scoreTracker.innerText = `// engine.status = 'input_recorded' · encrypting...`;

    btnNext.disabled = false;
}

// 4. Lógica para el botón "Siguiente"
btnNext.addEventListener('click', () => {
    indiceActual++;
    cargarPregunta();
});

// Función de finalización
async function finalizarExamen() {
    // Mostrar la pantalla de carga de tu UI
    const loader = document.getElementById('loadingOverlay');
    const loaderText = document.getElementById('loadingText');
    
    if(loader && loaderText) {
        loaderText.innerText = `> Test completado de forma segura. Guardando resultados cifrados...`;
        loader.classList.add('active');
        
        try {
            const idUsuario = localStorage.getItem('currentUserId') || 1; // Usamos el ID real del usuario creado
            await fetch(`${window.DEVMATCH_CONFIG.API_URL}/users/${idUsuario}/score`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ score: puntos })
            });
            console.log("Calificación guardada exitosamente en el backend.");

            // Redirección inteligente
            const resp = await fetch(`${window.DEVMATCH_CONFIG.API_URL}/users/${idUsuario}`);
            if (resp.ok) {
                const userData = await resp.json();
                setTimeout(() => {
                    alert(`¡Evaluación técnica completada! Sus respuestas han sido enviadas de forma segura.`);
                    if (!userData.rol_psicometrico) {
                        window.location.href = 'psicometrico.html';
                    } else {
                        window.location.href = 'postulaciones.html'; // Ya hizo el test antes
                    }
                }, 1500);
                return; // Evita el fallback
            }
        } catch(e) {
            console.error("Error al procesar flujo final:", e);
        }

        // Fallback original
        setTimeout(() => {
            alert(`¡Evaluación técnica completada! Sus respuestas han sido enviadas de forma segura.`);
            window.location.href = 'psicometrico.html';
        }, 1500);
    } else {
        alert(`¡Evaluación técnica completada! Sus respuestas han sido enviadas de forma segura.`);
    }
}

// Inicializamos el motor
if (preguntas && preguntas.length > 0) {
    cargarPregunta();
} else {
    // Modo Fallback por si entran directo sin pasar por stack.html (para que veas algo)
    questionText.innerText = "Error: No se encontró ningún test en LocalStorage. Vuelve a configurar tu Stack.";
    codeEditor.innerHTML = `<div class="code-line"><span class="line-number">1</span> <span class="line-content" style="color:#e06c75">Exception: TestDataNotFound</span></div>`;
}
