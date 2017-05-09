import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { configuration } from "../../configuration/configuration";
import { LevelSelectionPage } from "../level-selection/level-selection";
/**
 * Generated class for the Overall page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-overall',
  templateUrl: 'overall.html',
})
export class OverallPage {

  private averageUserCorrectionPercentage: number = 0;
  private conqueredTwisters: number = 0;

  private userRate: {
    text: string,
    color: string
  } = {
    text: "",
    color: ""
  };
  private selectedMode: string;
  private userStatistics: {
    twisterText: string,
    attempts_taken: number,
    correctPercentage: number
  }[] = undefined;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.selectedMode = this.capitalizedTwisterModeTitle(this.navParams.get('mode'));
    this.userStatistics = this.navParams.get('userStatistics');
    console.log('User stats');
    console.log(this.userStatistics);
    /* Update stats and score stuffs*/
    this.averageUserCorrectionPercentage = this.calculateOverallScoreBand(this.userStatistics);
    this.conqueredTwisters = this.returnConqueredTwisters(this.userStatistics);
    this.userRate = this.getRateOnOverallScoreBand(this.averageUserCorrectionPercentage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Overall');
  }


  private returnConqueredTwisters(stats: any): number {
    let conqueredTwister: number = 0;
    stats.map(function (stat) {
      if (stat.correctPercentage == 100)
        conqueredTwister++;
    })
    return conqueredTwister;
  }

  private calculateOverallScoreBand(stats: any): number {
    let sumPercentage = 0;
    stats.map(function (stat) {
      sumPercentage += stat.correctPercentage;
    });

    let averageScore = Math.round((sumPercentage / configuration.number_of_twisters_per_round) * 100) / 100;
    //sumPercentage / configuration.number_of_twisters_per_round;

    console.log('Score: ' + averageScore);
    //let adjustedScore = Math.round((sumPercentage / configuration.number_of_twisters_per_round) / 10) * 10;
    return averageScore;
  }

  private getRateOnOverallScoreBand(averageScore: number): {
    text: string,
    color: string
  } {
    let rate: {
      text: string,
      color: string
    } = {
      text: "",
      color: ""
    }
    let adjustedScore = Math.round(averageScore / 10) * 10;
    console.log('Adjusted Score: ' + adjustedScore);
    for (let scoreBand of configuration.pronunciation_skill_bands) {
      if (adjustedScore === scoreBand.score) {
        rate.text = scoreBand.rate;
        rate.color = scoreBand.color
        return rate;
      }
    }
  }


  private capitalizedTwisterModeTitle(mode: string): string {
    return mode.charAt(0).toUpperCase() + mode.slice(1);
  }

  private replayLevel() {
    this.navCtrl.pop();
  }

  private goToLevelSelection() {
    this.navCtrl.push(LevelSelectionPage);
  }

  private goToResultInDetail() {

  }
}
