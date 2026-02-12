const STORAGE_KEYS = {
  activeSpace: "abetterthought.activeSpace",
  selectedCategoryBySpace: "abetterthought.selectedCategoryBySpace",
  savedThoughts: "abetterthought.savedThoughts",
  lastThought: "abetterthought.lastThought",
  messageState: "abetterthought.messageState",
  savedFilter: "abetterthought.savedFilter"
};

const SPACES = {
  Personal: [
    "Gratitude",
    "Calm",
    "Joy",
    "Hope",
    "Confidence",
    "Focused",
    "Motivated",
    "Connected",
    "Balanced",
    "Overwhelmed",
    "Anxious",
    "Distracted",
    "Unmotivated",
    "Selfdoubt",
    "Angry",
    "Sad",
    "Guilt",
    "Lonely",
    "Burnout",
    "Overthinking"
  ],
  Work: [
    "Focus",
    "Boundaries",
    "Confidence",
    "Clarity",
    "Pressure",
    "Conflict",
    "Feedback",
    "Priorities",
    "Momentum",
    "Balance",
    "Burnout",
    "Purpose"
  ],
  Parents: [
    "Patience",
    "Presence",
    "Calm",
    "Consistency",
    "Connection",
    "Energy",
    "Guilt",
    "Overwhelm",
    "Play",
    "Discipline",
    "Partnership",
    "Rest"
  ],
  Relationships: [
    "Connection",
    "Trust",
    "Respect",
    "Listening",
    "Conflict",
    "Repair",
    "Boundaries",
    "Intimacy",
    "Appreciation",
    "Patience",
    "Honesty",
    "Growth"
  ],
  Single: [
    "Confidence",
    "Independence",
    "Healing",
    "Standards",
    "Courage",
    "Social",
    "Peace",
    "Openness",
    "Purpose",
    "Selfworth",
    "Adventure",
    "Hope"
  ],
  Student: [
    "Focus",
    "Discipline",
    "Motivation",
    "Confidence",
    "Time",
    "Stress",
    "Clarity",
    "Memory",
    "Progress",
    "Rest",
    "Momentum",
    "Resilience"
  ],
  ADHD: [
    "Focus",
    "Momentum",
    "Clarity",
    "Planning",
    "Distraction",
    "Overwhelm",
    "Routine",
    "Impulses",
    "Energy",
    "Patience",
    "Followthrough",
    "Reset"
  ],
  Caregiver: [
    "Patience",
    "Compassion",
    "Boundaries",
    "Rest",
    "Support",
    "Guilt",
    "Stress",
    "Strength",
    "Presence",
    "Acceptance",
    "Balance",
    "Recovery"
  ],
  "Military/Veteran": [
    "Purpose",
    "Discipline",
    "Transition",
    "Identity",
    "Calm",
    "Brotherhood",
    "Resilience",
    "Stress",
    "Recovery",
    "Leadership",
    "Routine",
    "Mission"
  ],
  Entrepreneur: [
    "Vision",
    "Focus",
    "Momentum",
    "Risk",
    "Clarity",
    "Discipline",
    "Consistency",
    "Confidence",
    "Burnout",
    "Patience",
    "Systems",
    "Growth"
  ]
};

const SPACE_KEYS = Object.keys(SPACES);

const BASE_COMPONENTS = {
  openers: [
    "Take a breath.",
    "Pause for a second.",
    "You can reset right now.",
    "Keep this moment simple.",
    "Start with one small step.",
    "You are allowed to slow down.",
    "You can handle this in parts.",
    "Steady is enough right now."
  ],
  reframes: [
    "You do not need to do everything at once.",
    "One clear step is enough for now.",
    "Progress can be small and still real.",
    "Calm choices make hard moments easier.",
    "You can focus on what is in your control.",
    "Good enough is better than stuck.",
    "Clarity comes from action, not pressure.",
    "You can begin without being perfect."
  ],
  actions: [
    "Write one next step in five words.",
    "Take one slow inhale and long exhale.",
    "Remove one distraction near you.",
    "Start for 30 seconds.",
    "Say one clear sentence.",
    "Choose one priority now.",
    "Relax your shoulders and jaw.",
    "Finish one small task first."
  ],
  closers: [
    "Small steps count.",
    "Keep it simple.",
    "Steady beats rushed.",
    "You can check in again soon.",
    "This is enough for right now.",
    "Stay with the next step.",
    "You are moving forward.",
    "Let this be your reset."
  ]
};

