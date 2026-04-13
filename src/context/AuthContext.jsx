import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // ✅ Restore session on refresh
    useEffect(() => {
        const savedToken = localStorage.getItem("token");

        if (savedToken) {
            setToken(savedToken);
            setUser({ token: savedToken });
        }

        setLoading(false);
    }, []);

    // ✅ Send OTP
    const sendOtp = async (email) => {
        try {
            const res = await api.post("/auth/send-otp", {
                email: email,
            });

            return res.data;
        } catch (error) {
            throw error;
        }
    };

    // ✅ Verify OTP
    const verifyOtp = async (email, otp) => {
        try {
            const res = await api.post("/auth/verify-otp", {
                email: email,
                otp: otp,
            });

            localStorage.setItem("token", res.data.token);

            setToken(res.data.token);
            setUser({ id: res.data.user_id, email });

            return res.data;

        } catch (error) {
            throw error;
        }
    };

    // ✅ Logout
    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                loading,
                sendOtp,
                verifyOtp,
                logout,
                isAuthenticated: token !== null,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};