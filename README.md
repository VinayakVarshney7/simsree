# SIMSREE Wireframe Prototype

High-fidelity interactive wireframe for the SIMSREE website revamp.

- 130+ HTML pages across 7 primary sections — **Home · About · Academics · Admissions · Student's Corner · Events · Placements · Contact**
- Shared design system in `shared/styles.css` (design tokens, components, motion)
- Shared interactions in `shared/interactions.js` (nav, modals, filters, scroll-spy, count-up, reveal)
- **Static site — no build step**, no dependencies, no server-side code

## Folder layout

```
wireframes/                    ← this folder is the deploy root
├── index.html                 ← homepage
├── about/                     ← About section pages (landing + 8 detail)
├── academics/                 ← Academics (landing + 5 programmes + faculty)
├── admissions/                ← Admissions (landing + 5 programmes + downloads)
├── students/                  ← Student's Corner (landing + body + life + 13 committees)
├── events/                    ← Events (landing + 7 flagship + archive)
├── placements/                ← Placements (landing + 5 detail pages)
├── contact/                   ← Contact (landing + 4 detail)
├── shared/
│   ├── styles.css             ← single shared stylesheet (~14k lines)
│   └── interactions.js        ← single shared JS (~750 lines)
├── favicon.svg
├── vercel.json                ← Vercel: clean URLs + cache headers
├── .vercelignore              ← exclude tooling files from Vercel deploy
├── .gitignore                 ← keep OS / editor cruft out of git
└── README.md                  ← this file
```

---

## Upload to GitHub (step-by-step)

### Option A · GitHub Desktop (easiest, no terminal)

1. Install [GitHub Desktop](https://desktop.github.com/) and sign in.
2. **File → Add Local Repository →** browse to `C:\Users\vinay\Downloads\SIMSREE\wireframes`.
3. GitHub Desktop will say "this directory does not appear to be a Git repository — create one?" → click **Create a Repository**.
4. Fill in name `simsree-wireframes` (or similar). Leave defaults for Git Ignore (None — we have our own) and License if you want one.
5. Click **Create Repository**.
6. Click **Publish repository** at the top. Keep "Keep this code private" checked (or uncheck for public).
7. Done. Your repo is on github.com/<your-username>/simsree-wireframes.

### Option B · git CLI

```bash
cd C:\Users\vinay\Downloads\SIMSREE\wireframes
git init
git add .
git commit -m "Initial commit · SIMSREE wireframe prototype"

# Create an empty repo on github.com first (no README, no .gitignore — we have them), copy its URL, then:
git branch -M main
git remote add origin https://github.com/<your-username>/simsree-wireframes.git
git push -u origin main
```

### Option C · GitHub web upload (drag-and-drop)

1. On github.com, create a new empty repo (no README/license).
2. On the empty repo page, click **uploading an existing file**.
3. Drag the entire **contents** of `wireframes/` into the upload box (not the folder itself — open it and select everything inside).
4. Commit message → Commit.

> Note: GitHub web upload caps at ~100 files per drop. You may need 2 drops (do the `shared/` and any one section first, then the rest). For 130+ pages, Option A or B is faster.

---

## Deploy the GitHub repo (pick one)

### Vercel (recommended · zero config)

1. Sign in at [vercel.com](https://vercel.com) with your GitHub account.
2. Click **Add New… → Project**.
3. Import the `simsree-wireframes` repo.
4. **Framework Preset:** Other · **Root Directory:** `./` · **Build Command:** *(leave blank)* · **Output Directory:** *(leave blank)*.
5. Click **Deploy**. ~30 seconds later you get a `*.vercel.app` URL.
6. `vercel.json` is auto-detected — clean URLs work (`/about/history-web` instead of `.html`).

### GitHub Pages

1. In your repo on github.com, go to **Settings → Pages**.
2. **Source: Deploy from a branch** · **Branch:** `main` · **Folder:** `/ (root)` · Save.
3. Wait ~1 minute. Your site is live at `https://<username>.github.io/simsree-wireframes/`.

> Note: GitHub Pages does NOT support clean URLs out of the box — links will need `.html` suffixes, which the site already has. Vercel's clean-URL handling is purely an enhancement.

### Netlify

1. Sign in at [netlify.com](https://netlify.com) with GitHub.
2. **Add new site → Import an existing project →** pick the repo.
3. **Build command:** *(leave blank)* · **Publish directory:** `./` · Deploy.

---

## Local preview (before pushing)

```bash
cd C:\Users\vinay\Downloads\SIMSREE\wireframes

# Python 3 (any OS)
python3 -m http.server 8080
# OR Python 2
python -m SimpleHTTPServer 8080

# Then open http://localhost:8080
```

Any change you make locally is visible on a hard refresh (`Ctrl+Shift+R` / `Cmd+Shift+R`).

---

## Making edits after the first push

```bash
cd C:\Users\vinay\Downloads\SIMSREE\wireframes
git add .
git commit -m "Describe what changed"
git push
```

Vercel/Netlify auto-deploy in ~30 seconds. GitHub Pages takes ~1–2 minutes.

---

## Tech notes

- **No build step.** Open any `.html` file directly in a browser and it works.
- **All images** are sourced from `picsum.photos` (free placeholder service). Swap them out for real photos by find-replacing the seed paths in HTML.
- **Cache busting** uses `?v=cbNNN` query params on the CSS/JS references. After a large CSS change, bump these on the affected pages to force a refresh.
- **Body-class scoping pattern** — every page has a `page-X` class on `<body>`. CSS overrides are scoped under `body.page-X` so style edits on one page never leak to others.
