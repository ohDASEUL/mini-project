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
    }
  ],
};

const bookListElement = document.getElementById("bookList");

bookstore.books.forEach((book) => {
  bookListElement.innerHTML += `
    <div class= "book">
        <span>${book.title}</span>
        <span>${book.author}</span>
    </div>
    `;
});
