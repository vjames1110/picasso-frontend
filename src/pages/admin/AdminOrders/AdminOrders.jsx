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
    try {
      const res = await api.get("/orders/admin/all");
      setOrders(res.data);
    } catch (err) {
      console.log("error loading orders");
    }
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

      {orders.length === 0 && (
        <div className="no-orders">
          No orders yet
        </div>
      )}

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

                {/* CUSTOMER INFO */}

                {order.user && (
                  <div className="customer-box">

                    <h4>Customer Details</h4>

                    <div className="customer-grid">

                      <div>
                        <strong>Name:</strong>
                        <p>{order.user.name}</p>
                      </div>

                      <div>
                        <strong>Phone:</strong>
                        <p>{order.user.phone}</p>
                      </div>

                      <div>
                        <strong>Email:</strong>
                        <p>{order.user.email}</p>
                      </div>

                    </div>

                    <div className="address-box">
                      <strong>Delivery Address</strong>

                      <p>
                        {order.user.house}, {order.user.area}
                      </p>

                      <p>
                        {order.user.city}, {order.user.state}
                      </p>

                      <p>
                        Pincode: {order.user.pincode}
                      </p>

                    </div>

                  </div>
                )}


                {/* ITEMS */}

                <div className="items-box">

                  <h4>Ordered Items</h4>

                  {Array.from(
                    new Map(
                      order.items?.map(item => [
                        item.book_id,
                        item
                      ])
                    ).values()
                  ).map((item) => (
                    <div
                      key={`${item.book_id}-${item.quantity}`}
                      className="order-item"
                    >
                      <div>{item.title}</div>
                      <div>Qty: {item.quantity}</div>
                      <div>₹{item.price}</div>
                    </div>
                  ))}

                </div>


                {/* TIMELINE */}

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