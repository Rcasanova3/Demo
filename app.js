const STORAGE_KEYS = {
  activeSpaces: "abetterthought.activeSpaces",
  selectedCategoryKeys: "abetterthought.selectedCategoryKeys",
  savedThoughts: "abetterthought.savedThoughts",
  lastThought: "abetterthought.lastThought",
  shownCardIds: "abetterthought.shownCardIds",
  savedFilter: "abetterthought.savedFilter"
};

const { SPACES = {}, messageCards = {} } = window.APP_CONTENT || {};
const SPACE_KEYS = Object.keys(SPACES);

const txSpace = (space) => space;
const txCategory = (category) => category;

const state = {
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
  mainText: typeof card.main === "string" ? card.main : card.main?.en || "",
  whyText: typeof card.why === "string" ? card.why : card.why?.en || ""
});

const restore = () => {
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
  set(STORAGE_KEYS.activeSpaces, JSON.stringify(state.selectedSpaces));
  set(STORAGE_KEYS.selectedCategoryKeys, JSON.stringify(state.selectedCategoryKeys));
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
  if (!options.length || !state.selectedCategoryKeys.length) return "All categories";
  const selected = options.filter((o) => state.selectedCategoryKeys.includes(o.key));
  if (selected.length <= 2) return selected.map((o) => txCategory(o.category)).join(", ");
  return `${selected.length} ${"selected"}`;
};

const syncCategoryMenu = () => {
  if (!el.categoryMenu || !el.categorySummaryBtn) return;
  el.categoryMenu.hidden = !categoryMenuOpen;
  el.categorySummaryBtn.setAttribute("aria-expanded", String(categoryMenuOpen));
};

const closeCategoryMenu = () => {
  categoryMenuOpen = false;
  syncCategoryMenu();
};

const openCategoryMenu = () => {
  categoryMenuOpen = true;
  syncCategoryMenu();
};

const toggleCategoryMenu = () => {
  categoryMenuOpen = !categoryMenuOpen;
  syncCategoryMenu();
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

  const bucket = `${[...state.selectedSpaces].sort().join(",")}::${[...state.selectedCategoryKeys].sort().join(",")}`;
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
    el.activeCategoryLabel.textContent = hasSpaces ? categorySummary() : "No category selected";
  }

  if (el.revealHelper) {
    if (!hasSpaces) el.revealHelper.textContent = "Select at least one space.";
    else if (!hasPool) el.revealHelper.textContent = "No messages available for the current selection.";
    else el.revealHelper.textContent = "Click reveal message";
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
let categoryMenuOpen = false;

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
  if (!message || !message.trim()) throw new Error("Reveal a better thought first.");
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
    showShareError("Reveal a better thought first.");
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
    showShareError("Could not prepare the share image. Please try again.");
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
        <span class="thought-tag">${"MESSAGE"}</span>
        <span class="last-shown">${"Last shown"}: ${new Date(card.timestamp).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span>
        <button type="button" class="icon-btn icon-star ${saved ? "is-favorited" : ""}" id="cardFavoriteBtn" aria-label="Toggle favorite">${saved ? "★" : "☆"}</button>
        <button type="button" class="icon-btn" id="cardShareBtn" aria-label="${"Share"}">⤴</button>
      </p>
      <p class="thought-text">${card.mainText}</p>
      <div class="thought-divider" aria-hidden="true"></div>
      <p class="thought-detail"><strong>${"Why this helps:"}</strong> ${card.whyText}</p>
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
  const options = [{ value: "all", label: "All" }, ...SPACE_KEYS.map((space) => ({ value: slug(space), label: txSpace(space) }))];
  el.savedFilterControls.innerHTML = `<span class="saved-filter-label">${"Saved:"}</span>`;
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
    el.savedList.innerHTML = `<li class="saved-empty">${"No saved thoughts yet."}</li>`;
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
        <button type="button" class="btn btn-tertiary" data-share-id="${item.id}">${"Share"}</button>
        <button type="button" class="btn btn-tertiary" data-remove-id="${item.id}">${"Remove"}</button>
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

const bindCategoryMenu = () => {
  if (!el.categorySummaryBtn || !el.categoryMenu) return;
  el.categorySummaryBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleCategoryMenu();
  });

  el.categorySummaryBtn.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleCategoryMenu();
    }
  });

  document.addEventListener("mousedown", (event) => {
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
  bindShareModal();
  renderSpaces();
  cleanCategorySelection();
  persist();
  renderCategories();
  bindCategoryMenu();
  closeCategoryMenu();
  updateRevealState();

  el.revealBtn?.addEventListener("click", reveal);

  try {
    const last = JSON.parse(get(STORAGE_KEYS.lastThought) || "null");
    if (last?.space && last?.category && last?.main) {
      renderThought(localizeCard(last), false);
    } else if (el.thoughtBubble) {
      el.thoughtBubble.innerHTML = `<p class="placeholder">${"Your better thought will appear here."}</p>`;
    }
  } catch {
    if (el.thoughtBubble) el.thoughtBubble.innerHTML = `<p class="placeholder">${"Your better thought will appear here."}</p>`;
  }
};

const initFavorites = () => {
  restore();
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
