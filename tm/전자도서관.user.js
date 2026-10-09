// ==UserScript==
// @name         전자도서관
// @version      v1.0
// @description  .
// @author       GNE
// @match        https://ebook.itt.link/mylibrary
// @icon         https://www.google.com/s2/favicons?sz=64&domain=itt.link
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.confirm = () => true;


(() => {
  const INTERVAL = 500;
  let timer = null;

  function clickTarget() {
    const dialog = document.querySelector('div[role="dialog"]');
    const button = [...(dialog?.querySelectorAll('button') ?? [])]
      .find(btn => btn.textContent.trim() === 'PC로 계속하기');

    if (button) {
      button.click();
      document.title = '🟢 PC로 계속하기 클릭 중';
    } else {
      document.title = '🟡 대기 중';
    }
  }

  function start() {
    if (!timer && !document.hidden) {
      clickTarget();
      timer = setInterval(clickTarget, INTERVAL);
    }
  }

  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stop();
      document.title = '⏸️ 일시정지';
    } else {
      document.title = '🟢 작동 중';
      start();
    }
  });

  document.addEventListener('touchend', () => {
    if (!document.hidden) {
      document.title = '🟢 작동 중';
      start();
    }
  });

  start();
})();


})();