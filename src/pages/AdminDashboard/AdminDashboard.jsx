import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import { getAdminDashboard } from "../../services/api";

const AdminDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getAdminDashboard();
      setData(res);
    } catch (err) {
      console.log("Admin dashboard error:", err);
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Dashboard Overview</h2>

      <div className="admin-grid">

        <div className="admin-card">
          <h3>Total Orders</h3>
          <p>{data?.totalOrders ?? 0}</p>
        </div>

        <div className="admin-card">
          <h3>Pending Orders</h3>
          <p>{data?.pendingOrders ?? 0}</p>
        </div>

        <div className="admin-card">
          <h3>Shipped Orders</h3>
          <p>{data?.shippedOrders ?? 0}</p>
        </div>

        <div className="admin-card">
          <h3>Total Revenue</h3>
          <p>₹ {data?.totalRevenue ?? 0}</p>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;