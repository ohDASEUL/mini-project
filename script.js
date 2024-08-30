// DOM 요소들을 선택하여 변수에 할당
const dropBtn = document.querySelector(".dropdown-btn");
const dropdown = document.getElementById("todoDropdown");
const arrow = document.querySelector(".arrow");
const confirmBtn = document.getElementById("confirmBtn");
const addMoreBtn = document.getElementById("addMore");

// 드롭다운 토글 함수: 드롭다운 표시 여부와 화살표 방향을 전환
const toggleDropdown = () => {
  dropdown.classList.toggle("show");
  arrow.classList.toggle("up");
};

// 드롭다운 버튼 클릭 이벤트 리스너
dropBtn.addEventListener("click", toggleDropdown);

// 드롭다운 내부 클릭 이벤트를 방지하는 함수
const stopPropagation = (e) => {
  e.stopPropagation();
};

// 드롭다운 내부 요소들에 대해 클릭 이벤트 전파 방지
dropdown.addEventListener("click", stopPropagation);

// 전체 윈도우에 클릭 이벤트 리스너 추가
window.addEventListener("click", (event) => {
  // 클릭된 요소가 드롭다운 버튼이나 화살표가 아닐 경우
  if (
    !event.target.matches(".dropdown-btn") &&
    !event.target.matches(".arrow")
  ) {
    // 드롭다운이 열려있다면 닫기
    if (dropdown.classList.contains("show")) {
      dropdown.classList.remove("show");
      arrow.classList.remove("up");
    }
  }
});

// 확인 버튼 클릭 이벤트 리스너
confirmBtn.addEventListener("click", () => {
  // TODO: 선택된 필터 처리 로직 구현
  // 드롭다운 닫기
  dropdown.classList.remove("show");
  arrow.classList.remove("up");
});

// 더보기 버튼 클릭 이벤트 리스너
addMoreBtn.addEventListener("click", (e) => {
  e.preventDefault(); // 기본 동작 방지 (링크 클릭 시 페이지 이동 방지)
  // TODO: 더보기 기능 구현
});

// 즐겨찾기(별표) 토글 기능
document.querySelectorAll(".star").forEach((star) => {
  star.addEventListener("click", function () {
    if (this.src.includes("full_star.svg")) {
      this.src = "icon/star.svg";
    } else {
      this.src = "icon/full_star.svg";
    }
  });
});

// 다크 모드 토글 함수
function toggleDarkMode() {
  const body = document.body;
  const darkModeButton = document.querySelector('.system_mode img');
  const plusIcon = document.querySelector('.floating-button img');
  const todoWriteIcon = document.querySelector('.additional-icons img:first-child');
  const todoSearchIcon = document.querySelector('.additional-icons img:last-child');

  // 다크 모드 클래스 토글
  body.classList.toggle('dark-mode');

  // 다크 모드에 따라 아이콘 변경
  if (body.classList.contains('dark-mode')) {
    darkModeButton.src = 'icon/light.svg';
    plusIcon.src = plusIcon.src.includes('x.svg') ? 'icon/dark_x.svg' : 'icon/dark_plus.svg';
    todoWriteIcon.src = 'icon/dark_todo_write.svg';
    todoSearchIcon.src = 'icon/dark_todo_serch.svg';
  } else {
    darkModeButton.src = 'icon/dark.svg';
    plusIcon.src = plusIcon.src.includes('dark_x.svg') ? 'icon/x.svg' : 'icon/plus.svg';
    todoWriteIcon.src = 'icon/todo_write.svg';
    todoSearchIcon.src = 'icon/todo_serch.svg';
  }
}

// 다크 모드 버튼에 이벤트 리스너 추가
document.querySelector('.system_mode').addEventListener('click', toggleDarkMode);

// 플로팅 버튼 클릭 이벤트 리스너
document.querySelector(".floating-button").addEventListener("click", function () {
  const additionalIcons = document.querySelector(".additional-icons");
  const plusIcon = this.querySelector(".plus");
  const isDarkMode = document.body.classList.contains('dark-mode');
  
  // 플러스/X 아이콘 토글 및 추가 아이콘 표시/숨김
  if (plusIcon.src.includes("x.svg") || plusIcon.src.includes("dark_x.svg")) {
    plusIcon.src = isDarkMode ? "icon/dark_plus.svg" : "icon/plus.svg";
    additionalIcons.style.display = "none";
  } else {
    plusIcon.src = isDarkMode ? "icon/dark_x.svg" : "icon/x.svg";
    additionalIcons.style.display = "flex";
  }
});

// 삭제 아이콘에 대한 이벤트 리스너
const trashIcons = document.querySelectorAll(".trash");

trashIcons.forEach(trashIcon => {
  trashIcon.addEventListener('click', function() {
    // 사용자에게 삭제 확인
    const userConfirmed = confirm('정말 삭제하시겠습니까?');
    if (userConfirmed) {
      // 확인 시 해당 항목 숨김 처리
      this.parentElement.style.display = 'none';
    }
  });
});