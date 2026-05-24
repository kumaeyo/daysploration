const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");

const PORT = Number(process.env.PORT || 4173);
const HOST = process.env.HOST || (process.env.PORT ? "0.0.0.0" : "127.0.0.1");
const ROOT = __dirname;
const APP_SKILL_PATH = path.join(ROOT, "prompts", "SKILL.md");
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-5.4-mini";
const OPENAI_WEB_SEARCH_TOOL = process.env.OPENAI_WEB_SEARCH_TOOL || "web_search_preview";

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon"
};

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(body)
  });
  res.end(body);
}

function parseJsonResponse(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

function extractOutputText(payload) {
  if (typeof payload?.output_text === "string") return payload.output_text;
  const chunks = [];
  const visit = (value) => {
    if (!value) return;
    if (typeof value === "string") return;
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    if (typeof value !== "object") return;
    if ((value.type === "output_text" || value.type === "text") && typeof value.text === "string") {
      chunks.push(value.text);
    }
    if (Array.isArray(value.content)) visit(value.content);
    if (Array.isArray(value.output)) visit(value.output);
  };
  visit(payload.output);
  return chunks.join("\n").trim();
}

async function callOpenAIJson({ system, user, tools = [] }) {
  if (!process.env.OPENAI_API_KEY) return null;
  const appSkillPrompt = await loadAppSkillPrompt();
  const systemPrompt = appSkillPrompt
    ? [
      "Follow this editable Daysprolartion skill file when it applies:",
      appSkillPrompt,
      "Route-specific instruction:",
      system
    ].join("\n\n")
    : system;

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      input: [
        { role: "system", content: systemPrompt },
        { role: "user", content: user }
      ],
      tools,
      text: { format: { type: "json_object" } },
      max_output_tokens: 2200
    })
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error?.message || payload.message || "OpenAI request failed.");
  }

  const json = parseJsonResponse(extractOutputText(payload));
  if (!json) throw new Error("OpenAI returned a response that was not valid JSON.");
  return json;
}

async function loadAppSkillPrompt() {
  try {
    return await fs.readFile(APP_SKILL_PATH, "utf8");
  } catch {
    return "";
  }
}

function normalizedLanguage(value) {
  return value === "id" ? "id" : "en";
}

function languageInstruction(language) {
  if (language === "id") {
    return "Write in natural Bahasa Indonesia. You may use light daily Indonesian conversational tone, but keep it thoughtful and clear. Use Indonesia-related context where relevant.";
  }
  return "Write in natural English. You may use light daily millennial and Gen Z conversational tone, but keep it thoughtful and clear.";
}

function englishInstruction() {
  return "Write in natural English. Keep the app copy clear, warm, and useful.";
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Request body is too large."));
        req.destroy();
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function notionProperties(entry) {
  const tags = Array.isArray(entry.tags) ? entry.tags.slice(0, 8) : [];
  const raw = String(entry.raw || "").slice(0, 1900);

  return {
    Name: {
      title: [{ text: { content: String(entry.title || "Untitled Thought").slice(0, 120) } }]
    },
    Summary: {
      rich_text: [{ text: { content: String(entry.summary || "").slice(0, 1900) } }]
    },
    Tags: {
      multi_select: tags.map((name) => ({ name: String(name).slice(0, 100) }))
    },
    Category: {
      select: { name: String(entry.category || "Reflection").slice(0, 100) }
    },
    Source: {
      select: { name: String(entry.source || "Thought Drop").slice(0, 100) }
    },
    "Raw Thought": {
      rich_text: raw ? [{ text: { content: raw } }] : []
    },
    Created: {
      date: { start: entry.createdAt || new Date().toISOString() }
    }
  };
}

async function syncToNotion(entry) {
  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!token || !databaseId) {
    return {
      synced: false,
      queued: true,
      message: "Notion credentials are not set on the server. The UI is showing the connected preview state."
    };
  }

  const response = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      "notion-version": "2022-06-28"
    },
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties: notionProperties(entry)
    })
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    return {
      synced: false,
      queued: true,
      message: payload.message || "Notion rejected the sync request."
    };
  }

  return {
    synced: true,
    queued: false,
    pageId: payload.id,
    message: "Saved to Notion."
  };
}

