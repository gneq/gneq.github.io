(async () => {
  // ================= [설정 정보 입력] =================
  const GITHUB_TOKEN = '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'; // repo 권한이 있는 PAT
  const OWNER = 'gneq';                    // 깃허브 계정명
  const REPO = 'gneq.github.io';                    // 레포지토리 이름
  const BRANCH = 'main';                                  // 푸시할 브랜치
  // ====================================================

  try {
    // 1. 기존 로직대로 HTML 컨텐츠 추출 및 조립
    const titleText = document.getElementById('reader-title').textContent.trim();
    const domainHref = document.getElementById('reader-domain').getAttribute('href');
    const domainText = domainHref.replace(/\s*\n\s*/g, '');

    let c = `<!DOCTYPE html>\n<html>\n<head>\n<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>${titleText}</title>\n</head>\n<body>\n<a href="${domainHref}">${domainText}</a>\n<br>\n<br>\n`;
    
    const p = document.querySelectorAll('[id^=readability-page-]');
    for (const e of p) {
      c += e.innerHTML + '\n';
    }
    c += '</body>\n</html>';

    // 2. 저장할 파일명 및 깃허브 API 엔드포인트 설정
    // 파일명에 공백이나 특수문자가 있을 수 있으므로 안전한 형태로 변환하여 저장 경로를 지정합니다.
    const safeFileName = titleText.replace(/[/\\?%*:|"<>]/g, '-'); 
    const PATH = `col/${safeFileName}.html`; // 'archive' 폴더 안에 타이틀명.html로 저장
    const url = `https://github.com{OWNER}/${REPO}/contents/${PATH}`;

    // 3. API 요청 헤더 정의
    const headers = {
      "Authorization": `Bearer ${GITHUB_TOKEN}`,
      "Accept": "application/vnd.github+json",
      "Content-Type": "application/json"
    };

    // 4. 기존 파일이 동일한 경로에 존재하는지 체크 (SHA 획득 목적)
    let sha = null;
    const checkResponse = await fetch(`${url}?ref=${BRANCH}`, { method: 'GET', headers });
    if (checkResponse.ok) {
      const fileData = await checkResponse.json();
      sha = fileData.sha;
    }

    // 5. 한글 깨짐 방지를 고려한 Base64 인코딩
    const base64Content = btoa(unescape(encodeURIComponent(c)));

    // 6. 전송 바디 구성
    const bodyData = {
      message: `docs: 스크랩 파일 추가 - ${titleText}`,
      content: base64Content,
      branch: BRANCH
    };
    if (sha) bodyData.sha = sha; // 기존 파일이 있으면 덮어쓰기용 SHA 추가

    // 7. GitHub API로 PUT 요청전송 (Push 실행)
    const pushResponse = await fetch(url, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(bodyData)
    });

    if (pushResponse.ok) {
      alert(`🎉 깃허브 푸시 성공!\n경로: ${PATH}`);
    } else {
      const errJson = await pushResponse.json();
      alert(`❌ 푸시 실패: ${errJson.message}`);
    }

  } catch (error) {
    console.error(error);
    alert(`❌ 에러 발생: ${error.message}`);
  }
})();
