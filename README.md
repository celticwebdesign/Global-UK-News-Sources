# 🌍 Global Perspectives — International News Aggregator

A single-page web app that aggregates live RSS feeds from international English-language news sources across the Middle East, Europe, Asia-Pacific, South Asia, Africa, and Latin America. Built without a backend framework — just HTML, vanilla JavaScript, and a Netlify serverless function to proxy RSS feeds.

**Live app:** [app-global-news.netlify.app](https://app-global-news.netlify.app)

---

## Built With

- **[Claude Cowork](https://claude.ai)** — AI-assisted development environment (Anthropic)
- **Netlify** — hosting + serverless functions (free tier)
- **GitHub** — version control + auto-deploy trigger
- Vanilla HTML / CSS / JavaScript — no build step, no framework, no npm

---

## How It Works

The app fetches RSS feeds from news sources around the world. Because browsers block cross-origin requests (CORS), a small Netlify serverless function (`netlify/functions/proxy.js`) acts as a server-side relay:

```
Browser → /api/proxy?url=<rss-url> → Netlify Function → News source → Browser
```

This means no CORS issues, no third-party proxy services, and no API keys required.

---

## Project Structure

```
Global-UK-News-Sources/
├── index.html                  # The entire front-end app
├── netlify.toml                # Netlify build config + /api/proxy redirect
├── netlify/
│   └── functions/
│       └── proxy.js            # Serverless RSS proxy function
└── README.md
```

---

## GitHub & Netlify Auto-Deploy

The repo is connected to Netlify via GitHub. Every `git push` to `main` triggers an automatic Netlify deploy — no manual steps needed.

**Repo:** [github.com/celticwebdesign/Global-UK-News-Sources](https://github.com/celticwebdesign/Global-UK-News-Sources)

To set this up from scratch (already done — for reference only):
1. Push the repo to GitHub
2. In Netlify: **Add new site → Import an existing project → GitHub**
3. Select the repo, leave build command and publish directory blank
4. Deploy — Netlify detects `netlify/functions/` automatically

---

## Running Locally

To run the app locally with the Netlify Function working, use the **Netlify CLI**:

```bash
# Install Netlify CLI globally (one-time)
npm install -g netlify-cli

# Navigate to the project folder
cd ~/path/to/Global-UK-News-Sources

# Start the local dev server
netlify dev
```

This starts a local server at `http://localhost:8888` with the proxy function available at `http://localhost:8888/api/proxy`. The app will work exactly as it does in production.

> **Note:** Without `netlify dev`, opening `index.html` directly in a browser will fail to load feeds because `/api/proxy` won't exist. Always use `netlify dev` for local development.

---

## Making Changes

### With Claude Cowork (current setup)

Claude Cowork has direct access to the project folder (mounted via Dropbox). The workflow is:

1. Ask Claude to make a change
2. Claude edits the files directly in the project folder and commits
3. You run `git push` in Terminal — Netlify auto-deploys within ~30 seconds

```bash
cd ~/Dropbox/Darren/Websites/Claude/Cowork/Global-UK-News-Sources
git push
```

> Claude cannot push to GitHub directly due to a network restriction in the Cowork sandbox, so the `git push` step is always manual.

### With Claude Code (alternative setup)

Claude Code is Anthropic's CLI tool that runs directly in your terminal and has full network access, meaning it can handle the `git push` itself without you needing to run it manually. To switch:

1. Install Claude Code: [claude.ai/code](https://claude.ai/code) (or `npm install -g @anthropic/claude-code`)
2. Open your terminal in the project folder:
   ```bash
   cd ~/Dropbox/Darren/Websites/Claude/Cowork/Global-UK-News-Sources
   claude
   ```
3. From that point, Claude Code can read/write files, run git commands, and push to GitHub — all in one step

**Key differences between Cowork and Claude Code:**

| | Claude Cowork | Claude Code |
|---|---|---|
| Interface | Desktop app (GUI) | Terminal (CLI) |
| File access | Via folder picker | Direct (runs in your terminal) |
| Git push | You run it | Claude runs it |
| Network access | Restricted | Full |
| Best for | Non-developers | Developers |

Since you're a WordPress developer comfortable with the terminal, **Claude Code would give you a smoother workflow** — Claude handles everything including the push, and you can keep all your existing git setup.

---

## Adding or Replacing News Sources

Sources are defined in the `SOURCES` array in `index.html`:

```javascript
{ name:'Al Jazeera', country:'Qatar', flag:'🇶🇦', region:'Middle East', url:'https://www.aljazeera.com/xml/rss/all.xml', home:'https://www.aljazeera.com' },
```

To add a source, add a new entry with:
- `name` — display name
- `country` — country or region of origin
- `flag` — emoji flag
- `region` — one of: `Middle East`, `Europe`, `Asia-Pacific`, `South Asia`, `Africa`, `Latin America`
- `url` — direct RSS/Atom feed URL
- `home` — homepage URL (shown as fallback link)

---

## Netlify Function — proxy.js

The function lives at `netlify/functions/proxy.js` and is available via `/api/proxy?url=<encoded-url>`.

It:
- Validates the URL is http/https
- Fetches the RSS feed server-side with a 10 second timeout
- Returns the raw XML with CORS headers and a 5-minute cache
- Returns JSON error responses for bad requests or upstream failures

No API keys, no external dependencies, runs on Node 20.

---

## Future Ideas

- [ ] Search / filter by keyword across all feeds
- [ ] Save favourite sources (localStorage)
- [ ] Dark/light mode toggle
- [ ] Article count badge per region filter button
- [ ] Show feed thumbnails / article images where available
- [ ] Export headlines as a daily digest (PDF or email)
- [ ] Add UK sources section

---

## License

Personal project — all news content © respective publishers.