async function analyzeThoughtWithAI(body) {
  const raw = String(body.raw || "").slice(0, 6000);
  const source = String(body.source || "Thoughts").slice(0, 80);
  return callOpenAIJson({
    system: [
      "You are the AI thought engine for Daysprolartion.",
      "Return compact JSON only with: title, summary, tags, category.",
      "title must be exactly 2 to 4 words.",
      "summary must be one direct sentence.",
      "tags must be 2 to 5 short tags.",
      "category must be one of Self-awareness, Relationships, Work, Learning, Philosophy, Creativity, Culture, Faith, Health, Money, Identity.",
      englishInstruction()
    ].join(" "),
    user: JSON.stringify({ source, raw })
  });
}

async function generateQuestionWithAI(body) {
  const language = normalizedLanguage(body.language);
  const type = body.type === "scenario" ? "scenario" : "spark";
  const seed = `${Date.now()}-${Math.random()}`;
  const themes = language === "id"
    ? "Indonesian daily life, Indonesian history, culture, friendship, family pressure, career anxiety, faith, Jakarta or regional urban life, social media, identity, communication"
    : "history, culture, human behavior, friendship, work, faith, pop culture, identity, communication, daily life";
  const outputShape = type === "scenario"
    ? "Return JSON: {\"type\":\"Casual or Work\",\"text\":\"short realistic story with dialogue\",\"better\":[\"better follow-up 1\",\"better follow-up 2\",\"better follow-up 3\"]}."
    : "Return JSON: {\"question\":\"one deep-talk question\"}.";

  return callOpenAIJson({
    system: [
      "You generate fresh, non-template questions for a mobile personal-growth app.",
      "Be specific, deep-talk friendly for millennial and Gen Z users, and avoid repeating common self-help phrasing.",
      "Use a daily conversational tone; light slang is okay if it feels natural.",
      language === "id" ? "Use Indonesian context and natural Bahasa Indonesia for scenarios, questions, and suggested follow-ups." : "Use global context and natural English for scenarios, questions, and suggested follow-ups.",
      "Do not mention that you are randomizing.",
      languageInstruction(language),
      outputShape
    ].join(" "),
    user: JSON.stringify({ type, themes, seed })
  });
}

async function generateBrainstormQuestionWithAI(body) {
  const language = normalizedLanguage(body.language);
  const messages = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
  return callOpenAIJson({
    system: [
      "You are a warm mentor-friend in a brainstorm chat.",
      "Return JSON only: {\"question\":\"...\"}.",
      "Ask exactly one direct follow-up question.",
      "Do not include analysis, labels, explanation, preface, praise, or hidden thinking.",
      "Make the question respond to the user's latest answer and the conversation context.",
      "Avoid repeating any previous assistant question in the messages.",
      languageInstruction(language)
    ].join(" "),
    user: JSON.stringify({ messages, seed: `${Date.now()}-${Math.random()}` })
  });
}

async function evaluatePracticeWithAI(body) {
  const language = normalizedLanguage(body.language);
  return callOpenAIJson({
    system: [
      "You evaluate a follow-up question in a curiosity practice app.",
      "Return JSON only with: score, aspects, critique, impact, better.",
      "score is 0-100.",
      "aspects is exactly three objects: Openness, Depth, Care, each with score 0-100.",
      "critique and impact are each maximum two short sentences and must be in English.",
      "better is exactly three stronger follow-up questions.",
      language === "id" ? "The three better questions may be in Bahasa Indonesia." : "The three better questions must be in English.",
      englishInstruction()
    ].join(" "),
    user: JSON.stringify({
      scenario: String(body.scenario || "").slice(0, 4000),
      question: String(body.question || "").slice(0, 1000)
    })
  });
}

async function generateTriviaWithAI(body) {
  const interests = "history, Indonesian history, Nusantara culture, communication, human behavior, religion, culture, pop culture";
  return callOpenAIJson({
    system: [
      "You create engaging fact cards for a knowledge app.",
      "Use web search for current links and source URLs.",
      "Return JSON only: {\"facts\":[...]} with 4 facts.",
      "Each fact must include: title, statement, explanation, links.",
      "statement must be one bold-feeling question or striking one-sentence claim.",
      "explanation must be engaging, detailed, and under 150 words; it should make the user want to read more.",
      "links is 1 to 2 objects with title and url. The first link must be the best read-more destination.",
      "Use real readable source links. Prefer official, museum, encyclopedia, university, or established publication sources.",
      englishInstruction()
    ].join(" "),
    user: JSON.stringify({
      interests,
      seed: `${Date.now()}-${Math.random()}`
    }),
    tools: [{ type: OPENAI_WEB_SEARCH_TOOL }]
  });
}

