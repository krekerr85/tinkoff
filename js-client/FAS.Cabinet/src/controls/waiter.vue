<template>
  <div class="waiter">
    Загрузка...
  </div>

</template>

<script>
  export default {}
</script>

<style>
  .waiter {
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background-color: var(--theme_content-background-color);
  }
</style>
