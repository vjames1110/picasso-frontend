import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/admin/dashboard");
      setStats(res.data);
    } catch (error) {
      console.error("Dashboard fetch failed", error);
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Dashboard</h2>

      <div className="admin-cards">
        <div className="admin-card">
          <h3>Total Orders</h3>
          <p>{stats.totalOrders}</p>
        </div>

        <div className="admin-card">
          <h3>Pending</h3>
          <p>{stats.pendingOrders}</p>
        </div>

        <div className="admin-card">
          <h3>Shipped</h3>
          <p>{stats.shippedOrders}</p>
        </div>

        <div className="admin-card">
          <h3>Delivered</h3>
          <p>{stats.deliveredOrders}</p>
        </div>

        <div className="admin-card revenue">
          <h3>Total Revenue</h3>
          <p>₹ {stats.totalRevenue}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;