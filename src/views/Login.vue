<template>
  <div class="container text-left pt-3">
    <h2>Login</h2>

    <b-alert
      :show="alert.dismissCountDown"
      dismissible
      variant="warning"
      @dismissed="alert.dismissCountDown = 0"
      @dismiss-count-down="countDownChanged"
    >
      <p>{{ alert.message }}</p>
      <b-progress
        variant="warning"
        :max="alert.dismissSecs"
        :value="alert.dismissCountDown"
        height="4px"
      ></b-progress>
    </b-alert>

    <form @submit.prevent="submit">
      <div class="form-group">
        <label for="inputEmail">Email address</label>
        <input
          v-model="email"
          type="email"
          class="form-control"
          id="inputEmail"
          placeholder="Email"
        />
      </div>
      <div class="form-group">
        <label for="inputPassword">Password</label>
        <input
          v-model="password"
          type="password"
          class="form-control"
          id="inputPassword"
          placeholder="Password"
        />
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import router from "../router/index";

export default {
  data: () => ({
    email: "",
    password: "",
    alert: {
      dismissSecs: 5,
      dismissCountDown: 0,
      message: "Ocurrio un error"
    }
  }),
  computed: {
    ...mapGetters(["isAuthenticated"])
  },
  methods: {
    ...mapActions(["saveToken"]),
    async submit() {
      try {
        const res = await this.axios.post("login", {
          email: this.email,
          password: this.password
        });

        this.saveToken(res.data.token);

        router.push({ name: "Home" });
      } catch (error) {
        console.error(error.response ?? error);

        this.showAlert(error.response ? error.response.data.error.message : '')
      }
    },
    countDownChanged(dismissCountDown) {
      this.alert.dismissCountDown = dismissCountDown;
    },
    showAlert(message) {
      if (message) this.alert.message = message;
      this.alert.dismissCountDown = this.alert.dismissSecs;
    }
  },
  created() {
    if (this.isAuthenticated) router.push({ name: "Home" });
  }
};
</script>
