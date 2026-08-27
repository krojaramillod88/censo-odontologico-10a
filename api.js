/**
 * CENSO ODONTOLÓGICO 10A — api.js
 * Capa de comunicación con el backend (Google Apps Script).
 * No contiene credenciales: Apps Script se despliega como Web App
 * pública solo para el método POST de escritura (ver README).
 */

window.CENSO_CONFIG = {
  // Reemplaza esta URL por la de tu despliegue de Apps Script
  // (Implementar > Nueva implementación > Aplicación web).
  API_ENDPOINT: "REEMPLAZAR_CON_URL_DE_APPS_SCRIPT",

  // Cloudflare Turnstile (opcional). Si no se configura, el backend
  // simplemente no valida el token y el MVP sigue funcionando.
  TURNSTILE_SITE_KEY: "" // ej. "0x4AAAAAAA..."
};

/**
 * Envía un payload al backend. Nunca lanza: siempre resuelve con
 * { ok: true, data } o { ok: false, error }.
 */
async function submitToApi(payload) {
  // Honeypot: si el campo oculto "website" viene lleno, es casi
  // seguro un bot. Simulamos éxito sin enviar nada al servidor.
  if (payload.website && payload.website.trim().length > 0) {
    return { ok: true, data: { codigo_seguimiento: generarCodigoSeguimiento("10A"), simulado: true } };
  }

  if (!window.CENSO_CONFIG.API_ENDPOINT || window.CENSO_CONFIG.API_ENDPOINT.indexOf("REEMPLAZAR") === 0) {
    // Endpoint aún no configurado: modo demo/local, no bloquea el uso del prototipo.
    return {
      ok: true,
      data: {
        codigo_seguimiento: generarCodigoSeguimiento("10A"),
        simulado: true,
        aviso: "Endpoint de Apps Script no configurado todavía. Este es un envío simulado."
      }
    };
  }

  try {
    var body = Object.assign({}, payload, {
      turnstileToken: window.CENSO_TURNSTILE_TOKEN || null
    });
    delete body.website; // no es necesario enviarlo, ya se validó localmente

    var response = await fetch(window.CENSO_CONFIG.API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" }, // evita preflight CORS con Apps Script
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      return { ok: false, error: "El servidor respondió con un error. Intenta de nuevo en unos minutos." };
    }

    var data = await response.json();
    if (!data || data.ok === false) {
      return { ok: false, error: (data && data.error) || "No se pudo procesar tu envío. Intenta de nuevo." };
    }
    return { ok: true, data: data };
  } catch (err) {
    return { ok: false, error: "No fue posible conectar con el servidor. Revisa tu conexión e intenta de nuevo." };
  }
}
