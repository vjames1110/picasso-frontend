import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import "./AdminLogin.css"

const AdminLogin = () => {
    const { sendOtp, verifyOtp } = useAuth();
    const navigate = useNavigate();

    const [email, setemail] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState("email");
    const [loading, setLoading] = useState(false);

    const handleSendOtp = async () => {
        setLoading(true);
        try {
            await sendOtp(email);
            setStep("otp");
        } catch (err) {
            alert("Failed to Send OTP");
        }
        setLoading(false);
    };

    const handleVerifyOtp = async () => {
        setLoading(true);
        try {
            await verifyOtp(email, otp);
            navigate("/admin/dashboard");
        } catch (err) {
            alert("Invalid OTP");
        };
    };

    return (
        <div className="admin-logo-container">
            <div className="admin-login-box">

                <h2>Admin Login</h2>

                {step === "email" && (
                    <>
                    <input
                        type="email"
                        placeholder="Admin Email"
                        value={email}
                        onChange={(e) => setemail(e.target.value)} 
                    />

                    <button onClick={handleSendOtp} disabled={loading}>
                        Send OTP
                    </button>
                    </>
                )}

                {step === "otp" && (
                    <>
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}                    
                    />

                    <button onClick={{handleVerifyOtp}} disabled={loading}>
                        Verify & Login
                    </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminLogin