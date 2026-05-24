const STORAGE_KEY = "daysprolartion.entries.v2";
const PRACTICE_KEY = "daysprolartion.practice.v2";
const LANGUAGE_KEY = "daysprolartion.language.v1";
const SAVED_QUESTION_KEY = "daysprolartion.saved-questions.v1";
const QUESTION_BANK_URL = "data/questions.json";
const TRIVIA_BANK_URL = "data/trivia.json";

const sampleThoughts = [
  "I avoid asking follow-up questions when I worry the other person might think I am prying.",
  "My best ideas appear while I am walking, but I lose them because I assume I will remember later.",
  "At work I understand a problem better after I explain it to someone else."
];

const scenarios = [
  {
    type: "Casual",
    text: "You are catching up with a friend after dinner. They glance at the guitar case in the corner and say, \"I think I am done with it. I used to love playing, but now I feel tired before I even start.\"",
    better: [
      "What has that hobby stopped giving you that it used to give?",
      "When did you first notice your relationship to it changing?",
      "What part of quitting feels like relief, and what part feels hard?"
    ]
  },
  {
    type: "Work",
    text: "During a Monday standup, a teammate pauses longer than usual before giving their update. They say, \"The project is moving, but it feels heavier than it should. I cannot tell if the scope is wrong or if I am just missing something.\"",
    better: [
      "Which part of the work is creating the most drag right now?",
      "What assumption did we make early on that might be costing us now?",
      "If this felt lighter next week, what would have changed?"
    ]
  },
  {
    type: "Casual",
    text: "A friend messages you late at night and says they keep opening apps, closing them, then walking around the room. They write, \"I am not exactly sad. I just feel restless, like something needs to change but I do not know what.\"",
    better: [
      "When does the restlessness get loudest during the day?",
      "What does it feel like the restlessness is asking you to change?",
      "Is it more like boredom, pressure, anticipation, or something else?"
    ]
  },
  {
    type: "Work",
    text: "After a planning meeting, your manager stays behind while everyone leaves the call. They say, \"We talked for an hour, but I do not think we created real clarity. I am worried people heard different versions of what happens next.\"",
    better: [
      "What decision or next step was still fuzzy after the meeting?",
      "Where did the conversation create motion without creating agreement?",
      "What would have made the meeting feel decisive by the end?"
    ]
  },
  {
    type: "Casual",
    text: "A family member is scrolling through old photos at the table. They laugh at one picture, then get quiet and say, \"I miss that version of me. I felt lighter then, like I had more room to be myself.\"",
    better: [
      "What quality from that version of you still feels important now?",
      "When do you feel closest to that older self?",
      "What changed around you that made that version harder to access?"
    ]
  }
];

const sparkQuestions = [
  "What belief are you treating as true because it has been useful, not because it has been examined?",
  "Where are you asking for certainty when you actually need a better experiment?",
  "What kind of attention makes you feel most understood?",
  "Which recurring irritation might be pointing to a value you have not named yet?",
  "What would become easier if you stopped trying to sound smart and tried to become precise?",
  "What do you avoid noticing because noticing it would require a decision?",
  "If your curiosity had a default setting, what would it search for first?",
  "What is one question you wish people asked you more often?"
];

const mentorIntents = [
  {
    name: "avoidance",
    words: ["avoid", "delay", "delaying", "postpone", "procrastinate", "perfect", "ready", "overthink", "afraid", "scared", "worry"],
    mirror: "It sounds like part of you is trying to stay safe by waiting until the conditions feel perfect.",
    questions: [
      "What is the smallest honest version of this you could try before you feel fully ready?",
      "What are you protecting yourself from if you keep waiting?",
      "If a friend had this exact pattern, what would you gently invite them to test next?"
    ]
  },
  {
    name: "ambition",
    words: ["want", "wanna", "become", "dream", "goal", "famous", "superstar", "success", "career", "future", "build"],
    mirror: "I hear a real pull toward becoming more visible, capable, or fully expressed.",
    questions: [
      "What part of that desire feels alive and true, and what part feels like pressure to prove something?",
      "If you took this ambition seriously, what would you practice this week instead of only imagining the final result?",
      "Who do you become in the process if this goal works, and who do you risk becoming if it turns into pressure?"
    ]
  },
  {
    name: "emotion",
    words: ["feel", "feeling", "sad", "angry", "tired", "restless", "lonely", "happy", "excited", "anxious", "heavy"],
    mirror: "The emotion seems like useful data, not just noise to get rid of.",
    questions: [
      "Where does that feeling show up most clearly: in your body, your thoughts, or your choices?",
      "What might this feeling be asking you to notice before you rush to fix it?",
      "When does this feeling become louder, and when does it soften?"
    ]
  },
  {
    name: "relationship",
    words: ["friend", "family", "person", "people", "conversation", "talk", "mentor", "listen", "understood", "someone", "they"],
    mirror: "There is a relationship layer here, so the shape of the conversation may matter as much as the answer.",
    questions: [
      "What do you most want the other person to understand before you decide what to say?",
      "What would make this feel like connection rather than performance?",
      "What are you hoping they feel after talking with you?"
    ]
  },
  {
    name: "clarity",
    words: ["confused", "unclear", "clarity", "decision", "choice", "question", "understand", "meaning", "why", "stuck"],
    mirror: "It feels like the next move is not more effort, but a sharper question.",
    questions: [
      "What is the one thing that, if clarified, would make the rest easier to think about?",
      "What are two possible interpretations of this, and which one feels more honest right now?",
      "What evidence would help you stop circling and make the next small decision?"
    ]
  },
  {
    name: "creative",
    words: ["idea", "creative", "write", "design", "make", "app", "project", "imagine", "create", "thinking"],
    mirror: "This sounds like an idea that needs shape, not judgment too early.",
    questions: [
      "What is the tiny version of this idea that would still feel meaningful?",
      "Who is this really for, and what would they feel after using or seeing it?",
      "What part should stay playful while you make it more concrete?"
    ]
  }
];

const categoryRules = [
  {
    name: "Self-awareness",
    words: ["feel", "feeling", "emotion", "emotional", "awkward", "identity", "avoid", "fear", "truth", "self", "noticed", "restless"]
  },
  {
    name: "Relationships",
    words: ["friend", "family", "conversation", "conversations", "listening", "people", "person", "someone", "others", "manager", "teammate", "understood"]
  },
  {
    name: "Work",
    words: ["work", "meeting", "project", "team", "manager", "problem", "decision", "clarity", "career", "business"]
  },
  {
    name: "Learning",
    words: ["learn", "question", "questions", "thinking", "understand", "practice", "ideas", "explain", "curiosity", "experiment", "habit"]
  },
  {
    name: "Philosophy",
    words: ["belief", "meaning", "truth", "life", "value", "certainty", "pattern", "attention", "choice"]
  },
  {
    name: "Creativity",
    words: ["idea", "creative", "write", "build", "make", "design", "spark", "imagine", "ordinary"]
  }
];

const stopWords = new Set([
  "about", "after", "again", "also", "and", "are", "because", "been", "before", "being", "but", "can", "could",
  "did", "does", "doing", "for", "from", "had", "has", "have", "how", "into", "its", "just", "later", "like",
  "maybe", "more", "most", "much", "not", "now", "off", "often", "one", "only", "our", "out", "over", "really",
  "seem", "should", "some", "something", "than", "that", "the", "their", "them", "then", "there", "these", "they",
  "this", "through", "too", "used", "was", "way", "what", "when", "where", "which", "while", "who", "why", "will",
  "with", "would", "you", "your", "myself", "my", "were"
]);

const state = {
  entries: loadEntries(),
  practice: loadPractice(),
  language: loadLanguage(),
  savedQuestions: loadSavedQuestions(),
  questionBank: null,
  triviaBank: null,
  usedContentIds: {
    spark: [],
    scenario: [],
    trivia: [],
    mentor: {}
  },
  activeScenario: null,
  activeSparkIndex: 0,
  activeSparkQuestion: "",
  activePeriod: "week",
  practiceMode: "single",
  thoughtMode: "brainstorm",
  memoryMode: "thoughts",
  memorySearch: "",
  triviaIndex: 0,
  trivia: [],
  roleplayMessages: [],
  currentTopicId: null,
  currentFollowUp: "",
  recognition: null,
  activeVoiceButton: null,
  toastTimer: null
};

