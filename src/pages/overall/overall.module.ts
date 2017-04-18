import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OverallPage } from './overall';

@NgModule({
  declarations: [
    OverallPage,
  ],
  imports: [
    IonicPageModule.forChild(OverallPage),
  ],
  exports: [
    OverallPage
  ]
})
export class OverallModule {}
