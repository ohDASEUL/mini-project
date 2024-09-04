// 할 일 목록을 지정할 배열
let todos = [];

// 카테고리 목록
const categories = ["업무", "취미", "집안일", "기타"];

// 로컬 스토리지에서 기존 할 일 목록 불러오기
function loadTodos() {
  const stroedTodos = localStorage.getItem("todos");
  if (stroedTodos) {
    todos = JSON.parse(stroedTodos);
  }
}

// 할 일 목록을 로컬 스토리지에 저장
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// 새로운 할 일 추가
function addTodo(todo, category, date) {
  const newTodo = {
    id: Date.now(),
    todo: todo,
    category: category,
    date: date,
    completed: false,
    starred: false,
  };
  todos.push(newTodo);
  saveTodos();
}

// 남은 날짜 계산
function getDaysLeft(dueDate) {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// 카테고리 옵션 생성 함수
function createCategoryOptions() {
  const categorySelect = document.getElementById("category-select");
  const filterOptions = document.querySelector(".filter-options");

  if (categorySelect) {
    categorySelect.innerHTML = '<option value="">선택하세요</option>';
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categorySelect.appendChild(option);
    });
  }

  if (filterOptions) {
    filterOptions.innerHTML = "";
    categories.forEach((category) => {
      const label = document.createElement("label");
      label.innerHTML = `<input type="radio" name="filter" value="${category}"> ${category}`;
      filterOptions.appendChild(label);
    });
  }
}

// 필터링 함수
function filterTodos(category) {
  if (category) {
    return todos.filter((todo) => todo.category === category);
  }
  return todos;
}

// 할 일 목록 표시
function displayTodos(filteredTodos = todos) {
  const todoList = document.querySelector(".todolist");
  if (!todoList) return;

  todoList.innerHTML = "";
  filteredTodos.forEach((todo, index) => {
    const daysLeft = getDaysLeft(todo.date);
    const item = document.createElement("div");
    item.classList.add("item");
    item.innerHTML = `
      <span class="category">${todo.category}</span>
      <input type="checkbox" id="task${index}" ${
      todo.completed ? "checked" : ""
    }/>
      <label for="task${index}">${todo.todo}</label>
      <span class="days-left">${daysLeft}일 남음</span>
      <img src="icon/${
        todo.starred ? "full_star.svg" : "star.svg"
      }" alt="star" class="icon star" data-id="${todo.id}"/>
      <img src="icon/trash.svg" alt="trash" class="icon trash" data-id="${
        todo.id
      }"/>
    `;
    todoList.appendChild(item);
  });
  // 이벤트 리스너 추가
  addEventListeners();
}

// 이벤트 리스너 추가
function addEventListeners() {
  // 체크박스 이벤트
  document
    .querySelectorAll('.todolist input[type="checkbox"]')
    .forEach((checkbox) => {
      checkbox.addEventListener("change", function () {
        const todoId = this.id.replace("task", "");
        todos[todoId].completed = this.checked;
        saveTodos();
        displayTodos();
      });
    });

  // 별표 토글 이벤트
  document.querySelectorAll(".star").forEach((star) => {
    star.addEventListener("click", function () {
      const todoId = this.dataset.id;
      const todo = todos.find((t) => t.id == todoId);
      todo.starred = !todo.starred;
      this.src = todo.starred ? "icon/full_star.svg" : "icon/star.svg";
      saveTodos();
      displayTodos();
    });
  });

  // 삭제 이벤트
  document.querySelectorAll(".trash").forEach((trash) => {
    trash.addEventListener("click", function () {
      if (confirm("정말 삭제하시겠습니까?")) {
        const todoId = this.dataset.id;
        todos = todos.filter((t) => t.id != todoId);
        saveTodos();
        displayTodos();
      }
    });
  });
}

function toggleDarkMode() {
  const body = document.body;
  body.classList.toggle("dark-mode");
  updateIcons();
}

function updateIcons() {
  const isDarkMode = document.body.classList.contains("dark-mode");
  const darkModeBtn = document.querySelector(".system_mode img");
  const floatingBtn = document.querySelector(".floating-button img");
  const todoWriteIcon = document.querySelector(".todo-write-button img");
  const todoCalendarIcon = document.querySelector(".additional-icons img:first-child");

  darkModeBtn.src = isDarkMode ? "icon/light.svg" : "icon/dark.svg";
  floatingBtn.src = isDarkMode ? "icon/dark_plus.svg" : "icon/light_plus.svg";
  todoWriteIcon.src = isDarkMode ? "icon/dark_todo_write.svg" : "icon/light_todo_write.svg";
  todoCalendarIcon.src = isDarkMode ? "icon/dark_calendar.svg" : "icon/light_calendar.svg";
}

