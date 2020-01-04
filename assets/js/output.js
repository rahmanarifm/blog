System.register("fetch_service", [], function (exports_1, context_1) {
    "use strict";
    var ARTICLE_CLASSLIST, HOME_CLASSLIST, ELEMENT_CACHE;
    var __moduleName = context_1 && context_1.id;
    async function getArticle(href) {
        if (ELEMENT_CACHE.has(href)) {
            console.log('Cache hit on', href);
            return ELEMENT_CACHE.get(href);
        }
        const resp = await fetch(href);
        const text = await resp.text();
        const article = text.split(`<article class="${ARTICLE_CLASSLIST}">`)[1].split('</article>')[0];
        const articleElm = document.createElement('article');
        articleElm.innerHTML = article;
        articleElm.classList.add(...ARTICLE_CLASSLIST.split(' '));
        ELEMENT_CACHE.set(href, articleElm);
        return articleElm;
    }
    exports_1("getArticle", getArticle);
    async function getHomeSection(href) {
        if (ELEMENT_CACHE.has(href)) {
            console.log('Cache hit on', href);
            return ELEMENT_CACHE.get(href);
        }
        if (href === window.location.pathname) {
            const homeSection = document.getElementById('home-section');
            ELEMENT_CACHE.set(href, homeSection);
            return homeSection;
        }
        const resp = await fetch(href);
        const text = await resp.text();
        const homeSection = text.split(`<section class="${HOME_CLASSLIST}" id="home-section">`)[1].split('</article>')[0];
        const homeSectionElm = document.createElement('section');
        homeSectionElm.classList.add(...HOME_CLASSLIST.split(' '));
        homeSectionElm.id = 'home-section';
        ELEMENT_CACHE.set(href, homeSectionElm);
        return homeSectionElm;
    }
    exports_1("getHomeSection", getHomeSection);
    return {
        setters: [],
        execute: function () {
            ARTICLE_CLASSLIST = 'pa5-l pa3 mt4 b--black-20 lh-copy fade';
            HOME_CLASSLIST = 'pa5-l pa3 fade';
            ELEMENT_CACHE = new Map();
        }
    };
});
System.register("utils", [], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    async function hold(time) {
        return new Promise(res => setTimeout(res, time));
    }
    exports_2("hold", hold);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("main", ["fetch_service", "utils"], function (exports_3, context_3) {
    "use strict";
    var fetch_service_1, utils_1, WAIT_TIME, MAIN_DIV;
    var __moduleName = context_3 && context_3.id;
    async function handleArticleTransition(evt) {
        evt.preventDefault();
        let homeSection = await fetch_service_1.getHomeSection(window.location.pathname);
        let target = evt.target;
        homeSection.classList.add('o-0');
        let [article] = await Promise.all([fetch_service_1.getArticle(target.href), utils_1.hold(WAIT_TIME)]);
        article.classList.add('o-0');
        homeSection.parentNode.removeChild(homeSection);
        MAIN_DIV.appendChild(article);
        await utils_1.hold(WAIT_TIME);
        article.classList.remove('o-0');
        window.history.pushState({}, '', target.href);
        window.addEventListener('popstate', createBackButton(article, homeSection));
    }
    async function handeHomePageNavigation(evt) {
        evt.preventDefault();
    }
    function createBackButton(prevElm, nextElm) {
        return async function listener(evt) {
            evt.preventDefault();
            prevElm.classList.add('o-0');
            await utils_1.hold(WAIT_TIME);
            prevElm.parentNode.removeChild(prevElm);
            MAIN_DIV.appendChild(nextElm);
            await utils_1.hold(WAIT_TIME);
            nextElm.classList.remove('o-0');
            window.removeEventListener('popstate', listener);
        };
    }
    function attatchEventHandlers() {
        Array.prototype.forEach.call(document.getElementsByClassName('js-article-link'), (elm) => elm.addEventListener('click', handleArticleTransition));
    }
    exports_3("attatchEventHandlers", attatchEventHandlers);
    return {
        setters: [
            function (fetch_service_1_1) {
                fetch_service_1 = fetch_service_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            }
        ],
        execute: function () {
            WAIT_TIME = 250;
            MAIN_DIV = document.getElementById('main-div');
            ;
            attatchEventHandlers();
        }
    };
});
//# sourceMappingURL=output.js.map