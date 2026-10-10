# Retrograde

Worldbuilding site. Built with Eleventy 3, hosted on Neocities.
Source is in `src/`, the built site goes to `_site/`. Never edit `_site`.

## Running it

```

npx eleventy --serve
# dev server, localhost:8080

npx eleventy
# one-off build

```

Restart the server after changing `eleventy.config.js` or adding a file to `_data/`.
If something looks off or strange: `rm -rf _site` and start again.

I use fish as my terminal. If a command I write doesnt work, switch to bash.

## Folders

```
src/
  _data/            data files (htmlpages.js, updates.js)
  
  _includes/
    layouts/        lore, zone, character, monolith, gallerypage
    updates.md      the update box on the home page
    
  assets/
    style/          
    im/             all images
    
  content/          <<< WRITE STUFF HERE
    lore/ zones/ characters/ gallery/
    monoliths/ institutes/ networks/ companies/
    
  pages/            one-off pages (about, meta, index, sitemap)
    directories/    zones, monoliths, organizations, gallery lists
    
  root/             copied to the top of the site as-is
                    
eleventy.config.js
```

`assets/style` goes out as `/style`, `assets/im` as `/im`, `root/` as the site root.
So pages link to `/style/style.css` and `/im/whatever.png`, not the src paths.

## Adding things

Each content folder has a `.json` file that sets its layout, tag and url. A page is just a markdown file with front matter.

Every `template.md` has `permalink: false` so it doesn't get published. Copy it, then DELETE that line in the copy.

`permalink: true` is not valid, Eleventy errors on it.

- Lore: copy `content/lore/template.md`. Needs `title` and `category` (the category text is the heading on the lore index, spelling has to match).
- Zone: copy `content/zones/template.md`. Needs `name`, `description` and a `thumb` for the zone list.
- Monolith / institute / network / company: copy `template.md` in that folder. Monoliths also need `num`, kept in quotes ("17").
- Character: copy `content/characters/dallas.md`.
- Gallery category: copy a file in `content/gallery/`, images go in the front matter list.
- Home page update: add a `# date` section to the top of `_includes/updates.md`.

## Front matter / Properties

```
hidden: true      leave off lists and sitemap (page still exists)
draft: true       shows in --serve, not in a real build
toc: true         contents box (lore, monolith pages)
collapse: true    ### headings become closed toggles (on by default for lore and organizations)
updated: "10/09/26"
arc: green        accent colour (grey red orange yellow green blue teal purple)
aliases: [a, b]   extra words that autolink to this page
autolink: false   nothing links to this page
```

Quote dates and numbers or yaml turns them into other things.

## Autolinking

A build step in `eleventy.config.js` (search "Auto-linking") links the first mention of any lore, zone or organization name on those pages. Case sensitive. Settings are the constants at the top of that block. Wrap text in `<span class="nolink">` to skip it.

## Other stuff

- Colors are all variables. One block per theme in `style/themes.css`. New theme = new block there plus a line in `THEMES` in `header.js`. No hex codes in style.css.
- Header, nav, theme button and click/hover sound hooks: `root/header.js` and `style/hover.js`.
- Music: song list is at the top of `style/player.js`. mp3s are on File Garden.
- Sitemap builds itself. Old html pages are found by scanning `src/root`; add `<meta name="robots" content="noindex">` to hide one.

## Search

Search index is built by pages/search-index.11ty.js, the script is style/search.js, and search: false hides a page.

## Deploying

Upload the contents of `_site/` to Neocities.

Adding a better deploy method soon
