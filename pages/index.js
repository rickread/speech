import Head from "next/head";
import React from "react";
import { render } from "react-dom";
import styles from "../styles/Home.module.css";
import Speech from "../components/speech";

const nameWords = [
  '"first name"',
  "first",
  "name",
  "forename",
  "fore",
  "four",
  '"fore name"',
  '"christian name"',
  '"full name"',
  "sur",
  "surname",
  "sir",
  '"sir name"',
  "last",
  '"last name"',
];

const confirmationWords = [
  "yes",
  "yep",
  "yip",
  "sure",
  "correct",
  "affirmative",
  "'it is'",
  "'of course'",
  "'of course not'",
  "'uh huh'",
  "'ah ha'",
  "no",
  "incorrect",
  "incorrect",
  "'not correct'",
  "negative",
];

const nameGrammar =
  "#JSGF V1.0; grammar nameWords; public <name> = " +
  nameWords.join(" | ") +
  " ;";

const confirmationGrammar =
  "#JSGF V1.0; grammar confirmationWords; public <confirmation> = " +
  confirmationWords.join(" | ") +
  " ;";

const resultType = {
  nothing: "",
  result: "result",
  noMatch: "no-match",
  error: "error",
  waiting: "waiting",
};

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.recognition = null;

    this.speechResultHandler = [
      this.onNameSpeechResult,
      this.onConfirmationSpeechResult,
    ];

    this.grammars = [
      { value: nameGrammar, weight: 1 },
      { value: confirmationGrammar, weight: 1 },
    ];

    this.questions = ["What is your name?", "Is that correct?"];

    this.state = {
      heading:
        "Hello, I'm Rick Astley bot. Never gonna give you up, never gonna let you down :). Let's start with an easy question.",
      currentQuestionNumber: 0,
      resultText: "",
      resultType: resultType.nothing,
    };
  }

  onSpeechResult(e) {
    if (e.results && e.results.length) {
      let result = e.results[0][0];
      console.log("Speech found: ", result);
      if (e.results[0].isFinal) {
        this.speechResultHandler[this.state.currentQuestionNumber].call(
          this,
          result
        );
      } else {
        this.setState({
          heading: this.state.heading,
          currentQuestionNumber: this.state.currentQuestionNumber,
          resultText: result.transcript,
          resultType: resultType.waiting,
        });
      }
    }
  }

  onNameSpeechResult(result) {
    if (result.confidence >= 0.6) {
      fetch("/api/name", {
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

          if (names && names.length) {
            this.setState({
              heading: `I think I heard your name is ${names[0]}.`,
              currentQuestionNumber: this.state.currentQuestionNumber + 1,
              resultText: result.transcript,
              resultType: resultType.result,
            });
          } else {
            this.setState({
              heading: "Sorry, I'm not entirely confident I got that.",
              currentQuestionNumber: this.state.currentQuestionNumber,
              resultText: "",
              resultType: resultType.noMatch,
            });
          }
        })
        .catch((err) => {
          console.error("Problem detecting name!", err);

          this.setState({
            heading:
              "I've let you down! But I won't desert you ;). I'm having problems detecting your name. Why don't you try again?",
            currentQuestionNumber: this.state.currentQuestionNumber,
            resultText: "",
            resultType: resultType.error,
          });
        });
    } else {
      this.setState({
        heading: "Sorry, I'm not entirely confident I got that.",
        currentQuestionNumber: this.state.currentQuestionNumber,
        resultText: "",
        resultType: resultType.noMatch,
      });
    }
  }

  onConfirmationSpeechResult(e) {}

  onSpeechStart() {
    this.setState({
      heading: this.state.heading,
      currentQuestionNumber: this.state.currentQuestionNumber,
      resultText: "",
      resultType: resultType.waiting,
    });
  }

  render() {
    return (
      <div className={styles.container}>
        <Head>
          <title>Rick Astley Car Insurance</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <h1 className={styles.title}>Rick Astley Car Insurance</h1>
          <p className={styles.heading}>{this.state.heading}</p>
          <p className={styles.question}>
            {this.questions[this.state.currentQuestionNumber]}
          </p>
          <Speech
            buttonTextInitial="Tap to speak!"
            buttonTextPressed="Cancel"
            grammarList={this.grammars[this.state.currentQuestionNumber]}
            continuous={true}
            locale="en-GB"
            interimResults={true}
            onResult={this.onSpeechResult.bind(this)}
          />

          <span className={this.state.resultType}>{this.state.resultText}</span>
        </main>
      </div>
    );
  }
}

export default Home;
