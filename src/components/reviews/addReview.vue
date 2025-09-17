<template>
  <div class="add-comment popup-comment no-display" id="comment-form" @click="closeOnOutside">
  <div class="comment-form">
    <div class="popup--title">
      Новый отзыв
      <div class="close pointer" v-on:click="close()">
        <img src="../../assets/image/close.svg">
      </div>
    </div>
    <div class="comment--info">
      <div class="field">
        <lable class="field--label">Заголовок отзыва одной фразой</lable>
        <div class="field--data">
          <input type="text" v-model="form.title"/>
        </div>
      </div>
      <div class="field">
        <label class="field--label">Ваш отзыв</label>
        <textarea class="field--data" rows="20" v-model="form.text"></textarea>
      </div>
      <div class="field--radio" v-if="this.user">
        <label class="field--label">Вы бы порекомендовали это?</label>
        <div class="field--data">
          <input type="radio" name="recommend" />
          <label>Да</label>
        </div>
        <div class="field--data">
          <input type="radio" name="recommend" />
          <label>Нет</label>
        </div>
      </div>
      <div class="field" v-if="this.user === null">
        Для того, чтобы оставить рекомендацию к отзыву, <RouterLink to="/auth" v-on:click="close">войдите или зарегистрируйтесь</RouterLink>
      </div>
    </div>
    <div class="comment--footer buttons">
      <div class="button primary" v-on:click="save()">Отправить отзыв</div>
      <div class="button" v-on:click="close()">Назад</div>
    </div>
  </div>
  </div>
</template>
<script>

import axios from "@/utils/axios.js";

export default {
  props: {
    user: {}
  },
  data() {
    return {
      form: {
        title: null,
        text: null,
        isRecommended: null,
      }
    }
  },
  mounted() {
    this.user = this.auth.user.value
  },
  methods: {
    save() {
      axios.post('/api/reviews/', this.form).then(() => {
        this.close();
      })
    },
    close() {
      let reviewForm = document.getElementById('comment-form')
      reviewForm.classList.remove('display')
      reviewForm.classList.add('no-display')
    },
    closeOnOutside(event) {
      if (event.target.id === 'comment-form') {
        this.close();
      }
    },
  }
}
</script>