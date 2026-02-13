const STORAGE_KEYS = {
  activeSpaces: "abetterthought.activeSpaces",
  selectedCategoryKeys: "abetterthought.selectedCategoryKeys",
  savedThoughts: "abetterthought.savedThoughts",
  lastThought: "abetterthought.lastThought",
  shownCardIds: "abetterthought.shownCardIds",
  savedFilter: "abetterthought.savedFilter",
  language: "abt_language"
};

const { SPACES = {}, messageCards = {} } = window.APP_CONTENT || {};
const SPACE_KEYS = Object.keys(SPACES);

const I18N = {
  en: {
    appTitle: "A quiet space for daily emotional support.",
    appTagline: "One small shift. Big difference.",
    languageLabel: "Language",
    langEnglish: "English",
    langSpanish: "Español",
    howTitle: "How this works",
    step1: "Step 1: Choose space(s)",
    step2: "Step 2: Pick category(s)",
    step3: "Step 3: Click reveal message",
    chooseSpace: "Choose space",
    needSpace: "Select at least one space.",
    noCategory: "No category selected",
    helperDefault: "Pick a category to reveal your message.",
    helperReady: "Tap reveal to get a thought card.",
    helperEmptyPool: "No messages available for the current selection.",
    placeholder: "Your better thought will appear here.",
    pickCategories: "Pick categories:",
    allCategories: "All categories",
    selectAll: "Select all",
    clear: "Clear",
    selectedCount: "selected",
    reveal: "Reveal message",
    actionAnother: "Show me another better thought",
    actionSave: "Save this thought",
    actionShare: "Share this thought",
    why: "Why this helps:",
    lastShown: "Last shown",
    messageTag: "MESSAGE",
    openFavorites: "Open Favorites",
    favoritesTitle: "Favorites",
    favoritesSub: "Your saved messages in one calm space.",
    savedLabel: "Saved:",
    filterAll: "All",
    clearAll: "Clear all",
    backToApp: "Back to app",
    noSaved: "No saved thoughts yet.",
    remove: "Remove",
    share: "Share",
    sharePreviewTitle: "Share image preview",
    downloadImage: "Download image",
    close: "Close",
    nativeShare: "Share",
    shareErrorEmpty: "Reveal a better thought first.",
    shareErrorGeneric: "Could not prepare the share image. Please try again."
  },
  es: {
    appTitle: "Un espacio tranquilo para apoyo emocional diario.",
    appTagline: "Un pequeño cambio. Gran diferencia.",
    languageLabel: "Idioma",
    langEnglish: "English",
    langSpanish: "Español",
    howTitle: "Cómo funciona",
    step1: "Paso 1: Elige uno o más espacios",
    step2: "Paso 2: Elige una o más categorías",
    step3: "Paso 3: Pulsa revelar mensaje",
    chooseSpace: "Elegir espacios",
    needSpace: "Selecciona al menos un espacio.",
    noCategory: "Ninguna categoría seleccionada",
    helperDefault: "Elige una categoría para revelar tu mensaje.",
    helperReady: "Pulsa revelar para obtener un mensaje.",
    helperEmptyPool: "No hay mensajes disponibles para la selección actual.",
    placeholder: "Aquí aparecerá tu mejor pensamiento.",
    pickCategories: "Elige categorías:",
    allCategories: "Todas las categorías",
    selectAll: "Seleccionar todo",
    clear: "Limpiar",
    selectedCount: "seleccionadas",
    reveal: "Revelar mensaje",
    actionAnother: "Muéstrame otro mejor pensamiento",
    actionSave: "Guardar este pensamiento",
    actionShare: "Compartir este pensamiento",
    why: "Por qué ayuda:",
    lastShown: "Última vez",
    messageTag: "MENSAJE",
    openFavorites: "Abrir Favoritos",
    favoritesTitle: "Favoritos",
    favoritesSub: "Tus mensajes guardados en un espacio tranquilo.",
    savedLabel: "Guardados:",
    filterAll: "Todos",
    clearAll: "Borrar todo",
    backToApp: "Volver a la app",
    noSaved: "Aún no hay pensamientos guardados.",
    remove: "Eliminar",
    share: "Compartir",
    sharePreviewTitle: "Vista previa para compartir",
    downloadImage: "Descargar imagen",
    close: "Cerrar",
    nativeShare: "Compartir",
    shareErrorEmpty: "Primero revela un mejor pensamiento.",
    shareErrorGeneric: "No se pudo preparar la imagen para compartir. Inténtalo de nuevo."
  }
};

