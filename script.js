// 할 일 목록을 지정할 배열
let todos = [];

// 카테고리 목록
const categories = ["업무", "취미", "집안일", "기타"];

// 로컬 스토리지에서 기존 할 일 목록 불러오기
function loadTodos() {
  const storedTodos = localStorage.getItem("todos");
  if (storedTodos) {
    todos = JSON.parse(storedTodos);
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
  const isDarkMode = body.classList.contains("dark-mode");
  saveDarkModeState(isDarkMode);
  updateIcons();
}

function updateIcons() {
  const isDarkMode = document.body.classList.contains("dark-mode");
  const darkModeBtn = document.querySelector(".system_mode img");
  const floatingBtn = document.querySelector(".floating-button img");
  const todoWriteIcon = document.querySelector(".todo-write-button img");
  const todoCalendarIcon = document.querySelector(
    ".additional-icons img:first-child"
  );

  if (darkModeBtn)
    darkModeBtn.src = isDarkMode ? "icon/light.svg" : "icon/dark.svg";
  if (floatingBtn)
    floatingBtn.src = isDarkMode ? "icon/dark_plus.svg" : "icon/light_plus.svg";
  if (todoWriteIcon)
    todoWriteIcon.src = isDarkMode
      ? "icon/dark_todo_write.svg"
      : "icon/light_todo_write.svg";
  if (todoCalendarIcon)
    todoCalendarIcon.src = isDarkMode
      ? "icon/dark_calendar.svg"
      : "icon/light_calendar.svg";
}

// 초기화 함수
function init() {
  loadTodos();
  createCategoryOptions();
  displayTodos();

  // 다크 모드 상태 불러오기 및 적용
  const isDarkMode = loadDarkModeState();
  if (isDarkMode) {
    document.body.classList.add("dark-mode");
  }
  updateIcons();

  // 다크 모드 버튼 이벤트 리스너
  const darkModeBtn = document.querySelector(".system_mode");
  if (darkModeBtn) {
    darkModeBtn.addEventListener("click", toggleDarkMode);
  }

  // 타이틀 클릭 이벤트 리스너
  const titleLink = document.querySelector(".title a");
  if (titleLink) {
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
        plusIcon.src = document.body.classList.contains("dark-mode")
          ? "icon/dark_plus.svg"
          : "icon/light_plus.svg";
        additionalIcons.style.display = "none";
      } else {
        plusIcon.src = document.body.classList.contains("dark-mode")
          ? "icon/dark_x.svg"
          : "icon/light_x.svg";
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

  // 캘린더 이동 버튼
  const calendarBtn = document.querySelector(".calendar-button");
  if (calendarBtn) {
    calendarBtn.addEventListener("click", function () {
      window.location.href = "calendar.html";
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

  // 캘린더 관련 함수 호출
  if (document.querySelector(".calendar")) {
    renderCalendar();
  }

  // 주간 날짜 업데이트
  updateWeekDates();
}

// DOM이 로드되면 초기화 함수 실행
document.addEventListener("DOMContentLoaded", init);

// 다크 모드 상태를 로컬 스토리지에 저장
function saveDarkModeState(isDarkMode) {
  localStorage.setItem("darkMode", isDarkMode);
}

// 다크 모드 상태를 로컬 스토리지에서 불러오기
function loadDarkModeState() {
  return localStorage.getItem("darkMode") === "true";
}

// 페이지 리다이렉트 함수
function redirectToAppropriatePageData() {
  const hasTodos = todos.length > 0;
  const currentPage = window.location.pathname.split("/").pop();

  if (hasTodos) {
    if (currentPage === "index.html") {
      window.location.href = "main.html";
    }
  } else {
    if (currentPage === "main.html") {
      window.location.href = "index.html";
    }
  }
}

// 타이틀 클릭 이벤트 핸들러
function handleTitleClick(e) {
  e.preventDefault();
  redirectToAppropriatePageData();
}

// 달력 만들기 - 현재 몇월인지
let date = new Date();

const renderCalendar = () => {
  const viewYear = date.getFullYear();
  const viewMonth = date.getMonth();

  const yearMonthElement = document.querySelector(".year-month");
  if (yearMonthElement) {
    yearMonthElement.textContent = `${viewYear}년 ${viewMonth + 1}월`;
  }

  const prevLast = new Date(viewYear, viewMonth, 0);
  const thisLast = new Date(viewYear, viewMonth + 1, 0);

  const PLDate = prevLast.getDate();
  const PLDay = prevLast.getDay();

  const TLDate = thisLast.getDate();
  const TLDay = thisLast.getDay();

  const prevDates = [];
  const thisDates = [...Array(TLDate + 1).keys()].slice(1);
  const nextDates = [];

  if (PLDay !== 6) {
    for (let i = 0; i < PLDay + 1; i++) {
      prevDates.unshift(PLDate - i);
    }
  }

  for (let i = 1; i < 7 - TLDay; i++) {
    nextDates.push(i);
  }

  const dates = prevDates.concat(thisDates, nextDates);
  const firstDateIndex = dates.indexOf(1);
  const lastDateIndex = dates.lastIndexOf(TLDate);

  const today = new Date();
  const todayDate = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  const datesElement = document.querySelector(".dates");
  if (datesElement) {
    datesElement.innerHTML = dates
      .map((date, i) => {
        const condition =
          i >= firstDateIndex && i < lastDateIndex + 1 ? "this" : "other";
        let isToday = "";
        if (
          condition === "this" &&
          date === todayDate &&
          viewMonth === todayMonth &&
          viewYear === todayYear
        ) {
          isToday = " today";
        }
        return `<div class="date"><span class="${condition}${isToday}">${date}</span></div>`;
      })
      .join("");
  }
};

const prevMonth = () => {
  date.setMonth(date.getMonth() - 1);
  renderCalendar();
};

const nextMonth = () => {
  date.setMonth(date.getMonth() + 1);
  renderCalendar();
};

const goToday = () => {
  date = new Date();
  renderCalendar();
};

function updateWeekDates() {
  const weekdays = ['월', '화', '수', '목', '금', '토', '일'];
  const today = new Date();
  const currentDay = today.getDay(); // 0 (일요일) ~ 6 (토요일)
  
  // 이번 주 월요일 찾기
  const monday = new Date(today);
  monday.setDate(today.getDate() - currentDay + (currentDay === 0 ? -6 : 1));

  const weekdaysEl = document.querySelector('.day_section .weekdays');
  const datesEl = document.querySelector('.day_section .dates');

  if (!weekdaysEl || !datesEl) return;

  weekdaysEl.innerHTML = '';
  datesEl.innerHTML = '';

  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);

    // 요일 추가
    const weekdayLi = document.createElement('li');
    weekdayLi.textContent = weekdays[i];
    weekdaysEl.appendChild(weekdayLi);

    // 날짜 추가
    const dateLi = document.createElement('li');
    dateLi.textContent = date.getDate();
    
    // 오늘 날짜 강조
    if (date.toDateString() === today.toDateString()) {
      dateLi.classList.add('today');
      weekdayLi.classList.add('today'); // 요일도 강조
    }

    datesEl.appendChild(dateLi);
  }
}

// 캘린더 관련 이벤트 리스너 추가
function addCalendarEventListeners() {
  const prevBtn = document.querySelector(".go-prev");
  const nextBtn = document.querySelector(".go-next");
  const todayBtn = document.querySelector(".go-today");

  if (prevBtn) prevBtn.addEventListener("click", prevMonth);
  if (nextBtn) nextBtn.addEventListener("click", nextMonth);
  if (todayBtn) todayBtn.addEventListener("click", goToday);
}

// 초기화 함수에 캘린더 이벤트 리스너 추가 부분 추가
// 초기화 함수
function init() {
  loadTodos();
  createCategoryOptions();
  displayTodos();

  // 다크 모드 상태 불러오기 및 적용
  const isDarkMode = loadDarkModeState();
  if (isDarkMode) {
    document.body.classList.add("dark-mode");
  }
  updateIcons();

  // 다크 모드 버튼 이벤트 리스너
  const darkModeBtn = document.querySelector(".system_mode");
  if (darkModeBtn) {
    darkModeBtn.addEventListener("click", toggleDarkMode);
  }

  // 타이틀 클릭 이벤트 리스너
  const titleLink = document.querySelector(".title a");
  if (titleLink) {
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
        plusIcon.src = document.body.classList.contains("dark-mode")
          ? "icon/dark_plus.svg"
          : "icon/light_plus.svg";
        additionalIcons.style.display = "none";
      } else {
        plusIcon.src = document.body.classList.contains("dark-mode")
          ? "icon/dark_x.svg"
          : "icon/light_x.svg";
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

  // 캘린더 이동 버튼
  const calendarBtn = document.querySelector(".calendar-button");
  if (calendarBtn) {
    calendarBtn.addEventListener("click", function () {
      window.location.href = "calendar.html";
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
      const selectedFilter = document.querySelector('input[name="filter"]:checked');
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

  // 캘린더 관련 함수 호출
  if (document.querySelector('.calendar')) {
    renderCalendar();
    addCalendarEventListeners();
  }
  
  // 주간 날짜 업데이트
  updateWeekDates();
}

// DOM이 로드되면 초기화 함수 실행
document.addEventListener("DOMContentLoaded", init);
