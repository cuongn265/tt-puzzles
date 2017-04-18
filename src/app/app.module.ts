import { OverallModule } from './../pages/overall/overall.module';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { AngularFireModule } from "angularfire2";

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { StageModule } from "../pages/stage/stage.module";

import { LevelSelectionPage } from "../pages/level-selection/level-selection";
import { LevelSelectionModule } from "../pages/level-selection/level-selection.module";

export const firebaseConfig = {
  apiKey: "AIzaSyDU7vWpWfEpYqagkmcmOEVqZDlzS0lTHt4",
  authDomain: "tongue-twister-puzzles.firebaseapp.com",
  databaseURL: "https://tongue-twister-puzzles.firebaseio.com",
  projectId: "tongue-twister-puzzles",
  storageBucket: "tongue-twister-puzzles.appspot.com",
  messagingSenderId: "633182245850"
};


@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    StageModule,
    OverallModule,
    AngularFireModule.initializeApp(firebaseConfig),
    LevelSelectionModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LevelSelectionPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
