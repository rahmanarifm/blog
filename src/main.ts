import { getArticle, getHomeSection } from './fetch_service'
import { hold } from './utils'

const WAIT_TIME: number = 250;
const MAIN_DIV: HTMLElement = document.getElementById('main-div');


async function handleArticleTransition(evt: Event) {
  evt.preventDefault()

  let homeSection: HTMLElement = await getHomeSection(window.location.pathname);
  let target = <HTMLAnchorElement> evt.target;

  homeSection.classList.add('o-0');
  let [ article ] = await Promise.all([getArticle(target.href), hold(WAIT_TIME)]);
  article.classList.add('o-0')
  homeSection.parentNode.removeChild(homeSection);
  MAIN_DIV.appendChild(article);

  await hold(WAIT_TIME);

  article.classList.remove('o-0');
  window.history.pushState({}, '', target.href);

  window.addEventListener('popstate', createBackButton(article, homeSection));
};


async function handeHomePageNavigation(evt: Event) {
  evt.preventDefault();

}

function createBackButton(prevElm: HTMLElement, nextElm: HTMLElement) {

  return async function listener(evt: Event) {
    evt.preventDefault();

    prevElm.classList.add('o-0');
    await hold(WAIT_TIME);

    prevElm.parentNode.removeChild(prevElm);
    MAIN_DIV.appendChild(nextElm);
    await hold(WAIT_TIME);

    nextElm.classList.remove('o-0');
    window.removeEventListener('popstate', listener)
  }
}


export function attatchEventHandlers() {
  Array.prototype.forEach.call(
    document.getElementsByClassName('js-article-link'),
    (elm: HTMLElement) => elm.addEventListener('click', handleArticleTransition)
  );

}



attatchEventHandlers();
