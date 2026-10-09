// ==UserScript==
// @name         더블클릭 미니 구글 검색 버튼
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  텍스트를 더블클릭하면 기존 하이라이트는 유지된 채 우측 하단에 아주 작은 구글 검색 버튼 레이어가 뜹니다.
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
                // 1. 기존에 생성된 미니 레이어가 있다면 제거
                const existingLayer = document.getElementById('google-search-mini-layer');
                if (existingLayer) {
                    existingLayer.remove();
                }
                
                // 2. 새로운 미니 버튼 레이어 생성 (텍스트를 변형하지 않고 화면 좌표 기반으로 배치)
                const layer = document.createElement('div');
                layer.id = 'google-search-mini-layer';
                layer.style.cssText = `
                    position: fixed;
                    left: ${clientX + 10}px;
                    top: ${clientY + 15}px;
                    z-index: 999999;
                `;
                
                // 구글 검색 URL 생성
                const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(word)}`;
                
                // 미니 버튼 생성 (원하시는 스타일 적용)
                const button = document.createElement('a');
                button.href = googleSearchUrl;
                button.target = '_blank';
                button.innerHTML = 'G';
                button.style.cssText = `
                    display: inline-block;
                    background-color: #03cf5d;
                    color: #ffffff;
                    font-size: 11px;
                    font-family: sans-serif;
                    font-weight: bold;
                    text-decoration: none;
                    padding: 2px 6px;
                    border-radius: 3px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
                    white-space: nowrap;
                `;
                
                layer.appendChild(button);
                document.body.appendChild(layer);
                
                // 3. 레이어 외 다른 곳을 클릭하면 미니 레이어 닫기
                const closeOnOutsideClick = function(event) {
                    if (!layer.contains(event.target)) {
                        layer.remove();
                        document.removeEventListener('click', closeOnOutsideClick);
                    }
                };
                setTimeout(() => {
                    document.addEventListener('click', closeOnOutsideClick);
                }, 0);
                
                // 네이버 사전 창 열기
                const searchUrl = `https://ko.dict.naver.com/#/search?query=${encodeURIComponent(word)}`;
                window.open(searchUrl, '_blank');
            }
        }
    });
})();
