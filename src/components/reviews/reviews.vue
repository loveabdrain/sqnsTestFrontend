<template>
  <div class="content with-pagination">
    <h2>Отзывы</h2>

    <div class="filters">
      <div class="search">
        <img src="../../assets/image/Magnifier.svg" />
        <input type="text" placeholder="Найти..." v-model="keyword" @keyup.enter="load"/>
      </div>
      <div class="field">
        <div class="sort">
          Показывать:
          <span v-on:click="updateSort()" id="sort" class="up">по дате <img src="../../assets/image/arrow-wrapper-black.svg"></span>
        </div>
        <div class="all-count">
          Найден(о) {{this.pagination.total}} отзыв(а/ов)
        </div>
      </div>
    </div>

    <div v-for="review in reviews">
      <ReviewItem :review="review" :user="user" @show-modal="handleShowReview"></ReviewItem>
    </div>
    {{selectedReview.id}}
    <ReviewModal :review="selectedReview" :user="user" v-if="selectedReview" @close-modal="handleCloseReview"></ReviewModal>
  </div>

  <div class="pagination">
    <pages>
      <img
          src="../../assets/image/arrow-today.svg"
          :class="{ disabled: !pagination.prev_page_url }"
          v-on:click="goToPage(pagination.current_page - 1)"
      >

      <page
          v-for="page in displayedPages"
          :key="page"
          :class="{
          active: page === pagination.current_page,
          'no-active': page === '...',
          pointer: page !== '...'
        }"
          v-on:click="page !== '...' ? goToPage(page) : null"
      >
        {{ page }}
      </page>

      <img
          class="last"
          src="../../assets/image/arrow-today.svg"
          :class="{ disabled: !pagination.next_page_url }"
          v-on:click="goToPage(pagination.current_page + 1)"
      >
    </pages>
    <counts>
      Показывать по:
      <count v-on:click="changeLimit(10)" id="limit10">10</count>
      <count v-on:click="changeLimit(20)" id="limit20" class="active">20</count>
      <count v-on:click="changeLimit(50)" id="limit50">50</count>
    </counts>
  </div>
</template>
<script>
import ReviewItem from "./reviewItem.vue";
import {inject} from "vue"
import axios from "@/utils/axios.js";
import ReviewModal from "./reviewModal.vue";

export default {
  setup() {
    const auth = inject('auth', null)

    return {
      auth
    }
  },
  components: {
    ReviewModal,
    ReviewItem
  },
  data() {
    return {
      reviews: [],
      user: {},
      selectedReview: {},
      page: 1,
      limit: 20,
      pagination: {},
      sort: {
        by: 'created_at',
        type: 'asc'
      },
      keyword: null
    }
  },
  mounted() {
     this.user = this.auth.user.value
     this.load()
  },
  computed: {
     displayedPages() {
       const current = this.pagination.current_page;
       const last = this.pagination.last_page;
       const delta = 2;
       const range = [];

       for (let i = 1; i <= last; i++) {
          if (i === 1 || i === last || (i >= current - delta && i <= current + delta)) {
            range.push(i);
          } else if (
            range[range.length - 1] !== '...'
          ) {
            range.push('...');
          }
       }

       return range;
    }
  },
  methods: {
     handleShowReview(review) {
        this.selectedReview = review;
     },
    load() {
       axios.get('/api/reviews', {
         params: {
           limit: this.limit,
           page: this.page,
           sortBy: this.sort.by,
           sortType: this.sort.type,
           keyword: this.keyword
         }
       }).then(({data}) => {
         this.pagination = data
         this.reviews = data.data
       })
    },
    changeLimit(limit) {
       document.getElementById('limit10').classList.remove('active')
       document.getElementById('limit20').classList.remove('active')
       document.getElementById('limit50').classList.remove('active')
       document.getElementById('limit'+limit).classList.add('active')
       this.limit = limit
       this.load()
    },
    goToPage(page) {
       if (page < 1 || page > this.pagination.last_page || page === this.pagination.current_page) {
         return;
       }
       this.page = page
       this.load()
    },
    updateSort() {
       let sorting = document.getElementById('sort')
       if (sorting.classList.contains('up')) {
         sorting.classList.remove('up')
         sorting.classList.add('down')
         this.sort.type = 'desc'
       } else {
         sorting.classList.add('up')
         sorting.classList.remove('down')
         this.sort.type = 'asc'
       }
      this.load()
    }
  }
}
</script>