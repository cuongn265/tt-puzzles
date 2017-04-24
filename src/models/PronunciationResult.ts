export class PronunciationResult {
  metadata: {
    provider: String
  };
  result: [{
    id: String,
    language: String,
    lexicalEntries: [{
      language: String,
      lexicalCategory: String,
      pronunciations: [{
        audioFile: String,
        dialects: [{}],
        phoneticNotation: String,
        phoneticSpelling: String
      }],
      text: String
    }],
    type: String,
    word: String
  }]
}