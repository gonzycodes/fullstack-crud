# Book Manager

En fullstack CRUD-applikation med FastAPI i backend och React i frontend. Projektet hanterar en enkel boksamling där du kan skapa, läsa, uppdatera och ta bort böcker.

## Starta backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```

Backend startar på `http://127.0.0.1:8000`.
Om `python` inte finns på din dator, kör `python3 app.py` istället.

## Starta frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend startar på `http://localhost:5173`.
Frontend är byggd med React och Vite 8.

## Endpoints
- POST /books
- GET /books
- GET /books/{id}
- PUT /books/{id}
- DELETE /books/{id}

## Funktioner
- Skapa en ny bok
- Visa alla bocker
- Hamta en enskild bok via API
- Uppdatera titel och forfattare
- Ta bort en bok

## Projektstruktur
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
