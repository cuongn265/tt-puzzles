import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from "angularfire2";


/**
 * Generated class for the Stage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-stage',
  templateUrl: 'stage.html',
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
  
  private twisterIndex: number = 0;
  private twisterText: any = "";
  private endOfTwister: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private angularFire: AngularFire) {
    this.selectedMode = this.navParams.get('mode');

    // check if the list has been initialized
    if (this.navParams.get('twisterList') == null) {
      this.angularFire.database.list('/' + this.selectedMode).subscribe(list => {
        this.twisterList = list;
        this.twisterText = this.twisterList[this.twisterIndex].text;

        // init the userStatistics
        for( let twister of this.twisterList){
          this.userStatistics.push({
            twisterText: twister.text,
            attempts_taken: 5,
            avg_accuracy: undefined
          });
        }
      });
      //this.twister.text = this.twisterList[0].text;
      // console.log(this.twister.text);
    }

  }

  goToNextTwister(): void {
    if (this.endOfTwister) {
      // User has reach the end of Twister List
      // TODO: push to result page
      console.log("Here is your stats....");
      console.log(this.userStatistics);
      return;
    }
    else {
      this.twisterIndex++;
     
      // check if the next one is the last twister
      if (this.twisterIndex == this.twisterList.length - 1) {
        this.endOfTwister = true;
      }
      this.twisterText = this.twisterList[this.twisterIndex].text;

      // update statistics
      this.userStatistics[this.twisterIndex].twisterText = this.twisterText;
    }
  }



  // generate level depend on selected level
  ionViewDidLoad() {
    console.log(this.selectedMode);
  }

}
