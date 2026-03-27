from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import SessionLocal
from models.book import Book
from schemas.book import BookCreate, BookRead

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=list[BookRead])
def list_books(db: Session = Depends(get_db)):
    # minimal example: return all rows
    return db.query(Book).all()


@router.post("/", response_model=BookRead, status_code=201)
def create_book(payload: BookCreate, db: Session = Depends(get_db)):
    # minimal example: create without validation rules
    book = Book(title=payload.title, author=payload.author)
    db.add(book)
    db.commit()
    db.refresh(book)
    return book


@router.get("/{book_id}", response_model=BookRead)
def get_book(book_id: int, db: Session = Depends(get_db)):
    # minimal example: 404 if not found
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book