const SPACE_LABELS = {
  Personal: { en: "Personal", es: "Personal" },
  Work: { en: "Work", es: "Trabajo" },
  Parents: { en: "Parents", es: "Padres" },
  Relationships: { en: "Relationships", es: "Relaciones" },
  Single: { en: "Single", es: "Soltería" },
  Student: { en: "Student", es: "Estudiante" },
  ADHD: { en: "ADHD", es: "TDAH" },
  Caregiver: { en: "Caregiver", es: "Cuidados" },
  "Military/Veteran": { en: "Military/Veteran", es: "Militar/Veterano" },
  Entrepreneur: { en: "Entrepreneur", es: "Emprendedor" }
};

const CATEGORY_LABELS = {
  Gratitude: { es: "Gratitud" }, Calm: { es: "Calma" }, Joy: { es: "Alegría" }, Hope: { es: "Esperanza" }, Confidence: { es: "Confianza" },
  Focused: { es: "Enfoque" }, Motivated: { es: "Motivación" }, Connected: { es: "Conexión" }, Balanced: { es: "Equilibrio" }, Overwhelmed: { es: "Abrumado" },
  Anxious: { es: "Ansiedad" }, Distracted: { es: "Distraído" }, Unmotivated: { es: "Desmotivado" }, Selfdoubt: { es: "Duda propia" }, Angry: { es: "Enojo" },
  Sad: { es: "Tristeza" }, Guilt: { es: "Culpa" }, Lonely: { es: "Soledad" }, Burnout: { es: "Agotamiento" }, Overthinking: { es: "Sobrepensar" },
  Focus: { es: "Foco" }, Boundaries: { es: "Límites" }, Clarity: { es: "Claridad" }, Pressure: { es: "Presión" }, Conflict: { es: "Conflicto" },
  Feedback: { es: "Retroalimentación" }, Priorities: { es: "Prioridades" }, Momentum: { es: "Impulso" }, Balance: { es: "Balance" }, Purpose: { es: "Propósito" },
  Patience: { es: "Paciencia" }, Presence: { es: "Presencia" }, Consistency: { es: "Constancia" }, Connection: { es: "Conexión" }, Energy: { es: "Energía" },
  Overwhelm: { es: "Abrumo" }, Play: { es: "Juego" }, Discipline: { es: "Disciplina" }, Partnership: { es: "Equipo" }, Rest: { es: "Descanso" },
  Trust: { es: "Confianza" }, Respect: { es: "Respeto" }, Listening: { es: "Escucha" }, Repair: { es: "Reparación" }, Intimacy: { es: "Intimidad" },
  Appreciation: { es: "Aprecio" }, Honesty: { es: "Honestidad" }, Growth: { es: "Crecimiento" }, Independence: { es: "Independencia" }, Healing: { es: "Sanación" },
  Standards: { es: "Estándares" }, Courage: { es: "Valentía" }, Social: { es: "Social" }, Peace: { es: "Paz" }, Openness: { es: "Apertura" },
  Selfworth: { es: "Autoestima" }, Adventure: { es: "Aventura" }, Motivation: { es: "Motivación" }, Time: { es: "Tiempo" }, Stress: { es: "Estrés" },
  Memory: { es: "Memoria" }, Progress: { es: "Progreso" }, Resilience: { es: "Resiliencia" }, Planning: { es: "Planificación" }, Distraction: { es: "Distracción" },
  Routine: { es: "Rutina" }, Impulses: { es: "Impulsos" }, Followthrough: { es: "Constancia" }, Reset: { es: "Reinicio" }, Compassion: { es: "Compasión" },
  Support: { es: "Apoyo" }, Strength: { es: "Fortaleza" }, Acceptance: { es: "Aceptación" }, Recovery: { es: "Recuperación" }, Transition: { es: "Transición" },
  Identity: { es: "Identidad" }, Brotherhood: { es: "Compañerismo" }, Leadership: { es: "Liderazgo" }, Mission: { es: "Misión" }, Vision: { es: "Visión" },
  Risk: { es: "Riesgo" }, Systems: { es: "Sistemas" }
};

const state = {
  language: "en",
  selectedSpaces: ["Personal"],
  selectedCategoryKeys: [],
  savedThoughts: [],
  currentCard: null,
  shownCardIds: {},
  savedFilter: "all"
};

const get = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const set = (k, v) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } };
const slug = (value) => String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");