const elements = {
  todayCount: document.querySelector("#todayCount"),
  thoughtInput: document.querySelector("#thoughtInput"),
  quickNotePanel: document.querySelector("#quickNotePanel"),
  brainstormPanel: document.querySelector("#brainstormPanel"),
  brainstormChat: document.querySelector("#brainstormChat"),
  brainstormInput: document.querySelector("#brainstormInput"),
  brainstormVoiceButton: document.querySelector("#brainstormVoiceButton"),
  sparkPromptPanel: document.querySelector("#sparkPromptPanel"),
  sparkQuestionText: document.querySelector("#sparkQuestionText"),
  triviaFeed: document.querySelector("#triviaFeed"),
  scenarioText: document.querySelector("#scenarioText"),
  scenarioType: document.querySelector("#scenarioType"),
  questionInput: document.querySelector("#questionInput"),
  practiceVoiceButton: document.querySelector("#practiceVoiceButton"),
  questionFeedback: document.querySelector("#questionFeedback"),
  savedQuestionCount: document.querySelector("#savedQuestionCount"),
  roleplayPanel: document.querySelector("#roleplayPanel"),
  roleplayThread: document.querySelector("#roleplayThread"),
  roleplayInput: document.querySelector("#roleplayInput"),
  roleplayVoiceButton: document.querySelector("#roleplayVoiceButton"),
  quickVoiceButton: document.querySelector("#quickVoiceButton"),
  totalEntries: document.querySelector("#totalEntries"),
  practiceAttempts: document.querySelector("#practiceAttempts"),
  practiceHelper: document.querySelector("#practiceHelper"),
  topCategory: document.querySelector("#topCategory"),
  personalInsight: document.querySelector("#personalInsight"),
  boardColumns: document.querySelector("#boardColumns"),
  memorySearchInput: document.querySelector("#memorySearchInput"),
  languageSelect: document.querySelector("#languageSelect"),
  localSaveCount: document.querySelector("#localSaveCount"),
  connectionStatus: document.querySelector("#connectionStatus"),
  aiStatus: document.querySelector("#aiStatus"),
  skillStatus: document.querySelector("#skillStatus"),
  currentMode: document.querySelector("#currentMode"),
  entryModal: document.querySelector("#entryModal"),
  entryModalTitle: document.querySelector("#entryModalTitle"),
  entryModalMeta: document.querySelector("#entryModalMeta"),
  entryModalBody: document.querySelector("#entryModalBody"),
  toast: document.querySelector("#toast")
};

init();

async function init() {
  wireNavigation();
  wireActions();
  elements.languageSelect.value = state.language;
  await loadLocalContentBanks();
  requestSparkQuestion();
  pickScenario();
  loadTrivia();
  renderSparkQuestion();
  renderPracticeModeState();
  renderModeState();
  renderAll();
  checkConnection();
}

async function loadLocalContentBanks() {
  const [questionBank, triviaBank] = await Promise.all([
    fetchLocalJson(QUESTION_BANK_URL),
    fetchLocalJson(TRIVIA_BANK_URL)
  ]);
  state.questionBank = questionBank;
  state.triviaBank = triviaBank;
}

async function fetchLocalJson(url) {
  if (window.location.protocol !== "http:" && window.location.protocol !== "https:") return null;
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

function wireNavigation() {
  document.querySelectorAll("[data-view-link]").forEach((control) => {
    control.addEventListener("click", () => showView(control.dataset.viewLink));
  });
}

function wireActions() {
  document.querySelector("#sampleThoughtButton").addEventListener("click", openSparkPrompt);
  document.querySelector("#newSparkButton").addEventListener("click", nextSparkQuestion);
  document.querySelector("#closeSparkButton").addEventListener("click", closeSparkPrompt);
  document.querySelector("#refreshTriviaButton").addEventListener("click", nextTriviaFact);
  document.querySelectorAll("[data-practice-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      state.practiceMode = button.dataset.practiceMode;
      document.querySelectorAll("[data-practice-mode]").forEach((item) => {
        item.classList.toggle("is-active", item === button);
      });
      renderPracticeModeState();
    });
  });
  document.querySelector("#processThoughtButton").addEventListener("click", saveThought);
  document.querySelector("#clearThoughtButton").addEventListener("click", () => {
    resetThoughtComposer(true);
  });
  document.querySelector("#brainstormSendButton").addEventListener("click", sendBrainstormMessage);
  elements.brainstormVoiceButton.addEventListener("click", () => startVoiceCapture(elements.brainstormInput, elements.brainstormVoiceButton));
  elements.quickVoiceButton.addEventListener("click", () => startVoiceCapture(elements.thoughtInput, elements.quickVoiceButton));
  elements.practiceVoiceButton.addEventListener("click", () => startVoiceCapture(elements.questionInput, elements.practiceVoiceButton));
  elements.roleplayVoiceButton.addEventListener("click", () => startVoiceCapture(elements.roleplayInput, elements.roleplayVoiceButton));
  document.querySelector("#startNewSessionButton").addEventListener("click", startNewSession);
  document.querySelector("#closeEntryModal").addEventListener("click", closeEntryModal);
  elements.entryModal.addEventListener("click", (event) => {
    if (event.target === elements.entryModal) closeEntryModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !elements.entryModal.classList.contains("is-hidden")) {
      closeEntryModal();
    }
  });

  document.querySelector("#newScenarioButton").addEventListener("click", () => pickScenario());
  document.querySelector("#scoreQuestionButton").addEventListener("click", sendPracticeQuestion);
  document.querySelector("#roleplaySendButton").addEventListener("click", sendRoleplayMessage);
  document.querySelector("#newRoleplayButton").addEventListener("click", resetRoleplay);
  elements.questionFeedback.addEventListener("click", (event) => {
    const saveButton = event.target.closest("[data-toggle-save-question]");
    if (saveButton) {
      toggleSavedQuestion(saveButton.dataset.toggleSaveQuestion, saveButton);
      return;
    }
    if (!event.target.matches("[data-feedback-new-scenario]")) return;
    pickScenario();
  });

  document.querySelectorAll("[data-thought-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      if (state.currentTopicId && button.dataset.thoughtMode !== state.thoughtMode) {
        startNewSession();
      }
      state.thoughtMode = button.dataset.thoughtMode;
      document.querySelectorAll("[data-thought-mode]").forEach((item) => {
        item.classList.toggle("is-active", item === button);
      });
      renderModeState();
    });
  });

  document.querySelector("#exportJsonButton").addEventListener("click", exportJson);
  document.querySelector("#exportCsvButton").addEventListener("click", exportCsv);
  document.querySelector("#loadDemoDataButton").addEventListener("click", loadDemoData);
  document.querySelector("#clearEntriesButton").addEventListener("click", clearMemory);

  document.querySelectorAll("[data-period]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activePeriod = button.dataset.period;
      document.querySelectorAll("[data-period]").forEach((item) => {
        item.classList.toggle("is-active", item === button);
      });
      renderAll();
    });
  });

  elements.memorySearchInput.addEventListener("input", () => {
    state.memorySearch = elements.memorySearchInput.value.trim().toLowerCase();
    renderBoard();
  });

  elements.languageSelect.addEventListener("change", () => {
    state.language = elements.languageSelect.value === "id" ? "id" : "en";
    localStorage.setItem(LANGUAGE_KEY, state.language);
    showToast(state.language === "id" ? "Indonesian context active." : "Global context active.");
    requestSparkQuestion();
    resetRoleplay(false);
    pickScenario();
    loadTrivia();
  });

  document.querySelector("#thoughtsMetricButton").addEventListener("click", () => setMemoryMode("thoughts"));
  document.querySelector("#curiosityMetricButton").addEventListener("click", () => setMemoryMode("curiosity"));
  document.querySelector("#savedQuestionsMetricButton").addEventListener("click", () => setMemoryMode("saved"));
  document.querySelector("#categoryMetricButton").addEventListener("click", () => setMemoryMode("thoughts"));

  elements.boardColumns.addEventListener("click", (event) => {
    const discussButton = event.target.closest("[data-discuss-question]");
    if (discussButton) {
      useSavedQuestionForThoughts(discussButton.dataset.discussQuestion);
      return;
    }
    const removeButton = event.target.closest("[data-remove-saved-question]");
    if (removeButton) {
      removeSavedQuestion(removeButton.dataset.removeSavedQuestion);
      return;
    }
    const card = event.target.closest("[data-entry-id]");
    if (!card) return;
    openEntryModal(card.dataset.entryId);
  });

  elements.boardColumns.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const card = event.target.closest("[data-entry-id]");
    if (!card) return;
    event.preventDefault();
    openEntryModal(card.dataset.entryId);
  });
}

function showView(viewId) {
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.toggle("is-active", view.id === viewId);
  });
  document.querySelectorAll(".nav-button").forEach((control) => {
    control.classList.toggle("is-active", control.dataset.viewLink === viewId);
  });
}

function renderPracticeModeState() {
  const isRoleplay = state.practiceMode === "roleplay";
  document.querySelectorAll(".single-practice-panel").forEach((panel) => {
    panel.classList.toggle("is-hidden", isRoleplay);
  });
  elements.roleplayPanel.classList.toggle("is-hidden", !isRoleplay);
  if (isRoleplay) renderRoleplayThread();
}

function renderModeState() {
  const isBrainstorm = state.thoughtMode === "brainstorm";
  document.querySelector("#startNewSessionButton").classList.toggle("is-visible", isBrainstorm);
  elements.brainstormPanel.classList.toggle("is-hidden", !isBrainstorm);
  elements.quickNotePanel.classList.toggle("is-hidden", isBrainstorm);
  document.querySelector("#processThoughtButton").textContent = "Save";
  document.querySelector("#clearThoughtButton").textContent = "Clear";
  if (isBrainstorm) renderBrainstormChat();
}

