<template>
  <div class="container">
    <div class="d-flex justify-content-between">
      <h1>Notas</h1>
      <b-button v-b-modal.modal-note>Nueva nota</b-button>
    </div>

    <div class="my-3">
      <table class="table">
        <thead>
          <th scope="col">#</th>
          <th scope="col">Nombre</th>
          <th scope="col">Descripcion</th>
          <th scope="col">Acciones</th>
        </thead>
        <tbody>
          <tr v-for="item in notes" :key="item.id">
            <th scope="row">{{ item._id }}</th>
            <td>{{ item.name }}</td>
            <td>{{ item.description }}</td>
            <td>
              <b-button @click="updateNote(item._id)" class="mx-1 btn-warning"
                >Editar</b-button
              >
              <b-button @click="deleteNote(item._id)" class="mx-1 btn-danger"
                >Eliminar</b-button
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <b-modal
      id="modal-note"
      ref="modal"
      title="Nota"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <b-form
        novalidate
        :validated="form.error"
        ref="form"
        @submit.prevent="handleSubmit"
        @reset="onReset"
      >
        <b-form-group
          id="input-group-name"
          label="Enter name:"
          label-for="input-name"
          invalid-feedback="Name is required"
          :state="error.name"
        >
          <b-form-input
            id="input-name"
            v-model="form.name"
            type="text"
            required
            placeholder="Enter name"
            :state="error.name"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="input-group-description"
          label="Your description:"
          label-for="input-description"
          invalid-feedback="Description is required"
          :state="error.description"
        >
          <b-form-input
            id="input-description"
            v-model="form.description"
            type="text"
            required
            placeholder="Enter description"
            :state="error.description"
          ></b-form-input>
        </b-form-group>
      </b-form>
    </b-modal>

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
      form: {
        error: false,
        name: "",
        description: ""
      },
      error: {
        name: null,
        description: null
      },
      alert: {
        dismissSecs: 5,
        dismissCountDown: 0,
        message: "Ocurrio un error"
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
          this.form.error = true;
        }

        this.notes = res.data;
      } catch (error) {
        console.log(error);
        this.showAlert();
      }
    },
    async getNote(id) {
      try {
        const res = await this.axios.get(`/notes/${id}`);

        console.log(res);

        if (!res.data) {
          //
        }

        this.form = { ...res.data };

        return true;
      } catch (error) {
        console.log(error);
        this.showAlert();
        return false;
      }
    },
    async updateNote(id) {
      const res = await this.getNote(id);

      if (res) this.$bvModal.show("modal-note");
    },
    async deleteNote(id) {
      try {
        const res = await this.axios.delete(`/notes/${id}`);

        let i = this.notes.findIndex(item => item._id === res.data._id);

        if (i != -1) this.notes.splice(i, 1);
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
    },
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();

      this.form.error = !valid;

      return valid;
    },
    resetModal() {
      this.form.error = false;
      if (this.form._id !== undefined) delete this.form._id;
      this.form.name = "";
      this.form.description = "";
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();

      this.handleSubmit();
    },
    async handleSubmit() {
      if (!this.checkFormValidity()) {
        return;
      }

      try {
        const url = !this.form._id ? `/notes` : `/notes/${this.form._id}`;
        const res = !this.form._id
          ? await this.axios.post(url, this.form)
          : await this.axios.put(url, this.form);

        console.log(res);

        if (!this.form._id) {
          this.notes.push(res.data);
        } else {
          let i = this.notes.findIndex(item => item._id === res.data._id);
          if (i != -1) this.notes.splice(i, 1, res.data);
          console.log(this.notes);
          delete this.form._id;
        }

        this.form.name = "";
        this.form.description = "";

        this.$bvModal.hide("modal-note");
      } catch (error) {
        console.log(error);
      }
    },
    onReset() {
      //
    }
  }
};
</script>
