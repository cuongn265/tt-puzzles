import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LevelSelectionPage } from './level-selection';

@NgModule({
  declarations: [
    LevelSelectionPage
  ],
  imports: [
    IonicPageModule.forChild(LevelSelectionPage),
  ],
  exports: [
    LevelSelectionPage
  ]
})
export class LevelSelectionModule {}
