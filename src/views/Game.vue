
<template>
  <div class="game-view">
    <h2>Game</h2>
    <GameBoard />
  </div>
</template>

<script>
import GameBoard from '../components/GameBoard.vue';

export default {
  components: {
    GameBoard
  }
};
</script>

<style scoped>
.game-view {
  margin: 20px;
}
</style>