function setMemoryMode(mode) {
  state.memoryMode = mode;
  document.querySelectorAll(".dashboard-card").forEach((card) => card.classList.remove("is-active"));
  if (mode === "curiosity") {
    document.querySelector("#curiosityMetricButton").classList.add("is-active");
  } else if (mode === "saved") {
    document.querySelector("#savedQuestionsMetricButton").classList.add("is-active");
  } else {
    document.querySelector("#thoughtsMetricButton").classList.add("is-active");
  }
  renderBoard();
}

function openSparkPrompt() {
  elements.sparkPromptPanel.classList.remove("is-hidden");
  if (!state.activeSparkQuestion) requestSparkQuestion();
  else renderSparkQuestion();
}

function closeSparkPrompt() {
  elements.sparkPromptPanel.classList.add("is-hidden");
}

function nextSparkQuestion() {
  requestSparkQuestion();
}

function renderSparkQuestion() {
  elements.sparkQuestionText.textContent = state.activeSparkQuestion || localizedText({
    en: "What conversation would become more honest if you asked one better question?",
    id: "Obrolan apa yang bisa jadi lebih jujur kalau kamu berani bertanya sedikit lebih dalam?"
  });
}

function localizedText(values) {
  return values.en;
}

function contextKey() {
  return state.language === "id" ? "indonesian" : "global";
}

function pickUnusedItem(items, bucketName) {
  if (!Array.isArray(items) || !items.length) return null;
  const used = state.usedContentIds[bucketName] || [];
  const available = items.filter((item) => !used.includes(item.id));
  const pool = available.length ? available : items;
  if (!available.length) state.usedContentIds[bucketName] = [];
  const item = pool[Math.floor(Math.random() * pool.length)];
  if (item?.id) {
    state.usedContentIds[bucketName] = unique([...(state.usedContentIds[bucketName] || []), item.id]);
  }
  return item || null;
}

function pickLocalSparkQuestion() {
  const items = state.questionBank?.spark?.[contextKey()] || [];
  return pickUnusedItem(items, "spark")?.question || "";
}

function pickLocalScenario() {
  const items = state.questionBank?.scenarios?.[contextKey()] || [];
  const item = pickUnusedItem(items, "scenario");
  if (!item) return null;
  return {
    type: item.type || "Casual",
    text: item.text,
    better: Array.isArray(item.better) ? item.better.slice(0, 3) : []
  };
}

function localTriviaFacts() {
  const facts = Array.isArray(state.triviaBank?.facts) ? state.triviaBank.facts : [];
  if (!facts.length) return [];
  const picked = [];
  while (picked.length < Math.min(4, facts.length)) {
    const item = pickUnusedItem(facts, "trivia");
    if (!item || picked.some((fact) => fact.id === item.id)) break;
    picked.push(item);
  }
  return picked.length ? picked : facts.slice(0, 4);
}

function startVoiceCapture(target, button) {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) {
    showToast(localizedText({
      en: "Voice input is not supported in this browser.",
      id: "Input suara belum didukung di browser ini."
    }));
    return;
  }

  if (state.recognition) {
    state.recognition.stop();
    return;
  }

  const recognition = new Recognition();
  state.recognition = recognition;
  state.activeVoiceButton = button;
  button.classList.add("is-listening");
  recognition.lang = state.language === "id" ? "id-ID" : "en-US";
  recognition.interimResults = false;
  recognition.continuous = false;

  recognition.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map((result) => result[0]?.transcript || "")
      .join(" ")
      .trim();
    if (!transcript) return;
    const existing = target.value.trim();
    target.value = existing ? `${existing} ${transcript}` : transcript;
    target.focus();
  };

  recognition.onerror = () => {
    showToast(localizedText({
      en: "Voice capture failed. Check microphone permission.",
      id: "Input suara gagal. Cek izin mikrofon."
    }));
  };

  recognition.onend = () => {
    button.classList.remove("is-listening");
    state.recognition = null;
    state.activeVoiceButton = null;
  };

  recognition.start();
  showToast(localizedText({ en: "Listening...", id: "Mendengarkan..." }));
}

async function postJson(url, payload) {
  if (window.location.protocol !== "http:" && window.location.protocol !== "https:") return null;
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) return null;
  return response.json().catch(() => null);
}

async function analyzeThoughtWithAI(raw, source) {
  try {
    const result = await postJson("/api/ai/analyze-thought", {
      raw,
      source,
      language: state.language
    });
    if (!result || result.fallback) return null;
    return {
      title: String(result.title || "").slice(0, 80),
      summary: String(result.summary || "").slice(0, 280),
      tags: Array.isArray(result.tags) ? result.tags.slice(0, 5).map(String) : [],
      category: String(result.category || "Reflection")
    };
  } catch {
    return null;
  }
}

async function requestSparkQuestion() {
  elements.sparkQuestionText.textContent = localizedText({
    en: "Finding a fresh question...",
    id: "Mencari pertanyaan baru..."
  });
  const localQuestion = pickLocalSparkQuestion();
  if (localQuestion) {
    state.activeSparkQuestion = localQuestion;
    renderSparkQuestion();
    return;
  }
  try {
    const result = await postJson("/api/ai/question", {
      type: "spark",
      language: state.language
    });
    state.activeSparkQuestion = result?.question || fallbackSparkQuestion();
  } catch {
    state.activeSparkQuestion = fallbackSparkQuestion();
  }
  renderSparkQuestion();
}

async function brainstormQuestionWithAI(entry) {
  const localQuestion = brainstormQuestionFromBank(entry);
  if (localQuestion) return localQuestion;
  try {
    const messages = brainstormMessages(entry);
    const result = await postJson("/api/ai/brainstorm", {
      language: state.language,
      messages
    });
    return result?.question ? String(result.question).trim() : "";
  } catch {
    return "";
  }
}

function brainstormMessages(entry) {
  const messages = [{ role: "user", content: getInitialThought(entry.raw) }];
  (entry.followUps || []).forEach((item) => {
    messages.push({ role: "assistant", content: item.question });
    messages.push({ role: "user", content: item.reply });
  });
  return messages;
}

async function loadTrivia() {
  elements.triviaFeed.innerHTML = `
    <section class="empty-state">
      <strong>Finding a fresh fact</strong>
      <span>Using your local knowledge bank.</span>
    </section>
  `;
  const localFacts = localTriviaFacts();
  if (localFacts.length) {
    state.trivia = localFacts;
    state.triviaIndex = 0;
    renderTrivia();
    return;
  }
  try {
    const result = await postJson("/api/ai/trivia", {
      language: state.language
    });
    state.trivia = Array.isArray(result?.facts) && result.facts.length
      ? result.facts
      : fallbackTriviaFacts();
  } catch {
    state.trivia = fallbackTriviaFacts();
  }
  state.triviaIndex = 0;
  renderTrivia();
}

function nextTriviaFact() {
  const facts = getVisibleTriviaFacts();
  if (!facts.length || state.triviaIndex >= facts.length - 1) {
    loadTrivia();
    return;
  }
  state.triviaIndex += 1;
  renderTrivia();
}

function renderTrivia() {
  const visibleFacts = getVisibleTriviaFacts();
  if (!visibleFacts.length) {
    elements.triviaFeed.innerHTML = `
      <section class="empty-state">
        <strong>No fact found.</strong>
        <span>Try another format or tap Next Fact again.</span>
      </section>
    `;
    return;
  }
  const fact = visibleFacts[state.triviaIndex % visibleFacts.length];
  elements.triviaFeed.innerHTML = factCardHtml(fact);
}

function getVisibleTriviaFacts() {
  return state.trivia;
}

function factCardHtml(fact) {
  const links = Array.isArray(fact.links) ? fact.links.slice(0, 3) : [];
  const explanation = trimWords(fact.explanation || [fact.context, fact.whyUseful].filter(Boolean).join(" "), 145);
  const statement = fact.statement || fact.fact || fact.title || "A tiny fact can change how you see the day.";
  const primaryLink = links.find((link) => link.url) || null;
  return `
    <article class="fact-card">
      <div class="fact-body">
        <h3>${escapeHtml(fact.title || "Today’s fact")}</h3>
        <p class="fact-statement">${escapeHtml(statement)}</p>
        <p class="fact-explanation">${escapeHtml(explanation)}</p>
        ${primaryLink ? `<a class="read-more-button" href="${escapeHtml(primaryLink.url)}" rel="noreferrer">Read more</a>` : ""}
      </div>
    </article>
  `;
}

async function saveThought() {
  const text = elements.thoughtInput.value.trim();
  if (!text) {
    showToast("Failed: add a thought first.");
    return;
  }

  const raw = composeThoughtRaw(text);
  const entry = await createEntryFromAI(raw, "Thoughts");
  saveEntry(entry);
  resetThoughtComposer(false);
  showToast("saved");
  attemptNotionSync(entry);
}

function resetThoughtComposer(focus = false) {
  elements.thoughtInput.value = "";
  if (focus) elements.thoughtInput.focus();
}

function startNewSession() {
  state.currentTopicId = null;
  state.currentFollowUp = "";
  elements.brainstormInput.value = "";
  renderBrainstormChat();
  elements.brainstormInput.focus();
  showToast("New session started.");
}

