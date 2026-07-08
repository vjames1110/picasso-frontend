import { useEffect, useState } from "react";
import { FaArrowLeft, FaBoxOpen, FaCalendarAlt, FaChevronDown, FaChevronUp, FaMapMarkerAlt, FaReceipt, FaTruck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./MyOrders.css";

const money = (value) => `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;
const formatDate = (value) => value ? new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openOrder, setOpenOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isActive = true;
    api.get("/orders/my-orders")
      .then((response) => { if (isActive) setOrders(response.data || []); })
      .catch(() => { if (isActive) setError("We could not load your orders right now."); })
      .finally(() => { if (isActive) setLoading(false); });
    return () => { isActive = false; };
  }, []);

  if (loading) {
    return <main className="customer-orders-page"><div className="customer-orders-state"><span className="loader" /> Loading your orders...</div></main>;
  }

  if (error || orders.length === 0) {
    return (
      <main className="customer-orders-page">
        <div className="customer-orders-empty"><div><FaBoxOpen /></div><p>{error ? "PLEASE TRY AGAIN" : "YOUR ORDER HISTORY"}</p><h1>{error || "No orders yet"}</h1><span>{error ? "Refresh the page in a moment." : "Once you place an order, its delivery progress will appear here."}</span><button onClick={() => navigate("/")}>Browse books</button></div>
      </main>
    );
  }

  return (
    <main className="customer-orders-page">
      <button className="customer-orders-back" onClick={() => navigate("/")}><FaArrowLeft /> Back to store</button>
      <header className="customer-orders-header"><div><p>YOUR LIBRARY JOURNEY</p><h1>My orders</h1><span>View purchases, payment totals, and delivery progress.</span></div><strong>{orders.length} {orders.length === 1 ? "order" : "orders"}</strong></header>

      <section className="customer-orders-list">
        {orders.map((order) => {
          const expanded = openOrder === order.id;
          const uniqueItems = Array.from(new Map((order.items || []).map((item) => [item.book_id, item])).values());
          return (
            <article key={order.id} className="customer-order-card">
              <div className="customer-order-card-head">
                <div className="customer-order-number"><div><FaReceipt /></div><span>Order <strong>#{order.id}</strong><small>Placed {formatDate(order.created_at)}</small></span></div>
                <span className={`customer-order-status status-${order.status}`}>{order.status === "created" ? "Pending" : order.status}</span>
              </div>

              <div className="customer-order-summary">
                <div><FaBoxOpen /><span>Items<strong>{uniqueItems.reduce((sum, item) => sum + item.quantity, 0)}</strong></span></div>
                <div><FaCalendarAlt /><span>Order date<strong>{formatDate(order.created_at)}</strong></span></div>
                <div><FaMapMarkerAlt /><span>Payment total<strong>{money(order.total_amount)}</strong></span></div>
              </div>

              {expanded && (
                <div className="customer-order-items">
                  <p>ITEMS IN THIS ORDER</p>
                  {uniqueItems.map((item) => (
                    <div className="customer-order-item" key={`${item.book_id}-${item.quantity}`}>
                      <div className="customer-order-item-mark">{item.quantity}</div>
                      <div><strong>{item.title}</strong><span>{money(item.price)} × {item.quantity}</span></div>
                      <b>{money(item.price * item.quantity)}</b>
                    </div>
                  ))}
                </div>
              )}

              <div className="customer-order-actions">
                <button className="customer-order-view" onClick={() => setOpenOrder(expanded ? null : order.id)}>{expanded ? <FaChevronUp /> : <FaChevronDown />}{expanded ? "Hide items" : "View items"}</button>
                <button className="customer-order-track" onClick={() => navigate(`/order/${order.id}`)}><FaTruck /> Track order</button>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
};

export default MyOrders;
