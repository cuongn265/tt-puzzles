export const configuration = {
  "oxfordAPI": {
    "app_id": "a15de2d9",
    "app_key": "4408c5832a986a2dc56225655190367c",
    "requestURL": "https://od-api.oxforddictionaries.com/api/v1/entries/en/"
  },
  "bluemixAPI": {
    "username": "e4ffd813-060f-4cf2-871a-9315f0da0b73",
    "password": "jwwJA33QtCKL",
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
  "level_background": 
    [
      {
        "name": "Whirlwind",
        "img_path": "./assets/img/whirlwind_bg.jpg"
      },
       {
        "name": "Cyclone",
        "img_path": "./assets/img/cyclone_bg.jpg"
      },
       {
        "name": "Tornado",
        "img_path": "./assets/img/tornado_bg.jpg"
      }
    ]
  ,
  
  
  "pronunciation_skill_bands": [
    {
      "score": 0,
      "rate": "Troll",
      "color": "#FF2040"
    },
    {
      "score": 10,
      "rate": "Non-user",
      "color": "#FF5187"
    },
    {
      "score": 20,
      "rate": "Intermittent",
      "color": "#FF5115"
    },
    {
      "score": 30,
      "rate": "Extremely limited",
      "color": "#FFB715"
    },
    {
      "score": 40,
      "rate": "Limited",
      "color": "#EFF911"
    },
    {
      "score": 50,
      "rate": "Modest",
      "color": "#C4F911"
    },
    {
      "score": 60,
      "rate": "Competent",
      "color": "#AFDD00"
    },
    {
      "score": 70,
      "rate": "Good",
      "color": "#28DD00"
    },
    {
      "score": 80,
      "rate": "Very good",
      "color": "#2858A5"
    },
    {
      "score": 90,
      "rate": "Excellent",
      "color": "#26ADA6"
    },
    {
      "score": 100,
      "rate": "Expert",
      "color": "#6308A6"
    }

  ]
}