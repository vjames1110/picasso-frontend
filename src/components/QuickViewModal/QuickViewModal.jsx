import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import Toast from "../Toast/Toast";
import "./QuickViewModal.css";

const QuickViewModal = ({ book, onClose }) => {
    const [qty, setQty] = useState(1);
    const { cart } = useCart();
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState("")
    const { addToCart, getItemQuantity } = useCart();
    const qtyInCart = getItemQuantity(book.id)
    const stockLeft = book.stock - qtyInCart
    const handleCartClick = () => {
        if (qtyInCart) {
            navigate("/cart");
        } else {
            addToCart(book, qty);
            setToastMsg("Added To Cart 🛒");
            setShowToast(true);
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>

            <div className="modal-content" onClick={(e) => e.stopPropagation()}>

                <span className="close-btn" onClick={onClose}>×</span>

                <div className="modal-left">
                    <img src={book.image} alt={book.title} />
                </div>

                <div className="modal-right">
                    <h2>{book.title}</h2>
                    <div className="tags">
                        <span>{book.author}</span>
                    </div>

                    <div className="tags">
                        <span>{book.category}</span>
                    </div>

                    <p>{book.description}</p>

                    <h3>
                        ₹{book.price}
                        <span className="original">₹{book.original_price}</span>
                    </h3>

                    {/* Quantity */}
                    <div className="qty">
                        <button onClick={() => setQty(qty > 1 ? qty - 1 : 1)}>-</button>
                        {qty}
                        <button 
                            onClick={() => setQty(qty < stockLeft ? qty + 1 : qty)}
                            disabled={qty >= stockLeft}>+</button>
                    </div>

                    <p>
                        {stockLeft > 0 ? `${stockLeft} available` : "Out of Stock"}
                    </p>

                    <button className="cart-btn"
                        onClick={handleCartClick}>{qtyInCart ? "Go to Cart →" : "Add to Cart 🛒"}</button>

                    <Toast
                        message={toastMsg}
                        show={showToast}
                        onClose={() => setShowToast(false)}
                    />

                </div>

            </div>

        </div>
    );
};

export default QuickViewModal;