var frontOfcard;
var cards;
var backOfcard;
var currentCard = 0;
var front = true;
var cardId = 0;
var frontorbackind = "F";

//This line opens up a long-lived connection to your background page.
var port = chrome.runtime.connect({name:"mycontentscript"});
port.onMessage.addListener(function(message,sender){
  if(message.greeting === "hello"){
    console.log(message.greeting);
  } else {
  console.log(message.greeting);


  cards = message.greeting;

  frontOfcard = message.greeting[currentCard].front;
  backOfCard = message.greeting[currentCard].back;
  cardId = message.greeting[currentCard].cardId;

  var correctTrack = [cards.length];
  var incorrectTrack = [cards.length];




  for (var i = 0; i < cards.length; ++i) { correctTrack[i] = false; incorrectTrack[i] = false; }

  var newdiv = document.createElement("DIV");

  document.body.appendChild(newdiv);
  newdiv.id = "contentnewdiv";


  myImage = document.createElement('img');

  iconUrl = chrome.extension.getURL("LogoV2.png");
  myImage.src = iconUrl;
  myImage.id = "contentimg"
  newdiv.appendChild(myImage);

  myImage2 = document.createElement('img');

  iconUrl2 = chrome.extension.getURL("x2.svg");
  myImage2.src = iconUrl2;
  myImage2.id = "thex"
  newdiv.appendChild(myImage2);




  var fb1234 = document.createElement("DIV");
  fb1234.id = "fb1234";
  newdiv.appendChild(fb1234);


  var progressBar = document.createElement("canvas");
  progressBar.id = "pbar1234";
  newdiv.appendChild(progressBar);
  var ctx=progressBar.getContext("2d");
  ctx.lineWidth=40;

  var linelength = 300 / cards.length

  ctx.strokeStyle='#555';
  ctx.beginPath();
  ctx.moveTo(0,50);
  ctx.lineTo(linelength,50);
  ctx.stroke();



  backward = document.createElement('img');

  backwardUrl = chrome.extension.getURL("backarrow.svg");
  backward.src = backwardUrl;
  backward.id = "backward1234"
  fb1234.appendChild(backward);

  forward = document.createElement('img');

  forwardUrl = chrome.extension.getURL("forwardarrow.svg");
  forward.src = forwardUrl;
  forward.id = "forward1234"
  fb1234.appendChild(forward);




  var sowcard = document.createElement("DIV");
  newdiv.appendChild(sowcard);
  sowcard.id = "sowcard1234";

  var frontbackind = document.createElement("span");
  frontbackind.id = "frontbackind";
  frontbackind.style.fontSize = "14px";
  newdiv.appendChild(frontbackind);
  frontbackind.textContent = "F";

  var t = document.createTextNode(frontOfcard);     // Create a text node
  document.getElementById("sowcard1234").appendChild(t);

  var cx1234 = document.createElement("DIV");
  cx1234.id = "cx1234";
  newdiv.appendChild(cx1234);


  check = document.createElement('img');

  checkUrl = chrome.extension.getURL("check.svg");
  check.src = checkUrl;
  check.id = "check1234"
  cx1234.appendChild(check);


  x = document.createElement('img');

  xUrl = chrome.extension.getURL("x.svg");
  x.src = xUrl;
  x.id = "x1234"
  cx1234.appendChild(x);






  document.getElementById("thex").addEventListener("click", function(){

    var fade = { opacity: 0, transition: 'opacity 0.35s' };
        $("#contentnewdiv").css(fade).slideUp();


  });

  document.getElementById("forward1234").addEventListener("click", function(){ if(currentCard<cards.length-1){

  if(!(incorrectTrack[currentCard]) && !(correctTrack[currentCard])) {
    ctx.strokeStyle='#D8D8D8';
    ctx.beginPath();
    ctx.moveTo(linelength*(currentCard),50);
    ctx.lineTo(linelength*(currentCard+1),50);
    ctx.stroke();
  } else if(correctTrack[currentCard]) {
    ctx.strokeStyle='#A0E4B0';
    ctx.beginPath();
    ctx.moveTo(linelength*(currentCard),50);
    ctx.lineTo(linelength*(currentCard+1),50);
    ctx.stroke();
  } else if(incorrectTrack[currentCard]) {
    ctx.strokeStyle='#FA7F7F';
    ctx.beginPath();
    ctx.moveTo(linelength*(currentCard),50);
    ctx.lineTo(linelength*(currentCard+1),50);
    ctx.stroke();
  }

    currentCard = currentCard + 1;
    document.getElementById("sowcard1234").textContent = message.greeting[currentCard].front;

    document.getElementById('frontbackind').textContent = "F";
    ctx.strokeStyle='#555';
    ctx.beginPath();
    ctx.moveTo(linelength*(currentCard),50);
    ctx.lineTo(linelength*(currentCard+1),50);
    ctx.stroke();

  }});


  document.getElementById("backward1234").addEventListener("click", function(){ if(currentCard>0){

    if(!(incorrectTrack[currentCard]) && !(correctTrack[currentCard])) {
    ctx.strokeStyle='#D8D8D8';
    ctx.beginPath();
    ctx.moveTo(linelength*(currentCard),50);
    ctx.lineTo(linelength*(currentCard+1),50);
    ctx.stroke();
  } else if(correctTrack[currentCard]) {
    ctx.strokeStyle='#A0E4B0';
    ctx.beginPath();
    ctx.moveTo(linelength*(currentCard),50);
    ctx.lineTo(linelength*(currentCard+1),50);
    ctx.stroke();
  } else if(incorrectTrack[currentCard]) {
    ctx.strokeStyle='#FA7F7F';
    ctx.beginPath();
    ctx.moveTo(linelength*(currentCard),50);
    ctx.lineTo(linelength*(currentCard+1),50);
    ctx.stroke();
  }

    ctx.strokeStyle='#555';
    ctx.beginPath();
    ctx.moveTo(linelength*(currentCard),50);
    ctx.lineTo(linelength*(currentCard-1),50);
    ctx.stroke();
    document.getElementById('frontbackind').textContent = "F";
    currentCard = currentCard - 1;
    document.getElementById("sowcard1234").textContent = message.greeting[currentCard].front;



  }});

  document.getElementById("sowcard1234").addEventListener("click", function(){

    if(front){
      document.getElementById("sowcard1234").textContent = message.greeting[currentCard].back;
      document.getElementById("frontbackind").textContent = "B";
    } else {
      document.getElementById("sowcard1234").textContent = message.greeting[currentCard].front;
      document.getElementById('frontbackind').textContent = "F";
    }
    front = !front

  });

  document.getElementById("frontbackind").addEventListener("click", function(){

    if(front){
      document.getElementById("sowcard1234").textContent = message.greeting[currentCard].back;
      document.getElementById("frontbackind").textContent = "B";
    } else {
      document.getElementById("sowcard1234").textContent = message.greeting[currentCard].front;
      document.getElementById('frontbackind').textContent = "F";
    }
    front = !front

  });

  document.getElementById("check1234").addEventListener("click", function(){
    port.postMessage({check: "You got it right", thecardId: message.greeting[currentCard].cardId, thecurrentcard: message.greeting[currentCard], correct: true, cardNumber: currentCard});
    document.getElementById('frontbackind').textContent = "F";
    ctx.strokeStyle='#A0E4B0';
    ctx.beginPath();
    ctx.moveTo(linelength*(currentCard),50);
    ctx.lineTo(linelength*(currentCard+1),50);
    ctx.stroke();

    correctTrack[currentCard] = true;
    incorrectTrack[currentCard] = false;

    currentCard = currentCard + 1;
    document.getElementById("sowcard1234").textContent = message.greeting[currentCard].front;


    ctx.strokeStyle='#555';
    ctx.beginPath();
    ctx.moveTo(linelength*(currentCard),50);
    ctx.lineTo(linelength*(currentCard+1),50);
    ctx.stroke();




  });

  document.getElementById("x1234").addEventListener("click", function(){

    port.postMessage({x: "You got it wrong", thecardId: message.greeting[currentCard].cardId, thecurrentcard: message.greeting[currentCard], incorrect: true, cardNumber: currentCard});
    ctx.strokeStyle='#FA7F7F';
    ctx.beginPath();
    ctx.moveTo(linelength*(currentCard),50);
    ctx.lineTo(linelength*(currentCard+1),50);
    ctx.stroke();
    document.getElementById('frontbackind').textContent = "F";
    incorrectTrack[currentCard] = true;
    correctTrack[currentCard] = false;

    currentCard = currentCard + 1;
    document.getElementById("sowcard1234").textContent = message.greeting[currentCard].front;


    ctx.strokeStyle='#555';
    ctx.beginPath();
    ctx.moveTo(linelength*(currentCard),50);
    ctx.lineTo(linelength*(currentCard+1),50);
    ctx.stroke();








  });




  if(message.active == false) {
    document.getElementById("contentnewdiv").style.display = "none";
  }


}
});

