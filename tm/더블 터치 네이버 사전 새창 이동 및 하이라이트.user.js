// ==UserScript==
// @name         더블 터치 네이버 사전 새창 이동 및 하이라이트
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  웹페이지에서 단어를 두 번 터치하면 하이라이트를 남기고 새 창으로 네이버 사전을 엽니다.
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('dblclick', function(e) {
        let range;
        const clientX = e.clientX;
        const clientY = e.clientY;

        if (document.caretRangeFromPoint) {
            range = document.caretRangeFromPoint(clientX, clientY);
        } else if (document.caretPositionFromPoint) {
            const pos = document.caretPositionFromPoint(clientX, clientY);
            if (pos) {
                range = document.createRange();
                range.setStart(pos.offsetNode, pos.offset);
                range.collapse(true);
            }
        }

        if (!range) return;

        const node = range.startContainer;

        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.nodeValue;
            const offset = range.startOffset;

            let startIndex = offset;
            let endIndex = offset;

            while (startIndex > 0 && !/\s/.test(text[startIndex - 1])) {
                startIndex--;
            }

            while (endIndex < text.length && !/\s/.test(text[endIndex])) {
                endIndex++;
            }

            const word = text.substring(startIndex, endIndex).trim();

            if (word) {
                try {
                    const highlightRange = document.createRange();
                    highlightRange.setStart(node, startIndex);
                    highlightRange.setEnd(node, endIndex);

                    const span = document.createElement('span');
                    span.style.backgroundColor = '#03cf5d';
                    span.style.color = '#ffffff';
                    
                    highlightRange.surroundContents(span);
                } catch (err) {
                    // DOM 구조 제약으로 span 생성 실패 시 무시
                }

                const searchUrl = `https://ko.dict.naver.com/#/search?query=${encodeURIComponent(word)}`;

                // 새 창(탭)으로 열기
                window.open(searchUrl, '_blank');
            }
        }
    }, true);
})();