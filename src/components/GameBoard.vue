
<template>
  <div class="game-board">
    <h2>Game Board</h2>
    <button @click="startGame">Start Game</button>
  </div>
</template>

<script>
export default {
  methods: {
    startGame() {
      console.log("Game started.");
      // Game start logic here
    }
  }
};
</script>

<style scoped>
.game-board {
  margin: 20px;
}
</style>
