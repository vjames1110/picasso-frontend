import React, { useEffect, useState } from "react";
import "./Checkout.css";
import Toast from "../../components/Toast/Toast";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { FaArrowLeft, FaArrowRight, FaBuilding, FaCheckCircle, FaCity, FaCreditCard, FaEnvelope, FaHome, FaLock, FaMapMarkerAlt, FaPen, FaPhone, FaUser } from "react-icons/fa";

const money = (value) => `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;

const Checkout = () => {
    const { isAuthenticated, user } = useAuth();
    const [step, setStep] = useState(0);
    const navigate = useNavigate();

    const [toastMsg, setToastMsg] = useState("");
    const [showToast, setShowToast] = useState(false);

    const [savedAddress, setSavedAddress] = useState(null);
    const [addressError, setAddressError] = useState("");
    const [addressSaving, setAddressSaving] = useState(false);
    const [addressReload, setAddressReload] = useState(0);

    const [creatingOrder, setCreatingOrder] = useState(false);

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
        if (!isAuthenticated) return;

        let isActive = true;
        const loadAddress = async () => {
            try {
                const { data } = await api.get("/auth/address");
                if (!isActive) return;

                if (data.has_address) {
                    setSavedAddress({
                        ...data.address,
                        type: localStorage.getItem(`address_type_${user?.id}`) || "Home",
                    });
                    setStep(4);
                } else {
                    setAddress((current) => ({ ...current, email: user?.email || current.email }));
                    setStep(3);
                }
            } catch {
                if (isActive) setAddressError("We could not check your saved address. Please try again.");
            }
        };

        loadAddress();
        return () => { isActive = false; };
    }, [addressReload, isAuthenticated, user?.email, user?.id]);

    const updateAddress = (field, value) => {
        setAddress((current) => ({ ...current, [field]: value }));
    };

    const editSavedAddress = () => {
        setAddress({
            ...address,
            ...savedAddress,
            email: savedAddress?.email || user?.email || "",
            type: savedAddress?.type || address.type || "Home",
        });
        setStep(3);
    };

    /* ---------------- SAVE ADDRESS ---------------- */

    const handleAddressSubmit = async (event) => {
        event?.preventDefault();

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
            setToastMsg("Please complete all address fields");
            setShowToast(true);
            return;
        }

        if (!/^\d{10}$/.test(address.phone)) {
            setToastMsg("Enter a valid 10 digit phone number");
            setShowToast(true);
            return;
        }

        if (!/^\d{6}$/.test(address.pincode)) {
            setToastMsg("Enter a valid 6 digit pincode");
            setShowToast(true);
            return;
        }

        try {
            setAddressSaving(true);
            await api.put("/auth/address", address);
            localStorage.setItem(`address_type_${user?.id}`, address.type);

            setSavedAddress(address);

            setToastMsg(savedAddress ? "Delivery address updated" : "Delivery address saved");
            setShowToast(true);

            setStep(4);

        } catch (error) {
            setToastMsg(error.response?.data?.detail || "Unable to save the address");
            setShowToast(true);
        } finally {
            setAddressSaving(false);
        }
    };

    const uniqueItems = Array.from(
    new Map(cart.map(i => [i.book_id, i])).values()
);

    /* ---------------- PRICE ---------------- */

    const sellingPrice = getTotalPrice();
    const totalMRP = cart.reduce((sum, item) => sum + Number(item.originalPrice || item.original_price || item.price || 0) * item.quantity, 0);
    const discount = Math.max(totalMRP - sellingPrice, 0);
    const shipping = cart.reduce((sum, item) => sum + (item.quantity || 0), 0) * 65;
    const finalAmount = sellingPrice + shipping;
    const handleCreateOrder = async () => {

        if (creatingOrder) return; // prevent double call
        setCreatingOrder(true);

        try {
            const { data } = await api.post("/orders/create", {
                amount: finalAmount,
                items: uniqueItems.map(item => ({
                    book_id: item.book_id ?? item.id,
                    title: item.title,
                    quantity: item.quantity,
                    price: item.price
                }))
            });

            navigate("/payment", {
                state: {
                    paymentMethod: selectedPayment,
                    amount: data.amount,
                    orderId: data.order_id,
                    razorpay_order_id: data.razorpay_order_id,
                    address: savedAddress
                }
            });

        } catch (err) {
            console.log(err);
            alert("Order creation failed");
            setCreatingOrder(false);
        }
    }

    return (
        <div className="checkout-container">
            {step === 0 && (
                <div className="checkout-address-state">
                    {addressError ? <><FaMapMarkerAlt /><h2>{addressError}</h2><button onClick={() => { setAddressError(""); setAddressReload((value) => value + 1); }}>Try again</button></> : <><span className="loader" /> Checking your saved address...</>}
                </div>
            )}

            {step === 3 && (
                <main className="checkout-address-page">
                    <button className="checkout-address-back" onClick={() => savedAddress ? setStep(4) : navigate("/cart")}><FaArrowLeft /> {savedAddress ? "Back to checkout" : "Back to cart"}</button>
                    <div className="checkout-address-heading"><p>{savedAddress ? "UPDATE DELIVERY DETAILS" : "ONE LAST STEP"}</p><h1>{savedAddress ? "Change delivery address" : "Add your delivery address"}</h1><span>{savedAddress ? "Update the information below for this and future orders." : "We’ll save this securely, so you won’t need to enter it again."}</span></div>

                    <form className="checkout-address-form" onSubmit={handleAddressSubmit}>
                        <div className="checkout-address-form-title"><FaMapMarkerAlt /><div><h2>Contact and delivery details</h2><p>Fields marked required must be completed.</p></div></div>

                        <label><span>Full name</span><div><FaUser /><input type="text" autoComplete="name" placeholder="Recipient’s full name" value={address.name} onChange={(event) => updateAddress("name", event.target.value)} required /></div></label>
                        <label><span>Registered email</span><div className="readonly"><FaEnvelope /><input type="email" value={address.email || user?.email || ""} readOnly /></div><small>This is linked to your Picasso account.</small></label>
                        <label><span>Phone number</span><div><FaPhone /><b>+91</b><input type="tel" inputMode="numeric" autoComplete="tel" maxLength={10} placeholder="10 digit number" value={address.phone} onChange={(event) => updateAddress("phone", event.target.value.replace(/\D/g, ""))} required /></div></label>
                        <label><span>Pincode</span><div><FaMapMarkerAlt /><input type="text" inputMode="numeric" autoComplete="postal-code" maxLength={6} placeholder="6 digit pincode" value={address.pincode} onChange={(event) => updateAddress("pincode", event.target.value.replace(/\D/g, ""))} required /></div></label>
                        <label className="wide"><span>House, flat or building</span><div><FaHome /><input type="text" autoComplete="address-line1" placeholder="House number, flat, building" value={address.house} onChange={(event) => updateAddress("house", event.target.value)} required /></div></label>
                        <label className="wide"><span>Street, area or landmark</span><div><FaMapMarkerAlt /><input type="text" autoComplete="address-line2" placeholder="Area, street or nearby landmark" value={address.area} onChange={(event) => updateAddress("area", event.target.value)} required /></div></label>
                        <label><span>City</span><div><FaCity /><input type="text" autoComplete="address-level2" placeholder="City" value={address.city} onChange={(event) => updateAddress("city", event.target.value)} required /></div></label>
                        <label><span>State</span><div><FaBuilding /><input type="text" autoComplete="address-level1" placeholder="State" value={address.state} onChange={(event) => updateAddress("state", event.target.value)} required /></div></label>

                        <fieldset className="checkout-address-type"><legend>Address type</legend><button type="button" className={address.type === "Home" ? "active" : ""} onClick={() => updateAddress("type", "Home")}><FaHome /> Home</button><button type="button" className={address.type === "Office" ? "active" : ""} onClick={() => updateAddress("type", "Office")}><FaBuilding /> Office</button></fieldset>

                        <div className="checkout-address-actions">{savedAddress && <button type="button" className="checkout-address-cancel" onClick={() => setStep(4)}>Cancel</button>}<button type="submit" className="checkout-address-save" disabled={addressSaving}>{addressSaving ? "Saving address..." : <>Save and continue <FaArrowRight /></>}</button></div>
                    </form>
                </main>
            )}

            {/* STEP 4 PAYMENT */}
            {step === 4 && savedAddress && (
                <div className="payment-container">

                    <div className="payment-left">
                        <div className="checkout-section-heading"><p>SECURE CHECKOUT</p><h1>Complete your order</h1><span>Review the delivery and payment details before continuing.</span></div>

                        <section className="checkout-detail-card">
                            <header><div className="checkout-detail-icon"><FaMapMarkerAlt /></div><div><span>DELIVERY ADDRESS</span><h2>Where should we send your books?</h2></div>
                            <button
                                className="change-address-btn"
                                onClick={editSavedAddress}
                            >
                                <FaPen /> Change
                            </button>
                            </header>
                            <div className="checkout-address"><div className="address-badge">{savedAddress.type || "Home"}</div><strong>{savedAddress.name}</strong><p>{savedAddress.house}, {savedAddress.area}</p><p>{savedAddress.city}, {savedAddress.state} — {savedAddress.pincode}</p><span>+91 {savedAddress.phone}</span></div>
                        </section>

                        <section className="checkout-detail-card">
                            <header><div className="checkout-detail-icon"><FaCreditCard /></div><div><span>PAYMENT METHOD</span><h2>Pay safely online</h2></div></header>
                            <button
                            className={`payment-option ${selectedPayment === "razorpay" ? "active" : ""}`}
                            onClick={() => setSelectedPayment("razorpay")}
                        >
                                <div><FaCreditCard /><span><strong>Razorpay secure payment</strong><small>UPI, cards, net banking, and wallets</small></span></div><FaCheckCircle />
                            </button>
                            <p className="checkout-security-note"><FaLock /> Payment information is encrypted and processed securely.</p>
                        </section>

                    </div>

                    <div className="payment-right">
                        <div className="checkout-summary-heading"><p>YOUR ORDER</p><h2>Order summary</h2><span>{cart.reduce((sum, item) => sum + item.quantity, 0)} items</span></div>

                        {cart.map((item) => (
                            <div key={`${item.id || "guest"}-${item.book_id}`} className="checkout-summary-item">

                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="checkout-summary-img"
                                />

                                <div className="checkout-summary-info">
                                    <strong>{item.title}</strong>
                                    <span>{money(item.price)} × {item.quantity}</span>
                                </div>

                                <div className="checkout-summary-price">{money(item.price * item.quantity)}</div>

                            </div>
                        ))}

                        <div className="checkout-price-lines">
                            <div><span>Subtotal</span><strong>{money(totalMRP)}</strong></div>
                            {discount > 0 && <div className="checkout-discount"><span>Book discount</span><strong>- {money(discount)}</strong></div>}
                            <div><span>Shipping</span><strong>{money(shipping)}</strong></div>
                        </div>
                        <div className="checkout-grand-total"><span>Total payable<small>Inclusive of all charges</small></span><strong>{money(finalAmount)}</strong></div>

                        <button
                            className="place-order-btn"
                            onClick={handleCreateOrder}
                            disabled={creatingOrder}
                        >
                            {creatingOrder ? "Preparing payment..." : <>Proceed to secure payment <FaArrowRight /></>}
                        </button>
                        <p className="checkout-summary-secure"><FaLock /> Secure checkout powered by Razorpay</p>
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
