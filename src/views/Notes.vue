<template>
  <div class="container">
    <h1>This is the notes page</h1>

    <table class="table">
      <thead>
        <th scope="col">#</th>
        <th scope="col">Nombre</th>
        <th scope="col">Descripcion</th>
      </thead>
      <tbody>
        <tr v-for="item in notes" :key="item.id">
          <th scope="row">{{ item._id }}</th>
          <td>{{ item.name }}</td>
          <td>{{ item.description }}</td>
        </tr>
      </tbody>
    </table>

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
  </div>
</template>

<script>
export default {
  name: "Notes",
  data() {
    return {
      notes: [],
      alert: {
        dismissSecs: 10,
        dismissCountDown: 0,
        message: ""
      }
    };
  },
  created() {
    this.getNotes();
  },
  methods: {
    async getNotes() {
      try {
        const res = await this.axios.get("/notes");

        console.log(res);

        if (!res.data) {
          //
        }

        this.notes = res.data;
      } catch (error) {
        console.log(error);
        this.showAlert();
      }
    },
    countDownChanged(dismissCountDown) {
      this.alert.dismissCountDown = dismissCountDown;
    },
    showAlert() {
      this.alert.dismissCountDown = this.alert.dismissSecs;
    }
  }
};
</script>
