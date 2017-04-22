/**
 *  String comparison Services
 */

export class StringComparisonService {

  /**Target String for the comparison */
  private targetString: any = "";
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
  public returnClosestStringMatch(target: String, input: any[]): Promise<String> {
    // reset all
    
    this.targetString = target;
    this.splitTargetString = target.split(" ");
    this.topCandidate = [];
    this.inputStat = [];
    this.inputList = input;
    this.closestString = "";


    for (let candidate of this.inputList) {
      let score = 0;
      let splitCandidateString = candidate.split(" ");
      //Find instant match
      if (candidate == target) {
        return candidate;
      }
      // it doesn't match ! => perform word by word comparison, each matched word increase one score.
      else {
        for (let i = 0; i < this.splitTargetString.length; i++) {
          if (this.splitTargetString[i] == splitCandidateString[i])
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
    return Promise.resolve(this.closestString);

    /**  */



    //return Promise.resolve(this.inputStat[index].originalString);

  }
}