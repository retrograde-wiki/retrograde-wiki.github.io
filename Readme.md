# Retrograde

Static site built with [Eleventy](https://www.11ty.dev/), deployed via GitHub Actions to GitHub Pages.

## Running locally

```
npm install
npm start          # dev server, localhost:8080
npm run build      # builds to _site/
```

`_site/` is gitignored — it's generated fresh by the Actions workflow on every push, never committed.

## Structure

```
eleventy.config.js       # collections, filters, build config
src/
  _includes/layouts/     # page templates
  _data/                 # site.json (nav), palette.json (theme colors)
  css/                   # one file per section, see below
  js/
  im/                    # images
  characters/*.md        # character dossiers
  monoliths/*.md         # megacorp dossiers
  zones/*.md             # district pages
  lore/*.md              # lore articles, folders allowed for organization
  *.html                 # top-level pages (index, about, characters, etc.)
```

## Content types

Each type is a folder of markdown files plus a matching layout in `_includes/layouts/`. Front matter drives the page; layout `.md` files can also have their own front matter that cascades down (e.g. `character.njk` sets `extraCss` so any character page picks it up automatically).

- **Characters** (`characters/*.md`, `character.njk`) — stats, meters, likes/dislikes, relationships, quotes. See `example-character.md` for the full schema.
- **Monoliths** (`monoliths/*.md`, `monolith.njk`) — basics stat strip + free-form markdown body.
- **Zones** (`zones/*.md`, `zone.njk`) — number/population/geography stats + markdown body + optional image gallery.
- **Lore** (`lore/*.md`, `lore.njk`) — plain readable articles. `icon:` sets the icon shown on `/lore/`. `hideFromIndex: true` keeps a page off the index while still building it normally (for pages only meant to be reached via another page's links).
- **Box lists** (`boxlist.njk`) — a manually-curated grid of link cards. Used for e.g. Ancestral Peoples linking out to Talora/Vojari. Front matter takes a `boxes:` list of `{ title, url, icon }`; the markdown body is an optional intro paragraph above the grid.

Index pages (`characters.html`, `monoliths.html`, `zones.html`, `lore.html`) loop over Eleventy collections defined in `eleventy.config.js` — new content files show up automatically, nothing to register by hand.

## Icons

Any `icon:` front matter field takes a Font Awesome solid icon name, e.g. `fa-flask`. Browse names at fontawesome.com/search (filter to Free + Solid — that's the only set loaded on this site).

## Styling

- `style.css` — base layout, header, ticker, color variables.
- `themes.css` — the four theme presets (dark-1/2, light-1/2), each overriding background/text/accent variables via `[data-theme]`.
- `prose.css` — shared typography (headings, lists, links, bold) for any element with `class="prose"`. Edit here to change how markdown content looks everywhere at once.
- `characters.css`, `lore.css`, `monoliths.css`, `zones-index.css`, `about.css` — layout specific to each section (grids, stat strips, card styling).

Theme switching is a `<select>` in the header, backed by `localStorage` and a `data-theme` attribute on `<html>`, set by an inline script in `<head>` before paint to avoid a flash of the wrong theme.

## Deploying

Push to `main` — GitHub Actions builds with Eleventy and deploys to Pages automatically. Check the Actions tab if a change doesn't show up; nothing deploys without a successful workflow run.
