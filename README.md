# Daysprolartion

Daysprolartion is a mobile-first personal development app for three habits:

- Practice curiosity in conversation.
- Save thoughts into a structured memory board.
- Use spark prompts and follow-up questions to keep thinking deeper.

The app is currently a lightweight web prototype. It runs in the browser, stores data locally for testing, and includes a server endpoint that can send saved thoughts into Notion once you add your Notion integration details.

## App Structure

The app has four main tabs:

1. Practice
   - Shows a casual or work scenario as a short realistic story.
   - You write a follow-up question.
   - The app scores your question across openness, depth, and care.
   - Feedback explains how the question may affect the person you are speaking with.

2. Thoughts
   - Lets you choose Brainstorm or Quick note.
   - Brainstorm mode opens a chat-style thinking session.
   - Each brainstorm session is saved as one topic in Memory.
   - Quick note mode saves and refreshes the writing area immediately.
   - "Ask me" opens a bold prompt to help trigger deeper thinking.

3. Memory
   - Shows activity over Week, Month, or All.
   - Thought cards can be tapped to read the full text in a scrollable pop-up.
   - Curiosity score can be opened to see progress history and past question reviews.
   - Download is available from the small download icon.

4. Setting
   - Shows Notion sync status.
   - Shows the expected Notion database fields.
   - Includes maintenance actions for demo data and memory reset.

## Notion Setup

### 1. Create a Notion integration

1. Go to Notion's integrations page.
2. Create a new internal integration.
3. Name it something clear, such as "Daysprolartion Sync".
4. Copy the integration token and keep it somewhere private.

### 2. Create your Notion database

1. Open Notion.
2. Create a new page.
3. Add a database table.
4. Name the database "Daysprolartion Memory".
5. Add these database properties:

| Property name | Notion property type | Purpose |
| --- | --- | --- |
| Name | Title | The generated memory title |
| Summary | Text | Short AI-style summary |
| Tags | Multi-select | Topic tags |
| Category | Select | Main category |
| Source | Select | Thoughts or other source |
| Raw Thought | Text | Full saved thought |
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

### 5. Add the Notion details to your deployed app

Your app needs two private values:

| Private value name | What to paste |
| --- | --- |
| NOTION_TOKEN | Your Notion integration token |
| NOTION_DATABASE_ID | Your Notion database ID |

Where you paste these depends on your hosting provider. In most hosts, look for a section called Environment Variables, Secrets, or Project Settings.

## GitHub Publishing Flow

### 1. Create a GitHub account

1. Go to GitHub.
2. Create an account or sign in.
3. Verify your email address.

### 2. Create a new repository

1. From GitHub, choose New repository.
2. Name it `daysprolartion`.
3. Keep it private while you are still experimenting.
4. Add a short description.
5. Create the repository.

### 3. Upload the project files

1. Open the new repository.
2. Choose Add file.
3. Choose Upload files.
4. Upload these files from this project folder:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `server.js`
   - `package.json`
   - `README.md`
5. Commit the uploaded files from the GitHub page.

### 4. Choose a hosting option

Use a host that supports a small Node server if you want Notion sync to work.

Good beginner-friendly options:

- Render
- Railway
- Fly.io
- Vercel with a serverless API rewrite

For the simplest static preview, GitHub Pages can show the interface, but it will not run the Notion sync server by itself.

### 5. Deploy with Render

1. Create a Render account.
2. Choose New Web Service.
3. Connect your GitHub repository.
4. Select the `daysprolartion` repository.
5. Choose Node as the environment.
6. Set the start file to run `server.js` through Render's service settings.
7. Add your private environment values:
   - `NOTION_TOKEN`
   - `NOTION_DATABASE_ID`
8. Create the service.
9. Wait for Render to finish deploying.
10. Open the public URL Render gives you.

### 6. Test the live app

1. Open the deployed app on your phone.
2. Go to Thoughts.
3. Write a test thought.
4. Save it.
5. Open your Notion database.
6. Confirm the new page appears with title, summary, tags, category, source, raw thought, and created date.

## Suggested Next Improvements

- Replace the local AI-style analysis with a real AI endpoint.
- Add account login so each user has a private memory board.
- Add a proper Notion connection screen with setup validation.
- Add search inside Memory.
- Add a daily reminder for curiosity practice.
- Add richer charts for curiosity progress.
