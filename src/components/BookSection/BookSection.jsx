import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import BookCard from "../BookCard/BookCard.jsx";
import QuickViewModal from "../QuickViewModal/QuickViewModal.jsx";
import api from "../../services/api.js";
import "./BookSection.css";

const BookSection = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const search = query.get("search");
  const category = query.get("category");
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {

        let params = []

        if (search) params.push(`search=${search}`)
        if (category) params.push(`category=${category}`)

        const query = params.length ? `?${params.join("&")}` : ""

        const res = await api.get(`/books${query}`)
        setBooks(res.data)

      } catch (err) {
        console.error("Error fetching books:", err);
      }
    };

    fetchBooks();
  }, [search, category]);

  return (
    <div id="book-section" className="book-section">

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