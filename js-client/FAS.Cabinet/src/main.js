import Vue from 'vue'
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import Vuelidate from 'vuelidate'
import 'bootstrap';

import fas from './app-components/app/fas-app.vue'
import fasStore from './app-components/app/fas-store';
import cabinetRoutes from './app-components/app/cabinet-routes';

import './styles/app.css';
import './styles/icons.css'

Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(Vuelidate);

const router = new VueRouter({
  mode: 'history',
  routes: cabinetRoutes, // пока пути есть только у кабинета
});

const store = new Vuex.Store({...fasStore});

const app = new Vue({
  el: '#fas-root',
  store,
  router,
  render: h => h(fas)
});
