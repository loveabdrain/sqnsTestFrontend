import {ref, computed, onMounted, onUnmounted} from 'vue'
import { authService } from '../services/auth.js'
import axios from "axios"

export function useAuth() {
    const user = ref(authService.getUserData())
    const isAuthenticated = ref(authService.isAuthenticated())
    const logoutTimer = ref(null);

    const checkTokenExpiration = () => {
        const tokenData = authService.getTokenData();
        if (!tokenData || !tokenData.expires_in) return;

        const now = new Date().getTime();
        const expiresAt = new Date(tokenData.expires_in).getTime();

        if (now > expiresAt) {
            logout();
        }
    };

    const setLogoutTimer = (expiresIn) => {
        clearTimeout(logoutTimer.value);

        const logoutTime = expiresIn || 60 * 60 * 1000;

        logoutTimer.value = setTimeout(() => {
            logout();
            alert('Сессия истекла. Пожалуйста, войдите снова.');
        }, logoutTime);
    };

    const login = async (credentials) => {
        try {
            const response = await axios.post('/api/login', credentials)

            const { token, user: userData, expires_in } = response.data

            authService.setToken(token, expires_in)
            authService.setUserData(userData)
            authService.setAuthHeader()

            user.value = userData
            isAuthenticated.value = true
            setLogoutTimer(expires_in * 1000);

            return response.data
        } catch (error) {
            return error
        }
    }

    const register = async (userData) => {
        try {
            const response = await axios.post('/api/register', userData)
        } catch (error) {
            throw error
        }
    }

    const logout = () => {
        authService.logout()
        isAuthenticated.value = false
        delete axios.defaults.headers.common['Authorization']
    }

    const refreshUserData = async () => {
        if (!isAuthenticated.value) return

        try {
            const response = await axios.get('/api/users')
            const userData = response.data

            authService.setUserData(userData)
            user.value = userData
        } catch (error) {
            console.error('Ошибка обновления данных пользователя:', error)
        }
    }

    onMounted(() => {
        checkTokenExpiration();

        const interval = setInterval(checkTokenExpiration, 5 * 60 * 1000);

        onUnmounted(() => {
            clearInterval(interval);
            clearTimeout(logoutTimer.value);
        });
    });

    return {
        user: computed(() => user.value),
        isAuthenticated: computed(() => isAuthenticated.value),
        login,
        register,
        logout,
    }
}