const populateTop5 = items => {
  console.log("BOOOOOOO")
  var news = document.getElementById("news-articles");

  for (var i = 0; i < items.length; i++) {
    var anchor = document.createElement("a");
    anchor.href = items[i].url;
    anchor.target = "_blank";

    var row = document.createElement("div");
    row.className = "row";

    var content_col = document.createElement("div");
    content_col.className = "content-col";

    var img_col = document.createElement("div");
    img_col.className = "img-col";


    var h3 = document.createElement("h3");
    h3.innerHTML = items[i].title;

    var img = document.createElement("img");
    img.src = items[i].image;
    img.className = "image"

    var desc = document.createElement("p");
    desc.innerHTML = items[i].description.substr(0, 150) + "...";

    content_col.appendChild(h3);
    content_col.append(desc);

    img_col.appendChild(img);

    row.appendChild(content_col);
    row.appendChild(img_col);
    anchor.appendChild(row);
    news.appendChild(anchor);
  }
}

fetch("http://localhost:5000/article/top5")
  .then(resp => resp.json())
  .then(populateTop5);
