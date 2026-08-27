/**
 * CENSO ODONTOLÓGICO 10A — Catálogos centralizados
 * Única fuente de verdad para listas cerradas usadas en todos los formularios.
 * IMPORTANTE: estas mismas listas (valores "id") deben coincidir con las de
 * apps-script/catalogos.gs para que la validación del backend sea consistente.
 */

window.CATALOGOS = (function () {

  var DEPARTAMENTOS = [
    { id: "valle_del_cauca", nombre: "Valle del Cauca" },
    { id: "choco", nombre: "Chocó" },
    { id: "risaralda", nombre: "Risaralda" },
    { id: "quindio", nombre: "Quindío" },
    { id: "caldas", nombre: "Caldas" },
    { id: "antioquia", nombre: "Antioquia" },
    { id: "cauca", nombre: "Cauca" },
    { id: "amazonas", nombre: "Amazonas" },
    { id: "arauca", nombre: "Arauca" },
    { id: "atlantico", nombre: "Atlántico" },
    { id: "bolivar", nombre: "Bolívar" },
    { id: "boyaca", nombre: "Boyacá" },
    { id: "caqueta", nombre: "Caquetá" },
    { id: "casanare", nombre: "Casanare" },
    { id: "cesar", nombre: "Cesar" },
    { id: "cordoba", nombre: "Córdoba" },
    { id: "cundinamarca", nombre: "Cundinamarca" },
    { id: "guainia", nombre: "Guainía" },
    { id: "guaviare", nombre: "Guaviare" },
    { id: "huila", nombre: "Huila" },
    { id: "la_guajira", nombre: "La Guajira" },
    { id: "magdalena", nombre: "Magdalena" },
    { id: "meta", nombre: "Meta" },
    { id: "narino", nombre: "Nariño" },
    { id: "norte_de_santander", nombre: "Norte de Santander" },
    { id: "putumayo", nombre: "Putumayo" },
    { id: "san_andres", nombre: "San Andrés y Providencia" },
    { id: "santander", nombre: "Santander" },
    { id: "sucre", nombre: "Sucre" },
    { id: "tolima", nombre: "Tolima" },
    { id: "vaupes", nombre: "Vaupés" },
    { id: "vichada", nombre: "Vichada" },
    { id: "bogota_dc", nombre: "Bogotá D.C." }
  ];

  var MUNICIPIOS = {
    valle_del_cauca: ["Cali", "Buenaventura", "Tuluá", "Palmira", "Cartago", "Otro municipio"],
    choco: ["Quibdó", "Istmina", "San José del Palmar", "Otro municipio"],
    risaralda: ["Pereira", "Dosquebradas", "Santa Rosa de Cabal", "Otro municipio"],
    quindio: ["Armenia", "Calarcá", "Otro municipio"],
    caldas: ["Manizales", "Chinchiná", "Otro municipio"],
    antioquia: ["Medellín", "Bello", "Itagüí", "Otro municipio"],
    cauca: ["Popayán", "Santander de Quilichao", "Puerto Tejada", "El Bordo (Patía)", "Otro municipio"],
    amazonas: ["Leticia", "Otro municipio"],
    arauca: ["Arauca", "Otro municipio"],
    atlantico: ["Barranquilla", "Otro municipio"],
    bolivar: ["Cartagena", "Otro municipio"],
    boyaca: ["Tunja", "Otro municipio"],
    caqueta: ["Florencia", "Otro municipio"],
    casanare: ["Yopal", "Otro municipio"],
    cesar: ["Valledupar", "Otro municipio"],
    cordoba: ["Montería", "Otro municipio"],
    cundinamarca: ["Soacha", "Facatativá", "Otro municipio"],
    guainia: ["Inírida", "Otro municipio"],
    guaviare: ["San José del Guaviare", "Otro municipio"],
    huila: ["Neiva", "Otro municipio"],
    la_guajira: ["Riohacha", "Otro municipio"],
    magdalena: ["Santa Marta", "Otro municipio"],
    meta: ["Villavicencio", "Otro municipio"],
    narino: ["Pasto", "Otro municipio"],
    norte_de_santander: ["Cúcuta", "Otro municipio"],
    putumayo: ["Mocoa", "Otro municipio"],
    san_andres: ["San Andrés", "Otro municipio"],
    santander: ["Bucaramanga", "Otro municipio"],
    sucre: ["Sincelejo", "Otro municipio"],
    tolima: ["Ibagué", "Otro municipio"],
    vaupes: ["Mitú", "Otro municipio"],
    vichada: ["Puerto Carreño", "Otro municipio"],
    bogota_dc: ["Bogotá"]
  };

  function municipiosDe(departamentoId) {
    return MUNICIPIOS[departamentoId] || ["Otro municipio"];
  }

  var ROLES = [
    { id: "odontologo_general", nombre: "Odontólogo general" },
    { id: "odontologo_especialista", nombre: "Odontólogo especialista" },
    { id: "estudiante", nombre: "Estudiante de odontología" },
    { id: "auxiliar", nombre: "Auxiliar de odontología" },
    { id: "higienista", nombre: "Higienista" },
    { id: "recepcionista", nombre: "Recepcionista" },
    { id: "tecnico_dental", nombre: "Técnico dental" },
    { id: "laboratorista", nombre: "Laboratorista o protesista" },
    { id: "docente", nombre: "Docente" },
    { id: "investigador", nombre: "Investigador" },
    { id: "administrativo", nombre: "Administrativo" },
    { id: "propietario_consultorio", nombre: "Propietario de consultorio" },
    { id: "propietario_clinica", nombre: "Propietario de clínica" },
    { id: "laboratorio_dental", nombre: "Laboratorio dental" },
    { id: "distribuidor", nombre: "Distribuidor" },
    { id: "fabricante", nombre: "Fabricante" },
    { id: "representante_comercial", nombre: "Representante comercial" },
    { id: "institucion_educativa", nombre: "Institución educativa" },
    { id: "organizacion_gremial", nombre: "Organización gremial" },
    { id: "otro", nombre: "Otro" }
  ];

  var TIPO_ESTABLECIMIENTO = [
    { id: "consultorio", nombre: "Consultorio" },
    { id: "clinica", nombre: "Clínica odontológica" },
    { id: "laboratorio", nombre: "Laboratorio dental" },
    { id: "distribuidora", nombre: "Distribuidora" },
    { id: "fabricante", nombre: "Fabricante" },
    { id: "institucion_educativa", nombre: "Institución educativa" },
    { id: "oficina_admin", nombre: "Oficina administrativa" },
    { id: "otro", nombre: "Otro" }
  ];

  var RELACION_ESTABLECIMIENTO = [
    { id: "propietario", nombre: "Propietario" },
    { id: "empleado", nombre: "Empleado" },
    { id: "arrendatario", nombre: "Arrendatario" },
    { id: "estudiante", nombre: "Estudiante" },
    { id: "otro", nombre: "Otro" }
  ];

  var RELACION_SISMO = [
    { id: "se_produjo_despues", nombre: "Se produjo después del sismo" },
    { id: "empeoro_despues", nombre: "Empeoró después del sismo" },
    { id: "existia_empeoro", nombre: "Ya existía antes y empeoró después" },
    { id: "existia_sin_cambio", nombre: "Ya existía antes y no cambió" },
    { id: "no_seguro", nombre: "No estoy seguro" }
  ];

  var TIPO_AFECTACION_PERSONAL = [
    { id: "salud_capacidad", nombre: "Salud / capacidad para trabajar" },
    { id: "vivienda", nombre: "Vivienda" },
    { id: "laboral", nombre: "Laboral" },
    { id: "economica", nombre: "Económica" },
    { id: "movilidad", nombre: "Movilidad" },
    { id: "otra", nombre: "Otra" }
  ];

  var CAPACIDAD_TRABAJO = [
    { id: "si_normalidad", nombre: "Sí, con normalidad" },
    { id: "si_parcialmente", nombre: "Sí, parcialmente" },
    { id: "no_temporalmente", nombre: "No, temporalmente" },
    { id: "no_sabe_cuando", nombre: "No sé cuándo podré hacerlo" }
  ];

  var QUE_OCURRIO = [
    { id: "infraestructura", nombre: "Infraestructura" },
    { id: "equipos", nombre: "Equipos" },
    { id: "instrumental", nombre: "Instrumental" },
    { id: "inventario", nombre: "Inventario / insumos" },
    { id: "servicios_publicos", nombre: "Servicios públicos" },
    { id: "acceso_movilidad", nombre: "Acceso o movilidad" },
    { id: "operacion", nombre: "Operación" },
    { id: "ingresos", nombre: "Ingresos" },
    { id: "otra", nombre: "Otra" }
  ];

  var NIVEL_DANO_INFRAESTRUCTURA = [
    { id: "sin_dano", nombre: "Sin daño" },
    { id: "leve", nombre: "Leve" },
    { id: "moderado", nombre: "Moderado" },
    { id: "severo", nombre: "Severo" },
    { id: "colapso", nombre: "Colapso total" },
    { id: "no_evaluado", nombre: "No evaluado aún" }
  ];

  var ESTADO_OPERATIVO = [
    { id: "normal", nombre: "Opera con normalidad" },
    { id: "parcial", nombre: "Opera parcialmente" },
    { id: "restricciones", nombre: "Opera con restricciones" },
    { id: "temp_cerrado", nombre: "Temporalmente cerrado" },
    { id: "cerrado_aviso", nombre: "Cerrado hasta nuevo aviso" }
  ];

  var EQUIPOS = [
    { id: "unidades", nombre: "Unidades odontológicas" },
    { id: "compresores", nombre: "Compresores" },
    { id: "autoclaves", nombre: "Autoclaves" },
    { id: "rayosx", nombre: "Equipos de rayos X" },
    { id: "sensores", nombre: "Sensores o tecnología digital" },
    { id: "instrumental", nombre: "Instrumental" },
    { id: "lab", nombre: "Equipos de laboratorio" },
    { id: "computadores", nombre: "Computadores" },
    { id: "mobiliario", nombre: "Mobiliario" },
    { id: "otros", nombre: "Otros" }
  ];

  var INVENTARIO = [
    { id: "insumos_clinicos", nombre: "Insumos clínicos" },
    { id: "material_lab", nombre: "Material de laboratorio" },
    { id: "papeleria", nombre: "Papelería y administrativo" },
    { id: "otro", nombre: "Otro" }
  ];

  var RANGO_ECONOMICO = [
    { id: "sin_impacto", nombre: "Sin impacto estimado" },
    { id: "r1", nombre: "Menos de $2.000.000" },
    { id: "r2", nombre: "$2.000.000 – $10.000.000" },
    { id: "r3", nombre: "$10.000.001 – $30.000.000" },
    { id: "r4", nombre: "$30.000.001 – $80.000.000" },
    { id: "r5", nombre: "Más de $80.000.000" },
    { id: "no_responde", nombre: "Prefiero no responder" }
  ];

  var CAPACIDAD_RECUPERACION = [
    { id: "ya_normal", nombre: "Ya opera con normalidad" },
    { id: "dias", nombre: "Días" },
    { id: "semanas", nombre: "Semanas" },
    { id: "meses", nombre: "Meses" },
    { id: "no_sabe", nombre: "No sabe" }
  ];

  var NECESITA_APOYO = [
    { id: "no", nombre: "No" },
    { id: "urgente", nombre: "Sí, necesito ayuda urgente" },
    { id: "no_urgente", nombre: "Sí, pero no es urgente" },
    { id: "no_sabe", nombre: "Todavía no lo sé" }
  ];

  var TIPO_SOLICITANTE = [
    { id: "persona", nombre: "Persona" },
    { id: "establecimiento", nombre: "Establecimiento" },
    { id: "institucion", nombre: "Institución" }
  ];

  var CATEGORIA_NECESIDAD = [
    { id: "equipos", nombre: "Equipos" },
    { id: "instrumental", nombre: "Instrumental" },
    { id: "insumos", nombre: "Insumos" },
    { id: "espacio_fisico", nombre: "Espacio físico temporal" },
    { id: "reparacion", nombre: "Reparación" },
    { id: "apoyo_financiero", nombre: "Apoyo financiero" },
    { id: "apoyo_operativo", nombre: "Apoyo operativo" },
    { id: "asesoria_legal", nombre: "Asesoría legal o gremial" },
    { id: "informacion", nombre: "Información" },
    { id: "capacitacion", nombre: "Capacitación" },
    { id: "otra", nombre: "Otra" }
  ];

  var URGENCIA = [
    { id: "alta", nombre: "Alta" },
    { id: "media", nombre: "Media" },
    { id: "baja", nombre: "Baja" }
  ];

  var TIPO_OFERENTE = [
    { id: "persona_individual", nombre: "Persona individual" },
    { id: "empresa", nombre: "Empresa" },
    { id: "organizacion_gremial", nombre: "Organización gremial" },
    { id: "institucion_educativa", nombre: "Institución educativa" },
    { id: "entidad_publica", nombre: "Entidad pública" },
    { id: "otro", nombre: "Otro" }
  ];

  var CATEGORIA_AYUDA = [
    { id: "equipos", nombre: "Equipos" },
    { id: "instrumental", nombre: "Instrumental" },
    { id: "insumos", nombre: "Insumos" },
    { id: "espacio_fisico", nombre: "Espacio físico" },
    { id: "reparacion_mantenimiento", nombre: "Reparación o mantenimiento" },
    { id: "financiacion", nombre: "Financiación" },
    { id: "servicios_profesionales", nombre: "Servicios profesionales" },
    { id: "asesoria", nombre: "Asesoría" },
    { id: "transporte_logistica", nombre: "Transporte o logística" },
    { id: "capacitacion", nombre: "Capacitación" },
    { id: "otros", nombre: "Otros" }
  ];

  var COBERTURA_GEOGRAFICA = [
    { id: "solo_municipio", nombre: "Solo mi municipio" },
    { id: "departamento", nombre: "Todo el departamento" },
    { id: "nacional", nombre: "Nacional" },
    { id: "otra_region", nombre: "Otra región específica" }
  ];

  var DISPONIBILIDAD = [
    { id: "inmediata", nombre: "Inmediata" },
    { id: "15_dias", nombre: "En los próximos 15 días" },
    { id: "a_definir", nombre: "A definir según la necesidad" }
  ];

  var AUTORIZA_CONTACTO = [
    { id: "no", nombre: "No" },
    { id: "solo_censo", nombre: "Sí, solo por este medio" },
    { id: "compartir", nombre: "Sí, compartir mi contacto" }
  ];

  var AUTORIZA_OFERTA_PUBLICA = [
    { id: "no", nombre: "No, solo contacto gestionado por el censo" },
    { id: "si", nombre: "Sí, puede mostrarse públicamente" }
  ];

  return {
    DEPARTAMENTOS: DEPARTAMENTOS,
    municipiosDe: municipiosDe,
    ROLES: ROLES,
    TIPO_ESTABLECIMIENTO: TIPO_ESTABLECIMIENTO,
    RELACION_ESTABLECIMIENTO: RELACION_ESTABLECIMIENTO,
    RELACION_SISMO: RELACION_SISMO,
    TIPO_AFECTACION_PERSONAL: TIPO_AFECTACION_PERSONAL,
    CAPACIDAD_TRABAJO: CAPACIDAD_TRABAJO,
    QUE_OCURRIO: QUE_OCURRIO,
    NIVEL_DANO_INFRAESTRUCTURA: NIVEL_DANO_INFRAESTRUCTURA,
    ESTADO_OPERATIVO: ESTADO_OPERATIVO,
    EQUIPOS: EQUIPOS,
    INVENTARIO: INVENTARIO,
    RANGO_ECONOMICO: RANGO_ECONOMICO,
    CAPACIDAD_RECUPERACION: CAPACIDAD_RECUPERACION,
    NECESITA_APOYO: NECESITA_APOYO,
    TIPO_SOLICITANTE: TIPO_SOLICITANTE,
    CATEGORIA_NECESIDAD: CATEGORIA_NECESIDAD,
    URGENCIA: URGENCIA,
    TIPO_OFERENTE: TIPO_OFERENTE,
    CATEGORIA_AYUDA: CATEGORIA_AYUDA,
    COBERTURA_GEOGRAFICA: COBERTURA_GEOGRAFICA,
    DISPONIBILIDAD: DISPONIBILIDAD,
    AUTORIZA_CONTACTO: AUTORIZA_CONTACTO,
    AUTORIZA_OFERTA_PUBLICA: AUTORIZA_OFERTA_PUBLICA
  };

})();
