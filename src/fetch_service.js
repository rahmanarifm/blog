"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var ARTICLE_CLASSLIST = 'pa5-l pa3 mt4 bt bg-white b--black-20 lh-copy fade';
var HOME_CLASSLIST = 'pa5-l pa3 fade';
var ELEMENT_CACHE = new Map();
function getArticle(href) {
    return __awaiter(this, void 0, void 0, function () {
        var resp, text, article, articleElm;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    // cache hit
                    if (ELEMENT_CACHE.has(href)) {
                        console.log('Cache hit on', href);
                        return [2 /*return*/, ELEMENT_CACHE.get(href)];
                    }
                    return [4 /*yield*/, fetch(href)];
                case 1:
                    resp = _b.sent();
                    return [4 /*yield*/, resp.text()];
                case 2:
                    text = _b.sent();
                    article = text.split("<article class=\"" + ARTICLE_CLASSLIST + "\">")[1].split('</article>')[0];
                    articleElm = document.createElement('article');
                    articleElm.innerHTML = article;
                    (_a = articleElm.classList).add.apply(_a, ARTICLE_CLASSLIST.split(' '));
                    ELEMENT_CACHE.set(href, articleElm);
                    return [2 /*return*/, articleElm];
            }
        });
    });
}
exports.getArticle = getArticle;
function getHomeSection(href) {
    return __awaiter(this, void 0, void 0, function () {
        var homeSection_1, resp, text, homeSection, homeSectionElm;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    // cache hit
                    if (ELEMENT_CACHE.has(href)) {
                        console.log('Cache hit on', href);
                        return [2 /*return*/, ELEMENT_CACHE.get(href)];
                    }
                    // on current page
                    if (href === window.location.pathname) {
                        homeSection_1 = document.getElementById('home-section');
                        ELEMENT_CACHE.set(href, homeSection_1);
                        return [2 /*return*/, homeSection_1];
                    }
                    return [4 /*yield*/, fetch(href)];
                case 1:
                    resp = _b.sent();
                    return [4 /*yield*/, resp.text()];
                case 2:
                    text = _b.sent();
                    homeSection = text.split("<section class=\"" + HOME_CLASSLIST + "\" id=\"home-section\">")[1].split('</article>')[0];
                    homeSectionElm = document.createElement('section');
                    (_a = homeSectionElm.classList).add.apply(_a, HOME_CLASSLIST.split(' '));
                    homeSectionElm.id = 'home-section';
                    ELEMENT_CACHE.set(href, homeSectionElm);
                    return [2 /*return*/, homeSectionElm];
            }
        });
    });
}
exports.getHomeSection = getHomeSection;
