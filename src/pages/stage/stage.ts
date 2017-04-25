import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { AngularFire } from "angularfire2";

import { StringComparisonService } from "../../services/StringComparison.service";
import { StringFormatterService } from "../../services/StringFormatter.service";
import { OxfordVocabularyService } from "../../services/OxfordVocabulary.service";
// Text to speech
import { TextToSpeech } from '@ionic-native/text-to-speech';

// Import Speech to Text
import { SpeechRecognition } from '@ionic-native/speech-recognition';

import { OverallPage } from "../overall/overall";

/**
 * Generated class for the Stage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-stage',
  templateUrl: 'stage.html'
})
export class StagePage {
  private selectedMode: any;
  // twisterList: Store twister list from server
  private twisterList: any[];

  //statisticList: Store user statistic
  private userStatistics: {
    twisterText: String,
    attempts_taken: Number,
    avg_accuracy: Number
  }[] = [];

  speechList: Array<string> = [];

  // Data
  private twisterIndex: number = 0;
  private twisterText: any = "";
  private userAnswer: String = "";


  // Counters & Flags
  private endOfTwister: boolean = false;
  private attemptsRemaining: number = 5;
  private startListening: boolean = false;




  private formattedString: String = "";
  constructor(public navCtrl: NavController, private alertCtrl: AlertController, public navParams: NavParams, private angularFire: AngularFire,
    private textToSpeech: TextToSpeech, private speechRecognition: SpeechRecognition, private stringComparisonService: StringComparisonService, private stringFormatterService: StringFormatterService, private oxfordService: OxfordVocabularyService) {
    /**
     * Perform request check
     */
    this.oxfordService.returnIPAOfString("Four furious friends fought for the bitchy phone of mine cars").then((ipaString) => {
      console.log('Here is your string');
      console.log(ipaString);
    });
    this.speechRecognition.requestPermission().then(() => { }, () => {
      let alert = this.alertCtrl.create({
        title: "Request Permission",
        message: "Denied"
      });
      alert.present();
    });
    /**
     * -------------------------------------------------------------------
     */

    /** Get Level Mode from Nav Params  */
    this.selectedMode = this.navParams.get('mode');

    // check if the list has been initialized
    if (this.navParams.get('twisterList') == null) {
      this.angularFire.database.list('/' + this.selectedMode).subscribe(list => {
        this.twisterList = list;
        this.twisterText = this.twisterList[this.twisterIndex].text;

        // init the userStatistics
        for (let twister of this.twisterList) {
          this.userStatistics.push({
            twisterText: twister.text,
            attempts_taken: 0,
            avg_accuracy: undefined
          });
        }
      });
    }
  }

  playCurrentTwister(): void {
    this.textToSpeech.speak(this.twisterText).then(() => {
      //TODO: Update User Statistic stuffs.....

    }).catch((err: any) => {
      let alert = this.alertCtrl.create({
        title: "Something happened",
        message: err
      });
      alert.present();
    })
  }

  /** Attemp twister */
  tryTwister(): void {
    // Reset userAnswer
    this.userAnswer = "";
    this.startListening = true;
    //Start the recognition process
    this.speechRecognition.startListening()
      .subscribe(
      (matches: Array<string>) => {
        this.speechList = matches;
        this.stringComparisonService.returnClosestStringMatch(this.twisterText, this.speechList).then((closestString: String) => {
          this.userAnswer = closestString;
        });

        this.startListening = false;
        // reduce attemps_remain count;
        this.attemptsRemaining--;
      },
      (err) => {
        this.startListening = false;
      }
      );

  }

  /**
   * Go to the next twister
   */
  goToNextTwister(): void {
    if (this.endOfTwister) {
      // User has reach the end of Twister List
      // TODO: push to result page
      console.log("User statistics");
      console.log(this.userStatistics);
      this.navCtrl.push(OverallPage, {
        userStatistics: this.userStatistics
      });
    }
    else {
      /** Update statistics **/
      this.userStatistics[this.twisterIndex].attempts_taken = 5 - this.attemptsRemaining;


      /**Jump to the next twister */
      this.twisterIndex++;

      // Reset attempt counter
      this.attemptsRemaining = 5;
      this.userAnswer = " ";


      // check if the next one is the last twister
      if (this.twisterIndex == this.twisterList.length - 1) {
        this.endOfTwister = true;
      }
      this.twisterText = this.twisterList[this.twisterIndex].text;
    }
  }



  // generate level depend on selected level
  ionViewDidLoad() {
    console.log(this.selectedMode);
  }

}
