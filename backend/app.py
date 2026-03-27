from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, Field

app = FastAPI()


class BookBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    author: str = Field(..., min_length=1, max_length=200)
    published_year: int = Field(..., ge=0, le=2100)


class BookCreate(BookBase):
    pass


class BookUpdate(BookBase):
    pass


class Book(BookBase):
    id: int


_books: dict[int, Book] = {}
_next_id = 1


def _get_book_or_404(book_id: int) -> Book:
    book = _books.get(book_id)
    if not book:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found")
    return book


@app.post("/books", response_model=Book, status_code=status.HTTP_201_CREATED)
def create_book(payload: BookCreate) -> Book:
    global _next_id
    book = Book(id=_next_id, **payload.model_dump())
    _books[_next_id] = book
    _next_id += 1
    return book


@app.get("/books", response_model=list[Book])
def list_books() -> list[Book]:
    return list(_books.values())


@app.get("/books/{book_id}", response_model=Book)
def get_book(book_id: int) -> Book:
    return _get_book_or_404(book_id)


@app.put("/books/{book_id}", response_model=Book)
def update_book(book_id: int, payload: BookUpdate) -> Book:
    _get_book_or_404(book_id)
    book = Book(id=book_id, **payload.model_dump())
    _books[book_id] = book
    return book


@app.delete("/books/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_book(book_id: int) -> None:
    _get_book_or_404(book_id)
    del _books[book_id]
    return None
