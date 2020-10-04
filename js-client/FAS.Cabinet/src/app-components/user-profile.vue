<template>
  <form class="user-profile" @submit="handleSubmit" id="user-profile">
    <componentHeader :header="'Профиль пользователя'"
                     :description="'Тут вы можете заполнить информацию о себе, она пригодится при составлении сертификата о прохождении какого-либо курса на нашем сайте.'"/>
    <div class="form-group">
      <label for="firstname">Имя</label>
      <input v-model="user.firstname" type="text" class="form-control" id="firstname" name="firstname"
             placeholder="Введите ваше имя" tabindex="10">
    </div>
    <div class="form-group">
      <label for="surname">Фамилия</label>
      <input v-model="user.surname" type="text" class="form-control" id="surname" name="surname"
             placeholder="Введите вашу фамилию" tabindex="11">
    </div>
    <div class="form-group">
      <label for="patronymic">Отчество</label>
      <input v-model="user.patronymic" type="text" class="form-control" id="patronymic" name="patronymic"
             placeholder="Введите ваше отчество" tabindex="12">
    </div>
    <div class="form-check">
      <input v-model="user.isMailUnsubscribed" type="checkbox" class="form-check-input" id="isMailUnsubscribed" name="isMailUnsubscribed"
             tabindex="13">
      <label for="isMailUnsubscribed">Отписаться от рассылок</label>
    </div>

    <button type="submit" class="btn btn-primary user-profile__submit" tabindex="13">Сохранить</button>
  </form>
  
</template>

<script>
  import {mapState} from "vuex";
  import {getDataFromForm} from "../utils/form-utils";
  import componentHeader from "../controls/component-header";

  export default {
    components: {componentHeader},
    computed: mapState({
      user: state => ({...state.currentUser})
    }),
    methods: {
      handleSubmit(event) {
        if (event.preventDefault)
          event.preventDefault();
        this.sendFormToServer();
        return false;
      },
      async sendFormToServer() {
        const form = document.getElementById('user-profile');
        const newUser = await this.$store.dispatch('fetchServer', ['setUserInfo', getDataFromForm(form)]);
        if (newUser != null)
          this.$store.commit('setCurrentUser', newUser);
        window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/');
      },
    }
  }
</script>

<style>
  .user-profile {
    width: 50%;
    margin: 0 auto;
    margin-bottom: 20px;

    &__submit {
      float: right;
    }
  }
</style>
