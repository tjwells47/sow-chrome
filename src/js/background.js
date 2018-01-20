var cardText = "";
var cards;
var allcards;
var newSettingCards;
var decks = [];
var randCount = 0;
var tesst = [];
var deckCardsRef;
var checkpress;
var studydecksize;

var config = {
  apiKey: "AIzaSyCArnG5lCzgAr1GEp7stPY6yjNOVGb4e18",
   authDomain: "sow-app.firebaseapp.com",
   databaseURL: "https://sow-app.firebaseio.com",
   storageBucket: "sow-app.appspot.com",
   messagingSenderId: "495441696193"
};

var shoulditdisplay = null;
chrome.storage.sync.get(null, function (obj) {
  console.log(obj)
})

var myNotificationID = null;







chrome.alarms.onAlarm.addListener(function( alarm ) {
  chrome.storage.sync.get(null ,(obj)=>{
    if(obj.extensionOn == true) {
      console.log("Alarm time");
    chrome.notifications.create({
     type: "basic",
     title: "What is a (are)...",
     message: obj.cards[0].front,
     contextMessage: "Click the appropriate button below.",
     iconUrl: "sowlog.png",
     buttons: [{
              title: rightButton
          }, {
              title: "I don't know that"
          }]
    })
  }
  });
//   chrome.storage.sync.get("extensionOn", function (obj2) {
//   if(obj2.extensionOn == true) {
//
//
//
//   chrome.storage.sync.get("cards" ,(obj)=>{
//     console.log("Alarm Should Go Off");
//     chrome.notifications.create({
//      type: "basic",
//      title: "What is (are)...",
//      message: obj.cards[0].front,
//      contextMessage: "Click the appropriate button below.",
//      iconUrl: "sowlog.png",
//      buttons: [{
//               title: rightButton
//           }, {
//               title: "I don't know that"
//           }]
//     }, function(id) {
//         myNotificationID = id;
//         console.log("Notification Created")
//     })
//   });
// }
// });
});

chrome.notifications.onButtonClicked.addListener(function(notifId, btnIdx) {

        if (btnIdx === 0) {
          chrome.storage.sync.get("cards" ,(obj)=>{
          checkpress = checkpress + 1;
          var thepercent = checkpress / newSettingCards.length;
          chrome.storage.sync.set({'percent': Math.round(100*thepercent)/100}, function() {
              console.log(Math.round(100*thepercent)/100)
            });

          newSettingCards.splice(0, 1);
          newSettingCards.push(obj.cards[0]);
          tesst = [];
          databaseRef.ref('/users/' + uid + '/extension/studyDeckSize').once('value').then(function(snapshot) {
            studyDeckSize = snapshot.val();

          });
          for (var i = 0; i < studyDeckSize; i++) {
            tesst.push(newSettingCards[i]);
          }

          firebase.database().ref('/users/' + uid + '/extension/deckCards').set(newSettingCards);


          });
            chrome.storage.sync.set({'cards': tesst}, function() {
                console.log(tesst);
              });
              chrome.notifications.clear(notifId);
        } else if (btnIdx === 1) {
            console.log("You said you didn't know the card");
              chrome.notifications.clear(notifId);
        }


});




firebase.initializeApp(config);
var databaseRef = firebase.database();

var providerData;
var displayName;
var email;
var emailVerified;
var photoURL;
var isAnonymous;
var uid;

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    providerData = user.providerData;
    displayName = providerData[0].displayName;
    email = providerData[0].email;
    emailVerified = user.emailVerified;
    photoURL = providerData[0].photoURL;
    isAnonymous = user.isAnonymous;
    uid = user.uid;
    console.log(uid);
    deckCardsRef = firebase.database().ref('/users/' + uid + '/extension/deckCards');
    deckNameRef = firebase.database().ref('/users/' + uid + '/extension/deckName');
    databaseRef.ref('/users/' + uid + '/extension/studyDeckSize').once('value').then(function(snapshot) {
      studyDeckSize = snapshot.val();

    });

    deckNameRef.on('value', function(snapshot) {
      chrome.storage.sync.set({'percent': 0});
    });




    deckCardsRef.on('value', function(snapshot) {
      tesst = [];
      newSettingCards = snapshot.val();
      databaseRef.ref('/users/' + uid + '/extension/studyDeckSize').once('value').then(function(snapshot) {
        studyDeckSize = snapshot.val();

      });
      for (var i = 0; i < studyDeckSize; i++) {
        tesst.push(newSettingCards[i]);

      }

      chrome.storage.sync.set({'cards': tesst}, function() {
          // Notify that we saved.


        });
    });


      checkpress = 0;

  } else {
    // No user is signed in.
  }
});










