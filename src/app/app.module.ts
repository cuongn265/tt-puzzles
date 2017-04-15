import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { AngularFireModule } from "angularfire2";

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LevelSelectionPage } from "../pages/level-selection/level-selection";
import { LevelSelectionModule } from "../pages/level-selection/level-selection.module";

export const firebaseConfig = {
  apiKey: "AIzaSyC5V9OYfSXu0GclHFSA9BlM9Oj3jyBY0kA",
  authDomain: "news-776a8.firebaseapp.com",
  databaseURL: "https://news-776a8.firebaseio.com",
  projectId: "news-776a8",
  storageBucket: "news-776a8.appspot.com",
  messagingSenderId: "508155161033"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
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
