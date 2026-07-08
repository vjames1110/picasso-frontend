import { createElement, useEffect, useState } from "react";
import { FaBoxOpen, FaCheckCircle, FaClipboardList, FaRupeeSign, FaShippingFast } from "react-icons/fa";
import api from "../../../services/api";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalOrders: 0, pendingOrders: 0, shippedOrders: 0, deliveredOrders: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;
    api.get("/admin/dashboard")
      .then((res) => { if (isActive) setStats(res.data); })
      .catch((error) => console.error("Dashboard fetch failed", error))
      .finally(() => { if (isActive) setLoading(false); });
    return () => { isActive = false; };
  }, []);

  const cards = [
    { label: "Total orders", value: stats.totalOrders, icon: FaClipboardList, tone: "teal" },
    { label: "Awaiting action", value: stats.pendingOrders, icon: FaBoxOpen, tone: "amber" },
    { label: "In transit", value: stats.shippedOrders, icon: FaShippingFast, tone: "blue" },
    { label: "Delivered", value: stats.deliveredOrders, icon: FaCheckCircle, tone: "green" },
  ];

  return (
    <main className={`admin-dashboard ${loading ? "is-loading" : ""}`}>
      <section className="admin-welcome">
        <div><p>STORE OVERVIEW</p><h2>Good to have you back.</h2><span>Here’s what is happening with Picasso Publications today.</span></div>
        <div className="admin-revenue"><div><FaRupeeSign /></div><span>Total revenue</span><strong>Rs. {Number(stats.totalRevenue || 0).toLocaleString("en-IN")}</strong></div>
      </section>

      <div className="admin-metric-grid">
        {cards.map(({ label, value, icon, tone }) => (
          <article className={`admin-metric-card ${tone}`} key={label}>
            <div className="admin-metric-icon">{createElement(icon)}</div>
            <div><span>{label}</span><strong>{loading ? "—" : value}</strong></div>
          </article>
        ))}
      </div>
    </main>
  );
};

export default AdminDashboard;
