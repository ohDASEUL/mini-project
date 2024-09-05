// 할 일 목록을 저장할 배열
let todos = [];

// 카테고리 목록
const categories = ["업무", "취미", "집안일", "기타"];

// 달력 관련 변수
let date = new Date();

// 로컬 스토리지에서 기존 할 일 목록 불러오기
const loadTodos = () => {
  const storedTodos = localStorage.getItem("todos");
  if (storedTodos) {
    todos = JSON.parse(storedTodos);
  }
};

// 할 일 목록을 로컬 스토리지에 저장
const saveTodos = () => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

// 새로운 할 일 추가
const addTodo = (todo, category, date) => {
  const newTodo = {
    id: Date.now(),
    todo,
    category,
    date,
    completed: false,
    starred: false,
  };
  todos.push(newTodo);
  saveTodos();
};

// 남은 날짜 계산
const getDaysLeft = (dueDate) => {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// 카테고리 옵션 생성 함수
const createCategoryOptions = () => {
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
};

// 필터링 함수
const filterTodos = (category) => category ? todos.filter((todo) => todo.category === category) : todos;

// 할 일 목록 표시
const displayTodos = (filteredTodos = todos) => {
  const todoList = document.querySelector(".todolist");
  if (!todoList) return;

  todoList.innerHTML = "";
  filteredTodos.forEach((todo, index) => {
    const daysLeft = getDaysLeft(todo.date);
    const item = document.createElement("div");
    item.classList.add("item");
    item.innerHTML = `
      <span class="category">${todo.category}</span>
      <input type="checkbox" id="task${index}" ${todo.completed ? "checked" : ""}/>
      <label for="task${index}">${todo.todo}</label>
      <span class="days-left">${daysLeft}일 남음</span>
      <img src="icon/${todo.starred ? "full_star.svg" : "star.svg"}" alt="star" class="icon star" data-id="${todo.id}"/>
      <img src="icon/trash.svg" alt="trash" class="icon trash" data-id="${todo.id}"/>
    `;
    todoList.appendChild(item);
  });
  addEventListeners();
};

// 이벤트 리스너 추가
const addEventListeners = () => {
  // 체크박스 이벤트
  document.querySelectorAll('.todolist input[type="checkbox"]').forEach((checkbox) => {
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
        const index = todos.findIndex((t) => t.id == todoId);
        if (index !== -1) {
          todos.splice(index, 1);
        }
        saveTodos();
        displayTodos();
      }
    });
  });
};

const toggleDarkMode = () => {
  document.body.classList.toggle("dark-mode");
  saveDarkModeState(document.body.classList.contains("dark-mode"));
  updateIcons();
};

const updateIcons = () => {
  const isDarkMode = document.body.classList.contains("dark-mode");
  const iconMappings = {
    ".system_mode img": ["icon/light.svg", "icon/dark.svg"],
    ".floating-button img": ["icon/dark_plus.svg", "icon/light_plus.svg"],
    ".todo-write-button img": ["icon/dark_todo_write.svg", "icon/light_todo_write.svg"],
    ".calendar-button img": ["icon/dark_calendar.svg", "icon/light_calendar.svg"],
  };

  Object.entries(iconMappings).forEach(([selector, [darkSrc, lightSrc]]) => {
    const element = document.querySelector(selector);
    if (element) {
      element.src = isDarkMode ? darkSrc : lightSrc;
    }
  });
};

// 주간 날짜 업데이트 함수
const updateWeekDates = () => {
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
};

// 빈 상태 표시 또는 숨기기 함수
const toggleEmptyState = () => {
  const emptyState = document.querySelector('.empty-state');
  const todoList = document.querySelector('.todolist');
  if (emptyState && todoList) {
    if (todos.length === 0) {
      emptyState.style.display = 'flex';
      todoList.style.display = 'none';
    } else {
      emptyState.style.display = 'none';
      todoList.style.display = 'block';
    }
  }
};

// 타이틀 클릭 이벤트 핸들러
const handleTitleClick = (e) => {
  e.preventDefault();
  const hasTodos = todos.length > 0;
  if (!hasTodos) {
    window.location.href = "index.html";
  }
};

