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

  const CONTEXT = {
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
    "Military/Veteran": "a steady mission-focused reset",
    Entrepreneur: "a practical move that compounds"
  };

  const MAIN = [
    "You do not need to solve everything right now. Start with {focus}.",
    "Keep this simple: commit to {focus} for the next few minutes.",
    "Progress gets easier when your attention stays on {focus}.",
    "A short reset helps. Return to {focus} before adding more.",
    "Clarity grows faster when you work from {focus}, not pressure.",
    "Let this feel manageable. Anchor yourself in {focus}."
  ];

  const WHY = [
    "A smaller target reduces mental load so your brain can follow through.",
    "When you choose one clear anchor, your nervous system settles faster.",
    "This perspective shift turns rumination into movement you can complete.",
    "Repeating one practical step builds a habit loop your mind can trust.",
    "A boundary around one priority protects your energy and attention.",
    "Simple self-talk lowers internal noise and improves decision quality."
  ];

  const slug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const getFocus = (space, category) => {
    if (space === "Personal") return CONTEXT.Personal[category] || category.toLowerCase();
    return CONTEXT[space] || category.toLowerCase();
  };

  const buildCards = (space, category) => MAIN.map((template, i) => ({
    id: `${slug(space)}-${slug(category)}-${String(i + 1).padStart(3, "0")}`,
    space,
    category,
    main: template.replaceAll("{focus}", getFocus(space, category)),
    why: WHY[i]
  }));

  const messageCards = {};
  Object.entries(SPACES).forEach(([space, categories]) => {
    messageCards[space] = {};
    categories.forEach((category) => {
      messageCards[space][category] = buildCards(space, category);
    });
  });

  window.APP_CONTENT = { SPACES, messageCards };
})();
