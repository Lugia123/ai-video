// 由 publish/build.py 从 clips.json 生成。
window.__clipLibrary = {
 "character": "beret-girl",
 "version": 1,
 "canvas": {
  "w": 832,
  "h": 1104
 },
 "anchor": {
  "x": 416,
  "y": 999,
  "note": "脚底中点；呼吸绕这一点缩放"
 },
 "breath": {
  "amp": 0.006,
  "period": 3.6
 },
 "moveSeconds": 0.8,
 "mouthShapes": [
  "closed",
  "small",
  "big",
  "smile"
 ],
 "talk": {
  "pattern": [
   [
    "small",
    0.1
   ],
   [
    "big",
    0.14
   ],
   [
    "small",
    0.08
   ],
   [
    "closed",
    0.08
   ],
   [
    "big",
    0.16
   ],
   [
    "smile",
    0.14
   ],
   [
    "small",
    0.1
   ],
   [
    "closed",
    0.1
   ],
   [
    "small",
    0.08
   ],
   [
    "big",
    0.14
   ],
   [
    "small",
    0.1
   ],
   [
    "smile",
    0.16
   ],
   [
    "closed",
    0.12
   ],
   [
    null,
    0.6
   ]
  ]
 },
 "blink": {
  "period": 3.2,
  "closed": 0.13,
  "offset": 1.4
 },
 "headTrackRefs": {
  "eyeL": [
   313.9,
   441.4
  ],
  "eyeR": [
   509.5,
   439.3
  ],
  "mouth": [
   410.7,
   491.2
  ],
  "nose": [
   408.7,
   465.3
  ],
  "pin": [
   547.3,
   299.6
  ]
 },
 "headTrackBasis": "idle",
 "rest": "idle",
 "tier": "draft-blank",
 "note": "空脸片段库：片段里没有画五官（faceBlank），脸全由贴片画（默认脸 / 表情脸 / 口型 / 眨眼）。 ｜ 成品页用的库（publish/build.py）：clips-2p + clips-2p-new:clap_s1、clips-2p-new:stepbeat_s1、clips-2p-new-fix:hips_s1_fix，去掉 wave_b1_final、shrug_b1_final_s1、wave_h1_canny、think_h1_canny、wave_h1_mid_canny",
 "poses": {
  "idle": {
   "label": "归位（空脸）",
   "frame": "frames/idle.webp",
   "bbox": [
    183,
    137,
    649,
    1000
   ],
   "margin": [
    183,
    137,
    183,
    104
   ],
   "patches": {
    "align": {
     "scale": 0.3403,
     "rotate_deg": -0.45,
     "translate": [
      43.2,
      79.9
     ],
     "matches": 84,
     "inliers": 60,
     "residual_px": 0.79,
     "alignedFrom": "clips-b1"
    },
    "mouth": {
     "closed": {
      "file": "patches/idle/mouth_closed.webp",
      "rect": [
       370,
       470,
       82,
       57
      ],
      "color_shift_rgb": [
       4.0,
       7.0,
       10.0
      ],
      "skin_samples": 992,
      "occluded_px": 0
     },
     "small": {
      "file": "patches/idle/mouth_small.webp",
      "rect": [
       370,
       470,
       82,
       57
      ],
      "color_shift_rgb": [
       4.0,
       7.0,
       10.0
      ],
      "skin_samples": 992,
      "occluded_px": 0
     },
     "big": {
      "file": "patches/idle/mouth_big.webp",
      "rect": [
       370,
       470,
       82,
       57
      ],
      "color_shift_rgb": [
       4.0,
       7.0,
       10.0
      ],
      "skin_samples": 992,
      "occluded_px": 0
     },
     "smile": {
      "file": "patches/idle/mouth_smile.webp",
      "rect": [
       370,
       470,
       82,
       57
      ],
      "color_shift_rgb": [
       4.0,
       7.0,
       10.0
      ],
      "skin_samples": 992,
      "occluded_px": 0
     }
    },
    "blink": {
     "file": "patches/idle/blink.webp",
     "rect": [
      283,
      383,
      258,
      100
     ],
     "color_shift_rgb": [
      3.0,
      5.0,
      7.0
     ],
     "skin_samples": 2029,
     "occluded_px": 0
    },
    "clean": {
     "file": "patches/idle/clean.webp",
     "rect": [
      283,
      355,
      258,
      172
     ],
     "color_shift_rgb": [
      4.0,
      6.0,
      9.0
     ],
     "skin_samples": 3209,
     "occluded_px": 0
    },
    "dfltMouth": {
     "closed": {
      "file": "patches/idle/mouth_closed_dflt.webp",
      "rect": [
       370,
       470,
       82,
       57
      ],
      "color_shift_rgb": [
       4.0,
       8.0,
       11.0
      ],
      "skin_samples": 992,
      "occluded_px": 0
     },
     "small": {
      "file": "patches/idle/mouth_small_dflt.webp",
      "rect": [
       370,
       470,
       82,
       57
      ],
      "color_shift_rgb": [
       4.0,
       8.0,
       11.0
      ],
      "skin_samples": 992,
      "occluded_px": 0
     },
     "big": {
      "file": "patches/idle/mouth_big_dflt.webp",
      "rect": [
       370,
       470,
       82,
       57
      ],
      "color_shift_rgb": [
       4.0,
       8.0,
       11.0
      ],
      "skin_samples": 992,
      "occluded_px": 0
     },
     "smile": {
      "file": "patches/idle/mouth_smile_dflt.webp",
      "rect": [
       370,
       470,
       82,
       57
      ],
      "color_shift_rgb": [
       4.0,
       8.0,
       11.0
      ],
      "skin_samples": 992,
      "occluded_px": 0
     }
    },
    "dfltBlink": {
     "file": "patches/idle/blink_dflt.webp",
     "rect": [
      283,
      383,
      258,
      100
     ],
     "color_shift_rgb": [
      3.0,
      5.0,
      7.0
     ],
     "skin_samples": 2025,
     "occluded_px": 0
    },
    "face": {
     "angry": {
      "blush": {
       "file": "patches/idle/face_angry_blush.webp",
       "rect": [
        300,
        446,
        224,
        83
       ],
       "blend": "multiply"
      },
      "eyesInk": {
       "file": "patches/idle/face_angry_eyes_ink.webp",
       "rect": [
        289,
        383,
        247,
        98
       ]
      },
      "eyes": {
       "file": "patches/idle/face_angry_eyes.webp",
       "rect": [
        297,
        383,
        232,
        98
       ],
       "color_shift_rgb": [
        -0.5,
        7.2,
        11.4
       ]
      },
      "mouthInk": {
       "file": "patches/idle/face_angry_mouth_ink.webp",
       "rect": [
        373,
        474,
        82,
        41
       ]
      },
      "mouth": {
       "file": "patches/idle/face_angry_mouth.webp",
       "rect": [
        363,
        464,
        102,
        63
       ],
       "color_shift_rgb": [
        -0.1,
        6.0,
        9.6
       ]
      },
      "brow": {
       "file": "patches/idle/face_angry_brow.webp",
       "rect": [
        326,
        371,
        179,
        36
       ],
       "color_shift_rgb": [
        -0.7,
        5.4,
        10.0
       ]
      }
     },
     "awkward": {
      "blush": {
       "file": "patches/idle/face_awkward_blush.webp",
       "rect": [
        300,
        446,
        224,
        83
       ],
       "blend": "multiply"
      },
      "eyesInk": {
       "file": "patches/idle/face_awkward_eyes_ink.webp",
       "rect": [
        292,
        382,
        240,
        97
       ]
      },
      "eyes": {
       "file": "patches/idle/face_awkward_eyes.webp",
       "rect": [
        297,
        383,
        232,
        95
       ],
       "color_shift_rgb": [
        -1.0,
        6.9,
        9.0
       ]
      },
      "mouthInk": {
       "file": "patches/idle/face_awkward_mouth_ink.webp",
       "rect": [
        392,
        483,
        42,
        10
       ]
      },
      "mouth": {
       "file": "patches/idle/face_awkward_mouth.webp",
       "rect": [
        370,
        470,
        82,
        57
       ],
       "color_shift_rgb": [
        -1.0,
        4.4,
        6.2
       ]
      },
      "brow": {
       "file": "patches/idle/face_awkward_brow.webp",
       "rect": [
        317,
        380,
        182,
        22
       ],
       "color_shift_rgb": [
        -1.2,
        5.1,
        8.5
       ]
      }
     },
     "doubt": {
      "blush": {
       "file": "patches/idle/face_doubt_blush.webp",
       "rect": [
        300,
        446,
        224,
        83
       ],
       "blend": "multiply"
      },
      "eyesInk": {
       "file": "patches/idle/face_doubt_eyes_ink.webp",
       "rect": [
        292,
        382,
        240,
        98
       ]
      },
      "eyes": {
       "file": "patches/idle/face_doubt_eyes.webp",
       "rect": [
        297,
        382,
        232,
        97
       ],
       "color_shift_rgb": [
        -0.7,
        6.2,
        10.7
       ]
      },
      "mouthInk": {
       "file": "patches/idle/face_doubt_mouth_ink.webp",
       "rect": [
        404,
        488,
        11,
        11
       ]
      },
      "mouth": {
       "file": "patches/idle/face_doubt_mouth.webp",
       "rect": [
        370,
        470,
        82,
        57
       ],
       "color_shift_rgb": [
        -0.0,
        5.0,
        8.5
       ]
      },
      "brow": {
       "file": "patches/idle/face_doubt_brow.webp",
       "rect": [
        326,
        373,
        170,
        27
       ],
       "color_shift_rgb": [
        -0.9,
        5.5,
        10.5
       ]
      }
     },
     "flat": {
      "blush": {
       "file": "patches/idle/face_flat_blush.webp",
       "rect": [
        300,
        446,
        224,
        83
       ],
       "blend": "multiply"
      },
      "eyesInk": {
       "file": "patches/idle/face_flat_eyes_ink.webp",
       "rect": [
        293,
        382,
        239,
        99
       ]
      },
      "eyes": {
       "file": "patches/idle/face_flat_eyes.webp",
       "rect": [
        297,
        382,
        232,
        99
       ],
       "color_shift_rgb": [
        0.4,
        12.6,
        14.0
       ]
      },
      "mouthInk": {
       "file": "patches/idle/face_flat_mouth_ink.webp",
       "rect": [
        401,
        487,
        23,
        10
       ]
      },
      "mouth": {
       "file": "patches/idle/face_flat_mouth.webp",
       "rect": [
        370,
        470,
        82,
        57
       ],
       "color_shift_rgb": [
        -0.0,
        4.7,
        8.2
       ]
      },
      "brow": {
       "file": "patches/idle/face_flat_brow.webp",
       "rect": [
        314,
        377,
        197,
        21
       ],
       "color_shift_rgb": [
        -0.1,
        5.0,
        9.7
       ]
      }
     },
     "happy": {
      "eyesInk": {
       "file": "patches/idle/face_happy_eyes_ink.webp",
       "rect": [
        293,
        382,
        238,
        98
       ]
      },
      "eyes": {
       "file": "patches/idle/face_happy_eyes.webp",
       "rect": [
        297,
        382,
        232,
        98
       ],
       "color_shift_rgb": [
        -0.8,
        7.1,
        10.0
       ]
      },
      "mouthInk": {
       "file": "patches/idle/face_happy_mouth_ink.webp",
       "rect": [
        380,
        464,
        67,
        56
       ]
      },
      "mouth": {
       "file": "patches/idle/face_happy_mouth.webp",
       "rect": [
        370,
        458,
        87,
        72
       ],
       "color_shift_rgb": [
        -0.8,
        5.1,
        7.6
       ]
      }
     },
     "love": {
      "blush": {
       "file": "patches/idle/face_love_blush.webp",
       "rect": [
        300,
        446,
        224,
        83
       ],
       "blend": "multiply"
      },
      "eyesInk": {
       "file": "patches/idle/face_love_eyes_ink.webp",
       "rect": [
        292,
        383,
        240,
        102
       ]
      },
      "eyes": {
       "file": "patches/idle/face_love_eyes.webp",
       "rect": [
        297,
        383,
        232,
        102
       ],
       "color_shift_rgb": [
        -0.8,
        10.5,
        12.7
       ]
      },
      "mouthInk": {
       "file": "patches/idle/face_love_mouth_ink.webp",
       "rect": [
        390,
        484,
        45,
        18
       ]
      },
      "mouth": {
       "file": "patches/idle/face_love_mouth.webp",
       "rect": [
        370,
        470,
        82,
        57
       ],
       "color_shift_rgb": [
        -1.0,
        7.3,
        9.9
       ]
      },
      "brow": {
       "file": "patches/idle/face_love_brow.webp",
       "rect": [
        317,
        355,
        175,
        15
       ],
       "color_shift_rgb": [
        -0.6,
        6.8,
        11.2
       ]
      }
     },
     "squeeze": {
      "blush": {
       "file": "patches/idle/face_squeeze_blush.webp",
       "rect": [
        300,
        446,
        224,
        83
       ],
       "blend": "multiply"
      },
      "eyesInk": {
       "file": "patches/idle/face_squeeze_eyes_ink.webp",
       "rect": [
        294,
        383,
        238,
        96
       ]
      },
      "eyes": {
       "file": "patches/idle/face_squeeze_eyes.webp",
       "rect": [
        297,
        384,
        232,
        96
       ],
       "color_shift_rgb": [
        0.3,
        11.4,
        12.0
       ]
      },
      "mouthInk": {
       "file": "patches/idle/face_squeeze_mouth_ink.webp",
       "rect": [
        401,
        487,
        25,
        9
       ]
      },
      "mouth": {
       "file": "patches/idle/face_squeeze_mouth.webp",
       "rect": [
        370,
        470,
        82,
        57
       ],
       "color_shift_rgb": [
        -0.1,
        4.1,
        6.0
       ]
      },
      "brow": {
       "file": "patches/idle/face_squeeze_brow.webp",
       "rect": [
        335,
        385,
        154,
        29
       ],
       "color_shift_rgb": [
        -0.0,
        5.1,
        8.0
       ]
      }
     },
     "surprise": {
      "blush": {
       "file": "patches/idle/face_surprise_blush.webp",
       "rect": [
        300,
        446,
        224,
        83
       ],
       "blend": "multiply"
      },
      "eyesInk": {
       "file": "patches/idle/face_surprise_eyes_ink.webp",
       "rect": [
        292,
        383,
        240,
        96
       ]
      },
      "eyes": {
       "file": "patches/idle/face_surprise_eyes.webp",
       "rect": [
        297,
        384,
        232,
        96
       ],
       "color_shift_rgb": [
        -0.8,
        5.5,
        8.5
       ]
      },
      "mouthInk": {
       "file": "patches/idle/face_surprise_mouth_ink.webp",
       "rect": [
        402,
        480,
        25,
        32
       ]
      },
      "mouth": {
       "file": "patches/idle/face_surprise_mouth.webp",
       "rect": [
        370,
        469,
        82,
        58
       ],
       "color_shift_rgb": [
        -0.5,
        4.4,
        7.0
       ]
      },
      "brow": {
       "file": "patches/idle/face_surprise_brow.webp",
       "rect": [
        314,
        361,
        189,
        24
       ],
       "color_shift_rgb": [
        -1.0,
        4.8,
        8.8
       ]
      }
     }
    },
    "eyeSkin": {
     "file": "patches/idle/eye_skin.webp",
     "rect": [
      298,
      380,
      230,
      105
     ]
    },
    "ink": {
     "default": {
      "eyes": {
       "file": "patches/idle/ink_eyes.webp",
       "rect": [
        299,
        394,
        227,
        80
       ]
      },
      "mouth": {
       "file": "patches/idle/ink_mouth.webp",
       "rect": [
        388,
        483,
        47,
        13
       ]
      },
      "brow": {
       "file": "patches/idle/ink_brow.webp",
       "rect": [
        303,
        365,
        216,
        29
       ]
      }
     },
     "mouth": {
      "closed": {
       "file": "patches/idle/ink_mouth_closed.webp",
       "rect": [
        388,
        486,
        46,
        10
       ]
      },
      "small": {
       "file": "patches/idle/ink_mouth_small.webp",
       "rect": [
        399,
        484,
        24,
        21
       ]
      },
      "big": {
       "file": "patches/idle/ink_mouth_big.webp",
       "rect": [
        388,
        481,
        47,
        34
       ]
      },
      "smile": {
       "file": "patches/idle/ink_mouth_smile.webp",
       "rect": [
        382,
        482,
        59,
        31
       ]
      }
     },
     "blink": {
      "file": "patches/idle/ink_blink.webp",
      "rect": [
       307,
       454,
       210,
       13
      ]
     }
    },
    "defaultFace": {
     "base": {
      "file": "patches/idle/default_base.webp",
      "rect": [
       300,
       354,
       222,
       174
      ]
     },
     "hair": {
      "file": "patches/idle/default_hair.webp",
      "rect": [
       282,
       354,
       261,
       124
      ]
     },
     "brow": {
      "file": "patches/idle/default_brow.webp",
      "rect": [
       299,
       364,
       229,
       52
      ]
     },
     "orig": "../clips-b1/frames/idle.webp",
     "noBrow": "../clips-b1/frames/idle_nobrow.webp",
     "verified": {
      "diffPixels": 0,
      "maxDiff": 0,
      "diffPixelsExactMask": 0,
      "D_px": 23215,
      "brow_px": 1893
     }
    }
   },
   "facePaste": true,
   "browSwap": false,
   "faceBlank": true,
   "faceClass": 1,
   "attrManual": [
    "faceBlank"
   ]
  }
 },
 "clips": {
  "think_b1_final_loop": {
   "label": "思考 第一批 final s1",
   "from": "idle",
   "to": "idle",
   "fps": 16,
   "frames": [
    "frames/think_b1_final_loop/00.webp",
    "frames/think_b1_final_loop/01.webp",
    "frames/think_b1_final_loop/02.webp",
    "frames/think_b1_final_loop/03.webp",
    "frames/think_b1_final_loop/04.webp",
    "frames/think_b1_final_loop/05.webp",
    "frames/think_b1_final_loop/06.webp",
    "frames/think_b1_final_loop/07.webp",
    "frames/think_b1_final_loop/08.webp",
    "frames/think_b1_final_loop/09.webp",
    "frames/think_b1_final_loop/10.webp",
    "frames/think_b1_final_loop/11.webp",
    "frames/think_b1_final_loop/12.webp",
    "frames/think_b1_final_loop/13.webp",
    "frames/think_b1_final_loop/14.webp",
    "frames/think_b1_final_loop/15.webp",
    "frames/think_b1_final_loop/16.webp",
    "frames/think_b1_final_loop/17.webp",
    "frames/think_b1_final_loop/18.webp",
    "frames/think_b1_final_loop/19.webp",
    "frames/think_b1_final_loop/20.webp",
    "frames/think_b1_final_loop/21.webp",
    "frames/think_b1_final_loop/22.webp",
    "frames/think_b1_final_loop/23.webp",
    "frames/think_b1_final_loop/24.webp",
    "frames/think_b1_final_loop/25.webp",
    "frames/think_b1_final_loop/26.webp",
    "frames/think_b1_final_loop/27.webp",
    "frames/think_b1_final_loop/28.webp",
    "frames/think_b1_final_loop/29.webp",
    "frames/think_b1_final_loop/30.webp",
    "frames/think_b1_final_loop/31.webp",
    "frames/think_b1_final_loop/32.webp",
    "frames/think_b1_final_loop/33.webp",
    "frames/think_b1_final_loop/34.webp",
    "frames/think_b1_final_loop/35.webp",
    "frames/think_b1_final_loop/36.webp",
    "frames/think_b1_final_loop/37.webp",
    "frames/think_b1_final_loop/38.webp",
    "frames/think_b1_final_loop/39.webp",
    "frames/think_b1_final_loop/40.webp",
    "frames/think_b1_final_loop/41.webp",
    "frames/think_b1_final_loop/42.webp",
    "frames/think_b1_final_loop/43.webp",
    "frames/think_b1_final_loop/44.webp",
    "frames/think_b1_final_loop/45.webp",
    "frames/think_b1_final_loop/46.webp",
    "frames/think_b1_final_loop/47.webp",
    "frames/think_b1_final_loop/48.webp"
   ],
   "active": [
    [
     1,
     47
    ]
   ],
   "frameBBox": [
    [
     183,
     137,
     649,
     1000
    ],
    [
     184,
     134,
     648,
     1002
    ],
    [
     184,
     134,
     648,
     1002
    ],
    [
     182,
     134,
     648,
     1002
    ],
    [
     182,
     134,
     646,
     1002
    ],
    [
     182,
     134,
     646,
     1002
    ],
    [
     180,
     134,
     646,
     1002
    ],
    [
     180,
     134,
     644,
     1002
    ],
    [
     180,
     134,
     644,
     1002
    ],
    [
     178,
     134,
     642,
     1002
    ],
    [
     178,
     132,
     642,
     1002
    ],
    [
     176,
     132,
     642,
     1002
    ],
    [
     176,
     132,
     640,
     1002
    ],
    [
     176,
     132,
     640,
     1002
    ],
    [
     176,
     132,
     640,
     1002
    ],
    [
     176,
     132,
     638,
     1002
    ],
    [
     174,
     132,
     638,
     1002
    ],
    [
     174,
     132,
     638,
     1002
    ],
    [
     174,
     132,
     638,
     1002
    ],
    [
     174,
     132,
     638,
     1002
    ],
    [
     174,
     132,
     638,
     1002
    ],
    [
     174,
     132,
     638,
     1002
    ],
    [
     174,
     132,
     638,
     1002
    ],
    [
     174,
     132,
     638,
     1002
    ],
    [
     174,
     132,
     638,
     1002
    ],
    [
     176,
     132,
     638,
     1002
    ],
    [
     176,
     132,
     638,
     1002
    ],
    [
     176,
     132,
     638,
     1002
    ],
    [
     176,
     132,
     640,
     1002
    ],
    [
     176,
     132,
     640,
     1002
    ],
    [
     176,
     132,
     640,
     1002
    ],
    [
     176,
     134,
     642,
     1002
    ],
    [
     178,
     134,
     642,
     1002
    ],
    [
     178,
     134,
     642,
     1002
    ],
    [
     180,
     134,
     644,
     1002
    ],
    [
     180,
     134,
     644,
     1002
    ],
    [
     180,
     134,
     646,
     1002
    ],
    [
     182,
     134,
     646,
     1002
    ],
    [
     182,
     134,
     646,
     1002
    ],
    [
     182,
     134,
     648,
     1002
    ],
    [
     182,
     134,
     648,
     1002
    ],
    [
     182,
     134,
     648,
     1002
    ],
    [
     182,
     134,
     648,
     1002
    ],
    [
     184,
     134,
     648,
     1002
    ],
    [
     184,
     134,
     648,
     1002
    ],
    [
     182,
     134,
     648,
     1002
    ],
    [
     184,
     134,
     648,
     1002
    ],
    [
     184,
     134,
     648,
     1002
    ],
    [
     183,
     137,
     649,
     1000
    ]
   ],
   "bbox": [
    174,
    132,
    649,
    1002
   ],
   "margin": [
    174,
    132,
    183,
    102
   ],
   "facePaste": true,
   "browSwap": false,
   "faceBlank": true,
   "faceClass": 1,
   "attrManual": [
    "faceBlank"
   ],
   "arc": [
    0.0,
    0.0159,
    0.0313,
    0.058,
    0.1003,
    0.1336,
    0.1943,
    0.2358,
    0.2886,
    0.3199,
    0.377,
    0.4198,
    0.476,
    0.4984,
    0.5148,
    0.5148,
    0.5148,
    0.5148,
    0.5148,
    0.5148,
    0.5148,
    0.5148,
    0.5148,
    0.5148,
    0.5148,
    0.5148,
    0.5148,
    0.5298,
    0.5379,
    0.5746,
    0.611,
    0.6683,
    0.7309,
    0.7718,
    0.8332,
    0.868,
    0.9254,
    0.9563,
    0.9844,
    0.9844,
    0.9844,
    0.9844,
    0.9844,
    0.9844,
    0.9844,
    0.9844,
    0.9844,
    0.9844,
    1.0
   ],
   "minSeconds": 0.6
  },
  "shrug_b1_final_s2_loop": {
   "label": "摊手 第一批 final s2",
   "from": "idle",
   "to": "idle",
   "fps": 16,
   "frames": [
    "frames/shrug_b1_final_s2_loop/00.webp",
    "frames/shrug_b1_final_s2_loop/01.webp",
    "frames/shrug_b1_final_s2_loop/02.webp",
    "frames/shrug_b1_final_s2_loop/03.webp",
    "frames/shrug_b1_final_s2_loop/04.webp",
    "frames/shrug_b1_final_s2_loop/05.webp",
    "frames/shrug_b1_final_s2_loop/06.webp",
    "frames/shrug_b1_final_s2_loop/07.webp",
    "frames/shrug_b1_final_s2_loop/08.webp",
    "frames/shrug_b1_final_s2_loop/09.webp",
    "frames/shrug_b1_final_s2_loop/10.webp",
    "frames/shrug_b1_final_s2_loop/11.webp",
    "frames/shrug_b1_final_s2_loop/12.webp",
    "frames/shrug_b1_final_s2_loop/13.webp",
    "frames/shrug_b1_final_s2_loop/14.webp",
    "frames/shrug_b1_final_s2_loop/15.webp",
    "frames/shrug_b1_final_s2_loop/16.webp",
    "frames/shrug_b1_final_s2_loop/17.webp",
    "frames/shrug_b1_final_s2_loop/18.webp",
    "frames/shrug_b1_final_s2_loop/19.webp",
    "frames/shrug_b1_final_s2_loop/20.webp",
    "frames/shrug_b1_final_s2_loop/21.webp",
    "frames/shrug_b1_final_s2_loop/22.webp",
    "frames/shrug_b1_final_s2_loop/23.webp",
    "frames/shrug_b1_final_s2_loop/24.webp",
    "frames/shrug_b1_final_s2_loop/25.webp",
    "frames/shrug_b1_final_s2_loop/26.webp",
    "frames/shrug_b1_final_s2_loop/27.webp",
    "frames/shrug_b1_final_s2_loop/28.webp",
    "frames/shrug_b1_final_s2_loop/29.webp",
    "frames/shrug_b1_final_s2_loop/30.webp",
    "frames/shrug_b1_final_s2_loop/31.webp",
    "frames/shrug_b1_final_s2_loop/32.webp",
    "frames/shrug_b1_final_s2_loop/33.webp",
    "frames/shrug_b1_final_s2_loop/34.webp",
    "frames/shrug_b1_final_s2_loop/35.webp",
    "frames/shrug_b1_final_s2_loop/36.webp",
    "frames/shrug_b1_final_s2_loop/37.webp",
    "frames/shrug_b1_final_s2_loop/38.webp",
    "frames/shrug_b1_final_s2_loop/39.webp",
    "frames/shrug_b1_final_s2_loop/40.webp",
    "frames/shrug_b1_final_s2_loop/41.webp",
    "frames/shrug_b1_final_s2_loop/42.webp",
    "frames/shrug_b1_final_s2_loop/43.webp",
    "frames/shrug_b1_final_s2_loop/44.webp",
    "frames/shrug_b1_final_s2_loop/45.webp",
    "frames/shrug_b1_final_s2_loop/46.webp",
    "frames/shrug_b1_final_s2_loop/47.webp",
    "frames/shrug_b1_final_s2_loop/48.webp"
   ],
   "active": [
    [
     1,
     47
    ]
   ],
   "frameBBox": [
    [
     183,
     137,
     649,
     1000
    ],
    [
     184,
     134,
     648,
     1002
    ],
    [
     184,
     134,
     648,
     1002
    ],
    [
     184,
     134,
     650,
     1002
    ],
    [
     186,
     134,
     650,
     1002
    ],
    [
     186,
     136,
     650,
     1002
    ],
    [
     178,
     136,
     660,
     1002
    ],
    [
     174,
     136,
     668,
     1002
    ],
    [
     168,
     136,
     670,
     1002
    ],
    [
     164,
     136,
     672,
     1002
    ],
    [
     160,
     136,
     676,
     1002
    ],
    [
     158,
     136,
     678,
     1002
    ],
    [
     156,
     136,
     680,
     1002
    ],
    [
     154,
     136,
     680,
     1002
    ],
    [
     154,
     136,
     680,
     1002
    ],
    [
     154,
     136,
     682,
     1002
    ],
    [
     154,
     136,
     682,
     1002
    ],
    [
     154,
     136,
     682,
     1002
    ],
    [
     154,
     136,
     682,
     1002
    ],
    [
     154,
     136,
     682,
     1002
    ],
    [
     154,
     136,
     682,
     1002
    ],
    [
     154,
     136,
     682,
     1002
    ],
    [
     154,
     136,
     682,
     1002
    ],
    [
     154,
     136,
     682,
     1002
    ],
    [
     154,
     136,
     682,
     1002
    ],
    [
     154,
     136,
     682,
     1002
    ],
    [
     154,
     136,
     682,
     1002
    ],
    [
     154,
     136,
     682,
     1002
    ],
    [
     154,
     136,
     682,
     1002
    ],
    [
     154,
     136,
     682,
     1002
    ],
    [
     154,
     136,
     682,
     1002
    ],
    [
     154,
     136,
     682,
     1002
    ],
    [
     154,
     136,
     680,
     1002
    ],
    [
     156,
     136,
     680,
     1002
    ],
    [
     162,
     136,
     676,
     1002
    ],
    [
     168,
     136,
     666,
     1002
    ],
    [
     176,
     136,
     658,
     1002
    ],
    [
     184,
     136,
     656,
     1002
    ],
    [
     186,
     134,
     650,
     1002
    ],
    [
     186,
     134,
     650,
     1002
    ],
    [
     184,
     135,
     648,
     1002
    ],
    [
     184,
     134,
     648,
     1002
    ],
    [
     184,
     134,
     648,
     1002
    ],
    [
     184,
     134,
     648,
     1002
    ],
    [
     184,
     134,
     648,
     1002
    ],
    [
     184,
     134,
     648,
     1002
    ],
    [
     184,
     134,
     648,
     1002
    ],
    [
     184,
     134,
     648,
     1002
    ],
    [
     183,
     137,
     649,
     1000
    ]
   ],
   "bbox": [
    154,
    134,
    682,
    1002
   ],
   "margin": [
    154,
    134,
    150,
    102
   ],
   "facePaste": true,
   "browSwap": false,
   "faceBlank": true,
   "faceClass": 1,
   "attrManual": [
    "faceBlank"
   ],
   "arc": [
    0.0,
    0.0139,
    0.0695,
    0.104,
    0.1775,
    0.223,
    0.2921,
    0.3331,
    0.3885,
    0.4175,
    0.4569,
    0.4788,
    0.5009,
    0.5034,
    0.5094,
    0.5094,
    0.5094,
    0.5094,
    0.5094,
    0.5094,
    0.5094,
    0.5094,
    0.5094,
    0.5094,
    0.5094,
    0.5094,
    0.5094,
    0.5094,
    0.5094,
    0.5094,
    0.5094,
    0.5094,
    0.5203,
    0.526,
    0.5669,
    0.603,
    0.6634,
    0.7043,
    0.7701,
    0.8043,
    0.8612,
    0.8926,
    0.9349,
    0.9571,
    0.9836,
    0.9876,
    0.9876,
    0.9876,
    1.0
   ],
   "minSeconds": 0.6
  },
  "think_b1_draft_loop": {
   "label": "思考 第一批 draft s1",
   "from": "idle",
   "to": "idle",
   "fps": 16,
   "frames": [
    "frames/think_b1_draft_loop/00.webp",
    "frames/think_b1_draft_loop/01.webp",
    "frames/think_b1_draft_loop/02.webp",
    "frames/think_b1_draft_loop/03.webp",
    "frames/think_b1_draft_loop/04.webp",
    "frames/think_b1_draft_loop/05.webp",
    "frames/think_b1_draft_loop/06.webp",
    "frames/think_b1_draft_loop/07.webp",
    "frames/think_b1_draft_loop/08.webp",
    "frames/think_b1_draft_loop/09.webp",
    "frames/think_b1_draft_loop/10.webp",
    "frames/think_b1_draft_loop/11.webp",
    "frames/think_b1_draft_loop/12.webp",
    "frames/think_b1_draft_loop/13.webp",
    "frames/think_b1_draft_loop/14.webp",
    "frames/think_b1_draft_loop/15.webp",
    "frames/think_b1_draft_loop/16.webp",
    "frames/think_b1_draft_loop/17.webp",
    "frames/think_b1_draft_loop/18.webp",
    "frames/think_b1_draft_loop/19.webp",
    "frames/think_b1_draft_loop/20.webp",
    "frames/think_b1_draft_loop/21.webp",
    "frames/think_b1_draft_loop/22.webp",
    "frames/think_b1_draft_loop/23.webp",
    "frames/think_b1_draft_loop/24.webp",
    "frames/think_b1_draft_loop/25.webp",
    "frames/think_b1_draft_loop/26.webp",
    "frames/think_b1_draft_loop/27.webp",
    "frames/think_b1_draft_loop/28.webp",
    "frames/think_b1_draft_loop/29.webp",
    "frames/think_b1_draft_loop/30.webp",
    "frames/think_b1_draft_loop/31.webp",
    "frames/think_b1_draft_loop/32.webp",
    "frames/think_b1_draft_loop/33.webp",
    "frames/think_b1_draft_loop/34.webp",
    "frames/think_b1_draft_loop/35.webp",
    "frames/think_b1_draft_loop/36.webp",
    "frames/think_b1_draft_loop/37.webp",
    "frames/think_b1_draft_loop/38.webp",
    "frames/think_b1_draft_loop/39.webp",
    "frames/think_b1_draft_loop/40.webp",
    "frames/think_b1_draft_loop/41.webp",
    "frames/think_b1_draft_loop/42.webp",
    "frames/think_b1_draft_loop/43.webp",
    "frames/think_b1_draft_loop/44.webp",
    "frames/think_b1_draft_loop/45.webp",
    "frames/think_b1_draft_loop/46.webp",
    "frames/think_b1_draft_loop/47.webp",
    "frames/think_b1_draft_loop/48.webp"
   ],
   "active": [
    [
     1,
     47
    ]
   ],
   "frameBBox": [
    [
     183,
     137,
     649,
     1000
    ],
    [
     184,
     134,
     648,
     1002
    ],
    [
     184,
     134,
     648,
     1002
    ],
    [
     184,
     134,
     648,
     1002
    ],
    [
     184,
     134,
     648,
     1002
    ],
    [
     184,
     136,
     650,
     1002
    ],
    [
     184,
     136,
     650,
     1002
    ],
    [
     184,
     138,
     650,
     1002
    ],
    [
     184,
     136,
     648,
     1002
    ],
    [
     182,
     134,
     648,
     1002
    ],
    [
     180,
     132,
     644,
     1002
    ],
    [
     178,
     130,
     642,
     1002
    ],
    [
     176,
     130,
     640,
     1002
    ],
    [
     176,
     128,
     638,
     1002
    ],
    [
     174,
     130,
     638,
     1002
    ],
    [
     172,
     130,
     636,
     1002
    ],
    [
     172,
     132,
     636,
     1002
    ],
    [
     172,
     132,
     636,
     1002
    ],
    [
     172,
     132,
     636,
     1002
    ],
    [
     172,
     132,
     636,
     1002
    ],
    [
     172,
     132,
     636,
     1002
    ],
    [
     172,
     132,
     636,
     1002
    ],
    [
     172,
     132,
     636,
     1002
    ],
    [
     172,
     132,
     636,
     1002
    ],
    [
     172,
     132,
     636,
     1002
    ],
    [
     172,
     132,
     636,
     1002
    ],
    [
     172,
     132,
     636,
     1002
    ],
    [
     172,
     132,
     636,
     1002
    ],
    [
     172,
     132,
     636,
     1002
    ],
    [
     172,
     132,
     636,
     1002
    ],
    [
     172,
     130,
     636,
     1002
    ],
    [
     172,
     130,
     634,
     1002
    ],
    [
     172,
     132,
     634,
     1002
    ],
    [
     174,
     132,
     636,
     1002
    ],
    [
     176,
     132,
     638,
     1002
    ],
    [
     178,
     134,
     640,
     1002
    ],
    [
     180,
     132,
     644,
     1002
    ],
    [
     180,
     132,
     646,
     1002
    ],
    [
     182,
     130,
     646,
     1002
    ],
    [
     182,
     130,
     648,
     1002
    ],
    [
     182,
     132,
     648,
     1002
    ],
    [
     182,
     132,
     648,
     1002
    ],
    [
     182,
     134,
     648,
     1002
    ],
    [
     182,
     134,
     648,
     1002
    ],
    [
     182,
     134,
     648,
     1002
    ],
    [
     182,
     134,
     648,
     1002
    ],
    [
     182,
     134,
     648,
     1002
    ],
    [
     182,
     134,
     648,
     1002
    ],
    [
     183,
     137,
     649,
     1000
    ]
   ],
   "bbox": [
    172,
    128,
    650,
    1002
   ],
   "margin": [
    172,
    128,
    182,
    102
   ],
   "facePaste": true,
   "browSwap": false,
   "faceBlank": true,
   "faceClass": 1,
   "attrManual": [
    "faceBlank"
   ],
   "arc": [
    0.0,
    0.0083,
    0.0083,
    0.0097,
    0.0299,
    0.0567,
    0.1227,
    0.139,
    0.1762,
    0.2269,
    0.3222,
    0.365,
    0.4189,
    0.4334,
    0.4692,
    0.4838,
    0.4842,
    0.4842,
    0.4842,
    0.4842,
    0.4842,
    0.4842,
    0.4842,
    0.4842,
    0.4842,
    0.4842,
    0.4842,
    0.4842,
    0.4842,
    0.4904,
    0.4936,
    0.5058,
    0.5312,
    0.5567,
    0.6415,
    0.6791,
    0.7655,
    0.8227,
    0.9049,
    0.9178,
    0.936,
    0.9485,
    0.973,
    0.98,
    0.9897,
    0.9908,
    0.9908,
    0.9908,
    1.0
   ],
   "minSeconds": 0.6
  },
  "wave_b1_draft_loop": {
   "label": "挥手 第一批 draft s1",
   "from": "idle",
   "to": "idle",
   "fps": 16,
   "frames": [
    "frames/wave_b1_draft_loop/00.webp",
    "frames/wave_b1_draft_loop/01.webp",
    "frames/wave_b1_draft_loop/02.webp",
    "frames/wave_b1_draft_loop/03.webp",
    "frames/wave_b1_draft_loop/04.webp",
    "frames/wave_b1_draft_loop/05.webp",
    "frames/wave_b1_draft_loop/06.webp",
    "frames/wave_b1_draft_loop/07.webp",
    "frames/wave_b1_draft_loop/08.webp",
    "frames/wave_b1_draft_loop/09.webp",
    "frames/wave_b1_draft_loop/10.webp",
    "frames/wave_b1_draft_loop/11.webp",
    "frames/wave_b1_draft_loop/12.webp",
    "frames/wave_b1_draft_loop/13.webp",
    "frames/wave_b1_draft_loop/14.webp",
    "frames/wave_b1_draft_loop/15.webp",
    "frames/wave_b1_draft_loop/16.webp",
    "frames/wave_b1_draft_loop/17.webp",
    "frames/wave_b1_draft_loop/18.webp",
    "frames/wave_b1_draft_loop/19.webp",
    "frames/wave_b1_draft_loop/20.webp",
    "frames/wave_b1_draft_loop/21.webp",
    "frames/wave_b1_draft_loop/22.webp",
    "frames/wave_b1_draft_loop/23.webp",
    "frames/wave_b1_draft_loop/24.webp",
    "frames/wave_b1_draft_loop/25.webp",
    "frames/wave_b1_draft_loop/26.webp",
    "frames/wave_b1_draft_loop/27.webp",
    "frames/wave_b1_draft_loop/28.webp",
    "frames/wave_b1_draft_loop/29.webp",
    "frames/wave_b1_draft_loop/30.webp",
    "frames/wave_b1_draft_loop/31.webp",
    "frames/wave_b1_draft_loop/32.webp",
    "frames/wave_b1_draft_loop/33.webp",
    "frames/wave_b1_draft_loop/34.webp",
    "frames/wave_b1_draft_loop/35.webp",
    "frames/wave_b1_draft_loop/36.webp",
    "frames/wave_b1_draft_loop/37.webp",
    "frames/wave_b1_draft_loop/38.webp",
    "frames/wave_b1_draft_loop/39.webp",
    "frames/wave_b1_draft_loop/40.webp",
    "frames/wave_b1_draft_loop/41.webp",
    "frames/wave_b1_draft_loop/42.webp",
    "frames/wave_b1_draft_loop/43.webp",
    "frames/wave_b1_draft_loop/44.webp",
    "frames/wave_b1_draft_loop/45.webp",
    "frames/wave_b1_draft_loop/46.webp",
    "frames/wave_b1_draft_loop/47.webp",
    "frames/wave_b1_draft_loop/48.webp"
   ],
   "active": [
    [
     1,
     47
    ]
   ],
   "frameBBox": [
    [
     183,
     137,
     649,
     1000
    ],
    [
     184,
     134,
     648,
     1002
    ],
    [
     184,
     134,
     648,
     1002
    ],
    [
     184,
     134,
     652,
     1002
    ],
    [
     180,
     134,
     694,
     1002
    ],
    [
     178,
     132,
     708,
     1002
    ],
    [
     174,
     130,
     714,
     1002
    ],
    [
     172,
     130,
     702,
     1002
    ],
    [
     168,
     128,
     660,
     1002
    ],
    [
     168,
     128,
     628,
     1002
    ],
    [
     168,
     128,
     630,
     1002
    ],
    [
     170,
     128,
     632,
     1002
    ],
    [
     172,
     128,
     636,
     1002
    ],
    [
     172,
     128,
     636,
     1002
    ],
    [
     178,
     132,
     642,
     1002
    ],
    [
     182,
     134,
     648,
     1002
    ],
    [
     186,
     136,
     652,
     1002
    ],
    [
     192,
     140,
     656,
     1002
    ],
    [
     194,
     142,
     658,
     1002
    ],
    [
     198,
     144,
     662,
     1002
    ],
    [
     198,
     144,
     664,
     1002
    ],
    [
     194,
     142,
     660,
     1002
    ],
    [
     190,
     140,
     658,
     1002
    ],
    [
     184,
     138,
     650,
     1002
    ],
    [
     182,
     136,
     648,
     1002
    ],
    [
     178,
     134,
     642,
     1002
    ],
    [
     176,
     132,
     640,
     1002
    ],
    [
     172,
     132,
     636,
     1002
    ],
    [
     170,
     132,
     634,
     1002
    ],
    [
     168,
     130,
     632,
     1002
    ],
    [
     168,
     130,
     630,
     1002
    ],
    [
     166,
     130,
     628,
     1002
    ],
    [
     164,
     130,
     626,
     1002
    ],
    [
     164,
     130,
     624,
     1002
    ],
    [
     162,
     130,
     626,
     1002
    ],
    [
     163,
     130,
     644,
     1002
    ],
    [
     166,
     130,
     684,
     1002
    ],
    [
     168,
     130,
     694,
     1002
    ],
    [
     170,
     132,
     694,
     1002
    ],
    [
     172,
     132,
     684,
     1002
    ],
    [
     176,
     132,
     658,
     1002
    ],
    [
     178,
     134,
     646,
     1002
    ],
    [
     180,
     134,
     644,
     1002
    ],
    [
     182,
     134,
     646,
     1002
    ],
    [
     182,
     134,
     648,
     1002
    ],
    [
     184,
     134,
     648,
     1002
    ],
    [
     184,
     134,
     648,
     1002
    ],
    [
     184,
     134,
     648,
     1002
    ],
    [
     183,
     137,
     649,
     1000
    ]
   ],
   "bbox": [
    162,
    128,
    714,
    1002
   ],
   "margin": [
    162,
    128,
    118,
    102
   ],
   "facePaste": true,
   "browSwap": false,
   "faceBlank": true,
   "faceClass": 1,
   "attrManual": [
    "faceBlank"
   ],
   "arc": [
    0.0,
    0.0049,
    0.0156,
    0.0254,
    0.0577,
    0.079,
    0.1281,
    0.1578,
    0.2038,
    0.2288,
    0.2505,
    0.2612,
    0.2858,
    0.2881,
    0.322,
    0.3649,
    0.3915,
    0.4302,
    0.448,
    0.4707,
    0.4708,
    0.4942,
    0.5116,
    0.552,
    0.5695,
    0.6043,
    0.6207,
    0.6444,
    0.6526,
    0.6684,
    0.6754,
    0.6936,
    0.7096,
    0.7196,
    0.7417,
    0.7582,
    0.7978,
    0.8207,
    0.8645,
    0.8878,
    0.9296,
    0.9451,
    0.9726,
    0.9819,
    0.9945,
    0.9965,
    0.9965,
    0.9965,
    1.0
   ],
   "minSeconds": 0.6
  },
  "wave_h1_s2_canny_loop": {
   "label": "挥手 h1 s2·canny（手盖脸）",
   "from": "idle",
   "to": "idle",
   "fps": 16,
   "frames": [
    "frames/wave_h1_s2_canny_loop/00.webp",
    "frames/wave_h1_s2_canny_loop/01.webp",
    "frames/wave_h1_s2_canny_loop/02.webp",
    "frames/wave_h1_s2_canny_loop/03.webp",
    "frames/wave_h1_s2_canny_loop/04.webp",
    "frames/wave_h1_s2_canny_loop/05.webp",
    "frames/wave_h1_s2_canny_loop/06.webp",
    "frames/wave_h1_s2_canny_loop/07.webp",
    "frames/wave_h1_s2_canny_loop/08.webp",
    "frames/wave_h1_s2_canny_loop/09.webp",
    "frames/wave_h1_s2_canny_loop/10.webp",
    "frames/wave_h1_s2_canny_loop/11.webp",
    "frames/wave_h1_s2_canny_loop/12.webp",
    "frames/wave_h1_s2_canny_loop/13.webp",
    "frames/wave_h1_s2_canny_loop/14.webp",
    "frames/wave_h1_s2_canny_loop/15.webp",
    "frames/wave_h1_s2_canny_loop/16.webp",
    "frames/wave_h1_s2_canny_loop/17.webp",
    "frames/wave_h1_s2_canny_loop/18.webp",
    "frames/wave_h1_s2_canny_loop/19.webp",
    "frames/wave_h1_s2_canny_loop/20.webp",
    "frames/wave_h1_s2_canny_loop/21.webp",
    "frames/wave_h1_s2_canny_loop/22.webp",
    "frames/wave_h1_s2_canny_loop/23.webp",
    "frames/wave_h1_s2_canny_loop/24.webp",
    "frames/wave_h1_s2_canny_loop/25.webp",
    "frames/wave_h1_s2_canny_loop/26.webp",
    "frames/wave_h1_s2_canny_loop/27.webp",
    "frames/wave_h1_s2_canny_loop/28.webp",
    "frames/wave_h1_s2_canny_loop/29.webp",
    "frames/wave_h1_s2_canny_loop/30.webp",
    "frames/wave_h1_s2_canny_loop/31.webp",
    "frames/wave_h1_s2_canny_loop/32.webp",
    "frames/wave_h1_s2_canny_loop/33.webp",
    "frames/wave_h1_s2_canny_loop/34.webp",
    "frames/wave_h1_s2_canny_loop/35.webp",
    "frames/wave_h1_s2_canny_loop/36.webp",
    "frames/wave_h1_s2_canny_loop/37.webp",
    "frames/wave_h1_s2_canny_loop/38.webp",
    "frames/wave_h1_s2_canny_loop/39.webp",
    "frames/wave_h1_s2_canny_loop/40.webp",
    "frames/wave_h1_s2_canny_loop/41.webp",
    "frames/wave_h1_s2_canny_loop/42.webp",
    "frames/wave_h1_s2_canny_loop/43.webp",
    "frames/wave_h1_s2_canny_loop/44.webp",
    "frames/wave_h1_s2_canny_loop/45.webp",
    "frames/wave_h1_s2_canny_loop/46.webp",
    "frames/wave_h1_s2_canny_loop/47.webp",
    "frames/wave_h1_s2_canny_loop/48.webp"
   ],
   "active": [
    [
     1,
     47
    ]
   ],
   "frameBBox": [
    [
     183,
     137,
     649,
     1000
    ],
    [
     184,
     138,
     648,
     1000
    ],
    [
     184,
     138,
     648,
     1000
    ],
    [
     184,
     138,
     648,
     1000
    ],
    [
     182,
     138,
     648,
     1000
    ],
    [
     182,
     140,
     646,
     1000
    ],
    [
     160,
     142,
     644,
     1000
    ],
    [
     150,
     142,
     644,
     1000
    ],
    [
     152,
     140,
     648,
     1000
    ],
    [
     160,
     140,
     648,
     1000
    ],
    [
     190,
     140,
     652,
     1000
    ],
    [
     192,
     140,
     654,
     1000
    ],
    [
     196,
     140,
     658,
     1000
    ],
    [
     196,
     142,
     658,
     1000
    ],
    [
     196,
     142,
     658,
     1000
    ],
    [
     194,
     142,
     656,
     1000
    ],
    [
     192,
     140,
     654,
     1000
    ],
    [
     192,
     142,
     654,
     1000
    ],
    [
     192,
     144,
     656,
     1000
    ],
    [
     190,
     142,
     656,
     1000
    ],
    [
     190,
     140,
     656,
     1000
    ],
    [
     192,
     140,
     654,
     1000
    ],
    [
     194,
     140,
     654,
     1000
    ],
    [
     196,
     142,
     656,
     1000
    ],
    [
     194,
     144,
     658,
     1000
    ],
    [
     196,
     144,
     660,
     1000
    ],
    [
     196,
     144,
     658,
     1000
    ],
    [
     198,
     144,
     658,
     1000
    ],
    [
     202,
     148,
     660,
     1000
    ],
    [
     204,
     152,
     662,
     1000
    ],
    [
     204,
     152,
     662,
     1000
    ],
    [
     206,
     152,
     662,
     1000
    ],
    [
     206,
     150,
     664,
     1000
    ],
    [
     192,
     150,
     664,
     1000
    ],
    [
     172,
     148,
     662,
     1000
    ],
    [
     164,
     146,
     662,
     1000
    ],
    [
     152,
     144,
     660,
     1000
    ],
    [
     144,
     142,
     658,
     1000
    ],
    [
     152,
     140,
     654,
     1000
    ],
    [
     160,
     140,
     652,
     1000
    ],
    [
     186,
     138,
     650,
     1000
    ],
    [
     184,
     138,
     648,
     1000
    ],
    [
     184,
     138,
     648,
     1000
    ],
    [
     184,
     136,
     648,
     1000
    ],
    [
     184,
     138,
     648,
     1000
    ],
    [
     184,
     136,
     648,
     1000
    ],
    [
     184,
     136,
     648,
     1000
    ],
    [
     184,
     136,
     648,
     1000
    ],
    [
     183,
     137,
     649,
     1000
    ]
   ],
   "bbox": [
    144,
    136,
    664,
    1000
   ],
   "margin": [
    144,
    136,
    168,
    104
   ],
   "facePaste": true,
   "browSwap": false,
   "faceBlank": true,
   "faceClass": 1,
   "attrManual": [
    "faceBlank"
   ],
   "arc": [
    0.0,
    0.0001,
    0.0032,
    0.0071,
    0.0244,
    0.0416,
    0.0876,
    0.1002,
    0.1293,
    0.1565,
    0.2158,
    0.2468,
    0.2942,
    0.3114,
    0.3303,
    0.3648,
    0.3876,
    0.4043,
    0.4228,
    0.4453,
    0.4659,
    0.4909,
    0.5095,
    0.5373,
    0.5518,
    0.5823,
    0.6015,
    0.61,
    0.6469,
    0.6711,
    0.6808,
    0.7031,
    0.7245,
    0.7397,
    0.7646,
    0.7808,
    0.8155,
    0.8425,
    0.8914,
    0.9187,
    0.9542,
    0.9691,
    0.9847,
    0.9905,
    0.9983,
    1.0,
    1.0,
    1.0,
    1.0
   ],
   "minSeconds": 0.6
  },
  "clap_s1_loop": {
   "label": "鼓掌·s1",
   "from": "idle",
   "to": "idle",
   "fps": 16,
   "frames": [
    "frames/clap_s1_loop/00.webp",
    "frames/clap_s1_loop/01.webp",
    "frames/clap_s1_loop/02.webp",
    "frames/clap_s1_loop/03.webp",
    "frames/clap_s1_loop/04.webp",
    "frames/clap_s1_loop/05.webp",
    "frames/clap_s1_loop/06.webp",
    "frames/clap_s1_loop/07.webp",
    "frames/clap_s1_loop/08.webp",
    "frames/clap_s1_loop/09.webp",
    "frames/clap_s1_loop/10.webp",
    "frames/clap_s1_loop/11.webp",
    "frames/clap_s1_loop/12.webp",
    "frames/clap_s1_loop/13.webp",
    "frames/clap_s1_loop/14.webp",
    "frames/clap_s1_loop/15.webp",
    "frames/clap_s1_loop/16.webp",
    "frames/clap_s1_loop/17.webp",
    "frames/clap_s1_loop/18.webp",
    "frames/clap_s1_loop/19.webp",
    "frames/clap_s1_loop/20.webp",
    "frames/clap_s1_loop/21.webp",
    "frames/clap_s1_loop/22.webp",
    "frames/clap_s1_loop/23.webp",
    "frames/clap_s1_loop/24.webp",
    "frames/clap_s1_loop/25.webp",
    "frames/clap_s1_loop/26.webp",
    "frames/clap_s1_loop/27.webp",
    "frames/clap_s1_loop/28.webp",
    "frames/clap_s1_loop/29.webp",
    "frames/clap_s1_loop/30.webp",
    "frames/clap_s1_loop/31.webp",
    "frames/clap_s1_loop/32.webp",
    "frames/clap_s1_loop/33.webp",
    "frames/clap_s1_loop/34.webp",
    "frames/clap_s1_loop/35.webp",
    "frames/clap_s1_loop/36.webp",
    "frames/clap_s1_loop/37.webp",
    "frames/clap_s1_loop/38.webp",
    "frames/clap_s1_loop/39.webp",
    "frames/clap_s1_loop/40.webp",
    "frames/clap_s1_loop/41.webp",
    "frames/clap_s1_loop/42.webp",
    "frames/clap_s1_loop/43.webp",
    "frames/clap_s1_loop/44.webp",
    "frames/clap_s1_loop/45.webp",
    "frames/clap_s1_loop/46.webp",
    "frames/clap_s1_loop/47.webp",
    "frames/clap_s1_loop/48.webp"
   ],
   "active": [
    [
     1,
     47
    ]
   ],
   "frameBBox": [
    [
     183,
     137,
     649,
     1000
    ],
    [
     184,
     138,
     648,
     1000
    ],
    [
     184,
     138,
     648,
     1000
    ],
    [
     184,
     138,
     648,
     1000
    ],
    [
     182,
     138,
     646,
     1000
    ],
    [
     180,
     140,
     646,
     1000
    ],
    [
     176,
     138,
     642,
     1000
    ],
    [
     176,
     138,
     642,
     1000
    ],
    [
     176,
     136,
     642,
     1000
    ],
    [
     178,
     134,
     642,
     1000
    ],
    [
     180,
     136,
     646,
     1000
    ],
    [
     182,
     136,
     646,
     1000
    ],
    [
     180,
     136,
     646,
     1000
    ],
    [
     180,
     136,
     644,
     1000
    ],
    [
     180,
     138,
     646,
     1000
    ],
    [
     182,
     140,
     648,
     1000
    ],
    [
     184,
     140,
     650,
     1000
    ],
    [
     184,
     140,
     648,
     1000
    ],
    [
     184,
     140,
     650,
     1000
    ],
    [
     186,
     140,
     652,
     1000
    ],
    [
     186,
     140,
     650,
     1000
    ],
    [
     182,
     138,
     646,
     1000
    ],
    [
     180,
     136,
     644,
     1000
    ],
    [
     176,
     136,
     640,
     1000
    ],
    [
     176,
     136,
     640,
     1000
    ],
    [
     180,
     138,
     644,
     1000
    ],
    [
     182,
     138,
     646,
     1000
    ],
    [
     184,
     140,
     648,
     1000
    ],
    [
     184,
     140,
     648,
     1000
    ],
    [
     182,
     138,
     646,
     1000
    ],
    [
     180,
     138,
     646,
     1000
    ],
    [
     178,
     136,
     642,
     1000
    ],
    [
     176,
     136,
     640,
     1000
    ],
    [
     176,
     136,
     640,
     1000
    ],
    [
     176,
     140,
     640,
     1000
    ],
    [
     176,
     140,
     640,
     1000
    ],
    [
     176,
     138,
     642,
     1000
    ],
    [
     176,
     136,
     642,
     1000
    ],
    [
     176,
     132,
     642,
     1000
    ],
    [
     176,
     132,
     642,
     1000
    ],
    [
     178,
     134,
     644,
     1000
    ],
    [
     180,
     136,
     644,
     1000
    ],
    [
     182,
     136,
     646,
     1000
    ],
    [
     182,
     136,
     648,
     1000
    ],
    [
     184,
     136,
     648,
     1000
    ],
    [
     184,
     137,
     648,
     1000
    ],
    [
     184,
     138,
     648,
     1000
    ],
    [
     184,
     136,
     648,
     1000
    ],
    [
     183,
     137,
     649,
     1000
    ]
   ],
   "bbox": [
    176,
    132,
    652,
    1000
   ],
   "margin": [
    176,
    132,
    180,
    104
   ],
   "facePaste": true,
   "browSwap": false,
   "faceBlank": true,
   "faceClass": 1,
   "attrManual": [
    "faceBlank"
   ],
   "arc": [
    0.0,
    0.0,
    0.0126,
    0.0235,
    0.0679,
    0.1069,
    0.1491,
    0.1736,
    0.2026,
    0.2205,
    0.2457,
    0.2567,
    0.2791,
    0.2902,
    0.323,
    0.3548,
    0.3703,
    0.3802,
    0.3966,
    0.4266,
    0.4346,
    0.4749,
    0.5021,
    0.5469,
    0.5565,
    0.5844,
    0.615,
    0.6517,
    0.6599,
    0.6768,
    0.6913,
    0.7295,
    0.7487,
    0.7601,
    0.7895,
    0.791,
    0.8212,
    0.8452,
    0.891,
    0.9098,
    0.9426,
    0.9634,
    0.9845,
    0.9883,
    0.9981,
    0.9997,
    0.9999,
    0.9999,
    1.0
   ],
   "minSeconds": 0.6
  },
  "stepbeat_s1_loop": {
   "label": "小幅踩拍·s1",
   "from": "idle",
   "to": "idle",
   "fps": 16,
   "frames": [
    "frames/stepbeat_s1_loop/00.webp",
    "frames/stepbeat_s1_loop/01.webp",
    "frames/stepbeat_s1_loop/02.webp",
    "frames/stepbeat_s1_loop/03.webp",
    "frames/stepbeat_s1_loop/04.webp",
    "frames/stepbeat_s1_loop/05.webp",
    "frames/stepbeat_s1_loop/06.webp",
    "frames/stepbeat_s1_loop/07.webp",
    "frames/stepbeat_s1_loop/08.webp",
    "frames/stepbeat_s1_loop/09.webp",
    "frames/stepbeat_s1_loop/10.webp",
    "frames/stepbeat_s1_loop/11.webp",
    "frames/stepbeat_s1_loop/12.webp",
    "frames/stepbeat_s1_loop/13.webp",
    "frames/stepbeat_s1_loop/14.webp",
    "frames/stepbeat_s1_loop/15.webp",
    "frames/stepbeat_s1_loop/16.webp",
    "frames/stepbeat_s1_loop/17.webp",
    "frames/stepbeat_s1_loop/18.webp",
    "frames/stepbeat_s1_loop/19.webp",
    "frames/stepbeat_s1_loop/20.webp",
    "frames/stepbeat_s1_loop/21.webp",
    "frames/stepbeat_s1_loop/22.webp",
    "frames/stepbeat_s1_loop/23.webp",
    "frames/stepbeat_s1_loop/24.webp",
    "frames/stepbeat_s1_loop/25.webp",
    "frames/stepbeat_s1_loop/26.webp",
    "frames/stepbeat_s1_loop/27.webp",
    "frames/stepbeat_s1_loop/28.webp",
    "frames/stepbeat_s1_loop/29.webp",
    "frames/stepbeat_s1_loop/30.webp",
    "frames/stepbeat_s1_loop/31.webp",
    "frames/stepbeat_s1_loop/32.webp",
    "frames/stepbeat_s1_loop/33.webp",
    "frames/stepbeat_s1_loop/34.webp",
    "frames/stepbeat_s1_loop/35.webp",
    "frames/stepbeat_s1_loop/36.webp",
    "frames/stepbeat_s1_loop/37.webp",
    "frames/stepbeat_s1_loop/38.webp",
    "frames/stepbeat_s1_loop/39.webp",
    "frames/stepbeat_s1_loop/40.webp",
    "frames/stepbeat_s1_loop/41.webp",
    "frames/stepbeat_s1_loop/42.webp",
    "frames/stepbeat_s1_loop/43.webp",
    "frames/stepbeat_s1_loop/44.webp",
    "frames/stepbeat_s1_loop/45.webp",
    "frames/stepbeat_s1_loop/46.webp",
    "frames/stepbeat_s1_loop/47.webp",
    "frames/stepbeat_s1_loop/48.webp"
   ],
   "active": [
    [
     1,
     47
    ]
   ],
   "frameBBox": [
    [
     183,
     137,
     649,
     1000
    ],
    [
     184,
     138,
     648,
     1000
    ],
    [
     184,
     138,
     648,
     1000
    ],
    [
     184,
     138,
     648,
     1000
    ],
    [
     182,
     142,
     646,
     1000
    ],
    [
     180,
     146,
     644,
     1000
    ],
    [
     174,
     154,
     638,
     998
    ],
    [
     172,
     156,
     636,
     998
    ],
    [
     172,
     158,
     636,
     998
    ],
    [
     175,
     156,
     640,
     996
    ],
    [
     188,
     146,
     652,
     984
    ],
    [
     194,
     144,
     658,
     994
    ],
    [
     206,
     140,
     668,
     1000
    ],
    [
     210,
     136,
     672,
     1000
    ],
    [
     216,
     132,
     680,
     1000
    ],
    [
     208,
     136,
     674,
     1000
    ],
    [
     200,
     140,
     664,
     1000
    ],
    [
     184,
     152,
     648,
     1000
    ],
    [
     178,
     150,
     642,
     1000
    ],
    [
     172,
     142,
     636,
     1000
    ],
    [
     172,
     138,
     636,
     1000
    ],
    [
     184,
     140,
     648,
     980
    ],
    [
     188,
     138,
     654,
     992
    ],
    [
     200,
     130,
     662,
     1000
    ],
    [
     202,
     130,
     666,
     1000
    ],
    [
     198,
     136,
     662,
     1000
    ],
    [
     192,
     142,
     656,
     1000
    ],
    [
     180,
     148,
     644,
     1000
    ],
    [
     174,
     146,
     638,
     1000
    ],
    [
     166,
     144,
     630,
     1000
    ],
    [
     164,
     140,
     626,
     1000
    ],
    [
     164,
     128,
     626,
     1000
    ],
    [
     166,
     120,
     630,
     996
    ],
    [
     166,
     120,
     630,
     996
    ],
    [
     170,
     116,
     636,
     996
    ],
    [
     174,
     114,
     638,
     994
    ],
    [
     178,
     118,
     642,
     994
    ],
    [
     178,
     124,
     642,
     994
    ],
    [
     180,
     136,
     644,
     990
    ],
    [
     180,
     144,
     646,
     992
    ],
    [
     182,
     148,
     646,
     1000
    ],
    [
     182,
     148,
     646,
     1000
    ],
    [
     182,
     144,
     646,
     1000
    ],
    [
     182,
     140,
     646,
     1000
    ],
    [
     184,
     138,
     648,
     1000
    ],
    [
     182,
     138,
     648,
     1000
    ],
    [
     182,
     138,
     648,
     1000
    ],
    [
     184,
     138,
     648,
     1000
    ],
    [
     183,
     137,
     649,
     1000
    ]
   ],
   "bbox": [
    164,
    114,
    680,
    1000
   ],
   "margin": [
    164,
    114,
    152,
    104
   ],
   "facePaste": true,
   "browSwap": false,
   "faceBlank": true,
   "faceClass": 1,
   "attrManual": [
    "faceBlank"
   ],
   "arc": [
    0.0,
    0.0,
    0.0004,
    0.0028,
    0.0242,
    0.0401,
    0.0697,
    0.0831,
    0.0936,
    0.1091,
    0.1512,
    0.1779,
    0.2119,
    0.2319,
    0.2599,
    0.287,
    0.322,
    0.3701,
    0.3908,
    0.4268,
    0.4426,
    0.4812,
    0.5069,
    0.5475,
    0.5607,
    0.5914,
    0.624,
    0.6625,
    0.6812,
    0.7112,
    0.7238,
    0.7611,
    0.7919,
    0.7998,
    0.8227,
    0.8352,
    0.8564,
    0.8779,
    0.9187,
    0.9425,
    0.966,
    0.9674,
    0.9824,
    0.99,
    0.9994,
    1.0,
    1.0,
    1.0,
    1.0
   ],
   "minSeconds": 0.6
  },
  "hips_s1_fix_loop": {
   "label": "叉腰·s1·修嘴",
   "from": "idle",
   "to": "idle",
   "fps": 16,
   "frames": [
    "frames/hips_s1_fix_loop/00.webp",
    "frames/hips_s1_fix_loop/01.webp",
    "frames/hips_s1_fix_loop/02.webp",
    "frames/hips_s1_fix_loop/03.webp",
    "frames/hips_s1_fix_loop/04.webp",
    "frames/hips_s1_fix_loop/05.webp",
    "frames/hips_s1_fix_loop/06.webp",
    "frames/hips_s1_fix_loop/07.webp",
    "frames/hips_s1_fix_loop/08.webp",
    "frames/hips_s1_fix_loop/09.webp",
    "frames/hips_s1_fix_loop/10.webp",
    "frames/hips_s1_fix_loop/11.webp",
    "frames/hips_s1_fix_loop/12.webp",
    "frames/hips_s1_fix_loop/13.webp",
    "frames/hips_s1_fix_loop/14.webp",
    "frames/hips_s1_fix_loop/15.webp",
    "frames/hips_s1_fix_loop/16.webp",
    "frames/hips_s1_fix_loop/17.webp",
    "frames/hips_s1_fix_loop/18.webp",
    "frames/hips_s1_fix_loop/19.webp",
    "frames/hips_s1_fix_loop/20.webp",
    "frames/hips_s1_fix_loop/21.webp",
    "frames/hips_s1_fix_loop/22.webp",
    "frames/hips_s1_fix_loop/23.webp",
    "frames/hips_s1_fix_loop/24.webp",
    "frames/hips_s1_fix_loop/25.webp",
    "frames/hips_s1_fix_loop/26.webp",
    "frames/hips_s1_fix_loop/27.webp",
    "frames/hips_s1_fix_loop/28.webp",
    "frames/hips_s1_fix_loop/29.webp",
    "frames/hips_s1_fix_loop/30.webp",
    "frames/hips_s1_fix_loop/31.webp",
    "frames/hips_s1_fix_loop/32.webp",
    "frames/hips_s1_fix_loop/33.webp",
    "frames/hips_s1_fix_loop/34.webp",
    "frames/hips_s1_fix_loop/35.webp",
    "frames/hips_s1_fix_loop/36.webp",
    "frames/hips_s1_fix_loop/37.webp",
    "frames/hips_s1_fix_loop/38.webp",
    "frames/hips_s1_fix_loop/39.webp",
    "frames/hips_s1_fix_loop/40.webp",
    "frames/hips_s1_fix_loop/41.webp",
    "frames/hips_s1_fix_loop/42.webp",
    "frames/hips_s1_fix_loop/43.webp",
    "frames/hips_s1_fix_loop/44.webp",
    "frames/hips_s1_fix_loop/45.webp",
    "frames/hips_s1_fix_loop/46.webp",
    "frames/hips_s1_fix_loop/47.webp",
    "frames/hips_s1_fix_loop/48.webp"
   ],
   "active": [
    [
     1,
     47
    ]
   ],
   "frameBBox": [
    [
     183,
     137,
     649,
     1000
    ],
    [
     184,
     138,
     648,
     1000
    ],
    [
     184,
     138,
     648,
     1000
    ],
    [
     184,
     138,
     648,
     1000
    ],
    [
     182,
     138,
     652,
     1000
    ],
    [
     180,
     138,
     654,
     1000
    ],
    [
     180,
     138,
     652,
     1000
    ],
    [
     180,
     136,
     646,
     1000
    ],
    [
     182,
     134,
     646,
     1000
    ],
    [
     182,
     134,
     648,
     1000
    ],
    [
     186,
     136,
     650,
     1000
    ],
    [
     188,
     140,
     652,
     1000
    ],
    [
     190,
     144,
     652,
     1000
    ],
    [
     192,
     146,
     654,
     1000
    ],
    [
     192,
     146,
     654,
     1000
    ],
    [
     190,
     144,
     654,
     1000
    ],
    [
     190,
     144,
     654,
     1000
    ],
    [
     188,
     142,
     652,
     1000
    ],
    [
     188,
     140,
     652,
     1000
    ],
    [
     186,
     140,
     650,
     1000
    ],
    [
     186,
     140,
     650,
     1000
    ],
    [
     186,
     140,
     650,
     1000
    ],
    [
     186,
     140,
     650,
     1000
    ],
    [
     186,
     140,
     650,
     1000
    ],
    [
     186,
     140,
     650,
     1000
    ],
    [
     186,
     140,
     650,
     1000
    ],
    [
     186,
     140,
     650,
     1000
    ],
    [
     186,
     140,
     650,
     1000
    ],
    [
     184,
     140,
     650,
     1000
    ],
    [
     184,
     138,
     648,
     1000
    ],
    [
     182,
     138,
     646,
     1000
    ],
    [
     180,
     136,
     644,
     1000
    ],
    [
     178,
     136,
     644,
     1000
    ],
    [
     178,
     136,
     642,
     1000
    ],
    [
     178,
     134,
     642,
     1000
    ],
    [
     178,
     134,
     642,
     1000
    ],
    [
     178,
     134,
     644,
     1000
    ],
    [
     178,
     132,
     644,
     1000
    ],
    [
     178,
     130,
     644,
     1000
    ],
    [
     178,
     130,
     654,
     1000
    ],
    [
     180,
     132,
     650,
     1000
    ],
    [
     180,
     134,
     646,
     1000
    ],
    [
     182,
     136,
     646,
     1000
    ],
    [
     182,
     136,
     648,
     1000
    ],
    [
     182,
     136,
     648,
     1000
    ],
    [
     182,
     136,
     648,
     1000
    ],
    [
     182,
     136,
     648,
     1000
    ],
    [
     184,
     136,
     648,
     1000
    ],
    [
     183,
     137,
     649,
     1000
    ]
   ],
   "bbox": [
    178,
    130,
    654,
    1000
   ],
   "margin": [
    178,
    130,
    178,
    104
   ],
   "facePaste": true,
   "browSwap": false,
   "faceBlank": true,
   "faceClass": 1,
   "attrManual": [
    "faceBlank"
   ],
   "arc": [
    0.0,
    0.0006,
    0.0213,
    0.0488,
    0.1076,
    0.1473,
    0.1955,
    0.2286,
    0.308,
    0.3594,
    0.4242,
    0.4517,
    0.5014,
    0.5155,
    0.5546,
    0.567,
    0.5678,
    0.5814,
    0.5856,
    0.588,
    0.588,
    0.588,
    0.588,
    0.588,
    0.588,
    0.588,
    0.5883,
    0.5896,
    0.5899,
    0.599,
    0.6032,
    0.6259,
    0.6394,
    0.6413,
    0.6795,
    0.6979,
    0.7471,
    0.7702,
    0.8416,
    0.8699,
    0.905,
    0.9312,
    0.9689,
    0.9828,
    0.9991,
    1.0,
    1.0,
    1.0,
    1.0
   ],
   "minSeconds": 0.6
  }
 },
 "actions": [
  {
   "id": "think_b1_final",
   "label": "思考 第一批 final s1",
   "in": "think_b1_final_loop",
   "oneshot": true,
   "group": "think_b1_final"
  },
  {
   "id": "shrug_b1_final_s2",
   "label": "摊手 第一批 final s2",
   "in": "shrug_b1_final_s2_loop",
   "oneshot": true,
   "group": "shrug_b1_final_s2"
  },
  {
   "id": "think_b1_draft",
   "label": "思考 第一批 draft s1",
   "in": "think_b1_draft_loop",
   "oneshot": true,
   "group": "think_b1_draft"
  },
  {
   "id": "wave_b1_draft",
   "label": "挥手 第一批 draft s1",
   "in": "wave_b1_draft_loop",
   "oneshot": true,
   "group": "wave_b1_draft"
  },
  {
   "id": "wave_h1_s2_canny",
   "label": "挥手 h1 s2·canny（手盖脸）",
   "in": "wave_h1_s2_canny_loop",
   "oneshot": true,
   "group": "wave_h1_s2_canny"
  },
  {
   "id": "clap_s1",
   "label": "鼓掌·s1",
   "in": "clap_s1_loop",
   "oneshot": true,
   "group": "clap_s1"
  },
  {
   "id": "stepbeat_s1",
   "label": "小幅踩拍·s1",
   "in": "stepbeat_s1_loop",
   "oneshot": true,
   "group": "stepbeat_s1"
  },
  {
   "id": "hips_s1_fix",
   "label": "叉腰·s1·修嘴",
   "in": "hips_s1_fix_loop",
   "oneshot": true,
   "group": "hips_s1_fix"
  }
 ],
 "minMargin": {
  "left": 144,
  "top": 114,
  "right": 118,
  "bottom": 102,
  "min": 102
 },
 "faceMode": "ink",
 "headTracks": {
  "frames/think_b1_final_loop/00.webp": {
   "m": [
    1.00001,
    1e-05,
    0.0,
    -0.02
   ],
   "scale": 1.0,
   "rot_deg": 0.0,
   "shift": [
    -0.0,
    -0.0
   ],
   "inliers": 331,
   "residual_px": 0.0,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_final_loop_00.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_00.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_00_u.webp",
    "rect": [
     297,
     381,
     226,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.01,
     0.0
    ],
    "eyeR": [
     0.0,
     -0.0
    ],
    "mouth": [
     0.0,
     -0.0
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_final_loop/01.webp": {
   "m": [
    1.00234,
    -0.00124,
    -1.73,
    -1.12
   ],
   "scale": 1.0023,
   "rot_deg": -0.07,
   "shift": [
    -0.2,
    -0.5
   ],
   "inliers": 199,
   "residual_px": 0.47,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_final_loop_01.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_01.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_01_u.webp",
    "rect": [
     296,
     380,
     226,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.2,
     -0.09
    ],
    "eyeR": [
     -0.06,
     -0.0
    ],
    "mouth": [
     0.0,
     0.06
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_final_loop/02.webp": {
   "m": [
    1.00221,
    -0.00257,
    -2.35,
    -0.41
   ],
   "scale": 1.0022,
   "rot_deg": -0.15,
   "shift": [
    -0.2,
    -0.4
   ],
   "inliers": 205,
   "residual_px": 0.53,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_final_loop_02.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_02.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_02_u.webp",
    "rect": [
     296,
     380,
     226,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.27,
     -0.09
    ],
    "eyeR": [
     -0.06,
     0.03
    ],
    "mouth": [
     0.04,
     0.15
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_final_loop/03.webp": {
   "m": [
    1.00233,
    -0.00529,
    -3.91,
    0.41
   ],
   "scale": 1.0023,
   "rot_deg": -0.3,
   "shift": [
    -0.5,
    -0.7
   ],
   "inliers": 188,
   "residual_px": 0.5,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_final_loop_03.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_03.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_03_u.webp",
    "rect": [
     296,
     380,
     226,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.23,
     -0.1
    ],
    "eyeR": [
     -0.09,
     -0.04
    ],
    "mouth": [
     0.04,
     0.09
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_final_loop/04.webp": {
   "m": [
    1.00208,
    -0.0057,
    -4.52,
    0.87
   ],
   "scale": 1.0021,
   "rot_deg": -0.33,
   "shift": [
    -1.0,
    -0.5
   ],
   "inliers": 195,
   "residual_px": 0.59,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_final_loop_04.webp",
    "rect": [
     168,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_04.webp",
    "rect": [
     168,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_04_u.webp",
    "rect": [
     296,
     380,
     226,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.23,
     -0.08
    ],
    "eyeR": [
     -0.08,
     0.1
    ],
    "mouth": [
     0.04,
     0.23
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_final_loop/05.webp": {
   "m": [
    1.00218,
    -0.00879,
    -6.38,
    2.04
   ],
   "scale": 1.0022,
   "rot_deg": -0.5,
   "shift": [
    -1.4,
    -0.5
   ],
   "inliers": 185,
   "residual_px": 0.56,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_final_loop_05.webp",
    "rect": [
     168,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_05.webp",
    "rect": [
     168,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_05_u.webp",
    "rect": [
     295,
     380,
     227,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.23,
     0.01
    ],
    "eyeR": [
     -0.08,
     0.06
    ],
    "mouth": [
     0.11,
     0.22
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_final_loop/06.webp": {
   "m": [
    1.00203,
    -0.01327,
    -9.25,
    4.05
   ],
   "scale": 1.0021,
   "rot_deg": -0.76,
   "shift": [
    -2.2,
    -0.4
   ],
   "inliers": 188,
   "residual_px": 0.57,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_final_loop_06.webp",
    "rect": [
     167,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_06.webp",
    "rect": [
     167,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_06_u.webp",
    "rect": [
     294,
     379,
     226,
     106
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.26,
     0.01
    ],
    "eyeR": [
     -0.04,
     0.06
    ],
    "mouth": [
     0.04,
     0.22
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_final_loop/07.webp": {
   "m": [
    1.00161,
    -0.01688,
    -11.09,
    5.9
   ],
   "scale": 1.0017,
   "rot_deg": -0.97,
   "shift": [
    -2.6,
    -0.2
   ],
   "inliers": 172,
   "residual_px": 0.56,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_final_loop_07.webp",
    "rect": [
     166,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_07.webp",
    "rect": [
     166,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_07_u.webp",
    "rect": [
     294,
     379,
     226,
     107
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.33,
     -0.01
    ],
    "eyeR": [
     -0.04,
     0.03
    ],
    "mouth": [
     0.14,
     0.1
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_final_loop/08.webp": {
   "m": [
    1.00235,
    -0.01981,
    -13.72,
    6.88
   ],
   "scale": 1.0025,
   "rot_deg": -1.13,
   "shift": [
    -3.5,
    -0.1
   ],
   "inliers": 180,
   "residual_px": 0.55,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_final_loop_08.webp",
    "rect": [
     165,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_08.webp",
    "rect": [
     165,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_08_u.webp",
    "rect": [
     292,
     379,
     226,
     107
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.26,
     -0.08
    ],
    "eyeR": [
     -0.05,
     0.03
    ],
    "mouth": [
     -0.1,
     0.1
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_final_loop/09.webp": {
   "m": [
    1.00174,
    -0.02454,
    -15.9,
    9.08
   ],
   "scale": 1.002,
   "rot_deg": -1.4,
   "shift": [
    -3.8,
    -0.1
   ],
   "inliers": 192,
   "residual_px": 0.59,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_final_loop_09.webp",
    "rect": [
     165,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_09.webp",
    "rect": [
     165,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_09_u.webp",
    "rect": [
     292,
     379,
     226,
     107
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 10,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.38,
     -0.01
    ],
    "eyeR": [
     -0.05,
     0.13
    ],
    "mouth": [
     0.07,
     0.15
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_final_loop/10.webp": {
   "m": [
    1.00188,
    -0.02837,
    -18.68,
    10.59
   ],
   "scale": 1.0023,
   "rot_deg": -1.62,
   "shift": [
    -4.7,
    -0.1
   ],
   "inliers": 194,
   "residual_px": 0.58,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_final_loop_10.webp",
    "rect": [
     164,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_10.webp",
    "rect": [
     164,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_10_u.webp",
    "rect": [
     291,
     378,
     227,
     109
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 13,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.3,
     0.06
    ],
    "eyeR": [
     -0.03,
     0.13
    ],
    "mouth": [
     0.0,
     0.26
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_final_loop/11.webp": {
   "m": [
    1.00142,
    -0.03052,
    -19.84,
    11.75
   ],
   "scale": 1.0019,
   "rot_deg": -1.75,
   "shift": [
    -5.1,
    -0.1
   ],
   "inliers": 191,
   "residual_px": 0.6,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_final_loop_11.webp",
    "rect": [
     164,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_11.webp",
    "rect": [
     164,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_11_u.webp",
    "rect": [
     290,
     378,
     226,
     109
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.36,
     0.06
    ],
    "eyeR": [
     -0.03,
     0.11
    ],
    "mouth": [
     0.07,
     0.26
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_final_loop/12.webp": {
   "m": [
    1.00198,
    -0.03398,
    -22.39,
    13.06
   ],
   "scale": 1.0026,
   "rot_deg": -1.94,
   "shift": [
    -5.8,
    0.1
   ],
   "inliers": 165,
   "residual_px": 0.56,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_final_loop_12.webp",
    "rect": [
     163,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_12.webp",
    "rect": [
     163,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_12_u.webp",
    "rect": [
     290,
     378,
     226,
     109
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.32,
     0.06
    ],
    "eyeR": [
     -0.06,
     0.11
    ],
    "mouth": [
     0.01,
     0.23
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_final_loop/13.webp": {
   "m": [
    1.00147,
    -0.03687,
    -23.83,
    14.54
   ],
   "scale": 1.0021,
   "rot_deg": -2.11,
   "shift": [
    -6.1,
    0.2
   ],
   "inliers": 164,
   "residual_px": 0.54,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_final_loop_13.webp",
    "rect": [
     163,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_13.webp",
    "rect": [
     163,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_13_u.webp",
    "rect": [
     289,
     378,
     228,
     110
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.32,
     0.04
    ],
    "eyeR": [
     -0.08,
     0.13
    ],
    "mouth": [
     0.06,
     0.19
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_final_loop/14.webp": {
   "m": [
    1.00124,
    -0.04013,
    -25.62,
    16.09
   ],
   "scale": 1.002,
   "rot_deg": -2.3,
   "shift": [
    -6.4,
    0.3
   ],
   "inliers": 163,
   "residual_px": 0.6,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_final_loop_14.webp",
    "rect": [
     163,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_14.webp",
    "rect": [
     163,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_14_u.webp",
    "rect": [
     289,
     378,
     227,
     110
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 49,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.32,
     -0.02
    ],
    "eyeR": [
     -0.06,
     0.13
    ],
    "mouth": [
     0.01,
     0.19
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_final_loop/15.webp": {
   "m": [
    1.00092,
    -0.041,
    -26.1,
    16.65
   ],
   "scale": 1.0018,
   "rot_deg": -2.35,
   "shift": [
    -6.6,
    0.3
   ],
   "inliers": 159,
   "residual_px": 0.55,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_final_loop_15.webp",
    "rect": [
     162,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_15.webp",
    "rect": [
     162,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_15_u.webp",
    "rect": [
     288,
     378,
     228,
     110
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 51,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.32,
     -0.02
    ],
    "eyeR": [
     -0.05,
     0.12
    ],
    "mouth": [
     0.06,
     0.16
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_final_loop/16.webp": {
   "m": [
    1.00116,
    -0.04107,
    -26.28,
    16.57
   ],
   "scale": 1.002,
   "rot_deg": -2.35,
   "shift": [
    -6.7,
    0.3
   ],
   "inliers": 161,
   "residual_px": 0.54,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_final_loop_16.webp",
    "rect": [
     162,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_16.webp",
    "rect": [
     162,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_16_u.webp",
    "rect": [
     288,
     378,
     228,
     110
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 56,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.33,
     -0.0
    ],
    "eyeR": [
     -0.05,
     0.12
    ],
    "mouth": [
     0.06,
     0.15
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_final_loop/17.webp": {
   "m": [
    1.00126,
    -0.04124,
    -26.43,
    16.6
   ],
   "scale": 1.0021,
   "rot_deg": -2.36,
   "shift": [
    -6.7,
    0.3
   ],
   "inliers": 165,
   "residual_px": 0.56,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_final_loop_17.webp",
    "rect": [
     162,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_17.webp",
    "rect": [
     162,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_17_u.webp",
    "rect": [
     288,
     378,
     228,
     110
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 56,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.34,
     0.01
    ],
    "eyeR": [
     -0.05,
     0.12
    ],
    "mouth": [
     0.09,
     0.15
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_final_loop/18.webp": {
   "m": [
    1.00128,
    -0.04128,
    -26.49,
    16.58
   ],
   "scale": 1.0021,
   "rot_deg": -2.36,
   "shift": [
    -6.8,
    0.3
   ],
   "inliers": 168,
   "residual_px": 0.61,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_final_loop_18.webp",
    "rect": [
     162,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_18.webp",
    "rect": [
     162,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_18_u.webp",
    "rect": [
     288,
     378,
     228,
     110
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 58,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.38,
     0.02
    ],
    "eyeR": [
     -0.01,
     0.13
    ],
    "mouth": [
     0.13,
     0.16
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_final_loop/19.webp": {
   "m": [
    1.0013,
    -0.0413,
    -26.52,
    16.58
   ],
   "scale": 1.0022,
   "rot_deg": -2.36,
   "shift": [
    -6.8,
    0.3
   ],
   "inliers": 168,
   "residual_px": 0.63,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_final_loop_19.webp",
    "rect": [
     162,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_19.webp",
    "rect": [
     162,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_19_u.webp",
    "rect": [
     288,
     378,
     228,
     110
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 59,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.38,
     0.02
    ],
    "eyeR": [
     -0.0,
     0.13
    ],
    "mouth": [
     0.13,
     0.16
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_final_loop/20.webp": {
   "m": [
    1.00122,
    -0.04135,
    -26.49,
    16.64
   ],
   "scale": 1.0021,
   "rot_deg": -2.36,
   "shift": [
    -6.8,
    0.3
   ],
   "inliers": 160,
   "residual_px": 0.58,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_final_loop_20.webp",
    "rect": [
     162,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_20.webp",
    "rect": [
     162,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_20_u.webp",
    "rect": [
     288,
     378,
     228,
     110
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 58,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.38,
     0.02
    ],
    "eyeR": [
     -0.0,
     0.13
    ],
    "mouth": [
     0.13,
     0.16
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_final_loop/21.webp": {
   "m": [
    1.00133,
    -0.04141,
    -26.58,
    16.61
   ],
   "scale": 1.0022,
   "rot_deg": -2.37,
   "shift": [
    -6.8,
    0.3
   ],
   "inliers": 164,
   "residual_px": 0.58,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_final_loop_21.webp",
    "rect": [
     162,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_21.webp",
    "rect": [
     162,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_21_u.webp",
    "rect": [
     288,
     378,
     228,
     110
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 57,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.38,
     0.03
    ],
    "eyeR": [
     -0.01,
     0.15
    ],
    "mouth": [
     0.13,
     0.16
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_final_loop/22.webp": {
   "m": [
    1.00113,
    -0.04201,
    -26.7,
    16.92
   ],
   "scale": 1.002,
   "rot_deg": -2.4,
   "shift": [
    -6.7,
    0.3
   ],
   "inliers": 171,
   "residual_px": 0.61,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_final_loop_22.webp",
    "rect": [
     162,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_22.webp",
    "rect": [
     162,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_22_u.webp",
    "rect": [
     288,
     378,
     228,
     110
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 58,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.38,
     0.04
    ],
    "eyeR": [
     -0.01,
     0.15
    ],
    "mouth": [
     0.13,
     0.16
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_final_loop/23.webp": {
   "m": [
    1.00136,
    -0.04117,
    -26.5,
    16.52
   ],
   "scale": 1.0022,
   "rot_deg": -2.35,
   "shift": [
    -6.8,
    0.3
   ],
   "inliers": 159,
   "residual_px": 0.57,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_final_loop_23.webp",
    "rect": [
     162,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_23.webp",
    "rect": [
     162,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_23_u.webp",
    "rect": [
     288,
     378,
     228,
     110
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 59,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.38,
     0.04
    ],
    "eyeR": [
     -0.02,
     0.1
    ],
    "mouth": [
     0.13,
     0.14
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_final_loop/24.webp": {
   "m": [
    1.0013,
    -0.04121,
    -26.47,
    16.57
   ],
   "scale": 1.0021,
   "rot_deg": -2.36,
   "shift": [
    -6.8,
    0.3
   ],
   "inliers": 168,
   "residual_px": 0.61,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_final_loop_24.webp",
    "rect": [
     162,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_24.webp",
    "rect": [
     162,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_24_u.webp",
    "rect": [
     288,
     378,
     228,
     110
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 56,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.38,
     0.04
    ],
    "eyeR": [
     -0.02,
     0.1
    ],
    "mouth": [
     0.13,
     0.14
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_final_loop/25.webp": {
   "m": [
    1.00127,
    -0.0418,
    -26.61,
    16.81
   ],
   "scale": 1.0021,
   "rot_deg": -2.39,
   "shift": [
    -6.6,
    0.3
   ],
   "inliers": 165,
   "residual_px": 0.6,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_final_loop_25.webp",
    "rect": [
     162,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_25.webp",
    "rect": [
     162,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_25_u.webp",
    "rect": [
     288,
     378,
     228,
     110
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 56,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.29,
     0.01
    ],
    "eyeR": [
     -0.06,
     0.14
    ],
    "mouth": [
     0.07,
     0.14
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_final_loop/26.webp": {
   "m": [
    1.00117,
    -0.04176,
    -26.49,
    16.86
   ],
   "scale": 1.002,
   "rot_deg": -2.39,
   "shift": [
    -6.6,
    0.3
   ],
   "inliers": 157,
   "residual_px": 0.55,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_final_loop_26.webp",
    "rect": [
     162,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_26.webp",
    "rect": [
     162,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_26_u.webp",
    "rect": [
     288,
     378,
     228,
     110
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 53,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.29,
     -0.04
    ],
    "eyeR": [
     -0.06,
     0.14
    ],
    "mouth": [
     0.07,
     0.14
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_final_loop/27.webp": {
   "m": [
    1.00144,
    -0.04017,
    -25.8,
    16.17
   ],
   "scale": 1.0022,
   "rot_deg": -2.3,
   "shift": [
    -6.5,
    0.4
   ],
   "inliers": 170,
   "residual_px": 0.6,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_final_loop_27.webp",
    "rect": [
     162,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_27.webp",
    "rect": [
     162,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_27_u.webp",
    "rect": [
     288,
     378,
     228,
     110
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.29,
     -0.07
    ],
    "eyeR": [
     -0.06,
     0.08
    ],
    "mouth": [
     0.01,
     0.14
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_final_loop/28.webp": {
   "m": [
    1.00062,
    -0.04012,
    -25.17,
    16.42
   ],
   "scale": 1.0014,
   "rot_deg": -2.3,
   "shift": [
    -6.2,
    0.3
   ],
   "inliers": 160,
   "residual_px": 0.61,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_final_loop_28.webp",
    "rect": [
     163,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_28.webp",
    "rect": [
     163,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_28_u.webp",
    "rect": [
     289,
     378,
     227,
     110
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.37,
     -0.07
    ],
    "eyeR": [
     -0.04,
     0.08
    ],
    "mouth": [
     0.09,
     0.11
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_final_loop/29.webp": {
   "m": [
    1.00168,
    -0.03703,
    -23.92,
    14.57
   ],
   "scale": 1.0024,
   "rot_deg": -2.12,
   "shift": [
    -6.0,
    0.2
   ],
   "inliers": 167,
   "residual_px": 0.56,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_final_loop_29.webp",
    "rect": [
     163,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_29.webp",
    "rect": [
     163,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_29_u.webp",
    "rect": [
     289,
     378,
     227,
     110
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.39,
     0.03
    ],
    "eyeR": [
     -0.04,
     0.12
    ],
    "mouth": [
     0.14,
     0.14
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_final_loop/30.webp": {
   "m": [
    1.00204,
    -0.03422,
    -22.42,
    13.17
   ],
   "scale": 1.0026,
   "rot_deg": -1.96,
   "shift": [
    -5.7,
    0.1
   ],
   "inliers": 167,
   "residual_px": 0.61,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_final_loop_30.webp",
    "rect": [
     163,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_30.webp",
    "rect": [
     163,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_30_u.webp",
    "rect": [
     290,
     378,
     226,
     109
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 10,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.45,
     0.04
    ],
    "eyeR": [
     -0.01,
     0.12
    ],
    "mouth": [
     0.21,
     0.16
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_final_loop/31.webp": {
   "m": [
    1.00195,
    -0.03048,
    -20.02,
    11.63
   ],
   "scale": 1.0024,
   "rot_deg": -1.74,
   "shift": [
    -5.0,
    0.1
   ],
   "inliers": 185,
   "residual_px": 0.55,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_final_loop_31.webp",
    "rect": [
     164,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_31.webp",
    "rect": [
     164,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_31_u.webp",
    "rect": [
     290,
     379,
     228,
     108
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.41,
     0.04
    ],
    "eyeR": [
     -0.04,
     0.05
    ],
    "mouth": [
     0.21,
     0.16
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_final_loop/32.webp": {
   "m": [
    1.00211,
    -0.02729,
    -17.76,
    10.18
   ],
   "scale": 1.0025,
   "rot_deg": -1.56,
   "shift": [
    -4.2,
    0.0
   ],
   "inliers": 174,
   "residual_px": 0.57,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_final_loop_32.webp",
    "rect": [
     165,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_32.webp",
    "rect": [
     165,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_32_u.webp",
    "rect": [
     292,
     379,
     226,
     108
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 11,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.41,
     0.01
    ],
    "eyeR": [
     -0.04,
     0.05
    ],
    "mouth": [
     0.1,
     0.15
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_final_loop/33.webp": {
   "m": [
    1.00179,
    -0.02479,
    -16.04,
    9.22
   ],
   "scale": 1.0021,
   "rot_deg": -1.42,
   "shift": [
    -3.8,
    -0.1
   ],
   "inliers": 170,
   "residual_px": 0.58,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_final_loop_33.webp",
    "rect": [
     165,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_33.webp",
    "rect": [
     165,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_33_u.webp",
    "rect": [
     292,
     379,
     226,
     108
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.41,
     0.01
    ],
    "eyeR": [
     -0.04,
     0.09
    ],
    "mouth": [
     0.1,
     0.15
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_final_loop/34.webp": {
   "m": [
    1.00225,
    -0.01936,
    -13.01,
    6.49
   ],
   "scale": 1.0024,
   "rot_deg": -1.11,
   "shift": [
    -3.1,
    -0.4
   ],
   "inliers": 190,
   "residual_px": 0.58,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_final_loop_34.webp",
    "rect": [
     166,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_34.webp",
    "rect": [
     166,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_34_u.webp",
    "rect": [
     293,
     379,
     227,
     107
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.34,
     0.01
    ],
    "eyeR": [
     0.01,
     0.09
    ],
    "mouth": [
     0.19,
     0.15
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_final_loop/35.webp": {
   "m": [
    1.00193,
    -0.01731,
    -11.44,
    6.04
   ],
   "scale": 1.0021,
   "rot_deg": -0.99,
   "shift": [
    -2.6,
    -0.1
   ],
   "inliers": 187,
   "residual_px": 0.59,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_final_loop_35.webp",
    "rect": [
     166,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_35.webp",
    "rect": [
     166,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_35_u.webp",
    "rect": [
     293,
     379,
     227,
     107
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.43,
     0.13
    ],
    "eyeR": [
     0.06,
     0.07
    ],
    "mouth": [
     0.2,
     0.14
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_final_loop/36.webp": {
   "m": [
    1.00269,
    -0.01247,
    -8.85,
    3.51
   ],
   "scale": 1.0028,
   "rot_deg": -0.71,
   "shift": [
    -1.9,
    -0.3
   ],
   "inliers": 176,
   "residual_px": 0.58,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_final_loop_36.webp",
    "rect": [
     167,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_36.webp",
    "rect": [
     167,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_36_u.webp",
    "rect": [
     294,
     379,
     228,
     107
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 20,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.33,
     -0.07
    ],
    "eyeR": [
     0.01,
     0.03
    ],
    "mouth": [
     0.19,
     0.09
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_final_loop/37.webp": {
   "m": [
    1.0019,
    -0.0105,
    -7.03,
    3.11
   ],
   "scale": 1.002,
   "rot_deg": -0.6,
   "shift": [
    -1.4,
    -0.3
   ],
   "inliers": 178,
   "residual_px": 0.57,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_final_loop_37.webp",
    "rect": [
     168,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_37.webp",
    "rect": [
     168,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_37_u.webp",
    "rect": [
     295,
     380,
     226,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.28,
     -0.05
    ],
    "eyeR": [
     -0.04,
     0.07
    ],
    "mouth": [
     0.11,
     0.14
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_final_loop/38.webp": {
   "m": [
    1.00221,
    -0.00864,
    -5.82,
    2.03
   ],
   "scale": 1.0022,
   "rot_deg": -0.49,
   "shift": [
    -0.9,
    -0.5
   ],
   "inliers": 177,
   "residual_px": 0.57,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_final_loop_38.webp",
    "rect": [
     168,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_38.webp",
    "rect": [
     168,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_38_u.webp",
    "rect": [
     295,
     380,
     227,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 14,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.28,
     -0.05
    ],
    "eyeR": [
     -0.04,
     0.1
    ],
    "mouth": [
     0.09,
     0.2
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_final_loop/39.webp": {
   "m": [
    1.00239,
    -0.00586,
    -4.4,
    0.78
   ],
   "scale": 1.0024,
   "rot_deg": -0.33,
   "shift": [
    -0.7,
    -0.5
   ],
   "inliers": 183,
   "residual_px": 0.53,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_final_loop_39.webp",
    "rect": [
     168,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_39.webp",
    "rect": [
     168,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_39_u.webp",
    "rect": [
     296,
     380,
     226,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.31,
     -0.05
    ],
    "eyeR": [
     -0.02,
     0.16
    ],
    "mouth": [
     0.09,
     0.21
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_final_loop/40.webp": {
   "m": [
    1.00228,
    -0.00561,
    -3.92,
    0.65
   ],
   "scale": 1.0023,
   "rot_deg": -0.32,
   "shift": [
    -0.4,
    -0.6
   ],
   "inliers": 190,
   "residual_px": 0.54,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_final_loop_40.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_40.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_40_u.webp",
    "rect": [
     296,
     380,
     226,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.31,
     -0.06
    ],
    "eyeR": [
     -0.02,
     0.1
    ],
    "mouth": [
     0.09,
     0.21
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_final_loop/41.webp": {
   "m": [
    1.00254,
    -0.00263,
    -2.5,
    -0.51
   ],
   "scale": 1.0025,
   "rot_deg": -0.15,
   "shift": [
    -0.2,
    -0.4
   ],
   "inliers": 181,
   "residual_px": 0.53,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_final_loop_41.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_41.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_41_u.webp",
    "rect": [
     296,
     380,
     226,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.27,
     -0.07
    ],
    "eyeR": [
     -0.02,
     -0.07
    ],
    "mouth": [
     0.08,
     0.04
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_final_loop/42.webp": {
   "m": [
    1.00215,
    -0.00215,
    -2.1,
    -0.53
   ],
   "scale": 1.0022,
   "rot_deg": -0.12,
   "shift": [
    -0.2,
    -0.4
   ],
   "inliers": 202,
   "residual_px": 0.57,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_final_loop_42.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_42.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_42_u.webp",
    "rect": [
     296,
     380,
     226,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.27,
     -0.08
    ],
    "eyeR": [
     -0.03,
     -0.07
    ],
    "mouth": [
     0.08,
     0.04
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_final_loop/43.webp": {
   "m": [
    1.00217,
    -0.00167,
    -1.84,
    -0.81
   ],
   "scale": 1.0022,
   "rot_deg": -0.1,
   "shift": [
    -0.2,
    -0.5
   ],
   "inliers": 211,
   "residual_px": 0.53,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_final_loop_43.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_43.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_43_u.webp",
    "rect": [
     297,
     380,
     225,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.27,
     -0.08
    ],
    "eyeR": [
     -0.02,
     -0.02
    ],
    "mouth": [
     0.1,
     0.13
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_final_loop/44.webp": {
   "m": [
    1.00218,
    -0.00153,
    -1.74,
    -0.93
   ],
   "scale": 1.0022,
   "rot_deg": -0.09,
   "shift": [
    -0.1,
    -0.5
   ],
   "inliers": 216,
   "residual_px": 0.56,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_final_loop_44.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_44.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_44_u.webp",
    "rect": [
     297,
     380,
     225,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.28,
     -0.06
    ],
    "eyeR": [
     -0.01,
     0.03
    ],
    "mouth": [
     0.13,
     0.17
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_final_loop/45.webp": {
   "m": [
    1.0023,
    -0.00147,
    -1.75,
    -1.02
   ],
   "scale": 1.0023,
   "rot_deg": -0.08,
   "shift": [
    -0.1,
    -0.5
   ],
   "inliers": 201,
   "residual_px": 0.54,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_final_loop_45.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_45.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_45_u.webp",
    "rect": [
     297,
     380,
     225,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.3,
     -0.06
    ],
    "eyeR": [
     -0.01,
     0.07
    ],
    "mouth": [
     0.14,
     0.17
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_final_loop/46.webp": {
   "m": [
    1.00239,
    -0.00143,
    -1.75,
    -1.07
   ],
   "scale": 1.0024,
   "rot_deg": -0.08,
   "shift": [
    -0.1,
    -0.5
   ],
   "inliers": 200,
   "residual_px": 0.53,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_final_loop_46.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_46.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_46_u.webp",
    "rect": [
     297,
     380,
     225,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.31,
     -0.05
    ],
    "eyeR": [
     -0.01,
     0.08
    ],
    "mouth": [
     0.15,
     0.17
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_final_loop/47.webp": {
   "m": [
    1.0024,
    -0.00132,
    -1.67,
    -1.15
   ],
   "scale": 1.0024,
   "rot_deg": -0.08,
   "shift": [
    -0.1,
    -0.6
   ],
   "inliers": 189,
   "residual_px": 0.52,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_final_loop_47.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_47.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_47_u.webp",
    "rect": [
     297,
     380,
     225,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.31,
     -0.05
    ],
    "eyeR": [
     -0.01,
     0.08
    ],
    "mouth": [
     0.15,
     0.16
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_final_loop/48.webp": {
   "m": [
    1.00001,
    1e-05,
    0.0,
    -0.02
   ],
   "scale": 1.0,
   "rot_deg": 0.0,
   "shift": [
    -0.0,
    -0.0
   ],
   "inliers": 331,
   "residual_px": 0.0,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_final_loop_48.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_48.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_48_u.webp",
    "rect": [
     297,
     381,
     226,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.01,
     0.0
    ],
    "eyeR": [
     0.0,
     -0.0
    ],
    "mouth": [
     0.0,
     -0.0
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s2_loop/00.webp": {
   "m": [
    1.00001,
    1e-05,
    0.0,
    -0.02
   ],
   "scale": 1.0,
   "rot_deg": 0.0,
   "shift": [
    -0.0,
    -0.0
   ],
   "inliers": 331,
   "residual_px": 0.0,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s2_loop_00.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_00.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_00_u.webp",
    "rect": [
     297,
     381,
     226,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.01,
     0.0
    ],
    "eyeR": [
     0.0,
     -0.0
    ],
    "mouth": [
     0.0,
     -0.0
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s2_loop/01.webp": {
   "m": [
    1.00202,
    0.00394,
    1.12,
    -3.38
   ],
   "scale": 1.002,
   "rot_deg": 0.23,
   "shift": [
    0.1,
    -0.8
   ],
   "inliers": 196,
   "residual_px": 0.47,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s2_loop_01.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_01.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_01_u.webp",
    "rect": [
     297,
     380,
     227,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.09,
     -0.01
    ],
    "eyeR": [
     -0.1,
     -0.0
    ],
    "mouth": [
     0.0,
     0.15
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s2_loop/02.webp": {
   "m": [
    1.00183,
    0.01067,
    4.7,
    -6.19
   ],
   "scale": 1.0019,
   "rot_deg": 0.61,
   "shift": [
    0.5,
    -1.0
   ],
   "inliers": 188,
   "residual_px": 0.55,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s2_loop_02.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_02.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_02_u.webp",
    "rect": [
     298,
     380,
     227,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.09,
     -0.08
    ],
    "eyeR": [
     -0.16,
     0.11
    ],
    "mouth": [
     -0.11,
     0.29
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s2_loop/03.webp": {
   "m": [
    1.00119,
    0.01363,
    6.59,
    -7.49
   ],
   "scale": 1.0013,
   "rot_deg": 0.78,
   "shift": [
    0.7,
    -1.4
   ],
   "inliers": 183,
   "residual_px": 0.57,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s2_loop_03.webp",
    "rect": [
     170,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_03.webp",
    "rect": [
     170,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_03_u.webp",
    "rect": [
     298,
     380,
     227,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.0,
     -0.15
    ],
    "eyeR": [
     -0.18,
     0.17
    ],
    "mouth": [
     -0.16,
     0.26
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s2_loop/04.webp": {
   "m": [
    1.00022,
    0.02038,
    10.71,
    -10.17
   ],
   "scale": 1.0004,
   "rot_deg": 1.17,
   "shift": [
    1.3,
    -1.7
   ],
   "inliers": 183,
   "residual_px": 0.63,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s2_loop_04.webp",
    "rect": [
     170,
     220,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_04.webp",
    "rect": [
     170,
     220,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_04_u.webp",
    "rect": [
     299,
     379,
     227,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.22,
     -0.16
    ],
    "eyeR": [
     -0.28,
     0.17
    ],
    "mouth": [
     -0.36,
     0.26
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s2_loop/05.webp": {
   "m": [
    1.00019,
    0.02519,
    13.04,
    -12.37
   ],
   "scale": 1.0005,
   "rot_deg": 1.44,
   "shift": [
    1.4,
    -2.0
   ],
   "inliers": 169,
   "residual_px": 0.69,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s2_loop_05.webp",
    "rect": [
     170,
     220,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_05.webp",
    "rect": [
     170,
     220,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_05_u.webp",
    "rect": [
     299,
     378,
     227,
     106
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.25,
     -0.16
    ],
    "eyeR": [
     -0.28,
     0.13
    ],
    "mouth": [
     -0.36,
     0.26
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s2_loop/06.webp": {
   "m": [
    1.00024,
    0.03188,
    16.31,
    -15.66
   ],
   "scale": 1.0007,
   "rot_deg": 1.83,
   "shift": [
    1.6,
    -2.5
   ],
   "inliers": 162,
   "residual_px": 0.63,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s2_loop_06.webp",
    "rect": [
     171,
     219,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_06.webp",
    "rect": [
     171,
     219,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_06_u.webp",
    "rect": [
     300,
     377,
     226,
     107
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 1,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.26,
     -0.14
    ],
    "eyeR": [
     -0.28,
     0.13
    ],
    "mouth": [
     -0.36,
     0.38
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s2_loop/07.webp": {
   "m": [
    0.99913,
    0.0335,
    17.76,
    -16.05
   ],
   "scale": 0.9997,
   "rot_deg": 1.92,
   "shift": [
    1.8,
    -2.8
   ],
   "inliers": 149,
   "residual_px": 0.6,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s2_loop_07.webp",
    "rect": [
     171,
     219,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_07.webp",
    "rect": [
     171,
     219,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_07_u.webp",
    "rect": [
     300,
     377,
     226,
     107
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.41,
     -0.01
    ],
    "eyeR": [
     -0.28,
     0.21
    ],
    "mouth": [
     -0.43,
     0.39
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s2_loop/08.webp": {
   "m": [
    0.99864,
    0.03816,
    20.24,
    -18.16
   ],
   "scale": 0.9994,
   "rot_deg": 2.19,
   "shift": [
    1.9,
    -3.2
   ],
   "inliers": 148,
   "residual_px": 0.72,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s2_loop_08.webp",
    "rect": [
     171,
     219,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_08.webp",
    "rect": [
     171,
     219,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_08_u.webp",
    "rect": [
     301,
     376,
     225,
     108
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.41,
     0.07
    ],
    "eyeR": [
     -0.28,
     0.27
    ],
    "mouth": [
     -0.43,
     0.61
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s2_loop/09.webp": {
   "m": [
    0.99843,
    0.04056,
    21.41,
    -19.34
   ],
   "scale": 0.9993,
   "rot_deg": 2.33,
   "shift": [
    1.9,
    -3.5
   ],
   "inliers": 150,
   "residual_px": 0.64,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s2_loop_09.webp",
    "rect": [
     171,
     219,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_09.webp",
    "rect": [
     171,
     219,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_09_u.webp",
    "rect": [
     301,
     376,
     225,
     108
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.46,
     0.22
    ],
    "eyeR": [
     -0.19,
     0.33
    ],
    "mouth": [
     -0.32,
     0.8
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s2_loop/10.webp": {
   "m": [
    0.99836,
    0.04288,
    22.56,
    -20.33
   ],
   "scale": 0.9993,
   "rot_deg": 2.46,
   "shift": [
    1.9,
    -3.6
   ],
   "inliers": 158,
   "residual_px": 0.74,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s2_loop_10.webp",
    "rect": [
     171,
     218,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_10.webp",
    "rect": [
     171,
     218,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_10_u.webp",
    "rect": [
     301,
     375,
     225,
     109
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.46,
     0.22
    ],
    "eyeR": [
     -0.19,
     0.37
    ],
    "mouth": [
     -0.32,
     0.8
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s2_loop/11.webp": {
   "m": [
    0.99765,
    0.0426,
    22.87,
    -19.9
   ],
   "scale": 0.9986,
   "rot_deg": 2.45,
   "shift": [
    2.1,
    -3.6
   ],
   "inliers": 138,
   "residual_px": 0.74,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s2_loop_11.webp",
    "rect": [
     171,
     218,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_11.webp",
    "rect": [
     171,
     218,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_11_u.webp",
    "rect": [
     301,
     375,
     225,
     109
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.46,
     0.21
    ],
    "eyeR": [
     -0.19,
     0.37
    ],
    "mouth": [
     -0.32,
     0.8
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s2_loop/12.webp": {
   "m": [
    0.99792,
    0.04416,
    23.35,
    -20.76
   ],
   "scale": 0.9989,
   "rot_deg": 2.53,
   "shift": [
    1.9,
    -3.7
   ],
   "inliers": 140,
   "residual_px": 0.75,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s2_loop_12.webp",
    "rect": [
     171,
     218,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_12.webp",
    "rect": [
     171,
     218,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_12_u.webp",
    "rect": [
     301,
     375,
     225,
     109
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.45,
     0.21
    ],
    "eyeR": [
     -0.13,
     0.37
    ],
    "mouth": [
     -0.29,
     0.84
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s2_loop/13.webp": {
   "m": [
    0.99791,
    0.04576,
    24.01,
    -21.52
   ],
   "scale": 0.999,
   "rot_deg": 2.63,
   "shift": [
    1.9,
    -3.8
   ],
   "inliers": 146,
   "residual_px": 0.69,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s2_loop_13.webp",
    "rect": [
     171,
     218,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_13.webp",
    "rect": [
     171,
     218,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_13_u.webp",
    "rect": [
     301,
     375,
     225,
     109
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 1,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.45,
     0.37
    ],
    "eyeR": [
     -0.12,
     0.38
    ],
    "mouth": [
     -0.26,
     0.92
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s2_loop/14.webp": {
   "m": [
    0.99778,
    0.04534,
    23.92,
    -21.27
   ],
   "scale": 0.9988,
   "rot_deg": 2.6,
   "shift": [
    1.9,
    -3.8
   ],
   "inliers": 141,
   "residual_px": 0.65,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s2_loop_14.webp",
    "rect": [
     171,
     218,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_14.webp",
    "rect": [
     171,
     218,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_14_u.webp",
    "rect": [
     301,
     375,
     225,
     109
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 1,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.42,
     0.42
    ],
    "eyeR": [
     -0.1,
     0.38
    ],
    "mouth": [
     -0.21,
     0.93
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s2_loop/15.webp": {
   "m": [
    0.99788,
    0.04613,
    24.15,
    -21.7
   ],
   "scale": 0.9989,
   "rot_deg": 2.65,
   "shift": [
    1.8,
    -3.8
   ],
   "inliers": 131,
   "residual_px": 0.59,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s2_loop_15.webp",
    "rect": [
     171,
     218,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_15.webp",
    "rect": [
     171,
     218,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_15_u.webp",
    "rect": [
     301,
     375,
     225,
     109
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.33,
     0.5
    ],
    "eyeR": [
     -0.06,
     0.39
    ],
    "mouth": [
     -0.16,
     0.96
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s2_loop/16.webp": {
   "m": [
    0.9979,
    0.04622,
    24.18,
    -21.75
   ],
   "scale": 0.999,
   "rot_deg": 2.65,
   "shift": [
    1.8,
    -3.8
   ],
   "inliers": 130,
   "residual_px": 0.6,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s2_loop_16.webp",
    "rect": [
     171,
     218,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_16.webp",
    "rect": [
     171,
     218,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_16_u.webp",
    "rect": [
     301,
     375,
     225,
     109
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.33,
     0.5
    ],
    "eyeR": [
     -0.06,
     0.39
    ],
    "mouth": [
     -0.16,
     0.96
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s2_loop/17.webp": {
   "m": [
    0.99786,
    0.04592,
    24.1,
    -21.6
   ],
   "scale": 0.9989,
   "rot_deg": 2.63,
   "shift": [
    1.9,
    -3.8
   ],
   "inliers": 140,
   "residual_px": 0.63,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s2_loop_17.webp",
    "rect": [
     171,
     218,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_17.webp",
    "rect": [
     171,
     218,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_17_u.webp",
    "rect": [
     301,
     375,
     227,
     109
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.37,
     0.45
    ],
    "eyeR": [
     -0.08,
     0.39
    ],
    "mouth": [
     -0.16,
     0.95
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s2_loop/18.webp": {
   "m": [
    0.99818,
    0.04641,
    24.16,
    -21.89
   ],
   "scale": 0.9993,
   "rot_deg": 2.66,
   "shift": [
    1.8,
    -3.8
   ],
   "inliers": 134,
   "residual_px": 0.6,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s2_loop_18.webp",
    "rect": [
     171,
     218,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_18.webp",
    "rect": [
     171,
     218,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_18_u.webp",
    "rect": [
     301,
     375,
     227,
     109
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.42,
     0.44
    ],
    "eyeR": [
     -0.09,
     0.32
    ],
    "mouth": [
     -0.19,
     0.9
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s2_loop/19.webp": {
   "m": [
    0.99792,
    0.04603,
    24.16,
    -21.6
   ],
   "scale": 0.999,
   "rot_deg": 2.64,
   "shift": [
    1.9,
    -3.8
   ],
   "inliers": 142,
   "residual_px": 0.77,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s2_loop_19.webp",
    "rect": [
     171,
     218,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_19.webp",
    "rect": [
     171,
     218,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_19_u.webp",
    "rect": [
     301,
     375,
     227,
     109
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 1,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.45,
     0.39
    ],
    "eyeR": [
     -0.13,
     0.32
    ],
    "mouth": [
     -0.23,
     0.9
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s2_loop/20.webp": {
   "m": [
    0.99762,
    0.04546,
    24.06,
    -21.27
   ],
   "scale": 0.9987,
   "rot_deg": 2.61,
   "shift": [
    1.9,
    -3.8
   ],
   "inliers": 127,
   "residual_px": 0.73,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s2_loop_20.webp",
    "rect": [
     171,
     218,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_20.webp",
    "rect": [
     171,
     218,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_20_u.webp",
    "rect": [
     301,
     375,
     227,
     109
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 1,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.49,
     0.39
    ],
    "eyeR": [
     -0.13,
     0.38
    ],
    "mouth": [
     -0.25,
     0.93
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s2_loop/21.webp": {
   "m": [
    0.99774,
    0.04553,
    24.03,
    -21.36
   ],
   "scale": 0.9988,
   "rot_deg": 2.61,
   "shift": [
    1.9,
    -3.8
   ],
   "inliers": 141,
   "residual_px": 0.8,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s2_loop_21.webp",
    "rect": [
     171,
     218,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_21.webp",
    "rect": [
     171,
     218,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_21_u.webp",
    "rect": [
     301,
     375,
     225,
     109
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 1,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.49,
     0.4
    ],
    "eyeR": [
     -0.13,
     0.38
    ],
    "mouth": [
     -0.25,
     0.93
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s2_loop/22.webp": {
   "m": [
    0.99793,
    0.04657,
    24.35,
    -21.88
   ],
   "scale": 0.999,
   "rot_deg": 2.67,
   "shift": [
    1.8,
    -3.8
   ],
   "inliers": 133,
   "residual_px": 0.6,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s2_loop_22.webp",
    "rect": [
     171,
     218,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_22.webp",
    "rect": [
     171,
     218,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_22_u.webp",
    "rect": [
     301,
     375,
     225,
     109
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.38,
     0.51
    ],
    "eyeR": [
     -0.1,
     0.34
    ],
    "mouth": [
     -0.18,
     0.94
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s2_loop/23.webp": {
   "m": [
    0.99779,
    0.04649,
    24.39,
    -21.79
   ],
   "scale": 0.9989,
   "rot_deg": 2.67,
   "shift": [
    1.9,
    -3.8
   ],
   "inliers": 141,
   "residual_px": 0.68,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s2_loop_23.webp",
    "rect": [
     171,
     218,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_23.webp",
    "rect": [
     171,
     218,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_23_u.webp",
    "rect": [
     301,
     375,
     225,
     109
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.38,
     0.51
    ],
    "eyeR": [
     -0.09,
     0.34
    ],
    "mouth": [
     -0.18,
     0.95
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s2_loop/24.webp": {
   "m": [
    0.99769,
    0.0462,
    24.29,
    -21.69
   ],
   "scale": 0.9988,
   "rot_deg": 2.65,
   "shift": [
    1.9,
    -3.9
   ],
   "inliers": 128,
   "residual_px": 0.64,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s2_loop_24.webp",
    "rect": [
     171,
     218,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_24.webp",
    "rect": [
     171,
     218,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_24_u.webp",
    "rect": [
     301,
     375,
     225,
     109
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.38,
     0.52
    ],
    "eyeR": [
     -0.08,
     0.4
    ],
    "mouth": [
     -0.18,
     0.98
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s2_loop/25.webp": {
   "m": [
    0.99795,
    0.04622,
    24.16,
    -21.79
   ],
   "scale": 0.999,
   "rot_deg": 2.65,
   "shift": [
    1.8,
    -3.9
   ],
   "inliers": 122,
   "residual_px": 0.56,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s2_loop_25.webp",
    "rect": [
     171,
     218,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_25.webp",
    "rect": [
     171,
     218,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_25_u.webp",
    "rect": [
     301,
     375,
     225,
     109
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.38,
     0.52
    ],
    "eyeR": [
     -0.08,
     0.4
    ],
    "mouth": [
     -0.18,
     0.98
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s2_loop/26.webp": {
   "m": [
    0.99774,
    0.0455,
    24.02,
    -21.34
   ],
   "scale": 0.9988,
   "rot_deg": 2.61,
   "shift": [
    1.9,
    -3.8
   ],
   "inliers": 145,
   "residual_px": 0.79,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s2_loop_26.webp",
    "rect": [
     171,
     218,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_26.webp",
    "rect": [
     171,
     218,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_26_u.webp",
    "rect": [
     301,
     375,
     227,
     109
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 1,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.39,
     0.47
    ],
    "eyeR": [
     -0.09,
     0.39
    ],
    "mouth": [
     -0.17,
     0.94
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s2_loop/27.webp": {
   "m": [
    0.9981,
    0.04641,
    24.2,
    -21.87
   ],
   "scale": 0.9992,
   "rot_deg": 2.66,
   "shift": [
    1.8,
    -3.8
   ],
   "inliers": 141,
   "residual_px": 0.63,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s2_loop_27.webp",
    "rect": [
     171,
     218,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_27.webp",
    "rect": [
     171,
     218,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_27_u.webp",
    "rect": [
     301,
     375,
     227,
     109
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.49,
     0.45
    ],
    "eyeR": [
     -0.12,
     0.34
    ],
    "mouth": [
     -0.24,
     0.94
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s2_loop/28.webp": {
   "m": [
    0.99762,
    0.04604,
    24.31,
    -21.52
   ],
   "scale": 0.9987,
   "rot_deg": 2.64,
   "shift": [
    1.9,
    -3.8
   ],
   "inliers": 143,
   "residual_px": 0.8,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s2_loop_28.webp",
    "rect": [
     171,
     218,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_28.webp",
    "rect": [
     171,
     218,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_28_u.webp",
    "rect": [
     301,
     375,
     227,
     109
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.43,
     0.45
    ],
    "eyeR": [
     -0.1,
     0.34
    ],
    "mouth": [
     -0.22,
     0.95
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s2_loop/29.webp": {
   "m": [
    0.99784,
    0.04539,
    23.89,
    -21.36
   ],
   "scale": 0.9989,
   "rot_deg": 2.6,
   "shift": [
    1.9,
    -3.8
   ],
   "inliers": 134,
   "residual_px": 0.62,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s2_loop_29.webp",
    "rect": [
     171,
     218,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_29.webp",
    "rect": [
     171,
     218,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_29_u.webp",
    "rect": [
     301,
     375,
     227,
     109
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.43,
     0.41
    ],
    "eyeR": [
     -0.1,
     0.36
    ],
    "mouth": [
     -0.22,
     0.95
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s2_loop/30.webp": {
   "m": [
    0.9979,
    0.0448,
    23.58,
    -21.08
   ],
   "scale": 0.9989,
   "rot_deg": 2.57,
   "shift": [
    1.9,
    -3.8
   ],
   "inliers": 144,
   "residual_px": 0.69,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s2_loop_30.webp",
    "rect": [
     171,
     218,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_30.webp",
    "rect": [
     171,
     218,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_30_u.webp",
    "rect": [
     301,
     375,
     227,
     109
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.41,
     0.33
    ],
    "eyeR": [
     -0.1,
     0.39
    ],
    "mouth": [
     -0.21,
     0.89
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s2_loop/31.webp": {
   "m": [
    0.99865,
    0.04393,
    22.86,
    -21.06
   ],
   "scale": 0.9996,
   "rot_deg": 2.52,
   "shift": [
    1.9,
    -3.7
   ],
   "inliers": 147,
   "residual_px": 0.68,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s2_loop_31.webp",
    "rect": [
     171,
     218,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_31.webp",
    "rect": [
     171,
     218,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_31_u.webp",
    "rect": [
     301,
     375,
     225,
     109
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.34,
     0.33
    ],
    "eyeR": [
     -0.1,
     0.41
    ],
    "mouth": [
     -0.21,
     0.89
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s2_loop/32.webp": {
   "m": [
    0.99877,
    0.04341,
    22.43,
    -20.96
   ],
   "scale": 0.9997,
   "rot_deg": 2.49,
   "shift": [
    1.7,
    -3.8
   ],
   "inliers": 146,
   "residual_px": 0.66,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s2_loop_32.webp",
    "rect": [
     171,
     218,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_32.webp",
    "rect": [
     171,
     218,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_32_u.webp",
    "rect": [
     301,
     375,
     225,
     108
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.34,
     0.33
    ],
    "eyeR": [
     -0.15,
     0.42
    ],
    "mouth": [
     -0.21,
     0.86
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s2_loop/33.webp": {
   "m": [
    0.99851,
    0.04062,
    21.36,
    -19.48
   ],
   "scale": 0.9993,
   "rot_deg": 2.33,
   "shift": [
    1.8,
    -3.6
   ],
   "inliers": 140,
   "residual_px": 0.69,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.4,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s2_loop_33.webp",
    "rect": [
     171,
     218,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_33.webp",
    "rect": [
     171,
     218,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_33_u.webp",
    "rect": [
     301,
     376,
     225,
     107
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 1,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.29,
     0.39
    ],
    "eyeR": [
     -0.09,
     0.42
    ],
    "mouth": [
     -0.09,
     0.86
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s2_loop/34.webp": {
   "m": [
    0.99926,
    0.03949,
    20.18,
    -19.22
   ],
   "scale": 1.0,
   "rot_deg": 2.26,
   "shift": [
    1.5,
    -3.4
   ],
   "inliers": 142,
   "residual_px": 0.55,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s2_loop_34.webp",
    "rect": [
     171,
     219,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_34.webp",
    "rect": [
     171,
     219,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_34_u.webp",
    "rect": [
     300,
     376,
     226,
     108
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.27,
     0.23
    ],
    "eyeR": [
     -0.18,
     0.39
    ],
    "mouth": [
     -0.28,
     0.84
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s2_loop/35.webp": {
   "m": [
    0.99959,
    0.03502,
    18.04,
    -17.31
   ],
   "scale": 1.0002,
   "rot_deg": 2.01,
   "shift": [
    1.6,
    -3.2
   ],
   "inliers": 165,
   "residual_px": 0.65,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s2_loop_35.webp",
    "rect": [
     171,
     219,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_35.webp",
    "rect": [
     171,
     219,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_35_u.webp",
    "rect": [
     300,
     376,
     228,
     107
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.27,
     0.18
    ],
    "eyeR": [
     -0.18,
     0.32
    ],
    "mouth": [
     -0.28,
     0.79
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s2_loop/36.webp": {
   "m": [
    0.99919,
    0.02976,
    15.63,
    -14.51
   ],
   "scale": 0.9996,
   "rot_deg": 1.71,
   "shift": [
    1.5,
    -2.7
   ],
   "inliers": 145,
   "residual_px": 0.6,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s2_loop_36.webp",
    "rect": [
     170,
     219,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_36.webp",
    "rect": [
     170,
     219,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_36_u.webp",
    "rect": [
     300,
     377,
     226,
     107
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.27,
     0.1
    ],
    "eyeR": [
     -0.21,
     0.28
    ],
    "mouth": [
     -0.29,
     0.62
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s2_loop/37.webp": {
   "m": [
    1.00005,
    0.02611,
    13.34,
    -13.14
   ],
   "scale": 1.0004,
   "rot_deg": 1.5,
   "shift": [
    1.2,
    -2.4
   ],
   "inliers": 160,
   "residual_px": 0.56,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s2_loop_37.webp",
    "rect": [
     170,
     220,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_37.webp",
    "rect": [
     170,
     220,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_37_u.webp",
    "rect": [
     300,
     378,
     226,
     106
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.23,
     0.07
    ],
    "eyeR": [
     -0.24,
     0.27
    ],
    "mouth": [
     -0.31,
     0.58
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s2_loop/38.webp": {
   "m": [
    1.00064,
    0.01864,
    9.45,
    -9.71
   ],
   "scale": 1.0008,
   "rot_deg": 1.07,
   "shift": [
    1.0,
    -1.8
   ],
   "inliers": 181,
   "residual_px": 0.63,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s2_loop_38.webp",
    "rect": [
     170,
     220,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_38.webp",
    "rect": [
     170,
     220,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_38_u.webp",
    "rect": [
     299,
     379,
     226,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.23,
     -0.06
    ],
    "eyeR": [
     -0.29,
     0.23
    ],
    "mouth": [
     -0.3,
     0.47
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s2_loop/39.webp": {
   "m": [
    1.00088,
    0.01517,
    7.59,
    -8.2
   ],
   "scale": 1.001,
   "rot_deg": 0.87,
   "shift": [
    0.9,
    -1.6
   ],
   "inliers": 181,
   "residual_px": 0.6,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s2_loop_39.webp",
    "rect": [
     170,
     220,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_39.webp",
    "rect": [
     170,
     220,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_39_u.webp",
    "rect": [
     298,
     379,
     227,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.2,
     -0.14
    ],
    "eyeR": [
     -0.29,
     0.15
    ],
    "mouth": [
     -0.3,
     0.33
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s2_loop/40.webp": {
   "m": [
    1.00132,
    0.01054,
    4.92,
    -6.02
   ],
   "scale": 1.0014,
   "rot_deg": 0.6,
   "shift": [
    0.6,
    -1.1
   ],
   "inliers": 179,
   "residual_px": 0.56,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s2_loop_40.webp",
    "rect": [
     170,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_40.webp",
    "rect": [
     170,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_40_u.webp",
    "rect": [
     298,
     380,
     226,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.07,
     -0.09
    ],
    "eyeR": [
     -0.2,
     0.16
    ],
    "mouth": [
     -0.04,
     0.28
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s2_loop/41.webp": {
   "m": [
    1.00224,
    0.00786,
    3.03,
    -5.24
   ],
   "scale": 1.0023,
   "rot_deg": 0.45,
   "shift": [
    0.3,
    -1.0
   ],
   "inliers": 187,
   "residual_px": 0.53,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s2_loop_41.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_41.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_41_u.webp",
    "rect": [
     298,
     380,
     228,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.03,
     -0.18
    ],
    "eyeR": [
     -0.19,
     0.08
    ],
    "mouth": [
     -0.04,
     0.24
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s2_loop/42.webp": {
   "m": [
    1.00162,
    0.00511,
    2.03,
    -3.66
   ],
   "scale": 1.0016,
   "rot_deg": 0.29,
   "shift": [
    0.3,
    -0.8
   ],
   "inliers": 198,
   "residual_px": 0.49,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s2_loop_42.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_42.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_42_u.webp",
    "rect": [
     298,
     380,
     226,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.11,
     -0.09
    ],
    "eyeR": [
     -0.17,
     0.1
    ],
    "mouth": [
     -0.04,
     0.28
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s2_loop/43.webp": {
   "m": [
    1.00226,
    0.00456,
    1.37,
    -3.73
   ],
   "scale": 1.0023,
   "rot_deg": 0.26,
   "shift": [
    0.2,
    -0.8
   ],
   "inliers": 190,
   "residual_px": 0.49,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s2_loop_43.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_43.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_43_u.webp",
    "rect": [
     297,
     380,
     227,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.11,
     -0.06
    ],
    "eyeR": [
     -0.17,
     0.1
    ],
    "mouth": [
     -0.04,
     0.23
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s2_loop/44.webp": {
   "m": [
    1.00239,
    0.00241,
    0.14,
    -2.79
   ],
   "scale": 1.0024,
   "rot_deg": 0.14,
   "shift": [
    -0.0,
    -0.7
   ],
   "inliers": 205,
   "residual_px": 0.5,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s2_loop_44.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_44.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_44_u.webp",
    "rect": [
     297,
     380,
     227,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.26,
     -0.03
    ],
    "eyeR": [
     -0.04,
     0.11
    ],
    "mouth": [
     0.1,
     0.27
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s2_loop/45.webp": {
   "m": [
    1.00246,
    0.00034,
    -0.9,
    -1.95
   ],
   "scale": 1.0025,
   "rot_deg": 0.02,
   "shift": [
    -0.0,
    -0.7
   ],
   "inliers": 203,
   "residual_px": 0.52,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s2_loop_45.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_45.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_45_u.webp",
    "rect": [
     297,
     380,
     227,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.26,
     -0.06
    ],
    "eyeR": [
     -0.04,
     0.16
    ],
    "mouth": [
     0.1,
     0.24
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s2_loop/46.webp": {
   "m": [
    1.00216,
    -0.00062,
    -1.18,
    -1.35
   ],
   "scale": 1.0022,
   "rot_deg": -0.04,
   "shift": [
    -0.0,
    -0.6
   ],
   "inliers": 198,
   "residual_px": 0.51,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s2_loop_46.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_46.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_46_u.webp",
    "rect": [
     297,
     380,
     227,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.26,
     -0.07
    ],
    "eyeR": [
     -0.06,
     0.16
    ],
    "mouth": [
     0.1,
     0.25
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s2_loop/47.webp": {
   "m": [
    1.00216,
    -0.00102,
    -1.41,
    -1.15
   ],
   "scale": 1.0022,
   "rot_deg": -0.06,
   "shift": [
    -0.1,
    -0.6
   ],
   "inliers": 196,
   "residual_px": 0.5,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s2_loop_47.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_47.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_47_u.webp",
    "rect": [
     297,
     380,
     227,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.23,
     -0.07
    ],
    "eyeR": [
     -0.06,
     0.12
    ],
    "mouth": [
     0.08,
     0.24
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s2_loop/48.webp": {
   "m": [
    1.00001,
    1e-05,
    0.0,
    -0.02
   ],
   "scale": 1.0,
   "rot_deg": 0.0,
   "shift": [
    -0.0,
    -0.0
   ],
   "inliers": 331,
   "residual_px": 0.0,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s2_loop_48.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_48.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_48_u.webp",
    "rect": [
     297,
     381,
     226,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.01,
     0.0
    ],
    "eyeR": [
     0.0,
     -0.0
    ],
    "mouth": [
     0.0,
     -0.0
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_draft_loop/00.webp": {
   "m": [
    1.00001,
    1e-05,
    0.0,
    -0.02
   ],
   "scale": 1.0,
   "rot_deg": 0.0,
   "shift": [
    -0.0,
    -0.0
   ],
   "inliers": 331,
   "residual_px": 0.0,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_draft_loop_00.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_00.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_00_u.webp",
    "rect": [
     297,
     381,
     226,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.01,
     0.0
    ],
    "eyeR": [
     0.0,
     -0.0
    ],
    "mouth": [
     0.0,
     -0.0
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_draft_loop/01.webp": {
   "m": [
    1.00194,
    -0.00132,
    -1.46,
    -0.95
   ],
   "scale": 1.0019,
   "rot_deg": -0.08,
   "shift": [
    -0.0,
    -0.6
   ],
   "inliers": 193,
   "residual_px": 0.51,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_draft_loop_01.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_01.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_01_u.webp",
    "rect": [
     297,
     380,
     225,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.24,
     -0.13
    ],
    "eyeR": [
     -0.0,
     0.08
    ],
    "mouth": [
     0.17,
     0.19
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_draft_loop/02.webp": {
   "m": [
    1.00199,
    -0.00111,
    -1.31,
    -1.2
   ],
   "scale": 1.002,
   "rot_deg": -0.06,
   "shift": [
    0.0,
    -0.7
   ],
   "inliers": 198,
   "residual_px": 0.55,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_draft_loop_02.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_02.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_02_u.webp",
    "rect": [
     297,
     380,
     225,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.25,
     -0.14
    ],
    "eyeR": [
     -0.0,
     0.09
    ],
    "mouth": [
     0.17,
     0.19
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_draft_loop/03.webp": {
   "m": [
    1.00216,
    -0.00084,
    -1.23,
    -1.34
   ],
   "scale": 1.0022,
   "rot_deg": -0.05,
   "shift": [
    0.0,
    -0.7
   ],
   "inliers": 181,
   "residual_px": 0.54,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_draft_loop_03.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_03.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_03_u.webp",
    "rect": [
     297,
     380,
     227,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.25,
     -0.14
    ],
    "eyeR": [
     -0.0,
     0.09
    ],
    "mouth": [
     0.09,
     0.24
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_draft_loop/04.webp": {
   "m": [
    1.00161,
    0.00173,
    0.74,
    -0.7
   ],
   "scale": 1.0016,
   "rot_deg": 0.1,
   "shift": [
    0.6,
    0.8
   ],
   "inliers": 165,
   "residual_px": 0.76,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_draft_loop_04.webp",
    "rect": [
     170,
     223,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_04.webp",
    "rect": [
     170,
     223,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_04_u.webp",
    "rect": [
     298,
     382,
     226,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.02,
     -0.09
    ],
    "eyeR": [
     -0.19,
     0.44
    ],
    "mouth": [
     -0.26,
     0.22
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_draft_loop/05.webp": {
   "m": [
    1.00544,
    0.00036,
    -0.87,
    1.64
   ],
   "scale": 1.0054,
   "rot_deg": 0.02,
   "shift": [
    1.2,
    4.3
   ],
   "inliers": 116,
   "residual_px": 1.04,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_draft_loop_05.webp",
    "rect": [
     170,
     226,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_05.webp",
    "rect": [
     170,
     226,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_05_u.webp",
    "rect": [
     298,
     385,
     228,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 10,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.08,
     0.14
    ],
    "eyeR": [
     -0.31,
     0.5
    ],
    "mouth": [
     -0.42,
     0.8
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_draft_loop/06.webp": {
   "m": [
    1.00331,
    0.00299,
    1.6,
    6.42
   ],
   "scale": 1.0033,
   "rot_deg": 0.17,
   "shift": [
    1.6,
    9.2
   ],
   "inliers": 71,
   "residual_px": 0.94,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_draft_loop_06.webp",
    "rect": [
     171,
     231,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_06.webp",
    "rect": [
     171,
     231,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_06_u.webp",
    "rect": [
     298,
     390,
     230,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.16,
     -0.09
    ],
    "eyeR": [
     -0.64,
     0.6
    ],
    "mouth": [
     -0.47,
     0.22
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_draft_loop/07.webp": {
   "m": [
    1.00886,
    -0.00075,
    -1.62,
    7.73
   ],
   "scale": 1.0089,
   "rot_deg": -0.04,
   "shift": [
    2.4,
    11.5
   ],
   "inliers": 61,
   "residual_px": 1.0,
   "ref_residual_px": {
    "eyeL": 2.0,
    "eyeR": 2.0,
    "mouth": 1.0,
    "nose": 1.4,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_draft_loop_07.webp",
    "rect": [
     171,
     234,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_07.webp",
    "rect": [
     171,
     234,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_07_u.webp",
    "rect": [
     298,
     392,
     230,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 1121,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.33,
     -0.2
    ],
    "eyeR": [
     -0.82,
     0.6
    ],
    "mouth": [
     -0.75,
     0.1
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_draft_loop/08.webp": {
   "m": [
    1.00635,
    -0.00197,
    -2.13,
    7.04
   ],
   "scale": 1.0064,
   "rot_deg": -0.11,
   "shift": [
    1.4,
    9.2
   ],
   "inliers": 63,
   "residual_px": 0.99,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 2.0,
    "mouth": 0.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_draft_loop_08.webp",
    "rect": [
     170,
     231,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_08.webp",
    "rect": [
     170,
     231,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_08_u.webp",
    "rect": [
     298,
     390,
     229,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 501,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.33,
     -0.2
    ],
    "eyeR": [
     -0.82,
     0.59
    ],
    "mouth": [
     -0.75,
     0.1
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_draft_loop/09.webp": {
   "m": [
    1.0078,
    -0.0036,
    -4.65,
    3.78
   ],
   "scale": 1.0078,
   "rot_deg": -0.2,
   "shift": [
    0.2,
    5.9
   ],
   "inliers": 71,
   "residual_px": 0.89,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_draft_loop_09.webp",
    "rect": [
     169,
     228,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_09.webp",
    "rect": [
     169,
     228,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_09_u.webp",
    "rect": [
     296,
     386,
     228,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.03,
     0.03
    ],
    "eyeR": [
     -0.72,
     0.49
    ],
    "mouth": [
     -0.42,
     0.22
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_draft_loop/10.webp": {
   "m": [
    1.00099,
    -0.01251,
    -8.58,
    4.01
   ],
   "scale": 1.0011,
   "rot_deg": -0.72,
   "shift": [
    -2.4,
    -0.6
   ],
   "inliers": 133,
   "residual_px": 0.79,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_draft_loop_10.webp",
    "rect": [
     167,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_10.webp",
    "rect": [
     167,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_10_u.webp",
    "rect": [
     294,
     379,
     228,
     106
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 12,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.02,
     0.11
    ],
    "eyeR": [
     -0.19,
     0.36
    ],
    "mouth": [
     -0.14,
     0.78
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_draft_loop/11.webp": {
   "m": [
    1.00043,
    -0.02324,
    -14.41,
    6.77
   ],
   "scale": 1.0007,
   "rot_deg": -1.33,
   "shift": [
    -3.4,
    -2.5
   ],
   "inliers": 146,
   "residual_px": 0.72,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_draft_loop_11.webp",
    "rect": [
     166,
     219,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_11.webp",
    "rect": [
     166,
     219,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_11_u.webp",
    "rect": [
     292,
     377,
     228,
     107
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.03,
     0.12
    ],
    "eyeR": [
     -0.1,
     0.27
    ],
    "mouth": [
     -0.07,
     0.78
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_draft_loop/12.webp": {
   "m": [
    1.00503,
    -0.03432,
    -24.14,
    8.12
   ],
   "scale": 1.0056,
   "rot_deg": -1.96,
   "shift": [
    -6.1,
    -3.6
   ],
   "inliers": 131,
   "residual_px": 0.9,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_draft_loop_12.webp",
    "rect": [
     163,
     218,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_12.webp",
    "rect": [
     163,
     218,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_12_u.webp",
    "rect": [
     289,
     374,
     227,
     110
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 225,
   "cover_alien_px": 4,
   "occluded": 0.006,
   "feat": {
    "eyeL": [
     0.97,
     0.12
    ],
    "eyeR": [
     -0.0,
     0.14
    ],
    "mouth": [
     0.64,
     0.29
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_draft_loop/13.webp": {
   "m": [
    1.00478,
    -0.03926,
    -27.13,
    10.8
   ],
   "scale": 1.0056,
   "rot_deg": -2.24,
   "shift": [
    -6.9,
    -3.0
   ],
   "inliers": 130,
   "residual_px": 0.91,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 2.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_draft_loop_13.webp",
    "rect": [
     162,
     219,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_13.webp",
    "rect": [
     162,
     219,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_13_u.webp",
    "rect": [
     288,
     374,
     228,
     111
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 461,
   "cover_alien_px": 4,
   "occluded": 0.016,
   "feat": {
    "eyeL": [
     0.97,
     0.12
    ],
    "eyeR": [
     -0.0,
     0.14
    ],
    "mouth": [
     0.86,
     0.29
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_draft_loop/14.webp": {
   "m": [
    1.00286,
    -0.04777,
    -30.91,
    18.01
   ],
   "scale": 1.004,
   "rot_deg": -2.73,
   "shift": [
    -7.5,
    -0.2
   ],
   "inliers": 112,
   "residual_px": 0.85,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 2.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_draft_loop_14.webp",
    "rect": [
     161,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_14.webp",
    "rect": [
     161,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_14_u.webp",
    "rect": [
     287,
     377,
     227,
     111
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 585,
   "cover_alien_px": 6,
   "occluded": 0.021,
   "feat": {
    "eyeL": [
     0.7,
     0.09
    ],
    "eyeR": [
     -0.01,
     0.14
    ],
    "mouth": [
     0.86,
     0.29
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_draft_loop/15.webp": {
   "m": [
    1.00298,
    -0.05312,
    -33.49,
    22.62
   ],
   "scale": 1.0044,
   "rot_deg": -3.03,
   "shift": [
    -7.6,
    2.3
   ],
   "inliers": 116,
   "residual_px": 0.81,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 0.0,
    "mouth": 3.2,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_draft_loop_15.webp",
    "rect": [
     161,
     224,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_15.webp",
    "rect": [
     161,
     224,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_15_u.webp",
    "rect": [
     287,
     379,
     227,
     112
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 666,
   "cover_alien_px": 1,
   "occluded": 0.025,
   "feat": {
    "eyeL": [
     0.45,
     -0.14
    ],
    "eyeR": [
     -0.22,
     0.18
    ],
    "mouth": [
     0.84,
     0.29
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_draft_loop/16.webp": {
   "m": [
    1.00361,
    -0.05413,
    -34.2,
    23.58
   ],
   "scale": 1.0051,
   "rot_deg": -3.09,
   "shift": [
    -7.5,
    3.1
   ],
   "inliers": 105,
   "residual_px": 1.0,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 0.0,
    "mouth": 4.1,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_draft_loop_16.webp",
    "rect": [
     161,
     225,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_16.webp",
    "rect": [
     161,
     225,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_16_u.webp",
    "rect": [
     287,
     380,
     227,
     112
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 678,
   "cover_alien_px": 1,
   "occluded": 0.025,
   "feat": {
    "eyeL": [
     0.43,
     -0.14
    ],
    "eyeR": [
     -0.22,
     0.18
    ],
    "mouth": [
     0.82,
     0.29
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_draft_loop/17.webp": {
   "m": [
    1.00082,
    -0.05404,
    -33.01,
    25.26
   ],
   "scale": 1.0023,
   "rot_deg": -3.09,
   "shift": [
    -7.5,
    3.6
   ],
   "inliers": 107,
   "residual_px": 0.97,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 4.1,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_draft_loop_17.webp",
    "rect": [
     161,
     226,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_17.webp",
    "rect": [
     161,
     226,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_17_u.webp",
    "rect": [
     287,
     380,
     227,
     112
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 653,
   "cover_alien_px": 3,
   "occluded": 0.024,
   "feat": {
    "eyeL": [
     0.43,
     -0.13
    ],
    "eyeR": [
     -0.19,
     0.18
    ],
    "mouth": [
     0.79,
     0.29
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_draft_loop/18.webp": {
   "m": [
    1.00279,
    -0.05401,
    -33.97,
    24.62
   ],
   "scale": 1.0042,
   "rot_deg": -3.08,
   "shift": [
    -7.7,
    3.8
   ],
   "inliers": 104,
   "residual_px": 0.8,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 0.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_draft_loop_18.webp",
    "rect": [
     161,
     226,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_18.webp",
    "rect": [
     161,
     226,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_18_u.webp",
    "rect": [
     287,
     380,
     227,
     112
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 674,
   "cover_alien_px": 3,
   "occluded": 0.025,
   "feat": {
    "eyeL": [
     0.37,
     -0.13
    ],
    "eyeR": [
     -0.19,
     0.12
    ],
    "mouth": [
     0.77,
     0.29
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_draft_loop/19.webp": {
   "m": [
    1.00216,
    -0.05398,
    -33.64,
    24.85
   ],
   "scale": 1.0036,
   "rot_deg": -3.08,
   "shift": [
    -7.6,
    3.8
   ],
   "inliers": 109,
   "residual_px": 0.84,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 0.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_draft_loop_19.webp",
    "rect": [
     161,
     226,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_19.webp",
    "rect": [
     161,
     226,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_19_u.webp",
    "rect": [
     287,
     380,
     227,
     112
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 682,
   "cover_alien_px": 0,
   "occluded": 0.025,
   "feat": {
    "eyeL": [
     0.37,
     -0.13
    ],
    "eyeR": [
     -0.19,
     0.1
    ],
    "mouth": [
     0.75,
     0.3
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_draft_loop/20.webp": {
   "m": [
    1.00009,
    -0.05351,
    -32.54,
    25.48
   ],
   "scale": 1.0015,
   "rot_deg": -3.06,
   "shift": [
    -7.6,
    3.7
   ],
   "inliers": 106,
   "residual_px": 0.93,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 4.1,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_draft_loop_20.webp",
    "rect": [
     161,
     226,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_20.webp",
    "rect": [
     161,
     226,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_20_u.webp",
    "rect": [
     287,
     380,
     227,
     112
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 667,
   "cover_alien_px": 0,
   "occluded": 0.025,
   "feat": {
    "eyeL": [
     0.21,
     -0.14
    ],
    "eyeR": [
     -0.08,
     0.09
    ],
    "mouth": [
     0.73,
     0.3
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_draft_loop/21.webp": {
   "m": [
    1.00031,
    -0.05376,
    -32.74,
    25.56
   ],
   "scale": 1.0018,
   "rot_deg": -3.08,
   "shift": [
    -7.6,
    3.7
   ],
   "inliers": 115,
   "residual_px": 0.83,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 4.1,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_draft_loop_21.webp",
    "rect": [
     161,
     226,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_21.webp",
    "rect": [
     161,
     226,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_21_u.webp",
    "rect": [
     287,
     380,
     227,
     112
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 672,
   "cover_alien_px": 5,
   "occluded": 0.025,
   "feat": {
    "eyeL": [
     0.18,
     -0.06
    ],
    "eyeR": [
     -0.08,
     0.09
    ],
    "mouth": [
     0.71,
     0.3
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_draft_loop/22.webp": {
   "m": [
    0.99916,
    -0.05234,
    -31.71,
    25.2
   ],
   "scale": 1.0005,
   "rot_deg": -3.0,
   "shift": [
    -7.7,
    3.4
   ],
   "inliers": 121,
   "residual_px": 0.95,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "nose": 1.4,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_draft_loop_22.webp",
    "rect": [
     161,
     225,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_22.webp",
    "rect": [
     161,
     225,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_22_u.webp",
    "rect": [
     287,
     380,
     227,
     112
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 654,
   "cover_alien_px": 4,
   "occluded": 0.024,
   "feat": {
    "eyeL": [
     0.21,
     -0.14
    ],
    "eyeR": [
     -0.08,
     0.09
    ],
    "mouth": [
     0.69,
     0.3
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_draft_loop/23.webp": {
   "m": [
    1.00222,
    -0.05385,
    -33.58,
    24.76
   ],
   "scale": 1.0037,
   "rot_deg": -3.08,
   "shift": [
    -7.6,
    3.8
   ],
   "inliers": 115,
   "residual_px": 0.81,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 0.0,
    "mouth": 4.1,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_draft_loop_23.webp",
    "rect": [
     161,
     226,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_23.webp",
    "rect": [
     161,
     226,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_23_u.webp",
    "rect": [
     287,
     380,
     227,
     112
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 683,
   "cover_alien_px": 5,
   "occluded": 0.025,
   "feat": {
    "eyeL": [
     0.3,
     -0.14
    ],
    "eyeR": [
     -0.05,
     0.09
    ],
    "mouth": [
     0.67,
     0.3
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_draft_loop/24.webp": {
   "m": [
    1.00076,
    -0.05298,
    -32.63,
    25.12
   ],
   "scale": 1.0022,
   "rot_deg": -3.03,
   "shift": [
    -7.7,
    3.8
   ],
   "inliers": 114,
   "residual_px": 0.87,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 0.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_draft_loop_24.webp",
    "rect": [
     161,
     226,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_24.webp",
    "rect": [
     161,
     226,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_24_u.webp",
    "rect": [
     287,
     381,
     227,
     111
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 679,
   "cover_alien_px": 5,
   "occluded": 0.025,
   "feat": {
    "eyeL": [
     0.3,
     -0.17
    ],
    "eyeR": [
     -0.19,
     0.09
    ],
    "mouth": [
     0.65,
     0.3
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_draft_loop/25.webp": {
   "m": [
    1.00184,
    -0.05473,
    -33.7,
    25.36
   ],
   "scale": 1.0033,
   "rot_deg": -3.13,
   "shift": [
    -7.5,
    3.9
   ],
   "inliers": 105,
   "residual_px": 0.83,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 0.0,
    "mouth": 4.1,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_draft_loop_25.webp",
    "rect": [
     162,
     226,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_25.webp",
    "rect": [
     162,
     226,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_25_u.webp",
    "rect": [
     287,
     380,
     227,
     112
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 684,
   "cover_alien_px": 1,
   "occluded": 0.025,
   "feat": {
    "eyeL": [
     0.3,
     -0.17
    ],
    "eyeR": [
     -0.05,
     0.09
    ],
    "mouth": [
     0.63,
     0.3
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_draft_loop/26.webp": {
   "m": [
    1.0008,
    -0.05252,
    -32.5,
    24.71
   ],
   "scale": 1.0022,
   "rot_deg": -3.0,
   "shift": [
    -7.7,
    3.6
   ],
   "inliers": 109,
   "residual_px": 0.83,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_draft_loop_26.webp",
    "rect": [
     161,
     226,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_26.webp",
    "rect": [
     161,
     226,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_26_u.webp",
    "rect": [
     287,
     380,
     227,
     112
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 668,
   "cover_alien_px": 1,
   "occluded": 0.025,
   "feat": {
    "eyeL": [
     0.36,
     0.0
    ],
    "eyeR": [
     -0.01,
     0.09
    ],
    "mouth": [
     0.61,
     0.3
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_draft_loop/27.webp": {
   "m": [
    1.00061,
    -0.05284,
    -32.61,
    24.8
   ],
   "scale": 1.002,
   "rot_deg": -3.02,
   "shift": [
    -7.8,
    3.5
   ],
   "inliers": 119,
   "residual_px": 0.86,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_draft_loop_27.webp",
    "rect": [
     161,
     225,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_27.webp",
    "rect": [
     161,
     225,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_27_u.webp",
    "rect": [
     287,
     380,
     227,
     112
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 696,
   "cover_alien_px": 0,
   "occluded": 0.026,
   "feat": {
    "eyeL": [
     0.39,
     0.0
    ],
    "eyeR": [
     -0.01,
     0.08
    ],
    "mouth": [
     0.59,
     0.3
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_draft_loop/28.webp": {
   "m": [
    1.00209,
    -0.0533,
    -33.34,
    24.13
   ],
   "scale": 1.0035,
   "rot_deg": -3.04,
   "shift": [
    -7.7,
    3.3
   ],
   "inliers": 121,
   "residual_px": 0.93,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 4.1,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_draft_loop_28.webp",
    "rect": [
     161,
     225,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_28.webp",
    "rect": [
     161,
     225,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_28_u.webp",
    "rect": [
     287,
     380,
     227,
     112
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 694,
   "cover_alien_px": 0,
   "occluded": 0.026,
   "feat": {
    "eyeL": [
     0.39,
     0.0
    ],
    "eyeR": [
     -0.0,
     0.08
    ],
    "mouth": [
     0.57,
     0.3
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_draft_loop/29.webp": {
   "m": [
    0.99947,
    -0.05898,
    -35.22,
    26.5
   ],
   "scale": 1.0012,
   "rot_deg": -3.38,
   "shift": [
    -8.0,
    2.1
   ],
   "inliers": 125,
   "residual_px": 0.91,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_draft_loop_29.webp",
    "rect": [
     161,
     224,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_29.webp",
    "rect": [
     161,
     224,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_29_u.webp",
    "rect": [
     286,
     379,
     228,
     112
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 708,
   "cover_alien_px": 8,
   "occluded": 0.027,
   "feat": {
    "eyeL": [
     0.39,
     -0.16
    ],
    "eyeR": [
     -0.04,
     0.08
    ],
    "mouth": [
     0.55,
     0.3
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_draft_loop/30.webp": {
   "m": [
    1.00394,
    -0.06139,
    -38.75,
    25.34
   ],
   "scale": 1.0058,
   "rot_deg": -3.5,
   "shift": [
    -8.6,
    2.1
   ],
   "inliers": 115,
   "residual_px": 0.99,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 0.0,
    "mouth": 5.4,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_draft_loop_30.webp",
    "rect": [
     160,
     224,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_30.webp",
    "rect": [
     160,
     224,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_30_u.webp",
    "rect": [
     286,
     378,
     226,
     113
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 758,
   "cover_alien_px": 5,
   "occluded": 0.029,
   "feat": {
    "eyeL": [
     0.49,
     -0.16
    ],
    "eyeR": [
     -0.04,
     0.15
    ],
    "mouth": [
     0.53,
     0.3
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_draft_loop/31.webp": {
   "m": [
    1.00129,
    -0.06686,
    -40.13,
    28.85
   ],
   "scale": 1.0035,
   "rot_deg": -3.82,
   "shift": [
    -8.5,
    2.1
   ],
   "inliers": 99,
   "residual_px": 0.88,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_draft_loop_31.webp",
    "rect": [
     161,
     224,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_31.webp",
    "rect": [
     161,
     224,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_31_u.webp",
    "rect": [
     285,
     378,
     227,
     114
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 225,
   "cover_alien_px": 0,
   "occluded": 0.006,
   "feat": {
    "eyeL": [
     0.9,
     -0.26
    ],
    "eyeR": [
     -0.05,
     -0.04
    ],
    "mouth": [
     0.53,
     0.3
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_draft_loop/32.webp": {
   "m": [
    1.01074,
    -0.06836,
    -45.01,
    28.25
   ],
   "scale": 1.013,
   "rot_deg": -3.87,
   "shift": [
    -8.8,
    5.3
   ],
   "inliers": 102,
   "residual_px": 1.01,
   "ref_residual_px": {
    "eyeL": 3.6,
    "eyeR": 1.0,
    "mouth": 1.4,
    "nose": 1.4,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_draft_loop_32.webp",
    "rect": [
     160,
     227,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_32.webp",
    "rect": [
     160,
     227,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_32_u.webp",
    "rect": [
     284,
     380,
     228,
     115
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 427,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.78,
     -0.75
    ],
    "eyeR": [
     -0.07,
     -0.16
    ],
    "mouth": [
     0.78,
     -0.31
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_draft_loop/33.webp": {
   "m": [
    1.00492,
    -0.06441,
    -39.37,
    30.89
   ],
   "scale": 1.007,
   "rot_deg": -3.67,
   "shift": [
    -7.4,
    6.9
   ],
   "inliers": 84,
   "residual_px": 0.91,
   "ref_residual_px": {
    "eyeL": 2.2,
    "eyeR": 1.0,
    "mouth": 0.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_draft_loop_33.webp",
    "rect": [
     162,
     229,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_33.webp",
    "rect": [
     162,
     229,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_33_u.webp",
    "rect": [
     286,
     382,
     228,
     114
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 344,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.78,
     -0.75
    ],
    "eyeR": [
     -0.17,
     -0.16
    ],
    "mouth": [
     0.78,
     -0.31
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_draft_loop/34.webp": {
   "m": [
    1.00356,
    -0.05497,
    -31.57,
    31.04
   ],
   "scale": 1.0051,
   "rot_deg": -3.14,
   "shift": [
    -4.5,
    10.2
   ],
   "inliers": 78,
   "residual_px": 1.02,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 1.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_draft_loop_34.webp",
    "rect": [
     164,
     232,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_34.webp",
    "rect": [
     164,
     232,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_34_u.webp",
    "rect": [
     290,
     387,
     228,
     112
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 436,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.01,
     -0.75
    ],
    "eyeR": [
     -0.61,
     0.08
    ],
    "mouth": [
     0.01,
     -0.29
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_draft_loop/35.webp": {
   "m": [
    1.00565,
    -0.05104,
    -28.81,
    28.88
   ],
   "scale": 1.0069,
   "rot_deg": -2.91,
   "shift": [
    -2.7,
    10.7
   ],
   "inliers": 76,
   "residual_px": 1.05,
   "ref_residual_px": {
    "eyeL": 2.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_draft_loop_35.webp",
    "rect": [
     166,
     233,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_35.webp",
    "rect": [
     166,
     233,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_35_u.webp",
    "rect": [
     291,
     387,
     229,
     112
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 851,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.34,
     -0.35
    ],
    "eyeR": [
     -0.61,
     0.17
    ],
    "mouth": [
     -0.65,
     0.15
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_draft_loop/36.webp": {
   "m": [
    1.00358,
    -0.03263,
    -18.29,
    16.88
   ],
   "scale": 1.0041,
   "rot_deg": -1.86,
   "shift": [
    -1.6,
    5.2
   ],
   "inliers": 93,
   "residual_px": 0.82,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_draft_loop_36.webp",
    "rect": [
     167,
     227,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_36.webp",
    "rect": [
     167,
     227,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_36_u.webp",
    "rect": [
     294,
     383,
     228,
     109
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 1,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.41,
     -0.24
    ],
    "eyeR": [
     -0.51,
     0.17
    ],
    "mouth": [
     -0.73,
     0.17
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_draft_loop/37.webp": {
   "m": [
    1.00056,
    -0.02498,
    -12.78,
    10.92
   ],
   "scale": 1.0009,
   "rot_deg": -1.43,
   "shift": [
    -0.9,
    1.0
   ],
   "inliers": 121,
   "residual_px": 0.75,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 1.4,
    "mouth": 1.4,
    "nose": 1.4,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_draft_loop_37.webp",
    "rect": [
     168,
     223,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_37.webp",
    "rect": [
     168,
     223,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_37_u.webp",
    "rect": [
     295,
     380,
     227,
     108
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.34,
     -0.1
    ],
    "eyeR": [
     -0.48,
     0.18
    ],
    "mouth": [
     -0.65,
     0.65
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_draft_loop/38.webp": {
   "m": [
    1.00179,
    -0.01009,
    -6.76,
    -1.0
   ],
   "scale": 1.0018,
   "rot_deg": -0.58,
   "shift": [
    -1.3,
    -4.3
   ],
   "inliers": 141,
   "residual_px": 0.64,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_draft_loop_38.webp",
    "rect": [
     168,
     218,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_38.webp",
    "rect": [
     168,
     218,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_38_u.webp",
    "rect": [
     296,
     376,
     226,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 14,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.3,
     0.04
    ],
    "eyeR": [
     0.05,
     0.18
    ],
    "mouth": [
     0.1,
     0.65
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_draft_loop/39.webp": {
   "m": [
    1.00186,
    -0.00842,
    -5.72,
    -2.08
   ],
   "scale": 1.0019,
   "rot_deg": -0.48,
   "shift": [
    -1.0,
    -4.7
   ],
   "inliers": 159,
   "residual_px": 0.67,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_draft_loop_39.webp",
    "rect": [
     168,
     217,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_39.webp",
    "rect": [
     168,
     217,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_39_u.webp",
    "rect": [
     295,
     376,
     227,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.3,
     0.26
    ],
    "eyeR": [
     0.13,
     0.18
    ],
    "mouth": [
     0.1,
     0.65
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_draft_loop/40.webp": {
   "m": [
    1.00004,
    -0.00344,
    -2.19,
    -2.67
   ],
   "scale": 1.0001,
   "rot_deg": -0.2,
   "shift": [
    -0.6,
    -4.1
   ],
   "inliers": 161,
   "residual_px": 0.66,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_draft_loop_40.webp",
    "rect": [
     168,
     218,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_40.webp",
    "rect": [
     168,
     218,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_40_u.webp",
    "rect": [
     296,
     377,
     226,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.42,
     0.04
    ],
    "eyeR": [
     0.07,
     0.32
    ],
    "mouth": [
     0.11,
     0.56
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_draft_loop/41.webp": {
   "m": [
    1.00228,
    -0.00448,
    -3.59,
    -1.62
   ],
   "scale": 1.0023,
   "rot_deg": -0.26,
   "shift": [
    -0.6,
    -2.4
   ],
   "inliers": 173,
   "residual_px": 0.59,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_draft_loop_41.webp",
    "rect": [
     168,
     220,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_41.webp",
    "rect": [
     168,
     220,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_41_u.webp",
    "rect": [
     296,
     378,
     226,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.17,
     -0.03
    ],
    "eyeR": [
     0.07,
     0.32
    ],
    "mouth": [
     -0.07,
     0.42
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_draft_loop/42.webp": {
   "m": [
    1.00257,
    -0.0014,
    -2.01,
    -1.34
   ],
   "scale": 1.0026,
   "rot_deg": -0.08,
   "shift": [
    -0.3,
    -0.7
   ],
   "inliers": 183,
   "residual_px": 0.51,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_draft_loop_42.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_42.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_42_u.webp",
    "rect": [
     296,
     380,
     228,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.23,
     -0.03
    ],
    "eyeR": [
     -0.01,
     0.02
    ],
    "mouth": [
     0.03,
     0.26
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_draft_loop/43.webp": {
   "m": [
    1.00221,
    -0.00075,
    -1.58,
    -1.25
   ],
   "scale": 1.0022,
   "rot_deg": -0.04,
   "shift": [
    -0.3,
    -0.5
   ],
   "inliers": 183,
   "residual_px": 0.53,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_draft_loop_43.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_43.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_43_u.webp",
    "rect": [
     296,
     380,
     228,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.17,
     -0.03
    ],
    "eyeR": [
     -0.02,
     0.01
    ],
    "mouth": [
     0.02,
     0.22
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_draft_loop/44.webp": {
   "m": [
    1.00204,
    -0.0011,
    -1.52,
    -1.01
   ],
   "scale": 1.002,
   "rot_deg": -0.06,
   "shift": [
    -0.2,
    -0.5
   ],
   "inliers": 185,
   "residual_px": 0.55,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_draft_loop_44.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_44.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_44_u.webp",
    "rect": [
     297,
     380,
     227,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.2,
     -0.1
    ],
    "eyeR": [
     -0.02,
     0.02
    ],
    "mouth": [
     0.02,
     0.18
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_draft_loop/45.webp": {
   "m": [
    1.00231,
    -0.00111,
    -1.62,
    -1.13
   ],
   "scale": 1.0023,
   "rot_deg": -0.06,
   "shift": [
    -0.2,
    -0.5
   ],
   "inliers": 183,
   "residual_px": 0.51,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_draft_loop_45.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_45.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_45_u.webp",
    "rect": [
     297,
     380,
     227,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.2,
     -0.1
    ],
    "eyeR": [
     -0.04,
     0.05
    ],
    "mouth": [
     0.01,
     0.18
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_draft_loop/46.webp": {
   "m": [
    1.00236,
    -0.00115,
    -1.64,
    -1.14
   ],
   "scale": 1.0024,
   "rot_deg": -0.07,
   "shift": [
    -0.1,
    -0.5
   ],
   "inliers": 196,
   "residual_px": 0.53,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_draft_loop_46.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_46.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_46_u.webp",
    "rect": [
     297,
     380,
     227,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.21,
     -0.1
    ],
    "eyeR": [
     -0.04,
     0.06
    ],
    "mouth": [
     0.01,
     0.19
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_draft_loop/47.webp": {
   "m": [
    1.00249,
    -0.00119,
    -1.71,
    -1.18
   ],
   "scale": 1.0025,
   "rot_deg": -0.07,
   "shift": [
    -0.1,
    -0.5
   ],
   "inliers": 194,
   "residual_px": 0.55,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_draft_loop_47.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_47.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_47_u.webp",
    "rect": [
     297,
     380,
     227,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 10,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.21,
     -0.1
    ],
    "eyeR": [
     -0.03,
     0.06
    ],
    "mouth": [
     0.01,
     0.19
    ]
   },
   "w": 1.0
  },
  "frames/think_b1_draft_loop/48.webp": {
   "m": [
    1.00001,
    1e-05,
    0.0,
    -0.02
   ],
   "scale": 1.0,
   "rot_deg": 0.0,
   "shift": [
    -0.0,
    -0.0
   ],
   "inliers": 331,
   "residual_px": 0.0,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_b1_draft_loop_48.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_48.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_48_u.webp",
    "rect": [
     297,
     381,
     226,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.01,
     0.0
    ],
    "eyeR": [
     0.0,
     -0.0
    ],
    "mouth": [
     0.0,
     -0.0
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_draft_loop/00.webp": {
   "m": [
    1.00001,
    1e-05,
    0.0,
    -0.02
   ],
   "scale": 1.0,
   "rot_deg": 0.0,
   "shift": [
    -0.0,
    -0.0
   ],
   "inliers": 331,
   "residual_px": 0.0,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_b1_draft_loop_00.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_00.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_00_u.webp",
    "rect": [
     297,
     381,
     226,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.01,
     0.0
    ],
    "eyeR": [
     0.0,
     -0.0
    ],
    "mouth": [
     0.0,
     -0.0
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_draft_loop/01.webp": {
   "m": [
    1.00151,
    -0.00124,
    -0.92,
    -0.74
   ],
   "scale": 1.0015,
   "rot_deg": -0.07,
   "shift": [
    0.3,
    -0.5
   ],
   "inliers": 184,
   "residual_px": 0.59,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_b1_draft_loop_01.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_01.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_01_u.webp",
    "rect": [
     297,
     380,
     227,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 12,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.01,
     -0.01
    ],
    "eyeR": [
     -0.06,
     0.22
    ],
    "mouth": [
     0.0,
     0.21
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_draft_loop/02.webp": {
   "m": [
    1.00109,
    0.00173,
    0.79,
    -2.09
   ],
   "scale": 1.0011,
   "rot_deg": 0.1,
   "shift": [
    0.4,
    -0.9
   ],
   "inliers": 189,
   "residual_px": 0.71,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_b1_draft_loop_02.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_02.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_02_u.webp",
    "rect": [
     298,
     380,
     226,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 10,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.02,
     -0.07
    ],
    "eyeR": [
     -0.12,
     0.27
    ],
    "mouth": [
     -0.19,
     0.56
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_draft_loop/03.webp": {
   "m": [
    1.00078,
    -0.00227,
    -1.07,
    -0.35
   ],
   "scale": 1.0008,
   "rot_deg": -0.13,
   "shift": [
    0.3,
    -0.9
   ],
   "inliers": 174,
   "residual_px": 0.82,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.4,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_b1_draft_loop_03.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_03.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_03_u.webp",
    "rect": [
     298,
     380,
     226,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 10,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.06,
     -0.01
    ],
    "eyeR": [
     -0.12,
     0.27
    ],
    "mouth": [
     -0.2,
     0.61
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_draft_loop/04.webp": {
   "m": [
    0.99877,
    -0.01885,
    -10.25,
    7.27
   ],
   "scale": 0.999,
   "rot_deg": -1.08,
   "shift": [
    -2.0,
    -1.0
   ],
   "inliers": 127,
   "residual_px": 0.8,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_b1_draft_loop_04.webp",
    "rect": [
     167,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_04.webp",
    "rect": [
     167,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_04_u.webp",
    "rect": [
     295,
     379,
     227,
     106
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.15,
     0.29
    ],
    "eyeR": [
     0.01,
     0.33
    ],
    "mouth": [
     -0.54,
     0.66
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_draft_loop/05.webp": {
   "m": [
    0.99675,
    -0.03298,
    -16.91,
    13.83
   ],
   "scale": 0.9973,
   "rot_deg": -1.9,
   "shift": [
    -2.9,
    -1.2
   ],
   "inliers": 122,
   "residual_px": 0.89,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_b1_draft_loop_05.webp",
    "rect": [
     166,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_05.webp",
    "rect": [
     166,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_05_u.webp",
    "rect": [
     294,
     378,
     228,
     108
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.06,
     0.29
    ],
    "eyeR": [
     0.06,
     0.24
    ],
    "mouth": [
     -0.2,
     0.66
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_draft_loop/06.webp": {
   "m": [
    0.99905,
    -0.06136,
    -34.36,
    24.61
   ],
   "scale": 1.0009,
   "rot_deg": -3.51,
   "shift": [
    -6.2,
    -0.9
   ],
   "inliers": 126,
   "residual_px": 0.65,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_b1_draft_loop_06.webp",
    "rect": [
     163,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_06.webp",
    "rect": [
     163,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_06_u.webp",
    "rect": [
     288,
     375,
     229,
     113
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.17,
     0.11
    ],
    "eyeR": [
     0.06,
     0.18
    ],
    "mouth": [
     0.31,
     0.38
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_draft_loop/07.webp": {
   "m": [
    1.00219,
    -0.07391,
    -43.64,
    28.53
   ],
   "scale": 1.0049,
   "rot_deg": -4.22,
   "shift": [
    -8.4,
    -0.7
   ],
   "inliers": 120,
   "residual_px": 0.86,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_b1_draft_loop_07.webp",
    "rect": [
     161,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_07.webp",
    "rect": [
     161,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_07_u.webp",
    "rect": [
     285,
     374,
     231,
     115
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     1.11,
     0.03
    ],
    "eyeR": [
     0.36,
     -0.18
    ],
    "mouth": [
     1.1,
     -0.16
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_draft_loop/08.webp": {
   "m": [
    1.0015,
    -0.09482,
    -55.04,
    37.14
   ],
   "scale": 1.006,
   "rot_deg": -5.41,
   "shift": [
    -10.3,
    -0.9
   ],
   "inliers": 83,
   "residual_px": 0.79,
   "ref_residual_px": {
    "eyeL": 2.2,
    "eyeR": 1.0,
    "mouth": 2.2,
    "nose": 1.4,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_b1_draft_loop_08.webp",
    "rect": [
     159,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_08.webp",
    "rect": [
     159,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_08_u.webp",
    "rect": [
     282,
     372,
     228,
     119
    ]
   },
   "yield_eye_px": 121,
   "yield_px": 160,
   "cover_alien_px": 0,
   "occluded": 0.007,
   "feat": {
    "eyeL": [
     1.33,
     -0.27
    ],
    "eyeR": [
     0.41,
     -0.5
    ],
    "mouth": [
     1.29,
     -0.64
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_draft_loop/09.webp": {
   "m": [
    1.00595,
    -0.10276,
    -61.82,
    38.84
   ],
   "scale": 1.0112,
   "rot_deg": -5.83,
   "shift": [
    -11.6,
    -0.4
   ],
   "inliers": 74,
   "residual_px": 0.85,
   "ref_residual_px": {
    "eyeL": 3.6,
    "eyeR": 1.4,
    "mouth": 3.6,
    "nose": 2.8,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_b1_draft_loop_09.webp",
    "rect": [
     157,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_09.webp",
    "rect": [
     157,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_09_u.webp",
    "rect": [
     280,
     372,
     228,
     120
    ]
   },
   "yield_eye_px": 370,
   "yield_px": 526,
   "cover_alien_px": 6,
   "occluded": 0.021,
   "feat": {
    "eyeL": [
     2.36,
     -0.99
    ],
    "eyeR": [
     0.82,
     -0.83
    ],
    "mouth": [
     1.76,
     -1.52
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_draft_loop/10.webp": {
   "m": [
    1.00854,
    -0.09764,
    -60.5,
    35.69
   ],
   "scale": 1.0133,
   "rot_deg": -5.53,
   "shift": [
    -11.6,
    -0.2
   ],
   "inliers": 56,
   "residual_px": 0.78,
   "ref_residual_px": {
    "eyeL": 3.6,
    "eyeR": 2.2,
    "mouth": 2.8,
    "nose": 2.8,
    "pin": 1.4
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_b1_draft_loop_10.webp",
    "rect": [
     157,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_10.webp",
    "rect": [
     157,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_10_u.webp",
    "rect": [
     280,
     372,
     228,
     120
    ]
   },
   "yield_eye_px": 1020,
   "yield_px": 2076,
   "cover_alien_px": 1,
   "occluded": 0.057,
   "feat": {
    "eyeL": [
     2.99,
     -0.99
    ],
    "eyeR": [
     0.84,
     -1.02
    ],
    "mouth": [
     2.15,
     -1.73
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_draft_loop/11.webp": {
   "m": [
    1.01076,
    -0.08684,
    -56.1,
    29.96
   ],
   "scale": 1.0145,
   "rot_deg": -4.91,
   "shift": [
    -11.3,
    -0.5
   ],
   "inliers": 48,
   "residual_px": 0.77,
   "ref_residual_px": {
    "eyeL": 4.1,
    "eyeR": 2.2,
    "mouth": 3.6,
    "nose": 2.8,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_b1_draft_loop_11.webp",
    "rect": [
     158,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_11.webp",
    "rect": [
     158,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_11_u.webp",
    "rect": [
     281,
     373,
     234,
     118
    ]
   },
   "yield_eye_px": 1595,
   "yield_px": 2620,
   "cover_alien_px": 0,
   "occluded": 0.09,
   "feat": {
    "eyeL": [
     2.99,
     -0.88
    ],
    "eyeR": [
     0.84,
     -1.02
    ],
    "mouth": [
     2.15,
     -1.73
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_draft_loop/12.webp": {
   "m": [
    1.00967,
    -0.06523,
    -42.61,
    21.28
   ],
   "scale": 1.0118,
   "rot_deg": -3.7,
   "shift": [
    -8.3,
    -0.9
   ],
   "inliers": 53,
   "residual_px": 0.79,
   "ref_residual_px": {
    "eyeL": 2.8,
    "eyeR": 3.0,
    "mouth": 1.4,
    "nose": 1.4,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_b1_draft_loop_12.webp",
    "rect": [
     161,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_12.webp",
    "rect": [
     161,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_12_u.webp",
    "rect": [
     285,
     374,
     234,
     115
    ]
   },
   "yield_eye_px": 1625,
   "yield_px": 2680,
   "cover_alien_px": 0,
   "occluded": 0.092,
   "feat": {
    "eyeL": [
     3.09,
     -0.88
    ],
    "eyeR": [
     0.96,
     -1.07
    ],
    "mouth": [
     2.36,
     -1.73
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_draft_loop/13.webp": {
   "m": [
    1.01381,
    -0.05641,
    -40.46,
    16.37
   ],
   "scale": 1.0154,
   "rot_deg": -3.18,
   "shift": [
    -8.6,
    -0.3
   ],
   "inliers": 52,
   "residual_px": 0.82,
   "ref_residual_px": {
    "eyeL": 4.5,
    "eyeR": 4.0,
    "mouth": 2.8,
    "nose": 2.8,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_b1_draft_loop_13.webp",
    "rect": [
     160,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_13.webp",
    "rect": [
     160,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_13_u.webp",
    "rect": [
     284,
     375,
     235,
     114
    ]
   },
   "yield_eye_px": 1519,
   "yield_px": 2854,
   "cover_alien_px": 0,
   "occluded": 0.085,
   "feat": {
    "eyeL": [
     2.13,
     -0.88
    ],
    "eyeR": [
     0.53,
     -0.88
    ],
    "mouth": [
     1.5,
     -1.42
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_draft_loop/14.webp": {
   "m": [
    1.00129,
    -0.02984,
    -19.65,
    9.1
   ],
   "scale": 1.0017,
   "rot_deg": -1.71,
   "shift": [
    -5.2,
    -2.5
   ],
   "inliers": 64,
   "residual_px": 0.78,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.4,
    "mouth": 2.0,
    "nose": 1.0,
    "pin": 1.4
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_b1_draft_loop_14.webp",
    "rect": [
     164,
     220,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_14.webp",
    "rect": [
     164,
     220,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_14_u.webp",
    "rect": [
     290,
     376,
     232,
     108
    ]
   },
   "yield_eye_px": 1142,
   "yield_px": 1627,
   "cover_alien_px": 3,
   "occluded": 0.066,
   "feat": {
    "eyeL": [
     1.42,
     0.16
    ],
    "eyeR": [
     0.53,
     -0.43
    ],
    "mouth": [
     1.24,
     -0.44
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_draft_loop/15.webp": {
   "m": [
    1.0083,
    0.0134,
    1.13,
    -11.25
   ],
   "scale": 1.0084,
   "rot_deg": 0.76,
   "shift": [
    -1.7,
    -1.9
   ],
   "inliers": 82,
   "residual_px": 0.84,
   "ref_residual_px": {
    "eyeL": 2.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.4,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_b1_draft_loop_15.webp",
    "rect": [
     167,
     220,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_15.webp",
    "rect": [
     167,
     220,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_15_u.webp",
    "rect": [
     295,
     378,
     231,
     105
    ]
   },
   "yield_eye_px": 519,
   "yield_px": 1040,
   "cover_alien_px": 2,
   "occluded": 0.029,
   "feat": {
    "eyeL": [
     0.91,
     0.16
    ],
    "eyeR": [
     0.12,
     -0.24
    ],
    "mouth": [
     1.19,
     -0.11
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_draft_loop/16.webp": {
   "m": [
    1.00516,
    0.03248,
    13.79,
    -17.91
   ],
   "scale": 1.0057,
   "rot_deg": 1.85,
   "shift": [
    0.8,
    -2.2
   ],
   "inliers": 107,
   "residual_px": 0.75,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.4,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_b1_draft_loop_16.webp",
    "rect": [
     170,
     220,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_16.webp",
    "rect": [
     170,
     220,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_16_u.webp",
    "rect": [
     298,
     377,
     230,
     107
    ]
   },
   "yield_eye_px": 329,
   "yield_px": 829,
   "cover_alien_px": 3,
   "occluded": 0.019,
   "feat": {
    "eyeL": [
     0.91,
     0.15
    ],
    "eyeR": [
     -0.16,
     -0.24
    ],
    "mouth": [
     0.62,
     -0.11
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_draft_loop/17.webp": {
   "m": [
    0.99965,
    0.06647,
    35.74,
    -29.68
   ],
   "scale": 1.0019,
   "rot_deg": 3.8,
   "shift": [
    4.7,
    -2.7
   ],
   "inliers": 91,
   "residual_px": 0.74,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_b1_draft_loop_17.webp",
    "rect": [
     174,
     219,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_17.webp",
    "rect": [
     174,
     219,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_17_u.webp",
    "rect": [
     304,
     374,
     228,
     112
    ]
   },
   "yield_eye_px": 155,
   "yield_px": 644,
   "cover_alien_px": 10,
   "occluded": 0.009,
   "feat": {
    "eyeL": [
     0.03,
     0.15
    ],
    "eyeR": [
     -0.42,
     0.09
    ],
    "mouth": [
     -0.48,
     0.51
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_draft_loop/18.webp": {
   "m": [
    0.99447,
    0.07967,
    45.57,
    -32.83
   ],
   "scale": 0.9977,
   "rot_deg": 4.58,
   "shift": [
    6.2,
    -2.8
   ],
   "inliers": 84,
   "residual_px": 0.89,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.4,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_b1_draft_loop_18.webp",
    "rect": [
     175,
     219,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_18.webp",
    "rect": [
     175,
     219,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_18_u.webp",
    "rect": [
     307,
     374,
     227,
     113
    ]
   },
   "yield_eye_px": 150,
   "yield_px": 635,
   "cover_alien_px": 14,
   "occluded": 0.009,
   "feat": {
    "eyeL": [
     -0.65,
     0.15
    ],
    "eyeR": [
     -0.42,
     0.27
    ],
    "mouth": [
     -0.89,
     0.91
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_draft_loop/19.webp": {
   "m": [
    0.99243,
    0.1034,
    58.56,
    -41.63
   ],
   "scale": 0.9978,
   "rot_deg": 5.95,
   "shift": [
    7.4,
    -2.9
   ],
   "inliers": 67,
   "residual_px": 0.74,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 1.4,
    "mouth": 1.4,
    "nose": 1.4,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_b1_draft_loop_19.webp",
    "rect": [
     176,
     219,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_19.webp",
    "rect": [
     176,
     219,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_19_u.webp",
    "rect": [
     310,
     372,
     228,
     117
    ]
   },
   "yield_eye_px": 221,
   "yield_px": 1012,
   "cover_alien_px": 0,
   "occluded": 0.013,
   "feat": {
    "eyeL": [
     -0.95,
     0.15
    ],
    "eyeR": [
     -0.52,
     0.31
    ],
    "mouth": [
     -1.16,
     1.16
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_draft_loop/20.webp": {
   "m": [
    0.98575,
    0.09314,
    58.31,
    -34.09
   ],
   "scale": 0.9901,
   "rot_deg": 5.4,
   "shift": [
    9.1,
    -2.7
   ],
   "inliers": 72,
   "residual_px": 0.83,
   "ref_residual_px": {
    "eyeL": 4.1,
    "eyeR": 2.2,
    "mouth": 4.1,
    "nose": 3.2,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_b1_draft_loop_20.webp",
    "rect": [
     178,
     219,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_20.webp",
    "rect": [
     178,
     219,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_20_u.webp",
    "rect": [
     311,
     374,
     227,
     114
    ]
   },
   "yield_eye_px": 198,
   "yield_px": 1248,
   "cover_alien_px": 2,
   "occluded": 0.012,
   "feat": {
    "eyeL": [
     -1.9,
     0.07
    ],
    "eyeR": [
     -1.15,
     0.31
    ],
    "mouth": [
     -1.81,
     1.16
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_draft_loop/21.webp": {
   "m": [
    0.99103,
    0.08311,
    47.54,
    -31.91
   ],
   "scale": 0.9945,
   "rot_deg": 4.79,
   "shift": [
    5.2,
    -2.1
   ],
   "inliers": 57,
   "residual_px": 0.87,
   "ref_residual_px": {
    "eyeL": 2.0,
    "eyeR": 1.0,
    "mouth": 2.2,
    "nose": 2.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_b1_draft_loop_21.webp",
    "rect": [
     174,
     220,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_21.webp",
    "rect": [
     174,
     220,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_21_u.webp",
    "rect": [
     306,
     374,
     229,
     114
    ]
   },
   "yield_eye_px": 233,
   "yield_px": 1030,
   "cover_alien_px": 3,
   "occluded": 0.014,
   "feat": {
    "eyeL": [
     -1.97,
     0.07
    ],
    "eyeR": [
     -1.15,
     0.38
    ],
    "mouth": [
     -1.81,
     1.43
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_draft_loop/22.webp": {
   "m": [
    0.99115,
    0.06977,
    39.63,
    -26.78
   ],
   "scale": 0.9936,
   "rot_deg": 4.03,
   "shift": [
    3.5,
    -2.4
   ],
   "inliers": 61,
   "residual_px": 0.98,
   "ref_residual_px": {
    "eyeL": 2.2,
    "eyeR": 1.4,
    "mouth": 2.2,
    "nose": 1.4,
    "pin": 1.4
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_b1_draft_loop_22.webp",
    "rect": [
     173,
     220,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_22.webp",
    "rect": [
     173,
     220,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_22_u.webp",
    "rect": [
     304,
     375,
     228,
     112
    ]
   },
   "yield_eye_px": 177,
   "yield_px": 918,
   "cover_alien_px": 4,
   "occluded": 0.01,
   "feat": {
    "eyeL": [
     -1.9,
     0.11
    ],
    "eyeR": [
     -1.15,
     0.21
    ],
    "mouth": [
     -1.79,
     1.03
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_draft_loop/23.webp": {
   "m": [
    0.99882,
    0.03053,
    13.87,
    -13.29
   ],
   "scale": 0.9993,
   "rot_deg": 1.75,
   "shift": [
    -0.8,
    -1.4
   ],
   "inliers": 93,
   "residual_px": 0.68,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.4,
    "mouth": 1.4,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_b1_draft_loop_23.webp",
    "rect": [
     168,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_23.webp",
    "rect": [
     168,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_23_u.webp",
    "rect": [
     298,
     378,
     228,
     107
    ]
   },
   "yield_eye_px": 130,
   "yield_px": 590,
   "cover_alien_px": 3,
   "occluded": 0.008,
   "feat": {
    "eyeL": [
     -0.35,
     0.12
    ],
    "eyeR": [
     -0.44,
     0.16
    ],
    "mouth": [
     -0.75,
     0.59
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_draft_loop/24.webp": {
   "m": [
    1.00023,
    0.01272,
    3.32,
    -6.42
   ],
   "scale": 1.0003,
   "rot_deg": 0.73,
   "shift": [
    -2.5,
    -1.1
   ],
   "inliers": 112,
   "residual_px": 0.73,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_b1_draft_loop_24.webp",
    "rect": [
     166,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_24.webp",
    "rect": [
     166,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_24_u.webp",
    "rect": [
     296,
     380,
     228,
     104
    ]
   },
   "yield_eye_px": 99,
   "yield_px": 552,
   "cover_alien_px": 5,
   "occluded": 0.006,
   "feat": {
    "eyeL": [
     -0.17,
     0.11
    ],
    "eyeR": [
     -0.28,
     0.14
    ],
    "mouth": [
     -0.26,
     0.33
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_draft_loop/25.webp": {
   "m": [
    1.00611,
    -0.0186,
    -16.74,
    4.89
   ],
   "scale": 1.0063,
   "rot_deg": -1.06,
   "shift": [
    -5.6,
    0.1
   ],
   "inliers": 94,
   "residual_px": 0.88,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 1.0,
    "mouth": 1.4,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_b1_draft_loop_25.webp",
    "rect": [
     163,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_25.webp",
    "rect": [
     163,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_25_u.webp",
    "rect": [
     290,
     379,
     229,
     107
    ]
   },
   "yield_eye_px": 127,
   "yield_px": 587,
   "cover_alien_px": 2,
   "occluded": 0.007,
   "feat": {
    "eyeL": [
     0.62,
     -0.12
    ],
    "eyeR": [
     -0.27,
     -0.22
    ],
    "mouth": [
     0.32,
     -0.23
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_draft_loop/26.webp": {
   "m": [
    1.00349,
    -0.02994,
    -22.15,
    10.4
   ],
   "scale": 1.0039,
   "rot_deg": -1.71,
   "shift": [
    -6.8,
    -0.2
   ],
   "inliers": 72,
   "residual_px": 0.97,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 1.0,
    "mouth": 0.0,
    "nose": 1.4,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_b1_draft_loop_26.webp",
    "rect": [
     162,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_26.webp",
    "rect": [
     162,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_26_u.webp",
    "rect": [
     288,
     378,
     228,
     109
    ]
   },
   "yield_eye_px": 147,
   "yield_px": 570,
   "cover_alien_px": 0,
   "occluded": 0.008,
   "feat": {
    "eyeL": [
     0.74,
     -0.61
    ],
    "eyeR": [
     -0.27,
     -0.42
    ],
    "mouth": [
     0.46,
     -0.83
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_draft_loop/27.webp": {
   "m": [
    1.01099,
    -0.05034,
    -37.7,
    16.5
   ],
   "scale": 1.0122,
   "rot_deg": -2.85,
   "shift": [
    -9.8,
    1.0
   ],
   "inliers": 69,
   "residual_px": 0.67,
   "ref_residual_px": {
    "eyeL": 3.2,
    "eyeR": 2.0,
    "mouth": 2.8,
    "nose": 2.2,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_b1_draft_loop_27.webp",
    "rect": [
     159,
     223,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_27.webp",
    "rect": [
     159,
     223,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_27_u.webp",
    "rect": [
     284,
     377,
     230,
     112
    ]
   },
   "yield_eye_px": 295,
   "yield_px": 704,
   "cover_alien_px": 1,
   "occluded": 0.017,
   "feat": {
    "eyeL": [
     0.71,
     -0.12
    ],
    "eyeR": [
     -0.0,
     -0.22
    ],
    "mouth": [
     0.42,
     -0.23
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_draft_loop/28.webp": {
   "m": [
    1.00117,
    -0.0598,
    -37.77,
    23.91
   ],
   "scale": 1.003,
   "rot_deg": -3.42,
   "shift": [
    -9.5,
    0.0
   ],
   "inliers": 66,
   "residual_px": 0.77,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 0.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_b1_draft_loop_28.webp",
    "rect": [
     160,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_28.webp",
    "rect": [
     160,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_28_u.webp",
    "rect": [
     285,
     376,
     227,
     113
    ]
   },
   "yield_eye_px": 581,
   "yield_px": 936,
   "cover_alien_px": 3,
   "occluded": 0.033,
   "feat": {
    "eyeL": [
     2.29,
     -0.52
    ],
    "eyeR": [
     0.2,
     -0.93
    ],
    "mouth": [
     1.64,
     -1.51
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_draft_loop/29.webp": {
   "m": [
    1.00976,
    -0.07083,
    -49.35,
    25.8
   ],
   "scale": 1.0122,
   "rot_deg": -4.01,
   "shift": [
    -12.4,
    1.4
   ],
   "inliers": 69,
   "residual_px": 0.75,
   "ref_residual_px": {
    "eyeL": 3.2,
    "eyeR": 2.0,
    "mouth": 3.6,
    "nose": 2.2,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_b1_draft_loop_29.webp",
    "rect": [
     157,
     223,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_29.webp",
    "rect": [
     157,
     223,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_29_u.webp",
    "rect": [
     280,
     376,
     232,
     115
    ]
   },
   "yield_eye_px": 798,
   "yield_px": 1173,
   "cover_alien_px": 3,
   "occluded": 0.045,
   "feat": {
    "eyeL": [
     2.4,
     -0.52
    ],
    "eyeR": [
     0.82,
     -1.09
    ],
    "mouth": [
     1.6,
     -1.3
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_draft_loop/30.webp": {
   "m": [
    1.00675,
    -0.0814,
    -53.54,
    31.54
   ],
   "scale": 1.01,
   "rot_deg": -4.62,
   "shift": [
    -12.9,
    1.4
   ],
   "inliers": 56,
   "residual_px": 0.67,
   "ref_residual_px": {
    "eyeL": 3.2,
    "eyeR": 2.0,
    "mouth": 1.4,
    "nose": 2.2,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_b1_draft_loop_30.webp",
    "rect": [
     156,
     223,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_30.webp",
    "rect": [
     156,
     223,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_30_u.webp",
    "rect": [
     280,
     375,
     230,
     117
    ]
   },
   "yield_eye_px": 921,
   "yield_px": 1337,
   "cover_alien_px": 0,
   "occluded": 0.052,
   "feat": {
    "eyeL": [
     2.4,
     -0.69
    ],
    "eyeR": [
     0.82,
     -1.09
    ],
    "mouth": [
     1.6,
     -1.3
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_draft_loop/31.webp": {
   "m": [
    1.00272,
    -0.10206,
    -62.19,
    41.86
   ],
   "scale": 1.0079,
   "rot_deg": -5.81,
   "shift": [
    -13.6,
    1.4
   ],
   "inliers": 57,
   "residual_px": 0.76,
   "ref_residual_px": {
    "eyeL": 2.2,
    "eyeR": 1.0,
    "mouth": 1.4,
    "nose": 1.4,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_b1_draft_loop_31.webp",
    "rect": [
     155,
     223,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_31.webp",
    "rect": [
     155,
     223,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_31_u.webp",
    "rect": [
     278,
     374,
     230,
     120
    ]
   },
   "yield_eye_px": 1033,
   "yield_px": 1556,
   "cover_alien_px": 0,
   "occluded": 0.059,
   "feat": {
    "eyeL": [
     1.55,
     -0.69
    ],
    "eyeR": [
     0.25,
     -0.73
    ],
    "mouth": [
     0.92,
     -1.14
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_draft_loop/32.webp": {
   "m": [
    1.00138,
    -0.11496,
    -68.78,
    48.36
   ],
   "scale": 1.008,
   "rot_deg": -6.55,
   "shift": [
    -14.7,
    2.0
   ],
   "inliers": 69,
   "residual_px": 0.69,
   "ref_residual_px": {
    "eyeL": 2.2,
    "eyeR": 1.0,
    "mouth": 1.4,
    "nose": 1.4,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_b1_draft_loop_32.webp",
    "rect": [
     154,
     224,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_32.webp",
    "rect": [
     154,
     224,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_32_u.webp",
    "rect": [
     277,
     374,
     229,
     122
    ]
   },
   "yield_eye_px": 525,
   "yield_px": 779,
   "cover_alien_px": 4,
   "occluded": 0.03,
   "feat": {
    "eyeL": [
     1.45,
     -0.69
    ],
    "eyeR": [
     0.11,
     -0.66
    ],
    "mouth": [
     0.92,
     -0.95
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_draft_loop/33.webp": {
   "m": [
    0.9977,
    -0.11699,
    -68.66,
    50.11
   ],
   "scale": 1.0045,
   "rot_deg": -6.69,
   "shift": [
    -15.2,
    1.2
   ],
   "inliers": 71,
   "residual_px": 0.72,
   "ref_residual_px": {
    "eyeL": 2.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_b1_draft_loop_33.webp",
    "rect": [
     154,
     223,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_33.webp",
    "rect": [
     154,
     223,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_33_u.webp",
    "rect": [
     277,
     373,
     229,
     122
    ]
   },
   "yield_eye_px": 282,
   "yield_px": 397,
   "cover_alien_px": 0,
   "occluded": 0.016,
   "feat": {
    "eyeL": [
     1.15,
     0.12
    ],
    "eyeR": [
     0.11,
     -0.13
    ],
    "mouth": [
     0.92,
     -0.0
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_draft_loop/34.webp": {
   "m": [
    0.99659,
    -0.12296,
    -71.32,
    53.42
   ],
   "scale": 1.0042,
   "rot_deg": -7.03,
   "shift": [
    -15.5,
    1.6
   ],
   "inliers": 66,
   "residual_px": 0.74,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_b1_draft_loop_34.webp",
    "rect": [
     154,
     224,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_34.webp",
    "rect": [
     154,
     224,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_34_u.webp",
    "rect": [
     276,
     373,
     228,
     123
    ]
   },
   "yield_eye_px": 352,
   "yield_px": 391,
   "cover_alien_px": 0,
   "occluded": 0.02,
   "feat": {
    "eyeL": [
     1.13,
     0.26
    ],
    "eyeR": [
     0.26,
     -0.09
    ],
    "mouth": [
     0.91,
     0.02
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_draft_loop/35.webp": {
   "m": [
    0.99483,
    -0.11886,
    -68.01,
    52.34
   ],
   "scale": 1.0019,
   "rot_deg": -6.81,
   "shift": [
    -14.8,
    1.4
   ],
   "inliers": 83,
   "residual_px": 0.81,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_b1_draft_loop_35.webp",
    "rect": [
     154,
     223,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_35.webp",
    "rect": [
     154,
     223,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_35_u.webp",
    "rect": [
     277,
     373,
     227,
     122
    ]
   },
   "yield_eye_px": 313,
   "yield_px": 386,
   "cover_alien_px": 1,
   "occluded": 0.018,
   "feat": {
    "eyeL": [
     0.89,
     0.12
    ],
    "eyeR": [
     0.26,
     -0.09
    ],
    "mouth": [
     0.86,
     0.04
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_draft_loop/36.webp": {
   "m": [
    0.99695,
    -0.10481,
    -60.12,
    45.56
   ],
   "scale": 1.0024,
   "rot_deg": -6.0,
   "shift": [
    -12.6,
    1.3
   ],
   "inliers": 80,
   "residual_px": 0.69,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_b1_draft_loop_36.webp",
    "rect": [
     156,
     223,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_36.webp",
    "rect": [
     156,
     223,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_36_u.webp",
    "rect": [
     280,
     374,
     228,
     120
    ]
   },
   "yield_eye_px": 319,
   "yield_px": 372,
   "cover_alien_px": 0,
   "occluded": 0.018,
   "feat": {
    "eyeL": [
     0.86,
     0.29
    ],
    "eyeR": [
     0.19,
     -0.07
    ],
    "mouth": [
     0.79,
     0.3
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_draft_loop/37.webp": {
   "m": [
    0.99751,
    -0.09166,
    -52.94,
    39.53
   ],
   "scale": 1.0017,
   "rot_deg": -5.25,
   "shift": [
    -11.3,
    0.9
   ],
   "inliers": 68,
   "residual_px": 0.79,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_b1_draft_loop_37.webp",
    "rect": [
     158,
     223,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_37.webp",
    "rect": [
     158,
     223,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_37_u.webp",
    "rect": [
     282,
     375,
     228,
     117
    ]
   },
   "yield_eye_px": 284,
   "yield_px": 363,
   "cover_alien_px": 1,
   "occluded": 0.016,
   "feat": {
    "eyeL": [
     0.73,
     0.04
    ],
    "eyeR": [
     0.08,
     -0.07
    ],
    "mouth": [
     0.7,
     0.17
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_draft_loop/38.webp": {
   "m": [
    0.99988,
    -0.07271,
    -42.41,
    30.41
   ],
   "scale": 1.0025,
   "rot_deg": -4.16,
   "shift": [
    -8.6,
    0.6
   ],
   "inliers": 86,
   "residual_px": 0.79,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_b1_draft_loop_38.webp",
    "rect": [
     160,
     223,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_38.webp",
    "rect": [
     160,
     223,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_38_u.webp",
    "rect": [
     285,
     376,
     227,
     115
    ]
   },
   "yield_eye_px": 187,
   "yield_px": 202,
   "cover_alien_px": 0,
   "occluded": 0.011,
   "feat": {
    "eyeL": [
     0.73,
     0.34
    ],
    "eyeR": [
     0.08,
     -0.07
    ],
    "mouth": [
     0.7,
     0.17
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_draft_loop/39.webp": {
   "m": [
    1.00512,
    -0.0562,
    -36.8,
    21.04
   ],
   "scale": 1.0067,
   "rot_deg": -3.2,
   "shift": [
    -8.6,
    0.5
   ],
   "inliers": 93,
   "residual_px": 1.24,
   "ref_residual_px": {
    "eyeL": 2.0,
    "eyeR": 1.4,
    "mouth": 2.0,
    "nose": 2.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_b1_draft_loop_39.webp",
    "rect": [
     160,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_39.webp",
    "rect": [
     160,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_39_u.webp",
    "rect": [
     285,
     377,
     231,
     112
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 51,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.94,
     0.67
    ],
    "eyeR": [
     0.32,
     -0.03
    ],
    "mouth": [
     0.89,
     0.17
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_draft_loop/40.webp": {
   "m": [
    1.00179,
    -0.04085,
    -25.14,
    15.63
   ],
   "scale": 1.0026,
   "rot_deg": -2.33,
   "shift": [
    -5.4,
    -0.2
   ],
   "inliers": 135,
   "residual_px": 0.97,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.4,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_b1_draft_loop_40.webp",
    "rect": [
     164,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_40.webp",
    "rect": [
     164,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_40_u.webp",
    "rect": [
     290,
     377,
     230,
     110
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.94,
     0.67
    ],
    "eyeR": [
     0.32,
     0.0
    ],
    "mouth": [
     0.89,
     0.48
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_draft_loop/41.webp": {
   "m": [
    1.0018,
    -0.03104,
    -19.36,
    11.59
   ],
   "scale": 1.0023,
   "rot_deg": -1.77,
   "shift": [
    -4.2,
    -0.3
   ],
   "inliers": 147,
   "residual_px": 0.81,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_b1_draft_loop_41.webp",
    "rect": [
     165,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_41.webp",
    "rect": [
     165,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_41_u.webp",
    "rect": [
     291,
     378,
     229,
     109
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 1,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.94,
     0.56
    ],
    "eyeR": [
     0.3,
     0.0
    ],
    "mouth": [
     0.83,
     0.48
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_draft_loop/42.webp": {
   "m": [
    1.00479,
    -0.01638,
    -12.45,
    4.1
   ],
   "scale": 1.0049,
   "rot_deg": -0.93,
   "shift": [
    -2.9,
    -0.4
   ],
   "inliers": 164,
   "residual_px": 0.71,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_b1_draft_loop_42.webp",
    "rect": [
     166,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_42.webp",
    "rect": [
     166,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_42_u.webp",
    "rect": [
     293,
     379,
     229,
     107
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 1,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.67,
     0.54
    ],
    "eyeR": [
     0.16,
     0.0
    ],
    "mouth": [
     0.77,
     0.31
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_draft_loop/43.webp": {
   "m": [
    1.00361,
    -0.01102,
    -8.45,
    2.35
   ],
   "scale": 1.0037,
   "rot_deg": -0.63,
   "shift": [
    -1.8,
    -0.5
   ],
   "inliers": 177,
   "residual_px": 0.65,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_b1_draft_loop_43.webp",
    "rect": [
     167,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_43.webp",
    "rect": [
     167,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_43_u.webp",
    "rect": [
     294,
     379,
     229,
     106
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.66,
     0.43
    ],
    "eyeR": [
     0.11,
     0.03
    ],
    "mouth": [
     0.55,
     0.25
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_draft_loop/44.webp": {
   "m": [
    1.00277,
    -0.00614,
    -4.41,
    0.72
   ],
   "scale": 1.0028,
   "rot_deg": -0.35,
   "shift": [
    -0.4,
    -0.5
   ],
   "inliers": 172,
   "residual_px": 0.62,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_b1_draft_loop_44.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_44.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_44_u.webp",
    "rect": [
     296,
     380,
     228,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 1,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.3,
     0.08
    ],
    "eyeR": [
     -0.08,
     0.03
    ],
    "mouth": [
     -0.04,
     0.25
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_draft_loop/45.webp": {
   "m": [
    1.00228,
    -0.00175,
    -1.99,
    -0.82
   ],
   "scale": 1.0023,
   "rot_deg": -0.1,
   "shift": [
    -0.2,
    -0.5
   ],
   "inliers": 195,
   "residual_px": 0.59,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_b1_draft_loop_45.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_45.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_45_u.webp",
    "rect": [
     296,
     380,
     228,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.14,
     0.01
    ],
    "eyeR": [
     -0.14,
     0.02
    ],
    "mouth": [
     -0.05,
     0.23
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_draft_loop/46.webp": {
   "m": [
    1.00231,
    -0.00178,
    -1.87,
    -0.82
   ],
   "scale": 1.0023,
   "rot_deg": -0.1,
   "shift": [
    -0.1,
    -0.5
   ],
   "inliers": 198,
   "residual_px": 0.56,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_b1_draft_loop_46.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_46.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_46_u.webp",
    "rect": [
     297,
     380,
     227,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.14,
     -0.06
    ],
    "eyeR": [
     -0.14,
     0.02
    ],
    "mouth": [
     -0.04,
     0.23
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_draft_loop/47.webp": {
   "m": [
    1.00231,
    -0.00101,
    -1.52,
    -1.18
   ],
   "scale": 1.0023,
   "rot_deg": -0.06,
   "shift": [
    -0.1,
    -0.5
   ],
   "inliers": 199,
   "residual_px": 0.55,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_b1_draft_loop_47.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_47.webp",
    "rect": [
     169,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_47_u.webp",
    "rect": [
     297,
     380,
     227,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.11,
     -0.06
    ],
    "eyeR": [
     -0.05,
     0.02
    ],
    "mouth": [
     0.0,
     0.19
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_draft_loop/48.webp": {
   "m": [
    1.00001,
    1e-05,
    0.0,
    -0.02
   ],
   "scale": 1.0,
   "rot_deg": 0.0,
   "shift": [
    -0.0,
    -0.0
   ],
   "inliers": 331,
   "residual_px": 0.0,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_b1_draft_loop_48.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_48.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_48_u.webp",
    "rect": [
     297,
     381,
     226,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.01,
     0.0
    ],
    "eyeR": [
     0.0,
     -0.0
    ],
    "mouth": [
     0.0,
     -0.0
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_s2_canny_loop/00.webp": {
   "m": [
    1.00001,
    1e-05,
    0.0,
    -0.02
   ],
   "scale": 1.0,
   "rot_deg": 0.0,
   "shift": [
    -0.0,
    -0.0
   ],
   "inliers": 331,
   "residual_px": 0.0,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_s2_canny_loop_00.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_00.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_00_u.webp",
    "rect": [
     297,
     381,
     226,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.01,
     0.0
    ],
    "eyeR": [
     0.0,
     -0.0
    ],
    "mouth": [
     0.0,
     -0.0
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_s2_canny_loop/01.webp": {
   "m": [
    0.99969,
    -2e-05,
    0.1,
    0.14
   ],
   "scale": 0.9997,
   "rot_deg": -0.0,
   "shift": [
    -0.0,
    -0.0
   ],
   "inliers": 198,
   "residual_px": 0.4,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_s2_canny_loop_01.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_01.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_01_u.webp",
    "rect": [
     297,
     381,
     225,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.04,
     -0.04
    ],
    "eyeR": [
     0.0,
     -0.0
    ],
    "mouth": [
     0.0,
     0.02
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_s2_canny_loop/02.webp": {
   "m": [
    0.9993,
    0.00046,
    0.47,
    0.07
   ],
   "scale": 0.9993,
   "rot_deg": 0.03,
   "shift": [
    -0.0,
    -0.1
   ],
   "inliers": 198,
   "residual_px": 0.46,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_s2_canny_loop_02.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_02.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_02_u.webp",
    "rect": [
     297,
     381,
     225,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.06,
     -0.07
    ],
    "eyeR": [
     0.01,
     -0.06
    ],
    "mouth": [
     -0.04,
     0.02
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_s2_canny_loop/03.webp": {
   "m": [
    0.9993,
    0.00054,
    0.44,
    0.15
   ],
   "scale": 0.9993,
   "rot_deg": 0.03,
   "shift": [
    -0.1,
    0.0
   ],
   "inliers": 189,
   "residual_px": 0.43,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_s2_canny_loop_03.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_03.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_03_u.webp",
    "rect": [
     297,
     381,
     225,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.07,
     -0.07
    ],
    "eyeR": [
     0.03,
     -0.06
    ],
    "mouth": [
     -0.04,
     0.02
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_s2_canny_loop/04.webp": {
   "m": [
    0.9983,
    -0.00524,
    -2.2,
    4.39
   ],
   "scale": 0.9983,
   "rot_deg": -0.3,
   "shift": [
    -0.5,
    1.5
   ],
   "inliers": 170,
   "residual_px": 0.65,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_s2_canny_loop_04.webp",
    "rect": [
     169,
     223,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_04.webp",
    "rect": [
     169,
     223,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_04_u.webp",
    "rect": [
     297,
     382,
     225,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.06,
     0.15
    ],
    "eyeR": [
     0.05,
     0.04
    ],
    "mouth": [
     0.06,
     0.05
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_s2_canny_loop/05.webp": {
   "m": [
    0.99993,
    -0.0145,
    -7.48,
    10.01
   ],
   "scale": 1.0,
   "rot_deg": -0.83,
   "shift": [
    -0.8,
    4.1
   ],
   "inliers": 151,
   "residual_px": 0.74,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_s2_canny_loop_05.webp",
    "rect": [
     168,
     226,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_05.webp",
    "rect": [
     168,
     226,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_05_u.webp",
    "rect": [
     296,
     384,
     226,
     106
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.02,
     0.15
    ],
    "eyeR": [
     0.13,
     0.16
    ],
    "mouth": [
     0.07,
     0.17
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_s2_canny_loop/06.webp": {
   "m": [
    0.9998,
    -0.03213,
    -15.96,
    21.72
   ],
   "scale": 1.0003,
   "rot_deg": -1.84,
   "shift": [
    -1.1,
    8.5
   ],
   "inliers": 127,
   "residual_px": 0.61,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_s2_canny_loop_06.webp",
    "rect": [
     168,
     230,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_06.webp",
    "rect": [
     168,
     230,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_06_u.webp",
    "rect": [
     294,
     387,
     228,
     109
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.09,
     0.01
    ],
    "eyeR": [
     0.13,
     0.09
    ],
    "mouth": [
     0.2,
     0.1
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_s2_canny_loop/07.webp": {
   "m": [
    1.0012,
    -0.03339,
    -17.09,
    22.66
   ],
   "scale": 1.0018,
   "rot_deg": -1.91,
   "shift": [
    -1.1,
    9.6
   ],
   "inliers": 126,
   "residual_px": 0.73,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_s2_canny_loop_07.webp",
    "rect": [
     168,
     232,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_07.webp",
    "rect": [
     168,
     232,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_07_u.webp",
    "rect": [
     294,
     388,
     228,
     109
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.09,
     0.01
    ],
    "eyeR": [
     0.16,
     0.16
    ],
    "mouth": [
     0.29,
     0.17
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_s2_canny_loop/08.webp": {
   "m": [
    0.99888,
    -0.02029,
    -8.71,
    16.73
   ],
   "scale": 0.9991,
   "rot_deg": -1.16,
   "shift": [
    0.3,
    7.9
   ],
   "inliers": 104,
   "residual_px": 0.73,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_s2_canny_loop_08.webp",
    "rect": [
     169,
     230,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_08.webp",
    "rect": [
     169,
     230,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_08_u.webp",
    "rect": [
     296,
     387,
     228,
     107
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.13,
     0.02
    ],
    "eyeR": [
     0.19,
     0.24
    ],
    "mouth": [
     0.44,
     0.18
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_s2_canny_loop/09.webp": {
   "m": [
    0.99936,
    -0.00147,
    0.76,
    6.75
   ],
   "scale": 0.9994,
   "rot_deg": -0.08,
   "shift": [
    1.2,
    5.8
   ],
   "inliers": 85,
   "residual_px": 0.78,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.4,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_s2_canny_loop_09.webp",
    "rect": [
     170,
     228,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_09.webp",
    "rect": [
     170,
     228,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_09_u.webp",
    "rect": [
     298,
     387,
     228,
     104
    ]
   },
   "yield_eye_px": 1,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.06,
     0.18
    ],
    "eyeR": [
     0.21,
     0.26
    ],
    "mouth": [
     0.4,
     0.46
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_s2_canny_loop/10.webp": {
   "m": [
    0.99692,
    0.03441,
    20.74,
    -10.82
   ],
   "scale": 0.9975,
   "rot_deg": 1.98,
   "shift": [
    3.5,
    1.8
   ],
   "inliers": 81,
   "residual_px": 0.83,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.4,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_s2_canny_loop_10.webp",
    "rect": [
     172,
     224,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_10.webp",
    "rect": [
     172,
     224,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_10_u.webp",
    "rect": [
     302,
     382,
     226,
     106
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.03,
     0.25
    ],
    "eyeR": [
     0.21,
     0.28
    ],
    "mouth": [
     0.4,
     0.6
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_s2_canny_loop/11.webp": {
   "m": [
    0.99601,
    0.05339,
    31.27,
    -19.99
   ],
   "scale": 0.9974,
   "rot_deg": 3.07,
   "shift": [
    4.8,
    -0.0
   ],
   "inliers": 87,
   "residual_px": 0.88,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.4,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_s2_canny_loop_11.webp",
    "rect": [
     174,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_11.webp",
    "rect": [
     174,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_11_u.webp",
    "rect": [
     304,
     378,
     226,
     110
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 36,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.03,
     0.18
    ],
    "eyeR": [
     0.16,
     0.28
    ],
    "mouth": [
     0.25,
     0.6
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_s2_canny_loop/12.webp": {
   "m": [
    0.99667,
    0.07814,
    44.44,
    -32.15
   ],
   "scale": 0.9997,
   "rot_deg": 4.48,
   "shift": [
    6.7,
    -1.8
   ],
   "inliers": 93,
   "residual_px": 0.67,
   "ref_residual_px": {
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_s2_canny_loop_12.webp",
    "rect": [
     176,
     220,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_12.webp",
    "rect": [
     176,
     220,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_12_u.webp",
    "rect": [
     307,
     375,
     225,
     113
    ]
   },
   "yield_eye_px": 1469,
   "yield_px": 1840,
   "cover_alien_px": 2,
   "occluded": 0.085,
   "feat": {
    "eyeL": [
     0.69,
     0.06
    ],
    "eyeR": [
     0.01,
     0.32
    ],
    "mouth": [
     0.14,
     0.86
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_s2_canny_loop/13.webp": {
   "m": [
    0.98915,
    0.08444,
    52.07,
    -32.06
   ],
   "scale": 0.9927,
   "rot_deg": 4.88,
   "shift": [
    8.3,
    -2.6
   ],
   "inliers": 76,
   "residual_px": 0.91,
   "ref_residual_px": {
    "eyeR": 0.0,
    "mouth": 1.4,
    "nose": 1.0,
    "pin": 1.4
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_s2_canny_loop_13.webp",
    "rect": [
     177,
     219,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_13.webp",
    "rect": [
     177,
     219,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_13_u.webp",
    "rect": [
     310,
     374,
     224,
     114
    ]
   },
   "yield_eye_px": 2873,
   "yield_px": 3253,
   "cover_alien_px": 0,
   "occluded": 0.168,
   "feat": {
    "eyeL": [
     0.82,
     -0.5
    ],
    "eyeR": [
     -0.27,
     0.41
    ],
    "mouth": [
     -1.09,
     0.98
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_s2_canny_loop/14.webp": {
   "m": [
    0.97979,
    0.09319,
    60.51,
    -32.58
   ],
   "scale": 0.9842,
   "rot_deg": 5.43,
   "shift": [
    8.9,
    -3.9
   ],
   "inliers": 55,
   "residual_px": 0.77,
   "ref_residual_px": {
    "eyeR": 1.4,
    "mouth": 3.6,
    "nose": 3.0,
    "pin": 1.4
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_s2_canny_loop_14.webp",
    "rect": [
     178,
     218,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_14.webp",
    "rect": [
     178,
     218,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_14_u.webp",
    "rect": [
     312,
     373,
     222,
     114
    ]
   },
   "yield_eye_px": 4091,
   "yield_px": 4681,
   "cover_alien_px": 0,
   "occluded": 0.244,
   "feat": {
    "eyeL": [
     0.96,
     -1.05
    ],
    "eyeR": [
     -0.73,
     0.58
    ],
    "mouth": [
     -1.72,
     1.69
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_s2_canny_loop/15.webp": {
   "m": [
    0.9901,
    0.07826,
    47.44,
    -29.17
   ],
   "scale": 0.9932,
   "rot_deg": 4.52,
   "shift": [
    7.0,
    -1.8
   ],
   "inliers": 49,
   "residual_px": 0.74,
   "ref_residual_px": {
    "eyeR": 3.0,
    "mouth": 3.6,
    "nose": 3.6,
    "pin": 4.1
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_s2_canny_loop_15.webp",
    "rect": [
     176,
     220,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_15.webp",
    "rect": [
     176,
     220,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_15_u.webp",
    "rect": [
     308,
     375,
     224,
     113
    ]
   },
   "yield_eye_px": 2757,
   "yield_px": 3057,
   "cover_alien_px": 0,
   "occluded": 0.162,
   "feat": {
    "eyeL": [
     1.09,
     -1.6
    ],
    "eyeR": [
     -2.41,
     0.58
    ],
    "mouth": [
     -3.1,
     1.69
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_s2_canny_loop/16.webp": {
   "m": [
    1.00017,
    0.06302,
    34.31,
    -25.52
   ],
   "scale": 1.0022,
   "rot_deg": 3.61,
   "shift": [
    5.1,
    0.3
   ],
   "inliers": 50,
   "residual_px": 0.99,
   "ref_residual_px": {
    "eyeR": 3.2,
    "mouth": 3.0,
    "nose": 4.0,
    "pin": 4.1
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_s2_canny_loop_16.webp",
    "rect": [
     174,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_16.webp",
    "rect": [
     174,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_16_u.webp",
    "rect": [
     304,
     378,
     226,
     111
    ]
   },
   "yield_eye_px": 1815,
   "yield_px": 2245,
   "cover_alien_px": 5,
   "occluded": 0.104,
   "feat": {
    "eyeL": [
     1.23,
     -2.15
    ],
    "eyeR": [
     -2.41,
     -0.29
    ],
    "mouth": [
     -3.1,
     -0.39
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_s2_canny_loop/17.webp": {
   "m": [
    1.01001,
    0.04747,
    21.15,
    -21.65
   ],
   "scale": 1.0111,
   "rot_deg": 2.69,
   "shift": [
    3.1,
    2.4
   ],
   "inliers": 59,
   "residual_px": 1.0,
   "ref_residual_px": {
    "eyeL": 4.5,
    "eyeR": 1.0,
    "mouth": 2.2,
    "nose": 2.8,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_s2_canny_loop_17.webp",
    "rect": [
     172,
     224,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_17.webp",
    "rect": [
     172,
     224,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_17_u.webp",
    "rect": [
     301,
     380,
     229,
     110
    ]
   },
   "yield_eye_px": 1499,
   "yield_px": 2276,
   "cover_alien_px": 3,
   "occluded": 0.085,
   "feat": {
    "eyeL": [
     1.23,
     -2.15
    ],
    "eyeR": [
     -1.37,
     -0.29
    ],
    "mouth": [
     -2.53,
     -0.39
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_s2_canny_loop/18.webp": {
   "m": [
    0.98933,
    0.06832,
    43.37,
    -22.84
   ],
   "scale": 0.9917,
   "rot_deg": 3.95,
   "shift": [
    7.2,
    0.1
   ],
   "inliers": 59,
   "residual_px": 0.82,
   "ref_residual_px": {
    "eyeL": 2.2,
    "eyeR": 2.2,
    "mouth": 3.2,
    "nose": 2.2,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_s2_canny_loop_18.webp",
    "rect": [
     176,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_18.webp",
    "rect": [
     176,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_18_u.webp",
    "rect": [
     308,
     378,
     224,
     111
    ]
   },
   "yield_eye_px": 939,
   "yield_px": 1084,
   "cover_alien_px": 1,
   "occluded": 0.055,
   "feat": {
    "eyeL": [
     -1.53,
     0.09
    ],
    "eyeR": [
     -0.97,
     1.04
    ],
    "mouth": [
     -1.47,
     1.1
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_s2_canny_loop/19.webp": {
   "m": [
    0.99105,
    0.06849,
    41.79,
    -23.56
   ],
   "scale": 0.9934,
   "rot_deg": 3.95,
   "shift": [
    6.3,
    0.3
   ],
   "inliers": 63,
   "residual_px": 0.88,
   "ref_residual_px": {
    "eyeR": 1.0,
    "mouth": 1.4,
    "nose": 1.4,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_s2_canny_loop_19.webp",
    "rect": [
     175,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_19.webp",
    "rect": [
     175,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_19_u.webp",
    "rect": [
     307,
     378,
     225,
     111
    ]
   },
   "yield_eye_px": 2593,
   "yield_px": 2759,
   "cover_alien_px": 0,
   "occluded": 0.152,
   "feat": {
    "eyeL": [
     -1.53,
     0.09
    ],
    "eyeR": [
     -1.21,
     1.13
    ],
    "mouth": [
     -2.53,
     1.49
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_s2_canny_loop/20.webp": {
   "m": [
    0.98155,
    0.05875,
    41.76,
    -16.45
   ],
   "scale": 0.9833,
   "rot_deg": 3.43,
   "shift": [
    6.9,
    -1.0
   ],
   "inliers": 51,
   "residual_px": 0.87,
   "ref_residual_px": {
    "eyeR": 2.2,
    "mouth": 3.6,
    "nose": 2.8,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_s2_canny_loop_20.webp",
    "rect": [
     176,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_20.webp",
    "rect": [
     176,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_20_u.webp",
    "rect": [
     308,
     378,
     224,
     109
    ]
   },
   "yield_eye_px": 2927,
   "yield_px": 3329,
   "cover_alien_px": 0,
   "occluded": 0.175,
   "feat": {
    "eyeL": [
     -0.93,
     0.02
    ],
    "eyeR": [
     -0.61,
     1.04
    ],
    "mouth": [
     -0.87,
     1.1
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_s2_canny_loop/21.webp": {
   "m": [
    1.0056,
    0.05054,
    23.21,
    -22.86
   ],
   "scale": 1.0069,
   "rot_deg": 2.88,
   "shift": [
    2.0,
    0.4
   ],
   "inliers": 53,
   "residual_px": 0.78,
   "ref_residual_px": {
    "eyeR": 1.0,
    "mouth": 1.4,
    "nose": 1.4,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_s2_canny_loop_21.webp",
    "rect": [
     171,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_21.webp",
    "rect": [
     171,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_21_u.webp",
    "rect": [
     300,
     378,
     230,
     110
    ]
   },
   "yield_eye_px": 2975,
   "yield_px": 3450,
   "cover_alien_px": 0,
   "occluded": 0.17,
   "feat": {
    "eyeL": [
     -0.33,
     -0.06
    ],
    "eyeR": [
     -0.61,
     0.37
    ],
    "mouth": [
     -0.9,
     -0.12
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_s2_canny_loop/22.webp": {
   "m": [
    1.00333,
    0.05289,
    25.45,
    -23.48
   ],
   "scale": 1.0047,
   "rot_deg": 3.02,
   "shift": [
    2.2,
    -0.3
   ],
   "inliers": 80,
   "residual_px": 0.79,
   "ref_residual_px": {
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_s2_canny_loop_22.webp",
    "rect": [
     171,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_22.webp",
    "rect": [
     171,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_22_u.webp",
    "rect": [
     301,
     378,
     227,
     110
    ]
   },
   "yield_eye_px": 1982,
   "yield_px": 2409,
   "cover_alien_px": 1,
   "occluded": 0.113,
   "feat": {
    "eyeL": [
     0.27,
     -0.13
    ],
    "eyeR": [
     -0.3,
     0.16
    ],
    "mouth": [
     -0.87,
     -0.12
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_s2_canny_loop/23.webp": {
   "m": [
    1.00072,
    0.07724,
    40.2,
    -31.63
   ],
   "scale": 1.0037,
   "rot_deg": 4.41,
   "shift": [
    4.5,
    0.3
   ],
   "inliers": 74,
   "residual_px": 0.77,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_s2_canny_loop_23.webp",
    "rect": [
     174,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_23.webp",
    "rect": [
     174,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_23_u.webp",
    "rect": [
     304,
     377,
     226,
     113
    ]
   },
   "yield_eye_px": 1316,
   "yield_px": 1568,
   "cover_alien_px": 1,
   "occluded": 0.076,
   "feat": {
    "eyeL": [
     0.86,
     -0.13
    ],
    "eyeR": [
     -0.17,
     0.37
    ],
    "mouth": [
     0.08,
     -0.07
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_s2_canny_loop/24.webp": {
   "m": [
    0.99804,
    0.08799,
    47.42,
    -34.94
   ],
   "scale": 1.0019,
   "rot_deg": 5.04,
   "shift": [
    5.7,
    0.1
   ],
   "inliers": 71,
   "residual_px": 0.81,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 2.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_s2_canny_loop_24.webp",
    "rect": [
     175,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_24.webp",
    "rect": [
     175,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_24_u.webp",
    "rect": [
     306,
     376,
     226,
     115
    ]
   },
   "yield_eye_px": 1231,
   "yield_px": 1408,
   "cover_alien_px": 1,
   "occluded": 0.071,
   "feat": {
    "eyeL": [
     0.93,
     0.18
    ],
    "eyeR": [
     0.14,
     0.43
    ],
    "mouth": [
     0.51,
     0.19
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_s2_canny_loop/25.webp": {
   "m": [
    0.99739,
    0.09377,
    51.44,
    -36.82
   ],
   "scale": 1.0018,
   "rot_deg": 5.37,
   "shift": [
    6.7,
    0.3
   ],
   "inliers": 72,
   "residual_px": 0.78,
   "ref_residual_px": {
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_s2_canny_loop_25.webp",
    "rect": [
     176,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_25.webp",
    "rect": [
     176,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_25_u.webp",
    "rect": [
     308,
     376,
     226,
     115
    ]
   },
   "yield_eye_px": 2671,
   "yield_px": 3116,
   "cover_alien_px": 0,
   "occluded": 0.154,
   "feat": {
    "eyeL": [
     0.93,
     0.18
    ],
    "eyeR": [
     0.19,
     0.43
    ],
    "mouth": [
     0.51,
     0.19
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_s2_canny_loop/26.webp": {
   "m": [
    1.00049,
    0.08497,
    45.4,
    -34.26
   ],
   "scale": 1.0041,
   "rot_deg": 4.85,
   "shift": [
    6.1,
    0.7
   ],
   "inliers": 89,
   "residual_px": 0.79,
   "ref_residual_px": {
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_s2_canny_loop_26.webp",
    "rect": [
     175,
     223,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_26.webp",
    "rect": [
     175,
     223,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_26_u.webp",
    "rect": [
     306,
     376,
     228,
     115
    ]
   },
   "yield_eye_px": 3657,
   "yield_px": 4251,
   "cover_alien_px": 1,
   "occluded": 0.21,
   "feat": {
    "eyeL": [
     0.87,
     0.17
    ],
    "eyeR": [
     0.19,
     0.26
    ],
    "mouth": [
     -0.09,
     -0.35
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_s2_canny_loop/27.webp": {
   "m": [
    1.00345,
    0.08416,
    43.59,
    -35.27
   ],
   "scale": 1.007,
   "rot_deg": 4.79,
   "shift": [
    5.8,
    0.7
   ],
   "inliers": 90,
   "residual_px": 0.84,
   "ref_residual_px": {
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_s2_canny_loop_27.webp",
    "rect": [
     175,
     223,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_27.webp",
    "rect": [
     175,
     223,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_27_u.webp",
    "rect": [
     306,
     376,
     227,
     115
    ]
   },
   "yield_eye_px": 4114,
   "yield_px": 4832,
   "cover_alien_px": 2,
   "occluded": 0.234,
   "feat": {
    "eyeL": [
     0.81,
     0.16
    ],
    "eyeR": [
     -0.11,
     0.18
    ],
    "mouth": [
     -0.09,
     -0.71
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_s2_canny_loop/28.webp": {
   "m": [
    0.99661,
    0.13105,
    70.01,
    -51.2
   ],
   "scale": 1.0052,
   "rot_deg": 7.49,
   "shift": [
    7.6,
    0.8
   ],
   "inliers": 65,
   "residual_px": 0.87,
   "ref_residual_px": {
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.4,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_s2_canny_loop_28.webp",
    "rect": [
     177,
     223,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_28.webp",
    "rect": [
     177,
     223,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_28_u.webp",
    "rect": [
     310,
     373,
     226,
     122
    ]
   },
   "yield_eye_px": 3534,
   "yield_px": 4227,
   "cover_alien_px": 0,
   "occluded": 0.202,
   "feat": {
    "eyeL": [
     0.75,
     0.15
    ],
    "eyeR": [
     -0.11,
     0.18
    ],
    "mouth": [
     0.52,
     -0.71
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_s2_canny_loop/29.webp": {
   "m": [
    0.9877,
    0.15631,
    86.41,
    -59.1
   ],
   "scale": 1.0,
   "rot_deg": 8.99,
   "shift": [
    8.6,
    -0.9
   ],
   "inliers": 94,
   "residual_px": 0.89,
   "ref_residual_px": {
    "eyeR": 1.0,
    "mouth": 1.4,
    "nose": 2.2,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_s2_canny_loop_29.webp",
    "rect": [
     178,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_29.webp",
    "rect": [
     178,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_29_u.webp",
    "rect": [
     312,
     371,
     226,
     125
    ]
   },
   "yield_eye_px": 2276,
   "yield_px": 2785,
   "cover_alien_px": 0,
   "occluded": 0.132,
   "feat": {
    "eyeL": [
     0.69,
     0.14
    ],
    "eyeR": [
     -0.11,
     0.54
    ],
    "mouth": [
     0.52,
     0.38
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_s2_canny_loop/30.webp": {
   "m": [
    0.9869,
    0.15824,
    88.34,
    -59.26
   ],
   "scale": 0.9995,
   "rot_deg": 9.11,
   "shift": [
    9.4,
    -0.7
   ],
   "inliers": 102,
   "residual_px": 0.69,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 1.4,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_s2_canny_loop_30.webp",
    "rect": [
     178,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_30.webp",
    "rect": [
     178,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_30_u.webp",
    "rect": [
     313,
     371,
     225,
     125
    ]
   },
   "yield_eye_px": 1478,
   "yield_px": 1872,
   "cover_alien_px": 6,
   "occluded": 0.085,
   "feat": {
    "eyeL": [
     0.63,
     0.14
    ],
    "eyeR": [
     -0.15,
     0.81
    ],
    "mouth": [
     -0.02,
     0.72
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_s2_canny_loop/31.webp": {
   "m": [
    0.98425,
    0.15888,
    90.28,
    -58.99
   ],
   "scale": 0.997,
   "rot_deg": 9.17,
   "shift": [
    9.9,
    -1.4
   ],
   "inliers": 74,
   "residual_px": 0.69,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.4,
    "mouth": 1.4,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_s2_canny_loop_31.webp",
    "rect": [
     179,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_31.webp",
    "rect": [
     179,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_31_u.webp",
    "rect": [
     314,
     370,
     225,
     125
    ]
   },
   "yield_eye_px": 162,
   "yield_px": 262,
   "cover_alien_px": 7,
   "occluded": 0.009,
   "feat": {
    "eyeL": [
     -0.54,
     -0.05
    ],
    "eyeR": [
     -0.36,
     0.81
    ],
    "mouth": [
     -0.93,
     0.72
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_s2_canny_loop/32.webp": {
   "m": [
    0.98204,
    0.14936,
    86.8,
    -54.79
   ],
   "scale": 0.9933,
   "rot_deg": 8.65,
   "shift": [
    10.0,
    -2.1
   ],
   "inliers": 59,
   "residual_px": 0.76,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 1.4,
    "mouth": 1.4,
    "nose": 1.4,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_s2_canny_loop_32.webp",
    "rect": [
     179,
     220,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_32.webp",
    "rect": [
     179,
     220,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_32_u.webp",
    "rect": [
     316,
     370,
     223,
     124
    ]
   },
   "yield_eye_px": 3,
   "yield_px": 40,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -1.19,
     -0.07
    ],
    "eyeR": [
     -0.65,
     1.01
    ],
    "mouth": [
     -1.4,
     0.89
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_s2_canny_loop/33.webp": {
   "m": [
    0.97974,
    0.1399,
    83.38,
    -50.57
   ],
   "scale": 0.9897,
   "rot_deg": 8.13,
   "shift": [
    10.0,
    -2.8
   ],
   "inliers": 53,
   "residual_px": 0.71,
   "ref_residual_px": {
    "eyeL": 2.0,
    "eyeR": 2.2,
    "mouth": 3.2,
    "nose": 1.4,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_s2_canny_loop_33.webp",
    "rect": [
     179,
     219,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_33.webp",
    "rect": [
     179,
     219,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_33_u.webp",
    "rect": [
     316,
     371,
     222,
     121
    ]
   },
   "yield_eye_px": 35,
   "yield_px": 51,
   "cover_alien_px": 6,
   "occluded": 0.002,
   "feat": {
    "eyeL": [
     -1.95,
     -0.07
    ],
    "eyeR": [
     -0.83,
     1.13
    ],
    "mouth": [
     -2.07,
     1.45
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_s2_canny_loop/34.webp": {
   "m": [
    0.97735,
    0.13049,
    80.02,
    -46.33
   ],
   "scale": 0.986,
   "rot_deg": 7.6,
   "shift": [
    10.0,
    -3.5
   ],
   "inliers": 62,
   "residual_px": 0.7,
   "ref_residual_px": {
    "eyeL": 4.0,
    "eyeR": 2.2,
    "mouth": 3.6,
    "nose": 2.2,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_s2_canny_loop_34.webp",
    "rect": [
     179,
     218,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_34.webp",
    "rect": [
     179,
     218,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_34_u.webp",
    "rect": [
     314,
     371,
     223,
     120
    ]
   },
   "yield_eye_px": 20,
   "yield_px": 47,
   "cover_alien_px": 5,
   "occluded": 0.001,
   "feat": {
    "eyeL": [
     -2.49,
     -0.07
    ],
    "eyeR": [
     -0.88,
     1.4
    ],
    "mouth": [
     -2.4,
     1.46
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_s2_canny_loop/35.webp": {
   "m": [
    0.98063,
    0.11471,
    70.17,
    -41.19
   ],
   "scale": 0.9873,
   "rot_deg": 6.67,
   "shift": [
    8.9,
    -3.3
   ],
   "inliers": 65,
   "residual_px": 0.73,
   "ref_residual_px": {
    "eyeL": 3.0,
    "eyeR": 1.4,
    "mouth": 3.2,
    "nose": 2.2,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_s2_canny_loop_35.webp",
    "rect": [
     178,
     219,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_35.webp",
    "rect": [
     178,
     219,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_35_u.webp",
    "rect": [
     312,
     372,
     224,
     117
    ]
   },
   "yield_eye_px": 30,
   "yield_px": 133,
   "cover_alien_px": 1,
   "occluded": 0.002,
   "feat": {
    "eyeL": [
     -2.84,
     0.13
    ],
    "eyeR": [
     -1.25,
     1.13
    ],
    "mouth": [
     -2.4,
     1.46
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_s2_canny_loop/36.webp": {
   "m": [
    0.98366,
    0.09885,
    60.39,
    -35.91
   ],
   "scale": 0.9886,
   "rot_deg": 5.74,
   "shift": [
    7.7,
    -3.1
   ],
   "inliers": 77,
   "residual_px": 0.83,
   "ref_residual_px": {
    "eyeL": 3.0,
    "eyeR": 2.2,
    "mouth": 3.2,
    "nose": 2.2,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_s2_canny_loop_36.webp",
    "rect": [
     177,
     219,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_36.webp",
    "rect": [
     177,
     219,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_36_u.webp",
    "rect": [
     310,
     373,
     224,
     115
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 37,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -2.49,
     0.13
    ],
    "eyeR": [
     -0.99,
     0.82
    ],
    "mouth": [
     -2.39,
     1.2
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_s2_canny_loop/37.webp": {
   "m": [
    0.98643,
    0.08293,
    50.68,
    -30.48
   ],
   "scale": 0.9899,
   "rot_deg": 4.81,
   "shift": [
    6.5,
    -2.9
   ],
   "inliers": 67,
   "residual_px": 0.62,
   "ref_residual_px": {
    "eyeL": 3.0,
    "eyeR": 1.4,
    "mouth": 2.2,
    "nose": 2.2,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_s2_canny_loop_37.webp",
    "rect": [
     176,
     219,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_37.webp",
    "rect": [
     176,
     219,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_37_u.webp",
    "rect": [
     308,
     374,
     224,
     113
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 2,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -2.38,
     0.17
    ],
    "eyeR": [
     -0.99,
     0.76
    ],
    "mouth": [
     -2.12,
     1.13
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_s2_canny_loop/38.webp": {
   "m": [
    0.99446,
    0.05531,
    31.82,
    -22.15
   ],
   "scale": 0.996,
   "rot_deg": 3.18,
   "shift": [
    3.8,
    -2.1
   ],
   "inliers": 93,
   "residual_px": 0.84,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.4,
    "mouth": 1.4,
    "nose": 1.4,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_s2_canny_loop_38.webp",
    "rect": [
     173,
     220,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_38.webp",
    "rect": [
     173,
     220,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_38_u.webp",
    "rect": [
     304,
     376,
     226,
     110
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 2,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.99,
     0.17
    ],
    "eyeR": [
     -0.37,
     0.76
    ],
    "mouth": [
     -1.17,
     0.87
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_s2_canny_loop/39.webp": {
   "m": [
    0.99461,
    0.04053,
    24.18,
    -15.6
   ],
   "scale": 0.9954,
   "rot_deg": 2.33,
   "shift": [
    3.1,
    -1.5
   ],
   "inliers": 123,
   "residual_px": 0.89,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.4,
    "mouth": 1.4,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_s2_canny_loop_39.webp",
    "rect": [
     172,
     220,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_39.webp",
    "rect": [
     172,
     220,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_39_u.webp",
    "rect": [
     302,
     378,
     226,
     107
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.89,
     0.06
    ],
    "eyeR": [
     -0.34,
     0.63
    ],
    "mouth": [
     -1.1,
     0.65
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_s2_canny_loop/40.webp": {
   "m": [
    0.99847,
    0.02264,
    12.43,
    -9.12
   ],
   "scale": 0.9987,
   "rot_deg": 1.3,
   "shift": [
    1.3,
    -0.6
   ],
   "inliers": 148,
   "residual_px": 0.76,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_s2_canny_loop_40.webp",
    "rect": [
     170,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_40.webp",
    "rect": [
     170,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_40_u.webp",
    "rect": [
     299,
     380,
     227,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 13,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.3,
     0.06
    ],
    "eyeR": [
     -0.04,
     0.4
    ],
    "mouth": [
     -0.47,
     0.32
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_s2_canny_loop/41.webp": {
   "m": [
    0.99925,
    0.01485,
    7.94,
    -6.27
   ],
   "scale": 0.9994,
   "rot_deg": 0.85,
   "shift": [
    0.7,
    -0.6
   ],
   "inliers": 170,
   "residual_px": 0.66,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_s2_canny_loop_41.webp",
    "rect": [
     170,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_41.webp",
    "rect": [
     170,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_41_u.webp",
    "rect": [
     298,
     380,
     226,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.19,
     0.06
    ],
    "eyeR": [
     -0.01,
     0.24
    ],
    "mouth": [
     -0.31,
     0.19
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_s2_canny_loop/42.webp": {
   "m": [
    0.99954,
    0.00631,
    3.42,
    -2.58
   ],
   "scale": 0.9996,
   "rot_deg": 0.36,
   "shift": [
    0.3,
    -0.2
   ],
   "inliers": 180,
   "residual_px": 0.51,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_s2_canny_loop_42.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_42.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_42_u.webp",
    "rect": [
     298,
     381,
     226,
     103
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.11,
     0.05
    ],
    "eyeR": [
     -0.01,
     0.22
    ],
    "mouth": [
     -0.16,
     0.08
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_s2_canny_loop/43.webp": {
   "m": [
    1.00068,
    0.0048,
    1.99,
    -2.36
   ],
   "scale": 1.0007,
   "rot_deg": 0.27,
   "shift": [
    0.0,
    -0.1
   ],
   "inliers": 180,
   "residual_px": 0.51,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_s2_canny_loop_43.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_43.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_43_u.webp",
    "rect": [
     297,
     381,
     225,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 11,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.01,
     0.02
    ],
    "eyeR": [
     0.0,
     0.17
    ],
    "mouth": [
     -0.11,
     -0.02
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_s2_canny_loop/44.webp": {
   "m": [
    0.99997,
    0.00086,
    0.52,
    -0.31
   ],
   "scale": 1.0,
   "rot_deg": 0.05,
   "shift": [
    0.1,
    0.0
   ],
   "inliers": 184,
   "residual_px": 0.43,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_s2_canny_loop_44.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_44.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_44_u.webp",
    "rect": [
     297,
     381,
     225,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.01,
     -0.06
    ],
    "eyeR": [
     0.01,
     0.13
    ],
    "mouth": [
     -0.11,
     -0.02
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_s2_canny_loop/45.webp": {
   "m": [
    1.0,
    0.00043,
    0.19,
    -0.13
   ],
   "scale": 1.0,
   "rot_deg": 0.02,
   "shift": [
    -0.0,
    0.0
   ],
   "inliers": 188,
   "residual_px": 0.48,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_s2_canny_loop_45.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_45.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_45_u.webp",
    "rect": [
     297,
     381,
     225,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.01,
     -0.06
    ],
    "eyeR": [
     0.01,
     0.13
    ],
    "mouth": [
     -0.12,
     -0.01
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_s2_canny_loop/46.webp": {
   "m": [
    0.99994,
    0.0002,
    0.09,
    0.0
   ],
   "scale": 0.9999,
   "rot_deg": 0.01,
   "shift": [
    -0.0,
    0.1
   ],
   "inliers": 188,
   "residual_px": 0.49,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_s2_canny_loop_46.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_46.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_46_u.webp",
    "rect": [
     297,
     381,
     225,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.01,
     -0.02
    ],
    "eyeR": [
     0.01,
     0.08
    ],
    "mouth": [
     -0.14,
     -0.01
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_s2_canny_loop/47.webp": {
   "m": [
    0.99995,
    -9e-05,
    -0.04,
    0.14
   ],
   "scale": 1.0,
   "rot_deg": -0.01,
   "shift": [
    -0.0,
    0.1
   ],
   "inliers": 198,
   "residual_px": 0.5,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_s2_canny_loop_47.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_47.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_47_u.webp",
    "rect": [
     297,
     381,
     225,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.0,
     -0.01
    ],
    "eyeR": [
     0.01,
     0.07
    ],
    "mouth": [
     -0.12,
     -0.01
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_s2_canny_loop/48.webp": {
   "m": [
    1.00001,
    1e-05,
    0.0,
    -0.02
   ],
   "scale": 1.0,
   "rot_deg": 0.0,
   "shift": [
    -0.0,
    -0.0
   ],
   "inliers": 331,
   "residual_px": 0.0,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_s2_canny_loop_48.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_48.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_48_u.webp",
    "rect": [
     297,
     381,
     226,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.01,
     0.0
    ],
    "eyeR": [
     0.0,
     -0.0
    ],
    "mouth": [
     0.0,
     -0.0
    ]
   },
   "w": 1.0
  },
  "frames/clap_s1_loop/00.webp": {
   "m": [
    1.00001,
    1e-05,
    0.0,
    -0.02
   ],
   "scale": 1.0,
   "rot_deg": 0.0,
   "shift": [
    -0.0,
    -0.0
   ],
   "inliers": 331,
   "residual_px": 0.0,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/clap_s1_loop_00.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_00.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_00_u.webp",
    "rect": [
     297,
     381,
     226,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.01,
     0.0
    ],
    "eyeR": [
     0.0,
     -0.0
    ],
    "mouth": [
     0.0,
     -0.0
    ]
   },
   "w": 1.0
  },
  "frames/clap_s1_loop/01.webp": {
   "m": [
    1.00005,
    -2e-05,
    0.08,
    0.12
   ],
   "scale": 1.0001,
   "rot_deg": -0.0,
   "shift": [
    0.1,
    0.1
   ],
   "inliers": 201,
   "residual_px": 0.38,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/clap_s1_loop_01.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_01.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_01_u.webp",
    "rect": [
     297,
     381,
     227,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.01,
     0.0
    ],
    "eyeR": [
     0.04,
     0.14
    ],
    "mouth": [
     0.14,
     0.09
    ]
   },
   "w": 1.0
  },
  "frames/clap_s1_loop/02.webp": {
   "m": [
    0.99997,
    0.0016,
    0.86,
    -0.53
   ],
   "scale": 1.0,
   "rot_deg": 0.09,
   "shift": [
    0.1,
    0.1
   ],
   "inliers": 184,
   "residual_px": 0.42,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/clap_s1_loop_02.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_02.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_02_u.webp",
    "rect": [
     297,
     381,
     227,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.0,
     0.22
    ],
    "eyeR": [
     0.08,
     0.23
    ],
    "mouth": [
     0.14,
     0.29
    ]
   },
   "w": 1.0
  },
  "frames/clap_s1_loop/03.webp": {
   "m": [
    0.99949,
    0.00149,
    0.99,
    0.31
   ],
   "scale": 0.9995,
   "rot_deg": 0.09,
   "shift": [
    0.1,
    0.7
   ],
   "inliers": 182,
   "residual_px": 0.57,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/clap_s1_loop_03.webp",
    "rect": [
     169,
     223,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_03.webp",
    "rect": [
     169,
     223,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_03_u.webp",
    "rect": [
     297,
     382,
     227,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.04,
     0.22
    ],
    "eyeR": [
     0.08,
     0.29
    ],
    "mouth": [
     0.08,
     0.29
    ]
   },
   "w": 1.0
  },
  "frames/clap_s1_loop/04.webp": {
   "m": [
    1.00041,
    -0.01496,
    -6.91,
    12.53
   ],
   "scale": 1.0005,
   "rot_deg": -0.86,
   "shift": [
    0.2,
    6.6
   ],
   "inliers": 87,
   "residual_px": 1.15,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 1.0,
    "mouth": 1.4,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/clap_s1_loop_04.webp",
    "rect": [
     169,
     229,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_04.webp",
    "rect": [
     169,
     229,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_04_u.webp",
    "rect": [
     297,
     386,
     227,
     107
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.04,
     -0.96
    ],
    "eyeR": [
     -0.35,
     0.29
    ],
    "mouth": [
     0.08,
     -0.59
    ]
   },
   "w": 1.0
  },
  "frames/clap_s1_loop/05.webp": {
   "m": [
    1.00978,
    -0.01639,
    -13.62,
    13.66
   ],
   "scale": 1.0099,
   "rot_deg": -0.93,
   "shift": [
    -2.0,
    11.5
   ],
   "inliers": 80,
   "residual_px": 0.92,
   "ref_residual_px": {
    "eyeL": 2.2,
    "eyeR": 1.4,
    "mouth": 2.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/clap_s1_loop_05.webp",
    "rect": [
     167,
     234,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_05.webp",
    "rect": [
     167,
     234,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_05_u.webp",
    "rect": [
     294,
     390,
     230,
     108
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 1172,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.13,
     -0.96
    ],
    "eyeR": [
     -0.52,
     -0.41
    ],
    "mouth": [
     0.01,
     -1.35
    ]
   },
   "w": 1.0
  },
  "frames/clap_s1_loop/06.webp": {
   "m": [
    1.00774,
    -0.03163,
    -21.29,
    21.12
   ],
   "scale": 1.0082,
   "rot_deg": -1.8,
   "shift": [
    -3.4,
    11.8
   ],
   "inliers": 65,
   "residual_px": 0.79,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.4,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/clap_s1_loop_06.webp",
    "rect": [
     166,
     234,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_06.webp",
    "rect": [
     166,
     234,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_06_u.webp",
    "rect": [
     292,
     390,
     228,
     109
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 1384,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.28,
     -0.79
    ],
    "eyeR": [
     -0.52,
     -0.41
    ],
    "mouth": [
     0.01,
     -1.35
    ]
   },
   "w": 1.0
  },
  "frames/clap_s1_loop/07.webp": {
   "m": [
    1.01228,
    -0.03669,
    -25.51,
    18.21
   ],
   "scale": 1.0129,
   "rot_deg": -2.08,
   "shift": [
    -3.4,
    8.9
   ],
   "inliers": 81,
   "residual_px": 0.83,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 2.0,
    "nose": 1.4,
    "pin": 2.2
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/clap_s1_loop_07.webp",
    "rect": [
     166,
     231,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_07.webp",
    "rect": [
     166,
     231,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_07_u.webp",
    "rect": [
     291,
     386,
     228,
     110
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 2596,
   "cover_alien_px": 6,
   "occluded": 0.053,
   "feat": {
    "eyeL": [
     0.13,
     -0.2
    ],
    "eyeR": [
     -0.96,
     -0.09
    ],
    "mouth": [
     -0.18,
     -0.99
    ]
   },
   "w": 1.0
  },
  "frames/clap_s1_loop/08.webp": {
   "m": [
    1.00403,
    -0.03556,
    -22.0,
    17.38
   ],
   "scale": 1.0047,
   "rot_deg": -2.03,
   "shift": [
    -3.8,
    4.7
   ],
   "inliers": 74,
   "residual_px": 0.83,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.4,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/clap_s1_loop_08.webp",
    "rect": [
     165,
     227,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_08.webp",
    "rect": [
     165,
     227,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_08_u.webp",
    "rect": [
     292,
     383,
     226,
     109
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 758,
   "cover_alien_px": 5,
   "occluded": 0.029,
   "feat": {
    "eyeL": [
     0.06,
     -0.2
    ],
    "eyeR": [
     -1.06,
     0.04
    ],
    "mouth": [
     -0.36,
     -0.62
    ]
   },
   "w": 1.0
  },
  "frames/clap_s1_loop/09.webp": {
   "m": [
    1.00258,
    -0.03058,
    -18.42,
    13.03
   ],
   "scale": 1.003,
   "rot_deg": -1.75,
   "shift": [
    -3.1,
    1.7
   ],
   "inliers": 93,
   "residual_px": 0.85,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/clap_s1_loop_09.webp",
    "rect": [
     166,
     224,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_09.webp",
    "rect": [
     166,
     224,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_09_u.webp",
    "rect": [
     292,
     380,
     226,
     109
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 101,
   "cover_alien_px": 11,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.06,
     -0.2
    ],
    "eyeR": [
     -0.96,
     -0.09
    ],
    "mouth": [
     -0.36,
     -0.26
    ]
   },
   "w": 1.0
  },
  "frames/clap_s1_loop/10.webp": {
   "m": [
    1.00095,
    -0.00828,
    -6.9,
    1.92
   ],
   "scale": 1.001,
   "rot_deg": -0.47,
   "shift": [
    -2.7,
    -1.0
   ],
   "inliers": 104,
   "residual_px": 0.73,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/clap_s1_loop_10.webp",
    "rect": [
     166,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_10.webp",
    "rect": [
     166,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_10_u.webp",
    "rect": [
     294,
     379,
     228,
     106
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 18,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.52,
     0.19
    ],
    "eyeR": [
     0.02,
     -0.0
    ],
    "mouth": [
     0.45,
     0.1
    ]
   },
   "w": 1.0
  },
  "frames/clap_s1_loop/11.webp": {
   "m": [
    1.00101,
    -0.00396,
    -5.06,
    -0.19
   ],
   "scale": 1.001,
   "rot_deg": -0.23,
   "shift": [
    -2.8,
    -1.3
   ],
   "inliers": 103,
   "residual_px": 0.68,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/clap_s1_loop_11.webp",
    "rect": [
     166,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_11.webp",
    "rect": [
     166,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_11_u.webp",
    "rect": [
     294,
     379,
     228,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 317,
   "cover_alien_px": 7,
   "occluded": 0.009,
   "feat": {
    "eyeL": [
     0.58,
     0.19
    ],
    "eyeR": [
     0.11,
     -0.09
    ],
    "mouth": [
     0.45,
     0.1
    ]
   },
   "w": 1.0
  },
  "frames/clap_s1_loop/12.webp": {
   "m": [
    1.00212,
    -0.01252,
    -10.48,
    3.4
   ],
   "scale": 1.0022,
   "rot_deg": -0.72,
   "shift": [
    -3.8,
    -0.7
   ],
   "inliers": 101,
   "residual_px": 0.79,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/clap_s1_loop_12.webp",
    "rect": [
     165,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_12.webp",
    "rect": [
     165,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_12_u.webp",
    "rect": [
     292,
     379,
     228,
     106
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 1611,
   "cover_alien_px": 3,
   "occluded": 0.016,
   "feat": {
    "eyeL": [
     0.91,
     0.02
    ],
    "eyeR": [
     0.12,
     -0.16
    ],
    "mouth": [
     0.45,
     0.01
    ]
   },
   "w": 1.0
  },
  "frames/clap_s1_loop/13.webp": {
   "m": [
    1.00566,
    -0.01853,
    -15.4,
    5.42
   ],
   "scale": 1.0058,
   "rot_deg": -1.06,
   "shift": [
    -4.5,
    0.5
   ],
   "inliers": 114,
   "residual_px": 0.83,
   "ref_residual_px": {
    "eyeL": 2.2,
    "eyeR": 1.0,
    "mouth": 1.4,
    "nose": 1.4,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/clap_s1_loop_13.webp",
    "rect": [
     165,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_13.webp",
    "rect": [
     165,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_13_u.webp",
    "rect": [
     291,
     380,
     229,
     107
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 1581,
   "cover_alien_px": 57,
   "occluded": 0.013,
   "feat": {
    "eyeL": [
     0.58,
     -0.17
    ],
    "eyeR": [
     0.11,
     -0.16
    ],
    "mouth": [
     0.18,
     -0.11
    ]
   },
   "w": 1.0
  },
  "frames/clap_s1_loop/14.webp": {
   "m": [
    1.00303,
    -0.01385,
    -10.04,
    6.06
   ],
   "scale": 1.0031,
   "rot_deg": -0.79,
   "shift": [
    -2.4,
    1.8
   ],
   "inliers": 107,
   "residual_px": 0.78,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/clap_s1_loop_14.webp",
    "rect": [
     167,
     224,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_14.webp",
    "rect": [
     167,
     224,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_14_u.webp",
    "rect": [
     294,
     381,
     228,
     107
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 464,
   "cover_alien_px": 3,
   "occluded": 0.016,
   "feat": {
    "eyeL": [
     0.02,
     -0.27
    ],
    "eyeR": [
     -0.17,
     -0.16
    ],
    "mouth": [
     -0.09,
     -0.23
    ]
   },
   "w": 1.0
  },
  "frames/clap_s1_loop/15.webp": {
   "m": [
    1.00184,
    0.00362,
    1.31,
    2.25
   ],
   "scale": 1.0018,
   "rot_deg": 0.21,
   "shift": [
    0.4,
    4.6
   ],
   "inliers": 106,
   "residual_px": 0.68,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/clap_s1_loop_15.webp",
    "rect": [
     169,
     227,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_15.webp",
    "rect": [
     169,
     227,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_15_u.webp",
    "rect": [
     297,
     386,
     229,
     103
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 379,
   "cover_alien_px": 2,
   "occluded": 0.012,
   "feat": {
    "eyeL": [
     -0.22,
     -0.17
    ],
    "eyeR": [
     -0.37,
     0.15
    ],
    "mouth": [
     -0.09,
     -0.23
    ]
   },
   "w": 1.0
  },
  "frames/clap_s1_loop/16.webp": {
   "m": [
    0.99876,
    0.01346,
    8.14,
    0.32
   ],
   "scale": 0.9988,
   "rot_deg": 0.77,
   "shift": [
    1.4,
    5.2
   ],
   "inliers": 97,
   "residual_px": 0.94,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/clap_s1_loop_16.webp",
    "rect": [
     170,
     227,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_16.webp",
    "rect": [
     170,
     227,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_16_u.webp",
    "rect": [
     300,
     386,
     226,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 386,
   "cover_alien_px": 12,
   "occluded": 0.012,
   "feat": {
    "eyeL": [
     -0.27,
     -0.17
    ],
    "eyeR": [
     -0.66,
     0.18
    ],
    "mouth": [
     -0.34,
     0.73
    ]
   },
   "w": 1.0
  },
  "frames/clap_s1_loop/17.webp": {
   "m": [
    0.99659,
    0.00795,
    7.11,
    1.56
   ],
   "scale": 0.9966,
   "rot_deg": 0.46,
   "shift": [
    2.0,
    3.2
   ],
   "inliers": 85,
   "residual_px": 0.94,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 1.4,
    "nose": 1.4,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/clap_s1_loop_17.webp",
    "rect": [
     171,
     225,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_17.webp",
    "rect": [
     171,
     225,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_17_u.webp",
    "rect": [
     300,
     385,
     224,
     103
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 334,
   "cover_alien_px": 49,
   "occluded": 0.01,
   "feat": {
    "eyeL": [
     -0.74,
     0.38
    ],
    "eyeR": [
     -0.37,
     0.41
    ],
    "mouth": [
     -0.81,
     0.73
    ]
   },
   "w": 1.0
  },
  "frames/clap_s1_loop/18.webp": {
   "m": [
    0.99572,
    0.01896,
    12.68,
    -3.81
   ],
   "scale": 0.9959,
   "rot_deg": 1.09,
   "shift": [
    2.1,
    1.9
   ],
   "inliers": 96,
   "residual_px": 0.73,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 0.0,
    "mouth": 1.4,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/clap_s1_loop_18.webp",
    "rect": [
     171,
     224,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_18.webp",
    "rect": [
     171,
     224,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_18_u.webp",
    "rect": [
     300,
     383,
     226,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 554,
   "cover_alien_px": 3,
   "occluded": 0.014,
   "feat": {
    "eyeL": [
     -0.74,
     0.15
    ],
    "eyeR": [
     -0.21,
     0.41
    ],
    "mouth": [
     -0.89,
     0.7
    ]
   },
   "w": 1.0
  },
  "frames/clap_s1_loop/19.webp": {
   "m": [
    0.99349,
    0.02923,
    19.83,
    -7.52
   ],
   "scale": 0.9939,
   "rot_deg": 1.69,
   "shift": [
    3.6,
    1.4
   ],
   "inliers": 91,
   "residual_px": 0.65,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 4.0,
    "nose": 1.0,
    "pin": 1.4
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/clap_s1_loop_19.webp",
    "rect": [
     173,
     223,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_19.webp",
    "rect": [
     173,
     223,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_19_u.webp",
    "rect": [
     302,
     382,
     228,
     106
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 1309,
   "cover_alien_px": 4,
   "occluded": 0.018,
   "feat": {
    "eyeL": [
     -0.74,
     0.15
    ],
    "eyeR": [
     0.02,
     0.33
    ],
    "mouth": [
     -0.97,
     0.68
    ]
   },
   "w": 1.0
  },
  "frames/clap_s1_loop/20.webp": {
   "m": [
    0.99675,
    0.02543,
    16.51,
    -7.09
   ],
   "scale": 0.9971,
   "rot_deg": 1.46,
   "shift": [
    3.4,
    1.8
   ],
   "inliers": 86,
   "residual_px": 0.85,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/clap_s1_loop_20.webp",
    "rect": [
     172,
     224,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_20.webp",
    "rect": [
     172,
     224,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_20_u.webp",
    "rect": [
     302,
     382,
     229,
     106
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 1596,
   "cover_alien_px": 15,
   "occluded": 0.015,
   "feat": {
    "eyeL": [
     -0.76,
     -0.09
    ],
    "eyeR": [
     0.02,
     0.33
    ],
    "mouth": [
     -1.05,
     0.66
    ]
   },
   "w": 1.0
  },
  "frames/clap_s1_loop/21.webp": {
   "m": [
    0.99716,
    0.0009,
    2.33,
    3.03
   ],
   "scale": 0.9972,
   "rot_deg": 0.05,
   "shift": [
    0.7,
    2.1
   ],
   "inliers": 80,
   "residual_px": 0.83,
   "ref_residual_px": {
    "eyeL": 2.0,
    "eyeR": 1.4,
    "mouth": 2.0,
    "nose": 2.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/clap_s1_loop_21.webp",
    "rect": [
     170,
     224,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_21.webp",
    "rect": [
     170,
     224,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_21_u.webp",
    "rect": [
     298,
     383,
     230,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 573,
   "cover_alien_px": 8,
   "occluded": 0.023,
   "feat": {
    "eyeL": [
     -0.68,
     -0.09
    ],
    "eyeR": [
     -0.58,
     0.48
    ],
    "mouth": [
     -1.13,
     0.63
    ]
   },
   "w": 1.0
  },
  "frames/clap_s1_loop/22.webp": {
   "m": [
    1.00109,
    -0.01287,
    -8.72,
    7.09
   ],
   "scale": 1.0012,
   "rot_deg": -0.74,
   "shift": [
    -2.3,
    2.3
   ],
   "inliers": 93,
   "residual_px": 1.07,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.4,
    "mouth": 1.4,
    "nose": 1.4,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/clap_s1_loop_22.webp",
    "rect": [
     167,
     224,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_22.webp",
    "rect": [
     167,
     224,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_22_u.webp",
    "rect": [
     294,
     382,
     230,
     106
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 532,
   "cover_alien_px": 13,
   "occluded": 0.018,
   "feat": {
    "eyeL": [
     -0.64,
     -0.09
    ],
    "eyeR": [
     -0.58,
     0.48
    ],
    "mouth": [
     -1.13,
     0.61
    ]
   },
   "w": 1.0
  },
  "frames/clap_s1_loop/23.webp": {
   "m": [
    1.00647,
    -0.04089,
    -28.72,
    18.2
   ],
   "scale": 1.0073,
   "rot_deg": -2.33,
   "shift": [
    -7.0,
    4.5
   ],
   "inliers": 103,
   "residual_px": 0.87,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/clap_s1_loop_23.webp",
    "rect": [
     162,
     227,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_23.webp",
    "rect": [
     162,
     227,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_23_u.webp",
    "rect": [
     287,
     382,
     231,
     110
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 546,
   "cover_alien_px": 14,
   "occluded": 0.019,
   "feat": {
    "eyeL": [
     0.38,
     0.12
    ],
    "eyeR": [
     -0.58,
     0.25
    ],
    "mouth": [
     -0.54,
     -0.82
    ]
   },
   "w": 1.0
  },
  "frames/clap_s1_loop/24.webp": {
   "m": [
    1.0069,
    -0.03896,
    -27.72,
    16.71
   ],
   "scale": 1.0077,
   "rot_deg": -2.22,
   "shift": [
    -6.8,
    4.0
   ],
   "inliers": 90,
   "residual_px": 0.89,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 1.4
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/clap_s1_loop_24.webp",
    "rect": [
     162,
     226,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_24.webp",
    "rect": [
     162,
     226,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_24_u.webp",
    "rect": [
     288,
     381,
     230,
     111
    ]
   },
   "yield_eye_px": 1,
   "yield_px": 556,
   "cover_alien_px": 10,
   "occluded": 0.021,
   "feat": {
    "eyeL": [
     0.38,
     0.03
    ],
    "eyeR": [
     -0.16,
     0.1
    ],
    "mouth": [
     -0.38,
     -0.82
    ]
   },
   "w": 1.0
  },
  "frames/clap_s1_loop/25.webp": {
   "m": [
    0.99932,
    -0.01624,
    -10.53,
    10.49
   ],
   "scale": 0.9995,
   "rot_deg": -0.93,
   "shift": [
    -3.2,
    3.5
   ],
   "inliers": 64,
   "residual_px": 0.67,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/clap_s1_loop_25.webp",
    "rect": [
     166,
     226,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_25.webp",
    "rect": [
     166,
     226,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_25_u.webp",
    "rect": [
     293,
     383,
     225,
     107
    ]
   },
   "yield_eye_px": 16,
   "yield_px": 821,
   "cover_alien_px": 12,
   "occluded": 0.024,
   "feat": {
    "eyeL": [
     -0.04,
     0.12
    ],
    "eyeR": [
     -0.43,
     0.15
    ],
    "mouth": [
     -0.05,
     -0.21
    ]
   },
   "w": 1.0
  },
  "frames/clap_s1_loop/26.webp": {
   "m": [
    1.00128,
    0.00119,
    -0.59,
    2.42
   ],
   "scale": 1.0013,
   "rot_deg": 0.07,
   "shift": [
    -0.6,
    3.5
   ],
   "inliers": 78,
   "residual_px": 0.75,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/clap_s1_loop_26.webp",
    "rect": [
     168,
     225,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_26.webp",
    "rect": [
     168,
     225,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_26_u.webp",
    "rect": [
     296,
     384,
     226,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 603,
   "cover_alien_px": 15,
   "occluded": 0.016,
   "feat": {
    "eyeL": [
     -0.22,
     0.44
    ],
    "eyeR": [
     -0.43,
     0.15
    ],
    "mouth": [
     -0.05,
     0.41
    ]
   },
   "w": 1.0
  },
  "frames/clap_s1_loop/27.webp": {
   "m": [
    0.99164,
    0.01211,
    11.39,
    1.68
   ],
   "scale": 0.9917,
   "rot_deg": 0.7,
   "shift": [
    2.3,
    2.7
   ],
   "inliers": 91,
   "residual_px": 0.93,
   "ref_residual_px": {
    "eyeL": 2.2,
    "eyeR": 1.0,
    "mouth": 2.2,
    "nose": 2.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/clap_s1_loop_27.webp",
    "rect": [
     171,
     225,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_27.webp",
    "rect": [
     171,
     225,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_27_u.webp",
    "rect": [
     301,
     384,
     225,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 479,
   "cover_alien_px": 2,
   "occluded": 0.014,
   "feat": {
    "eyeL": [
     -0.65,
     0.79
    ],
    "eyeR": [
     -0.43,
     0.71
    ],
    "mouth": [
     -0.43,
     0.92
    ]
   },
   "w": 1.0
  },
  "frames/clap_s1_loop/28.webp": {
   "m": [
    0.99601,
    0.0119,
    8.73,
    -0.13
   ],
   "scale": 0.9961,
   "rot_deg": 0.68,
   "shift": [
    1.6,
    2.9
   ],
   "inliers": 70,
   "residual_px": 0.74,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.4,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/clap_s1_loop_28.webp",
    "rect": [
     171,
     225,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_28.webp",
    "rect": [
     171,
     225,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_28_u.webp",
    "rect": [
     300,
     384,
     228,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 549,
   "cover_alien_px": 11,
   "occluded": 0.016,
   "feat": {
    "eyeL": [
     -0.97,
     0.79
    ],
    "eyeR": [
     -0.29,
     0.71
    ],
    "mouth": [
     -0.59,
     0.92
    ]
   },
   "w": 1.0
  },
  "frames/clap_s1_loop/29.webp": {
   "m": [
    0.99682,
    -0.00031,
    1.21,
    4.32
   ],
   "scale": 0.9968,
   "rot_deg": -0.02,
   "shift": [
    0.1,
    2.7
   ],
   "inliers": 109,
   "residual_px": 0.9,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 1.0,
    "mouth": 1.4,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/clap_s1_loop_29.webp",
    "rect": [
     169,
     225,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_29.webp",
    "rect": [
     169,
     225,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_29_u.webp",
    "rect": [
     298,
     384,
     228,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 525,
   "cover_alien_px": 9,
   "occluded": 0.019,
   "feat": {
    "eyeL": [
     -0.65,
     0.47
    ],
    "eyeR": [
     -0.29,
     0.6
    ],
    "mouth": [
     -0.74,
     0.65
    ]
   },
   "w": 1.0
  },
  "frames/clap_s1_loop/30.webp": {
   "m": [
    1.00158,
    -0.01074,
    -7.28,
    6.8
   ],
   "scale": 1.0016,
   "rot_deg": -0.61,
   "shift": [
    -1.6,
    3.2
   ],
   "inliers": 106,
   "residual_px": 0.78,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/clap_s1_loop_30.webp",
    "rect": [
     167,
     225,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_30.webp",
    "rect": [
     167,
     225,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_30_u.webp",
    "rect": [
     296,
     383,
     228,
     106
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 437,
   "cover_alien_px": 7,
   "occluded": 0.015,
   "feat": {
    "eyeL": [
     -0.39,
     -0.09
    ],
    "eyeR": [
     -0.29,
     0.12
    ],
    "mouth": [
     -0.74,
     0.06
    ]
   },
   "w": 1.0
  },
  "frames/clap_s1_loop/31.webp": {
   "m": [
    1.00459,
    -0.02858,
    -20.74,
    12.41
   ],
   "scale": 1.005,
   "rot_deg": -1.63,
   "shift": [
    -5.6,
    2.9
   ],
   "inliers": 107,
   "residual_px": 0.81,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/clap_s1_loop_31.webp",
    "rect": [
     163,
     225,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_31.webp",
    "rect": [
     163,
     225,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_31_u.webp",
    "rect": [
     290,
     381,
     230,
     109
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 1070,
   "cover_alien_px": 26,
   "occluded": 0.036,
   "feat": {
    "eyeL": [
     0.58,
     -0.09
    ],
    "eyeR": [
     -0.16,
     0.08
    ],
    "mouth": [
     -0.51,
     -0.1
    ]
   },
   "w": 1.0
  },
  "frames/clap_s1_loop/32.webp": {
   "m": [
    1.00473,
    -0.03637,
    -26.84,
    16.05
   ],
   "scale": 1.0054,
   "rot_deg": -2.07,
   "shift": [
    -8.0,
    3.4
   ],
   "inliers": 89,
   "residual_px": 0.71,
   "ref_residual_px": {
    "eyeL": 2.0,
    "eyeR": 1.0,
    "mouth": 5.4,
    "nose": 1.4,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/clap_s1_loop_32.webp",
    "rect": [
     161,
     225,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_32.webp",
    "rect": [
     161,
     225,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_32_u.webp",
    "rect": [
     287,
     381,
     229,
     110
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 1382,
   "cover_alien_px": 6,
   "occluded": 0.04,
   "feat": {
    "eyeL": [
     0.58,
     -0.07
    ],
    "eyeR": [
     -0.02,
     -0.11
    ],
    "mouth": [
     -0.14,
     -0.26
    ]
   },
   "w": 1.0
  },
  "frames/clap_s1_loop/33.webp": {
   "m": [
    0.99938,
    -0.04029,
    -25.73,
    20.73
   ],
   "scale": 1.0002,
   "rot_deg": -2.31,
   "shift": [
    -7.2,
    4.0
   ],
   "inliers": 81,
   "residual_px": 0.8,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/clap_s1_loop_33.webp",
    "rect": [
     162,
     226,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_33.webp",
    "rect": [
     162,
     226,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_33_u.webp",
    "rect": [
     288,
     382,
     228,
     110
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 559,
   "cover_alien_px": 2,
   "occluded": 0.021,
   "feat": {
    "eyeL": [
     0.11,
     -0.07
    ],
    "eyeR": [
     -0.02,
     -0.17
    ],
    "mouth": [
     0.23,
     -0.42
    ]
   },
   "w": 1.0
  },
  "frames/clap_s1_loop/34.webp": {
   "m": [
    1.0025,
    -0.03749,
    -24.03,
    23.2
   ],
   "scale": 1.0032,
   "rot_deg": -2.14,
   "shift": [
    -5.6,
    9.0
   ],
   "inliers": 63,
   "residual_px": 0.82,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.4,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/clap_s1_loop_34.webp",
    "rect": [
     163,
     231,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_34.webp",
    "rect": [
     163,
     231,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_34_u.webp",
    "rect": [
     289,
     387,
     229,
     110
    ]
   },
   "yield_eye_px": 239,
   "yield_px": 685,
   "cover_alien_px": 0,
   "occluded": 0.018,
   "feat": {
    "eyeL": [
     -0.02,
     -0.18
    ],
    "eyeR": [
     -0.42,
     -0.17
    ],
    "mouth": [
     0.23,
     -0.65
    ]
   },
   "w": 1.0
  },
  "frames/clap_s1_loop/35.webp": {
   "m": [
    1.00547,
    -0.03705,
    -24.3,
    22.77
   ],
   "scale": 1.0062,
   "rot_deg": -2.11,
   "shift": [
    -4.8,
    10.2
   ],
   "inliers": 65,
   "residual_px": 0.99,
   "ref_residual_px": {
    "eyeL": 2.0,
    "eyeR": 1.4,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/clap_s1_loop_35.webp",
    "rect": [
     164,
     232,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_35.webp",
    "rect": [
     164,
     232,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_35_u.webp",
    "rect": [
     290,
     388,
     228,
     110
    ]
   },
   "yield_eye_px": 279,
   "yield_px": 753,
   "cover_alien_px": 0,
   "occluded": 0.019,
   "feat": {
    "eyeL": [
     -0.03,
     -0.45
    ],
    "eyeR": [
     -0.74,
     -0.17
    ],
    "mouth": [
     0.03,
     -0.75
    ]
   },
   "w": 1.0
  },
  "frames/clap_s1_loop/36.webp": {
   "m": [
    1.00321,
    -0.03853,
    -23.22,
    21.35
   ],
   "scale": 1.0039,
   "rot_deg": -2.2,
   "shift": [
    -4.0,
    7.1
   ],
   "inliers": 95,
   "residual_px": 0.83,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.4,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/clap_s1_loop_36.webp",
    "rect": [
     165,
     229,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_36.webp",
    "rect": [
     165,
     229,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_36_u.webp",
    "rect": [
     291,
     385,
     229,
     110
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 16,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.48,
     -0.45
    ],
    "eyeR": [
     -0.74,
     -0.15
    ],
    "mouth": [
     -0.52,
     -0.75
    ]
   },
   "w": 1.0
  },
  "frames/clap_s1_loop/37.webp": {
   "m": [
    1.00009,
    -0.03765,
    -21.46,
    19.02
   ],
   "scale": 1.0008,
   "rot_deg": -2.16,
   "shift": [
    -3.9,
    3.7
   ],
   "inliers": 113,
   "residual_px": 0.91,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 1.0,
    "mouth": 0.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/clap_s1_loop_37.webp",
    "rect": [
     165,
     226,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_37.webp",
    "rect": [
     165,
     226,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_37_u.webp",
    "rect": [
     291,
     382,
     229,
     109
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.56,
     -0.16
    ],
    "eyeR": [
     -0.49,
     0.19
    ],
    "mouth": [
     -0.69,
     0.08
    ]
   },
   "w": 1.0
  },
  "frames/clap_s1_loop/38.webp": {
   "m": [
    0.99775,
    -0.03794,
    -20.0,
    15.25
   ],
   "scale": 0.9985,
   "rot_deg": -2.18,
   "shift": [
    -3.3,
    -1.3
   ],
   "inliers": 95,
   "residual_px": 0.91,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.4,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/clap_s1_loop_38.webp",
    "rect": [
     166,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_38.webp",
    "rect": [
     166,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_38_u.webp",
    "rect": [
     292,
     377,
     228,
     109
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.56,
     0.0
    ],
    "eyeR": [
     -0.45,
     0.21
    ],
    "mouth": [
     -0.52,
     0.17
    ]
   },
   "w": 1.0
  },
  "frames/clap_s1_loop/39.webp": {
   "m": [
    0.99903,
    -0.03475,
    -19.13,
    12.6
   ],
   "scale": 0.9996,
   "rot_deg": -1.99,
   "shift": [
    -3.4,
    -2.0
   ],
   "inliers": 112,
   "residual_px": 0.93,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 0.0,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/clap_s1_loop_39.webp",
    "rect": [
     166,
     220,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_39.webp",
    "rect": [
     166,
     220,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_39_u.webp",
    "rect": [
     292,
     376,
     228,
     109
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 11,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.3,
     0.0
    ],
    "eyeR": [
     -0.14,
     0.21
    ],
    "mouth": [
     -0.48,
     0.18
    ]
   },
   "w": 1.0
  },
  "frames/clap_s1_loop/40.webp": {
   "m": [
    0.99897,
    -0.02417,
    -12.98,
    9.18
   ],
   "scale": 0.9993,
   "rot_deg": -1.39,
   "shift": [
    -2.2,
    -1.2
   ],
   "inliers": 135,
   "residual_px": 0.76,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/clap_s1_loop_40.webp",
    "rect": [
     167,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_40.webp",
    "rect": [
     167,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_40_u.webp",
    "rect": [
     294,
     378,
     228,
     107
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.25,
     0.0
    ],
    "eyeR": [
     -0.13,
     0.1
    ],
    "mouth": [
     -0.41,
     0.17
    ]
   },
   "w": 1.0
  },
  "frames/clap_s1_loop/41.webp": {
   "m": [
    0.99994,
    -0.0144,
    -8.44,
    5.55
   ],
   "scale": 1.0,
   "rot_deg": -0.83,
   "shift": [
    -1.8,
    -0.4
   ],
   "inliers": 154,
   "residual_px": 0.64,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/clap_s1_loop_41.webp",
    "rect": [
     167,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_41.webp",
    "rect": [
     167,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_41_u.webp",
    "rect": [
     295,
     379,
     227,
     107
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.12,
     0.11
    ],
    "eyeR": [
     -0.03,
     0.04
    ],
    "mouth": [
     0.02,
     0.15
    ]
   },
   "w": 1.0
  },
  "frames/clap_s1_loop/42.webp": {
   "m": [
    1.00099,
    -0.00317,
    -3.04,
    1.08
   ],
   "scale": 1.001,
   "rot_deg": -0.18,
   "shift": [
    -1.2,
    0.2
   ],
   "inliers": 173,
   "residual_px": 0.56,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/clap_s1_loop_42.webp",
    "rect": [
     168,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_42.webp",
    "rect": [
     168,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_42_u.webp",
    "rect": [
     296,
     381,
     226,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.26,
     0.11
    ],
    "eyeR": [
     0.12,
     0.04
    ],
    "mouth": [
     0.29,
     0.13
    ]
   },
   "w": 1.0
  },
  "frames/clap_s1_loop/43.webp": {
   "m": [
    1.00049,
    -0.0027,
    -2.13,
    1.14
   ],
   "scale": 1.0005,
   "rot_deg": -0.15,
   "shift": [
    -0.7,
    0.3
   ],
   "inliers": 181,
   "residual_px": 0.52,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/clap_s1_loop_43.webp",
    "rect": [
     168,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_43.webp",
    "rect": [
     168,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_43_u.webp",
    "rect": [
     296,
     381,
     226,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.26,
     0.09
    ],
    "eyeR": [
     0.12,
     0.02
    ],
    "mouth": [
     0.29,
     0.09
    ]
   },
   "w": 1.0
  },
  "frames/clap_s1_loop/44.webp": {
   "m": [
    1.00012,
    0.00021,
    -0.22,
    0.02
   ],
   "scale": 1.0001,
   "rot_deg": 0.01,
   "shift": [
    -0.3,
    0.2
   ],
   "inliers": 183,
   "residual_px": 0.56,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/clap_s1_loop_44.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_44.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_44_u.webp",
    "rect": [
     297,
     381,
     226,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.04,
     0.07
    ],
    "eyeR": [
     0.03,
     -0.0
    ],
    "mouth": [
     0.21,
     0.09
    ]
   },
   "w": 1.0
  },
  "frames/clap_s1_loop/45.webp": {
   "m": [
    0.99975,
    -0.00025,
    -0.13,
    0.3
   ],
   "scale": 0.9997,
   "rot_deg": -0.01,
   "shift": [
    -0.1,
    0.1
   ],
   "inliers": 187,
   "residual_px": 0.44,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/clap_s1_loop_45.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_45.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_45_u.webp",
    "rect": [
     297,
     381,
     226,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.02,
     0.06
    ],
    "eyeR": [
     -0.01,
     -0.0
    ],
    "mouth": [
     0.04,
     0.07
    ]
   },
   "w": 1.0
  },
  "frames/clap_s1_loop/46.webp": {
   "m": [
    1.00018,
    -0.00033,
    -0.32,
    0.14
   ],
   "scale": 1.0002,
   "rot_deg": -0.02,
   "shift": [
    -0.1,
    0.1
   ],
   "inliers": 185,
   "residual_px": 0.46,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/clap_s1_loop_46.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_46.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_46_u.webp",
    "rect": [
     297,
     381,
     226,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.02,
     0.04
    ],
    "eyeR": [
     -0.01,
     -0.0
    ],
    "mouth": [
     0.02,
     0.07
    ]
   },
   "w": 1.0
  },
  "frames/clap_s1_loop/47.webp": {
   "m": [
    1.00022,
    -0.0003,
    -0.27,
    0.09
   ],
   "scale": 1.0002,
   "rot_deg": -0.02,
   "shift": [
    -0.0,
    0.1
   ],
   "inliers": 185,
   "residual_px": 0.42,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/clap_s1_loop_47.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_47.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_47_u.webp",
    "rect": [
     297,
     381,
     226,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.01,
     0.01
    ],
    "eyeR": [
     -0.01,
     -0.0
    ],
    "mouth": [
     0.0,
     0.06
    ]
   },
   "w": 1.0
  },
  "frames/clap_s1_loop/48.webp": {
   "m": [
    1.00001,
    1e-05,
    0.0,
    -0.02
   ],
   "scale": 1.0,
   "rot_deg": 0.0,
   "shift": [
    -0.0,
    -0.0
   ],
   "inliers": 331,
   "residual_px": 0.0,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/clap_s1_loop_48.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_48.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_48_u.webp",
    "rect": [
     297,
     381,
     226,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.01,
     0.0
    ],
    "eyeR": [
     0.0,
     -0.0
    ],
    "mouth": [
     0.0,
     -0.0
    ]
   },
   "w": 1.0
  },
  "frames/stepbeat_s1_loop/00.webp": {
   "m": [
    1.00001,
    1e-05,
    0.0,
    -0.02
   ],
   "scale": 1.0,
   "rot_deg": 0.0,
   "shift": [
    -0.0,
    -0.0
   ],
   "inliers": 331,
   "residual_px": 0.0,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/stepbeat_s1_loop_00.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_00.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_00_u.webp",
    "rect": [
     297,
     381,
     226,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.01,
     0.0
    ],
    "eyeR": [
     0.0,
     -0.0
    ],
    "mouth": [
     0.0,
     -0.0
    ]
   },
   "w": 1.0
  },
  "frames/stepbeat_s1_loop/01.webp": {
   "m": [
    1.00018,
    -0.00028,
    -0.1,
    0.08
   ],
   "scale": 1.0002,
   "rot_deg": -0.02,
   "shift": [
    0.1,
    0.0
   ],
   "inliers": 207,
   "residual_px": 0.42,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/stepbeat_s1_loop_01.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_01.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_01_u.webp",
    "rect": [
     297,
     381,
     225,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.01,
     -0.01
    ],
    "eyeR": [
     0.04,
     0.04
    ],
    "mouth": [
     0.11,
     0.05
    ]
   },
   "w": 1.0
  },
  "frames/stepbeat_s1_loop/02.webp": {
   "m": [
    0.99955,
    -0.00011,
    0.39,
    0.13
   ],
   "scale": 0.9995,
   "rot_deg": -0.01,
   "shift": [
    0.3,
    -0.1
   ],
   "inliers": 196,
   "residual_px": 0.45,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/stepbeat_s1_loop_02.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_02.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_02_u.webp",
    "rect": [
     297,
     381,
     225,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 11,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.01,
     -0.01
    ],
    "eyeR": [
     0.04,
     0.06
    ],
    "mouth": [
     0.11,
     0.09
    ]
   },
   "w": 1.0
  },
  "frames/stepbeat_s1_loop/03.webp": {
   "m": [
    0.99949,
    0.00014,
    0.43,
    0.3
   ],
   "scale": 0.9995,
   "rot_deg": 0.01,
   "shift": [
    0.2,
    0.1
   ],
   "inliers": 178,
   "residual_px": 0.51,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/stepbeat_s1_loop_03.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_03.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_03_u.webp",
    "rect": [
     297,
     381,
     225,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.1,
     -0.01
    ],
    "eyeR": [
     -0.02,
     0.08
    ],
    "mouth": [
     0.0,
     0.12
    ]
   },
   "w": 1.0
  },
  "frames/stepbeat_s1_loop/04.webp": {
   "m": [
    0.99635,
    -0.00728,
    -3.79,
    9.33
   ],
   "scale": 0.9964,
   "rot_deg": -0.42,
   "shift": [
    -1.9,
    4.7
   ],
   "inliers": 117,
   "residual_px": 0.97,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/stepbeat_s1_loop_04.webp",
    "rect": [
     167,
     227,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_04.webp",
    "rect": [
     167,
     227,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_04_u.webp",
    "rect": [
     295,
     385,
     225,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 13,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.28,
     0.06
    ],
    "eyeR": [
     -0.02,
     0.13
    ],
    "mouth": [
     -0.19,
     0.23
    ]
   },
   "w": 1.0
  },
  "frames/stepbeat_s1_loop/05.webp": {
   "m": [
    0.99831,
    -0.00883,
    -8.47,
    13.23
   ],
   "scale": 0.9983,
   "rot_deg": -0.51,
   "shift": [
    -5.1,
    8.8
   ],
   "inliers": 89,
   "residual_px": 0.81,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/stepbeat_s1_loop_05.webp",
    "rect": [
     164,
     231,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_05.webp",
    "rect": [
     164,
     231,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_05_u.webp",
    "rect": [
     292,
     389,
     226,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 5,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.64,
     -0.02
    ],
    "eyeR": [
     -0.26,
     0.13
    ],
    "mouth": [
     -0.66,
     0.23
    ]
   },
   "w": 1.0
  },
  "frames/stepbeat_s1_loop/06.webp": {
   "m": [
    0.99796,
    -0.02035,
    -18.17,
    26.76
   ],
   "scale": 0.9982,
   "rot_deg": -1.17,
   "shift": [
    -9.5,
    17.5
   ],
   "inliers": 88,
   "residual_px": 0.82,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/stepbeat_s1_loop_06.webp",
    "rect": [
     159,
     239,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_06.webp",
    "rect": [
     159,
     239,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_06_u.webp",
    "rect": [
     287,
     397,
     225,
     107
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 2,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.63,
     -0.07
    ],
    "eyeR": [
     -0.08,
     0.07
    ],
    "mouth": [
     -0.37,
     0.18
    ]
   },
   "w": 1.0
  },
  "frames/stepbeat_s1_loop/07.webp": {
   "m": [
    0.99709,
    -0.02332,
    -20.89,
    31.6
   ],
   "scale": 0.9974,
   "rot_deg": -1.34,
   "shift": [
    -11.2,
    20.7
   ],
   "inliers": 121,
   "residual_px": 0.77,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/stepbeat_s1_loop_07.webp",
    "rect": [
     158,
     243,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_07.webp",
    "rect": [
     158,
     243,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_07_u.webp",
    "rect": [
     285,
     400,
     225,
     107
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.63,
     -0.27
    ],
    "eyeR": [
     -0.08,
     0.05
    ],
    "mouth": [
     -0.37,
     0.02
    ]
   },
   "w": 1.0
  },
  "frames/stepbeat_s1_loop/08.webp": {
   "m": [
    1.0018,
    -0.01788,
    -19.9,
    28.67
   ],
   "scale": 1.002,
   "rot_deg": -1.02,
   "shift": [
    -10.8,
    22.2
   ],
   "inliers": 114,
   "residual_px": 0.74,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 1.0,
    "mouth": 1.4,
    "nose": 1.4,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/stepbeat_s1_loop_08.webp",
    "rect": [
     158,
     244,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_08.webp",
    "rect": [
     158,
     244,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_08_u.webp",
    "rect": [
     285,
     402,
     227,
     106
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.46,
     -0.27
    ],
    "eyeR": [
     0.22,
     -0.56
    ],
    "mouth": [
     1.18,
     -0.72
    ]
   },
   "w": 1.0
  },
  "frames/stepbeat_s1_loop/09.webp": {
   "m": [
    1.00217,
    -0.00999,
    -12.21,
    23.79
   ],
   "scale": 1.0022,
   "rot_deg": -0.57,
   "shift": [
    -6.7,
    20.7
   ],
   "inliers": 62,
   "residual_px": 0.84,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 1.4,
    "nose": 1.4,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/stepbeat_s1_loop_09.webp",
    "rect": [
     162,
     243,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_09.webp",
    "rect": [
     162,
     243,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_09_u.webp",
    "rect": [
     290,
     401,
     226,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 16,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.65,
     -0.27
    ],
    "eyeR": [
     0.24,
     -0.61
    ],
    "mouth": [
     1.22,
     -0.85
    ]
   },
   "w": 1.0
  },
  "frames/stepbeat_s1_loop/10.webp": {
   "m": [
    1.01185,
    0.01321,
    4.47,
    0.2
   ],
   "scale": 1.0119,
   "rot_deg": 0.75,
   "shift": [
    3.2,
    11.1
   ],
   "inliers": 63,
   "residual_px": 0.86,
   "ref_residual_px": {
    "eyeL": 4.1,
    "eyeR": 2.2,
    "mouth": 3.6,
    "nose": 3.6,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/stepbeat_s1_loop_10.webp",
    "rect": [
     172,
     233,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_10.webp",
    "rect": [
     172,
     233,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_10_u.webp",
    "rect": [
     300,
     391,
     228,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 774,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     1.15,
     -0.78
    ],
    "eyeR": [
     0.25,
     -0.61
    ],
    "mouth": [
     1.52,
     -1.13
    ]
   },
   "w": 1.0
  },
  "frames/stepbeat_s1_loop/11.webp": {
   "m": [
    1.00542,
    0.01924,
    17.2,
    -3.92
   ],
   "scale": 1.0056,
   "rot_deg": 1.1,
   "shift": [
    10.5,
    6.5
   ],
   "inliers": 66,
   "residual_px": 0.72,
   "ref_residual_px": {
    "eyeL": 2.2,
    "eyeR": 1.0,
    "mouth": 2.2,
    "nose": 1.4,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/stepbeat_s1_loop_11.webp",
    "rect": [
     179,
     228,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_11.webp",
    "rect": [
     179,
     228,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_11_u.webp",
    "rect": [
     308,
     387,
     226,
     105
    ]
   },
   "yield_eye_px": 1,
   "yield_px": 25,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     1.15,
     -0.78
    ],
    "eyeR": [
     0.25,
     -0.56
    ],
    "mouth": [
     1.52,
     -1.13
    ]
   },
   "w": 1.0
  },
  "frames/stepbeat_s1_loop/12.webp": {
   "m": [
    1.00292,
    0.03653,
    34.93,
    -16.68
   ],
   "scale": 1.0036,
   "rot_deg": 2.09,
   "shift": [
    19.1,
    -0.4
   ],
   "inliers": 62,
   "residual_px": 0.93,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 1.0,
    "mouth": 1.4,
    "nose": 1.4,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/stepbeat_s1_loop_12.webp",
    "rect": [
     188,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_12.webp",
    "rect": [
     188,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_12_u.webp",
    "rect": [
     317,
     379,
     227,
     107
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 14,
   "cover_alien_px": 1,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.55,
     -0.36
    ],
    "eyeR": [
     0.25,
     -0.3
    ],
    "mouth": [
     1.06,
     -0.57
    ]
   },
   "w": 1.0
  },
  "frames/stepbeat_s1_loop/13.webp": {
   "m": [
    0.99765,
    0.04677,
    45.19,
    -22.21
   ],
   "scale": 0.9987,
   "rot_deg": 2.68,
   "shift": [
    22.5,
    -4.2
   ],
   "inliers": 81,
   "residual_px": 1.0,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 0.0,
    "mouth": 1.4,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/stepbeat_s1_loop_13.webp",
    "rect": [
     191,
     218,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_13.webp",
    "rect": [
     191,
     218,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_13_u.webp",
    "rect": [
     322,
     375,
     226,
     108
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.22,
     -0.2
    ],
    "eyeR": [
     0.13,
     0.24
    ],
    "mouth": [
     0.86,
     0.16
    ]
   },
   "w": 1.0
  },
  "frames/stepbeat_s1_loop/14.webp": {
   "m": [
    0.99594,
    0.05081,
    52.87,
    -27.48
   ],
   "scale": 0.9972,
   "rot_deg": 2.92,
   "shift": [
    27.6,
    -8.6
   ],
   "inliers": 81,
   "residual_px": 0.91,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 1.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/stepbeat_s1_loop_14.webp",
    "rect": [
     197,
     213,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_14.webp",
    "rect": [
     197,
     213,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_14_u.webp",
    "rect": [
     328,
     370,
     226,
     109
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.26,
     0.82
    ],
    "eyeR": [
     0.24,
     0.33
    ],
    "mouth": [
     -0.02,
     0.8
    ]
   },
   "w": 1.0
  },
  "frames/stepbeat_s1_loop/15.webp": {
   "m": [
    0.99376,
    0.04159,
    41.65,
    -20.43
   ],
   "scale": 0.9946,
   "rot_deg": 2.4,
   "shift": [
    19.8,
    -6.3
   ],
   "inliers": 59,
   "residual_px": 1.01,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 1.0,
    "mouth": 1.4,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/stepbeat_s1_loop_15.webp",
    "rect": [
     189,
     216,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_15.webp",
    "rect": [
     189,
     216,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_15_u.webp",
    "rect": [
     320,
     373,
     226,
     108
    ]
   },
   "yield_eye_px": 46,
   "yield_px": 337,
   "cover_alien_px": 5,
   "occluded": 0.003,
   "feat": {
    "eyeL": [
     -0.56,
     0.63
    ],
    "eyeR": [
     0.09,
     0.24
    ],
    "mouth": [
     -0.12,
     0.59
    ]
   },
   "w": 1.0
  },
  "frames/stepbeat_s1_loop/16.webp": {
   "m": [
    0.99529,
    0.0189,
    22.8,
    -3.96
   ],
   "scale": 0.9955,
   "rot_deg": 1.09,
   "shift": [
    12.1,
    1.6
   ],
   "inliers": 54,
   "residual_px": 0.76,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 1.4,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/stepbeat_s1_loop_16.webp",
    "rect": [
     181,
     224,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_16.webp",
    "rect": [
     181,
     224,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_16_u.webp",
    "rect": [
     310,
     383,
     228,
     104
    ]
   },
   "yield_eye_px": 141,
   "yield_px": 491,
   "cover_alien_px": 0,
   "occluded": 0.008,
   "feat": {
    "eyeL": [
     -0.88,
     1.32
    ],
    "eyeR": [
     -0.19,
     0.67
    ],
    "mouth": [
     -0.51,
     1.25
    ]
   },
   "w": 1.0
  },
  "frames/stepbeat_s1_loop/17.webp": {
   "m": [
    0.99087,
    -0.0107,
    -2.68,
    20.98
   ],
   "scale": 0.9909,
   "rot_deg": -0.62,
   "shift": [
    -1.4,
    12.4
   ],
   "inliers": 59,
   "residual_px": 0.82,
   "ref_residual_px": {
    "eyeL": 2.2,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.4,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/stepbeat_s1_loop_17.webp",
    "rect": [
     168,
     234,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_17.webp",
    "rect": [
     168,
     234,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_17_u.webp",
    "rect": [
     296,
     393,
     227,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 82,
   "cover_alien_px": 31,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -1.65,
     0.63
    ],
    "eyeR": [
     -0.26,
     0.66
    ],
    "mouth": [
     -0.83,
     1.33
    ]
   },
   "w": 1.0
  },
  "frames/stepbeat_s1_loop/18.webp": {
   "m": [
    0.99021,
    -0.02273,
    -11.61,
    26.53
   ],
   "scale": 0.9905,
   "rot_deg": -1.31,
   "shift": [
    -5.0,
    12.7
   ],
   "inliers": 70,
   "residual_px": 0.85,
   "ref_residual_px": {
    "eyeL": 3.0,
    "eyeR": 1.4,
    "mouth": 1.4,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/stepbeat_s1_loop_18.webp",
    "rect": [
     164,
     235,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_18.webp",
    "rect": [
     164,
     235,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_18_u.webp",
    "rect": [
     292,
     393,
     226,
     106
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -1.65,
     0.56
    ],
    "eyeR": [
     -0.19,
     0.66
    ],
    "mouth": [
     -0.83,
     1.33
    ]
   },
   "w": 1.0
  },
  "frames/stepbeat_s1_loop/19.webp": {
   "m": [
    1.00054,
    -0.02364,
    -22.03,
    15.34
   ],
   "scale": 1.0008,
   "rot_deg": -1.35,
   "shift": [
    -10.8,
    5.9
   ],
   "inliers": 91,
   "residual_px": 0.79,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/stepbeat_s1_loop_19.webp",
    "rect": [
     158,
     228,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_19.webp",
    "rect": [
     158,
     228,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_19_u.webp",
    "rect": [
     285,
     385,
     227,
     107
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.34,
     0.32
    ],
    "eyeR": [
     0.32,
     -0.09
    ],
    "mouth": [
     0.82,
     -0.02
    ]
   },
   "w": 1.0
  },
  "frames/stepbeat_s1_loop/20.webp": {
   "m": [
    1.01404,
    -0.02156,
    -27.41,
    6.2
   ],
   "scale": 1.0143,
   "rot_deg": -1.22,
   "shift": [
    -11.6,
    3.9
   ],
   "inliers": 77,
   "residual_px": 0.87,
   "ref_residual_px": {
    "eyeL": 4.5,
    "eyeR": 2.2,
    "mouth": 3.6,
    "nose": 3.6,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/stepbeat_s1_loop_20.webp",
    "rect": [
     157,
     226,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_20.webp",
    "rect": [
     157,
     226,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_20_u.webp",
    "rect": [
     284,
     382,
     228,
     109
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 534,
   "cover_alien_px": 1,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     3.22,
     -0.93
    ],
    "eyeR": [
     1.17,
     -0.86
    ],
    "mouth": [
     2.77,
     -1.9
    ]
   },
   "w": 1.0
  },
  "frames/stepbeat_s1_loop/21.webp": {
   "m": [
    1.01311,
    0.00027,
    -6.14,
    -0.29
   ],
   "scale": 1.0131,
   "rot_deg": 0.02,
   "shift": [
    -0.9,
    5.9
   ],
   "inliers": 57,
   "residual_px": 0.87,
   "ref_residual_px": {
    "eyeL": 4.5,
    "eyeR": 2.2,
    "mouth": 3.6,
    "nose": 3.6,
    "pin": 1.4
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/stepbeat_s1_loop_21.webp",
    "rect": [
     168,
     228,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_21.webp",
    "rect": [
     168,
     228,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_21_u.webp",
    "rect": [
     295,
     386,
     229,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 576,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     3.22,
     -0.93
    ],
    "eyeR": [
     1.17,
     -0.86
    ],
    "mouth": [
     2.77,
     -1.9
    ]
   },
   "w": 1.0
  },
  "frames/stepbeat_s1_loop/22.webp": {
   "m": [
    1.00574,
    0.01695,
    10.8,
    -6.68
   ],
   "scale": 1.0059,
   "rot_deg": 0.97,
   "shift": [
    5.3,
    2.9
   ],
   "inliers": 57,
   "residual_px": 1.17,
   "ref_residual_px": {
    "eyeL": 2.0,
    "eyeR": 1.4,
    "mouth": 3.2,
    "nose": 2.2,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/stepbeat_s1_loop_22.webp",
    "rect": [
     174,
     225,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_22.webp",
    "rect": [
     174,
     225,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_22_u.webp",
    "rect": [
     304,
     383,
     226,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     1.67,
     -0.12
    ],
    "eyeR": [
     1.02,
     -0.39
    ],
    "mouth": [
     2.25,
     -0.42
    ]
   },
   "w": 1.0
  },
  "frames/stepbeat_s1_loop/23.webp": {
   "m": [
    1.00037,
    0.0293,
    27.11,
    -19.04
   ],
   "scale": 1.0008,
   "rot_deg": 1.68,
   "shift": [
    13.6,
    -6.9
   ],
   "inliers": 120,
   "residual_px": 0.93,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/stepbeat_s1_loop_23.webp",
    "rect": [
     183,
     215,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_23.webp",
    "rect": [
     183,
     215,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_23_u.webp",
    "rect": [
     312,
     373,
     226,
     106
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.28,
     0.14
    ],
    "eyeR": [
     0.32,
     -0.0
    ],
    "mouth": [
     0.87,
     -0.14
    ]
   },
   "w": 1.0
  },
  "frames/stepbeat_s1_loop/24.webp": {
   "m": [
    0.99836,
    0.03304,
    31.41,
    -22.3
   ],
   "scale": 0.9989,
   "rot_deg": 1.9,
   "shift": [
    15.4,
    -9.6
   ],
   "inliers": 115,
   "residual_px": 0.75,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/stepbeat_s1_loop_24.webp",
    "rect": [
     184,
     212,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_24.webp",
    "rect": [
     184,
     212,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_24_u.webp",
    "rect": [
     314,
     370,
     226,
     107
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.19,
     0.14
    ],
    "eyeR": [
     0.31,
     0.08
    ],
    "mouth": [
     0.26,
     0.19
    ]
   },
   "w": 1.0
  },
  "frames/stepbeat_s1_loop/25.webp": {
   "m": [
    0.99782,
    0.01996,
    20.2,
    -9.32
   ],
   "scale": 0.998,
   "rot_deg": 1.15,
   "shift": [
    10.0,
    -2.2
   ],
   "inliers": 73,
   "residual_px": 0.91,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/stepbeat_s1_loop_25.webp",
    "rect": [
     179,
     220,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_25.webp",
    "rect": [
     179,
     220,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_25_u.webp",
    "rect": [
     310,
     379,
     226,
     104
    ]
   },
   "yield_eye_px": 5,
   "yield_px": 12,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.39,
     0.24
    ],
    "eyeR": [
     0.17,
     0.1
    ],
    "mouth": [
     -0.06,
     0.34
    ]
   },
   "w": 1.0
  },
  "frames/stepbeat_s1_loop/26.webp": {
   "m": [
    0.99581,
    0.0094,
    10.32,
    3.03
   ],
   "scale": 0.9959,
   "rot_deg": 0.54,
   "shift": [
    4.2,
    4.9
   ],
   "inliers": 54,
   "residual_px": 0.82,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/stepbeat_s1_loop_26.webp",
    "rect": [
     173,
     227,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_26.webp",
    "rect": [
     173,
     227,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_26_u.webp",
    "rect": [
     302,
     387,
     228,
     103
    ]
   },
   "yield_eye_px": 62,
   "yield_px": 150,
   "cover_alien_px": 6,
   "occluded": 0.004,
   "feat": {
    "eyeL": [
     -0.56,
     0.74
    ],
    "eyeR": [
     0.12,
     0.14
    ],
    "mouth": [
     -0.3,
     0.78
    ]
   },
   "w": 1.0
  },
  "frames/stepbeat_s1_loop/27.webp": {
   "m": [
    0.99656,
    -0.01201,
    -10.49,
    17.28
   ],
   "scale": 0.9966,
   "rot_deg": -0.69,
   "shift": [
    -6.3,
    10.8
   ],
   "inliers": 68,
   "residual_px": 0.71,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 0.0,
    "mouth": 1.4,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/stepbeat_s1_loop_27.webp",
    "rect": [
     163,
     233,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_27.webp",
    "rect": [
     163,
     233,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_27_u.webp",
    "rect": [
     292,
     391,
     226,
     106
    ]
   },
   "yield_eye_px": 10,
   "yield_px": 310,
   "cover_alien_px": 7,
   "occluded": 0.001,
   "feat": {
    "eyeL": [
     -0.63,
     0.74
    ],
    "eyeR": [
     -0.07,
     0.25
    ],
    "mouth": [
     -0.31,
     0.81
    ]
   },
   "w": 1.0
  },
  "frames/stepbeat_s1_loop/28.webp": {
   "m": [
    0.99414,
    -0.01795,
    -16.25,
    19.54
   ],
   "scale": 0.9943,
   "rot_deg": -1.03,
   "shift": [
    -10.3,
    9.5
   ],
   "inliers": 64,
   "residual_px": 0.83,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.4,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/stepbeat_s1_loop_28.webp",
    "rect": [
     159,
     231,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_28.webp",
    "rect": [
     159,
     231,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_28_u.webp",
    "rect": [
     287,
     390,
     226,
     106
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 37,
   "cover_alien_px": 11,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.63,
     0.74
    ],
    "eyeR": [
     -0.22,
     0.25
    ],
    "mouth": [
     -0.3,
     0.81
    ]
   },
   "w": 1.0
  },
  "frames/stepbeat_s1_loop/29.webp": {
   "m": [
    0.99937,
    -0.03304,
    -31.9,
    23.07
   ],
   "scale": 0.9999,
   "rot_deg": -1.89,
   "shift": [
    -16.8,
    9.3
   ],
   "inliers": 82,
   "residual_px": 0.82,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/stepbeat_s1_loop_29.webp",
    "rect": [
     152,
     231,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_29.webp",
    "rect": [
     152,
     231,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_29_u.webp",
    "rect": [
     280,
     388,
     226,
     108
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.68,
     0.05
    ],
    "eyeR": [
     -0.22,
     0.09
    ],
    "mouth": [
     -0.22,
     0.04
    ]
   },
   "w": 1.0
  },
  "frames/stepbeat_s1_loop/30.webp": {
   "m": [
    0.99827,
    -0.03539,
    -34.47,
    22.08
   ],
   "scale": 0.9989,
   "rot_deg": -2.03,
   "shift": [
    -18.7,
    6.8
   ],
   "inliers": 90,
   "residual_px": 0.88,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/stepbeat_s1_loop_30.webp",
    "rect": [
     150,
     229,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_30.webp",
    "rect": [
     150,
     229,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_30_u.webp",
    "rect": [
     277,
     385,
     227,
     109
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.54,
     -0.27
    ],
    "eyeR": [
     -0.13,
     -0.05
    ],
    "mouth": [
     -0.16,
     -0.14
    ]
   },
   "w": 1.0
  },
  "frames/stepbeat_s1_loop/31.webp": {
   "m": [
    1.00286,
    -0.03591,
    -37.73,
    8.83
   ],
   "scale": 1.0035,
   "rot_deg": -2.05,
   "shift": [
    -19.9,
    -4.5
   ],
   "inliers": 116,
   "residual_px": 0.71,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 0.0,
    "mouth": 1.4,
    "nose": 1.4,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/stepbeat_s1_loop_31.webp",
    "rect": [
     149,
     217,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_31.webp",
    "rect": [
     149,
     217,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_31_u.webp",
    "rect": [
     276,
     373,
     228,
     110
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 1,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.49,
     -0.27
    ],
    "eyeR": [
     0.18,
     -0.32
    ],
    "mouth": [
     0.79,
     -0.75
    ]
   },
   "w": 1.0
  },
  "frames/stepbeat_s1_loop/32.webp": {
   "m": [
    1.00286,
    -0.03247,
    -33.35,
    -1.08
   ],
   "scale": 1.0034,
   "rot_deg": -1.85,
   "shift": [
    -17.1,
    -13.0
   ],
   "inliers": 98,
   "residual_px": 0.91,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 1.0,
    "mouth": 1.4,
    "nose": 1.4,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/stepbeat_s1_loop_32.webp",
    "rect": [
     152,
     209,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_32.webp",
    "rect": [
     152,
     209,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_32_u.webp",
    "rect": [
     278,
     365,
     228,
     109
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.67,
     -0.27
    ],
    "eyeR": [
     0.24,
     -0.32
    ],
    "mouth": [
     0.84,
     -0.75
    ]
   },
   "w": 1.0
  },
  "frames/stepbeat_s1_loop/33.webp": {
   "m": [
    1.00271,
    -0.02808,
    -29.85,
    -4.86
   ],
   "scale": 1.0031,
   "rot_deg": -1.6,
   "shift": [
    -15.7,
    -15.1
   ],
   "inliers": 112,
   "residual_px": 0.81,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.4,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/stepbeat_s1_loop_33.webp",
    "rect": [
     153,
     207,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_33.webp",
    "rect": [
     153,
     207,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_33_u.webp",
    "rect": [
     280,
     363,
     228,
     109
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.49,
     -0.12
    ],
    "eyeR": [
     0.18,
     -0.27
    ],
    "mouth": [
     0.79,
     -0.31
    ]
   },
   "w": 1.0
  },
  "frames/stepbeat_s1_loop/34.webp": {
   "m": [
    1.00009,
    -0.02497,
    -22.82,
    -9.49
   ],
   "scale": 1.0004,
   "rot_deg": -1.43,
   "shift": [
    -11.2,
    -19.7
   ],
   "inliers": 134,
   "residual_px": 0.83,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/stepbeat_s1_loop_34.webp",
    "rect": [
     158,
     202,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_34.webp",
    "rect": [
     158,
     202,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_34_u.webp",
    "rect": [
     285,
     359,
     227,
     108
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.34,
     0.01
    ],
    "eyeR": [
     -0.19,
     -0.05
    ],
    "mouth": [
     -0.01,
     -0.03
    ]
   },
   "w": 1.0
  },
  "frames/stepbeat_s1_loop/35.webp": {
   "m": [
    0.99914,
    -0.01893,
    -17.38,
    -14.1
   ],
   "scale": 0.9993,
   "rot_deg": -1.09,
   "shift": [
    -8.9,
    -22.2
   ],
   "inliers": 124,
   "residual_px": 0.8,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/stepbeat_s1_loop_35.webp",
    "rect": [
     160,
     200,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_35.webp",
    "rect": [
     160,
     200,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_35_u.webp",
    "rect": [
     287,
     357,
     227,
     107
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.49,
     0.01
    ],
    "eyeR": [
     -0.19,
     0.03
    ],
    "mouth": [
     -0.19,
     0.0
    ]
   },
   "w": 1.0
  },
  "frames/stepbeat_s1_loop/36.webp": {
   "m": [
    0.99705,
    -0.01583,
    -11.29,
    -10.15
   ],
   "scale": 0.9972,
   "rot_deg": -0.91,
   "shift": [
    -5.1,
    -18.0
   ],
   "inliers": 106,
   "residual_px": 0.87,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 1.4,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/stepbeat_s1_loop_36.webp",
    "rect": [
     164,
     204,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_36.webp",
    "rect": [
     164,
     204,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_36_u.webp",
    "rect": [
     291,
     362,
     227,
     106
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.8,
     0.01
    ],
    "eyeR": [
     -0.22,
     0.03
    ],
    "mouth": [
     -0.42,
     0.18
    ]
   },
   "w": 1.0
  },
  "frames/stepbeat_s1_loop/37.webp": {
   "m": [
    0.9973,
    -0.01407,
    -9.51,
    -5.22
   ],
   "scale": 0.9974,
   "rot_deg": -0.81,
   "shift": [
    -4.1,
    -12.2
   ],
   "inliers": 88,
   "residual_px": 0.89,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/stepbeat_s1_loop_37.webp",
    "rect": [
     165,
     210,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_37.webp",
    "rect": [
     165,
     210,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_37_u.webp",
    "rect": [
     293,
     368,
     225,
     106
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.8,
     -0.04
    ],
    "eyeR": [
     -0.26,
     0.03
    ],
    "mouth": [
     -0.42,
     0.18
    ]
   },
   "w": 1.0
  },
  "frames/stepbeat_s1_loop/38.webp": {
   "m": [
    0.9995,
    -0.00864,
    -6.76,
    4.14
   ],
   "scale": 0.9995,
   "rot_deg": -0.5,
   "shift": [
    -2.9,
    0.4
   ],
   "inliers": 122,
   "residual_px": 0.73,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/stepbeat_s1_loop_38.webp",
    "rect": [
     166,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_38.webp",
    "rect": [
     166,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_38_u.webp",
    "rect": [
     294,
     381,
     226,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.25,
     -0.04
    ],
    "eyeR": [
     -0.26,
     0.0
    ],
    "mouth": [
     0.02,
     0.08
    ]
   },
   "w": 1.0
  },
  "frames/stepbeat_s1_loop/39.webp": {
   "m": [
    0.99928,
    -0.00727,
    -5.45,
    9.64
   ],
   "scale": 0.9993,
   "rot_deg": -0.42,
   "shift": [
    -2.4,
    6.3
   ],
   "inliers": 141,
   "residual_px": 0.65,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/stepbeat_s1_loop_39.webp",
    "rect": [
     167,
     228,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_39.webp",
    "rect": [
     167,
     228,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_39_u.webp",
    "rect": [
     294,
     387,
     226,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.06,
     -0.01
    ],
    "eyeR": [
     0.02,
     0.0
    ],
    "mouth": [
     0.3,
     0.08
    ]
   },
   "w": 1.0
  },
  "frames/stepbeat_s1_loop/40.webp": {
   "m": [
    0.99996,
    -0.00395,
    -3.18,
    12.7
   ],
   "scale": 1.0,
   "rot_deg": -0.23,
   "shift": [
    -1.4,
    11.1
   ],
   "inliers": 125,
   "residual_px": 0.75,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/stepbeat_s1_loop_40.webp",
    "rect": [
     168,
     233,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_40.webp",
    "rect": [
     168,
     233,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_40_u.webp",
    "rect": [
     295,
     392,
     227,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.26,
     0.15
    ],
    "eyeR": [
     0.25,
     0.0
    ],
    "mouth": [
     0.74,
     0.04
    ]
   },
   "w": 1.0
  },
  "frames/stepbeat_s1_loop/41.webp": {
   "m": [
    1.001,
    -0.00075,
    -2.0,
    10.24
   ],
   "scale": 1.001,
   "rot_deg": -0.04,
   "shift": [
    -1.2,
    10.4
   ],
   "inliers": 138,
   "residual_px": 0.7,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/stepbeat_s1_loop_41.webp",
    "rect": [
     168,
     232,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_41.webp",
    "rect": [
     168,
     232,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_41_u.webp",
    "rect": [
     296,
     391,
     226,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 11,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.26,
     0.15
    ],
    "eyeR": [
     0.25,
     0.15
    ],
    "mouth": [
     0.74,
     0.07
    ]
   },
   "w": 1.0
  },
  "frames/stepbeat_s1_loop/42.webp": {
   "m": [
    0.99952,
    -0.00178,
    -1.26,
    6.8
   ],
   "scale": 0.9995,
   "rot_deg": -0.1,
   "shift": [
    -0.6,
    5.9
   ],
   "inliers": 161,
   "residual_px": 0.65,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/stepbeat_s1_loop_42.webp",
    "rect": [
     168,
     228,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_42.webp",
    "rect": [
     168,
     228,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_42_u.webp",
    "rect": [
     296,
     387,
     226,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 13,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.16,
     0.11
    ],
    "eyeR": [
     0.23,
     -0.05
    ],
    "mouth": [
     0.33,
     0.02
    ]
   },
   "w": 1.0
  },
  "frames/stepbeat_s1_loop/43.webp": {
   "m": [
    0.99937,
    -0.00044,
    -0.29,
    4.33
   ],
   "scale": 0.9994,
   "rot_deg": -0.03,
   "shift": [
    -0.3,
    3.9
   ],
   "inliers": 171,
   "residual_px": 0.55,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/stepbeat_s1_loop_43.webp",
    "rect": [
     169,
     226,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_43.webp",
    "rect": [
     169,
     226,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_43_u.webp",
    "rect": [
     297,
     385,
     225,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 12,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.01,
     0.05
    ],
    "eyeR": [
     0.07,
     0.03
    ],
    "mouth": [
     0.16,
     0.02
    ]
   },
   "w": 1.0
  },
  "frames/stepbeat_s1_loop/44.webp": {
   "m": [
    0.99968,
    -0.00019,
    -0.04,
    1.37
   ],
   "scale": 0.9997,
   "rot_deg": -0.01,
   "shift": [
    -0.1,
    1.1
   ],
   "inliers": 177,
   "residual_px": 0.52,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/stepbeat_s1_loop_44.webp",
    "rect": [
     169,
     223,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_44.webp",
    "rect": [
     169,
     223,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_44_u.webp",
    "rect": [
     297,
     382,
     225,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.01,
     0.05
    ],
    "eyeR": [
     0.04,
     0.03
    ],
    "mouth": [
     0.08,
     0.02
    ]
   },
   "w": 1.0
  },
  "frames/stepbeat_s1_loop/45.webp": {
   "m": [
    1.00002,
    0.00018,
    0.02,
    0.38
   ],
   "scale": 1.0,
   "rot_deg": 0.01,
   "shift": [
    -0.1,
    0.5
   ],
   "inliers": 181,
   "residual_px": 0.47,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/stepbeat_s1_loop_45.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_45.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_45_u.webp",
    "rect": [
     297,
     381,
     225,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.05,
     0.04
    ],
    "eyeR": [
     -0.03,
     0.03
    ],
    "mouth": [
     0.05,
     0.1
    ]
   },
   "w": 1.0
  },
  "frames/stepbeat_s1_loop/46.webp": {
   "m": [
    0.99991,
    -7e-05,
    -0.04,
    0.27
   ],
   "scale": 0.9999,
   "rot_deg": -0.0,
   "shift": [
    -0.0,
    0.2
   ],
   "inliers": 194,
   "residual_px": 0.47,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/stepbeat_s1_loop_46.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_46.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_46_u.webp",
    "rect": [
     297,
     381,
     225,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.05,
     -0.0
    ],
    "eyeR": [
     -0.03,
     0.02
    ],
    "mouth": [
     0.01,
     0.1
    ]
   },
   "w": 1.0
  },
  "frames/stepbeat_s1_loop/47.webp": {
   "m": [
    0.99998,
    -8e-05,
    -0.05,
    0.13
   ],
   "scale": 1.0,
   "rot_deg": -0.0,
   "shift": [
    -0.0,
    0.1
   ],
   "inliers": 197,
   "residual_px": 0.46,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/stepbeat_s1_loop_47.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_47.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_47_u.webp",
    "rect": [
     297,
     381,
     225,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.01,
     -0.0
    ],
    "eyeR": [
     -0.01,
     0.02
    ],
    "mouth": [
     0.0,
     0.05
    ]
   },
   "w": 1.0
  },
  "frames/stepbeat_s1_loop/48.webp": {
   "m": [
    1.00001,
    1e-05,
    0.0,
    -0.02
   ],
   "scale": 1.0,
   "rot_deg": 0.0,
   "shift": [
    -0.0,
    -0.0
   ],
   "inliers": 331,
   "residual_px": 0.0,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/stepbeat_s1_loop_48.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_48.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_48_u.webp",
    "rect": [
     297,
     381,
     226,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.01,
     0.0
    ],
    "eyeR": [
     0.0,
     -0.0
    ],
    "mouth": [
     0.0,
     -0.0
    ]
   },
   "w": 1.0
  },
  "frames/hips_s1_fix_loop/00.webp": {
   "m": [
    1.00001,
    1e-05,
    0.0,
    -0.02
   ],
   "scale": 1.0,
   "rot_deg": 0.0,
   "shift": [
    -0.0,
    -0.0
   ],
   "inliers": 331,
   "residual_px": 0.0,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/hips_s1_fix_loop_00.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_00.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_00_u.webp",
    "rect": [
     297,
     381,
     226,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.01,
     0.0
    ],
    "eyeR": [
     0.0,
     -0.0
    ],
    "mouth": [
     0.0,
     -0.0
    ]
   },
   "w": 1.0
  },
  "frames/hips_s1_fix_loop/01.webp": {
   "m": [
    0.99999,
    1e-05,
    0.03,
    0.07
   ],
   "scale": 1.0,
   "rot_deg": 0.0,
   "shift": [
    0.0,
    0.1
   ],
   "inliers": 194,
   "residual_px": 0.41,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/hips_s1_fix_loop_01.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_01.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_01_u.webp",
    "rect": [
     297,
     381,
     225,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.0,
     0.07
    ],
    "eyeR": [
     0.02,
     0.1
    ],
    "mouth": [
     0.15,
     0.05
    ]
   },
   "w": 1.0
  },
  "frames/hips_s1_fix_loop/02.webp": {
   "m": [
    0.99967,
    1e-05,
    0.1,
    0.39
   ],
   "scale": 0.9997,
   "rot_deg": 0.0,
   "shift": [
    -0.0,
    0.2
   ],
   "inliers": 199,
   "residual_px": 0.51,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/hips_s1_fix_loop_02.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_02.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_02_u.webp",
    "rect": [
     297,
     381,
     225,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.01,
     0.19
    ],
    "eyeR": [
     0.02,
     0.18
    ],
    "mouth": [
     0.15,
     0.24
    ]
   },
   "w": 1.0
  },
  "frames/hips_s1_fix_loop/03.webp": {
   "m": [
    0.99995,
    -0.00119,
    -0.5,
    1.86
   ],
   "scale": 0.9999,
   "rot_deg": -0.07,
   "shift": [
    0.0,
    1.4
   ],
   "inliers": 161,
   "residual_px": 0.72,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/hips_s1_fix_loop_03.webp",
    "rect": [
     169,
     223,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_03.webp",
    "rect": [
     169,
     223,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_03_u.webp",
    "rect": [
     297,
     382,
     225,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.23,
     0.19
    ],
    "eyeR": [
     -0.12,
     0.29
    ],
    "mouth": [
     0.01,
     0.24
    ]
   },
   "w": 1.0
  },
  "frames/hips_s1_fix_loop/04.webp": {
   "m": [
    1.00616,
    -0.01664,
    -9.95,
    12.02
   ],
   "scale": 1.0063,
   "rot_deg": -0.95,
   "shift": [
    0.3,
    8.1
   ],
   "inliers": 91,
   "residual_px": 1.0,
   "ref_residual_px": {
    "eyeL": 2.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.4,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/hips_s1_fix_loop_04.webp",
    "rect": [
     169,
     230,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_04.webp",
    "rect": [
     169,
     230,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_04_u.webp",
    "rect": [
     296,
     387,
     228,
     107
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.25,
     0.01
    ],
    "eyeR": [
     -1.03,
     0.33
    ],
    "mouth": [
     -0.84,
     -0.58
    ]
   },
   "w": 1.0
  },
  "frames/hips_s1_fix_loop/05.webp": {
   "m": [
    1.00456,
    -0.02704,
    -13.47,
    21.45
   ],
   "scale": 1.0049,
   "rot_deg": -1.54,
   "shift": [
    1.0,
    12.5
   ],
   "inliers": 51,
   "residual_px": 0.96,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 2.8,
    "mouth": 1.4,
    "nose": 2.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/hips_s1_fix_loop_05.webp",
    "rect": [
     170,
     235,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_05.webp",
    "rect": [
     170,
     235,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_05_u.webp",
    "rect": [
     296,
     391,
     228,
     108
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 564,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.91,
     0.01
    ],
    "eyeR": [
     -1.39,
     2.22
    ],
    "mouth": [
     -1.74,
     -0.77
    ]
   },
   "w": 1.0
  },
  "frames/hips_s1_fix_loop/06.webp": {
   "m": [
    1.01871,
    -0.03806,
    -23.94,
    26.94
   ],
   "scale": 1.0194,
   "rot_deg": -2.14,
   "shift": [
    1.4,
    20.1
   ],
   "inliers": 24,
   "residual_px": 0.88,
   "ref_residual_px": {
    "mouth": 3.6,
    "nose": 2.2,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/hips_s1_fix_loop_06.webp",
    "rect": [
     170,
     242,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_06.webp",
    "rect": [
     170,
     242,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_06_u.webp",
    "rect": [
     295,
     397,
     228,
     111
    ]
   },
   "yield_eye_px": 6,
   "yield_px": 2681,
   "cover_alien_px": 8,
   "occluded": 0.007,
   "feat": {
    "eyeL": [
     -0.91,
     0.3
    ],
    "eyeR": [
     -1.39,
     2.22
    ],
    "mouth": [
     -1.74,
     -0.88
    ]
   },
   "w": 1.0
  },
  "frames/hips_s1_fix_loop/07.webp": {
   "m": [
    1.01226,
    -0.02524,
    -16.2,
    19.38
   ],
   "scale": 1.0126,
   "rot_deg": -1.43,
   "shift": [
    0.6,
    14.8
   ],
   "inliers": 26,
   "residual_px": 0.93,
   "ref_residual_px": {
    "mouth": 1.4,
    "nose": 2.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/hips_s1_fix_loop_07.webp",
    "rect": [
     170,
     237,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_07.webp",
    "rect": [
     170,
     237,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_07_u.webp",
    "rect": [
     295,
     393,
     228,
     109
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 1307,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.76,
     0.58
    ],
    "eyeR": [
     -1.14,
     2.06
    ],
    "mouth": [
     -1.56,
     -0.88
    ]
   },
   "w": 1.0
  },
  "frames/hips_s1_fix_loop/08.webp": {
   "m": [
    1.00222,
    -0.01103,
    -6.17,
    8.36
   ],
   "scale": 1.0023,
   "rot_deg": -0.63,
   "shift": [
    -0.1,
    4.9
   ],
   "inliers": 79,
   "residual_px": 0.98,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.4,
    "mouth": 0.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/hips_s1_fix_loop_08.webp",
    "rect": [
     169,
     227,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_08.webp",
    "rect": [
     169,
     227,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_08_u.webp",
    "rect": [
     296,
     385,
     226,
     106
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 9,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.61,
     0.66
    ],
    "eyeR": [
     -0.89,
     1.89
    ],
    "mouth": [
     -0.59,
     0.37
    ]
   },
   "w": 1.0
  },
  "frames/hips_s1_fix_loop/09.webp": {
   "m": [
    0.99886,
    0.00392,
    1.36,
    -2.75
   ],
   "scale": 0.9989,
   "rot_deg": 0.22,
   "shift": [
    -0.9,
    -1.7
   ],
   "inliers": 104,
   "residual_px": 0.76,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.4,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/hips_s1_fix_loop_09.webp",
    "rect": [
     168,
     220,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_09.webp",
    "rect": [
     168,
     220,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_09_u.webp",
    "rect": [
     296,
     380,
     226,
     103
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.11,
     0.66
    ],
    "eyeR": [
     0.18,
     0.4
    ],
    "mouth": [
     0.61,
     0.37
    ]
   },
   "w": 1.0
  },
  "frames/hips_s1_fix_loop/10.webp": {
   "m": [
    0.99683,
    0.02989,
    14.87,
    -18.79
   ],
   "scale": 0.9973,
   "rot_deg": 1.72,
   "shift": [
    -0.3,
    -8.1
   ],
   "inliers": 84,
   "residual_px": 0.91,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.4,
    "mouth": 2.2,
    "nose": 1.4,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/hips_s1_fix_loop_10.webp",
    "rect": [
     169,
     214,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_10.webp",
    "rect": [
     169,
     214,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_10_u.webp",
    "rect": [
     298,
     372,
     226,
     106
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.23,
     0.66
    ],
    "eyeR": [
     0.65,
     -0.68
    ],
    "mouth": [
     0.99,
     0.39
    ]
   },
   "w": 1.0
  },
  "frames/hips_s1_fix_loop/11.webp": {
   "m": [
    0.99154,
    0.04973,
    26.57,
    -26.97
   ],
   "scale": 0.9928,
   "rot_deg": 2.87,
   "shift": [
    -0.0,
    -10.6
   ],
   "inliers": 90,
   "residual_px": 0.72,
   "ref_residual_px": {
    "eyeL": 2.0,
    "eyeR": 2.2,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/hips_s1_fix_loop_11.webp",
    "rect": [
     169,
     211,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_11.webp",
    "rect": [
     169,
     211,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_11_u.webp",
    "rect": [
     300,
     368,
     226,
     109
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 178,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.23,
     1.19
    ],
    "eyeR": [
     1.41,
     -0.68
    ],
    "mouth": [
     1.24,
     0.37
    ]
   },
   "w": 1.0
  },
  "frames/hips_s1_fix_loop/12.webp": {
   "m": [
    0.9858,
    0.07595,
    42.95,
    -36.11
   ],
   "scale": 0.9887,
   "rot_deg": 4.41,
   "shift": [
    1.8,
    -11.7
   ],
   "inliers": 68,
   "residual_px": 0.78,
   "ref_residual_px": {
    "eyeL": 3.2,
    "eyeR": 2.0,
    "mouth": 2.2,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/hips_s1_fix_loop_12.webp",
    "rect": [
     171,
     210,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_12.webp",
    "rect": [
     171,
     210,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_12_u.webp",
    "rect": [
     303,
     366,
     225,
     112
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 305,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.21,
     1.63
    ],
    "eyeR": [
     1.46,
     -0.37
    ],
    "mouth": [
     1.24,
     0.37
    ]
   },
   "w": 1.0
  },
  "frames/hips_s1_fix_loop/13.webp": {
   "m": [
    0.98537,
    0.08212,
    46.72,
    -37.49
   ],
   "scale": 0.9888,
   "rot_deg": 4.76,
   "shift": [
    2.5,
    -10.7
   ],
   "inliers": 85,
   "residual_px": 0.85,
   "ref_residual_px": {
    "eyeL": 2.2,
    "eyeR": 2.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/hips_s1_fix_loop_13.webp",
    "rect": [
     172,
     211,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_13.webp",
    "rect": [
     172,
     211,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_13_u.webp",
    "rect": [
     304,
     366,
     224,
     113
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 250,
   "cover_alien_px": 1,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.21,
     1.63
    ],
    "eyeR": [
     1.46,
     -0.37
    ],
    "mouth": [
     0.94,
     0.35
    ]
   },
   "w": 1.0
  },
  "frames/hips_s1_fix_loop/14.webp": {
   "m": [
    0.98864,
    0.08272,
    45.86,
    -34.66
   ],
   "scale": 0.9921,
   "rot_deg": 4.78,
   "shift": [
    2.7,
    -6.1
   ],
   "inliers": 98,
   "residual_px": 0.98,
   "ref_residual_px": {
    "eyeL": 2.0,
    "eyeR": 1.4,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/hips_s1_fix_loop_14.webp",
    "rect": [
     172,
     216,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_14.webp",
    "rect": [
     172,
     216,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_14_u.webp",
    "rect": [
     304,
     371,
     226,
     113
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 9,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.43,
     1.46
    ],
    "eyeR": [
     1.36,
     -0.37
    ],
    "mouth": [
     0.63,
     0.33
    ]
   },
   "w": 1.0
  },
  "frames/hips_s1_fix_loop/15.webp": {
   "m": [
    0.98727,
    0.07688,
    44.06,
    -29.45
   ],
   "scale": 0.9903,
   "rot_deg": 4.45,
   "shift": [
    3.1,
    -4.0
   ],
   "inliers": 110,
   "residual_px": 0.86,
   "ref_residual_px": {
    "eyeL": 2.2,
    "eyeR": 1.0,
    "nose": 1.4,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/hips_s1_fix_loop_15.webp",
    "rect": [
     172,
     218,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_15.webp",
    "rect": [
     172,
     218,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_15_u.webp",
    "rect": [
     304,
     373,
     226,
     113
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 43,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.5,
     0.8
    ],
    "eyeR": [
     1.12,
     0.07
    ],
    "mouth": [
     0.32,
     0.3
    ]
   },
   "w": 1.0
  },
  "frames/hips_s1_fix_loop/16.webp": {
   "m": [
    0.98781,
    0.06684,
    39.73,
    -24.5
   ],
   "scale": 0.9901,
   "rot_deg": 3.87,
   "shift": [
    3.7,
    -2.9
   ],
   "inliers": 96,
   "residual_px": 0.85,
   "ref_residual_px": {
    "eyeL": 2.2,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/hips_s1_fix_loop_16.webp",
    "rect": [
     173,
     219,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_16.webp",
    "rect": [
     173,
     219,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_16_u.webp",
    "rect": [
     305,
     375,
     225,
     111
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.7,
     1.0
    ],
    "eyeR": [
     0.75,
     0.07
    ],
    "mouth": [
     0.01,
     0.3
    ]
   },
   "w": 1.0
  },
  "frames/hips_s1_fix_loop/17.webp": {
   "m": [
    0.99066,
    0.0537,
    31.24,
    -20.34
   ],
   "scale": 0.9921,
   "rot_deg": 3.1,
   "shift": [
    2.4,
    -2.7
   ],
   "inliers": 123,
   "residual_px": 0.92,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/hips_s1_fix_loop_17.webp",
    "rect": [
     171,
     219,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_17.webp",
    "rect": [
     171,
     219,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_17_u.webp",
    "rect": [
     303,
     376,
     225,
     109
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.7,
     0.59
    ],
    "eyeR": [
     0.71,
     0.07
    ],
    "mouth": [
     0.01,
     0.28
    ]
   },
   "w": 1.0
  },
  "frames/hips_s1_fix_loop/18.webp": {
   "m": [
    0.99366,
    0.04491,
    25.43,
    -17.6
   ],
   "scale": 0.9947,
   "rot_deg": 2.59,
   "shift": [
    1.9,
    -2.2
   ],
   "inliers": 123,
   "residual_px": 0.81,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/hips_s1_fix_loop_18.webp",
    "rect": [
     171,
     220,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_18.webp",
    "rect": [
     171,
     220,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_18_u.webp",
    "rect": [
     302,
     377,
     224,
     108
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.39,
     0.65
    ],
    "eyeR": [
     0.71,
     -0.01
    ],
    "mouth": [
     0.01,
     0.9
    ]
   },
   "w": 1.0
  },
  "frames/hips_s1_fix_loop/19.webp": {
   "m": [
    0.99361,
    0.03834,
    22.09,
    -15.16
   ],
   "scale": 0.9943,
   "rot_deg": 2.21,
   "shift": [
    1.6,
    -2.5
   ],
   "inliers": 128,
   "residual_px": 0.79,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/hips_s1_fix_loop_19.webp",
    "rect": [
     171,
     220,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_19.webp",
    "rect": [
     171,
     220,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_19_u.webp",
    "rect": [
     301,
     377,
     225,
     107
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.39,
     0.65
    ],
    "eyeR": [
     0.67,
     -0.01
    ],
    "mouth": [
     0.26,
     1.02
    ]
   },
   "w": 1.0
  },
  "frames/hips_s1_fix_loop/20.webp": {
   "m": [
    0.99382,
    0.03751,
    21.53,
    -15.11
   ],
   "scale": 0.9945,
   "rot_deg": 2.16,
   "shift": [
    1.6,
    -2.7
   ],
   "inliers": 124,
   "residual_px": 0.73,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/hips_s1_fix_loop_20.webp",
    "rect": [
     171,
     219,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_20.webp",
    "rect": [
     171,
     219,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_20_u.webp",
    "rect": [
     301,
     377,
     225,
     107
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 1,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.4,
     0.65
    ],
    "eyeR": [
     0.64,
     0.02
    ],
    "mouth": [
     0.32,
     1.04
    ]
   },
   "w": 1.0
  },
  "frames/hips_s1_fix_loop/21.webp": {
   "m": [
    0.99418,
    0.03409,
    19.79,
    -13.61
   ],
   "scale": 0.9948,
   "rot_deg": 1.96,
   "shift": [
    1.6,
    -2.4
   ],
   "inliers": 136,
   "residual_px": 0.78,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/hips_s1_fix_loop_21.webp",
    "rect": [
     171,
     220,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_21.webp",
    "rect": [
     171,
     220,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_21_u.webp",
    "rect": [
     300,
     378,
     226,
     106
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 1,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.41,
     0.61
    ],
    "eyeR": [
     0.63,
     0.02
    ],
    "mouth": [
     0.32,
     1.04
    ]
   },
   "w": 1.0
  },
  "frames/hips_s1_fix_loop/22.webp": {
   "m": [
    0.99377,
    0.0339,
    19.87,
    -13.36
   ],
   "scale": 0.9943,
   "rot_deg": 1.95,
   "shift": [
    1.5,
    -2.4
   ],
   "inliers": 117,
   "residual_px": 0.74,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/hips_s1_fix_loop_22.webp",
    "rect": [
     171,
     220,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_22.webp",
    "rect": [
     171,
     220,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_22_u.webp",
    "rect": [
     301,
     378,
     225,
     106
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.41,
     0.6
    ],
    "eyeR": [
     0.6,
     -0.01
    ],
    "mouth": [
     -0.14,
     0.63
    ]
   },
   "w": 1.0
  },
  "frames/hips_s1_fix_loop/23.webp": {
   "m": [
    0.99356,
    0.03363,
    19.89,
    -13.16
   ],
   "scale": 0.9941,
   "rot_deg": 1.94,
   "shift": [
    1.6,
    -2.4
   ],
   "inliers": 125,
   "residual_px": 0.74,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/hips_s1_fix_loop_23.webp",
    "rect": [
     171,
     220,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_23.webp",
    "rect": [
     171,
     220,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_23_u.webp",
    "rect": [
     301,
     378,
     225,
     106
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.46,
     0.6
    ],
    "eyeR": [
     0.6,
     -0.01
    ],
    "mouth": [
     -0.14,
     0.63
    ]
   },
   "w": 1.0
  },
  "frames/hips_s1_fix_loop/24.webp": {
   "m": [
    0.99359,
    0.03365,
    19.87,
    -13.19
   ],
   "scale": 0.9942,
   "rot_deg": 1.94,
   "shift": [
    1.6,
    -2.4
   ],
   "inliers": 134,
   "residual_px": 0.77,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/hips_s1_fix_loop_24.webp",
    "rect": [
     171,
     220,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_24.webp",
    "rect": [
     171,
     220,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_24_u.webp",
    "rect": [
     301,
     378,
     225,
     106
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.46,
     0.58
    ],
    "eyeR": [
     0.6,
     -0.01
    ],
    "mouth": [
     0.18,
     0.67
    ]
   },
   "w": 1.0
  },
  "frames/hips_s1_fix_loop/25.webp": {
   "m": [
    0.99351,
    0.03351,
    19.75,
    -12.91
   ],
   "scale": 0.9941,
   "rot_deg": 1.93,
   "shift": [
    1.5,
    -2.2
   ],
   "inliers": 140,
   "residual_px": 0.76,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/hips_s1_fix_loop_25.webp",
    "rect": [
     171,
     220,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_25.webp",
    "rect": [
     171,
     220,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_25_u.webp",
    "rect": [
     301,
     378,
     225,
     106
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.45,
     0.6
    ],
    "eyeR": [
     0.63,
     -0.01
    ],
    "mouth": [
     0.28,
     0.78
    ]
   },
   "w": 1.0
  },
  "frames/hips_s1_fix_loop/26.webp": {
   "m": [
    0.99443,
    0.03324,
    18.78,
    -13.67
   ],
   "scale": 0.995,
   "rot_deg": 1.91,
   "shift": [
    1.0,
    -2.7
   ],
   "inliers": 129,
   "residual_px": 0.79,
   "ref_residual_px": {
    "eyeL": 2.0,
    "eyeR": 1.0,
    "mouth": 1.4,
    "nose": 1.4,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/hips_s1_fix_loop_26.webp",
    "rect": [
     170,
     219,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_26.webp",
    "rect": [
     170,
     219,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_26_u.webp",
    "rect": [
     300,
     377,
     226,
     107
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.35,
     0.74
    ],
    "eyeR": [
     0.68,
     0.11
    ],
    "mouth": [
     0.37,
     0.99
    ]
   },
   "w": 1.0
  },
  "frames/hips_s1_fix_loop/27.webp": {
   "m": [
    0.99408,
    0.02413,
    14.62,
    -9.58
   ],
   "scale": 0.9944,
   "rot_deg": 1.39,
   "shift": [
    1.0,
    -2.5
   ],
   "inliers": 132,
   "residual_px": 0.88,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/hips_s1_fix_loop_27.webp",
    "rect": [
     170,
     220,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_27.webp",
    "rect": [
     170,
     220,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_27_u.webp",
    "rect": [
     300,
     378,
     226,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.35,
     0.89
    ],
    "eyeR": [
     0.68,
     0.11
    ],
    "mouth": [
     0.51,
     1.06
    ]
   },
   "w": 1.0
  },
  "frames/hips_s1_fix_loop/28.webp": {
   "m": [
    0.99392,
    0.02253,
    13.56,
    -8.8
   ],
   "scale": 0.9942,
   "rot_deg": 1.3,
   "shift": [
    0.6,
    -2.4
   ],
   "inliers": 130,
   "residual_px": 0.77,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 1.0,
    "mouth": 1.4,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/hips_s1_fix_loop_28.webp",
    "rect": [
     170,
     220,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_28.webp",
    "rect": [
     170,
     220,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_28_u.webp",
    "rect": [
     299,
     378,
     227,
     105
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 1,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.35,
     0.74
    ],
    "eyeR": [
     0.65,
     0.06
    ],
    "mouth": [
     0.51,
     1.06
    ]
   },
   "w": 1.0
  },
  "frames/hips_s1_fix_loop/29.webp": {
   "m": [
    0.99667,
    0.00925,
    5.31,
    -3.91
   ],
   "scale": 0.9967,
   "rot_deg": 0.53,
   "shift": [
    -0.4,
    -1.7
   ],
   "inliers": 147,
   "residual_px": 0.68,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/hips_s1_fix_loop_29.webp",
    "rect": [
     169,
     220,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_29.webp",
    "rect": [
     169,
     220,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_29_u.webp",
    "rect": [
     297,
     380,
     227,
     103
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.13,
     0.84
    ],
    "eyeR": [
     0.64,
     0.06
    ],
    "mouth": [
     0.79,
     0.67
    ]
   },
   "w": 1.0
  },
  "frames/hips_s1_fix_loop/30.webp": {
   "m": [
    0.99577,
    0.00018,
    0.91,
    -0.0
   ],
   "scale": 0.9958,
   "rot_deg": 0.01,
   "shift": [
    -0.9,
    -1.9
   ],
   "inliers": 136,
   "residual_px": 0.7,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 1.4,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/hips_s1_fix_loop_30.webp",
    "rect": [
     168,
     220,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_30.webp",
    "rect": [
     168,
     220,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_30_u.webp",
    "rect": [
     297,
     379,
     226,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.05,
     0.54
    ],
    "eyeR": [
     0.53,
     -0.07
    ],
    "mouth": [
     0.81,
     0.33
    ]
   },
   "w": 1.0
  },
  "frames/hips_s1_fix_loop/31.webp": {
   "m": [
    0.99818,
    -0.02115,
    -11.31,
    8.49
   ],
   "scale": 0.9984,
   "rot_deg": -1.21,
   "shift": [
    -2.2,
    -1.0
   ],
   "inliers": 132,
   "residual_px": 0.68,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/hips_s1_fix_loop_31.webp",
    "rect": [
     167,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_31.webp",
    "rect": [
     167,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_31_u.webp",
    "rect": [
     294,
     378,
     226,
     107
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.05,
     0.37
    ],
    "eyeR": [
     0.46,
     -0.07
    ],
    "mouth": [
     0.79,
     0.08
    ]
   },
   "w": 1.0
  },
  "frames/hips_s1_fix_loop/32.webp": {
   "m": [
    0.99942,
    -0.03498,
    -19.12,
    14.35
   ],
   "scale": 1.0,
   "rot_deg": -2.0,
   "shift": [
    -3.1,
    -0.2
   ],
   "inliers": 125,
   "residual_px": 0.62,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/hips_s1_fix_loop_32.webp",
    "rect": [
     166,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_32.webp",
    "rect": [
     166,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_32_u.webp",
    "rect": [
     292,
     378,
     226,
     109
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.05,
     0.27
    ],
    "eyeR": [
     0.32,
     -0.07
    ],
    "mouth": [
     0.74,
     -0.06
    ]
   },
   "w": 1.0
  },
  "frames/hips_s1_fix_loop/33.webp": {
   "m": [
    0.99763,
    -0.04099,
    -21.27,
    17.78
   ],
   "scale": 0.9985,
   "rot_deg": -2.35,
   "shift": [
    -3.2,
    -0.1
   ],
   "inliers": 118,
   "residual_px": 0.61,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/hips_s1_fix_loop_33.webp",
    "rect": [
     166,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_33.webp",
    "rect": [
     166,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_33_u.webp",
    "rect": [
     292,
     378,
     226,
     110
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.19,
     0.16
    ],
    "eyeR": [
     0.25,
     -0.03
    ],
    "mouth": [
     0.36,
     -0.06
    ]
   },
   "w": 1.0
  },
  "frames/hips_s1_fix_loop/34.webp": {
   "m": [
    1.00191,
    -0.05423,
    -28.26,
    26.9
   ],
   "scale": 1.0034,
   "rot_deg": -3.1,
   "shift": [
    -2.2,
    5.6
   ],
   "inliers": 101,
   "residual_px": 0.74,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/hips_s1_fix_loop_34.webp",
    "rect": [
     167,
     228,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_34.webp",
    "rect": [
     167,
     228,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_34_u.webp",
    "rect": [
     292,
     382,
     228,
     112
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 1,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.19,
     -0.16
    ],
    "eyeR": [
     -0.42,
     0.26
    ],
    "mouth": [
     -0.0,
     -0.06
    ]
   },
   "w": 1.0
  },
  "frames/hips_s1_fix_loop/35.webp": {
   "m": [
    1.00598,
    -0.05585,
    -30.16,
    28.77
   ],
   "scale": 1.0075,
   "rot_deg": -3.18,
   "shift": [
    -1.7,
    8.7
   ],
   "inliers": 96,
   "residual_px": 0.82,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 1.4,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/hips_s1_fix_loop_35.webp",
    "rect": [
     167,
     231,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_35.webp",
    "rect": [
     167,
     231,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_35_u.webp",
    "rect": [
     292,
     385,
     228,
     112
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 53,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.09,
     -0.16
    ],
    "eyeR": [
     -0.77,
     0.34
    ],
    "mouth": [
     -0.24,
     -0.46
    ]
   },
   "w": 1.0
  },
  "frames/hips_s1_fix_loop/36.webp": {
   "m": [
    1.0176,
    -0.0689,
    -38.71,
    35.56
   ],
   "scale": 1.0199,
   "rot_deg": -3.87,
   "shift": [
    0.5,
    15.6
   ],
   "inliers": 38,
   "residual_px": 1.19,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 5.0,
    "mouth": 3.2,
    "nose": 2.2,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/hips_s1_fix_loop_36.webp",
    "rect": [
     170,
     238,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_36.webp",
    "rect": [
     170,
     238,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_36_u.webp",
    "rect": [
     292,
     390,
     230,
     116
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 1905,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.52,
     3.22
    ],
    "eyeR": [
     -1.76,
     5.56
    ],
    "mouth": [
     -1.6,
     -2.54
    ]
   },
   "w": 1.0
  },
  "frames/hips_s1_fix_loop/37.webp": {
   "m": [
    1.01614,
    -0.07066,
    -38.15,
    35.75
   ],
   "scale": 1.0186,
   "rot_deg": -3.98,
   "shift": [
    1.3,
    14.4
   ],
   "inliers": 24,
   "residual_px": 0.9,
   "ref_residual_px": {
    "mouth": 3.6,
    "nose": 2.8,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/hips_s1_fix_loop_37.webp",
    "rect": [
     170,
     236,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_37.webp",
    "rect": [
     170,
     236,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_37_u.webp",
    "rect": [
     293,
     388,
     228,
     116
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 2028,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.52,
     3.34
    ],
    "eyeR": [
     -1.76,
     5.56
    ],
    "mouth": [
     -1.6,
     -2.54
    ]
   },
   "w": 1.0
  },
  "frames/hips_s1_fix_loop/38.webp": {
   "m": [
    1.00232,
    -0.05095,
    -25.02,
    23.95
   ],
   "scale": 1.0036,
   "rot_deg": -2.91,
   "shift": [
    -0.4,
    4.2
   ],
   "inliers": 56,
   "residual_px": 1.01,
   "ref_residual_px": {
    "eyeL": 2.0,
    "eyeR": 3.6,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/hips_s1_fix_loop_38.webp",
    "rect": [
     169,
     226,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_38.webp",
    "rect": [
     169,
     226,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_38_u.webp",
    "rect": [
     294,
     381,
     226,
     112
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 1,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.18,
     3.34
    ],
    "eyeR": [
     -1.27,
     4.88
    ],
    "mouth": [
     -1.16,
     0.04
    ]
   },
   "w": 1.0
  },
  "frames/hips_s1_fix_loop/39.webp": {
   "m": [
    1.00044,
    -0.04274,
    -21.26,
    18.08
   ],
   "scale": 1.0013,
   "rot_deg": -2.45,
   "shift": [
    -1.2,
    0.8
   ],
   "inliers": 117,
   "residual_px": 0.92,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/hips_s1_fix_loop_39.webp",
    "rect": [
     168,
     223,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_39.webp",
    "rect": [
     168,
     223,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_39_u.webp",
    "rect": [
     294,
     378,
     226,
     111
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.18,
     0.36
    ],
    "eyeR": [
     -0.34,
     1.07
    ],
    "mouth": [
     -0.23,
     0.33
    ]
   },
   "w": 1.0
  },
  "frames/hips_s1_fix_loop/40.webp": {
   "m": [
    1.00031,
    -0.0304,
    -15.52,
    11.4
   ],
   "scale": 1.0008,
   "rot_deg": -1.74,
   "shift": [
    -1.2,
    -0.9
   ],
   "inliers": 150,
   "residual_px": 0.72,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/hips_s1_fix_loop_40.webp",
    "rect": [
     168,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_40.webp",
    "rect": [
     168,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_40_u.webp",
    "rect": [
     294,
     378,
     226,
     108
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.05,
     0.29
    ],
    "eyeR": [
     -0.04,
     0.31
    ],
    "mouth": [
     0.22,
     0.36
    ]
   },
   "w": 1.0
  },
  "frames/hips_s1_fix_loop/41.webp": {
   "m": [
    1.00026,
    -0.0209,
    -11.15,
    7.78
   ],
   "scale": 1.0005,
   "rot_deg": -1.2,
   "shift": [
    -1.3,
    -0.6
   ],
   "inliers": 165,
   "residual_px": 0.62,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/hips_s1_fix_loop_41.webp",
    "rect": [
     168,
     221,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_41.webp",
    "rect": [
     168,
     221,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_41_u.webp",
    "rect": [
     295,
     379,
     225,
     107
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.08,
     0.21
    ],
    "eyeR": [
     0.08,
     0.24
    ],
    "mouth": [
     0.44,
     0.33
    ]
   },
   "w": 1.0
  },
  "frames/hips_s1_fix_loop/42.webp": {
   "m": [
    1.00137,
    -0.01005,
    -6.31,
    3.52
   ],
   "scale": 1.0014,
   "rot_deg": -0.58,
   "shift": [
    -1.1,
    0.1
   ],
   "inliers": 192,
   "residual_px": 0.54,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/hips_s1_fix_loop_42.webp",
    "rect": [
     168,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_42.webp",
    "rect": [
     168,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_42_u.webp",
    "rect": [
     295,
     380,
     227,
     106
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.08,
     0.22
    ],
    "eyeR": [
     0.08,
     0.02
    ],
    "mouth": [
     0.44,
     0.12
    ]
   },
   "w": 1.0
  },
  "frames/hips_s1_fix_loop/43.webp": {
   "m": [
    1.00038,
    -0.0056,
    -3.46,
    2.2
   ],
   "scale": 1.0004,
   "rot_deg": -0.32,
   "shift": [
    -0.7,
    0.1
   ],
   "inliers": 166,
   "residual_px": 0.48,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/hips_s1_fix_loop_43.webp",
    "rect": [
     168,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_43.webp",
    "rect": [
     168,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_43_u.webp",
    "rect": [
     296,
     381,
     226,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.03,
     0.21
    ],
    "eyeR": [
     0.04,
     -0.06
    ],
    "mouth": [
     0.22,
     0.09
    ]
   },
   "w": 1.0
  },
  "frames/hips_s1_fix_loop/44.webp": {
   "m": [
    0.99985,
    -0.0029,
    -1.45,
    1.47
   ],
   "scale": 0.9999,
   "rot_deg": -0.17,
   "shift": [
    -0.2,
    0.2
   ],
   "inliers": 179,
   "residual_px": 0.43,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/hips_s1_fix_loop_44.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_44.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_44_u.webp",
    "rect": [
     297,
     381,
     225,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.1,
     0.15
    ],
    "eyeR": [
     -0.01,
     -0.06
    ],
    "mouth": [
     0.06,
     0.12
    ]
   },
   "w": 1.0
  },
  "frames/hips_s1_fix_loop/45.webp": {
   "m": [
    0.99997,
    -0.00053,
    -0.41,
    0.33
   ],
   "scale": 1.0,
   "rot_deg": -0.03,
   "shift": [
    -0.2,
    0.1
   ],
   "inliers": 185,
   "residual_px": 0.42,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/hips_s1_fix_loop_45.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_45.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_45_u.webp",
    "rect": [
     297,
     381,
     225,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.1,
     0.06
    ],
    "eyeR": [
     -0.03,
     -0.05
    ],
    "mouth": [
     0.05,
     0.09
    ]
   },
   "w": 1.0
  },
  "frames/hips_s1_fix_loop/46.webp": {
   "m": [
    1.00009,
    -0.00043,
    -0.34,
    0.25
   ],
   "scale": 1.0001,
   "rot_deg": -0.02,
   "shift": [
    -0.1,
    0.1
   ],
   "inliers": 185,
   "residual_px": 0.45,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/hips_s1_fix_loop_46.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_46.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_46_u.webp",
    "rect": [
     297,
     381,
     227,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.07,
     0.06
    ],
    "eyeR": [
     -0.01,
     -0.03
    ],
    "mouth": [
     0.05,
     0.09
    ]
   },
   "w": 1.0
  },
  "frames/hips_s1_fix_loop/47.webp": {
   "m": [
    1.00021,
    -0.00035,
    -0.28,
    0.13
   ],
   "scale": 1.0002,
   "rot_deg": -0.02,
   "shift": [
    -0.0,
    0.1
   ],
   "inliers": 186,
   "residual_px": 0.43,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/hips_s1_fix_loop_47.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_47.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_47_u.webp",
    "rect": [
     297,
     381,
     227,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.03,
     0.0
    ],
    "eyeR": [
     -0.0,
     -0.02
    ],
    "mouth": [
     0.01,
     0.08
    ]
   },
   "w": 1.0
  },
  "frames/hips_s1_fix_loop/48.webp": {
   "m": [
    1.00001,
    1e-05,
    0.0,
    -0.02
   ],
   "scale": 1.0,
   "rot_deg": 0.0,
   "shift": [
    -0.0,
    -0.0
   ],
   "inliers": 331,
   "residual_px": 0.0,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/hips_s1_fix_loop_48.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_48.webp",
    "rect": [
     169,
     222,
     484,
     402
    ],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_48_u.webp",
    "rect": [
     297,
     381,
     226,
     104
    ]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.01,
     0.0
    ],
    "eyeR": [
     0.0,
     -0.0
    ],
    "mouth": [
     0.0,
     -0.0
    ]
   },
   "w": 1.0
  }
 }
};
