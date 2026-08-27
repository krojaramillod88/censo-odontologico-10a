/**
 * CENSO ODONTOLÓGICO 10A — validacion.gs
 * Validación y sanitización de todo lo que llega por POST.
 * Nada se escribe en las hojas sin pasar por aquí.
 */

/**
 * Elimina etiquetas HTML/scripts y recorta espacios. Trunca a maxLen.
 */
function sanitizarTexto(valor, maxLen) {
  if (valor === undefined || valor === null) return "";
  var texto = String(valor);
  texto = texto.replace(/<[^>]*>/g, ""); // quita cualquier etiqueta HTML
  texto = texto.replace(/[\r\n]+/g, " ").trim();
  if (maxLen && texto.length > maxLen) {
    texto = texto.substring(0, maxLen);
  }
  return texto;
}

/**
 * Valida el honeypot: si viene con contenido, es casi seguro un bot.
 */
function honeypotSospechoso(body) {
  return !!(body.website && String(body.website).trim().length > 0);
}

/**
 * Valida el consentimiento explícito (obligatorio en los tres formularios).
 */
function consentimientoValido(body) {
  return body.consentimiento === true;
}

/**
 * Valida (opcionalmente) el token de Cloudflare Turnstile.
 * Si CONFIG.TURNSTILE_SECRET_KEY está vacío, se omite la validación
 * para no bloquear el MVP mientras Turnstile no esté configurado.
 */
function turnstileValido(token) {
  if (!CONFIG.TURNSTILE_SECRET_KEY) return true; // no configurado todavía: no bloquea
  if (!token) return false;
  try {
    var resp = UrlFetchApp.fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "post",
      payload: { secret: CONFIG.TURNSTILE_SECRET_KEY, response: token },
      muteHttpExceptions: true
    });
    var data = JSON.parse(resp.getContentText());
    return !!data.success;
  } catch (e) {
    // Si el servicio de verificación falla, no bloqueamos el envío del MVP,
    // pero se documenta como limitación conocida (ver README).
    return true;
  }
}

/**
 * Valida y sanitiza el payload de "Reportar afectación".
 * Devuelve { ok: true, data } o { ok: false, error }.
 */
function validarAfectacion(body) {
  if (!valorEnCatalogo(body.tipo_reporte, "TIPO_REPORTE")) {
    return { ok: false, error: "tipo_reporte inválido" };
  }
  if (!valorEnCatalogo(body.departamento, "DEPARTAMENTOS")) {
    return { ok: false, error: "departamento inválido" };
  }
  if (!body.municipio || String(body.municipio).trim().length === 0) {
    return { ok: false, error: "municipio requerido" };
  }
  if (!valorEnCatalogo(body.relacion_sismo, "RELACION_SISMO")) {
    return { ok: false, error: "relacion_sismo inválida" };
  }

  var incluyePersona = body.tipo_reporte === "persona" || body.tipo_reporte === "ambas";
  var incluyeEstablecimiento = body.tipo_reporte === "establecimiento" || body.tipo_reporte === "ambas";

  if (incluyePersona) {
    if (!valorEnCatalogo(body.rol_sector, "ROLES")) return { ok: false, error: "rol_sector inválido" };
    if (!arregloEnCatalogo(body.tipo_afectacion_personal || [], "TIPO_AFECTACION_PERSONAL")) {
      return { ok: false, error: "tipo_afectacion_personal inválido" };
    }
    if (!valorEnCatalogo(body.capacidad_trabajo, "CAPACIDAD_TRABAJO")) {
      return { ok: false, error: "capacidad_trabajo inválida" };
    }
  }

  if (incluyeEstablecimiento) {
    if (!valorEnCatalogo(body.tipo_establecimiento, "TIPO_ESTABLECIMIENTO")) {
      return { ok: false, error: "tipo_establecimiento inválido" };
    }
    if (!valorEnCatalogo(body.relacion_establecimiento, "RELACION_ESTABLECIMIENTO")) {
      return { ok: false, error: "relacion_establecimiento inválida" };
    }
    if (!arregloEnCatalogo(body.que_ocurrio || [], "QUE_OCURRIO")) {
      return { ok: false, error: "que_ocurrio inválido" };
    }
    if (!valorEnCatalogo(body.rango_impacto_economico, "RANGO_ECONOMICO")) {
      return { ok: false, error: "rango_impacto_economico inválido" };
    }
    if (!valorEnCatalogo(body.capacidad_recuperacion, "CAPACIDAD_RECUPERACION")) {
      return { ok: false, error: "capacidad_recuperacion inválida" };
    }
  }

  if (!valorEnCatalogo(body.necesita_apoyo, "NECESITA_APOYO")) {
    return { ok: false, error: "necesita_apoyo inválido" };
  }
  if (!consentimientoValido(body)) {
    return { ok: false, error: "Falta el consentimiento explícito" };
  }

  return {
    ok: true,
    data: {
      tipo_reporte: body.tipo_reporte,
      departamento: body.departamento,
      municipio: sanitizarTexto(body.municipio, CONFIG.MAX_LEN_TEXTO_CORTO),
      relacion_sismo: body.relacion_sismo,
      rol_sector: incluyePersona ? body.rol_sector : "",
      tipo_afectacion_personal: incluyePersona ? (body.tipo_afectacion_personal || []).join("|") : "",
      capacidad_trabajo: incluyePersona ? body.capacidad_trabajo : "",
      tipo_establecimiento: incluyeEstablecimiento ? body.tipo_establecimiento : "",
      relacion_establecimiento: incluyeEstablecimiento ? body.relacion_establecimiento : "",
      que_ocurrio: incluyeEstablecimiento ? (body.que_ocurrio || []).join("|") : "",
      nivel_dano_infraestructura: incluyeEstablecimiento ? (body.nivel_dano_infraestructura || "") : "",
      equipos_afectados: incluyeEstablecimiento ? (body.equipos_afectados || []).join("|") : "",
      inventario_afectado: incluyeEstablecimiento ? (body.inventario_afectado || []).join("|") : "",
      estado_operativo: incluyeEstablecimiento ? (body.estado_operativo || "") : "",
      rango_impacto_economico: incluyeEstablecimiento ? body.rango_impacto_economico : "",
      capacidad_recuperacion: incluyeEstablecimiento ? body.capacidad_recuperacion : "",
      necesita_apoyo: body.necesita_apoyo,
      autoriza_contacto_publico: valorEnCatalogo(body.autoriza_contacto_publico, "AUTORIZA_CONTACTO")
        ? body.autoriza_contacto_publico : "no",
      nombre: sanitizarTexto(body.nombre, CONFIG.MAX_LEN_TEXTO_CORTO),
      contacto: sanitizarTexto(body.contacto, CONFIG.MAX_LEN_TEXTO_CORTO)
    }
  };
}

