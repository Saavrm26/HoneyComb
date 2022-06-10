import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
// import { getStorage } from 'https://www.gstatic.com/firebasejs/5.9.1/firebase-storage.js';
import { getStorage } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAeaHc0agHVEGNC24xd8CnZWxD-IibrE7U",
  authDomain: "honeycomb2.firebaseapp.com",
  databaseURL: "https://honeycomb2-default-rtdb.firebaseio.com",
  projectId: "honeycomb2",
  storageBucket: "honeycomb2.appspot.com",
  messagingSenderId: "129839087943",
  appId: "1:129839087943:web:7f70c218de4682ed148c62",
};

// Initialize Firebase
//   const app = initializeApp(firebaseConfig);
firebase.initializeApp(firebaseConfig);

const username = document.getElementsByClassName("prof-name")[0].innerText;

document
  .getElementById("message-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();


    //AGAR ONLY TEXT
    if (
      document.querySelector("#image").files.length == 0 &&
      document.getElementById("message-input").value != ""
    ) {

      console.log("ONLY TEXT");

      const timestamp = Date.now();
      const messageInput = document.getElementById("message-input");

      const message = messageInput.value;

      // using sightengine for moderation
      //start

      console.log(message);
      const d = new FormData();
      d.append("text", message);
      d.append("lang", "en");
      d.append("opt_countries", "us,gb,fr");
      d.append("mode", "standard");
      d.append("api_user", "45211228");
      d.append("api_secret", "UwQPeDmdHyZBgpaKLUqF");
      const moderationJSON = fetch(
        "https://api.sightengine.com/1.0/text/check.json",
        {
          method: "POST",
          body: d,
        }
      )
        .then(function (response) {
          // on success: handle response
          console.log("success");

          return response.json();
        })
        .then(function (moderationJSON) {
          //console.log(data)
          console.log(moderationJSON);
          let shouldSend = true;
          console.log(moderationJSON.personal);
          if (moderationJSON.personal.matches.length > 0) {
            shouldSend = false;
          }
          console.log(moderationJSON.profanity);
          if (moderationJSON.profanity.matches.length > 0) {
            shouldSend = false;
          }
          // end
          messageInput.value = "";

          document.getElementById("messages").scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "nearest",
          });

          window.scrollBy(0, 100);
          var flag = 0;
          // pageScroll();
          // create db collection and send in the data
          if (shouldSend == true) {
            firebase
              .database()
              .ref("messages/" + timestamp)
              .set({
                username,
                message,
                flag,
              });
          }
        })
        .catch(function (error) {
          // handle error
          console.log("error");
          if (error.response) console.log(error.response.data);
          else console.log(error.message);
        });
      // end
  }
  //Agar only image
  else if(document.querySelector("#image").files.length != 0 &&
  document.getElementById("message-input").value == ""){
    
    console.log("ONLY IMAGE");
    const file = document.querySelector("#image").files[0];
  const name = +new Date() + "-" + file.name;
  const metadata = { contentType: file.type };
  const task = ref.child(name).put(file, metadata);
  

  const timestamp = Date.now();
  task
    .then((snapshot) => snapshot.ref.getDownloadURL())
    .then((url) => {
      var flag = 1;
      firebase
        .database()
        .ref("messages/" + timestamp)
        .set({
          username,
          url,
          flag,
        });
    });

  }

  else{
    console.log("BOTH IMAGE AND TEXT");


    const messageInput = document.getElementById("message-input");
      const message = messageInput.value;

      messageInput.value = "";

    const file = document.querySelector("#image").files[0];
  const name = +new Date() + "-" + file.name;
  const metadata = { contentType: file.type };
  const task = ref.child(name).put(file, metadata);
 
  
  const timestamp = Date.now();
  task
    .then((snapshot) => snapshot.ref.getDownloadURL())
    .then((url) => {
      var flag = 2;
      firebase
        .database()
        .ref("messages/" + timestamp)
        .set({
          username,
          url,
          message,
          flag,
        });
    });

  }
  document.querySelector("#image").value = null;

});
firebase
  .database()
  .ref("messages/")
  .on("child_added", function (snapshot) {
    const snap = snapshot.val();
    
    
    if (snap.flag == 0) {
      const message = `<li class="news"><span><i>${
        username == snap.username ? "You" : snap.username
      }: </i></span>${snap.message}</li>`;
      document.getElementById("messages").innerHTML += message;
    }
     
    
    else if(snap.flag == 1){
      const message = `<li class="news"><span><i>${
        username == snap.username ? "You" : snap.username
      }: </i></span><img src="${snap.url}"></img></li>`;
      document.getElementById("messages").innerHTML += message;
    }


    else{
      const message = `<li class="news"><p><i>${
        username == snap.username ? "You" : snap.username
      }: </i>${snap.message} <br> <img src="${snap.url}"></p></li>`;
      document.getElementById("messages").innerHTML += message;
    }
  });
