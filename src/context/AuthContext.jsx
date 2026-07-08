import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

const readStoredUser = () => {
    try {
        const stored = localStorage.getItem("auth_user");
        return stored ? JSON.parse(stored) : null;
    } catch {
        localStorage.removeItem("auth_user");
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [user, setUser] = useState(readStoredUser);
    const [loading, setLoading] = useState(() => Boolean(localStorage.getItem("token")));

    useEffect(() => {
        if (!token) return;
        let isActive = true;

        api.get("/auth/me")
            .then((response) => {
                if (!isActive) return;
                setUser((currentUser) => {
                    const restoredUser = {
                        ...currentUser,
                        ...response.data,
                        email: response.data.email || currentUser?.email,
                    };
                    localStorage.setItem("auth_user", JSON.stringify(restoredUser));
                    return restoredUser;
                });
            })
            .catch(() => {
                if (!isActive) return;
                localStorage.removeItem("token");
                localStorage.removeItem("auth_user");
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
        const res = await api.post("/auth/send-otp", { email: email.trim().toLowerCase() });
        return res.data;
    };

    // ✅ Verify OTP
    const verifyOtp = async (email, otp) => {
        const normalizedEmail = email.trim().toLowerCase();
        const res = await api.post("/auth/verify-otp", { email: normalizedEmail, otp });

        const authenticatedUser = { id: res.data.user_id, email: normalizedEmail };
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("auth_user", JSON.stringify(authenticatedUser));
        setUser(authenticatedUser);
        setToken(res.data.token);

        return res.data;
    };

    // ✅ Logout
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("auth_user");
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