async function generateRoleplayWithAI(body) {
  const language = normalizedLanguage(body.language);
  const messages = Array.isArray(body.messages) ? body.messages.slice(-10) : [];
  return callOpenAIJson({
    system: [
      "You power an optional roleplay practice mode for Daysprolartion.",
      "Return JSON only: {\"reply\":\"...\",\"coachTip\":\"...\"}.",
      "reply must be the other person speaking naturally inside the scenario, 1 to 2 short sentences.",
      "coachTip must be one clear sentence about how the user's latest question landed.",
      "Do not score in this mode. Do not write as an assistant unless the scenario calls for it.",
      languageInstruction(language)
    ].join(" "),
    user: JSON.stringify({
      scenario: String(body.scenario || "").slice(0, 4000),
      messages,
      seed: `${Date.now()}-${Math.random()}`
    })
  });
}

function fallbackTrivia(language) {
  if (language === "id") {
    return {
      facts: [
        {
          title: "The Youth Pledge Was More Than a Slogan",
          format: "statement",
          statement: "The Youth Pledge helped turn Indonesia into a shared identity before it was a fully independent nation.",
          myth: "",
          fact: "The 1928 Youth Congress brought youth groups from many regions together and strengthened Bahasa Indonesia as a language of unity.",
          explanation: "The Youth Pledge matters because it turned language into a shared emotional project. Young people from different regions were not only discussing politics; they were imagining how strangers across islands could feel part of one identity. Bahasa Indonesia became practical, symbolic, and future-facing at the same time. That makes this fact useful for thinking about belonging, accents, class, and how language can make a nation feel real before everyone has met each other.",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Youth_Pledge_Museum_Jakarta.jpg",
          imageAlt: "Museum Sumpah Pemuda in Jakarta",
          links: [
            { title: "Museum Sumpah Pemuda", url: "https://museumsumpahpemuda.kemdikbud.go.id/" },
            { title: "Sumpah Pemuda", url: "https://en.wikipedia.org/wiki/Youth_Pledge" }
          ]
        },
        {
          title: "Borobudur Is A Stone Mandala",
          format: "myth",
          statement: "",
          myth: "Borobudur is only a big temple for travel photos.",
          fact: "Borobudur's structure is often read as a symbolic journey through Buddhist cosmology, from desire toward enlightenment.",
          explanation: "Borobudur is not just impressive because of its size. Its terraces, reliefs, and vertical journey can be read as a physical map of Buddhist cosmology. Visitors move through carved stories and symbolic levels, almost like walking inside a teaching system. That makes the temple interesting as architecture, memory technology, and spiritual storytelling at once. It shows how humans use space to organize big questions about desire, discipline, and meaning.",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9b/Borobudur-Nothwest-view.jpg",
          imageAlt: "Borobudur temple in Central Java",
          links: [
            { title: "UNESCO Borobudur", url: "https://whc.unesco.org/en/list/592/" },
            { title: "Borobudur", url: "https://en.wikipedia.org/wiki/Borobudur" }
          ]
        }
      ],
      fallback: true
    };
  }

  return {
    facts: [
      {
        title: "Coffeehouses Helped Public Debate",
        format: "statement",
        statement: "European coffeehouses became informal hubs for news, business, and public debate.",
        myth: "",
        fact: "In the 17th and 18th centuries, coffeehouses helped people exchange pamphlets, gossip, political ideas, and commercial information.",
        explanation: "Coffeehouses mattered because they gave people a relatively open place to gather, read, debate, and trade information. They were social spaces, business hubs, and informal newsrooms before modern feeds existed. The interesting part is the tension: they could spread insight, gossip, rumor, and influence all at once. That makes coffeehouses a useful lens for thinking about today's group chats, podcasts, comment sections, and how public opinion gets formed.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/89/Interior_of_a_London_coffee-house%2C_17th_century.jpg",
        imageAlt: "Historic London coffeehouse illustration",
        links: [
          { title: "Coffeehouse", url: "https://en.wikipedia.org/wiki/Coffeehouse" },
          { title: "British Museum coffeehouse object story", url: "https://www.britishmuseum.org/" }
        ]
      },
      {
        title: "Pop Culture Is Social Memory",
        format: "myth",
        statement: "",
        myth: "Pop culture is shallow because it is popular.",
        fact: "Pop culture often preserves what a generation worried about, laughed at, copied, and resisted.",
        explanation: "Pop culture can look lightweight because it travels through entertainment, trends, and jokes. But those things often capture what a generation is anxious about, proud of, tired of, or trying to become. Memes, songs, films, and fandoms become emotional archives. They show how people signal identity, class, humor, rebellion, and belonging. Studying pop culture is not only about taste; it is also about social memory.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/75/Culture_collage.png",
        imageAlt: "Culture collage",
        links: [
          { title: "Popular culture", url: "https://en.wikipedia.org/wiki/Popular_culture" },
          { title: "Smithsonian Magazine", url: "https://www.smithsonianmag.com/" }
        ]
      }
    ],
    fallback: true
  };
}

