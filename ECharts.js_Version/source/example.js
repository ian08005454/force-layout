jdata = [
  //有關係有共現
  {
    "k1": "曾國荃",
    "kg2": [{
      "v": 5,
      "k2": "曾國藩",
      "gp": 2,
      "idf": 13,
      "type": [
        "hasBrother"
      ]
    }],
    "gp": 1,
    "idf": 6
  },
  {
    "k1": "翁同龢",
    "kg2": [
      {
        "v": 1,
        "k2": "翁心存",
        "gp": 2,
        "idf": 10,
        "type": [
          "父子"
        ]
      }
    ],
    "gp": 1,
    "idf": 8
  },
  //沒共現沒定義
  {
    "k1": "曾國拉",
    "kg2": [{
      "v": 0,
      "k2": "翁同同",
      "gp": 2,
      "idf": 8,
      "type": [
        "未定義"
      ]
    }],
    "gp": 1,
    "idf": 5
  },
  //有共現沒定義
  {
    "k1": "張三",
    "kg2": [{
      "v": 5,
      "k2": "李四",
      "gp": 2,
      "idf": 0,
      "type": [
        '未定義'
      ]
    }],
    "gp": 1,
    "idf": 0
  },
//沒共現有定義
  {
    "k1": "王武",
    "kg2": [{
      "v": 0,
      "k2": "林六",
      "gp": 2,
      "idf": 4,
      "type": [
        'friend'
      ]
    }],
    "gp": 1,
    "idf": 0
  }
]