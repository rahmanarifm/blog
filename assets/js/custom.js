'use strict'

const WAIT_TIME = 250;
const ARTICLE_CLASSLIST = 'pa5-l pa3 mt4 bg-near-white b--black-20 lh-copy';
const fullDiv = document.getElementById('full-div');

async function handleArticleTransition(evt) {
  evt.preventDefault();
  let homeSection = document.getElementById('home-section');
  homeSection.classList.add('o-0');
  setTimeout(() => homeSection.parentNode.removeChild(homeSection), WAIT_TIME);
  let resp = await fetch(evt.target.href)
  let text = await resp.text();
  let article = text.split(`<article class="${ARTICLE_CLASSLIST}">`)[1].split('</article>');
  let articleElm = document.createElement('article');
  articleElm.innerHTML = article;
  articleElm.classList.add(...ARTICLE_CLASSLIST.split(' '), 'fade', 'o-0',);
  fullDiv.appendChild(articleElm);
  setTimeout(() => articleElm.classList.remove('o-0'), WAIT_TIME);
  history.pushState({}, '', evt.target.href);
  window.addEventListener('popstate', function (e) {
    articleElm.classList.add('o-0');
    setTimeout(() => {
      articleElm.parentNode.removeChild(articleElm);
      fullDiv.appendChild(homeSection);
      setTimeout(() => homeSection.classList.remove('o-0'), WAIT_TIME)
    }, WAIT_TIME)
  });
};



Array.prototype.forEach.call(document.getElementsByClassName('js-article-link'),
  elm => elm.addEventListener('click', handleArticleTransition))
