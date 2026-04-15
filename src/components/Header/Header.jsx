import React from 'react';
import "./Header.css";
import { FaShieldAlt, FaShoppingCart, FaUser } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { useCart } from '../../context/CartContext';
import { useAuth } from "../../context/AuthContext";

const Header = () => {
    const navigate = useNavigate();
    const { getTotalItems } = useCart();
    const { isAuthenticated, logout } = useAuth();

    return (
        <header className='header'>
            {/* Logo Section */}
            <div className="logo-section">
                <h1>Picasso Publications</h1>
                <p className='tagline'>Your Success Partner</p>
            </div>

            {/* Search Section */}
            <div className='search-bar'>
                <input type='text' placeholder='Search Books for SSC, UPSC, Banking...' />
                <button className='search-button'>Search</button>
            </div>

            {/* Actions */}
            <div className='header-actions'>

                {!isAuthenticated ? (
                    <button
                        className='login-btn'
                        onClick={() => navigate("/checkout")}
                    >
                        <FaUser /> Login
                    </button>
                ) : (
                    <button
                        className='login-btn'
                        onClick={() => {
                            logout();
                            navigate("/");
                        }}
                    >
                        <FaUser /> Logout
                    </button>
                )}

                <div
                    className='cart-icon'
                    onClick={() => navigate("/cart")}
                >
                    <FaShoppingCart />
                    <span className='cart-count'>{getTotalItems()}</span>
                </div>

                <button
                    className="login-btn"
                    onClick={() => navigate("/my-orders")}
                >
                    My Orders
                </button>

            </div>
        </header>
    )
}

export default Header;