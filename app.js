const STORAGE_KEYS = {
  selectedCategory: "mindlift.selectedCategory",
  lastReveal: "mindlift.lastReveal",
  favorites: "mindlift.favorites"
};

const appState = {
  activeCategory: null,
  previousMessageByCategory: {},
  favorites: []
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
    // storage unavailable
  }
};

const buildYearCategory = (theme) => {
  const entries = [];

  for (let i = 0; i < 365; i += 1) {
    const opener = theme.openers[i % theme.openers.length];
    const focus = theme.focuses[i % theme.focuses.length];
    const anchor = theme.anchors[i % theme.anchors.length];
    const mechanism = theme.mechanisms[i % theme.mechanisms.length];
    const action = theme.actions[i % theme.actions.length];

    entries.push({
      message: `${opener} ${focus} ${anchor}.`,
      why: `${mechanism} ${theme.whyTail}`,
      action: `${action} ${theme.actionTail}`
    });
  }

  return entries;
};

const categoryThemes = {
  Overwhelmed: {
    openers: [
      "You do not have to carry everything at once.",
      "A slower pace can still move you forward.",
      "One small next step is enough for now."
    ],
    focuses: [
      "Narrow your attention to one task",
      "Reduce pressure to do everything perfectly",
      "Give yourself permission to simplify"
    ],
    anchors: ["in this moment", "for the next hour", "before your next task"],
    mechanisms: [
      "Reducing cognitive load improves emotional stability.",
      "Single-tasking lowers stress and decision fatigue.",
      "Simplification decreases overwhelm and increases follow-through."
    ],
    whyTail: "Tiny reductions in pressure can create meaningful calm.",
    actions: [
      "Write down your top one priority.",
      "Take one slow breath and relax your shoulders.",
      "Delete one non-urgent task from your list."
    ],
    actionTail: "Spend 30 seconds, then continue gently."
  },
  Anxious: {
    openers: [
      "You can feel anxious and still choose clearly.",
      "Your breath can help your body feel safer.",
      "This feeling can pass without controlling your next step."
    ],
    focuses: [
      "Return to present facts",
      "Separate worry from immediate reality",
      "Ground yourself through your senses"
    ],
    anchors: ["right now", "in this room", "before responding"],
    mechanisms: [
      "Grounding interrupts spiraling thought loops.",
      "Long exhales support nervous system down-regulation.",
      "Present-focused attention reduces catastrophic thinking."
    ],
    whyTail: "Brief regulation practices repeated daily build resilience.",
    actions: [
      "Name 5 things you see and 4 things you feel.",
      "Inhale for 4 and exhale for 6, three times.",
      "Press your feet into the floor for two breaths."
    ],
    actionTail: "Keep it to 30 seconds for a quick reset."
  },
  "Can’t focus": {
    openers: [
      "Focus can return one small choice at a time.",
      "You can restart without self-judgment.",
      "Attention improves when the next step is clear."
    ],
    focuses: [
      "Make the task smaller",
      "Reduce visual and mental clutter",
      "Choose one clear starting action"
    ],
    anchors: ["for the next 5 minutes", "at your current energy level", "right where you are"],
    mechanisms: [
      "Micro-goals improve initiation and sustained attention.",
      "Clarity lowers friction that blocks concentration.",
      "Removing distractions supports cognitive control."
    ],
    whyTail: "Small focus wins can rebuild momentum quickly.",
    actions: [
      "Set a 30-second timer and begin one sentence.",
      "Close one distracting tab or app.",
      "Write: ‘My next action is…’ and fill it in."
    ],
    actionTail: "Use only 30 seconds to start."
  },
  Unmotivated: {
    openers: [
      "Motivation often follows action, not the other way around.",
      "A tiny move still counts as progress.",
      "You can begin gently and build from there."
    ],
    focuses: ["Start imperfectly", "Aim for consistency over intensity", "Create one visible win"],
    anchors: ["today", "this hour", "before your next break"],
    mechanisms: [
      "Behavioral activation improves mood and drive.",
      "Small completions reinforce agency and confidence.",
      "Lowering pressure increases willingness to start."
    ],
    whyTail: "Reliable micro-actions often beat sporadic big pushes.",
    actions: [
      "Stand up and stretch for two breaths.",
      "Complete one task that takes less than a minute.",
      "Write one line of progress and save it."
    ],
    actionTail: "Give it 30 seconds and reassess."
  },
  "Self-doubt": {
    openers: [
      "You can doubt yourself and still move forward wisely.",
      "Your value is not reduced by uncertainty.",
      "Confidence can be practiced in small moments."
    ],
    focuses: [
      "Name one thing you did well",
      "Replace harsh self-talk with balanced truth",
      "Trust evidence over inner criticism"
    ],
    anchors: ["in this challenge", "before your next choice", "in this season"],
    mechanisms: [
      "Balanced self-appraisal reduces avoidance.",
      "Self-compassion improves emotional regulation.",
      "Evidence-based self-talk increases confidence."
    ],
    whyTail: "Small reminders can weaken inner-critic patterns over time.",
    actions: [
      "Write one recent win, however small.",
      "Say: ‘I can learn as I go.’",
      "List one strength you used this week."
    ],
    actionTail: "Take 30 seconds to reinforce self-trust."
  },
  Angry: {
    openers: [
      "Your anger carries information, and you can channel it safely.",
      "You can pause before responding.",
      "Power and calm can exist together."
    ],
    focuses: ["Regulate first, communicate second", "Slow the reaction window", "Choose response over impulse"],
    anchors: ["in this moment", "before sending that message", "during this conversation"],
    mechanisms: [
      "Brief pauses reduce reactive behavior.",
      "Body calming lowers emotional intensity.",
      "Intentional response improves outcomes in conflict."
    ],
    whyTail: "A short pause can prevent long regret.",
    actions: [
      "Unclench your jaw and hands, then exhale slowly.",
      "Count backward from 5 before speaking.",
      "Write what you need in one clear sentence."
    ],
    actionTail: "Spend 30 seconds lowering intensity first."
  },
  Sad: {
    openers: [
      "Sadness deserves kindness, not shame.",
      "You can feel heavy and still care for yourself.",
      "One soft action can make this moment lighter."
    ],
    focuses: ["Choose gentle self-support", "Stay connected to your body", "Allow emotion without judgment"],
    anchors: ["right now", "for this next hour", "in this quiet moment"],
    mechanisms: [
      "Self-kindness reduces secondary distress.",
      "Body awareness can ease emotional intensity.",
      "Allowing feelings helps them move through more safely."
    ],
    whyTail: "Small acts of care can support recovery.",
    actions: [
      "Place a hand on your heart and breathe slowly.",
      "Drink a glass of water mindfully.",
      "Step outside and notice one comforting detail."
    ],
    actionTail: "Take 30 seconds to offer yourself care."
  },
  "Guilt/Shame": {
    openers: [
      "You can take responsibility without attacking yourself.",
      "Growth is possible without self-punishment.",
      "Compassion can coexist with accountability."
    ],
    focuses: ["Name what you learned", "Separate behavior from identity", "Choose repair over rumination"],
    anchors: ["today", "in this reflection", "before your next step"],
    mechanisms: [
      "Self-compassion supports constructive change.",
      "Distinguishing action from identity reduces shame spirals.",
      "Repair-focused thinking improves emotional recovery."
    ],
    whyTail: "Gentle accountability builds healthier long-term habits.",
    actions: [
      "Write one sentence: ‘I can learn from this.’",
      "Identify one repair action you can take.",
      "Take one breath and release self-blame in your shoulders."
    ],
    actionTail: "Use 30 seconds to move toward repair."
  },
  Lonely: {
    openers: [
      "Loneliness is a signal for connection, not a personal failure.",
      "You deserve meaningful support.",
      "Small contact can soften isolation."
    ],
    focuses: ["Reach out in a low-pressure way", "Reconnect with values and people", "Build one moment of connection"],
    anchors: ["today", "this evening", "in this next step"],
    mechanisms: [
      "Micro-connections can reduce isolation intensity.",
      "Social cues of safety improve emotional regulation.",
      "Intentional outreach supports belonging and hope."
    ],
    whyTail: "One small connection can shift how the day feels.",
    actions: [
      "Send a simple check-in text to one person.",
      "Write one name of someone you trust.",
      "Step into a shared space, even briefly."
    ],
    actionTail: "Take 30 seconds to open one connection door."
  },
  "Burnt out": {
    openers: [
      "Rest is productive when your system is overloaded.",
      "You can recover in small intervals.",
      "Boundaries protect your long-term energy."
    ],
    focuses: ["Lower demands briefly", "Protect your energy intentionally", "Choose restoration over depletion"],
    anchors: ["right now", "for this next block", "before you continue"],
    mechanisms: [
      "Short recovery breaks improve cognitive performance.",
      "Energy boundaries reduce emotional exhaustion.",
      "Nervous system recovery supports sustainable output."
    ],
    whyTail: "Micro-rest helps prevent deeper burnout cycles.",
    actions: [
      "Close your eyes for two slow breaths.",
      "Loosen your shoulders and neck gently.",
      "Delay one non-urgent task by one hour."
    ],
    actionTail: "Take 30 seconds to protect your energy."
  },
  Overthinking: {
    openers: [
      "You do not need perfect certainty to move.",
      "Thinking more is not always solving more.",
      "Action can quiet loops faster than rumination."
    ],
    focuses: ["Choose one decision boundary", "Shift from analysis to action", "Return to what is controllable"],
    anchors: ["in this decision", "for the next 10 minutes", "right now"],
    mechanisms: [
      "Decision limits reduce rumination fatigue.",
      "Action interrupts repetitive thought cycles.",
      "Control-focused thinking decreases mental overload."
    ],
    whyTail: "Small action often creates clarity faster than extra analysis.",
    actions: [
      "Set a 30-second limit, then choose the next step.",
      "Write two options and pick one.",
      "Ask: ‘What is enough information right now?’"
    ],
    actionTail: "Use 30 seconds to move from loop to action."
  },
  "Gratitude/Positive": {
    openers: [
      "There is still something good available right now.",
      "Small moments of appreciation can steady your mood.",
      "Noticing what is working builds emotional strength."
    ],
    focuses: ["Name one thing that helped today", "Appreciate one person or moment", "Let your attention include what is good"],
    anchors: ["in this day", "before sleep", "in this breath"],
    mechanisms: [
      "Gratitude practices can broaden attention and reduce stress bias.",
      "Positive noticing supports emotional balance.",
      "Appreciation strengthens resilience and perspective."
    ],
    whyTail: "Regular gratitude can support steadier wellbeing over time.",
    actions: [
      "List one thing you are grateful for right now.",
      "Send one thank-you message.",
      "Name one moment from today you want to remember."
    ],
    actionTail: "Take 30 seconds to anchor in what is good."
  }
};

