const ARTICLE_CLASSLIST = 'pa5-l pa3 mt4 bt bg-white b--black-20 lh-copy fade';
const HOME_CLASSLIST = 'pa5-l pa3 fade';


const ELEMENT_CACHE: Map<string, HTMLElement> = new Map();

export async function getArticle(href: string) : Promise<HTMLElement> {

  // cache hit
  if (ELEMENT_CACHE.has(href)) {
    console.log('Cache hit on', href)
    return ELEMENT_CACHE.get(href);
  }

  // not on current page
  const resp = await fetch(href);
  const text = await resp.text();

  const article = text.split(`<article class="${ARTICLE_CLASSLIST}">`)[1].split('</article>')[0];
  const articleElm = document.createElement('article');
  articleElm.innerHTML = article;
  articleElm.classList.add(...ARTICLE_CLASSLIST.split(' '));
  ELEMENT_CACHE.set(href, articleElm);
  return articleElm;
}

export async function getHomeSection(href: string) {

  // cache hit
  if(ELEMENT_CACHE.has(href)) {
    console.log('Cache hit on', href)
    return ELEMENT_CACHE.get(href);
  }

  // on current page
  if(href === window.location.pathname) {
    const homeSection: HTMLElement = document.getElementById('home-section');
    ELEMENT_CACHE.set(href, homeSection);
    return homeSection;
  }

  // not on current page
  const resp = await fetch(href);
  const text = await resp.text();

  const homeSection = text.split(`<section class="${HOME_CLASSLIST}" id="home-section">`)[1].split('</article>')[0];
  const homeSectionElm = document.createElement('section');
  homeSectionElm.classList.add(...HOME_CLASSLIST.split(' '));
  homeSectionElm.id = 'home-section';
  ELEMENT_CACHE.set(href, homeSectionElm);
  return homeSectionElm
}
