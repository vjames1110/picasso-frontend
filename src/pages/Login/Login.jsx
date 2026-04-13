import React, { useState } from "react";
import "./Login.css";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import Toast from "../../components/Toast/Toast";

const Login = () => {

  const location = useLocation();
  const redirectPath = location.state?.from || "/";

  const { sendOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);


  // Send OTP
  const handleSendOtp = async () => {
    if (!email.includes("@")) {
      setToastMsg("Enter valid email");
      setShowToast(true);
      return;
    }

    try {
      await sendOtp(email);
      setStep(2);

      setToastMsg("OTP sent to email");
      setShowToast(true);

    } catch (err) {
      setToastMsg("Failed to send OTP");
      setShowToast(true);
    }
  };


  // Verify OTP
  const handleVerify = async () => {
    if (otp.length !== 6) return;

    try {
      await verifyOtp(email, otp);

      setToastMsg("Login successful");
      setShowToast(true);

      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 500);

    } catch (err) {
      setToastMsg("Invalid OTP");
      setShowToast(true);
    }
  };


  return (
    <div className="login-container">

      <div className="login-card">

        {step === 1 && (
          <>
            <h2>Login</h2>
            <p>Enter Email</p>

            <div className="email-input">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>



            <button onClick={handleSendOtp}>
              Send OTP
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2>Verify OTP</h2>

            <input
              className="otp-input"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
            />

            <button onClick={handleVerify}>
              Verify & Login
            </button>
          </>
        )}

      </div>

      <Toast
        message={toastMsg}
        show={showToast}
        onClose={() => setShowToast(false)}
      />

    </div>
  );
};

export default Login;