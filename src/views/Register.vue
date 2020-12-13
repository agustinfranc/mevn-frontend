<template>
  <div class="container text-left pt-3">
    <h2>Register</h2>

    <b-alert
      :show="alert.dismissCountDown"
      dismissible
      variant="success"
      @dismissed="alert.dismissCountDown = 0"
      @dismiss-count-down="countDownChanged"
    >
      <p>{{ alert.message }}</p>
      <b-progress
        variant="success"
        :max="alert.dismissSecs"
        :value="alert.dismissCountDown"
        height="4px"
      ></b-progress>
    </b-alert>

    <form @submit.prevent="submit">
      <div class="form-group">
        <label for="inputName">Name</label>
        <input
          v-model="name"
          type="text"
          class="form-control"
          id="inputName"
          placeholder="Name"
        />
      </div>
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
    name: "",
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
        const res = await this.axios.post("users", {
          name: this.name,
          email: this.email,
          password: this.password
        });

        if (!res.data) return;

        this.showAlert(`User ${res.data.email} created successfully`);
      } catch (error) {
        console.error(error.response ?? error);
      }
    },
    countDownChanged(dismissCountDown) {
      this.alert.dismissCountDown = dismissCountDown;
    },
    showAlert(message) {
      this.alert.message = message;
      this.alert.dismissCountDown = this.alert.dismissSecs;
    }
  },
  created() {
    if (this.isAuthenticated) router.push({ name: "Home" });
  }
};
</script>
