import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowRight, FaCheckCircle, FaShareAlt, FaShieldAlt, FaTruck } from "react-icons/fa";
import BookCard from "../../components/BookCard/BookCard.jsx";
import QuickViewModal from "../../components/QuickViewModal/QuickViewModal.jsx";
import Toast from "../../components/Toast/Toast";
import { useCart } from "../../context/CartContext";
import api from "../../services/api";
import "./BookDetails.css";

const formatAuthors = (author) => {
  if (Array.isArray(author)) {
    return author.filter(Boolean).join(", ");
  }

  return author || "Picasso Publications";
};

const BookDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToCart, getItemQuantity } = useCart();

  const [book, setBook] = useState(null);
  const [library, setLibrary] = useState([]);
  const [qty, setQty] = useState(1);
  const [pincode, setPincode] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [quickViewBook, setQuickViewBook] = useState(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    let isActive = true;

    const load = async () => {
      setBook(null);
      setLoadError("");

      const [bookResult, libraryResult] = await Promise.allSettled([
          api.get(`/books/${id}`, { signal: controller.signal }),
          api.get("/books", { signal: controller.signal }),
      ]);

      if (!isActive) return;

      if (bookResult.status === "fulfilled") {
        setBook(bookResult.value.data);
        setQty(1);
      } else if (bookResult.reason?.code !== "ERR_CANCELED") {
        console.error("Unable to load book details", bookResult.reason);
        setLoadError("We could not load this book. It may no longer be available.");
      }

      if (libraryResult.status === "fulfilled") {
        setLibrary(libraryResult.value.data || []);
      } else if (libraryResult.reason?.code !== "ERR_CANCELED") {
        console.error("Unable to load related books", libraryResult.reason);
        setLibrary([]);
      }
    };

    load();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const authors = useMemo(() => {
    if (!book) {
      return [];
    }

    return Array.isArray(book.author)
      ? book.author.filter(Boolean)
      : book.author
        ? [book.author]
        : [];
  }, [book]);

  const mainAuthor = authors[0] || "Picasso Publications";
  const currentPrice = Number(book?.price || 0);
  const originalPrice = Number(book?.original_price || book?.price || 0);
  const discount = originalPrice > currentPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;
  const qtyInCart = getItemQuantity(book?.id);
  const stockLeft = Math.max((book?.stock || 0) - qtyInCart, 0);

  const relatedBooks = useMemo(() => {
    if (!book) {
      return [];
    }

    return library
      .filter((item) => {
        if (item.id === book.id) return false;

        const itemAuthors = formatAuthors(item.author).toLowerCase();
        const currentAuthors = authors.map((value) => value.toLowerCase());

        return (
          item.category === book.category ||
          currentAuthors.some((author) => itemAuthors.includes(author))
        );
      })
      .slice(0, 8);
  }, [authors, book, library]);

  const booksByAuthor = useMemo(() => {
    if (!book) {
      return [];
    }

    const exactMatches = library.filter((item) => {
      if (item.id === book.id) return false;
      const itemAuthors = formatAuthors(item.author).toLowerCase();
      return authors.some((author) => itemAuthors.includes(author.toLowerCase()));
    });

    if (exactMatches.length > 0) {
      return exactMatches.slice(0, 8);
    }

    return relatedBooks.slice(0, 8);
  }, [authors, book, library, relatedBooks]);

  const handleCartClick = () => {
    if (!book || stockLeft <= 0) return;

    const quantityToAdd = Math.min(qty, stockLeft);
    addToCart(book, quantityToAdd);
    setToastMsg(qtyInCart ? "Cart updated" : "Added to cart");
    setShowToast(true);
    setQty(1);
  };

  const handleShare = async () => {
    if (!book) return;

    const shareUrl = `${window.location.origin}/seo/book/${book.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: book.title,
          text: `Check out ${book.title}`,
          url: shareUrl,
        });
        return;
      } catch {
        console.log("Share cancelled");
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setToastMsg("Link copied to clipboard");
      setShowToast(true);
    } catch (error) {
      console.error("Unable to copy share link", error);
    }
  };

  const checkDelivery = () => {
    setToastMsg(
      /^\d{6}$/.test(pincode.trim())
        ? "Delivery available"
        : "Enter a valid 6 digit pincode"
    );
    setShowToast(true);
    setPincode("");
  };

  if (loadError) {
    return (
      <div className="book-details-loading book-details-error">
        <p>{loadError}</p>
        <button onClick={() => navigate("/")}>Return to all books</button>
      </div>
    );
  }

  if (!book) {
    return <div className="book-details-loading">Loading book details...</div>;
  }

  return (
    <main className="book-details-page">
      <section className="book-hero">
        <div className="cover-shell">
          <div className="cover-badge">{book.category || "Featured title"}</div>
          <img src={book.image} alt={book.title} />
        </div>

        <div className="book-copy">
          <p className="eyebrow">Premium exam preparation</p>
          <h1>{book.title}</h1>
          <p className="book-author">By {formatAuthors(book.author)}</p>

          <div className="book-meta">
            <span>{book.category || "Competitive exams"}</span>
            <span>{book.stock > 0 ? `${book.stock} in stock` : "Out of stock"}</span>
            <span>{discount > 0 ? `${discount}% off` : "Best value"}</span>
          </div>

          <div className="price-row">
            <strong>Rs. {currentPrice}</strong>
            {originalPrice > currentPrice && <span>Rs. {originalPrice}</span>}
          </div>

          {discount > 0 && <p className="discount-copy">You save Rs. {originalPrice - currentPrice}</p>}

          <p className="description-copy">
            {book.description || "A carefully curated title designed to simplify exam preparation and build confidence with every chapter."}
          </p>

          <div className="action-row">
            <div className="qty-box" aria-label="Quantity selector">
              <button onClick={() => setQty((value) => Math.max(1, value - 1))}>-</button>
              <span>{qty}</span>
              <button
                onClick={() => setQty((value) => Math.min(value + 1, stockLeft || value))}
                disabled={stockLeft <= qty}
              >
                +
              </button>
            </div>

            <button className="primary-action" onClick={handleCartClick} disabled={stockLeft <= 0}>
              {qtyInCart ? "Add more to cart" : "Add to cart"} <FaArrowRight />
            </button>

            {qtyInCart > 0 && (
              <button className="secondary-action" onClick={() => navigate("/cart")}>
                Go to cart
              </button>
            )}

            <button className="share-action" onClick={handleShare}>
              <FaShareAlt /> Share
            </button>
          </div>

          <div className="delivery-card">
            <div className="delivery-title">
              <FaTruck /> Check delivery
            </div>
            <div className="pincode-row">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={pincode}
                onChange={(event) => setPincode(event.target.value.replace(/\D/g, ""))}
                placeholder="Enter 6 digit pincode"
              />
              <button onClick={checkDelivery}>Check</button>
            </div>
            <p className="delivery-note">Standard delivery usually arrives in 3 to 5 days.</p>
          </div>

          <div className="trust-row">
            <span><FaShieldAlt /> Secure checkout</span>
            <span><FaCheckCircle /> Quality assured</span>
            <span><FaTruck /> Fast dispatch</span>
          </div>
        </div>
      </section>

      <section className="details-grid">
        <article className="detail-card">
          <p className="section-eyebrow">Why it stands out</p>
          <h2>Refined reading experience</h2>
          <p>
            This edition brings together the essentials you need in a cleaner, easier-to-scan format so users can focus on learning instead of searching.
          </p>
          <ul>
            <li>Curated for focused revision</li>
            <li>Clear category and author labeling</li>
            <li>Designed for quick decision making</li>
          </ul>
        </article>

        <article className="detail-card">
          <p className="section-eyebrow">Book details</p>
          <h2>At a glance</h2>
          <div className="detail-pills">
            <span>Author: {mainAuthor}</span>
            <span>Category: {book.category || "General"}</span>
            <span>Stock: {book.stock}</span>
            <span>Price: Rs. {currentPrice}</span>
          </div>
        </article>
      </section>

      <section className="related-section">
        <div className="section-heading">
          <div>
            <p>Related books</p>
            <h2>Books that pair well with this title</h2>
          </div>
          <span>{relatedBooks.length} titles</span>
        </div>
        <div className="book-grid">
          {relatedBooks.slice(0, 8).map((item) => (
            <BookCard key={item.id} book={item} onQuickView={setQuickViewBook} />
          ))}
        </div>
      </section>

      <section className="related-section">
        <div className="section-heading">
          <div>
            <p>Books by author</p>
            <h2>More from {mainAuthor}</h2>
          </div>
          <span>{booksByAuthor.length} titles</span>
        </div>

        {booksByAuthor.length > 0 ? (
          <div className="book-grid">
            {booksByAuthor.map((item) => (
              <BookCard key={item.id} book={item} onQuickView={setQuickViewBook} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            More books from this author will appear here soon.
          </div>
        )}
      </section>

      <Toast
        message={toastMsg}
        show={showToast}
        onClose={() => setShowToast(false)}
      />
      {quickViewBook && (
        <QuickViewModal book={quickViewBook} onClose={() => setQuickViewBook(null)} />
      )}
    </main>
  );
};

export default BookDetails;
