import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import "./AdminOrders.css";

const statusList = [
  "pending",
  "confirmed",
  "packed",
  "shipped",
  "delivered"
];

const AdminOrders = () => {

  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadOrders = async () => {
    const res = await api.get("/orders/admin/all");
    setOrders(res.data);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (id, status) => {
    setLoading(true);

    await api.put(`/orders/update-status/${id}`, {
      status
    });

    setLoading(false);
    loadOrders();
  };

  return (
    <div className="admin-orders">

      <h2>All Orders</h2>

      <div className="orders-list">

        {orders.map(order => (

          <div className="order-card" key={order.id}>

            {/* TOP */}

            <div className="order-top">

              <div>
                <h3>Order #{order.id}</h3>
                <p>₹{order.total_amount}</p>
              </div>

              <div className="order-controls">

                <select
                  value={order.status}
                  onChange={(e) =>
                    updateStatus(order.id, e.target.value)
                  }
                >
                  {statusList.map(s => (
                    <option key={s}>{s}</option>
                  ))}
                </select>

                <button
                  onClick={() =>
                    setExpanded(
                      expanded === order.id
                        ? null
                        : order.id
                    )
                  }
                >
                  Details
                </button>

              </div>

            </div>

            {/* DETAILS */}

            {expanded === order.id && (

              <div className="order-details">

                {order.items.map((item, i) => (
                  <div key={i} className="order-item">
                    <div>{item.title}</div>
                    <div>Qty: {item.quantity}</div>
                    <div>₹{item.price}</div>
                  </div>
                ))}

                <div className="timeline">

                  <div className={order.confirmed_at ? "done" : ""}>
                    Confirmed
                  </div>

                  <div className={order.packed_at ? "done" : ""}>
                    Packed
                  </div>

                  <div className={order.shipped_at ? "done" : ""}>
                    Shipped
                  </div>

                  <div className={order.delivered_at ? "done" : ""}>
                    Delivered
                  </div>

                </div>

              </div>

            )}

          </div>

        ))}

      </div>

    </div>
  );
};

export default AdminOrders;