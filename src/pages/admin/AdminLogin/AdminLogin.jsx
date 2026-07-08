import { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaEnvelope, FaLock, FaShieldAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Toast from "../../../components/Toast/Toast";
import { useAuth } from "../../../context/AuthContext";
import "./AdminLogin.css";

const AdminLogin = () => {
  const { sendOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [step, setStep] = useState("email");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (step !== "otp" || timer <= 0) return;
    const interval = setInterval(() => setTimer((value) => value - 1), 1000);
    return () => clearInterval(interval);
  }, [step, timer]);

  const notify = (text) => {
    setMessage(text);
    setShowToast(true);
  };

  const handleSendOtp = async (event) => {
    event?.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      notify("Enter a valid administrator email");
      return;
    }
    setLoading(true);
    try {
      await sendOtp(email.trim());
      setStep("otp");
      setTimer(60);
      notify("Security code sent");
    } catch {
      notify("Unable to send the security code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event?.preventDefault();
    if (otp.length !== 6) {
      notify("Enter the complete 6 digit code");
      return;
    }
    setLoading(true);
    try {
      await verifyOtp(email.trim(), otp);
      navigate("/admin/dashboard", { replace: true });
    } catch {
      notify("Invalid or expired security code");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      await sendOtp(email.trim());
      setTimer(60);
      notify("A new security code was sent");
    } catch {
      notify("Unable to resend the code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">
      <button className="admin-login-back" onClick={() => navigate("/")}><FaArrowLeft /> Storefront</button>
      <section className="admin-login-card">
        <div className="admin-login-brand"><span>P</span><div><strong>Picasso</strong><small>Secure administration</small></div></div>
        <div className="admin-login-shield"><FaShieldAlt /></div>

        <p className="admin-login-eyebrow">Restricted workspace</p>
        <h1>{step === "email" ? "Administrator access" : "Verify your identity"}</h1>
        <p className="admin-login-intro">{step === "email" ? "Use your authorised email to receive a temporary sign-in code." : <>A secure code was sent to <strong>{email}</strong>.</>}</p>

        {step === "email" ? (
          <form onSubmit={handleSendOtp}>
            <label htmlFor="admin-email">Admin email</label>
            <div className="admin-login-field"><FaEnvelope /><input id="admin-email" type="email" autoComplete="email" placeholder="admin@example.com" value={email} onChange={(event) => setEmail(event.target.value)} autoFocus /></div>
            <button className="admin-login-primary" type="submit" disabled={loading}>{loading ? "Sending..." : <>Continue securely <FaArrowRight /></>}</button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <label htmlFor="admin-otp">Security code</label>
            <div className="admin-login-field admin-login-otp"><FaLock /><input id="admin-otp" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="000000" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))} autoFocus /></div>
            <button className="admin-login-primary" type="submit" disabled={loading || otp.length !== 6}>{loading ? "Verifying..." : <>Open dashboard <FaArrowRight /></>}</button>
            <div className="admin-login-options"><button type="button" onClick={() => { setStep("email"); setOtp(""); }}>Change email</button>{timer > 0 ? <span>Resend in {timer}s</span> : <button type="button" onClick={handleResendOtp}>Resend code</button>}</div>
          </form>
        )}
        <p className="admin-login-note"><FaLock /> Access activity is protected and monitored.</p>
      </section>
      <Toast message={message} show={showToast} onClose={() => setShowToast(false)} />
    </main>
  );
};

export default AdminLogin;
