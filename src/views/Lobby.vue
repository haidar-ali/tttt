<template>
  <div class="lobby">
    <h2>Lobby</h2>
    <button @click="createGame">Create Game</button>

    <div v-if="games.length">
      <h3>Available Games</h3>
      <ul>
        <li v-for="(game, index) in availableGames" :key="index">
          <span>{{ game.name }}</span>
          <button @click="joinGame(game)">Join Game</button>
        </li>
      </ul>
    </div>

    <div v-if="showDeckModal" class="modal">
      <h3>Select a Deck</h3>
      <ul>
        <li v-for="(deck, index) in decks" :key="index" class="deck-item">
          <div class="card-images">
            <img :src="getCardImage(deck.leader)" alt="Leader Image" class="card-img" />
            <img :src="getCardImage(deck.base)" alt="Base Image" class="card-img" />
          </div>
          <button @click="selectDeck(deck)" class="deck-name">{{ deck.deckName }}</button>
        </li>
      </ul>
      <button @click="closeModal">Cancel</button>
    </div>
  </div>
</template>

<script>
import { db, auth } from '../firebase/firebaseConfig';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      showDeckModal: false,
      decks: [],          // List of user's decks
      selectedDeck: null, // Selected deck for starting or joining the game
      games: [],          // List of available games
      selectedGame: null  // The game being joined
    };
  },
  computed: {
    ...mapGetters(['getCardById']),
    availableGames() {
      // Filter out games with status "FULL"
      return this.games.filter(game => game.status !== 'FULL');
    }
  },
  created() {
    this.listenForGames(); // Set up real-time listener on games
  },
  methods: {
    listenForGames() {
      const gamesRef = db.ref('games');
      gamesRef.on('value', (snapshot) => {
        const games = snapshot.val();
        this.games = games ? Object.values(games).map((game, index) => ({ ...game, id: Object.keys(games)[index] })) : [];
      });
    },
    getCardImage(cardId) {
      const card = this.getCardById(cardId);
      return card ? card.imageUrl : '';
    },
    async createGame() {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDecksRef = db.ref(`users/${currentUser.uid}/decks`);
        const decksSnapshot = await userDecksRef.once('value');
        if (decksSnapshot.exists()) {
          this.decks = Object.values(decksSnapshot.val());
          this.showDeckModal = true; // Show modal if decks are found
        } else {
          // Redirect to Deck Creation page if no decks are found
          this.$router.push({ path: '/create-deck' });
        }
      } else {
        alert("Please log in to create a game.");
        this.$router.push({ path: '/login' });
      }
    },
    async joinGame(game) {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDecksRef = db.ref(`users/${currentUser.uid}/decks`);
        const decksSnapshot = await userDecksRef.once('value');
        if (decksSnapshot.exists()) {
          this.decks = Object.values(decksSnapshot.val());
          this.showDeckModal = true; // Show modal for deck selection on join
          this.selectedGame = game;  // Save the selected game for joining
        } else {
          // Redirect to Deck Creation page if no decks are found
          this.$router.push({ path: '/create-deck' });
        }
      } else {
        alert("Please log in to join a game.");
        this.$router.push({ path: '/login' });
      }
    },
    async selectDeck(deck) {
      this.selectedDeck = deck;
      this.showDeckModal = false;

      const currentUser = auth.currentUser;

      // Determine whether to create or join a game
      if (this.selectedGame) {
        // Join the selected game as player2 with the chosen deck
        const gameRef = db.ref(`games/${this.selectedGame.id}`);
        await gameRef.update({
          status: 'FULL',
          player2: {
            deckName: deck.deckName,
            leader: deck.leader,
            base: deck.base,
            deckList: deck.deckList,
            sideboard: deck.sideboard || null,
          }
        });
        
        // Navigate to Game view with the game ID
        this.$router.push({ path: `/game/${this.selectedGame.id}`, query: { deckId: this.selectedDeck.deckName } });
      } else if (currentUser) {
        // Create a new game with the chosen deck if no existing game is selected
        const newGameRef = db.ref('games').push();
        await newGameRef.set({
          status: 'WAITING',
          hostID: currentUser.uid,
          player1: {
            deckName: deck.deckName,
            leader: deck.leader,
            base: deck.base,
            deckList: deck.deckList,
            sideboard: deck.sideboard || null,
          }
        });
        
        // Navigate to Game view with new game ID
        this.$router.push({ path: `/game/${newGameRef.key}`, query: { deckId: this.selectedDeck.deckName } });
      }
    },
    closeModal() {
      this.showDeckModal = false;
      this.selectedGame = null; // Reset selected game when modal is closed
    }
  },
  beforeDestroy() {
    // Detach the listener when the component is destroyed
    db.ref('games').off();
  }
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border: 1px solid #ccc;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}
.modal ul {
  list-style-type: none;
  padding: 0;
}
.modal li {
  margin: 5px 0;
  display: flex;
  align-items: center;
}
.card-images {
  display: flex;
  gap: 10px;
  margin-right: 10px;
}
.card-img {
  width: 50px;
  height: auto; /* Maintain aspect ratio */
  max-height: 50px;
}
.deck-name {
  flex-grow: 1;
  text-align: left;
}
button {
  margin-top: 10px;
}
</style>
