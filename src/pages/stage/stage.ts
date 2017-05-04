import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

import { AngularFire } from "angularfire2";

import { StringComparisonService } from "../../services/StringComparison.service";
import { StringFormatterService } from "../../services/StringFormatter.service";
import { VocabularyService } from "../../services/Vocabulary.service";
// Text to speech
import { TextToSpeech } from '@ionic-native/text-to-speech';

// Import Speech to Text
import { SpeechRecognition } from '@ionic-native/speech-recognition';

// Import SmartAudio for sound effect
import { SmartAudio } from "../../providers/smart-audio";


import { OverallPage } from "../overall/overall";

import { configuration } from "../../configuration/configuration";

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
  private twisterList: {
    text: string,
    IPA: string
  }[];

  //statisticList: Store user statistic
  private userStatistics: {
    twisterText: string,
    attempts_taken: number,
    correctPercentage: number
  }[] = [

  ];

  speechList: Array<string> = [];

  // Data
  private twisterIndex: number = 0;

  private currentTwister: {
    text: string,
    ipa: string
  } = {
    text: undefined,
    ipa: undefined
  }

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
  // Counters & Flags
  private endOfTwister: boolean = false;
  private startListening: boolean = false;


  /**
   * showResult: show the format result of twister text and IPA result
   */
  private showResult: boolean = false;



  constructor(public navCtrl: NavController, private alertCtrl: AlertController, private loadingCtrl: LoadingController, public navParams: NavParams, private angularFire: AngularFire,
    private textToSpeech: TextToSpeech, private speechRecognition: SpeechRecognition, private smartAudio: SmartAudio, private stringComparisonService: StringComparisonService,
    private stringFormatterService: StringFormatterService, private vocabularyService: VocabularyService) {
    /**Preload Audio files */
    smartAudio.preload('correct', configuration.sound_effects.correct);
    smartAudio.preload('incorrect', configuration.sound_effects.incorrect);

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
    //check if the list has been initialized
    if (this.twisterList == undefined) {
      /* Data loading spinner */
      let dataLoading = loadingCtrl.create({
        content: 'Preparing twisters, please wait...',
        dismissOnPageChange: true
      });
      dataLoading.present().catch((err)=> {
        console.log(err);
      });

      this.angularFire.database.list('/' + this.selectedMode).subscribe(list => {
        this.twisterList = list;
        this.currentTwister.text = this.twisterList[this.twisterIndex].text;
        // init the userStatistics
        for (let twister of this.twisterList) {
          this.userStatistics.push({
            twisterText: twister.text,
            attempts_taken: 0,
            correctPercentage: 0
          });
        }
        /*Dismiss loading */
        dataLoading.dismiss().catch((err)=> {
          console.log(err);
        });
      });
    }
  }

  playCurrentTwister(): void {
    this.textToSpeech.speak(this.currentTwister.text).then(() => {
      //TODO: Update User Statistic stuffs.....

    }).catch((err: any) => {
      let alert = this.alertCtrl.create({
        title: "Something happened",
        message: err
      });
      alert.present();
    });
  }

  /** Attemp twister */
  tryTwister(): void {
    let loadingSpinner = this.loadingCtrl.create({
      content: 'Checking your answer... '
    });
    /* This part is especially intend for desktop coding, remove this part on finish */
    this.speechRecognition.isRecognitionAvailable().then((readyToGo: boolean) => {
      if (readyToGo == false) {

      }
    }).catch(err => {
      // Perform dummy processing from here
      this.startListening = true;
      let numberOfCharacterToKeep = Math.floor((Math.random() * this.currentTwister.text.length / 2) + this.currentTwister.text.length / 3);

      // simulate userAnswer
      this.userAnswer = this.currentTwister.text.slice(0, numberOfCharacterToKeep);

      loadingSpinner.present().then(() => {
        if (this.currentTwister.ipa == undefined) {
          this.vocabularyService.returnIPAOfString(this.currentTwister.text).then((IPA) => {
            this.currentTwister.ipa = IPA;
            // show result
            this.stringFormatterService.returnFormattedAnswer(this.currentTwister, this.userAnswer).then((formattedAnswer) => {
              this.formattedAnswer = formattedAnswer;
              this.userStatistics[this.twisterIndex].correctPercentage = this.formattedAnswer.correctPercentage;
              this.playSoundBaseOnCorrectness(this.formattedAnswer.correctPercentage);
              this.userStatistics[this.twisterIndex].attempts_taken++;
              this.startListening = false;
              this.showResult = true;
              // Play audio effect

            });
            loadingSpinner.dismiss();
          });
        }
        else {
          // show result
          this.stringFormatterService.returnFormattedAnswer(this.currentTwister, this.userAnswer).then((formattedAnswer) => {
            this.formattedAnswer = formattedAnswer;
            this.userStatistics[this.twisterIndex].correctPercentage = this.formattedAnswer.correctPercentage;
            this.playSoundBaseOnCorrectness(this.formattedAnswer.correctPercentage);
            this.userStatistics[this.twisterIndex].attempts_taken++;
            this.startListening = false;
            this.showResult = true;
            loadingSpinner.dismiss();
          });
        }
      });
    })

    /* ----------------------------------------------------------------------------------- */


    this.startListening = true;
    //Start the recognition process
    this.speechRecognition.startListening()
      .subscribe(
      (matches: Array<string>) => {
        this.speechList = matches;
        loadingSpinner.present().then(() => {
          this.stringComparisonService.returnClosestStringMatch(this.currentTwister.text, this.speechList).then((closestString: string) => {
            this.userAnswer = closestString;
            /* GET the ipa of sentence */
            if (this.currentTwister.ipa == undefined) {
              this.vocabularyService.returnIPAOfString(this.currentTwister.text).then((IPA) => {
                this.currentTwister.ipa = IPA;
                this.stringFormatterService.returnFormattedAnswer(this.currentTwister, this.userAnswer).then((formattedAnswer) => {
                  this.formattedAnswer = formattedAnswer;
                  this.userStatistics[this.twisterIndex].correctPercentage = this.formattedAnswer.correctPercentage;
                  this.playSoundBaseOnCorrectness(this.formattedAnswer.correctPercentage);
                  this.userStatistics[this.twisterIndex].attempts_taken++;
                  this.startListening = false;
                  this.showResult = true;
                });
                loadingSpinner.dismiss();
              });
            }
            else {
              this.stringFormatterService.returnFormattedAnswer(this.currentTwister, this.userAnswer).then((formattedAnswer) => {
                this.formattedAnswer = formattedAnswer;
                this.userStatistics[this.twisterIndex].correctPercentage = this.formattedAnswer.correctPercentage;
                this.playSoundBaseOnCorrectness(this.formattedAnswer.correctPercentage);
                this.userStatistics[this.twisterIndex].attempts_taken++;
                this.startListening = false;
                this.showResult = true;
                loadingSpinner.dismiss();
              });
            }
          });
        });
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
      this.userAnswer = " ";
      this.showResult = false;

      // check if the next one is the last twister
      if (this.twisterIndex == this.twisterList.length - 1) {
        this.endOfTwister = true;
      }
      this.currentTwister.text = this.twisterList[this.twisterIndex].text;
      this.currentTwister.ipa = undefined;
      this.formattedAnswer.correctPercentage = 0;
    }
  }

  playSoundBaseOnCorrectness(correctnessPercentage: number) {
    if (correctnessPercentage == 100)
      this.smartAudio.play('correct');
    else {
      this.smartAudio.play('incorrect');
    }
  }


  // generate level depend on selected level
  ionViewDidLoad() {
    console.log(this.selectedMode);
  }

}
