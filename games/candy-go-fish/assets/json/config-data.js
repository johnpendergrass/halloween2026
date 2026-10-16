// Generated from game-config.json by _documents/codex-john-docs/sync-config.cjs.
window.CandyConfig = {
  "rules": {
    "copiesPerType": 3,
    "initialHandSize": 5
  },
  "players": {
    "human": {
      "name": "Boo",
      "portrait": "player-icons/boo.webp"
    },
    "wendy": {
      "name": "Ron",
      "displayName": "Ron +",
      "portrait": "opponent-icons/RON.webp",
      "strategy": "beginner"
    }
  },
  "playerCharacters": [
    {
      "name": "Boo",
      "portrait": "player-icons/boo.webp"
    },
    {
      "name": "Mike",
      "portrait": "player-icons/mike.webp"
    },
    {
      "name": "Sully",
      "portrait": "player-icons/sully.webp"
    }
  ],
  "opponents": [
    {
      "name": "Ron",
      "displayName": "Ron +",
      "portrait": "opponent-icons/RON.webp",
      "strategy": "beginner"
    },
    {
      "name": "Harry",
      "displayName": "Harry ++",
      "portrait": "opponent-icons/HARRY.webp",
      "strategy": "medium"
    },
    {
      "name": "Hermione",
      "displayName": "Hermione +++",
      "portrait": "opponent-icons/HERMIONE.webp",
      "strategy": "expert"
    }
  ],
  "appearance": {
    "travelMs": 650,
    "thinkingMs": 1000,
    "giftTravelMs": 1400,
    "giftEasing": "cubic-bezier(0.55, 0, 0.85, 0.55)",
    "quoteFadeMs": 250,
    "quoteHoldMs": 1000,
    "yesAutoTransferMs": 4000,
    "requestHoldMs": 900,
    "requestGiveHoldMs": 1000,
    "requestHighlightDelayMs": 500,
    "playerRequestHoldMs": 1000
  },
  "candyDisplay": {
    "emptyTransparency": 82,
    "imageScale": 150,
    "speechImageScale": 100,
    "rotationDegrees": 0,
    "fitWidthPercent": 91,
    "fitHeightPercent": 75,
    "stackOffsetVw": 0.6,
    "stackRotationDegrees": -9,
    "giftWidthVw": 22,
    "giftHeightVw": 17,
    "giftArcVw": 22,
    "giftMidScale": 1.5,
    "giftDissolveStart": 0.82
  },
  "layout": {
    "columns": 5,
    "slotOrder": [
      "hundredGrand",
      "threeMusketeers",
      "butterfinger",
      "dots",
      "lifeSaversGummies",
      "mallomars",
      "milkyWay",
      "mounds",
      "redVines",
      "snickers"
    ]
  },
  "candies": [
    {
      "id": "hundredGrand",
      "longName": "100 Grand",
      "shortName": "100 Grand",
      "image": "100Grand.png",
      "display": {
        "imageScale": 225,
        "rotationDegrees": -15
      }
    },
    {
      "id": "threeMusketeers",
      "longName": "3 Musketeers",
      "shortName": "3 Musketeers",
      "image": "3Musketeers.png",
      "display": {
        "imageScale": 225,
        "rotationDegrees": -30
      }
    },
    {
      "id": "butterfinger",
      "longName": "Butterfinger",
      "shortName": "Butterfinger",
      "image": "Butterfinger.png",
      "display": {
        "imageScale": 225,
        "rotationDegrees": -30
      }
    },
    {
      "id": "dots",
      "longName": "Dots",
      "shortName": "Dots",
      "image": "Dots.png",
      "display": {
        "rotationDegrees": -30
      }
    },
    {
      "id": "lifeSaversGummies",
      "longName": "Life Savers Gummies",
      "shortName": "Life Savers",
      "image": "LifeSaversGummies.png",
      "display": {
        "rotationDegrees": -30
      }
    },
    {
      "id": "mallomars",
      "longName": "Mallomars",
      "shortName": "Mallomars",
      "image": "Mallomars.png",
      "display": {
        "rotationDegrees": -30
      }
    },
    {
      "id": "milkyWay",
      "longName": "Milky Way",
      "shortName": "Milky Way",
      "image": "MilkyWay.png",
      "display": {
        "imageScale": 225,
        "rotationDegrees": -30
      }
    },
    {
      "id": "mounds",
      "longName": "Mounds",
      "shortName": "Mounds",
      "image": "Mounds.png",
      "display": {
        "imageScale": 225,
        "rotationDegrees": -30
      }
    },
    {
      "id": "redVines",
      "longName": "Red Vines",
      "shortName": "Red Vines",
      "image": "RedVines.png",
      "display": {
        "rotationDegrees": -30
      }
    },
    {
      "id": "snickers",
      "longName": "Snickers",
      "shortName": "Snickers",
      "image": "Snickers.png",
      "display": {
        "imageScale": 225,
        "rotationDegrees": -30
      }
    }
  ]
};
