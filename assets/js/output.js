System.register("fetch_service", [], function (exports_1, context_1) {
    "use strict";
    var ARTICLE_CLASSLIST, articleCache;
    var __moduleName = context_1 && context_1.id;
    async function getArticle(href, isHidden = true) {
        if (articleCache.has(href)) {
            return articleCache.get(href);
        }
        const resp = await fetch(href);
        const text = await resp.text();
        const article = text.split(`<article class="${ARTICLE_CLASSLIST}">`)[1].split('</article>')[0];
        const articleElm = document.createElement('article');
        articleElm.innerHTML = article;
        articleElm.classList.add(...ARTICLE_CLASSLIST.split(' '), 'fade', 'o-0');
        articleCache.set(href, articleElm);
        return articleElm;
    }
    exports_1("getArticle", getArticle);
    return {
        setters: [],
        execute: function () {
            ARTICLE_CLASSLIST = 'pa5-l pa3 mt4 bt bg-white b--black-20 lh-copy';
            articleCache = new Map();
        }
    };
});
System.register("utils", [], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    async function hold(time) {
        return new Promise(res => {
            setTimeout(res, time);
        });
    }
    exports_2("hold", hold);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("main", ["utils", "fetch_service"], function (exports_3, context_3) {
    "use strict";
    var utils_1, fetch_service_1, WAIT_TIME, MAIN_DIV;
    var __moduleName = context_3 && context_3.id;
    async function handleArticleTransition(evt) {
        evt.preventDefault();
        let homeSection = document.getElementById('home-section');
        let target = evt.target;
        homeSection.classList.add('o-0');
        let [article] = await Promise.all([fetch_service_1.getArticle(target.href), utils_1.hold(WAIT_TIME)]);
        homeSection.parentNode.removeChild(homeSection);
        MAIN_DIV.appendChild(article);
        await utils_1.hold(WAIT_TIME);
        article.classList.remove('o-0');
        window.history.pushState({}, '', target.href);
        window.addEventListener('popstate', createBackButton(article, homeSection));
    }
    function createBackButton(prevElm, nextElm) {
        return async function listener(evt) {
            prevElm.classList.add('o-0');
            await utils_1.hold(WAIT_TIME);
            prevElm.parentNode.removeChild(prevElm);
            MAIN_DIV.appendChild(nextElm);
            await utils_1.hold(WAIT_TIME);
            nextElm.classList.remove('o-0');
            window.removeEventListener('popstate', listener);
        };
    }
    function attatchArticleEventHandlers() {
        Array.prototype.forEach.call(document.getElementsByClassName('js-article-link'), (elm) => elm.addEventListener('click', handleArticleTransition));
    }
    exports_3("attatchArticleEventHandlers", attatchArticleEventHandlers);
    return {
        setters: [
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (fetch_service_1_1) {
                fetch_service_1 = fetch_service_1_1;
            }
        ],
        execute: function () {
            WAIT_TIME = 250;
            MAIN_DIV = document.getElementById('main-div');
            ;
            attatchArticleEventHandlers();
        }
    };
});
//# sourceMappingURL=output.js.map