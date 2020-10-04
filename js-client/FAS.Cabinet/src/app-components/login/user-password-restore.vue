<template>
  <div>
    password restore
  </div>

</template>

<script>
  export default {
    mounted() {
      this.loadModel();
    },
    computed: {
      restoreCode: function () {
        return this.$route.params.restoreCode;
      },
    },
    methods: {
      async loadModel() {
        await this.$store.dispatch('fetchServer', ['passwordRestore', this.restoreCode]);        
        await this.$store.commit('login');
        this.$router.push('/cabinet');
      },
    }

  }
</script>

<style>

</style>
