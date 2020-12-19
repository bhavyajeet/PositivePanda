from bs4 import BeautifulSoup
import urllib


def link_preview(link):
    url = urllib.request.urlopen(link).geturl()
    webpage = urllib.request.urlopen(url).read()

    soup = BeautifulSoup(webpage, features="lxml")

    title = soup.find("meta", property="og:title", content=True)
    if title is None:
        title = soup.find("meta", property="title", content=True)

    img = soup.find("meta", property="og:image", content=True)
    if img is None:
        img = soup.find("meta", property="image", content=True)

    desc = soup.find("meta", property="og:description", content=True)
    if desc is None:
        desc = soup.find("meta", property="description", content=True)

    if img is not None:
        img = img["content"]
    if desc is not None:
        desc = desc["content"]
    if title is not None:
        title = title["content"]
    if title is None:
        title = soup.find("h1").text

    return dict(title=title, image=img, description=desc)
