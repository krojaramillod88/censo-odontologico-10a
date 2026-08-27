/**
 * CENSO ODONTOLÓGICO 10A — formulario-ayuda.js
 * Formulario "Necesito ayuda".
 */

document.addEventListener("DOMContentLoaded", function () {
  var C = window.CATALOGOS;

  function opt(list) {
    return list.map(function (o) { return [o.id, o.nombre]; });
  }

  // Si el usuario llega desde la confirmación de "Reportar afectación"
  // con ?ref=CODIGO, precargamos el código de seguimiento.
  var params = new URLSearchParams(window.location.search);
  var refCode = params.get("ref") || "";

  var steps = [
    {
      id: "ya_reporto", section: "Punto de partida", type: "single", required: true,
      question: "¿Ya completaste el formulario de \"Reportar afectación\"?",
      options: [["si", "Sí, ya tengo un código"], ["no", "No, es una solicitud independiente"]]
    },
    {
      id: "codigo_reporte", section: "Punto de partida", type: "text", required: true, maxLength: 20,
      condition: function (s) { return s.ya_reporto === "si"; },
      question: "¿Cuál es tu código de seguimiento?",
      help: "Ejemplo: 10A-7F3K2"
    },
    {
      id: "tipo_solicitante", section: "Identificación", type: "single", required: true,
      question: "¿Solicitas a título de...?",
      options: opt(C.TIPO_SOLICITANTE)
    },
    {
      id: "departamento", section: "Ubicación", type: "single", required: true,
      question: "¿En qué departamento te encuentras?",
      options: opt(C.DEPARTAMENTOS)
    },
    {
      id: "municipio", section: "Ubicación", type: "single", required: true,
      question: "¿En qué municipio?",
      options: function (s) { return (C.municipiosDe(s.departamento) || []).map(function (m) { return [m, m]; }); }
    },
    {
      id: "categoria_necesidad", section: "La necesidad", type: "multi", required: true,
      question: "¿Qué tipo de ayuda necesitas?",
      help: "Puedes marcar varias.",
      options: opt(C.CATEGORIA_NECESIDAD)
    },
    {
      id: "urgencia", section: "La necesidad", type: "single", required: true,
      question: "¿Cuál es el nivel de urgencia?",
      options: opt(C.URGENCIA)
    },
    {
      id: "descripcion_breve", section: "La necesidad", type: "textarea", required: false, maxLength: 200,
      question: "¿Quieres describir brevemente qué necesitas? (opcional)",
      help: "No incluyas información médica ni de pacientes."
    },
    {
      id: "cierre", section: "Cierre", type: "consent", required: true, contactRequired: true,
      question: "Tus datos de contacto",
      help: "Son necesarios para que podamos avisarte si alguien puede ayudarte."
    }
  ];

  var stepper = new FormStepper({
    containerId: "formRoot",
    progressFillId: "progressFill",
    stepLabelId: "stepLabel",
    stepSectionId: "stepSection",
    steps: steps,
    onSubmit: enviarNecesidad
  });

  if (refCode) stepper.state.codigo_reporte = refCode;
  window.CENSO_STEPPER = stepper;
  stepper.render();

  async function enviarNecesidad(state) {
    var root = document.getElementById("formRoot");
    root.innerHTML = '<p class="q-help">Enviando tu solicitud…</p>';

    var payload = Object.assign({ formulario: "necesidad", website: state.website || "" }, state);
    var result = await submitToApi(payload);

    if (!result.ok) {
      renderErrorEnvio(result.error, function () { enviarNecesidad(state); });
      return;
    }
    renderConfirmacion(state, result.data);
  }

  function renderErrorEnvio(mensaje, reintentar) {
    var root = document.getElementById("formRoot");
    root.innerHTML =
      '<h1 class="q-title">No pudimos enviar tu solicitud</h1>' +
      '<div class="api-error-box">' + escapeHtml(mensaje) + "</div>" +
      '<div class="q-nav"><span></span><button type="button" class="btn btn-primary" id="retryBtn">Reintentar →</button></div>';
    document.getElementById("retryBtn").addEventListener("click", reintentar);
  }

  var URGENCIA_ESTILO = {
    alta: ["Urgencia alta", "var(--brick)", "var(--brick-soft)"],
    media: ["Urgencia media", "var(--gold)", "var(--gold-soft)"],
    baja: ["Urgencia baja", "var(--teal)", "var(--teal-soft)"]
  };

  function renderConfirmacion(state, data) {
    document.getElementById("stepLabel").textContent = "Solicitud enviada";
    document.getElementById("stepSection").textContent = "Confirmación";
    document.getElementById("progressFill").style.width = "100%";

    var codigo = data.codigo_seguimiento || generarCodigoSeguimiento("10A-N");
    var estilo = URGENCIA_ESTILO[state.urgencia] || ["Urgencia registrada", "var(--teal)", "var(--teal-soft)"];
    var root = document.getElementById("formRoot");

    var simuladoNota = data.simulado
      ? '<div class="api-error-box" style="background:var(--gold-soft); color:var(--ink);">' +
        (data.aviso || "Envío simulado: el backend de Google Apps Script aún no está conectado.") +
        "</div>"
      : "";

    root.innerHTML =
      '<div class="summary-card">' +
      '<h1 class="q-title" style="max-width:none;">Solicitud registrada</h1>' +
      '<p class="q-help" style="max-width:none;">Tu código de seguimiento es:</p>' +
      '<div class="summary-code">' + escapeHtml(codigo) + "</div>" +
      '<div class="badge" style="color:' + estilo[1] + '; background:' + estilo[2] + ';">' + estilo[0] + "</div>" +
      simuladoNota +
      '<p class="summary-note">Tu necesidad quedará disponible para el sistema de conexión con ofertas de ayuda del gremio, cuando esta función esté activa.</p>' +
      '<div class="summary-actions">' +
      '<button type="button" class="btn btn-primary" id="restartBtn">Enviar otra solicitud</button>' +
      '<a class="btn btn-ghost" href="index.html">Volver al inicio</a>' +
      "</div></div>";

    document.getElementById("restartBtn").addEventListener("click", function () { stepper.reset(); });
  }
});
