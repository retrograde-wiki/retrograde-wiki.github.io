import * as cheerio from "cheerio";

// Hand-written pages that aren't Eleventy templates (add more here by hand)
const EXTRAS = [
  // { title: "Characters", url: "/characters.html", type: "Page", text: "" },
];

const TYPES = [
  [/\/content\/lore\//, "Lore"],
  [/\/content\/zones\//, "Zone"],
  [/\/content\/characters\//, "Character"],
  [/\/content\/monoliths\//, "Monolith"],
  [/\/content\/institutes\//, "Institute"],
  [/\/content\/networks\//, "Network"],
  [/\/content\/companies\//, "Company"],
  [/\/content\/gallery\//, "Gallery"],
];

function toText(html) {
  const $ = cheerio.load(html || "");
  $("script, style, audio").remove();
  return $.root().text().replace(/\s+/g, " ").trim();
}

function eraText(eras) {
  return (eras || []).map((e) => [e.name, e.subtitle]
    .concat((e.events || []).map((v) => [v.when, v.title, v.text].filter(Boolean).join(" ")))
    .filter(Boolean).join(" ")).join(" ");
}

export default class {
  data() {
    return {
      permalink: "/search-index.json",
      eleventyExcludeFromCollections: true,
    };
  }

  render(data) {
    const out = [];

    for (const item of data.collections.all) {
      const d = item.data;
      if (!item.url || d.hidden || d.draft || d.search === false) continue;
      const title = d.title || d.name;
      if (!title) continue;

      const type = (TYPES.find(([re]) => re.test(item.inputPath)) || [, "Page"])[1];
      out.push({
        title: String(title),
        url: item.url,
        type,
        aliases: d.aliases || [],
        description: d.description || d.subtitle || "",
        text: (toText(item.templateContent) + " " + eraText(d.eras)).slice(0, 30000),
      });
    }

    return JSON.stringify(out.concat(EXTRAS));
  }
}