// 달력 렌더링 함수
const renderCalendar = () => {
  const viewYear = date.getFullYear();
  const viewMonth = date.getMonth();

  document.querySelector(".year-month").textContent = `${viewYear}년 ${viewMonth + 1}월`;

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

  dates.forEach((date, i) => {
    const condition = i >= firstDateIndex && i < lastDateIndex + 1 ? "this" : "other";
    let isToday = "";
    if (condition === "this" && date === todayDate && viewMonth === todayMonth && viewYear === todayYear) {
      isToday = " today";
    }
    dates[i] = `<div class="date"><span class="${condition}${isToday}">${date}</span></div>`;
  });

  document.querySelector(".dates").innerHTML = dates.join("");
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

// 다크 모드 상태를 로컬 스토리지에 저장
const saveDarkModeState = (isDarkMode) => {
  localStorage.setItem("darkMode", isDarkMode);
};

// 다크 모드 상태를 로컬 스토리지에서 불러오기
const loadDarkModeState = () => {
  return localStorage.getItem("darkMode") === "true";
};

// 페이지 리다이렉트 함수
const redirectToAppropriatePageData = () => {
  const hasTodos = todos.length > 0;
  const currentPage = window.location.pathname.split("/").pop();

  if (hasTodos && currentPage === "index.html") {
    window.location.href = "main.html";
  } else if (!hasTodos && currentPage === "main.html") {
    window.location.href = "index.html";
  }
};

// 날짜 입력 필드 초기화 함수
const initDateInput = () => {
  const dateInput = document.getElementById('date-input');
  if (dateInput) {
    // 오늘 날짜를 YYYY-MM-DD 형식으로 가져옵니다
    const today = new Date().toISOString().split('T')[0];
    
    // min 속성을 오늘 날짜로 설정합니다
    dateInput.min = today;
    
    // 선택된 날짜가 없거나 과거 날짜인 경우 오늘 날짜로 설정합니다
    if (!dateInput.value || dateInput.value < today) {
      dateInput.value = today;
    }
  }
};

// 초기화 함수
const init = () => {
  loadTodos();
  
  // 타이틀 클릭 이벤트 리스너 추가
  const titleLink = document.querySelector(".title a");
  if (titleLink) {
    titleLink.addEventListener("click", handleTitleClick);
  }

  // 현재 페이지에 따라 다른 초기화 작업 수행
  const currentPage = window.location.pathname.split("/").pop();
  
  if (currentPage === "calendar.html") {
    renderCalendar();
    
    // 달력 페이지 네비게이션 버튼 이벤트 리스너
    const prevBtn = document.querySelector(".go-prev");
    const nextBtn = document.querySelector(".go-next");
    const todayBtn = document.querySelector(".go-today");

    if (prevBtn) prevBtn.addEventListener("click", prevMonth);
    if (nextBtn) nextBtn.addEventListener("click", nextMonth);
    if (todayBtn) todayBtn.addEventListener("click", goToday);
  } else if (currentPage === "main.html" || currentPage === "index.html") {
    createCategoryOptions();
    displayTodos();
    updateWeekDates();
    toggleEmptyState();
  }

  // 다크 모드 상태 불러오기 및 적용
  const isDarkMode = loadDarkModeState();
  if (isDarkMode) {
    document.body.classList.add("dark-mode");
  }
  updateIcons();

  // 시스템 모드 버튼 이벤트 리스너
  const systemModeBtn = document.querySelector(".system_mode");
  if (systemModeBtn) {
    systemModeBtn.addEventListener("click", toggleDarkMode);
  }

  // 플로팅 버튼 이벤트 리스너
  const floatingBtn = document.querySelector(".floating-button");
  const additionalIcons = document.querySelector(".additional-icons");
  if (floatingBtn && additionalIcons) {
    floatingBtn.addEventListener("click", () => {
      additionalIcons.style.display = additionalIcons.style.display === "flex" ? "none" : "flex";
      updateIcons();
    });
  }

  // TO DO 작성 버튼 이벤트 리스너
  const todoWriteBtn = document.querySelector(".todo-write-button");
  if (todoWriteBtn) {
    todoWriteBtn.addEventListener("click", () => {
      window.location.href = "create-todo.html";
    });
  }

  // 캘린더 버튼 이벤트 리스너
  const calendarBtn = document.querySelector(".calendar-button");
  if (calendarBtn) {
    calendarBtn.addEventListener("click", () => {
      window.location.href = "calendar.html";
    });
  }

  // 등록 버튼 이벤트 리스너 (create-todo.html 페이지용)
  const todoSubmitBtn = document.querySelector(".todo-submit-button");
  if (todoSubmitBtn) {
    todoSubmitBtn.addEventListener("click", (e) => {
      e.preventDefault();

      const todoInput = document.getElementById("todo-input");
      const categorySelect = document.getElementById("category-select");
      const dateInput = document.getElementById("date-input");

      if (!todoInput.value || !categorySelect.value || !dateInput.value) {
        alert("모든 필드를 입력해주세요.");
        return;
      }

      addTodo(todoInput.value, categorySelect.value, dateInput.value);
      
      alert("등록되었습니다.");
      window.location.href = "main.html";
    });
  }

  // 취소 버튼 이벤트 리스너 (create-todo.html 페이지용)
  const cancelBtn = document.querySelector(".cancel-btn");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      window.location.href = "main.html";
    });
  }
  
  initDateInput();
};

// DOM이 로드되면 초기화 함수 실행
document.addEventListener("DOMContentLoaded", init);