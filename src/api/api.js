import axios from 'axios';

// Base URL for the Laravel API
const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

// Create a new Axios instance with a base URL
const api = axios.create({
    baseURL: API_BASE_URL,
});

export default api;
