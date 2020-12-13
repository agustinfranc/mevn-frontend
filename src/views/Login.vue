<template>
  <div class="container text-left">
    <h2>Login</h2>
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
import { mapActions } from "vuex";
import router from "../router/index";

export default {
  data: () => ({
    email: "",
    password: ""
  }),
  methods: {
    ...mapActions(["saveToken"]),
    async submit() {
      try {
        const res = await this.axios.post("login", {
          email: this.email,
          password: this.password
        });

        this.saveToken(res.data.token);

        router.push({ name: "Notes" });
      } catch (error) {
        console.error(error.response ?? error);
      }
    }
  }
};
</script>
