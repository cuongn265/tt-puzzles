import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from "../home/home";

/**
 * Generated class for the LevelSelection page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-level-selection',
  templateUrl: 'level-selection.html',
})
export class LevelSelectionPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LevelSelection');
  }

  goHome(){
    this.navCtrl.push(HomePage);
  }

  playMode( selectedMode: any){
    console.log('Play '+selectedMode);
  }

}
