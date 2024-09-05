// 상태 관리
const state = {
  todos: [],
  categories: ["업무", "취미", "집안일", "기타"],
  date: new Date()
};

// 로컬 스토리지 관리
const storage = {
  loadTodos: () => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      state.todos = JSON.parse(storedTodos);
    }
  },
  saveTodos: () => {
    localStorage.setItem("todos", JSON.stringify(state.todos));
  },
  saveDarkModeState: (isDarkMode) => {
    localStorage.setItem("darkMode", isDarkMode);
  },
  loadDarkModeState: () => {
    return localStorage.getItem("darkMode") === "true";
  }
};

// 할 일 관리
const todoManager = {
  addTodo: (todo, category, date) => {
    const newTodo = {
      id: Date.now(),
      todo,
      category,
      date,
      completed: false,
      starred: false,
    };
    state.todos.push(newTodo);
    storage.saveTodos();
  },
  getDaysLeft: (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
};

// UI 관리
const uiManager = {
  createCategoryOptions: () => {
    const categorySelect = document.getElementById("category-select");
    const filterOptions = document.querySelector(".filter-options");

    if (categorySelect) {
      categorySelect.innerHTML = '<option value="">선택하세요</option>';
      state.categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
      });
    }

    if (filterOptions) {
      filterOptions.innerHTML = "";
      state.categories.forEach((category) => {
        const label = document.createElement("label");
        label.innerHTML = `<input type="radio" name="filter" value="${category}"> ${category}`;
        filterOptions.appendChild(label);
      });
    }
  },
  filterTodos: (category) => {
    const filteredTodos = category
      ? state.todos.filter((todo) => todo.category === category)
      : state.todos;
    uiManager.displayTodos(filteredTodos);
  },
  displayTodos: (filteredTodos = state.todos) => {
    const todoList = document.querySelector(".todolist");
    if (!todoList) return;

    todoList.innerHTML = "";
    filteredTodos.forEach((todo, index) => {
      const daysLeft = todoManager.getDaysLeft(todo.date);
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
    uiManager.addEventListeners();
  },
  addEventListeners: () => {
    document.querySelectorAll('.todolist input[type="checkbox"]').forEach((checkbox) => {
      checkbox.addEventListener("change", function () {
        const todoId = this.id.replace("task", "");
        state.todos[todoId].completed = this.checked;
        storage.saveTodos();
        uiManager.displayTodos();
      });
    });

    document.querySelectorAll(".star").forEach((star) => {
      star.addEventListener("click", function () {
        const todoId = this.dataset.id;
        const todo = state.todos.find((t) => t.id == todoId);
        todo.starred = !todo.starred;
        this.src = todo.starred ? "icon/full_star.svg" : "icon/star.svg";
        storage.saveTodos();
        uiManager.displayTodos();
      });
    });

    document.querySelectorAll(".trash").forEach((trash) => {
      trash.addEventListener("click", function () {
        if (confirm("정말 삭제하시겠습니까?")) {
          const todoId = this.dataset.id;
          const index = state.todos.findIndex((t) => t.id == todoId);
          if (index !== -1) {
            state.todos.splice(index, 1);
          }
          storage.saveTodos();
          uiManager.displayTodos();
        }
      });
    });
  },
  toggleDarkMode: () => {
    document.body.classList.toggle("dark-mode");
    storage.saveDarkModeState(document.body.classList.contains("dark-mode"));
    uiManager.updateIcons();
  },
  updateIcons: () => {
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
  },
  updateWeekDates: () => {
    const weekdays = ["월", "화", "수", "목", "금", "토", "일"];
    const today = new Date();
    const currentDay = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - currentDay + (currentDay === 0 ? -6 : 1));

    const weekdaysEl = document.querySelector(".day_section .weekdays");
    const datesEl = document.querySelector(".day_section .dates");

    if (!weekdaysEl || !datesEl) return;

    weekdaysEl.innerHTML = "";
    datesEl.innerHTML = "";

    [...Array(7)].forEach((_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);

      const weekdayLi = document.createElement("li");
      weekdayLi.textContent = weekdays[i];
      weekdaysEl.appendChild(weekdayLi);

      const dateLi = document.createElement("li");
      dateLi.textContent = date.getDate();

      if (date.toDateString() === today.toDateString()) {
        dateLi.classList.add("today");
        weekdayLi.classList.add("today");
      }

      datesEl.appendChild(dateLi);
    });
  },
  toggleEmptyState: () => {
    const emptyState = document.querySelector(".empty-state");
    const todoList = document.querySelector(".todolist");
    if (emptyState && todoList) {
      emptyState.style.display = state.todos.length === 0 ? "flex" : "none";
      todoList.style.display = state.todos.length === 0 ? "none" : "block";
    }
  },
  renderCalendar: () => {
    const viewYear = state.date.getFullYear();
    const viewMonth = state.date.getMonth();

    document.querySelector(".year-month").textContent = `${viewYear}년 ${viewMonth + 1}월`;

    const prevLast = new Date(viewYear, viewMonth, 0);
    const thisLast = new Date(viewYear, viewMonth + 1, 0);

    const PLDate = prevLast.getDate();
    const PLDay = prevLast.getDay();

    const TLDate = thisLast.getDate();
    const TLDay = thisLast.getDay();

    const prevDates = Array.from({length: PLDay + 1}, (_, i) => PLDate - i).reverse();
    const thisDates = Array.from({length: TLDate}, (_, i) => i + 1);
    const nextDates = Array.from({length: 6 - TLDay}, (_, i) => i + 1);

    const dates = [...prevDates, ...thisDates, ...nextDates];

    const today = new Date();

    dates.forEach((date, i) => {
      const condition = i >= prevDates.length && i < prevDates.length + thisDates.length ? "this" : "other";
      const isToday = condition === "this" && date === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear() ? " today" : "";
      dates[i] = `<div class="date"><span class="${condition}${isToday}">${date}</span></div>`;
    });

    document.querySelector(".dates").innerHTML = dates.join("");
  },
  initDateInput: () => {
    const dateInput = document.getElementById("date-input");
    if (dateInput) {
      const today = new Date().toISOString().split("T")[0];
      dateInput.min = today;
      if (!dateInput.value || dateInput.value < today) {
        dateInput.value = today;
      }
    }
  },
  toggleDropdown: () => {
    const dropdownContent = document.querySelector(".dropdown-content");
    const arrow = document.querySelector(".arrow");
    dropdownContent.classList.toggle("show");
    arrow.classList.toggle("up");
  }
};

