import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import "./AdminLogin.css";

const AdminLogin = () => {
  const { sendOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [step, setStep] = useState("email");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let interval;

    if (step === "otp" && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    if (timer === 0) {
      setCanResend(true);
    }

    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      await sendOtp(email);
      setStep("otp");

      // adding timer

      setTimer(60);
      setCanResend(false);
    } catch (err) {
      alert("Failed to send OTP");
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      await verifyOtp(email, otp);
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      alert("Invalid OTP");
    }
    setLoading(false);
  };

  const handleResendOtp = async () => {
    try {
      await sendOtp(email);
      setTimer(60);
      setCanResend(false);
    } catch {
      alert("Failed to Resend OTP");
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h2>Admin Login</h2>

        {step === "email" && (
          <>
            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button onClick={handleSendOtp}>
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

            <button onClick={handleVerifyOtp}>
              Verify & Login
            </button>

            {!canResend ? (
              <p className="otp-timer">
                Resend OTP in {timer}s
              </p>
            ) : (
              <button
                className="resend-btn"
                onClick={handleResendOtp}
              >
                Resend OTP
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;