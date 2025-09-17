<template>
  <div class="header--info">
    <div class="logo">
      logo text
    </div>
    <div class="right-block">
      <div class="button primary" v-on:click="reviewOpen()">
        <img class="add--icon" src="../../assets/image/Plus.png">
        <span class="add--text">Добавить отзыв</span>
      </div>
      <div v-if="auth.isAuthenticated.value">
        <div v-on:click="userMenu" class="pointer">
          <span class="person--icon">
            <img src="../../assets/image/Union.png">
          </span>
          <span class="person--nickname">{{this.user.name}}</span>
        </div>
      </div>
      <div class="person pointer" v-else>
        <div class="button">
          <RouterLink to="/auth">Войти</RouterLink>
        </div>
      </div>
      <div class="person-popup no-display" id="person-popup">
        <img class="arrow" src="../../assets/image/arrow-wrapper.svg">
        <div class="person-popup--items">
          <div class="item pointer">
            <RouterLink to="/profile">
              <img src="../../assets/image/mdi_account-outline.svg">
              Мой профиль
            </RouterLink>
          </div>
          <div class="item pointer">
            <RouterLink to="/privacy-policy">
              <img src="../../assets/image/mdi_account-outline.svg">
              Политика конфиденциальности
            </RouterLink>
          </div>
          <div class="hr"></div>
          <div class="item pointer" v-on:click="logout()">
            <img src="../../assets/image/mdi_exit-to-app.svg">
            Выйти
          </div>
        </div>
      </div>
    </div>
  </div>
  <AddReview :user="this.user"></AddReview>
</template>
<script>
import {inject} from "vue"
import AddReview from '../reviews/addReview.vue'

export default {
  setup() {
    const auth = inject('auth', null)

    return {
      auth
    }
  },
  components: {
    AddReview
  },
  data() {
    return {
      user: {
        name: null,
        photo: null,
      },
      authService: null
    }
  },
  created() {
    this.user = this.auth.user.value
  },
  methods: {
    userMenu() {
      let menu = document.getElementById('person-popup')
      if (menu.classList.contains('no-display')) {
        menu.classList.add('display')
        menu.classList.remove('no-display')
      } else {
        menu.classList.remove('display')
        menu.classList.add('no-display')
      }
    },
    logout() {
      this.auth.logout()
      window.location.href = '/auth'
    },
    reviewOpen() {
      let reviewForm = document.getElementById('comment-form')
      reviewForm.classList.add('display')
      reviewForm.classList.remove('no-display')
    }
  }
}
</script>