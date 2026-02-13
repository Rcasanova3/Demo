const STORAGE_KEYS = {
  activeSpaces: "abetterthought.activeSpaces",
  selectedCategoryKeys: "abetterthought.selectedCategoryKeys",
  savedThoughts: "abetterthought.savedThoughts",
  lastThought: "abetterthought.lastThought",
  shownCardIds: "abetterthought.shownCardIds",
  savedFilter: "abetterthought.savedFilter",
  language: "abetterthought.language"
};

const { SPACES = {}, messageCards = {} } = window.APP_CONTENT || {};
const SPACE_KEYS = Object.keys(SPACES);

const I18N = {
  en: {
    appTitle: "A quiet space for daily emotional support.",
    tagline: "One small shift. Big difference.",
    howTitle: "How this works",
    step1: "Step 1: Choose space(s)",
    step2: "Step 2: Pick category(s)",
    step3: "Step 3: Click reveal message",
    chooseSpace: "Choose space",
    pickCategory: "Pick categories",
    allCategories: "All categories",
    selectAll: "Select all",
    clear: "Clear",
    reveal: "Reveal message",
    noCategory: "No category selected",
    helperDefault: "Pick a category to reveal your message.",
    helperReady: "Tap reveal to get a thought card.",
    needSpace: "Select at least one space.",
    poolEmpty: "No messages available for the current selection.",
    placeholder: "Your better thought will appear here.",
    messageTag: "MESSAGE",
    why: "Why this helps:",
    shareErrorEmpty: "Reveal a better thought first.",
    shareModalTitle: "Share image preview",
    shareDownload: "Download image",
    shareClose: "Close",
    lastShown: "Last shown"
  },
  es: {
    appTitle: "Un espacio tranquilo para apoyo emocional diario.",
    tagline: "Un pequeño cambio. Gran diferencia.",
    howTitle: "Cómo funciona",
    step1: "Paso 1: Elige uno o más espacios",
    step2: "Paso 2: Elige una o más categorías",
    step3: "Paso 3: Pulsa revelar mensaje",
    chooseSpace: "Elegir espacio",
    pickCategory: "Elegir categorías",
    allCategories: "Todas las categorías",
    selectAll: "Seleccionar todo",
    clear: "Limpiar",
    reveal: "Revelar mensaje",
    noCategory: "Ninguna categoría seleccionada",
    helperDefault: "Elige una categoría para revelar tu mensaje.",
    helperReady: "Pulsa revelar para obtener un mensaje.",
    needSpace: "Selecciona al menos un espacio.",
    poolEmpty: "No hay mensajes disponibles para la selección actual.",
    placeholder: "Aquí aparecerá tu mejor pensamiento.",
    messageTag: "MENSAJE",
    why: "Por qué ayuda:",
    shareErrorEmpty: "Primero revela un mejor pensamiento.",
    shareModalTitle: "Vista previa de imagen para compartir",
    shareDownload: "Descargar imagen",
    shareClose: "Cerrar",
    lastShown: "Última vez"
  }
};

const state = {
  language: "en",
  selectedSpaces: ["Personal"],
  selectedCategoryKeys: [],
  savedThoughts: [],
  currentCard: null,
  shownCardIds: {},
  savedFilter: "all",
  poolIsEmpty: false
};

const safeGet = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const safeSet = (k, v) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } };

