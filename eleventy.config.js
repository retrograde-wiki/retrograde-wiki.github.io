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
