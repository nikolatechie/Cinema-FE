<template>
  <div class="page">
    <div id="nav">
      <router-link to="/">Home</router-link>
      <span> | </span>
      <router-link v-if="userLoggedIn" to="/settings">Account Settings</router-link>
      <span v-if="userLoggedIn"> | </span>
      <router-link v-if="userLoggedIn" to="/visits">Visits</router-link>
      <span v-if="userLoggedIn"> | </span>
      <router-link v-if="userLoggedIn" to="/chat">Chat</router-link>
      <span v-if="userLoggedIn"> | </span>
      <button class="link-btn" v-if="userLoggedIn" @click="logOut">Log Out</button>
      <button class="link-btn" v-if="!userLoggedIn" @click="redirectToLogIn">Log In</button>
      <span v-if="!userLoggedIn"> | </span>
      <button class="link-btn" v-if="!userLoggedIn" @click="redirectToRegister">Register</button>
      <router-view/>
    </div>

    <h1>Looking for a movie to watch with your friends?</h1>
    <button class="link-btn" id="btn-recommend" v-if="userLoggedIn" @click="toggleRecommendationView">
      Recommend a movie ▼
    </button>

    <div class="recommendations" v-if="userLoggedIn">
      <div>
        <input type="text" id="movie-title" placeholder="Movie title">
        <button class="btn-vue btn-vue-inverted" @click="addMovieRecommendation">Add</button>
      </div>
      <div>
        <table>
          <tr>
            <th></th>
            <th>Movie title</th>
            <th></th>
          </tr>
          <tr v-for="(item, index) in this.recommendations" v-bind:key="item.id">
            <td>{{index + 1}}</td>
            <td>{{item}}</td>
            <td><button class="btn-vue btn-sm" v-on:click="rmRecommendation">Remove</button></td>
          </tr>
        </table>
        <button class="btn-vue btn-submit" @click="submitRecommendations">Submit</button>
      </div>
    </div>

    <h3>Take a look at upcoming schedule!</h3>

    <table class="main-table">
      <tr>
        <th>Movie title</th>
        <th>Genre</th>
        <th>Date/Time</th>
        <th>Ticket price</th>
        <th class="seats-left" colspan="2">Seats left</th>
      </tr>
      <tr v-for="item in schedule" :key="item.id">
        <td>{{item.title}}</td>
        <td>{{item.genre}}</td>
        <td>
          {{months[Number.parseInt(item.dateTime.toString().substr(5, 2)) - 1]}} {{item.dateTime.toString().substr(8, 2)}},
          {{Number.parseInt(item.dateTime.toString().substr(11, 2)) + 1}}:{{item.dateTime.toString().substr(14, 2)}}
        </td>
        <td>{{item.price}}</td>
        <td class="seats-left">{{item.seatsLeft}}</td>

        <td v-if="userLoggedIn && !reserved[item.id]" class="seats-left">
          <button class="btn-vue" v-on:click="reserve">Reserve</button>
        </td>

        <td v-else-if="userLoggedIn && reserved[item.id]" class="seats-left">
          <button class="btn-vue btn-vue-disabled disabled"><u>RESERVED</u></button>
        </td>

        <td v-else class="seats-left"><em>Login to reserve</em></td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  created() {
    this.loadSchedule()
  },
  computed: {
    recommendations() {
      return this.$store.state.recommendations
    }
  },
  data() {
    return {
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      schedule: [],
      userLoggedIn: true,
      reserved: {},
    }
  },
  methods: {
    submitRecommendations() {
      if (this.recommendations) {
        this.$store.commit('clearAll')
        alert("Thank you for submitting recommendations!")
      }
      else alert('Please add at least one movie recommendation.')
    },
    rmRecommendation(btn) {
      const btns = document.getElementsByClassName("btn-sm");

      for (let i = 0; i < btns.length; ++i) {
        if (btns[i] === btn.target) {
          this.$store.commit('removeMovie', i);
          break;
        }
      }
    },
    addMovieRecommendation() {
      const movieTitle = document.getElementById("movie-title");

      if (movieTitle.value === '')
        alert('Movie title can\'t be empty!');
      else {
        this.$store.commit('addMovie', movieTitle.value);
        movieTitle.value = '';
      }
    },
    toggleRecommendationView() {
      const btn = document.getElementById('btn-recommend');
      const rec = document.getElementsByClassName("recommendations")[0];

      if (rec.style.display === 'none') {
        rec.style.display = 'block'
        btn.innerHTML = 'Recommend a movie ▲'

        rec.animate([
          {transform: 'translateY(-5px)'},
          {transform: 'translateY(0px)'}
        ], {
          duration: 300,
        });
      }
      else {
        rec.style.display = 'none';
        btn.innerHTML = 'Recommend a movie ▼'
      }
    },
    redirectToLogIn() {
      window.location.replace("http://localhost:8085/login");
    },
    redirectToRegister() {
      window.location.replace("http://localhost:8085/register")
    },
    logOut() {
      localStorage.removeItem("token");
      window.location.replace("http://localhost:8085/login");
    },
    async loadSchedule() {
      await fetch("http://localhost:8080/api/schedule", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      }).then(res => {
        return res.json()
      }).then(data => {
        data.forEach(it => {
          if (it.dateTime < Date.now())
            return

          // now get the movie with the given id
          fetch("http://localhost:8080/api/movie/" + it.movieId, {
            method: "GET",
            headers: {
              "Content-Type": "application/json"
            }
          }).then(res => {
            return res.json()
          }).then(data => {
            this.schedule.push({
              id: it.id,
              title: data.title,
              genre: data.genre,
              dateTime: it.dateTime,
              price: it.price,
              seatsLeft: 2 + Math.ceil(10 * Math.random() % 7)
            })

            this.schedule.sort((a, b) => {
              return new Date(a.dateTime) - new Date(b.dateTime);
            })
          }).catch(err => alert(err))
        })
      }).catch(err => alert(err));

      if (localStorage.getItem("token") === null) {
        this.userLoggedIn = false
        return;
      }

      try {
        fetch("http://localhost:8080/api/ticket/" + this.getUserId(), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
          }
        }).then(res => {
          return res.json()
        }).then(data => {
          data.forEach(it => {
            this.reserved[it.scheduleId] = true
          })
        }).catch(err => alert(err.message));
      }
      catch (err) {
        alert(err);
      }
    },
    reserve(btn) {
      if (confirm("Confirm reservation?") === false)
        return;

      const btns = document.getElementsByClassName("btn-vue");

      for (let i = 0; i < btns.length; ++i) {
        if (btn.target === btns[i]) {
          fetch("http://localhost:8080/api/ticket", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({
              scheduleId: this.schedule[i].id,
              seatNum: Math.ceil(150 * Math.random()) + 1,
              userId: Number.parseInt(this.getUserId())
            })
          }).then(res => {
            return res.json()
          }).then(data => {
            if (data != null)
              window.location.reload()
            else throw new Error('Reservation failed!');
          }).catch((err) => alert(err));

          return
        }
      }
    },
    getUserId() {
      const token = localStorage.getItem("token");
      let base64Url = token.split('.')[1];
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      //console.log(JSON.parse(jsonPayload));
      return JSON.parse(jsonPayload).id;
    }
  }
}
</script>

