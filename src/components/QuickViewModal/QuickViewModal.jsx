import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import Toast from "../Toast/Toast";
import "./QuickViewModal.css";

const QuickViewModal = ({ book, onClose }) => {
  const [qty, setQty] = useState(1);
  const { addToCart, getItemQuantity } = useCart();
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const qtyInCart = getItemQuantity(book.id);
  const stockLeft = Math.max(Number(book.stock || 0) - qtyInCart, 0);
  const hasOriginalPrice = Number(book.original_price) > Number(book.price);

  const handleCartClick = () => {
    if (stockLeft <= 0) return;

    addToCart(book, Math.min(qty, stockLeft));
    setToastMsg(qtyInCart ? "Cart updated" : "Added to cart");
    setShowToast(true);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="quick-modal-overlay" onClick={onClose} role="presentation">
      <div className="quick-modal-content" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="quick-view-title">
        <button className="quick-modal-close" onClick={onClose} aria-label="Close quick view">&times;</button>

        <div className="quick-modal-cover">
          <img src={book.image} alt={book.title} />
        </div>

        <div className="quick-modal-copy">
          <p className="quick-modal-eyebrow">Quick look</p>
          <h2 id="quick-view-title">{book.title}</h2>
          <div className="quick-modal-tags">
            <span>{Array.isArray(book.author) ? book.author.join(", ") : book.author || "Picasso Publications"}</span>
            {book.category && <span>{book.category}</span>}
          </div>

          <p className="quick-modal-description">{book.description || "Explore this carefully curated title from Picasso Publications."}</p>

          <div className="quick-modal-price">
            Rs. {book.price}
            {hasOriginalPrice && <span>Rs. {book.original_price}</span>}
          </div>

          <div className="quick-modal-stock">{stockLeft > 0 ? `${stockLeft} available` : "Out of stock"}</div>

          <div className="quick-modal-qty" aria-label="Quantity selector">
            <button onClick={() => setQty((value) => Math.max(1, value - 1))}>-</button>
            <span>{qty}</span>
            <button
              onClick={() => setQty((value) => Math.min(value + 1, stockLeft || value))}
              disabled={stockLeft <= qty}
            >
              +
            </button>
          </div>

          <div className="quick-modal-actions">
            <button className="quick-modal-cart" onClick={handleCartClick} disabled={stockLeft <= 0}>
              {qtyInCart ? "Add more" : "Add to cart"}
            </button>
            <button
              className="quick-modal-details"
              onClick={() => {
                onClose();
                navigate(`/book/${book.id}`);
              }}
            >
              View details
            </button>
            {qtyInCart > 0 && <button className="quick-modal-go-cart" onClick={() => navigate("/cart")}>Go to cart</button>}
          </div>

          <Toast message={toastMsg} show={showToast} onClose={() => setShowToast(false)} />
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
