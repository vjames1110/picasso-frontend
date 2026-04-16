import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import api from "../../services/api";
import "./OrderSuccess.css";

const OrderSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();

    const fetched = useRef(false);

    const { clearCart } = useCart();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const orderId = location.state?.orderId || params.orderId;
    const paymentId = location.state?.paymentId;

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);

    useEffect(() => {
        if (!orderId || fetched.current) return;

        fetched.current = true;

        clearCart();
        fetchOrder();

    }, [orderId]);

    const fetchOrder = async () => {
        try {
            const res = await api.get(`/orders/${orderId}`);
            setOrder(res.data);
        } catch (err) {
            console.error("ORDER FETCH ERROR:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="success-container">
                <div className="success-card">
                    Loading order...
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="success-container">
                <div className="success-card">
                    Order not found
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
                        <strong>{order.id}</strong>
                    </div>

                    <div>
                        <span>Payment ID</span>
                        <strong>{order.payment_id}</strong>
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

                    {order.items?.map((item) => (
                        <div
                            key={`${item.title}-${item.price}-${item.quantity}`}
                            className="ordered-item"
                        >
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
                        onClick={() => navigate(`/order/${order.id}`)}
                    >
                        Track Order
                    </button>
                </div>

            </div>
        </div>
    );
};

export default OrderSuccess;