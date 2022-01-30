<template>
  <div id="nav">
    <button class="link-btn" id="nav-login" @click="redirectToLogIn">Log In</button> |
    <button class="link-btn" id="nav-register" @click="redirectToRegister">Register</button>
  </div>
</template>

<script>
export default {
  name: "LoginRegNavbar",
  props: ['current'],
  mounted() {
    this.setStyle();
  },
  methods: {
    redirectToLogIn() {
      window.location.replace("http://localhost:8085/login");
    },
    redirectToRegister() {
      window.location.replace("http://localhost:8085/register");
    },
    setStyle() {
      if (this.current === 'login')
        document.getElementById('nav-login').style.color = '#42b983';
      else
        document.getElementById('nav-register').style.color = '#42b983';
    }
  }
}
</script>

<style scoped></style>