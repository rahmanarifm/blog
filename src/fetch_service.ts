const ARTICLE_CLASSLIST = 'pa5-l pa3 mt4 bt bg-white b--black-20 lh-copy';

const articleCache: Map<string, HTMLElement> = new Map();

export async function getArticle(href: string, isHidden = true) : Promise<HTMLElement> {
  if (articleCache.has(href)) {
    return articleCache.get(href);
  }
  const resp = await fetch(href);
  const text = await resp.text();

  const article = text.split(`<article class="${ARTICLE_CLASSLIST}">`)[1].split('</article>')[0];
  const articleElm = document.createElement('article');

  articleElm.innerHTML = article;
  articleElm.classList.add(...ARTICLE_CLASSLIST.split(' '), 'fade', 'o-0',);

  articleCache.set(href, articleElm);
  return articleElm;
}
