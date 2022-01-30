<template>
  <div class="page">
    <MainNavbar></MainNavbar>

    <h1>All your visits</h1>

    <table>
      <tr>
        <th>Movie title</th>
        <th>Genre</th>
        <th>Date/Time</th>
        <th>Seat number</th>
        <th>Ticket price</th>
      </tr>
      <tr v-for="item in tickets" :key="item.id">
        <td>{{item.title}}</td>
        <td>{{item.genre}}</td>
        <td>
          {{months[Number.parseInt(item.dateTime.toString().substr(5, 2)) - 1]}} {{item.dateTime.toString().substr(8, 2)}},
          {{Number.parseInt(item.dateTime.toString().substr(11, 2)) + 1}}:{{item.dateTime.toString().substr(14, 2)}}
        </td>
        <td>{{item.seatNum}}</td>
        <td>{{item.price}}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import Home from "./Home";

export default {
  name: 'Visits',
  created() {
    this.loadVisits();
  },
  data() {
    return {
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      tickets: []
    }
  },
  methods: {
    async loadVisits() {
      await fetch("http://localhost:8080/api/ticket/visits/" + Home.methods.getUserId(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token")
        }
      }).then(res => {
        return res.json()
      }).then(data => {
        data.forEach(it => {
          // get schedule
          fetch("http://localhost:8080/api/schedule/" + it.scheduleId, {
            method: "GET",
            headers: {
              "Content-Type": "application/json"
            }
          }).then((res) => {
            return res.json()
          }).then((schedule) => {
            // get movie
            fetch("http://localhost:8080/api/movie/" + schedule.movieId, {
              method: "GET",
              headers: {
                "Content-Type": "application/json"
              }
            }).then((res) => {
              return res.json()
            }).then((movie) => {
              // add ticket to the array
              this.tickets.push({
                title: movie.title,
                genre: movie.genre,
                dateTime: schedule.dateTime,
                seatNum: it.seatNum,
                price: schedule.price
              })
            }).catch((err) => alert(err));
          }).catch((err) => alert(err));
        })
      }).catch((err) => alert(err));

      this.tickets.sort((a, b) => {
        return new Date(a.dateTime) - new Date(b.dateTime)
      })
    }
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

table {
  color: white;
  margin: 50px auto;
  padding: 100px;
  background-color: rgb(59, 59, 59, 0.6);
}

th {
  padding: 10px;
  border-bottom: 1px solid white;
  background-color: rgb(29, 29, 29, 0.2);
}

td {
  padding: 15px;
}
</style>