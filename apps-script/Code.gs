/**
 * CENSO ODONTOLÓGICO 10A — Code.gs
 * Punto de entrada del backend en Google Apps Script.
 *
 * Despliegue: Implementar > Nueva implementación > Tipo "Aplicación web".
 * Ejecutar como: Yo (tu cuenta). Quién tiene acceso: Cualquier usuario.
 * Ver README.md para el paso a paso completo.
 */

var ENCABEZADOS_REPORTES = [
  "id_reporte", "codigo_seguimiento", "fecha_hora", "tipo_reporte", "departamento", "municipio",
  "relacion_sismo", "rol_sector", "tipo_afectacion_personal", "capacidad_trabajo",
  "tipo_establecimiento", "relacion_establecimiento", "que_ocurrio", "nivel_dano_infraestructura",
  "equipos_afectados", "inventario_afectado", "estado_operativo", "rango_impacto_economico",
  "capacidad_recuperacion", "necesita_apoyo", "autoriza_contacto_publico", "id_contacto"
];

var ENCABEZADOS_NECESIDADES = [
  "id_necesidad", "codigo_seguimiento", "fecha_hora", "codigo_reporte_relacionado",
  "tipo_solicitante", "departamento", "municipio", "categoria_necesidad", "urgencia",
  "descripcion_breve", "estado", "id_contacto"
];

var ENCABEZADOS_OFERTAS = [
  "id_oferta", "codigo_seguimiento", "fecha_hora", "tipo_oferente", "categoria_ayuda",
  "cobertura_geografica", "disponibilidad", "descripcion_breve", "autoriza_oferta_publica",
  "id_contacto"
];

var ENCABEZADOS_CONTACTOS = [
  "id_contacto", "nombre", "telefono_correo", "autoriza_contacto_publico", "fecha_registro"
];

