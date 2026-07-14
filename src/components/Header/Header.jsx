import React, { useEffect, useRef, useState } from 'react';
import "./Header.css";
import { FaShoppingCart, FaUser, FaSearch, FaClipboardCheck, FaBoxOpen } from 'react-icons/fa';
import { AnimatePresence, motion as Motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart } from '../../context/CartContext';
import { useAuth } from "../../context/AuthContext";

const PICASSO_EXAMS_URL = "https://exams-picasso.netlify.app/login";

const Header = () => {
    const navigate = useNavigate();
    const { getTotalItems } = useCart();
    const { isAuthenticated, logout } = useAuth();

    const [search, setSearch] = useState("");
    const [isExamLoading, setIsExamLoading] = useState(false);
    const examRedirectTimer = useRef(null);

    useEffect(() => {
        return () => {
            if (examRedirectTimer.current) {
                clearTimeout(examRedirectTimer.current);
            }
        };
    }, []);

    const handleMockTestClick = () => {
        if (isExamLoading) return;

        setIsExamLoading(true);
        examRedirectTimer.current = setTimeout(() => {
            window.location.assign(PICASSO_EXAMS_URL);
        }, 1300);
    };

    return (
        <>
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
                    onClick={handleMockTestClick}
                    disabled={isExamLoading}
                    aria-busy={isExamLoading}
                    title="Open Picasso Exams"
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
        <AnimatePresence>
            {isExamLoading && (
                <Motion.div
                    className="exam-loading-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    role="status"
                    aria-live="polite"
                >
                    <Motion.div
                        className="exam-loading-panel"
                        initial={{ y: 18, scale: 0.97 }}
                        animate={{ y: 0, scale: 1 }}
                        exit={{ y: 12, scale: 0.98 }}
                        transition={{ duration: 0.28, ease: "easeOut" }}
                    >
                        <div className="exam-loading-orbit" aria-hidden="true">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <p>Loading Picasso Exams</p>
                        <strong>Preparing your mock test portal</strong>
                        <div className="exam-loading-progress" aria-hidden="true">
                            <span></span>
                        </div>
                    </Motion.div>
                </Motion.div>
            )}
        </AnimatePresence>
        </>
    )
}

export default Header;
