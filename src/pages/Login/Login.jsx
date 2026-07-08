import { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaBookOpen, FaEnvelope, FaLock, FaShieldAlt } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import Toast from "../../components/Toast/Toast";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

const Login = () => {
  const [timer, setTimer] = useState(60);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { sendOtp, verifyOtp } = useAuth();
  const redirectPath = location.state?.from || "/";

  useEffect(() => {
    if (step !== 2 || timer <= 0) return;
    const interval = setInterval(() => setTimer((value) => value - 1), 1000);
    return () => clearInterval(interval);
  }, [step, timer]);

  const notify = (message) => {
    setToastMsg(message);
    setShowToast(true);
  };

  const handleSendOtp = async (event) => {
    event?.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      notify("Enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      await sendOtp(email.trim());
      setStep(2);
      setTimer(60);
      notify("OTP sent to your email");
    } catch {
      notify("Unable to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (event) => {
    event?.preventDefault();
    if (otp.length !== 6) {
      notify("Enter the 6 digit OTP");
      return;
    }

    setLoading(true);
    try {
      await verifyOtp(email.trim(), otp);
      notify("Login successful");
      setTimeout(() => navigate(redirectPath, { replace: true }), 450);
    } catch {
      notify("That OTP is invalid or has expired");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      await sendOtp(email.trim());
      setTimer(60);
      notify("A new OTP has been sent");
    } catch {
      notify("Unable to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <button className="login-back" onClick={() => navigate("/")}><FaArrowLeft /> Back to store</button>

      <section className="login-shell">
        <aside className="login-story">
          <div className="login-brand"><FaBookOpen /><span>Picasso<br />Publications</span></div>
          <div className="login-story-copy">
            <p>YOUR LEARNING, CONTINUED</p>
            <h1>A simpler way to manage your books and orders.</h1>
            <span>Sign in securely without remembering another password. We’ll email you a one-time code.</span>
          </div>
          <div className="login-trust"><FaShieldAlt /><div><strong>Password-free access</strong><span>Your OTP is private and expires shortly.</span></div></div>
        </aside>

        <div className="login-panel">
          <div className="login-step"><span>{step === 1 ? "01" : "02"}</span> of 02</div>

          {step === 1 ? (
            <form onSubmit={handleSendOtp}>
              <p className="login-eyebrow">Welcome back</p>
              <h2>Sign in to your account</h2>
              <p className="login-intro">Track orders, save your address, and move through checkout faster.</p>

              <label htmlFor="login-email">Email address</label>
              <div className="login-field"><FaEnvelope /><input id="login-email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} autoFocus /></div>

              <button className="login-primary" type="submit" disabled={loading}>{loading ? "Sending code..." : <>Send secure code <FaArrowRight /></>}</button>
            </form>
          ) : (
            <form onSubmit={handleVerify}>
              <p className="login-eyebrow">Check your inbox</p>
              <h2>Enter your secure code</h2>
              <p className="login-intro">We sent a 6 digit code to <strong>{email}</strong>.</p>

              <label htmlFor="login-otp">One-time password</label>
              <div className="login-field login-otp-field"><FaLock /><input id="login-otp" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="000000" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))} autoFocus /></div>

              <button className="login-primary" type="submit" disabled={loading || otp.length !== 6}>{loading ? "Verifying..." : <>Verify and continue <FaArrowRight /></>}</button>

              <div className="login-secondary-actions">
                <button type="button" onClick={() => { setStep(1); setOtp(""); }}>Change email</button>
                {timer > 0 ? <span>Resend in {timer}s</span> : <button type="button" onClick={handleResendOtp} disabled={loading}>Resend code</button>}
              </div>
            </form>
          )}

          <p className="login-legal">By continuing, you agree to Picasso Publications’ Terms and Privacy Policy.</p>
        </div>
      </section>

      <Toast message={toastMsg} show={showToast} onClose={() => setShowToast(false)} />
    </main>
  );
};

export default Login;
