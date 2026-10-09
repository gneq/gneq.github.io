// ==UserScript==
// @name         Google Search
// @namespace    http://tampermonkey.net/
// @version      2026-10-01
// @description  .
// @author       Google
// @match        https://www.google.com/search*
// @match        https://www.google.co.kr/search*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.innerHTML = `
        /* 구글 검색 결과 본문 영역 추정 태그들의 말줄임 강제 해제 */
        div[style*="-webkit-line-clamp"], 
        span[style*="-webkit-line-clamp"] {
            display: block !important;
            -webkit-line-clamp: unset !important;
            max-height: none !important;
            overflow: visible !important;
            word-break: keep-all;
            text-align: justify;
        }
    `;
    document.head.appendChild(style);

    // 2. 동적으로 생성되는 검색 결과 요소들을 순회하며 직접 스타일에 적용하는 함수
    function removeEllipsis() {
        // 구글 검색 결과의 각 스니펫 블록 내부에서 텍스트가 여러 줄 들어가는 div/span을 탐색
        // 보통 검색 결과 서브텍스트는 특유의 스타일 속성이나 구조를 가짐
        const potentialSnippets = document.querySelectorAll('#rso div, #search div');
        
        potentialSnippets.forEach(el => {
            const computedStyle = window.getComputedStyle(el);
            // -webkit-line-clamp 처리가 되어 있는 동적 클래스 요소를 직접 찾아 해제
            if (computedStyle.getPropertyValue('-webkit-line-clamp') !== 'none' && computedStyle.getPropertyValue('-webkit-line-clamp') !== '') {
                el.style.display = 'block';
                el.style.webkitLineClamp = 'unset';
                el.style.maxHeight = 'none';
                el.style.overflow = 'visible';
            }
        });
    }

    // 3. 페이지 로드 시 및 DOM 변화(스크롤, 추가 검색 결과 로딩 등) 감지 시 실행
    const observer = new MutationObserver(() => {
        removeEllipsis();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 초기 실행
    window.addEventListener('load', removeEllipsis);
})();