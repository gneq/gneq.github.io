// ==UserScript==
// @name         더블클릭 미니 구글 검색 버튼
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  텍스트를 더블클릭하면 하이라이트가 사라지지 않고 영구적으로 유지됩니다.
// @author       Gemini
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
                // 1. 단어 자체에 텍스트 하이라이트 span 생성 (마진, 패딩, 보더 없음)
                let span;
                try {
                    const highlightRange = document.createRange();
                    highlightRange.setStart(node, startIndex);
                    highlightRange.setEnd(node, endIndex);
                    span = document.createElement('span');
                    span.className = 'google-search-mini-layer';
                    span.style.backgroundColor = '#03cf5d';
                    span.style.color = '#ffffff';
                    span.style.position = 'relative'; // 내부 버튼 absolute 기준점
                    span.style.display = 'inline-block';
                    highlightRange.surroundContents(span);
                } catch (err) {
                    return;
                }
                
                // 구글 검색 URL 생성
                const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(word)}`;
                
                // 2. span 내부 우측 하단에 위치할 구글 버튼 생성 (absolute 적용)
                const button = document.createElement('a');
                button.href = googleSearchUrl;
                button.target = '_blank';
                button.innerHTML = 'G';
                button.style.cssText = `
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    transform: translate(30%, 40%);
                    background-color: #4285F4;
                    color: #ffffff;
                    font-size: 10px;
                    font-family: sans-serif;
                    font-weight: bold;
                    text-decoration: none;
                    padding: 1px 4px;
                    border-radius: 3px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
                    white-space: nowrap;
                    z-index: 999999;
                `;
                
                span.appendChild(button);
                
                // (제거됨) 외부 클릭 시 원래 상태로 돌리던 이벤트 리스너를 완전히 삭제하여 하이라이트가 유지되도록 함
                
                // 네이버 사전 창 열기
                const searchUrl = `https://ko.dict.naver.com/#/search?query=${encodeURIComponent(word)}`;
                window.open(searchUrl, '_blank');
            }
        }
    });
})();
