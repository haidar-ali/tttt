
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBjuZp0Jiwh7ax95Y2Xob5hmwVBcJEHYRA",
  authDomain: "swu-start.firebaseapp.com",
  databaseURL: "https://swu-start-default-rtdb.firebaseio.com",
  projectId: "swu-start",
  storageBucket: "swu-start.firebasestorage.app",
  messagingSenderId: "965223572059",
  appId: "1:965223572059:web:1153bf4e158512c952957e",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();
export { auth, db };