const el = {
  body: document.body,
  heroTitle: document.querySelector(".hero h1"),
  heroSub: document.querySelector(".hero .subtext"),
  languageSelect: document.getElementById("languageSelect"),
  howTitle: document.querySelector(".onboarding h2"),
  step1: document.getElementById("step1"),
  step2: document.getElementById("step2"),
  step3: document.getElementById("step3"),
  chooseSpaceTitle: document.getElementById("chooseSpaceTitle"),
  spaceHelper: document.getElementById("spaceHelper"),
  spaceSwitch: document.getElementById("spaceSwitch"),
  categorySummaryBtn: document.getElementById("categorySummaryBtn"),
  categoryMenu: document.getElementById("categoryMenu"),
  categoryList: document.getElementById("categoryList"),
  categorySelectAll: document.getElementById("categorySelectAll"),
  categoryClear: document.getElementById("categoryClear"),
  categoryLabel: document.getElementById("categoryLabel"),
  activeCategoryLabel: document.getElementById("activeCategoryLabel"),
  revealHelper: document.getElementById("revealHelper"),
  thoughtBubble: document.getElementById("thoughtBubble"),
  revealBtn: document.getElementById("revealBtn"),

  savedList: document.getElementById("savedList"),
  clearSavedBtn: document.getElementById("clearSavedBtn"),
  savedFilterControls: document.getElementById("savedFilterControls"),

  shareModal: document.getElementById("sharePreviewModal"),
  shareBackdrop: document.getElementById("shareModalBackdrop"),
  shareCard: document.getElementById("shareModalCard"),
  shareImg: document.getElementById("sharePreviewImg"),
  shareError: document.getElementById("sharePreviewError"),
  shareDownload: document.getElementById("shareDownloadLink"),
  shareNative: document.getElementById("shareNativeBtn"),
  shareClose: document.getElementById("shareCloseBtn"),
  shareTitle: document.querySelector("#shareModalCard h3")
};

const t = (key) => I18N[state.language]?.[key] || I18N.en[key] || key;
const toKey = (category, space) => `${category}|${space}`;
const parseKey = (key) => {
  const [category, space] = key.split("|");
  return { category, space };
};

const getCategoryOptions = () => {
  const items = [];
  state.selectedSpaces.forEach((space) => {
    (SPACES[space] || []).forEach((category) => {
      items.push({ key: toKey(category, space), category, space });
    });
  });
  return items;
};

const getCurrentLanguageValue = (value) => {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return "";
  return value[state.language] || value.en || Object.values(value)[0] || "";
};

const setTextContent = () => {
  if (el.heroTitle) el.heroTitle.textContent = t("appTitle");
  if (el.heroSub) el.heroSub.textContent = t("tagline");
  if (el.howTitle) el.howTitle.textContent = t("howTitle");
  if (el.step1) el.step1.textContent = t("step1");
  if (el.step2) el.step2.textContent = t("step2");
  if (el.step3) el.step3.textContent = t("step3");
  if (el.chooseSpaceTitle) el.chooseSpaceTitle.textContent = t("chooseSpace");
  if (el.categoryLabel) el.categoryLabel.textContent = `${t("pickCategory")}:`;
  if (el.categorySelectAll) el.categorySelectAll.textContent = t("selectAll");
  if (el.categoryClear) el.categoryClear.textContent = t("clear");
  if (el.revealBtn) el.revealBtn.textContent = t("reveal");
  if (el.shareTitle) el.shareTitle.textContent = t("shareModalTitle");
  if (el.shareDownload) el.shareDownload.textContent = t("shareDownload");
  if (el.shareClose) el.shareClose.textContent = t("shareClose");
};

const restoreState = () => {
  const lang = safeGet(STORAGE_KEYS.language);
  if (lang && I18N[lang]) state.language = lang;

  try {
    const spaces = JSON.parse(safeGet(STORAGE_KEYS.activeSpaces) || "[]");
    const valid = Array.isArray(spaces) ? spaces.filter((space) => SPACES[space]) : [];
    state.selectedSpaces = valid.length ? valid : ["Personal"];
  } catch {
    state.selectedSpaces = ["Personal"];
  }

  try {
    const keys = JSON.parse(safeGet(STORAGE_KEYS.selectedCategoryKeys) || "[]");
    state.selectedCategoryKeys = Array.isArray(keys) ? keys : [];
  } catch {
    state.selectedCategoryKeys = [];
  }

  try {
    const saved = JSON.parse(safeGet(STORAGE_KEYS.savedThoughts) || "[]");
    state.savedThoughts = Array.isArray(saved) ? saved : [];
  } catch {
    state.savedThoughts = [];
  }

  try {
    const shown = JSON.parse(safeGet(STORAGE_KEYS.shownCardIds) || "{}");
    state.shownCardIds = shown && typeof shown === "object" ? shown : {};
  } catch {
    state.shownCardIds = {};
  }

  const savedFilter = safeGet(STORAGE_KEYS.savedFilter);
  if (savedFilter) state.savedFilter = savedFilter;
};

