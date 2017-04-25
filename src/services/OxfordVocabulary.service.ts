import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions } from "@angular/http";
import { configuration } from "../configuration/configuration";

import 'rxjs/add/operator/toPromise';

@Injectable()
export class OxfordVocabularyService {
  private app_id: any;
  private app_key: any;
  private OxfordBaseRequestURL: any;
  private wordArrayIPA: {
    text: string,
    ipa: string
  }[];

  constructor(private http: Http) {
    this.app_id = configuration.oxfordAPI.app_id;
    this.app_key = configuration.oxfordAPI.app_key;
    this.OxfordBaseRequestURL = configuration.oxfordAPI.requestURL;
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
    }).catch((reason) => {
      return Promise.resolve(null);
    });
  }

  private generateRequestOptions(): RequestOptions {
    let headers = new Headers({ 'Accept': 'application/json' });
    headers.append('app_id', this.app_id);
    headers.append('app_key', this.app_key);
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    return options;
  }



}