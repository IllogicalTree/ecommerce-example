<template>
  <div>
    <div class='products' v-for='product of products' :key='product.id'>
      <Product :product='product'></Product>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Product from '@/components/Product.vue';

export default {
  name: 'Home',
  components: {
    Product,
  },
  computed: mapState(['products']),
  mounted() {
    this.$store.dispatch('getProducts');
    console.log('hello');
  },
};
</script>
