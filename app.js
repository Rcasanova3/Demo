const STORAGE_KEYS = {
  activeSpace: "abetterthought.activeSpace",
  selectedCategoryBySpace: "abetterthought.selectedCategoryBySpace",
  savedThoughts: "abetterthought.savedThoughts",
  lastThought: "abetterthought.lastThought",
  shownCardIds: "abetterthought.shownCardIds",
  savedFilter: "abetterthought.savedFilter"
};

const { SPACES = {}, messageCards = {} } = window.APP_CONTENT || {};
const SPACE_KEYS = Object.keys(SPACES);

const PERSONAL_KEYWORDS = {
  Gratitude: ["appreciate", "thanks", "grat", "notice"],
  Calm: ["calm", "breath", "slow", "settle"],
  Joy: ["joy", "pleasant", "smile", "light"],
  Hope: ["hope", "next", "future", "possible"],
  Confidence: ["confid", "evidence", "capable", "trust"],
  Focused: ["focus", "priority", "single", "attention"],
  Motivated: ["start", "momentum", "action", "begin"],
  Connected: ["connect", "reach", "check-in", "support"],
  Balanced: ["balance", "pace", "pause", "limit"],
  Overwhelmed: ["overwhelm", "one", "simpl", "manageable"],
  Anxious: ["anx", "present", "breath", "certainty"],
  Distracted: ["distract", "attention", "close", "single"],
  Unmotivated: ["start", "small", "first", "begin"],
  Selfdoubt: ["doubt", "evidence", "facts", "trust"],
  Angry: ["anger", "pause", "space", "response"],
  Sad: ["sad", "kind", "care", "gentle"],
  Guilt: ["guilt", "repair", "amend", "responsibility"],
  Lonely: ["lonely", "connect", "reach", "contact"],
  Burnout: ["burnout", "energy", "boundary", "rest"],
  Overthinking: ["overthink", "decision", "limit", "action"]
};

const appState = {
  activeSpace: SPACE_KEYS[0] || "Personal",
  selectedCategoryBySpace: SPACE_KEYS.reduce((acc, space) => ({ ...acc, [space]: "" }), {}),
  selectedCategory: "",
  savedThoughts: [],
  currentCard: null,
  shownCardIds: {},
  savedFilter: "all"
};

const safeStorageGet = (key) => {
  try { return localStorage.getItem(key); } catch { return null; }
};
const safeStorageSet = (key, value) => {
  try { localStorage.setItem(key, value); } catch { /* ignore */ }
};

const spaceSwitch = document.getElementById("spaceSwitch");
const categorySelect = document.getElementById("categorySelect");
const activeCategoryLabel = document.getElementById("activeCategoryLabel");
const revealHelper = document.getElementById("revealHelper");
const thoughtBubble = document.getElementById("thoughtBubble");
const revealBtn = document.getElementById("revealBtn");

const savedList = document.getElementById("savedList");
const clearSavedBtn = document.getElementById("clearSavedBtn");
const savedFilterControls = document.getElementById("savedFilterControls");

const toFilterKey = (space) => String(space || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
const cardKey = (space, category) => `${space}::${category}`;
const getCards = (space, category) => messageCards?.[space]?.[category] || [];

const validateCards = () => {
  Object.entries(messageCards).forEach(([space, byCategory]) => {
    Object.entries(byCategory || {}).forEach(([category, cards]) => {
      const ids = new Set();
      const whyCounts = new Map();

      (cards || []).forEach((card, index) => {
        const issues = [];
        if (!card?.id || typeof card.id !== "string" || !card.id.trim()) issues.push("missing id");
        if (!card?.main || typeof card.main !== "string" || !card.main.trim()) issues.push("missing main");
        if (!card?.why || typeof card.why !== "string" || !card.why.trim()) issues.push("missing why");
        if (card?.id && ids.has(card.id)) issues.push(`duplicate id '${card.id}'`);
        if (card?.id) ids.add(card.id);

        if (issues.length) {
          console.warn("[A Better Thought] Invalid card", { space, category, index, issues, card });
        }

        const normalizedWhy = (card?.why || "").trim().toLowerCase();
        if (normalizedWhy) whyCounts.set(normalizedWhy, (whyCounts.get(normalizedWhy) || 0) + 1);

        if (space === "Personal") {
          const keywords = PERSONAL_KEYWORDS[category] || [];
          const whyText = normalizedWhy;
          const hasKeyword = keywords.some((kw) => whyText.includes(kw));
          if (!hasKeyword) {
            console.warn("[A Better Thought] possible mismatch", { space, category, id: card?.id, why: card?.why });
          }
        }
      });

      whyCounts.forEach((count, whyText) => {
        if (count >= 4) {
          console.warn("[A Better Thought] repeated why text", { space, category, count, why: whyText });
        }
      });
    });
  });
};

const setRevealState = () => {
  const hasCategory = Boolean(appState.selectedCategory);
  if (revealBtn) revealBtn.disabled = !hasCategory;
  if (activeCategoryLabel) {
    activeCategoryLabel.textContent = hasCategory ? `${appState.activeSpace} · ${appState.selectedCategory}` : "No category selected";
  }
  if (revealHelper) {
    revealHelper.textContent = hasCategory ? "Tap reveal to get a thought card." : "Pick a category to reveal your message.";
  }
};

const renderSpaceSwitch = () => {
  if (!spaceSwitch) return;
  spaceSwitch.innerHTML = "";

  SPACE_KEYS.forEach((space) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `space-btn ${space === appState.activeSpace ? "is-active" : ""}`;
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", String(space === appState.activeSpace));
    button.textContent = space;
    button.addEventListener("click", () => {
      appState.activeSpace = space;
      safeStorageSet(STORAGE_KEYS.activeSpace, space);
      appState.selectedCategory = appState.selectedCategoryBySpace[space] || "";
      renderSpaceSwitch();
      renderCategoryOptions();
      setRevealState();
    });
    spaceSwitch.appendChild(button);
  });
};