const categories = Object.fromEntries(
  Object.entries(categoryThemes).map(([name, theme]) => [name, buildYearCategory(theme)])
);

const categorySelect = document.getElementById("categorySelect");
const categoryTitle = document.getElementById("categoryTitle");
const revealHint = document.getElementById("revealHint");
const messageBox = document.getElementById("messageBox");
const drawBtn = document.getElementById("drawBtn");
const favoritesList = document.getElementById("favoritesList");
const favoritesEmpty = document.getElementById("favoritesEmpty");

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
};

const wrapText = (ctx, text, maxWidth) => {
  const words = text.split(" ");
  const lines = [];
  let line = "";

  words.forEach((word) => {
    const testLine = line ? `${line} ${word}` : word;
    const width = ctx.measureText(testLine).width;

    if (width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = testLine;
    }
  });

  if (line) {
    lines.push(line);
  }

  return lines;
};

const generateAffirmationJpeg = (text) => {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return Promise.resolve(null);
  }

  ctx.fillStyle = "#e7e7e5";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#1a1a1a";
  ctx.font = "700 124px Georgia, 'Times New Roman', serif";
  ctx.fillText("MindLift", 120, 250);

  ctx.font = "italic 48px Georgia, 'Times New Roman', serif";
  ctx.fillText("affirmation", 120, 320);

  ctx.strokeStyle = "#cfcfcd";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(120, 390);
  ctx.lineTo(960, 390);
  ctx.stroke();

  ctx.fillStyle = "#202020";
  ctx.font = "600 64px Georgia, 'Times New Roman', serif";
  const lines = wrapText(ctx, text, 820);
  lines.slice(0, 8).forEach((line, index) => {
    ctx.fillText(line, 120, 520 + index * 90);
  });

  ctx.fillStyle = "#555";
  ctx.font = "400 34px Georgia, 'Times New Roman', serif";
  ctx.fillText("mindlift daily", 120, 1220);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.92);
  });
};

