
import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";

Vue.config.productionTip = false;


store.dispatch('fetchCards');
store.dispatch('fetchUser');

new Vue({

  store,
  router, // Ensure the router is included here
  render: (h) => h(App),
}).$mount("#app");
