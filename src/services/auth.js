import axios from "axios"

const AUTH_TOKEN_KEY = 'auth_token'
const USER_DATA_KEY = 'user_data'
const TOKEN_EXPIRY_KEY = 'token_expiry'

export const authService = {
    setToken(token, expiresIn = 3600) {
        localStorage.setItem(AUTH_TOKEN_KEY, token)
        const expiresAt = new Date().getTime() + (expiresIn * 1000)
        localStorage.setItem(TOKEN_EXPIRY_KEY, expiresAt.toString())
    },

    getToken() {
        return localStorage.getItem(AUTH_TOKEN_KEY)
    },

    getTokenData() {
        const token = this.getToken()
        const expiresAt = localStorage.getItem(TOKEN_EXPIRY_KEY)

        return {
            token,
            expires_at: expiresAt ? new Date(parseInt(expiresAt)) : null
        };
    },

    isTokenExpired() {
        const expiresAt = localStorage.getItem(TOKEN_EXPIRY_KEY)
        if (!expiresAt) return true

        return new Date().getTime() > parseInt(expiresAt)
    },

    setUserData(userData) {
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData))
    },

    getUserData() {
        const data = localStorage.getItem(USER_DATA_KEY)
        return data ? JSON.parse(data) : null
    },

    isAuthenticated() {
        if (!!this.getToken() && !this.isTokenExpired()) {
            return true
        }
        this.logout()
        return false
    },

    logout() {
        localStorage.removeItem(AUTH_TOKEN_KEY)
        localStorage.removeItem(USER_DATA_KEY)
        localStorage.removeItem(TOKEN_EXPIRY_KEY)
    },

    setAuthHeader() {
        const token = this.getToken()
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        } else {
            delete axios.defaults.headers.common['Authorization']
        }
    }
};

authService.setAuthHeader()