const persistSelection = () => {
  safeSet(STORAGE_KEYS.activeSpaces, JSON.stringify(state.selectedSpaces));
  safeSet(STORAGE_KEYS.selectedCategoryKeys, JSON.stringify(state.selectedCategoryKeys));
  safeSet(STORAGE_KEYS.language, state.language);
};

const updateCategorySelectionForSpaces = () => {
  const allowed = new Set(getCategoryOptions().map((item) => item.key));
  state.selectedCategoryKeys = state.selectedCategoryKeys.filter((key) => allowed.has(key));
  persistSelection();
};

const renderSpaceSwitch = () => {
  if (!el.spaceSwitch) return;
  el.spaceSwitch.innerHTML = "";

  SPACE_KEYS.forEach((space) => {
    const btn = document.createElement("button");
    const active = state.selectedSpaces.includes(space);
    btn.type = "button";
    btn.className = `space-btn ${active ? "is-active" : ""}`;
    btn.setAttribute("aria-pressed", String(active));
    btn.textContent = space;
    btn.addEventListener("click", () => {
      if (state.selectedSpaces.includes(space)) {
        state.selectedSpaces = state.selectedSpaces.filter((x) => x !== space);
      } else {
        state.selectedSpaces.push(space);
      }
      updateCategorySelectionForSpaces();
      renderSpaceSwitch();
      renderCategoryDropdown();
      updateRevealState();
    });
    el.spaceSwitch.appendChild(btn);
  });
};

const categorySummaryText = () => {
  const options = getCategoryOptions();
  if (!options.length || !state.selectedCategoryKeys.length) return t("allCategories");
  const labels = options.filter((o) => state.selectedCategoryKeys.includes(o.key)).map((o) => o.category);
  if (labels.length <= 2) return labels.join(", ");
  return `${labels.length} selected`;
};

const renderCategoryDropdown = () => {
  if (!el.categoryList) return;

  const options = getCategoryOptions();
  el.categoryList.innerHTML = "";

  options.forEach((item) => {
    const row = document.createElement("label");
    row.className = "category-option";
    row.innerHTML = `
      <input type="checkbox" value="${item.key}" ${state.selectedCategoryKeys.includes(item.key) ? "checked" : ""} />
      <span>${item.category}</span>
      <small>(${item.space})</small>
    `;

    row.querySelector("input")?.addEventListener("change", (event) => {
      const key = event.target.value;
      if (event.target.checked) {
        if (!state.selectedCategoryKeys.includes(key)) state.selectedCategoryKeys.push(key);
      } else {
        state.selectedCategoryKeys = state.selectedCategoryKeys.filter((x) => x !== key);
      }
      persistSelection();
      updateRevealState();
      if (el.categorySummaryBtn) el.categorySummaryBtn.textContent = categorySummaryText();
    });

    el.categoryList.appendChild(row);
  });

  if (el.categorySummaryBtn) el.categorySummaryBtn.textContent = categorySummaryText();
};

const buildMessagePool = () => {
  if (!state.selectedSpaces.length) return [];

  const categorySet = new Set(state.selectedCategoryKeys);
  const allSelected = categorySet.size === 0;

  const pool = [];
  state.selectedSpaces.forEach((space) => {
    (SPACES[space] || []).forEach((category) => {
      const key = toKey(category, space);
      if (!allSelected && !categorySet.has(key)) return;
      const cards = messageCards?.[space]?.[category] || [];
      cards.forEach((card) => pool.push(card));
    });
  });

  return pool;
};

const nextCard = () => {
  const pool = buildMessagePool();
  if (!pool.length) return null;

  const selectedBucket = [...state.selectedSpaces].sort().join(",") + "::" + [...state.selectedCategoryKeys].sort().join(",");
  const shown = Array.isArray(state.shownCardIds[selectedBucket]) ? state.shownCardIds[selectedBucket] : [];

  let candidates = pool.filter((card) => !shown.includes(card.id));
  if (!candidates.length) {
    state.shownCardIds[selectedBucket] = [];
    candidates = [...pool];
  }

  if (state.currentCard?.id) {
    const nonRepeat = candidates.filter((card) => card.id !== state.currentCard.id);
    if (nonRepeat.length) candidates = nonRepeat;
  }

  const card = candidates[Math.floor(Math.random() * candidates.length)];
  state.shownCardIds[selectedBucket] = [...(state.shownCardIds[selectedBucket] || []), card.id];
  safeSet(STORAGE_KEYS.shownCardIds, JSON.stringify(state.shownCardIds));

  return {
    ...card,
    mainText: getCurrentLanguageValue(card.main),
    whyText: getCurrentLanguageValue(card.why),
    timestamp: Date.now()
  };
};

