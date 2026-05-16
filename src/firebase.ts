import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCDl-_3cOFq94iF5nxlzNTN0CT88BjRSp0",
  authDomain: "vintage-nepal.firebaseapp.com",
  projectId: "vintage-nepal",
  storageBucket: "vintage-nepal.firebasestorage.app",
  messagingSenderId: "816289463594",
  appId: "1:816289463594:web:2c5039e0bdf0a90801b253",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;