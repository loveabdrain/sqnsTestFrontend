<template>
  <div class="content">
    <h2>Мой профиль</h2>

    <div class="profile">
      <div class="my-profile">
        <div>
          <img class="photo" :src="this.user.photo" alt="avatar" v-if="this.user.photo">
          <img class="photo" v-else>
        </div>
        <div class="info">
          <div class="info--nickname">{{this.user.oldName}}</div>
          <div>ID: {{this.user.id}}</div>
          <div class="info--update-photo pointer" @click="triggerFileInput">Заменить фото</div>
          <input
              type="file"
              id="photo-upload"
              style="display: none;"
              accept="image/*"
              ref="fileInput"
              @change="handleFileSelect"
          >
        </div>
      </div>
      <div class="update-data">
        <div class="fields">
          <div class="field">
            <label class="field--label">Логин / Имя пользователя</label>
            <div class="field--data">
              <input type="text" v-model="user.name">
              <span v-if="errors.name" class="text-danger error" v-text="errors.name" />
            </div>
          </div>
          <div class="field">
            <label class="field--label">Пароль</label>
            <div class="field--data with-image">
              <input type="password" v-model="user.password">
              <span class="private" onclick="showPassword(this)"></span>
              <span v-if="errors.password" class="text-danger error" v-text="errors.password" />
            </div>
          </div>
        </div>
        <div class="fields">
          <div class="field">
            <label class="field--label">E-mail</label>
            <div class="field--data">
              <input type="text" v-model="user.email">
              <span v-if="errors.email" class="text-danger error" v-text="errors.email" />
            </div>
          </div>
        </div>
      </div>
      <div class="buttons">
        <div class="button primary" v-on:click="save()">Сохранить</div>
        <div class="button" v-on:click="changePassword()">Сменить пароль</div>
      </div>
      <div id="changePassword" class="update-data no-display">
        <div class="fields">
          <div class="field">
            <label class="field--label">Новый пароль</label>
            <div class="field--data with-image">
              <input id="newPassword" type="password" v-model="user.newPassword">
              <span id="newPasswordEye" class="private" v-on:click="showPassword('newPassword')"></span>
              <span v-if="errors.newPassword" class="text-danger error" v-text="errors.newPassword" />
            </div>
          </div>
        </div>
        <div class="fields">
          <div class="field">
            <label class="field--label">Подтверждение пароля</label>
            <div class="field--data with-image">
              <input id="newPasswordConfirm" type="password" v-model="user.newPasswordConfirmation">
              <span id="newPasswordConfirmEye" class="private" v-on:click="showPassword('newPasswordConfirm')"></span>
              <span v-if="errors.newPassword" class="text-danger error" v-text="errors.newPassword" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <h2>Мои отзывы</h2>

    <div v-for="review in reviews">
      <ReviewItem :review="review" :user="user"></ReviewItem>
    </div>
  </div>
</template>
<script>
import ReviewItem from "@/components/reviews/reviewItem.vue"
import {inject} from "vue"
import axios from "@/utils/axios.js";

export default {
  setup() {
    const auth = inject('auth', null)

    return {
      auth
    }
  },
  components: {
    ReviewItem
  },
  data() {
    return {
      reviews: [],
      user: {
        name: null,
        oldName: null,
        photo: null,
        id: null,
        email: null,
        password: null,
        newPassword: null,
        newPasswordConfirmation: null,
      },
      errors: {
        password: null,
        email: null,
        name: null,
        newPassword: null,
      }
    }
  },
  mounted() {
    this.loadUser().then(()=> {
    axios.get('/api/reviews', {
      params: {
        user_id: this.user.id
      }
    }).then(({data}) => {
      this.reviews = data.data
    })
    })
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    async handleFileSelect(event) {
      const file = event.target.files[0];
      if (!file) return;

      await this.uploadPhoto(file);

      event.target.value = '';
    },
    async uploadPhoto(file) {
      const formData = new FormData();
      formData.append('file', file);
      axios.post('/api/users/upload', formData).then(() => {
        this.loadUser()
      })
    },
    async loadUser() {
      await axios.get('/api/users/'+this.auth.user.value.id).then(({data}) => {
        this.user = data
        this.user.oldName = this.user.name
      })
    },
    save() {
      this.errors.password = null
      axios.post('/api/users/', {
        name: this.user.name,
        email: this.user.email,
        oldPassword: this.user.password,
        password: this.user.newPassword,
        password_confirmation: this.user.newPasswordConfirmation,
      }).then(() => {
        this.loadUser()
      }).catch((error) => {
        if (error.response.data.oldPassword) {
          this.errors.password = error.response.data.oldPassword[0]
        }
        if (error.response.data.password) {
          this.errors.newPassword = error.response.data.password[0]
        }
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
    changePassword() {
      let change = document.getElementById('changePassword')
      if (change.classList.contains('no-display')) {
        change.classList.remove('no-display')
        change.classList.add('display')
      } else {
        change.classList.remove('display')
        change.classList.add('no-display')
        this.user.newPassword = null
        this.user.newPasswordConfirmation = null
      }
    }
  }
}

</script>