function init() {
	socket = io.connect('http://192.168.3.101:3000');
	//socket.on('init', onInit);
	socket.on('response', onResponse);
}
var _id,_username,_base,_totalbet;
var d=document;
function onInit(data){
	console.log(data);
}

function onResponse(data){
	if(data._id)
		{ 
			_id=data._id;
			_username=data._name;
			console.log(_id);
			setTimeout(function(){
			if (_username=="user1") { 
				speak("waiting for player 2");
			}
			},1000);
		}
	else 
		{	speak("player 2 joined now");
			d.getElementById(_username).style.background='#ccc';
			console.log(data);
			_base=data['current_bet_amt'];
			_totalbet=data['total_bet'];
			//data['users'][0]['socket_id']==_id &&
			if(data['turn_of_player']==_username)
			 {	
			 	d.getElementById(_username).style.background='red';
			 	speak("It's your turn , speak the move");
			 }
		}
}

function emitdata(data){    
	socket.emit('response', data);
}


//--------------------- speech part ------------------------------//
var myRec = new p5.SpeechRec('en-US', parseResult); // new P5.SpeechRec object
myRec.continuous = true; // do continuous recognition
myRec.interimResults = false; // allow partial recognition (faster, less accurate)

var myVoice = new p5.Speech(); // new P5.Speech object
function setup()
{	
	myVoice.setRate(0.5);
	//myRec.onResult = parseResult; // now in the constructor
	myRec.start(); // start engine
}
function speak(text)
{	
	console.log("in speak");
	setTimeout(function() {
	myVoice.speak(text);
	}, 1000);
}
function parseResult()
{
	// recognition system will often append words into phrases.
	var mostrecentword = myRec.resultString;
	console.log(mostrecentword);
	if (mostrecentword=="play") {
		init();
		speak("Game is starting , the initial amount is 20 points");
	if(mostrecentword=="blind")
	{
		emitdata({'type':1,'_id':_id, '_name':_username,'current_bet_amt':_base});
	}
	console.log("out");
	}
}

var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;

  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = function() {
    recognizing = true;
  };

  recognition.onerror = function(event) {
    if (event.error == 'no-speech') {
      start_img.src = 'mic.gif';
      showInfo('info_no_speech');
      ignore_onend = true;
    }
    if (event.error == 'audio-capture') {
      start_img.src = 'mic.gif';
      showInfo('info_no_microphone');
      ignore_onend = true;
    }
    if (event.error == 'not-allowed') {
      if (event.timeStamp - start_timestamp < 100) {
        showInfo('info_blocked');
      } else {
        showInfo('info_denied');
      }
      ignore_onend = true;
    }
  };

  recognition.onend = function() {
    recognizing = false;
    if (ignore_onend) {
      return;
    }
    if (!final_transcript) {
      return;
    }
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
      var range = document.createRange();
      range.selectNode(document.getElementById('final_span'));
      window.getSelection().addRange(range);
    }
  };

  recognition.onresult = function(event) {
    var interim_transcript = '';
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
        console.log(event.results[i][0].transcript); 
      } else {
        interim_transcript = event.results[i][0].transcript;
      }
    }
  };

function startButton() {
  final_transcript = '';
  recognition.start();
  ignore_onend = false;
}

function stop(){
   if (recognizing) {
    recognition.stop();
    return;
   }
}