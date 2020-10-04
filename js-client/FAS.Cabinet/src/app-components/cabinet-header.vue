<template>
  <div class="cabinet-header">
    <div class="cabinet-header__work-area">
      <div class="cabinet-header__logo-area">
        <img class="cabinet-header__logo" src='/cabinet/images/logo.png'/>
      </div>
      <div class="cabinet-header__user-info">
        <span class="cabinet-header__user-welcome" :class="{ 'cabinet-header__user-welcome_empty': userName == null }">
          Добро пожаловать, {{userName}}
        </span>
        <router-link class="route cabinet-header__button" :to="purchaseHistoryUrl">История покупок</router-link>
        <a class="route cabinet-header__button" @click="openModal">Отзывы</a>
        <router-link class="route cabinet-header__button" :to="profileUrl">Профиль</router-link>
        <span class="cabinet-header__button cabinet-header__button_last" @click="logout">Выход</span>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from "vuex";
  require('../assets/logo.png')

  export default {
    data() {
      return {
        profileUrl: '/cabinet/profile',
        purchaseHistoryUrl: '/cabinet/history',
      }
    },
    computed: mapState({
      userName: state => {
        const {currentUser} = state;
        if (currentUser == null)
          return null;

        if (currentUser.firstname && currentUser.surname)
          return `${currentUser.firstname} ${currentUser.surname}`;

        if (currentUser.firstname)
          return currentUser.firstname;

        if (currentUser.surname)
          return currentUser.surname;

        return currentUser.login;
      }
    }),
    methods: {
      async logout() {
        await this.$store.dispatch('logOut');
      },
    openModal() {
      this.$emit("isOpen", true);
      }
    },
  }

</script>

<style>
  .cabinet-header {
    background-color: var(--theme_header-background);
    color: var(--theme_header-text-color);

    &__text{
    }

    &__work-area {
      position: relative;
      margin: 0 auto;
      height: 100%;
      width: var(--work-area-width);
    }

    &__logo{
      height: 50px;
    }

    &__user-info {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: right;

    }

    &__user-welcome {
      margin-right: 10px;

      &_empty {
        display: none;
      }
    }

    &__button {
      cursor: pointer;
      margin-right: 5px;
      padding: 5px;
      color: var(--theme_header-text-color);

      &_last {
        margin-right: 0;
      }

      &:hover{
        color: inherit !important;
        background-color: var(--theme_header-background-hover);
      }
    }
  }
  
</style>