// 페이지 관리
const pageManager = {
  redirectToAppropriatePageData: () => {
    const hasTodos = state.todos.length > 0;
    const currentPage = window.location.pathname.split("/").pop();

    if (hasTodos && currentPage === "index.html") {
      window.location.href = "main.html";
    } else if (!hasTodos && currentPage === "main.html") {
      window.location.href = "index.html";
    }
  },
  handleTitleClick: (e) => {
    e.preventDefault();
    const hasTodos = state.todos.length > 0;
    if (!hasTodos) {
      window.location.href = "index.html";
    }
  }
};

// 초기화
const init = () => {
  storage.loadTodos();

  const dropdownBtn = document.querySelector(".dropdown-btn");
  if (dropdownBtn) {
    dropdownBtn.addEventListener("click", uiManager.toggleDropdown);
  }

  const confirmBtn = document.getElementById("confirmBtn");
  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      const selectedFilter = document.querySelector('input[name="filter"]:checked');
      uiManager.filterTodos(selectedFilter ? selectedFilter.value : null);
      uiManager.toggleDropdown();
    });
  }

  document.addEventListener("click", (event) => {
    const dropdown = document.querySelector(".dropdown");
    const dropdownContent = document.querySelector(".dropdown-content");
    if (dropdown && dropdownContent && !dropdown.contains(event.target) && dropdownContent.classList.contains("show")) {
      uiManager.toggleDropdown();
    }
  });

  const titleLink = document.querySelector(".title a");
  if (titleLink) {
    titleLink.addEventListener("click", pageManager.handleTitleClick);
  }

  const currentPage = window.location.pathname.split("/").pop();

  if (currentPage === "calendar.html") {
    uiManager.renderCalendar();

    ["go-prev", "go-next", "go-today"].forEach(className => {
      const btn = document.querySelector(`.${className}`);
      if (btn) {
        btn.addEventListener("click", () => {
          if (className === "go-prev") state.date.setMonth(state.date.getMonth() - 1);
          else if (className === "go-next") state.date.setMonth(state.date.getMonth() + 1);
          else if (className === "go-today") state.date = new Date();
          uiManager.renderCalendar();
        });
      }
    });
  } else if (currentPage === "main.html" || currentPage === "index.html") {
    uiManager.createCategoryOptions();
    uiManager.displayTodos();
    uiManager.updateWeekDates();
    uiManager.toggleEmptyState();
  }

  const isDarkMode = storage.loadDarkModeState();
  if (isDarkMode) {
    document.body.classList.add("dark-mode");
  }
  uiManager.updateIcons();

  const systemModeBtn = document.querySelector(".system_mode");
  if (systemModeBtn) {
    systemModeBtn.addEventListener("click", uiManager.toggleDarkMode);
  }

  const floatingBtn = document.querySelector(".floating-button");
  const additionalIcons = document.querySelector(".additional-icons");
  if (floatingBtn && additionalIcons) {
    floatingBtn.addEventListener("click", () => {
      additionalIcons.style.display = additionalIcons.style.display === "flex" ? "none" : "flex";
      uiManager.updateIcons();
    });
  }

  const todoWriteBtn = document.querySelector(".todo-write-button");
  if (todoWriteBtn) {
    todoWriteBtn.addEventListener("click", () => {
      window.location.href = "create-todo.html";
    });
  }

  const calendarBtn = document.querySelector(".calendar-button");
  if (calendarBtn) {
    calendarBtn.addEventListener("click", () => {
      window.location.href = "calendar.html";
    });
  }

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

      todoManager.addTodo(todoInput.value, categorySelect.value, dateInput.value);

      alert("등록되었습니다.");
      window.location.href = "main.html";
    });
  }

  const cancelBtn = document.querySelector(".cancel-btn");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      window.location.href = "main.html";
    });
  }

  uiManager.initDateInput();
};

// DOM이 로드되면 초기화 함수 실행
document.addEventListener("DOMContentLoaded", init);