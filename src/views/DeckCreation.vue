
<template>
  <div class="deck-creation">
    <h2>Deck Creation</h2>
    <DeckCreator />
  </div>
</template>

<script>
import DeckCreator from '../components/DeckCreator.vue';

export default {
  components: {
    DeckCreator
  }
};
</script>

<style scoped>
.deck-creation {
  margin: 20px;
}
</style>