const shareAffirmationImage = async (text) => {
  const blob = await generateAffirmationJpeg(text);

  if (!blob) {
    window.alert("Unable to generate image on this device.");
    return;
  }

  const file = new File([blob], "mindlift-affirmation.jpg", { type: "image/jpeg" });

  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({
        title: "MindLift Daily Affirmation",
        text,
        files: [file]
      });
      return;
    } catch {
      // fallback to download
    }
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "mindlift-affirmation.jpg";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const persistSelectedCategory = () => {
  if (!appState.activeCategory) {
    return;
  }

  safeStorageSet(STORAGE_KEYS.selectedCategory, appState.activeCategory);
};

const loadFavorites = () => {
  try {
    const raw = safeStorageGet(STORAGE_KEYS.favorites);
    appState.favorites = raw ? JSON.parse(raw) : [];
  } catch {
    appState.favorites = [];
  }
};

const persistFavorites = () => {
  safeStorageSet(STORAGE_KEYS.favorites, JSON.stringify(appState.favorites));
};

const setDrawEnabled = (enabled) => {
  drawBtn.disabled = !enabled;
  revealHint.textContent = enabled
    ? "Tap Reveal when you're ready."
    : "Pick a category to reveal your message.";
};

const buildMessageCardHTML = (entry, timestamp, showAnimation = true) => {
  const lastShown = timestamp ? `<p class="last-shown">Last shown: ${formatTime(timestamp)}</p>` : "";

  return `
    <article class="message-card ${showAnimation ? "reveal-in" : ""}">
      <header class="message-header">
        <h3>${entry.category}</h3>
        ${lastShown}
      </header>
      <p class="message-main">${entry.message}</p>
      <p><strong>Why this helps:</strong> ${entry.why}</p>
      <p><strong>Do this now (30 seconds):</strong> ${entry.action}</p>
      <div class="message-actions">
        <button id="saveMessageBtn" class="secondary-btn" type="button">Save</button>
        <button id="shareMessageBtn" class="secondary-btn" type="button">Share</button>
      </div>
    </article>
  `;
};

