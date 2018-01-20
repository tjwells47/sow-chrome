// Initialize Firebase
 var config = {
   apiKey: "AIzaSyCArnG5lCzgAr1GEp7stPY6yjNOVGb4e18",
    authDomain: "sow-app.firebaseapp.com",
    databaseURL: "https://sow-app.firebaseio.com",
    storageBucket: "sow-app.appspot.com",
    messagingSenderId: "495441696193"
 };

  var correctCards = 0;
  var correctTrack;

 firebase.initializeApp(config);
 var databaseRef = firebase.database();







/**
 * initApp handles setting up the Firebase context and registering
 * callbacks for the auth status.
 *
 * The core initialization is in firebase.App - this is the glue class
 * which stores configuration. We provide an app name here to allow
 * distinguishing multiple app instances.
 *
 * This method also registers a listener with firebase.auth().onAuthStateChanged.
 * This listener is called when the user is signed in or out, and that
 * is where we update the UI.
 *
 * When signed in, we also authenticate to the Firebase Realtime Database.
 */
function initApp() {



  var elem = document.createElement("img");
  var elem2 = document.createElement("div");
  var cards = [];
  var front = true;
  var currentCard = 0;
  correctTrack = [cards.length]




  // Listen for auth state changes.
  // [START authstatelistener]
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {

      chrome.storage.sync.set({'user': user}, function() {
          // Notify that we saved.

          console.log(user)
        });

      // User is signed in.
      var providerData = user.providerData;
      var displayName = providerData[0].displayName;
      var email = providerData[0].email;
      var emailVerified = user.emailVerified;
      var photoURL = providerData[0].photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;



      databaseRef.ref('/users/' + uid + '/info/').once('value').then(function(snapshot) {


        cards = snapshot.val().studyCards;
        chrome.storage.sync.set({'cards': snapshot.val().studyCards}, function() {
            // Notify that we saved.

            // console.log(cards)

          });
          chrome.storage.sync.get("cards", function (obj) {
      console.log(obj);
      chrome.runtime.getBackgroundPage(() => {
        chrome.storage.sync.get("cards" ,(obj)=>{

          cardText = obj.cards[1].front;
          cards = obj.cards;
          console.log(obj.cards)

        });

      });
      console.log("Are we here");
  });

        document.getElementById('card').className = "card";

        var done = document.createElement("button");
        document.body.appendChild(done);
        done.className = "done";
        done.id = "done";
        document.getElementById('done').textContent = 'Done';




        document.getElementById("done").addEventListener("click", function(){
          document.getElementById('c').remove();
          document.getElementById('x').remove();
          document.getElementById("forward").remove();
          document.getElementById("done").remove();
          document.getElementById("backward").remove();
          done.className = "moveUp done";
          document.getElementById('frontSig').remove();
          document.getElementById('card').remove();
          var cardComplete = document.createElement("div");
          document.body.appendChild(cardComplete);
          cardComplete.className = "cardComplete";
          cardComplete.id = "cardComplete";
          cardComplete.innerHTML = 'You got '+correctCards+"/"+cards.length;


          var expl = document.createElement("span");
          document.body.appendChild(expl);
          expl.className = "expl";
          expl.id = "expl";
          expl.innerHTML = '<p>Go back to <a href="https://sowapp.com/decks" target=\"_blank\">sowapp.com</a> and click on study to generate another 7 random cards.</p>';

          console.log(correctTrack)


        });

        var counter = 0;
        for(var card in cards) {
          var elem3 = document.createElement("img");
          elem3.id = counter;
          if(counter == currentCard) {
            elem3.src = "darkdot.svg";
          } else {
            elem3.src = "dot.svg";
          }

          counter = counter + 1;
          elem3.style.display = "inline-block";
          elem3.style.width = "15px";
          document.getElementById("progressDots").appendChild(elem3);
        }

        var frontCard = document.createElement("p");


        frontCard.className = "frontOfCard";
        frontCard.id = "frontOfCard";

        var frontSig = document.createElement("span");
        frontSig.className = "frontSig";
        frontSig.id = "frontSig";



        document.getElementById("card").appendChild(frontCard);
        frontCard.textContent = cards[currentCard].front;
        document.getElementById("forward").addEventListener("click", function(){ if(currentCard<cards.length-1){
          scrollTo(document.getElementById("card"), 0, 1);
          bug = true;
          (correctTrack[currentCard]==null||bug||correctTrack[currentCard]!=="greendot.svg"||correctTrack[currentCard]!=="reddot.svg")?(document.getElementById(currentCard).src = "dot.svg"):(document.getElementById(currentCard).src = correctTrack[currentCard]);
          if(correctTrack[currentCard] == "greendot.svg" || correctTrack[currentCard] == "reddot.svg") {
            document.getElementById(currentCard).src = correctTrack[currentCard]
          }
          document.getElementById(currentCard+1).src = "darkdot.svg";
          currentCard = currentCard + 1;
          front = true;
          document.getElementById('frontSig').textContent = 'F';
          displayNewCard(cards[currentCard].front);
          bug = false;
        }});
        document.getElementById("backward").addEventListener("click", function(){ if(currentCard>0){
          scrollTo(document.getElementById("card"), 0, 1);
          (correctTrack[currentCard]==null)?(document.getElementById(currentCard).src = "dot.svg"):(document.getElementById(currentCard).src = correctTrack[currentCard]);
          document.getElementById(currentCard-1).src = "darkdot.svg";
          currentCard = currentCard - 1;
          document.getElementById('frontSig').textContent = 'F';
          front = true;
          displayNewCard(cards[currentCard].front)
          document.getElementById("frontOfCard").scrollTop = 0;
        }});
        document.getElementById("card").addEventListener("click", function(){ flipCard(cards, front, currentCard); front = !front});
        document.getElementById("c").addEventListener("click", function(){
          scrollTo(document.getElementById("card"), 0, 1);
          correctCards = correctCards + 1;
          correctTrack[currentCard] = "greendot.svg";
          if(currentCard<cards.length-1){
            document.getElementById(currentCard).src = "greendot.svg";
            document.getElementById(currentCard+1).src = "darkdot.svg";
            currentCard = currentCard + 1;
            front = true;
            document.getElementById('frontSig').textContent = 'F';
            displayNewCard(cards[currentCard].front);
          } else {
            completeStudying(true, currentCard, correctCards, cards.length);
          }
        });
        document.getElementById("x").addEventListener("click", function(){
          scrollTo(document.getElementById("card"), 0, 1);
          correctTrack[currentCard] = "reddot.svg";
          if(currentCard<cards.length-1){
            document.getElementById(currentCard).src = "reddot.svg";
            document.getElementById(currentCard+1).src = "darkdot.svg";
            currentCard = currentCard + 1;
            front = true;
            document.getElementById('frontSig').textContent = 'F';
            displayNewCard(cards[currentCard].front);
          } else {
            completeStudying(false, currentCard);
            displayNewCard(cards[currentCard].front);
            front = true;
          }
        });
        document.getElementById("frontOfCard").addEventListener("click", function(){ flipCard(cards, front, currentCard); front = !front});
        document.getElementById('mill').style.display = "none";
        document.body.appendChild(frontSig);
        document.getElementById("frontOfCard").style.cursor = "pointer";
        document.getElementById('frontSig').textContent = 'F';
        //
        // document.getElementById('name').textContent = displayName;

  // ...
});

      // [START_EXCLUDE]

      document.getElementById('quickstart-button').textContent = 'Sign out';
      document.getElementById('welcome').textContent = '';


      elem.src = photoURL;
      elem.style.display = "inline";
      elem.style.borderRadius = "100%";
      elem.className = "profilephoto";
      elem.setAttribute("alt", "Photo");
      document.getElementById("profilephoto").appendChild(elem);
      document.getElementById("checkorx").style.display="inline-block";
      document.getElementById("frontback").style.display="flex";






      // document.getElementById('quickstart-account-details').textContent = JSON.stringify(cards, null, '  ');

      // [END_EXCLUDE]
    } else {
      // Let's try to get a Google auth token programmatically.
      // [START_EXCLUDE]
      document.getElementById('quickstart-button').textContent = 'Sign-In';
      // document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
      // document.getElementById('quickstart-account-details').textContent = 'null';
      document.getElementById('welcome').innerHTML = '<div id="thewelcome">Welcome to Sow. This version isn\'t production ready. It\'s a proof on concept and prototype of our vision. Sign in to your account. Thank you for being a Beta tester. Please provide feedback.</div>';
      // elem.style.display = "none";
      document.getElementById('mill').style.display = "inline-block";
      document.getElementById("checkorx").style.display="none";
      document.getElementById("frontback").style.display="none";
      document.getElementById("progressDots").style.display="none";

      document.getElementById('card').classList.remove("card");
          document.getElementById('frontOfCard').remove();
          document.getElementById('frontSig').remove();
          document.getElementById("profilephoto").remove();


      // [END_EXCLUDE]
    }
    document.getElementById('quickstart-button').disabled = false;
  });
  // [END authstatelistener]

  document.getElementById('quickstart-button').addEventListener('click', startSignIn, false);
}

