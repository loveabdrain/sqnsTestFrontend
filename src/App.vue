<template>
  <Header></Header>
  <RouterView></RouterView>
  <Footer></Footer>
</template>
<script>
import Header from "./components/fnh/header.vue";
import Footer from "./components/fnh/footer.vue";

export default {
  components: {
    Footer,
    Header
  },
}
</script>