const el = {
  body: document.body,
  heroTitle: document.querySelector(".hero h1"),
  heroSub: document.querySelector(".hero .subtext"),
  languageLabel: document.querySelector('.language-row label[for="languageSelect"]'),
  languageSelect: document.getElementById("languageSelect"),
  howTitle: document.querySelector(".onboarding h2"),
  step1: document.getElementById("step1"),
  step2: document.getElementById("step2"),
  step3: document.getElementById("step3"),
  chooseSpaceTitle: document.getElementById("chooseSpaceTitle"),
  spaceHelper: document.getElementById("spaceHelper"),
  spaceSwitch: document.getElementById("spaceSwitch"),
  categoryLabel: document.getElementById("categoryLabel"),
  categorySummaryBtn: document.getElementById("categorySummaryBtn"),
  categoryMenu: document.getElementById("categoryMenu"),
  categoryList: document.getElementById("categoryList"),
  categorySelectAll: document.getElementById("categorySelectAll"),
  categoryClear: document.getElementById("categoryClear"),
  activeCategoryLabel: document.getElementById("activeCategoryLabel"),
  revealHelper: document.getElementById("revealHelper"),
  revealBtn: document.getElementById("revealBtn"),
  thoughtBubble: document.getElementById("thoughtBubble"),
  anotherBtn: document.getElementById("anotherBtn"),
  saveBtn: document.getElementById("saveBtn"),
  shareBtn: document.getElementById("shareBtn"),
  postActions: document.getElementById("postActions"),
  favoritesLink: document.querySelector(".favorites-link"),
  savedFilterControls: document.getElementById("savedFilterControls"),
  savedList: document.getElementById("savedList"),
  clearSavedBtn: document.getElementById("clearSavedBtn"),
  backToAppLink: document.querySelector('.favorites-actions a[href="index.html"]'),
  shareModal: document.getElementById("sharePreviewModal"),
  shareBackdrop: document.getElementById("shareModalBackdrop"),
  shareCard: document.getElementById("shareModalCard"),
  shareTitle: document.querySelector("#shareModalCard h3"),
  shareImg: document.getElementById("sharePreviewImg"),
  shareError: document.getElementById("sharePreviewError"),
  shareDownload: document.getElementById("shareDownloadLink"),
  shareNative: document.getElementById("shareNativeBtn"),
  shareClose: document.getElementById("shareCloseBtn")
};

const t = (key) => I18N[state.language]?.[key] ?? I18N.en[key] ?? key;
const txSpace = (space) => SPACE_LABELS[space]?.[state.language] || space;
const txCategory = (category) => (state.language === "es" ? (CATEGORY_LABELS[category]?.es || category) : category);

const categoryKey = (space, category) => `${category}|${space}`;
const parseCategoryKey = (key) => {
  const [category, space] = String(key || "").split("|");
  return { category, space };
};

const categoryOptions = () => {
  const list = [];
  state.selectedSpaces.forEach((space) => {
    (SPACES[space] || []).forEach((category) => {
      list.push({ key: categoryKey(space, category), space, category });
    });
  });
  return list;
};

const localizeCard = (card) => ({
  ...card,
  mainText: typeof card.main === "string" ? card.main : card.main?.[state.language] || card.main?.en || "",
  whyText: typeof card.why === "string" ? card.why : card.why?.[state.language] || card.why?.en || ""
});

const restore = () => {
  const lang = get(STORAGE_KEYS.language);
  if (lang === "en" || lang === "es") state.language = lang;

  try {
    const spaces = JSON.parse(get(STORAGE_KEYS.activeSpaces) || "[]");
    if (Array.isArray(spaces)) {
      const valid = spaces.filter((space) => SPACES[space]);
      state.selectedSpaces = valid.length ? valid : ["Personal"];
    }
  } catch { /* ignore */ }

  try {
    const keys = JSON.parse(get(STORAGE_KEYS.selectedCategoryKeys) || "[]");
    state.selectedCategoryKeys = Array.isArray(keys) ? keys : [];
  } catch { state.selectedCategoryKeys = []; }

  try {
    const saved = JSON.parse(get(STORAGE_KEYS.savedThoughts) || "[]");
    state.savedThoughts = Array.isArray(saved) ? saved : [];
  } catch { state.savedThoughts = []; }

  try {
    const shown = JSON.parse(get(STORAGE_KEYS.shownCardIds) || "{}");
    state.shownCardIds = shown && typeof shown === "object" ? shown : {};
  } catch { state.shownCardIds = {}; }

  const filter = get(STORAGE_KEYS.savedFilter);
  if (filter) state.savedFilter = filter;
};

const persist = () => {
  set(STORAGE_KEYS.language, state.language);
  set(STORAGE_KEYS.activeSpaces, JSON.stringify(state.selectedSpaces));
  set(STORAGE_KEYS.selectedCategoryKeys, JSON.stringify(state.selectedCategoryKeys));
};

