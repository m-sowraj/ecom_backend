const firebase = require('firebase/compat/app');
require('firebase/compat/firestore');

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD_rnXd3BtoJ1drSBgUkqkc8zR6hkrLp6Y",
    authDomain: "globechemicalsllc.firebaseapp.com",
    projectId: "globechemicalsllc",
    storageBucket: "globechemicalsllc.appspot.com",
    messagingSenderId: "529379158041",
    appId: "1:529379158041:web:89c52dbe451248725c2288",
    measurementId: "G-Q0VYX5JVD0"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a Firestore instance
const primaryDbConnection = firebase.firestore();

// Export the Firestore instance for use in other parts of your app
module.exports = {primaryDbConnection};
