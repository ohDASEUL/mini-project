document.addEventListener("DOMContentLoaded", function () {
  // 다크 모드 토글 함수
  function toggleDarkMode() {
    const body = document.body;
    const darkModeButton = document.querySelector(".system_mode img");
    const plusIcon = document.querySelector(".floating-button img");
    const todoWriteIcon = document.querySelector(
      ".additional-icons img:first-child"
    );
    const todoCalendarIcon = document.querySelector(
      ".additional-icons img:last-child"
    );

    // 다크 모드 클래스 토글
    body.classList.toggle("dark-mode");

    // 다크 모드에 따라 아이콘 변경
    if (body.classList.contains("dark-mode")) {
      darkModeButton.src = "icon/light.svg";
      plusIcon.src = plusIcon.src.includes("x.svg")
        ? "icon/dark_x.svg"
        : "icon/dark_plus.svg";
      todoWriteIcon.src = "icon/light_todo_write.svg";
      todoCalendarIcon.src = "icon/dark_calendar.svg";
    } else {
      darkModeButton.src = "icon/dark.svg";
      plusIcon.src = plusIcon.src.includes("dark_x.svg")
        ? "icon/x.svg"
        : "icon/plus.svg";
      todoWriteIcon.src = "icon/dark_todo_write.svg";
      todoCalendarIcon.src = "icon/light_calendar.svg";
    }
  }

  // 다크 모드 버튼에 이벤트 리스너 추가
  // document
  //   .querySelector(".system_mode")
  //   .addEventListener("click", toggleDarkMode);
  const darkModeButton = document.querySelector(".system_mode");
  if (darkModeButton) {
    darkModeButton.addEventListener("click", toggleDarkMode);
  }

  // 플로팅 버튼 클릭 이벤트 리스너
  const floatingButton = document.querySelector(".floating-button");
  if (floatingButton) {
    floatingButton.addEventListener("click", function () {
      const additionalIcons = document.querySelector(".additional-icons");
      const plusIcon = this.querySelector("img");
      const isDarkMode = document.body.classList.contains("dark-mode");

      if (additionalIcons.style.display === "flex") {
        plusIcon.src = isDarkMode ? "icon/dark_plus.svg" : "icon/plus.svg";
        additionalIcons.style.display = "none";
      } else {
        plusIcon.src = isDarkMode ? "icon/dark_x.svg" : "icon/x.svg";
        additionalIcons.style.display = "flex";
      }
    });
  }

  // TO DO 작성 버튼 이벤트 리스너
  const todoWriteButton = document.querySelector(".todo-write-button");
  if (todoWriteButton) {
    todoWriteButton.addEventListener("click", function () {
      window.location.href = "create-todo.html";
    });
  }

  // 등록 버튼 이벤트 리스너
  const todoSubmitButton = document.querySelector(".todo-submit-button");
  if (todoSubmitButton) {
    todoSubmitButton.addEventListener("click", function (e) {
      e.preventDefault(); 

      const todoInput = document.getElementById("todo-input");
      const categorySelect = document.getElementById("category-select");
      const dateInput = document.getElementById("date-input");

      if (!todoInput || !categorySelect || !dateInput) {
        console.error("필요한 입력 필드를 찾을 수 없습니다.");
        return;
      }

      if (!todoInput.value || !categorySelect.value || !dateInput.value) {
        alert("모든 필드를 입력해 주세요.");
        return;
      }

      alert("등록되었습니다");
      window.location.href = "index.html";
    });
  }
});
