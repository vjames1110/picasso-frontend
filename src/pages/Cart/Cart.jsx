import React from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import CartItem from "../../components/CartItem/CartItem";
import "./Cart.css";

// Cart Initialization

const Cart = () => {
    const { cart, getTotalPrice, getTotalItems } = useCart();
    const navigate = useNavigate();

    if (cart.length === 0) {
        return (
            <div className="cart-empty">
                <h2>Your Cart is Empty 🛒</h2>
                <button onClick={() => navigate("/")}>
                    Shop Now
                </button>
            </div>
        )
    }

    const totalItems = getTotalItems();

    const totalMRP = cart.reduce(
        (total, item) => total + item.originalPrice * item.quantity
        , 0)

    const sellingPrice = getTotalPrice();
    const discount = totalMRP - sellingPrice;
    const shipping = sellingPrice >= 500 ? 0 : 50;
    const finalPrice = sellingPrice + shipping;

    return (
        <div className="cart-container">

            {/*Top Section/*/}
            <div className="cart-header">
                Home &gt; Shopping Cart
            </div>

            <div className="cart-content">

                {/*Left Section/*/}
                <div className="cart-left">
                    {cart.map((item, index) => (
                        <CartItem
                            key={item.id || item.book_id || index}
                            item={item}
                        />
                    ))}
                </div>
                {/*Right Section/*/}
                <div className="cart-right">
                    <h3>Price Details</h3>
                    <p>Total Items: {totalItems}</p>
                    <p>Total MRP: ₹{totalMRP}</p>
                    <p style={{ color: "green" }}>Discount: -₹{discount}</p>

                    <p>Order Value: ₹{sellingPrice}</p>
                    <p>Shipping Charges: ₹{shipping}</p>

                    <hr />
                    <h2>You Pay: ₹{finalPrice}</h2>

                    <div className="savings">
                        🎉 You Saved ₹{discount} on this order!
                    </div>

                    <button
                        className="checkout-btn"
                        onClick={() => navigate("/checkout")}
                    >
                        Proceed to Checkout!
                    </button>
                </div>
            </div>
        </div>
    );

};

export default Cart;