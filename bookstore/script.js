const bookstore = {
  books: [
    {
      title: "자바스크립트 완벽 가이드",
      author: "David Flanagan",
      available: true,
    },
    {
      title: "모던 자바스크립트",
      author: "Nicolás Bevacqua",
      available: true,
    },
    {
      title: "자바스크립트 디버깅",
      author: "Patricia",
      available: true,
    },
    {
      title: "자바스크립트 패턴",
      author: "Stoyan Stefanov",
      available: true,
    },
    {
      title: "자바스크립트로 배우는 데이터 구조와 알고리즘",
      author: "Loiane Groner",
      available: true,
    },
  ],
};

const bookListElement = document.getElementById("bookList");
const loanListElement = document.getElementById("loanList");

function toggleAvailable(bookIndex) {
  const book = bookstore.books[bookIndex];
  book.available = !book.available;
  if (book.available) {
    alert("반납 되었습니다");
  } else {
    alert("대출 되었습니다");
  }

  updateBookList();
  viewLoanList();
}

function updateBookList() {
  bookListElement.innerHTML = "";
  bookstore.books.forEach((book, index) => {
    bookListElement.innerHTML += `
      <div class= "book">
          <span>${book.title}</span>
          <span>${book.author}</span>
          <button onclick="toggleAvailable(${index})">${
      book.available ? "대출" : "반납"
    }</button>
      </div> 
      `;
  });
}

function viewLoanList() {
  loanListElement.innerHTML = "";
  const loanedBooks = bookstore.books.filter((book) => !book.available);
  loanedBooks.forEach((book) => {
    loanListElement.innerHTML += `
     <div class="loan">
        <span>${book.title}</span>
        <span>${book.author}</span>
      </div>
      `;
  });
}

function bookSearch() {
  const searchInput = document.getElementById("searchInput").value;
  const filteredBooks = bookstore.books.filter((book) =>
    book.title.includes(searchInput)
  );

  bookListElement.innerHTML = "";
  filteredBooks.forEach((book) => {
    bookListElement.innerHTML += `
    <div class="book">
        <span>${book.title}</span>
        <span>${book.author}</span>
    </div>
    `;
  });
}

document
  .getElementById("searchInput")
  .addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      bookSearch();
    }
  });

updateBookList();
viewLoanList();
