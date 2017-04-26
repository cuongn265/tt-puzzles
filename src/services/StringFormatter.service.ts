import { VocabularyService } from "./Vocabulary.service";
import { Injectable } from "@angular/core";
/**
 * This service is responsible for String Formatting
 */

const CORRECT_PREFIX: String = " <span style=\"color: chartreuse\">";
const INCORRECT_PREFIX: String = "<span style=\"color: red\">";
const SUFFIX: String = "</span>"

@Injectable()
export class StringFormatterService {
  private wordsArrayStat: {
    text: string,
    correct: boolean,
    ipa: string
  }[] = [];

  private formattedResponse: {
    wordString: string,
    ipaString: string
  }

  private splitTargetString: any;
  private splitInputString: any;
  private splitIPAString: any;
  private formattedResult: string;
  private formattedIPAResult: string;

  constructor(private vocabularyService: VocabularyService) {

  }


  public returnFormattedAnswer(target: string, input: string): Promise<any> {
    this.formattedResult = " ";
    this.formattedIPAResult = " ";
    this.formattedResponse = {
      wordString: "",
      ipaString: ""
    };

    this.pushWordsToWordsArrayStat(target);
    this.detectErrorInTargetFromInput(input);

    return new Promise((resolve) => {
      this.updateIPAofWordInWordsArrayStat(target).then((wordsArrayStat) => {
        for (let word of this.wordsArrayStat) {
          let formattedWord: string = "";
          let formattedWordIPA: string = "";
          if (word.correct == true) {
            formattedWord = CORRECT_PREFIX + word.text + " " + SUFFIX;
            formattedWordIPA = CORRECT_PREFIX + word.ipa + " " + SUFFIX;
          }
          else {
            formattedWord = INCORRECT_PREFIX + word.text + " " + SUFFIX;
            formattedWordIPA = INCORRECT_PREFIX + word.ipa + " " + SUFFIX;
          }
          this.formattedResult = this.formattedResult.concat(formattedWord);
          this.formattedIPAResult = this.formattedIPAResult.concat(formattedWordIPA);
        }
        this.formattedResponse.wordString = this.formattedResult;
        this.formattedResponse.ipaString = this.formattedIPAResult;
        resolve(this.formattedResponse);
      })
    });
  }

  private updateIPAofWordInWordsArrayStat(target: string): Promise<any> {
    return new Promise((resolve) => {
      this.vocabularyService.returnIPAOfString(target).then((IPAString: string) => {
        this.splitIPAString = IPAString.split(" ");
        for (let i = 0; i < this.splitTargetString.length; i++) {
          this.wordsArrayStat[i].ipa = this.splitIPAString[i];
        }
        resolve(this.wordsArrayStat);
      });
    });
  }

  private pushWordsToWordsArrayStat(target: String): void {
    this.wordsArrayStat = [];
    this.splitTargetString = target.split(" ");
    for (let word of this.splitTargetString) {
      this.wordsArrayStat.push({
        text: word,
        correct: false,
        ipa: undefined
      });
    }
  }

  private detectErrorInTargetFromInput(input: String): void {
    this.splitInputString = input.split(" ");
    for (let comparedWord of this.splitInputString) {
      this.wordsArrayStat.map(function (word) {
        if (word.text == comparedWord)
          word.correct = true;
      });
    }
  }
}