var trans = false;

// $(document).mouseup(function (e)
// {
//     var container = $("#contentnewdiv");
//
//     if (!container.is(e.target) // if the target of the click isn't the container...
//         && container.has(e.target).length === 0) // ... nor a descendant of the container
//     {
//         if(!trans) {
//         var fade = { opacity: .55, transition: 'opacity 0.25s' };
//         var clickThrough = { pointerEvents: 'none' };
//         $("#contentnewdiv").css(fade);
//         $("#contentnewdiv").css(clickThrough);
//         trans = !trans;
//       } else {
//         var fade = { opacity: 1, transition: 'opacity 0.25s' };
//         var clickThrough = { pointerEvents: 'auto' };
//         $("#contentnewdiv").css(clickThrough);
//         $("#contentnewdiv").css(fade);
//         trans = !trans;
//       }
//
//     }
// });

$(document).keyup(function(e){
   if(e.keyCode == 27){
       // user has pressed space
       if(!trans) {
       var fade = { opacity: .55, transition: 'opacity 0.25s' };
       var clickThrough = { pointerEvents: 'none' };
       $("#contentnewdiv").css(fade);
       $("#contentnewdiv").css(clickThrough);
       trans = !trans;
     } else {
       var fade = { opacity: 1, transition: 'opacity 0.25s' };
       var clickThrough = { pointerEvents: 'auto' };
       $("#contentnewdiv").css(clickThrough);
       $("#contentnewdiv").css(fade);
       trans = !trans;
     }
   }
});








// document.getElementById("card").addEventListener("click", function(){ flipCard(cards, front, currentCard); front = !front});
