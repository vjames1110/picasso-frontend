import React, { useState, useEffect } from "react";
import BookCard from "../BookCard/BookCard.jsx";
import QuickViewModal from "../QuickViewModal/QuickViewModal.jsx";
import api from "../../services/api.js";
import "./BookSection.css";

const BookSection = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await api.get("/books");
        setBooks(res.data);
      } catch (err) {
        console.error("Error fetching books:", err);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="book-section">

      <h2>#Picasso Picks 🔥</h2>

      <div className="book-grid">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onQuickView={setSelectedBook}
          />
        ))}
      </div>

      {selectedBook && (
        <QuickViewModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </div>
  );
};

export default BookSection;