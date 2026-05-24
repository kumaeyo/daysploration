const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");

const PORT = Number(process.env.PORT || 4173);
const HOST = process.env.HOST || "127.0.0.1";
const ROOT = __dirname;

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
      sendJson(res, 200, {
        ok: true,
        notionConnected: Boolean(process.env.NOTION_TOKEN && process.env.NOTION_DATABASE_ID)
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
