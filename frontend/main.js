const API_URL = "http://127.0.0.1:8000/books/";

const state = {
  books: [],
  form: {
    title: "",
    author: "",
  },
  editingBookId: null,
};

const form = document.querySelector("#book-form");
const titleInput = document.querySelector("#title");
const authorInput = document.querySelector("#author");
const submitButton = document.querySelector("#submit-button");
const cancelButton = document.querySelector("#cancel-button");
const bookList = document.querySelector("#book-list");
const statusText = document.querySelector("#status");

function setStatus(message, isError = false) {
  statusText.textContent = message;
  statusText.classList.toggle("error", isError);
}

function syncFormInputs() {
  titleInput.value = state.form.title;
  authorInput.value = state.form.author;
  submitButton.textContent = state.editingBookId === null ? "Lägg till bok" : "Spara ändringar";
  cancelButton.hidden = state.editingBookId === null;
}

function resetForm() {
  state.form.title = "";
  state.form.author = "";
  state.editingBookId = null;
  syncFormInputs();
}

function startEditing(book) {
  state.form.title = book.title;
  state.form.author = book.author;
  state.editingBookId = book.id;
  syncFormInputs();
  setStatus(`Redigerar "${book.title}".`);
}

function renderBooks() {
  if (state.books.length === 0) {
    bookList.innerHTML = "<li class=\"empty\">Inga böcker ännu.</li>";
    return;
  }

  bookList.innerHTML = state.books
    .map(
      (book) => `
        <li class="book-item">
          <div>
            <strong>${book.title}</strong>
            <span>${book.author}</span>
          </div>
          <div class="row-actions">
            <button type="button" data-action="edit" data-id="${book.id}">Redigera</button>
            <button type="button" class="danger" data-action="delete" data-id="${book.id}">Ta bort</button>
          </div>
        </li>
      `
    )
    .join("");
}

async function fetchBooks() {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Kunde inte hämta böcker.");
  }

  state.books = await response.json();
  renderBooks();
}

async function saveBook() {
  const payload = { ...state.form };
  const isEditing = state.editingBookId !== null;
  const url = isEditing ? `${API_URL}${state.editingBookId}` : API_URL;
  const method = isEditing ? "PUT" : "POST";

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(isEditing ? "Kunde inte uppdatera bok." : "Kunde inte skapa bok.");
  }

  await fetchBooks();
  setStatus(isEditing ? "Boken uppdaterades." : "Boken skapades.");
  resetForm();
}

async function deleteBook(bookId) {
  const response = await fetch(`${API_URL}${bookId}`, { method: "DELETE" });
  if (!response.ok) {
    throw new Error("Kunde inte ta bort bok.");
  }

  if (state.editingBookId === bookId) {
    resetForm();
  }

  await fetchBooks();
  setStatus("Boken togs bort.");
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  state.form.title = titleInput.value.trim();
  state.form.author = authorInput.value.trim();

  if (!state.form.title || !state.form.author) {
    setStatus("Fyll i titel och författare.", true);
    return;
  }

  try {
    await saveBook();
  } catch (error) {
    setStatus(error.message, true);
  }
});

cancelButton.addEventListener("click", () => {
  resetForm();
  setStatus("Redigering avbruten.");
});

bookList.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  if (!button) {
    return;
  }

  const bookId = Number(button.dataset.id);
  const action = button.dataset.action;

  if (action === "edit") {
    const book = state.books.find((item) => item.id === bookId);
    if (book) {
      startEditing(book);
    }
    return;
  }

  if (action === "delete") {
    try {
      await deleteBook(bookId);
    } catch (error) {
      setStatus(error.message, true);
    }
  }
});

resetForm();
fetchBooks().catch((error) => {
  setStatus(error.message, true);
});
