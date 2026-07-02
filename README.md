# FLUIA — Landing & Site

Official FLUIA website. Multi-page site built with **Astro**.

## Stack

- [Astro 5](https://astro.build) — static site generator
- [GSAP](https://gsap.com) — scroll & UI animation
- [three.js](https://threejs.org) — hero WebGL
- Fonts: **Fraunces** (headings), **Manrope** (body)

## Structure

```
├── astro.config.mjs
├── vercel.json          # framework=astro, build → dist/
├── public/              # static assets (logos, scripts) served as-is
│   ├── assets/
│   └── scripts/
└── src/
    ├── components/      # Nav, Footer, sections, etc.
    ├── data/            # servicios.js (content source)
    ├── layouts/         # Base.astro
    ├── pages/           # index, servicios, casos, proceso, contacto
    └── styles/          # base, sections, pages, glow-card
```

## Develop

```bash
npm install
npm run dev       # local dev server
npm run build     # production build → dist/
npm run preview   # serve the built dist/ locally
```

## Deploy

Vercel builds `astro build` on every push and serves `dist/`.

| Branch    | Destination                                      |
|-----------|--------------------------------------------------|
| `main`    | Production → https://landing-steffano.vercel.app |
| `develop` | Preview → temporary URL on each push             |

## Git workflow

Claude edits → `git add` + `git commit` → shows diff → Steffano approves with
`"push"` / `"ok push"` / `"dale"` → only then Claude runs `git push`.
