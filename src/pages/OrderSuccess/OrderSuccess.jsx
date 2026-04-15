import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./OrderSuccess.css";

const OrderSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { cart, getTotalPrice, clearCart } = useCart();

    const orderId = location.state?.orderId

    const paymentMethod = location.state?.paymentMethod || "razorpay";
    const paymentId = location.state?.paymentId;

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);

    const total = getTotalPrice();

    useEffect(() => {
        const timer = setTimeout(() => {
            clearCart();
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="success-container">
            <div className="success-card">

                <div className="success-header">
                    <div className="success-icon">✅</div>
                    <div>
                        <h1>Order Confirmed</h1>
                        <p>Payment Successful</p>
                    </div>
                </div>

                <div className="order-info">
                    <div>
                        <span>Order ID</span>
                        <strong>{orderId}</strong>
                    </div>

                    <div>
                        <span>Payment ID</span>
                        <strong>{paymentId}</strong>
                    </div>

                    <div>
                        <span>Estimated Delivery</span>
                        <strong>
                            {deliveryDate.toDateString()}
                        </strong>
                    </div>
                </div>

                <div className="ordered-items">
                    <h3>Items Ordered</h3>

                    {cart.map(item => (
                        <div key={item.id} className="ordered-item">
                            <div>
                                {item.title}
                                <span>x {item.quantity}</span>
                            </div>

                            <div>
                                ₹{item.price * item.quantity}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="order-total">
                    <span>Total Paid</span>
                    <strong>₹{total}</strong>
                </div>

                <div className="success-buttons">
                    <button
                        className="continue-btn"
                        onClick={() => navigate("/")}
                    >
                        Continue Shopping
                    </button>

                    <button
                        className="track-btn"
                        onClick={() => navigate(`/order/${orderId}`)}
                    >
                        Track Order
                    </button>
                </div>

            </div>
        </div>
    );
};

export default OrderSuccess;