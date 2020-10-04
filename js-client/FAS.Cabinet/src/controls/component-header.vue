<template>
  <div class="component-header">
    <h1 class="display-4 component-header__label">{{header}}</h1>
    <p class="lead component-header__desc">{{description}}</p>
    <p class="lead component-header__desc component-header__alert">{{alertText}}</p>
    <hr class="my-4 component-header__delimeter">
  </div>

</template>

<script>
  export default {
    props: ['header', 'description', 'alertText']
  }
</script>

<style>
  .component-header {
    &__label{
      font-size: 2.5rem;
      display: inline-block;
    }
    &__desc {
      font-size: 1rem;
      display: inline-block;
      margin-left: 10px;
    }
    &__delimeter {
      margin-bottom: 1rem !important;
      margin-top: 0.2rem !important;
    }
    &__alert {
      color: var(--theme_alert-header-color);
    }
  }
</style>
