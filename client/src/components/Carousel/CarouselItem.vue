<template>
  <div class="carousel-item" :style="{left:(index-1)*100+'%'}">
    <slot></slot>
  </div>
</template>

<style scoped>
  .carousel-item {
    width: 100%;
    height: 100%;
    position: absolute;
  }
</style>

<script>
  export default {
    props: {
      index: {required: true, type: Number}
    }
  }
</script>