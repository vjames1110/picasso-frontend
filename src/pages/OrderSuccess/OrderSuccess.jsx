import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import api from "../../services/api";
import "./OrderSuccess.css";

const OrderSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { clearCart } = useCart();

    const [order, setOrder] = useState(null);

    const orderId = location.state?.orderId;
    const paymentId = location.state?.paymentId;

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);

    useEffect(() => {
        fetchOrder();

        const timer = setTimeout(() => {
            clearCart();
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    const fetchOrder = async () => {
        try {
            const res = await api.get(`/orders/${orderId}`);
            setOrder(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    if (!order) {
        return (
            <div className="success-container">
                <div className="success-card">
                    Loading order...
                </div>
            </div>
        );
    }

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

                    {order.items.map((item, index) => (
                        <div key={index} className="ordered-item">
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
                    <strong>₹{order.total_amount}</strong>
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