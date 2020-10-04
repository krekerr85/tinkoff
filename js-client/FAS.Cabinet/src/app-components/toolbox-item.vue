<template>
  <div @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" class="wrapper">
    <router-link :to="url" class="toolbox-item route" :class="{'toolbox-item_selected' : selected}">
      <div class="toolbox-item__icon" :class="{ 'toolbox-item__icon_selected': selected || hovered }">
        <span :class="icon"></span>
      </div>
      <div class="toolbox-item__label" :class="{ 'toolbox-item__label_selected': selected || hovered }">{{label}}</div>
    </router-link>
  </div>
</template>

<script>
  export default {
    props: ['url', 'icon', 'label', 'selected'],
    data() {
      return {
        hovered: false,
      }
    },
    methods: {
      handleMouseEnter() {
        this.hovered = true;
      },
      handleMouseLeave() {
        this.hovered = false;
      }
    },
  }
</script>
<style>
  .wrapper {
    width: 100%;
    height: 100%;
  }

  .toolbox-item {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &_selected {
      background-color: var(--theme_secondary-background-color);
    }

    &__icon {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 40px;
      width: 40px;
      font-size: var(--icon-size-big);
      border-radius: 40px;
      border: 3px solid var(--theme_secondary-color);
      background-color: var(--theme_secondary-background-color);
      color: var(--theme_secondary-color);
    }

    &__icon_selected {
      border-color: var(--theme_accent-color);
      color: var(--theme_accent-color);
    }

    &__label {
      font-size: var(--font-size_normal);
      color: var(--theme_text-color);
    }

    &__label_selected {
      color: var(--theme_text-color_selected);
    }
  }
</style>
