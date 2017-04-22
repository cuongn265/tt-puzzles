import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StagePage } from './stage';
import { TextToSpeech } from "@ionic-native/text-to-speech";
import { SpeechRecognition } from "@ionic-native/speech-recognition";
import { StringComparisonService } from "../../technicals/StringComparison.service";
@NgModule({
  declarations: [
    StagePage,
  ],
  imports: [
    IonicPageModule.forChild(StagePage),
  ],
  exports: [
    StagePage
  ],
  providers: [TextToSpeech, SpeechRecognition, StringComparisonService]
})
export class StageModule { }
