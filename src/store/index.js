import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    recommendations: []
  },
  mutations: {
    addMovie(state, movie) {
      state.recommendations.push(movie)
    },
    removeMovie(state, idx) {
      state.recommendations.splice(idx, 1)
    },
    clearAll(state) {
      state.recommendations = []
    }
  }
})