# jamessparkes.com — Redesign Spec
_2026-06-13_

## Goal

Replace the current card-based single-column portfolio with a two-column file-browser layout: a persistent nav column on the left, a viewer column on the right. Selecting any item in the nav renders its content instantly in the viewer — no modals, no page navigation, no heavy animations.

The aesthetic is refined monospace: Maple Mono throughout, nearly monochrome palette, terminal density, zero decorative chrome.

---

## Layout & Structure

### Desktop (≥ 768px)

Two fixed columns filling the full viewport height:

- **Nav column** — 240px wide, fixed. 1px right border as the only divider. No shadow, no surface card.
- **Viewer column** — fills remaining width. Padded content, no max-width cap.

Nav anatomy (top to bottom):
1. Name (`James Sparkes`) + role (`Product Designer`) in small Maple Mono
2. Section group `INFO` → items: About, CV
3. Section group `WORK` → items: one per visible project from `portfolio.json` (in `order` sequence)
4. Theme toggle at the bottom

Active item state: inverted block — dark background / light text in light mode, light background / dark text in dark mode. No colour accent.

Default selection on load: **About**.

### Mobile (< 768px)

Nav fills the full screen by default. Tapping any item pushes the viewer in from the right (single CSS `transform: translateX`, ≤ 50ms, no easing curve). A back arrow/label in the top-left of the viewer returns to the nav. No hamburger menu — the nav IS the home screen.

---

## Typography

Single font family: **Maple Mono** (self-hosted woff2, sourced from official GitHub releases). No fallback to Inter or any other font — `monospace` stack only as system fallback.

| Role | Size | Weight | Treatment |
|---|---|---|---|
| Nav name | 14px | Medium | — |
| Nav section headers | 11px | Regular | Uppercase, 40% opacity |
| Nav items | 13px | Regular | — |
| Viewer heading | 18px | Medium | — |
| Viewer body | 13px | Regular | 1.6 line-height |
| Tags / meta | 11px | Regular | Uppercase |

---

## Colour & Theming

All colour values live in CSS custom properties on `:root` (light) and `[data-theme="dark"]` (dark). No colour is hardcoded in component styles — components reference tokens only. This makes light/dark switching and palette swaps a single-file change.

### Token set

```css
:root {
  --bg:          #F5F5F0;
  --bg-nav:      #EBEBЕ5;
  --border:      #D0D0C8;
  --text:        #1A1A18;
  --text-dim:    #888880;
  --active-bg:   #1A1A18;
  --active-text: #F5F5F0;
}

[data-theme="dark"] {
  --bg:          #0F0F0E;
  --bg-nav:      #161614;
  --border:      #2A2A28;
  --text:        #E8E8E2;
  --text-dim:    #555550;
  --active-bg:   #E8E8E2;
  --active-text: #0F0F0E;
}
```

Theme toggle sits at the bottom of the nav. Persisted to `localStorage`. `data-theme` attribute set on `<html>`.

---

## Viewer Content Types

### About

Renders the bio text from `data/bio.json` as plain paragraphs. Social links listed below as plain monospace text links — no icons, no button chrome. No avatar. Two links: LinkedIn and Contact (mailto).

### CV

`<iframe>` embedding `James_Sparkes_CV.pdf`, filling the viewer height. A small `download ↓` text link positioned top-right of the viewer for saving the file.

### Project

Rendered from `data/portfolio.json` + the corresponding `case-studies/*.md` file (if present):

1. Project title
2. Tags in uppercase as a tight inline row
3. Description paragraph(s)
4. Images stacked full-width, top to bottom — no carousel, no lightbox. Scrolling is the navigation through images.

---

## Interactions & Animation

- View switches: **instant** — no fade, no slide, no transition on the viewer content.
- Mobile nav push: single `transform: translateX(-100%)` → `translateX(0)`, max 50ms, linear. The only animation in the entire UI.
- No hover animations, no scroll animations, no entrance effects.

---

## Tech Stack

Keep the existing stack:

- **Vanilla JS (ES modules)** — no framework
- **Tailwind CSS v3** — but colour values moved to CSS custom properties rather than Tailwind config values, so theming works without a rebuild
- **Self-hosted Maple Mono** — woff2 files in `/fonts/`, replacing Favorit (which is removed) and Inter (Google Fonts link removed)

Existing data files are unchanged. Case study markdown files are pre-converted to plain HTML fragments offline using pandoc (one-time step), stored as `case-studies/*.html`. No runtime markdown parsing library — `ProjectView` fetches the `.html` directly and injects with `innerHTML`.

---

## What Is Removed

- The card/surface wrapper (`sm:rounded-2xl`, `sm:shadow-light-2xl`, etc.)
- The lightbox modal on the avatar image
- The CV modal (replaced by inline iframe viewer)
- The portfolio detail modal (replaced by inline project viewer)
- The sticky footer
- Favorit font files
- Google Fonts (Inter) `<link>`
- All existing component JS files — rewritten from scratch to match new structure

---

## File Structure (new)

```
index.html
styles/
  tokens.css        ← CSS custom property definitions (light + dark)
  global.css        ← base resets, font-face declarations
  output.css        ← Tailwind compiled output
fonts/
  maple-mono-*.woff2
components/
  Nav.js            ← nav column, item selection logic
  Viewer.js         ← viewer shell, delegates to view renderers
  views/
    AboutView.js
    CVView.js
    ProjectView.js
js/
  theme.js          ← localStorage + data-theme toggle
  router.js         ← selection state, URL hash sync
data/
  bio.json
  portfolio.json
case-studies/
  *.md
```
