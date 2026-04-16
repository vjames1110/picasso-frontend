import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./MyOrders.css";

const MyOrders = () => {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openOrder, setOpenOrder] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get("/orders/my-orders");
            setOrders(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="orders-container">
                <h2>Loading Orders...</h2>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="orders-empty">
                <h2>No Orders Yet 📦</h2>
                <p>Your orders will appear here</p>
            </div>
        );
    }

    return (
        <div className="orders-container">

            <div className="orders-header">
                Home &gt; My Orders
            </div>

            <div className="orders-list">

                {orders.map(order => (

                    <div key={order.id} className="order-card">

                        <div className="order-top">

                            <div>
                                <span>Order ID</span>
                                <strong>#{order.id}</strong>
                            </div>

                            <div>
                                <span>Status</span>
                                <strong className={`status ${order.status}`}>
                                    {order.status}
                                </strong>
                            </div>

                            <div>
                                <span>Total</span>
                                <strong>₹{order.total_amount}</strong>
                            </div>

                            <div>
                                <span>Date</span>
                                <strong>
                                    {new Date(order.created_at)
                                        .toLocaleDateString()}
                                </strong>
                            </div>

                            <div className="order-actions">

                                <button
                                    className="view-btn"
                                    onClick={() =>
                                        setOpenOrder(
                                            openOrder === order.id
                                                ? null
                                                : order.id
                                        )
                                    }
                                >
                                    {openOrder === order.id ? "Hide" : "View"}
                                </button>

                                <button
                                    className="track-btn"
                                    onClick={() => navigate(`/order/${order.id}`)}
                                >
                                    Track
                                </button>

                            </div>

                        </div>

                        {openOrder === order.id && (

                            <div className="order-items">

                                {order.items.map((item) => (
                                    <div key={`${item.title}-${item.price}-${item.quantity}`} className="order-item">

                                        <div>
                                            {item.title}
                                            <span>
                                                x {item.quantity}
                                            </span>
                                        </div>

                                        <div>
                                            ₹{item.price * item.quantity}
                                        </div>

                                    </div>
                                ))}

                            </div>
                        )}

                    </div>

                ))}

            </div>
        </div>
    );
};

export default MyOrders;