const applyTranslations = () => {
  if (el.heroTitle) el.heroTitle.textContent = t("appTitle");
  if (el.heroSub) el.heroSub.textContent = t("appTagline");
  if (el.languageLabel) el.languageLabel.textContent = t("languageLabel");
  if (el.languageSelect) {
    const opts = el.languageSelect.options;
    if (opts[0]) opts[0].textContent = t("langEnglish");
    if (opts[1]) opts[1].textContent = t("langSpanish");
    el.languageSelect.value = state.language;
  }
  if (el.howTitle) el.howTitle.textContent = t("howTitle");
  if (el.step1) el.step1.textContent = t("step1");
  if (el.step2) el.step2.textContent = t("step2");
  if (el.step3) el.step3.textContent = t("step3");
  if (el.chooseSpaceTitle) el.chooseSpaceTitle.textContent = t("chooseSpace");
  if (el.spaceHelper) el.spaceHelper.textContent = t("needSpace");
  if (el.categoryLabel) el.categoryLabel.textContent = t("pickCategories");
  if (el.categorySelectAll) el.categorySelectAll.textContent = t("selectAll");
  if (el.categoryClear) el.categoryClear.textContent = t("clear");
  if (el.revealBtn) el.revealBtn.textContent = t("reveal");
  if (el.anotherBtn) el.anotherBtn.textContent = t("actionAnother");
  if (el.saveBtn) el.saveBtn.textContent = t("actionSave");
  if (el.shareBtn) el.shareBtn.textContent = t("actionShare");
  if (el.favoritesLink) el.favoritesLink.textContent = t("openFavorites");
  if (el.clearSavedBtn) el.clearSavedBtn.textContent = t("clearAll");
  if (el.backToAppLink) el.backToAppLink.textContent = t("backToApp");
  if (el.shareTitle) el.shareTitle.textContent = t("sharePreviewTitle");
  if (el.shareDownload) el.shareDownload.textContent = t("downloadImage");
  if (el.shareClose) el.shareClose.textContent = t("close");
  if (el.shareNative) el.shareNative.textContent = t("nativeShare");

  if (el.body.dataset.page === "favorites") {
    const heroH1 = document.querySelector(".hero h1");
    const heroP = document.querySelector(".hero .subtext");
    if (heroH1) heroH1.textContent = t("favoritesTitle");
    if (heroP) heroP.textContent = t("favoritesSub");
  }
};

const cleanCategorySelection = () => {
  const allowed = new Set(categoryOptions().map((o) => o.key));
  state.selectedCategoryKeys = state.selectedCategoryKeys.filter((key) => allowed.has(key));
};

const renderSpaces = () => {
  if (!el.spaceSwitch) return;
  el.spaceSwitch.innerHTML = "";
  SPACE_KEYS.forEach((space) => {
    const active = state.selectedSpaces.includes(space);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `space-btn ${active ? "is-active" : ""}`;
    btn.setAttribute("aria-pressed", String(active));
    btn.textContent = txSpace(space);
    btn.addEventListener("click", () => {
      if (active) state.selectedSpaces = state.selectedSpaces.filter((x) => x !== space);
      else state.selectedSpaces.push(space);
      cleanCategorySelection();
      persist();
      renderSpaces();
      renderCategories();
      updateRevealState();
    });
    el.spaceSwitch.appendChild(btn);
  });
};

const categorySummary = () => {
  const options = categoryOptions();
  if (!options.length || !state.selectedCategoryKeys.length) return t("allCategories");
  const selected = options.filter((o) => state.selectedCategoryKeys.includes(o.key));
  if (selected.length <= 2) return selected.map((o) => txCategory(o.category)).join(", ");
  return `${selected.length} ${t("selectedCount")}`;
};

const closeCategoryMenu = () => {
  if (!el.categoryMenu || !el.categorySummaryBtn) return;
  el.categoryMenu.hidden = true;
  el.categorySummaryBtn.setAttribute("aria-expanded", "false");
};

const openCategoryMenu = () => {
  if (!el.categoryMenu || !el.categorySummaryBtn) return;
  el.categoryMenu.hidden = false;
  el.categorySummaryBtn.setAttribute("aria-expanded", "true");
};

