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
  deliveryDate.setDate(deliveryDate.getDate() + 10);

  const { addToCart, getItemQuantity } = useCart()

  const qtyInCart = getItemQuantity(book.id)

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

      <div className="price">
        ₹{book.price}
        <span className="original">₹{book.original_price}</span>
        <span className="discount">({discount}% OFF)</span>
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