
import Vue from 'vue';
import Vuex from 'vuex';
import { db, auth } from '../firebase/firebaseConfig';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    cards: {},         // Holds all card data as an object with keys as IDs
    user: null,        // Holds authenticated user data
  },
  mutations: {
    setCards(state, cards) {
      state.cards = cards;
    },
    setUser(state, user) {
      state.user = user;
    },
  },
  actions: {
    async fetchCards({ commit }) {
      try {
        const cardsSnapshot = await db.ref('cards').once('value');
        const cardsData = cardsSnapshot.val();
        const cardsObject = cardsData ? Object.keys(cardsData).reduce((acc, key) => {
          acc[key] = { ...cardsData[key], id: key }; // Assign ID and store each card under its key
          return acc;
        }, {}) : {};
        commit('setCards', cardsObject);
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    },
    async fetchUser({ commit }) {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userSnapshot = await db.ref(`users/${currentUser.uid}`).once('value');
          const userData = userSnapshot.val();
          commit('setUser', userData);
        } else {
          commit('setUser', null);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }
  },
  getters: {
    allCards: (state) => state.cards,
    userInfo: (state) => state.user,
    getCardById: (state) => (id) => {
      return state.cards[id]; // Access card directly by ID key
    }
  },
  modules: {}
});
