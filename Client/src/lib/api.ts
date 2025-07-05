import axios from "axios";

// Axios instance with interceptors (to use the same baseURL across many requests)
const axiosInstance = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
});

axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        console.log(originalRequest)
        if (error.response?.status === 401 && !originalRequest._retry && auth) {

            console.log("Refreshing token...");
            originalRequest._retry = true;
            try {
                const res = await axiosInstance.get("/auth/refresh");
                const newAccessToken = res.data.accessToken;

                const updatedAuth = { ...auth, accessToken: newAccessToken };
                setAuth(updatedAuth);
                localStorage.setItem("auth", JSON.stringify(updatedAuth));

                // retry original request with new token
                originalRequest.headers = {
                    ...originalRequest.headers,
                    Authorization: `Bearer ${newAccessToken}`,
                };

                return axiosInstance(originalRequest);

            } catch (refreshErr) {
                logout();
                return Promise.reject(refreshErr);
            }
        }

        return Promise.reject(error);
    }
);

module.exports = axiosInstance;