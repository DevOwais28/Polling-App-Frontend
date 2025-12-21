import axios from "axios";
import useAppStore from "./store";

const api = axios.create({
    baseURL: "https://polling-app-production-855d.up.railway.app/api/",
});

api.interceptors.request.use((config) => {
    const token = useAppStore.getState().token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        const message = error?.response?.data?.message;

        if (
            status === 401 &&
            (message === "Invalid token." || message === "Token expired." || message === "Access Denied. No token provided." || message === "Access Denied. Token format invalid.")
        ) {
            // Clear auth state from store
            const { clearUser } = useAppStore.getState();
            clearUser();

            // Also clear any legacy localStorage items if present
            try {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            } catch (_) {}

            // Redirect to landing/login page
            if (typeof window !== "undefined") {
                window.location.href = "/";
            }
        }

        return Promise.reject(error);
    }
);

export const apiRequest = async (
    method = "POST",
    url = "users/signup",
    data = {},
    params = {}
) => {
    const res = await api({ method, url, data, params });
    return res;
};