const renderMessageCard = (entry, timestamp, showAnimation = true) => {
  messageBox.classList.add("filled");
  messageBox.innerHTML = buildMessageCardHTML(entry, timestamp, showAnimation);

  const saveBtn = document.getElementById("saveMessageBtn");
  const shareBtn = document.getElementById("shareMessageBtn");

  saveBtn?.addEventListener("click", () => {
    const alreadySaved = appState.favorites.some(
      (favorite) => favorite.category === entry.category && favorite.message === entry.message
    );

    if (alreadySaved) {
      saveBtn.textContent = "Saved";
      return;
    }

    appState.favorites.unshift({
      id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      category: entry.category,
      message: entry.message
    });

    persistFavorites();
    renderFavorites();
    saveBtn.textContent = "Saved";
  });

  shareBtn?.addEventListener("click", async () => {
    await shareAffirmationImage(entry.message);
  });
};

const fallbackEntry = (categoryName) => ({
  category: categoryName,
  message: "No messages are available in this category yet.",
  why: "A gentle fallback keeps your routine uninterrupted while content is updated.",
  action: "Take three slow breaths and choose any other category for a fresh prompt."
});

const getDifferentMessage = (categoryName) => {
  const pool = categories[categoryName] || [];
  const previous = appState.previousMessageByCategory[categoryName];

  if (!pool.length) {
    return fallbackEntry(categoryName);
  }

  if (pool.length === 1) {
    const only = { ...pool[0], category: categoryName };
    appState.previousMessageByCategory[categoryName] = only.message;
    return only;
  }

  let next = pool[Math.floor(Math.random() * pool.length)];

  while (next.message === previous) {
    next = pool[Math.floor(Math.random() * pool.length)];
  }

  appState.previousMessageByCategory[categoryName] = next.message;
  return { ...next, category: categoryName };
};

