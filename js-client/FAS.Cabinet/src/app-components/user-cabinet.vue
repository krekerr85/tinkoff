<template>
  <div class="user-cabinet" v-if="!busy">
    <review v-bind:modalOpened="modalOpened"  @isOpen="closeModal" />
    <cabinet-header @isOpen="openModal" class="user-cabinet__header"/>
    <div class="user-cabinet__toolbox">
      <toolbox-item class="user-cabinet__toolbox-item"
                    v-for="(item, index) in toolboxItems"
                    :url="item.url"
                    :icon="item.icon"
                    :label="item.label"
                    :selected="item.selected"
                    :class="{'user-cabinet__toolbox-item_last': toolboxItems.length === index+1}"
                    :key="index"/>
    </div>
    <div class="user-cabinet__content">
      <div class="user-cabinet__work-area">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
  import toolboxItemComponent from './toolbox-item';
  import cabinetHeader from './cabinet-header';
  import {toolboxItems, cabinetRoutes} from './app/cabinet-routes';
  import review from './review';

  export default {
    template: './user-cabinet.html',
    mounted() {
      this.selectToolboxItemByRouteName((this.$route || {}).name);
      this.$router.afterEach(to => this.selectToolboxItemByRouteName((to || {}).name));
      this.loadCurrentUser();
    },
    data() {
      return {
        toolboxItems,
        busy: true,
        modalOpened: false,
      }
    },
    components: {toolboxItem: toolboxItemComponent, cabinetHeader, review},
    methods: {
      openModal() {
      this.modalOpened = true;
      },
      closeModal() {
      this.modalOpened = false;
      },
      selectToolboxItemByRouteName(routeName) {
        //если мы знаем такой маршрут, выделяем элемент, если не знаем, то не трогаем выделение
        const wellKnownRoute = cabinetRoutes.find(r => r.name == routeName);
        if (!wellKnownRoute) return;

        if (routeName === 'default')
          this.toolboxItems = this.toolboxItems.map((t, i) => ({...t, selected: i === 0}));
        else
          this.toolboxItems = this.toolboxItems.map(t => ({...t, selected: t.name === routeName}));
      },
      async loadCurrentUser() {
        if (this.$store.state.currentUser == null) {
          this.busy = true;
          const currentUser = await this.$store.dispatch('loadCurrentUser');
          this.busy = false;          
          if(currentUser.needNewPassword){
            const fields = [{caption: 'Новый пароль', value: '', type: 'password', required: true}, {caption: 'Повтор пароля', value: '', type: 'password'}]
            this.$store.commit('showModal', {header: 'Введите новый пароль', fields: fields, onAccepted: this.handlePasswordChangedAccepted, onValidate: this.validatePasswordChange});
          }
        }
      },
      async handlePasswordChangedAccepted({fields}){
        const model = {newPassword: fields[0].value}
        await this.$store.dispatch('fetchServer', ['changePassword', model]);
      },
      validatePasswordChange({fields}){
        if(fields[0].value!==fields[1].value){
          fields[1].isValid = false;
          fields[1].validationError = 'Введенные пароли должны совпадать';

          return false;
        }
        return true;
      }
    }
  }
</script>

<style>
  .user-cabinet {
    width: 100%;
    height: 100%;
    min-width: var(--work-area-width);
    position: absolute;

    &__header {
      height: 50px;
      position: fixed;
      left: 0;
      right: 0;
      z-index: 10;
    }

    &__work-area {
      width: var(--work-area-width);
      margin: 0 auto;
      min-height:100%;
      position: relative;
    }

    &__toolbox {
      border-bottom: 1px solid var(--theme_border-color);
      width: var(--work-area-width);
      margin: 0 auto;
      display: flex;
      flex-direction: row;
      align-items: stretch;
      justify-content: stretch;
      height: 80px;
      background-color: var(--theme_main-background);
      position: fixed;
      top: 50px;
      left: 0;
      right: 0;
      z-index: 9;
    }

    &__toolbox-item {
      border-right: var(--theme_border-style);
      flex-grow: 1;
    }

    &__toolbox-item_last {
      border-right: var(--theme_transparent-border-style);
    }

    &__content {
      margin-top: 135px;
      min-height: calc(100% - 135px);
      display: flex;
    }
  }
</style>
