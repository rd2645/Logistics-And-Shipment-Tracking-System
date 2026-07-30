import axios from 'axios';

const LOGISTICS_API_URL = 'http://localhost:8080/api';
const AUTH_API_URL = 'http://localhost:8081/api';

const api = axios.create();

api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    
    // Route /auth requests to the .NET service on port 8081
    if (config.url.startsWith('/auth')) {
        config.baseURL = AUTH_API_URL;
    } else {
        config.baseURL = LOGISTICS_API_URL;
    }
    
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (user && user.refreshToken) {
                    const res = await axios.post(`${AUTH_API_URL}/auth/refresh`, { refreshToken: user.refreshToken });
                    if (res.data.token) {
                        localStorage.setItem('user', JSON.stringify({ ...user, token: res.data.token, refreshToken: res.data.refreshToken }));
                        originalRequest.headers.Authorization = `Bearer ${res.data.token}`;
                        return api(originalRequest);
                    }
                }
            } catch (refreshError) {
                console.error("Token refresh failed", refreshError);
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
