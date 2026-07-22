
console.log("¡registro.js se cargó correctamente en el navegador!");

const formulario = document.getElementById('form-registro');
const boton = document.getElementById('btn-registro');

// Le decimos que escuche el evento "click" directamente en el botón, por si el "submit" está siendo bloqueado
boton.addEventListener('click', async function (evento) {
  evento.preventDefault();

  console.log("¡El botón fue presionado (Evento CLICK capturado)!"); 

  // Capturamos los valores que el usuario escribió en los inputs
  const nombreUsuario = document.getElementById('nombre').value;
  const emailUsuario = document.getElementById('email').value;
  const passwordUsuario = document.getElementById('password').value;
  const cuatrimestreUsuario = document.getElementById('cuatrimestre').value;

  try {
    // Configuramos un límite de tiempo de 5 segundos para que no se quede colgado
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    // Hacemos la petición POST a tu backend
    const baseUrl = (window.DEVMATCH_CONFIG && window.DEVMATCH_CONFIG.API_URL) ? window.DEVMATCH_CONFIG.API_URL : `http://${window.location.hostname}:3000/api`;
    const respuesta = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      signal: controller.signal, // Le pasamos la señal de aborto
      // Convertimos los datos capturados al formato JSON que espera tu servidor
      body: JSON.stringify({
        nombre: nombreUsuario,
        email: emailUsuario,
        password: passwordUsuario,
        cuatrimestre: Number(cuatrimestreUsuario)
      })
    });

    const datos = await respuesta.json();

    if (respuesta.status === 201) {
      alert("¡Éxito! " + datos.mensaje);
      // Guardamos el ID real del usuario recién creado para que el resto del flujo sepa quién es
      if (datos.usuario && datos.usuario.id) {
        localStorage.setItem('currentUserId', datos.usuario.id);
        localStorage.setItem('userName', datos.usuario.nombre);
      }
      // Redirigir al onboarding logístico
      window.location.href = 'logistica.html';
    } else {
      alert("Error: " + datos.error);
    }

  } catch (error) {
    console.error("No se pudo conectar con el servidor:", error);
    alert("Hubo un problema de conexión con el servidor. Inténtalo de nuevo más tarde.");
  }
});
