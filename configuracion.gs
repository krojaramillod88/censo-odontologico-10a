/**
 * CENSO ODONTOLÓGICO 10A — configuracion.gs
 * Configuración central del backend en Google Apps Script.
 *
 * IMPORTANTE: reemplaza los valores marcados como "REEMPLAZAR" antes
 * de desplegar. Nunca subas IDs reales de hojas a un repositorio
 * público si prefieres mantenerlos privados; en ese caso, usa
 * PropertiesService (ver README) en lugar de escribirlos aquí.
 */

var CONFIG = {
  // IDs de las hojas de cálculo (se obtienen de la URL de cada Sheet:
  // https://docs.google.com/spreadsheets/d/ESTE_ES_EL_ID/edit)
  SHEET_ID_A: "REEMPLAZAR_CON_ID_ARCHIVO_A", // datos operativos/estadísticos
  SHEET_ID_B: "REEMPLAZAR_CON_ID_ARCHIVO_B", // datos de contacto (restringido)

  // Nombres de las pestañas dentro de cada archivo
  HOJAS_A: {
    REPORTES: "Reportes",
    NECESIDADES: "Necesidades",
    OFERTAS: "Ofertas"
  },
  HOJAS_B: {
    CONTACTOS: "Contactos"
  },

  // Cloudflare Turnstile (opcional). Si SECRET_KEY queda vacío, el
  // backend no valida el token y el MVP sigue funcionando igual.
  TURNSTILE_SECRET_KEY: "",

  // Límites de longitud, deben coincidir con el frontend (forms.css/app.js)
  MAX_LEN_TEXTO_CORTO: 60,
  MAX_LEN_TEXTO_LARGO: 200,

  // Prefijos de código de seguimiento por tipo de formulario
  PREFIJOS_CODIGO: {
    afectacion: "10A",
    necesidad: "10A-N",
    oferta: "10A-O"
  }
};

/**
 * Devuelve la hoja de cálculo del Archivo A (datos operativos).
 * Lanza un error claro si CONFIG.SHEET_ID_A no fue configurado.
 */
function getSpreadsheetA() {
  if (!CONFIG.SHEET_ID_A || CONFIG.SHEET_ID_A.indexOf("REEMPLAZAR") === 0) {
    throw new Error("CONFIG.SHEET_ID_A no está configurado. Edita apps-script/configuracion.gs.");
  }
  return SpreadsheetApp.openById(CONFIG.SHEET_ID_A);
}

/**
 * Devuelve la hoja de cálculo del Archivo B (contactos, restringido).
 */
function getSpreadsheetB() {
  if (!CONFIG.SHEET_ID_B || CONFIG.SHEET_ID_B.indexOf("REEMPLAZAR") === 0) {
    throw new Error("CONFIG.SHEET_ID_B no está configurado. Edita apps-script/configuracion.gs.");
  }
  return SpreadsheetApp.openById(CONFIG.SHEET_ID_B);
}

/**
 * Obtiene (o crea, si no existe) una pestaña con encabezados dados.
 */
function getOrCreateSheet(spreadsheet, nombreHoja, encabezados) {
  var sheet = spreadsheet.getSheetByName(nombreHoja);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(nombreHoja);
    sheet.appendRow(encabezados);
    sheet.setFrozenRows(1);
  }
  return sheet;
}
