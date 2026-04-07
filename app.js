const roomUpload = document.getElementById("roomUpload");
const roomType = document.getElementById("roomType");
const style = document.getElementById("style");
const intensity = document.getElementById("intensity");
const archLock = document.getElementById("archLock");
const generateBtn = document.getElementById("generateBtn");
const statusText = document.getElementById("status");
const payloadPreview = document.getElementById("payloadPreview");
const sliderWrap = document.getElementById("sliderWrap");
const beforeImg = document.getElementById("beforeImg");
const afterImg = document.getElementById("afterImg");
const afterMask = document.getElementById("afterMask");
const slider = document.getElementById("slider");

slider.addEventListener("input", () => {
  afterMask.style.width = `${slider.value}%`;
});

function getEnhancements() {
  return [...document.querySelectorAll(".chips input:checked")].map((x) => x.value);
}

function buildPayload(imageDataUrl) {
  return {
    image_data_url: imageDataUrl,
    room_type: roomType.value,
    style: style.value,
    style_intensity: Number(intensity.value),
    architecture_lock: archLock.checked,
    enhancements: getEnhancements(),
    output: {
      resolution: "3840x2160",
      count: 1,
      cinematic_lighting: true,
      social_ready: true,
      optional_before_after_slider: true,
    },
    hard_constraints: [
      "Do not move, remove, resize, or alter architectural elements",
      "Maintain original perspective and physically realistic proportions",
      "Modify only furniture, decor, lighting, materials, and textures",
    ],
  };
}

async function fakeTransform(dataUrl) {
  // Frontend-only fallback demo so app works without backend wiring.
  const canvas = document.createElement("canvas");
  const img = new Image();
  img.src = dataUrl;
  await img.decode();

  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  // color grading for "luxury" vibe
  ctx.fillStyle = "rgba(27, 33, 46, 0.18)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = "soft-light";
  ctx.fillStyle = "rgba(224, 196, 152, 0.16)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = "source-over";

  return canvas.toDataURL("image/jpeg", 0.92);
}

async function callTransformAPI(payload) {
  try {
    const response = await fetch("/api/transform-room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("No backend configured");
    return await response.json();
  } catch {
    return { transformed_image_data_url: await fakeTransform(payload.image_data_url), fallback: true };
  }
}

generateBtn.addEventListener("click", async () => {
  const file = roomUpload.files?.[0];
  if (!file) {
    statusText.textContent = "Upload a room photo first.";
    return;
  }
  if (!archLock.checked) {
    statusText.textContent = "Architecture lock must remain enabled for realistic transforms.";
    return;
  }

  statusText.textContent = "Generating high-impact redesign…";
  const dataUrl = await fileToDataURL(file);
  const payload = buildPayload(dataUrl);
  payloadPreview.textContent = JSON.stringify(payload, null, 2);

  const result = await callTransformAPI(payload);

  beforeImg.src = dataUrl;
  afterImg.src = result.transformed_image_data_url;
  sliderWrap.classList.remove("hidden");
  slider.value = 50;
  afterMask.style.width = "50%";
  statusText.textContent = result.fallback
    ? "Generated with frontend demo pipeline. Connect backend endpoint /api/transform-room for production AI output."
    : "Done. Hero redesign generated.";
});

function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
