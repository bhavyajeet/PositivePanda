from newspaper import Article


def calc_words(line):
    return 1 + line.strip().count(" ")


def get_score(article_hash):

    url = "https://news.google.com/articles/" + str(article_hash)
    article = Article(url)

    article.download()
    article.parse()

    text = article.text
    raw_lines = text.split("\n")
    lines = list(filter(bool, raw_lines))

    # 1 for positive, and 0 for negative
    scores = []

    n_words = 0
    text = ""
    i = 0

    while i != len(lines):
        if calc_words(lines[i]) + n_words > 64:
            # scores += [model(text.strip())]

            print(calc_words(text.strip()))
            print(text.strip())
            text = ""
            n_words = 0
            continue

        if calc_words(lines[i]) > 64:
            i += 1
            continue

        text += lines[i] + " "
        n_words += calc_words(lines[i])
        i += 1

    if sum(scores) > len(scores) / 2:
        print("The article is positive!")
        return 1

    print("The article is negative!")
    return 0


if __name__ == "__main__":
    get_score("CAIiEMPxPiGz20g0UzL4gB9zxK8qGAgEKg8IACoHCAow-8ykCjDv13cwrYPqAQ")
