// ==UserScript==
// @name         나무위키 정렬
// @version      1.0
// @description  .
// @author       나무위키
// @match        https://namu.wiki/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=namu.wiki
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const s = document.createElement('style');
    s.innerText = `
       #app div div {
          text-align: justify;
          word-break: keep-all;
       }
    `;
    document.head.append(s);
})();