const updateRevealState = () => {
  const hasSpaces = state.selectedSpaces.length > 0;
  const pool = buildMessagePool();
  state.poolIsEmpty = hasSpaces && pool.length === 0;

  if (el.revealBtn) el.revealBtn.disabled = !hasSpaces || state.poolIsEmpty;
  if (el.spaceHelper) {
    el.spaceHelper.hidden = hasSpaces;
    el.spaceHelper.textContent = t("needSpace");
  }

  if (el.activeCategoryLabel) {
    if (!hasSpaces) el.activeCategoryLabel.textContent = t("noCategory");
    else el.activeCategoryLabel.textContent = categorySummaryText();
  }

  if (el.revealHelper) {
    if (!hasSpaces) el.revealHelper.textContent = t("needSpace");
    else if (state.poolIsEmpty) el.revealHelper.textContent = t("poolEmpty");
    else el.revealHelper.textContent = t("helperReady");
  }
};

const isSaved = (card) => {
  if (!card) return false;
  return state.savedThoughts.some((item) => item.section === card.space && item.category === card.category && item.text === card.mainText);
};

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
  safeSet(STORAGE_KEYS.savedThoughts, JSON.stringify(state.savedThoughts));
};

const removeCurrentSaved = () => {
  if (!state.currentCard) return;
  state.savedThoughts = state.savedThoughts.filter((item) => !(item.section === state.currentCard.space && item.category === state.currentCard.category && item.text === state.currentCard.mainText));
  safeSet(STORAGE_KEYS.savedThoughts, JSON.stringify(state.savedThoughts));
};

const toggleFavorite = () => {
  if (!state.currentCard) return;
  if (isSaved(state.currentCard)) removeCurrentSaved();
  else saveCurrent();
};

const roundRectPath = (ctx, x, y, w, h, r) => {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
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

const bindShareModalEvents = () => {
  if (!el.shareModal || el.shareModal.dataset.bound === "1") return;

  el.shareBackdrop?.addEventListener("click", closeShareModal);
  el.shareClose?.addEventListener("click", closeShareModal);
  el.shareCard?.addEventListener("click", (event) => event.stopPropagation());
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && el.shareModal && !el.shareModal.hidden) closeShareModal();
  });

  el.shareNative?.addEventListener("click", async () => {
    if (!activeShareBlob || !navigator.share) return;
    try {
      const file = new File([activeShareBlob], "a-better-thought.png", { type: "image/png" });
      await navigator.share({ files: [file], title: "A Better Thought" });
    } catch {
      // ignore
    }
  });

  el.shareModal.dataset.bound = "1";
};

const setShareLoadingState = (button, loading) => {
  if (!button) return;
  if (loading) {
    button.disabled = true;
    button.dataset.prevText = button.textContent;
    button.textContent = button.classList.contains("icon-btn") ? "…" : "Preparing share image...";
    return;
  }
  button.disabled = false;
  if (button.dataset.prevText) {
    button.textContent = button.dataset.prevText;
    delete button.dataset.prevText;
  }
};

const toBlobFromDataURL = (dataURL) => {
  const [meta, b64] = dataURL.split(",");
  const mime = (meta.match(/data:(.*?);base64/) || [])[1] || "image/png";
  const bytes = atob(b64);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i += 1) arr[i] = bytes.charCodeAt(i);
  return new Blob([arr], { type: mime });
};

