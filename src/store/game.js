
import axios from "axios";
import { db } from "../firebase/firebaseConfig";

export default {
  state: {
    gameState: {},
    gameId: null,
    currentPhase: "REGROUP",
  },
  mutations: {
    SET_GAME_STATE(state, gameState) { state.gameState = gameState; },
    SET_GAME_ID(state, gameId) { state.gameId = gameId; },
    SET_PHASE(state, phase) { state.currentPhase = phase; },
  },
  actions: {
    async startGame({ commit }) {
      const response = await axios.post("http://localhost:5000/game/start");
      commit("SET_GAME_STATE", response.data);
      commit("SET_GAME_ID", response.data.gameId);
    },
    async nextPhase({ state, commit }) {
      const response = await axios.post("http://localhost:5000/game/nextPhase", { gameId: state.gameId });
      commit("SET_PHASE", response.data.phase);
    },
    subscribeToGameState({ commit }, gameId) {
      db.ref(`games/${gameId}`).on("value", (snapshot) => {
        commit("SET_GAME_STATE", snapshot.val());
      });
    },
  },
};
