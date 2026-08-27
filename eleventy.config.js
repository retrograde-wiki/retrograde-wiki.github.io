module.exports = function (eleventyConfig) {

  // Static passthroughs — copied to _site untouched
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/im");

  // Collection of all character pages, sorted alphabetically by title
  eleventyConfig.addCollection("characters", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/characters/*.md").sort((a, b) =>
      a.data.title.localeCompare(b.data.title)
    );
  });

  // Collection of all monolith pages, sorted alphabetically by title
  eleventyConfig.addCollection("monoliths", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/monoliths/*.md").sort((a, b) =>
      a.data.title.localeCompare(b.data.title)
    );
  });

  // Collection of all zone pages, sorted numerically by zone number
  eleventyConfig.addCollection("zones", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/zones/*.md").sort((a, b) =>
      parseInt(a.data.number, 10) - parseInt(b.data.number, 10)
    );
  });

  const path = require("path");

  // Flat collection of all lore pages (including subfolders), A-Z
  eleventyConfig.addCollection("lore", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/lore/**/*.md").sort((a, b) =>
      a.data.title.localeCompare(b.data.title)
    );
  });

  // Shared grouping logic — a page directly in src/lore/ has no group;
  // a page in src/lore/culture/ groups under "culture". Pages with
  // hideFromIndex:true are skipped entirely.
  function groupLorePages(collectionApi) {
    const items = collectionApi.getFilteredByGlob("src/lore/**/*.md")
      .filter((item) => !item.data.hideFromIndex);

    const groups = {};
    items.forEach((item) => {
      const rel = path.relative(path.join(process.cwd(), "src/lore"), item.inputPath);
      const parts = rel.split(path.sep);
      const category = parts.length > 1 ? parts[0] : null;
      const key = category || "__top__";
      if (!groups[key]) groups[key] = { category, pages: [] };
      groups[key].pages.push(item);
    });

    Object.values(groups).forEach((g) =>
      g.pages.sort((a, b) => a.data.title.localeCompare(b.data.title))
    );

    return Object.values(groups).sort((a, b) => {
      if (!a.category) return -1;
      if (!b.category) return 1;
      return a.category.localeCompare(b.category);
    });
  }

  // All groups, including the ungrouped ("__top__" -> category:null) one —
  // used to list standalone top-level pages on the /lore/ index.
  eleventyConfig.addCollection("loreGrouped", (collectionApi) => {
    return groupLorePages(collectionApi);
  });

  // Categorized groups only (no null-category group) — this collection is
  // what lore-category.njk paginates over to auto-generate one listing
  // page per category folder.
  eleventyConfig.addCollection("loreCategories", (collectionApi) => {
    return groupLorePages(collectionApi).filter((g) => g.category);
  });

  // Turns a page's URL into breadcrumb segments. Each segment links
  // out only if a real page exists at that URL (checked against every
  // generated page) — so a bare folder like /lore/culture/ shows as
  // plain text unless you later add an actual overview page there.
  eleventyConfig.addFilter("breadcrumbs", (url, allPages) => {
    const parts = url.split("/").filter(Boolean);
    const knownUrls = new Set((allPages || []).map((p) => p.url));
    let built = "";
    return parts.map((part, i) => {
      built += "/" + part + "/";
      return {
        label: part.replace(/-/g, " "),
        url: built,
        isLast: i === parts.length - 1,
        exists: knownUrls.has(built)
      };
    });
  });

  // Collection of homepage updates, newest first. Each is a standalone
  // markdown file with permalink:false, so it never gets its own page —
  // it only exists to feed the homepage's update panel.
  eleventyConfig.addCollection("updates", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/updates/*.md").sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addFilter("shortDate", (date) =>
    new Intl.DateTimeFormat("en-US", { month: "2-digit", day: "2-digit", year: "2-digit" }).format(date)
  );

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    // lets you write .html source files and still get Nunjucks templating
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
