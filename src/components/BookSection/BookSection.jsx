import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import BookCard from "../BookCard/BookCard.jsx";
import QuickViewModal from "../QuickViewModal/QuickViewModal.jsx";
import api from "../../services/api.js";
import "./BookSection.css";

const getBookTimestamp = (book) => {
  const dateValue = book?.created_at || book?.createdAt || book?.updated_at || book?.updatedAt;
  const parsed = Date.parse(dateValue);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const sortNewestFirst = (items = []) =>
  [...items].sort((first, second) => {
    const dateDiff = getBookTimestamp(second) - getBookTimestamp(first);
    if (dateDiff) return dateDiff;
    return Number(second?.id || 0) - Number(first?.id || 0);
  });

const Shelf = ({ id, eyebrow, title, description, books, badge, onQuickView }) => (
  <section className="book-shelf" id={id}>
    <div className="section-heading">
      <div>
        <p>{eyebrow}</p>
        <h2>{title}</h2>
        <span>{description}</span>
      </div>
      <span className="section-count">{books.length} titles</span>
    </div>
    <div className="book-grid">
      {books.map((book, index) => (
        <BookCard
          key={book.id}
          book={book}
          badge={index < 3 ? badge : null}
          onQuickView={onQuickView}
        />
      ))}
    </div>
  </section>
);

export default function BookSection() {
  const { search: locationSearch } = useLocation();
  const query = useMemo(() => new URLSearchParams(locationSearch), [locationSearch]);
  const search = query.get("search");
  const category = query.get("category");
  const [books, setBooks] = useState([]);
  const [topSelling, setTopSelling] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    let isActive = true;

    const isCanceled = (error) =>
      error?.name === "CanceledError" || error?.code === "ERR_CANCELED";

    const load = async () => {
      setLoading(true);

      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (category) params.set("category", category);

        const filtered = Boolean(search || category);
        const requests = [api.get(`/books${params.size ? `?${params}` : ""}`, { signal: controller.signal })];

        if (!filtered) {
          requests.push(api.get("/books/top-selling?limit=8", { signal: controller.signal }));
        }

        const results = await Promise.allSettled(requests);

        // React StrictMode deliberately cleans up the first development mount.
        // Ignore that obsolete request instead of clearing data from the new one.
        if (!isActive) return;

        const all = results[0];
        const selling = results[1];

        if (all.status === "fulfilled") {
          setBooks(sortNewestFirst(all.value.data || []));
        } else {
          if (!isCanceled(all.reason)) {
            setBooks([]);
            console.error("Unable to load books", all.reason);
          }
        }

        if (selling?.status === "fulfilled") {
          setTopSelling(selling.value.data || []);
        } else {
          setTopSelling([]);
          if (selling && !isCanceled(selling.reason)) {
            console.error("Unable to load top selling books", selling.reason);
          }
        }
      } catch (error) {
        if (!isCanceled(error)) {
          console.error("Unable to load books", error);
        }
      } finally {
        if (isActive) setLoading(false);
      }
    };

    load();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [search, category]);

  if (loading) {
    return (
      <div className="catalog-state">
        <span className="loader" />
        Curating your bookshelf...
      </div>
    );
  }

  const filtered = Boolean(search || category);
  const newestBooks = sortNewestFirst(books);
  const topSellingBooks = topSelling.length ? topSelling : newestBooks.slice(0, 8);

  return (
    <main className="book-section">
      {filtered ? (
        <Shelf
          eyebrow="Search results"
          title={search ? `Results for "${search}"` : category}
          description={`${books.length} matching books found`}
          books={books}
          onQuickView={setSelectedBook}
        />
      ) : (
        <>
          <Shelf
            id="new-arrivals"
            eyebrow="Fresh from the press"
            title="Newly added books"
            description="The latest titles in our catalogue, newest first."
            books={newestBooks.slice(0, 8)}
            badge="New"
            onQuickView={setSelectedBook}
          />
          <Shelf
            id="top-selling"
            eyebrow="Reader favourites"
            title="Top selling books"
            description="The books learners choose most often."
            books={topSellingBooks}
            badge="Bestseller"
            onQuickView={setSelectedBook}
          />
          <Shelf
            id="all-books"
            eyebrow="Explore the library"
            title="All books"
            description="Find the right companion for your preparation."
            books={books}
            onQuickView={setSelectedBook}
          />
        </>
      )}
      {!books.length && <div className="catalog-state">No books found. Try a different search.</div>}
      {selectedBook && <QuickViewModal book={selectedBook} onClose={() => setSelectedBook(null)} />}
    </main>
  );
}
