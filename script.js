// 할 일 목록을 지정할 배열
let todos = [];

// 로컬 스토리지에서 기존 할 일 목록 불러오기
function loadTodos() {
  const stroedTodos = localStorage.getItem('todos');
  if(stroedTodos){
    todos = JSON.parse(stroedTodos)
  }
}

// 할 일 목록을 로컬 스토리지에 저장
function saveTodos(){
  localStorage.setItem('todos',JSON.stringify(todos))
}

// 새로운 할 일 추가
function addTodo(todo, category, date){
  const newTodo = {
    id: Date.now(),
    todo: todo,
    category: category,
    date: date,
    completed: false,
    starred: false
  };
  todos.push(newTodo);
  saveTodos();
}

// 남은 날짜 계산
function getDaysLeft(dueDate){
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due  - today;
  const diffDays = Math.ceil(diffTime / (1000*60*60*24));
  return diffDays;
}

// 할 일 목록 표시
function displayTodos() {
  const todoList = document.querySelector('.todolist');
  if(!todoList) return;

  todoList.innerHTML = '';
  todos.forEach((todo, index)=>{
    const daysLeft = getDaysLeft(todo.date);
    const item = document.createElement('div');
    item.classList.add('item');
    item.innerHTML = `
      <input type="checkbox" id="task${index}" ${todo.completed ? 'checked' : ''}/>
      <span class="category">${todo.category}</span>
      <label for="task${index}>${todo.todo}</label>
      <span class="days-left">${daysLeft}일 남음</span>
      <img src="icon/${todo.starred? 'full_star.svg' : 'star.svg'}" alt="star" class="icon star" data-id="${todo.id}"/>
      <img src="icon/trash.svg" alt="trash" class="icon trash" data-id="${todo.id}"/>
    `;
    todoList.appendChild(item);
  })
  // 이벤트 리스너 추가
  addEventListener();
}

// 이벤트 리스너 추가
function addEventListener() {
  // 체크박스 이벤트
  document.querySelectorAll('.todolist input[type="checkbox"]').forEach((checkbox)=>{
    checkbox.addEventListener('change', function(){
      const todoId = this.id.replace('task', '');
      todos[todoId].completed = this.checked;
      saveTodos();
    })
  })

  // 별표 토글 이벤트
  document.querySelectorAll('.star').forEach((star)=>{
    star.addEventListener('click', function(){
      const todoId = this.dataset.id;
      const todo = todos.find(t => t.id == todoId);
      todo.starred = !todo.starred;
      this.src = todo.starred ? 'icon/full_star.svg' : 'icon/star.svg';
      saveTodos();
    })
  })

  // 삭제 이벤트
  document.querySelectorAll('.trash').forEach((trash)=>{
    trash.addEventListener('click', function(){
      if(confirm('정말 삭제하시겠습니까?')){
        const todoId = this.dataset.id;
        todos = todos.filter(t => t.id != todoId);
        saveTodos();
        displayTodos();
      }
    })
  })
}

// 다크 모드 토글 함수
function toggleDarkMode() {
  const body = document.body;
  const darkModeBtn = document.querySelector(".system_mode img");
  const plusIcon = document.querySelector(".additional-icons img:last-child");
  const todoWriteIcon = document.querySelector(".additional-icons img:first-child");
  const todoCalendarIcon = document.querySelector(".additional-icons img:last-child");

  body.classList.toggle("dark-mode");

  if(body.classList.contains("dark-mode")){
    darkModeBtn.src = "icon/light.svg";
    plusIcon.src = plusIcon.src.includes("x.svg") ? "icon/dark_x.svg" : "icon/dark_plus.svg";
    todoWriteIcon.src = "icon/light_todo_write.svg";
    todoCalendarIcon.src = "icon/dark_calendar.svg";
  } else {
    darkModeBtn.src = "icon/dark.svg";
    plusIcon.src = plusIcon.src.includes("dark_x.svg") ? "icon/x.svg" : "icon/plus.svg";
    todoWriteIcon.src = "icon/dark_todo_write.svg";
    todoCalendarIcon.src = "icon/light_calendar.svg";
  }
}

// 초기화 함수
function init(){
  loadTodos();
  displayTodos();

  // 다크 모드 버튼 이벤트 리스너
  const darkModeBtn = document.querySelector(".system_mode");
  if (darkModeBtn) {
    darkModeBtn.addEventListener("click",toggleDarkMode);
  }
  
  // 플로팅 버튼 클릭 이벤트 리스너
  const floatingBtn = document.querySelector(".floating-button");
  if(floatingBtn){
    floatingBtn.addEventListener("click",function(){
      const additionalIcons = document.querySelector(".additional-icons");
      const plusIcon = this.querySelector("img");
      const isDarkMode = document.body.classList.contains("dark-mode");

      if(additionalIcons.style.display === "flex"){
        plusIcon.src = isDarkMode ? "icon/dark_plus.svg" : "icon/plus.svg";
        additionalIcons.style.display = "none";
      }else{
        plusIcon.src = isDarkMode ? "icon/dark_x.svg" : "icon/x.svg";
        additionalIcons.style.display = "flex";
      }
    });
  }

  // TO DO 작성 버튼 이벤트 리스너
  const todoWriteBtn = document.querySelector(".todo-write-button");
  if(todoWriteBtn){
    todoWriteBtn.addEventListener("click", function(){
      window.location.href = "create-todo.html";
    })
  }

  // 등록 버튼 이벤트 리스너
  const todoSubmitBtn = document.querySelector(".todo-submit-button");
  if(todoSubmitBtn){
    todoSubmitBtn.addEventListener("click", function(e){
      e.preventDefault();

      const todoInput = document.getElementById("todo-input");
      const categorySelect = document.getElementById("category-select");
      const dateInput = document.getElementById("date-input");

      if(!todoInput.value || !categorySelect.value || !dateInput.value){
        alert("모든 필드를 입력해주세요.")
        return;
      }

      addTodo(todoInput.value, categorySelect.value, dateInput.value);
      displayTodos();

      todoInput.value = '';
      categorySelect.value = '';
      dateInput.value = '';

      alert("등록되었습니다.");
      window.location.href = "main.html";
    });
  }

  // 드롭다운 관련 코드
  const dropBtn = document.querySelector(".dropdown-btn");
  const dropdown = document.getElementById("todoDropdown");
  const arrow = document.querySelector(".arrow");
  const confirmBtn = document.getElementById("confirmBtn");
  const addMoreBtn = document.getElementById("addMore");

  if(dropBtn && dropdown && arrow){
    const toggleDropdown = () => {
      dropdown.classList.toggle("show");
      arrow.classList.toggle("up");
    };
    dropBtn.addEventListener("click", toggleDropdown);

    const stopPropagation = (e) =>{
      e.stopPropagation();
    };
    
    dropdown.addEventListener("click", stopPropagation);

    window.addEventListener("click", (e)=>{
      if(!e.target.matches(".dropdown-btn") && !e.target.matches(".arrow")){
        if(dropdown.classList.contains("show")){
          dropdown.classList.remove("show");
          arrow.classList.remove("up");
        }
      }
    });
  }
  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      // TODO: 선택된 필터 처리 로직 구현
      dropdown.classList.remove("show");
      arrow.classList.remove("up");
    });
  }

  if (addMoreBtn) {
    addMoreBtn.addEventListener("click", (e) => {
      e.preventDefault();
      // TODO: 더보기 기능 구현
    });
  }
}

// DOM이 로드되면 초기화 함수 실행
document.addEventListener('DOMContentLoaded', init);


