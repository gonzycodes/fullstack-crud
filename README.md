# Book Manager

A fullstack CRUD application with FastAPI in the backend and React in the frontend. The project manages a simple book collection where you can create, read, update, and delete books.

## Start the backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```

The backend starts on `http://127.0.0.1:8000`.
If `python` is not available on your machine, run `python3 app.py` instead.

## Start the frontend
```bash
cd frontend
npm install
npm run dev
```

The frontend starts on `http://localhost:5173`.
The frontend is built with React and Vite 8.

## Endpoints
- POST /books
- GET /books
- GET /books/{id}
- PUT /books/{id}
- DELETE /books/{id}

## Features
- Create a new book
- View all books
- Fetch a single book through the API
- Update a book title and author
- Delete a book

## Project structure
```text
backend/
├── app.py
├── database.py
├── models/
│   └── book.py
├── routes/
│   └── books.py
└── schemas/
    └── book.py

frontend/
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── src/
    ├── App.jsx
    ├── main.jsx
    └── styles.css
```