const spaceTone = {
  Personal: {
    openers: ["Your inner state can shift with one kind thought."],
    reframes: ["You can meet this emotion without becoming it."],
    actions: ["Try one 30-second grounding action right now."],
    closers: ["You are building steadiness." ]
  },
  Work: {
    openers: ["Work gets easier when the next action is clear."],
    reframes: ["Clarity and boundaries protect your output."],
    actions: ["Define one priority and ignore the rest for 30 seconds."],
    closers: ["Focused effort compounds." ]
  },
  Parents: {
    openers: ["Parenting moments soften when you regulate first."],
    reframes: ["Connection often opens the door to cooperation."],
    actions: ["Use one calm sentence before the next direction."],
    closers: ["Small steady responses build safety." ]
  },
  Relationships: {
    openers: ["Relational safety grows through small repairs."],
    reframes: ["Being clear and respectful can coexist."],
    actions: ["Choose one listening-first response."],
    closers: ["Consistency builds trust." ]
  },
  Single: {
    openers: ["Your life can feel meaningful while still unfolding."],
    reframes: ["Self-trust grows through aligned choices."],
    actions: ["Take one 30-second action that supports your values."],
    closers: ["Your pace is valid." ]
  },
  Student: {
    openers: ["Learning works best in short focused blocks."],
    reframes: ["Progress comes from repetition, not pressure."],
    actions: ["Do one tiny study action now."],
    closers: ["Small sessions add up quickly." ]
  },
  ADHD: {
    openers: ["Start small; momentum often follows action."],
    reframes: ["External structure can reduce mental load."],
    actions: ["Pick one visible next step and begin for 30 seconds."],
    closers: ["Resetting is part of the process." ]
  },
  Caregiver: {
    openers: ["Care for others works better when you include yourself."],
    reframes: ["Boundaries are a form of long-term care."],
    actions: ["Take one brief reset before the next caregiving task."],
    closers: ["Sustainable care matters." ]
  },
  "Military/Veteran": {
    openers: ["Steady routines can support transition and resilience."],
    reframes: ["Strength includes recovery and adaptation."],
    actions: ["Choose one mission-sized next step for this moment."],
    closers: ["Discipline and compassion can work together." ]
  },
  Entrepreneur: {
    openers: ["Build momentum by narrowing scope."],
    reframes: ["Systems beat willpower over time."],
    actions: ["Do one 30-second action that moves the business forward."],
    closers: ["Consistency creates traction." ]
  }
};

const safeStorageGet = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeStorageSet = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore
  }
};

const appState = {
  activeSpace: "Personal",
  selectedCategoryBySpace: {},
  selectedCategory: "",
  currentThought: null,
  savedThoughts: [],
  messageState: {},
  savedFilter: "all"
};

SPACE_KEYS.forEach((space) => {
  appState.selectedCategoryBySpace[space] = "";
});

const spaceSwitch = document.getElementById("spaceSwitch");
const categorySelect = document.getElementById("categorySelect");
const activeCategoryLabel = document.getElementById("activeCategoryLabel");
const revealHelper = document.getElementById("revealHelper");
const thoughtBubble = document.getElementById("thoughtBubble");
const revealBtn = document.getElementById("revealBtn");
const orderFilter = document.getElementById("orderFilter");
const savedList = document.getElementById("savedList");
const clearSavedBtn = document.getElementById("clearSavedBtn");
const savedFilterBtns = document.querySelectorAll("[data-saved-filter]");

const normalizeFilter = (spaceName) => spaceName.toLowerCase().replace("/", "");

const shuffle = (arr) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const getPoolSize = (space) => {
  const tone = spaceTone[space] || {};
  const o = [...BASE_COMPONENTS.openers, ...(tone.openers || [])];
  const r = [...BASE_COMPONENTS.reframes, ...(tone.reframes || [])];
  const a = [...BASE_COMPONENTS.actions, ...(tone.actions || [])];
  const c = [...BASE_COMPONENTS.closers, ...(tone.closers || [])];
  return { o, r, a, c, size: o.length * r.length * a.length * c.length };
};

const decodeIndex = (index, lens) => {
  const cIdx = index % lens.c;
  const aIdx = Math.floor(index / lens.c) % lens.a;
  const rIdx = Math.floor(index / (lens.c * lens.a)) % lens.r;
  const oIdx = Math.floor(index / (lens.c * lens.a * lens.r)) % lens.o;
  return { oIdx, rIdx, aIdx, cIdx };
};

