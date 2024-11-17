
<template>
  <div id="app">
    <!-- Header -->
    <header>
      <h1>Star Wars Unlimited</h1>
    </header>

    <!-- Main Content -->
    <main>
      <router-view />
    </main>

    <!-- Footer -->
    <footer>
      <p>May the Force be with you</p>
    </footer>
  </div>
</template>

<script>
export default {};
</script>

<style>
@import "./assets/styles/global.css";

/* Header, footer, and layout styling */
header {
  background-color: #111;
  color: var(--primary-color);
  padding: 1rem;
  text-align: center;
  font-size: 1.2rem;
}

footer {
  background-color: #111;
  color: var(--primary-color);
  padding: 1rem;
  text-align: center;
  font-size: 1rem;
}

main {
  min-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
