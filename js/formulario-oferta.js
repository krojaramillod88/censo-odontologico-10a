/**
 * CENSO ODONTOLÓGICO 10A — formulario-oferta.js
 * Formulario "Quiero ayudar".
 */

document.addEventListener("DOMContentLoaded", function () {
  var C = window.CATALOGOS;

  function opt(list) {
    return list.map(function (o) { return [o.id, o.nombre]; });
  }

  var steps = [
    {
      id: "tipo_oferente", section: "Identificación", type: "single", required: true,
      question: "¿A título de qué ofreces ayuda?",
      options: opt(C.TIPO_OFERENTE)
    },
    {
      id: "categoria_ayuda", section: "La oferta", type: "multi", required: true,
      question: "¿Qué tipo de ayuda puedes ofrecer?",
      help: "Puedes marcar varias.",
      options: opt(C.CATEGORIA_AYUDA)
    },
    {
      id: "cobertura_geografica", section: "La oferta", type: "single", required: true,
      question: "¿Cuál es tu cobertura geográfica?",
      options: opt(C.COBERTURA_GEOGRAFICA)
    },
    {
      id: "disponibilidad", section: "La oferta", type: "single", required: true,
      question: "¿Cuál es tu disponibilidad?",
      options: opt(C.DISPONIBILIDAD)
    },
    {
      id: "descripcion_breve", section: "La oferta", type: "textarea", required: false, maxLength: 200,
      question: "¿Quieres describir brevemente tu oferta? (opcional)"
    },
    {
      id: "autoriza_oferta_publica", section: "Visibilidad", type: "single", required: true,
      question: "¿Autorizas que tu oferta aparezca públicamente?",
      options: opt(C.AUTORIZA_OFERTA_PUBLICA)
    },
    {
      id: "cierre", section: "Cierre", type: "consent", required: true, contactRequired: true,
      question: "Tus datos de contacto",
      help: "Nombre u organización, y un medio de contacto. Son necesarios para poder concretar tu oferta."
    }
  ];

  var stepper = new FormStepper({
    containerId: "formRoot",
    progressFillId: "progressFill",
    stepLabelId: "stepLabel",
    stepSectionId: "stepSection",
    steps: steps,
    onSubmit: enviarOferta
  });

  window.CENSO_STEPPER = stepper;
  stepper.render();

  async function enviarOferta(state) {
    var root = document.getElementById("formRoot");
    root.innerHTML = '<p class="q-help">Enviando tu oferta…</p>';

    var payload = Object.assign({ formulario: "oferta", website: state.website || "" }, state);
    var result = await submitToApi(payload);

    if (!result.ok) {
      renderErrorEnvio(result.error, function () { enviarOferta(state); });
      return;
    }
    renderConfirmacion(state, result.data);
  }

  function renderErrorEnvio(mensaje, reintentar) {
    var root = document.getElementById("formRoot");
    root.innerHTML =
      '<h1 class="q-title">No pudimos enviar tu oferta</h1>' +
      '<div class="api-error-box">' + escapeHtml(mensaje) + "</div>" +
      '<div class="q-nav"><span></span><button type="button" class="btn btn-primary" id="retryBtn">Reintentar →</button></div>';
    document.getElementById("retryBtn").addEventListener("click", reintentar);
  }

  function renderConfirmacion(state, data) {
    document.getElementById("stepLabel").textContent = "Oferta enviada";
    document.getElementById("stepSection").textContent = "Confirmación";
    document.getElementById("progressFill").style.width = "100%";

    var codigo = data.codigo_seguimiento || generarCodigoSeguimiento("10A-O");
    var root = document.getElementById("formRoot");

    var simuladoNota = data.simulado
      ? '<div class="api-error-box" style="background:var(--gold-soft); color:var(--ink);">' +
        (data.aviso || "Envío simulado: el backend de Google Apps Script aún no está conectado.") +
        "</div>"
      : "";

    root.innerHTML =
      '<div class="summary-card">' +
      '<h1 class="q-title" style="max-width:none;">Gracias por ofrecer ayuda</h1>' +
      '<p class="q-help" style="max-width:none;">Tu código de seguimiento es:</p>' +
      '<div class="summary-code">' + escapeHtml(codigo) + "</div>" +
      simuladoNota +
      '<p class="summary-note">Tu oferta quedará disponible para el sistema de conexión con necesidades registradas del gremio, cuando esta función esté activa.</p>' +
      '<div class="summary-actions">' +
      '<button type="button" class="btn btn-primary" id="restartBtn">Registrar otra oferta</button>' +
      '<a class="btn btn-ghost" href="index.html">Volver al inicio</a>' +
      "</div></div>";

    document.getElementById("restartBtn").addEventListener("click", function () { stepper.reset(); });
  }
});
