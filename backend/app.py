from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
from routes.books import router as books_router

# create tables (simple dev setup)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Books API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(books_router, prefix="/books", tags=["books"])


@app.get("/")
def root():
    return {"message": "Books API is running"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)