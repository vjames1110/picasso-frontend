import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./Payment.css";

const Payment = () => {
    const navigate = useNavigate();
    const { clearCart } = useCart();
    const { state } = useLocation();

    const { amount, orderId, razorpay_order_id } = state || {};

    const razorPayOpened = useRef(false);

    useEffect(() => {
        if (!state || !amount || !orderId) {
            navigate("/checkout");
            return;
        }

        if (razorPayOpened.current) return;

        razorPayOpened.current = true;
        handleRazorpay();
    }, [state]);

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    function handleRazorpay() {
        loadRazorpay().then((res) => {

            if (!res) {
                alert("Payment gateway failed. Please try again.");
                return;
            }

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY,
                amount: amount * 100,
                currency: "INR",
                name: "Picasso Publications",
                description: "Book Purchase",
                order_id: razorpay_order_id,

                handler: async function (response) {
                    try {

                        const token = localStorage.getItem("token");

                        const verifyRes = await fetch(
                            "https://picasso-backend-7rap.onrender.com/orders/verify",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${token}`
                                },
                                body: JSON.stringify({
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature
                                })
                            }
                        );

                        if (!verifyRes.ok) {
                            throw new Error("Verification failed");
                        }

                        const verifyData = await verifyRes.json();

                        clearCart();

                        navigate(`/order-success/${orderId}`, {
                            replace: true,
                            state: {
                                orderId: orderId,
                                paymentMethod: "razorpay",
                                paymentId: response.razorpay_payment_id,
                                amount
                            }
                        });

                    } catch (err) {
                        console.error("VERIFY ERROR:", err);
                        alert("Payment verification failed");
                        navigate("/checkout");
                    }
                },

                modal: {
                    ondismiss: function () {
                        navigate("/checkout");
                    }
                },

                prefill: {
                    name: state?.address?.name ?? "",
                    email: state?.address?.email ?? "",
                    contact: state?.address?.phone ?? ""
                },

                theme: {
                    color: "#0f172a"
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        });
    }

    return (
        <div className="payment-page">
            <h2>Redirecting to secure payment...</h2>
        </div>
    );
};

export default Payment;