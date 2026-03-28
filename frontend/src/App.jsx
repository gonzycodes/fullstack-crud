import { useEffect, useState } from "react";

const apiBaseUrl = "http://127.0.0.1:8000/books";

const initialForm = {
  title: "",
  author: "",
};

function App() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void loadBooks();
  }, []);

  async function loadBooks() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(apiBaseUrl);
      if (!response.ok) {
        throw new Error("Kunde inte hämta böcker.");
      }

      const data = await response.json();
      setBooks(data);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const trimmedForm = {
      title: form.title.trim(),
      author: form.author.trim(),
    };

    if (!trimmedForm.title || !trimmedForm.author) {
      setError("Titel och författare måste fyllas i.");
      return;
    }

    const isEditing = editingId !== null;
    const url = isEditing ? `${apiBaseUrl}/${editingId}` : apiBaseUrl;
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trimmedForm),
      });

      if (!response.ok) {
        throw new Error(
          isEditing ? "Kunde inte uppdatera boken." : "Kunde inte skapa boken.",
        );
      }

      setForm(initialForm);
      setEditingId(null);
      await loadBooks();
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  async function handleEdit(bookId) {
    setError("");

    try {
      const response = await fetch(`${apiBaseUrl}/${bookId}`);
      if (!response.ok) {
        throw new Error("Kunde inte hamta boken.");
      }

      const book = await response.json();
      setEditingId(book.id);
      setForm({
        title: book.title,
        author: book.author,
      });
    } catch (editError) {
      setError(editError.message);
    }
  }

  function handleCancelEdit() {
    setEditingId(null);
    setForm(initialForm);
    setError("");
  }

  async function handleDelete(bookId) {
    setError("");

    try {
      const response = await fetch(`${apiBaseUrl}/${bookId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Kunde inte ta bort boken.");
      }

      if (editingId === bookId) {
        handleCancelEdit();
      }

      await loadBooks();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  }

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Fullstack CRUD</p>
        <h1>Book Manager</h1>
        <p className="lead">
          Hantera en liten boksamling med FastAPI i backend och React i frontend.
        </p>
      </section>

      <section className="panel">
        <h2>{editingId ? "Uppdatera bok" : "Lagg till bok"}</h2>
        <form className="book-form" onSubmit={handleSubmit}>
          <label>
            Titel
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Till exempel Dune"
            />
          </label>

          <label>
            Forfattare
            <input
              name="author"
              value={form.author}
              onChange={handleChange}
              placeholder="Till exempel Frank Herbert"
            />
          </label>

          <div className="actions">
            <button type="submit">
              {editingId ? "Spara andringar" : "Skapa bok"}
            </button>
            {editingId ? (
              <button type="button" className="secondary" onClick={handleCancelEdit}>
                Avbryt
              </button>
            ) : null}
          </div>
        </form>

        {error ? <p className="message error">{error}</p> : null}
      </section>

      <section className="panel">
        <div className="section-header">
          <h2>Bocker</h2>
          <button type="button" className="secondary" onClick={loadBooks}>
            Uppdatera lista
          </button>
        </div>

        {loading ? <p className="message">Laddar...</p> : null}

        {!loading && books.length === 0 ? (
          <p className="message">Inga bocker sparade an.</p>
        ) : null}

        <div className="grid">
          {books.map((book) => (
            <article key={book.id} className="card">
              <div>
                <h3>{book.title}</h3>
                <p>{book.author}</p>
              </div>
              <div className="actions">
                <button type="button" className="secondary" onClick={() => handleEdit(book.id)}>
                  Redigera
                </button>
                <button type="button" className="danger" onClick={() => handleDelete(book.id)}>
                  Ta bort
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;
