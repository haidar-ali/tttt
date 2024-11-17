
import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";
import Signup from "../views/Signup.vue";
import Lobby from "../views/Lobby.vue";
import Game from "../views/Game.vue";
import DeckCreation from "../views/DeckCreation.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/", component: Lobby },
  { path: "/login", component: Login },
  { path: "/signup", component: Signup },
  { path: "/game/:gameId", component: Game },
  { path: "/create-deck", component: DeckCreation },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
