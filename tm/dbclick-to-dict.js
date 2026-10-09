// ==UserScript==
// @name         더블클릭 미니 구글/네이버 검색 버튼
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  텍스트를 더블클릭하면 네이버 사전이 새 창으로 열리고, 단어에 하이라이트와 G/N 버튼이 유지됩니다.
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
                    span.style.position = 'relative'; // 내부 버튼들의 absolute 기준점
                    span.style.display = 'inline-block';
                    span.style.borderRadius = '5px';
                    highlightRange.surroundContents(span);
                } catch (err) {
                    return;
                }
                
                // 2. 우측 하단 구글(G) 버튼 생성
                const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(word)}`;
                const googleButton = document.createElement('a');
                googleButton.href = googleSearchUrl;
                googleButton.target = '_blank';
                googleButton.innerHTML = 'G';
                googleButton.style.cssText = `
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    transform: translate(60%, 40%);
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
                span.appendChild(googleButton);
                
                // 3. 좌측 상단 네이버(N) 버튼 생성
                const naverSearchUrl = `https://ko.dict.naver.com/#/search?query=${encodeURIComponent(word)}`;
                const naverButton = document.createElement('a');
                naverButton.href = naverSearchUrl;
                naverButton.target = '_blank';
                naverButton.innerHTML = 'N';
                naverButton.style.cssText = `
                    position: absolute;
                    left: 0;
                    top: 0;
                    transform: translate(-60%, -40%);
                    background-color: #03cf5d;
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
                span.appendChild(naverButton);
                
                // 4. 더블클릭 시 네이버 사전 창 바로 열기 (원래 기능 복구)
                window.open(naverSearchUrl, '_blank');
            }
        }
    });
})();
