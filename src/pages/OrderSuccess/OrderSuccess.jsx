import { useEffect, useState } from "react";
import { FaArrowRight, FaCheck, FaLock, FaReceipt, FaShoppingBag, FaTruck } from "react-icons/fa";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import api from "../../services/api";
import "./OrderSuccess.css";

const money = (value) => `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;
const formatDate = (value) => new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { clearCart } = useCart();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const orderId = location.state?.orderId || params.orderId;

  useEffect(() => {
    if (!orderId) return;
    let isActive = true;

    api.get(`/orders/${orderId}`)
      .then((response) => { if (isActive) setOrder(response.data); })
      .catch(() => { if (isActive) setError("We could not load the confirmed order."); })
      .finally(() => { if (isActive) setLoading(false); });

    clearCart();
    return () => { isActive = false; };
    // Clear only when the confirmed order route is reached.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  if (loading) return <main className="order-success-page"><div className="order-success-state"><span className="loader" /> Confirming your order...</div></main>;
  if (error || !order) return <main className="order-success-page"><div className="order-success-state order-success-error"><FaReceipt /><h2>{error || "Order not found"}</h2><button onClick={() => navigate("/")}>Return to store</button></div></main>;

  const deliveryDate = new Date(order.created_at || Date.now());
  deliveryDate.setDate(deliveryDate.getDate() + 5);
  const uniqueItems = Array.from(new Map((order.items || []).map((item) => [item.book_id, item])).values());

  return (
    <main className="order-success-page">
      <section className="order-success-card">
        <header className="order-success-hero">
          <div className="order-success-check"><FaCheck /></div>
          <p>PAYMENT SUCCESSFUL</p>
          <h1>Your order is confirmed.</h1>
          <span>Thank you for choosing Picasso Publications. We’ll keep you updated as your books move towards you.</span>
          <div className="order-success-reference"><span>Order reference</span><strong>#{order.id}</strong></div>
        </header>

        <div className="order-success-progress">
          <div className="active"><span><FaCheck /></span><strong>Confirmed</strong></div>
          <div><span><FaShoppingBag /></span><strong>Preparing</strong></div>
          <div><span><FaTruck /></span><strong>Delivery</strong></div>
        </div>

        <div className="order-success-layout">
          <section className="order-success-items">
            <div className="order-success-section-title"><div><p>ORDER DETAILS</p><h2>Books in your order</h2></div><span>{uniqueItems.reduce((sum, item) => sum + item.quantity, 0)} items</span></div>
            {uniqueItems.map((item) => (
              <article className="order-success-item" key={`${item.book_id}-${item.quantity}`}>
                <div className="order-success-item-mark">{item.quantity}</div>
                <div><strong>{item.title}</strong><span>{money(item.price)} × {item.quantity}</span></div>
                <b>{money(item.price * item.quantity)}</b>
              </article>
            ))}
            <div className="order-success-total"><span>Total paid<small>Payment completed securely</small></span><strong>{money(order.total_amount)}</strong></div>
          </section>

          <aside className="order-success-meta">
            <p>WHAT HAPPENS NEXT</p>
            <div><FaReceipt /><span>Order placed<strong>{formatDate(order.created_at)}</strong></span></div>
            <div><FaTruck /><span>Estimated delivery<strong>{formatDate(deliveryDate)}</strong></span></div>
            <div><FaLock /><span>Payment ID<strong>{order.payment_id || "Verified"}</strong></span></div>
            <small>We’ll send status updates to your registered contact details.</small>
          </aside>
        </div>

        <footer className="order-success-actions">
          <button className="order-success-shop" onClick={() => navigate("/")}><FaShoppingBag /> Continue shopping</button>
          <button className="order-success-track" onClick={() => navigate(`/order/${order.id}`)}>Track this order <FaArrowRight /></button>
        </footer>
      </section>
    </main>
  );
};

export default OrderSuccess;
