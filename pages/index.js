import Head from "next/head";
import React from "react";
import { render } from "react-dom";
import styles from "../styles/Home.module.css";

const firstNameWords = [
  '"First Name"',
  "First",
  "Name",
  "Forename",
  "Fore",
  "Four",
  '"Fore Name"',
];

const surnameWords = [
  "Sur",
  "Surname",
  "Sir",
  '"Sir Name"',
  "Last",
  '"Last Name"',
];

const messageWords = ["Message"];

const firstNameGrammar =
  "#JSGF V1.0; grammar firstNameWords; public <firstName> = " +
  firstNameWords.join(" | ") +
  " ;";

const surnameGrammar =
  "#JSGF V1.0; grammar surnameWords; public <surname> = " +
  surnameWords.join(" | ") +
  " ;";

const messageGrammar =
  "#JSGF V1.0; grammar messageWords; public <message> = " +
  messageWords.join(" | ") +
  " ;";

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.recognition = null;

    this.state = {
      resultText: "",
      resultType: "",
      speechRecognitionStarted: false,
    };
  }

  beginSpeechRecognition = (e) => {
    if (!this.state.speechRecognitionStarted && this.recognition) {
      this.recognition.start();
      console.log("Speech recognition started");
    }
  };

  componentDidMount() {
    let SpeechRecognition =
      window.SpeechRecognition || window["webkitSpeechRecognition"];
    let SpeechGrammarList =
      window.SpeechGrammarList || window["webkitSpeechGrammarList"];

    this.recognition = new SpeechRecognition();

    let speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(firstNameGrammar, 1);
    speechRecognitionList.addFromString(surnameGrammar, 1);
    speechRecognitionList.addFromString(messageGrammar, 1);

    this.recognition.grammars = speechRecognitionList;
    this.recognition.continuous = true;
    this.recognition.lang = "en-GB";
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

    this.recognition.onstart = (e) => {
      this.setState({
        resultText: "",
        resultType: "",
        speechRecognitionStarted: true,
      });
    };

    this.recognition.onresult = (e) => {
      if (e.results && e.results.length) {
        let result = e.results[0][0];

        console.log("Speech found: ", result);

        if (result.confidence >= 0.6) {
          fetch("/api/hello", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ transcript: result.transcript }),
          })
            .then((res) => {
              return res.json();
            })
            .then((json) => {
              let names = json.names;

              names.forEach((name, index, arr) => {
                if (index == 0) {
                  // This is the assumed name

                  this.setState({
                    resultText: `Hey ${name}, great to speak with you :)`,
                    resultType: "result",
                    speechRecognitionStarted: true,
                  });
                } else {
                }
              });
            })
            .catch((err) => {
              console.error("Problem detecting speech!", err);

              this.setState({
                resultText:
                  "Oh no! This is embarrassing, I'm having problems helping you. Sorry about that. I'm only human ;)",
                resultType: "error",
                speechRecognitionStarted: true,
              });
            });
        } else {
          this.setState({
            resultText:
              "Whoops! I didn't quite understand that. Could you try again?",
            resultType: "query",
            speechRecognitionStarted: true,
          });
        }
      }
    };
  }

  render() {
    return (
      <div className={styles.container}>
        <Head>
          <title>Speech - Demo</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <h1 className={styles.title}>Speech Demo</h1>
          <p>Hey there! Please can you tell me your name?</p>
          <button onClick={this.beginSpeechRecognition}>Tap to speak!</button>

          <span className={this.state.resultType}>{this.state.resultText}</span>
        </main>
      </div>
    );
  }
}

export default Home;
