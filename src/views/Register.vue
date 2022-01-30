<template>
  <div class="page">
    <LoginRegNavbar current="register"></LoginRegNavbar>

    <div class="register">
      <form @submit.prevent="submitForm">
      <h1 id="reg-text">Register</h1>
        <div class="row">
          <div class="col-12 form-group">
            <label class="col-form-label col-form-label-lg">Full Name <span class="text-danger">*</span></label>
            <input type="text" v-model="v$.form.name.$model" class="form-control form-control-lg">
            <div class="input-errors" v-for="(error, index) of v$.form.name.$errors" :key="index">
              <div class="error-msg">{{error.$message}}</div>
            </div>
          </div>
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
            <input type="submit" :disabled="v$.form.$invalid" value="Register" class="btn btn-vue btn-lg col-4">
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import useVuelidate from '@vuelidate/core'
import {required, email, minLength, maxLength} from '@vuelidate/validators'

export default {
  name: 'RegisterForm',
  setup() {
    return {v$: useVuelidate()}
  },
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: ''
      }
    }
  },
  validations() {
    return {
      form: {
        name: {
          required,
          min: minLength(5),
          max: maxLength(32)
        },
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
    submitForm() {
      if (!this.v$.form.$invalid)
        this.register()
    },
    register() {
      localStorage.removeItem("token");
      const name = document.getElementsByTagName("input")[0].value;
      const email = document.getElementsByTagName("input")[1].value;
      const password = document.getElementsByTagName("input")[2].value;

      fetch("http://localhost:8081/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          role: 'client',
          name: name,
          email: email,
          password: password
        })
      }).then(res => {
        return res.json()
      }).then(data => {
        if (data != null && data.password != null)
          window.location.replace("http://localhost:8085/login");
        else throw new Error("Registration failed!");
      }).catch(err => alert(err));
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

#reg-text {
  padding-bottom: 30px;
}

.register {
  text-align: center;
  max-width: 36%;
  max-height: 70%;
  background-color: rgb(59, 59, 59, 0.5);
  padding: 20px 50px;
  margin: 30px auto auto;
}

.btn-vue{
  background: black;
  color: white;
  font-weight: bold;
  margin: 40px 0 20px 0;
}

.btn-vue:hover {
  color: white;
  border: 1px solid orange;
}
</style>