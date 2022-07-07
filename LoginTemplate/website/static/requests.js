import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyArAd2bmZvSI9DjNA56xFwNivNWm3dTz2M",
  authDomain: "honeycomb-8451f.firebaseapp.com",
  projectId: "honeycomb-8451f",
  storageBucket: "honeycomb-8451f.appspot.com",
  messagingSenderId: "503364608959",
  appId: "1:503364608959:web:cba5ad91270e92f34d770a",
  measurementId: "G-2XNP6083TK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// query selection
const actionAdd= document.querySelector('#add');
const actionRemove= document.querySelector('#remove')
const selectClubs= document.querySelector('#select-clubs');
const removeClubs=document.querySelector('#remove-clubs');
let folder='Add';

actionAdd.addEventListener('click',()=>{
  console.log('inside add')

  // selecting folder
  folder='Add';

  //making add active
  selectClubs.classList.remove('inactive');
  removeClubs.classList.add('inactive');
});

actionRemove.addEventListener('click',()=>{
  console.log('inside remove')

  // selecting folder
  folder='Remove'
``
  //making remove active
  selectClubs.classList.add('inactive');
  removeClubs.classList.remove('inactive');
});

