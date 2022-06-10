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
// firebase.initializeApp(firebaseConfig).getStorage();

const username = document.getElementsByClassName("prof-name")[0].innerText;


document.getElementById("crotonia-bar").addEventListener("click", function (e){
  document.getElementsByClassName("active")[0].classList.remove("active");
  document.getElementById("crotonia-bar").classList.add("active");
  console.log(document.getElementById("messages").innerText);
  document.getElementById("messages").innerText = "";

  document.getElementById("message-form").addEventListener("submit", sendMessage);

  function sendMessage(e) {
    e.preventDefault();

    // get values to be submitted
    const timestamp = Date.now();
    const messageInput = document.getElementById("message-input");
    const message = messageInput.value;

    // clear the input box
    messageInput.value = "";

    //auto scroll to bottom
    // document
    //   .getElementById("messages")
    //   .scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });

    // create db collection and send in the data
    firebase.database().ref("crotonia/" + timestamp).set({
      username,
      message,
    });
  }

  const fetchChat = firebase.database().ref("crotonia/");

  fetchChat.on("child_added", function (snapshot) {
    const messages = snapshot.val();
    const message = `<li class=${
      username === messages.username ? "sent" : "receive"
    }><span>${messages.username}: </span>${messages.message}</li>`;
    // append the message on the page
    document.getElementById("messages").innerHTML += message;
  });


})


if(document.getElementsByClassName("active")[0].innerText==" NewsFeed"){
  // console.log(document.getElementsByClassName("active")[0].innerText);
  // if(document.getElementsByClassName("active")[0].innerText===" NewsFeed") console.log(1);
document
  .getElementById("message-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    console.log(document.querySelector("#image").files.length);

    if(document.querySelector("#image").files.length==0){

    const timestamp = Date.now();
    const messageInput = document.getElementById("message-input");
    const message = messageInput.value;

    // using sightengine for moderation
    //start

    console.log(message);
    const d = new FormData();
    d.append('text', message);
    d.append('lang', 'en');
    d.append('opt_countries', 'us,gb,fr');
    d.append('mode', 'standard');
    d.append('api_user', '45211228');
    d.append('api_secret', 'UwQPeDmdHyZBgpaKLUqF');
    const moderationJSON=fetch('https://api.sightengine.com/1.0/text/check.json',{
        method:'POST',
        body: d
    }).then(function (response) {
        // on success: handle response
        console.log("success")

        return response.json();
        }).then(
            function(moderationJSON) {
                //console.log(data)
                console.log(moderationJSON)
                let shouldSend = true;
                console.log(moderationJSON.personal)
                if(moderationJSON.personal.matches.length>0){
                  shouldSend = false;
                }
                console.log(moderationJSON.profanity)
                if(moderationJSON.profanity.matches.length>0){
                  shouldSend = false;
                }
                  // end
                messageInput.value = "";

                document
                  .getElementById("messages")
                  .scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });

                window.scrollBy(0, 100);
                var flag = 0;
                // pageScroll();
                // create db collection and send in the data
                if(shouldSend==true){
                  firebase
                  .database()
                  .ref("messages/" + timestamp)
                  .set({
                    username,
                    message,
                    flag,
                  });
                }
            }
        )
        .catch(function (error) {
        // handle error
        console.log("error")
        if (error.response) console.log(error.response.data);
        else console.log(error.message);
        });
        // end
    }


  });

// document.getElementById("message-form").addEventListener("keypress", )
const ref = firebase.storage().ref();
document.getElementById("image-btn").addEventListener("click", function (e) {
  e.preventDefault();
  const file = document.querySelector("#image").files[0];
  const name = +new Date() + "-" + file.name;
  const metadata = { contentType: file.type };
  const task = ref.child(name).put(file, metadata);
  // task
  //   .then((snapshot) => snapshot.ref.getDownloadURL())
  //   .then((url) => console.log(url));
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
});

// function pageScroll() {
//   window.scrollBy(0,1);
//   scrolldelay = setTimeout(pageScroll,10);
// }

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
    } else {
      const message = `<li class="news"><span><i>${
        username == snap.username ? "You" : snap.username
      }: </i></span><img src="${snap.url}"></img></li>`;
      document.getElementById("messages").innerHTML += message;
    }
  });
}

// firebase
//   .database()
//   .ref("images/")
//   .on("child_added", function (snapshot) {
//     const messages = snapshot.val();
//     const message = `<li class="news"><span><i>${
//       username == messages.username ? "You" : messages.username
//     }: </i></span><img src="${messages.url}"></img></li>`;
//     document.getElementById("messages").innerHTML += message;
//   });

    