startAuth(true);








var rightButton = "I know that";
var val = 90000;

chrome.runtime.onConnect.addListener(function(port) {

  console.assert(port.name == "mycontentscript");
  port.onMessage.addListener(function(msg) {
    console.log("User being sent ")
    console.log(msg);
    if(msg.incorrect == true) {
      console.log("I pressed x")

    } else if(msg.correct == true) {
      checkpress = checkpress + 1;
      var thepercent = checkpress / newSettingCards.length;
      chrome.storage.sync.set({'percent': Math.round(100*thepercent)/100}, function() {
          console.log(Math.round(100*thepercent)/100)
        });
      console.log("I pressed the check")
      var idofcard;
      for (var xxx of newSettingCards) {
        if(xxx.cardId == msg.thecardId) {
          idofcard = newSettingCards.indexOf(xxx);
          newSettingCards.splice(idofcard, 1);
        }
      }
      msg.thecurrentcard.correct[0] = true;
      msg.thecurrentcard.incorrect[0] = false;
      console.log(msg.thecurrentcard);
      newSettingCards.push(msg.thecurrentcard);
      tesst = [];
      databaseRef.ref('/users/' + uid + '/extension/studyDeckSize').once('value').then(function(snapshot) {
        studyDeckSize = snapshot.val();

      });
      for (var i = 0; i < studyDeckSize; i++) {
        tesst.push(newSettingCards[i]);
      }
      chrome.storage.sync.set({'cards': tesst}, function() {
          console.log(tesst);
        });
      firebase.database().ref('/users/' + uid + '/extension/deckCards').set(newSettingCards);
      databaseRef.ref('/users/' + uid + '/cards').once('value').then(function(snapshot) {
        var allofthecards = snapshot.val();
        Object.keys(allofthecards).forEach(key => {
            if(msg.thecurrentcard.cardId == allofthecards[key].cardId) {
              allofthecards[key].correct[0] = true;
              allofthecards[key].incorrect[0] = false;
            }  // the value of the current key.
        });


        firebase.database().ref('/users/' + uid + '/cards').set(allofthecards);

      });

    }
    providerData = msg.theuser.providerData;
    displayName = providerData[0].displayName;
    email = providerData[0].email;
    emailVerified = msg.theuser.emailVerified;
    photoURL = providerData[0].photoURL;
    isAnonymous = msg.theuser.isAnonymous;
    uid = msg.theuser.uid;
    var i = 0;
    var j = 0;




  });
});




chrome.runtime.onConnect.addListener(function(port) {

  console.assert(port.name == "firebase");
  port.onMessage.addListener(function(msg) {



  databaseRef.ref('/users/' + uid + '/extension/deckCards').once('value').then(function(snapshot) {

    tesst = [];
    newSettingCards = snapshot.val();
    console.log("Asked firebase for current cards and this is what we got")
    console.log(newSettingCards);
    databaseRef.ref('/users/' + uid + '/extension/studyDeckSize').once('value').then(function(snapshot) {
      studyDeckSize = snapshot.val();

    });
    for (var i = 0; i < studyDeckSize; i++) {
      tesst.push(newSettingCards[i]);

    }

    chrome.storage.sync.set({'cards': tesst}, function() {
        // Notify that we saved.
        console.log("Cards being saved to the storage api")
        console.log(cards)

      });

    });





  });



});

chrome.runtime.onConnect.addListener(function(port){



  console.log("Port Listener Runs")
  chrome.storage.sync.get("cards" ,(obj)=>{

    cardText = obj.cards[1].front;
    cards = obj.cards;
    console.log("Cards got from chrome storage api")
    console.log(obj.cards)

  });

  tesst = [];
  databaseRef.ref('/users/' + uid + '/extension/studyDeckSize').once('value').then(function(snapshot) {
    studyDeckSize = snapshot.val();
    for (var i = 0; i < studyDeckSize; i++) {
      tesst.push(newSettingCards[i]);
    }

  }).then(function() {
    chrome.storage.sync.get("extensionOn", function (obj) {
    if(obj.extensionOn == null) {
      port.postMessage({greeting:tesst, active: true});
    } else {
      port.postMessage({greeting:tesst, active: obj.extensionOn});
    }
    console.log(obj.extensionOn);


  });
  });




  console.log(randCount)
  randCount = randCount + 1
});


function startAuth(interactive) {
  // Request an OAuth token from the Chrome Identity API.
  console.log("start auth");
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
