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

  private twisterTouched: boolean = false;
  private ignoredSkipping: boolean = false;

  /**
   * showResult: show the format result of twister text and IPA result
   */
  private showResult: boolean = false;
  private totalTwisters: number = configuration.number_of_twisters_per_round;
  

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
        dismissOnPageChange: false
      });
      dataLoading.present().catch((err) => {
        console.log(err);
      });

      this.angularFire.database.list('/' + this.selectedMode).subscribe(list => {
        this.twisterList = this.getRandomTwisters(list);
        this.vocabularyService.resolveAllTwisterIPA(this.twisterList).then((twisterList) => {
          this.twisterList = twisterList;
          this.currentTwister.text = this.twisterList[this.twisterIndex].text;
          this.currentTwister.ipa = this.twisterList[this.twisterIndex].IPA;
          dataLoading.dismiss();
        });
        // init the userStatistics
        for (let twister of this.twisterList) {
          this.userStatistics.push({
            twisterText: twister.text,
            attempts_taken: 0,
            correctPercentage: 0
          });
        }
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
      this.twisterTouched = true;
      let numberOfCharacterToKeep = Math.floor((Math.random() * this.currentTwister.text.length / 2) + this.currentTwister.text.length / 3);

      // simulate userAnswer
      this.userAnswer = this.currentTwister.text.slice(0, numberOfCharacterToKeep);

      loadingSpinner.present().then(() => {

        // load IPA of the next twister

        this.stringFormatterService.returnFormattedAnswer(this.currentTwister, this.userAnswer).then((formattedAnswer) => {
          this.formattedAnswer = formattedAnswer;

          //get the highest attempt on twister
          if (this.formattedAnswer.correctPercentage > this.userStatistics[this.twisterIndex].correctPercentage) {
            this.userStatistics[this.twisterIndex].correctPercentage = this.formattedAnswer.correctPercentage;
          }
          this.playSoundBaseOnCorrectness(this.formattedAnswer.correctPercentage);
          this.userStatistics[this.twisterIndex].attempts_taken++;
          this.startListening = false;
          this.showResult = true;
          loadingSpinner.dismiss();
        });

      });
    })

    /* ----------------------------------------------------------------------------------- */


    this.startListening = true;
    //Start the recognition process
    let options = {
      language: "en-US"
    };
    this.speechRecognition.startListening(options)
      .subscribe(
      (matches: Array<string>) => {
        this.speechList = matches;
        this.twisterTouched = true;
        loadingSpinner.present().then(() => {
          this.stringComparisonService.returnClosestStringMatch(this.currentTwister.text, this.speechList).then((closestString: string) => {
            this.twisterTouched = true;
            this.userAnswer = closestString;
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
      this.navCtrl.push(OverallPage, {
        mode: this.selectedMode,
        userStatistics: this.userStatistics
      });
    }
    else {
      /**Jump to the next twister */
      if (this.twisterTouched == false && this.ignoredSkipping == false) {
        /**
     * Create skipping twister confirmation alert
     */

        let twisterSkippingAlert = this.alertCtrl.create({
          title: "Skipping Twister",
          message: "No attempts have been made on this one so far. You will have no score for this twister, continue ?"
        });

        twisterSkippingAlert.addInput({
          type: 'checkbox',
          label: 'Don\'t show this message again ',
          value: 'true',
          checked: false
        });
        twisterSkippingAlert.addButton({
          text: 'Okay',
          handler: data => {
            if (data[0] == 'true') {
              console.log('okay, ignored !');
              this.ignoredSkipping = true;
            }
            else {
              this.ignoredSkipping = false;
            }

            // Okay, agree to skip
            this.twisterIndex++;
            this.userAnswer = " ";
            this.showResult = false;

            // check if the next one is the last twister
            if (this.twisterIndex == this.twisterList.length - 1) {
              this.endOfTwister = true;
            }
            this.twisterTouched = false;
            this.currentTwister.text = this.twisterList[this.twisterIndex].text;
            this.currentTwister.ipa = this.twisterList[this.twisterIndex].IPA;
            this.formattedAnswer.correctPercentage = 0;
          }
        });
        twisterSkippingAlert.addButton('Cancel');


        twisterSkippingAlert.present().catch((err) => {
          console.log(err);
        });
      }
      else {
        this.twisterIndex++;
        this.userAnswer = " ";
        this.showResult = false;

        // check if the next one is the last twister
        if (this.twisterIndex == this.twisterList.length - 1) {
          this.endOfTwister = true;
        }
        this.twisterTouched = false;
        this.currentTwister.text = this.twisterList[this.twisterIndex].text;
        this.currentTwister.ipa = this.twisterList[this.twisterIndex].IPA;
        this.formattedAnswer.correctPercentage = 0;
      }


    }
  }

  playSoundBaseOnCorrectness(correctnessPercentage: number) {
    if (correctnessPercentage == 100)
      this.smartAudio.play('correct');
    else {
      this.smartAudio.play('incorrect');
    }
  }


  getRandomTwisters(twisterList: any): any {
    let randomPositions: number[] = [];
    let positionIndex = -1;
    let twistersForPlay: any[] = [];
    // get a random number of twisters
    for (let i = 0; i < configuration.number_of_twisters_per_round; i++) {
      while (randomPositions.indexOf(positionIndex) > -1 || positionIndex == -1) {
        positionIndex = Math.floor((Math.random() * twisterList.length) - 1);
      }
      randomPositions.push(positionIndex);
      twistersForPlay.push(twisterList[positionIndex]);
    }
    return twistersForPlay;
  }


  // generate level depend on selected level
  ionViewDidLoad() {
  }

}