const messageKey = (space, category) => `${space}::${category}`;

const nextMessage = (space, category) => {
  const key = messageKey(space, category);
  const pool = getPoolSize(space);
  const lens = { o: pool.o.length, r: pool.r.length, a: pool.a.length, c: pool.c.length };

  if (!appState.messageState[key] || !Array.isArray(appState.messageState[key].bag) || !appState.messageState[key].bag.length) {
    const indices = Array.from({ length: pool.size }, (_, i) => i);
    appState.messageState[key] = { bag: shuffle(indices).slice(0, 700), recent: [] };
  }

  const state = appState.messageState[key];
  let idx = state.bag.pop();
  let decoded = decodeIndex(idx, lens);
  let message = `${pool.o[decoded.oIdx]} ${pool.r[decoded.rIdx]}`;

  let guard = 0;
  while (state.recent.includes(message) && state.bag.length && guard < 20) {
    idx = state.bag.pop();
    decoded = decodeIndex(idx, lens);
    message = `${pool.o[decoded.oIdx]} ${pool.r[decoded.rIdx]}`;
    guard += 1;
  }

  state.recent = [message, ...(state.recent || [])].slice(0, 8);
  safeStorageSet(STORAGE_KEYS.messageState, JSON.stringify(appState.messageState));

  return {
    space,
    category,
    message,
    why: pool.c[decoded.cIdx],
    action: pool.a[decoded.aIdx],
    timestamp: Date.now()
  };
};

const formatTimestamp = (timestamp) =>
  new Date(timestamp).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

const setRevealState = () => {
  const hasCategory = Boolean(appState.selectedCategory);
  if (revealBtn) {
    revealBtn.disabled = !hasCategory;
  }
  if (revealHelper) {
    revealHelper.textContent = hasCategory
      ? "Tap Reveal when you're ready."
      : "Pick a category to reveal your message.";
  }
  if (activeCategoryLabel) {
    activeCategoryLabel.textContent = hasCategory
      ? `${appState.activeSpace} · ${appState.selectedCategory}`
      : `${appState.activeSpace} · no category selected`;
  }
};

const renderSpaceSwitch = () => {
  if (!spaceSwitch) return;
  spaceSwitch.innerHTML = "";
  SPACE_KEYS.forEach((space) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `space-btn ${space === appState.activeSpace ? "is-active" : ""}`;
    btn.dataset.space = space;
    btn.textContent = space;
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", space === appState.activeSpace ? "true" : "false");
    btn.addEventListener("click", () => switchSpace(space));
    spaceSwitch.appendChild(btn);
  });
};

const getOrderedCategories = (mode) => {
  const names = [...SPACES[appState.activeSpace]];
  if (mode === "descending") return names.sort((a, b) => b.localeCompare(a));
  if (mode === "ascending" || mode === "alphabetical") return names.sort((a, b) => a.localeCompare(b));
  return names;
};

const renderCategoryOptions = () => {
  if (!categorySelect) return;
  const mode = orderFilter?.value || "positive";
  categorySelect.innerHTML = '<option value="">Select a category</option>';
  getOrderedCategories(mode).forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
  if (appState.selectedCategory && SPACES[appState.activeSpace].includes(appState.selectedCategory)) {
    categorySelect.value = appState.selectedCategory;
  }
};

const switchSpace = (space) => {
  appState.activeSpace = space;
  appState.selectedCategory = appState.selectedCategoryBySpace[space] || "";
  safeStorageSet(STORAGE_KEYS.activeSpace, space);
  renderSpaceSwitch();
  renderCategoryOptions();
  setRevealState();

  if (thoughtBubble && (!appState.currentThought || appState.currentThought.space !== space)) {
    thoughtBubble.innerHTML = '<p class="placeholder">Your better thought will appear here.</p>';
  }
};

const isSaved = (space, category, text) =>
  appState.savedThoughts.some((item) => item.space === space && item.category === category && item.text === text);

