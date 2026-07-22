const techTags = document.querySelectorAll('.tech-tag');
const selectedContainer = document.getElementById('selectedTagsContainer');
const searchInput = document.getElementById('techSearch');
const btnClear = document.getElementById('btnClearAll');
const counterEl = document.getElementById('stackCounter');

let selectedStack = new Set();

// 1. Alternar selección de tecnologías
techTags.forEach(tag => {
    tag.addEventListener('click', function () {
        const tech = this.dataset.tech;

        if (selectedStack.has(tech)) {
            selectedStack.delete(tech);
            this.classList.remove('selected');
            this.innerHTML = tech; // Quita la palomita
        } else {
            selectedStack.add(tech);
            this.classList.add('selected');
            this.innerHTML = `✓ ${tech}`; // Agrega la palomita
        }

        updateSelectedUI();
    });
});

// 2. Actualizar la fila superior y el contador
function updateSelectedUI() {
    selectedContainer.innerHTML = '';

    selectedStack.forEach(tech => {
        const pill = document.createElement('span');
        pill.className = 'selected-pill';
        pill.innerHTML = `${tech} <span class="remove-x" data-tech="${tech}">&times;</span>`;
        selectedContainer.appendChild(pill);
    });

    counterEl.innerText = `stack.selected: [${selectedStack.size}]`;

    // Evento para borrar desde las píldoras de arriba
    document.querySelectorAll('.remove-x').forEach(btn => {
        btn.addEventListener('click', function () {
            const tech = this.dataset.tech;
            selectedStack.delete(tech);

            // Actualizar el botón en la lista principal
            const mainBtn = document.querySelector(`.tech-tag[data-tech="${tech}"]`);
            if (mainBtn) {
                mainBtn.classList.remove('selected');
                mainBtn.innerHTML = tech;
            }
            updateSelectedUI();
        });
    });
}

// 3. Botón Limpiar Todo
btnClear.addEventListener('click', () => {
    selectedStack.clear();
    techTags.forEach(tag => {
        tag.classList.remove('selected');
        tag.innerHTML = tag.dataset.tech;
    });
    updateSelectedUI();
});

// 4. Buscador en tiempo real
searchInput.addEventListener('input', function () {
    const term = this.value.toLowerCase();

    techTags.forEach(tag => {
        const tech = tag.dataset.tech.toLowerCase();
        if (tech.includes(term)) {
            tag.style.display = 'inline-block';
        } else {
            tag.style.display = 'none';
        }
    });
});

// 5. Enviar al test en stack.html
document.getElementById('btnGenerate').addEventListener('click', async function () {
    if (selectedStack.size === 0) {
        alert("Selecciona al menos una tecnología para continuar.");
        return;
    }

    const stackArray = Array.from(selectedStack);
    sessionStorage.setItem('user_stack', JSON.stringify(stackArray));
    this.innerText = "Compilando motor...";
    this.style.opacity = "0.7";
    this.disabled = true;

    try {
        const idUsuario = localStorage.getItem('currentUserId') || 1; // ID real del usuario en proceso

        const respuesta = await fetch(`${window.DEVMATCH_CONFIG.API_URL}/users/${idUsuario}/stack-test`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                stack: stackArray
            })
        });

        const datos = await respuesta.json();

        if (respuesta.status === 200) {
            console.log("¡Test generado con éxito!", datos.test);
            // Guardamos las preguntas en LocalStorage
            localStorage.setItem('preguntasTest', JSON.stringify(datos.test));
            // Redirigir a la pantalla del examen
            window.location.href = "test.html";
        } else {
            alert("Error al generar el test: " + (datos.error || "Error desconocido"));
            this.innerText = "_> Generar Evaluación Dinámica →";
            this.style.opacity = "1";
            this.disabled = false;
        }

    } catch (error) {
        console.error("Error al generar el test:", error);
        alert("No se pudo conectar con el servidor. Se simulará la generación para continuar.");

        // Simulación visual en caso de que el backend no esté encendido
        setTimeout(() => window.location.href = 'test.html', 800);
    }
});
