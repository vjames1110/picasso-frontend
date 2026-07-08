import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(() => Boolean(localStorage.getItem("token")));

    useEffect(() => {
        if (!token) return;
        let isActive = true;

        api.get("/auth/me")
            .then((response) => {
                if (isActive) setUser(response.data);
            })
            .catch(() => {
                if (!isActive) return;
                localStorage.removeItem("token");
                setToken(null);
                setUser(null);
            })
            .finally(() => {
                if (isActive) setLoading(false);
            });

        return () => { isActive = false; };
    }, [token]);

    // ✅ Send OTP
    const sendOtp = async (email) => {
        const res = await api.post("/auth/send-otp", { email });
        return res.data;
    };

    // ✅ Verify OTP
    const verifyOtp = async (email, otp) => {
        const res = await api.post("/auth/verify-otp", { email, otp });

            localStorage.setItem("token", res.data.token);

            setToken(res.data.token);
            setUser({ id: res.data.user_id, email });

        return res.data;
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

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    return useContext(AuthContext);
};
