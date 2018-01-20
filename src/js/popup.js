// Initialize Firebase
 var config = {
   apiKey: "AIzaSyCArnG5lCzgAr1GEp7stPY6yjNOVGb4e18",
    authDomain: "sow-app.firebaseapp.com",
    databaseURL: "https://sow-app.firebaseio.com",
    storageBucket: "sow-app.appspot.com",
    messagingSenderId: "495441696193"
 };

 //This line opens up a long-lived connection to your background page.
 var port2 = chrome.runtime.connect({name:"firebase"});


  var correctCards = 0;
  var correctTrack;
  var seedsize;
  var strikesites;
  var notificationvalue;
  var notifperiod = 120;

    var studydecksize;

  var currentDeckName = "";

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




  var cards = [];
  var front = true;
  var currentCard = 0;
  correctTrack = [cards.length];
  var decks = [];

  var currentDeckId;





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

      databaseRef.ref('/users/' + uid + '/extension/studyDeckSize').once('value').then(function(snapshot) {
        studyDeckSize = snapshot.val();

      });


      port2.postMessage({theuser: user});

      databaseRef.ref('/users/' + uid + '/decks/').once('value').then(function(snapshot) {

        for (var key in snapshot.val()) {
          if (snapshot.val().hasOwnProperty(key)) {
        decks.push(snapshot.val()[key]);
    }

};
        chrome.storage.sync.set({'decks': snapshot.val()}, function() {
            // Notify that we saved.

            // console.log(cards)

          });

        console.log(decks);

      });
      var deckName = "";

      databaseRef.ref('/users/' + uid + '/extension/deckName').once('value').then(function(snapshot) {
        deckName = snapshot.val();
      });



      databaseRef.ref('/users/' + uid + '/extension/deckCards').once('value').then(function(snapshot) {


        var tesst = [];
        newSettingCards = snapshot.val();
        console.log(newSettingCards);
        if(newSettingCards == null) {
          document.getElementById('getstarted').style.display = "inline-block";
          document.getElementById('choosedeck').style.display = "inline-block";
          document.getElementById('radialsow').style.display = "none";
          document.getElementById('div1').style.display = "none";
          document.getElementById('slider3').style.display = "none";
          document.getElementById('slider').style.display = "none";



          document.getElementById('choosedeck').addEventListener("click", function(){
            chrome.tabs.create({"url":"https://sowapp.com/extension","selected":true});
            // chrome.tabs.create({url: chrome.extension.getURL('background.html')});
            console.log("Choose Deck");
          });
        } else {
          document.getElementById('getstarted').style.display = "none";
          document.getElementById('choosedeck').style.display = "none";
        }
        for (var i = 0; i < studyDeckSize; i++) {
          tesst.push(newSettingCards[i]);

        }
        chrome.storage.sync.set({'cards': tesst}, function() {
            // Notify that we saved.

            // console.log(cards)

          });
          chrome.storage.sync.get("cards", function (obj) {
      console.log(obj);
      chrome.runtime.getBackgroundPage(() => {


      });

  });




        document.getElementById('mill').style.display = "none";
        document.getElementById('settings').style.display = "flex";

        document.getElementById('radialsow').style.display = "block";

        var thetext = document.createElement("span");
        thetext.innerHTML = "<h3 id=\"dname\">" + deckName + "</h3><p id=\"introp\">Welcome to Sow. Click on the gear icon to see all settings and to switch decks.</p>";
        thetext.id = "text12"
        thetext.style.marginTop = "120px";
        thetext.style.marginBottom = "-10px";
        document.getElementById('settings').appendChild(thetext);
        if(newSettingCards == null) {
        document.getElementById('text12').style.display = "none";

        document.getElementById('div222').style.display = "none";

      }

        document.getElementById('slider').style.display = "inline-block";


        // function getNotificationFreq(notificationvalue) {
        //
        //   chrome.storage.sync.get("notificatoinfreq", function (obj) {
        //     document.getElementById('newrange').value = obj.notificatoinfreq;
        //     if(obj.notificatoinfreq == null) {
        //       document.getElementById('decksizeinput').value = 90;
        //     }
        //   });
        //
        // }

        var div222 = document.createElement("div");
        div222.id = "div222"
        div222.className = "sameline";
        document.getElementById('settings').appendChild(div222);



        chrome.storage.sync.get("extensionOn", function (obj) {
          if(obj.extensionOn == null) {
             chrome.storage.sync.set({'extensionOn': true});
             togBtn.checked = true;
          } else {
        togBtn.checked = obj.extensionOn;
        console.log(togBtn.value);
      }

      if(obj.extensionOn == false) {

      }

      });

      document.getElementById('togBtn').addEventListener("click", function() {
        chrome.storage.sync.get("extensionOn", function (obj) {

        togBtn.checked = !obj.extensionOn;
        chrome.storage.sync.set({'extensionOn': !obj.extensionOn});


      });
      });
        var newrange1 = document.createElement("input");
        newrange1.type = "radio";
        newrange1.name = "setting";
        newrange1.value = "Leisure";
        newrange1.className = "radio";
        newrange1.id = "id2";
        document.getElementById('div222').appendChild(newrange1);

        document.getElementById('id2').addEventListener("click", function() {
          chrome.storage.sync.set({'notificationfreq': 0});
            console.log("Leisure Checked")
            document.getElementById('Regular').style.borderLeft = "none";
            document.getElementById('Regular').style.borderRight = "2px solid rgba(85, 85, 85, 0.73)";
        });


        var newlabel1 = document.createElement("label");
        newlabel1.htmlFor = "id2";
        newlabel1.className = "radio";
        newlabel1.innerHTML = "Leisure"

        document.getElementById('div222').appendChild(newlabel1);




          var newrange = document.createElement("input");
          newrange.type = "radio";
          newrange.value = "Regular";
          newrange.name = "setting";
          newrange.className = "radio";
          newrange.checked = true;
          newrange.id = "id1";
          document.getElementById('div222').appendChild(newrange);

          document.getElementById('id1').addEventListener("click", function() {
            chrome.storage.sync.set({'notificationfreq': 1});
            document.getElementById('Regular').style.borderRight = "none";
            document.getElementById('Regular').style.borderLeft = "none";

          });


          var newlabel = document.createElement("label");
          newlabel.htmlFor = "id1";
          newlabel.className = "radio";
          newlabel.innerHTML = "Regular"
          newlabel.id = "Regular"

          document.getElementById('div222').appendChild(newlabel);




          var newrange2 = document.createElement("input");
          newrange2.type = "radio";
          newrange2.name = "setting";
          newrange2.value = "Cram";
          newrange2.className = "radio";
          newrange2.id = "id3";
          document.getElementById('div222').appendChild(newrange2);

          document.getElementById('id3').addEventListener("click", function() {
            chrome.storage.sync.set({'notificationfreq': 2});

            console.log("Cram Checked")
            document.getElementById('Regular').style.borderRight = "none";
            document.getElementById('Regular').style.borderLeft = "2px solid rgba(85, 85, 85, 0.73)";
          });


          var newlabel2 = document.createElement("label");
          newlabel2.htmlFor = "id3";

          newlabel2.className = "radio";
          newlabel2.innerHTML = "Cram"
          document.getElementById('div222').appendChild(newlabel2);




          chrome.storage.sync.get("notificationfreq", function (obj) {

               if(obj.notificationfreq == null) {
                 newrange1.checked = true;
                 notifperiod = 120;
               } else if(obj.notificationfreq == 0) {
                 newrange1.checked = true;
                 notifperiod = 120;


               } else if(obj.notificationfreq == 1) {
                 newrange.checked = true;
                 notifperiod = 45;
               } else if(obj.notificationfreq == 2) {
                 newrange2.checked = true;
                 notifperiod = 5;
                //  document.getElementById('Regular').style.borderLeft = "none";
                //  document.getElementById('Regular').style.borderRight = "2px solid rgba(85, 85, 85, 0.73)";
               }

               if(newrange1.checked) {
                //  document.getElementById('Regular').style.borderRight = "none";
                //  document.getElementById('Regular').style.borderLeft = "2px solid rgba(85, 85, 85, 0.73)";
                document.getElementById('Regular').style.borderLeft = "none";
                document.getElementById('Regular').style.borderRight = "2px solid rgba(85, 85, 85, 0.73)";
                console.log("Leisure Checked")
               } else if(newrange2.checked) {
                //  document.getElementById('Regular').style.borderLeft = "none";
                //  document.getElementById('Regular').style.borderRight = "2px solid rgba(85, 85, 85, 0.73)";
                console.log("Cram Checked")
                document.getElementById('Regular').style.borderRight = "none";
                document.getElementById('Regular').style.borderLeft = "2px solid rgba(85, 85, 85, 0.73)";
               }

             });




          // $('#newrange').on('input', function() {
          //   chrome.storage.sync.set({'notificatoinfreq': $(this).val()});
          // });


          //
          // var studydecksize = document.createElement("h5");
          // studydecksize.innerHTML = "Study Deck Size";
          // studydecksize.id = "studydecksize";
          // studydecksize.className = "settingsheading";
          // document.getElementById('settings').appendChild(studydecksize);
          //
          //
          //
          // function getSeedSize(seedsize) {
          //
          //   chrome.storage.sync.get("seedsize", function (obj) {
          //     document.getElementById('decksizeinput').value = obj.seedsize;
          //     if(obj.seedsize == null) {
          //       document.getElementById('decksizeinput').value = ""
          //     }
          //   });
          //
          // }
          //
          // var decksizeinput = document.createElement("input");
          // decksizeinput.type = "text";
          // decksizeinput.value = getSeedSize(seedsize);
          // decksizeinput.id = "decksizeinput";
          // document.getElementById('settings').appendChild(decksizeinput);

          // $('#decksizeinput').on('input', function() {
          //   console.log($(this).val());
          //   chrome.storage.sync.set({'seedsize': $(this).val()});
          // });
          //
          // var strikesiteheading = document.createElement("h5");
          // strikesiteheading.innerHTML = "Strike Sites";
          // strikesiteheading.id = "strikesiteheading";
          // strikesiteheading.className = "settingsheading";
          // document.getElementById('settings').appendChild(strikesiteheading);
          //
          // function getStrikeSites(strikesites) {
          //
          //   chrome.storage.sync.get("strikesites", function (obj) {
          //     document.getElementById('strikesiteinput').value = obj.strikesites;
          //     if(obj.strikesites == null) {
          //       document.getElementById('strikesiteinput').value = ""
          //     }
          //   });
          // }

          // var strikesiteinput = document.createElement("textarea");
          // strikesiteinput.value = getStrikeSites(strikesites);
          // strikesiteinput.id = "strikesiteinput";
          // document.getElementById('settings').appendChild(strikesiteinput);
          //
          // $('#strikesiteinput').on('input', function() {
          //   chrome.storage.sync.set({'strikesites': $(this).val()});
          // });

          // var currentdeckheading = document.createElement("h5");
          // currentdeckheading.innerHTML = "Current Deck";
          // currentdeckheading.id = "currentdeckheading";
          // currentdeckheading.className = "settingsheading";
          // document.getElementById('settings').appendChild(currentdeckheading);
          //
          // var currentdeck = document.createElement("p");
          // currentdeck.innerHTML = currentDeckName;
          // currentdeck.id = "currentdeck";
          // document.getElementById('settings').appendChild(currentdeck);

          var edit = document.createElement("img");
          edit.id = "gear";
          edit.src = "gear.svg";
          edit.alt = "gear pic";

          document.getElementById('settings').appendChild(edit);
          document.getElementById('gear').style.position = 'absolute';
          document.getElementById('gear').style.top = '30px';
          document.getElementById('gear').style.width = '30px';
          document.getElementById('gear').style.right = '9%';


          edit.addEventListener("click", function(){
            chrome.tabs.create({"url":"https://sowapp.com/extension","selected":true});
            // chrome.tabs.create({url: chrome.extension.getURL('background.html')});


          });




        //
        // document.getElementById('name').textContent = displayName;

  // ...
});

      // [START_EXCLUDE]


      document.getElementById('welcome').textContent = '';
      // document.getElementById('quickstart-button').remove();








      // document.getElementById('quickstart-account-details').textContent = JSON.stringify(cards, null, '  ');

      // [END_EXCLUDE]
    } else {
      // Let's try to get a Google auth token programmatically.
      // [START_EXCLUDE]
      // document.getElementById('quickstart-button').textContent = 'Sign-In';
      // document.getElementById('quickstart-button').style.top = '440px';
      // document.getElementById('quickstart-button').style.right = '185px';
      // document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
      // document.getElementById('quickstart-account-details').textContent = 'null';
      document.getElementById('welcome').innerHTML = '<div id="thewelcome">Welcome to Sow. This version isn\'t production ready. It\'s a proof on concept and prototype of our vision. Sign in to your account. Thank you for being a Beta tester. Please provide feedback.<br /><br /><strong>Sign in with the same google account that you connected to Sow the web app</strong></div>';
      // elem.style.display = "none";
      document.getElementById('mill').style.display = "inline-block";
      document.getElementById('settings').style.display = "none";





      // [END_EXCLUDE]
    }
    // document.getElementById('quickstart-button').disabled = false;
  });
  // [END authstatelistener]

  // document.getElementById('quickstart-button').addEventListener('click', startSignIn, false);
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
  // document.getElementById('quickstart-button').disabled = true;
  if (firebase.auth().currentUser) {
    firebase.auth().signOut();
  } else {
    startAuth(true);
  }
}







window.onload = function() {



  chrome.storage.sync.get("notificationfreq", function (obj) {
    initApp();

       if(obj.notificationfreq == null) {

         notifperiod = 120;
       } else if(obj.notificationfreq == 0) {

         notifperiod = 120;
       } else if(obj.notificationfreq == 1) {

         notifperiod = 45;
       } else if(obj.notificationfreq == 2) {

         notifperiod = 5;
       }
       chrome.alarms.create("Update-score", {
         periodInMinutes:notifperiod
       });

       console.log(notifperiod);
     });






  chrome.runtime.getBackgroundPage(() => {


  });


};
