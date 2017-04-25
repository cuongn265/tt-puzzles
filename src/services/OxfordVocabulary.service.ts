import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions } from "@angular/http";
import { configuration } from "../configuration/configuration";

import 'rxjs/add/operator/toPromise';

@Injectable()
export class OxfordVocabularyService {

  /**
   * Oxford Dictionary API - Auth
   */
  private app_id: any;
  private app_key: any;
  private oxfordBaseRequestURL: any;


  /**
   * Bluemix API - Auth
   */
  private bluemix_username: any;
  private bluemix_password: any;
  private bluemixBaseRequestURL_prefix: any;
  private bluemixBaseRequestURL_suffix: any;


  private wordArrayIPA: {
    text: string,
    ipa: string
  }[];

  constructor(private http: Http) {
    this.app_id = configuration.oxfordAPI.app_id;
    this.app_key = configuration.oxfordAPI.app_key;
    this.oxfordBaseRequestURL = configuration.oxfordAPI.requestURL;


    this.bluemix_username = configuration.bluemixAPI.username;
    this.bluemix_password = configuration.bluemixAPI.password;
    this.bluemixBaseRequestURL_prefix = configuration.bluemixAPI.requestURL_prefix;
    this.bluemixBaseRequestURL_suffix = configuration.bluemixAPI.requestURL_suffix;

  }

  public returnIPAOfString(inputString: string): Promise<any> {
    let arrayWordOfInput: any[] = inputString.split(" ");
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
          console.log("handled word");
          console.log(wordIPA);
        });
      });
    });

    return Promise.all(findAllWordIPA).then(() => {
      return new Promise((resolve) => {
        let ipaString: string = "";
        this.wordArrayIPA.map((word) => {
          ipaString = ipaString.concat(word.ipa).concat(' ');
        })
        resolve(ipaString);
      })
    })
  }

  private getWordIPA(word: String): Promise<any> {
    let options = this.generateRequestOptions();
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

  public getWordIPAFromBluemix(word: String): Promise<any> {
    let options = this.generateRequestOptionsForBluemix();
    return this.http.get('bluemixapi/' + this.bluemixBaseRequestURL_prefix + word + this.bluemixBaseRequestURL_suffix, options).toPromise().then((response) => {
      let responseJson = response.json();
      let wordIPA = responseJson.pronunciation;
      return Promise.resolve(wordIPA);
    });
  }



}