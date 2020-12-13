import Vue from "vue";
import Vuex from "vuex";
import jwt from "jwt-decode";
import router from "../router/index";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: "",
    user: ""
  },
  getters: {
    isAuthenticated: state => !!state.token
  },
  mutations: {
    SET_USER(state, payload) {
      const data = payload && jwt(payload) ? jwt(payload).data : null;
      state.user = data ?? "";
    },
    SET_TOKEN(state, payload) {
      state.token = payload;
    }
  },
  actions: {
    saveToken({ commit }, payload) {
      localStorage.setItem("token", payload);

      commit("SET_TOKEN", payload);
      commit("SET_USER", payload);
    },
    logout({ commit }) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      commit("SET_TOKEN", "");
      commit("SET_USER", "");

      router.push({ name: "Login" });
    }
  },
  modules: {}
});
