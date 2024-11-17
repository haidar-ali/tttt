
<template>
  <div>
    <h2>Sign Up</h2>
    <form @submit.prevent="signup">
      <input type="text" v-model="username" placeholder="Username" required />
      <input type="email" v-model="email" placeholder="Email" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <button type="submit">Sign Up</button>
    </form>
    <p>Already have an account? <router-link to="/login">Log in</router-link></p>
  </div>
</template>

<script>
import { auth, db } from "../firebase/firebaseConfig";

export default {
  data() {
    return { username: "", email: "", password: "" };
  },
  methods: {
    async signup() {
      try {
        const userCredential = await auth.createUserWithEmailAndPassword(this.email, this.password);
        const userId = userCredential.user.uid;
        await db.ref("users/" + userId).set({ username: this.username, email: this.email });
        this.$router.push("/");
      } catch (error) {
        alert(error.message);
      }
    },
  },
};
</script>
