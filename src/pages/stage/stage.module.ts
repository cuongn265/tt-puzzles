import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StagePage } from './stage';
import { TextToSpeech } from "@ionic-native/text-to-speech";
import { SpeechRecognition } from "@ionic-native/speech-recognition";

import { StringComparisonService } from "../../technicals/StringComparison.service";
import { StringFormatterService } from "../../technicals/StringFormatter.service";
import { SafeHTMLPipe } from "../../pipes/safeHTML.pipe";

import { } from "../";
@NgModule({
  declarations: [
    StagePage, SafeHTMLPipe
  ],
  imports: [
    IonicPageModule.forChild(StagePage),
  ],
  exports: [
    StagePage
  ],
  providers: [TextToSpeech, SpeechRecognition, StringComparisonService, StringFormatterService]
})
export class StageModule { }
