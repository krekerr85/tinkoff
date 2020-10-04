<template>
  <div>
    activavtion
  </div>

</template>

<script>
  export default {
    mounted() {
      this.loadModel();
    },
    computed: {
      userId: function () {
        return this.$route.params.userId;
      },
    },
    methods: {
      async loadModel() {
        const response = await this.$store.dispatch('fetchServer', ['activation', this.userId]);
        await this.$store.commit('login');
        this.$router.push('/cabinet');
      },
    }

  }
</script>

<style>

</style>
