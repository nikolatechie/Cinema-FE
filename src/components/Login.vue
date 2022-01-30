<template>
  <div class="page">
    <div id="nav">
      <button class="link-btn" id="nav-login" @click="redirectToLogIn">Log In</button> |
      <button class="link-btn" @click="redirectToRegister">Register</button>
    </div>

    <div class="login">
      <form @submit.prevent="submitForm">
        <h1 id="login-text">Login</h1>
        <div class="row">
          <div class="col-12 form-group">
            <label class="col-form-label col-form-label-lg">Email <span class="text-danger">*</span></label>
            <input type="email" v-model="v$.form.email.$model" class="form-control form-control-lg">
            <div class="input-errors" v-for="(error, index) of v$.form.email.$errors" :key="index">
              <div class="error-msg">{{error.$message}}</div>
            </div>
          </div>
          <div class="col-12 form-group">
            <label class="col-form-label col-form-label-lg">Password <span class="text-danger">*</span></label>
            <input type="password" v-model="v$.form.password.$model" class="form-control form-control-lg">
            <div class="input-errors" v-for="(error, index) of v$.form.password.$errors" :key="index">
              <div class="error-msg">{{error.$message}}</div>
            </div>
          </div>
          <div class="col-12 form-group text-center">
            <input type="submit" :disabled="v$.form.$invalid" value="Login" class="btn btn-vue btn-lg col-4">
          </div>
        </div>
      </form>
    </div>
    <div class="alert" style="visibility: hidden">
      <b-alert show variant="danger">The email or password are incorrect!</b-alert>
    </div>
  </div>
</template>

<script>
import useVuelidate from '@vuelidate/core'
import {required, email, minLength, maxLength} from '@vuelidate/validators'

export default {
  name: 'Login',
  setup() {
    return {v$: useVuelidate()}
  },
  data() {
    return {
      form: {
        email: '',
        password: ''
      }
    }
  },
  validations() {
    return {
      form: {
        email: {
          required, email,
          min: minLength(8),
          max: maxLength(26)
        },
        password: {
          required,
          min: minLength(3),
          max: maxLength(20)
        }
      }
    }
  },
  methods: {
    redirectToLogIn() {
      window.location.replace("http://localhost:8085/login");
    },
    redirectToRegister() {
      window.location.replace("http://localhost:8085/register");
    },
    submitForm() {
      if (!this.v$.form.$invalid)
        this.login()
    },
    login() {
      const email = document.getElementsByTagName("input")[0].value;
      const password = document.getElementsByTagName("input")[1].value;

      fetch("http://localhost:8081/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      }).then(res => {
        return res.json()
      }).then(data => {
        if (data.token != undefined && data.token != "") {
          localStorage.setItem("token", data.token);
          window.location.replace("http://localhost:8085/");
        }
        else throw new Error("Login failed!");
      }).catch(() => document.getElementsByClassName("alert")[0].style.visibility = "visible");
    }
  }
}
</script>

<style scoped>
.alert {
  margin: 20px auto;
  width: 61%;
}

.page {
  position: fixed;
  min-height: 100%;
  min-width: 100%;
  background-image: url("https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y2luZW1hfGVufDB8fDB8fA%3D%3D&w=1000&q=80");
  color: white;
}

#login-text {
  padding-bottom: 30px;
}

.login {
  text-align: center;
  max-width: 36%;
  max-height: 70%;
  background-color: rgb(59, 59, 59, 0.5);
  padding: 20px 50px;
  margin: 30px auto auto;
}

.btn-vue {
  background: black;
  color: white;
  font-weight: bold;
  margin: 40px 0 20px 0;
}

.btn-vue:hover {
  color: white;
  border: 1px solid orange;
}

#nav {
  padding-top: 25px;
  background-color: black;
}

#nav a {
  font-weight: bold;
  color: white;
}

#nav-login {
  color: #42b983;
}
</style>