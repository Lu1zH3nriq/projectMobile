
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyCFiuJi8rCN0BvN8-P9A0LlVHYARCJvbl4",
  authDomain: "apppiunipam-luiz.firebaseapp.com",
  projectId: "apppiunipam-luiz",
  storageBucket: "apppiunipam-luiz.appspot.com",
  messagingSenderId: "847191776294",
  appId: "1:847191776294:web:57b7de13a6421c66e89ae7"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
export default appFirebase;