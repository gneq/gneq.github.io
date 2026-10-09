// ==UserScript==
// @name         네이버 사전
// @version      1.0
// @description  .
// @author       NAVER
// @match        *://*.dict.naver.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=naver.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
const s = document.createElement('style');
s.innerText = `
    ul li p.mean {
        display: table-cell !important;
        text-align: justify;
        word-break: keep-all !important;
    }

    div.row > div span.mark {
       margin-top: 10px;
       margin-bottom: 15px;
       display: block !important;
       font-size: 1.35rem !important;
    }

    #tooltipLayer_dict .u_word_mean {
        
        
        text-align: justify;
        white-space: normal;
        word-break: keep-all !important;
        
    }
    #tooltipLayer_dict ul.u_mean_word li {
        height: 100%;
        overflow: visible;
        
    }

    div.entry_title > span.addition {
        font-size: 2.05rem !important;
        display: block;
    }

    
    span.mean{
       display: block;
       text-align: justify !important;
       word-break: keep-all !important;
    }

    .option_wrap, .nav_wordbook {display: none !important}

    

`;

// body 대신 head에 미리 추가 (window.load 대기 없이 즉시 삽입)
document.head.appendChild(s);

})();