const renderCategoryOptions = () => {
  if (!categorySelect) return;
  const categories = [...(SPACES[appState.activeSpace] || [])].sort((a, b) => a.localeCompare(b));
  categorySelect.innerHTML = '<option value="">Select a category</option>';

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });

  categorySelect.value = categories.includes(appState.selectedCategory) ? appState.selectedCategory : "";
};

const getNextCard = (space, category, excludeId = null) => {
  const cards = getCards(space, category);
  if (!cards.length) {
    return {
      id: `${toFilterKey(space)}-${toFilterKey(category)}-fallback`,
      space,
      category,
      main: "One clear next step is enough for this moment.",
      why: "A focused step reduces decision fatigue and gives your mind a stable target.",
      timestamp: Date.now()
    };
  }

  const key = cardKey(space, category);
  const shown = Array.isArray(appState.shownCardIds[key]) ? appState.shownCardIds[key] : [];
  let available = cards.filter((card) => !shown.includes(card.id) && card.id !== excludeId);

  if (!available.length) {
    appState.shownCardIds[key] = [];
    available = cards.filter((card) => card.id !== excludeId);
  }
  if (!available.length) available = cards;

  const selected = available[Math.floor(Math.random() * available.length)];
  appState.shownCardIds[key] = [...(appState.shownCardIds[key] || []), selected.id];
  safeStorageSet(STORAGE_KEYS.shownCardIds, JSON.stringify(appState.shownCardIds));

  return { ...selected, timestamp: Date.now() };
};

const isThoughtSaved = (card) => {
  if (!card) return false;
  return appState.savedThoughts.some(
    (item) => item.section === card.space && item.category === card.category && item.text === card.main
  );
};

const saveCurrentThought = () => {
  if (!appState.currentCard || isThoughtSaved(appState.currentCard)) return;
  appState.savedThoughts.unshift({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    section: appState.currentCard.space,
    category: appState.currentCard.category,
    text: appState.currentCard.main,
    why: appState.currentCard.why,
    timestamp: appState.currentCard.timestamp
  });
  safeStorageSet(STORAGE_KEYS.savedThoughts, JSON.stringify(appState.savedThoughts));
};

const removeCurrentThoughtFromSaved = () => {
  if (!appState.currentCard) return;
  appState.savedThoughts = appState.savedThoughts.filter(
    (item) => !(item.section === appState.currentCard.space && item.category === appState.currentCard.category && item.text === appState.currentCard.main)
  );
  safeStorageSet(STORAGE_KEYS.savedThoughts, JSON.stringify(appState.savedThoughts));
};

const toggleCurrentThoughtSaved = () => {
  if (isThoughtSaved(appState.currentCard)) removeCurrentThoughtFromSaved();
  else saveCurrentThought();
};

