<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/settings">Account Settings</router-link> |
    <router-link to="/visits">Visits</router-link> |
    <button class="link-btn" @click="logOut">Log Out</button>
  </div>
</template>

<script>
import Home from "../views/Home";

export default {
  name: "Navbar",
  methods: {
    logOut() {
      Home.methods.logOut()
    }
  }
}
</script>

<style scoped>
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