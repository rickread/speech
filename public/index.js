var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent =
  SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var firstNameWords = [
  '"First Name"',
  "First",
  "Name",
  "Forename",
  "Fore",
  "Four",
  '"Fore Name"',
];
var surnameWords = [
  "Sur",
  "Surname",
  "Sir",
  '"Sir Name"',
  "Last",
  '"Last Name"',
];
var messageWords = ["Message"];

var firstNameGrammar =
  "#JSGF V1.0; grammar firstNameWords; public <firstName> = " +
  firstNameWords.join(" | ") +
  " ;";

var surnameGrammar =
  "#JSGF V1.0; grammar surnameWords; public <surname> = " +
  surnameWords.join(" | ") +
  " ;";

var messageGrammar =
  "#JSGF V1.0; grammar messageWords; public <message> = " +
  messageWords.join(" | ") +
  " ;";

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(firstNameGrammar, 1);
speechRecognitionList.addFromString(surnameGrammar, 1);
speechRecognitionList.addFromString(messageGrammar, 1);

recognition.grammars = speechRecognitionList;
recognition.continuous = true;
recognition.lang = "en-GB";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

document.body.onclick = function () {
  recognition.start();
  console.log("Speech recognition start.");
};

recognition.onresult = function (event) {
  console.log(event);
};