const saveLastReveal = (entry, timestamp) => {
  safeStorageSet(
    STORAGE_KEYS.lastReveal,
    JSON.stringify({
      category: entry.category,
      message: entry.message,
      why: entry.why,
      action: entry.action,
      timestamp
    })
  );
};

const selectCategory = (categoryName) => {
  if (!categories[categoryName]) {
    appState.activeCategory = null;
    categoryTitle.textContent = "Message space";
    setDrawEnabled(false);
    return;
  }

  appState.activeCategory = categoryName;
  categorySelect.value = categoryName;
  categoryTitle.textContent = categoryName;
  setDrawEnabled(true);
  persistSelectedCategory();
};

const renderFavorites = () => {
  favoritesList.innerHTML = "";

  if (!appState.favorites.length) {
    favoritesEmpty.hidden = false;
    return;
  }

  favoritesEmpty.hidden = true;

  appState.favorites.forEach((favorite) => {
    const item = document.createElement("li");
    item.className = "favorite-item";

    item.innerHTML = `
      <div>
        <p class="favorite-category">${favorite.category}</p>
        <p class="favorite-message">${favorite.message}</p>
      </div>
      <button class="ghost-btn" data-remove-id="${favorite.id}" type="button">Remove</button>
    `;

    favoritesList.appendChild(item);
  });

  favoritesList.querySelectorAll("[data-remove-id]").forEach((button) => {
    button.addEventListener("click", () => {
      appState.favorites = appState.favorites.filter(
        (favorite) => favorite.id !== button.dataset.removeId
      );
      persistFavorites();
      renderFavorites();
    });
  });
};

const revealMessage = (showAnimation = true) => {
  if (!appState.activeCategory) {
    setDrawEnabled(false);
    return;
  }

  const entry = getDifferentMessage(appState.activeCategory);
  const timestamp = Date.now();

  renderMessageCard(entry, timestamp, showAnimation);
  saveLastReveal(entry, timestamp);
};

const restoreFromStorage = () => {
  const lastCategory = safeStorageGet(STORAGE_KEYS.selectedCategory);
  if (lastCategory && categories[lastCategory]) {
    selectCategory(lastCategory);
  } else {
    setDrawEnabled(false);
  }

  try {
    const rawLastReveal = safeStorageGet(STORAGE_KEYS.lastReveal);
    if (!rawLastReveal) {
      return;
    }

    const lastReveal = JSON.parse(rawLastReveal);
    if (!lastReveal?.category || !lastReveal?.message) {
      return;
    }

    if (categories[lastReveal.category]) {
      selectCategory(lastReveal.category);
    }

    renderMessageCard(
      {
        category: lastReveal.category,
        message: lastReveal.message,
        why: lastReveal.why,
        action: lastReveal.action
      },
      lastReveal.timestamp,
      false
    );

    appState.previousMessageByCategory[lastReveal.category] = lastReveal.message;
  } catch {
    // ignore invalid localStorage payloads
  }
};

const buildCategoryOptions = () => {
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Select a category";
  categorySelect.appendChild(placeholder);

  Object.keys(categories).forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    categorySelect.appendChild(option);
  });

  categorySelect.value = "";
};

categorySelect.addEventListener("change", (event) => {
  selectCategory(event.target.value);
});

drawBtn.addEventListener("click", () => {
  revealMessage(true);
});

buildCategoryOptions();
loadFavorites();
renderFavorites();
restoreFromStorage();
