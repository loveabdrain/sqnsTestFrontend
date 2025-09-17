import axios from 'axios'
import { authService } from '../services/auth.js'

axios.defaults.baseURL = 'http://localhost:8000/'

axios.interceptors.request.use(
    (config) => {
        const token = authService.getToken()
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
);

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            authService.logout()
            window.location.href = '/auth'
        }
        return Promise.reject(error)
    }
);

export default axios