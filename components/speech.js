import React from "react";
import { render } from "react-dom";
import styles from "../styles/Speech.module.css";

class Speech extends React.Component {
  constructor(props) {
    super(props);

    this.recognition = null;

    this.state = {
      speechRecognitionStarted: false,
      buttonText: props.buttonTextInitial,
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

    if (this.props.grammar) {
      speechRecognitionList.addFromString(
        this.props.grammar.value,
        this.props.grammar.weight
      );
    }

    this.recognition.grammars = speechRecognitionList;
    this.recognition.continuous = this.props.continuous;
    this.recognition.lang = this.props.locale ?? "en-GB";
    this.recognition.interimResults = this.props.interimResults;
    this.recognition.maxAlternatives = this.props.maxAlternatives ?? 1;

    // Setup events
    this.recognition.onstart = (e) => {
      this.setState({
        speechRecognitionStarted: true,
        buttonText: this.props.buttonTextPressed,
      });

      if (this.props.onstart) {
        this.props.onstart();
      }
    };

    this.recognition.onresult = (e) => {
      if (this.props.onResult) {
        this.props.onResult(e);
      }
    };
  }

  render() {
    let listening;

    if (this.state.speechRecognitionStarted) {
      listening = (
        <div className={styles.speech}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      );
    }

    return (
      <div>
        <button
          aria-label={this.state.buttonText}
          aria-pressed={this.state.speechRecognitionStarted}
          onClick={this.beginSpeechRecognition}
        >
          {this.state.buttonText}
        </button>
        {listening}
      </div>
    );
  }
}

export default Speech;