const renderCategories = () => {
  if (!el.categoryList || !el.categorySummaryBtn) return;
  const options = categoryOptions();
  el.categoryList.innerHTML = "";

  options.forEach((item) => {
    const row = document.createElement("label");
    row.className = "category-option";
    row.innerHTML = `
      <input type="checkbox" value="${item.key}" ${state.selectedCategoryKeys.includes(item.key) ? "checked" : ""} />
      <span>${txCategory(item.category)}</span>
      <small>(${txSpace(item.space)})</small>
    `;
    row.querySelector("input")?.addEventListener("change", (event) => {
      const key = event.target.value;
      if (event.target.checked) {
        if (!state.selectedCategoryKeys.includes(key)) state.selectedCategoryKeys.push(key);
      } else {
        state.selectedCategoryKeys = state.selectedCategoryKeys.filter((x) => x !== key);
      }
      persist();
      renderCategories();
      updateRevealState();
      closeCategoryMenu();
    });
    el.categoryList.appendChild(row);
  });

  el.categorySummaryBtn.textContent = categorySummary();
};

const buildPool = () => {
  if (!state.selectedSpaces.length) return [];
  const selectedSet = new Set(state.selectedCategoryKeys);
  const allCategories = selectedSet.size === 0;

  const pool = [];
  state.selectedSpaces.forEach((space) => {
    (SPACES[space] || []).forEach((category) => {
      const key = categoryKey(space, category);
      if (!allCategories && !selectedSet.has(key)) return;
      (messageCards?.[space]?.[category] || []).forEach((card) => pool.push(card));
    });
  });
  return pool;
};

const nextCard = () => {
  const pool = buildPool();
  if (!pool.length) return null;

  const bucket = `${state.language}::${[...state.selectedSpaces].sort().join(",")}::${[...state.selectedCategoryKeys].sort().join(",")}`;
  const shown = Array.isArray(state.shownCardIds[bucket]) ? state.shownCardIds[bucket] : [];
  let candidates = pool.filter((card) => !shown.includes(card.id));

  if (!candidates.length) {
    state.shownCardIds[bucket] = [];
    candidates = [...pool];
  }

  if (state.currentCard?.id) {
    const noRepeat = candidates.filter((card) => card.id !== state.currentCard.id);
    if (noRepeat.length) candidates = noRepeat;
  }

  const card = candidates[Math.floor(Math.random() * candidates.length)];
  state.shownCardIds[bucket] = [...(state.shownCardIds[bucket] || []), card.id];
  set(STORAGE_KEYS.shownCardIds, JSON.stringify(state.shownCardIds));

  return { ...localizeCard(card), timestamp: Date.now() };
};

const updateRevealState = () => {
  const hasSpaces = state.selectedSpaces.length > 0;
  const hasPool = buildPool().length > 0;

  if (el.revealBtn) el.revealBtn.disabled = !hasSpaces || !hasPool;

  if (el.activeCategoryLabel) {
    el.activeCategoryLabel.textContent = hasSpaces ? categorySummary() : t("noCategory");
  }

  if (el.revealHelper) {
    if (!hasSpaces) el.revealHelper.textContent = t("needSpace");
    else if (!hasPool) el.revealHelper.textContent = t("helperEmptyPool");
    else el.revealHelper.textContent = t("helperReady");
  }

  if (el.spaceHelper) el.spaceHelper.hidden = hasSpaces;
};

const isSaved = (card) => card && state.savedThoughts.some((item) => item.section === card.space && item.category === card.category && item.text === card.mainText);

const saveCurrent = () => {
  if (!state.currentCard || isSaved(state.currentCard)) return;
  state.savedThoughts.unshift({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    section: state.currentCard.space,
    category: state.currentCard.category,
    text: state.currentCard.mainText,
    why: state.currentCard.whyText,
    timestamp: state.currentCard.timestamp
  });
  set(STORAGE_KEYS.savedThoughts, JSON.stringify(state.savedThoughts));
};

const removeCurrent = () => {
  if (!state.currentCard) return;
  state.savedThoughts = state.savedThoughts.filter((item) => !(item.section === state.currentCard.space && item.category === state.currentCard.category && item.text === state.currentCard.mainText));
  set(STORAGE_KEYS.savedThoughts, JSON.stringify(state.savedThoughts));
};

const toggleFavorite = () => {
  if (isSaved(state.currentCard)) removeCurrent();
  else saveCurrent();
};

let activeShareUrl = null;
let activeShareBlob = null;

const closeShareModal = () => {
  if (!el.shareModal) return;
  el.shareModal.hidden = true;
  el.shareModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  if (activeShareUrl) {
    URL.revokeObjectURL(activeShareUrl);
    activeShareUrl = null;
  }
  activeShareBlob = null;
  if (el.shareImg) {
    el.shareImg.hidden = true;
    el.shareImg.removeAttribute("src");
  }
  if (el.shareError) {
    el.shareError.hidden = true;
    el.shareError.textContent = "";
  }
  if (el.shareDownload) {
    el.shareDownload.hidden = true;
    el.shareDownload.removeAttribute("href");
  }
  if (el.shareNative) el.shareNative.hidden = true;
};

