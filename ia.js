"use strict";

(() => {
  const MODEL_URL = "https://teachablemachine.withgoogle.com/models/Ltqgjmmjl/";
  const MIN_CONFIDENCE = 0.8;
  const classes = new Map([
    ["Ropa", "Ropa"],
    ["Alimentos no perecederos", "Alimentos no perecederos"],
    ["Insumos medicos y de higiene", "Insumos médicos y de higiene"],
    ["Nada", "Nada"]
  ]);

  const section = document.getElementById("reconocer");
  const fileInput = document.getElementById("ia-archivo");
  const photoButton = document.getElementById("ia-foto");
  const cameraButton = document.getElementById("ia-camara");
  const status = document.getElementById("ia-estado");
  const preview = document.getElementById("ia-visor");
  const scores = document.getElementById("ia-confianza");
  const result = document.getElementById("ia-resultado");
  const predictionText = document.getElementById("ia-prediccion");
  const addButton = document.getElementById("ia-sumar");
  const list = document.getElementById("ia-lista");
  const total = document.getElementById("ia-total");
  const clearButton = document.getElementById("ia-vaciar");

  let modelPromise;
  let capture = 0;
  let cameraRequested = false;
  let stream;
  let cameraTimeout;
  let category;
  const donations = new Map();
  const scoreRows = new Map();

  function loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = url;
      script.onload = resolve;
      script.onerror = () => {
        script.remove();
        reject(new Error("No se pudo cargar la biblioteca de reconocimiento. Probá de nuevo."));
      };
      document.head.append(script);
    });
  }

  async function loadModel() {
    if (!modelPromise) {
      modelPromise = (async () => {
        if (!window.tf) {
          await loadScript("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.7.4/dist/tf.min.js");
        }
        if (!window.tmImage) {
          await loadScript("https://cdn.jsdelivr.net/npm/@teachablemachine/image@0.8.3/dist/teachablemachine-image.min.js");
        }
        const model = await window.tmImage.load(MODEL_URL + "model.json", MODEL_URL + "metadata.json");
        const labels = model.getClassLabels();
        if (labels.length !== classes.size || ![...classes.keys()].every(label => labels.includes(label))) {
          model.dispose();
          throw new Error("Las categorías del modelo no coinciden con las del identificador.");
        }
        return model;
      })().catch(error => {
        modelPromise = undefined;
        throw error;
      });
    }

    return modelPromise;
  }

  function resetCapture() {
    capture++;
    cameraRequested = false;
    clearTimeout(cameraTimeout);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      stream = undefined;
    }
    cameraButton.textContent = "Usar cámara";
    preview.replaceChildren();
    preview.hidden = true;
    scores.hidden = true;
    result.hidden = true;
    category = undefined;
    addButton.hidden = true;
    return capture;
  }

  function showPrediction(predictions) {
    const best = predictions.reduce((a, b) => a.probability >= b.probability ? a : b);
    for (const { className, probability } of predictions) {
      const { row, bar, number } = scoreRows.get(className);
      const percent = Math.floor(probability * 100);
      bar.value = percent;
      number.textContent = percent + " %";
      row.classList.toggle("recognizer-best", best.className === className);
    }

    const confident = best.probability >= MIN_CONFIDENCE;
    category = confident && best.className !== "Nada" ? classes.get(best.className) : undefined;
    const message = confident
      ? (category ? "Detectamos: " + category : "El modelo no detectó una donación.")
      : "No hay suficiente confianza. Probá con un solo artículo y buena luz.";

    if (predictionText.textContent !== message) predictionText.textContent = message;
    addButton.hidden = !category;
    scores.hidden = false;
    result.hidden = false;
  }

  async function analyzeCamera(model, video, current) {
    if (current !== capture) return;
    try {
      if (video.readyState >= 2) {
        const predictions = await model.predict(video);
        if (current !== capture) return;
        showPrediction(predictions);
      }
      cameraTimeout = setTimeout(() => analyzeCamera(model, video, current), 300);
    } catch {
      if (current !== capture) return;
      resetCapture();
      status.textContent = "Se interrumpió el análisis de la cámara. Probá de nuevo o subí una foto.";
    }
  }

  photoButton.addEventListener("click", () => {
    fileInput.value = "";
    fileInput.click();
  });

  fileInput.addEventListener("change", async () => {
    const file = fileInput.files[0];
    if (!file) return;
    const current = resetCapture();
    const url = URL.createObjectURL(file);
    const photo = new Image();
    photo.alt = "Foto elegida para analizar";
    photo.src = url;
    status.textContent = "Abriendo la foto…";

    try {
      await photo.decode();
      if (current !== capture) return;
      preview.replaceChildren(photo);
      preview.hidden = false;
      status.textContent = "Cargando el modelo y analizando la foto…";
      const model = await loadModel();
      if (current !== capture) return;
      const predictions = await model.predict(photo);
      if (current !== capture) return;
      showPrediction(predictions);
      status.textContent = "Foto analizada.";
    } catch {
      if (current !== capture) return;
      status.textContent = photo.naturalWidth
        ? "No se pudo analizar la foto. Revisá tu conexión y probá de nuevo."
        : "No se pudo abrir la imagen. Probá con una foto JPG, PNG o WebP.";
    } finally {
      URL.revokeObjectURL(url);
    }
  });

  cameraButton.addEventListener("click", async () => {
    if (cameraRequested) {
      resetCapture();
      status.textContent = "Cámara apagada.";
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      status.textContent = "La cámara no está disponible en este navegador. Podés subir una foto.";
      return;
    }

    const current = resetCapture();
    cameraRequested = true;
    cameraButton.textContent = "Apagar cámara";
    status.textContent = "Solicitando permiso para usar la cámara…";

    try {
      const source = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } }
      });
      if (current !== capture) {
        source.getTracks().forEach(track => track.stop());
        return;
      }

      stream = source;
      const video = document.createElement("video");
      video.setAttribute("aria-label", "Vista previa de la cámara");
      video.muted = true;
      video.playsInline = true;
      video.srcObject = stream;
      preview.replaceChildren(video);
      preview.hidden = false;

      stream.getVideoTracks().forEach(track => track.addEventListener("ended", () => {
        if (current !== capture) return;
        resetCapture();
        status.textContent = "La cámara se desconectó.";
      }));

      await video.play();
      if (current !== capture) return;
      status.textContent = "Cargando el modelo…";
      const model = await loadModel();
      if (current !== capture) return;
      status.textContent = "Mostrá un artículo a la cámara.";
      analyzeCamera(model, video, current);
    } catch (error) {
      if (current !== capture) return;
      resetCapture();
      status.textContent = error.name === "NotAllowedError"
        ? "No diste permiso para usar la cámara. Podés habilitarlo o subir una foto."
        : "No se pudo usar la cámara o cargar el modelo. Probá de nuevo o subí una foto.";
    }
  });

  function updateDonations() {
    let count = 0;
    const items = [];
    for (const [name, quantity] of donations) {
      const item = document.createElement("li");
      item.textContent = name + " × " + quantity;
      items.push(item);
      count += quantity;
    }
    list.replaceChildren(...items);
    list.hidden = count === 0;
    total.textContent = count ? "Total de artículos: " + count : "Todavía no agregaste artículos.";
    clearButton.hidden = count === 0;
  }

  addButton.addEventListener("click", () => {
    if (!category) return;
    donations.set(category, (donations.get(category) || 0) + 1);
    updateDonations();
  });
  clearButton.addEventListener("click", () => {
    donations.clear();
    updateDonations();
    (addButton.hidden ? photoButton : addButton).focus();
  });

  window.addEventListener("pagehide", () => {
    if (!cameraRequested) return;
    resetCapture();
    status.textContent = "Cámara apagada.";
  });

  let number = 0;
  for (const [className, label] of classes) {
    const row = document.createElement("div");
    row.className = "recognizer-score";
    const term = document.createElement("dt");
    term.id = "ia-clase-" + number++;
    term.textContent = label;
    const description = document.createElement("dd");
    const bar = document.createElement("meter");
    bar.max = 100;
    bar.value = 0;
    bar.setAttribute("aria-labelledby", term.id);
    const percent = document.createElement("span");
    percent.setAttribute("aria-hidden", "true");
    description.append(bar, percent);
    row.append(term, description);
    scores.append(row);
    scoreRows.set(className, { row, bar, number: percent });
  }
  section.querySelector(".recognizer-controls").hidden = false;
})();
