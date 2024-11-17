
<template>
  <div class="deck-creator">
    <h2>Create or Import Deck</h2>
    <div>
      <label for="deckFile">Upload JSON File:</label>
      <input type="file" id="deckFile" @change="onFileChange" accept=".json" />
    </div>
    <div>
      <label for="jsonInput">Or Paste JSON Here:</label>
      <textarea id="jsonInput" v-model="jsonInput" placeholder="Paste your JSON here"></textarea>
      <button @click="onTextInput">Import JSON from Text</button>
    </div>
    <div v-if="deck">
      <h3>Deck Name: {{ deck.deckName }}</h3>
      <button @click="saveDeck">Save Deck to Firebase</button>
    </div>
  </div>
</template>

<script>
import { db, auth } from '../firebase/firebaseConfig';

export default {
  data() {
    return {
      deck: null,       // Holds the parsed deck from JSON
      jsonInput: "",    // Holds JSON text input from the user
    };
  },
  methods: {
    async onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const json = JSON.parse(e.target.result);
            this.validateAndSetDeck(json);
          } catch (error) {
            console.error('Invalid JSON format:', error);
          }
        };
        reader.readAsText(file);
      }
    },
    onTextInput() {
      try {
        const json = JSON.parse(this.jsonInput);
        this.validateAndSetDeck(json);
      } catch (error) {
        console.error('Invalid JSON format:', error);
        alert("Invalid JSON. Please check your input.");
      }
    },
    validateAndSetDeck(json) {
      const { leader, base, deck, sideboard, metadata } = json;

      if (
        leader && base && deck && metadata &&
        leader.id && base.id && metadata.name &&
        deck.length >= 1 && deck.length <= 300 &&
        (!sideboard || sideboard.length <= 10)
      ) {
        this.deck = {
          leader: leader.id,
          base: base.id,
          deckName: metadata.name,
          deckList: deck.flatMap(card => Array(card.count).fill(card.id)),
          sideboard: sideboard ? sideboard.flatMap(card => Array(card.count).fill(card.id)) : null,
        };
      } else {
        alert("Deck does not meet the required conditions or is missing required fields.");
      }
    },
    async saveDeck() {
      if (this.deck) {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userRef = db.ref(`users/${currentUser.uid}/decks`).push();
          await userRef.set(this.deck);
          alert("Deck saved successfully!");
          this.deck = null; // Reset deck after saving
          this.jsonInput = ""; // Clear input after saving
        } else {
          alert("User not authenticated. Please log in.");
        }
      } else {
        alert("No deck to save.");
      }
    }
  }
};
</script>

<style scoped>
.deck-creator {
  margin: 20px;
}
textarea {
  width: 100%;
  height: 100px;
  margin-top: 10px;
}
button {
  margin-top: 10px;
}
</style>