const openShareModal = () => {
  if (!el.shareModal) return;
  el.shareModal.hidden = false;
  el.shareModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
};

const bindShareModal = () => {
  if (!el.shareModal || el.shareModal.dataset.bound === "1") return;
  el.shareBackdrop?.addEventListener("click", closeShareModal);
  el.shareClose?.addEventListener("click", closeShareModal);
  el.shareCard?.addEventListener("click", (e) => e.stopPropagation());
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !el.shareModal.hidden) closeShareModal();
  });
  el.shareNative?.addEventListener("click", async () => {
    if (!activeShareBlob || !navigator.share) return;
    try {
      const file = new File([activeShareBlob], "a-better-thought.png", { type: "image/png" });
      await navigator.share({ files: [file], title: "A Better Thought" });
    } catch { /* ignore */ }
  });
  el.shareModal.dataset.bound = "1";
};

const setShareLoading = (button, on) => {
  if (!button) return;
  if (on) {
    button.disabled = true;
    button.dataset.prevText = button.textContent;
    button.textContent = button.classList.contains("icon-btn") ? "…" : "Preparing share image...";
  } else {
    button.disabled = false;
    if (button.dataset.prevText) {
      button.textContent = button.dataset.prevText;
      delete button.dataset.prevText;
    }
  }
};

const wrapText = (ctx, text, maxWidth, maxLines = 8) => {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  words.forEach((word) => {
    const trial = line ? `${line} ${word}` : word;
    if (ctx.measureText(trial).width <= maxWidth) line = trial;
    else {
      if (line) lines.push(line);
      line = word;
    }
  });
  if (line) lines.push(line);
  if (lines.length <= maxLines) return lines;
  const clipped = lines.slice(0, maxLines);
  while (clipped[maxLines - 1].length > 1 && ctx.measureText(`${clipped[maxLines - 1]}…`).width > maxWidth) {
    clipped[maxLines - 1] = clipped[maxLines - 1].slice(0, -1);
  }
  clipped[maxLines - 1] = `${clipped[maxLines - 1]}…`;
  return clipped;
};

const toBlobFromDataURL = (dataURL) => {
  const [meta, b64] = dataURL.split(",");
  const mime = (meta.match(/data:(.*?);base64/) || [])[1] || "image/png";
  const bytes = atob(b64);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i += 1) arr[i] = bytes.charCodeAt(i);
  return new Blob([arr], { type: mime });
};