const wrapPosterText = (ctx, text, maxWidth, maxLines = 8) => {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  words.forEach((word) => {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width <= maxWidth) line = test;
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

const generateSharePoster = async ({ appName, tagline, space, category, message }) => {
  if (!message || typeof message !== "string" || !message.trim()) {
    throw new Error(t("shareErrorEmpty"));
  }

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

  ctx.fillStyle = "#2d2d2d";
  ctx.font = '500 28px "Plus Jakarta Sans", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
  ctx.fillText(tagline, 100, 164);

  ctx.strokeStyle = "#1f1f1f";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(100, 200);
  ctx.lineTo(980, 200);
  ctx.stroke();

  ctx.fillStyle = "#141414";
  ctx.font = "700 130px Georgia, 'Times New Roman', serif";
  ctx.fillText(category, 100, 370);

  ctx.fillStyle = "#333";
  ctx.font = '500 30px "Plus Jakarta Sans", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
  ctx.fillText(`${space} • ${category}`, 104, 425);

  ctx.fillStyle = "#121212";
  ctx.font = '600 62px "Plus Jakarta Sans", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
  const lines = wrapPosterText(ctx, message.trim(), 860, 8);
  const lh = 66;
  const block = lines.length * lh;
  const start = 620 + (420 - block) / 2 + 24;
  lines.forEach((line, idx) => ctx.fillText(line, 110, start + idx * lh));

  ctx.fillStyle = "#3b3b3b";
  ctx.font = '500 24px "Plus Jakarta Sans", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
  ctx.fillText("rcasanova3.github.io/Demo", 100, 1268);

  let blob = await new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/png", 1));
  if (!blob) blob = toBlobFromDataURL(canvas.toDataURL("image/png", 1));
  const url = URL.createObjectURL(blob);
  return { blob, url };
};

const showShareError = (message) => {
  if (el.shareImg) {
    el.shareImg.hidden = true;
    el.shareImg.removeAttribute("src");
  }
  if (el.shareDownload) el.shareDownload.hidden = true;
  if (el.shareNative) el.shareNative.hidden = true;
  if (el.shareError) {
    el.shareError.hidden = false;
    el.shareError.textContent = message;
  }
  openShareModal();
};

const shareThought = async (card = state.currentCard, triggerButton = null) => {
  const message = card?.mainText || card?.main || "";
  if (!message.trim()) {
    showShareError(t("shareErrorEmpty"));
    return;
  }

  setShareLoadingState(triggerButton, true);
  try {
    bindShareModalEvents();
    const { blob, url } = await generateSharePoster({
      appName: "A Better Thought",
      tagline: "One small shift. Big difference.",
      space: card.space || state.selectedSpaces[0] || "Personal",
      category: card.category || "Message",
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
    console.error("Share poster generation failed", { err, canvas: "1080x1350", messageLength: message.length });
    showShareError("Could not prepare the share image. Please try again.");
  } finally {
    setShareLoadingState(triggerButton, false);
  }
};

const renderThought = (card, animate = true) => {
  if (!el.thoughtBubble || !card) return;
  state.currentCard = card;
  safeSet(STORAGE_KEYS.lastThought, JSON.stringify(card));

  const saved = isSaved(card);
  el.thoughtBubble.classList.remove("is-revealed");
  el.thoughtBubble.innerHTML = `
    <article class="thought-content">
      <p class="thought-category">
        <span class="thought-tag">${t("messageTag")}</span>
        <span class="last-shown">${t("lastShown")}: ${new Date(card.timestamp).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span>
        <button type="button" class="icon-btn icon-star ${saved ? "is-favorited" : ""}" id="cardFavoriteBtn" aria-label="Toggle favorite">${saved ? "★" : "☆"}</button>
        <button type="button" class="icon-btn" id="cardShareBtn" aria-label="Share thought">⤴</button>
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
  const options = [{ value: "all", label: "All" }, ...SPACE_KEYS.map((space) => ({ value: space.toLowerCase().replace(/[^a-z0-9]+/g, "-"), label: space }))];
  el.savedFilterControls.innerHTML = '<span class="saved-filter-label">Saved:</span>';
  options.forEach((option) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `filter-btn ${state.savedFilter === option.value ? "is-active" : ""}`;
    btn.textContent = option.label;
    btn.addEventListener("click", () => {
      state.savedFilter = option.value;
      safeSet(STORAGE_KEYS.savedFilter, option.value);
      renderSavedFilters();
      renderSaved();
    });
    el.savedFilterControls.appendChild(btn);
  });
};

const renderSaved = () => {
  if (!el.savedList) return;
  el.savedList.innerHTML = "";
  const items = state.savedFilter === "all" ? state.savedThoughts : state.savedThoughts.filter((i) => i.section.toLowerCase().replace(/[^a-z0-9]+/g, "-") === state.savedFilter);

  if (!items.length) {
    el.savedList.innerHTML = '<li class="saved-empty">No saved thoughts yet.</li>';
    if (el.clearSavedBtn) el.clearSavedBtn.hidden = state.savedThoughts.length === 0;
    return;
  }

  items.forEach((item) => {
    const li = document.createElement("li");
    li.className = "saved-item";
    li.innerHTML = `
      <p class="saved-meta">${new Date(item.timestamp).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</p>
      <p class="saved-section">${item.section} · ${item.category}</p>
      <p class="saved-text">${item.text}</p>
      <div class="saved-actions">
        <button type="button" class="btn btn-tertiary" data-share-id="${item.id}">Share</button>
        <button type="button" class="btn btn-tertiary" data-remove-id="${item.id}">Remove</button>
      </div>
    `;
    el.savedList.appendChild(li);
  });

  if (el.clearSavedBtn) el.clearSavedBtn.hidden = false;

  el.savedList.querySelectorAll("[data-remove-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.savedThoughts = state.savedThoughts.filter((x) => x.id !== btn.dataset.removeId);
      safeSet(STORAGE_KEYS.savedThoughts, JSON.stringify(state.savedThoughts));
      renderSaved();
    });
  });

  el.savedList.querySelectorAll("[data-share-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = state.savedThoughts.find((x) => x.id === btn.dataset.shareId);
      if (!item) return;
      shareThought({ space: item.section, category: item.category, main: item.text, mainText: item.text }, btn);
    });
  });
};

const bindLanguage = () => {
  if (!el.languageSelect) return;
  el.languageSelect.value = state.language;
  el.languageSelect.addEventListener("change", () => {
    state.language = el.languageSelect.value;
    persistSelection();
    setTextContent();
    renderCategoryDropdown();
    updateRevealState();
    if (!state.currentCard && el.thoughtBubble) el.thoughtBubble.innerHTML = `<p class="placeholder">${t("placeholder")}</p>`;
    if (state.currentCard) {
      state.currentCard.mainText = getCurrentLanguageValue(state.currentCard.main);
      state.currentCard.whyText = getCurrentLanguageValue(state.currentCard.why);
      renderThought(state.currentCard, false);
    }
  });
};

const bindCategoryDropdown = () => {
  if (!el.categorySummaryBtn || !el.categoryMenu) return;
  el.categorySummaryBtn.addEventListener("click", () => {
    el.categoryMenu.hidden = !el.categoryMenu.hidden;
  });

  document.addEventListener("click", (event) => {
    const within = event.target.closest(".category-dropdown");
    if (!within) el.categoryMenu.hidden = true;
  });

  el.categorySelectAll?.addEventListener("click", () => {
    state.selectedCategoryKeys = getCategoryOptions().map((item) => item.key);
    persistSelection();
    renderCategoryDropdown();
    updateRevealState();
  });

  el.categoryClear?.addEventListener("click", () => {
    state.selectedCategoryKeys = [];
    persistSelection();
    renderCategoryDropdown();
    updateRevealState();
  });
};

const initHome = () => {
  restoreState();
  setTextContent();
  bindLanguage();
  bindShareModalEvents();
  renderSpaceSwitch();
  updateCategorySelectionForSpaces();
  renderCategoryDropdown();
  bindCategoryDropdown();
  updateRevealState();

  el.revealBtn?.addEventListener("click", reveal);

  try {
    const last = JSON.parse(safeGet(STORAGE_KEYS.lastThought) || "null");
    if (last?.space && last?.category && last?.main) {
      last.mainText = getCurrentLanguageValue(last.main);
      last.whyText = getCurrentLanguageValue(last.why);
      renderThought(last, false);
    }
  } catch {
    if (el.thoughtBubble) el.thoughtBubble.innerHTML = `<p class="placeholder">${t("placeholder")}</p>`;
  }
};

const initFavorites = () => {
  restoreState();
  setTextContent();
  bindLanguage();
  bindShareModalEvents();
  renderSavedFilters();
  renderSaved();
  el.clearSavedBtn?.addEventListener("click", () => {
    state.savedThoughts = [];
    safeSet(STORAGE_KEYS.savedThoughts, JSON.stringify(state.savedThoughts));
    renderSaved();
  });
};

if (el.body.dataset.page === "favorites") initFavorites();
else initHome();
