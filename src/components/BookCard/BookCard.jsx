import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import Toast from "../Toast/Toast";
import "./BookCard.css";

const BookCard = ({ book, onQuickView }) => {

  const { cart } = useCart();
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("")
  const discount = Math.round(
    ((book.original_price - book.price) / book.original_price) * 100
  );

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 4);

  const { addToCart, getItemQuantity } = useCart()

  const qtyInCart = getItemQuantity(book.id)

  const handleShare = async () => {
    try {
      await navigator.share({
        title: book.title,
        text: `📚 ${book.title}
Price: ₹${book.price}

Buy from Picasso Publications`,
        url: `${window.location.origin}/book/${book.id}`
      });
    } catch (err) {
      console.log("Share cancelled");
    }
  };

  const handleCartClick = () => {
    if (qtyInCart > 0) {
      navigate("/cart");
    } else {
      addToCart(book, 1);
      setToastMsg("Added To Cart 🛒");
      setShowToast(true);
    }
  }

  return (
    <div className="book-card">

      {/* IMAGE */}
      <div className="book-image">
        <img src={book.image}
          alt={book.title}
          onClick={() => {
            navigate(`/book/${book.id}`)
          }}
          style={{ cursor: "pointer" }} />

        <div
          className="quick-view"
          onClick={() => onQuickView(book)}
        >
          Quick View
        </div>
      </div>

      {/* DETAILS */}
      <h3>{book.title}</h3>
      <p className="author">{book.author}</p>

      <div className="price-row">

        <div className="price">
          ₹{book.price}
          <span className="original">₹{book.original_price}</span>
          <span className="discount">({discount}% OFF)</span>
        </div>

        <button className="share-icon" onClick={handleShare}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="18" cy="5" r="3" stroke="black" strokeWidth="2" />
            <circle cx="6" cy="12" r="3" stroke="black" strokeWidth="2" />
            <circle cx="18" cy="19" r="3" stroke="black" strokeWidth="2" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="black" strokeWidth="2" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke="black" strokeWidth="2" />
          </svg>
        </button>

      </div>

      <p className="delivery">
        Delivery by {deliveryDate.toDateString()}
      </p>

      <button className="add-cart"
        onClick={handleCartClick}>
        {qtyInCart ? "Go To Cart →" : "Add to Cart 🛒"}
      </button>

      <Toast
        message={toastMsg}
        show={showToast}
        onClose={() => setShowToast(false)}
      />

    </div>
  );
};

export default BookCard;