const toggleSaved = (thought) => {
  const idx = appState.savedThoughts.findIndex(
    (item) => item.space === thought.space && item.category === thought.category && item.text === thought.message
  );
  if (idx >= 0) {
    appState.savedThoughts.splice(idx, 1);
  } else {
    appState.savedThoughts.unshift({
      id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      section: thought.space,
      category: thought.category,
      text: thought.message,
      timestamp: Date.now()
    });
  }
  safeStorageSet(STORAGE_KEYS.savedThoughts, JSON.stringify(appState.savedThoughts));
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

const generateShareImage = async (thought) => {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const gradient = ctx.createLinearGradient(0, 0, 1080, 1350);
  gradient.addColorStop(0, "#ececec");
  gradient.addColorStop(1, "#d8d8d8");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1080, 1350);

  ctx.fillStyle = "rgba(245,245,245,0.92)";
  ctx.strokeStyle = "rgba(255,255,255,0.95)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(100, 140, 880, 1040, 48);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#111317";
  ctx.font = '700 58px "Plus Jakarta Sans", Arial, sans-serif';
  ctx.fillText("A Better Thought", 165, 240);

  ctx.fillStyle = "#595f67";
  ctx.font = '600 30px "Plus Jakarta Sans", Arial, sans-serif';
  ctx.fillText(thought.space, 165, 295);
  ctx.fillText(thought.category, 165, 340);

  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.strokeStyle = "rgba(226,226,226,1)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(150, 380, 780, 580, 36);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#1f2329";
  ctx.font = '600 46px "Plus Jakarta Sans", Arial, sans-serif';
  wrapText(ctx, thought.message, 690)
    .slice(0, 8)
    .forEach((line, i) => ctx.fillText(line, 195, 475 + i * 64));

  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), "image/png"));
};

const shareThought = async (thought = appState.currentThought) => {
  if (!thought) return;
  const text = `${thought.message}\n\n${thought.space} · ${thought.category} · A Better Thought`;

  if (navigator.share) {
    try {
      const blob = await generateShareImage(thought);
      const file = blob ? new File([blob], "a-better-thought.png", { type: "image/png" }) : null;
      if (file && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: "A Better Thought", text, files: [file] });
        return;
      }
      await navigator.share({ title: "A Better Thought", text });
      return;
    } catch {
      // fallback to clipboard
    }
  }

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    window.alert("Copied to clipboard.");
  } else {
    window.alert(text);
  }
};

const renderThought = (thought, animate = true) => {
  appState.currentThought = thought;
  safeStorageSet(STORAGE_KEYS.lastThought, JSON.stringify(thought));
  if (!thoughtBubble) return;

  const saved = isSaved(thought.space, thought.category, thought.message);

  thoughtBubble.classList.remove("is-revealed");
  thoughtBubble.innerHTML = `
    <article class="thought-content">
      <p class="thought-category">
        <span>${thought.category}</span>
        <span class="last-shown">Last shown: ${new Date(thought.timestamp).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span>
      </p>
      <p class="thought-text">${thought.message}</p>
      <p class="thought-detail"><strong>Why this helps:</strong> ${thought.why}</p>
      <p class="thought-detail"><strong>Do this now (30 seconds):</strong> ${thought.action}</p>
      <div class="card-actions-inline">
        <button type="button" class="icon-btn icon-star ${saved ? "is-favorited" : ""}" id="cardFavoriteBtn" aria-label="Toggle favorite">${saved ? "★" : "☆"}</button>
        <button type="button" class="icon-btn" id="cardShareBtn" aria-label="Share thought">⤴</button>
      </div>
    </article>
  `;

  if (animate) {
    requestAnimationFrame(() => thoughtBubble.classList.add("is-revealed"));
  }

  document.getElementById("cardFavoriteBtn")?.addEventListener("click", () => {
    toggleSaved(thought);
    renderThought(thought, false);
    renderSaved();
  });

  document.getElementById("cardShareBtn")?.addEventListener("click", () => {
    shareThought(thought);
  });
};

const revealThought = () => {
  if (!appState.selectedCategory) {
    setRevealState();
    return;
  }
  renderThought(nextMessage(appState.activeSpace, appState.selectedCategory), true);
};

const filteredSaved = () => {
  if (appState.savedFilter === "all") return appState.savedThoughts;
  return appState.savedThoughts.filter((item) => normalizeFilter(item.section) === appState.savedFilter);
};

