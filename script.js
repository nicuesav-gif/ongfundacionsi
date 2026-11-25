"use strict";

function configureNavigation() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("navegacion");
  const compact = window.matchMedia("(max-width: 61rem)");

  function setExpanded(expanded) {
    toggle.setAttribute("aria-expanded", String(expanded));
    nav.hidden = compact.matches && !expanded;
  }

  function updateLayout() {
    toggle.hidden = !compact.matches;
    if (compact.matches && nav.contains(document.activeElement)) {
      toggle.focus();
    }
    setExpanded(false);
  }

  toggle.addEventListener("click", () => {
    setExpanded(toggle.getAttribute("aria-expanded") === "false");
  });

  nav.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!compact.matches || !link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const destination = document.getElementById(link.hash.slice(1));
    if (destination) {
      event.preventDefault();
      window.location.hash = link.hash;
      const heading = destination.querySelector("h1, h2");
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }
    setExpanded(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setExpanded(false);
      toggle.focus();
    }
  });

  compact.addEventListener("change", updateLayout);
  updateLayout();
}

function configureContactForm() {
  const form = document.getElementById("formulario-contacto");
  const fieldset = form.querySelector("fieldset");
  const status = document.getElementById("estado-formulario");
  const draft = document.getElementById("abrir-borrador");
  const fields = [
    { input: form.elements.nombre, required: "Escribí tu nombre." },
    { input: form.elements.email, required: "Escribí tu email." },
    { input: form.elements.motivo, required: "Seleccioná el motivo de la consulta." },
    { input: form.elements.mensaje, required: "Escribí tu mensaje." }
  ];

  function validate(field) {
    const { input } = field;
    let error = "";

    if (!input.value.trim()) {
      error = field.required;
    } else if (input.validity.typeMismatch) {
      error = "Ingresá un email válido, por ejemplo nombre@correo.com.";
    } else if (input.validity.tooLong) {
      error = "Reducí la longitud del texto.";
    }

    input.setAttribute("aria-invalid", String(Boolean(error)));
    document.getElementById("error-" + input.id).textContent = error;
    return !error;
  }

  function clearDraft() {
    draft.hidden = true;
    draft.removeAttribute("href");
    status.textContent = "";
  }

  fields.forEach((field) => {
    function handleEdit() {
      clearDraft();
      if (field.input.getAttribute("aria-invalid") === "true") validate(field);
    }

    field.input.addEventListener("input", handleEdit);
    field.input.addEventListener("change", handleEdit);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearDraft();

    const invalidFields = fields.filter((field) => !validate(field));
    if (invalidFields.length) {
      status.textContent = "Revisá los campos marcados.";
      invalidFields[0].input.focus();
      return;
    }

    const data = new FormData(form);
    const subject = "Consulta sobre Fundación Sí: " + data.get("motivo");
    const message = [
      "Nombre: " + data.get("nombre").trim(),
      "Email de contacto: " + data.get("email").trim(),
      "",
      data.get("mensaje").trim()
    ].join("\r\n");

    draft.href = "mailto:" + form.dataset.email
      + "?subject=" + encodeURIComponent(subject)
      + "&body=" + encodeURIComponent(message);
    draft.hidden = false;
    status.textContent = "Borrador listo. Abrilo en tu correo para revisarlo y enviarlo.";
    draft.focus();
  });

  form.noValidate = true;
  fieldset.disabled = false;
}

configureNavigation();
configureContactForm();