const generateSharePoster = async ({ appName, tagline, space, category, message }) => {
  if (!message || !message.trim()) throw new Error(t("shareErrorEmpty"));
  await document.fonts?.ready;

  const W = 1080;
  const H = 1350;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context unavailable");

  ctx.fillStyle = "#F6F3EE";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#121212";
  ctx.beginPath();
  ctx.arc(8, 8, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#121212";
  ctx.font = '600 40px "Plus Jakarta Sans", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
  ctx.fillText(appName, 100, 120);
  ctx.fillStyle = "#2e2e2e";
  ctx.font = '500 28px "Plus Jakarta Sans", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
  ctx.fillText(tagline, 100, 164);

  ctx.strokeStyle = "#1f1f1f";
  ctx.beginPath();
  ctx.moveTo(100, 200);
  ctx.lineTo(980, 200);
  ctx.stroke();

  ctx.fillStyle = "#141414";
  ctx.font = "700 130px Georgia, 'Times New Roman', serif";
  ctx.fillText(category, 100, 370);

  ctx.fillStyle = "#353535";
  ctx.font = '500 30px "Plus Jakarta Sans", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
  ctx.fillText(`${space} • ${category}`, 104, 425);

  ctx.fillStyle = "#121212";
  ctx.font = '600 62px "Plus Jakarta Sans", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
  const lines = wrapText(ctx, message, 860, 8);
  const lh = 66;
  const block = lines.length * lh;
  const start = 620 + (420 - block) / 2 + 24;
  lines.forEach((line, i) => ctx.fillText(line, 110, start + i * lh));

  ctx.fillStyle = "#3c3c3c";
  ctx.font = '500 24px "Plus Jakarta Sans", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
  ctx.fillText("rcasanova3.github.io/Demo", 100, 1268);

  let blob = await new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/png", 1));
  if (!blob) blob = toBlobFromDataURL(canvas.toDataURL("image/png", 1));
  return { blob, url: URL.createObjectURL(blob) };
};

const showShareError = (message) => {
  if (el.shareImg) {
    el.shareImg.hidden = true;
    el.shareImg.removeAttribute("src");
  }
  if (el.shareError) {
    el.shareError.hidden = false;
    el.shareError.textContent = message;
  }
  if (el.shareDownload) el.shareDownload.hidden = true;
  if (el.shareNative) el.shareNative.hidden = true;
  openShareModal();
};

const shareThought = async (card = state.currentCard, btn = null) => {
  const message = card?.mainText || card?.main || "";
  if (!message.trim()) {
    showShareError(t("shareErrorEmpty"));
    return;
  }

  setShareLoading(btn, true);
  try {
    bindShareModal();
    const { blob, url } = await generateSharePoster({
      appName: "A Better Thought",
      tagline: "One small shift. Big difference.",
      space: txSpace(card.space || state.selectedSpaces[0] || "Personal"),
      category: txCategory(card.category || "Message"),
      message
    });

    if (activeShareUrl) URL.revokeObjectURL(activeShareUrl);
    activeShareUrl = url;
    activeShareBlob = blob;

    if (el.shareError) {
      el.shareError.hidden = true;
      el.shareError.textContent = "";
    }
    if (el.shareImg) {
      el.shareImg.hidden = false;
      el.shareImg.src = url;
    }
    if (el.shareDownload) {
      el.shareDownload.hidden = false;
      el.shareDownload.href = url;
      el.shareDownload.download = "a-better-thought.png";
    }

    const file = new File([blob], "a-better-thought.png", { type: "image/png" });
    const canNative = Boolean(navigator.share && navigator.canShare?.({ files: [file] }));
    if (el.shareNative) {
      el.shareNative.hidden = !canNative;
      el.shareNative.disabled = !canNative;
    }

    openShareModal();
  } catch (err) {
    console.error("share_error", { err, messageLength: message.length });
    showShareError(t("shareErrorGeneric"));
  } finally {
    setShareLoading(btn, false);
  }
};

const renderThought = (card, animate = true) => {
  if (!el.thoughtBubble || !card) return;
  state.currentCard = card;
  set(STORAGE_KEYS.lastThought, JSON.stringify(card));

  const saved = isSaved(card);
  el.thoughtBubble.classList.remove("is-revealed");
  el.thoughtBubble.innerHTML = `
    <article class="thought-content">
      <p class="thought-category">
        <span class="thought-tag">${t("messageTag")}</span>
        <span class="last-shown">${t("lastShown")}: ${new Date(card.timestamp).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span>
        <button type="button" class="icon-btn icon-star ${saved ? "is-favorited" : ""}" id="cardFavoriteBtn" aria-label="Toggle favorite">${saved ? "★" : "☆"}</button>
        <button type="button" class="icon-btn" id="cardShareBtn" aria-label="${t("share")}">⤴</button>
      </p>
      <p class="thought-text">${card.mainText}</p>
      <div class="thought-divider" aria-hidden="true"></div>
      <p class="thought-detail"><strong>${t("why")}</strong> ${card.whyText}</p>
    </article>
  `;

  document.getElementById("cardFavoriteBtn")?.addEventListener("click", () => {
    toggleFavorite();
    renderThought(card, false);
    renderSaved();
  });
  document.getElementById("cardShareBtn")?.addEventListener("click", (event) => shareThought(card, event.currentTarget));

  if (el.postActions) el.postActions.hidden = false;
  if (animate) requestAnimationFrame(() => el.thoughtBubble.classList.add("is-revealed"));
};

const reveal = () => {
  const card = nextCard();
  if (!card) {
    updateRevealState();
    return;
  }
  renderThought(card, true);
};

const renderSavedFilters = () => {
  if (!el.savedFilterControls) return;
  const options = [{ value: "all", label: t("filterAll") }, ...SPACE_KEYS.map((space) => ({ value: slug(space), label: txSpace(space) }))];
  el.savedFilterControls.innerHTML = `<span class="saved-filter-label">${t("savedLabel")}</span>`;
  options.forEach((option) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `filter-btn ${state.savedFilter === option.value ? "is-active" : ""}`;
    btn.textContent = option.label;
    btn.addEventListener("click", () => {
      state.savedFilter = option.value;
      set(STORAGE_KEYS.savedFilter, option.value);
      renderSavedFilters();
      renderSaved();
    });
    el.savedFilterControls.appendChild(btn);
  });
};

