import firebase from 'firebase';

// Initialize Firebase
const config = {
  apiKey: "AIzaSyB2kZ6BcAcHJZ8cyM9FCCraJX9SBAlTCx0",
  authDomain: "game-of-thrones-a2824.firebaseapp.com",
  databaseURL: "https://game-of-thrones-a2824.firebaseio.com",
  projectId: "game-of-thrones-a2824",
  storageBucket: "game-of-thrones-a2824.appspot.com",
  messagingSenderId: "859563812376"
};

firebase.initializeApp(config);



export { firebase };