(function () {
  const ARTICLES_API_SERVER = "http://localhost:5000";

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

  const hashArticle = article => {
    /**
     * Calculates the hash of a google news <article>.
     *
     * Current hashing strategy: Use google's own redirect url.
     *
     * @param {HTMLElement} article The google news <article>.
     */
    return new URL(article.querySelector("a").href).pathname.replace(/^\/articles\//, "");
  }

  const modifyCl = (cl, position) => {
    let today = new Date().toISOString().slice(0, 10);

    if (Object.keys(cl).length == 0) {
      c = [0, 0, 0]
      c[position]++;
      cl = {
        "i": [
          {
            "d": today,
            "c": c
          }
        ]
      }
    }
    else {
      cl = cl.cl;
      if (cl.i.length > 0) {
        var item = cl.i[cl.i.length - 1];
        if (item.d.localeCompare(today) == 0) {
          item.c[position]++;
          cl.i[cl.i.length - 1] = item;
        }
        else {
          c = [0, 0, 0]
          c[position]++;
          cl.i.push(
            {
              "d": today,
              "c": c // hbu
            }
          );
        }
      }
      else {
        c = [0, 0, 0]
        c[position]++;
        cl.i.push(
          {
            "d": today,
            "c": c // hbu
          }
        )
      }
    }

    browser.storage.local.set({"cl": cl}).then(resp => console.log("Done", resp));
  }

  function onGot(item) {
    console.log("onGot", item);
  }

  const addTo = (position) => {
    browser.storage.local.get("cl").then(item => modifyCl(item, position));
    browser.storage.local.get("cl").then(item => onGot(item));
  }

  const checkBlurArticle = article => {
    /**
     * Queries the sentiment of article and blurs it if bad.
     *
     * @param {HTMLElement} article <article> on google news.
     */
    const articleHash = hashArticle(article),
      url = new URL(`${ARTICLES_API_SERVER}/article/`);

    let shouldBlurArticle = false;

    url.search = new URLSearchParams({
      hash: articleHash,
      publish_date: article.querySelector("time").dateTime
    }).toString();

    fetch(url)
      .then(response => response.json())
      .then(data => {
        switch (data.kind) {
          case "NOT_CLASSIFIED":
            setTimeout(checkBlurArticle, 3000, article);
            break;
          case "BAD":
            shouldBlurArticle = true;
            break;
        }


        if (shouldBlurArticle) {
          // TODO: make blur radius configurable// Blur
          
          // Blur
          article.parentNode.style.filter = "blur(5px)";

          // Add blocking div
          var div = document.createElement("div");
          div.style.zIndex = "100";
          div.style.position = "absolute";
          div.style.top = "0";
          div.style.left = "0";
          div.style.bottom = "0";
          div.style.right = "0";
          div.style.cursor = "pointer";
          div.className = "blocking_div";


          div.addEventListener('click', function(e){
            console.log(e.target);
            article.parentNode.removeChild(e.target);
            
            let subarts = article.parentNode.getElementsByTagName("article");        
            for(i of subarts) {
              i.parentNode.style.filter = "";
              let blocking_divs = i.parentNode.getElementsByClassName("blocking_div");
              for(j of blocking_divs){
                console.log(j);
                j.remove();
              }
            }
          });
          article.parentNode.appendChild(div);
        } else {
          article.className += " link_click";
          const anchors = article.getElementsByTagName("a");
          for (const a of anchors) {
            a.addEventListener('click', _e => {
              addTo(0);
            });
          }
        }
      });
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
