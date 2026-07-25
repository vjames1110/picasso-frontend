import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaEye, FaShoppingBag } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import Toast from "../Toast/Toast";
import "./BookCard.css";

export default function BookCard({ book, onQuickView, badge }) {
  const navigate = useNavigate();
  const { addToCart, getItemQuantity } = useCart();
  const [showToast, setShowToast] = useState(false);
  const qtyInCart = getItemQuantity(book.id);
  const originalPrice = Number(book.original_price) || Number(book.price);
  const discount = originalPrice > book.price
    ? Math.round(((originalPrice - book.price) / originalPrice) * 100)
    : 0;
  const authors = Array.isArray(book.author) ? book.author.join(", ") : book.author;

  const add = () => {
    if (book.stock <= qtyInCart) return;
    addToCart(book, 1);
    setShowToast(true);
  };

  return (
    <article className="book-card">
      <div className="book-image">
        {badge && <span className={`book-badge ${badge === "New" ? "new" : ""}`}>{badge}</span>}
        {discount > 0 && <span className="discount-badge">Save {discount}%</span>}
        <img src={book.image} alt={book.title} loading="lazy" onClick={() => navigate(`/book/${book.id}`)} />
        <button className="quick-view" onClick={() => onQuickView?.(book)}>
          <FaEye /> Quick view
        </button>
      </div>
      <div className="book-card-body">
        <p className="book-category">{book.category || "Competitive exams"}</p>
        <h3 onClick={() => navigate(`/book/${book.id}`)}>{book.title}</h3>
        <p className="author">by {authors || "Picasso Publications"}</p>
        <div className="price-row">
          <strong>Rs. {book.price}</strong>
          {originalPrice > book.price && <span className="original">Rs. {originalPrice}</span>}
        </div>
        <div className="cart-actions">
          <button className="add-cart" onClick={add} disabled={book.stock <= qtyInCart}>
            <FaShoppingBag /> {book.stock <= qtyInCart ? "Out of stock" : qtyInCart ? "Add another" : "Add to cart"}
          </button>
          {qtyInCart > 0 && (
            <button className="go-cart" onClick={() => navigate("/cart")} aria-label="Buy Now">
              <FaArrowRight />
            </button>
          )}
        </div>
      </div>
      <Toast
        message={qtyInCart ? "Cart updated" : "Added to cart"}
        show={showToast}
        onClose={() => setShowToast(false)}
      />
    </article>
  );
}
