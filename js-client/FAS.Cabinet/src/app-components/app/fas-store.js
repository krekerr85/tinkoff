import webApi from "../../api/dataApi";
import {SERVER_ERROR_TYPE} from "../../api/commonApi";
import {sleep} from '../../utils/async-utils';

function initState(state) {
  if (!state.hasOwnProperty('wasValidate'))
    state.wasValidate = false;

  if (state.fields)
    for (const fd of state.fields) {
      if (!fd.hasOwnProperty('isValid'))
        fd.isValid = true;
      if (!fd.hasOwnProperty('validationError'))
        fd.validationError = null;
    }
  return state;
}

export default {
  state: {
    /** Заолгинен ли пользователь  */
    isLoggedIn: undefined,
    courses: null,
    myCourses: null,
    globalError: null,
    currentUser: null,
    modalStates: [],
  },
  getters: {
    globalError: state => state.globalError,
    currentModalState: state => state.modalStates.length ? state.modalStates[state.modalStates.length - 1] : null,
  },
  mutations: {
    login: state => state.isLoggedIn = true,
    logout: state => state.isLoggedIn = false,
    setCourses: (state, courses) => state.courses = courses,
    notFound: state => state.globalError = 'notFound',
    clearGlobalError: state => state.globalError = '',
    setCurrentUser: (state, user) => state.currentUser = user,
    showModal: (state, modalState) => state.modalStates = [...state.modalStates, initState(modalState)],
    closeLastModal: (state) => state.modalStates = state.modalStates.length < 2 ? [] : state.modalStates.slice(state.modalStates.length - 2)
  },
  actions: {
    logOut: async ({commit, dispatch}) => {
      await dispatch('fetchServer', ['logout']);
      commit('logout');
      commit('setCurrentUser', null);
    },
    loadCourses: async ({commit, dispatch}) => {
      const courses = await dispatch('fetchServer', ['getCourses']);
      commit('setCourses', courses);
    },
    loadCurrentUser: async ({commit, dispatch}) => {
      let currentUser;
      let counter = 0;
      const isRedirectFromAcquring = window.location.search && window.location.search.indexOf('?transactioin');
      while(true){
        try {
          currentUser = await webApi['getUserInfo']();      
          commit('setCurrentUser', currentUser);
          commit('login');
          return currentUser;
        } catch (error) {
          counter++;
          if (error.type === SERVER_ERROR_TYPE) {
            if (error.status === 401) {
              if(counter < 5 && isRedirectFromAcquring) {
                await sleep(4000); // обновление ин
                continue;
              }
              commit('logout');
              commit('setCurrentUser', null);
            }
            if (error.status === 404 || error.status === 400) {
              commit('logout');
              commit('setCurrentUser', null);
            }
          }
          console.log(error);
          throw error
        }
      }     
    },
    fetchServer: async (state, [serverAction, ...data]) => {
      const {commit} = state;
      console.log(state);
      console.log(data);
      console.log(serverAction);
      // ходим на сервер через стор, чтобы централизованно обрабатывать ошибки
      try {
        return await webApi[serverAction](...data);
      } catch (error) {
        if (error.type === SERVER_ERROR_TYPE) {
          if (error.status === 401) {
            commit('logout');
            commit('setCurrentUser', null);
          }
          if (error.status === 404 || error.status === 400)
            commit('notFound');
        }
        console.log(error);
        throw error
      }
    }
  }
};
