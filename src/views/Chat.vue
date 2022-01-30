<template>
  <div class="page">
    <MainNavbar></MainNavbar>
    <h2>Chat with like-minded people!</h2>

    <div class="chatBox">
      <ul>
        <li v-for="message in messages" v-bind:key="message.id">
          {{message.user}}: {{message.message}}
        </li>
      </ul>
    </div>
    <div class="msg-form">
      <form @submit.prevent="sendMessage">
        <input type="text" id="in-text" placeholder="Message..." v-model="message"/>
        <input type="button" class="btn btn-success" id="in-btn" value="Send"/>
      </form>
    </div>
  </div>
</template>

<script>
var socket = null;

export default {
  name: "Chat",
  data() {
    return {
      message: '',
      messages: [],
    }
  },
  methods: {
    sendMessage() {
      socket.emit('message', this.message);
      this.message = '';
    }
  },
  created() {
    //socket = io();
  },
  mounted() {
    socket.on('message', (message) => {
      this.messages.push(message);
    })
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
.chatBox {
  text-align: left;
  height: 200px;
  max-width: 400px;
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
</style>