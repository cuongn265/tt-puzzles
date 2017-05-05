import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

  private selectedMode: string;
  private userStatistics: {
    twisterText: string,
    attempts_taken: number,
    correctPercentage: number
  }[] = undefined;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.selectedMode = this.navParams.get('mode');
    this.userStatistics = this.navParams.get('userStatistics');
    console.log('Mode '+this.selectedMode);
    console.log('stats');
    console.log(this.userStatistics);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Overall');
  }

}
