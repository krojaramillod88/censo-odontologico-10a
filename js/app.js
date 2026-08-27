/**
 * CENSO ODONTOLÓGICO 10A — app.js
 * Utilidades compartidas: menú móvil y motor genérico de formularios
 * paso a paso (FormStepper), reutilizado por los tres formularios.
 */

(function () {
  // ---------------------------------------------------------------
  // Menú móvil (Home y páginas de contenido)
  // ---------------------------------------------------------------
  document.addEventListener("DOMContentLoaded", function () {
    var menuBtn = document.querySelector(".menu-btn");
    var navLinks = document.querySelector(".nav-links");
    if (menuBtn && navLinks) {
      menuBtn.addEventListener("click", function () {
        var isOpen = navLinks.classList.toggle("open");
        menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
    }
  });
})();

/**
 * FormStepper
 * Motor genérico de formulario condicional paso a paso.
 *
 * config = {
 *   containerId: "formRoot",
 *   progressFillId: "progressFill",
 *   stepLabelId: "stepLabel",
 *   stepSectionId: "stepSection",
 *   steps: [ ... ],               // ver definición de "step" abajo
 *   onSubmit: function(state) {}, // se llama al llegar al final
 * }
 *
 * step = {
 *   id: "campo_id",
 *   section: "Nombre de sección",
 *   type: "single" | "multi" | "text" | "textarea" | "consent" | "info",
 *   question: "Texto de la pregunta",
 *   help: "Texto de ayuda (opcional)",
 *   note: "Nota destacada, ej. autorreporte (opcional)",
 *   options: [ [valor, etiqueta], ... ]  o función(state) => [...]
 *   required: true|false,
 *   condition: function(state) => true|false,
 *   contactRequired: true|false   // solo type "consent"
 * }
 */
function FormStepper(config) {
  this.containerId = config.containerId;
  this.progressFillId = config.progressFillId;
  this.stepLabelId = config.stepLabelId;
  this.stepSectionId = config.stepSectionId;
  this.steps = config.steps;
  this.onSubmit = config.onSubmit;
  this.state = {};
  this.currentIndex = 0;
}

FormStepper.prototype.visibleSteps = function () {
  var state = this.state;
  return this.steps.filter(function (s) {
    return !s.condition || s.condition(state);
  });
};

FormStepper.prototype.optionsFor = function (step) {
  return typeof step.options === "function" ? step.options(this.state) : step.options;
};

FormStepper.prototype.isValid = function (step) {
  var state = this.state;
  if (step.type === "consent") {
    if (!state.consentimiento) return false;
    if (step.contactRequired && !(state.contacto && state.contacto.trim().length > 0)) return false;
    if (step.contactRequired && !(state.nombre && state.nombre.trim().length > 0)) return false;
    return true;
  }
  if (!step.required) return true;
  if (step.type === "single") return !!state[step.id];
  if (step.type === "multi") return !!(state[step.id] && state[step.id].length > 0);
  if (step.type === "text" || step.type === "textarea") {
    return !!(state[step.id] && state[step.id].trim().length > 0);
  }
  return true;
};

FormStepper.prototype.goNext = function () {
  var step = this.visibleSteps()[this.currentIndex];
  var errSlot = document.getElementById("errorSlot");
  if (!this.isValid(step)) {
    if (errSlot) {
      errSlot.textContent = step.type === "consent"
        ? "Debes aceptar el uso de datos" + (step.contactRequired ? " y dejar nombre y contacto" : "") + " para continuar."
        : "Este campo es obligatorio para continuar.";
    }
    return;
  }
  var vis = this.visibleSteps();
  if (this.currentIndex < vis.length - 1) {
    this.currentIndex++;
    this.render();
  } else if (this.onSubmit) {
    this.onSubmit(this.state);
  }
};

FormStepper.prototype.goBack = function () {
  if (this.currentIndex > 0) {
    this.currentIndex--;
    this.render();
  }
};

FormStepper.prototype.toggleSingle = function (step, value) {
  this.state[step.id] = value;
  this.render();
};

FormStepper.prototype.toggleMulti = function (step, value) {
  var arr = this.state[step.id] || [];
  var i = arr.indexOf(value);
  if (i > -1) { arr.splice(i, 1); } else { arr.push(value); }
  this.state[step.id] = arr;
  this.render();
};

FormStepper.prototype.reset = function () {
  this.state = {};
  this.currentIndex = 0;
  this.render();
};

FormStepper.prototype.render = function () {
  var self = this;
  var vis = this.visibleSteps();
  // por seguridad, si una respuesta cambió y el índice actual quedó fuera de rango
  if (this.currentIndex >= vis.length) this.currentIndex = vis.length - 1;
  var step = vis[this.currentIndex];
  var root = document.getElementById(this.containerId);

  var stepLabelEl = document.getElementById(this.stepLabelId);
  var stepSectionEl = document.getElementById(this.stepSectionId);
  var progressFillEl = document.getElementById(this.progressFillId);
  if (stepLabelEl) stepLabelEl.textContent = "Paso " + (this.currentIndex + 1) + " de " + vis.length;
  if (stepSectionEl) stepSectionEl.textContent = step.section;
  if (progressFillEl) progressFillEl.style.width = ((this.currentIndex) / (vis.length - 1 || 1)) * 100 + "%";

  var html = "";
  html += '<div class="q-eyebrow mono">' + escapeHtml(step.section.toUpperCase()) + "</div>";
  html += '<h1 class="q-title">' + escapeHtml(step.question) + "</h1>";
  if (step.help) html += '<p class="q-help">' + escapeHtml(step.help) + "</p>";
  if (step.note) html += '<span class="q-note">' + escapeHtml(step.note) + "</span>";

  if (step.type === "single" || step.type === "multi") {
    var opts = this.optionsFor(step);
    html += '<div class="option-grid">';
    opts.forEach(function (opt) {
      var val = opt[0], label = opt[1];
      var selected = step.type === "single"
        ? self.state[step.id] === val
        : (self.state[step.id] || []).indexOf(val) > -1;
      html += '<button type="button" class="option-chip ' + (step.type === "multi" ? "multi" : "") +
        (selected ? " selected" : "") + '" data-val="' + escapeHtml(val) + '" aria-pressed="' + selected + '">' +
        '<span class="mark" aria-hidden="true"></span><span>' + escapeHtml(label) + "</span></button>";
    });
    html += "</div>";

    var otroActive = step.type === "single"
      ? self.state[step.id] === "otro"
      : (self.state[step.id] || []).indexOf("otro") > -1;
    if (otroActive) {
      html += '<div class="field otro-field"><label for="otroInput">Especifica "otro"</label>' +
        '<input type="text" id="otroInput" maxlength="60" value="' +
        escapeAttr(self.state[step.id + "_otro"] || "") + '"></div>';
    }
  }

  if (step.type === "text") {
    html += '<div class="field"><label for="textInput" class="sr-only">' + escapeHtml(step.question) + '</label>' +
      '<input type="text" id="textInput" maxlength="' + (step.maxLength || 60) + '" value="' +
      escapeAttr(self.state[step.id] || "") + '" placeholder="Escribe aquí..."></div>';
  }

  if (step.type === "textarea") {
    var val = self.state[step.id] || "";
    var max = step.maxLength || 200;
    html += '<div class="field">' +
      '<textarea id="textareaInput" rows="4" maxlength="' + max + '">' + escapeHtml(val) + "</textarea>" +
      '<div class="char-count" id="charCount">' + val.length + "/" + max + "</div></div>";
  }

  if (step.type === "consent") {
    html += '<div class="field"><label for="nombreInput">Nombre' +
      (step.contactRequired ? ' <span class="req">*</span>' : " (opcional)") + "</label>" +
      '<input type="text" id="nombreInput" value="' + escapeAttr(self.state.nombre || "") + '"></div>';
    html += '<div class="field"><label for="contactoInput">Teléfono o correo' +
      (step.contactRequired ? ' <span class="req">*</span>' : " (opcional)") + "</label>" +
      '<input type="text" id="contactoInput" value="' + escapeAttr(self.state.contacto || "") + '"></div>';
    html += '<div class="field"><label for="autorizaSelect">¿Autorizas que organizaciones de ayuda te contacten?</label>' +
      '<select id="autorizaSelect">' +
      CATALOGOS.AUTORIZA_CONTACTO.map(function (o) {
        var sel = self.state.autoriza_contacto_publico === o.id ? " selected" : "";
        return '<option value="' + o.id + '"' + sel + ">" + escapeHtml(o.nombre) + "</option>";
      }).join("") +
      "</select></div>";
    html += '<div class="consent-row">' +
      '<input type="checkbox" id="consentCheck" ' + (self.state.consentimiento ? "checked" : "") + '>' +
      '<p>Autorizo el tratamiento de la información proporcionada para los fines explicados en esta iniciativa. ' +
      'Consulta la <a href="privacidad.html">Política de Privacidad</a>.</p></div>';
    // honeypot: campo oculto, si un bot lo llena se descarta el envío en submitToApi()
    html += '<div class="hp-field" aria-hidden="true">' +
      '<label for="websiteHp">No completar este campo</label>' +
      '<input type="text" id="websiteHp" name="website" tabindex="-1" autocomplete="off"></div>';
  }

  html += '<div class="error-text" id="errorSlot" role="alert"></div>';
  html += '<div class="q-nav">' +
    (self.currentIndex > 0 ? '<button type="button" class="btn btn-ghost" id="backBtn">← Atrás</button>' : "<span></span>") +
    '<button type="button" class="btn btn-primary" id="nextBtn">' +
    (self.currentIndex === vis.length - 1 ? (step.submitLabel || "Enviar →") : "Siguiente →") +
    "</button></div>";

  root.innerHTML = html;

  root.querySelectorAll(".option-chip").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var val = btn.getAttribute("data-val");
      if (step.type === "single") self.toggleSingle(step, val);
      else self.toggleMulti(step, val);
    });
  });

  var otroInput = document.getElementById("otroInput");
  if (otroInput) otroInput.addEventListener("input", function (e) { self.state[step.id + "_otro"] = e.target.value; });

  var textInput = document.getElementById("textInput");
  if (textInput) textInput.addEventListener("input", function (e) { self.state[step.id] = e.target.value; });

  var textareaInput = document.getElementById("textareaInput");
  if (textareaInput) textareaInput.addEventListener("input", function (e) {
    self.state[step.id] = e.target.value;
    var cc = document.getElementById("charCount");
    if (cc) cc.textContent = e.target.value.length + "/" + (step.maxLength || 200);
  });

  var nombreInput = document.getElementById("nombreInput");
  if (nombreInput) nombreInput.addEventListener("input", function (e) { self.state.nombre = e.target.value; });
  var contactoInput = document.getElementById("contactoInput");
  if (contactoInput) contactoInput.addEventListener("input", function (e) { self.state.contacto = e.target.value; });
  var autorizaSelect = document.getElementById("autorizaSelect");
  if (autorizaSelect) {
    self.state.autoriza_contacto_publico = self.state.autoriza_contacto_publico || "no";
    autorizaSelect.addEventListener("change", function (e) { self.state.autoriza_contacto_publico = e.target.value; });
  }
  var consentCheck = document.getElementById("consentCheck");
  if (consentCheck) consentCheck.addEventListener("change", function (e) { self.state.consentimiento = e.target.checked; });

  document.getElementById("nextBtn").addEventListener("click", function () { self.goNext(); });
  var backBtn = document.getElementById("backBtn");
  if (backBtn) backBtn.addEventListener("click", function () { self.goBack(); });
};

// ---------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------
function escapeHtml(str) {
  if (str === undefined || str === null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
function escapeAttr(str) {
  return escapeHtml(str).replace(/"/g, "&quot;");
}

function generarCodigoSeguimiento(prefijo) {
  var chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sin caracteres ambiguos (0/O, 1/I)
  var code = (prefijo || "10A") + "-";
  for (var i = 0; i < 5; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
