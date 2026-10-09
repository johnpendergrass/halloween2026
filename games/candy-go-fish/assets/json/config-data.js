// Generated from game-config.json by codex-john-docs/sync-config.cjs.
window.CandyConfig = {
  "rules": {
    "copiesPerType": 3,
    "initialHandSize": 5
  },
  "players": {
    "human": {
      "name": "Player",
      "portrait": "friendly-ghost.svg"
    },
    "wendy": {
      "name": "Wendy",
      "portrait": "friendly-witch.svg"
    }
  },
  "appearance": {
    "travelMs": 650,
    "thinkingMs": 1000,
    "giftPulseMs": 480,
    "giftTravelMs": 1400,
    "giftEasing": "cubic-bezier(0.55, 0, 0.85, 0.55)"
  },
  "candyDisplay": {
    "emptyTransparency": 82,
    "imageScale": 150,
    "rotationDegrees": 0,
    "fitWidthPercent": 91,
    "fitHeightPercent": 75,
    "stackOffsetVw": 0.6,
    "stackRotationDegrees": -9,
    "giftWidthVw": 22,
    "giftHeightVw": 17,
    "giftArcVw": 22,
    "giftPulseScale": 1.14,
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
      "name": "100 Grand",
      "image": "100Grand.png",
      "display": {
        "imageScale": 225,
        "rotationDegrees": -15
      }
    },
    {
      "id": "threeMusketeers",
      "name": "3 Musketeers",
      "image": "3Musketeers.png",
      "display": {
        "imageScale": 225,
        "rotationDegrees": -30
      }
    },
    {
      "id": "butterfinger",
      "name": "Butterfinger",
      "image": "Butterfinger.png",
      "display": {
        "imageScale": 225,
        "rotationDegrees": -30
      }
    },
    {
      "id": "dots",
      "name": "Dots",
      "image": "Dots.png"
    },
    {
      "id": "lifeSaversGummies",
      "name": "Life Savers Gummies",
      "image": "LifeSaversGummies.png"
    },
    {
      "id": "mallomars",
      "name": "Mallomars",
      "image": "Mallomars.png"
    },
    {
      "id": "milkyWay",
      "name": "Milky Way",
      "image": "MilkyWay.png",
      "display": {
        "imageScale": 225,
        "rotationDegrees": -30
      }
    },
    {
      "id": "mounds",
      "name": "Mounds",
      "image": "Mounds.png",
      "display": {
        "imageScale": 225,
        "rotationDegrees": -30
      }
    },
    {
      "id": "redVines",
      "name": "Red Vines",
      "image": "RedVines.png"
    },
    {
      "id": "snickers",
      "name": "Snickers",
      "image": "Snickers.png",
      "display": {
        "imageScale": 225,
        "rotationDegrees": -30
      }
    }
  ]
};