async function serveStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const requestedPath = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
  const filePath = path.resolve(ROOT, `.${requestedPath}`);

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  try {
    const body = await fs.readFile(filePath);
    const ext = path.extname(filePath);
    res.writeHead(200, {
      "content-type": MIME_TYPES[ext] || "application/octet-stream",
      "cache-control": "no-store"
    });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "GET" && req.url === "/api/health") {
      const appSkillPrompt = await loadAppSkillPrompt();
      sendJson(res, 200, {
        ok: true,
        notionConnected: Boolean(process.env.NOTION_TOKEN && process.env.NOTION_DATABASE_ID),
        aiConnected: Boolean(process.env.OPENAI_API_KEY),
        model: OPENAI_MODEL,
        skillLoaded: Boolean(appSkillPrompt)
      });
      return;
    }

    if (req.method === "POST" && req.url === "/api/notion-sync") {
      const body = await readRequestBody(req);
      const entry = JSON.parse(body || "{}");
      const result = await syncToNotion(entry);
      sendJson(res, 200, result);
      return;
    }

    if (req.method === "POST" && req.url === "/api/ai/analyze-thought") {
      const body = JSON.parse(await readRequestBody(req) || "{}");
      const result = await analyzeThoughtWithAI(body);
      sendJson(res, 200, result || { fallback: true });
      return;
    }

    if (req.method === "POST" && req.url === "/api/ai/question") {
      const body = JSON.parse(await readRequestBody(req) || "{}");
      const result = await generateQuestionWithAI(body);
      sendJson(res, 200, result || { fallback: true });
      return;
    }

    if (req.method === "POST" && req.url === "/api/ai/brainstorm") {
      const body = JSON.parse(await readRequestBody(req) || "{}");
      const result = await generateBrainstormQuestionWithAI(body);
      sendJson(res, 200, result || { fallback: true });
      return;
    }

    if (req.method === "POST" && req.url === "/api/ai/evaluate") {
      const body = JSON.parse(await readRequestBody(req) || "{}");
      const result = await evaluatePracticeWithAI(body);
      sendJson(res, 200, result || { fallback: true });
      return;
    }

    if (req.method === "POST" && req.url === "/api/ai/trivia") {
      const body = JSON.parse(await readRequestBody(req) || "{}");
      const language = normalizedLanguage(body.language);
      try {
        const result = await generateTriviaWithAI(body);
        sendJson(res, 200, result || fallbackTrivia(language));
      } catch (error) {
        sendJson(res, 200, { ...fallbackTrivia(language), message: error.message });
      }
      return;
    }

    if (req.method === "POST" && req.url === "/api/ai/roleplay") {
      const body = JSON.parse(await readRequestBody(req) || "{}");
      const result = await generateRoleplayWithAI(body);
      sendJson(res, 200, result || { fallback: true });
      return;
    }

    if (req.method === "GET" || req.method === "HEAD") {
      await serveStatic(req, res);
      return;
    }

    sendJson(res, 405, { ok: false, message: "Method not allowed." });
  } catch (error) {
    sendJson(res, 500, { ok: false, message: error.message || "Unexpected server error." });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Daysprolartion is running at http://${HOST}:${PORT}`);
});
