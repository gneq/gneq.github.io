{
  let content = '';

  // HTML 문서 기본 구조와 스타일을 유지하고 싶다면 아래처럼 전체 구조를 감싸줄 수 있습니다.
  content += '<!DOCTYPE html>\n<html>\n<head>\n<meta charset="utf-8">\n';
  content += '<title>' + document.getElementById('reader-title').textContent + '</title>\n';
  content += '</head>\n<body>\n';



  // 각 페이지의 HTML 태그(innerHTML)를 가져와서 추가
  const pages = document.querySelectorAll('[id^=readability-page-]');
  for (const page of pages) {
    content += page.innerHTML + '\n';
  }
content += '<hr><br>\n';
    // 도메인, 제목, 예상 읽기 시간 추가 (필요에 따라 태그 포맷 지정)
  content += '<a href="' + document.getElementById('reader-domain').textContent.trim() + '>' + document.getElementById('reader-domain').textContent.trim() + '</a>\n';
  //content += '<h1>' + document.getElementById('reader-title').textContent + '</h1>\n';
  //content += '<div><small>' + document.getElementById('reader-estimated-time').textContent + '</small></div>\n';
  
  content += '</body>\n</html>';

  // Blob 타입을 'text/html'로 변경
  const blob = new Blob([content], {
    type: 'text/html;charset=utf-8'
  });
  
  const href = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = href;
  // 확장자를 .html로 변경
  a.download = document.getElementById('reader-title').textContent.trim() + '.html';
  a.click();
  setTimeout(() => URL.revokeObjectURL(href), 10000);
}
