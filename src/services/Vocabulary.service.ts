import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions } from "@angular/http";
import { configuration } from "../configuration/configuration";
import { Platform } from "ionic-angular";


import 'rxjs/add/operator/toPromise';

@Injectable()
export class VocabularyService {

  /**
   * Oxford Dictionary API - Auth
   */
  private inputString: string = "";
  private app_id: any;
  private app_key: any;
  private oxfordBaseRequestURL: any;


  /**
   * Bluemix API - Auth
   */
  private bluemix_username: any;
  private bluemix_password: any;
  private bluemixPartialBaseRequestURL_prefix: any;
  private bluemixBaseRequestURL_prefix: any;
  private bluemixBaseRequestURL_suffix: any;


  private wordArrayIPA: {
    text: string,
    ipa: string
  }[];

  private twisterList: {
    text: string,
    IPA: string
  }[];

  constructor(private http: Http, private platform: Platform) {
    this.app_id = configuration.oxfordAPI.app_id;
    this.app_key = configuration.oxfordAPI.app_key;
    this.oxfordBaseRequestURL = configuration.oxfordAPI.requestURL;


    this.bluemix_username = configuration.bluemixAPI.username;
    this.bluemix_password = configuration.bluemixAPI.password;
    this.bluemixPartialBaseRequestURL_prefix = configuration.bluemixAPI.requestURLPartial_prefix;
    this.bluemixBaseRequestURL_prefix = configuration.bluemixAPI.requestURL_prefix
    this.bluemixBaseRequestURL_suffix = configuration.bluemixAPI.requestURL_suffix;

  }


  public resolveAllTwisterIPA(twisterList: any): Promise<any> {
    this.twisterList = twisterList;
    let findAllIPAofTwister = this.twisterList.map((twister) => {
      return new Promise((resolve, reject) => {
        this.getIPAOfStringFromBluemixWatson(twister.text).then((IPA) => {
          twister.IPA = IPA;
          resolve();
        }).catch((err) => {
          reject(err);
        })
      })
    });

    return Promise.all(findAllIPAofTwister).then(() => {
      return Promise.resolve(this.twisterList);
    });
  }

  public returnIPAOfString(inputString: string): Promise<any> {
    this.inputString = inputString.replace(/[,.]/g, "");
    let arrayWordOfInput: any[] = this.inputString.split(" ");
    this.wordArrayIPA = [];

    arrayWordOfInput.map((word) => {
      this.wordArrayIPA.push({
        text: word,
        ipa: undefined
      })
    });

    let findAllWordIPA = this.wordArrayIPA.map((word) => {
      return new Promise((resolve) => {
        this.getWordIPA(word.text).then(wordIPA => {
          word.ipa = wordIPA;
          resolve(wordIPA);
        });
      });
    });

    return Promise.all(findAllWordIPA).then(() => {
      return new Promise((resolve) => {
        let ipaString: string = "";
        this.wordArrayIPA.map((word) => {
          ipaString = ipaString.concat(word.ipa).concat(' ');
        });
        resolve(ipaString);
      })
    })
  }

  private getIPAOfStringFromBluemixWatson(inputString: string): Promise<any> {
    let input: string = inputString.replace(/[,.]/g, "");
    input = input.replace(/ /g, "+");

    return new Promise((resolve, reject) => {
      this.getWordIPAFromBluemix(input).then((ipa) => {
        resolve(ipa);
      }).catch((err) => {
        console.error(err);
        reject();
      });
    });
  }

  private getWordIPA(word: String): Promise<any> {
    let options = this.generateRequestOptions();
    if (word == '') {
      return Promise.resolve('');
    }
    if (this.platform.is('core')) {
      return this.http.get('oxfordapi/' + word + '/pronunciations', options).toPromise().then(response => {
        let word = response.json();

        // hard coded !!!!
        //TODO: better parse the response to PronunciationResult class, and call a returnWordIPA inside that class shit to get the ipa
        let wordIPA = word.results[0].lexicalEntries[0].pronunciations[0].phoneticSpelling;
        return Promise.resolve(wordIPA);
      }, err => {
        return new Promise((resolve) => {
          this.getWordIPAFromBluemix(word).then((wordIPA) => {
            return Promise.resolve(wordIPA);
          }).then((wordIPA) => {
            wordIPA = wordIPA.substring(1);
            resolve(wordIPA);
          });
        })
      });
    }
    else {
      return this.http.get(this.oxfordBaseRequestURL + word + '/pronunciations', options).toPromise().then(response => {
        let word = response.json();

        // hard coded !!!!
        //TODO: better parse the response to PronunciationResult class, and call a returnWordIPA inside that class shit to get the ipa
        let wordIPA = word.results[0].lexicalEntries[0].pronunciations[0].phoneticSpelling;
        return Promise.resolve(wordIPA);
      }, err => {
        return new Promise((resolve) => {
          this.getWordIPAFromBluemix(word).then((wordIPA) => {
            return Promise.resolve(wordIPA);
          }).then((wordIPA) => {
            wordIPA = wordIPA.substring(1);
            resolve(wordIPA);
          });
        })
      });
    }
  };

  private generateRequestOptions(): RequestOptions {
    let headers = new Headers({ 'Accept': 'application/json' });
    headers.append('app_id', this.app_id);
    headers.append('app_key', this.app_key);
    let options = new RequestOptions({ headers: headers });
    return options;
  }

  private generateRequestOptionsForBluemix(): RequestOptions {
    let headers = new Headers({ 'Accept': 'application/json' });
    headers.append("Authorization", "Basic " + btoa(this.bluemix_username + ":" + this.bluemix_password));
    let options = new RequestOptions({ headers: headers });
    return options;
  }

  private getWordIPAFromBluemix(word: String): Promise<any> {
    let options = this.generateRequestOptionsForBluemix();
    /**
     * Use proxy setting if the target device is Desktop
     */
    if (this.platform.is('core')) {
      return this.http.get('bluemixapi/' + this.bluemixPartialBaseRequestURL_prefix + word + this.bluemixBaseRequestURL_suffix, options).toPromise().then((response) => {
        let responseJson = response.json();
        let wordIPA:string = responseJson.pronunciation;
        wordIPA = wordIPA.replace(/[.]/g, "");
        return Promise.resolve(wordIPA);
      });
    }
    else {
      return this.http.get(this.bluemixBaseRequestURL_prefix + word + this.bluemixBaseRequestURL_suffix, options).toPromise().then((response) => {
        let responseJson = response.json();
        let wordIPA: string = responseJson.pronunciation;
        wordIPA = wordIPA.replace(/[.]/g, "");
        return Promise.resolve(wordIPA);
      });
    }
  }



}