/**
 * CENSO ODONTOLÓGICO 10A — catalogos.gs
 * Catálogos espejo del backend. Deben coincidir con los IDs usados en
 * js/catalogos.js. Se usan exclusivamente para VALIDAR que cada valor
 * recibido del frontend pertenece a una lista cerrada — nunca se
 * confía en datos ya validados solo del lado del cliente.
 */

var CATALOGOS_GS = {
  DEPARTAMENTOS: [
    "valle_del_cauca", "choco", "risaralda", "quindio", "caldas", "antioquia", "cauca",
    "amazonas", "arauca", "atlantico", "bolivar", "boyaca", "caqueta", "casanare", "cesar",
    "cordoba", "cundinamarca", "guainia", "guaviare", "huila", "la_guajira", "magdalena",
    "meta", "narino", "norte_de_santander", "putumayo", "san_andres", "santander", "sucre",
    "tolima", "vaupes", "vichada", "bogota_dc"
  ],

  TIPO_REPORTE: ["persona", "establecimiento", "ambas"],

  RELACION_SISMO: ["se_produjo_despues", "empeoro_despues", "existia_empeoro", "existia_sin_cambio", "no_seguro"],

  ROLES: [
    "odontologo_general", "odontologo_especialista", "estudiante", "auxiliar", "higienista",
    "recepcionista", "tecnico_dental", "laboratorista", "docente", "investigador",
    "administrativo", "propietario_consultorio", "propietario_clinica", "laboratorio_dental",
    "distribuidor", "fabricante", "representante_comercial", "institucion_educativa",
    "organizacion_gremial", "otro"
  ],

  TIPO_AFECTACION_PERSONAL: ["salud_capacidad", "vivienda", "laboral", "economica", "movilidad", "otra"],

  CAPACIDAD_TRABAJO: ["si_normalidad", "si_parcialmente", "no_temporalmente", "no_sabe_cuando"],

  TIPO_ESTABLECIMIENTO: [
    "consultorio", "clinica", "laboratorio", "distribuidora", "fabricante",
    "institucion_educativa", "oficina_admin", "otro"
  ],

  RELACION_ESTABLECIMIENTO: ["propietario", "empleado", "arrendatario", "estudiante", "otro"],

  QUE_OCURRIO: [
    "infraestructura", "equipos", "instrumental", "inventario", "servicios_publicos",
    "acceso_movilidad", "operacion", "ingresos", "otra"
  ],

  NIVEL_DANO_INFRAESTRUCTURA: ["sin_dano", "leve", "moderado", "severo", "colapso", "no_evaluado"],

  ESTADO_OPERATIVO: ["normal", "parcial", "restricciones", "temp_cerrado", "cerrado_aviso"],

  EQUIPOS: [
    "unidades", "compresores", "autoclaves", "rayosx", "sensores", "instrumental", "lab",
    "computadores", "mobiliario", "otros"
  ],

  INVENTARIO: ["insumos_clinicos", "material_lab", "papeleria", "otro"],

  RANGO_ECONOMICO: ["sin_impacto", "r1", "r2", "r3", "r4", "r5", "no_responde"],

  CAPACIDAD_RECUPERACION: ["ya_normal", "dias", "semanas", "meses", "no_sabe"],

  NECESITA_APOYO: ["no", "urgente", "no_urgente", "no_sabe"],

  TIPO_SOLICITANTE: ["persona", "establecimiento", "institucion"],

  CATEGORIA_NECESIDAD: [
    "equipos", "instrumental", "insumos", "espacio_fisico", "reparacion", "apoyo_financiero",
    "apoyo_operativo", "asesoria_legal", "informacion", "capacitacion", "otra"
  ],

  URGENCIA: ["alta", "media", "baja"],

  TIPO_OFERENTE: [
    "persona_individual", "empresa", "organizacion_gremial", "institucion_educativa",
    "entidad_publica", "otro"
  ],

  CATEGORIA_AYUDA: [
    "equipos", "instrumental", "insumos", "espacio_fisico", "reparacion_mantenimiento",
    "financiacion", "servicios_profesionales", "asesoria", "transporte_logistica",
    "capacitacion", "otros"
  ],

  COBERTURA_GEOGRAFICA: ["solo_municipio", "departamento", "nacional", "otra_region"],

  DISPONIBILIDAD: ["inmediata", "15_dias", "a_definir"],

  AUTORIZA_CONTACTO: ["no", "solo_censo", "compartir"],

  AUTORIZA_OFERTA_PUBLICA: ["no", "si"]
};

/**
 * ¿El valor pertenece a la lista? (comparación exacta, sensible a mayúsculas
 * porque todos los IDs de catálogo se definen en minúsculas con guion bajo)
 */
function valorEnCatalogo(valor, listaId) {
  var lista = CATALOGOS_GS[listaId];
  if (!lista) return false;
  return lista.indexOf(valor) > -1;
}

/**
 * Valida que cada elemento de un arreglo pertenezca al catálogo dado.
 * Devuelve true si el arreglo es válido (incluye arreglo vacío como válido;
 * la obligatoriedad se valida aparte).
 */
function arregloEnCatalogo(arr, listaId) {
  if (!Array.isArray(arr)) return false;
  for (var i = 0; i < arr.length; i++) {
    if (!valorEnCatalogo(arr[i], listaId)) return false;
  }
  return true;
}