const renderSaved = () => {
  if (!savedList) return;
  savedList.innerHTML = "";
  const items = filteredSaved();

  if (!items.length) {
    const empty = document.createElement("li");
    empty.className = "saved-item";
    empty.innerHTML = '<p class="saved-meta">DAILY AFFIRMATIONS</p><p class="saved-text">No saved thoughts for this filter yet.</p>';
    savedList.appendChild(empty);
    if (clearSavedBtn) clearSavedBtn.hidden = appState.savedThoughts.length === 0;
    return;
  }

  if (clearSavedBtn) clearSavedBtn.hidden = false;

  items.forEach((item) => {
    const li = document.createElement("li");
    li.className = "saved-item";
    li.innerHTML = `
      <p class="saved-meta">${formatTimestamp(item.timestamp)} · ${item.section} · ${item.category}</p>
      <p class="saved-text">${item.text}</p>
      <div class="saved-actions">
        <button type="button" class="icon-btn icon-star is-favorited" data-remove-id="${item.id}" aria-label="Remove">★</button>
        <button type="button" class="icon-btn" data-share-id="${item.id}" aria-label="Share">⤴</button>
      </div>
    `;
    savedList.appendChild(li);
  });

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
      shareThought({ space: item.section, category: item.category, message: item.text, timestamp: item.timestamp });
    });
  });
};

const restoreState = () => {
  const active = safeStorageGet(STORAGE_KEYS.activeSpace);
  if (active && SPACES[active]) appState.activeSpace = active;

  try {
    const saved = JSON.parse(safeStorageGet(STORAGE_KEYS.savedThoughts) || "[]");
    appState.savedThoughts = Array.isArray(saved) ? saved : [];
  } catch {
    appState.savedThoughts = [];
  }

  try {
    const messageState = JSON.parse(safeStorageGet(STORAGE_KEYS.messageState) || "{}");
    appState.messageState = messageState && typeof messageState === "object" ? messageState : {};
  } catch {
    appState.messageState = {};
  }

  try {
    const selectedBySpace = JSON.parse(safeStorageGet(STORAGE_KEYS.selectedCategoryBySpace) || "{}");
    SPACE_KEYS.forEach((space) => {
      appState.selectedCategoryBySpace[space] = selectedBySpace[space] || "";
    });
  } catch {
    // ignore
  }

  appState.selectedCategory = appState.selectedCategoryBySpace[appState.activeSpace] || "";

  renderSpaceSwitch();
  renderCategoryOptions();
  setRevealState();

  try {
    const last = JSON.parse(safeStorageGet(STORAGE_KEYS.lastThought) || "null");
    if (last?.space && last?.category && last?.message && last.space === appState.activeSpace) {
      renderThought(last, false);
    }
  } catch {
    // ignore
  }
};

const initHomePage = () => {
  categorySelect?.addEventListener("change", (event) => {
    appState.selectedCategory = event.target.value;
    appState.selectedCategoryBySpace[appState.activeSpace] = appState.selectedCategory;
    safeStorageSet(STORAGE_KEYS.selectedCategoryBySpace, JSON.stringify(appState.selectedCategoryBySpace));
    setRevealState();
  });

  orderFilter?.addEventListener("change", () => {
    renderCategoryOptions();
    if (appState.selectedCategory) {
      categorySelect.value = appState.selectedCategory;
    }
  });

  revealBtn?.addEventListener("click", revealThought);

  restoreState();
};

const initFavoritesPage = () => {
  try {
    const saved = JSON.parse(safeStorageGet(STORAGE_KEYS.savedThoughts) || "[]");
    appState.savedThoughts = Array.isArray(saved) ? saved : [];
  } catch {
    appState.savedThoughts = [];
  }

  const savedFilter = safeStorageGet(STORAGE_KEYS.savedFilter);
  if (savedFilter && ["all", "personal", "parents"].includes(savedFilter)) {
    appState.savedFilter = savedFilter;
  }

  savedFilterBtns.forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.savedFilter === appState.savedFilter);
    btn.addEventListener("click", () => {
      appState.savedFilter = btn.dataset.savedFilter;
      safeStorageSet(STORAGE_KEYS.savedFilter, appState.savedFilter);
      savedFilterBtns.forEach((other) => {
        other.classList.toggle("is-active", other === btn);
      });
      renderSaved();
    });
  });

  clearSavedBtn?.addEventListener("click", () => {
    appState.savedThoughts = [];
    safeStorageSet(STORAGE_KEYS.savedThoughts, JSON.stringify(appState.savedThoughts));
    renderSaved();
  });

  renderSaved();
};

if (document.body.dataset.page === "favorites") {
  initFavoritesPage();
} else {
  initHomePage();
}
