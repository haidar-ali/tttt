
<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input type="email" v-model="email" placeholder="Email" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
    <p>Don't have an account? <router-link to="/signup">Sign up</router-link></p>
  </div>
</template>

<script>
import { auth } from "../firebase/firebaseConfig";

export default {
  data() {
    return { email: "", password: "" };
  },
  methods: {
    async login() {
      try {
        await auth.signInWithEmailAndPassword(this.email, this.password);
        this.$router.push("/");
      } catch (error) {
        alert(error.message);
      }
    },
  },
};
</script>
