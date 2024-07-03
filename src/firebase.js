import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

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
export const auth = getAuth(app);
 