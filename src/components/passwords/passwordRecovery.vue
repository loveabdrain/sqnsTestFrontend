<template>
  <div class="content">
    <div class="popup">
      <div class="popup--info">
        <h2>Восстановление пароля</h2>
        <div>Введите свою почту и мы отправим Вам ссылку на восстановление пароля</div>
      </div>
      <div id="auth-data" class="popup--fields">
        <div class="field">
          <label class="field--label">E-mail</label>
          <div class="field--data">
            <input type="text" v-model="form.email">
            <span v-if="errors.email" class="text-danger error" v-text="errors.email" />
          </div>
        </div>
        <div class="field buttons">
          <RouterLink to="/auth">
            <div class="button">
              Назад
            </div>
          </RouterLink>
          <div class="button primary" v-on:click="recover">
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
        email: null
      },
      errors: {
        email: null,
      }
    }
  },
  methods: {
    recover() {
      axios.post('/api/forgot-password/', {
        email: this.form.email
      }).then(() => {
        window.location.href = '/'
      }).catch((error) => {
        if (error.response.data.email) {
          this.errors.email = error.response.data.email[0]
        } else {
          this.errors.email = null
        }
      })
    }
  }
}
</script>