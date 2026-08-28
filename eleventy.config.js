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

  // Flat collection of all lore pages (including subfolders, if you use
  // them), A-Z. Pages with hideFromIndex:true still build normally —
  // they're just skipped when the /lore/ index loops over this list.
  eleventyConfig.addCollection("lore", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/lore/**/*.md").sort((a, b) =>
      a.data.title.localeCompare(b.data.title)
    );
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