/**
 * Start the auth flow and authorizes to Firebase.
 * @param{boolean} interactive True if the OAuth flow should request with an interactive mode.
 */
function startAuth(interactive) {
  // Request an OAuth token from the Chrome Identity API.
  chrome.identity.getAuthToken({interactive: !!interactive}, function(token) {
    if (chrome.runtime.lastError && !interactive) {
      console.log('It was not possible to get a token programmatically.');
    } else if(chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    } else if (token) {
      // Authrorize Firebase with the OAuth Access Token.
      var credential = firebase.auth.GoogleAuthProvider.credential(null, token);
      firebase.auth().signInWithCredential(credential).catch(function(error) {
        // The OAuth token might have been invalidated. Lets' remove it from cache.
        if (error.code === 'auth/invalid-credential') {
          chrome.identity.removeCachedAuthToken({token: token}, function() {
            startAuth(interactive);
          });
        }
      });
    } else {
      console.error('The OAuth Token was null');
    }
  });
}

/**
 * Starts the sign-in process.
 */
function startSignIn() {
  document.getElementById('quickstart-button').disabled = true;
  if (firebase.auth().currentUser) {
    firebase.auth().signOut();
  } else {
    startAuth(true);
  }
}

function displayNewCard(newFront){

  document.getElementById("frontOfCard").innerHTML=newFront;
}

function flipCard(cards, front, currentCard){



  if(front) {
    document.getElementById("frontOfCard").innerHTML=cards[currentCard].back
    document.getElementById('frontSig').textContent = 'B';
  } else {
    document.getElementById("frontOfCard").innerHTML=cards[currentCard].front
    document.getElementById('frontSig').textContent = 'F';
  }
}

function scrollTo(element, to, duration) {
        if (duration < 0) return;
        var difference = to - element.scrollTop;
        var perTick = difference / duration * 2;

    setTimeout(function() {
        element.scrollTop = element.scrollTop + perTick;
        scrollTo(element, to, duration - 2);
    }, 10);
}

function completeStudying(correct, currentCard, correctCards, thelength){
  if(correct) {
    document.getElementById(currentCard).src = "greendot.svg";
  } else {
    document.getElementById(currentCard).src = "reddot.svg";
  }



}

window.onload = function() {
  initApp();

  chrome.alarms.create("Update-score", {
    periodInMinutes:10
  });
  chrome.storage.sync.set({'settings': {interval: 60000}}, function() {
      // Notify that we saved.


    });
    chrome.storage.sync.get("settings", function (obj) {
console.log(obj);
});
  chrome.runtime.getBackgroundPage(() => {


  });
};
