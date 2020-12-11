import Vue from "vue";
import Vuex from "vuex";
import jwt from "jwt-decode";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: "",
    user: ""
  },
  mutations: {
    SET_USER(state, payload) {
      state.user = payload;
    },
    SET_TOKEN(state, payload) {
      state.token = payload ? jwt(payload) : payload;
    }
  },
  actions: {
    saveToken({ commit }, payload) {
      localStorage.setItem("token", payload);

      commit("SET_TOKEN", payload);
    }
  },
  modules: {}
});