async function sendBrainstormMessage() {
  const text = elements.brainstormInput.value.trim();
  if (!text) {
    showToast("Failed: add a message first.");
    return;
  }

  if (!state.currentTopicId) {
    const entry = await createEntryFromAI(composeThoughtRaw(text), "Brainstorm");
    state.currentTopicId = entry.id;
    state.currentFollowUp = await generateFollowUp(entry);
    saveEntry(entry);
    elements.brainstormInput.value = "";
    renderBrainstormChat(entry);
    showToast("saved");
    attemptNotionSync(entry);
    return;
  }

  const entry = getCurrentTopic();
  if (!entry) return;
  const question = state.currentFollowUp || await generateFollowUp(entry);
  entry.followUps = entry.followUps || [];
  entry.followUps.push({
    question,
    reply: text,
    createdAt: new Date().toISOString()
  });
  entry.raw = `${entry.raw}\n\nFollow-up: ${question}\nReply: ${text}`;
  const analysis = analyzeThought(entry.raw);
  entry.title = analysis.title;
  entry.summary = analysis.summary;
  entry.tags = analysis.tags;
  entry.category = analysis.category;
  state.currentFollowUp = await generateFollowUp(entry);
  elements.brainstormInput.value = "";
  persistEntries();
  renderAll();
  renderBrainstormChat(entry);
  showToast("saved");
  attemptNotionSync(entry);
}

function getCurrentTopic() {
  return state.entries.find((entry) => entry.id === state.currentTopicId) || null;
}

function composeThoughtRaw(text) {
  const sparkText = elements.sparkPromptPanel.classList.contains("is-hidden")
    ? ""
    : elements.sparkQuestionText.textContent.trim();
  return sparkText ? `Spark: ${sparkText}\n\nThought: ${text}` : text;
}

function renderBrainstormChat(entry = getCurrentTopic()) {
  if (!entry) {
    elements.brainstormChat.classList.add("is-empty");
    elements.brainstormChat.innerHTML = "";
    return;
  }

  elements.brainstormChat.classList.remove("is-empty");
  const currentQuestion = state.currentFollowUp || generateFollowUpFallback(entry);
  state.currentFollowUp = currentQuestion;
  const followUps = entry.followUps || [];
  elements.brainstormChat.innerHTML = `
    ${conversationSummaryHtml(entry, currentQuestion)}
    <div class="chat-bubble user-bubble">${escapeHtml(getInitialThought(entry.raw))}</div>
    ${followUps.map((item) => `
      <div class="chat-bubble system-bubble">${escapeHtml(item.question)}</div>
      <div class="chat-bubble user-bubble">${escapeHtml(item.reply)}</div>
    `).join("")}
    <div class="chat-bubble system-bubble">${escapeHtml(currentQuestion)}</div>
  `;
  window.requestAnimationFrame(() => {
    elements.brainstormChat.scrollTop = elements.brainstormChat.scrollHeight;
  });
}

function getInitialThought(raw) {
  const withoutSpark = String(raw).replace(/^Spark:\s*.*?\n\nThought:\s*/is, "");
  return normalizeSpace(withoutSpark.split(/\n\nFollow-up:/i)[0] || withoutSpark);
}

function conversationSummaryHtml(entry, currentQuestion) {
  const followUps = entry.followUps || [];
  return `
    <details class="conversation-summary">
      <summary>Summary</summary>
      <div class="summary-thread">
        <div class="summary-pair">
          <strong>[opening]</strong>
          <p>${escapeHtml(getInitialThought(entry.raw))}</p>
        </div>
        ${followUps.map((item, index) => `
          <div class="summary-pair">
            <strong>[q${index + 1}]</strong>
            <p>${escapeHtml(item.question)}</p>
            <strong>[answer ${index + 1}]</strong>
            <p>${escapeHtml(item.reply)}</p>
          </div>
        `).join("")}
        <div class="summary-pair">
          <strong>[q${followUps.length + 1}]</strong>
          <p>${escapeHtml(currentQuestion)}</p>
        </div>
      </div>
    </details>
  `;
}

function createEntry(raw, source) {
  const analysis = analyzeThought(raw);
  return entryFromAnalysis(raw, source, analysis);
}

async function createEntryFromAI(raw, source) {
  return entryFromAnalysis(raw, source, analyzeThought(raw));
}

function entryFromAnalysis(raw, source, analysis) {
  return {
    id: crypto.randomUUID(),
    raw,
    source,
    title: analysis.title || "Untitled Thought",
    summary: analysis.summary || summarize(raw),
    tags: Array.isArray(analysis.tags) && analysis.tags.length ? analysis.tags : ["Reflection"],
    category: analysis.category || "Reflection",
    syncState: "Synced",
    followUps: [],
    usedQuestionIds: {},
    createdAt: new Date().toISOString()
  };
}

function analyzeThought(text) {
  const keywords = extractKeywords(text);
  const tags = inferTags(text, keywords);
  const category = tags[0] || "Reflection";
  return {
    title: makeTitle(keywords, category),
    summary: summarize(text),
    tags,
    category
  };
}

function summarize(text) {
  const source = text.replace(/^Spark:\s*.*?\n\nThought:\s*/is, "");
  const cleaned = normalizeSpace(source);
  const sentences = cleaned.match(/[^.!?]+[.!?]?/g) || [cleaned];
  const first = normalizeSpace(sentences[0] || cleaned);
  const second = normalizeSpace(sentences[1] || "");
  const base = second && first.length < 110 ? `${first} ${second}` : first;
  const words = base.split(/\s+/).filter(Boolean);
  if (words.length <= 30) return base;
  return `${words.slice(0, 30).join(" ")}...`;
}

function makeTitle(keywords, category) {
  const words = keywords
    .filter((item) => item.word.length > 3)
    .slice(0, 3)
    .map((item) => toTitleCase(item.word));

  const fallbacks = category.split(/\s+/).concat(["Insight", "Note"]);
  while (words.length < 3) {
    const next = fallbacks.shift() || "Reflection";
    if (!words.includes(next)) words.push(next);
  }
  return words.slice(0, 3).join(" ");
}

function inferTags(text, keywords) {
  const haystack = ` ${text.toLowerCase()} ${keywords.map((item) => item.word).join(" ")} `;
  const scored = categoryRules.map((rule) => {
    const score = rule.words.reduce((total, word) => {
      return total + (haystack.includes(` ${word} `) ? 1 : 0);
    }, 0);
    return { name: rule.name, score };
  });

  const tags = scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.name);

  if (!tags.length) tags.push("Reflection");
  if (keywords.some((item) => ["question", "questions", "curiosity", "conversation", "conversations"].includes(item.word))) {
    tags.push("Curiosity");
  }
  return unique(tags).slice(0, 4);
}