const wrapText = (ctx, text, maxWidth) => {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  words.forEach((word) => {
    const trial = line ? `${line} ${word}` : word;
    if (ctx.measureText(trial).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = trial;
    }
  });
  if (line) lines.push(line);
  return lines;
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

const ensureSharePreviewModal = () => {
  let modal = document.getElementById("sharePreviewModal");
  if (modal) return modal;

  modal = document.createElement("div");
  modal.id = "sharePreviewModal";
  modal.className = "share-modal";
  modal.hidden = true;
  modal.innerHTML = `
    <div class="share-modal-backdrop" data-close-share-modal></div>
    <div class="share-modal-card" role="dialog" aria-modal="true" aria-label="Share image preview">
      <h3>Share image preview</h3>
      <img id="sharePreviewImage" alt="Preview of share image" />
      <div class="share-modal-actions">
        <a id="shareDownloadLink" class="btn btn-secondary" download="a-better-thought.png">Download image</a>
        <button type="button" class="btn btn-tertiary" data-close-share-modal>Close</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelectorAll("[data-close-share-modal]").forEach((element) => {
    element.addEventListener("click", () => {
      modal.hidden = true;
      const img = modal.querySelector("#sharePreviewImage");
      if (img?.dataset?.url) URL.revokeObjectURL(img.dataset.url);
      if (img) {
        img.removeAttribute("src");
        delete img.dataset.url;
      }
    });
  });

  return modal;
};

const openSharePreview = (blob) => {
  const modal = ensureSharePreviewModal();
  const img = modal.querySelector("#sharePreviewImage");
  const download = modal.querySelector("#shareDownloadLink");
  if (!img || !download) return;

  if (img.dataset.url) URL.revokeObjectURL(img.dataset.url);
  const url = URL.createObjectURL(blob);
  img.src = url;
  img.dataset.url = url;
  download.href = url;
  modal.hidden = false;
};

const setShareLoadingState = (button, isLoading) => {
  if (!button) return;
  if (isLoading) {
    button.disabled = true;
    button.setAttribute("aria-busy", "true");
    button.dataset.prevText = button.textContent;
    button.textContent = button.classList.contains("icon-btn") ? "…" : "Preparing share image…";
    return;
  }

  button.disabled = false;
  button.removeAttribute("aria-busy");
  if (button.dataset.prevText) {
    button.textContent = button.dataset.prevText;
    delete button.dataset.prevText;
  }
};

const generateShareImage = async ({ appName, tagline, category, message }) => {
  const outputWidth = 1080;
  const outputHeight = 1350;
  const dpr = Math.max(1, window.devicePixelRatio || 1);

  const canvas = document.createElement("canvas");
  canvas.width = Math.floor(outputWidth * dpr);
  canvas.height = Math.floor(outputHeight * dpr);
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.scale(dpr, dpr);

  const bg = ctx.createLinearGradient(0, 0, outputWidth, outputHeight);
  bg.addColorStop(0, "#eef1f3");
  bg.addColorStop(0.55, "#f5f2ec");
  bg.addColorStop(1, "#dfe4ea");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, outputWidth, outputHeight);

  const orbs = [
    { x: 160, y: 210, r: 230, color: "rgba(183, 197, 211, 0.24)" },
    { x: 900, y: 420, r: 320, color: "rgba(208, 201, 191, 0.2)" },
    { x: 520, y: 1120, r: 280, color: "rgba(178, 191, 203, 0.18)" }
  ];

  orbs.forEach((orb) => {
    ctx.save();
    ctx.filter = "blur(58px)";
    ctx.beginPath();
    ctx.fillStyle = orb.color;
    ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  // Top branding glass bar
  roundRectPath(ctx, 74, 72, 932, 176, 28);
  ctx.fillStyle = "rgba(255,255,255,0.36)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.62)";
  ctx.lineWidth = 1.4;
  ctx.stroke();
  roundRectPath(ctx, 98, 90, 884, 28, 14);
  ctx.fillStyle = "rgba(255,255,255,0.32)";
  ctx.fill();

  ctx.save();
  ctx.translate(130, 159);
  ctx.strokeStyle = "rgba(39,47,59,0.82)";
  ctx.fillStyle = "rgba(39,47,59,0.82)";
  ctx.lineWidth = 4;
  roundRectPath(ctx, -26, -24, 64, 44, 14);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-2, 20);
  ctx.lineTo(-14, 35);
  ctx.lineTo(8, 23);
  ctx.closePath();
  ctx.fill();
  // spark
  ctx.beginPath();
  ctx.moveTo(44, -20);
  ctx.lineTo(49, -7);
  ctx.lineTo(62, -2);
  ctx.lineTo(49, 3);
  ctx.lineTo(44, 16);
  ctx.lineTo(39, 3);
  ctx.lineTo(26, -2);
  ctx.lineTo(39, -7);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = "#1f2632";
  ctx.font = "700 56px Plus Jakarta Sans, system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
  ctx.fillText(appName, 220, 150);

  ctx.fillStyle = "rgba(43,53,66,0.86)";
  ctx.font = "500 30px Plus Jakarta Sans, system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
  ctx.fillText(tagline, 220, 195);

  // Category pill
  const pillW = Math.min(460, Math.max(220, category.length * 21 + 90));
  roundRectPath(ctx, (outputWidth - pillW) / 2, 308, pillW, 78, 39);
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.64)";
  ctx.lineWidth = 1.3;
  ctx.stroke();
  roundRectPath(ctx, (outputWidth - pillW) / 2 + 16, 320, pillW - 32, 16, 8);
  ctx.fillStyle = "rgba(255,255,255,0.28)";
  ctx.fill();

  ctx.fillStyle = "rgba(35,43,54,0.9)";
  ctx.font = "600 34px Plus Jakarta Sans, system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(category, outputWidth / 2, 358);
  ctx.textAlign = "left";

  // Hero message card
  roundRectPath(ctx, 92, 428, 896, 802, 30);
  ctx.fillStyle = "rgba(255,255,255,0.34)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.6)";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  roundRectPath(ctx, 120, 448, 840, 20, 10);
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.fill();

  ctx.shadowColor = "rgba(20, 25, 35, 0.13)";
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 8;
  roundRectPath(ctx, 92, 428, 896, 802, 30);
  ctx.strokeStyle = "rgba(255,255,255,0.22)";
  ctx.stroke();
  ctx.shadowColor = "transparent";

  ctx.fillStyle = "#1d2530";
  ctx.font = "600 56px Plus Jakarta Sans, system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
  const lines = wrapText(ctx, message, 760);
  const lh = 72;
  const blockHeight = lines.length * lh;
  const startY = 428 + ((802 - blockHeight) / 2) + lh * 0.35;
  lines.forEach((line, i) => ctx.fillText(line, 160, startY + i * lh));

  // subtle grain
  const grain = ctx.createImageData(outputWidth, outputHeight);
  for (let i = 0; i < grain.data.length; i += 4) {
    const v = Math.floor(Math.random() * 255);
    grain.data[i] = v;
    grain.data[i + 1] = v;
    grain.data[i + 2] = v;
    grain.data[i + 3] = 6;
  }
  ctx.putImageData(grain, 0, 0);

  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), "image/png"));
};

const shareThought = async (card = appState.currentCard, triggerButton = null) => {
  const messageText = card?.main?.trim();
  if (!messageText) {
    window.alert("Reveal a better thought first.");
    return;
  }

  setShareLoadingState(triggerButton, true);
  try {
    const blob = await generateShareImage({
      appName: "A Better Thought",
      tagline: "One small shift. Big difference.",
      category: card.category || "Message",
      message: messageText
    });
    if (!blob) {
      window.alert("Could not prepare the share image.");
      return;
    }

    const file = new File([blob], "a-better-thought.png", { type: "image/png" });
    const canNativeShare = Boolean(navigator.share && navigator.canShare?.({ files: [file] }));

    if (canNativeShare) {
      await navigator.share({ files: [file], title: "Share" });
      return;
    }

    openSharePreview(blob);
  } catch {
    window.alert("Could not share right now. Please try again.");
  } finally {
    setShareLoadingState(triggerButton, false);
  }
};

const renderThought = (card, animate = true) => {
  if (!thoughtBubble || !card) return;
  appState.currentCard = card;
  safeStorageSet(STORAGE_KEYS.lastThought, JSON.stringify(card));

  const saved = isThoughtSaved(card);
  thoughtBubble.classList.remove("is-revealed");
  thoughtBubble.innerHTML = `
    <article class="thought-content">
      <p class="thought-category">
        <span class="thought-tag">MESSAGE</span>
        <span class="last-shown">Last shown: ${new Date(card.timestamp).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span>
        <button type="button" class="icon-btn icon-star ${saved ? "is-favorited" : ""}" id="cardFavoriteBtn" aria-label="Toggle favorite">${saved ? "★" : "☆"}</button>
        <button type="button" class="icon-btn" id="cardShareBtn" aria-label="Share thought">⤴</button>
      </p>
      <p class="thought-text">${card.main}</p>
      <div class="thought-divider" aria-hidden="true"></div>
      <p class="thought-detail"><strong>Why this helps:</strong> ${card.why}</p>
    </article>
  `;

  document.getElementById("cardFavoriteBtn")?.addEventListener("click", () => {
    toggleCurrentThoughtSaved();
    renderThought(card, false);
    renderSaved();
  });
  document.getElementById("cardShareBtn")?.addEventListener("click", (event) => shareThought(card, event.currentTarget));

  if (animate) requestAnimationFrame(() => thoughtBubble.classList.add("is-revealed"));
};

const revealThought = (excludeId = null) => {
  if (!appState.selectedCategory) return;
  renderThought(getNextCard(appState.activeSpace, appState.selectedCategory, excludeId), true);
};

const renderSaved = () => {
  if (!savedList) return;
  savedList.innerHTML = "";

  const items = appState.savedFilter === "all"
    ? appState.savedThoughts
    : appState.savedThoughts.filter((item) => toFilterKey(item.section) === appState.savedFilter);

  if (!items.length) {
    savedList.innerHTML = '<li class="saved-empty">No saved thoughts yet.</li>';
    if (clearSavedBtn) clearSavedBtn.hidden = appState.savedThoughts.length === 0;
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
    savedList.appendChild(li);
  });

  if (clearSavedBtn) clearSavedBtn.hidden = false;

  savedList.querySelectorAll("[data-remove-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      appState.savedThoughts = appState.savedThoughts.filter((item) => item.id !== btn.dataset.removeId);
      safeStorageSet(STORAGE_KEYS.savedThoughts, JSON.stringify(appState.savedThoughts));
      renderSaved();
    });
  });

  savedList.querySelectorAll("[data-share-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = appState.savedThoughts.find((entry) => entry.id === btn.dataset.shareId);
      if (!item) return;
      shareThought({ space: item.section, category: item.category, main: item.text, why: item.why || "", timestamp: item.timestamp }, btn);
    });
  });
};

const renderSavedFilters = () => {
  if (!savedFilterControls) return;
  const options = [{ value: "all", label: "All" }, ...SPACE_KEYS.map((space) => ({ value: toFilterKey(space), label: space }))];
  savedFilterControls.innerHTML = '<span class="saved-filter-label">Saved:</span>';

  options.forEach((option) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `filter-btn ${appState.savedFilter === option.value ? "is-active" : ""}`;
    btn.textContent = option.label;
    btn.addEventListener("click", () => {
      appState.savedFilter = option.value;
      safeStorageSet(STORAGE_KEYS.savedFilter, option.value);
      renderSavedFilters();
      renderSaved();
    });
    savedFilterControls.appendChild(btn);
  });
};

const restoreState = () => {
  const active = safeStorageGet(STORAGE_KEYS.activeSpace);
  if (active && SPACES[active]) appState.activeSpace = active;

  try {
    const selected = JSON.parse(safeStorageGet(STORAGE_KEYS.selectedCategoryBySpace) || "{}");
    SPACE_KEYS.forEach((space) => { appState.selectedCategoryBySpace[space] = selected[space] || ""; });
  } catch { /* ignore */ }

  try {
    const saved = JSON.parse(safeStorageGet(STORAGE_KEYS.savedThoughts) || "[]");
    appState.savedThoughts = Array.isArray(saved) ? saved : [];
  } catch { appState.savedThoughts = []; }

  try {
    const shown = JSON.parse(safeStorageGet(STORAGE_KEYS.shownCardIds) || "{}");
    appState.shownCardIds = shown && typeof shown === "object" ? shown : {};
  } catch { appState.shownCardIds = {}; }

  const savedFilter = safeStorageGet(STORAGE_KEYS.savedFilter);
  if (savedFilter) appState.savedFilter = savedFilter;

  appState.selectedCategory = appState.selectedCategoryBySpace[appState.activeSpace] || "";
};

const initHomePage = () => {
  validateCards();
  restoreState();
  renderSpaceSwitch();
  renderCategoryOptions();
  setRevealState();

  categorySelect?.addEventListener("change", (event) => {
    appState.selectedCategory = event.target.value;
    appState.selectedCategoryBySpace[appState.activeSpace] = appState.selectedCategory;
    safeStorageSet(STORAGE_KEYS.selectedCategoryBySpace, JSON.stringify(appState.selectedCategoryBySpace));
    setRevealState();
  });

  revealBtn?.addEventListener("click", () => revealThought(null));

  try {
    const last = JSON.parse(safeStorageGet(STORAGE_KEYS.lastThought) || "null");
    if (last?.space === appState.activeSpace && last?.category) {
      renderThought(last, false);
    }
  } catch { /* ignore */ }
};

const initFavoritesPage = () => {
  restoreState();
  renderSavedFilters();
  renderSaved();

  clearSavedBtn?.addEventListener("click", () => {
    appState.savedThoughts = [];
    safeStorageSet(STORAGE_KEYS.savedThoughts, JSON.stringify(appState.savedThoughts));
    renderSaved();
  });
};

if (document.body.dataset.page === "favorites") initFavoritesPage();
else initHomePage();
