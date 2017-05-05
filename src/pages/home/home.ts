import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LevelSelectionPage } from "../level-selection/level-selection";
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {
  }

  playGame () {
    this.navCtrl.push(LevelSelectionPage);
  }
}
