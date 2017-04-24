/**
 * This service is responsible for String Formatting
 */

const CORRECT_PREFIX: String = " <span style=\"color: chartreuse\">";
const INCORRECT_PREFIX: String = "<span style=\"color: red\">";
const SUFFIX: String = "</span>"

export class StringFormatterService {
  private inputStringWordsStat: {
    text: string,
    correct: boolean
  }[] = [];

  private splitTargetString: any;
  private splitInputString: any;
  private formattedResult: String;

  public returnFormattedAnswer(target: String, input: String): String {
    this.formattedResult = " ";
    this.pushWordsToInputStringWordsStat(input);
    this.updateWordsStatWithTarget(target);

    for (let word of this.inputStringWordsStat) {
      let formattedWord: string = "";
      if (word.correct == true) {
        formattedWord = CORRECT_PREFIX + word.text + " " + SUFFIX;
      }
      else {
        formattedWord = INCORRECT_PREFIX + word.text + " " + SUFFIX;
      }
      this.formattedResult = this.formattedResult.concat(formattedWord);
    }
    return this.formattedResult;
  }

  private pushWordsToInputStringWordsStat(input: String): void {
    this.inputStringWordsStat = [];
    this.splitInputString = input.split(" ");
    for (let word of this.splitInputString) {
      this.inputStringWordsStat.push({
        text: word,
        correct: false
      });
    }
  }

  private updateWordsStatWithTarget(target: String): void {
    this.splitTargetString = target.split(" ");
    for (let targetWord of this.splitTargetString) {
      this.inputStringWordsStat.map(function (word) {
        if (word.text == targetWord)
          word.correct = true;
      });
    }
  }
}

