import React, { useState, useEffect } from "react";
import "./Checkout.css";
import Toast from "../../components/Toast/Toast";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Checkout = () => {
    const { isAuthenticated, sendOtp, verifyOtp } = useAuth();
    const [step, setStep] = useState(0);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [enteredOTP, setEnteredOTP] = useState("");

    const [toastMsg, setToastMsg] = useState("");
    const [showToast, setShowToast] = useState(false);

    const [savedAddress, setSavedAddress] = useState(null);

    const [address, setAddress] = useState({
        name: "",
        email: "",
        phone: "",
        pincode: "",
        house: "",
        area: "",
        city: "",
        state: "",
        type: "Home"
    });

    const [selectedPayment, setSelectedPayment] = useState("razorpay");

    const { cart, getTotalPrice } = useCart();

    /* ---------------- FETCH SAVED ADDRESS ---------------- */

    useEffect(() => {
        if (isAuthenticated) {
            fetchSavedAddress();
        } else {
            setStep(1);
        }
    }, [isAuthenticated]);

    const fetchSavedAddress = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(
                "https://picasso-backend-7rap.onrender.com/auth/address",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await res.json();

            console.log("ADDRESS RESPONSE:", data); // debug

            if (data.has_address) {
                setSavedAddress(data.address);
                setStep(4); // skip address form
            } else {
                setStep(3); // show form
            }

        } catch (err) {
            setStep(3);
        }
    };
    /* ---------------- SEND OTP ---------------- */

    const handleSendOtp = async () => {
        if (!email.includes("@")) {
            setToastMsg("Enter valid email ❌");
            setShowToast(true);
            return;
        }

        try {
            await sendOtp(email);

            setToastMsg("OTP sent to email 📩");
            setShowToast(true);

            setStep(2);

        } catch {
            setToastMsg("Failed to send OTP ❌");
            setShowToast(true);
        }
    };

    /* ---------------- VERIFY OTP ---------------- */

    const handleVerifyOtp = async () => {
        try {
            await verifyOtp(email, enteredOTP);

            setToastMsg("OTP Verified ✅");
            setShowToast(true);

            setAddress(prev => ({
                ...prev,
                email: email
            }));

            fetchSavedAddress();

        } catch {
            setToastMsg("Invalid OTP ❌");
            setShowToast(true);
        }
    };

    /* ---------------- SAVE ADDRESS ---------------- */

    const handleAddressSubmit = async () => {

        if (
            !address.name ||
            !address.email ||
            !address.phone ||
            !address.pincode ||
            !address.house ||
            !address.area ||
            !address.city ||
            !address.state
        ) {
            setToastMsg("Fill all fields ❌");
            setShowToast(true);
            return;
        }

        if (address.phone.length !== 10) {
            setToastMsg("Invalid phone number ❌");
            setShowToast(true);
            return;
        }

        if (address.pincode.length !== 6) {
            setToastMsg("Invalid Pincode ❌");
            setShowToast(true);
            return;
        }

        try {
            const token = localStorage.getItem("token");

            await fetch("https://picasso-backend-7rap.onrender.com/auth/address", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...address,
                    type: address.type
                })
            });

            setSavedAddress(address);

            setToastMsg("Address Saved ✅");
            setShowToast(true);

            setStep(4);

        } catch {
            setToastMsg("Failed to save address ❌");
            setShowToast(true);
        }
    };

    /* ---------------- PRICE ---------------- */

    const sellingPrice = getTotalPrice();
    const shipping = sellingPrice >= 500 ? 0 : 50;
    const finalAmount = sellingPrice + shipping;

    return (
        <div className="checkout-container">

            {/* STEP 1 EMAIL */}
            {step === 1 && (
                <div className="otp-overlay">
                    <div className="checkout-card">
                        <h2>Enter Email</h2>

                        <input
                            type="email"
                            value={email}
                            placeholder="Enter your email"
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <button onClick={handleSendOtp}>
                            Send OTP
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 2 OTP */}
            {step === 2 && (
                <div className="otp-overlay">
                    <div className="otp-popup">
                        <h2>Verify OTP</h2>

                        <input
                            className="otp-input"
                            value={enteredOTP}
                            onChange={(e) => setEnteredOTP(e.target.value)}
                        />

                        <button
                            className="verify-btn"
                            onClick={handleVerifyOtp}
                        >
                            Verify
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 3 ADDRESS */}
            {step === 3 && !savedAddress && (
                <div className="otp-overlay">
                    <div className="address-popup">
                        <h2>Add Delivery Address</h2>

                        <div className="address-form">

                            <input
                                placeholder="Full Name"
                                value={address.name}
                                onChange={(e) =>
                                    setAddress({ ...address, name: e.target.value })
                                }
                            />

                            <div className="phone-input">
                                <span>+91</span>
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    maxLength={10}
                                    value={address.phone}
                                    onChange={(e) =>
                                        setAddress({ ...address, phone: e.target.value })
                                    }
                                />
                            </div>

                            <input
                                placeholder="Email"
                                value={address.email}
                                onChange={(e) =>
                                    setAddress({ ...address, email: e.target.value })
                                }
                            />

                            <input
                                placeholder="Pincode"
                                value={address.pincode}
                                onChange={(e) =>
                                    setAddress({ ...address, pincode: e.target.value })
                                }
                            />

                            <input
                                placeholder="House"
                                value={address.house}
                                onChange={(e) =>
                                    setAddress({ ...address, house: e.target.value })
                                }
                            />

                            <input
                                placeholder="Area"
                                value={address.area}
                                onChange={(e) =>
                                    setAddress({ ...address, area: e.target.value })
                                }
                            />

                            <input
                                placeholder="City"
                                value={address.city}
                                onChange={(e) =>
                                    setAddress({ ...address, city: e.target.value })
                                }
                            />

                            <input
                                placeholder="State"
                                value={address.state}
                                onChange={(e) =>
                                    setAddress({ ...address, state: e.target.value })
                                }
                            />

                        </div>

                        <div className="address-type">
                            <button
                                className={address.type === "Home" ? "active" : ""}
                                onClick={() => setAddress({ ...address, type: "Home" })}
                            >
                                Home
                            </button>

                            <button
                                className={address.type === "Office" ? "active" : ""}
                                onClick={() => setAddress({ ...address, type: "Office" })}
                            >
                                Office
                            </button>
                        </div>

                        <button
                            className="address-btn"
                            onClick={handleAddressSubmit}
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 4 PAYMENT */}
            {step === 4 && savedAddress && (
                <div className="payment-container">

                    <div className="payment-left">

                        <h3>Delivery Address</h3>

                        <div className="saved-address-box">
                            <div className="address-badge">
                                {savedAddress.type || "Home"}
                            </div>
                            <p><b>{savedAddress.name}</b></p>
                            <p>{savedAddress.house}, {savedAddress.area}</p>
                            <p>{savedAddress.city}, {savedAddress.state}</p>
                            <p>{savedAddress.pincode}</p>
                            <p>📞 {savedAddress.phone}</p>

                            <button
                                className="change-address-btn"
                                onClick={() => {
                                    setAddress(savedAddress);
                                    setSavedAddress(null);
                                    setStep(3)
                                }}
                            >
                                Change Address
                            </button>
                        </div>

                        <h3>Payment Method</h3>

                        <div
                            className={`payment-option ${selectedPayment === "razorpay" ? "active" : ""}`}
                            onClick={() => setSelectedPayment("razorpay")}
                        >
                            Pay Online (Razorpay)
                        </div>

                    </div>

                    <div className="payment-right">
                        <h3>Order Summary</h3>

                        {cart.map((item, index) => (
                            <div key={index} className="summary-item">

                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="summary-img"
                                />

                                <div className="summary-info">
                                    <p>{item.title}</p>
                                    <p>Qty: {item.quantity}</p>
                                </div>

                                <div className="summary-price">
                                    ₹{item.price * item.quantity}
                                </div>

                            </div>
                        ))}

                        <h2>Total: ₹{finalAmount}</h2>

                        <button
                            className="place-order-btn"
                            onClick={() => navigate("/payment")}
                        >
                            Proceed to Payment
                        </button>
                    </div>

                </div>
            )}

            <Toast
                message={toastMsg}
                show={showToast}
                onClose={() => setShowToast(false)}
            />

        </div>
    );
};

export default Checkout;