import { hold } from './utils'
import { getArticle } from 'fetch_service'

const WAIT_TIME: number = 250;
const MAIN_DIV: HTMLElement = document.getElementById('main-div');

async function handleArticleTransition(evt: Event) {
  evt.preventDefault()

  let homeSection: HTMLElement = document.getElementById('home-section');
  let target = <HTMLAnchorElement> evt.target;

  homeSection.classList.add('o-0');
  let [ article ] = await Promise.all([getArticle(target.href), hold(WAIT_TIME)]);

  homeSection.parentNode.removeChild(homeSection);
  MAIN_DIV.appendChild(article);

  await hold(WAIT_TIME);

  article.classList.remove('o-0');
  window.history.pushState({}, '', target.href);

  window.addEventListener('popstate', createBackButton(article, homeSection));
};

function createBackButton(prevElm: HTMLElement, nextElm: HTMLElement) {

  return async function listener(evt: Event) {
    prevElm.classList.add('o-0');
    await hold(WAIT_TIME);

    prevElm.parentNode.removeChild(prevElm);
    MAIN_DIV.appendChild(nextElm);
    await hold(WAIT_TIME);

    nextElm.classList.remove('o-0');
    window.removeEventListener('popstate', listener)
  }
}


export function attatchArticleEventHandlers() {
  Array.prototype.forEach.call(
    document.getElementsByClassName('js-article-link'),
    (elm: HTMLElement) => elm.addEventListener('click', handleArticleTransition)
  );
}


attatchArticleEventHandlers();