function extractKeywords(text) {
  const counts = new Map();
  const words = text.toLowerCase().match(/[a-z0-9']+/g) || [];
  words.forEach((word) => {
    const trimmed = word.replace(/^'+|'+$/g, "");
    if (trimmed.length < 3 || stopWords.has(trimmed)) return;
    counts.set(trimmed, (counts.get(trimmed) || 0) + 1);
  });
  return Array.from(counts, ([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count || b.word.length - a.word.length)
    .slice(0, 8);
}

async function generateFollowUp(entry) {
  const aiQuestion = await brainstormQuestionWithAI(entry);
  if (aiQuestion) return aiQuestion;
  return generateFollowUpFallback(entry);
}

function generateFollowUpFallback(entry) {
  const bankQuestion = brainstormQuestionFromBank(entry);
  if (bankQuestion) return bankQuestion;
  if (state.language === "id") {
    const latestMessage = getLatestUserMessage(entry);
    const focus = extractFocusPhrase(latestMessage);
    const pool = [
      "Bagian mana dari pikiran ini yang paling ingin kamu pahami lebih jujur?",
      "Kalau ini terjadi di hidup sehari-hari kamu, pola apa yang sedang muncul?",
      "Apa yang terasa paling Indonesia dari konteks ini: keluarga, kerja, gengsi, agama, atau lingkungan sosial?",
      "Apa pertanyaan yang sebenarnya kamu hindari dari topik ini?"
    ];
    const base = pool[Math.floor(Math.random() * pool.length)];
    return focus ? `Kalau fokusnya ${focus}, apa yang paling perlu kamu tanyakan ke diri sendiri?` : base;
  }
  const latestMessage = getLatestUserMessage(entry);
  const intent = inferMentorIntent(latestMessage, entry);
  const focus = extractFocusPhrase(latestMessage);
  const question = pickMentorQuestion(intent, entry);
  if (!focus) return question;
  return personalizeQuestion(question, focus, intent.name);
}

function brainstormQuestionFromBank(entry) {
  const latestMessage = getLatestUserMessage(entry);
  const intent = inferMentorIntent(latestMessage, entry);
  const prompts = state.questionBank?.mentorPrompts?.[contextKey()]?.[intent.name] || [];
  if (!prompts.length) return "";
  const bucketName = `${contextKey()}-${intent.name}`;
  const used = state.usedContentIds.mentor[bucketName] || [];
  const available = prompts.filter((question) => !used.includes(question));
  const pool = available.length ? available : prompts;
  if (!available.length) state.usedContentIds.mentor[bucketName] = [];
  const question = pool[Math.floor(Math.random() * pool.length)];
  state.usedContentIds.mentor[bucketName] = unique([...(state.usedContentIds.mentor[bucketName] || []), question]);
  return question;
}

function pickMentorQuestion(intent, entry) {
  entry.usedQuestionIds = entry.usedQuestionIds || {};
  const poolName = intent.name;
  const used = Array.isArray(entry.usedQuestionIds[poolName])
    ? entry.usedQuestionIds[poolName].filter((index) => index >= 0 && index < intent.questions.length)
    : [];
  if (used.length >= intent.questions.length) used.length = 0;

  const available = intent.questions
    .map((_, index) => index)
    .filter((index) => !used.includes(index));
  const nextIndex = available[Math.floor(Math.random() * available.length)];
  used.push(nextIndex);
  entry.usedQuestionIds[poolName] = used;
  return intent.questions[nextIndex];
}

function getLatestUserMessage(entry) {
  const followUps = entry.followUps || [];
  const lastReply = followUps[followUps.length - 1]?.reply;
  return lastReply || getInitialThought(entry.raw);
}

function inferMentorIntent(message, entry) {
  const latestHaystack = message.toLowerCase();
  const latestMatch = mentorIntents.find((intent) => {
    return intent.words.some((word) => latestHaystack.includes(word));
  });
  if (latestMatch) return latestMatch;

  const contextHaystack = entry.raw.toLowerCase();
  return mentorIntents.find((intent) => {
    return intent.words.some((word) => contextHaystack.includes(word));
  }) || mentorIntents[mentorIntents.length - 1];
}

function extractFocusPhrase(message) {
  const cleaned = normalizeSpace(message).replace(/[.?!]+$/g, "");
  const causeMatch = cleaned.match(/\b(?:because|since)\s+([^.!?]{4,90})/i);
  if (causeMatch) return trimWords(causeMatch[1], 9);

  const desireMatch = cleaned.match(/\b(?:i want to|i wanna|i need to|i am trying to|i'm trying to|i keep)\s+([^.!?]{4,90})/i);
  if (desireMatch) return trimWords(desireMatch[1], 9);

  const keywords = extractKeywords(cleaned)
    .filter((item) => item.word.length > 3)
    .slice(0, 3)
    .map((item) => item.word);
  return keywords.length ? keywords.join(" / ") : "";
}

function personalizeQuestion(question, focus, intentName) {
  const cleanFocus = focus.replace(/^["']|["']$/g, "");
  if (intentName === "avoidance") {
    return `What are you protecting yourself from around ${cleanFocus}?`;
  }
  if (intentName === "ambition") {
    return `What part of ${cleanFocus} feels alive and true, and what part feels like pressure to prove something?`;
  }
  if (intentName === "emotion") {
    return `When ${cleanFocus} shows up, what does it seem to be asking you to notice?`;
  }
  if (intentName === "relationship") {
    return `What do you want the other person to understand about ${cleanFocus}?`;
  }
  if (intentName === "clarity") {
    return `What would become clearer if you named the real question inside ${cleanFocus}?`;
  }
  return question;
}

function evaluateQuestion(question, scenario) {
  const q = question.trim();
  const lower = q.toLowerCase();
  const words = lower.match(/[a-z0-9']+/g) || [];

  const startsOpen = /^(what|how|why|when|where|which|tell me|could you|can you describe|what led)/i.test(lower);
  const startsClosed = /^(do|does|did|is|are|was|were|will|would|should|can you|could you)\b/i.test(lower) && !/describe|tell|walk|share/i.test(lower);
  const referencesFeeling = /(feel|feeling|meaning|matter|important|changed|behind|led|notice|hope|worry|relief|hard|missing|fuzzy|value)/i.test(lower);
  const givesAdvice = /(you should|you need to|just|why don't you|have you tried|at least)/i.test(lower);
  const asksMultiple = (q.match(/\?/g) || []).length > 1;
  const scenarioWords = extractKeywords(scenario.text).map((item) => item.word);
  const referencesScenario = scenarioWords.some((word) => lower.includes(word));

  const openness = clamp((startsOpen ? 86 : 52) - (startsClosed ? 18 : 0) - (asksMultiple ? 8 : 0), 30, 98);
  const depth = clamp((referencesFeeling ? 86 : 56) + (referencesScenario ? 8 : 0), 30, 98);
  const care = clamp((givesAdvice ? 48 : 82) + (/\byou\b|\byour\b/.test(lower) ? 6 : 0), 30, 98);
  const brevity = words.length >= 7 && words.length <= 22 ? 4 : -5;
  const score = clamp(Math.round((openness + depth + care) / 3 + brevity), 20, 98);

  let critique = "This question gives the other person room to answer honestly.";
  if (startsClosed) critique = "It may close the conversation too quickly because the other person can answer yes or no.";
  else if (!referencesFeeling) critique = "It is clear, but it can go deeper by asking about motive, emotion, change, or meaning.";
  else if (givesAdvice) critique = "It starts to sound like advice, which can make the other person defend their choice.";
  else if (asksMultiple) critique = "There are multiple questions inside it, so the other person may not know which one to answer first.";

  const impact = givesAdvice
    ? "Impact: they may feel evaluated instead of understood."
    : startsClosed
      ? "Impact: they may give a short answer and stop exploring."
      : "Impact: they are more likely to feel listened to and continue sharing.";

  return {
    score,
    aspects: [
      { name: "Openness", score: openness },
      { name: "Depth", score: depth },
      { name: "Care", score: care }
    ],
    critique,
    impact,
    better: scenario.better
  };
}

async function evaluateQuestionWithAI(question, scenario) {
  try {
    const result = await postJson("/api/ai/evaluate", {
      language: state.language,
      scenario: scenario?.text || "",
      question
    });
    if (!result || result.fallback) return null;
    const aspects = Array.isArray(result.aspects) ? result.aspects.slice(0, 3) : [];
    return {
      score: clamp(Number(result.score || 0), 0, 100),
      aspects: aspects.length === 3
        ? aspects.map((item) => ({
          name: String(item.name || "Aspect"),
          score: clamp(Number(item.score || 0), 0, 100)
        }))
        : evaluateQuestion(question, scenario).aspects,
      critique: String(result.critique || "").slice(0, 260),
      impact: String(result.impact || "").slice(0, 260),
      better: Array.isArray(result.better) && result.better.length
        ? result.better.slice(0, 3).map(String)
        : scenario.better
    };
  } catch {
    return null;
  }
}

async function pickScenario() {
  elements.scenarioText.textContent = localizedText({
    en: "Writing a new story...",
    id: "Menulis skenario baru..."
  });
  elements.scenarioType.textContent = localizedText({ en: "Loading", id: "Memuat" });
  state.activeScenario = pickLocalScenario() || await requestScenario() || fallbackScenario();
  elements.scenarioText.textContent = state.activeScenario.text;
  elements.scenarioType.textContent = state.activeScenario.type;
  elements.questionInput.value = "";
  resetRoleplay(false);
  elements.questionFeedback.className = "empty-state";
  elements.questionFeedback.innerHTML = localizedText({
    en: "<strong>No feedback yet.</strong><span>Send a question to review openness, depth, and care.</span>",
    id: "<strong>Belum ada feedback.</strong><span>Kirim pertanyaan untuk menilai keterbukaan, kedalaman, dan empati.</span>"
  });
}

async function requestScenario() {
  try {
    const result = await postJson("/api/ai/question", {
      type: "scenario",
      language: state.language
    });
    if (!result || result.fallback || !result.text) return null;
    return {
      type: String(result.type || "Casual"),
      text: String(result.text),
      better: Array.isArray(result.better) && result.better.length
        ? result.better.slice(0, 3).map(String)
        : fallbackScenario().better
    };
  } catch {
    return null;
  }
}

async function roleplayWithAI(messages) {
  try {
    const result = await postJson("/api/ai/roleplay", {
      language: state.language,
      scenario: state.activeScenario?.text || "",
      messages
    });
    if (!result || result.fallback) return null;
    return {
      reply: String(result.reply || "").slice(0, 320),
      coachTip: String(result.coachTip || "").slice(0, 220)
    };
  } catch {
    return null;
  }
}

async function sendRoleplayMessage() {
  const text = elements.roleplayInput.value.trim();
  if (!text) {
    showToast("Failed: add a question first.");
    return;
  }

  state.roleplayMessages.push({
    role: "user",
    content: text,
    createdAt: new Date().toISOString()
  });
  elements.roleplayInput.value = "";
  renderRoleplayThread(true);

  const result = fallbackRoleplayReply(text);
  state.roleplayMessages.push({
    role: "assistant",
    content: result.reply,
    coachTip: result.coachTip,
    createdAt: new Date().toISOString()
  });
  renderRoleplayThread();
}

function resetRoleplay(focus = true) {
  state.roleplayMessages = [];
  elements.roleplayInput.value = "";
  renderRoleplayThread();
  if (focus) elements.roleplayInput.focus();
}

function renderRoleplayThread(isLoading = false) {
  const starter = localizedText({
    en: "Use the same scenario, but practice a short back-and-forth. This will not replace the scored single-question flow.",
    id: "Pakai skenario yang sama untuk latihan percakapan singkat. Ini tidak menggantikan mode skor satu pertanyaan."
  });
  const messagesHtml = state.roleplayMessages.map((message) => {
    if (message.role === "user") {
      return `<div class="chat-bubble user-bubble">${escapeHtml(message.content)}</div>`;
    }
    return `
      <div class="chat-bubble system-bubble">${escapeHtml(message.content)}</div>
      ${message.coachTip ? `<p class="coach-tip">${escapeHtml(message.coachTip)}</p>` : ""}
    `;
  }).join("");
  elements.roleplayThread.innerHTML = `
    <div class="roleplay-context">${escapeHtml(starter)}</div>
    ${messagesHtml}
    ${isLoading ? `<div class="chat-bubble system-bubble">${escapeHtml(localizedText({ en: "Thinking of a realistic reply...", id: "Menyusun balasan yang realistis..." }))}</div>` : ""}
  `;
  window.requestAnimationFrame(() => {
    elements.roleplayThread.scrollTop = elements.roleplayThread.scrollHeight;
  });
}

function fallbackRoleplayReply(text) {
  const asksWhy = /\bwhy\b|\bkenapa\b|\bmengapa\b/i.test(text);
  if (state.language === "id") {
    return {
      reply: asksWhy
        ? "Kayaknya aku menghindari pertanyaan itu karena jawaban jujurnya agak berantakan."
        : "Itu pertanyaan bagus. Kayaknya bagian yang belum aku omongin justru yang paling berat.",
      coachTip: "Coba bertahan di satu perasaan atau titik perubahan sebelum masuk ke saran."
    };
  }
  return {
    reply: asksWhy
      ? "I guess I have been avoiding that question because the honest answer feels a bit messy."
      : "That is a good question. I think the part I have not said out loud is what feels hardest.",
    coachTip: "Try staying with one feeling or turning point before moving to advice."
  };
}

async function sendPracticeQuestion() {
  const question = elements.questionInput.value.trim();
  if (!question) {
    showToast("Failed: add a question first.");
    return;
  }

  const result = evaluateQuestion(question, state.activeScenario);
  state.practice.history.unshift({
    id: crypto.randomUUID(),
    scenario: state.activeScenario.text,
    question,
    score: result.score,
    aspects: result.aspects,
    critique: result.critique,
    impact: result.impact,
    createdAt: new Date().toISOString()
  });
  state.practice.attempts = state.practice.history.length;
  state.practice.lastScore = result.score;
  savePractice();
  renderQuestionFeedback(result);
  renderAll();
  showToast("Success");
}

function renderQuestionFeedback(result) {
  elements.questionFeedback.classList.remove("empty-state");
  elements.questionFeedback.innerHTML = `
    <div class="feedback-copy">
      <div class="aspect-grid">
        ${result.aspects.map(aspectRowHtml).join("")}
      </div>
      <p><strong>Critique:</strong> ${escapeHtml(result.critique)}</p>
      <p><strong>Likely impact:</strong> ${escapeHtml(result.impact.replace(/^Impact:\s*/i, ""))}</p>
      <div>
        <p><strong>Try these instead:</strong></p>
        <ol class="suggestion-list">
          ${result.better.map((item) => `
            <li>
              <span>${escapeHtml(item)}</span>
              ${savedToggleButtonHtml(item)}
            </li>
          `).join("")}
        </ol>
      </div>
      <button class="primary-button" type="button" data-feedback-new-scenario>New scenario</button>
    </div>
  `;
}

function savedToggleButtonHtml(question) {
  const saved = isQuestionSaved(question);
  return `
    <button class="wishlist-button ${saved ? "is-saved" : ""}" type="button" data-toggle-save-question="${escapeHtml(question)}" aria-label="${saved ? "Remove saved question" : "Save question"}">
      ${saved ? "-" : "+"}
    </button>
  `;
}

function aspectRowHtml(aspect) {
  return `
    <div class="aspect-row">
      <span>${escapeHtml(aspect.name)}</span>
      <div class="aspect-track" aria-hidden="true"><span style="--value: ${aspect.score}%"></span></div>
      <strong>${aspect.score}</strong>
    </div>
  `;
}

function toggleSavedQuestion(question, button) {
  if (isQuestionSaved(question)) {
    removeSavedQuestion(question, { silent: true });
    updateWishlistButton(button, false);
    showToast("Question removed.");
    return;
  }
  saveQuestionToLibrary(question);
  updateWishlistButton(button, true);
}

function updateWishlistButton(button, saved) {
  if (!button) return;
  button.textContent = saved ? "-" : "+";
  button.classList.toggle("is-saved", saved);
  button.setAttribute("aria-label", saved ? "Remove saved question" : "Save question");
}

function isQuestionSaved(question) {
  const clean = normalizeSpace(question).toLowerCase();
  return state.savedQuestions.some((item) => item.question.toLowerCase() === clean);
}

function saveQuestionToLibrary(question) {
  const clean = normalizeSpace(question);
  if (!clean) return;
  if (isQuestionSaved(clean)) {
    showToast("Already saved.");
    return;
  }
  state.savedQuestions.unshift({
    id: crypto.randomUUID(),
    question: clean,
    createdAt: new Date().toISOString()
  });
  state.savedQuestions = state.savedQuestions.slice(0, 24);
  persistSavedQuestions();
  renderAll();
  showToast("Question saved.");
}

function removeSavedQuestion(question, options = {}) {
  const clean = normalizeSpace(question).toLowerCase();
  state.savedQuestions = state.savedQuestions.filter((item) => item.question.toLowerCase() !== clean);
  persistSavedQuestions();
  renderAll();
  if (!options.silent) showToast("Question removed.");
}

function renderAll() {
  renderMetrics();
  renderBoard();
  renderPersonalInsight();
}

function renderMetrics() {
  const filteredEntries = getFilteredEntries();
  const filteredPractice = getFilteredPractice();
  const today = new Date().toDateString();
  const todayCount = state.entries.filter((entry) => new Date(entry.createdAt).toDateString() === today).length;
  const counts = countBy(filteredEntries, "category");
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  const averageScore = filteredPractice.length
    ? Math.round(filteredPractice.reduce((total, item) => total + item.score, 0) / filteredPractice.length)
    : 0;

  elements.todayCount.textContent = String(todayCount);
  elements.totalEntries.textContent = String(filteredEntries.length);
  elements.practiceAttempts.textContent = `${averageScore}%`;
  elements.practiceHelper.textContent = `total ${filteredPractice.length} ${filteredPractice.length === 1 ? "rep" : "reps"}`;
  elements.savedQuestionCount.textContent = String(state.savedQuestions.length);
  elements.topCategory.textContent = top ? top[0] : "None";
  elements.localSaveCount.textContent = `${state.entries.length} ${state.entries.length === 1 ? "entry" : "entries"}`;
}

function renderPersonalInsight() {
  const weeklyEntries = state.entries.filter((entry) => isInsideLastDays(entry.createdAt, 7));
  const weeklyPractice = state.practice.history.filter((item) => isInsideLastDays(item.createdAt, 7));
  const averageScore = weeklyPractice.length
    ? Math.round(weeklyPractice.reduce((total, item) => total + item.score, 0) / weeklyPractice.length)
    : 0;
  const topCategory = elements.topCategory.textContent === "None" ? "reflection" : elements.topCategory.textContent.toLowerCase();
  const note = weeklyEntries.length || weeklyPractice.length
    ? `You saved ${weeklyEntries.length} ${weeklyEntries.length === 1 ? "thought" : "thoughts"} and practiced ${weeklyPractice.length} ${weeklyPractice.length === 1 ? "question" : "questions"} this week. ${averageScore ? `Your curiosity average is ${averageScore}%. ` : ""}Your mind keeps circling ${topCategory}, and that is useful signal.`
    : "Start with one thought or one scored question today. Tiny honest reps count.";

  elements.personalInsight.innerHTML = `
    <div>
      <span class="insight-label">For you, Lala ✨</span>
      <strong>Hi Lala, you're doing great.</strong>
      <p>${escapeHtml(note)}</p>
    </div>
  `;
}

function useSavedQuestionForThoughts(question) {
  const clean = normalizeSpace(question);
  if (!clean) return;
  state.activeSparkQuestion = clean;
  renderSparkQuestion();
  showView("capture");
  openSparkPrompt();
  const target = state.thoughtMode === "quick" ? elements.thoughtInput : elements.brainstormInput;
  window.requestAnimationFrame(() => target.focus());
  showToast("Question opened in Thoughts.");
}

function renderBoard() {
  if (state.memoryMode === "curiosity") {
    renderCuriosityMemory();
    return;
  }
  if (state.memoryMode === "saved") {
    renderSavedQuestionMemory();
    return;
  }
  renderThoughtMemory();
}

function renderSavedQuestionMemory() {
  elements.boardColumns.className = "history-view";
  if (!state.savedQuestions.length) {
    elements.boardColumns.innerHTML = `
      <section class="history-panel">
        <h3>Saved questions 📝</h3>
        <p>No saved questions yet. Tap + on a Practice suggestion to keep it here.</p>
      </section>
    `;
    return;
  }

  elements.boardColumns.innerHTML = `
    <section class="history-panel">
      <h3>Saved questions 📝</h3>
      <div class="saved-question-list">
        ${state.savedQuestions.map((item) => `
          <article class="saved-question-card">
            <p>${escapeHtml(item.question)}</p>
            <div class="saved-question-actions">
              <button class="secondary-button icon-label-button danger" type="button" data-remove-saved-question="${escapeHtml(item.question)}">
                <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 15H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
                Remove
              </button>
              <button class="primary-button" type="button" data-discuss-question="${escapeHtml(item.question)}">Discuss This</button>
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderThoughtMemory() {
  const entries = getFilteredEntries().filter(matchesMemorySearch);
  if (!entries.length) {
    elements.boardColumns.innerHTML = `
      <section class="board-column">
        <h3>${state.memorySearch ? "Search" : "Thoughts"} <span>0</span></h3>
        <article class="entry-card starter-card">
          <header><h4>${state.memorySearch ? "No match yet" : "Capture your first thought"}</h4></header>
          <p>${state.memorySearch ? "Try another keyword, tag, category, or phrase." : "Save one raw idea and Daysprolartion will turn it into a topic you can keep exploring."}</p>
          <div class="tag-row"><span class="tag teal">Ready</span><span class="tag coral">Memory</span></div>
        </article>
      </section>
    `;
    return;
  }

  const grouped = entries.reduce((groups, entry) => {
    const key = entry.category || "Reflection";
    groups[key] = groups[key] || [];
    groups[key].push(entry);
    return groups;
  }, {});

  elements.boardColumns.className = "memory-content";
  elements.boardColumns.innerHTML = Object.entries(grouped)
    .sort((a, b) => b[1].length - a[1].length)
    .map(([category, groupEntries]) => `
      <section class="board-column">
        <h3>${escapeHtml(category)} <span>${groupEntries.length}</span></h3>
        ${groupEntries.map(entryCardHtml).join("")}
      </section>
    `)
    .join("");
}

function matchesMemorySearch(entry) {
  if (!state.memorySearch) return true;
  const haystack = [
    entry.title,
    entry.summary,
    entry.raw,
    entry.category,
    ...(entry.tags || [])
  ].join(" ").toLowerCase();
  return haystack.includes(state.memorySearch);
}

function renderCuriosityMemory() {
  const history = getFilteredPractice();
  const chartItems = history.slice(0, 8).reverse();
  elements.boardColumns.className = "history-view";
  elements.boardColumns.innerHTML = `
    <section class="history-panel">
      <h3>Historical progress</h3>
      <div class="line-chart" aria-label="Historical curiosity scores">
        ${
          chartItems.length
            ? lineChartHtml(chartItems)
            : "<p>No practice scores yet.</p>"
        }
      </div>
    </section>
    ${curiosityInsightHtml(history)}
    <section class="history-panel">
      <h3>Question history</h3>
      <div class="qna-list">
        ${
          history.length
            ? history.map(qnaCardHtml).join("")
            : "<p>No questions yet. Practice once to start your history.</p>"
        }
      </div>
    </section>
  `;
}

function curiosityInsightHtml(history) {
  if (!history.length) {
    return `
      <section class="history-panel">
        <h3>Score breakdown</h3>
        <p>No breakdown yet.</p>
      </section>
    `;
  }
  const average = Math.round(history.reduce((total, item) => total + item.score, 0) / history.length);
  const best = history.reduce((winner, item) => item.score > winner.score ? item : winner, history[0]);
  const aspectAverages = ["Openness", "Depth", "Care"].map((name) => {
    const values = history
      .map((item) => (item.aspects || []).find((aspect) => aspect.name === name)?.score)
      .filter((value) => Number.isFinite(value));
    const score = values.length ? Math.round(values.reduce((total, value) => total + value, 0) / values.length) : 0;
    return { name, score };
  });

  return `
    <section class="history-panel">
      <h3>Score breakdown</h3>
      <div class="insight-grid">
        <div><span>Average</span><strong>${average}</strong></div>
        <div><span>Best</span><strong>${best.score}</strong></div>
        <div><span>Total reps</span><strong>${history.length}</strong></div>
      </div>
      <div class="aspect-bars">
        ${aspectAverages.map((item) => `
          <div class="aspect-row">
            <span>${item.name}</span>
            <div class="aspect-track" aria-hidden="true"><span style="--value: ${item.score}%"></span></div>
            <strong>${item.score}</strong>
          </div>
        `).join("")}
      </div>
      ${scoreDistributionHtml(history)}
    </section>
  `;
}

function scoreDistributionHtml(history) {
  const buckets = [
    { label: "0-59", min: 0, max: 59 },
    { label: "60-79", min: 60, max: 79 },
    { label: "80-100", min: 80, max: 100 }
  ].map((bucket) => {
    const count = history.filter((item) => item.score >= bucket.min && item.score <= bucket.max).length;
    return { ...bucket, count };
  });
  const max = Math.max(1, ...buckets.map((bucket) => bucket.count));
  return `
    <div class="score-distribution" aria-label="Score distribution">
      ${buckets.map((bucket) => `
        <div>
          <span>${bucket.label}</span>
          <strong style="--value: ${(bucket.count / max) * 100}%">${bucket.count}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function lineChartHtml(items) {
  const width = 320;
  const height = 150;
  const left = 34;
  const right = 12;
  const top = 14;
  const bottom = 26;
  const chartWidth = width - left - right;
  const chartHeight = height - top - bottom;
  const points = items.map((item, index) => {
    const x = items.length === 1
      ? left + chartWidth / 2
      : left + (index / (items.length - 1)) * chartWidth;
    const y = top + ((100 - clamp(item.score, 0, 100)) / 100) * chartHeight;
    return { x, y, item };
  });
  const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");
  const latest = items[items.length - 1];

  return `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Curiosity score trend, latest score ${latest.score}">
      <line class="chart-grid" x1="${left}" y1="${top}" x2="${width - right}" y2="${top}"></line>
      <line class="chart-grid" x1="${left}" y1="${top + chartHeight / 2}" x2="${width - right}" y2="${top + chartHeight / 2}"></line>
      <line class="chart-grid" x1="${left}" y1="${top + chartHeight}" x2="${width - right}" y2="${top + chartHeight}"></line>
      <text class="chart-label" x="4" y="${top + 4}">100</text>
      <text class="chart-label" x="10" y="${top + chartHeight / 2 + 4}">50</text>
      <text class="chart-label" x="17" y="${top + chartHeight + 4}">0</text>
      <polyline class="score-line" points="${polyline}"></polyline>
      ${points.map((point) => `
        <circle class="score-point" cx="${point.x}" cy="${point.y}" r="4"></circle>
        <text class="score-value" x="${point.x}" y="${Math.max(12, point.y - 8)}">${point.item.score}</text>
      `).join("")}
    </svg>
  `;
}

function entryCardHtml(entry) {
  return `
    <article class="entry-card" role="button" tabindex="0" data-entry-id="${escapeHtml(entry.id)}" aria-label="Open thought: ${escapeHtml(entry.title)}">
      <header>
        <h4>${escapeHtml(entry.title)}</h4>
        <time datetime="${escapeHtml(entry.createdAt)}">${formatEntryTime(entry.createdAt)}</time>
      </header>
      <p>${escapeHtml(entry.summary)}</p>
      <div class="tag-row">
        ${entry.tags.slice(0, 3).map((tag, index) => `<span class="tag ${tagClass(index)}">${escapeHtml(tag)}</span>`).join("")}
      </div>
    </article>
  `;
}

function qnaCardHtml(item) {
  return `
    <article class="qna-card">
      <strong>${escapeHtml(item.score)} score</strong>
      <p>${escapeHtml(item.question)}</p>
      <p>${escapeHtml(item.critique)}</p>
    </article>
  `;
}

function openEntryModal(entryId) {
  const entry = state.entries.find((item) => item.id === entryId);
  if (!entry) return;
  elements.entryModalTitle.textContent = entry.title;
  elements.entryModalMeta.textContent = `${entry.category} - ${formatEntryTime(entry.createdAt)}`;
  elements.entryModalBody.innerHTML = `
    <p>${escapeHtml(entry.raw).replaceAll("\n", "<br>")}</p>
    <div class="tag-row">
      ${entry.tags.map((tag, index) => `<span class="tag ${tagClass(index)}">${escapeHtml(tag)}</span>`).join("")}
    </div>
  `;
  elements.entryModal.classList.remove("is-hidden");
  document.body.classList.add("modal-open");
  document.querySelector("#closeEntryModal").focus();
}

function closeEntryModal() {
  elements.entryModal.classList.add("is-hidden");
  document.body.classList.remove("modal-open");
}

function saveEntry(entry) {
  state.entries.unshift(entry);
  persistEntries();
  renderAll();
}

async function attemptNotionSync(entry) {
  if (window.location.protocol !== "http:" && window.location.protocol !== "https:") {
    return;
  }

  try {
    await fetch("/api/notion-sync", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(entry)
    });
    const stored = state.entries.find((item) => item.id === entry.id);
    if (!stored) return;
    stored.syncState = "Synced";
    stored.notionMessage = "Saved to Notion.";
    persistEntries();
  } catch {
    const stored = state.entries.find((item) => item.id === entry.id);
    if (stored) {
      stored.syncState = "Synced";
      persistEntries();
    }
  }
}

async function checkConnection() {
  elements.connectionStatus.textContent = "Connected";
  elements.currentMode.textContent = "Notion connected";
  elements.aiStatus.textContent = "Checking";
  elements.skillStatus.textContent = "Checking";
  if (window.location.protocol !== "http:" && window.location.protocol !== "https:") {
    elements.aiStatus.textContent = "Server needed";
    elements.skillStatus.textContent = "Server needed";
    return;
  }

  try {
    const response = await fetch("/api/health");
    const status = await response.json();
    elements.connectionStatus.textContent = status.notionConnected ? "Connected" : "Preview";
    elements.currentMode.textContent = status.notionConnected ? "Notion connected" : "Set Notion env vars on Render";
    elements.aiStatus.textContent = status.aiConnected ? `Smart mode available (${status.model})` : "No-API mode: local content bank";
    elements.skillStatus.textContent = status.skillLoaded ? "Loaded from prompts/SKILL.md" : "Missing prompts/SKILL.md";
  } catch {
    elements.aiStatus.textContent = "No-API mode";
    elements.skillStatus.textContent = "Unavailable";
  }
}

function getFilteredEntries() {
  return state.entries.filter((entry) => isInsidePeriod(entry.createdAt));
}

function getFilteredPractice() {
  return state.practice.history.filter((item) => isInsidePeriod(item.createdAt));
}

function isInsidePeriod(value) {
  if (state.activePeriod === "all") return true;
  const date = new Date(value);
  const days = state.activePeriod === "month" ? 30 : 7;
  return Date.now() - date.getTime() <= days * 86400000;
}

function isInsideLastDays(value, days) {
  const date = new Date(value);
  return Date.now() - date.getTime() <= days * 86400000;
}

function loadEntries() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function persistEntries() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.entries));
}

function loadPractice() {
  try {
    const stored = JSON.parse(localStorage.getItem(PRACTICE_KEY) || "{}");
    return {
      attempts: Number(stored.attempts || stored.history?.length || 0),
      lastScore: stored.lastScore || null,
      history: Array.isArray(stored.history) ? stored.history : []
    };
  } catch {
    return { attempts: 0, lastScore: null, history: [] };
  }
}

function savePractice() {
  localStorage.setItem(PRACTICE_KEY, JSON.stringify(state.practice));
}

function loadSavedQuestions() {
  try {
    const stored = JSON.parse(localStorage.getItem(SAVED_QUESTION_KEY) || "[]");
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function persistSavedQuestions() {
  localStorage.setItem(SAVED_QUESTION_KEY, JSON.stringify(state.savedQuestions));
}

function loadLanguage() {
  return localStorage.getItem(LANGUAGE_KEY) === "id" ? "id" : "en";
}

function fallbackSparkQuestion() {
  const pool = state.language === "id"
    ? [
      "Topik apa yang kamu hindari karena takut obrolannya jadi terlalu jujur?",
      "Kapan terakhir kamu merasa didengar, bukan cuma dijawab?",
      "Kalau hidupmu lagi jadi FYP, pola apa yang terlalu sering muncul?",
      "Tradisi keluarga apa yang kamu ikuti tanpa pernah benar-benar kamu pilih?"
    ]
    : sparkQuestions;
  return pool[Math.floor(Math.random() * pool.length)];
}

function fallbackScenario() {
  const pool = state.language === "id"
    ? [
      {
        type: "Casual",
        text: "Temanmu baru pulang kerja dan meletakkan tasnya di dekat pintu. Dia bilang, \"Aku capek pura-pura ambisius. Semua orang kayak lomba sukses, tapi aku bahkan belum yakin sukses versi aku itu apa.\"",
        better: [
          "Bagian mana dari ambisi itu yang terasa milik kamu, dan bagian mana yang terasa cuma ikut tekanan?",
          "Kapan kamu merasa paling jujur soal definisi suksesmu sendiri?",
          "Kalau tidak perlu kelihatan keren, apa yang sebenarnya ingin kamu bangun?"
        ]
      },
      {
        type: "Work",
        text: "Di chat grup kerja, seorang rekan bilang, \"Meeting tadi kelihatan rapi, tapi aku ngerasa semua orang setuju cuma biar cepat selesai. Aku takut masalah aslinya masih disembunyikan.\"",
        better: [
          "Bagian mana dari meeting tadi yang menurutmu masih belum berani kita omongin?",
          "Apa tanda kecil yang bikin kamu merasa ada masalah yang disembunyikan?",
          "Kalau kita ulang meeting itu, pertanyaan apa yang perlu muncul lebih awal?"
        ]
      }
    ]
    : scenarios;
  return pool[Math.floor(Math.random() * pool.length)];
}

function fallbackTriviaFacts() {
  if (state.language === "id") {
    return [
      {
        title: "Bahasa Indonesia Was Chosen To Unite",
        format: "statement",
        statement: "Bahasa Indonesia became a social tool that helped people from many regions speak in one shared public space.",
        myth: "",
        fact: "Bahasa Indonesia has roots in Malay and was named as a language of unity in the 1928 Youth Pledge.",
        explanation: "This fact is powerful because language is not only a communication tool; it can also create belonging. Indonesia has hundreds of local languages, so choosing Bahasa Indonesia helped people imagine a shared national room without erasing every local identity. It is a good lens for thinking about accent, class, confidence, and why some languages make us feel closer to ourselves than others.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Youth_Pledge_Museum_Jakarta.jpg",
        imageAlt: "Museum Sumpah Pemuda",
        links: [
          { title: "Sumpah Pemuda", url: "https://en.wikipedia.org/wiki/Youth_Pledge" },
          { title: "Museum Sumpah Pemuda", url: "https://museumsumpahpemuda.kemdikbud.go.id/" }
        ]
      }
    ];
  }
  return [
    {
      title: "Small Talk Is Social Scaffolding",
      format: "myth",
      statement: "",
      myth: "Small talk is fake and useless.",
      fact: "Small talk often works as a low-risk bridge before people feel safe enough for deeper topics.",
      explanation: "Small talk can feel empty, but it often has a social job. People use low-risk topics to test warmth, timing, safety, and whether the other person is available for something deeper. That is why the same sentence can feel fake with one person and comforting with another. The topic is not always the point; the point is whether the exchange creates enough trust for the next layer.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/75/Culture_collage.png",
      imageAlt: "Culture collage",
      links: [
        { title: "Interpersonal communication", url: "https://en.wikipedia.org/wiki/Interpersonal_communication" }
      ]
    }
  ];
}

function loadDemoData() {
  sampleThoughts.forEach((thought, index) => {
    const entry = createEntry(thought, "Thoughts");
    entry.createdAt = new Date(Date.now() - index * 86400000).toISOString();
    state.entries.unshift(entry);
  });

  const demoQuestions = [
    "What changed for you around that hobby?",
    "Which part of the project is creating the most drag?",
    "What would make this feel clearer by next week?"
  ];
  demoQuestions.forEach((question, index) => {
    const scenario = scenarios[index % scenarios.length];
    const result = evaluateQuestion(question, scenario);
    state.practice.history.unshift({
      id: crypto.randomUUID(),
      scenario: scenario.text,
      question,
      score: result.score,
      aspects: result.aspects,
      critique: result.critique,
      impact: result.impact,
      createdAt: new Date(Date.now() - index * 86400000).toISOString()
    });
  });
  state.practice.attempts = state.practice.history.length;
  state.practice.lastScore = state.practice.history[0]?.score || null;
  persistEntries();
  savePractice();
  renderAll();
  showToast("Success");
}

function clearMemory() {
  state.entries = [];
  state.practice = { attempts: 0, lastScore: null, history: [] };
  state.currentTopicId = null;
  state.currentFollowUp = "";
  persistEntries();
  savePractice();
  renderAll();
  renderBrainstormChat();
  showToast("Memory reset.");
}

function exportJson() {
  downloadFile("daysprolartion-memory.json", JSON.stringify({ entries: state.entries, practice: state.practice }, null, 2), "application/json");
}

function exportCsv() {
  const headers = ["Title", "Summary", "Tags", "Category", "Source", "Created", "Raw Thought"];
  const rows = state.entries.map((entry) => [
    entry.title,
    entry.summary,
    entry.tags.join("; "),
    entry.category,
    entry.source,
    entry.createdAt,
    entry.raw
  ]);
  const csv = [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
  downloadFile("daysprolartion-memory.csv", csv, "text/csv");
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function csvCell(value) {
  return `"${String(value || "").replaceAll('"', '""')}"`;
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("is-visible");
  window.clearTimeout(state.toastTimer);
  state.toastTimer = window.setTimeout(() => {
    elements.toast.classList.remove("is-visible");
  }, 2200);
}

function countBy(items, key) {
  return items.reduce((counts, item) => {
    const value = item[key] || "None";
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});
}

function formatEntryTime(value) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric"
  }).format(new Date(value));
}

function normalizeSpace(value) {
  return String(value).replace(/\s+/g, " ").trim();
}

function trimWords(value, limit) {
  const words = normalizeSpace(value).split(/\s+/).filter(Boolean);
  if (words.length <= limit) return words.join(" ");
  return `${words.slice(0, limit).join(" ")}...`;
}

function toTitleCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function tagClass(index) {
  return ["teal", "coral", "mustard"][index % 3];
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
