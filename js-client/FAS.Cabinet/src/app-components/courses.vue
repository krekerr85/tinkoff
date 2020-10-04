<template>
  <div class="courses">
    <waiter v-if="busy"/>
    <div v-else>
      <component-header :header="'Курсы'"
                        :description="'Здесь вы можете купить курс.'"/>
      <div class="courses__list">
        <course-card class="courses__list-item"
                     v-for="item in courses"
                     :key="item.name"
                     :image="item.image"
                     :hover-image="item.animation"
                     :header="item.caption"
                     :href="item.url"
                     :description="item.shortDescription"/>
      </div>      
    </div>
  </div>
</template>

<script>
  import {mapState} from "vuex";
  import waiter from '../controls/waiter';
  import courseCard from './course-card';
  import componentHeader from '../controls/component-header';

  export default {
    mounted() {
      this.tryLoadCourses();
    },
    data: () => ({
      busy: false
    }),
    components: {waiter, courseCard, componentHeader},
    computed: mapState({
      courses: state => state.courses ? state.courses.map(c => ({
        ...c,
        url: `/cabinet/course/${c.name}`,
        image: '/api' + c.image,
        animation: c.animation ? '/api' + c.animation:'/api' + c.image
      })) : [],
    }),
    methods: {
      async tryLoadCourses() {
        if (this.$store.state.courses == null) {
          this.busy = true;
          await this.$store.dispatch('loadCourses');
          this.busy = false;
        }
      },
    }
  }
</script>
<style>
  .courses {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: var(--theme_content-background-color);

    &__header {

    }

    &__list {
      display: flex;
      flex-wrap: wrap;
      justify-content: start;
      margin-left: -6px;

      &:after {
        content: '';
        flex-grow: 2;
      }
    }

    &__list-item {
      flex: 1 0 initial;
      margin-left: 6px;
      margin-bottom: 10px;
    }
  }
</style>
