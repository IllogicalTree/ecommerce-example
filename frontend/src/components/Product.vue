<template>
  <div class="product">
    <h1>{{product.title}}</h1>
    <h2>{{product.price}}</h2>
    <h3>{{product.description}}</h3>
  </div>
</template>

<script>
export default {
  props: ['product'],
};
</script>
