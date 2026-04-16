import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import "./OrderTracking.css";

const OrderTracking = () => {

    const { orderId } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!orderId) return;
        fetchOrder();
    }, [orderId]);

    const fetchOrder = async () => {
        try {
            const res = await api.get(`/orders/${orderId}`);
            setOrder(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="track-container">Loading...</div>;
    }

    if (!order) {
        return <div className="track-container">Order not found</div>;
    }

    const steps = [
        "pending",
        "confirmed",
        "packed",
        "shipped",
        "delivered"
    ]

    const currentStep = steps.indexOf(order.status)

    return (
        <div className="track-container">

            <div className="track-card">

                <h2>Track Order</h2>

                <div className="track-info">
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
                </div>

                <div className="timeline">

                    {steps.map((step, index) => {

                        const timestamps = {
                            pending: order.created_at,
                            confirmed: order.confirmed_at,
                            packed: order.packed_at,
                            shipped: order.shipped_at,
                            delivered: order.delivered_at
                        }

                        const time = timestamps[step]

                        return (
                            <div key={step} className="timeline-step">

                                <div className={`circle ${index <= currentStep ? "active" : ""}`}>
                                    {index <= currentStep ? "✓" : ""}
                                </div>

                                <div className="label">
                                    {step.charAt(0).toUpperCase() + step.slice(1)}
                                </div>

                                {time && (
                                    <div className="time">
                                        {new Date(time).toLocaleDateString()}
                                    </div>
                                )}

                                {index !== steps.length - 1 && (
                                    <div className={`line ${index < currentStep ? "active" : ""}`} />
                                )}

                            </div>
                        )
                    })}

                </div>

                <div className="track-items">
                    <h3>Items</h3>

                    {order.items.map((item) => (
                        <div key={`${item.title}-${item.price}-${item.quantity}`} className="track-item">
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

            </div>

        </div>
    );
};

export default OrderTracking;