import { useEffect, useState } from "react";

const API_BASE = "http://localhost:8000/books";

export default function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadBooks() {
    try {
      setError("");
      setLoading(true);
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error("Kunde inte hamta bocker");
      const data = await res.json();
      setBooks(Array.isArray(data) ? data : data.items || []);
    } catch (err) {
      setError(err.message || "Nagot gick fel");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;

    try {
      setError("");
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), author: author.trim() }),
      });
      if (!res.ok) throw new Error("Kunde inte skapa bok");
      setTitle("");
      setAuthor("");
      await loadBooks();
    } catch (err) {
      setError(err.message || "Nagot gick fel");
    }
  }

  useEffect(() => {
    loadBooks();
  }, []);

  return (
    <div className="page">
      <header className="header">
        <h1>Books CRUD</h1>
        <p>En enkel lista och ett formulär för att skapa böcker.</p>
      </header>

      <section className="card">
        <h2>Skapa bok</h2>
        <form onSubmit={handleSubmit} className="form">
          <label className="field">
            Titel
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="T.ex. Clean Code"
            />
          </label>
          <label className="field">
            Forfattare
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="T.ex. Robert C. Martin"
            />
          </label>
          <button type="submit">Skapa</button>
        </form>
        {error && <p className="error">{error}</p>}
      </section>

      <section className="card">
        <h2>Lista med böcker</h2>
        {loading ? (
          <p>Laddar...</p>
        ) : books.length === 0 ? (
          <p>Inga böcker ännu.</p>
        ) : (
          <ul className="list">
            {books.map((b) => (
              <li key={b.id || `${b.title}-${b.author}`}>
                <span className="title">{b.title}</span>
                <span className="author">{b.author}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
