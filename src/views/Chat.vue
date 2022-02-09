<template>
  <div class="page">
    <MainNavbar></MainNavbar>
    <h2>Chat with other movie enthusiasts!</h2>

    <div class="chat">
      <div class="chatBox">
        <p v-for="message in messages" :key="message" class="message" :class="{
          'message-out': message.username === username,
          'message-in': message.username !== username
        }">
          <strong>{{message.username}}:</strong> {{message.message}}
        </p>
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
      if (this.message === '') return

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

/*
  --------- IMPORTANT ---------
  pokreni chat/chat.js
*/

<style scoped>
.page {
  position: fixed;
  min-height: 100%;
  min-width: 100%;
  background-image: url("./cinema.jpg");
  color: white;
}

.chat {
  max-width: 500px;
  margin: 30px auto;
}

.chatBox {
  text-align: left;
  background: white;
  height: 50vh;
  padding: 1em;
  overflow-y: visible;
  overflow-x: hidden;
  max-width: 400px;
  margin: 0 auto;
  box-shadow: rgba(100, 100, 111, 0.8) 0 27px 22px 0;
}

.message {
  width: 50%;
  border-radius: 10px;
  padding: .5em;
  font-size: .9em;
  max-height: none;
}

.message-out {
  background: #407FFF;
  color: white;
  margin-left: 50%;
}

.message-in {
  background: #F1F0F0;
  color: black;
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
  margin-top: -2px;
  background-color: dodgerblue;
}

#in-btn:hover {
  background-color: #1451cc;
  transition-duration: 0.4s;
}
</style>