'use strict'
const firebaseConfig = {
  apiKey: "AIzaSyArAd2bmZvSI9DjNA56xFwNivNWm3dTz2M",
  authDomain: "honeycomb-8451f.firebaseapp.com",
  projectId: "honeycomb-8451f",
  storageBucket: "honeycomb-8451f.appspot.com",
  messagingSenderId: "503364608959",
  appId: "1:503364608959:web:cba5ad91270e92f34d770a",
  measurementId: "G-2XNP6083TK",
};

// Initialize Firebase and Firestore
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const username = document.getElementsByClassName("prof-name")[0].innerText;
let clubs='|news|Students';

function splitVals(){
  let arr=[];
  let str='';
  for(let i=1;i<clubs.length;i++){
    let chr=clubs.charAt(i);
    if(chr=='|'){
      arr.push(str);
      str='';
      continue;
    }
    str+=chr;
  }
  return arr;
}

let fetchDetails = async function(){
    arr=[];
    let ref= db.collection(`Final`)
    await ref.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let obj=doc.data();
        if(obj['username']===username){
          clubs+=obj['clubs'];
        }
      });
      console.log(arr);
      approveAddRequestArray=document.querySelectorAll('.approve-add-request');
      console.log(approveAddRequestArray);
    });
  }

let displayClubs = () =>{
  let clubList=document.querySelectorAll('.list-items');
  let arr=splitVals();
  clubList.forEach(club => {
    if(!arr.includes(club.name)){
      club.classList.add('inactive');
    }
  });
}
displayClubs();