<style>
html, body {
  background-color: black;
  background-repeat: no-repeat;
}

.link-btn {
  color: white;
  background-color: rgb(0, 0, 0, 0);
  border: none;
  text-decoration: underline;
  font-weight: bold;
}
</style>

<style scoped>
.page {
  min-height: 100%;
  min-width: 100%;
  background-image: url("./cinema.jpg");
  color: white;
}

table {
  color: white;
  margin: 10px auto;
  padding: 10px;
  background-color: rgb(59, 59, 59, 0.6);
}

.main-table {
  color: white;
  margin: 50px auto;
  padding: 100px;
  background-color: rgb(59, 59, 59, 0.6);
}

.main-table > th, .main-table > th>.seats-left {
  background-color: rgb(29, 29, 29, 0.2) !important;
}

.seats-left {
  background-color: rgb(40, 40, 40, 0.7);
}

th {
  padding: 10px;
  border-bottom: 1px solid white;
}

td {
  padding: 15px;
}

.btn-vue {
  border: 1px solid black;
  background: black;
  color: white;
  font-weight: bold;
}

.btn-vue:hover {
  color: white;
  border: 1px solid orange;
}

.btn-submit {
  color: black;
  background-color: #42b983;
  font-weight: bold;
  width: 90px;
}

.btn-submit:hover {
  color: black;
}

.btn-vue-inverted {
  margin: 0 10px;
  color: black;
  background-color: #42b983;
  width: 60px;
}

.btn-vue-inverted:hover {
  color: black;
}

.btn-vue-disabled {
  border: 1px solid #373737;
  background: #373737;
  font-weight: bold;
}

.btn-vue-disabled:hover {
  border: 1px solid #373737;
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

.recommendations {
  display: none;
}
</style>