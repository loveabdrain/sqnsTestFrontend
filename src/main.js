import './assets/main.css'

import { useAuth } from './composables/useAuth.js';
import {createRouter, createWebHistory} from 'vue-router'
import { createApp } from 'vue'
import App from './App.vue'

import HomePage from './components/home.vue'
import Auth from './components/auth.vue'
import PrivacyPolicy from './components/privacyPolicy.vue'
import Profile from './components/profile.vue'
import Reviews from './components/reviews/reviews.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            name: 'Home',
            path: '/',
            component: HomePage,
            meta: { requiresAuth: false }
        },
        {
            name: 'Auth',
            path: '/auth',
            component: Auth,
            meta: { requiresAuth: false }
        },
        {
            name: 'PrivacyPolicy',
            path: '/privacy-policy',
            component: PrivacyPolicy,
            meta: { requiresAuth: false }
        },
        {
            name: 'Profile',
            path: '/profile',
            component: Profile,
            meta: { requiresAuth: true }
        },
        {
            name: 'Reviews',
            path: '/reviews',
            component: Reviews,
            meta: { requiresAuth: false }
        },
    ]
})
router.beforeEach((to, from, next ) =>{
    if (to.meta.requiresAuth && !localStorage.getItem('auth_token')) {
        next({ name: 'Auth' })
    }
    else{
        next()
    }

})
const app = createApp(App);
const auth = useAuth();
app.use(router);
app.provide('auth', auth);
app.mount('#app')