// 초기화 함수
function init() {
  loadTodos();
  createCategoryOptions();
  displayTodos();

  // 다크 모드 상태 불러오기 및 적용
  const isDarkMode = loadDarkModeState();
  if (isDarkMode){
    document.body.classList.add("dark-mode")
  }
  updateIcons();

  // 다크 모드 버튼 이벤트 리스너
  const darkModeBtn = document.querySelector(".system_mode");
  if (darkModeBtn) {
    darkModeBtn.addEventListener("click", toggleDarkMode);
  }

  // 타이틀 클릭 이벤트 리스너
  const titleLink = document.querySelector(".title a");
  if(titleLink){
    titleLink.addEventListener("click", handleTitleClick);
  }

  // 페이지 리다이렉트
  redirectToAppropriatePageData();

  // 플로팅 버튼 클릭 이벤트 리스너
  const floatingBtn = document.querySelector(".floating-button");
  if (floatingBtn) {
    floatingBtn.addEventListener("click", function () {
      const additionalIcons = document.querySelector(".additional-icons");
      const plusIcon = this.querySelector("img");

      if (additionalIcons.style.display === "flex") {
        plusIcon.src = document.body.classList.contains("dark-mode") ? "icon/dark_plus.svg" : "icon/light_plus.svg";
        additionalIcons.style.display = "none";
      } else {
        plusIcon.src = document.body.classList.contains("dark-mode") ? "icon/dark_x.svg" : "icon/light_x.svg";
        additionalIcons.style.display = "flex";
      }
      updateIcons();
    });
  }

  // TO DO 작성 버튼 이벤트 리스너
  const todoWriteBtn = document.querySelector(".todo-write-button");
  if (todoWriteBtn) {
    todoWriteBtn.addEventListener("click", function () {
      window.location.href = "create-todo.html";
    });
  }

  // 등록 버튼 이벤트 리스너
  const todoSubmitBtn = document.querySelector(".todo-submit-button");
  if (todoSubmitBtn) {
    todoSubmitBtn.addEventListener("click", function (e) {
      e.preventDefault();

      const todoInput = document.getElementById("todo-input");
      const categorySelect = document.getElementById("category-select");
      const dateInput = document.getElementById("date-input");

      if (!todoInput.value || !categorySelect.value || !dateInput.value) {
        alert("모든 필드를 입력해주세요.");
        return;
      }

      addTodo(todoInput.value, categorySelect.value, dateInput.value);
      displayTodos();

      todoInput.value = "";
      categorySelect.value = "";
      dateInput.value = "";

      alert("등록되었습니다.");
      window.location.href = "main.html";
    });
  }

  // 드롭다운 관련 코드
  const dropBtn = document.querySelector(".dropdown-btn");
  const dropdown = document.getElementById("todoDropdown");
  const arrow = document.querySelector(".arrow");
  const confirmBtn = document.getElementById("confirmBtn");

  if (dropBtn && dropdown && arrow) {
    const toggleDropdown = () => {
      dropdown.classList.toggle("show");
      arrow.classList.toggle("up");
    };
    dropBtn.addEventListener("click", toggleDropdown);

    const stopPropagation = (e) => {
      e.stopPropagation();
    };

    dropdown.addEventListener("click", stopPropagation);

    window.addEventListener("click", (e) => {
      if (!e.target.matches(".dropdown-btn") && !e.target.matches(".arrow")) {
        if (dropdown.classList.contains("show")) {
          dropdown.classList.remove("show");
          arrow.classList.remove("up");
        }
      }
    });
  }

  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      const selectedFilter = document.querySelector(
        'input[name="filter"]:checked'
      );
      if (selectedFilter) {
        const filteredTodos = filterTodos(selectedFilter.value);
        displayTodos(filteredTodos);
      } else {
        displayTodos();
      }
      // 드롭다운 닫기
      if (dropdown && arrow) {
        dropdown.classList.remove("show");
        arrow.classList.remove("up");
      }
    });
  }

  // 초기 아이콘 상태 설정
  updateIcons();
}

// DOM이 로드되면 초기화 함수 실행
document.addEventListener("DOMContentLoaded", init);

// 다크 모드 상태를 로컬 스토리지에 저장
function saveDarkModeState(isDarkMode){
  localStorage.setItem("darkMode", isDarkMode);
}

// 다크 모드 상태를 로컬 스토리지에서 불러오기
function loadDarkModeState() {
  return localStorage.getItem("darkMode") === "true";
}

function toggleDarkMode(){
  const body = document.body;
  body.classList.toggle("dark-mode");
  const isDarkMode = body.classList.contains("dark-mode")
  saveDarkModeState(isDarkMode);
  updateIcons(); 
}


// 페이지 리다이렉트 함수
function redirectToAppropriatePageData(){
  const hasTodos = todos.length > 0;
  const currentPage = window.location.pathname.split("/").pop();

  if(hasTodos){
    if(currentPage === "index.html"){
      window.location.href = "main.html"
    }
  }else{
    if(currentPage === "main.html"){
      window.location.href = "index.html"
    }
  }
}

// 타이틀 클릭 이벤트 핸들러
function handleTitleClick(){
  e.preventDefault();
  redirectToAppropriatePageData();
}


const date = new Date();

const viewYear = date.getFullYear();
const viewMonth = date.getMonth();

document.querySelector('.year-month').textContent = `${viewYear}년 ${viewMonth + 1}월`