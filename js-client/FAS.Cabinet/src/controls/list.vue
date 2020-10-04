<template>
  <div class="list">
    <router-link v-for="item in items" :to="item.url" class="list__item list-item route" :key="item.index">
      <div class="list-item__icon">
        <span class="icon-flag"></span>
      </div>
      <div class="list-item__label">
        {{item.name}}
      </div>
    </router-link>
  </div>
</template>

<script>

  export default {
    props: ['items']
  }
</script>

<style>
  .list{
    display: flex;
    flex-flow: row wrap;
    color: var(--theme_text-color);

    &__item{

    }
  }
  .list-item{
    width: 200px;
    height: 100px;
    cursor: pointer;
    &:hover{
      opacity: 0.5;
    }

    &__icon{
      height: 40px;
      font-size: var(--icon-size-big);
      display: flex;
      justify-content: center;
      align-items: center;
      color: var(--theme_text-color);
    }
    &__label{
      text-align: center;
      color: var(--theme_text-color);
      margin-top: 5px;
      font-size: var(--font-size_normal);
    }
  }
</style>

