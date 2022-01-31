<template>
  <div class="page">
    <MainNavbar></MainNavbar>
    <h2>Chat with other movie enthusiasts!</h2>

    <div class="chat">
      <div class="chatBox">
        <ul style="list-style-type: none; left: 0">
          <li v-for="message in messages" :key="message">
            <p class="my-msg" v-if="username === message.username">
              <strong>{{message.username}}:</strong> {{message.message}}
            </p>
            <p v-else>
              <strong>{{message.username}}:</strong> {{message.message}}
            </p>
          </li>
        </ul>
      </div>
      <div class="msg-form">
        <form autocomplete="off" @submit.prevent="submit">
          <input type="text" id="in-text" placeholder="Message..." v-model="message"/>
          <input type="button" @click="submit" class="btn btn-success" id="in-btn" value="Send"/>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Pusher from 'pusher-js';

export default {
  name: "Chat",
  data() {
    return {
      username: this.getUsername(),
      messages: [],
      message: ''
    }
  },
  methods: {
    async submit() {
      await fetch('http://localhost:8084/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: this.username,
          message: this.message
        })
      })

      this.message = '';
    },
    getUsername() {
      const token = localStorage.getItem("token");
      let base64Url = token.split('.')[1];
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      //console.log(JSON.parse(jsonPayload));
      return this.extractUsername(JSON.parse(jsonPayload).email);
    },
    extractUsername(email) {
      return email.substring(0, email.indexOf('@'))
    }
  },
  mounted() {
    Pusher.logToConsole = true;

    const pusher = new Pusher('93d2335e77a72d961d50', {
      cluster: 'eu'
    });

    const channel = pusher.subscribe('chat');
    channel.bind('message', data => {
      this.messages.push(data)
    });
  }
}
</script>

<style scoped>
.page {
  position: fixed;
  min-height: 100%;
  min-width: 100%;
  background-image: url("./cinema.jpg");
  color: white;
}

.chat {
  max-width: 410px;
  background-color: black;
  margin: 30px auto;
}

.chatBox {
  text-align: left;
  height: 200px;
  max-width: 400px;
  overflow-x: hidden;
  overflow-y: scroll;
  margin: 0 auto;
  background-color: rgb(55, 55, 55, 0.6);
  color: white;
}

.msg-form {
  max-width: 400px;
  margin: 0 auto;
}

#in-text {
  width: 300px;
  height: 40px;
}

#in-btn {
  width: 100px;
  height: 40px;
  border-radius: 0;
  border: none;
  margin-top: -1px;
}

ul {
  margin-left: -15px;
  margin-top: 10px;
}

.my-msg {
  background-color: cornflowerblue;
}
</style>