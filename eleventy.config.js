import * as cheerio from "cheerio";
import markdownIt from "markdown-it";

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    "src/assets/im": "im",
    "src/assets/style": "style",
    "src/root": ".",
  });
  const LINK_SOURCES = /^\.\/src\/content\/(lore|monoliths|zones|institutes|networks|companies)\//; // pages that GET links
  const LINK_TARGET_TAGS = ["lore", "monoliths", "zones", "institutes", "networks", "companies"]; // pages that can be linked TO
  const FIRST_MENTION_ONLY = true; // false = link every mention
  const SKIP_TAGS = new Set(["a", "h1", "h2", "h3", "h4", "h5", "h6", "script", "style",
    "button", "textarea", "code", "pre", "summary", "select", "option", "figcaption"]);

  let LINK_TERMS = { map: new Map(), regex: null };

  eleventyConfig.addCollection("autolinkTerms", (api) => {
    const map = new Map();
    api.getAll().forEach((item) => {
      const d = item.data;
      if (!item.url || item.url.endsWith("/index.html")) return;
      if (d.hidden || d.autolink === false) return;
      const tags = [].concat(d.tags || []);
      if (!tags.some((t) => LINK_TARGET_TAGS.includes(t))) return;

      const names = [d.title, d.name].concat(d.aliases || []).filter(Boolean);
      names.forEach((n) => {
        const key = String(n).trim();
        if (!key) return;
        if (map.has(key) && map.get(key).url !== item.url) {
          console.warn("[autolink] '" + key + "' is used by two pages, keeping " + map.get(key).url);
          return;
        }
        map.set(key, { url: item.url });
      });
    });

    const terms = [...map.keys()].sort((a, b) => b.length - a.length);
    const esc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    LINK_TERMS = {
      map,
      regex: terms.length
        ? new RegExp("(?<![\\p{L}\\p{N}])(" + terms.map(esc).join("|") + ")(?![\\p{L}\\p{N}])", "gu")
        : null,
    };
    console.log("[autolink] " + terms.length + " link terms");
    return [];
  });

  eleventyConfig.addTransform("autolink", function (content) {
    const page = this.page;
    if (!page.outputPath || !page.outputPath.endsWith(".html")) return content;
    if (!LINK_SOURCES.test(page.inputPath || "")) return content;
    if (!LINK_TERMS.regex) return content;

    const $ = cheerio.load(content);
    const linked = new Set();
    let changed = false;
    const escHtml = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    function replaceText(node) {
      const text = node.data;
      let out = "", last = 0, hit = false;
      for (const m of text.matchAll(LINK_TERMS.regex)) {
        const t = LINK_TERMS.map.get(m[1]);
        if (!t || t.url === page.url) continue;
        if (FIRST_MENTION_ONLY && linked.has(t.url)) continue;
        linked.add(t.url);
        out += escHtml(text.slice(last, m.index)) +
          '<a class="autolink" href="' + t.url + '">' + escHtml(m[0]) + "</a>";
        last = m.index + m[0].length;
        hit = true;
      }
      if (hit) {
        out += escHtml(text.slice(last));
        $(node).replaceWith(out);
        changed = true;
      }
    }

    function walk(el) {
      [...(el.children || [])].forEach((child) => {
        if (child.type === "text") replaceText(child);
        else if (child.type === "tag") {
          if (SKIP_TAGS.has(child.name)) return;
          if (/\bnolink\b/.test((child.attribs && child.attribs.class) || "")) return;
          walk(child);
        }
      });
    }

    $(".lore-section, .mono-body, .zone-body").each(function () {
      $(this).find("a[href]").each(function () { linked.add($(this).attr("href")); });
      walk(this);
    });

    return changed ? $.html() : content;
  });

  eleventyConfig.addFilter("groupByCategory", (items, order = []) => {
    const groups = {};
    items.filter((i) => !i.data.hidden).forEach((i) => {
      const name = i.data.category || "Other";
      (groups[name] = groups[name] || []).push(i);
    });
    const byPage = (a, b) =>
      (a.data.order ?? 999) - (b.data.order ?? 999) ||
      String(a.data.title).localeCompare(String(b.data.title));
    const names = Object.keys(groups).sort((a, b) => {
      const ia = order.indexOf(a), ib = order.indexOf(b);
      if (ia !== -1 || ib !== -1) return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
      if (a === "Other") return 1;
      if (b === "Other") return -1;
      return a.localeCompare(b);
    });
    return names.map((name) => ({ name, items: groups[name].sort(byPage) }));
  });




  eleventyConfig.addWatchTarget("src/_includes/updates.md");


  eleventyConfig.setLibrary("md", markdownIt({
    html: true,
    breaks: true,
    linkify: true,
  }));

  return {
    templateFormats: ["njk", "md", "11ty.js"],
    dir: { input: "src", output: "_site" },
  };
}
