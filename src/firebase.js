import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// const provider = new GoogleAuthProvider();

const app = initializeApp({
    apiKey: process.env.REACT_APP_FIRESTORE_APIKEY,
    authDomain: process.env.REACT_APP_FIRESTORE_AUTHDOMAIN,
    databaseURL: process.env.REACT_APP_FIRESTORE_DATABASEURL,
    projectId: process.env.REACT_APP_FIRESTORE_PROJECTID,
    storageBucket: process.env.REACT_APP_FIRESTORE_STORAGEBUCKET,
    messagingSenderId: process.env.REACT_APP_FIRESTORE_MESSAGESENDERID,
    appId: process.env.REACT_APP_FIRESTORE_APPID,
    measurementId: process.env.REACT_APP_FIRESTORE_MEASUREMENTID
});

export const db = getFirestore(app);

//const auth = getAuth(app);

// signInWithPopup(auth, provider)
// .then((result) => {
//   // This gives you a Google Access Token. You can use it to access the Google API.
//   const credential = GoogleAuthProvider.credentialFromResult(result);
//   //setToken(credential.accessToken);
//   // The signed-in user info.
//   //setUser(result.user)

//   console.log(result)
// }).catch((error) => {
//   // Handle Errors here.
//   const errorCode = error.code;
//   const errorMessage = error.message;
//   // The email of the user's account used.
//   const email = error.customData.email;
//   // The AuthCredential type that was used.
//   const credential = GoogleAuthProvider.credentialFromError(error);
//   // ...
// });
