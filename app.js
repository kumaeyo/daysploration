const STORAGE_KEY = "daysprolartion.entries.v2";
const PRACTICE_KEY = "daysprolartion.practice.v2";
const QUESTION_POOL_KEY = "daysprolartion.question-pools.v1";

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
  questionPools: loadQuestionPools(),
  activeScenario: null,
  activeSparkIndex: 0,
  activePeriod: "week",
  thoughtMode: "brainstorm",
  memoryMode: "thoughts",
  currentTopicId: null,
  currentFollowUp: "",
  toastTimer: null
};

const elements = {
  todayCount: document.querySelector("#todayCount"),
  thoughtInput: document.querySelector("#thoughtInput"),
  quickNotePanel: document.querySelector("#quickNotePanel"),
  brainstormPanel: document.querySelector("#brainstormPanel"),
  brainstormChat: document.querySelector("#brainstormChat"),
  brainstormInput: document.querySelector("#brainstormInput"),
  sparkPromptPanel: document.querySelector("#sparkPromptPanel"),
  sparkQuestionText: document.querySelector("#sparkQuestionText"),
  scenarioText: document.querySelector("#scenarioText"),
  scenarioType: document.querySelector("#scenarioType"),
  questionInput: document.querySelector("#questionInput"),
  questionFeedback: document.querySelector("#questionFeedback"),
  totalEntries: document.querySelector("#totalEntries"),
  practiceAttempts: document.querySelector("#practiceAttempts"),
  practiceHelper: document.querySelector("#practiceHelper"),
  topCategory: document.querySelector("#topCategory"),
  boardColumns: document.querySelector("#boardColumns"),
  localSaveCount: document.querySelector("#localSaveCount"),
  connectionStatus: document.querySelector("#connectionStatus"),
  currentMode: document.querySelector("#currentMode"),
  entryModal: document.querySelector("#entryModal"),
  entryModalTitle: document.querySelector("#entryModalTitle"),
  entryModalMeta: document.querySelector("#entryModalMeta"),
  entryModalBody: document.querySelector("#entryModalBody"),
  toast: document.querySelector("#toast")
};

init();

