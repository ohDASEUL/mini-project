// 상태 관리
const state = {
  todos: [],
  categories: ["업무", "취미", "집안일", "기타"],
  date: new Date(),
};

// 로컬 스토리지 처리
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
  },
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
  removeExpiredTodos: () => {
    const today = new Date().setHours(0, 0, 0, 0);
    const prevLength = state.todos.length;
    state.todos = state.todos.filter(
      (todo) => new Date(todo.date).setHours(0, 0, 0, 0) >= today
    );
    storage.saveTodos();
    if (prevLength > 0 && state.todos.length === 0) {
      pageManager.redirectToIndex();
    }
  },
  toggleTodoComplete: (todoId, completed) => {
    const todo = state.todos.find((t) => t.id == todoId);
    if (todo) {
      todo.completed = completed;
      storage.saveTodos();
    }
  },
  toggleTodoStar: (todoId) => {
    const todo = state.todos.find((t) => t.id == todoId);
    if (todo) {
      todo.starred = !todo.starred;
      storage.saveTodos();
    }
  },
  removeTodo: (todoId) => {
    state.todos = state.todos.filter((todo) => todo.id != todoId);
    storage.saveTodos();
  },
  getDaysLeft: (dueDate) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const due = new Date(dueDate).setHours(0, 0, 0, 0);
    const diffTime = due - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },
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
    todoManager.removeExpiredTodos();
    const todoList = document.querySelector(".todo-list-container");
    if (!todoList) return;

    if (filteredTodos.length === 0) {
      document.querySelector(".empty-state").style.display = "flex";
      todoList.style.display = "none";
      return;
    }

    document.querySelector(".empty-state").style.display = "none";
    todoList.style.display = "block";

    filteredTodos.sort((a, b) => {
      if (a.starred && !b.starred) return -1;
      if (!a.starred && b.starred) return 1;
      return new Date(a.date) - new Date(b.date);
    });

    todoList.innerHTML = "";
    filteredTodos.forEach((todo) => {
      const daysLeft = todoManager.getDaysLeft(todo.date);
      if (daysLeft >= 0) {
        const item = document.createElement("div");
        item.classList.add("todo-item");
        item.innerHTML = `
                  <input type="checkbox" id="task${todo.id}" ${
          todo.completed ? "checked" : ""
        } data-id="${todo.id}"/>
                  <label for="task${todo.id}">${todo.todo}</label>
                  <span class="category">${todo.category}</span>
                  <span class="days-left">${daysLeft}일 남음</span>
                  <img src="icon/${
                    todo.starred ? "full_star.svg" : "star.svg"
                  }" alt="star" class="icon star" data-id="${todo.id}"/>
                  <img src="icon/trash.svg" alt="trash" class="icon trash" data-id="${
                    todo.id
                  }"/>
              `;
        todoList.appendChild(item);
      }
    });
    uiManager.addEventListeners();
  },
  addEventListeners: () => {
    document
      .querySelectorAll('.todo-list-container input[type="checkbox"]')
      .forEach((checkbox) => {
        checkbox.addEventListener("change", function () {
          todoManager.toggleTodoComplete(this.dataset.id, this.checked);
          uiManager.displayTodos();
        });
      });

    document.querySelectorAll(".star").forEach((star) => {
      star.addEventListener("click", function () {
        todoManager.toggleTodoStar(this.dataset.id);
        uiManager.displayTodos();
      });
    });

    document.querySelectorAll(".trash").forEach((trash) => {
      trash.addEventListener("click", function () {
        if (confirm("정말 삭제하시겠습니까?")) {
          todoManager.removeTodo(this.dataset.id);
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
    };

    Object.entries(iconMappings).forEach(([selector, [darkSrc, lightSrc]]) => {
      const element = document.querySelector(selector);
      if (element) {
        element.src = isDarkMode ? darkSrc : lightSrc;
      }
    });
  },
  renderCalendar: () => {
    const yearMonth = document.querySelector(".year-month");
    const dates = document.querySelector(".dates");
    const currentDate = state.date;
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    yearMonth.textContent = `${year}년 ${month + 1}월`;

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    let dateHTML = "";
    for (let i = 0; i < firstDay; i++) {
      dateHTML += '<div class="date"></div>';
    }
    for (let i = 1; i <= lastDate; i++) {
      dateHTML += `<div class="date" data-date="${i}"><span>${i}</span></div>`;
    }
    dates.innerHTML = dateHTML;

    // 오늘 날짜 표시
    const today = new Date();
    if (year === today.getFullYear() && month === today.getMonth()) {
      const todayDate = today.getDate();
      const todayIndex = firstDay + todayDate - 1;
      const todayElement = dates.children[todayIndex];
      if (todayElement) {
        todayElement.querySelector('span').classList.add("today");
      }
    }
  },
  openModal: (dateStr) => {
    const modal = document.getElementById("dateModal");
    const modalDate = document.getElementById("modalDate");
    const completedTodos = document.getElementById("completedTodos");
    const incompleteTodos = document.getElementById("incompleteTodos");
    const progressBar = document.getElementById("progressBar");
    const progressText = document.getElementById("progressText");
    const dynamicActionBtn = document.getElementById("dynamicActionBtn");
    const closeModalBtn = document.getElementById("closeModalBtn");

    modalDate.textContent = dateStr;

    const todos = state.todos.filter((todo) => todo.date === dateStr);
    const completedCount = todos.filter((todo) => todo.completed).length;
    const completionRate =
      todos.length > 0 ? (completedCount / todos.length) * 100 : 0;

    progressBar.style.width = `${completionRate}%`;
    progressText.textContent = `${Math.round(completionRate)}%`;

    completedTodos.innerHTML = todos
      .filter((todo) => todo.completed)
      .map((todo) => `<div>${todo.todo}</div>`)
      .join("");

    incompleteTodos.innerHTML = todos
      .filter((todo) => !todo.completed)
      .map((todo) => `<div>${todo.todo}</div>`)
      .join("");

    const today = new Date().toISOString().split("T")[0];
    if (dateStr < today) {
      dynamicActionBtn.textContent = "오늘로 복사하기";
      dynamicActionBtn.onclick = () => uiManager.copyToToday(dateStr);
      dynamicActionBtn.style.display = "block";
    } else if (dateStr === today) {
      dynamicActionBtn.textContent = "이동하기";
      dynamicActionBtn.onclick = () => uiManager.navigateToToday();
      dynamicActionBtn.style.display = "block";
    } else {
      dynamicActionBtn.style.display = "none";
    }

    closeModalBtn.onclick = uiManager.closeModal;

    modal.style.display = "block";
  },
  closeModal: () => {
    document.getElementById("dateModal").style.display = "none";
  },
  copyToToday: (dateStr) => {
    const today = new Date().toISOString().split("T")[0];
    const todosToday = state.todos.filter((todo) => todo.date === today);
    const todosToCopy = state.todos.filter(
      (todo) => todo.date === dateStr && !todo.completed
    );

    todosToCopy.forEach((todo) => {
      const newTodo = { ...todo, id: Date.now(), date: today };
      todosToday.push(newTodo);
    });

    storage.saveTodos();
    uiManager.closeModal();
    uiManager.renderCalendar();
    alert(`${todosToCopy.length}개의 할 일이 오늘로 복사되었습니다.`);
  },
  navigateToToday: () => {
    window.location.href = "main.html";
  },
};

// 페이지 관리
const pageManager = {
  redirectToAppropriatePageData: () => {
    storage.loadTodos();
    const hasTodos = state.todos.length > 0;
    const currentPage = window.location.pathname.split("/").pop();

    if (hasTodos && currentPage === "index.html") {
      window.location.href = "main.html";
    } else if (!hasTodos && currentPage === "main.html") {
      window.location.href = "index.html";
    }
  },
  redirectToIndex: () => {
    window.location.href = "index.html";
  },
};

// 초기화 함수
const init = () => {
  storage.loadTodos();
  todoManager.removeExpiredTodos();
  uiManager.createCategoryOptions();
  uiManager.displayTodos();
  uiManager.renderCalendar();

  const isDarkMode = storage.loadDarkModeState();
  if (isDarkMode) {
    document.body.classList.add("dark-mode");
  }
  uiManager.updateIcons();

  // 이벤트 리스너 추가
  document.querySelector(".system_mode")?.addEventListener("click", uiManager.toggleDarkMode);
  document.querySelector(".todo-write-button")?.addEventListener("click", () => {
    window.location.href = "create-todo.html";
  });
  document.querySelector(".modal .modal-close")?.addEventListener("click", () => {
    document.querySelector(".modal").style.display = "none";
  });
  document.querySelector(".modal .modal-btn.primary")?.addEventListener("click", () => {
    const todoInput = document.querySelector("#todo-input").value;
    const categorySelect = document.querySelector("#category-select").value;
    const dueDate = document.querySelector("#due-date").value;

    if (todoInput && categorySelect && dueDate) {
      todoManager.addTodo(todoInput, categorySelect, dueDate);
      uiManager.displayTodos();
      document.querySelector(".modal").style.display = "none";
    }
  });

  // 캘린더 날짜 클릭 시 모달 열기
  document.querySelector(".dates")?.addEventListener("click", (event) => {
    if (event.target.classList.contains("date")) {
      const selectedDate = event.target.dataset.date;
      if (selectedDate) {
        uiManager.openModal(`${state.date.getFullYear()}년 ${state.date.getMonth() + 1}월 ${selectedDate}일`);
      }
    }
  });

  pageManager.redirectToAppropriatePageData();
};

// 초기화 호출
init();
