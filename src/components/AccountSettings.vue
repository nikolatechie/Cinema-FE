<template>
  <div class="page">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/settings">Account Settings</router-link> |
      <router-link to="/visits">Visits</router-link> |
      <button class="link-btn" @click="logOut">Log Out</button>
    </div>

    <div class="change-info">
      <form @submit.prevent="submitForm">
        <h1 id="change-text">Update info</h1>
        <div class="row">
          <div class="col-12 form-group">
            <label class="col-form-label col-form-label-lg">New name</label>
            <input type="text" v-model="v$.form.name.$model" class="form-control form-control-lg">
            <div class="input-errors" v-for="(error, index) of v$.form.name.$errors" :key="index">
              <div class="error-msg">{{error.$message}}</div>
            </div>
          </div>
          <div class="col-12 form-group">
            <label class="col-form-label col-form-label-lg">New email</label>
            <input type="email" v-model="v$.form.email.$model" class="form-control form-control-lg">
            <div class="input-errors" v-for="(error, index) of v$.form.email.$errors" :key="index">
              <div class="error-msg">{{error.$message}}</div>
            </div>
          </div>
          <div class="col-12 form-group">
            <label class="col-form-label col-form-label-lg">New password</label>
            <input type="password" v-model="v$.form.newPassword.$model" class="form-control form-control-lg">
            <div class="input-errors" v-for="(error, index) of v$.form.newPassword.$errors" :key="index">
              <div class="error-msg">{{error.$message}}</div>
            </div>
          </div>
          <div class="col-12 form-group text-center">
            <input type="submit" :disabled="v$.form.$invalid" value="Update" class="btn btn-vue btn-lg col-4">
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Home from "./Home";
import useVuelidate from '@vuelidate/core'
import {email, minLength, maxLength} from '@vuelidate/validators'

export default {
  name: 'UpdateInfoForm',
  setup() {
    return {v$: useVuelidate()}
  },
  data() {
    return {
      form: {
        name: '',
        email: '',
        newPassword: ''
      }
    }
  },
  validations() {
    return {
      form: {
        name: {
          min: minLength(5),
          max: maxLength(32)
        },
        email: {
          email,
          min: minLength(8),
          max: maxLength(26)
        },
        newPassword: {
          min: minLength(3),
          max: maxLength(20)
        }
      }
    }
  },
  methods: {
    submitForm() {
      if (!this.v$.form.$invalid)
        this.updateInfo()
    },
    logOut() {
      Home.methods.logOut();
    },
    getUserEmail() {
      const token = localStorage.getItem("token");
      let base64Url = token.split('.')[1];
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      //console.log(JSON.parse(jsonPayload));
      return JSON.parse(jsonPayload).email;
    },
    updateInfo() {
      const newName = document.getElementsByTagName("input")[0].value;
      const newEmail = document.getElementsByTagName("input")[1].value;
      const newPass = document.getElementsByTagName("input")[2].value;

      fetch("http://localhost:8080/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: this.getUserEmail(),
          name: newName,
          newEmail: newEmail,
          password: newPass
        })
      }).then(res => {
        return res.json()
      }).then(() => {
        localStorage.removeItem("token")
        window.location.replace("http://localhost:8085/login")
      }).catch((err) => alert(err.message));
    }
  }
}
</script>

<style scoped>
.page {
  position: fixed;
  min-height: 100%;
  min-width: 100%;
  background-image: url("https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y2luZW1hfGVufDB8fDB8fA%3D%3D&w=1000&q=80");
  color: white;
}

#change-text {
  padding: 20px 30px;
}

.change-info {
  text-align: center;
  max-width: 36%;
  max-height: 70%;
  background-color: rgb(59, 59, 59, 0.5);
  padding: 0px 50px;
  margin: 0px auto;
}

.btn-vue{
  background: black;
  color: white;
  font-weight: bold;
  margin: 40px 0 20px 0;
}

.btn-vue:hover {
  border: 1px solid orange;
}

#nav {
  background-color: black;
}

#nav a {
  font-weight: bold;
  color: white;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>