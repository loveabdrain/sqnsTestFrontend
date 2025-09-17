<template>
  <div id="popup-comment" class="add-comment popup-comment no-display" @click="closeOnOutside">
    <div class="comment-form">
      <div class="popup--title">
        Отзыв
        <div class="close pointer" v-on:click="close()">
          <img src="../../assets/image/close.svg">
        </div>
      </div>
      <div class="comment--info">
        <div class="person" v-if="review.user">
          <span class="person--icon">
            <img src="../../assets/image/Union.png">
          </span>
          <span class="person--nickname">{{review.user?.name}}</span>
        </div>
        <div class="comment--title">
          {{review.title}}
        </div>
        <div class="comment--data">
          {{review.text}}
        </div>
        <div class="recommend" v-if="review.isRecommended === '1'">
          <img src="../../assets/image/mdi_thumb-up-outline.svg">
          <div>
            <div class="nickname">{{review.user?.name}}</div>
            <div class="status">рекомендует</div>
          </div>
        </div>
        <div class="recommend no-recommend" v-if="review.isRecommended === '0'">
          <img src="../../assets/image/mdi_thumb-up-outline-red.svg">
          <div>
            <div class="nickname">{{review.user?.name}}</div>
            <div class="status">нерекомендует</div>
          </div>
        </div>
      </div>
      <div class="comment--footer buttons">
        <div class="button" v-on:click="close()">Назад</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    review: {
    },
    user: {}
  },
  methods: {
    close() {
      this.$emit('show-modal', {});
      let popup = document.getElementById('popup-comment')
      popup.classList.add('no-display')
      popup.classList.remove('display')
    },
    closeOnOutside(event) {
      if (event.target.id === 'popup-comment') {
        this.close();
      }
    },
  }
}
</script>