/**
 * doGet: chequeo de salud simple para verificar que el despliegue funciona.
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, mensaje: "Censo Odontológico 10A — API activa" }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * doPost: único punto de entrada de escritura. Recibe JSON con un
 * campo "formulario" que indica el tipo de envío.
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonError("Solicitud sin cuerpo.");
    }

    var body;
    try {
      body = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return jsonError("Cuerpo de la solicitud no es JSON válido.");
    }

    if (honeypotSospechoso(body)) {
      // Se responde éxito falso para no delatar al bot que fue detectado.
      return jsonOk({ codigo_seguimiento: "10A-00000", simulado: true });
    }

    if (!turnstileValido(body.turnstileToken)) {
      return jsonError("Verificación anti-spam no superada. Intenta de nuevo.");
    }

    switch (body.formulario) {
      case "afectacion":
        return manejarAfectacion(body);
      case "necesidad":
        return manejarNecesidad(body);
      case "oferta":
        return manejarOferta(body);
      default:
        return jsonError("Tipo de formulario no reconocido.");
    }
  } catch (err) {
    // Nunca exponemos detalles internos (rutas, IDs de hoja, stack trace) al cliente.
    return jsonError("Ocurrió un error inesperado. Intenta de nuevo en unos minutos.");
  }
}

// ---------------------------------------------------------------
// MANEJADORES POR FORMULARIO
// ---------------------------------------------------------------

function manejarAfectacion(body) {
  var validado = validarAfectacion(body);
  if (!validado.ok) return jsonError(validado.error);

  var idContacto = "";
  if (validado.data.nombre || validado.data.contacto) {
    idContacto = guardarContacto(validado.data.nombre, validado.data.contacto, validado.data.autoriza_contacto_publico);
  }

  var idReporte = "RPT-" + Utilities.getUuid().substring(0, 8);
  var codigo = generarCodigoSeguimiento(CONFIG.PREFIJOS_CODIGO.afectacion);
  var fecha = new Date();

  var ss = getSpreadsheetA();
  var sheet = getOrCreateSheet(ss, CONFIG.HOJAS_A.REPORTES, ENCABEZADOS_REPORTES);
  sheet.appendRow([
    idReporte, codigo, fecha, validado.data.tipo_reporte, validado.data.departamento, validado.data.municipio,
    validado.data.relacion_sismo, validado.data.rol_sector, validado.data.tipo_afectacion_personal,
    validado.data.capacidad_trabajo, validado.data.tipo_establecimiento, validado.data.relacion_establecimiento,
    validado.data.que_ocurrio, validado.data.nivel_dano_infraestructura, validado.data.equipos_afectados,
    validado.data.inventario_afectado, validado.data.estado_operativo, validado.data.rango_impacto_economico,
    validado.data.capacidad_recuperacion, validado.data.necesita_apoyo, validado.data.autoriza_contacto_publico,
    idContacto
  ]);

  return jsonOk({ codigo_seguimiento: codigo });
}

function manejarNecesidad(body) {
  var validado = validarNecesidad(body);
  if (!validado.ok) return jsonError(validado.error);

  var idContacto = guardarContacto(validado.data.nombre, validado.data.contacto, "solo_censo");

  var idNecesidad = "NEC-" + Utilities.getUuid().substring(0, 8);
  var codigo = generarCodigoSeguimiento(CONFIG.PREFIJOS_CODIGO.necesidad);
  var fecha = new Date();

  var ss = getSpreadsheetA();
  var sheet = getOrCreateSheet(ss, CONFIG.HOJAS_A.NECESIDADES, ENCABEZADOS_NECESIDADES);
  sheet.appendRow([
    idNecesidad, codigo, fecha, validado.data.codigo_reporte, validado.data.tipo_solicitante,
    validado.data.departamento, validado.data.municipio, validado.data.categoria_necesidad,
    validado.data.urgencia, validado.data.descripcion_breve, "abierta", idContacto
  ]);

  return jsonOk({ codigo_seguimiento: codigo });
}

function manejarOferta(body) {
  var validado = validarOferta(body);
  if (!validado.ok) return jsonError(validado.error);

  var idContacto = guardarContacto(validado.data.nombre, validado.data.contacto, validado.data.autoriza_oferta_publica === "si" ? "compartir" : "solo_censo");

  var idOferta = "OFE-" + Utilities.getUuid().substring(0, 8);
  var codigo = generarCodigoSeguimiento(CONFIG.PREFIJOS_CODIGO.oferta);
  var fecha = new Date();

  var ss = getSpreadsheetA();
  var sheet = getOrCreateSheet(ss, CONFIG.HOJAS_A.OFERTAS, ENCABEZADOS_OFERTAS);
  sheet.appendRow([
    idOferta, codigo, fecha, validado.data.tipo_oferente, validado.data.categoria_ayuda,
    validado.data.cobertura_geografica, validado.data.disponibilidad, validado.data.descripcion_breve,
    validado.data.autoriza_oferta_publica, idContacto
  ]);

  return jsonOk({ codigo_seguimiento: codigo });
}

// ---------------------------------------------------------------
// CONTACTOS (Archivo B — restringido)
// ---------------------------------------------------------------

/**
 * Guarda un contacto en el Archivo B y devuelve su id_contacto.
 * Si no hay nombre ni contacto, no crea fila y devuelve cadena vacía.
 */
function guardarContacto(nombre, contacto, autoriza) {
  if (!nombre && !contacto) return "";

  var idContacto = "CTC-" + Utilities.getUuid().substring(0, 8);
  var ss = getSpreadsheetB();
  var sheet = getOrCreateSheet(ss, CONFIG.HOJAS_B.CONTACTOS, ENCABEZADOS_CONTACTOS);
  sheet.appendRow([idContacto, nombre, contacto, autoriza, new Date()]);
  return idContacto;
}

// ---------------------------------------------------------------
// UTILIDADES
// ---------------------------------------------------------------

function generarCodigoSeguimiento(prefijo) {
  var chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sin 0/O ni 1/I para evitar confusión
  var code = prefijo + "-";
  for (var i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function jsonOk(data) {
  var payload = Object.assign({ ok: true }, data);
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}

function jsonError(mensaje) {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: false, error: mensaje }))
    .setMimeType(ContentService.MimeType.JSON);
}
