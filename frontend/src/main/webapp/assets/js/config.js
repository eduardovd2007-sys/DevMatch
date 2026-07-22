/**
 * CONFIGURACIÓN GLOBAL DEVMATCH
 * 
 * Antes de subir a AWS (S3, Vercel, o EC2), cambia la URL base 
 * para apuntar a la IP pública o dominio de tu backend.
 * 
 * Ejemplo local de red: 'http://192.168.1.100:3000/api'
 * Ejemplo AWS: 'http://54.123.45.67:3000/api' o 'https://api.midominio.com/api'
 */
window.DEVMATCH_CONFIG = {
  // Ruta relativa para que funcione sin importar si la IP cambia mañana
  API_URL: '/api' 
};

// Autodescubrimiento dinámico
if (!window.DEVMATCH_CONFIG.API_URL) {
  window.DEVMATCH_CONFIG.API_URL = '/api';
}
