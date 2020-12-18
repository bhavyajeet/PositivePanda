var data = {
  "items": [
    {
      "title": "Open Graph protocol",
      "url": "https://ogp.me/",
      "image": "https://ogp.me/logo.png",
      "description": "The Open Graph protocol enables any web page to become a rich object in a social graph."
    },
    {
      "title": "Build and deploy a scalable website preview service on AWS Lambda in under 15 mins.",
      "url": "https://mustansirzia.com/posts/link-preview/",
      "image": "",
      "description": "Build and deploy a scalable website preview service using Node.js, Express.js, memory-cache and Up within 15 mins.\nWhat is it that we’ll be making? • A RESTful API service (a microservice) that will take in a website URL and reply with its title, description, a thumbnail preview of the first image found on the website along with the site name. Scrapping will be done using nunkisoftware/link-preview. It will be serverless and will run on AWS Lambda as a FaaS."
    },
    {
      "title": "Open Graph protocol",
      "url": "https://ogp.me/",
      "image": "https://ogp.me/logo.png",
      "description": "The Open Graph protocol enables any web page to become a rich object in a social graph."
    },
    {
      "title": "Open Graph protocol",
      "url": "https://ogp.me/",
      "image": "https://ogp.me/logo.png",
      "description": "The Open Graph protocol enables any web page to become a rich object in a social graph."
    },
    {
      "title": "Open Graph protocol",
      "url": "https://ogp.me/",
      "image": "https://ogp.me/logo.png",
      "description": "The Open Graph protocol enables any web page to become a rich object in a social graph."
    }
  ]
};

// var response = await fetch("localhost:3000/top5");
// var data = response.json;


var news = document.getElementById("news-articles");
var items = data.items;

for (var i = 0; i < items.length; i++) {
  var anchor = document.createElement("a");
  anchor.href = items[i].url;

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
