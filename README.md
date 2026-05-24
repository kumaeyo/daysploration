# Daysprolartion

Daysprolartion is a mobile-first personal development app for curiosity, thinking, and memory.

The app now has local No-API content for:

- Local thought analysis and Notion-ready summaries.
- Local brainstorm follow-up questions.
- Local curiosity practice scenarios and scoring.
- Optional local roleplay replies for conversation practice.
- Random knowledge trivia with source links.
- Global and Indonesian question context.
- An editable AI style file at `prompts/SKILL.md`.

Daysprolartion now works in No-API Mode by default. OpenAI is optional later if you want Smart Mode, but the core app does not need paid AI.

## App Structure

1. Trivia
   - Shows one focused random fact card at a time.
   - Uses `data/trivia.json` in No-API Mode.
   - Includes one Read more link for further reading.
   - Uses a bold statement and a fuller explanation under 150 words.

2. Practice
   - Generates casual or work scenarios as short realistic stories.
   - Uses `data/questions.json` in No-API Mode.
   - Scenarios can use daily conversational tone and light slang.
   - You write a follow-up question.
   - The local scorer reviews openness, depth, and care, then suggests better questions.
   - You can save strong questions into a small question library.
   - Roleplay mode lets you continue the scenario as a conversation, while the scored single-question flow stays the main feature.
   - Voice input lets you speak a question when the browser supports microphone dictation.

3. Thoughts
   - Brainstorm mode works like a mentor or friend chat.
   - Quick note mode saves a thought immediately.
   - "Ask me" generates a deep-talk prompt.
   - Saved thoughts are summarized, titled, tagged, categorized, and synced to Notion.
   - Voice input can capture a spoken thought when supported by the browser.

4. Memory
   - Search inside saved thoughts by title, tag, category, summary, or raw text.
   - Thought cards open into a scrollable reading pop-up.
   - Curiosity score includes a line chart, score breakdown, score distribution, aspect bars, and question history.
   - Saved questions are stored in Memory and can be reused as Thoughts prompts.
   - A personalized note for Lala summarizes recent activity in a warmer dashboard style.
   - Download is available from the small download icon.

5. Setting
   - Shows Notion sync status.
   - Shows Smart Mode or No-API Mode status.
   - Lets you switch question context between Global and Indonesian.

## Notion Setup

### 1. Create a Notion integration

1. Open Notion's integrations page.
2. Create a new internal integration.
3. Name it something clear, such as "Daysprolartion Sync".
4. Copy the integration token and keep it private.

### 2. Create your Notion database

1. Open Notion.
2. Create a new page.
3. Add a database table.
4. Name the database "Daysprolartion Memory".
5. Add these database properties:

| Property name | Notion property type | Purpose |
| --- | --- | --- |
| Name | Title | Generated memory title |
| Summary | Text | Generated summary |
| Tags | Multi-select | Generated tags |
| Category | Select | Main topic category |
| Source | Select | Thoughts, Brainstorm, or other source |
| Raw Thought | Text | Full saved thought or brainstorm transcript |
| Created | Date | Saved date |

### 3. Share the database with your integration

1. Open the "Daysprolartion Memory" database in Notion.
2. Choose Share.
3. Invite your "Daysprolartion Sync" integration.
4. Confirm the integration has access.

### 4. Find the database ID

1. Open the database as a full page.
2. Copy the page URL from your browser.
3. The database ID is the long string in the URL after the workspace name and before any question mark.
4. Keep that database ID together with your integration token.

## OpenAI Setup

OpenAI is optional. You can skip this section if you want to keep the app free.

1. Create or open your OpenAI platform account.
2. Create an API key.
3. Keep the API key private.
4. Use the key only as a Render environment variable, never inside `index.html`, `app.js`, or any public file.

If you later enable OpenAI, the app can use these server routes in `server.js`:

| Route | Purpose |
| --- | --- |
| `/api/ai/analyze-thought` | Generates title, summary, tags, and category |
| `/api/ai/question` | Generates Practice scenarios and Ask me prompts |
| `/api/ai/brainstorm` | Generates one direct brainstorm question |
| `/api/ai/evaluate` | Scores curiosity practice answers |
| `/api/ai/trivia` | Uses AI search for facts and read-more links |
| `/api/ai/roleplay` | Generates optional roleplay replies and a short coach tip |

## No-API Mode

No-API Mode uses local files instead of paid AI calls:

- `data/questions.json` stores Ask me prompts, Practice scenarios, better follow-up questions, and mentor-style brainstorm prompts.
- `data/trivia.json` stores trivia cards, explanations, and Read more links.
- `app.js` uses these local files first. If they exist, the app does not need OpenAI for the core experience.
- Thought summaries, tags, and categories use the built-in rule-based analyzer.
- Practice scoring uses the built-in Openness, Depth, and Care scorer.

This means you can publish on Render without adding `OPENAI_API_KEY`.

## Scaling Your Content

Use a simple content workflow:

1. Add 5 to 10 new items at a time.
2. Give every item a unique `id`.
3. Add tags that describe the situation, such as `family`, `work`, `identity`, `communication`, or `faith`.
4. Keep each question specific and human.
5. Test the app on your phone.
6. Remove anything that feels generic, preachy, or too formal.

### Scaling Questions

Open `data/questions.json`.

Add content in three places:

- `spark.global` and `spark.indonesian` for Ask me questions.
- `scenarios.global` and `scenarios.indonesian` for Practice stories.
- `mentorPrompts.global` and `mentorPrompts.indonesian` for Brainstorm follow-up questions.

Good question rules:

- Ask one thing only.
- Invite story, feeling, motive, tradeoff, or change.
- Avoid advice disguised as a question.
- Avoid yes/no questions.
- For Indonesian context, use natural Bahasa Indonesia and situations that feel locally familiar.

### Scaling Trivia

Open `data/trivia.json`.

Each trivia item needs:

- `id`: unique stable id.
- `category`: broad topic.
- `title`: short title.
- `statement`: bold claim or question.
- `explanation`: under 150 words.
- `links`: at least one Read more link.
- `tags`: search and organization keywords.

Good trivia rules:

- Prefer facts that can start a deeper conversation.
- Explain why the fact matters, not only what happened.
- Use trusted links such as official museum, university, encyclopedia, or cultural institution pages.
- Keep one strongest Read more link first because the app uses the first link as the button.

### Suggested Growth Rhythm

Start with this target:

- 50 Global Ask me questions.
- 50 Indonesian Ask me questions.
- 30 Global Practice scenarios.
- 30 Indonesian Practice scenarios.
- 100 trivia cards across history, Indonesian history, communication, humans, religion, culture, and pop culture.

That is enough to make the app feel fresh for personal daily use.

## AI Skill File

The app includes an editable AI instruction file:

- File location: `prompts/SKILL.md`
- Purpose: teaches the AI how Daysprolartion should ask questions, score curiosity, create trivia, roleplay, and write weekly insights.
- Server behavior: if Smart Mode is enabled later, `server.js` reads this file before AI calls and blends it into the system prompt.
- Editing flow:
  1. Open `prompts/SKILL.md`.
  2. Change the rules in plain language.
  3. Save the file.
  4. Test locally or redeploy on Render.

Good things to put in this file:

- Your preferred tone.
- Examples of strong and weak follow-up questions.
- Trivia quality rules.
- Indonesian context preferences.
- Topics you want more or less often.

Keep private keys out of this file. It is part of the public app code.

## Voice Input

Voice input uses the browser's built-in speech recognition when available.

On your phone:

1. Open the app in a browser that supports speech recognition.
2. Tap the microphone button beside a writing box.
3. Allow microphone permission.
4. Speak your thought or question.
5. Review the transcribed text before sending or saving.

If the browser does not support speech recognition, the app will show a small message and you can keep typing normally.

## Render Configuration

### 1. Create the GitHub repository

1. Create a new GitHub repository named `daysprolartion`.
2. Upload these project files:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `server.js`
   - `package.json`
   - `README.md`
   - `prompts/SKILL.md`
   - `data/questions.json`
   - `data/trivia.json`
3. Commit the files in GitHub.

### 2. Create the Render service

1. Open Render.
2. Choose New Web Service.
3. Connect your GitHub account.
4. Select the `daysprolartion` repository.
5. Choose Node as the environment.
6. Let Render use the start script from `package.json`. If Render asks for the start command, enter the same start script shown in `package.json`.
7. Create the service.

### 3. Add Render environment variables

Open the Render service settings and add these private values:

| Environment variable | Required | What it does |
| --- | --- | --- |
| `OPENAI_API_KEY` | Optional | Enables future Smart Mode AI routes |
| `OPENAI_MODEL` | Optional | Defaults to `gpt-5.4-mini` if not set |
| `OPENAI_WEB_SEARCH_TOOL` | Optional | Defaults to `web_search_preview` for trivia search |
| `NOTION_TOKEN` | Yes for Notion sync | Your Notion integration token |
| `NOTION_DATABASE_ID` | Yes for Notion sync | Your Notion database ID |

After adding environment variables, redeploy the Render service.

### 4. Test the deployed app

1. Open the Render public URL on your phone.
2. Go to Setting.
3. Confirm status shows No-API Mode, or Smart Mode if you added OpenAI.
4. Confirm Notion sync shows connected.
5. Go to Trivia and tap Next Fact.
6. Go to Thoughts and save a test thought.
7. Open your Notion database and confirm the new page appears.

## Context Setting

The Setting tab has two context options:

- Global
- Indonesian

When Indonesian is selected:

- The app interface stays English.
- Thought questions, Practice stories, Roleplay replies, Brainstorm prompts, and Practice suggestions use natural Bahasa Indonesia.
- Generated questions lean into Indonesian daily life, culture, history, work, family, faith, and social context.

## Notes

- If `OPENAI_API_KEY` is missing, the app uses No-API Mode from `data/questions.json` and `data/trivia.json`.
- If Notion variables are missing, entries stay available in the browser for testing but will not sync to Notion.
- Public hosting should use the Node server if you want Notion sync or future Smart Mode, because private keys must stay on the server.
