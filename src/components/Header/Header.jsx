import React, { useState } from 'react';
import "./Header.css";
import { FaShoppingCart, FaUser, FaSearch, FaClipboardCheck, FaBoxOpen } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { useCart } from '../../context/CartContext';
import { useAuth } from "../../context/AuthContext";

const Header = () => {
    const navigate = useNavigate();
    const { getTotalItems } = useCart();
    const { isAuthenticated, logout } = useAuth();

    const [search, setSearch] = useState("");


    return (
        <header className='header'>
            {/* Logo Section */}
            <div 
                className="logo-section"
                onClick={() => navigate("/")}
                style={{ cursor: "pointer"}}>
                <div className="brand-mark">P</div>
                <div><h1>Picasso Publications</h1>
                <p className='tagline'>Your Success Partner</p></div>
            </div>

            {/* Search Section */}
            <div className='search-bar'>
                <input
                    type='text'
                    placeholder='Search by book, exam or author'
                    value={search || ""}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button
                    className='search-button'
                    onClick={() => {
                        if (!search.trim()) {
                            navigate("/")
                        } else {
                            navigate(`/?search=${search}`)
                        }
                    }}
                >
                    <FaSearch aria-label="Search" />
                </button>
            </div>

            {/* Actions */}
            <div className='header-actions'>

                {/* Home Button */}

                <button
                    className='mock-test-btn'
                    onClick={() => navigate("/")}
                    title="Mock tests are coming soon"
                >
                    <FaClipboardCheck /> <span>Give Mock Test</span>
                </button>

                {!isAuthenticated ? (
                    <button
                        className='login-btn'
                        onClick={() => navigate("/login")}
                    >
                        <FaUser /> <span>Login</span>
                    </button>
                ) : (
                    <button
                        className='login-btn'
                        onClick={() => {
                            logout();
                            navigate("/");
                        }}
                    >
                        <FaUser /> <span>Logout</span>
                    </button>
                )}

                <button className='icon-action cart-icon' onClick={() => navigate("/cart")} aria-label="Open cart">
                    <FaShoppingCart />
                    <span className='cart-count'>{getTotalItems()}</span>
                </button>

                <button
                    className="orders-btn"
                    onClick={() => navigate("/my-orders")}
                >
                    <FaBoxOpen /> <span>Orders</span>
                </button>

            </div>
        </header>
    )
}

export default Header;
