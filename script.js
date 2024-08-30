// DOM 요소들을 선택하여 변수에 할당
const dropBtn = document.querySelector('.dropdown-btn');
const dropdown = document.getElementById("todoDropdown");
const arrow = document.querySelector('.arrow');
const confirmBtn = document.getElementById('confirmBtn');
const addMoreBtn = document.getElementById('addMore');

// 드롭다운 토글 함수: 드롭다운 표시 여부와 화살표 방향을 전환
const toggleDropdown = () => {
  dropdown.classList.toggle("show");
  arrow.classList.toggle("up");
};

// 드롭다운 버튼 클릭 이벤트 리스너
dropBtn.addEventListener('click', toggleDropdown);

// 드롭다운 내부 클릭 이벤트를 방지하는 함수
const stopPropagation = (e) => {
  e.stopPropagation();
};

// 드롭다운 내부 요소들에 대해 클릭 이벤트 전파 방지
dropdown.addEventListener('click', stopPropagation);

// 전체 윈도우에 클릭 이벤트 리스너 추가
window.addEventListener('click', (event) => {
  // 클릭된 요소가 드롭다운 버튼이나 화살표가 아닐 경우
  if (!event.target.matches('.dropdown-btn') && !event.target.matches('.arrow')) {
    // 드롭다운이 열려있다면 닫기
    if (dropdown.classList.contains('show')) {
      dropdown.classList.remove('show');
      arrow.classList.remove("up");
    }
  }
});

// 확인 버튼 클릭 이벤트 리스너
confirmBtn.addEventListener('click', () => {
  // TODO: 선택된 필터 처리 로직 구현
  // 드롭다운 닫기
  dropdown.classList.remove("show");
  arrow.classList.remove("up");
});

// 더보기 버튼 클릭 이벤트 리스너
addMoreBtn.addEventListener('click', (e) => {
  e.preventDefault(); // 기본 동작 방지 (링크 클릭 시 페이지 이동 방지)
  // TODO: 더보기 기능 구현
});
