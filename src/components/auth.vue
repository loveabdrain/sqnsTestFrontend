<template>
  <div class="content">
    <div class="popup">
      <div class="popup--tabs" id="popup-tabs">
        <div id="auth" class="tab pointer active" v-on:click="switchAuth('auth')">Вход</div>
        <div id="registration" class="tab pointer" v-on:click="switchAuth('register')">Регистрация</div>
      </div>
      <div id="auth-data" class="popup--fields">
        <div class="field">
          <label class="field--label">E-mail</label>
          <div class="field--data">
            <input id="email" type="email" v-model="formAuth.email">
          </div>
        </div>
        <div class="field">
          <label class="field--label">Пароль</label>
          <div class="field--data with-image">
            <input id="password" type="password" v-model="formAuth.password">
            <span id="passwordEye" class="private" v-on:click="showPassword('password')"></span>
          </div>
        </div>
        <span v-if="error" class="text-danger error" v-text="error" />
        <div class="field text-right">
          <RouterLink to="/password-recovery">Забыли пароль?</RouterLink>
        </div>
        <div class="field">
          <div class="button primary" v-on:click="login()">
            Войти
          </div>
        </div>
      </div>
      <div id="registration-data" class="popup--fields no-display">
        <div class="field">
          <label class="field--label">Логин / Имя пользователя</label>
          <div class="field--data">
            <input type="text" v-model="form.name">
            <span v-if="errors.name" class="text-danger error" v-text="errors.name" />
          </div>
        </div>
        <div class="field">
          <label class="field--label">E-mail</label>
          <div class="field--data">
            <input type="text" aria-describedby="emailHelp" v-model="form.email">
            <span v-if="errors.email" class="text-danger error" v-text="errors.email" />
          </div>
        </div>
        <div class="field">
          <label class="field--label">Пароль</label>
          <div class="field--data with-image">
            <input id="passwordRegister" type="password" v-model="form.password">
            <span id="passwordRegisterEye" class="private" v-on:click="showPassword('passwordRegister')"></span>
            <span v-if="errors.password" class="text-danger error" v-text="errors.password" />
          </div>
        </div>
        <div class="field">
          <label class="field--label">Повторите пароль</label>
          <div class="field--data with-image">
            <input id="passwordConfirm" type="password" v-model="form.password_confirmation">
            <span id="passwordConfirmEye" class="private" v-on:click="showPassword('passwordConfirm')"></span>
            <span v-if="errors.password" class="text-danger error" v-text="errors.password" />
          </div>
        </div>
        <div class="field">
          <input type="checkbox" v-model="form.privacyPolicy"/>
          <span>Я даю согласие на <RouterLink to="/privacy-policy">обработку моих персональных данных</RouterLink></span>
          <p v-if="errors.privacyPolicy" class="text-danger error" v-text="errors.privacyPolicy" />
        </div>
        <div class="field">
          <div class="button primary" v-on:click="register()">
            Зарегистрироваться
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "../utils/axios.js";
import {inject} from "vue";

export default {
  setup() {
    const auth = inject('auth', null);

    return {
      auth
    }
  },
  data() {
    return {
      formAuth: {
        email: null,
        password: null,
      },
      form: {
        name: null,
        email: null,
        password: null,
        password_confirmation: null,
        privacyPolicy: false,
      },
      errors: {
        name: null,
        email: null,
        password: null,
        password_confirmation: null,
        privacyPolicy: false,
      },
      error: null
    }
  },
  methods: {
    register() {
      this.errors.privacyPolicy = null
      if (!this.form.privacyPolicy) {
        this.errors.privacyPolicy = 'Необходимо подтверждение'
      }
      axios.post('/api/register/', this.form).then(() => {
        window.location.href = '/auth';
      }).catch((error) => {
        if (error.response.data.name) {
          this.errors.name = error.response.data.name[0]
        } else {
          this.errors.name = null
        }
        if (error.response.data.email) {
          this.errors.email = error.response.data.email[0]
        } else {
          this.errors.email = null
        }
        if (error.response.data.password) {
          this.errors.password = error.response.data.password[0]
        } else {
          this.errors.password = null
        }
      });
    },
    async login() {
      let response = await this.auth.login(this.formAuth)
      if (response.status === 422) {
        this.error = 'Неверный логин или пароль'
      } else {
        window.location.href = '/'
      }
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
    switchAuth(type) {
      let register = document.getElementById('registration')
      let registerModal = document.getElementById('registration-data')
      let auth = document.getElementById('auth')
      let authModal = document.getElementById('auth-data')
      if (type === 'auth') {
        register.classList.remove('active')
        registerModal.classList.add('no-display')
        auth.classList.add('active')
        authModal.classList.remove('no-display')
      } else {
        register.classList.add('active')
        registerModal.classList.remove('no-display')
        auth.classList.remove('active')
        authModal.classList.add('no-display')
      }
    },
  },

}
</script>