function init() {
  wireNavigation();
  wireActions();
  state.activeSparkIndex = pickNonRepeatingIndex("sparkQuestions", sparkQuestions.length);
  pickScenario();
  renderSparkQuestion();
  renderModeState();
  renderAll();
  checkConnection();
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
  document.querySelector("#processThoughtButton").addEventListener("click", saveThought);
  document.querySelector("#clearThoughtButton").addEventListener("click", () => {
    resetThoughtComposer(true);
  });
  document.querySelector("#brainstormSendButton").addEventListener("click", sendBrainstormMessage);
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
  elements.questionFeedback.addEventListener("click", (event) => {
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

  document.querySelector("#thoughtsMetricButton").addEventListener("click", () => setMemoryMode("thoughts"));
  document.querySelector("#curiosityMetricButton").addEventListener("click", () => setMemoryMode("curiosity"));
  document.querySelector("#categoryMetricButton").addEventListener("click", () => setMemoryMode("thoughts"));

  elements.boardColumns.addEventListener("click", (event) => {
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
  } else {
    document.querySelector("#thoughtsMetricButton").classList.add("is-active");
  }
  renderBoard();
}

function openSparkPrompt() {
  elements.sparkPromptPanel.classList.remove("is-hidden");
  renderSparkQuestion();
}

function closeSparkPrompt() {
  elements.sparkPromptPanel.classList.add("is-hidden");
}

function nextSparkQuestion() {
  state.activeSparkIndex = pickNonRepeatingIndex("sparkQuestions", sparkQuestions.length, state.activeSparkIndex);
  renderSparkQuestion();
}

function renderSparkQuestion() {
  elements.sparkQuestionText.textContent = sparkQuestions[state.activeSparkIndex];
}

function saveThought() {
  const text = elements.thoughtInput.value.trim();
  if (!text) {
    showToast("Failed: add a thought first.");
    return;
  }

  const raw = composeThoughtRaw(text);
  const entry = createEntry(raw, "Thoughts");
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

function sendBrainstormMessage() {
  const text = elements.brainstormInput.value.trim();
  if (!text) {
    showToast("Failed: add a message first.");
    return;
  }

  if (!state.currentTopicId) {
    const entry = createEntry(composeThoughtRaw(text), "Brainstorm");
    state.currentTopicId = entry.id;
    state.currentFollowUp = generateFollowUp(entry);
    saveEntry(entry);
    elements.brainstormInput.value = "";
    renderBrainstormChat(entry);
    showToast("saved");
    attemptNotionSync(entry);
    return;
  }

  const entry = getCurrentTopic();
  if (!entry) return;
  const question = state.currentFollowUp || generateFollowUp(entry);
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
  state.currentFollowUp = generateFollowUp(entry);
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
  const currentQuestion = state.currentFollowUp || generateFollowUp(entry);
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
  return {
    id: crypto.randomUUID(),
    raw,
    source,
    title: analysis.title,
    summary: analysis.summary,
    tags: analysis.tags,
    category: analysis.category,
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

function generateFollowUp(entry) {
  const latestMessage = getLatestUserMessage(entry);
  const intent = inferMentorIntent(latestMessage, entry);
  const focus = extractFocusPhrase(latestMessage);
  const question = pickMentorQuestion(intent, entry);
  if (!focus) return question;
  return personalizeQuestion(question, focus, intent.name);
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

function pickScenario(index) {
  if (typeof index === "number") {
    state.activeScenario = scenarios[index % scenarios.length];
  } else {
    const currentIndex = scenarios.indexOf(state.activeScenario);
    const nextIndex = pickNonRepeatingIndex("scenarios", scenarios.length, currentIndex);
    state.activeScenario = scenarios[nextIndex];
  }
  elements.scenarioText.textContent = state.activeScenario.text;
  elements.scenarioType.textContent = state.activeScenario.type;
  elements.questionInput.value = "";
  elements.questionFeedback.className = "empty-state";
  elements.questionFeedback.innerHTML = "<strong>No feedback yet.</strong><span>Send a question to review openness, depth, and care.</span>";
}

function sendPracticeQuestion() {
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
          ${result.better.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ol>
      </div>
      <button class="primary-button" type="button" data-feedback-new-scenario>New scenario</button>
    </div>
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

function renderAll() {
  renderMetrics();
  renderBoard();
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
  elements.topCategory.textContent = top ? top[0] : "None";
  elements.localSaveCount.textContent = `${state.entries.length} ${state.entries.length === 1 ? "entry" : "entries"}`;
}

function renderBoard() {
  if (state.memoryMode === "curiosity") {
    renderCuriosityMemory();
    return;
  }
  renderThoughtMemory();
}

function renderThoughtMemory() {
  const entries = getFilteredEntries();
  if (!entries.length) {
    elements.boardColumns.innerHTML = `
      <section class="board-column">
        <h3>Thoughts <span>0</span></h3>
        <article class="entry-card starter-card">
          <header><h4>Capture your first thought</h4></header>
          <p>Save one raw idea and Daysprolartion will turn it into a topic you can keep exploring.</p>
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

function checkConnection() {
  elements.connectionStatus.textContent = "Connected";
  elements.currentMode.textContent = "Notion connected";
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

function loadQuestionPools() {
  try {
    const stored = JSON.parse(localStorage.getItem(QUESTION_POOL_KEY) || "{}");
    return {
      scenarios: Array.isArray(stored.scenarios) ? stored.scenarios : [],
      sparkQuestions: Array.isArray(stored.sparkQuestions) ? stored.sparkQuestions : []
    };
  } catch {
    return { scenarios: [], sparkQuestions: [] };
  }
}

function saveQuestionPools() {
  localStorage.setItem(QUESTION_POOL_KEY, JSON.stringify(state.questionPools));
}

function pickNonRepeatingIndex(poolName, total, excludeIndex = -1) {
  if (!total) return 0;
  const validIndexes = Array.from({ length: total }, (_, index) => index);
  const used = Array.isArray(state.questionPools[poolName])
    ? state.questionPools[poolName].filter((index) => index >= 0 && index < total)
    : [];
  if (used.length >= total) used.length = 0;

  let available = validIndexes.filter((index) => !used.includes(index));
  if (available.length === 1 && available[0] === excludeIndex && total > 1) {
    used.length = 0;
    available = validIndexes.filter((index) => index !== excludeIndex);
  } else if (available.length > 1 && excludeIndex >= 0) {
    available = available.filter((index) => index !== excludeIndex);
  }
  if (!available.length) {
    available = validIndexes.filter((index) => index !== excludeIndex);
  }
  if (!available.length) available = validIndexes;

  const nextIndex = available[Math.floor(Math.random() * available.length)];
  used.push(nextIndex);
  state.questionPools[poolName] = used;
  saveQuestionPools();
  return nextIndex;
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
