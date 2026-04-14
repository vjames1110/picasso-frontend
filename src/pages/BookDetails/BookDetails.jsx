import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./BookDetails.css";
import Toast from "../../components/Toast/Toast";
import { useCart } from "../../context/CartContext";
import api from "../../services/api"

const BookDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [book, setBook] = useState(null);

    useEffect(() => {
        api.get(`/books/${id}`)
            .then(res => setBook(res.data))
            .catch(err => console.error(err));
    }, [id]);



    const today = new Date();

    const minDelivery = new Date();
    minDelivery.setDate(today.getDate() + 10);

    const maxDelivery = new Date();
    maxDelivery.setDate(today.getDate() + 15);

    const formatDate = (date) =>
        date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short"
        });

    const [qty, setQty] = useState(1);
    const [pincode, setPincode] = useState("");
    const [editable, setEditable] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState("");
    const { addToCart, getItemQuantity } = useCart();

    const { } = useCart()

    const qtyInCart = getItemQuantity(book?.id)

    const stockLeft = book?.stock - qtyInCart

    const handleCartClick = () => {
        if (!book) return;
        if (qtyInCart) {
            navigate("/cart")
        } else {
            addToCart(book, qty);
            setToastMsg("Added To Cart 🛒");
            setShowToast(true);
            setQty(1);
        }
    };


    const discount = book ? Math.round(
        ((book.original_price - book.price) / book.original_price) * 100
    ) : 0;

    const checkDelivery = () => {
        if (pincode.length === 6) {
            setToastMsg("Delivery Available ✅");
        } else {
            setToastMsg("Unable to Deliver ❌");
        }
        setShowToast(true);
    };

    if (!book) {
        return <h2>Loading...</h2>
    }


    return (
        <div className="details-container">

            {/* LEFT */}
            <div className="details-left">
                <img src={book.image} alt={book.title} />
            </div>

            {/* RIGHT */}
            <div className="details-right">

                <h1>{book.title}</h1>
                <p className="author">{book.author}</p>

                <div className="tags">
                    <span>{book.category}</span>
                </div>

                <div className="price">
                    ₹{book.price}
                    <span className="original">₹{book.original_price}</span>
                    <span className="discount">({discount}% OFF)</span>
                </div>

                {/* QUANTITY + CART */}
                <div className="action-row">

                    <div className="qty-box">
                        <button onClick={() => setQty(qty > 1 ? qty - 1 : 1)}>-</button>
                        <span>{qty}</span>
                        <button
                            onClick={() => setQty(qty < stockLeft ? qty + 1 : qty)}
                            disabled={qty >= stockLeft}
                        >+</button>
                    </div>

                    <p>
                        {stockLeft > 0
                            ? `${stockLeft} items left in stock`
                            : "Out of Stock"}
                    </p>

                    <button className="cart-btn"
                        onClick={handleCartClick}>
                        {qtyInCart ? "Go to Cart →" : "Add to Cart 🛒"}
                    </button>

                </div>

                {/* PINCODE */}
                <div className="delivery-box">

                    <p>📍 Check Delivery</p>

                    <div className="pincode-row">
                        <input
                            type="text"
                            value={pincode}
                            disabled={!editable}
                            onChange={(e) => setPincode(e.target.value)}
                            placeholder="Enter Pincode"
                        />
                        {!editable ? (
                            <button onClick={() => setEditable(true)}>Change</button>
                        ) : (
                            <button onClick={checkDelivery}>Check</button>
                        )}
                    </div>
                    <div>
                        <p className="delivery-date">
                            <span>🚚 Standard Delivery: {formatDate(minDelivery)} - {formatDate(maxDelivery)}</span>
                        </p>
                    </div>

                    <p className="note">
                        COD and delivery charges may apply on certain items
                    </p>
                    <p className="note">
                        Review final details at checkout
                    </p>

                </div>

                {/* TRUST ICONS */}
                <div className="trust">
                    <span>🔒 Secure</span>
                    <span>📦 Fast Delivery</span>
                    <span>✅ Quality</span>
                    <span>🌱 Eco Print</span>
                </div>

            </div>

            <Toast
                message={toastMsg}
                show={showToast}
                onClose={() => setShowToast(false)}
            />

        </div>
    );
};

export default BookDetails;