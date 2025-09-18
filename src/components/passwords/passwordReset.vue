<template>
  <div class="content">
    <div class="popup">
      <div class="popup--info">
        <h2>Восстановление пароля</h2>
      </div>
      <div id="auth-data" class="popup--fields">
        <div class="field">
          <label class="field--label">Новый пароль</label>
          <div class="field--data with-image">
            <input id="password" type="password" v-model="form.password">
            <span id="passwordEye" class="private" v-on:click="showPassword('password')"></span>
            <span v-if="errors.password" class="text-danger error" v-text="errors.password" />
          </div>
        </div>
        <div class="field">
          <label class="field--label">Подтверждение пароля</label>
          <div class="field--data with-image">
            <input id="passwordConfirm" type="password" v-model="form.password_confirmation">
            <span id="passwordConfirmEye" class="private" v-on:click="showPassword('passwordConfirm')"></span>
            <span v-if="errors.password" class="text-danger error" v-text="errors.password" />
          </div>
        </div>
        <span v-if="errors.message" class="text-danger error" v-text="errors.message" />
        <div class="field buttons">
          <RouterLink to="/auth">
            <div class="button">
              Назад
            </div>
          </RouterLink>
          <div class="button primary" v-on:click="reset">
            Далее
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/utils/axios.js";

export default {
  data() {
    return {
      form: {
        password: null,
        password_confirmation: null,
      },
      errors: {
        password: null,
        message: null,
      },
      token: null
    }
  },
  mounted() {
    this.token = this.$route.params.token;
  },
  methods: {
    reset() {
      axios.post('/api/reset-password/', {
        password: this.form.password,
        password_confirmation: this.form.password_confirmation,
        token: this.token
      }).then(() => {
        window.location.href = '/auth'
      }).catch((error) => {
        console.log(error)
        if (error.response.data.password) {
          this.errors.password = error.response.data.password[0]
        } else {
          this.errors.password = null
        }
        if (error.response.data.message) {
          this.errors.message = error.response.data.message
        } else {
          this.errors.message = null
        }
      })
    },
    showPassword(element) {
      let show = document.getElementById(element)
      let eye = document.getElementById(element+'Eye')
      if (eye.classList.contains('private-off')) {
        show.type = 'password'
        eye.classList.remove('private-off')
      } else {
        show.type = 'text'
        eye.classList.add('private-off')
      }
    },
  }
}
</script>