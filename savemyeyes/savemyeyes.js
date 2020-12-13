(function () {
  const onReady = f => {
    /**
     * Wait for the page to load and then run a function.
     *
     * @param {function} f The function to run when document becomes ready.
     */

    /(?:uninitialized|loading)/.test(document.readyState) ? setTimeout(onReady, 9, f) : f()
  };

  const findArticles = (rootNode = document) => {
    /**
     * Find all <article>s inside a node.
     *
     * @param {HTMLElement} rootNode The node inside which <article>s are to be found, defaults to document.
     */
    return rootNode.querySelectorAll("article")
  };

  const checkBlurArticle = article => {
    /**
     * Queries the sentiment of article and blurs it if bad.
     *
     * @param {HTMLElement} article <article> on google news.
     */
    // TODO: query server for this
    let shouldBlurArticle = true;

    if (shouldBlurArticle) {
      // TODO: make blur radius configurable
      article.parentNode.style.filter = "blur(5px)";
    }
  };

  const checkNewArticles = (mutationList, _observer) => {
    /**
     * MutationObserver callback to check for new articles.
     *
     * @param            {Array} mutationList List of mutations returned by observer.
     * @param {MutationObserver}    _observer The MutationObserver.
     */

    // for each mutation of type childList
    mutationList.filter(mutation => mutation.type == "childList")
      // for each node which got added
      .forEach(mutation => mutation.addedNodes
        // find articles inside it and check for blurring
        .forEach(node =>
          findArticles(node).forEach(checkBlurArticle)));
  };

  const main = () => {
    /**
     * Main workflow - what happens when this extension loads
     */

    // find all <article>s currently loaded and blur them
    findArticles().forEach(checkBlurArticle);

    // check for new articles when they enter DOM
    new MutationObserver(checkNewArticles).observe(document.body, {childList: true, subtree: true});
  }

  onReady(main);
})();
