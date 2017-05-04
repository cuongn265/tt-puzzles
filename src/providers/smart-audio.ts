import { Injectable } from '@angular/core';
import { Platform } from "ionic-angular";
import { NativeAudio } from "@ionic-native/native-audio";
import 'rxjs/add/operator/map';

/*
  Generated class for the SmartAudio provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class SmartAudio {

  audioType: string = 'html5';
  sounds: any = [];

  constructor(public nativeAudio: NativeAudio, private platform: Platform) {
    if (platform.is('cordova')) {
      this.audioType = 'native';
    }
  }

  // unload(key: any){
  //   if(this.audioType === 'html5'){
  //     let audio = {

  //     }
  //   }
  // }
  preload(key: any, asset: any) {
    if (this.audioType === 'html5') {
      let audio = {
        key: key,
        asset: asset,
        type: 'html5'
      };
      console.log('preloaded');
      this.sounds.push(audio);
    }
    else {
      this.nativeAudio.preloadSimple(key, asset).catch((err) => {
        console.log(err);
      });

      let audio = {
        key: key,
        asset: key,
        type: 'native'
      };
      this.sounds.push(audio);
    }
  }

  unload(key: any){
    this.nativeAudio.unload(key).catch((err)=> {
      console.log(err);
    })
  }

  play(key: any) {
    let audio = this.sounds.find((sound) => {
      return sound.key === key;
    });

    if (audio.type === 'html5') {
      console.log('play song on desktop');
      let audioAsset = new Audio(audio.asset);
      audioAsset.play();

    } else {
      console.log('play song on native');
      this.nativeAudio.play(audio.asset).then((res) => {
        console.log(res);
      }, (err) => {
        console.log(err);
      });
    }
  }
}
