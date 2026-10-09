// ==UserScript==
// @name         목차 열기
// @version      v1.0
// @description  try to take over the world!
// @author       GNE
// @match        https://bcviewer.bookcube.com
// @include      https://bcviewer.bookcube.com*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bookcube.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const timer = setInterval(() => {
        const tocBtn = document.getElementById('tocBtn');

        if (tocBtn) {
            clearInterval(timer);
            tocBtn.click();
        }

    }, 100);

    window.addEventListener('load', function () {

        const tocList = document.getElementById('toc');

        if (tocList) {
            tocList.style.top = '40vh';
            tocList.style.position = 'fixed !important';
            tocList.style.bottom = '0';
            tocList.style.height = 'auto';
        }

    });

    window.onbeforeunload = null;
    window.confirm = () => true;
    window.addEventListener('beforeunload', e => {
        e.stopImmediatePropagation();
    }, true);

    let timerId = null; // 이전 타이머를 추적하기 위한 변수
    const iframe = document.querySelector('#epubContentIframe');

    // 동적 생성 요소를 처리하기 위해 부모(#tocList)에 이벤트 위임 설정
    document.querySelector('#tocList').addEventListener('click', function (event) {
        // 클릭된 요소 또는 그 조상 중 #tocList 바로 밑의 div 검색
        const targetDiv = event.target.closest('#tocList > div');

        if (!targetDiv) return;

        // div의 바로 첫 번째 자식 span 선택
        const firstSpan = targetDiv.querySelector(':scope > span');

        if (firstSpan) {
            const extractedText = firstSpan.textContent.trim();

            // 이전 예약된 setTimeout이 있다면 취소
            if (timerId) {
                clearTimeout(timerId);
            }

            // 500ms 후에 iframe의 title 변경
            timerId = setTimeout(() => {

                const tit = iframe.contentDocument.title;
                if (iframe && iframe.contentDocument) {
                    iframe.contentDocument.title = document.title = `${extractedText ? extractedText + '-' : ''}${tit}`;
                }
                timerId = null; // 실행 완료 후 타이머 초기화
            }, 500);
        }
    });


    // 100ms 주기로 실행되는 타이머 설정
    const checkInterval = setInterval(() => {
        const iframe = document.querySelector('#epubContentIframe');

        // iframe 및 내부 document 존재 여부 확인
        if (!iframe || !iframe.contentDocument) return;
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

        // iframe body 내 첫 번째 p 태그 탐색
        const firstParagraph = iframeDoc.querySelector('body p');

        // p 태그를 발견했고, 내부에 텍스트가 존재하는 경우
        if (firstParagraph && firstParagraph.textContent.trim() !== '') {
            // 1. 조건을 만족했으므로 주기적 실행 중단
            clearInterval(checkInterval);

            const targetText = firstParagraph.textContent.trim();

            // 2. #tocList 내 span 요소 중 동일한 텍스트 찾기
            const tocSpans = document.querySelectorAll('#tocList span');
            const matchedSpan = Array.from(tocSpans).find(
                (span) => span.textContent.trim() === targetText
            );

            // 3. 일치하는 요소 발견 시 부모 div로 스크롤
            if (matchedSpan) {
                const parentDiv = matchedSpan.closest('div');
                if (parentDiv) {
                    parentDiv.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            }
        }
    }, 100);

})();