/**
 * Valida y sanitiza el payload de "Necesito ayuda".
 */
function validarNecesidad(body) {
  if (!valorEnCatalogo(body.tipo_solicitante, "TIPO_SOLICITANTE")) {
    return { ok: false, error: "tipo_solicitante inválido" };
  }
  if (!valorEnCatalogo(body.departamento, "DEPARTAMENTOS")) {
    return { ok: false, error: "departamento inválido" };
  }
  if (!body.municipio) return { ok: false, error: "municipio requerido" };
  if (!arregloEnCatalogo(body.categoria_necesidad || [], "CATEGORIA_NECESIDAD") || (body.categoria_necesidad || []).length === 0) {
    return { ok: false, error: "categoria_necesidad inválida" };
  }
  if (!valorEnCatalogo(body.urgencia, "URGENCIA")) return { ok: false, error: "urgencia inválida" };
  if (!consentimientoValido(body)) return { ok: false, error: "Falta el consentimiento explícito" };
  if (!body.nombre || !body.contacto) return { ok: false, error: "nombre y contacto son obligatorios en este formulario" };

  return {
    ok: true,
    data: {
      codigo_reporte: sanitizarTexto(body.codigo_reporte, 20),
      tipo_solicitante: body.tipo_solicitante,
      departamento: body.departamento,
      municipio: sanitizarTexto(body.municipio, CONFIG.MAX_LEN_TEXTO_CORTO),
      categoria_necesidad: (body.categoria_necesidad || []).join("|"),
      urgencia: body.urgencia,
      descripcion_breve: sanitizarTexto(body.descripcion_breve, CONFIG.MAX_LEN_TEXTO_LARGO),
      nombre: sanitizarTexto(body.nombre, CONFIG.MAX_LEN_TEXTO_CORTO),
      contacto: sanitizarTexto(body.contacto, CONFIG.MAX_LEN_TEXTO_CORTO)
    }
  };
}

/**
 * Valida y sanitiza el payload de "Quiero ayudar".
 */
function validarOferta(body) {
  if (!valorEnCatalogo(body.tipo_oferente, "TIPO_OFERENTE")) {
    return { ok: false, error: "tipo_oferente inválido" };
  }
  if (!arregloEnCatalogo(body.categoria_ayuda || [], "CATEGORIA_AYUDA") || (body.categoria_ayuda || []).length === 0) {
    return { ok: false, error: "categoria_ayuda inválida" };
  }
  if (!valorEnCatalogo(body.cobertura_geografica, "COBERTURA_GEOGRAFICA")) {
    return { ok: false, error: "cobertura_geografica inválida" };
  }
  if (!valorEnCatalogo(body.disponibilidad, "DISPONIBILIDAD")) {
    return { ok: false, error: "disponibilidad inválida" };
  }
  if (!valorEnCatalogo(body.autoriza_oferta_publica, "AUTORIZA_OFERTA_PUBLICA")) {
    return { ok: false, error: "autoriza_oferta_publica inválida" };
  }
  if (!consentimientoValido(body)) return { ok: false, error: "Falta el consentimiento explícito" };
  if (!body.nombre || !body.contacto) return { ok: false, error: "nombre y contacto son obligatorios en este formulario" };

  return {
    ok: true,
    data: {
      tipo_oferente: body.tipo_oferente,
      categoria_ayuda: (body.categoria_ayuda || []).join("|"),
      cobertura_geografica: body.cobertura_geografica,
      disponibilidad: body.disponibilidad,
      descripcion_breve: sanitizarTexto(body.descripcion_breve, CONFIG.MAX_LEN_TEXTO_LARGO),
      autoriza_oferta_publica: body.autoriza_oferta_publica,
      nombre: sanitizarTexto(body.nombre, CONFIG.MAX_LEN_TEXTO_CORTO),
      contacto: sanitizarTexto(body.contacto, CONFIG.MAX_LEN_TEXTO_CORTO)
    }
  };
}
