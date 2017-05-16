/**
 *  String comparison Services
 */
export class StringComparisonService {

  /**Target String for the comparison */
  private targetString: string = "";
  private splitTargetString: any;
  /** List of String for comparison  */
  private inputList: any[] = [];

  private inputStat: {
    originalString: String,
    array: any,
    score: Number
  }[] = [];

  private topCandidate: String[] = [];

  private closestString: String = "";

  /**
   * Return the closest string to the target string
   * @param target : Target String for comparison
   * @param input : List of string to find the best that match the target
   */
  public returnClosestStringMatch(target: string, input: any[]): Promise<String> {
    
    // reset all
    this.targetString = target.replace(/[,.]/g, "");
    console.log(this.targetString);
    console.log('Input');
    console.log(input);
    console.log('User answer');
    console.log(input);
    this.splitTargetString =  this.targetString.split(" ");
    this.topCandidate = [];
    this.inputStat = [];
    this.inputList = input;
    this.closestString = "";


    for (let candidate of this.inputList) {
      let score = 0;
      let splitCandidateString = candidate.split(" ");
      //Find instant match
      if (candidate.toLowerCase() == this.targetString.toLowerCase()) {
        return Promise.resolve(candidate);
      }
      // it doesn't match ! => perform word by word comparison, each matched word increase one score.
      else {
        for (let i = 0; i < splitCandidateString.length; i++) {
          // break the loop if candidate word is the last
          if(this.splitTargetString[i] == undefined || splitCandidateString[i] == undefined){
            break;
          }
          if (this.splitTargetString[i].toLowerCase() == splitCandidateString[i].toLowerCase())
            score++;
        }

        // after the loop, push its stat into the inputStat
        this.inputStat.push({
          originalString: candidate,
          array: splitCandidateString,
          score: score
        });
      }
    }

    /** Get strings with the highest index score, and return */
    let max: number = -Infinity;
    let index = 0;
    for (let j = 0; j < this.inputStat.length; j++) {
      if (this.inputStat[j].score > max) {
        max = +this.inputStat[j].score;
        index = j;
      }
    }

    /** Pick out the list of string which has the highest score */
    for (let j = 0; j < this.inputStat.length; j++) {
      if (this.inputStat[j].score == max)
        this.topCandidate.push(this.inputStat[j].originalString);
    }
    this.closestString = this.inputStat[index].originalString;
    console.log('Closest string: '+this.closestString);
    return Promise.resolve(this.closestString);
  }
}