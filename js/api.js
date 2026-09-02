/**
 * CENSO ODONTOLÓGICO 10A — api.js
 * Capa de comunicación con el backend (Google Apps Script).
 */

window.CENSO_CONFIG = {
  API_ENDPOINT: "https://script.google.com/macros/s/AKfycbzATu7Twrz9yD-JMs4Ol87tVUcioxPaaJKnpp4Yi7lHlT2IG_MwgJ0gyBt0QdH4fO5tkA/exec",

  TURNSTILE_SITE_KEY: ""
};

async function submitToApi(payload) {
  if (payload.website && payload.website.trim().length > 0) {
    return { ok: true, data: { codigo_seguimiento: generarCodigoSeguimiento("10A"), simulado: true } };
  }

  if (!window.CENSO_CONFIG.API_ENDPOINT || window.CENSO_CONFIG.API_ENDPOINT.indexOf("REEMPLAZAR") === 0) {
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
    delete body.website;

    var response = await fetch(window.CENSO_CONFIG.API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
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
