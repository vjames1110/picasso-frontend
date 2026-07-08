import { createElement, useEffect, useState } from "react";
import { FaArrowLeft, FaBox, FaCheck, FaClipboardCheck, FaHeadset, FaMapMarkerAlt, FaShippingFast, FaTruck } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import "./OrderTracking.css";

const money = (value) => `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;
const formatDate = (value, includeTime = false) => value
  ? new Date(value).toLocaleString("en-IN", includeTime
    ? { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" }
    : { day: "numeric", month: "short", year: "numeric" })
  : "Awaiting update";

const steps = [
  { key: "pending", label: "Order placed", description: "We received your order.", icon: FaClipboardCheck },
  { key: "confirmed", label: "Confirmed", description: "Payment and order confirmed.", icon: FaCheck },
  { key: "packed", label: "Packed", description: "Your books are being prepared.", icon: FaBox },
  { key: "shipped", label: "Shipped", description: "Your package is on the way.", icon: FaShippingFast },
  { key: "delivered", label: "Delivered", description: "Package delivered successfully.", icon: FaMapMarkerAlt },
];

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) return;
    let isActive = true;
    api.get(`/orders/${orderId}`)
      .then((response) => { if (isActive) setOrder(response.data); })
      .catch(() => { if (isActive) setError("We could not find this order."); })
      .finally(() => { if (isActive) setLoading(false); });
    return () => { isActive = false; };
  }, [orderId]);

  if (loading) return <main className="tracking-page"><div className="tracking-state"><span className="loader" /> Loading tracking details...</div></main>;
  if (error || !order) return <main className="tracking-page"><div className="tracking-state tracking-error"><FaBox /><h2>{error || "Order not found"}</h2><button onClick={() => navigate("/my-orders")}>Return to my orders</button></div></main>;

  const normalizedStatus = order.status === "created" ? "pending" : order.status;
  const currentStep = Math.max(steps.findIndex((step) => step.key === normalizedStatus), 0);
  const timestamps = { pending: order.created_at, confirmed: order.confirmed_at, packed: order.packed_at, shipped: order.shipped_at, delivered: order.delivered_at };
  const uniqueItems = Array.from(new Map((order.items || []).map((item) => [item.book_id, item])).values());
  const estimatedDate = new Date(order.created_at);
  estimatedDate.setDate(estimatedDate.getDate() + 5);

  return (
    <main className="tracking-page">
      <button className="tracking-back" onClick={() => navigate("/my-orders")}><FaArrowLeft /> All orders</button>

      <section className="tracking-hero">
        <div><p>ORDER #{order.id}</p><h1>{normalizedStatus === "delivered" ? "Your books have arrived." : "Your books are on their journey."}</h1><span>Follow each step from confirmation to delivery.</span></div>
        <div className={`tracking-status tracking-status-${normalizedStatus}`}><FaTruck /><span>Current status<strong>{normalizedStatus}</strong></span></div>
      </section>

      <div className="tracking-layout">
        <section className="tracking-main-card">
          <header><div><p>DELIVERY PROGRESS</p><h2>Shipment timeline</h2></div><span>Estimated by {formatDate(estimatedDate)}</span></header>

          <div className="tracking-timeline" style={{ "--tracking-progress": `${(currentStep / (steps.length - 1)) * 100}%` }}>
            {steps.map(({ key, label, description, icon }, index) => {
              const complete = index <= currentStep;
              return (
                <div key={key} className={`tracking-step ${complete ? "complete" : ""} ${index === currentStep ? "current" : ""}`}>
                  <div className="tracking-step-icon">{createElement(icon)}</div>
                  <div className="tracking-step-copy"><strong>{label}</strong><span>{description}</span><small>{timestamps[key] ? formatDate(timestamps[key], true) : "Awaiting update"}</small></div>
                </div>
              );
            })}
          </div>
        </section>

        <aside className="tracking-summary">
          <p>ORDER SUMMARY</p>
          <h2>{uniqueItems.length} {uniqueItems.length === 1 ? "title" : "titles"}</h2>
          <div className="tracking-meta"><span>Placed<strong>{formatDate(order.created_at)}</strong></span><span>Order total<strong>{money(order.total_amount)}</strong></span><span>Payment ID<strong>{order.payment_id || "Confirmed"}</strong></span></div>
          <div className="tracking-help"><FaHeadset /><div><strong>Need help?</strong><span>Our support team can assist with this order.</span></div><button onClick={() => navigate("/support")}>Contact</button></div>
        </aside>
      </div>

      <section className="tracking-items-card">
        <header><p>PACKAGE CONTENTS</p><h2>Books in this shipment</h2></header>
        <div>
          {uniqueItems.map((item) => (
            <article className="tracking-item" key={`${item.book_id}-${item.quantity}`}>
              <div className="tracking-book-mark">{item.quantity}</div>
              <div><strong>{item.title}</strong><span>{money(item.price)} × {item.quantity}</span></div>
              <b>{money(item.price * item.quantity)}</b>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default OrderTracking;
