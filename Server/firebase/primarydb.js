const firebase = require('firebase/compat/app');
require('firebase/compat/firestore');

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC8NBV8SAz1zR7JTkgdiZ5xfwtrPc-0sYA",
    authDomain: "kioskbillbuddy.firebaseapp.com",
    databaseURL: "https://kioskbillbuddy-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "kioskbillbuddy",
    storageBucket: "kioskbillbuddy.appspot.com",
    messagingSenderId: "282967025495",
    appId: "1:282967025495:web:7c91b451831ee4bc974012",
    measurementId: "G-XPFDE6ZBLF"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a Firestore instance
const primaryDbConnection = firebase.firestore();

// Export the Firestore instance for use in other parts of your app
module.exports = {primaryDbConnection};
