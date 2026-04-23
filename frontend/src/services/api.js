import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Backend URL
});

// Request interceptor to add the auth token to headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // We used Bearer token in backend middleware
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle 401s (e.g. token expired) globally 
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
             // Handle unauthorized access (e.g., clear localStorage, redirect to login)
             console.log('Unauthorized access. Token might be invalid or expired.');
             // localStorage.removeItem('token');
             // localStorage.removeItem('user');
             // window.location.href = '/login'; // Optional: Redirect
        }
        return Promise.reject(error);
    }
);

export default api;
