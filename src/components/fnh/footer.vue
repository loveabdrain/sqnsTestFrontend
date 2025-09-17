<template>
  <div class="left-block">
    <img src="../../assets/image/H_7%20semibold.png">
  </div>
  <div class="center">
    <div class="pointer">
      <RouterLink to="/">Главная</RouterLink>
    </div>

    <div class="pointer">
      <RouterLink to="/reviews">Отзывы</RouterLink>
    </div>

    <div class="pointer" v-if="auth.isAuthenticated.value">
      <RouterLink to="/profile">Мой профиль</RouterLink>
    </div>

    <div class="pointer">
      <RouterLink to="/privacy-policy">Политика обработки персональных данных</RouterLink>
    </div>
  </div>
  <div class="right-block">Logo Text © 2010 — 2023</div>
</template>
<script>
import {inject} from "vue";

export default {
  setup() {
    const auth = inject('auth', null);

    return {
      auth
    }
  }
}
</script>