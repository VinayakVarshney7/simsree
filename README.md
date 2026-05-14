# SIMSREE Wireframe Prototype

High-fidelity interactive wireframe for the SIMSREE website revamp.

- 133 HTML pages across 7 primary sections (Home, About, Academics, Admissions, Students, Events, Placements, Contact)
- Shared design system in `shared/styles.css` (design tokens, components, motion)
- Shared interactions in `shared/interactions.js` (nav, modals, calendar, forms, scroll effects)
- Static site — no build step

## Deploy to Vercel

This folder is the deploy root. Three options:

**1. Drag & drop (fastest, no account setup beyond signup)**
- Open https://vercel.com/new
- Drag this `wireframes/` folder onto the upload area
- Click Deploy

**2. Vercel CLI**
```
cd wireframes
npx vercel        # follow prompts → preview URL
npx vercel --prod # promotes to your project's production domain
```

**3. GitHub → Vercel (recommended for ongoing edits)**
- Push this folder to a new GitHub repo
- Import it at https://vercel.com/new
- Framework preset: **Other**
- Root directory: `./` (or `wireframes` if you push the parent)
- Build command: *(leave blank)*
- Output directory: *(leave blank)*

Vercel detects this as a static site automatically. `vercel.json` enables clean URLs (so `/about/history-web` works without the `.html`).

## Local preview

```
cd wireframes
python3 -m http.server 8080
# open http://localhost:8080
```
