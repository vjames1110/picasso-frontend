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
        let isActive = true;

        const loadOrder = async () => {
            try {
                const res = await api.get(`/orders/${orderId}`);
                if (isActive) setOrder(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                if (isActive) setLoading(false);
            }
        };

        loadOrder();
        return () => { isActive = false; };
    }, [orderId]);

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
    ];

    const currentStep = steps.indexOf(order.status);

    const timestamps = {
        pending: order.created_at,
        confirmed: order.confirmed_at,
        packed: order.packed_at,
        shipped: order.shipped_at,
        delivered: order.delivered_at
    };

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
                        <strong className="status">
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
                            {new Date(order.created_at).toLocaleDateString()}
                        </strong>
                    </div>
                </div>


                {/* TIMELINE */}
                <div className="timeline">

                    {steps.map((step, index) => {

                        const time = timestamps[step]

                        return (
                            <div
                                key={step}
                                className={`timeline-step ${index <= currentStep ? "active" : ""
                                    }`}
                            >

                                <div className="timeline-circle" />

                                <div className="timeline-label">
                                    {step}
                                </div>

                                {time && (
                                    <div className="timeline-time">
                                        {new Date(time).toLocaleDateString()}
                                    </div>
                                )}

                            </div>
                        )
                    })}

                </div>


                {/* ITEMS */}
                <div className="track-items">

                    <h3>Items</h3>

                    {Array.from(
                        new Map(
                            order.items.map(item => [
                                item.book_id,
                                item
                            ])
                        ).values()
                    ).map((item) => (

                        <div
                            key={`${item.title}-${item.quantity}`}
                            className="track-item"
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

            </div>

        </div>
    );
};

export default OrderTracking;
