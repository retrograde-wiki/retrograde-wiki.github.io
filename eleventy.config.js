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

  // Collection of all lore pages, sorted alphabetically like a wiki index
  eleventyConfig.addCollection("lore", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/lore/*.md").sort((a, b) =>
      a.data.title.localeCompare(b.data.title)
    );
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
