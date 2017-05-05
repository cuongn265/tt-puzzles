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
  },
  "number_of_twisters_per_round": 10,
  "pronunciation_skill_bands": [
    {
      "score": 0,
      "rate": "Troll"
    },
    {
      "score": 10,
      "rate": "Non-user"
    },
    {
      "score": 20,
      "rate": "Intermittent"
    },
    {
      "score": 30,
      "rate": "Extremely limited"
    },
    {
      "score": 40,
      "rate": "Limited"
    },
    {
      "score": 50,
      "rate": "Modest"
    },
    {
      "score": 60,
      "rate": "Competent"
    },
    {
      "score": 70,
      "rate": "Good"
    },
    {
      "score": 80,
      "rate": "Very good"
    },
    {
      "score": 90,
      "rate": "Excellent"
    },
    {
      "score": 100,
      "rate": "Expert"
    }

  ]
}