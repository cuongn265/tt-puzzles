import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from "../home/home";
import { StagePage } from "../stage/stage";



/**
 * Generated class for the LevelSelection page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-level-selection',
  templateUrl: 'level-selection.html'
})
export class LevelSelectionPage {
  private stagePage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.stagePage = StagePage;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LevelSelection');
  }
}