const renderSaved = () => {
  if (!el.savedList) return;
  el.savedList.innerHTML = "";

  const visible = state.savedFilter === "all"
    ? state.savedThoughts
    : state.savedThoughts.filter((item) => slug(item.section) === state.savedFilter);

  if (!visible.length) {
    el.savedList.innerHTML = `<li class="saved-empty">${t("noSaved")}</li>`;
    if (el.clearSavedBtn) el.clearSavedBtn.hidden = state.savedThoughts.length === 0;
    return;
  }

  visible.forEach((item) => {
    const li = document.createElement("li");
    li.className = "saved-item";
    li.innerHTML = `
      <p class="saved-meta">${new Date(item.timestamp).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</p>
      <p class="saved-section">${txSpace(item.section)} · ${txCategory(item.category)}</p>
      <p class="saved-text">${item.text}</p>
      <div class="saved-actions">
        <button type="button" class="btn btn-tertiary" data-share-id="${item.id}">${t("share")}</button>
        <button type="button" class="btn btn-tertiary" data-remove-id="${item.id}">${t("remove")}</button>
      </div>
    `;
    el.savedList.appendChild(li);
  });

  if (el.clearSavedBtn) el.clearSavedBtn.hidden = false;

  el.savedList.querySelectorAll("[data-remove-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.savedThoughts = state.savedThoughts.filter((item) => item.id !== btn.dataset.removeId);
      set(STORAGE_KEYS.savedThoughts, JSON.stringify(state.savedThoughts));
      renderSaved();
    });
  });

  el.savedList.querySelectorAll("[data-share-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = state.savedThoughts.find((entry) => entry.id === btn.dataset.shareId);
      if (!item) return;
      shareThought({ space: item.section, category: item.category, mainText: item.text }, btn);
    });
  });
};

const bindLanguage = () => {
  if (!el.languageSelect) return;
  el.languageSelect.value = state.language;
  el.languageSelect.addEventListener("change", () => {
    state.language = el.languageSelect.value;
    persist();
    applyTranslations();
    renderSpaces();
    renderCategories();
    renderSavedFilters();
    renderSaved();
    updateRevealState();
    if (state.currentCard) {
      state.currentCard = localizeCard(state.currentCard);
      renderThought(state.currentCard, false);
    } else if (el.thoughtBubble) {
      el.thoughtBubble.innerHTML = `<p class="placeholder">${t("placeholder")}</p>`;
    }
  });
};

const bindCategoryMenu = () => {
  if (!el.categorySummaryBtn || !el.categoryMenu) return;
  el.categorySummaryBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    if (el.categoryMenu.hidden) openCategoryMenu();
    else closeCategoryMenu();
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".category-dropdown")) closeCategoryMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeCategoryMenu();
  });

  el.categorySelectAll?.addEventListener("click", () => {
    state.selectedCategoryKeys = categoryOptions().map((item) => item.key);
    persist();
    renderCategories();
    updateRevealState();
    closeCategoryMenu();
  });

  el.categoryClear?.addEventListener("click", () => {
    state.selectedCategoryKeys = [];
    persist();
    renderCategories();
    updateRevealState();
    closeCategoryMenu();
  });
};

const initHome = () => {
  restore();
  applyTranslations();
  bindLanguage();
  bindShareModal();
  renderSpaces();
  cleanCategorySelection();
  persist();
  renderCategories();
  bindCategoryMenu();
  updateRevealState();

  el.revealBtn?.addEventListener("click", reveal);
  el.anotherBtn?.addEventListener("click", reveal);
  el.saveBtn?.addEventListener("click", () => {
    saveCurrent();
    renderThought(state.currentCard, false);
    renderSaved();
  });
  el.shareBtn?.addEventListener("click", (event) => shareThought(state.currentCard, event.currentTarget));

  try {
    const last = JSON.parse(get(STORAGE_KEYS.lastThought) || "null");
    if (last?.space && last?.category && last?.main) {
      renderThought(localizeCard(last), false);
    } else if (el.thoughtBubble) {
      el.thoughtBubble.innerHTML = `<p class="placeholder">${t("placeholder")}</p>`;
    }
  } catch {
    if (el.thoughtBubble) el.thoughtBubble.innerHTML = `<p class="placeholder">${t("placeholder")}</p>`;
  }
};

const initFavorites = () => {
  restore();
  applyTranslations();
  bindLanguage();
  bindShareModal();
  renderSavedFilters();
  renderSaved();

  el.clearSavedBtn?.addEventListener("click", () => {
    state.savedThoughts = [];
    set(STORAGE_KEYS.savedThoughts, JSON.stringify(state.savedThoughts));
    renderSaved();
  });
};

if (el.body.dataset.page === "favorites") initFavorites();
else initHome();
