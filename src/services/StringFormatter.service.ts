import { Injectable } from "@angular/core";

/**
 * This service is responsible for String Formatting
 */

const CORRECT_PREFIX: String = " <span style=\"color: #50D2C2\">";
const INCORRECT_PREFIX: String = "<span style=\"color: #FF3366\">";
const SUFFIX: String = "</span>"
const IPA_SLASH: string = "<span style=\"color: #96BCBF \"> / </span>";

@Injectable()
export class StringFormatterService {
  // Save stat of each word in twister
  private wordsArrayStat: {
    text: string,
    correct: boolean,
    ipa: string
  }[] = [];

  // Request format
  private targetRequest: {
    text: string,
    ipa: string
  };

  // Response
  private formattedResponse: {
    wordString: string,
    ipaString: string,
    correctPercentage: number
  }


  private splitTargetString: any;
  private splitInputString: any;
  private splitIPAString: any;
  private formattedResult: string;
  private formattedIPAResult: string;

  private numberOfCorrectWord: number = 0;
  constructor() {

  }

  public returnFormattedAnswer(targetRequest: any, input: string): Promise<any> {
    // reset all previous data
    this.targetRequest = targetRequest;
    this.targetRequest.text = this.targetRequest.text.replace(/[,.]/g, "");
    this.numberOfCorrectWord = 0;
    this.formattedResult = " ";
    this.formattedIPAResult = " ";
    this.formattedResponse = {
      wordString: "",
      ipaString: "",
      correctPercentage: 0
    };

    this.pushWordsToWordsArrayStat(this.targetRequest);
    this.detectErrorInTargetFromInput(input);

    return new Promise((resolve, reject) => {
      // add slash to the beginning of string
      this.formattedResponse.ipaString = this.formattedResponse.ipaString.concat(IPA_SLASH);

      this.wordsArrayStat.map((word) => {
        let formattedWord: string = "";
        let formattedWordIPA: string = "";
        if (word.correct == true) {
          formattedWord = CORRECT_PREFIX + word.text + " " + SUFFIX;
          formattedWordIPA = CORRECT_PREFIX + word.ipa + " " + SUFFIX;
          this.numberOfCorrectWord++;
        }
        else {
          formattedWord = INCORRECT_PREFIX + word.text + " " + SUFFIX;
          formattedWordIPA = INCORRECT_PREFIX + word.ipa + " " + SUFFIX;
        }
        this.formattedResult = this.formattedResult.concat(formattedWord);
        this.formattedResponse.ipaString = this.formattedResponse.ipaString.concat(formattedWordIPA);
        this.formattedResponse.correctPercentage = Math.round((this.numberOfCorrectWord / this.splitTargetString.length * 100) * 100) / 100;
        this.formattedResponse.wordString = this.formattedResult;
      });
      this.formattedResponse.ipaString = this.formattedResponse.ipaString.concat(IPA_SLASH);
      resolve(this.formattedResponse);
    })
  }

  private pushWordsToWordsArrayStat(targetRequest: any): void {
    this.wordsArrayStat = [];
    this.splitTargetString = targetRequest.text.split(" ");
    this.splitIPAString = targetRequest.ipa.split(" ");

    this.splitTargetString.map((word, index) => {
      let ipa = this.splitIPAString[index];
      this.wordsArrayStat.push({
        text: word,
        correct: false,
        ipa: ipa
      });
    });
  }



  private detectErrorInTargetFromInput(input: String): void {
    this.splitInputString = input.split(" ");
    for (let comparedWord of this.splitInputString) {
      this.wordsArrayStat.map(function (word) {
        if (word.text.toLowerCase() == comparedWord.toLowerCase())
          word.correct = true;
      });
    }
  }
}

