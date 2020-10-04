<template>
  <div class='card course-card' v-on:click.capture='handleClick'>
    <router-link class="route course-card__link"
                :class="{'text-primary': isHovering}"
                :to="href">
      <img class="course-card__image card-img-top"
          @mouseenter="handleCardMouseEnter"
          @mouseleave="handleCardMouseLeave"
          :src="isHovering ?  hoverImage : image"
          alt="Card image cap"/>
      <div class="card-body"
          @mouseenter="handleCardMouseEnter"
          @mouseleave="handleCardMouseLeave">
        <h5 class="card-title">{{header}}</h5>
        <p class="card-text course-card__text">{{description}}</p>
      </div>      
    </router-link>
  </div>
</template>

<script>
  export default {
    props: ['image', 'hoverImage', 'header', 'description', 'href', ''],
    data: () => ({
      isHovering: false,
    }),
    methods: {
      handleCardMouseEnter() {
        this.isHovering = !this.isHovering;
      },
      handleCardMouseLeave() {
        this.isHovering = false;
      },
      handleClick(e){
        this.$emit('click', e);
      }
    }
  }
</script>

<style>
  .course-card {
    width: 18rem;
    position: relative;

    &__link {
    color: var(--theme_text-color);
      &:hover{
        color: initial;
      }
    }

    &__text {
      max-height: 170px;
      overflow: hidden;
    }

    &__image{
      width: 286px;
      height: 181px;
    }

    .card-body{
      padding: 0.7rem;
    }
  }
</style>
