<template>
  <div class="comment">
    <div class="person" v-if="review.user">
      <span class="person--icon">
        <img src="../../assets/image/Union.png">
      </span>
      <span class="person--nickname">{{review.user?.name}}</span>
    </div>
    <div class="date">
      {{review.date}}
    </div>
    <div class="comment--title">
      {{review.title}}
    </div>
    <div class="comment--data text-limiter">
      {{review.text}}
    </div>
    <div class="buttons">
      <div class="button with-image" onclick="updateComment()" v-if="review.user !== null && user !== null && review.user.id === user.id">
        <img src="../../assets/image/Review.svg" />
        Редактировать отзыв
      </div>
      <div class="button" v-on:click="show(review)">Читать весь отзыв</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    review: {
      id: null
    },
    user: {}
  },
  methods: {
    show(review) {
      this.$emit('show-modal', review);
      let popup = document.getElementById('popup-comment')
      popup.classList.remove('no-display')
      popup.classList.add('display')
    }
  }
}
</script>