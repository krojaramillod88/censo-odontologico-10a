/**
 * CENSO ODONTOLÓGICO 10A — formulario-afectacion.js
 * Formulario "Reportar afectación".
 */

document.addEventListener("DOMContentLoaded", function () {
  var C = window.CATALOGOS;

  function opt(list) {
    return list.map(function (o) { return [o.id, o.nombre]; });
  }

  var steps = [
    // ---------- IDENTIFICACIÓN DEL REPORTE ----------
    {
      id: "tipo_reporte", section: "Empecemos", type: "single", required: true,
      question: "¿Qué quieres reportar?",
      help: "Puedes reportar tu situación personal, la de tu establecimiento, o ambas.",
      options: [["persona", "Mi situación"], ["establecimiento", "Mi establecimiento"], ["ambas", "Ambas"]]
    },
    {
      id: "departamento", section: "Ubicación", type: "single", required: true,
      question: "¿En qué departamento ocurrió la afectación?",
      options: opt(C.DEPARTAMENTOS)
    },
    {
      id: "municipio", section: "Ubicación", type: "single", required: true,
      question: "¿En qué municipio?",
      options: function (s) {
        return (C.municipiosDe(s.departamento) || []).map(function (m) { return [m, m]; });
      }
    },
    {
      id: "relacion_sismo", section: "Contexto", type: "single", required: true,
      question: "¿Qué relación tiene esta situación con el sismo?",
      options: opt(C.RELACION_SISMO)
    },

    // ---------- BLOQUE PERSONA ----------
    {
      id: "rol_sector", section: "Tu perfil", type: "single", required: true,
      condition: function (s) { return s.tipo_reporte === "persona" || s.tipo_reporte === "ambas"; },
      question: "¿Cuál es tu rol principal en el sector?",
      options: opt(C.ROLES)
    },
    {
      id: "tipo_afectacion_personal", section: "Tu situación", type: "multi", required: true,
      condition: function (s) { return s.tipo_reporte === "persona" || s.tipo_reporte === "ambas"; },
      question: "¿Cuál fue el tipo de afectación?",
      help: "Puedes marcar varias. No pediremos diagnósticos médicos ni detalles clínicos.",
      options: opt(C.TIPO_AFECTACION_PERSONAL)
    },
    {
      id: "capacidad_trabajo", section: "Tu situación", type: "single", required: true,
      condition: function (s) { return s.tipo_reporte === "persona" || s.tipo_reporte === "ambas"; },
      question: "¿Puedes ejercer tu actividad actualmente?",
      options: opt(C.CAPACIDAD_TRABAJO)
    },

    // ---------- BLOQUE ESTABLECIMIENTO ----------
    {
      id: "tipo_establecimiento", section: "Tu establecimiento", type: "single", required: true,
      condition: function (s) { return s.tipo_reporte === "establecimiento" || s.tipo_reporte === "ambas"; },
      question: "¿Qué tipo de establecimiento es?",
      options: opt(C.TIPO_ESTABLECIMIENTO)
    },
    {
      id: "relacion_establecimiento", section: "Tu establecimiento", type: "single", required: true,
      condition: function (s) { return s.tipo_reporte === "establecimiento" || s.tipo_reporte === "ambas"; },
      question: "¿Cuál es tu relación con el establecimiento?",
      options: opt(C.RELACION_ESTABLECIMIENTO)
    },
    {
      id: "que_ocurrio", section: "Tu establecimiento", type: "multi", required: true,
      condition: function (s) { return s.tipo_reporte === "establecimiento" || s.tipo_reporte === "ambas"; },
      question: "¿Qué ocurrió?",
      help: "Selecciona todo lo que aplique. Según lo que marques, te haremos algunas preguntas puntuales.",
      options: opt(C.QUE_OCURRIO)
    },
    {
      id: "nivel_dano_infraestructura", section: "Infraestructura", type: "single", required: true,
      condition: function (s) { return (s.que_ocurrio || []).indexOf("infraestructura") > -1; },
      question: "¿Cuál es el nivel de daño de la infraestructura?",
      options: opt(C.NIVEL_DANO_INFRAESTRUCTURA)
    },
    {
      id: "equipos_afectados", section: "Equipos", type: "multi", required: true,
      condition: function (s) { return (s.que_ocurrio || []).indexOf("equipos") > -1 || (s.que_ocurrio || []).indexOf("instrumental") > -1; },
      question: "¿Qué equipos o instrumental resultaron afectados?",
      help: "Puedes marcar varios.",
      options: opt(C.EQUIPOS)
    },
    {
      id: "inventario_afectado", section: "Inventario", type: "multi", required: true,
      condition: function (s) { return (s.que_ocurrio || []).indexOf("inventario") > -1; },
      question: "¿Qué tipo de inventario o insumos se perdieron?",
      help: "Puedes marcar varios.",
      options: opt(C.INVENTARIO)
    },
    {
      id: "estado_operativo", section: "Operación", type: "single", required: true,
      condition: function (s) {
        var o = s.que_ocurrio || [];
        return o.indexOf("operacion") > -1 || o.indexOf("servicios_publicos") > -1 || o.indexOf("acceso_movilidad") > -1;
      },
      question: "¿Cuál es el estado operativo actual?",
      options: opt(C.ESTADO_OPERATIVO)
    },
    {
      id: "rango_impacto_economico", section: "Impacto económico", type: "single", required: true,
      condition: function (s) { return s.tipo_reporte === "establecimiento" || s.tipo_reporte === "ambas"; },
      question: "¿Cuál es el rango de impacto económico estimado?",
      note: "Es una estimación de autorreporte, no un avalúo.",
      options: opt(C.RANGO_ECONOMICO)
    },
    {
      id: "capacidad_recuperacion", section: "Recuperación", type: "single", required: true,
      condition: function (s) { return s.tipo_reporte === "establecimiento" || s.tipo_reporte === "ambas"; },
      question: "¿Cuál es tu estimado de tiempo de recuperación?",
      options: opt(C.CAPACIDAD_RECUPERACION)
    },

    // ---------- NECESIDAD DE AYUDA (paso suave, no obliga a llenar Formulario B) ----------
    {
      id: "necesita_apoyo", section: "Apoyo", type: "single", required: true,
      question: "¿Necesitas algún tipo de apoyo en este momento?",
      options: opt(C.NECESITA_APOYO)
    },

    // ---------- CIERRE ----------
    {
      id: "cierre", section: "Cierre", type: "consent", required: true, contactRequired: false,
      question: "Tus datos de contacto (opcionales)",
      help: "Dejar tus datos es opcional, pero sin ellos no podremos avisarte si alguien puede ayudarte."
    }
  ];

  var stepper = new FormStepper({
    containerId: "formRoot",
    progressFillId: "progressFill",
    stepLabelId: "stepLabel",
    stepSectionId: "stepSection",
    steps: steps,
    onSubmit: enviarReporte
  });

  window.CENSO_STEPPER = stepper; // expuesto para el botón "empezar" del bloque de confianza
  stepper.render();

  async function enviarReporte(state) {
    var root = document.getElementById("formRoot");
    root.innerHTML = '<p class="q-help">Enviando tu reporte…</p>';

    var payload = Object.assign({ formulario: "afectacion", website: state.website || "" }, state);
    var result = await submitToApi(payload);

    if (!result.ok) {
      renderErrorEnvio(result.error, function () { enviarReporte(state); });
      return;
    }

    renderConfirmacion(state, result.data);
  }

  function renderErrorEnvio(mensaje, reintentar) {
    var root = document.getElementById("formRoot");
    root.innerHTML =
      '<h1 class="q-title">No pudimos enviar tu reporte</h1>' +
      '<div class="api-error-box">' + escapeHtml(mensaje) + "</div>" +
      '<div class="q-nav"><span></span><button type="button" class="btn btn-primary" id="retryBtn">Reintentar →</button></div>';
    document.getElementById("retryBtn").addEventListener("click", reintentar);
  }

  function renderConfirmacion(state, data) {
    document.getElementById("stepLabel").textContent = "Reporte enviado";
    document.getElementById("stepSection").textContent = "Confirmación";
    document.getElementById("progressFill").style.width = "100%";

    var codigo = data.codigo_seguimiento || generarCodigoSeguimiento("10A");
    var root = document.getElementById("formRoot");

    var apoyoHtml = "";
    if (state.necesita_apoyo === "urgente" || state.necesita_apoyo === "no_urgente") {
      apoyoHtml =
        '<div class="field" style="margin-top:22px; text-align:left;">' +
        '<p style="font-size:0.9rem; color:var(--ink-soft);">Nos indicaste que necesitas apoyo. Puedes registrar tu necesidad ' +
        'con más detalle — no es obligatorio hacerlo ahora.</p>' +
        '<div class="summary-actions" style="justify-content:flex-start; margin-top:12px;">' +
        '<a class="btn btn-brick" href="necesito-ayuda.html?ref=' + encodeURIComponent(codigo) + '">Registrar necesidad de ayuda →</a>' +
        "</div></div>";
    }

    var simuladoNota = data.simulado
      ? '<div class="api-error-box" style="background:var(--gold-soft); color:var(--ink);">' +
        (data.aviso || "Envío simulado: el backend de Google Apps Script aún no está conectado.") +
        "</div>"
      : "";

    root.innerHTML =
      '<div class="summary-card">' +
      '<h1 class="q-title" style="max-width:none;">Gracias por reportar.</h1>' +
      '<p class="q-help" style="max-width:none;">Guarda este código. Puede ser utilizado para relacionar posteriormente ' +
      'una necesidad de ayuda con tu reporte.</p>' +
      '<div class="summary-code">' + escapeHtml(codigo) + "</div>" +
      simuladoNota +
      apoyoHtml +
      '<div class="summary-actions">' +
      '<button type="button" class="btn btn-primary" id="restartBtn">Enviar otro reporte</button>' +
      '<a class="btn btn-ghost" href="index.html">Volver al inicio</a>' +
      "</div></div>";

    document.getElementById("restartBtn").addEventListener("click", function () { stepper.reset(); });
  }
});
