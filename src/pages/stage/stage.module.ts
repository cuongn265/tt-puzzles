import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StagePage } from './stage';

@NgModule({
  declarations: [
    StagePage,
  ],
  imports: [
    IonicPageModule.forChild(StagePage),
  ],
  exports: [
    StagePage
  ]
})
export class StageModule {}
