/*
div {
  -webkit-filter: blur(5px);
  -moz-filter: blur(5px);
  -o-filter: blur(5px);
  -ms-filter: blur(5px);
  filter: blur(5px);
}
*/

const articles = document.querySelectorAll("article");
for (const article of articles) {
  article.parentNode.style.filter = "blur(5px)";
}

const blurIt = (mutList, _obs) => {
  for (const mut of mutList) {
    if (mut.type == "childList") {
      for (const node of mut.addedNodes) {
        const articles = node.querySelectorAll("article");
        for (const article of articles) {
          article.parentNode.style.filter = "blur(5px)";
        }
      }
    }
  }
}

let m = new MutationObserver(blurIt);
m.observe(document.body, {childList: true, subtree: true});
