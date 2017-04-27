import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { AngularFire } from "angularfire2";

import { StringComparisonService } from "../../services/StringComparison.service";
import { StringFormatterService } from "../../services/StringFormatter.service";
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
    twisterText: string,
    attempts_taken: number,
    avg_accuracy: number
  }[] = [];

  speechList: Array<string> = [];

  // Data
  private twisterIndex: number = 0;
  private twisterText: string = "";


  private formattedAnswer: {
    wordString: string,
    ipaString: string,
    correctPercentage: number
  } = {
    wordString: undefined,
    ipaString: undefined,
    correctPercentage: 0
  }

  private userAnswer: string = "";
  private percentageCounter: number = 0;
  // Counters & Flags
  private endOfTwister: boolean = false;
  private startListening: boolean = false;

  /**
   * showResult: show the format result of twister text and IPAresult
   */
  private showResult: boolean = false;



  constructor(public navCtrl: NavController, private alertCtrl: AlertController, public navParams: NavParams, private angularFire: AngularFire,
    private textToSpeech: TextToSpeech, private speechRecognition: SpeechRecognition, private stringComparisonService: StringComparisonService, private stringFormatterService: StringFormatterService) {
    /**
     * Perform request check
     */
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
    this.userAnswer = "";
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

    /* This part is especially intend for desktop coding, remove this part on finish */
    this.speechRecognition.isRecognitionAvailable().then((readyToGo: boolean) => {
      if (readyToGo == false) {

      }
    }).catch(err => {
      // Perform dummy processing from here
      this.startListening = true;
      let numberOfCharacterToKeep = Math.floor((Math.random() * this.twisterText.length / 2) + this.twisterText.length / 3);

      // simulate userAnswer
      this.userAnswer = this.twisterText.slice(0, numberOfCharacterToKeep);
      // show result
      this.stringFormatterService.returnFormattedAnswer(this.twisterText, this.userAnswer).then((formattedAnswer) => {
        this.percentageCounter = 0;
        this.formattedAnswer = formattedAnswer;
        console.log(formattedAnswer);
        this.showResult = true;

        // perform some magic effect
        let runCounterEffect = setInterval(() => {
          this.percentageCounter = Math.round((this.percentageCounter+0.47)*100)/100;
          if (this.percentageCounter >= this.formattedAnswer.correctPercentage){
            this.percentageCounter = this.formattedAnswer.correctPercentage;
            clearInterval(runCounterEffect);
          }
        }, 20);



      });




      this.startListening = false;
      this.userStatistics[this.twisterIndex].attempts_taken++;
    });
    /* ----------------------------------------------------------------------------------- */


    this.startListening = true;
    //Start the recognition process
    this.speechRecognition.startListening()
      .subscribe(
      (matches: Array<string>) => {
        this.speechList = matches;
        this.stringComparisonService.returnClosestStringMatch(this.twisterText, this.speechList).then((closestString: string) => {
          this.userAnswer = closestString;

          // show result
          this.stringFormatterService.returnFormattedAnswer(this.twisterText, this.userAnswer).then((formattedAnswer) => {
            this.formattedAnswer = formattedAnswer;
            this.showResult = true;
          })
        });

        this.startListening = false;
        this.userStatistics[this.twisterIndex].attempts_taken++;
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
      /**Jump to the next twister */
      this.twisterIndex++;
      this.percentageCounter = 0;
      this.userAnswer = " ";
      this.showResult = false;

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
