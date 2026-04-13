import React from 'react';
import { useCart } from "../../context/CartContext";
import "./CartItem.css";

const CartItem = ({ item }) => {
    const { removeFromCart, updateQuantity } = useCart();

    const handleDecrease = () => {
        if (item.quantity > 1) {
            updateQuantity(item.id, item.quantity - 1);
        };
    };

    const handleIncrease = () => {
        if (item.quantity < item.stock) {
            updateQuantity(item.id, item.quantity + 1)
        }
    }

    const handleRemove = () => {
        removeFromCart(item.id, item.book_id);
    };

    return (
        <div className='cart-item'>
            {/* Remove Button */}
            <div className='remove-btn' onClick={handleRemove}>✖</div>

            {/* Image */}
            <img src={item.image} alt={item.title} />

            {/* Details */}
            <div className='item-details'>
                <h4>{item.title}</h4>

                <div className='price-row'>
                    <span className='price'>₹{item.price}</span>
                    <span className='original'>₹{item.originalPrice}</span>
                </div>

                <p style={{ fontstyle: "italic", fontsize: "12px", color: "gray" }}>
                    Stock Available: {item.stock}
                </p>

                {/* Quantity */}
                <div className='qty-box'>
                    <button onClick={handleDecrease}>-</button>
                    <span>{item.quantity}</span>
                    <button
                        onClick={handleIncrease}
                        disabled={item.quantity >= item.stock}
                    >
                        +
                    </button>
                </div>
            </div>

            {/* Total Price */}
            <div className='item-total'>
                ₹{item.price * item.quantity}
            </div>
        </div>
    )
};

export default CartItem;