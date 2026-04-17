import React from "react";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h2>Dashboard Overview</h2>

      <div className="admin-grid">
        <div className="admin-card">
          <h3>Total Orders</h3>
          <p>--</p>
        </div>

        <div className="admin-card">
          <h3>Pending Orders</h3>
          <p>--</p>
        </div>

        <div className="admin-card">
          <h3>Shipped Orders</h3>
          <p>--</p>
        </div>

        <div className="admin-card">
          <h3>Total Revenue</h3>
          <p>₹ --</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;