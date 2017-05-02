import { NgModule } from '@angular/core';
import { HttpModule } from "@angular/http";
import { IonicPageModule } from 'ionic-angular';
import { StagePage } from './stage';
import { TextToSpeech } from "@ionic-native/text-to-speech";
import { SpeechRecognition } from "@ionic-native/speech-recognition";
import { NativeAudio } from "@ionic-native/native-audio";
import { SmartAudio } from "../../providers/smart-audio";

import { StringComparisonService } from "../../services/StringComparison.service";
import { StringFormatterService } from "../../services/StringFormatter.service";
import { SafeHTMLPipe } from "../../pipes/safeHTML.pipe";
import { VocabularyService } from "../../services/Vocabulary.service";
@NgModule({
  declarations: [
    StagePage, SafeHTMLPipe
  ],
  imports: [
    IonicPageModule.forChild(StagePage), HttpModule
  ],
  exports: [
    StagePage
  ],
  providers: [TextToSpeech, SpeechRecognition, NativeAudio, SmartAudio, StringComparisonService, StringFormatterService, VocabularyService]
})
export class StageModule { }
