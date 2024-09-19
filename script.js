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
    const todoList = document.querySelector(".todolist");
    if (!todoList) return;

    if (filteredTodos.length === 0) {
      todoList.innerHTML = '<li class="empty-state">할 일이 없습니다.</li>';
      return;
    }

    filteredTodos.sort((a, b) => {
      if (a.starred && !b.starred) return -1;
      if (!a.starred && b.starred) return 1;
      return new Date(a.date) - new Date(b.date);
    });

    todoList.innerHTML = "";
    filteredTodos.forEach((todo) => {
      const daysLeft = todoManager.getDaysLeft(todo.date);
      if (daysLeft >= 0) {
        const item = document.createElement("li");
        item.classList.add("item");
        item.innerHTML = `
          <span class="category ${todo.category}">${todo.category}</span>
          <input type="checkbox" id="task${todo.id}" ${
          todo.completed ? "checked" : ""
        } data-id="${todo.id}"/>
          <label for="task${todo.id}" class="${todo.completed ? "completed" : ""}">${todo.todo}</label>
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
  
  renderCalendar: () => {
    const yearMonth = document.querySelector(".year-month");
    const dates = document.querySelector(".dates");

    if (!yearMonth || !dates) {
      console.log("캘린더 렌더링에 필요한 요소가 페이지에 없습니다.");
      return;
    }

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
      const fullDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        i
      ).padStart(2, "0")}`;
      dateHTML += `<div class="date" data-date="${fullDate}"><span>${i}</span></div>`;
    }
    dates.innerHTML = dateHTML;

    const today = new Date();
    if (year === today.getFullYear() && month === today.getMonth()) {
      const todayDate = today.getDate();
      const todayIndex = firstDay + todayDate - 1;
      const todayElement = dates.children[todayIndex];
      if (todayElement) {
        todayElement.querySelector("span").classList.add("today");
      }
    }

    // 날짜 클릭 이벤트 리스너 추가
    dates.querySelectorAll(".date").forEach((dateElement) => {
      dateElement.addEventListener("click", function () {
        const clickedDate = this.dataset.date;
        if (clickedDate) {
          uiManager.openModal(clickedDate);
        }
      });
    });
  },
  prevMonth: () => {
    state.date.setMonth(state.date.getMonth() - 1);
    uiManager.renderCalendar();
  },

  nextMonth: () => {
    state.date.setMonth(state.date.getMonth() + 1);
    uiManager.renderCalendar();
  },

  goToToday: () => {
    state.date = new Date();
    uiManager.renderCalendar();
  },

  addCalendarEventListeners: () => {
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const todayBtn = document.getElementById("todayBtn");

    if (prevBtn) prevBtn.addEventListener("click", uiManager.prevMonth);
    if (nextBtn) nextBtn.addEventListener("click", uiManager.nextMonth);
    if (todayBtn) todayBtn.addEventListener("click", uiManager.goToToday);
  },

  openModal: (dateStr) => {
    const modal = document.getElementById("dateModal");
    const modalDate = document.getElementById("modalDate");
    const completedTodos = document.getElementById("completedTodos");
    const incompleteTodos = document.getElementById("incompleteTodos");
    const progressBar = document.getElementById("progressBar");
    const progressText = document.getElementById("progressText");
    const dynamicActionBtn = document.querySelector(
      ".modal-actions button:not(#closeModalBtn)"
    );
    const closeModalBtn = document.querySelector(
      ".modal-actions button#closeModalBtn"
    );

    if (
      !modal ||
      !modalDate ||
      !completedTodos ||
      !incompleteTodos ||
      !progressBar ||
      !progressText ||
      !dynamicActionBtn ||
      !closeModalBtn
    ) {
      console.error("모달에 필요한 요소가 없습니다.");
      return;
    }

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
      dynamicActionBtn.style.display = "inline-block";
    } else if (dateStr === today) {
      dynamicActionBtn.textContent = "이동하기";
      dynamicActionBtn.onclick = () => uiManager.navigateToToday();
      dynamicActionBtn.style.display = "inline-block";
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
  redirectToMain: () => {
    window.location.href = "main.html";
  },

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

const init = () => {
  storage.loadTodos();
  todoManager.removeExpiredTodos();
  uiManager.createCategoryOptions();
  uiManager.displayTodos();
  uiManager.renderCalendar();
  uiManager.addCalendarEventListeners();

  document
    .querySelector(".todo-write-button")
    ?.addEventListener("click", () => {
      window.location.href = "create-todo.html";
    });

  // Todo 폼 제출 이벤트 리스너
  const todoForm = document.getElementById("todo-form");
  if (todoForm) {
    todoForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const todoInput = document.getElementById("todo-input");
      const categorySelect = document.getElementById("category-select");
      const dateInput = document.getElementById("date-input");
      if (!todoInput.value || !categorySelect.value || !dateInput.value) {
        alert("모든 필드를 입력해주세요.");
        return;
      }
      try {
        todoManager.addTodo(
          todoInput.value,
          categorySelect.value,
          dateInput.value
        );
        console.log("할 일 추가 완료");
        if (confirm("등록되었습니다. 메인 페이지로 이동하시겠습니까?")) {
          console.log("main.html로 이동 시도");
          window.location.href = "main.html";
          console.log("main.html로 이동 명령 실행됨");
        }
      } catch (error) {
        console.error("할 일 추가 중 오류 발생:", error);
        alert("할 일 추가 중 오류가 발생했습니다. 다시 시도해 주세요.");
      }
    });
  }

  // 취소 버튼 이벤트 리스너
  const cancelBtn = document.getElementById("cancel-btn");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", (e) => {
      e.preventDefault(); // 기본 동작 방지
      if (confirm("작성을 취소하고 메인 페이지로 돌아가시겠습니까?")) {
        console.log("index.html로 이동 시도");
        window.location.href = "index.html"; // index.html로 이동
        console.log("index.html로 이동 명령 실행됨");
      }
    });
  }

  pageManager.redirectToAppropriatePageData();
};

// 초기화 호출
document.addEventListener("DOMContentLoaded", init);
