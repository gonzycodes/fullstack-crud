const API_URL = "http://127.0.0.1:8000/books/";

const form = document.querySelector("#book-form");
const titleInput = document.querySelector("#title");
const authorInput = document.querySelector("#author");
const errorMessage = document.querySelector("#error-message");
const booksList = document.querySelector("#books-list");

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.hidden = false;
}

function clearError() {
  errorMessage.textContent = "";
  errorMessage.hidden = true;
}

function renderBooks(books) {
  booksList.innerHTML = "";

  for (const book of books) {
    const item = document.createElement("li");
    item.textContent = `${book.title} - ${book.author}`;
    booksList.appendChild(item);
  }
}

async function fetchBooks() {
  clearError();

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Kunde inte hämta böcker.");
    }

    const books = await response.json();
    renderBooks(books);
  } catch (error) {
    showError(error.message);
  }
}

async function createBook(event) {
  event.preventDefault();
  clearError();

  const payload = {
    title: titleInput.value.trim(),
    author: authorInput.value.trim(),
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Kunde inte skapa bok.");
    }

    form.reset();
    await fetchBooks();
  } catch (error) {
    showError(error.message);
  }
}

form.addEventListener("submit", createBook);

fetchBooks();
