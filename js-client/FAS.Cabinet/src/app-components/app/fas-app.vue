<template>
  <div class="fas-app">
    <user-activation v-if="isLoggedIn === undefined && activation"/>
    <user-password-restore v-else-if="isLoggedIn === undefined && passwordRestore"/>
    <user-cabinet v-else-if="isLoggedIn !== false"></user-cabinet>
    <redirect-to-root v-else/>
    <modal/>
  </div>
</template>

<script>
  import redirectToRoot from '../login/redirect-to-root';
  import userCabinet from '../user-cabinet';
  import userActivation from '../login/user-activation';
  import userPasswordRestore from '../login/user-password-restore';
  import modal from '../modal';

  import {mapState} from "vuex";

  export default {
    name: 'app',
    beforeMount() {
      const {$router} = this;
      if(this.$route.name === 'user-activation'){
        this.activation = true;
      }
      else if(this.$route.name === 'user-password-restore'){
        this.passwordRestore = true;
      }

      this.$store.watch(
        (state, getters) => getters.globalError,
        (newValue) => {
          if (newValue === 'notFound') {
            $router.replace('/cabinet/notfound');
            this.$store.commit('clearGlobalError');
          }
        },
      );
    },
    data() {
      return {
        activation: false,
        passwordRestore: false,
        busy: false,
      }
    },
    components: {
      redirectToRoot,
      userCabinet,
      userActivation,
      userPasswordRestore,
      modal
    },
    computed: mapState({
      isLoggedIn: state => {
        const res = state.isLoggedIn;
        return res;
      },
    }),
  }

</script>

<style>
  html, body {
    width: 100%;
    height: 100%;
  }

  .fas-app {
    width: 100%;
    height: 100%;
    position: relative;
  }
</style>
