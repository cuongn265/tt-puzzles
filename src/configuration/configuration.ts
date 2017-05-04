export const configuration = {
  "oxfordAPI": {
    "app_id": "a15de2d9",
    "app_key": "4408c5832a986a2dc56225655190367c",
    "requestURL": "https://od-api.oxforddictionaries.com/api/v1/entries/en/"
  },
  "bluemixAPI": {
    "username": "2fb02bf0-8c20-4cc4-b842-8701132bd86f",
    "password": "bpZoBB1GgrrD",
    "requestURLPartial_prefix": "pronunciation?text=",
    "requestURL_prefix": "https://stream.watsonplatform.net/text-to-speech/api/v1/pronunciation?text=",
    "requestURL_suffix": "&format=ipa",
  },
  "sound_effects": {
    "correct": "assets/audio/correct.mp3",
    "incorrect": "assets/audio/incorrect.mp3",
    "end_game": "assets/audio/end_game.mp3"
  }
}