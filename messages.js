(function () {
  const SPACES = {
    Personal: [
      "Gratitude", "Calm", "Joy", "Hope", "Confidence", "Focused", "Motivated", "Connected", "Balanced", "Overwhelmed",
      "Anxious", "Distracted", "Unmotivated", "Selfdoubt", "Angry", "Sad", "Guilt", "Lonely", "Burnout", "Overthinking"
    ],
    Work: ["Focus", "Boundaries", "Confidence", "Clarity", "Pressure", "Conflict", "Feedback", "Priorities", "Momentum", "Balance", "Burnout", "Purpose"],
    Parents: ["Patience", "Presence", "Calm", "Consistency", "Connection", "Energy", "Guilt", "Overwhelm", "Play", "Discipline", "Partnership", "Rest"],
    Relationships: ["Connection", "Trust", "Respect", "Listening", "Conflict", "Repair", "Boundaries", "Intimacy", "Appreciation", "Patience", "Honesty", "Growth"],
    Single: ["Confidence", "Independence", "Healing", "Standards", "Courage", "Social", "Peace", "Openness", "Purpose", "Selfworth", "Adventure", "Hope"],
    Student: ["Focus", "Discipline", "Motivation", "Confidence", "Time", "Stress", "Clarity", "Memory", "Progress", "Rest", "Momentum", "Resilience"],
    ADHD: ["Focus", "Momentum", "Clarity", "Planning", "Distraction", "Overwhelm", "Routine", "Impulses", "Energy", "Patience", "Followthrough", "Reset"],
    Caregiver: ["Patience", "Compassion", "Boundaries", "Rest", "Support", "Guilt", "Stress", "Strength", "Presence", "Acceptance", "Balance", "Recovery"],
    "Military/Veteran": ["Purpose", "Discipline", "Transition", "Identity", "Calm", "Brotherhood", "Resilience", "Stress", "Recovery", "Leadership", "Routine", "Mission"],
    Entrepreneur: ["Vision", "Focus", "Momentum", "Risk", "Clarity", "Discipline", "Consistency", "Confidence", "Burnout", "Patience", "Systems", "Growth"]
  };

  const CONTEXT_EN = {
    Personal: {
      Gratitude: "one thing you appreciate", Calm: "a slower breath", Joy: "a small bright moment", Hope: "one next step",
      Confidence: "evidence you can trust", Focused: "one clear priority", Motivated: "a tiny start", Connected: "one caring check-in",
      Balanced: "one thing to pause", Overwhelmed: "one task at a time", Anxious: "the present moment", Distracted: "one distraction to close",
      Unmotivated: "a two-minute beginning", Selfdoubt: "facts over fear", Angry: "a pause before response", Sad: "one gentle action",
      Guilt: "one repairable step", Lonely: "one small reach-out", Burnout: "one energy boundary", Overthinking: "one decision limit"
    },
    Work: "the next useful work step",
    Parents: "co-regulation before direction",
    Relationships: "one respectful conversation move",
    Single: "one self-trusting choice",
    Student: "a short focused study block",
    ADHD: "external structure for one next step",
    Caregiver: "sustainable care with limits",
    "Military/Veteran": "a steady mission-sized action",
    Entrepreneur: "execution over over-analysis"
  };

  const CONTEXT_ES = {
    Personal: {
      Gratitude: "algo que agradeces", Calm: "una respiración más lenta", Joy: "un momento agradable", Hope: "un siguiente paso",
      Confidence: "evidencia en la que puedes confiar", Focused: "una prioridad clara", Motivated: "un inicio pequeño", Connected: "un contacto con cariño",
      Balanced: "algo que puedes pausar", Overwhelmed: "una tarea a la vez", Anxious: "el momento presente", Distracted: "una distracción por cerrar",
      Unmotivated: "un comienzo de dos minutos", Selfdoubt: "hechos en lugar de miedo", Angry: "una pausa antes de responder", Sad: "una acción suave",
      Guilt: "un paso que puedes reparar", Lonely: "un pequeño acercamiento", Burnout: "un límite de energía", Overthinking: "un límite para decidir"
    },
    Work: "el siguiente paso útil en el trabajo",
    Parents: "regularte antes de dar dirección",
    Relationships: "un paso de comunicación con respeto",
    Single: "una elección con confianza propia",
    Student: "un bloque corto de estudio con foco",
    ADHD: "estructura externa para el siguiente paso",
    Caregiver: "cuidar sin romper tus límites",
    "Military/Veteran": "una acción estable y concreta",
    Entrepreneur: "ejecución en lugar de sobreanalizar"
  };

  const MAIN_EN = [
    "You do not need to solve everything now. Start with {focus}.",
    "Keep this simple: commit to {focus} for the next few minutes.",
    "Progress gets easier when your attention stays on {focus}.",
    "A short reset helps. Return to {focus} before adding more.",
    "Clarity grows faster when you work from {focus}, not pressure.",
    "Let this feel manageable. Anchor yourself in {focus}."
  ];

  const MAIN_ES = [
    "No necesitas resolver todo ahora. Empieza con {focus}.",
    "Hazlo simple: comprométete con {focus} durante los próximos minutos.",
    "El progreso mejora cuando tu atención se queda en {focus}.",
    "Un reinicio corto ayuda. Vuelve a {focus} antes de agregar más.",
    "La claridad llega más rápido cuando trabajas desde {focus}, no desde la presión.",
    "Haz que esto sea manejable. Ancla tu atención en {focus}."
  ];

  const WHY_EN = [
    "A smaller target reduces mental load so your brain can follow through.",
    "When you choose one clear anchor, your nervous system settles faster.",
    "This perspective shift turns rumination into movement you can complete.",
    "Repeating one practical step builds a habit loop your mind can trust.",
    "A boundary around one priority protects your energy and attention.",
    "Simple self-talk lowers internal noise and improves decision quality."
  ];

  const WHY_ES = [
    "Un objetivo más pequeño reduce la carga mental y facilita avanzar.",
    "Elegir un solo ancla clara ayuda a que tu sistema nervioso se calme antes.",
    "Este cambio de enfoque convierte la rumiación en acción concreta.",
    "Repetir un paso práctico crea un hábito que tu mente puede sostener.",
    "Poner límite a una prioridad protege tu energía y tu atención.",
    "Hablarte con simpleza baja el ruido interno y mejora tus decisiones."
  ];

  const slug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const getFocus = (map, space, category) => {
    if (space === "Personal") return map.Personal[category] || category.toLowerCase();
    return map[space] || category.toLowerCase();
  };

  const buildCards = (space, category) => MAIN_EN.map((template, i) => {
    const enFocus = getFocus(CONTEXT_EN, space, category);
    const esFocus = getFocus(CONTEXT_ES, space, category);

    return {
      id: `${slug(space)}-${slug(category)}-${String(i + 1).padStart(3, "0")}`,
      space,
      category,
      main: {
        en: template.replaceAll("{focus}", enFocus),
        es: MAIN_ES[i]?.replaceAll("{focus}", esFocus)
      },
      why: {
        en: WHY_EN[i],
        es: WHY_ES[i]
      }
    };
  });

  const messageCards = {};
  Object.entries(SPACES).forEach(([space, categories]) => {
    messageCards[space] = {};
    categories.forEach((category) => {
      messageCards[space][category] = buildCards(space, category);
    });
  });

  window.APP_CONTENT = { SPACES, messageCards };
})();
