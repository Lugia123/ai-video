// 由 clips/sync.py 从 clips.json 生成，别手改。file:// 打开页面时靠它加载片段库。
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
 "note": "空脸片段库：片段里没有画五官（faceBlank），脸全由贴片画（默认脸 / 表情脸 / 口型 / 眨眼）。",
 "poses": {
  "idle": {
   "label": "归位（空脸）",
   "frame": "frames/idle.png",
   "bbox": [183, 137, 649, 1000],
   "margin": [183, 137, 183, 104],
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
      "file": "patches/idle/mouth_closed.png",
      "rect": [370, 470, 82, 57],
      "color_shift_rgb": [
       4.0,
       7.0,
       10.0
      ],
      "skin_samples": 992,
      "occluded_px": 0
     },
     "small": {
      "file": "patches/idle/mouth_small.png",
      "rect": [370, 470, 82, 57],
      "color_shift_rgb": [
       4.0,
       7.0,
       10.0
      ],
      "skin_samples": 992,
      "occluded_px": 0
     },
     "big": {
      "file": "patches/idle/mouth_big.png",
      "rect": [370, 470, 82, 57],
      "color_shift_rgb": [
       4.0,
       7.0,
       10.0
      ],
      "skin_samples": 992,
      "occluded_px": 0
     },
     "smile": {
      "file": "patches/idle/mouth_smile.png",
      "rect": [370, 470, 82, 57],
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
     "file": "patches/idle/blink.png",
     "rect": [283, 383, 258, 100],
     "color_shift_rgb": [
      3.0,
      5.0,
      7.0
     ],
     "skin_samples": 2029,
     "occluded_px": 0
    },
    "clean": {
     "file": "patches/idle/clean.png",
     "rect": [283, 355, 258, 172],
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
      "file": "patches/idle/mouth_closed_dflt.png",
      "rect": [370, 470, 82, 57],
      "color_shift_rgb": [
       4.0,
       8.0,
       11.0
      ],
      "skin_samples": 992,
      "occluded_px": 0
     },
     "small": {
      "file": "patches/idle/mouth_small_dflt.png",
      "rect": [370, 470, 82, 57],
      "color_shift_rgb": [
       4.0,
       8.0,
       11.0
      ],
      "skin_samples": 992,
      "occluded_px": 0
     },
     "big": {
      "file": "patches/idle/mouth_big_dflt.png",
      "rect": [370, 470, 82, 57],
      "color_shift_rgb": [
       4.0,
       8.0,
       11.0
      ],
      "skin_samples": 992,
      "occluded_px": 0
     },
     "smile": {
      "file": "patches/idle/mouth_smile_dflt.png",
      "rect": [370, 470, 82, 57],
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
     "file": "patches/idle/blink_dflt.png",
     "rect": [283, 383, 258, 100],
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
       "file": "patches/idle/face_angry_blush.png",
       "rect": [300, 446, 224, 83],
       "blend": "multiply"
      },
      "eyesInk": {
       "file": "patches/idle/face_angry_eyes_ink.png",
       "rect": [289, 383, 247, 98]
      },
      "eyes": {
       "file": "patches/idle/face_angry_eyes.png",
       "rect": [297, 383, 232, 98],
       "color_shift_rgb": [
        -0.5,
        7.2,
        11.4
       ]
      },
      "mouthInk": {
       "file": "patches/idle/face_angry_mouth_ink.png",
       "rect": [373, 474, 82, 41]
      },
      "mouth": {
       "file": "patches/idle/face_angry_mouth.png",
       "rect": [363, 464, 102, 63],
       "color_shift_rgb": [
        -0.1,
        6.0,
        9.6
       ]
      },
      "brow": {
       "file": "patches/idle/face_angry_brow.png",
       "rect": [326, 371, 179, 36],
       "color_shift_rgb": [
        -0.7,
        5.4,
        10.0
       ]
      }
     },
     "awkward": {
      "blush": {
       "file": "patches/idle/face_awkward_blush.png",
       "rect": [300, 446, 224, 83],
       "blend": "multiply"
      },
      "eyesInk": {
       "file": "patches/idle/face_awkward_eyes_ink.png",
       "rect": [292, 382, 240, 97]
      },
      "eyes": {
       "file": "patches/idle/face_awkward_eyes.png",
       "rect": [297, 383, 232, 95],
       "color_shift_rgb": [
        -1.0,
        6.9,
        9.0
       ]
      },
      "mouthInk": {
       "file": "patches/idle/face_awkward_mouth_ink.png",
       "rect": [392, 483, 42, 10]
      },
      "mouth": {
       "file": "patches/idle/face_awkward_mouth.png",
       "rect": [370, 470, 82, 57],
       "color_shift_rgb": [
        -1.0,
        4.4,
        6.2
       ]
      },
      "brow": {
       "file": "patches/idle/face_awkward_brow.png",
       "rect": [317, 380, 182, 22],
       "color_shift_rgb": [
        -1.2,
        5.1,
        8.5
       ]
      }
     },
     "doubt": {
      "blush": {
       "file": "patches/idle/face_doubt_blush.png",
       "rect": [300, 446, 224, 83],
       "blend": "multiply"
      },
      "eyesInk": {
       "file": "patches/idle/face_doubt_eyes_ink.png",
       "rect": [292, 382, 240, 98]
      },
      "eyes": {
       "file": "patches/idle/face_doubt_eyes.png",
       "rect": [297, 382, 232, 97],
       "color_shift_rgb": [
        -0.7,
        6.2,
        10.7
       ]
      },
      "mouthInk": {
       "file": "patches/idle/face_doubt_mouth_ink.png",
       "rect": [404, 488, 11, 11]
      },
      "mouth": {
       "file": "patches/idle/face_doubt_mouth.png",
       "rect": [370, 470, 82, 57],
       "color_shift_rgb": [
        -0.0,
        5.0,
        8.5
       ]
      },
      "brow": {
       "file": "patches/idle/face_doubt_brow.png",
       "rect": [326, 373, 170, 27],
       "color_shift_rgb": [
        -0.9,
        5.5,
        10.5
       ]
      }
     },
     "flat": {
      "blush": {
       "file": "patches/idle/face_flat_blush.png",
       "rect": [300, 446, 224, 83],
       "blend": "multiply"
      },
      "eyesInk": {
       "file": "patches/idle/face_flat_eyes_ink.png",
       "rect": [293, 382, 239, 99]
      },
      "eyes": {
       "file": "patches/idle/face_flat_eyes.png",
       "rect": [297, 382, 232, 99],
       "color_shift_rgb": [
        0.4,
        12.6,
        14.0
       ]
      },
      "mouthInk": {
       "file": "patches/idle/face_flat_mouth_ink.png",
       "rect": [401, 487, 23, 10]
      },
      "mouth": {
       "file": "patches/idle/face_flat_mouth.png",
       "rect": [370, 470, 82, 57],
       "color_shift_rgb": [
        -0.0,
        4.7,
        8.2
       ]
      },
      "brow": {
       "file": "patches/idle/face_flat_brow.png",
       "rect": [314, 377, 197, 21],
       "color_shift_rgb": [
        -0.1,
        5.0,
        9.7
       ]
      }
     },
     "happy": {
      "eyesInk": {
       "file": "patches/idle/face_happy_eyes_ink.png",
       "rect": [293, 382, 238, 98]
      },
      "eyes": {
       "file": "patches/idle/face_happy_eyes.png",
       "rect": [297, 382, 232, 98],
       "color_shift_rgb": [
        -0.8,
        7.1,
        10.0
       ]
      },
      "mouthInk": {
       "file": "patches/idle/face_happy_mouth_ink.png",
       "rect": [380, 464, 67, 56]
      },
      "mouth": {
       "file": "patches/idle/face_happy_mouth.png",
       "rect": [370, 458, 87, 72],
       "color_shift_rgb": [
        -0.8,
        5.1,
        7.6
       ]
      }
     },
     "love": {
      "blush": {
       "file": "patches/idle/face_love_blush.png",
       "rect": [300, 446, 224, 83],
       "blend": "multiply"
      },
      "eyesInk": {
       "file": "patches/idle/face_love_eyes_ink.png",
       "rect": [292, 383, 240, 102]
      },
      "eyes": {
       "file": "patches/idle/face_love_eyes.png",
       "rect": [297, 383, 232, 102],
       "color_shift_rgb": [
        -0.8,
        10.5,
        12.7
       ]
      },
      "mouthInk": {
       "file": "patches/idle/face_love_mouth_ink.png",
       "rect": [390, 484, 45, 18]
      },
      "mouth": {
       "file": "patches/idle/face_love_mouth.png",
       "rect": [370, 470, 82, 57],
       "color_shift_rgb": [
        -1.0,
        7.3,
        9.9
       ]
      },
      "brow": {
       "file": "patches/idle/face_love_brow.png",
       "rect": [317, 355, 175, 15],
       "color_shift_rgb": [
        -0.6,
        6.8,
        11.2
       ]
      }
     },
     "squeeze": {
      "blush": {
       "file": "patches/idle/face_squeeze_blush.png",
       "rect": [300, 446, 224, 83],
       "blend": "multiply"
      },
      "eyesInk": {
       "file": "patches/idle/face_squeeze_eyes_ink.png",
       "rect": [294, 383, 238, 96]
      },
      "eyes": {
       "file": "patches/idle/face_squeeze_eyes.png",
       "rect": [297, 384, 232, 96],
       "color_shift_rgb": [
        0.3,
        11.4,
        12.0
       ]
      },
      "mouthInk": {
       "file": "patches/idle/face_squeeze_mouth_ink.png",
       "rect": [401, 487, 25, 9]
      },
      "mouth": {
       "file": "patches/idle/face_squeeze_mouth.png",
       "rect": [370, 470, 82, 57],
       "color_shift_rgb": [
        -0.1,
        4.1,
        6.0
       ]
      },
      "brow": {
       "file": "patches/idle/face_squeeze_brow.png",
       "rect": [335, 385, 154, 29],
       "color_shift_rgb": [
        -0.0,
        5.1,
        8.0
       ]
      }
     },
     "surprise": {
      "blush": {
       "file": "patches/idle/face_surprise_blush.png",
       "rect": [300, 446, 224, 83],
       "blend": "multiply"
      },
      "eyesInk": {
       "file": "patches/idle/face_surprise_eyes_ink.png",
       "rect": [292, 383, 240, 96]
      },
      "eyes": {
       "file": "patches/idle/face_surprise_eyes.png",
       "rect": [297, 384, 232, 96],
       "color_shift_rgb": [
        -0.8,
        5.5,
        8.5
       ]
      },
      "mouthInk": {
       "file": "patches/idle/face_surprise_mouth_ink.png",
       "rect": [402, 480, 25, 32]
      },
      "mouth": {
       "file": "patches/idle/face_surprise_mouth.png",
       "rect": [370, 469, 82, 58],
       "color_shift_rgb": [
        -0.5,
        4.4,
        7.0
       ]
      },
      "brow": {
       "file": "patches/idle/face_surprise_brow.png",
       "rect": [314, 361, 189, 24],
       "color_shift_rgb": [
        -1.0,
        4.8,
        8.8
       ]
      }
     }
    },
    "eyeSkin": {
     "file": "patches/idle/eye_skin.png",
     "rect": [298, 380, 230, 105]
    },
    "ink": {
     "default": {
      "eyes": {
       "file": "patches/idle/ink_eyes.png",
       "rect": [299, 394, 227, 80]
      },
      "mouth": {
       "file": "patches/idle/ink_mouth.png",
       "rect": [388, 483, 47, 13]
      },
      "brow": {
       "file": "patches/idle/ink_brow.png",
       "rect": [303, 365, 216, 29]
      }
     },
     "mouth": {
      "closed": {
       "file": "patches/idle/ink_mouth_closed.png",
       "rect": [388, 486, 46, 10]
      },
      "small": {
       "file": "patches/idle/ink_mouth_small.png",
       "rect": [399, 484, 24, 21]
      },
      "big": {
       "file": "patches/idle/ink_mouth_big.png",
       "rect": [388, 481, 47, 34]
      },
      "smile": {
       "file": "patches/idle/ink_mouth_smile.png",
       "rect": [382, 482, 59, 31]
      }
     },
     "blink": {
      "file": "patches/idle/ink_blink.png",
      "rect": [307, 454, 210, 13]
     }
    },
    "defaultFace": {
     "base": {
      "file": "patches/idle/default_base.png",
      "rect": [300, 354, 222, 174]
     },
     "hair": {
      "file": "patches/idle/default_hair.png",
      "rect": [282, 354, 261, 124]
     },
     "brow": {
      "file": "patches/idle/default_brow.png",
      "rect": [299, 364, 229, 52]
     },
     "orig": "../clips-b1/frames/idle.png",
     "noBrow": "../clips-b1/frames/idle_nobrow.png",
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
    "frames/think_b1_final_loop/00.png",
    "frames/think_b1_final_loop/01.png",
    "frames/think_b1_final_loop/02.png",
    "frames/think_b1_final_loop/03.png",
    "frames/think_b1_final_loop/04.png",
    "frames/think_b1_final_loop/05.png",
    "frames/think_b1_final_loop/06.png",
    "frames/think_b1_final_loop/07.png",
    "frames/think_b1_final_loop/08.png",
    "frames/think_b1_final_loop/09.png",
    "frames/think_b1_final_loop/10.png",
    "frames/think_b1_final_loop/11.png",
    "frames/think_b1_final_loop/12.png",
    "frames/think_b1_final_loop/13.png",
    "frames/think_b1_final_loop/14.png",
    "frames/think_b1_final_loop/15.png",
    "frames/think_b1_final_loop/16.png",
    "frames/think_b1_final_loop/17.png",
    "frames/think_b1_final_loop/18.png",
    "frames/think_b1_final_loop/19.png",
    "frames/think_b1_final_loop/20.png",
    "frames/think_b1_final_loop/21.png",
    "frames/think_b1_final_loop/22.png",
    "frames/think_b1_final_loop/23.png",
    "frames/think_b1_final_loop/24.png",
    "frames/think_b1_final_loop/25.png",
    "frames/think_b1_final_loop/26.png",
    "frames/think_b1_final_loop/27.png",
    "frames/think_b1_final_loop/28.png",
    "frames/think_b1_final_loop/29.png",
    "frames/think_b1_final_loop/30.png",
    "frames/think_b1_final_loop/31.png",
    "frames/think_b1_final_loop/32.png",
    "frames/think_b1_final_loop/33.png",
    "frames/think_b1_final_loop/34.png",
    "frames/think_b1_final_loop/35.png",
    "frames/think_b1_final_loop/36.png",
    "frames/think_b1_final_loop/37.png",
    "frames/think_b1_final_loop/38.png",
    "frames/think_b1_final_loop/39.png",
    "frames/think_b1_final_loop/40.png",
    "frames/think_b1_final_loop/41.png",
    "frames/think_b1_final_loop/42.png",
    "frames/think_b1_final_loop/43.png",
    "frames/think_b1_final_loop/44.png",
    "frames/think_b1_final_loop/45.png",
    "frames/think_b1_final_loop/46.png",
    "frames/think_b1_final_loop/47.png",
    "frames/think_b1_final_loop/48.png"
   ],
   "active": [
    [
     1,
     47
    ]
   ],
   "frameBBox": [
    [183, 137, 649, 1000],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [182, 134, 648, 1002],
    [182, 134, 646, 1002],
    [182, 134, 646, 1002],
    [180, 134, 646, 1002],
    [180, 134, 644, 1002],
    [180, 134, 644, 1002],
    [178, 134, 642, 1002],
    [178, 132, 642, 1002],
    [176, 132, 642, 1002],
    [176, 132, 640, 1002],
    [176, 132, 640, 1002],
    [176, 132, 640, 1002],
    [176, 132, 638, 1002],
    [174, 132, 638, 1002],
    [174, 132, 638, 1002],
    [174, 132, 638, 1002],
    [174, 132, 638, 1002],
    [174, 132, 638, 1002],
    [174, 132, 638, 1002],
    [174, 132, 638, 1002],
    [174, 132, 638, 1002],
    [174, 132, 638, 1002],
    [176, 132, 638, 1002],
    [176, 132, 638, 1002],
    [176, 132, 638, 1002],
    [176, 132, 640, 1002],
    [176, 132, 640, 1002],
    [176, 132, 640, 1002],
    [176, 134, 642, 1002],
    [178, 134, 642, 1002],
    [178, 134, 642, 1002],
    [180, 134, 644, 1002],
    [180, 134, 644, 1002],
    [180, 134, 646, 1002],
    [182, 134, 646, 1002],
    [182, 134, 646, 1002],
    [182, 134, 648, 1002],
    [182, 134, 648, 1002],
    [182, 134, 648, 1002],
    [182, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [182, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [183, 137, 649, 1000]
   ],
   "bbox": [174, 132, 649, 1002],
   "margin": [174, 132, 183, 102],
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
  "wave_b1_final_loop": {
   "label": "挥手 第一批 final s1",
   "from": "idle",
   "to": "idle",
   "fps": 16,
   "frames": [
    "frames/wave_b1_final_loop/00.png",
    "frames/wave_b1_final_loop/01.png",
    "frames/wave_b1_final_loop/02.png",
    "frames/wave_b1_final_loop/03.png",
    "frames/wave_b1_final_loop/04.png",
    "frames/wave_b1_final_loop/05.png",
    "frames/wave_b1_final_loop/06.png",
    "frames/wave_b1_final_loop/07.png",
    "frames/wave_b1_final_loop/08.png",
    "frames/wave_b1_final_loop/09.png",
    "frames/wave_b1_final_loop/10.png",
    "frames/wave_b1_final_loop/11.png",
    "frames/wave_b1_final_loop/12.png",
    "frames/wave_b1_final_loop/13.png",
    "frames/wave_b1_final_loop/14.png",
    "frames/wave_b1_final_loop/15.png",
    "frames/wave_b1_final_loop/16.png",
    "frames/wave_b1_final_loop/17.png",
    "frames/wave_b1_final_loop/18.png",
    "frames/wave_b1_final_loop/19.png",
    "frames/wave_b1_final_loop/20.png",
    "frames/wave_b1_final_loop/21.png",
    "frames/wave_b1_final_loop/22.png",
    "frames/wave_b1_final_loop/23.png",
    "frames/wave_b1_final_loop/24.png",
    "frames/wave_b1_final_loop/25.png",
    "frames/wave_b1_final_loop/26.png",
    "frames/wave_b1_final_loop/27.png",
    "frames/wave_b1_final_loop/28.png",
    "frames/wave_b1_final_loop/29.png",
    "frames/wave_b1_final_loop/30.png",
    "frames/wave_b1_final_loop/31.png",
    "frames/wave_b1_final_loop/32.png",
    "frames/wave_b1_final_loop/33.png",
    "frames/wave_b1_final_loop/34.png",
    "frames/wave_b1_final_loop/35.png",
    "frames/wave_b1_final_loop/36.png",
    "frames/wave_b1_final_loop/37.png",
    "frames/wave_b1_final_loop/38.png",
    "frames/wave_b1_final_loop/39.png",
    "frames/wave_b1_final_loop/40.png",
    "frames/wave_b1_final_loop/41.png",
    "frames/wave_b1_final_loop/42.png",
    "frames/wave_b1_final_loop/43.png",
    "frames/wave_b1_final_loop/44.png",
    "frames/wave_b1_final_loop/45.png",
    "frames/wave_b1_final_loop/46.png",
    "frames/wave_b1_final_loop/47.png",
    "frames/wave_b1_final_loop/48.png"
   ],
   "active": [
    [
     1,
     47
    ]
   ],
   "frameBBox": [
    [183, 137, 649, 1000],
    [184, 134, 648, 1002],
    [182, 134, 648, 1002],
    [182, 134, 670, 1002],
    [180, 134, 726, 1002],
    [180, 134, 730, 1002],
    [180, 132, 728, 1002],
    [178, 132, 716, 1002],
    [178, 132, 678, 1002],
    [178, 132, 678, 1002],
    [176, 132, 655, 1002],
    [176, 132, 640, 1002],
    [176, 132, 638, 1002],
    [174, 132, 638, 1002],
    [174, 132, 638, 1002],
    [174, 132, 640, 1002],
    [174, 132, 680, 1002],
    [174, 132, 692, 1002],
    [174, 132, 696, 1002],
    [174, 132, 688, 1002],
    [174, 132, 666, 1002],
    [174, 132, 638, 1002],
    [174, 132, 638, 1002],
    [174, 132, 638, 1002],
    [174, 132, 638, 1002],
    [174, 132, 638, 1002],
    [174, 132, 638, 1002],
    [174, 132, 638, 1002],
    [176, 132, 648, 1002],
    [176, 132, 668, 1002],
    [176, 132, 668, 1002],
    [176, 132, 696, 1002],
    [178, 132, 716, 1002],
    [178, 132, 737, 1002],
    [178, 132, 736, 1002],
    [178, 132, 734, 1002],
    [180, 132, 700, 1002],
    [180, 134, 658, 1002],
    [180, 134, 646, 1002],
    [182, 134, 646, 1002],
    [182, 134, 646, 1002],
    [182, 134, 648, 1002],
    [182, 134, 648, 1002],
    [182, 134, 648, 1002],
    [182, 134, 648, 1002],
    [182, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [183, 137, 649, 1000]
   ],
   "bbox": [174, 132, 737, 1002],
   "margin": [174, 132, 95, 102],
   "facePaste": true,
   "browSwap": false,
   "faceBlank": true,
   "faceClass": 1,
   "attrManual": [
    "faceBlank"
   ],
   "arc": [
    0.0,
    0.0098,
    0.0289,
    0.0667,
    0.1211,
    0.1317,
    0.1898,
    0.2407,
    0.2931,
    0.294,
    0.329,
    0.3564,
    0.3805,
    0.3821,
    0.3957,
    0.4197,
    0.4535,
    0.4751,
    0.4835,
    0.5036,
    0.5323,
    0.56,
    0.5601,
    0.5764,
    0.5801,
    0.5819,
    0.5858,
    0.6002,
    0.6189,
    0.644,
    0.6442,
    0.6864,
    0.7274,
    0.7704,
    0.8229,
    0.8229,
    0.8807,
    0.918,
    0.944,
    0.944,
    0.9631,
    0.9779,
    0.9859,
    0.986,
    0.9895,
    0.9905,
    0.9905,
    0.9905,
    1.0
   ],
   "minSeconds": 0.6
  },
  "shrug_b1_final_s1_loop": {
   "label": "摊手 第一批 final s1",
   "from": "idle",
   "to": "idle",
   "fps": 16,
   "frames": [
    "frames/shrug_b1_final_s1_loop/00.png",
    "frames/shrug_b1_final_s1_loop/01.png",
    "frames/shrug_b1_final_s1_loop/02.png",
    "frames/shrug_b1_final_s1_loop/03.png",
    "frames/shrug_b1_final_s1_loop/04.png",
    "frames/shrug_b1_final_s1_loop/05.png",
    "frames/shrug_b1_final_s1_loop/06.png",
    "frames/shrug_b1_final_s1_loop/07.png",
    "frames/shrug_b1_final_s1_loop/08.png",
    "frames/shrug_b1_final_s1_loop/09.png",
    "frames/shrug_b1_final_s1_loop/10.png",
    "frames/shrug_b1_final_s1_loop/11.png",
    "frames/shrug_b1_final_s1_loop/12.png",
    "frames/shrug_b1_final_s1_loop/13.png",
    "frames/shrug_b1_final_s1_loop/14.png",
    "frames/shrug_b1_final_s1_loop/15.png",
    "frames/shrug_b1_final_s1_loop/16.png",
    "frames/shrug_b1_final_s1_loop/17.png",
    "frames/shrug_b1_final_s1_loop/18.png",
    "frames/shrug_b1_final_s1_loop/19.png",
    "frames/shrug_b1_final_s1_loop/20.png",
    "frames/shrug_b1_final_s1_loop/21.png",
    "frames/shrug_b1_final_s1_loop/22.png",
    "frames/shrug_b1_final_s1_loop/23.png",
    "frames/shrug_b1_final_s1_loop/24.png",
    "frames/shrug_b1_final_s1_loop/25.png",
    "frames/shrug_b1_final_s1_loop/26.png",
    "frames/shrug_b1_final_s1_loop/27.png",
    "frames/shrug_b1_final_s1_loop/28.png",
    "frames/shrug_b1_final_s1_loop/29.png",
    "frames/shrug_b1_final_s1_loop/30.png",
    "frames/shrug_b1_final_s1_loop/31.png",
    "frames/shrug_b1_final_s1_loop/32.png",
    "frames/shrug_b1_final_s1_loop/33.png",
    "frames/shrug_b1_final_s1_loop/34.png",
    "frames/shrug_b1_final_s1_loop/35.png",
    "frames/shrug_b1_final_s1_loop/36.png",
    "frames/shrug_b1_final_s1_loop/37.png",
    "frames/shrug_b1_final_s1_loop/38.png",
    "frames/shrug_b1_final_s1_loop/39.png",
    "frames/shrug_b1_final_s1_loop/40.png",
    "frames/shrug_b1_final_s1_loop/41.png",
    "frames/shrug_b1_final_s1_loop/42.png",
    "frames/shrug_b1_final_s1_loop/43.png",
    "frames/shrug_b1_final_s1_loop/44.png",
    "frames/shrug_b1_final_s1_loop/45.png",
    "frames/shrug_b1_final_s1_loop/46.png",
    "frames/shrug_b1_final_s1_loop/47.png",
    "frames/shrug_b1_final_s1_loop/48.png"
   ],
   "active": [
    [
     1,
     47
    ]
   ],
   "frameBBox": [
    [183, 137, 649, 1000],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [182, 134, 652, 1002],
    [156, 134, 676, 1002],
    [144, 132, 688, 1002],
    [132, 132, 698, 1002],
    [132, 132, 698, 1002],
    [134, 132, 696, 1002],
    [136, 132, 694, 1002],
    [142, 132, 688, 1002],
    [146, 132, 684, 1002],
    [152, 132, 680, 1002],
    [152, 132, 678, 1002],
    [148, 132, 680, 1002],
    [148, 132, 682, 1002],
    [146, 132, 682, 1002],
    [148, 132, 682, 1002],
    [148, 132, 682, 1002],
    [148, 132, 682, 1002],
    [148, 132, 682, 1002],
    [146, 132, 682, 1002],
    [146, 132, 682, 1002],
    [147, 132, 682, 1002],
    [147, 132, 682, 1002],
    [146, 132, 682, 1002],
    [146, 132, 682, 1002],
    [148, 132, 682, 1002],
    [148, 132, 682, 1002],
    [148, 132, 682, 1002],
    [148, 132, 682, 1002],
    [148, 132, 682, 1002],
    [148, 132, 682, 1002],
    [148, 132, 682, 1002],
    [148, 132, 684, 1002],
    [148, 132, 682, 1002],
    [156, 132, 674, 1002],
    [166, 132, 668, 1002],
    [182, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [183, 137, 649, 1000]
   ],
   "bbox": [132, 132, 698, 1002],
   "margin": [132, 132, 134, 102],
   "facePaste": true,
   "browSwap": false,
   "faceBlank": true,
   "faceClass": 1,
   "attrManual": [
    "faceBlank"
   ],
   "arc": [
    0.0,
    0.0037,
    0.0576,
    0.1305,
    0.2299,
    0.3019,
    0.3858,
    0.3871,
    0.415,
    0.4487,
    0.5022,
    0.5396,
    0.5797,
    0.5798,
    0.5995,
    0.6073,
    0.6073,
    0.6073,
    0.6073,
    0.6073,
    0.6073,
    0.6073,
    0.6073,
    0.6073,
    0.6073,
    0.6073,
    0.6073,
    0.6073,
    0.6073,
    0.6073,
    0.6073,
    0.6073,
    0.6073,
    0.6073,
    0.6125,
    0.6432,
    0.7067,
    0.7657,
    0.8399,
    0.8872,
    0.9401,
    0.9685,
    0.9894,
    0.9946,
    0.997,
    0.997,
    0.997,
    0.997,
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
    "frames/shrug_b1_final_s2_loop/00.png",
    "frames/shrug_b1_final_s2_loop/01.png",
    "frames/shrug_b1_final_s2_loop/02.png",
    "frames/shrug_b1_final_s2_loop/03.png",
    "frames/shrug_b1_final_s2_loop/04.png",
    "frames/shrug_b1_final_s2_loop/05.png",
    "frames/shrug_b1_final_s2_loop/06.png",
    "frames/shrug_b1_final_s2_loop/07.png",
    "frames/shrug_b1_final_s2_loop/08.png",
    "frames/shrug_b1_final_s2_loop/09.png",
    "frames/shrug_b1_final_s2_loop/10.png",
    "frames/shrug_b1_final_s2_loop/11.png",
    "frames/shrug_b1_final_s2_loop/12.png",
    "frames/shrug_b1_final_s2_loop/13.png",
    "frames/shrug_b1_final_s2_loop/14.png",
    "frames/shrug_b1_final_s2_loop/15.png",
    "frames/shrug_b1_final_s2_loop/16.png",
    "frames/shrug_b1_final_s2_loop/17.png",
    "frames/shrug_b1_final_s2_loop/18.png",
    "frames/shrug_b1_final_s2_loop/19.png",
    "frames/shrug_b1_final_s2_loop/20.png",
    "frames/shrug_b1_final_s2_loop/21.png",
    "frames/shrug_b1_final_s2_loop/22.png",
    "frames/shrug_b1_final_s2_loop/23.png",
    "frames/shrug_b1_final_s2_loop/24.png",
    "frames/shrug_b1_final_s2_loop/25.png",
    "frames/shrug_b1_final_s2_loop/26.png",
    "frames/shrug_b1_final_s2_loop/27.png",
    "frames/shrug_b1_final_s2_loop/28.png",
    "frames/shrug_b1_final_s2_loop/29.png",
    "frames/shrug_b1_final_s2_loop/30.png",
    "frames/shrug_b1_final_s2_loop/31.png",
    "frames/shrug_b1_final_s2_loop/32.png",
    "frames/shrug_b1_final_s2_loop/33.png",
    "frames/shrug_b1_final_s2_loop/34.png",
    "frames/shrug_b1_final_s2_loop/35.png",
    "frames/shrug_b1_final_s2_loop/36.png",
    "frames/shrug_b1_final_s2_loop/37.png",
    "frames/shrug_b1_final_s2_loop/38.png",
    "frames/shrug_b1_final_s2_loop/39.png",
    "frames/shrug_b1_final_s2_loop/40.png",
    "frames/shrug_b1_final_s2_loop/41.png",
    "frames/shrug_b1_final_s2_loop/42.png",
    "frames/shrug_b1_final_s2_loop/43.png",
    "frames/shrug_b1_final_s2_loop/44.png",
    "frames/shrug_b1_final_s2_loop/45.png",
    "frames/shrug_b1_final_s2_loop/46.png",
    "frames/shrug_b1_final_s2_loop/47.png",
    "frames/shrug_b1_final_s2_loop/48.png"
   ],
   "active": [
    [
     1,
     47
    ]
   ],
   "frameBBox": [
    [183, 137, 649, 1000],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 650, 1002],
    [186, 134, 650, 1002],
    [186, 136, 650, 1002],
    [178, 136, 660, 1002],
    [174, 136, 668, 1002],
    [168, 136, 670, 1002],
    [164, 136, 672, 1002],
    [160, 136, 676, 1002],
    [158, 136, 678, 1002],
    [156, 136, 680, 1002],
    [154, 136, 680, 1002],
    [154, 136, 680, 1002],
    [154, 136, 682, 1002],
    [154, 136, 682, 1002],
    [154, 136, 682, 1002],
    [154, 136, 682, 1002],
    [154, 136, 682, 1002],
    [154, 136, 682, 1002],
    [154, 136, 682, 1002],
    [154, 136, 682, 1002],
    [154, 136, 682, 1002],
    [154, 136, 682, 1002],
    [154, 136, 682, 1002],
    [154, 136, 682, 1002],
    [154, 136, 682, 1002],
    [154, 136, 682, 1002],
    [154, 136, 682, 1002],
    [154, 136, 682, 1002],
    [154, 136, 682, 1002],
    [154, 136, 680, 1002],
    [156, 136, 680, 1002],
    [162, 136, 676, 1002],
    [168, 136, 666, 1002],
    [176, 136, 658, 1002],
    [184, 136, 656, 1002],
    [186, 134, 650, 1002],
    [186, 134, 650, 1002],
    [184, 135, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [183, 137, 649, 1000]
   ],
   "bbox": [154, 134, 682, 1002],
   "margin": [154, 134, 150, 102],
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
    "frames/think_b1_draft_loop/00.png",
    "frames/think_b1_draft_loop/01.png",
    "frames/think_b1_draft_loop/02.png",
    "frames/think_b1_draft_loop/03.png",
    "frames/think_b1_draft_loop/04.png",
    "frames/think_b1_draft_loop/05.png",
    "frames/think_b1_draft_loop/06.png",
    "frames/think_b1_draft_loop/07.png",
    "frames/think_b1_draft_loop/08.png",
    "frames/think_b1_draft_loop/09.png",
    "frames/think_b1_draft_loop/10.png",
    "frames/think_b1_draft_loop/11.png",
    "frames/think_b1_draft_loop/12.png",
    "frames/think_b1_draft_loop/13.png",
    "frames/think_b1_draft_loop/14.png",
    "frames/think_b1_draft_loop/15.png",
    "frames/think_b1_draft_loop/16.png",
    "frames/think_b1_draft_loop/17.png",
    "frames/think_b1_draft_loop/18.png",
    "frames/think_b1_draft_loop/19.png",
    "frames/think_b1_draft_loop/20.png",
    "frames/think_b1_draft_loop/21.png",
    "frames/think_b1_draft_loop/22.png",
    "frames/think_b1_draft_loop/23.png",
    "frames/think_b1_draft_loop/24.png",
    "frames/think_b1_draft_loop/25.png",
    "frames/think_b1_draft_loop/26.png",
    "frames/think_b1_draft_loop/27.png",
    "frames/think_b1_draft_loop/28.png",
    "frames/think_b1_draft_loop/29.png",
    "frames/think_b1_draft_loop/30.png",
    "frames/think_b1_draft_loop/31.png",
    "frames/think_b1_draft_loop/32.png",
    "frames/think_b1_draft_loop/33.png",
    "frames/think_b1_draft_loop/34.png",
    "frames/think_b1_draft_loop/35.png",
    "frames/think_b1_draft_loop/36.png",
    "frames/think_b1_draft_loop/37.png",
    "frames/think_b1_draft_loop/38.png",
    "frames/think_b1_draft_loop/39.png",
    "frames/think_b1_draft_loop/40.png",
    "frames/think_b1_draft_loop/41.png",
    "frames/think_b1_draft_loop/42.png",
    "frames/think_b1_draft_loop/43.png",
    "frames/think_b1_draft_loop/44.png",
    "frames/think_b1_draft_loop/45.png",
    "frames/think_b1_draft_loop/46.png",
    "frames/think_b1_draft_loop/47.png",
    "frames/think_b1_draft_loop/48.png"
   ],
   "active": [
    [
     1,
     47
    ]
   ],
   "frameBBox": [
    [183, 137, 649, 1000],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 136, 650, 1002],
    [184, 136, 650, 1002],
    [184, 138, 650, 1002],
    [184, 136, 648, 1002],
    [182, 134, 648, 1002],
    [180, 132, 644, 1002],
    [178, 130, 642, 1002],
    [176, 130, 640, 1002],
    [176, 128, 638, 1002],
    [174, 130, 638, 1002],
    [172, 130, 636, 1002],
    [172, 132, 636, 1002],
    [172, 132, 636, 1002],
    [172, 132, 636, 1002],
    [172, 132, 636, 1002],
    [172, 132, 636, 1002],
    [172, 132, 636, 1002],
    [172, 132, 636, 1002],
    [172, 132, 636, 1002],
    [172, 132, 636, 1002],
    [172, 132, 636, 1002],
    [172, 132, 636, 1002],
    [172, 132, 636, 1002],
    [172, 132, 636, 1002],
    [172, 132, 636, 1002],
    [172, 130, 636, 1002],
    [172, 130, 634, 1002],
    [172, 132, 634, 1002],
    [174, 132, 636, 1002],
    [176, 132, 638, 1002],
    [178, 134, 640, 1002],
    [180, 132, 644, 1002],
    [180, 132, 646, 1002],
    [182, 130, 646, 1002],
    [182, 130, 648, 1002],
    [182, 132, 648, 1002],
    [182, 132, 648, 1002],
    [182, 134, 648, 1002],
    [182, 134, 648, 1002],
    [182, 134, 648, 1002],
    [182, 134, 648, 1002],
    [182, 134, 648, 1002],
    [182, 134, 648, 1002],
    [183, 137, 649, 1000]
   ],
   "bbox": [172, 128, 650, 1002],
   "margin": [172, 128, 182, 102],
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
    "frames/wave_b1_draft_loop/00.png",
    "frames/wave_b1_draft_loop/01.png",
    "frames/wave_b1_draft_loop/02.png",
    "frames/wave_b1_draft_loop/03.png",
    "frames/wave_b1_draft_loop/04.png",
    "frames/wave_b1_draft_loop/05.png",
    "frames/wave_b1_draft_loop/06.png",
    "frames/wave_b1_draft_loop/07.png",
    "frames/wave_b1_draft_loop/08.png",
    "frames/wave_b1_draft_loop/09.png",
    "frames/wave_b1_draft_loop/10.png",
    "frames/wave_b1_draft_loop/11.png",
    "frames/wave_b1_draft_loop/12.png",
    "frames/wave_b1_draft_loop/13.png",
    "frames/wave_b1_draft_loop/14.png",
    "frames/wave_b1_draft_loop/15.png",
    "frames/wave_b1_draft_loop/16.png",
    "frames/wave_b1_draft_loop/17.png",
    "frames/wave_b1_draft_loop/18.png",
    "frames/wave_b1_draft_loop/19.png",
    "frames/wave_b1_draft_loop/20.png",
    "frames/wave_b1_draft_loop/21.png",
    "frames/wave_b1_draft_loop/22.png",
    "frames/wave_b1_draft_loop/23.png",
    "frames/wave_b1_draft_loop/24.png",
    "frames/wave_b1_draft_loop/25.png",
    "frames/wave_b1_draft_loop/26.png",
    "frames/wave_b1_draft_loop/27.png",
    "frames/wave_b1_draft_loop/28.png",
    "frames/wave_b1_draft_loop/29.png",
    "frames/wave_b1_draft_loop/30.png",
    "frames/wave_b1_draft_loop/31.png",
    "frames/wave_b1_draft_loop/32.png",
    "frames/wave_b1_draft_loop/33.png",
    "frames/wave_b1_draft_loop/34.png",
    "frames/wave_b1_draft_loop/35.png",
    "frames/wave_b1_draft_loop/36.png",
    "frames/wave_b1_draft_loop/37.png",
    "frames/wave_b1_draft_loop/38.png",
    "frames/wave_b1_draft_loop/39.png",
    "frames/wave_b1_draft_loop/40.png",
    "frames/wave_b1_draft_loop/41.png",
    "frames/wave_b1_draft_loop/42.png",
    "frames/wave_b1_draft_loop/43.png",
    "frames/wave_b1_draft_loop/44.png",
    "frames/wave_b1_draft_loop/45.png",
    "frames/wave_b1_draft_loop/46.png",
    "frames/wave_b1_draft_loop/47.png",
    "frames/wave_b1_draft_loop/48.png"
   ],
   "active": [
    [
     1,
     47
    ]
   ],
   "frameBBox": [
    [183, 137, 649, 1000],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 652, 1002],
    [180, 134, 694, 1002],
    [178, 132, 708, 1002],
    [174, 130, 714, 1002],
    [172, 130, 702, 1002],
    [168, 128, 660, 1002],
    [168, 128, 628, 1002],
    [168, 128, 630, 1002],
    [170, 128, 632, 1002],
    [172, 128, 636, 1002],
    [172, 128, 636, 1002],
    [178, 132, 642, 1002],
    [182, 134, 648, 1002],
    [186, 136, 652, 1002],
    [192, 140, 656, 1002],
    [194, 142, 658, 1002],
    [198, 144, 662, 1002],
    [198, 144, 664, 1002],
    [194, 142, 660, 1002],
    [190, 140, 658, 1002],
    [184, 138, 650, 1002],
    [182, 136, 648, 1002],
    [178, 134, 642, 1002],
    [176, 132, 640, 1002],
    [172, 132, 636, 1002],
    [170, 132, 634, 1002],
    [168, 130, 632, 1002],
    [168, 130, 630, 1002],
    [166, 130, 628, 1002],
    [164, 130, 626, 1002],
    [164, 130, 624, 1002],
    [162, 130, 626, 1002],
    [163, 130, 644, 1002],
    [166, 130, 684, 1002],
    [168, 130, 694, 1002],
    [170, 132, 694, 1002],
    [172, 132, 684, 1002],
    [176, 132, 658, 1002],
    [178, 134, 646, 1002],
    [180, 134, 644, 1002],
    [182, 134, 646, 1002],
    [182, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [183, 137, 649, 1000]
   ],
   "bbox": [162, 128, 714, 1002],
   "margin": [162, 128, 118, 102],
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
  "wave_h1_canny_loop": {
   "label": "挥手 h1 s1·canny",
   "from": "idle",
   "to": "idle",
   "fps": 16,
   "frames": [
    "frames/wave_h1_canny_loop/00.png",
    "frames/wave_h1_canny_loop/01.png",
    "frames/wave_h1_canny_loop/02.png",
    "frames/wave_h1_canny_loop/03.png",
    "frames/wave_h1_canny_loop/04.png",
    "frames/wave_h1_canny_loop/05.png",
    "frames/wave_h1_canny_loop/06.png",
    "frames/wave_h1_canny_loop/07.png",
    "frames/wave_h1_canny_loop/08.png",
    "frames/wave_h1_canny_loop/09.png",
    "frames/wave_h1_canny_loop/10.png",
    "frames/wave_h1_canny_loop/11.png",
    "frames/wave_h1_canny_loop/12.png",
    "frames/wave_h1_canny_loop/13.png",
    "frames/wave_h1_canny_loop/14.png",
    "frames/wave_h1_canny_loop/15.png",
    "frames/wave_h1_canny_loop/16.png",
    "frames/wave_h1_canny_loop/17.png",
    "frames/wave_h1_canny_loop/18.png",
    "frames/wave_h1_canny_loop/19.png",
    "frames/wave_h1_canny_loop/20.png",
    "frames/wave_h1_canny_loop/21.png",
    "frames/wave_h1_canny_loop/22.png",
    "frames/wave_h1_canny_loop/23.png",
    "frames/wave_h1_canny_loop/24.png",
    "frames/wave_h1_canny_loop/25.png",
    "frames/wave_h1_canny_loop/26.png",
    "frames/wave_h1_canny_loop/27.png",
    "frames/wave_h1_canny_loop/28.png",
    "frames/wave_h1_canny_loop/29.png",
    "frames/wave_h1_canny_loop/30.png",
    "frames/wave_h1_canny_loop/31.png",
    "frames/wave_h1_canny_loop/32.png",
    "frames/wave_h1_canny_loop/33.png",
    "frames/wave_h1_canny_loop/34.png",
    "frames/wave_h1_canny_loop/35.png",
    "frames/wave_h1_canny_loop/36.png",
    "frames/wave_h1_canny_loop/37.png",
    "frames/wave_h1_canny_loop/38.png",
    "frames/wave_h1_canny_loop/39.png",
    "frames/wave_h1_canny_loop/40.png",
    "frames/wave_h1_canny_loop/41.png",
    "frames/wave_h1_canny_loop/42.png",
    "frames/wave_h1_canny_loop/43.png",
    "frames/wave_h1_canny_loop/44.png",
    "frames/wave_h1_canny_loop/45.png",
    "frames/wave_h1_canny_loop/46.png",
    "frames/wave_h1_canny_loop/47.png",
    "frames/wave_h1_canny_loop/48.png"
   ],
   "active": [
    [
     1,
     47
    ]
   ],
   "frameBBox": [
    [183, 137, 649, 1000],
    [184, 138, 648, 1000],
    [184, 138, 648, 1000],
    [184, 138, 648, 1000],
    [180, 136, 660, 1000],
    [178, 136, 670, 1000],
    [176, 134, 682, 1000],
    [172, 134, 676, 1000],
    [170, 132, 652, 1000],
    [168, 130, 632, 1000],
    [166, 128, 632, 1000],
    [166, 128, 632, 1000],
    [168, 128, 632, 1000],
    [168, 130, 632, 1000],
    [172, 130, 636, 1000],
    [176, 134, 642, 1000],
    [180, 134, 644, 1000],
    [186, 138, 650, 1000],
    [190, 140, 654, 1000],
    [194, 144, 658, 1000],
    [196, 144, 660, 1000],
    [196, 144, 660, 1000],
    [196, 144, 660, 1000],
    [192, 142, 658, 1000],
    [192, 142, 656, 1000],
    [188, 140, 652, 1000],
    [184, 138, 650, 1000],
    [178, 136, 644, 1000],
    [176, 134, 640, 1000],
    [172, 132, 636, 1000],
    [170, 132, 634, 1000],
    [166, 130, 630, 1000],
    [164, 132, 628, 1000],
    [164, 132, 626, 1000],
    [162, 132, 624, 1000],
    [162, 132, 640, 1000],
    [164, 132, 670, 1000],
    [166, 132, 680, 1000],
    [170, 132, 676, 1000],
    [172, 134, 668, 1000],
    [176, 134, 652, 1000],
    [176, 136, 642, 1000],
    [180, 136, 644, 1000],
    [180, 136, 646, 1000],
    [182, 136, 648, 1000],
    [182, 136, 648, 1000],
    [184, 136, 648, 1000],
    [184, 136, 648, 1000],
    [183, 137, 649, 1000]
   ],
   "bbox": [162, 128, 682, 1000],
   "margin": [162, 128, 150, 104],
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
    0.0086,
    0.0163,
    0.0412,
    0.0578,
    0.0975,
    0.1226,
    0.1668,
    0.1922,
    0.2242,
    0.2336,
    0.2431,
    0.2447,
    0.2714,
    0.3096,
    0.3354,
    0.3774,
    0.4044,
    0.4408,
    0.4491,
    0.4557,
    0.4575,
    0.4769,
    0.4833,
    0.5088,
    0.5336,
    0.5742,
    0.5952,
    0.632,
    0.646,
    0.6766,
    0.6934,
    0.7031,
    0.7363,
    0.7511,
    0.7866,
    0.8091,
    0.8524,
    0.8758,
    0.921,
    0.9369,
    0.9702,
    0.9826,
    0.9983,
    1.0,
    1.0,
    1.0,
    1.0
   ],
   "minSeconds": 0.6
  },
  "think_h1_canny_loop": {
   "label": "思考 h1 s1·canny",
   "from": "idle",
   "to": "idle",
   "fps": 16,
   "frames": [
    "frames/think_h1_canny_loop/00.png",
    "frames/think_h1_canny_loop/01.png",
    "frames/think_h1_canny_loop/02.png",
    "frames/think_h1_canny_loop/03.png",
    "frames/think_h1_canny_loop/04.png",
    "frames/think_h1_canny_loop/05.png",
    "frames/think_h1_canny_loop/06.png",
    "frames/think_h1_canny_loop/07.png",
    "frames/think_h1_canny_loop/08.png",
    "frames/think_h1_canny_loop/09.png",
    "frames/think_h1_canny_loop/10.png",
    "frames/think_h1_canny_loop/11.png",
    "frames/think_h1_canny_loop/12.png",
    "frames/think_h1_canny_loop/13.png",
    "frames/think_h1_canny_loop/14.png",
    "frames/think_h1_canny_loop/15.png",
    "frames/think_h1_canny_loop/16.png",
    "frames/think_h1_canny_loop/17.png",
    "frames/think_h1_canny_loop/18.png",
    "frames/think_h1_canny_loop/19.png",
    "frames/think_h1_canny_loop/20.png",
    "frames/think_h1_canny_loop/21.png",
    "frames/think_h1_canny_loop/22.png",
    "frames/think_h1_canny_loop/23.png",
    "frames/think_h1_canny_loop/24.png",
    "frames/think_h1_canny_loop/25.png",
    "frames/think_h1_canny_loop/26.png",
    "frames/think_h1_canny_loop/27.png",
    "frames/think_h1_canny_loop/28.png",
    "frames/think_h1_canny_loop/29.png",
    "frames/think_h1_canny_loop/30.png",
    "frames/think_h1_canny_loop/31.png",
    "frames/think_h1_canny_loop/32.png",
    "frames/think_h1_canny_loop/33.png",
    "frames/think_h1_canny_loop/34.png",
    "frames/think_h1_canny_loop/35.png",
    "frames/think_h1_canny_loop/36.png",
    "frames/think_h1_canny_loop/37.png",
    "frames/think_h1_canny_loop/38.png",
    "frames/think_h1_canny_loop/39.png",
    "frames/think_h1_canny_loop/40.png",
    "frames/think_h1_canny_loop/41.png",
    "frames/think_h1_canny_loop/42.png",
    "frames/think_h1_canny_loop/43.png",
    "frames/think_h1_canny_loop/44.png",
    "frames/think_h1_canny_loop/45.png",
    "frames/think_h1_canny_loop/46.png",
    "frames/think_h1_canny_loop/47.png",
    "frames/think_h1_canny_loop/48.png"
   ],
   "active": [
    [
     1,
     47
    ]
   ],
   "frameBBox": [
    [183, 137, 649, 1000],
    [184, 136, 648, 1000],
    [184, 136, 648, 1000],
    [184, 136, 648, 1000],
    [184, 136, 648, 1000],
    [184, 138, 648, 1000],
    [184, 140, 648, 1000],
    [184, 142, 648, 1000],
    [182, 140, 647, 1000],
    [182, 138, 646, 1000],
    [180, 134, 646, 1000],
    [180, 132, 644, 1000],
    [176, 132, 642, 1000],
    [176, 132, 640, 1000],
    [174, 134, 638, 1000],
    [172, 134, 637, 1000],
    [172, 134, 636, 1000],
    [172, 134, 636, 1000],
    [172, 134, 636, 1000],
    [172, 134, 636, 1000],
    [172, 134, 636, 1000],
    [172, 134, 636, 1000],
    [172, 134, 636, 1000],
    [172, 134, 636, 1000],
    [172, 134, 636, 1000],
    [172, 134, 636, 1000],
    [172, 134, 636, 1000],
    [172, 134, 636, 1000],
    [172, 134, 636, 1000],
    [172, 134, 636, 1000],
    [172, 134, 636, 1000],
    [170, 134, 634, 1000],
    [170, 134, 634, 1000],
    [170, 134, 632, 1000],
    [172, 136, 634, 1000],
    [174, 136, 636, 1000],
    [176, 134, 640, 1000],
    [178, 134, 642, 1000],
    [180, 132, 644, 1000],
    [180, 132, 646, 1000],
    [182, 134, 646, 1000],
    [182, 136, 646, 1000],
    [182, 136, 648, 1000],
    [184, 138, 648, 1000],
    [184, 138, 648, 1000],
    [184, 138, 648, 1000],
    [184, 138, 648, 1000],
    [184, 138, 648, 1000],
    [183, 137, 649, 1000]
   ],
   "bbox": [170, 132, 649, 1000],
   "margin": [170, 132, 183, 104],
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
    0.0026,
    0.0102,
    0.0239,
    0.0367,
    0.0958,
    0.127,
    0.163,
    0.2094,
    0.3186,
    0.3642,
    0.422,
    0.4399,
    0.4827,
    0.4976,
    0.5012,
    0.5014,
    0.5014,
    0.5014,
    0.5014,
    0.5014,
    0.5014,
    0.5014,
    0.5014,
    0.5014,
    0.5014,
    0.5014,
    0.5014,
    0.5117,
    0.5135,
    0.5306,
    0.5583,
    0.5975,
    0.6551,
    0.6895,
    0.7787,
    0.8312,
    0.915,
    0.9346,
    0.9607,
    0.9731,
    0.9907,
    0.9931,
    0.9993,
    0.9998,
    0.9998,
    0.9998,
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
    "frames/wave_h1_s2_canny_loop/00.png",
    "frames/wave_h1_s2_canny_loop/01.png",
    "frames/wave_h1_s2_canny_loop/02.png",
    "frames/wave_h1_s2_canny_loop/03.png",
    "frames/wave_h1_s2_canny_loop/04.png",
    "frames/wave_h1_s2_canny_loop/05.png",
    "frames/wave_h1_s2_canny_loop/06.png",
    "frames/wave_h1_s2_canny_loop/07.png",
    "frames/wave_h1_s2_canny_loop/08.png",
    "frames/wave_h1_s2_canny_loop/09.png",
    "frames/wave_h1_s2_canny_loop/10.png",
    "frames/wave_h1_s2_canny_loop/11.png",
    "frames/wave_h1_s2_canny_loop/12.png",
    "frames/wave_h1_s2_canny_loop/13.png",
    "frames/wave_h1_s2_canny_loop/14.png",
    "frames/wave_h1_s2_canny_loop/15.png",
    "frames/wave_h1_s2_canny_loop/16.png",
    "frames/wave_h1_s2_canny_loop/17.png",
    "frames/wave_h1_s2_canny_loop/18.png",
    "frames/wave_h1_s2_canny_loop/19.png",
    "frames/wave_h1_s2_canny_loop/20.png",
    "frames/wave_h1_s2_canny_loop/21.png",
    "frames/wave_h1_s2_canny_loop/22.png",
    "frames/wave_h1_s2_canny_loop/23.png",
    "frames/wave_h1_s2_canny_loop/24.png",
    "frames/wave_h1_s2_canny_loop/25.png",
    "frames/wave_h1_s2_canny_loop/26.png",
    "frames/wave_h1_s2_canny_loop/27.png",
    "frames/wave_h1_s2_canny_loop/28.png",
    "frames/wave_h1_s2_canny_loop/29.png",
    "frames/wave_h1_s2_canny_loop/30.png",
    "frames/wave_h1_s2_canny_loop/31.png",
    "frames/wave_h1_s2_canny_loop/32.png",
    "frames/wave_h1_s2_canny_loop/33.png",
    "frames/wave_h1_s2_canny_loop/34.png",
    "frames/wave_h1_s2_canny_loop/35.png",
    "frames/wave_h1_s2_canny_loop/36.png",
    "frames/wave_h1_s2_canny_loop/37.png",
    "frames/wave_h1_s2_canny_loop/38.png",
    "frames/wave_h1_s2_canny_loop/39.png",
    "frames/wave_h1_s2_canny_loop/40.png",
    "frames/wave_h1_s2_canny_loop/41.png",
    "frames/wave_h1_s2_canny_loop/42.png",
    "frames/wave_h1_s2_canny_loop/43.png",
    "frames/wave_h1_s2_canny_loop/44.png",
    "frames/wave_h1_s2_canny_loop/45.png",
    "frames/wave_h1_s2_canny_loop/46.png",
    "frames/wave_h1_s2_canny_loop/47.png",
    "frames/wave_h1_s2_canny_loop/48.png"
   ],
   "active": [
    [
     1,
     47
    ]
   ],
   "frameBBox": [
    [183, 137, 649, 1000],
    [184, 138, 648, 1000],
    [184, 138, 648, 1000],
    [184, 138, 648, 1000],
    [182, 138, 648, 1000],
    [182, 140, 646, 1000],
    [160, 142, 644, 1000],
    [150, 142, 644, 1000],
    [152, 140, 648, 1000],
    [160, 140, 648, 1000],
    [190, 140, 652, 1000],
    [192, 140, 654, 1000],
    [196, 140, 658, 1000],
    [196, 142, 658, 1000],
    [196, 142, 658, 1000],
    [194, 142, 656, 1000],
    [192, 140, 654, 1000],
    [192, 142, 654, 1000],
    [192, 144, 656, 1000],
    [190, 142, 656, 1000],
    [190, 140, 656, 1000],
    [192, 140, 654, 1000],
    [194, 140, 654, 1000],
    [196, 142, 656, 1000],
    [194, 144, 658, 1000],
    [196, 144, 660, 1000],
    [196, 144, 658, 1000],
    [198, 144, 658, 1000],
    [202, 148, 660, 1000],
    [204, 152, 662, 1000],
    [204, 152, 662, 1000],
    [206, 152, 662, 1000],
    [206, 150, 664, 1000],
    [192, 150, 664, 1000],
    [172, 148, 662, 1000],
    [164, 146, 662, 1000],
    [152, 144, 660, 1000],
    [144, 142, 658, 1000],
    [152, 140, 654, 1000],
    [160, 140, 652, 1000],
    [186, 138, 650, 1000],
    [184, 138, 648, 1000],
    [184, 138, 648, 1000],
    [184, 136, 648, 1000],
    [184, 138, 648, 1000],
    [184, 136, 648, 1000],
    [184, 136, 648, 1000],
    [184, 136, 648, 1000],
    [183, 137, 649, 1000]
   ],
   "bbox": [144, 136, 664, 1000],
   "margin": [144, 136, 168, 104],
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
  "wave_h1_mid_canny_loop": {
   "label": "挥手 h1 s1·canny 折中档",
   "from": "idle",
   "to": "idle",
   "fps": 16,
   "frames": [
    "frames/wave_h1_mid_canny_loop/00.png",
    "frames/wave_h1_mid_canny_loop/01.png",
    "frames/wave_h1_mid_canny_loop/02.png",
    "frames/wave_h1_mid_canny_loop/03.png",
    "frames/wave_h1_mid_canny_loop/04.png",
    "frames/wave_h1_mid_canny_loop/05.png",
    "frames/wave_h1_mid_canny_loop/06.png",
    "frames/wave_h1_mid_canny_loop/07.png",
    "frames/wave_h1_mid_canny_loop/08.png",
    "frames/wave_h1_mid_canny_loop/09.png",
    "frames/wave_h1_mid_canny_loop/10.png",
    "frames/wave_h1_mid_canny_loop/11.png",
    "frames/wave_h1_mid_canny_loop/12.png",
    "frames/wave_h1_mid_canny_loop/13.png",
    "frames/wave_h1_mid_canny_loop/14.png",
    "frames/wave_h1_mid_canny_loop/15.png",
    "frames/wave_h1_mid_canny_loop/16.png",
    "frames/wave_h1_mid_canny_loop/17.png",
    "frames/wave_h1_mid_canny_loop/18.png",
    "frames/wave_h1_mid_canny_loop/19.png",
    "frames/wave_h1_mid_canny_loop/20.png",
    "frames/wave_h1_mid_canny_loop/21.png",
    "frames/wave_h1_mid_canny_loop/22.png",
    "frames/wave_h1_mid_canny_loop/23.png",
    "frames/wave_h1_mid_canny_loop/24.png",
    "frames/wave_h1_mid_canny_loop/25.png",
    "frames/wave_h1_mid_canny_loop/26.png",
    "frames/wave_h1_mid_canny_loop/27.png",
    "frames/wave_h1_mid_canny_loop/28.png",
    "frames/wave_h1_mid_canny_loop/29.png",
    "frames/wave_h1_mid_canny_loop/30.png",
    "frames/wave_h1_mid_canny_loop/31.png",
    "frames/wave_h1_mid_canny_loop/32.png",
    "frames/wave_h1_mid_canny_loop/33.png",
    "frames/wave_h1_mid_canny_loop/34.png",
    "frames/wave_h1_mid_canny_loop/35.png",
    "frames/wave_h1_mid_canny_loop/36.png",
    "frames/wave_h1_mid_canny_loop/37.png",
    "frames/wave_h1_mid_canny_loop/38.png",
    "frames/wave_h1_mid_canny_loop/39.png",
    "frames/wave_h1_mid_canny_loop/40.png",
    "frames/wave_h1_mid_canny_loop/41.png",
    "frames/wave_h1_mid_canny_loop/42.png",
    "frames/wave_h1_mid_canny_loop/43.png",
    "frames/wave_h1_mid_canny_loop/44.png",
    "frames/wave_h1_mid_canny_loop/45.png",
    "frames/wave_h1_mid_canny_loop/46.png",
    "frames/wave_h1_mid_canny_loop/47.png",
    "frames/wave_h1_mid_canny_loop/48.png"
   ],
   "active": [
    [
     1,
     47
    ]
   ],
   "frameBBox": [
    [183, 137, 649, 1000],
    [184, 138, 648, 1000],
    [184, 138, 648, 1000],
    [184, 136, 648, 1000],
    [180, 136, 660, 1000],
    [178, 136, 670, 1000],
    [176, 134, 682, 1000],
    [174, 134, 676, 1000],
    [170, 132, 652, 1000],
    [168, 130, 632, 1000],
    [166, 128, 630, 1000],
    [166, 128, 632, 1000],
    [168, 128, 632, 1000],
    [168, 128, 634, 1000],
    [172, 130, 636, 1000],
    [176, 134, 642, 1000],
    [180, 134, 644, 1000],
    [186, 138, 650, 1000],
    [188, 140, 654, 1000],
    [194, 144, 658, 1000],
    [196, 144, 660, 1000],
    [196, 144, 660, 1000],
    [196, 144, 660, 1000],
    [192, 142, 658, 1000],
    [192, 142, 656, 1000],
    [188, 138, 652, 1000],
    [184, 138, 648, 1000],
    [178, 136, 644, 1000],
    [176, 134, 640, 1000],
    [172, 132, 636, 1000],
    [170, 132, 634, 1000],
    [166, 130, 630, 1000],
    [164, 130, 628, 1000],
    [164, 132, 626, 1000],
    [162, 132, 624, 1000],
    [162, 132, 640, 1000],
    [164, 132, 670, 1000],
    [166, 132, 680, 1000],
    [170, 132, 676, 1000],
    [172, 134, 668, 1000],
    [174, 134, 652, 1000],
    [176, 136, 642, 1000],
    [180, 136, 644, 1000],
    [180, 136, 646, 1000],
    [182, 136, 648, 1000],
    [182, 138, 648, 1000],
    [184, 138, 648, 1000],
    [184, 138, 648, 1000],
    [183, 137, 649, 1000]
   ],
   "bbox": [162, 128, 682, 1000],
   "margin": [162, 128, 150, 104],
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
    0.0085,
    0.0164,
    0.0413,
    0.0586,
    0.0973,
    0.123,
    0.1667,
    0.1932,
    0.2247,
    0.2341,
    0.2441,
    0.2459,
    0.2725,
    0.3109,
    0.3368,
    0.3788,
    0.4057,
    0.4425,
    0.451,
    0.4574,
    0.4595,
    0.479,
    0.4845,
    0.5104,
    0.5348,
    0.5755,
    0.5964,
    0.6336,
    0.6467,
    0.6777,
    0.6939,
    0.7044,
    0.7369,
    0.7516,
    0.7878,
    0.8102,
    0.8532,
    0.8767,
    0.9218,
    0.9381,
    0.97,
    0.9825,
    0.9984,
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
   "id": "wave_b1_final",
   "label": "挥手 第一批 final s1",
   "in": "wave_b1_final_loop",
   "oneshot": true,
   "group": "wave_b1_final"
  },
  {
   "id": "shrug_b1_final_s1",
   "label": "摊手 第一批 final s1",
   "in": "shrug_b1_final_s1_loop",
   "oneshot": true,
   "group": "shrug_b1_final_s1"
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
   "id": "wave_h1_canny",
   "label": "挥手 h1 s1·canny",
   "in": "wave_h1_canny_loop",
   "oneshot": true,
   "group": "wave_h1_canny"
  },
  {
   "id": "think_h1_canny",
   "label": "思考 h1 s1·canny",
   "in": "think_h1_canny_loop",
   "oneshot": true,
   "group": "think_h1_canny"
  },
  {
   "id": "wave_h1_s2_canny",
   "label": "挥手 h1 s2·canny（手盖脸）",
   "in": "wave_h1_s2_canny_loop",
   "oneshot": true,
   "group": "wave_h1_s2_canny"
  },
  {
   "id": "wave_h1_mid_canny",
   "label": "挥手 h1 s1·canny 折中档",
   "in": "wave_h1_mid_canny_loop",
   "oneshot": true,
   "group": "wave_h1_mid_canny"
  }
 ],
 "minMargin": {
  "left": 132,
  "top": 128,
  "right": 95,
  "bottom": 102,
  "min": 95
 },
 "faceMode": "ink",
 "headTracks": {
  "frames/think_b1_final_loop/00.png": {
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
    "file": "track_ink/think_b1_final_loop_00.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_00.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_00_u.png",
    "rect": [297, 381, 226, 104]
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
  "frames/think_b1_final_loop/01.png": {
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
    "file": "track_ink/think_b1_final_loop_01.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_01.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_01_u.png",
    "rect": [296, 380, 226, 105]
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
  "frames/think_b1_final_loop/02.png": {
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
    "file": "track_ink/think_b1_final_loop_02.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_02.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_02_u.png",
    "rect": [296, 380, 226, 105]
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
  "frames/think_b1_final_loop/03.png": {
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
    "file": "track_ink/think_b1_final_loop_03.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_03.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_03_u.png",
    "rect": [296, 380, 226, 105]
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
  "frames/think_b1_final_loop/04.png": {
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
    "file": "track_ink/think_b1_final_loop_04.png",
    "rect": [168, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_04.png",
    "rect": [168, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_04_u.png",
    "rect": [296, 380, 226, 105]
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
  "frames/think_b1_final_loop/05.png": {
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
    "file": "track_ink/think_b1_final_loop_05.png",
    "rect": [168, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_05.png",
    "rect": [168, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_05_u.png",
    "rect": [295, 380, 227, 105]
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
  "frames/think_b1_final_loop/06.png": {
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
    "file": "track_ink/think_b1_final_loop_06.png",
    "rect": [167, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_06.png",
    "rect": [167, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_06_u.png",
    "rect": [294, 379, 226, 106]
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
  "frames/think_b1_final_loop/07.png": {
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
    "file": "track_ink/think_b1_final_loop_07.png",
    "rect": [166, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_07.png",
    "rect": [166, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_07_u.png",
    "rect": [294, 379, 226, 107]
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
  "frames/think_b1_final_loop/08.png": {
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
    "file": "track_ink/think_b1_final_loop_08.png",
    "rect": [165, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_08.png",
    "rect": [165, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_08_u.png",
    "rect": [292, 379, 226, 107]
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
  "frames/think_b1_final_loop/09.png": {
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
    "file": "track_ink/think_b1_final_loop_09.png",
    "rect": [165, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_09.png",
    "rect": [165, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_09_u.png",
    "rect": [292, 379, 226, 107]
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
  "frames/think_b1_final_loop/10.png": {
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
    "file": "track_ink/think_b1_final_loop_10.png",
    "rect": [164, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_10.png",
    "rect": [164, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_10_u.png",
    "rect": [291, 378, 227, 109]
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
  "frames/think_b1_final_loop/11.png": {
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
    "file": "track_ink/think_b1_final_loop_11.png",
    "rect": [164, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_11.png",
    "rect": [164, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_11_u.png",
    "rect": [290, 378, 226, 109]
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
  "frames/think_b1_final_loop/12.png": {
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
    "file": "track_ink/think_b1_final_loop_12.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_12.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_12_u.png",
    "rect": [290, 378, 226, 109]
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
  "frames/think_b1_final_loop/13.png": {
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
    "file": "track_ink/think_b1_final_loop_13.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_13.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_13_u.png",
    "rect": [289, 378, 228, 110]
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
  "frames/think_b1_final_loop/14.png": {
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
    "file": "track_ink/think_b1_final_loop_14.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_14.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_14_u.png",
    "rect": [289, 378, 227, 110]
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
  "frames/think_b1_final_loop/15.png": {
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
    "file": "track_ink/think_b1_final_loop_15.png",
    "rect": [162, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_15.png",
    "rect": [162, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_15_u.png",
    "rect": [288, 378, 228, 110]
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
  "frames/think_b1_final_loop/16.png": {
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
    "file": "track_ink/think_b1_final_loop_16.png",
    "rect": [162, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_16.png",
    "rect": [162, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_16_u.png",
    "rect": [288, 378, 228, 110]
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
  "frames/think_b1_final_loop/17.png": {
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
    "file": "track_ink/think_b1_final_loop_17.png",
    "rect": [162, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_17.png",
    "rect": [162, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_17_u.png",
    "rect": [288, 378, 228, 110]
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
  "frames/think_b1_final_loop/18.png": {
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
    "file": "track_ink/think_b1_final_loop_18.png",
    "rect": [162, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_18.png",
    "rect": [162, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_18_u.png",
    "rect": [288, 378, 228, 110]
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
  "frames/think_b1_final_loop/19.png": {
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
    "file": "track_ink/think_b1_final_loop_19.png",
    "rect": [162, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_19.png",
    "rect": [162, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_19_u.png",
    "rect": [288, 378, 228, 110]
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
  "frames/think_b1_final_loop/20.png": {
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
    "file": "track_ink/think_b1_final_loop_20.png",
    "rect": [162, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_20.png",
    "rect": [162, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_20_u.png",
    "rect": [288, 378, 228, 110]
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
  "frames/think_b1_final_loop/21.png": {
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
    "file": "track_ink/think_b1_final_loop_21.png",
    "rect": [162, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_21.png",
    "rect": [162, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_21_u.png",
    "rect": [288, 378, 228, 110]
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
  "frames/think_b1_final_loop/22.png": {
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
    "file": "track_ink/think_b1_final_loop_22.png",
    "rect": [162, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_22.png",
    "rect": [162, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_22_u.png",
    "rect": [288, 378, 228, 110]
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
  "frames/think_b1_final_loop/23.png": {
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
    "file": "track_ink/think_b1_final_loop_23.png",
    "rect": [162, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_23.png",
    "rect": [162, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_23_u.png",
    "rect": [288, 378, 228, 110]
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
  "frames/think_b1_final_loop/24.png": {
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
    "file": "track_ink/think_b1_final_loop_24.png",
    "rect": [162, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_24.png",
    "rect": [162, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_24_u.png",
    "rect": [288, 378, 228, 110]
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
  "frames/think_b1_final_loop/25.png": {
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
    "file": "track_ink/think_b1_final_loop_25.png",
    "rect": [162, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_25.png",
    "rect": [162, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_25_u.png",
    "rect": [288, 378, 228, 110]
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
  "frames/think_b1_final_loop/26.png": {
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
    "file": "track_ink/think_b1_final_loop_26.png",
    "rect": [162, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_26.png",
    "rect": [162, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_26_u.png",
    "rect": [288, 378, 228, 110]
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
  "frames/think_b1_final_loop/27.png": {
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
    "file": "track_ink/think_b1_final_loop_27.png",
    "rect": [162, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_27.png",
    "rect": [162, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_27_u.png",
    "rect": [288, 378, 228, 110]
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
  "frames/think_b1_final_loop/28.png": {
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
    "file": "track_ink/think_b1_final_loop_28.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_28.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_28_u.png",
    "rect": [289, 378, 227, 110]
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
  "frames/think_b1_final_loop/29.png": {
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
    "file": "track_ink/think_b1_final_loop_29.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_29.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_29_u.png",
    "rect": [289, 378, 227, 110]
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
  "frames/think_b1_final_loop/30.png": {
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
    "file": "track_ink/think_b1_final_loop_30.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_30.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_30_u.png",
    "rect": [290, 378, 226, 109]
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
  "frames/think_b1_final_loop/31.png": {
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
    "file": "track_ink/think_b1_final_loop_31.png",
    "rect": [164, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_31.png",
    "rect": [164, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_31_u.png",
    "rect": [290, 379, 228, 108]
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
  "frames/think_b1_final_loop/32.png": {
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
    "file": "track_ink/think_b1_final_loop_32.png",
    "rect": [165, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_32.png",
    "rect": [165, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_32_u.png",
    "rect": [292, 379, 226, 108]
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
  "frames/think_b1_final_loop/33.png": {
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
    "file": "track_ink/think_b1_final_loop_33.png",
    "rect": [165, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_33.png",
    "rect": [165, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_33_u.png",
    "rect": [292, 379, 226, 108]
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
  "frames/think_b1_final_loop/34.png": {
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
    "file": "track_ink/think_b1_final_loop_34.png",
    "rect": [166, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_34.png",
    "rect": [166, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_34_u.png",
    "rect": [293, 379, 227, 107]
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
  "frames/think_b1_final_loop/35.png": {
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
    "file": "track_ink/think_b1_final_loop_35.png",
    "rect": [166, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_35.png",
    "rect": [166, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_35_u.png",
    "rect": [293, 379, 227, 107]
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
  "frames/think_b1_final_loop/36.png": {
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
    "file": "track_ink/think_b1_final_loop_36.png",
    "rect": [167, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_36.png",
    "rect": [167, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_36_u.png",
    "rect": [294, 379, 228, 107]
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
  "frames/think_b1_final_loop/37.png": {
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
    "file": "track_ink/think_b1_final_loop_37.png",
    "rect": [168, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_37.png",
    "rect": [168, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_37_u.png",
    "rect": [295, 380, 226, 105]
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
  "frames/think_b1_final_loop/38.png": {
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
    "file": "track_ink/think_b1_final_loop_38.png",
    "rect": [168, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_38.png",
    "rect": [168, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_38_u.png",
    "rect": [295, 380, 227, 105]
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
  "frames/think_b1_final_loop/39.png": {
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
    "file": "track_ink/think_b1_final_loop_39.png",
    "rect": [168, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_39.png",
    "rect": [168, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_39_u.png",
    "rect": [296, 380, 226, 105]
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
  "frames/think_b1_final_loop/40.png": {
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
    "file": "track_ink/think_b1_final_loop_40.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_40.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_40_u.png",
    "rect": [296, 380, 226, 105]
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
  "frames/think_b1_final_loop/41.png": {
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
    "file": "track_ink/think_b1_final_loop_41.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_41.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_41_u.png",
    "rect": [296, 380, 226, 105]
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
  "frames/think_b1_final_loop/42.png": {
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
    "file": "track_ink/think_b1_final_loop_42.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_42.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_42_u.png",
    "rect": [296, 380, 226, 105]
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
  "frames/think_b1_final_loop/43.png": {
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
    "file": "track_ink/think_b1_final_loop_43.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_43.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_43_u.png",
    "rect": [297, 380, 225, 105]
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
  "frames/think_b1_final_loop/44.png": {
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
    "file": "track_ink/think_b1_final_loop_44.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_44.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_44_u.png",
    "rect": [297, 380, 225, 105]
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
  "frames/think_b1_final_loop/45.png": {
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
    "file": "track_ink/think_b1_final_loop_45.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_45.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_45_u.png",
    "rect": [297, 380, 225, 105]
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
  "frames/think_b1_final_loop/46.png": {
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
    "file": "track_ink/think_b1_final_loop_46.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_46.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_46_u.png",
    "rect": [297, 380, 225, 105]
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
  "frames/think_b1_final_loop/47.png": {
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
    "file": "track_ink/think_b1_final_loop_47.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_47.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_47_u.png",
    "rect": [297, 380, 225, 105]
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
  "frames/think_b1_final_loop/48.png": {
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
    "file": "track_ink/think_b1_final_loop_48.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_final_loop_48.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_final_loop_48_u.png",
    "rect": [297, 381, 226, 104]
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
  "frames/wave_b1_final_loop/00.png": {
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
    "file": "track_ink/wave_b1_final_loop_00.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_final_loop_00.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_final_loop_00_u.png",
    "rect": [297, 381, 226, 104]
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
  "frames/wave_b1_final_loop/01.png": {
   "m": [
    1.00217,
    -0.00134,
    -1.75,
    -1.01
   ],
   "scale": 1.0022,
   "rot_deg": -0.08,
   "shift": [
    -0.2,
    -0.5
   ],
   "inliers": 202,
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
    "file": "track_ink/wave_b1_final_loop_01.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_final_loop_01.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_final_loop_01_u.png",
    "rect": [296, 380, 226, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 11,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.26,
     -0.04
    ],
    "eyeR": [
     -0.02,
     0.0
    ],
    "mouth": [
     0.08,
     0.15
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_final_loop/02.png": {
   "m": [
    1.00235,
    -0.00577,
    -4.26,
    0.6
   ],
   "scale": 1.0024,
   "rot_deg": -0.33,
   "shift": [
    -0.6,
    -0.7
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
    "file": "track_ink/wave_b1_final_loop_02.png",
    "rect": [168, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_final_loop_02.png",
    "rect": [168, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_final_loop_02_u.png",
    "rect": [296, 380, 226, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.29,
     -0.11
    ],
    "eyeR": [
     -0.02,
     0.03
    ],
    "mouth": [
     0.16,
     0.15
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_final_loop/03.png": {
   "m": [
    1.0028,
    -0.00907,
    -6.54,
    1.87
   ],
   "scale": 1.0028,
   "rot_deg": -0.52,
   "shift": [
    -1.2,
    -0.5
   ],
   "inliers": 171,
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
    "file": "track_ink/wave_b1_final_loop_03.png",
    "rect": [168, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_final_loop_03.png",
    "rect": [168, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_final_loop_03_u.png",
    "rect": [295, 380, 227, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.3,
     -0.08
    ],
    "eyeR": [
     -0.02,
     0.03
    ],
    "mouth": [
     0.21,
     0.13
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_final_loop/04.png": {
   "m": [
    1.00221,
    -0.01527,
    -10.04,
    4.59
   ],
   "scale": 1.0023,
   "rot_deg": -0.87,
   "shift": [
    -2.0,
    -0.6
   ],
   "inliers": 164,
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
    "file": "track_ink/wave_b1_final_loop_04.png",
    "rect": [167, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_final_loop_04.png",
    "rect": [167, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_final_loop_04_u.png",
    "rect": [294, 379, 226, 106]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.36,
     -0.08
    ],
    "eyeR": [
     0.0,
     0.03
    ],
    "mouth": [
     0.21,
     0.13
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_final_loop/05.png": {
   "m": [
    1.00237,
    -0.01754,
    -11.51,
    5.44
   ],
   "scale": 1.0025,
   "rot_deg": -1.0,
   "shift": [
    -2.4,
    -0.6
   ],
   "inliers": 164,
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
    "file": "track_ink/wave_b1_final_loop_05.png",
    "rect": [167, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_final_loop_05.png",
    "rect": [167, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_final_loop_05_u.png",
    "rect": [294, 379, 226, 107]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.36,
     -0.03
    ],
    "eyeR": [
     0.02,
     0.08
    ],
    "mouth": [
     0.21,
     0.17
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_final_loop/06.png": {
   "m": [
    1.00242,
    -0.02391,
    -15.41,
    8.02
   ],
   "scale": 1.0027,
   "rot_deg": -1.37,
   "shift": [
    -3.3,
    -0.6
   ],
   "inliers": 159,
   "residual_px": 0.59,
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
    "file": "track_ink/wave_b1_final_loop_06.png",
    "rect": [166, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_final_loop_06.png",
    "rect": [166, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_final_loop_06_u.png",
    "rect": [292, 378, 228, 108]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 19,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.36,
     -0.03
    ],
    "eyeR": [
     0.02,
     0.08
    ],
    "mouth": [
     0.1,
     0.17
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_final_loop/07.png": {
   "m": [
    1.00183,
    -0.02997,
    -18.57,
    10.92
   ],
   "scale": 1.0023,
   "rot_deg": -1.71,
   "shift": [
    -3.9,
    -0.5
   ],
   "inliers": 158,
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
    "file": "track_ink/wave_b1_final_loop_07.png",
    "rect": [165, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_final_loop_07.png",
    "rect": [165, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_final_loop_07_u.png",
    "rect": [292, 378, 226, 108]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.35,
     -0.09
    ],
    "eyeR": [
     0.01,
     0.07
    ],
    "mouth": [
     0.15,
     0.11
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_final_loop/08.png": {
   "m": [
    1.00128,
    -0.03486,
    -21.23,
    13.21
   ],
   "scale": 1.0019,
   "rot_deg": -1.99,
   "shift": [
    -4.5,
    -0.4
   ],
   "inliers": 149,
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
    "file": "track_ink/wave_b1_final_loop_08.png",
    "rect": [165, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_final_loop_08.png",
    "rect": [165, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_final_loop_08_u.png",
    "rect": [291, 378, 227, 109]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 11,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.29,
     -0.1
    ],
    "eyeR": [
     0.01,
     0.07
    ],
    "mouth": [
     0.06,
     0.11
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_final_loop/09.png": {
   "m": [
    1.0011,
    -0.03759,
    -22.57,
    14.38
   ],
   "scale": 1.0018,
   "rot_deg": -2.15,
   "shift": [
    -4.6,
    -0.5
   ],
   "inliers": 130,
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
    "file": "track_ink/wave_b1_final_loop_09.png",
    "rect": [164, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_final_loop_09.png",
    "rect": [164, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_final_loop_09_u.png",
    "rect": [291, 377, 228, 110]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.29,
     -0.13
    ],
    "eyeR": [
     -0.01,
     0.07
    ],
    "mouth": [
     0.1,
     0.13
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_final_loop/10.png": {
   "m": [
    1.00155,
    -0.0408,
    -24.8,
    15.54
   ],
   "scale": 1.0024,
   "rot_deg": -2.33,
   "shift": [
    -5.2,
    -0.4
   ],
   "inliers": 122,
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
    "file": "track_ink/wave_b1_final_loop_10.png",
    "rect": [164, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_final_loop_10.png",
    "rect": [164, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_final_loop_10_u.png",
    "rect": [290, 377, 226, 110]
   },
   "yield_eye_px": 0,
   "yield_px": 50,
   "cover_alien_px": 12,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.37,
     -0.13
    ],
    "eyeR": [
     0.06,
     0.23
    ],
    "mouth": [
     0.1,
     0.15
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_final_loop/11.png": {
   "m": [
    1.00184,
    -0.04327,
    -26.54,
    16.25
   ],
   "scale": 1.0028,
   "rot_deg": -2.47,
   "shift": [
    -5.7,
    -0.6
   ],
   "inliers": 132,
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
    "file": "track_ink/wave_b1_final_loop_11.png",
    "rect": [163, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_final_loop_11.png",
    "rect": [163, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_final_loop_11_u.png",
    "rect": [289, 377, 227, 110]
   },
   "yield_eye_px": 0,
   "yield_px": 141,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.39,
     -0.07
    ],
    "eyeR": [
     -0.04,
     0.11
    ],
    "mouth": [
     0.14,
     0.13
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_final_loop/12.png": {
   "m": [
    1.00171,
    -0.04644,
    -28.3,
    17.79
   ],
   "scale": 1.0028,
   "rot_deg": -2.65,
   "shift": [
    -6.0,
    -0.4
   ],
   "inliers": 124,
   "residual_px": 0.66,
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
    "file": "track_ink/wave_b1_final_loop_12.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_final_loop_12.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_final_loop_12_u.png",
    "rect": [289, 377, 227, 111]
   },
   "yield_eye_px": 103,
   "yield_px": 320,
   "cover_alien_px": 3,
   "occluded": 0.006,
   "feat": {
    "eyeL": [
     0.39,
     -0.02
    ],
    "eyeR": [
     -0.03,
     0.11
    ],
    "mouth": [
     0.14,
     0.14
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_final_loop/13.png": {
   "m": [
    1.00172,
    -0.04727,
    -28.84,
    18.13
   ],
   "scale": 1.0028,
   "rot_deg": -2.7,
   "shift": [
    -6.1,
    -0.4
   ],
   "inliers": 135,
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
    "file": "track_ink/wave_b1_final_loop_13.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_final_loop_13.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_final_loop_13_u.png",
    "rect": [289, 377, 227, 111]
   },
   "yield_eye_px": 132,
   "yield_px": 353,
   "cover_alien_px": 4,
   "occluded": 0.008,
   "feat": {
    "eyeL": [
     0.39,
     -0.07
    ],
    "eyeR": [
     -0.03,
     0.11
    ],
    "mouth": [
     0.19,
     0.14
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_final_loop/14.png": {
   "m": [
    1.00084,
    -0.0492,
    -29.56,
    19.31
   ],
   "scale": 1.002,
   "rot_deg": -2.81,
   "shift": [
    -6.3,
    -0.4
   ],
   "inliers": 135,
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
    "file": "track_ink/wave_b1_final_loop_14.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_final_loop_14.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_final_loop_14_u.png",
    "rect": [288, 377, 228, 111]
   },
   "yield_eye_px": 46,
   "yield_px": 227,
   "cover_alien_px": 5,
   "occluded": 0.003,
   "feat": {
    "eyeL": [
     0.43,
     -0.07
    ],
    "eyeR": [
     0.1,
     0.13
    ],
    "mouth": [
     0.25,
     0.18
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_final_loop/15.png": {
   "m": [
    1.00081,
    -0.04916,
    -29.53,
    19.3
   ],
   "scale": 1.002,
   "rot_deg": -2.81,
   "shift": [
    -6.3,
    -0.4
   ],
   "inliers": 125,
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
    "file": "track_ink/wave_b1_final_loop_15.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_final_loop_15.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_final_loop_15_u.png",
    "rect": [288, 377, 228, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 75,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.43,
     -0.07
    ],
    "eyeR": [
     0.17,
     0.21
    ],
    "mouth": [
     0.25,
     0.18
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_final_loop/16.png": {
   "m": [
    1.00075,
    -0.04948,
    -29.61,
    19.44
   ],
   "scale": 1.002,
   "rot_deg": -2.83,
   "shift": [
    -6.3,
    -0.4
   ],
   "inliers": 135,
   "residual_px": 0.59,
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
    "file": "track_ink/wave_b1_final_loop_16.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_final_loop_16.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_final_loop_16_u.png",
    "rect": [288, 377, 228, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 8,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.43,
     -0.07
    ],
    "eyeR": [
     0.16,
     0.15
    ],
    "mouth": [
     0.25,
     0.18
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_final_loop/17.png": {
   "m": [
    1.0009,
    -0.04921,
    -29.58,
    19.31
   ],
   "scale": 1.0021,
   "rot_deg": -2.81,
   "shift": [
    -6.3,
    -0.4
   ],
   "inliers": 135,
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
    "file": "track_ink/wave_b1_final_loop_17.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_final_loop_17.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_final_loop_17_u.png",
    "rect": [288, 377, 228, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.44,
     -0.07
    ],
    "eyeR": [
     0.18,
     0.17
    ],
    "mouth": [
     0.25,
     0.18
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_final_loop/18.png": {
   "m": [
    1.00101,
    -0.04911,
    -29.61,
    19.19
   ],
   "scale": 1.0022,
   "rot_deg": -2.81,
   "shift": [
    -6.3,
    -0.4
   ],
   "inliers": 138,
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
    "file": "track_ink/wave_b1_final_loop_18.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_final_loop_18.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_final_loop_18_u.png",
    "rect": [288, 377, 228, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.48,
     -0.08
    ],
    "eyeR": [
     0.18,
     0.17
    ],
    "mouth": [
     0.25,
     0.16
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_final_loop/19.png": {
   "m": [
    1.00114,
    -0.0492,
    -29.68,
    19.19
   ],
   "scale": 1.0024,
   "rot_deg": -2.81,
   "shift": [
    -6.3,
    -0.4
   ],
   "inliers": 130,
   "residual_px": 0.59,
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
    "file": "track_ink/wave_b1_final_loop_19.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_final_loop_19.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_final_loop_19_u.png",
    "rect": [288, 377, 228, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 5,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.48,
     -0.08
    ],
    "eyeR": [
     0.18,
     0.17
    ],
    "mouth": [
     0.25,
     0.16
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_final_loop/20.png": {
   "m": [
    1.00091,
    -0.04907,
    -29.52,
    19.25
   ],
   "scale": 1.0021,
   "rot_deg": -2.81,
   "shift": [
    -6.3,
    -0.4
   ],
   "inliers": 127,
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
    "file": "track_ink/wave_b1_final_loop_20.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_final_loop_20.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_final_loop_20_u.png",
    "rect": [288, 377, 228, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 22,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.44,
     -0.09
    ],
    "eyeR": [
     0.06,
     0.18
    ],
    "mouth": [
     0.24,
     0.16
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_final_loop/21.png": {
   "m": [
    1.00124,
    -0.0504,
    -30.15,
    19.63
   ],
   "scale": 1.0025,
   "rot_deg": -2.88,
   "shift": [
    -6.2,
    -0.4
   ],
   "inliers": 142,
   "residual_px": 0.66,
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
    "file": "track_ink/wave_b1_final_loop_21.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_final_loop_21.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_final_loop_21_u.png",
    "rect": [288, 377, 228, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 159,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.43,
     -0.09
    ],
    "eyeR": [
     0.06,
     0.2
    ],
    "mouth": [
     0.21,
     0.16
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_final_loop/22.png": {
   "m": [
    1.00109,
    -0.04972,
    -29.87,
    19.37
   ],
   "scale": 1.0023,
   "rot_deg": -2.84,
   "shift": [
    -6.3,
    -0.4
   ],
   "inliers": 130,
   "residual_px": 0.53,
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
    "file": "track_ink/wave_b1_final_loop_22.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_final_loop_22.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_final_loop_22_u.png",
    "rect": [288, 377, 228, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 176,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.43,
     -0.1
    ],
    "eyeR": [
     0.08,
     0.2
    ],
    "mouth": [
     0.2,
     0.16
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_final_loop/23.png": {
   "m": [
    1.00125,
    -0.04968,
    -29.91,
    19.33
   ],
   "scale": 1.0025,
   "rot_deg": -2.84,
   "shift": [
    -6.3,
    -0.4
   ],
   "inliers": 134,
   "residual_px": 0.57,
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
    "file": "track_ink/wave_b1_final_loop_23.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_final_loop_23.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_final_loop_23_u.png",
    "rect": [288, 377, 228, 111]
   },
   "yield_eye_px": 17,
   "yield_px": 211,
   "cover_alien_px": 12,
   "occluded": 0.001,
   "feat": {
    "eyeL": [
     0.44,
     -0.09
    ],
    "eyeR": [
     0.11,
     0.2
    ],
    "mouth": [
     0.21,
     0.18
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_final_loop/24.png": {
   "m": [
    1.00108,
    -0.04962,
    -29.84,
    19.38
   ],
   "scale": 1.0023,
   "rot_deg": -2.84,
   "shift": [
    -6.3,
    -0.4
   ],
   "inliers": 133,
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
    "file": "track_ink/wave_b1_final_loop_24.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_final_loop_24.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_final_loop_24_u.png",
    "rect": [288, 377, 228, 111]
   },
   "yield_eye_px": 31,
   "yield_px": 233,
   "cover_alien_px": 12,
   "occluded": 0.002,
   "feat": {
    "eyeL": [
     0.45,
     -0.09
    ],
    "eyeR": [
     0.14,
     0.2
    ],
    "mouth": [
     0.23,
     0.18
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_final_loop/25.png": {
   "m": [
    1.00107,
    -0.04961,
    -29.84,
    19.38
   ],
   "scale": 1.0023,
   "rot_deg": -2.84,
   "shift": [
    -6.3,
    -0.4
   ],
   "inliers": 137,
   "residual_px": 0.66,
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
    "file": "track_ink/wave_b1_final_loop_25.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_final_loop_25.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_final_loop_25_u.png",
    "rect": [288, 377, 228, 111]
   },
   "yield_eye_px": 47,
   "yield_px": 251,
   "cover_alien_px": 9,
   "occluded": 0.003,
   "feat": {
    "eyeL": [
     0.46,
     -0.09
    ],
    "eyeR": [
     0.14,
     0.2
    ],
    "mouth": [
     0.23,
     0.18
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_final_loop/26.png": {
   "m": [
    1.00158,
    -0.04943,
    -29.94,
    19.09
   ],
   "scale": 1.0028,
   "rot_deg": -2.83,
   "shift": [
    -6.3,
    -0.4
   ],
   "inliers": 137,
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
    "file": "track_ink/wave_b1_final_loop_26.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_final_loop_26.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_final_loop_26_u.png",
    "rect": [288, 377, 228, 111]
   },
   "yield_eye_px": 46,
   "yield_px": 238,
   "cover_alien_px": 9,
   "occluded": 0.003,
   "feat": {
    "eyeL": [
     0.47,
     -0.09
    ],
    "eyeR": [
     0.14,
     0.2
    ],
    "mouth": [
     0.21,
     0.18
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_final_loop/27.png": {
   "m": [
    1.00101,
    -0.0497,
    -29.78,
    19.44
   ],
   "scale": 1.0022,
   "rot_deg": -2.84,
   "shift": [
    -6.2,
    -0.4
   ],
   "inliers": 125,
   "residual_px": 0.57,
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
    "file": "track_ink/wave_b1_final_loop_27.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_final_loop_27.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_final_loop_27_u.png",
    "rect": [288, 377, 228, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 165,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.47,
     -0.13
    ],
    "eyeR": [
     0.08,
     0.19
    ],
    "mouth": [
     0.19,
     0.15
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_final_loop/28.png": {
   "m": [
    1.00146,
    -0.04912,
    -29.48,
    19.02
   ],
   "scale": 1.0027,
   "rot_deg": -2.81,
   "shift": [
    -6.0,
    -0.4
   ],
   "inliers": 145,
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
    "file": "track_ink/wave_b1_final_loop_28.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_final_loop_28.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_final_loop_28_u.png",
    "rect": [289, 377, 227, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 109,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.4,
     -0.13
    ],
    "eyeR": [
     -0.01,
     0.19
    ],
    "mouth": [
     0.17,
     0.18
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_final_loop/29.png": {
   "m": [
    1.00099,
    -0.04676,
    -27.88,
    18.13
   ],
   "scale": 1.0021,
   "rot_deg": -2.67,
   "shift": [
    -5.7,
    -0.5
   ],
   "inliers": 133,
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
    "file": "track_ink/wave_b1_final_loop_29.png",
    "rect": [163, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_final_loop_29.png",
    "rect": [163, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_final_loop_29_u.png",
    "rect": [289, 377, 228, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 16,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.4,
     -0.02
    ],
    "eyeR": [
     -0.01,
     0.22
    ],
    "mouth": [
     0.19,
     0.23
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_final_loop/30.png": {
   "m": [
    1.00147,
    -0.04512,
    -27.33,
    17.22
   ],
   "scale": 1.0025,
   "rot_deg": -2.58,
   "shift": [
    -5.7,
    -0.5
   ],
   "inliers": 135,
   "residual_px": 0.64,
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
    "file": "track_ink/wave_b1_final_loop_30.png",
    "rect": [163, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_final_loop_30.png",
    "rect": [163, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_final_loop_30_u.png",
    "rect": [289, 377, 228, 110]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 10,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.45,
     0.01
    ],
    "eyeR": [
     0.02,
     0.22
    ],
    "mouth": [
     0.24,
     0.23
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_final_loop/31.png": {
   "m": [
    1.00209,
    -0.0407,
    -24.93,
    15.16
   ],
   "scale": 1.0029,
   "rot_deg": -2.33,
   "shift": [
    -5.1,
    -0.5
   ],
   "inliers": 140,
   "residual_px": 0.59,
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
    "file": "track_ink/wave_b1_final_loop_31.png",
    "rect": [164, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_final_loop_31.png",
    "rect": [164, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_final_loop_31_u.png",
    "rect": [290, 377, 226, 110]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 13,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.45,
     0.01
    ],
    "eyeR": [
     0.02,
     0.16
    ],
    "mouth": [
     0.24,
     0.18
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_final_loop/32.png": {
   "m": [
    1.00174,
    -0.03688,
    -22.31,
    13.71
   ],
   "scale": 1.0024,
   "rot_deg": -2.11,
   "shift": [
    -4.4,
    -0.6
   ],
   "inliers": 151,
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
    "file": "track_ink/wave_b1_final_loop_32.png",
    "rect": [165, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_final_loop_32.png",
    "rect": [165, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_final_loop_32_u.png",
    "rect": [291, 377, 227, 110]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 15,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.45,
     0.01
    ],
    "eyeR": [
     0.02,
     0.13
    ],
    "mouth": [
     0.24,
     0.16
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_final_loop/33.png": {
   "m": [
    1.00213,
    -0.03183,
    -19.72,
    11.52
   ],
   "scale": 1.0026,
   "rot_deg": -1.82,
   "shift": [
    -4.0,
    -0.5
   ],
   "inliers": 158,
   "residual_px": 0.59,
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
    "file": "track_ink/wave_b1_final_loop_33.png",
    "rect": [165, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_final_loop_33.png",
    "rect": [165, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_final_loop_33_u.png",
    "rect": [291, 378, 227, 109]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.36,
     -0.01
    ],
    "eyeR": [
     0.05,
     0.13
    ],
    "mouth": [
     0.21,
     0.16
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_final_loop/34.png": {
   "m": [
    1.00187,
    -0.02766,
    -16.84,
    9.86
   ],
   "scale": 1.0023,
   "rot_deg": -1.58,
   "shift": [
    -3.2,
    -0.6
   ],
   "inliers": 159,
   "residual_px": 0.59,
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
    "file": "track_ink/wave_b1_final_loop_34.png",
    "rect": [166, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_final_loop_34.png",
    "rect": [166, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_final_loop_34_u.png",
    "rect": [292, 378, 228, 108]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 18,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.42,
     -0.03
    ],
    "eyeR": [
     0.06,
     0.15
    ],
    "mouth": [
     0.33,
     0.14
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_final_loop/35.png": {
   "m": [
    1.00184,
    -0.02638,
    -16.19,
    9.32
   ],
   "scale": 1.0022,
   "rot_deg": -1.51,
   "shift": [
    -3.2,
    -0.6
   ],
   "inliers": 170,
   "residual_px": 0.58,
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
    "file": "track_ink/wave_b1_final_loop_35.png",
    "rect": [166, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_final_loop_35.png",
    "rect": [166, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_final_loop_35_u.png",
    "rect": [292, 378, 228, 108]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 15,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.36,
     -0.04
    ],
    "eyeR": [
     0.08,
     0.15
    ],
    "mouth": [
     0.24,
     0.14
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_final_loop/36.png": {
   "m": [
    1.00173,
    -0.02134,
    -12.97,
    7.35
   ],
   "scale": 1.002,
   "rot_deg": -1.22,
   "shift": [
    -2.3,
    -0.6
   ],
   "inliers": 154,
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
    "file": "track_ink/wave_b1_final_loop_36.png",
    "rect": [167, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_final_loop_36.png",
    "rect": [167, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_final_loop_36_u.png",
    "rect": [294, 379, 226, 107]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 15,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.33,
     -0.05
    ],
    "eyeR": [
     0.08,
     0.08
    ],
    "mouth": [
     0.24,
     0.14
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_final_loop/37.png": {
   "m": [
    1.00238,
    -0.01771,
    -11.02,
    5.59
   ],
   "scale": 1.0025,
   "rot_deg": -1.01,
   "shift": [
    -1.8,
    -0.5
   ],
   "inliers": 161,
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
    "file": "track_ink/wave_b1_final_loop_37.png",
    "rect": [167, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_final_loop_37.png",
    "rect": [167, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_final_loop_37_u.png",
    "rect": [294, 379, 226, 107]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.33,
     -0.05
    ],
    "eyeR": [
     0.08,
     0.08
    ],
    "mouth": [
     0.24,
     0.14
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_final_loop/38.png": {
   "m": [
    1.0029,
    -0.01433,
    -9.46,
    3.86
   ],
   "scale": 1.003,
   "rot_deg": -0.82,
   "shift": [
    -1.6,
    -0.6
   ],
   "inliers": 177,
   "residual_px": 0.55,
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
    "file": "track_ink/wave_b1_final_loop_38.png",
    "rect": [167, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_final_loop_38.png",
    "rect": [167, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_final_loop_38_u.png",
    "rect": [294, 379, 228, 106]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 15,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.35,
     -0.07
    ],
    "eyeR": [
     0.03,
     0.07
    ],
    "mouth": [
     0.27,
     0.1
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_final_loop/39.png": {
   "m": [
    1.00223,
    -0.01268,
    -8.15,
    3.64
   ],
   "scale": 1.0023,
   "rot_deg": -0.72,
   "shift": [
    -1.3,
    -0.5
   ],
   "inliers": 171,
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
    "file": "track_ink/wave_b1_final_loop_39.png",
    "rect": [168, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_final_loop_39.png",
    "rect": [168, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_final_loop_39_u.png",
    "rect": [295, 379, 227, 106]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 11,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.41,
     -0.05
    ],
    "eyeR": [
     0.07,
     0.12
    ],
    "mouth": [
     0.28,
     0.15
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_final_loop/40.png": {
   "m": [
    1.00244,
    -0.01022,
    -6.75,
    2.44
   ],
   "scale": 1.0025,
   "rot_deg": -0.58,
   "shift": [
    -1.0,
    -0.6
   ],
   "inliers": 180,
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
    "file": "track_ink/wave_b1_final_loop_40.png",
    "rect": [168, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_final_loop_40.png",
    "rect": [168, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_final_loop_40_u.png",
    "rect": [296, 379, 226, 106]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 18,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.35,
     -0.05
    ],
    "eyeR": [
     0.03,
     0.06
    ],
    "mouth": [
     0.27,
     0.12
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_final_loop/41.png": {
   "m": [
    1.00233,
    -0.00707,
    -4.88,
    1.24
   ],
   "scale": 1.0024,
   "rot_deg": -0.4,
   "shift": [
    -0.6,
    -0.6
   ],
   "inliers": 177,
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
    "file": "track_ink/wave_b1_final_loop_41.png",
    "rect": [168, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_final_loop_41.png",
    "rect": [168, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_final_loop_41_u.png",
    "rect": [296, 380, 226, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.35,
     -0.04
    ],
    "eyeR": [
     0.01,
     0.12
    ],
    "mouth": [
     0.12,
     0.15
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_final_loop/42.png": {
   "m": [
    1.00256,
    -0.00622,
    -4.41,
    0.67
   ],
   "scale": 1.0026,
   "rot_deg": -0.36,
   "shift": [
    -0.5,
    -0.7
   ],
   "inliers": 186,
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
    "file": "track_ink/wave_b1_final_loop_42.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_final_loop_42.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_final_loop_42_u.png",
    "rect": [296, 380, 226, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.35,
     -0.04
    ],
    "eyeR": [
     -0.02,
     0.12
    ],
    "mouth": [
     0.1,
     0.12
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_final_loop/43.png": {
   "m": [
    1.00287,
    -0.00531,
    -3.97,
    0.29
   ],
   "scale": 1.0029,
   "rot_deg": -0.3,
   "shift": [
    -0.3,
    -0.5
   ],
   "inliers": 169,
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
    "file": "track_ink/wave_b1_final_loop_43.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_final_loop_43.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_final_loop_43_u.png",
    "rect": [296, 380, 226, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.35,
     -0.15
    ],
    "eyeR": [
     -0.04,
     0.12
    ],
    "mouth": [
     0.1,
     0.09
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_final_loop/44.png": {
   "m": [
    1.00235,
    -0.00284,
    -2.43,
    -0.39
   ],
   "scale": 1.0024,
   "rot_deg": -0.16,
   "shift": [
    -0.2,
    -0.5
   ],
   "inliers": 185,
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
    "file": "track_ink/wave_b1_final_loop_44.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_final_loop_44.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_final_loop_44_u.png",
    "rect": [296, 380, 226, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.27,
     -0.15
    ],
    "eyeR": [
     -0.04,
     0.01
    ],
    "mouth": [
     0.1,
     0.09
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_final_loop/45.png": {
   "m": [
    1.00226,
    -0.00168,
    -1.89,
    -0.9
   ],
   "scale": 1.0023,
   "rot_deg": -0.1,
   "shift": [
    -0.2,
    -0.5
   ],
   "inliers": 187,
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
    "file": "track_ink/wave_b1_final_loop_45.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_final_loop_45.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_final_loop_45_u.png",
    "rect": [297, 380, 227, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 13,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.27,
     -0.07
    ],
    "eyeR": [
     -0.02,
     0.01
    ],
    "mouth": [
     0.16,
     0.14
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_final_loop/46.png": {
   "m": [
    1.00242,
    -0.00156,
    -1.84,
    -1.03
   ],
   "scale": 1.0024,
   "rot_deg": -0.09,
   "shift": [
    -0.1,
    -0.5
   ],
   "inliers": 195,
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
    "file": "track_ink/wave_b1_final_loop_46.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_final_loop_46.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_final_loop_46_u.png",
    "rect": [297, 380, 225, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 13,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.29,
     -0.07
    ],
    "eyeR": [
     -0.01,
     0.04
    ],
    "mouth": [
     0.17,
     0.16
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_final_loop/47.png": {
   "m": [
    1.0024,
    -0.00147,
    -1.73,
    -1.07
   ],
   "scale": 1.0024,
   "rot_deg": -0.08,
   "shift": [
    -0.1,
    -0.6
   ],
   "inliers": 190,
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
    "file": "track_ink/wave_b1_final_loop_47.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_final_loop_47.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_final_loop_47_u.png",
    "rect": [297, 380, 225, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 15,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.29,
     -0.07
    ],
    "eyeR": [
     0.0,
     0.04
    ],
    "mouth": [
     0.16,
     0.16
    ]
   },
   "w": 1.0
  },
  "frames/wave_b1_final_loop/48.png": {
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
    "file": "track_ink/wave_b1_final_loop_48.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_final_loop_48.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_final_loop_48_u.png",
    "rect": [297, 381, 226, 104]
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
  "frames/shrug_b1_final_s1_loop/00.png": {
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
    "file": "track_ink/shrug_b1_final_s1_loop_00.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s1_loop_00.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s1_loop_00_u.png",
    "rect": [297, 381, 226, 104]
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
  "frames/shrug_b1_final_s1_loop/01.png": {
   "m": [
    1.0024,
    -0.00158,
    -1.73,
    -1.25
   ],
   "scale": 1.0024,
   "rot_deg": -0.09,
   "shift": [
    -0.0,
    -0.8
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
    "file": "track_ink/shrug_b1_final_s1_loop_01.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s1_loop_01.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s1_loop_01_u.png",
    "rect": [297, 380, 225, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.19,
     0.0
    ],
    "eyeR": [
     0.0,
     0.06
    ],
    "mouth": [
     0.0,
     0.21
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s1_loop/02.png": {
   "m": [
    1.00265,
    -0.00049,
    -1.65,
    -2.31
   ],
   "scale": 1.0027,
   "rot_deg": -0.03,
   "shift": [
    -0.3,
    -1.3
   ],
   "inliers": 181,
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
    "file": "track_ink/shrug_b1_final_s1_loop_02.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s1_loop_02.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s1_loop_02_u.png",
    "rect": [296, 379, 226, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.35,
     0.07
    ],
    "eyeR": [
     0.01,
     0.06
    ],
    "mouth": [
     0.25,
     0.25
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s1_loop/03.png": {
   "m": [
    1.00233,
    -0.00161,
    -1.94,
    -1.84
   ],
   "scale": 1.0023,
   "rot_deg": -0.09,
   "shift": [
    -0.2,
    -1.4
   ],
   "inliers": 180,
   "residual_px": 0.53,
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
    "file": "track_ink/shrug_b1_final_s1_loop_03.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s1_loop_03.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s1_loop_03_u.png",
    "rect": [296, 379, 226, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.35,
     0.21
    ],
    "eyeR": [
     0.01,
     0.04
    ],
    "mouth": [
     0.25,
     0.32
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s1_loop/04.png": {
   "m": [
    1.00245,
    -0.00206,
    -2.21,
    -2.22
   ],
   "scale": 1.0025,
   "rot_deg": -0.12,
   "shift": [
    -0.2,
    -1.9
   ],
   "inliers": 176,
   "residual_px": 0.55,
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
    "file": "track_ink/shrug_b1_final_s1_loop_04.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s1_loop_04.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s1_loop_04_u.png",
    "rect": [296, 379, 226, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.35,
     0.07
    ],
    "eyeR": [
     0.01,
     0.04
    ],
    "mouth": [
     0.25,
     0.25
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s1_loop/05.png": {
   "m": [
    1.00271,
    -0.00596,
    -4.17,
    -0.77
   ],
   "scale": 1.0027,
   "rot_deg": -0.34,
   "shift": [
    -0.3,
    -2.0
   ],
   "inliers": 173,
   "residual_px": 0.56,
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
    "file": "track_ink/shrug_b1_final_s1_loop_05.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s1_loop_05.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s1_loop_05_u.png",
    "rect": [296, 378, 226, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.54,
     0.24
    ],
    "eyeR": [
     0.06,
     0.14
    ],
    "mouth": [
     0.26,
     0.29
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s1_loop/06.png": {
   "m": [
    1.00273,
    -0.0065,
    -4.46,
    -0.86
   ],
   "scale": 1.0028,
   "rot_deg": -0.37,
   "shift": [
    -0.3,
    -2.2
   ],
   "inliers": 182,
   "residual_px": 0.55,
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
    "file": "track_ink/shrug_b1_final_s1_loop_06.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s1_loop_06.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s1_loop_06_u.png",
    "rect": [296, 378, 226, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.55,
     0.24
    ],
    "eyeR": [
     0.09,
     0.14
    ],
    "mouth": [
     0.27,
     0.27
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s1_loop/07.png": {
   "m": [
    1.00277,
    -0.00703,
    -4.75,
    -0.73
   ],
   "scale": 1.0028,
   "rot_deg": -0.4,
   "shift": [
    -0.3,
    -2.3
   ],
   "inliers": 173,
   "residual_px": 0.56,
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
    "file": "track_ink/shrug_b1_final_s1_loop_07.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s1_loop_07.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s1_loop_07_u.png",
    "rect": [296, 378, 226, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.55,
     0.25
    ],
    "eyeR": [
     0.09,
     0.19
    ],
    "mouth": [
     0.29,
     0.29
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s1_loop/08.png": {
   "m": [
    1.002,
    -0.00769,
    -4.66,
    -0.32
   ],
   "scale": 1.002,
   "rot_deg": -0.44,
   "shift": [
    -0.3,
    -2.5
   ],
   "inliers": 169,
   "residual_px": 0.57,
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
    "file": "track_ink/shrug_b1_final_s1_loop_08.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s1_loop_08.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s1_loop_08_u.png",
    "rect": [296, 378, 226, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.43,
     0.28
    ],
    "eyeR": [
     0.07,
     0.17
    ],
    "mouth": [
     0.27,
     0.39
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s1_loop/09.png": {
   "m": [
    1.00171,
    -0.00791,
    -4.62,
    -0.16
   ],
   "scale": 1.0017,
   "rot_deg": -0.45,
   "shift": [
    -0.2,
    -2.6
   ],
   "inliers": 176,
   "residual_px": 0.57,
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
    "file": "track_ink/shrug_b1_final_s1_loop_09.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s1_loop_09.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s1_loop_09_u.png",
    "rect": [296, 378, 228, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.43,
     0.35
    ],
    "eyeR": [
     0.06,
     0.17
    ],
    "mouth": [
     0.29,
     0.41
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s1_loop/10.png": {
   "m": [
    1.00228,
    -0.00819,
    -5.02,
    -0.32
   ],
   "scale": 1.0023,
   "rot_deg": -0.47,
   "shift": [
    -0.3,
    -2.6
   ],
   "inliers": 177,
   "residual_px": 0.58,
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
    "file": "track_ink/shrug_b1_final_s1_loop_10.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s1_loop_10.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s1_loop_10_u.png",
    "rect": [296, 378, 228, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.44,
     0.35
    ],
    "eyeR": [
     0.04,
     0.14
    ],
    "mouth": [
     0.29,
     0.41
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s1_loop/11.png": {
   "m": [
    1.00255,
    -0.00867,
    -5.36,
    -0.18
   ],
   "scale": 1.0026,
   "rot_deg": -0.5,
   "shift": [
    -0.3,
    -2.5
   ],
   "inliers": 162,
   "residual_px": 0.56,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s1_loop_11.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s1_loop_11.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s1_loop_11_u.png",
    "rect": [296, 378, 228, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 1,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.46,
     0.29
    ],
    "eyeR": [
     0.03,
     0.12
    ],
    "mouth": [
     0.29,
     0.29
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s1_loop/12.png": {
   "m": [
    1.00245,
    -0.00893,
    -5.41,
    -0.02
   ],
   "scale": 1.0025,
   "rot_deg": -0.51,
   "shift": [
    -0.3,
    -2.5
   ],
   "inliers": 177,
   "residual_px": 0.58,
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
    "file": "track_ink/shrug_b1_final_s1_loop_12.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s1_loop_12.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s1_loop_12_u.png",
    "rect": [296, 378, 228, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 1,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.46,
     0.27
    ],
    "eyeR": [
     0.03,
     0.12
    ],
    "mouth": [
     0.27,
     0.28
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s1_loop/13.png": {
   "m": [
    1.00234,
    -0.0092,
    -5.49,
    0.15
   ],
   "scale": 1.0024,
   "rot_deg": -0.53,
   "shift": [
    -0.3,
    -2.5
   ],
   "inliers": 178,
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
    "file": "track_ink/shrug_b1_final_s1_loop_13.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s1_loop_13.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s1_loop_13_u.png",
    "rect": [296, 378, 228, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 1,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.45,
     0.25
    ],
    "eyeR": [
     0.02,
     0.12
    ],
    "mouth": [
     0.25,
     0.27
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s1_loop/14.png": {
   "m": [
    1.00251,
    -0.00915,
    -5.53,
    0.06
   ],
   "scale": 1.0025,
   "rot_deg": -0.52,
   "shift": [
    -0.2,
    -2.5
   ],
   "inliers": 181,
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
    "file": "track_ink/shrug_b1_final_s1_loop_14.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s1_loop_14.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s1_loop_14_u.png",
    "rect": [296, 378, 228, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 1,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.44,
     0.25
    ],
    "eyeR": [
     0.01,
     0.12
    ],
    "mouth": [
     0.25,
     0.27
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s1_loop/15.png": {
   "m": [
    1.00233,
    -0.00903,
    -5.39,
    0.07
   ],
   "scale": 1.0024,
   "rot_deg": -0.52,
   "shift": [
    -0.2,
    -2.5
   ],
   "inliers": 180,
   "residual_px": 0.58,
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
    "file": "track_ink/shrug_b1_final_s1_loop_15.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s1_loop_15.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s1_loop_15_u.png",
    "rect": [296, 378, 228, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 1,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.43,
     0.28
    ],
    "eyeR": [
     0.01,
     0.13
    ],
    "mouth": [
     0.25,
     0.3
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s1_loop/16.png": {
   "m": [
    1.00238,
    -0.00899,
    -5.4,
    0.03
   ],
   "scale": 1.0024,
   "rot_deg": -0.51,
   "shift": [
    -0.2,
    -2.5
   ],
   "inliers": 181,
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
    "file": "track_ink/shrug_b1_final_s1_loop_16.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s1_loop_16.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s1_loop_16_u.png",
    "rect": [296, 378, 228, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 1,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.43,
     0.28
    ],
    "eyeR": [
     0.02,
     0.13
    ],
    "mouth": [
     0.25,
     0.3
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s1_loop/17.png": {
   "m": [
    1.00244,
    -0.00881,
    -5.37,
    -0.09
   ],
   "scale": 1.0025,
   "rot_deg": -0.5,
   "shift": [
    -0.3,
    -2.6
   ],
   "inliers": 170,
   "residual_px": 0.57,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s1_loop_17.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s1_loop_17.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s1_loop_17_u.png",
    "rect": [296, 378, 228, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 1,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.43,
     0.28
    ],
    "eyeR": [
     0.03,
     0.13
    ],
    "mouth": [
     0.25,
     0.32
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s1_loop/18.png": {
   "m": [
    1.00223,
    -0.00904,
    -5.37,
    0.12
   ],
   "scale": 1.0023,
   "rot_deg": -0.52,
   "shift": [
    -0.2,
    -2.5
   ],
   "inliers": 173,
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
    "file": "track_ink/shrug_b1_final_s1_loop_18.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s1_loop_18.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s1_loop_18_u.png",
    "rect": [296, 378, 228, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 1,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.45,
     0.3
    ],
    "eyeR": [
     0.03,
     0.13
    ],
    "mouth": [
     0.26,
     0.32
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s1_loop/19.png": {
   "m": [
    1.00248,
    -0.00882,
    -5.39,
    -0.09
   ],
   "scale": 1.0025,
   "rot_deg": -0.5,
   "shift": [
    -0.3,
    -2.5
   ],
   "inliers": 162,
   "residual_px": 0.57,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s1_loop_19.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s1_loop_19.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s1_loop_19_u.png",
    "rect": [296, 378, 228, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 1,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.43,
     0.28
    ],
    "eyeR": [
     0.03,
     0.13
    ],
    "mouth": [
     0.24,
     0.31
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s1_loop/20.png": {
   "m": [
    1.00239,
    -0.00899,
    -5.41,
    0.04
   ],
   "scale": 1.0024,
   "rot_deg": -0.51,
   "shift": [
    -0.2,
    -2.5
   ],
   "inliers": 171,
   "residual_px": 0.59,
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
    "file": "track_ink/shrug_b1_final_s1_loop_20.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s1_loop_20.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s1_loop_20_u.png",
    "rect": [296, 378, 228, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 1,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.45,
     0.29
    ],
    "eyeR": [
     0.03,
     0.13
    ],
    "mouth": [
     0.24,
     0.3
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s1_loop/21.png": {
   "m": [
    1.00245,
    -0.0089,
    -5.4,
    -0.04
   ],
   "scale": 1.0025,
   "rot_deg": -0.51,
   "shift": [
    -0.3,
    -2.5
   ],
   "inliers": 177,
   "residual_px": 0.59,
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
    "file": "track_ink/shrug_b1_final_s1_loop_21.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s1_loop_21.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s1_loop_21_u.png",
    "rect": [296, 378, 228, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 1,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.43,
     0.28
    ],
    "eyeR": [
     0.02,
     0.13
    ],
    "mouth": [
     0.24,
     0.3
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s1_loop/22.png": {
   "m": [
    1.00242,
    -0.00893,
    -5.39,
    0.01
   ],
   "scale": 1.0025,
   "rot_deg": -0.51,
   "shift": [
    -0.2,
    -2.5
   ],
   "inliers": 175,
   "residual_px": 0.57,
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
    "file": "track_ink/shrug_b1_final_s1_loop_22.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s1_loop_22.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s1_loop_22_u.png",
    "rect": [296, 378, 228, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 1,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.43,
     0.28
    ],
    "eyeR": [
     0.02,
     0.12
    ],
    "mouth": [
     0.26,
     0.3
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s1_loop/23.png": {
   "m": [
    1.00242,
    -0.00886,
    -5.36,
    -0.01
   ],
   "scale": 1.0025,
   "rot_deg": -0.51,
   "shift": [
    -0.2,
    -2.5
   ],
   "inliers": 184,
   "residual_px": 0.58,
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
    "file": "track_ink/shrug_b1_final_s1_loop_23.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s1_loop_23.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s1_loop_23_u.png",
    "rect": [296, 378, 228, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 1,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.43,
     0.28
    ],
    "eyeR": [
     0.02,
     0.12
    ],
    "mouth": [
     0.26,
     0.3
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s1_loop/24.png": {
   "m": [
    1.00243,
    -0.0088,
    -5.35,
    -0.05
   ],
   "scale": 1.0025,
   "rot_deg": -0.5,
   "shift": [
    -0.3,
    -2.5
   ],
   "inliers": 184,
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
    "file": "track_ink/shrug_b1_final_s1_loop_24.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s1_loop_24.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s1_loop_24_u.png",
    "rect": [296, 378, 228, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 1,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.43,
     0.29
    ],
    "eyeR": [
     0.02,
     0.12
    ],
    "mouth": [
     0.26,
     0.29
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s1_loop/25.png": {
   "m": [
    1.00249,
    -0.00869,
    -5.31,
    -0.13
   ],
   "scale": 1.0025,
   "rot_deg": -0.5,
   "shift": [
    -0.2,
    -2.5
   ],
   "inliers": 169,
   "residual_px": 0.57,
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
    "file": "track_ink/shrug_b1_final_s1_loop_25.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s1_loop_25.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s1_loop_25_u.png",
    "rect": [296, 378, 228, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 1,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.44,
     0.31
    ],
    "eyeR": [
     0.01,
     0.12
    ],
    "mouth": [
     0.26,
     0.3
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s1_loop/26.png": {
   "m": [
    1.00258,
    -0.00848,
    -5.27,
    -0.28
   ],
   "scale": 1.0026,
   "rot_deg": -0.48,
   "shift": [
    -0.3,
    -2.5
   ],
   "inliers": 147,
   "residual_px": 0.52,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/shrug_b1_final_s1_loop_26.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s1_loop_26.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s1_loop_26_u.png",
    "rect": [296, 378, 228, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.42,
     0.31
    ],
    "eyeR": [
     -0.01,
     0.12
    ],
    "mouth": [
     0.23,
     0.29
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s1_loop/27.png": {
   "m": [
    1.00249,
    -0.0087,
    -5.3,
    -0.13
   ],
   "scale": 1.0025,
   "rot_deg": -0.5,
   "shift": [
    -0.2,
    -2.5
   ],
   "inliers": 174,
   "residual_px": 0.57,
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
    "file": "track_ink/shrug_b1_final_s1_loop_27.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s1_loop_27.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s1_loop_27_u.png",
    "rect": [296, 378, 228, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.42,
     0.31
    ],
    "eyeR": [
     -0.01,
     0.13
    ],
    "mouth": [
     0.22,
     0.28
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s1_loop/28.png": {
   "m": [
    1.0025,
    -0.00873,
    -5.31,
    -0.12
   ],
   "scale": 1.0025,
   "rot_deg": -0.5,
   "shift": [
    -0.2,
    -2.5
   ],
   "inliers": 177,
   "residual_px": 0.59,
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
    "file": "track_ink/shrug_b1_final_s1_loop_28.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s1_loop_28.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s1_loop_28_u.png",
    "rect": [296, 378, 228, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.41,
     0.31
    ],
    "eyeR": [
     -0.01,
     0.12
    ],
    "mouth": [
     0.22,
     0.28
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s1_loop/29.png": {
   "m": [
    1.00242,
    -0.00883,
    -5.31,
    -0.03
   ],
   "scale": 1.0025,
   "rot_deg": -0.5,
   "shift": [
    -0.2,
    -2.5
   ],
   "inliers": 179,
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
    "file": "track_ink/shrug_b1_final_s1_loop_29.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s1_loop_29.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s1_loop_29_u.png",
    "rect": [296, 378, 228, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.39,
     0.29
    ],
    "eyeR": [
     -0.02,
     0.12
    ],
    "mouth": [
     0.21,
     0.28
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s1_loop/30.png": {
   "m": [
    1.0025,
    -0.00872,
    -5.29,
    -0.11
   ],
   "scale": 1.0025,
   "rot_deg": -0.5,
   "shift": [
    -0.2,
    -2.5
   ],
   "inliers": 182,
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
    "file": "track_ink/shrug_b1_final_s1_loop_30.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s1_loop_30.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s1_loop_30_u.png",
    "rect": [296, 378, 228, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.39,
     0.29
    ],
    "eyeR": [
     -0.03,
     0.12
    ],
    "mouth": [
     0.2,
     0.27
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s1_loop/31.png": {
   "m": [
    1.00249,
    -0.00873,
    -5.29,
    -0.09
   ],
   "scale": 1.0025,
   "rot_deg": -0.5,
   "shift": [
    -0.2,
    -2.5
   ],
   "inliers": 172,
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
    "file": "track_ink/shrug_b1_final_s1_loop_31.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s1_loop_31.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s1_loop_31_u.png",
    "rect": [296, 378, 228, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.39,
     0.29
    ],
    "eyeR": [
     -0.03,
     0.11
    ],
    "mouth": [
     0.2,
     0.27
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s1_loop/32.png": {
   "m": [
    1.00249,
    -0.00866,
    -5.27,
    -0.11
   ],
   "scale": 1.0025,
   "rot_deg": -0.5,
   "shift": [
    -0.2,
    -2.5
   ],
   "inliers": 174,
   "residual_px": 0.59,
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
    "file": "track_ink/shrug_b1_final_s1_loop_32.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s1_loop_32.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s1_loop_32_u.png",
    "rect": [296, 378, 228, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.39,
     0.28
    ],
    "eyeR": [
     -0.02,
     0.11
    ],
    "mouth": [
     0.21,
     0.27
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s1_loop/33.png": {
   "m": [
    1.00225,
    -0.00875,
    -5.23,
    0.06
   ],
   "scale": 1.0023,
   "rot_deg": -0.5,
   "shift": [
    -0.2,
    -2.5
   ],
   "inliers": 177,
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
    "file": "track_ink/shrug_b1_final_s1_loop_33.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s1_loop_33.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s1_loop_33_u.png",
    "rect": [296, 378, 228, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.4,
     0.27
    ],
    "eyeR": [
     0.01,
     0.12
    ],
    "mouth": [
     0.21,
     0.27
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s1_loop/34.png": {
   "m": [
    1.00248,
    -0.00867,
    -5.31,
    0.0
   ],
   "scale": 1.0025,
   "rot_deg": -0.5,
   "shift": [
    -0.3,
    -2.4
   ],
   "inliers": 169,
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
    "file": "track_ink/shrug_b1_final_s1_loop_34.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s1_loop_34.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s1_loop_34_u.png",
    "rect": [296, 378, 228, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.45,
     0.23
    ],
    "eyeR": [
     0.03,
     0.13
    ],
    "mouth": [
     0.23,
     0.28
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s1_loop/35.png": {
   "m": [
    1.0026,
    -0.00845,
    -5.27,
    -0.07
   ],
   "scale": 1.0026,
   "rot_deg": -0.48,
   "shift": [
    -0.3,
    -2.3
   ],
   "inliers": 177,
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
    "file": "track_ink/shrug_b1_final_s1_loop_35.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s1_loop_35.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s1_loop_35_u.png",
    "rect": [296, 378, 228, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.48,
     0.23
    ],
    "eyeR": [
     0.04,
     0.15
    ],
    "mouth": [
     0.23,
     0.28
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s1_loop/36.png": {
   "m": [
    1.00261,
    -0.00822,
    -5.15,
    -0.02
   ],
   "scale": 1.0026,
   "rot_deg": -0.47,
   "shift": [
    -0.3,
    -2.2
   ],
   "inliers": 167,
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
    "file": "track_ink/shrug_b1_final_s1_loop_36.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s1_loop_36.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s1_loop_36_u.png",
    "rect": [296, 378, 226, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.48,
     0.18
    ],
    "eyeR": [
     0.04,
     0.15
    ],
    "mouth": [
     0.2,
     0.28
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s1_loop/37.png": {
   "m": [
    1.00234,
    -0.00851,
    -5.01,
    0.49
   ],
   "scale": 1.0024,
   "rot_deg": -0.49,
   "shift": [
    -0.1,
    -1.9
   ],
   "inliers": 185,
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
    "file": "track_ink/shrug_b1_final_s1_loop_37.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s1_loop_37.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s1_loop_37_u.png",
    "rect": [296, 378, 226, 106]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.45,
     0.0
    ],
    "eyeR": [
     0.03,
     0.15
    ],
    "mouth": [
     0.2,
     0.21
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s1_loop/38.png": {
   "m": [
    1.00255,
    -0.00703,
    -4.54,
    0.05
   ],
   "scale": 1.0026,
   "rot_deg": -0.4,
   "shift": [
    -0.2,
    -1.6
   ],
   "inliers": 178,
   "residual_px": 0.56,
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
    "file": "track_ink/shrug_b1_final_s1_loop_38.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s1_loop_38.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s1_loop_38_u.png",
    "rect": [296, 379, 228, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.3,
     -0.05
    ],
    "eyeR": [
     -0.05,
     0.04
    ],
    "mouth": [
     0.1,
     0.18
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s1_loop/39.png": {
   "m": [
    1.00206,
    -0.006,
    -3.68,
    0.25
   ],
   "scale": 1.0021,
   "rot_deg": -0.34,
   "shift": [
    -0.1,
    -1.2
   ],
   "inliers": 184,
   "residual_px": 0.5,
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
    "file": "track_ink/shrug_b1_final_s1_loop_39.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s1_loop_39.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s1_loop_39_u.png",
    "rect": [296, 379, 228, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.45,
     -0.05
    ],
    "eyeR": [
     0.03,
     -0.01
    ],
    "mouth": [
     0.22,
     0.18
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s1_loop/40.png": {
   "m": [
    1.0025,
    -0.00218,
    -2.39,
    -1.5
   ],
   "scale": 1.0025,
   "rot_deg": -0.12,
   "shift": [
    -0.4,
    -1.2
   ],
   "inliers": 190,
   "residual_px": 0.56,
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
    "file": "track_ink/shrug_b1_final_s1_loop_40.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s1_loop_40.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s1_loop_40_u.png",
    "rect": [296, 379, 226, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.33,
     0.14
    ],
    "eyeR": [
     -0.04,
     -0.01
    ],
    "mouth": [
     0.23,
     0.2
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s1_loop/41.png": {
   "m": [
    1.00253,
    -0.00221,
    -2.25,
    -1.25
   ],
   "scale": 1.0025,
   "rot_deg": -0.13,
   "shift": [
    -0.2,
    -1.0
   ],
   "inliers": 197,
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
    "file": "track_ink/shrug_b1_final_s1_loop_41.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s1_loop_41.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s1_loop_41_u.png",
    "rect": [296, 380, 226, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.33,
     0.14
    ],
    "eyeR": [
     -0.04,
     0.01
    ],
    "mouth": [
     0.23,
     0.2
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s1_loop/42.png": {
   "m": [
    1.00257,
    -0.00206,
    -2.11,
    -1.13
   ],
   "scale": 1.0026,
   "rot_deg": -0.12,
   "shift": [
    -0.1,
    -0.8
   ],
   "inliers": 209,
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
    "file": "track_ink/shrug_b1_final_s1_loop_42.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s1_loop_42.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s1_loop_42_u.png",
    "rect": [297, 380, 225, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.27,
     0.01
    ],
    "eyeR": [
     -0.09,
     0.01
    ],
    "mouth": [
     0.12,
     0.16
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s1_loop/43.png": {
   "m": [
    1.00257,
    -0.00195,
    -2.0,
    -1.06
   ],
   "scale": 1.0026,
   "rot_deg": -0.11,
   "shift": [
    -0.0,
    -0.7
   ],
   "inliers": 207,
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
    "file": "track_ink/shrug_b1_final_s1_loop_43.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s1_loop_43.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s1_loop_43_u.png",
    "rect": [297, 380, 225, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.24,
     -0.06
    ],
    "eyeR": [
     -0.09,
     0.04
    ],
    "mouth": [
     0.11,
     0.16
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s1_loop/44.png": {
   "m": [
    1.00224,
    -0.00193,
    -1.85,
    -0.86
   ],
   "scale": 1.0022,
   "rot_deg": -0.11,
   "shift": [
    -0.0,
    -0.6
   ],
   "inliers": 208,
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
    "file": "track_ink/shrug_b1_final_s1_loop_44.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s1_loop_44.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s1_loop_44_u.png",
    "rect": [297, 380, 225, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.24,
     -0.06
    ],
    "eyeR": [
     -0.06,
     0.08
    ],
    "mouth": [
     0.11,
     0.16
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s1_loop/45.png": {
   "m": [
    1.00226,
    -0.00138,
    -1.65,
    -1.06
   ],
   "scale": 1.0023,
   "rot_deg": -0.08,
   "shift": [
    -0.1,
    -0.6
   ],
   "inliers": 197,
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
    "file": "track_ink/shrug_b1_final_s1_loop_45.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s1_loop_45.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s1_loop_45_u.png",
    "rect": [297, 380, 225, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.27,
     -0.08
    ],
    "eyeR": [
     -0.03,
     0.09
    ],
    "mouth": [
     0.11,
     0.17
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s1_loop/46.png": {
   "m": [
    1.00226,
    -0.00138,
    -1.63,
    -1.05
   ],
   "scale": 1.0023,
   "rot_deg": -0.08,
   "shift": [
    -0.1,
    -0.6
   ],
   "inliers": 201,
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
    "file": "track_ink/shrug_b1_final_s1_loop_46.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s1_loop_46.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s1_loop_46_u.png",
    "rect": [297, 380, 225, 105]
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
     -0.03,
     0.09
    ],
    "mouth": [
     0.13,
     0.18
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s1_loop/47.png": {
   "m": [
    1.00223,
    -0.00124,
    -1.54,
    -1.1
   ],
   "scale": 1.0022,
   "rot_deg": -0.07,
   "shift": [
    -0.1,
    -0.6
   ],
   "inliers": 189,
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
    "file": "track_ink/shrug_b1_final_s1_loop_47.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s1_loop_47.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s1_loop_47_u.png",
    "rect": [297, 380, 225, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.26,
     -0.07
    ],
    "eyeR": [
     -0.03,
     0.09
    ],
    "mouth": [
     0.1,
     0.18
    ]
   },
   "w": 1.0
  },
  "frames/shrug_b1_final_s1_loop/48.png": {
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
    "file": "track_ink/shrug_b1_final_s1_loop_48.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s1_loop_48.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s1_loop_48_u.png",
    "rect": [297, 381, 226, 104]
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
  "frames/shrug_b1_final_s2_loop/00.png": {
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
    "file": "track_ink/shrug_b1_final_s2_loop_00.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_00.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_00_u.png",
    "rect": [297, 381, 226, 104]
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
  "frames/shrug_b1_final_s2_loop/01.png": {
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
    "file": "track_ink/shrug_b1_final_s2_loop_01.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_01.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_01_u.png",
    "rect": [297, 380, 227, 104]
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
  "frames/shrug_b1_final_s2_loop/02.png": {
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
    "file": "track_ink/shrug_b1_final_s2_loop_02.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_02.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_02_u.png",
    "rect": [298, 380, 227, 104]
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
  "frames/shrug_b1_final_s2_loop/03.png": {
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
    "file": "track_ink/shrug_b1_final_s2_loop_03.png",
    "rect": [170, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_03.png",
    "rect": [170, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_03_u.png",
    "rect": [298, 380, 227, 104]
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
  "frames/shrug_b1_final_s2_loop/04.png": {
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
    "file": "track_ink/shrug_b1_final_s2_loop_04.png",
    "rect": [170, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_04.png",
    "rect": [170, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_04_u.png",
    "rect": [299, 379, 227, 105]
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
  "frames/shrug_b1_final_s2_loop/05.png": {
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
    "file": "track_ink/shrug_b1_final_s2_loop_05.png",
    "rect": [170, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_05.png",
    "rect": [170, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_05_u.png",
    "rect": [299, 378, 227, 106]
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
  "frames/shrug_b1_final_s2_loop/06.png": {
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
    "file": "track_ink/shrug_b1_final_s2_loop_06.png",
    "rect": [171, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_06.png",
    "rect": [171, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_06_u.png",
    "rect": [300, 377, 226, 107]
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
  "frames/shrug_b1_final_s2_loop/07.png": {
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
    "file": "track_ink/shrug_b1_final_s2_loop_07.png",
    "rect": [171, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_07.png",
    "rect": [171, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_07_u.png",
    "rect": [300, 377, 226, 107]
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
  "frames/shrug_b1_final_s2_loop/08.png": {
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
    "file": "track_ink/shrug_b1_final_s2_loop_08.png",
    "rect": [171, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_08.png",
    "rect": [171, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_08_u.png",
    "rect": [301, 376, 225, 108]
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
  "frames/shrug_b1_final_s2_loop/09.png": {
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
    "file": "track_ink/shrug_b1_final_s2_loop_09.png",
    "rect": [171, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_09.png",
    "rect": [171, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_09_u.png",
    "rect": [301, 376, 225, 108]
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
  "frames/shrug_b1_final_s2_loop/10.png": {
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
    "file": "track_ink/shrug_b1_final_s2_loop_10.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_10.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_10_u.png",
    "rect": [301, 375, 225, 109]
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
  "frames/shrug_b1_final_s2_loop/11.png": {
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
    "file": "track_ink/shrug_b1_final_s2_loop_11.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_11.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_11_u.png",
    "rect": [301, 375, 225, 109]
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
  "frames/shrug_b1_final_s2_loop/12.png": {
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
    "file": "track_ink/shrug_b1_final_s2_loop_12.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_12.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_12_u.png",
    "rect": [301, 375, 225, 109]
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
  "frames/shrug_b1_final_s2_loop/13.png": {
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
    "file": "track_ink/shrug_b1_final_s2_loop_13.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_13.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_13_u.png",
    "rect": [301, 375, 225, 109]
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
  "frames/shrug_b1_final_s2_loop/14.png": {
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
    "file": "track_ink/shrug_b1_final_s2_loop_14.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_14.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_14_u.png",
    "rect": [301, 375, 225, 109]
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
  "frames/shrug_b1_final_s2_loop/15.png": {
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
    "file": "track_ink/shrug_b1_final_s2_loop_15.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_15.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_15_u.png",
    "rect": [301, 375, 225, 109]
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
  "frames/shrug_b1_final_s2_loop/16.png": {
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
    "file": "track_ink/shrug_b1_final_s2_loop_16.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_16.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_16_u.png",
    "rect": [301, 375, 225, 109]
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
  "frames/shrug_b1_final_s2_loop/17.png": {
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
    "file": "track_ink/shrug_b1_final_s2_loop_17.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_17.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_17_u.png",
    "rect": [301, 375, 227, 109]
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
  "frames/shrug_b1_final_s2_loop/18.png": {
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
    "file": "track_ink/shrug_b1_final_s2_loop_18.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_18.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_18_u.png",
    "rect": [301, 375, 227, 109]
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
  "frames/shrug_b1_final_s2_loop/19.png": {
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
    "file": "track_ink/shrug_b1_final_s2_loop_19.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_19.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_19_u.png",
    "rect": [301, 375, 227, 109]
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
  "frames/shrug_b1_final_s2_loop/20.png": {
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
    "file": "track_ink/shrug_b1_final_s2_loop_20.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_20.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_20_u.png",
    "rect": [301, 375, 227, 109]
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
  "frames/shrug_b1_final_s2_loop/21.png": {
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
    "file": "track_ink/shrug_b1_final_s2_loop_21.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_21.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_21_u.png",
    "rect": [301, 375, 225, 109]
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
  "frames/shrug_b1_final_s2_loop/22.png": {
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
    "file": "track_ink/shrug_b1_final_s2_loop_22.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_22.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_22_u.png",
    "rect": [301, 375, 225, 109]
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
  "frames/shrug_b1_final_s2_loop/23.png": {
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
    "file": "track_ink/shrug_b1_final_s2_loop_23.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_23.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_23_u.png",
    "rect": [301, 375, 225, 109]
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
  "frames/shrug_b1_final_s2_loop/24.png": {
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
    "file": "track_ink/shrug_b1_final_s2_loop_24.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_24.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_24_u.png",
    "rect": [301, 375, 225, 109]
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
  "frames/shrug_b1_final_s2_loop/25.png": {
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
    "file": "track_ink/shrug_b1_final_s2_loop_25.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_25.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_25_u.png",
    "rect": [301, 375, 225, 109]
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
  "frames/shrug_b1_final_s2_loop/26.png": {
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
    "file": "track_ink/shrug_b1_final_s2_loop_26.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_26.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_26_u.png",
    "rect": [301, 375, 227, 109]
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
  "frames/shrug_b1_final_s2_loop/27.png": {
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
    "file": "track_ink/shrug_b1_final_s2_loop_27.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_27.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_27_u.png",
    "rect": [301, 375, 227, 109]
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
  "frames/shrug_b1_final_s2_loop/28.png": {
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
    "file": "track_ink/shrug_b1_final_s2_loop_28.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_28.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_28_u.png",
    "rect": [301, 375, 227, 109]
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
  "frames/shrug_b1_final_s2_loop/29.png": {
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
    "file": "track_ink/shrug_b1_final_s2_loop_29.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_29.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_29_u.png",
    "rect": [301, 375, 227, 109]
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
  "frames/shrug_b1_final_s2_loop/30.png": {
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
    "file": "track_ink/shrug_b1_final_s2_loop_30.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_30.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_30_u.png",
    "rect": [301, 375, 227, 109]
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
  "frames/shrug_b1_final_s2_loop/31.png": {
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
    "file": "track_ink/shrug_b1_final_s2_loop_31.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_31.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_31_u.png",
    "rect": [301, 375, 225, 109]
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
  "frames/shrug_b1_final_s2_loop/32.png": {
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
    "file": "track_ink/shrug_b1_final_s2_loop_32.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_32.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_32_u.png",
    "rect": [301, 375, 225, 108]
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
  "frames/shrug_b1_final_s2_loop/33.png": {
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
    "file": "track_ink/shrug_b1_final_s2_loop_33.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_33.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_33_u.png",
    "rect": [301, 376, 225, 107]
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
  "frames/shrug_b1_final_s2_loop/34.png": {
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
    "file": "track_ink/shrug_b1_final_s2_loop_34.png",
    "rect": [171, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_34.png",
    "rect": [171, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_34_u.png",
    "rect": [300, 376, 226, 108]
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
  "frames/shrug_b1_final_s2_loop/35.png": {
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
    "file": "track_ink/shrug_b1_final_s2_loop_35.png",
    "rect": [171, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_35.png",
    "rect": [171, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_35_u.png",
    "rect": [300, 376, 228, 107]
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
  "frames/shrug_b1_final_s2_loop/36.png": {
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
    "file": "track_ink/shrug_b1_final_s2_loop_36.png",
    "rect": [170, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_36.png",
    "rect": [170, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_36_u.png",
    "rect": [300, 377, 226, 107]
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
  "frames/shrug_b1_final_s2_loop/37.png": {
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
    "file": "track_ink/shrug_b1_final_s2_loop_37.png",
    "rect": [170, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_37.png",
    "rect": [170, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_37_u.png",
    "rect": [300, 378, 226, 106]
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
  "frames/shrug_b1_final_s2_loop/38.png": {
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
    "file": "track_ink/shrug_b1_final_s2_loop_38.png",
    "rect": [170, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_38.png",
    "rect": [170, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_38_u.png",
    "rect": [299, 379, 226, 105]
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
  "frames/shrug_b1_final_s2_loop/39.png": {
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
    "file": "track_ink/shrug_b1_final_s2_loop_39.png",
    "rect": [170, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_39.png",
    "rect": [170, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_39_u.png",
    "rect": [298, 379, 227, 105]
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
  "frames/shrug_b1_final_s2_loop/40.png": {
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
    "file": "track_ink/shrug_b1_final_s2_loop_40.png",
    "rect": [170, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_40.png",
    "rect": [170, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_40_u.png",
    "rect": [298, 380, 226, 104]
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
  "frames/shrug_b1_final_s2_loop/41.png": {
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
    "file": "track_ink/shrug_b1_final_s2_loop_41.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_41.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_41_u.png",
    "rect": [298, 380, 228, 104]
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
  "frames/shrug_b1_final_s2_loop/42.png": {
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
    "file": "track_ink/shrug_b1_final_s2_loop_42.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_42.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_42_u.png",
    "rect": [298, 380, 226, 104]
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
  "frames/shrug_b1_final_s2_loop/43.png": {
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
    "file": "track_ink/shrug_b1_final_s2_loop_43.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_43.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_43_u.png",
    "rect": [297, 380, 227, 104]
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
  "frames/shrug_b1_final_s2_loop/44.png": {
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
    "file": "track_ink/shrug_b1_final_s2_loop_44.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_44.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_44_u.png",
    "rect": [297, 380, 227, 104]
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
  "frames/shrug_b1_final_s2_loop/45.png": {
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
    "file": "track_ink/shrug_b1_final_s2_loop_45.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_45.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_45_u.png",
    "rect": [297, 380, 227, 104]
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
  "frames/shrug_b1_final_s2_loop/46.png": {
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
    "file": "track_ink/shrug_b1_final_s2_loop_46.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_46.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_46_u.png",
    "rect": [297, 380, 227, 104]
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
  "frames/shrug_b1_final_s2_loop/47.png": {
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
    "file": "track_ink/shrug_b1_final_s2_loop_47.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_47.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_47_u.png",
    "rect": [297, 380, 227, 105]
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
  "frames/shrug_b1_final_s2_loop/48.png": {
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
    "file": "track_ink/shrug_b1_final_s2_loop_48.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/shrug_b1_final_s2_loop_48.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_b1_final_s2_loop_48_u.png",
    "rect": [297, 381, 226, 104]
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
  "frames/think_b1_draft_loop/00.png": {
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
    "file": "track_ink/think_b1_draft_loop_00.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_00.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_00_u.png",
    "rect": [297, 381, 226, 104]
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
  "frames/think_b1_draft_loop/01.png": {
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
    "file": "track_ink/think_b1_draft_loop_01.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_01.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_01_u.png",
    "rect": [297, 380, 225, 105]
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
  "frames/think_b1_draft_loop/02.png": {
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
    "file": "track_ink/think_b1_draft_loop_02.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_02.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_02_u.png",
    "rect": [297, 380, 225, 104]
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
  "frames/think_b1_draft_loop/03.png": {
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
    "file": "track_ink/think_b1_draft_loop_03.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_03.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_03_u.png",
    "rect": [297, 380, 227, 104]
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
  "frames/think_b1_draft_loop/04.png": {
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
    "file": "track_ink/think_b1_draft_loop_04.png",
    "rect": [170, 223, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_04.png",
    "rect": [170, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_04_u.png",
    "rect": [298, 382, 226, 104]
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
  "frames/think_b1_draft_loop/05.png": {
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
    "file": "track_ink/think_b1_draft_loop_05.png",
    "rect": [170, 226, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_05.png",
    "rect": [170, 226, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_05_u.png",
    "rect": [298, 385, 228, 104]
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
  "frames/think_b1_draft_loop/06.png": {
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
    "file": "track_ink/think_b1_draft_loop_06.png",
    "rect": [171, 231, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_06.png",
    "rect": [171, 231, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_06_u.png",
    "rect": [298, 390, 230, 104]
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
  "frames/think_b1_draft_loop/07.png": {
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
    "file": "track_ink/think_b1_draft_loop_07.png",
    "rect": [171, 234, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_07.png",
    "rect": [171, 234, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_07_u.png",
    "rect": [298, 392, 230, 105]
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
  "frames/think_b1_draft_loop/08.png": {
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
    "file": "track_ink/think_b1_draft_loop_08.png",
    "rect": [170, 231, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_08.png",
    "rect": [170, 231, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_08_u.png",
    "rect": [298, 390, 229, 104]
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
  "frames/think_b1_draft_loop/09.png": {
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
    "file": "track_ink/think_b1_draft_loop_09.png",
    "rect": [169, 228, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_09.png",
    "rect": [169, 228, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_09_u.png",
    "rect": [296, 386, 228, 105]
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
  "frames/think_b1_draft_loop/10.png": {
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
    "file": "track_ink/think_b1_draft_loop_10.png",
    "rect": [167, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_10.png",
    "rect": [167, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_10_u.png",
    "rect": [294, 379, 228, 106]
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
  "frames/think_b1_draft_loop/11.png": {
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
    "file": "track_ink/think_b1_draft_loop_11.png",
    "rect": [166, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_11.png",
    "rect": [166, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_11_u.png",
    "rect": [292, 377, 228, 107]
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
  "frames/think_b1_draft_loop/12.png": {
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
    "file": "track_ink/think_b1_draft_loop_12.png",
    "rect": [163, 218, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_12.png",
    "rect": [163, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_12_u.png",
    "rect": [289, 374, 227, 110]
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
  "frames/think_b1_draft_loop/13.png": {
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
    "file": "track_ink/think_b1_draft_loop_13.png",
    "rect": [162, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_13.png",
    "rect": [162, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_13_u.png",
    "rect": [288, 374, 228, 111]
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
  "frames/think_b1_draft_loop/14.png": {
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
    "file": "track_ink/think_b1_draft_loop_14.png",
    "rect": [161, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_14.png",
    "rect": [161, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_14_u.png",
    "rect": [287, 377, 227, 111]
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
  "frames/think_b1_draft_loop/15.png": {
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
    "file": "track_ink/think_b1_draft_loop_15.png",
    "rect": [161, 224, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_15.png",
    "rect": [161, 224, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_15_u.png",
    "rect": [287, 379, 227, 112]
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
  "frames/think_b1_draft_loop/16.png": {
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
    "file": "track_ink/think_b1_draft_loop_16.png",
    "rect": [161, 225, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_16.png",
    "rect": [161, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_16_u.png",
    "rect": [287, 380, 227, 112]
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
  "frames/think_b1_draft_loop/17.png": {
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
    "file": "track_ink/think_b1_draft_loop_17.png",
    "rect": [161, 226, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_17.png",
    "rect": [161, 226, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_17_u.png",
    "rect": [287, 380, 227, 112]
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
  "frames/think_b1_draft_loop/18.png": {
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
    "file": "track_ink/think_b1_draft_loop_18.png",
    "rect": [161, 226, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_18.png",
    "rect": [161, 226, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_18_u.png",
    "rect": [287, 380, 227, 112]
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
  "frames/think_b1_draft_loop/19.png": {
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
    "file": "track_ink/think_b1_draft_loop_19.png",
    "rect": [161, 226, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_19.png",
    "rect": [161, 226, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_19_u.png",
    "rect": [287, 380, 227, 112]
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
  "frames/think_b1_draft_loop/20.png": {
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
    "file": "track_ink/think_b1_draft_loop_20.png",
    "rect": [161, 226, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_20.png",
    "rect": [161, 226, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_20_u.png",
    "rect": [287, 380, 227, 112]
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
  "frames/think_b1_draft_loop/21.png": {
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
    "file": "track_ink/think_b1_draft_loop_21.png",
    "rect": [161, 226, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_21.png",
    "rect": [161, 226, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_21_u.png",
    "rect": [287, 380, 227, 112]
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
  "frames/think_b1_draft_loop/22.png": {
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
    "file": "track_ink/think_b1_draft_loop_22.png",
    "rect": [161, 225, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_22.png",
    "rect": [161, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_22_u.png",
    "rect": [287, 380, 227, 112]
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
  "frames/think_b1_draft_loop/23.png": {
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
    "file": "track_ink/think_b1_draft_loop_23.png",
    "rect": [161, 226, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_23.png",
    "rect": [161, 226, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_23_u.png",
    "rect": [287, 380, 227, 112]
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
  "frames/think_b1_draft_loop/24.png": {
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
    "file": "track_ink/think_b1_draft_loop_24.png",
    "rect": [161, 226, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_24.png",
    "rect": [161, 226, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_24_u.png",
    "rect": [287, 381, 227, 111]
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
  "frames/think_b1_draft_loop/25.png": {
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
    "file": "track_ink/think_b1_draft_loop_25.png",
    "rect": [162, 226, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_25.png",
    "rect": [162, 226, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_25_u.png",
    "rect": [287, 380, 227, 112]
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
  "frames/think_b1_draft_loop/26.png": {
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
    "file": "track_ink/think_b1_draft_loop_26.png",
    "rect": [161, 226, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_26.png",
    "rect": [161, 226, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_26_u.png",
    "rect": [287, 380, 227, 112]
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
  "frames/think_b1_draft_loop/27.png": {
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
    "file": "track_ink/think_b1_draft_loop_27.png",
    "rect": [161, 225, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_27.png",
    "rect": [161, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_27_u.png",
    "rect": [287, 380, 227, 112]
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
  "frames/think_b1_draft_loop/28.png": {
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
    "file": "track_ink/think_b1_draft_loop_28.png",
    "rect": [161, 225, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_28.png",
    "rect": [161, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_28_u.png",
    "rect": [287, 380, 227, 112]
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
  "frames/think_b1_draft_loop/29.png": {
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
    "file": "track_ink/think_b1_draft_loop_29.png",
    "rect": [161, 224, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_29.png",
    "rect": [161, 224, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_29_u.png",
    "rect": [286, 379, 228, 112]
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
  "frames/think_b1_draft_loop/30.png": {
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
    "file": "track_ink/think_b1_draft_loop_30.png",
    "rect": [160, 224, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_30.png",
    "rect": [160, 224, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_30_u.png",
    "rect": [286, 378, 226, 113]
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
  "frames/think_b1_draft_loop/31.png": {
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
    "file": "track_ink/think_b1_draft_loop_31.png",
    "rect": [161, 224, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_31.png",
    "rect": [161, 224, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_31_u.png",
    "rect": [285, 378, 227, 114]
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
  "frames/think_b1_draft_loop/32.png": {
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
    "file": "track_ink/think_b1_draft_loop_32.png",
    "rect": [160, 227, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_32.png",
    "rect": [160, 227, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_32_u.png",
    "rect": [284, 380, 228, 115]
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
  "frames/think_b1_draft_loop/33.png": {
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
    "file": "track_ink/think_b1_draft_loop_33.png",
    "rect": [162, 229, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_33.png",
    "rect": [162, 229, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_33_u.png",
    "rect": [286, 382, 228, 114]
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
  "frames/think_b1_draft_loop/34.png": {
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
    "file": "track_ink/think_b1_draft_loop_34.png",
    "rect": [164, 232, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_34.png",
    "rect": [164, 232, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_34_u.png",
    "rect": [290, 387, 228, 112]
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
  "frames/think_b1_draft_loop/35.png": {
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
    "file": "track_ink/think_b1_draft_loop_35.png",
    "rect": [166, 233, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_35.png",
    "rect": [166, 233, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_35_u.png",
    "rect": [291, 387, 229, 112]
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
  "frames/think_b1_draft_loop/36.png": {
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
    "file": "track_ink/think_b1_draft_loop_36.png",
    "rect": [167, 227, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_36.png",
    "rect": [167, 227, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_36_u.png",
    "rect": [294, 383, 228, 109]
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
  "frames/think_b1_draft_loop/37.png": {
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
    "file": "track_ink/think_b1_draft_loop_37.png",
    "rect": [168, 223, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_37.png",
    "rect": [168, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_37_u.png",
    "rect": [295, 380, 227, 108]
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
  "frames/think_b1_draft_loop/38.png": {
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
    "file": "track_ink/think_b1_draft_loop_38.png",
    "rect": [168, 218, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_38.png",
    "rect": [168, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_38_u.png",
    "rect": [296, 376, 226, 105]
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
  "frames/think_b1_draft_loop/39.png": {
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
    "file": "track_ink/think_b1_draft_loop_39.png",
    "rect": [168, 217, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_39.png",
    "rect": [168, 217, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_39_u.png",
    "rect": [295, 376, 227, 105]
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
  "frames/think_b1_draft_loop/40.png": {
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
    "file": "track_ink/think_b1_draft_loop_40.png",
    "rect": [168, 218, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_40.png",
    "rect": [168, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_40_u.png",
    "rect": [296, 377, 226, 104]
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
  "frames/think_b1_draft_loop/41.png": {
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
    "file": "track_ink/think_b1_draft_loop_41.png",
    "rect": [168, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_41.png",
    "rect": [168, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_41_u.png",
    "rect": [296, 378, 226, 105]
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
  "frames/think_b1_draft_loop/42.png": {
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
    "file": "track_ink/think_b1_draft_loop_42.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_42.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_42_u.png",
    "rect": [296, 380, 228, 104]
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
  "frames/think_b1_draft_loop/43.png": {
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
    "file": "track_ink/think_b1_draft_loop_43.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_43.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_43_u.png",
    "rect": [296, 380, 228, 105]
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
  "frames/think_b1_draft_loop/44.png": {
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
    "file": "track_ink/think_b1_draft_loop_44.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_44.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_44_u.png",
    "rect": [297, 380, 227, 105]
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
  "frames/think_b1_draft_loop/45.png": {
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
    "file": "track_ink/think_b1_draft_loop_45.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_45.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_45_u.png",
    "rect": [297, 380, 227, 105]
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
  "frames/think_b1_draft_loop/46.png": {
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
    "file": "track_ink/think_b1_draft_loop_46.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_46.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_46_u.png",
    "rect": [297, 380, 227, 105]
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
  "frames/think_b1_draft_loop/47.png": {
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
    "file": "track_ink/think_b1_draft_loop_47.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_47.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_47_u.png",
    "rect": [297, 380, 227, 105]
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
  "frames/think_b1_draft_loop/48.png": {
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
    "file": "track_ink/think_b1_draft_loop_48.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_b1_draft_loop_48.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_b1_draft_loop_48_u.png",
    "rect": [297, 381, 226, 104]
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
  "frames/wave_b1_draft_loop/00.png": {
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
    "file": "track_ink/wave_b1_draft_loop_00.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_00.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_00_u.png",
    "rect": [297, 381, 226, 104]
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
  "frames/wave_b1_draft_loop/01.png": {
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
    "file": "track_ink/wave_b1_draft_loop_01.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_01.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_01_u.png",
    "rect": [297, 380, 227, 105]
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
  "frames/wave_b1_draft_loop/02.png": {
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
    "file": "track_ink/wave_b1_draft_loop_02.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_02.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_02_u.png",
    "rect": [298, 380, 226, 104]
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
  "frames/wave_b1_draft_loop/03.png": {
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
    "file": "track_ink/wave_b1_draft_loop_03.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_03.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_03_u.png",
    "rect": [298, 380, 226, 104]
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
  "frames/wave_b1_draft_loop/04.png": {
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
    "file": "track_ink/wave_b1_draft_loop_04.png",
    "rect": [167, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_04.png",
    "rect": [167, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_04_u.png",
    "rect": [295, 379, 227, 106]
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
  "frames/wave_b1_draft_loop/05.png": {
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
    "file": "track_ink/wave_b1_draft_loop_05.png",
    "rect": [166, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_05.png",
    "rect": [166, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_05_u.png",
    "rect": [294, 378, 228, 108]
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
  "frames/wave_b1_draft_loop/06.png": {
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
    "file": "track_ink/wave_b1_draft_loop_06.png",
    "rect": [163, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_06.png",
    "rect": [163, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_06_u.png",
    "rect": [288, 375, 229, 113]
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
  "frames/wave_b1_draft_loop/07.png": {
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
    "file": "track_ink/wave_b1_draft_loop_07.png",
    "rect": [161, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_07.png",
    "rect": [161, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_07_u.png",
    "rect": [285, 374, 231, 115]
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
  "frames/wave_b1_draft_loop/08.png": {
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
    "file": "track_ink/wave_b1_draft_loop_08.png",
    "rect": [159, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_08.png",
    "rect": [159, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_08_u.png",
    "rect": [282, 372, 228, 119]
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
  "frames/wave_b1_draft_loop/09.png": {
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
    "file": "track_ink/wave_b1_draft_loop_09.png",
    "rect": [157, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_09.png",
    "rect": [157, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_09_u.png",
    "rect": [280, 372, 228, 120]
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
  "frames/wave_b1_draft_loop/10.png": {
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
    "file": "track_ink/wave_b1_draft_loop_10.png",
    "rect": [157, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_10.png",
    "rect": [157, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_10_u.png",
    "rect": [280, 372, 228, 120]
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
  "frames/wave_b1_draft_loop/11.png": {
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
    "file": "track_ink/wave_b1_draft_loop_11.png",
    "rect": [158, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_11.png",
    "rect": [158, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_11_u.png",
    "rect": [281, 373, 234, 118]
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
  "frames/wave_b1_draft_loop/12.png": {
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
    "file": "track_ink/wave_b1_draft_loop_12.png",
    "rect": [161, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_12.png",
    "rect": [161, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_12_u.png",
    "rect": [285, 374, 234, 115]
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
  "frames/wave_b1_draft_loop/13.png": {
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
    "file": "track_ink/wave_b1_draft_loop_13.png",
    "rect": [160, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_13.png",
    "rect": [160, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_13_u.png",
    "rect": [284, 375, 235, 114]
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
  "frames/wave_b1_draft_loop/14.png": {
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
    "file": "track_ink/wave_b1_draft_loop_14.png",
    "rect": [164, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_14.png",
    "rect": [164, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_14_u.png",
    "rect": [290, 376, 232, 108]
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
  "frames/wave_b1_draft_loop/15.png": {
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
    "file": "track_ink/wave_b1_draft_loop_15.png",
    "rect": [167, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_15.png",
    "rect": [167, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_15_u.png",
    "rect": [295, 378, 231, 105]
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
  "frames/wave_b1_draft_loop/16.png": {
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
    "file": "track_ink/wave_b1_draft_loop_16.png",
    "rect": [170, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_16.png",
    "rect": [170, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_16_u.png",
    "rect": [298, 377, 230, 107]
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
  "frames/wave_b1_draft_loop/17.png": {
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
    "file": "track_ink/wave_b1_draft_loop_17.png",
    "rect": [174, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_17.png",
    "rect": [174, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_17_u.png",
    "rect": [304, 374, 228, 112]
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
  "frames/wave_b1_draft_loop/18.png": {
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
    "file": "track_ink/wave_b1_draft_loop_18.png",
    "rect": [175, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_18.png",
    "rect": [175, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_18_u.png",
    "rect": [307, 374, 227, 113]
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
  "frames/wave_b1_draft_loop/19.png": {
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
    "file": "track_ink/wave_b1_draft_loop_19.png",
    "rect": [176, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_19.png",
    "rect": [176, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_19_u.png",
    "rect": [310, 372, 228, 117]
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
  "frames/wave_b1_draft_loop/20.png": {
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
    "file": "track_ink/wave_b1_draft_loop_20.png",
    "rect": [178, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_20.png",
    "rect": [178, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_20_u.png",
    "rect": [311, 374, 227, 114]
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
  "frames/wave_b1_draft_loop/21.png": {
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
    "file": "track_ink/wave_b1_draft_loop_21.png",
    "rect": [174, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_21.png",
    "rect": [174, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_21_u.png",
    "rect": [306, 374, 229, 114]
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
  "frames/wave_b1_draft_loop/22.png": {
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
    "file": "track_ink/wave_b1_draft_loop_22.png",
    "rect": [173, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_22.png",
    "rect": [173, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_22_u.png",
    "rect": [304, 375, 228, 112]
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
  "frames/wave_b1_draft_loop/23.png": {
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
    "file": "track_ink/wave_b1_draft_loop_23.png",
    "rect": [168, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_23.png",
    "rect": [168, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_23_u.png",
    "rect": [298, 378, 228, 107]
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
  "frames/wave_b1_draft_loop/24.png": {
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
    "file": "track_ink/wave_b1_draft_loop_24.png",
    "rect": [166, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_24.png",
    "rect": [166, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_24_u.png",
    "rect": [296, 380, 228, 104]
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
  "frames/wave_b1_draft_loop/25.png": {
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
    "file": "track_ink/wave_b1_draft_loop_25.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_25.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_25_u.png",
    "rect": [290, 379, 229, 107]
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
  "frames/wave_b1_draft_loop/26.png": {
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
    "file": "track_ink/wave_b1_draft_loop_26.png",
    "rect": [162, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_26.png",
    "rect": [162, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_26_u.png",
    "rect": [288, 378, 228, 109]
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
  "frames/wave_b1_draft_loop/27.png": {
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
    "file": "track_ink/wave_b1_draft_loop_27.png",
    "rect": [159, 223, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_27.png",
    "rect": [159, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_27_u.png",
    "rect": [284, 377, 230, 112]
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
  "frames/wave_b1_draft_loop/28.png": {
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
    "file": "track_ink/wave_b1_draft_loop_28.png",
    "rect": [160, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_28.png",
    "rect": [160, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_28_u.png",
    "rect": [285, 376, 227, 113]
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
  "frames/wave_b1_draft_loop/29.png": {
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
    "file": "track_ink/wave_b1_draft_loop_29.png",
    "rect": [157, 223, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_29.png",
    "rect": [157, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_29_u.png",
    "rect": [280, 376, 232, 115]
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
  "frames/wave_b1_draft_loop/30.png": {
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
    "file": "track_ink/wave_b1_draft_loop_30.png",
    "rect": [156, 223, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_30.png",
    "rect": [156, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_30_u.png",
    "rect": [280, 375, 230, 117]
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
  "frames/wave_b1_draft_loop/31.png": {
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
    "file": "track_ink/wave_b1_draft_loop_31.png",
    "rect": [155, 223, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_31.png",
    "rect": [155, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_31_u.png",
    "rect": [278, 374, 230, 120]
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
  "frames/wave_b1_draft_loop/32.png": {
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
    "file": "track_ink/wave_b1_draft_loop_32.png",
    "rect": [154, 224, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_32.png",
    "rect": [154, 224, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_32_u.png",
    "rect": [277, 374, 229, 122]
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
  "frames/wave_b1_draft_loop/33.png": {
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
    "file": "track_ink/wave_b1_draft_loop_33.png",
    "rect": [154, 223, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_33.png",
    "rect": [154, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_33_u.png",
    "rect": [277, 373, 229, 122]
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
  "frames/wave_b1_draft_loop/34.png": {
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
    "file": "track_ink/wave_b1_draft_loop_34.png",
    "rect": [154, 224, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_34.png",
    "rect": [154, 224, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_34_u.png",
    "rect": [276, 373, 228, 123]
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
  "frames/wave_b1_draft_loop/35.png": {
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
    "file": "track_ink/wave_b1_draft_loop_35.png",
    "rect": [154, 223, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_35.png",
    "rect": [154, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_35_u.png",
    "rect": [277, 373, 227, 122]
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
  "frames/wave_b1_draft_loop/36.png": {
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
    "file": "track_ink/wave_b1_draft_loop_36.png",
    "rect": [156, 223, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_36.png",
    "rect": [156, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_36_u.png",
    "rect": [280, 374, 228, 120]
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
  "frames/wave_b1_draft_loop/37.png": {
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
    "file": "track_ink/wave_b1_draft_loop_37.png",
    "rect": [158, 223, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_37.png",
    "rect": [158, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_37_u.png",
    "rect": [282, 375, 228, 117]
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
  "frames/wave_b1_draft_loop/38.png": {
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
    "file": "track_ink/wave_b1_draft_loop_38.png",
    "rect": [160, 223, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_38.png",
    "rect": [160, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_38_u.png",
    "rect": [285, 376, 227, 115]
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
  "frames/wave_b1_draft_loop/39.png": {
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
    "file": "track_ink/wave_b1_draft_loop_39.png",
    "rect": [160, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_39.png",
    "rect": [160, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_39_u.png",
    "rect": [285, 377, 231, 112]
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
  "frames/wave_b1_draft_loop/40.png": {
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
    "file": "track_ink/wave_b1_draft_loop_40.png",
    "rect": [164, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_40.png",
    "rect": [164, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_40_u.png",
    "rect": [290, 377, 230, 110]
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
  "frames/wave_b1_draft_loop/41.png": {
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
    "file": "track_ink/wave_b1_draft_loop_41.png",
    "rect": [165, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_41.png",
    "rect": [165, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_41_u.png",
    "rect": [291, 378, 229, 109]
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
  "frames/wave_b1_draft_loop/42.png": {
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
    "file": "track_ink/wave_b1_draft_loop_42.png",
    "rect": [166, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_42.png",
    "rect": [166, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_42_u.png",
    "rect": [293, 379, 229, 107]
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
  "frames/wave_b1_draft_loop/43.png": {
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
    "file": "track_ink/wave_b1_draft_loop_43.png",
    "rect": [167, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_43.png",
    "rect": [167, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_43_u.png",
    "rect": [294, 379, 229, 106]
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
  "frames/wave_b1_draft_loop/44.png": {
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
    "file": "track_ink/wave_b1_draft_loop_44.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_44.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_44_u.png",
    "rect": [296, 380, 228, 105]
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
  "frames/wave_b1_draft_loop/45.png": {
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
    "file": "track_ink/wave_b1_draft_loop_45.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_45.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_45_u.png",
    "rect": [296, 380, 228, 105]
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
  "frames/wave_b1_draft_loop/46.png": {
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
    "file": "track_ink/wave_b1_draft_loop_46.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_46.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_46_u.png",
    "rect": [297, 380, 227, 105]
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
  "frames/wave_b1_draft_loop/47.png": {
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
    "file": "track_ink/wave_b1_draft_loop_47.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_47.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_47_u.png",
    "rect": [297, 380, 227, 105]
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
  "frames/wave_b1_draft_loop/48.png": {
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
    "file": "track_ink/wave_b1_draft_loop_48.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_b1_draft_loop_48.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_b1_draft_loop_48_u.png",
    "rect": [297, 381, 226, 104]
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
  "frames/wave_h1_canny_loop/00.png": {
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
    "file": "track_ink/wave_h1_canny_loop_00.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_canny_loop_00.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_canny_loop_00_u.png",
    "rect": [297, 381, 226, 104]
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
  "frames/wave_h1_canny_loop/01.png": {
   "m": [
    0.99907,
    0.00082,
    1.14,
    0.04
   ],
   "scale": 0.9991,
   "rot_deg": 0.05,
   "shift": [
    0.4,
    -0.1
   ],
   "inliers": 188,
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
    "file": "track_ink/wave_h1_canny_loop_01.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_canny_loop_01.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_canny_loop_01_u.png",
    "rect": [298, 381, 226, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.28,
     -0.0
    ],
    "eyeR": [
     -0.09,
     -0.0
    ],
    "mouth": [
     -0.22,
     0.06
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_canny_loop/02.png": {
   "m": [
    0.99907,
    0.00058,
    0.97,
    0.21
   ],
   "scale": 0.9991,
   "rot_deg": 0.03,
   "shift": [
    0.3,
    0.0
   ],
   "inliers": 175,
   "residual_px": 0.61,
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
    "file": "track_ink/wave_h1_canny_loop_02.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_canny_loop_02.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_canny_loop_02_u.png",
    "rect": [298, 381, 226, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 11,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.31,
     -0.0
    ],
    "eyeR": [
     -0.12,
     -0.02
    ],
    "mouth": [
     -0.33,
     0.1
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_canny_loop/03.png": {
   "m": [
    0.99883,
    0.00096,
    0.97,
    0.07
   ],
   "scale": 0.9988,
   "rot_deg": 0.06,
   "shift": [
    0.0,
    -0.1
   ],
   "inliers": 157,
   "residual_px": 0.68,
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
    "file": "track_ink/wave_h1_canny_loop_03.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_canny_loop_03.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_canny_loop_03_u.png",
    "rect": [298, 381, 226, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 10,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.28,
     0.1
    ],
    "eyeR": [
     -0.09,
     -0.04
    ],
    "mouth": [
     -0.33,
     0.14
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_canny_loop/04.png": {
   "m": [
    0.99932,
    -0.00718,
    -4.95,
    3.53
   ],
   "scale": 0.9993,
   "rot_deg": -0.41,
   "shift": [
    -1.9,
    0.3
   ],
   "inliers": 165,
   "residual_px": 0.79,
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
    "file": "track_ink/wave_h1_canny_loop_04.png",
    "rect": [167, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_canny_loop_04.png",
    "rect": [167, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_canny_loop_04_u.png",
    "rect": [296, 381, 226, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 10,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.21,
     0.28
    ],
    "eyeR": [
     0.0,
     -0.12
    ],
    "mouth": [
     -0.09,
     0.15
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_canny_loop/05.png": {
   "m": [
    0.9993,
    -0.01439,
    -9.43,
    6.72
   ],
   "scale": 0.9994,
   "rot_deg": -0.83,
   "shift": [
    -3.0,
    0.5
   ],
   "inliers": 140,
   "residual_px": 0.77,
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
    "file": "track_ink/wave_h1_canny_loop_05.png",
    "rect": [166, 223, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_canny_loop_05.png",
    "rect": [166, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_canny_loop_05_u.png",
    "rect": [294, 380, 226, 106]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.19,
     0.28
    ],
    "eyeR": [
     0.01,
     -0.15
    ],
    "mouth": [
     -0.07,
     0.14
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_canny_loop/06.png": {
   "m": [
    1.00095,
    -0.03046,
    -20.78,
    12.6
   ],
   "scale": 1.0014,
   "rot_deg": -1.74,
   "shift": [
    -6.2,
    0.6
   ],
   "inliers": 138,
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
    "file": "track_ink/wave_h1_canny_loop_06.png",
    "rect": [163, 223, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_canny_loop_06.png",
    "rect": [163, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_canny_loop_06_u.png",
    "rect": [289, 379, 227, 109]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.79,
     0.27
    ],
    "eyeR": [
     0.49,
     -0.22
    ],
    "mouth": [
     1.05,
     -0.02
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_canny_loop/07.png": {
   "m": [
    1.00168,
    -0.0407,
    -26.82,
    16.46
   ],
   "scale": 1.0025,
   "rot_deg": -2.33,
   "shift": [
    -7.2,
    0.6
   ],
   "inliers": 97,
   "residual_px": 0.91,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 1.0,
    "mouth": 2.2,
    "nose": 1.4,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_canny_loop_07.png",
    "rect": [162, 223, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_canny_loop_07.png",
    "rect": [162, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_canny_loop_07_u.png",
    "rect": [288, 378, 228, 110]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.83,
     -0.35
    ],
    "eyeR": [
     0.5,
     -0.44
    ],
    "mouth": [
     1.16,
     -0.5
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_canny_loop/08.png": {
   "m": [
    1.01143,
    -0.05174,
    -39.8,
    16.24
   ],
   "scale": 1.0127,
   "rot_deg": -2.93,
   "shift": [
    -11.1,
    0.4
   ],
   "inliers": 56,
   "residual_px": 0.68,
   "ref_residual_px": {
    "eyeL": 4.5,
    "eyeR": 2.8,
    "mouth": 4.5,
    "nose": 3.6,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_canny_loop_08.png",
    "rect": [158, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_canny_loop_08.png",
    "rect": [158, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_canny_loop_08_u.png",
    "rect": [282, 376, 230, 113]
   },
   "yield_eye_px": 0,
   "yield_px": 549,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     4.04,
     -1.14
    ],
    "eyeR": [
     2.23,
     -1.3
    ],
    "mouth": [
     3.48,
     -2.21
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_canny_loop/09.png": {
   "m": [
    1.01551,
    -0.0616,
    -47.73,
    18.43
   ],
   "scale": 1.0174,
   "rot_deg": -3.47,
   "shift": [
    -12.7,
    0.5
   ],
   "inliers": 57,
   "residual_px": 0.73,
   "ref_residual_px": {
    "eyeL": 6.3,
    "eyeR": 3.6,
    "mouth": 5.0,
    "nose": 5.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_canny_loop_09.png",
    "rect": [156, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_canny_loop_09.png",
    "rect": [156, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_canny_loop_09_u.png",
    "rect": [280, 375, 230, 115]
   },
   "yield_eye_px": 428,
   "yield_px": 1293,
   "cover_alien_px": 22,
   "occluded": 0.024,
   "feat": {
    "eyeL": [
     5.18,
     -1.84
    ],
    "eyeR": [
     2.82,
     -1.62
    ],
    "mouth": [
     4.26,
     -3.02
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_canny_loop/10.png": {
   "m": [
    1.01739,
    -0.0729,
    -55.5,
    22.03
   ],
   "scale": 1.02,
   "rot_deg": -4.1,
   "shift": [
    -14.5,
    0.3
   ],
   "inliers": 53,
   "residual_px": 0.85,
   "ref_residual_px": {
    "eyeL": 7.6,
    "eyeR": 4.2,
    "mouth": 7.2,
    "nose": 5.8,
    "pin": 1.4
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_canny_loop_10.png",
    "rect": [155, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_canny_loop_10.png",
    "rect": [155, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_canny_loop_10_u.png",
    "rect": [277, 374, 231, 117]
   },
   "yield_eye_px": 1076,
   "yield_px": 2261,
   "cover_alien_px": 0,
   "occluded": 0.06,
   "feat": {
    "eyeL": [
     5.18,
     -2.41
    ],
    "eyeR": [
     2.82,
     -1.91
    ],
    "mouth": [
     4.26,
     -3.53
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_canny_loop/11.png": {
   "m": [
    1.0162,
    -0.07303,
    -53.99,
    22.62
   ],
   "scale": 1.0188,
   "rot_deg": -4.11,
   "shift": [
    -13.4,
    0.3
   ],
   "inliers": 38,
   "residual_px": 0.89,
   "ref_residual_px": {
    "eyeL": 5.8,
    "eyeR": 4.1,
    "mouth": 5.7,
    "nose": 5.0,
    "pin": 1.4
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_canny_loop_11.png",
    "rect": [156, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_canny_loop_11.png",
    "rect": [156, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_canny_loop_11_u.png",
    "rect": [278, 374, 236, 117]
   },
   "yield_eye_px": 1344,
   "yield_px": 2656,
   "cover_alien_px": 0,
   "occluded": 0.075,
   "feat": {
    "eyeL": [
     4.73,
     -2.59
    ],
    "eyeR": [
     1.88,
     -1.91
    ],
    "mouth": [
     3.61,
     -3.53
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_canny_loop/12.png": {
   "m": [
    1.01501,
    -0.07316,
    -52.47,
    23.22
   ],
   "scale": 1.0176,
   "rot_deg": -4.12,
   "shift": [
    -12.3,
    0.3
   ],
   "inliers": 38,
   "residual_px": 0.68,
   "ref_residual_px": {
    "eyeL": 6.4,
    "eyeR": 4.1,
    "mouth": 5.7,
    "nose": 4.2,
    "pin": 2.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_canny_loop_12.png",
    "rect": [157, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_canny_loop_12.png",
    "rect": [157, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_canny_loop_12_u.png",
    "rect": [280, 374, 235, 117]
   },
   "yield_eye_px": 1629,
   "yield_px": 3171,
   "cover_alien_px": 0,
   "occluded": 0.091,
   "feat": {
    "eyeL": [
     4.6,
     -3.08
    ],
    "eyeR": [
     1.8,
     -1.59
    ],
    "mouth": [
     3.12,
     -3.6
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_canny_loop/13.png": {
   "m": [
    1.01635,
    -0.07033,
    -51.2,
    21.95
   ],
   "scale": 1.0188,
   "rot_deg": -3.96,
   "shift": [
    -11.8,
    0.8
   ],
   "inliers": 42,
   "residual_px": 1.11,
   "ref_residual_px": {
    "eyeL": 6.4,
    "eyeR": 4.1,
    "mouth": 5.0,
    "nose": 5.0,
    "pin": 2.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_canny_loop_13.png",
    "rect": [157, 223, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_canny_loop_13.png",
    "rect": [157, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_canny_loop_13_u.png",
    "rect": [280, 375, 236, 116]
   },
   "yield_eye_px": 1590,
   "yield_px": 3309,
   "cover_alien_px": 0,
   "occluded": 0.089,
   "feat": {
    "eyeL": [
     4.6,
     -3.08
    ],
    "eyeR": [
     1.8,
     -1.59
    ],
    "mouth": [
     3.12,
     -3.78
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_canny_loop/14.png": {
   "m": [
    1.01684,
    -0.04984,
    -40.77,
    13.64
   ],
   "scale": 1.0181,
   "rot_deg": -2.81,
   "shift": [
    -10.7,
    1.1
   ],
   "inliers": 41,
   "residual_px": 0.74,
   "ref_residual_px": {
    "eyeL": 6.7,
    "eyeR": 4.5,
    "mouth": 5.7,
    "nose": 5.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_canny_loop_14.png",
    "rect": [158, 223, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_canny_loop_14.png",
    "rect": [158, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_canny_loop_14_u.png",
    "rect": [282, 377, 235, 113]
   },
   "yield_eye_px": 1360,
   "yield_px": 2861,
   "cover_alien_px": 0,
   "occluded": 0.076,
   "feat": {
    "eyeL": [
     5.09,
     -3.06
    ],
    "eyeR": [
     2.39,
     -1.59
    ],
    "mouth": [
     3.85,
     -3.78
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_canny_loop/15.png": {
   "m": [
    1.01595,
    -0.01734,
    -22.57,
    -0.02
   ],
   "scale": 1.0161,
   "rot_deg": -0.98,
   "shift": [
    -8.0,
    0.3
   ],
   "inliers": 54,
   "residual_px": 1.04,
   "ref_residual_px": {
    "eyeL": 6.3,
    "eyeR": 3.6,
    "mouth": 5.0,
    "nose": 4.5,
    "pin": 1.4
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_canny_loop_15.png",
    "rect": [161, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_canny_loop_15.png",
    "rect": [161, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_canny_loop_15_u.png",
    "rect": [286, 379, 232, 108]
   },
   "yield_eye_px": 1131,
   "yield_px": 2436,
   "cover_alien_px": 0,
   "occluded": 0.063,
   "feat": {
    "eyeL": [
     5.09,
     -2.97
    ],
    "eyeR": [
     2.39,
     -1.83
    ],
    "mouth": [
     3.85,
     -3.78
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_canny_loop/16.png": {
   "m": [
    1.02193,
    -0.00138,
    -15.31,
    -7.86
   ],
   "scale": 1.0219,
   "rot_deg": -0.08,
   "shift": [
    -5.7,
    1.8
   ],
   "inliers": 49,
   "residual_px": 0.67,
   "ref_residual_px": {
    "eyeL": 6.7,
    "eyeR": 3.2,
    "mouth": 5.7,
    "nose": 5.7,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_canny_loop_16.png",
    "rect": [163, 224, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_canny_loop_16.png",
    "rect": [163, 224, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_canny_loop_16_u.png",
    "rect": [289, 381, 233, 106]
   },
   "yield_eye_px": 535,
   "yield_px": 2198,
   "cover_alien_px": 3,
   "occluded": 0.03,
   "feat": {
    "eyeL": [
     5.07,
     -1.75
    ],
    "eyeR": [
     1.99,
     -1.31
    ],
    "mouth": [
     3.39,
     -2.67
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_canny_loop/17.png": {
   "m": [
    1.0114,
    0.04162,
    12.11,
    -23.01
   ],
   "scale": 1.0123,
   "rot_deg": 2.36,
   "shift": [
    -2.6,
    -0.7
   ],
   "inliers": 65,
   "residual_px": 0.73,
   "ref_residual_px": {
    "eyeL": 4.0,
    "eyeR": 2.2,
    "mouth": 4.1,
    "nose": 4.1,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_canny_loop_17.png",
    "rect": [166, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_canny_loop_17.png",
    "rect": [166, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_canny_loop_17_u.png",
    "rect": [295, 377, 229, 110]
   },
   "yield_eye_px": 86,
   "yield_px": 598,
   "cover_alien_px": 3,
   "occluded": 0.005,
   "feat": {
    "eyeL": [
     3.8,
     -0.14
    ],
    "eyeR": [
     1.8,
     -0.68
    ],
    "mouth": [
     3.36,
     -1.35
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_canny_loop/18.png": {
   "m": [
    1.00515,
    0.05762,
    25.57,
    -26.84
   ],
   "scale": 1.0068,
   "rot_deg": 3.28,
   "shift": [
    0.9,
    -0.9
   ],
   "inliers": 80,
   "residual_px": 0.74,
   "ref_residual_px": {
    "eyeL": 2.0,
    "eyeR": 1.4,
    "mouth": 2.2,
    "nose": 2.2,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_canny_loop_18.png",
    "rect": [170, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_canny_loop_18.png",
    "rect": [170, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_canny_loop_18_u.png",
    "rect": [300, 376, 226, 111]
   },
   "yield_eye_px": 43,
   "yield_px": 360,
   "cover_alien_px": 1,
   "occluded": 0.002,
   "feat": {
    "eyeL": [
     1.56,
     -0.14
    ],
    "eyeR": [
     0.71,
     -0.62
    ],
    "mouth": [
     1.5,
     -0.92
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_canny_loop/19.png": {
   "m": [
    0.99752,
    0.08074,
    43.88,
    -33.17
   ],
   "scale": 1.0008,
   "rot_deg": 4.63,
   "shift": [
    5.3,
    -1.3
   ],
   "inliers": 120,
   "residual_px": 0.74,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_canny_loop_19.png",
    "rect": [174, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_canny_loop_19.png",
    "rect": [174, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_canny_loop_19_u.png",
    "rect": [306, 375, 226, 114]
   },
   "yield_eye_px": 66,
   "yield_px": 346,
   "cover_alien_px": 2,
   "occluded": 0.004,
   "feat": {
    "eyeL": [
     -0.3,
     -0.14
    ],
    "eyeR": [
     -0.21,
     -0.1
    ],
    "mouth": [
     -0.57,
     -0.14
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_canny_loop/20.png": {
   "m": [
    0.99517,
    0.08645,
    49.18,
    -34.49
   ],
   "scale": 0.9989,
   "rot_deg": 4.96,
   "shift": [
    7.0,
    -1.4
   ],
   "inliers": 99,
   "residual_px": 0.82,
   "ref_residual_px": {
    "eyeL": 2.0,
    "eyeR": 1.4,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_canny_loop_20.png",
    "rect": [176, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_canny_loop_20.png",
    "rect": [176, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_canny_loop_20_u.png",
    "rect": [308, 375, 226, 114]
   },
   "yield_eye_px": 141,
   "yield_px": 413,
   "cover_alien_px": 6,
   "occluded": 0.008,
   "feat": {
    "eyeL": [
     -1.2,
     -0.07
    ],
    "eyeR": [
     -1.05,
     -0.03
    ],
    "mouth": [
     -1.59,
     -0.04
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_canny_loop/21.png": {
   "m": [
    0.98895,
    0.09104,
    54.82,
    -34.02
   ],
   "scale": 0.9931,
   "rot_deg": 5.26,
   "shift": [
    7.9,
    -2.0
   ],
   "inliers": 61,
   "residual_px": 0.79,
   "ref_residual_px": {
    "eyeL": 3.0,
    "eyeR": 2.0,
    "mouth": 2.2,
    "nose": 2.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_canny_loop_21.png",
    "rect": [177, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_canny_loop_21.png",
    "rect": [177, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_canny_loop_21_u.png",
    "rect": [310, 374, 224, 115]
   },
   "yield_eye_px": 285,
   "yield_px": 514,
   "cover_alien_px": 13,
   "occluded": 0.017,
   "feat": {
    "eyeL": [
     -2.37,
     0.11
    ],
    "eyeR": [
     -1.51,
     0.21
    ],
    "mouth": [
     -2.28,
     0.7
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_canny_loop/22.png": {
   "m": [
    0.9744,
    0.09061,
    62.43,
    -29.06
   ],
   "scale": 0.9786,
   "rot_deg": 5.31,
   "shift": [
    9.8,
    -4.0
   ],
   "inliers": 63,
   "residual_px": 0.76,
   "ref_residual_px": {
    "eyeL": 6.3,
    "eyeR": 2.2,
    "mouth": 5.0,
    "nose": 4.5,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_canny_loop_22.png",
    "rect": [179, 218, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_canny_loop_22.png",
    "rect": [179, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_canny_loop_22_u.png",
    "rect": [313, 373, 221, 114]
   },
   "yield_eye_px": 258,
   "yield_px": 729,
   "cover_alien_px": 3,
   "occluded": 0.016,
   "feat": {
    "eyeL": [
     -4.22,
     1.36
    ],
    "eyeR": [
     -2.48,
     0.41
    ],
    "mouth": [
     -3.38,
     1.82
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_canny_loop/23.png": {
   "m": [
    0.98388,
    0.08166,
    51.65,
    -28.92
   ],
   "scale": 0.9873,
   "rot_deg": 4.74,
   "shift": [
    7.1,
    -3.0
   ],
   "inliers": 60,
   "residual_px": 0.7,
   "ref_residual_px": {
    "eyeL": 5.4,
    "eyeR": 2.0,
    "mouth": 3.6,
    "nose": 3.2,
    "pin": 2.2
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_canny_loop_23.png",
    "rect": [176, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_canny_loop_23.png",
    "rect": [176, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_canny_loop_23_u.png",
    "rect": [309, 374, 223, 113]
   },
   "yield_eye_px": 175,
   "yield_px": 722,
   "cover_alien_px": 4,
   "occluded": 0.01,
   "feat": {
    "eyeL": [
     -4.22,
     1.36
    ],
    "eyeR": [
     -2.48,
     0.41
    ],
    "mouth": [
     -3.38,
     1.82
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_canny_loop/24.png": {
   "m": [
    0.99328,
    0.07254,
    40.81,
    -28.66
   ],
   "scale": 0.9959,
   "rot_deg": 4.18,
   "shift": [
    4.3,
    -2.1
   ],
   "inliers": 58,
   "residual_px": 0.81,
   "ref_residual_px": {
    "eyeL": 2.2,
    "eyeR": 1.0,
    "mouth": 1.4,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_canny_loop_24.png",
    "rect": [173, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_canny_loop_24.png",
    "rect": [173, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_canny_loop_24_u.png",
    "rect": [306, 375, 226, 112]
   },
   "yield_eye_px": 286,
   "yield_px": 615,
   "cover_alien_px": 9,
   "occluded": 0.017,
   "feat": {
    "eyeL": [
     -2.99,
     0.87
    ],
    "eyeR": [
     -1.82,
     0.41
    ],
    "mouth": [
     -2.7,
     1.52
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_canny_loop/25.png": {
   "m": [
    0.98901,
    0.04808,
    29.78,
    -17.49
   ],
   "scale": 0.9902,
   "rot_deg": 2.78,
   "shift": [
    2.9,
    -3.0
   ],
   "inliers": 63,
   "residual_px": 0.82,
   "ref_residual_px": {
    "eyeL": 3.2,
    "eyeR": 2.2,
    "mouth": 2.8,
    "nose": 2.2,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_canny_loop_25.png",
    "rect": [172, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_canny_loop_25.png",
    "rect": [172, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_canny_loop_25_u.png",
    "rect": [303, 376, 225, 109]
   },
   "yield_eye_px": 353,
   "yield_px": 694,
   "cover_alien_px": 12,
   "occluded": 0.021,
   "feat": {
    "eyeL": [
     -2.43,
     0.87
    ],
    "eyeR": [
     -1.36,
     0.57
    ],
    "mouth": [
     -2.15,
     1.52
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_canny_loop/26.png": {
   "m": [
    0.98993,
    0.03355,
    20.52,
    -12.07
   ],
   "scale": 0.9905,
   "rot_deg": 1.94,
   "shift": [
    0.8,
    -3.0
   ],
   "inliers": 64,
   "residual_px": 0.8,
   "ref_residual_px": {
    "eyeL": 3.2,
    "eyeR": 1.4,
    "mouth": 2.8,
    "nose": 2.2,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_canny_loop_26.png",
    "rect": [170, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_canny_loop_26.png",
    "rect": [170, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_canny_loop_26_u.png",
    "rect": [300, 377, 225, 106]
   },
   "yield_eye_px": 382,
   "yield_px": 712,
   "cover_alien_px": 21,
   "occluded": 0.022,
   "feat": {
    "eyeL": [
     -2.43,
     0.87
    ],
    "eyeR": [
     -1.36,
     0.57
    ],
    "mouth": [
     -2.15,
     1.52
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_canny_loop/27.png": {
   "m": [
    0.9977,
    0.00452,
    -0.41,
    -2.64
   ],
   "scale": 0.9977,
   "rot_deg": 0.26,
   "shift": [
    -3.5,
    -1.9
   ],
   "inliers": 89,
   "residual_px": 0.9,
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
    "file": "track_ink/wave_h1_canny_loop_27.png",
    "rect": [166, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_canny_loop_27.png",
    "rect": [166, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_canny_loop_27_u.png",
    "rect": [294, 380, 226, 103]
   },
   "yield_eye_px": 454,
   "yield_px": 793,
   "cover_alien_px": 6,
   "occluded": 0.026,
   "feat": {
    "eyeL": [
     -0.65,
     0.21
    ],
    "eyeR": [
     -0.43,
     -0.06
    ],
    "mouth": [
     -0.51,
     0.21
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_canny_loop/28.png": {
   "m": [
    1.00033,
    -0.00988,
    -10.53,
    2.33
   ],
   "scale": 1.0004,
   "rot_deg": -0.57,
   "shift": [
    -5.8,
    -1.6
   ],
   "inliers": 79,
   "residual_px": 0.61,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_canny_loop_28.png",
    "rect": [163, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_canny_loop_28.png",
    "rect": [163, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_canny_loop_28_u.png",
    "rect": [291, 379, 226, 105]
   },
   "yield_eye_px": 620,
   "yield_px": 953,
   "cover_alien_px": 3,
   "occluded": 0.036,
   "feat": {
    "eyeL": [
     0.14,
     0.17
    ],
    "eyeR": [
     0.16,
     -0.09
    ],
    "mouth": [
     0.27,
     -0.09
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_canny_loop/29.png": {
   "m": [
    1.00901,
    -0.03306,
    -29.58,
    9.05
   ],
   "scale": 1.0096,
   "rot_deg": -1.88,
   "shift": [
    -10.5,
    -0.3
   ],
   "inliers": 56,
   "residual_px": 0.75,
   "ref_residual_px": {
    "eyeL": 3.2,
    "eyeR": 2.2,
    "mouth": 3.6,
    "nose": 3.2,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_canny_loop_29.png",
    "rect": [158, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_canny_loop_29.png",
    "rect": [158, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_canny_loop_29_u.png",
    "rect": [284, 377, 233, 110]
   },
   "yield_eye_px": 708,
   "yield_px": 1348,
   "cover_alien_px": 2,
   "occluded": 0.04,
   "feat": {
    "eyeL": [
     2.94,
     -0.45
    ],
    "eyeR": [
     1.37,
     -0.94
    ],
    "mouth": [
     2.15,
     -1.6
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_canny_loop/30.png": {
   "m": [
    1.00948,
    -0.05221,
    -39.41,
    17.54
   ],
   "scale": 1.0108,
   "rot_deg": -2.96,
   "shift": [
    -11.2,
    0.6
   ],
   "inliers": 53,
   "residual_px": 0.71,
   "ref_residual_px": {
    "eyeL": 4.2,
    "eyeR": 3.2,
    "mouth": 2.8,
    "nose": 2.8,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_canny_loop_30.png",
    "rect": [158, 223, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_canny_loop_30.png",
    "rect": [158, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_canny_loop_30_u.png",
    "rect": [282, 377, 234, 112]
   },
   "yield_eye_px": 772,
   "yield_px": 1874,
   "cover_alien_px": 3,
   "occluded": 0.044,
   "feat": {
    "eyeL": [
     3.01,
     -1.76
    ],
    "eyeR": [
     1.69,
     -1.07
    ],
    "mouth": [
     2.73,
     -2.27
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_canny_loop/31.png": {
   "m": [
    1.01075,
    -0.07697,
    -54.85,
    28.0
   ],
   "scale": 1.0137,
   "rot_deg": -4.35,
   "shift": [
    -14.6,
    1.6
   ],
   "inliers": 49,
   "residual_px": 0.86,
   "ref_residual_px": {
    "eyeL": 5.8,
    "eyeR": 3.6,
    "mouth": 5.0,
    "nose": 5.0,
    "pin": 1.4
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_canny_loop_31.png",
    "rect": [154, 224, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_canny_loop_31.png",
    "rect": [154, 224, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_canny_loop_31_u.png",
    "rect": [278, 376, 234, 116]
   },
   "yield_eye_px": 1182,
   "yield_px": 2451,
   "cover_alien_px": 5,
   "occluded": 0.066,
   "feat": {
    "eyeL": [
     4.39,
     -2.16
    ],
    "eyeR": [
     2.33,
     -1.38
    ],
    "mouth": [
     3.32,
     -2.75
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_canny_loop/32.png": {
   "m": [
    1.01453,
    -0.08861,
    -64.15,
    32.22
   ],
   "scale": 1.0184,
   "rot_deg": -4.99,
   "shift": [
    -17.0,
    2.8
   ],
   "inliers": 43,
   "residual_px": 0.67,
   "ref_residual_px": {
    "eyeL": 6.7,
    "eyeR": 4.5,
    "mouth": 6.4,
    "nose": 5.8,
    "pin": 1.4
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_canny_loop_32.png",
    "rect": [152, 225, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_canny_loop_32.png",
    "rect": [152, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_canny_loop_32_u.png",
    "rect": [274, 376, 234, 118]
   },
   "yield_eye_px": 1046,
   "yield_px": 2407,
   "cover_alien_px": 4,
   "occluded": 0.058,
   "feat": {
    "eyeL": [
     5.8,
     -2.25
    ],
    "eyeR": [
     3.16,
     -1.97
    ],
    "mouth": [
     4.45,
     -3.55
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_canny_loop/33.png": {
   "m": [
    1.01545,
    -0.09474,
    -68.1,
    34.83
   ],
   "scale": 1.0199,
   "rot_deg": -5.33,
   "shift": [
    -17.7,
    3.3
   ],
   "inliers": 55,
   "residual_px": 0.92,
   "ref_residual_px": {
    "eyeL": 7.6,
    "eyeR": 4.2,
    "mouth": 6.4,
    "nose": 5.8,
    "pin": 1.4
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_canny_loop_33.png",
    "rect": [151, 225, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_canny_loop_33.png",
    "rect": [151, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_canny_loop_33_u.png",
    "rect": [273, 376, 231, 119]
   },
   "yield_eye_px": 725,
   "yield_px": 2059,
   "cover_alien_px": 4,
   "occluded": 0.04,
   "feat": {
    "eyeL": [
     6.09,
     -2.25
    ],
    "eyeR": [
     3.22,
     -1.97
    ],
    "mouth": [
     4.64,
     -3.55
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_canny_loop/34.png": {
   "m": [
    1.01519,
    -0.11105,
    -76.48,
    42.46
   ],
   "scale": 1.0212,
   "rot_deg": -6.24,
   "shift": [
    -18.6,
    4.1
   ],
   "inliers": 52,
   "residual_px": 0.87,
   "ref_residual_px": {
    "eyeL": 7.3,
    "eyeR": 3.6,
    "mouth": 5.0,
    "nose": 5.8,
    "pin": 2.2
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_canny_loop_34.png",
    "rect": [150, 226, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_canny_loop_34.png",
    "rect": [150, 226, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_canny_loop_34_u.png",
    "rect": [272, 375, 230, 122]
   },
   "yield_eye_px": 585,
   "yield_px": 1549,
   "cover_alien_px": 35,
   "occluded": 0.032,
   "feat": {
    "eyeL": [
     6.09,
     -2.25
    ],
    "eyeR": [
     3.16,
     -1.85
    ],
    "mouth": [
     4.64,
     -3.63
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_canny_loop/35.png": {
   "m": [
    1.01343,
    -0.116,
    -76.87,
    45.87
   ],
   "scale": 1.0201,
   "rot_deg": -6.53,
   "shift": [
    -17.4,
    4.7
   ],
   "inliers": 62,
   "residual_px": 0.9,
   "ref_residual_px": {
    "eyeL": 6.7,
    "eyeR": 2.8,
    "mouth": 5.7,
    "nose": 5.0,
    "pin": 1.4
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_canny_loop_35.png",
    "rect": [152, 227, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_canny_loop_35.png",
    "rect": [152, 227, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_canny_loop_35_u.png",
    "rect": [273, 376, 229, 122]
   },
   "yield_eye_px": 553,
   "yield_px": 1549,
   "cover_alien_px": 32,
   "occluded": 0.031,
   "feat": {
    "eyeL": [
     5.6,
     -2.7
    ],
    "eyeR": [
     2.71,
     -1.85
    ],
    "mouth": [
     3.99,
     -3.66
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_canny_loop/36.png": {
   "m": [
    1.01488,
    -0.10687,
    -71.9,
    41.47
   ],
   "scale": 1.0205,
   "rot_deg": -6.01,
   "shift": [
    -16.1,
    4.7
   ],
   "inliers": 58,
   "residual_px": 0.77,
   "ref_residual_px": {
    "eyeL": 7.2,
    "eyeR": 2.8,
    "mouth": 5.7,
    "nose": 5.0,
    "pin": 1.4
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_canny_loop_36.png",
    "rect": [153, 227, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_canny_loop_36.png",
    "rect": [153, 227, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_canny_loop_36_u.png",
    "rect": [274, 376, 230, 122]
   },
   "yield_eye_px": 344,
   "yield_px": 1394,
   "cover_alien_px": 34,
   "occluded": 0.019,
   "feat": {
    "eyeL": [
     5.33,
     -2.7
    ],
    "eyeR": [
     2.47,
     -1.87
    ],
    "mouth": [
     3.73,
     -3.78
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_canny_loop/37.png": {
   "m": [
    1.01624,
    -0.09772,
    -66.9,
    37.11
   ],
   "scale": 1.0209,
   "rot_deg": -5.49,
   "shift": [
    -14.8,
    4.7
   ],
   "inliers": 71,
   "residual_px": 0.9,
   "ref_residual_px": {
    "eyeL": 7.2,
    "eyeR": 2.8,
    "mouth": 5.7,
    "nose": 5.7,
    "pin": 2.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_canny_loop_37.png",
    "rect": [154, 227, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_canny_loop_37.png",
    "rect": [154, 227, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_canny_loop_37_u.png",
    "rect": [276, 377, 230, 120]
   },
   "yield_eye_px": 602,
   "yield_px": 1724,
   "cover_alien_px": 0,
   "occluded": 0.033,
   "feat": {
    "eyeL": [
     5.33,
     -2.6
    ],
    "eyeR": [
     2.2,
     -1.87
    ],
    "mouth": [
     3.73,
     -3.78
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_canny_loop/38.png": {
   "m": [
    1.00513,
    -0.07829,
    -48.87,
    32.25
   ],
   "scale": 1.0082,
   "rot_deg": -4.45,
   "shift": [
    -10.3,
    2.6
   ],
   "inliers": 68,
   "residual_px": 0.81,
   "ref_residual_px": {
    "eyeL": 2.8,
    "eyeR": 1.4,
    "mouth": 2.8,
    "nose": 2.8,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_canny_loop_38.png",
    "rect": [159, 225, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_canny_loop_38.png",
    "rect": [159, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_canny_loop_38_u.png",
    "rect": [283, 377, 227, 116]
   },
   "yield_eye_px": 256,
   "yield_px": 594,
   "cover_alien_px": 24,
   "occluded": 0.015,
   "feat": {
    "eyeL": [
     3.64,
     -1.28
    ],
    "eyeR": [
     1.68,
     -1.04
    ],
    "mouth": [
     3.04,
     -1.98
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_canny_loop/39.png": {
   "m": [
    1.01099,
    -0.0652,
    -45.32,
    24.12
   ],
   "scale": 1.0131,
   "rot_deg": -3.69,
   "shift": [
    -10.5,
    2.6
   ],
   "inliers": 81,
   "residual_px": 0.8,
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
    "file": "track_ink/wave_h1_canny_loop_39.png",
    "rect": [159, 225, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_canny_loop_39.png",
    "rect": [159, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_canny_loop_39_u.png",
    "rect": [282, 378, 230, 114]
   },
   "yield_eye_px": 0,
   "yield_px": 475,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     2.11,
     -0.94
    ],
    "eyeR": [
     0.82,
     -0.93
    ],
    "mouth": [
     1.75,
     -1.78
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_canny_loop/40.png": {
   "m": [
    1.00644,
    -0.04637,
    -31.09,
    17.47
   ],
   "scale": 1.0075,
   "rot_deg": -2.64,
   "shift": [
    -6.9,
    1.5
   ],
   "inliers": 86,
   "residual_px": 0.84,
   "ref_residual_px": {
    "eyeL": 2.2,
    "eyeR": 1.0,
    "mouth": 2.2,
    "nose": 2.2,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_canny_loop_40.png",
    "rect": [162, 224, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_canny_loop_40.png",
    "rect": [162, 224, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_canny_loop_40_u.png",
    "rect": [287, 378, 229, 112]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 1,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     1.98,
     -0.33
    ],
    "eyeR": [
     0.82,
     -0.54
    ],
    "mouth": [
     1.75,
     -1.03
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_canny_loop/41.png": {
   "m": [
    1.00248,
    -0.03419,
    -22.29,
    13.2
   ],
   "scale": 1.0031,
   "rot_deg": -1.95,
   "shift": [
    -5.4,
    0.4
   ],
   "inliers": 130,
   "residual_px": 0.81,
   "ref_residual_px": {
    "eyeL": 2.2,
    "eyeR": 1.0,
    "mouth": 2.0,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_canny_loop_41.png",
    "rect": [164, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_canny_loop_41.png",
    "rect": [164, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_canny_loop_41_u.png",
    "rect": [290, 378, 228, 110]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     1.17,
     0.39
    ],
    "eyeR": [
     0.57,
     0.07
    ],
    "mouth": [
     1.32,
     0.1
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_canny_loop/42.png": {
   "m": [
    1.00145,
    -0.0202,
    -12.89,
    7.77
   ],
   "scale": 1.0017,
   "rot_deg": -1.16,
   "shift": [
    -2.9,
    0.2
   ],
   "inliers": 167,
   "residual_px": 0.71,
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
    "file": "track_ink/wave_h1_canny_loop_42.png",
    "rect": [166, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_canny_loop_42.png",
    "rect": [166, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_canny_loop_42_u.png",
    "rect": [293, 379, 227, 108]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.52,
     0.39
    ],
    "eyeR": [
     0.22,
     0.07
    ],
    "mouth": [
     0.53,
     0.11
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_canny_loop/43.png": {
   "m": [
    1.00099,
    -0.01244,
    -8.09,
    4.79
   ],
   "scale": 1.0011,
   "rot_deg": -0.71,
   "shift": [
    -1.9,
    0.2
   ],
   "inliers": 172,
   "residual_px": 0.64,
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
    "file": "track_ink/wave_h1_canny_loop_43.png",
    "rect": [167, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_canny_loop_43.png",
    "rect": [167, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_canny_loop_43_u.png",
    "rect": [294, 380, 226, 106]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.32,
     0.25
    ],
    "eyeR": [
     0.11,
     0.15
    ],
    "mouth": [
     0.42,
     0.12
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_canny_loop/44.png": {
   "m": [
    1.00024,
    -0.00551,
    -2.88,
    2.19
   ],
   "scale": 1.0003,
   "rot_deg": -0.32,
   "shift": [
    -0.2,
    0.1
   ],
   "inliers": 188,
   "residual_px": 0.53,
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
    "file": "track_ink/wave_h1_canny_loop_44.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_canny_loop_44.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_canny_loop_44_u.png",
    "rect": [297, 381, 225, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.06,
     0.18
    ],
    "eyeR": [
     -0.09,
     0.03
    ],
    "mouth": [
     -0.09,
     0.11
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_canny_loop/45.png": {
   "m": [
    1.00023,
    -0.00065,
    -0.55,
    0.28
   ],
   "scale": 1.0002,
   "rot_deg": -0.04,
   "shift": [
    -0.2,
    0.1
   ],
   "inliers": 183,
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
    "file": "track_ink/wave_h1_canny_loop_45.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_canny_loop_45.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_canny_loop_45_u.png",
    "rect": [297, 381, 227, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.09,
     0.11
    ],
    "eyeR": [
     -0.09,
     -0.02
    ],
    "mouth": [
     -0.13,
     0.1
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_canny_loop/46.png": {
   "m": [
    1.00013,
    -6e-05,
    -0.12,
    0.06
   ],
   "scale": 1.0001,
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
    "file": "track_ink/wave_h1_canny_loop_46.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_canny_loop_46.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_canny_loop_46_u.png",
    "rect": [297, 381, 227, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.1,
     0.09
    ],
    "eyeR": [
     -0.08,
     -0.02
    ],
    "mouth": [
     -0.09,
     0.1
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_canny_loop/47.png": {
   "m": [
    0.99987,
    8e-05,
    0.15,
    0.08
   ],
   "scale": 0.9999,
   "rot_deg": 0.0,
   "shift": [
    0.1,
    0.1
   ],
   "inliers": 186,
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
    "file": "track_ink/wave_h1_canny_loop_47.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_canny_loop_47.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_canny_loop_47_u.png",
    "rect": [297, 381, 227, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.1,
     0.03
    ],
    "eyeR": [
     -0.04,
     -0.0
    ],
    "mouth": [
     -0.09,
     0.06
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_canny_loop/48.png": {
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
    "file": "track_ink/wave_h1_canny_loop_48.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_canny_loop_48.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_canny_loop_48_u.png",
    "rect": [297, 381, 226, 104]
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
  "frames/think_h1_canny_loop/00.png": {
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
    "file": "track_ink/think_h1_canny_loop_00.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_h1_canny_loop_00.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_h1_canny_loop_00_u.png",
    "rect": [297, 381, 226, 104]
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
  "frames/think_h1_canny_loop/01.png": {
   "m": [
    0.99993,
    -6e-05,
    0.04,
    0.05
   ],
   "scale": 0.9999,
   "rot_deg": -0.0,
   "shift": [
    0.0,
    -0.0
   ],
   "inliers": 190,
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
    "file": "track_ink/think_h1_canny_loop_01.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_h1_canny_loop_01.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_h1_canny_loop_01_u.png",
    "rect": [297, 381, 225, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.0,
     0.0
    ],
    "eyeR": [
     0.01,
     0.02
    ],
    "mouth": [
     0.13,
     -0.0
    ]
   },
   "w": 1.0
  },
  "frames/think_h1_canny_loop/02.png": {
   "m": [
    0.99985,
    7e-05,
    0.23,
    -0.09
   ],
   "scale": 0.9998,
   "rot_deg": 0.0,
   "shift": [
    0.1,
    -0.1
   ],
   "inliers": 191,
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
    "file": "track_ink/think_h1_canny_loop_02.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_h1_canny_loop_02.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_h1_canny_loop_02_u.png",
    "rect": [297, 381, 227, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.0,
     -0.06
    ],
    "eyeR": [
     0.01,
     0.02
    ],
    "mouth": [
     0.13,
     -0.03
    ]
   },
   "w": 1.0
  },
  "frames/think_h1_canny_loop/03.png": {
   "m": [
    0.99983,
    0.00031,
    0.37,
    -0.17
   ],
   "scale": 0.9998,
   "rot_deg": 0.02,
   "shift": [
    0.2,
    -0.1
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
    "file": "track_ink/think_h1_canny_loop_03.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_h1_canny_loop_03.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_h1_canny_loop_03_u.png",
    "rect": [297, 381, 227, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.01,
     -0.06
    ],
    "eyeR": [
     0.05,
     0.02
    ],
    "mouth": [
     0.04,
     -0.03
    ]
   },
   "w": 1.0
  },
  "frames/think_h1_canny_loop/04.png": {
   "m": [
    0.99904,
    -0.00064,
    0.32,
    1.62
   ],
   "scale": 0.999,
   "rot_deg": -0.04,
   "shift": [
    0.2,
    0.9
   ],
   "inliers": 188,
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
    "file": "track_ink/think_h1_canny_loop_04.png",
    "rect": [169, 223, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_h1_canny_loop_04.png",
    "rect": [169, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_h1_canny_loop_04_u.png",
    "rect": [298, 382, 226, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.05,
     0.3
    ],
    "eyeR": [
     0.07,
     0.22
    ],
    "mouth": [
     0.04,
     0.36
    ]
   },
   "w": 1.0
  },
  "frames/think_h1_canny_loop/05.png": {
   "m": [
    1.0002,
    0.00329,
    1.52,
    2.06
   ],
   "scale": 1.0002,
   "rot_deg": 0.19,
   "shift": [
    0.1,
    3.5
   ],
   "inliers": 140,
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
    "file": "track_ink/think_h1_canny_loop_05.png",
    "rect": [169, 226, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_h1_canny_loop_05.png",
    "rect": [169, 226, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_h1_canny_loop_05_u.png",
    "rect": [298, 385, 226, 103]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.17,
     0.3
    ],
    "eyeR": [
     0.07,
     0.5
    ],
    "mouth": [
     -0.06,
     0.36
    ]
   },
   "w": 1.0
  },
  "frames/think_h1_canny_loop/06.png": {
   "m": [
    1.00453,
    -0.00653,
    -3.96,
    10.52
   ],
   "scale": 1.0046,
   "rot_deg": -0.37,
   "shift": [
    0.9,
    10.0
   ],
   "inliers": 98,
   "residual_px": 0.83,
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
    "file": "track_ink/think_h1_canny_loop_06.png",
    "rect": [170, 232, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_h1_canny_loop_06.png",
    "rect": [170, 232, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_h1_canny_loop_06_u.png",
    "rect": [298, 390, 226, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 384,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.17,
     0.64
    ],
    "eyeR": [
     -0.75,
     0.51
    ],
    "mouth": [
     -0.67,
     0.15
    ]
   },
   "w": 1.0
  },
  "frames/think_h1_canny_loop/07.png": {
   "m": [
    0.99864,
    -0.00674,
    -1.65,
    15.37
   ],
   "scale": 0.9987,
   "rot_deg": -0.39,
   "shift": [
    0.9,
    12.0
   ],
   "inliers": 69,
   "residual_px": 1.06,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 2.2,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_h1_canny_loop_07.png",
    "rect": [170, 234, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_h1_canny_loop_07.png",
    "rect": [170, 234, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_h1_canny_loop_07_u.png",
    "rect": [298, 393, 226, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 272,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.17,
     1.32
    ],
    "eyeR": [
     -1.04,
     2.06
    ],
    "mouth": [
     -0.7,
     -0.68
    ]
   },
   "w": 1.0
  },
  "frames/think_h1_canny_loop/08.png": {
   "m": [
    1.01012,
    -0.01323,
    -9.17,
    16.58
   ],
   "scale": 1.0102,
   "rot_deg": -0.75,
   "shift": [
    1.1,
    15.9
   ],
   "inliers": 44,
   "residual_px": 0.96,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 3.6,
    "mouth": 2.2,
    "nose": 1.4,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_h1_canny_loop_08.png",
    "rect": [170, 238, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_h1_canny_loop_08.png",
    "rect": [170, 238, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_h1_canny_loop_08_u.png",
    "rect": [296, 395, 228, 107]
   },
   "yield_eye_px": 0,
   "yield_px": 1629,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.05,
     1.32
    ],
    "eyeR": [
     -2.04,
     3.47
    ],
    "mouth": [
     -1.02,
     -1.69
    ]
   },
   "w": 1.0
  },
  "frames/think_h1_canny_loop/09.png": {
   "m": [
    1.0077,
    -0.02156,
    -11.9,
    18.97
   ],
   "scale": 1.0079,
   "rot_deg": -1.23,
   "shift": [
    1.3,
    13.7
   ],
   "inliers": 46,
   "residual_px": 0.98,
   "ref_residual_px": {
    "eyeL": 2.0,
    "eyeR": 2.8,
    "mouth": 2.8,
    "nose": 2.2,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_h1_canny_loop_09.png",
    "rect": [170, 236, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_h1_canny_loop_09.png",
    "rect": [170, 236, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_h1_canny_loop_09_u.png",
    "rect": [296, 392, 228, 108]
   },
   "yield_eye_px": 0,
   "yield_px": 1544,
   "cover_alien_px": 23,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.05,
     0.65
    ],
    "eyeR": [
     -2.04,
     3.47
    ],
    "mouth": [
     -1.02,
     -1.69
    ]
   },
   "w": 1.0
  },
  "frames/think_h1_canny_loop/10.png": {
   "m": [
    1.00273,
    -0.01435,
    -9.44,
    7.9
   ],
   "scale": 1.0028,
   "rot_deg": -0.82,
   "shift": [
    -1.6,
    3.3
   ],
   "inliers": 103,
   "residual_px": 1.05,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 1.4,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_h1_canny_loop_10.png",
    "rect": [167, 225, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_h1_canny_loop_10.png",
    "rect": [167, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_h1_canny_loop_10_u.png",
    "rect": [294, 383, 228, 106]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.05,
     0.65
    ],
    "eyeR": [
     -0.74,
     0.62
    ],
    "mouth": [
     -0.15,
     -0.56
    ]
   },
   "w": 1.0
  },
  "frames/think_h1_canny_loop/11.png": {
   "m": [
    0.99849,
    -0.01654,
    -10.14,
    6.24
   ],
   "scale": 0.9986,
   "rot_deg": -0.95,
   "shift": [
    -3.1,
    -1.2
   ],
   "inliers": 148,
   "residual_px": 0.81,
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
    "file": "track_ink/think_h1_canny_loop_11.png",
    "rect": [166, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_h1_canny_loop_11.png",
    "rect": [166, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_h1_canny_loop_11_u.png",
    "rect": [293, 379, 228, 106]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.05,
     -0.02
    ],
    "eyeR": [
     -0.08,
     0.44
    ],
    "mouth": [
     -0.03,
     -0.08
    ]
   },
   "w": 1.0
  },
  "frames/think_h1_canny_loop/12.png": {
   "m": [
    1.00104,
    -0.02807,
    -18.78,
    7.57
   ],
   "scale": 1.0014,
   "rot_deg": -1.61,
   "shift": [
    -5.3,
    -3.4
   ],
   "inliers": 124,
   "residual_px": 0.68,
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
    "file": "track_ink/think_h1_canny_loop_12.png",
    "rect": [164, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_h1_canny_loop_12.png",
    "rect": [164, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_h1_canny_loop_12_u.png",
    "rect": [290, 375, 228, 108]
   },
   "yield_eye_px": 0,
   "yield_px": 12,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.1,
     -0.35
    ],
    "eyeR": [
     -0.08,
     -0.14
    ],
    "mouth": [
     0.04,
     -0.02
    ]
   },
   "w": 1.0
  },
  "frames/think_h1_canny_loop/13.png": {
   "m": [
    1.00064,
    -0.03376,
    -22.3,
    10.66
   ],
   "scale": 1.0012,
   "rot_deg": -1.93,
   "shift": [
    -6.3,
    -2.8
   ],
   "inliers": 143,
   "residual_px": 0.63,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_h1_canny_loop_13.png",
    "rect": [163, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_h1_canny_loop_13.png",
    "rect": [163, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_h1_canny_loop_13_u.png",
    "rect": [289, 375, 227, 109]
   },
   "yield_eye_px": 0,
   "yield_px": 268,
   "cover_alien_px": 0,
   "occluded": 0.008,
   "feat": {
    "eyeL": [
     0.1,
     -0.35
    ],
    "eyeR": [
     -0.08,
     -0.14
    ],
    "mouth": [
     0.18,
     -0.08
    ]
   },
   "w": 1.0
  },
  "frames/think_h1_canny_loop/14.png": {
   "m": [
    0.99884,
    -0.04122,
    -25.98,
    17.13
   ],
   "scale": 0.9997,
   "rot_deg": -2.36,
   "shift": [
    -7.3,
    -0.3
   ],
   "inliers": 136,
   "residual_px": 0.68,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_h1_canny_loop_14.png",
    "rect": [162, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_h1_canny_loop_14.png",
    "rect": [162, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_h1_canny_loop_14_u.png",
    "rect": [288, 378, 227, 109]
   },
   "yield_eye_px": 0,
   "yield_px": 730,
   "cover_alien_px": 1,
   "occluded": 0.026,
   "feat": {
    "eyeL": [
     0.1,
     -0.35
    ],
    "eyeR": [
     -0.12,
     -0.04
    ],
    "mouth": [
     0.18,
     -0.1
    ]
   },
   "w": 1.0
  },
  "frames/think_h1_canny_loop/15.png": {
   "m": [
    1.0014,
    -0.04551,
    -29.42,
    20.59
   ],
   "scale": 1.0024,
   "rot_deg": -2.6,
   "shift": [
    -7.7,
    2.6
   ],
   "inliers": 130,
   "residual_px": 0.76,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_h1_canny_loop_15.png",
    "rect": [161, 225, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_h1_canny_loop_15.png",
    "rect": [161, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_h1_canny_loop_15_u.png",
    "rect": [287, 380, 227, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 865,
   "cover_alien_px": 3,
   "occluded": 0.032,
   "feat": {
    "eyeL": [
     0.11,
     -0.26
    ],
    "eyeR": [
     -0.28,
     -0.04
    ],
    "mouth": [
     0.17,
     -0.17
    ]
   },
   "w": 1.0
  },
  "frames/think_h1_canny_loop/16.png": {
   "m": [
    1.00121,
    -0.04677,
    -30.04,
    22.3
   ],
   "scale": 1.0023,
   "rot_deg": -2.67,
   "shift": [
    -7.8,
    3.8
   ],
   "inliers": 120,
   "residual_px": 0.77,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_h1_canny_loop_16.png",
    "rect": [161, 226, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_h1_canny_loop_16.png",
    "rect": [161, 226, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_h1_canny_loop_16_u.png",
    "rect": [287, 381, 227, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 893,
   "cover_alien_px": 1,
   "occluded": 0.034,
   "feat": {
    "eyeL": [
     0.11,
     -0.4
    ],
    "eyeR": [
     -0.35,
     -0.04
    ],
    "mouth": [
     0.15,
     -0.25
    ]
   },
   "w": 1.0
  },
  "frames/think_h1_canny_loop/17.png": {
   "m": [
    1.00089,
    -0.05043,
    -31.46,
    25.18
   ],
   "scale": 1.0022,
   "rot_deg": -2.88,
   "shift": [
    -7.6,
    5.0
   ],
   "inliers": 124,
   "residual_px": 0.95,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_h1_canny_loop_17.png",
    "rect": [161, 227, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_h1_canny_loop_17.png",
    "rect": [161, 227, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_h1_canny_loop_17_u.png",
    "rect": [287, 382, 227, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 917,
   "cover_alien_px": 1,
   "occluded": 0.035,
   "feat": {
    "eyeL": [
     0.0,
     -0.55
    ],
    "eyeR": [
     -0.46,
     -0.04
    ],
    "mouth": [
     0.14,
     -0.32
    ]
   },
   "w": 1.0
  },
  "frames/think_h1_canny_loop/18.png": {
   "m": [
    1.00142,
    -0.05053,
    -31.77,
    25.22
   ],
   "scale": 1.0027,
   "rot_deg": -2.89,
   "shift": [
    -7.7,
    5.2
   ],
   "inliers": 113,
   "residual_px": 0.7,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_h1_canny_loop_18.png",
    "rect": [161, 227, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_h1_canny_loop_18.png",
    "rect": [161, 227, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_h1_canny_loop_18_u.png",
    "rect": [287, 382, 227, 112]
   },
   "yield_eye_px": 0,
   "yield_px": 922,
   "cover_alien_px": 1,
   "occluded": 0.035,
   "feat": {
    "eyeL": [
     -0.07,
     -0.56
    ],
    "eyeR": [
     -0.48,
     -0.04
    ],
    "mouth": [
     0.13,
     -0.4
    ]
   },
   "w": 1.0
  },
  "frames/think_h1_canny_loop/19.png": {
   "m": [
    1.00132,
    -0.05082,
    -31.76,
    25.48
   ],
   "scale": 1.0026,
   "rot_deg": -2.91,
   "shift": [
    -7.6,
    5.3
   ],
   "inliers": 114,
   "residual_px": 0.89,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.4,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_h1_canny_loop_19.png",
    "rect": [161, 227, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_h1_canny_loop_19.png",
    "rect": [161, 227, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_h1_canny_loop_19_u.png",
    "rect": [287, 382, 227, 112]
   },
   "yield_eye_px": 0,
   "yield_px": 923,
   "cover_alien_px": 3,
   "occluded": 0.035,
   "feat": {
    "eyeL": [
     0.0,
     -0.55
    ],
    "eyeR": [
     -0.46,
     -0.04
    ],
    "mouth": [
     0.11,
     -0.47
    ]
   },
   "w": 1.0
  },
  "frames/think_h1_canny_loop/20.png": {
   "m": [
    1.00135,
    -0.04923,
    -31.23,
    24.47
   ],
   "scale": 1.0026,
   "rot_deg": -2.81,
   "shift": [
    -7.8,
    5.0
   ],
   "inliers": 113,
   "residual_px": 0.81,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_h1_canny_loop_20.png",
    "rect": [161, 227, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_h1_canny_loop_20.png",
    "rect": [161, 227, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_h1_canny_loop_20_u.png",
    "rect": [287, 382, 227, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 898,
   "cover_alien_px": 3,
   "occluded": 0.034,
   "feat": {
    "eyeL": [
     0.13,
     -0.35
    ],
    "eyeR": [
     -0.42,
     0.04
    ],
    "mouth": [
     0.1,
     -0.55
    ]
   },
   "w": 1.0
  },
  "frames/think_h1_canny_loop/21.png": {
   "m": [
    1.00176,
    -0.04972,
    -31.57,
    24.55
   ],
   "scale": 1.003,
   "rot_deg": -2.84,
   "shift": [
    -7.7,
    5.1
   ],
   "inliers": 116,
   "residual_px": 0.77,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_h1_canny_loop_21.png",
    "rect": [161, 227, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_h1_canny_loop_21.png",
    "rect": [161, 227, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_h1_canny_loop_21_u.png",
    "rect": [287, 382, 227, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 905,
   "cover_alien_px": 3,
   "occluded": 0.034,
   "feat": {
    "eyeL": [
     0.13,
     -0.35
    ],
    "eyeR": [
     -0.42,
     0.04
    ],
    "mouth": [
     0.08,
     -0.62
    ]
   },
   "w": 1.0
  },
  "frames/think_h1_canny_loop/22.png": {
   "m": [
    1.00115,
    -0.0509,
    -31.69,
    25.42
   ],
   "scale": 1.0024,
   "rot_deg": -2.91,
   "shift": [
    -7.5,
    5.2
   ],
   "inliers": 113,
   "residual_px": 0.91,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_h1_canny_loop_22.png",
    "rect": [161, 227, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_h1_canny_loop_22.png",
    "rect": [161, 227, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_h1_canny_loop_22_u.png",
    "rect": [287, 382, 227, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 910,
   "cover_alien_px": 3,
   "occluded": 0.034,
   "feat": {
    "eyeL": [
     -0.07,
     -0.58
    ],
    "eyeR": [
     -0.51,
     -0.05
    ],
    "mouth": [
     0.07,
     -0.7
    ]
   },
   "w": 1.0
  },
  "frames/think_h1_canny_loop/23.png": {
   "m": [
    1.00129,
    -0.051,
    -31.74,
    25.5
   ],
   "scale": 1.0026,
   "rot_deg": -2.92,
   "shift": [
    -7.5,
    5.3
   ],
   "inliers": 111,
   "residual_px": 0.9,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_h1_canny_loop_23.png",
    "rect": [162, 227, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_h1_canny_loop_23.png",
    "rect": [162, 227, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_h1_canny_loop_23_u.png",
    "rect": [287, 382, 227, 112]
   },
   "yield_eye_px": 0,
   "yield_px": 915,
   "cover_alien_px": 4,
   "occluded": 0.034,
   "feat": {
    "eyeL": [
     -0.07,
     -0.71
    ],
    "eyeR": [
     -0.54,
     -0.13
    ],
    "mouth": [
     0.06,
     -0.77
    ]
   },
   "w": 1.0
  },
  "frames/think_h1_canny_loop/24.png": {
   "m": [
    1.0016,
    -0.0511,
    -31.92,
    25.42
   ],
   "scale": 1.0029,
   "rot_deg": -2.92,
   "shift": [
    -7.5,
    5.3
   ],
   "inliers": 107,
   "residual_px": 0.75,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_h1_canny_loop_24.png",
    "rect": [162, 227, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_h1_canny_loop_24.png",
    "rect": [162, 227, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_h1_canny_loop_24_u.png",
    "rect": [287, 382, 227, 112]
   },
   "yield_eye_px": 0,
   "yield_px": 917,
   "cover_alien_px": 3,
   "occluded": 0.034,
   "feat": {
    "eyeL": [
     -0.06,
     -0.71
    ],
    "eyeR": [
     -0.54,
     -0.13
    ],
    "mouth": [
     0.04,
     -0.85
    ]
   },
   "w": 1.0
  },
  "frames/think_h1_canny_loop/25.png": {
   "m": [
    1.00172,
    -0.04943,
    -31.36,
    24.45
   ],
   "scale": 1.0029,
   "rot_deg": -2.82,
   "shift": [
    -7.7,
    5.1
   ],
   "inliers": 107,
   "residual_px": 0.91,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_h1_canny_loop_25.png",
    "rect": [161, 227, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_h1_canny_loop_25.png",
    "rect": [161, 227, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_h1_canny_loop_25_u.png",
    "rect": [287, 382, 227, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 916,
   "cover_alien_px": 2,
   "occluded": 0.035,
   "feat": {
    "eyeL": [
     0.1,
     -0.38
    ],
    "eyeR": [
     -0.43,
     -0.0
    ],
    "mouth": [
     0.03,
     -0.92
    ]
   },
   "w": 1.0
  },
  "frames/think_h1_canny_loop/26.png": {
   "m": [
    1.00187,
    -0.04905,
    -31.31,
    24.22
   ],
   "scale": 1.0031,
   "rot_deg": -2.8,
   "shift": [
    -7.7,
    5.0
   ],
   "inliers": 113,
   "residual_px": 0.86,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_h1_canny_loop_26.png",
    "rect": [161, 227, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_h1_canny_loop_26.png",
    "rect": [161, 227, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_h1_canny_loop_26_u.png",
    "rect": [287, 382, 227, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 934,
   "cover_alien_px": 2,
   "occluded": 0.036,
   "feat": {
    "eyeL": [
     0.11,
     -0.38
    ],
    "eyeR": [
     -0.41,
     -0.0
    ],
    "mouth": [
     0.02,
     -1.0
    ]
   },
   "w": 1.0
  },
  "frames/think_h1_canny_loop/27.png": {
   "m": [
    1.00164,
    -0.04941,
    -31.33,
    24.43
   ],
   "scale": 1.0029,
   "rot_deg": -2.82,
   "shift": [
    -7.7,
    5.0
   ],
   "inliers": 120,
   "residual_px": 0.9,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_h1_canny_loop_27.png",
    "rect": [161, 227, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_h1_canny_loop_27.png",
    "rect": [161, 227, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_h1_canny_loop_27_u.png",
    "rect": [287, 382, 227, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 925,
   "cover_alien_px": 1,
   "occluded": 0.035,
   "feat": {
    "eyeL": [
     0.17,
     -0.35
    ],
    "eyeR": [
     -0.39,
     -0.05
    ],
    "mouth": [
     0.0,
     -1.07
    ]
   },
   "w": 1.0
  },
  "frames/think_h1_canny_loop/28.png": {
   "m": [
    1.00178,
    -0.04782,
    -30.87,
    23.55
   ],
   "scale": 1.0029,
   "rot_deg": -2.73,
   "shift": [
    -7.9,
    4.8
   ],
   "inliers": 107,
   "residual_px": 0.83,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 0.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_h1_canny_loop_28.png",
    "rect": [161, 227, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_h1_canny_loop_28.png",
    "rect": [161, 227, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_h1_canny_loop_28_u.png",
    "rect": [287, 382, 227, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 923,
   "cover_alien_px": 1,
   "occluded": 0.036,
   "feat": {
    "eyeL": [
     0.11,
     -0.36
    ],
    "eyeR": [
     -0.32,
     -0.09
    ],
    "mouth": [
     -0.01,
     -1.15
    ]
   },
   "w": 1.0
  },
  "frames/think_h1_canny_loop/29.png": {
   "m": [
    1.00111,
    -0.05133,
    -32.33,
    23.92
   ],
   "scale": 1.0024,
   "rot_deg": -2.94,
   "shift": [
    -8.0,
    3.5
   ],
   "inliers": 112,
   "residual_px": 0.72,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_h1_canny_loop_29.png",
    "rect": [161, 225, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_h1_canny_loop_29.png",
    "rect": [161, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_h1_canny_loop_29_u.png",
    "rect": [287, 380, 227, 112]
   },
   "yield_eye_px": 0,
   "yield_px": 981,
   "cover_alien_px": 0,
   "occluded": 0.038,
   "feat": {
    "eyeL": [
     0.11,
     -0.36
    ],
    "eyeR": [
     -0.32,
     -0.09
    ],
    "mouth": [
     -0.02,
     -1.22
    ]
   },
   "w": 1.0
  },
  "frames/think_h1_canny_loop/30.png": {
   "m": [
    1.0007,
    -0.0563,
    -34.63,
    25.81
   ],
   "scale": 1.0023,
   "rot_deg": -3.22,
   "shift": [
    -8.1,
    3.1
   ],
   "inliers": 125,
   "residual_px": 0.95,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_h1_canny_loop_30.png",
    "rect": [161, 225, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_h1_canny_loop_30.png",
    "rect": [161, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_h1_canny_loop_30_u.png",
    "rect": [286, 380, 226, 112]
   },
   "yield_eye_px": 0,
   "yield_px": 984,
   "cover_alien_px": 4,
   "occluded": 0.038,
   "feat": {
    "eyeL": [
     0.05,
     -0.37
    ],
    "eyeR": [
     -0.36,
     0.01
    ],
    "mouth": [
     -0.04,
     -1.3
    ]
   },
   "w": 1.0
  },
  "frames/think_h1_canny_loop/31.png": {
   "m": [
    1.00035,
    -0.06228,
    -38.19,
    29.2
   ],
   "scale": 1.0023,
   "rot_deg": -3.56,
   "shift": [
    -9.1,
    3.9
   ],
   "inliers": 122,
   "residual_px": 0.92,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_h1_canny_loop_31.png",
    "rect": [160, 226, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_h1_canny_loop_31.png",
    "rect": [160, 226, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_h1_canny_loop_31_u.png",
    "rect": [285, 380, 227, 113]
   },
   "yield_eye_px": 0,
   "yield_px": 673,
   "cover_alien_px": 4,
   "occluded": 0.027,
   "feat": {
    "eyeL": [
     0.05,
     -0.37
    ],
    "eyeR": [
     -0.43,
     0.12
    ],
    "mouth": [
     -0.05,
     -1.37
    ]
   },
   "w": 1.0
  },
  "frames/think_h1_canny_loop/32.png": {
   "m": [
    1.00403,
    -0.07514,
    -45.83,
    36.23
   ],
   "scale": 1.0068,
   "rot_deg": -4.28,
   "shift": [
    -9.2,
    7.4
   ],
   "inliers": 65,
   "residual_px": 1.1,
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
    "file": "track_ink/think_h1_canny_loop_32.png",
    "rect": [160, 229, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_h1_canny_loop_32.png",
    "rect": [160, 229, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_h1_canny_loop_32_u.png",
    "rect": [284, 382, 226, 116]
   },
   "yield_eye_px": 0,
   "yield_px": 607,
   "cover_alien_px": 9,
   "occluded": 0.004,
   "feat": {
    "eyeL": [
     0.05,
     0.02
    ],
    "eyeR": [
     -0.94,
     1.17
    ],
    "mouth": [
     -0.06,
     -1.37
    ]
   },
   "w": 1.0
  },
  "frames/think_h1_canny_loop/33.png": {
   "m": [
    1.00161,
    -0.08439,
    -48.05,
    44.35
   ],
   "scale": 1.0052,
   "rot_deg": -4.82,
   "shift": [
    -8.1,
    10.6
   ],
   "inliers": 36,
   "residual_px": 0.95,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 5.4,
    "mouth": 1.4,
    "nose": 1.4,
    "pin": 1.4
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_h1_canny_loop_33.png",
    "rect": [161, 233, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_h1_canny_loop_33.png",
    "rect": [161, 233, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_h1_canny_loop_33_u.png",
    "rect": [285, 385, 224, 117]
   },
   "yield_eye_px": 2,
   "yield_px": 1262,
   "cover_alien_px": 41,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.01,
     3.98
    ],
    "eyeR": [
     -1.19,
     6.95
    ],
    "mouth": [
     -0.28,
     -1.11
    ]
   },
   "w": 1.0
  },
  "frames/think_h1_canny_loop/34.png": {
   "m": [
    0.98361,
    -0.04738,
    -22.6,
    33.79
   ],
   "scale": 0.9848,
   "rot_deg": -2.76,
   "shift": [
    -7.3,
    6.8
   ],
   "inliers": 32,
   "residual_px": 1.02,
   "ref_residual_px": {
    "mouth": 7.0,
    "nose": 7.0,
    "pin": 1.4
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_h1_canny_loop_34.png",
    "rect": [162, 229, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_h1_canny_loop_34.png",
    "rect": [162, 229, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_h1_canny_loop_34_u.png",
    "rect": [289, 386, 221, 109]
   },
   "yield_eye_px": 1031,
   "yield_px": 1223,
   "cover_alien_px": 0,
   "occluded": 0.061,
   "feat": {
    "eyeL": [
     -0.01,
     4.32
    ],
    "eyeR": [
     -1.19,
     6.95
    ],
    "mouth": [
     -0.54,
     6.88
    ]
   },
   "w": 1.0
  },
  "frames/think_h1_canny_loop/35.png": {
   "m": [
    0.98018,
    -0.04085,
    -16.75,
    32.46
   ],
   "scale": 0.981,
   "rot_deg": -2.39,
   "shift": [
    -5.8,
    6.5
   ],
   "inliers": 35,
   "residual_px": 0.87,
   "ref_residual_px": {
    "mouth": 7.1,
    "nose": 6.1,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_h1_canny_loop_35.png",
    "rect": [163, 229, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_h1_canny_loop_35.png",
    "rect": [163, 229, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_h1_canny_loop_35_u.png",
    "rect": [292, 386, 220, 108]
   },
   "yield_eye_px": 589,
   "yield_px": 875,
   "cover_alien_px": 0,
   "occluded": 0.035,
   "feat": {
    "eyeL": [
     0.21,
     4.66
    ],
    "eyeR": [
     -0.98,
     6.33
    ],
    "mouth": [
     -0.39,
     6.88
    ]
   },
   "w": 1.0
  },
  "frames/think_h1_canny_loop/36.png": {
   "m": [
    1.00292,
    -0.04339,
    -25.64,
    23.48
   ],
   "scale": 1.0039,
   "rot_deg": -2.48,
   "shift": [
    -4.3,
    7.1
   ],
   "inliers": 44,
   "residual_px": 1.17,
   "ref_residual_px": {
    "eyeL": 2.0,
    "eyeR": 4.1,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_h1_canny_loop_36.png",
    "rect": [165, 229, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_h1_canny_loop_36.png",
    "rect": [165, 229, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_h1_canny_loop_36_u.png",
    "rect": [290, 384, 228, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 6,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.21,
     4.66
    ],
    "eyeR": [
     -0.77,
     5.72
    ],
    "mouth": [
     -0.39,
     0.15
    ]
   },
   "w": 1.0
  },
  "frames/think_h1_canny_loop/37.png": {
   "m": [
    1.00147,
    -0.03487,
    -20.28,
    16.76
   ],
   "scale": 1.0021,
   "rot_deg": -1.99,
   "shift": [
    -3.5,
    3.2
   ],
   "inliers": 86,
   "residual_px": 0.97,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.4,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/think_h1_canny_loop_37.png",
    "rect": [166, 225, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_h1_canny_loop_37.png",
    "rect": [166, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_h1_canny_loop_37_u.png",
    "rect": [292, 381, 227, 109]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.15,
     0.65
    ],
    "eyeR": [
     -0.56,
     1.08
    ],
    "mouth": [
     -0.1,
     0.08
    ]
   },
   "w": 1.0
  },
  "frames/think_h1_canny_loop/38.png": {
   "m": [
    1.00122,
    -0.0222,
    -13.19,
    5.96
   ],
   "scale": 1.0015,
   "rot_deg": -1.27,
   "shift": [
    -2.4,
    -2.5
   ],
   "inliers": 152,
   "residual_px": 0.81,
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
    "file": "track_ink/think_h1_canny_loop_38.png",
    "rect": [167, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_h1_canny_loop_38.png",
    "rect": [167, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_h1_canny_loop_38_u.png",
    "rect": [293, 377, 227, 107]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 10,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.15,
     -0.35
    ],
    "eyeR": [
     0.1,
     -0.35
    ],
    "mouth": [
     0.12,
     -0.02
    ]
   },
   "w": 1.0
  },
  "frames/think_h1_canny_loop/39.png": {
   "m": [
    1.00124,
    -0.01519,
    -9.5,
    2.71
   ],
   "scale": 1.0014,
   "rot_deg": -0.87,
   "shift": [
    -1.9,
    -2.9
   ],
   "inliers": 157,
   "residual_px": 0.71,
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
    "file": "track_ink/think_h1_canny_loop_39.png",
    "rect": [167, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_h1_canny_loop_39.png",
    "rect": [167, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_h1_canny_loop_39_u.png",
    "rect": [294, 377, 228, 106]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 12,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.19,
     -0.35
    ],
    "eyeR": [
     0.1,
     -0.35
    ],
    "mouth": [
     0.12,
     0.08
    ]
   },
   "w": 1.0
  },
  "frames/think_h1_canny_loop/40.png": {
   "m": [
    1.00073,
    -0.0103,
    -5.98,
    1.8
   ],
   "scale": 1.0008,
   "rot_deg": -0.59,
   "shift": [
    -0.9,
    -2.1
   ],
   "inliers": 175,
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
    "file": "track_ink/think_h1_canny_loop_40.png",
    "rect": [168, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_h1_canny_loop_40.png",
    "rect": [168, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_h1_canny_loop_40_u.png",
    "rect": [296, 378, 226, 106]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.19,
     -0.35
    ],
    "eyeR": [
     0.06,
     -0.1
    ],
    "mouth": [
     -0.1,
     -0.05
    ]
   },
   "w": 1.0
  },
  "frames/think_h1_canny_loop/41.png": {
   "m": [
    0.99969,
    -0.00795,
    -4.02,
    2.36
   ],
   "scale": 0.9997,
   "rot_deg": -0.46,
   "shift": [
    -0.4,
    -1.0
   ],
   "inliers": 180,
   "residual_px": 0.54,
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
    "file": "track_ink/think_h1_canny_loop_41.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_h1_canny_loop_41.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_h1_canny_loop_41_u.png",
    "rect": [296, 379, 228, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.1,
     -0.28
    ],
    "eyeR": [
     0.06,
     -0.05
    ],
    "mouth": [
     -0.13,
     0.04
    ]
   },
   "w": 1.0
  },
  "frames/think_h1_canny_loop/42.png": {
   "m": [
    1.00037,
    -0.00326,
    -2.05,
    1.08
   ],
   "scale": 1.0004,
   "rot_deg": -0.19,
   "shift": [
    -0.4,
    -0.1
   ],
   "inliers": 167,
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
    "file": "track_ink/think_h1_canny_loop_42.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_h1_canny_loop_42.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_h1_canny_loop_42_u.png",
    "rect": [296, 381, 228, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 12,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.01,
     -0.07
    ],
    "eyeR": [
     0.03,
     -0.05
    ],
    "mouth": [
     -0.13,
     0.03
    ]
   },
   "w": 1.0
  },
  "frames/think_h1_canny_loop/43.png": {
   "m": [
    0.99981,
    0.00011,
    -0.12,
    0.17
   ],
   "scale": 0.9998,
   "rot_deg": 0.01,
   "shift": [
    -0.3,
    0.1
   ],
   "inliers": 173,
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
    "file": "track_ink/think_h1_canny_loop_43.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_h1_canny_loop_43.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_h1_canny_loop_43_u.png",
    "rect": [297, 381, 227, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.01,
     -0.03
    ],
    "eyeR": [
     0.03,
     -0.02
    ],
    "mouth": [
     -0.11,
     0.03
    ]
   },
   "w": 1.0
  },
  "frames/think_h1_canny_loop/44.png": {
   "m": [
    0.99974,
    -3e-05,
    -0.01,
    0.25
   ],
   "scale": 0.9997,
   "rot_deg": -0.0,
   "shift": [
    -0.1,
    0.1
   ],
   "inliers": 181,
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
    "file": "track_ink/think_h1_canny_loop_44.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_h1_canny_loop_44.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_h1_canny_loop_44_u.png",
    "rect": [297, 381, 227, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.04,
     -0.02
    ],
    "eyeR": [
     0.03,
     -0.02
    ],
    "mouth": [
     -0.09,
     0.03
    ]
   },
   "w": 1.0
  },
  "frames/think_h1_canny_loop/45.png": {
   "m": [
    0.99986,
    -6e-05,
    -0.05,
    0.19
   ],
   "scale": 0.9999,
   "rot_deg": -0.0,
   "shift": [
    -0.1,
    0.1
   ],
   "inliers": 188,
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
    "file": "track_ink/think_h1_canny_loop_45.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_h1_canny_loop_45.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_h1_canny_loop_45_u.png",
    "rect": [297, 381, 227, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.04,
     -0.02
    ],
    "eyeR": [
     0.02,
     0.02
    ],
    "mouth": [
     -0.09,
     0.07
    ]
   },
   "w": 1.0
  },
  "frames/think_h1_canny_loop/46.png": {
   "m": [
    0.99997,
    -5e-05,
    -0.07,
    0.13
   ],
   "scale": 1.0,
   "rot_deg": -0.0,
   "shift": [
    -0.1,
    0.1
   ],
   "inliers": 196,
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
    "file": "track_ink/think_h1_canny_loop_46.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_h1_canny_loop_46.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_h1_canny_loop_46_u.png",
    "rect": [297, 381, 227, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.03,
     -0.02
    ],
    "eyeR": [
     0.0,
     0.02
    ],
    "mouth": [
     -0.09,
     0.07
    ]
   },
   "w": 1.0
  },
  "frames/think_h1_canny_loop/47.png": {
   "m": [
    0.99995,
    -0.0001,
    -0.07,
    0.15
   ],
   "scale": 0.9999,
   "rot_deg": -0.01,
   "shift": [
    -0.0,
    0.1
   ],
   "inliers": 188,
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
    "file": "track_ink/think_h1_canny_loop_47.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_h1_canny_loop_47.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_h1_canny_loop_47_u.png",
    "rect": [297, 381, 227, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 1,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.02,
     -0.01
    ],
    "eyeR": [
     0.0,
     0.02
    ],
    "mouth": [
     -0.09,
     0.07
    ]
   },
   "w": 1.0
  },
  "frames/think_h1_canny_loop/48.png": {
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
    "file": "track_ink/think_h1_canny_loop_48.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/think_h1_canny_loop_48.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_h1_canny_loop_48_u.png",
    "rect": [297, 381, 226, 104]
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
  "frames/wave_h1_s2_canny_loop/00.png": {
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
    "file": "track_ink/wave_h1_s2_canny_loop_00.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_00.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_00_u.png",
    "rect": [297, 381, 226, 104]
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
  "frames/wave_h1_s2_canny_loop/01.png": {
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
    "file": "track_ink/wave_h1_s2_canny_loop_01.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_01.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_01_u.png",
    "rect": [297, 381, 225, 104]
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
  "frames/wave_h1_s2_canny_loop/02.png": {
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
    "file": "track_ink/wave_h1_s2_canny_loop_02.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_02.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_02_u.png",
    "rect": [297, 381, 225, 104]
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
  "frames/wave_h1_s2_canny_loop/03.png": {
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
    "file": "track_ink/wave_h1_s2_canny_loop_03.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_03.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_03_u.png",
    "rect": [297, 381, 225, 104]
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
  "frames/wave_h1_s2_canny_loop/04.png": {
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
    "file": "track_ink/wave_h1_s2_canny_loop_04.png",
    "rect": [169, 223, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_04.png",
    "rect": [169, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_04_u.png",
    "rect": [297, 382, 225, 105]
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
  "frames/wave_h1_s2_canny_loop/05.png": {
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
    "file": "track_ink/wave_h1_s2_canny_loop_05.png",
    "rect": [168, 226, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_05.png",
    "rect": [168, 226, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_05_u.png",
    "rect": [296, 384, 226, 106]
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
  "frames/wave_h1_s2_canny_loop/06.png": {
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
    "file": "track_ink/wave_h1_s2_canny_loop_06.png",
    "rect": [168, 230, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_06.png",
    "rect": [168, 230, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_06_u.png",
    "rect": [294, 387, 228, 109]
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
  "frames/wave_h1_s2_canny_loop/07.png": {
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
    "file": "track_ink/wave_h1_s2_canny_loop_07.png",
    "rect": [168, 232, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_07.png",
    "rect": [168, 232, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_07_u.png",
    "rect": [294, 388, 228, 109]
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
  "frames/wave_h1_s2_canny_loop/08.png": {
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
    "file": "track_ink/wave_h1_s2_canny_loop_08.png",
    "rect": [169, 230, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_08.png",
    "rect": [169, 230, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_08_u.png",
    "rect": [296, 387, 228, 107]
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
  "frames/wave_h1_s2_canny_loop/09.png": {
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
    "file": "track_ink/wave_h1_s2_canny_loop_09.png",
    "rect": [170, 228, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_09.png",
    "rect": [170, 228, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_09_u.png",
    "rect": [298, 387, 228, 104]
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
  "frames/wave_h1_s2_canny_loop/10.png": {
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
    "file": "track_ink/wave_h1_s2_canny_loop_10.png",
    "rect": [172, 224, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_10.png",
    "rect": [172, 224, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_10_u.png",
    "rect": [302, 382, 226, 106]
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
  "frames/wave_h1_s2_canny_loop/11.png": {
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
    "file": "track_ink/wave_h1_s2_canny_loop_11.png",
    "rect": [174, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_11.png",
    "rect": [174, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_11_u.png",
    "rect": [304, 378, 226, 110]
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
  "frames/wave_h1_s2_canny_loop/12.png": {
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
    "file": "track_ink/wave_h1_s2_canny_loop_12.png",
    "rect": [176, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_12.png",
    "rect": [176, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_12_u.png",
    "rect": [307, 375, 225, 113]
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
  "frames/wave_h1_s2_canny_loop/13.png": {
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
    "file": "track_ink/wave_h1_s2_canny_loop_13.png",
    "rect": [177, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_13.png",
    "rect": [177, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_13_u.png",
    "rect": [310, 374, 224, 114]
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
  "frames/wave_h1_s2_canny_loop/14.png": {
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
    "file": "track_ink/wave_h1_s2_canny_loop_14.png",
    "rect": [178, 218, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_14.png",
    "rect": [178, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_14_u.png",
    "rect": [312, 373, 222, 114]
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
  "frames/wave_h1_s2_canny_loop/15.png": {
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
    "file": "track_ink/wave_h1_s2_canny_loop_15.png",
    "rect": [176, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_15.png",
    "rect": [176, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_15_u.png",
    "rect": [308, 375, 224, 113]
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
  "frames/wave_h1_s2_canny_loop/16.png": {
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
    "file": "track_ink/wave_h1_s2_canny_loop_16.png",
    "rect": [174, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_16.png",
    "rect": [174, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_16_u.png",
    "rect": [304, 378, 226, 111]
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
  "frames/wave_h1_s2_canny_loop/17.png": {
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
    "file": "track_ink/wave_h1_s2_canny_loop_17.png",
    "rect": [172, 224, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_17.png",
    "rect": [172, 224, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_17_u.png",
    "rect": [301, 380, 229, 110]
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
  "frames/wave_h1_s2_canny_loop/18.png": {
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
    "file": "track_ink/wave_h1_s2_canny_loop_18.png",
    "rect": [176, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_18.png",
    "rect": [176, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_18_u.png",
    "rect": [308, 378, 224, 111]
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
  "frames/wave_h1_s2_canny_loop/19.png": {
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
    "file": "track_ink/wave_h1_s2_canny_loop_19.png",
    "rect": [175, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_19.png",
    "rect": [175, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_19_u.png",
    "rect": [307, 378, 225, 111]
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
  "frames/wave_h1_s2_canny_loop/20.png": {
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
    "file": "track_ink/wave_h1_s2_canny_loop_20.png",
    "rect": [176, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_20.png",
    "rect": [176, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_20_u.png",
    "rect": [308, 378, 224, 109]
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
  "frames/wave_h1_s2_canny_loop/21.png": {
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
    "file": "track_ink/wave_h1_s2_canny_loop_21.png",
    "rect": [171, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_21.png",
    "rect": [171, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_21_u.png",
    "rect": [300, 378, 230, 110]
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
  "frames/wave_h1_s2_canny_loop/22.png": {
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
    "file": "track_ink/wave_h1_s2_canny_loop_22.png",
    "rect": [171, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_22.png",
    "rect": [171, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_22_u.png",
    "rect": [301, 378, 227, 110]
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
  "frames/wave_h1_s2_canny_loop/23.png": {
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
    "file": "track_ink/wave_h1_s2_canny_loop_23.png",
    "rect": [174, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_23.png",
    "rect": [174, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_23_u.png",
    "rect": [304, 377, 226, 113]
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
  "frames/wave_h1_s2_canny_loop/24.png": {
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
    "file": "track_ink/wave_h1_s2_canny_loop_24.png",
    "rect": [175, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_24.png",
    "rect": [175, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_24_u.png",
    "rect": [306, 376, 226, 115]
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
  "frames/wave_h1_s2_canny_loop/25.png": {
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
    "file": "track_ink/wave_h1_s2_canny_loop_25.png",
    "rect": [176, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_25.png",
    "rect": [176, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_25_u.png",
    "rect": [308, 376, 226, 115]
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
  "frames/wave_h1_s2_canny_loop/26.png": {
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
    "file": "track_ink/wave_h1_s2_canny_loop_26.png",
    "rect": [175, 223, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_26.png",
    "rect": [175, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_26_u.png",
    "rect": [306, 376, 228, 115]
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
  "frames/wave_h1_s2_canny_loop/27.png": {
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
    "file": "track_ink/wave_h1_s2_canny_loop_27.png",
    "rect": [175, 223, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_27.png",
    "rect": [175, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_27_u.png",
    "rect": [306, 376, 227, 115]
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
  "frames/wave_h1_s2_canny_loop/28.png": {
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
    "file": "track_ink/wave_h1_s2_canny_loop_28.png",
    "rect": [177, 223, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_28.png",
    "rect": [177, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_28_u.png",
    "rect": [310, 373, 226, 122]
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
  "frames/wave_h1_s2_canny_loop/29.png": {
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
    "file": "track_ink/wave_h1_s2_canny_loop_29.png",
    "rect": [178, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_29.png",
    "rect": [178, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_29_u.png",
    "rect": [312, 371, 226, 125]
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
  "frames/wave_h1_s2_canny_loop/30.png": {
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
    "file": "track_ink/wave_h1_s2_canny_loop_30.png",
    "rect": [178, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_30.png",
    "rect": [178, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_30_u.png",
    "rect": [313, 371, 225, 125]
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
  "frames/wave_h1_s2_canny_loop/31.png": {
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
    "file": "track_ink/wave_h1_s2_canny_loop_31.png",
    "rect": [179, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_31.png",
    "rect": [179, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_31_u.png",
    "rect": [314, 370, 225, 125]
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
  "frames/wave_h1_s2_canny_loop/32.png": {
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
    "file": "track_ink/wave_h1_s2_canny_loop_32.png",
    "rect": [179, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_32.png",
    "rect": [179, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_32_u.png",
    "rect": [316, 370, 223, 124]
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
  "frames/wave_h1_s2_canny_loop/33.png": {
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
    "file": "track_ink/wave_h1_s2_canny_loop_33.png",
    "rect": [179, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_33.png",
    "rect": [179, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_33_u.png",
    "rect": [316, 371, 222, 121]
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
  "frames/wave_h1_s2_canny_loop/34.png": {
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
    "file": "track_ink/wave_h1_s2_canny_loop_34.png",
    "rect": [179, 218, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_34.png",
    "rect": [179, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_34_u.png",
    "rect": [314, 371, 223, 120]
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
  "frames/wave_h1_s2_canny_loop/35.png": {
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
    "file": "track_ink/wave_h1_s2_canny_loop_35.png",
    "rect": [178, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_35.png",
    "rect": [178, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_35_u.png",
    "rect": [312, 372, 224, 117]
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
  "frames/wave_h1_s2_canny_loop/36.png": {
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
    "file": "track_ink/wave_h1_s2_canny_loop_36.png",
    "rect": [177, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_36.png",
    "rect": [177, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_36_u.png",
    "rect": [310, 373, 224, 115]
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
  "frames/wave_h1_s2_canny_loop/37.png": {
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
    "file": "track_ink/wave_h1_s2_canny_loop_37.png",
    "rect": [176, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_37.png",
    "rect": [176, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_37_u.png",
    "rect": [308, 374, 224, 113]
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
  "frames/wave_h1_s2_canny_loop/38.png": {
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
    "file": "track_ink/wave_h1_s2_canny_loop_38.png",
    "rect": [173, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_38.png",
    "rect": [173, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_38_u.png",
    "rect": [304, 376, 226, 110]
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
  "frames/wave_h1_s2_canny_loop/39.png": {
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
    "file": "track_ink/wave_h1_s2_canny_loop_39.png",
    "rect": [172, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_39.png",
    "rect": [172, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_39_u.png",
    "rect": [302, 378, 226, 107]
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
  "frames/wave_h1_s2_canny_loop/40.png": {
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
    "file": "track_ink/wave_h1_s2_canny_loop_40.png",
    "rect": [170, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_40.png",
    "rect": [170, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_40_u.png",
    "rect": [299, 380, 227, 105]
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
  "frames/wave_h1_s2_canny_loop/41.png": {
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
    "file": "track_ink/wave_h1_s2_canny_loop_41.png",
    "rect": [170, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_41.png",
    "rect": [170, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_41_u.png",
    "rect": [298, 380, 226, 105]
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
  "frames/wave_h1_s2_canny_loop/42.png": {
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
    "file": "track_ink/wave_h1_s2_canny_loop_42.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_42.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_42_u.png",
    "rect": [298, 381, 226, 103]
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
  "frames/wave_h1_s2_canny_loop/43.png": {
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
    "file": "track_ink/wave_h1_s2_canny_loop_43.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_43.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_43_u.png",
    "rect": [297, 381, 225, 104]
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
  "frames/wave_h1_s2_canny_loop/44.png": {
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
    "file": "track_ink/wave_h1_s2_canny_loop_44.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_44.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_44_u.png",
    "rect": [297, 381, 225, 104]
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
  "frames/wave_h1_s2_canny_loop/45.png": {
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
    "file": "track_ink/wave_h1_s2_canny_loop_45.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_45.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_45_u.png",
    "rect": [297, 381, 225, 104]
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
  "frames/wave_h1_s2_canny_loop/46.png": {
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
    "file": "track_ink/wave_h1_s2_canny_loop_46.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_46.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_46_u.png",
    "rect": [297, 381, 225, 104]
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
  "frames/wave_h1_s2_canny_loop/47.png": {
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
    "file": "track_ink/wave_h1_s2_canny_loop_47.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_47.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_47_u.png",
    "rect": [297, 381, 225, 104]
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
  "frames/wave_h1_s2_canny_loop/48.png": {
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
    "file": "track_ink/wave_h1_s2_canny_loop_48.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_s2_canny_loop_48.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_s2_canny_loop_48_u.png",
    "rect": [297, 381, 226, 104]
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
  "frames/wave_h1_mid_canny_loop/00.png": {
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
    "file": "track_ink/wave_h1_mid_canny_loop_00.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_mid_canny_loop_00.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_mid_canny_loop_00_u.png",
    "rect": [297, 381, 226, 104]
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
  "frames/wave_h1_mid_canny_loop/01.png": {
   "m": [
    0.99907,
    0.00082,
    1.14,
    0.04
   ],
   "scale": 0.9991,
   "rot_deg": 0.05,
   "shift": [
    0.4,
    -0.1
   ],
   "inliers": 188,
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
    "file": "track_ink/wave_h1_mid_canny_loop_01.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_mid_canny_loop_01.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_mid_canny_loop_01_u.png",
    "rect": [298, 381, 226, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.28,
     -0.0
    ],
    "eyeR": [
     -0.09,
     -0.0
    ],
    "mouth": [
     -0.22,
     0.06
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_mid_canny_loop/02.png": {
   "m": [
    0.99907,
    0.00058,
    0.97,
    0.21
   ],
   "scale": 0.9991,
   "rot_deg": 0.03,
   "shift": [
    0.3,
    0.0
   ],
   "inliers": 175,
   "residual_px": 0.61,
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
    "file": "track_ink/wave_h1_mid_canny_loop_02.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_mid_canny_loop_02.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_mid_canny_loop_02_u.png",
    "rect": [297, 381, 227, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.31,
     -0.0
    ],
    "eyeR": [
     -0.12,
     -0.02
    ],
    "mouth": [
     -0.33,
     0.1
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_mid_canny_loop/03.png": {
   "m": [
    0.99883,
    0.00096,
    0.97,
    0.07
   ],
   "scale": 0.9988,
   "rot_deg": 0.06,
   "shift": [
    0.0,
    -0.1
   ],
   "inliers": 157,
   "residual_px": 0.68,
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
    "file": "track_ink/wave_h1_mid_canny_loop_03.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_mid_canny_loop_03.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_mid_canny_loop_03_u.png",
    "rect": [297, 381, 227, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.28,
     0.1
    ],
    "eyeR": [
     -0.09,
     -0.04
    ],
    "mouth": [
     -0.33,
     0.14
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_mid_canny_loop/04.png": {
   "m": [
    0.99932,
    -0.00718,
    -4.95,
    3.53
   ],
   "scale": 0.9993,
   "rot_deg": -0.41,
   "shift": [
    -1.9,
    0.3
   ],
   "inliers": 165,
   "residual_px": 0.79,
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
    "file": "track_ink/wave_h1_mid_canny_loop_04.png",
    "rect": [167, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_mid_canny_loop_04.png",
    "rect": [167, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_mid_canny_loop_04_u.png",
    "rect": [295, 381, 227, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.21,
     0.28
    ],
    "eyeR": [
     0.0,
     -0.12
    ],
    "mouth": [
     -0.09,
     0.15
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_mid_canny_loop/05.png": {
   "m": [
    0.9993,
    -0.01439,
    -9.43,
    6.72
   ],
   "scale": 0.9994,
   "rot_deg": -0.83,
   "shift": [
    -3.0,
    0.5
   ],
   "inliers": 140,
   "residual_px": 0.77,
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
    "file": "track_ink/wave_h1_mid_canny_loop_05.png",
    "rect": [166, 223, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_mid_canny_loop_05.png",
    "rect": [166, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_mid_canny_loop_05_u.png",
    "rect": [293, 380, 227, 106]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.19,
     0.28
    ],
    "eyeR": [
     0.01,
     -0.15
    ],
    "mouth": [
     -0.07,
     0.14
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_mid_canny_loop/06.png": {
   "m": [
    1.00095,
    -0.03046,
    -20.78,
    12.6
   ],
   "scale": 1.0014,
   "rot_deg": -1.74,
   "shift": [
    -6.2,
    0.6
   ],
   "inliers": 138,
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
    "file": "track_ink/wave_h1_mid_canny_loop_06.png",
    "rect": [163, 223, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_mid_canny_loop_06.png",
    "rect": [163, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_mid_canny_loop_06_u.png",
    "rect": [289, 379, 229, 109]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.79,
     0.27
    ],
    "eyeR": [
     0.49,
     -0.22
    ],
    "mouth": [
     1.05,
     -0.02
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_mid_canny_loop/07.png": {
   "m": [
    1.00168,
    -0.0407,
    -26.82,
    16.46
   ],
   "scale": 1.0025,
   "rot_deg": -2.33,
   "shift": [
    -7.2,
    0.6
   ],
   "inliers": 97,
   "residual_px": 0.91,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 1.0,
    "mouth": 2.2,
    "nose": 1.4,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_mid_canny_loop_07.png",
    "rect": [162, 223, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_mid_canny_loop_07.png",
    "rect": [162, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_mid_canny_loop_07_u.png",
    "rect": [288, 378, 228, 110]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.83,
     -0.35
    ],
    "eyeR": [
     0.5,
     -0.44
    ],
    "mouth": [
     1.16,
     -0.5
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_mid_canny_loop/08.png": {
   "m": [
    1.01143,
    -0.05174,
    -39.8,
    16.24
   ],
   "scale": 1.0127,
   "rot_deg": -2.93,
   "shift": [
    -11.1,
    0.4
   ],
   "inliers": 56,
   "residual_px": 0.68,
   "ref_residual_px": {
    "eyeL": 4.5,
    "eyeR": 2.8,
    "mouth": 4.5,
    "nose": 3.6,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_mid_canny_loop_08.png",
    "rect": [158, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_mid_canny_loop_08.png",
    "rect": [158, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_mid_canny_loop_08_u.png",
    "rect": [282, 376, 230, 113]
   },
   "yield_eye_px": 0,
   "yield_px": 619,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     4.04,
     -1.14
    ],
    "eyeR": [
     2.23,
     -1.3
    ],
    "mouth": [
     3.48,
     -2.21
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_mid_canny_loop/09.png": {
   "m": [
    1.01551,
    -0.0616,
    -47.73,
    18.43
   ],
   "scale": 1.0174,
   "rot_deg": -3.47,
   "shift": [
    -12.7,
    0.5
   ],
   "inliers": 57,
   "residual_px": 0.73,
   "ref_residual_px": {
    "eyeL": 6.3,
    "eyeR": 3.6,
    "mouth": 5.0,
    "nose": 5.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_mid_canny_loop_09.png",
    "rect": [156, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_mid_canny_loop_09.png",
    "rect": [156, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_mid_canny_loop_09_u.png",
    "rect": [280, 375, 230, 115]
   },
   "yield_eye_px": 473,
   "yield_px": 1354,
   "cover_alien_px": 18,
   "occluded": 0.026,
   "feat": {
    "eyeL": [
     5.18,
     -1.84
    ],
    "eyeR": [
     2.82,
     -1.62
    ],
    "mouth": [
     4.26,
     -3.02
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_mid_canny_loop/10.png": {
   "m": [
    1.01739,
    -0.0729,
    -55.5,
    22.03
   ],
   "scale": 1.02,
   "rot_deg": -4.1,
   "shift": [
    -14.5,
    0.3
   ],
   "inliers": 53,
   "residual_px": 0.85,
   "ref_residual_px": {
    "eyeL": 7.6,
    "eyeR": 4.2,
    "mouth": 7.2,
    "nose": 5.8,
    "pin": 1.4
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_mid_canny_loop_10.png",
    "rect": [155, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_mid_canny_loop_10.png",
    "rect": [155, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_mid_canny_loop_10_u.png",
    "rect": [277, 374, 231, 117]
   },
   "yield_eye_px": 1000,
   "yield_px": 2182,
   "cover_alien_px": 0,
   "occluded": 0.056,
   "feat": {
    "eyeL": [
     5.18,
     -2.41
    ],
    "eyeR": [
     2.82,
     -1.91
    ],
    "mouth": [
     4.26,
     -3.53
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_mid_canny_loop/11.png": {
   "m": [
    1.0162,
    -0.07303,
    -53.99,
    22.62
   ],
   "scale": 1.0188,
   "rot_deg": -4.11,
   "shift": [
    -13.4,
    0.3
   ],
   "inliers": 38,
   "residual_px": 0.89,
   "ref_residual_px": {
    "eyeL": 5.8,
    "eyeR": 4.1,
    "mouth": 5.7,
    "nose": 5.0,
    "pin": 1.4
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_mid_canny_loop_11.png",
    "rect": [156, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_mid_canny_loop_11.png",
    "rect": [156, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_mid_canny_loop_11_u.png",
    "rect": [278, 374, 236, 117]
   },
   "yield_eye_px": 1318,
   "yield_px": 2633,
   "cover_alien_px": 0,
   "occluded": 0.073,
   "feat": {
    "eyeL": [
     4.73,
     -2.59
    ],
    "eyeR": [
     1.88,
     -1.91
    ],
    "mouth": [
     3.61,
     -3.53
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_mid_canny_loop/12.png": {
   "m": [
    1.01501,
    -0.07316,
    -52.47,
    23.22
   ],
   "scale": 1.0176,
   "rot_deg": -4.12,
   "shift": [
    -12.3,
    0.3
   ],
   "inliers": 38,
   "residual_px": 0.68,
   "ref_residual_px": {
    "eyeL": 6.4,
    "eyeR": 4.1,
    "mouth": 5.7,
    "nose": 4.2,
    "pin": 2.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_mid_canny_loop_12.png",
    "rect": [157, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_mid_canny_loop_12.png",
    "rect": [157, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_mid_canny_loop_12_u.png",
    "rect": [280, 374, 235, 117]
   },
   "yield_eye_px": 1688,
   "yield_px": 3229,
   "cover_alien_px": 0,
   "occluded": 0.094,
   "feat": {
    "eyeL": [
     4.6,
     -3.08
    ],
    "eyeR": [
     1.8,
     -1.59
    ],
    "mouth": [
     3.12,
     -3.6
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_mid_canny_loop/13.png": {
   "m": [
    1.01635,
    -0.07033,
    -51.2,
    21.95
   ],
   "scale": 1.0188,
   "rot_deg": -3.96,
   "shift": [
    -11.8,
    0.8
   ],
   "inliers": 42,
   "residual_px": 1.11,
   "ref_residual_px": {
    "eyeL": 6.4,
    "eyeR": 4.1,
    "mouth": 5.0,
    "nose": 5.0,
    "pin": 2.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_mid_canny_loop_13.png",
    "rect": [157, 223, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_mid_canny_loop_13.png",
    "rect": [157, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_mid_canny_loop_13_u.png",
    "rect": [280, 375, 236, 116]
   },
   "yield_eye_px": 1641,
   "yield_px": 3336,
   "cover_alien_px": 0,
   "occluded": 0.091,
   "feat": {
    "eyeL": [
     4.6,
     -3.08
    ],
    "eyeR": [
     1.8,
     -1.59
    ],
    "mouth": [
     3.12,
     -3.78
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_mid_canny_loop/14.png": {
   "m": [
    1.01684,
    -0.04984,
    -40.77,
    13.64
   ],
   "scale": 1.0181,
   "rot_deg": -2.81,
   "shift": [
    -10.7,
    1.1
   ],
   "inliers": 41,
   "residual_px": 0.74,
   "ref_residual_px": {
    "eyeL": 6.7,
    "eyeR": 4.5,
    "mouth": 5.7,
    "nose": 5.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_mid_canny_loop_14.png",
    "rect": [158, 223, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_mid_canny_loop_14.png",
    "rect": [158, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_mid_canny_loop_14_u.png",
    "rect": [282, 377, 235, 113]
   },
   "yield_eye_px": 1349,
   "yield_px": 2872,
   "cover_alien_px": 0,
   "occluded": 0.075,
   "feat": {
    "eyeL": [
     5.09,
     -3.06
    ],
    "eyeR": [
     2.39,
     -1.59
    ],
    "mouth": [
     3.85,
     -3.78
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_mid_canny_loop/15.png": {
   "m": [
    1.01595,
    -0.01734,
    -22.57,
    -0.02
   ],
   "scale": 1.0161,
   "rot_deg": -0.98,
   "shift": [
    -8.0,
    0.3
   ],
   "inliers": 54,
   "residual_px": 1.04,
   "ref_residual_px": {
    "eyeL": 6.3,
    "eyeR": 3.6,
    "mouth": 5.0,
    "nose": 4.5,
    "pin": 1.4
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_mid_canny_loop_15.png",
    "rect": [161, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_mid_canny_loop_15.png",
    "rect": [161, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_mid_canny_loop_15_u.png",
    "rect": [286, 379, 230, 108]
   },
   "yield_eye_px": 1048,
   "yield_px": 2338,
   "cover_alien_px": 0,
   "occluded": 0.059,
   "feat": {
    "eyeL": [
     5.09,
     -2.97
    ],
    "eyeR": [
     2.39,
     -1.83
    ],
    "mouth": [
     3.85,
     -3.78
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_mid_canny_loop/16.png": {
   "m": [
    1.02193,
    -0.00138,
    -15.31,
    -7.86
   ],
   "scale": 1.0219,
   "rot_deg": -0.08,
   "shift": [
    -5.7,
    1.8
   ],
   "inliers": 49,
   "residual_px": 0.67,
   "ref_residual_px": {
    "eyeL": 6.7,
    "eyeR": 3.2,
    "mouth": 5.7,
    "nose": 5.7,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_mid_canny_loop_16.png",
    "rect": [163, 224, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_mid_canny_loop_16.png",
    "rect": [163, 224, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_mid_canny_loop_16_u.png",
    "rect": [289, 381, 231, 106]
   },
   "yield_eye_px": 516,
   "yield_px": 2197,
   "cover_alien_px": 0,
   "occluded": 0.029,
   "feat": {
    "eyeL": [
     5.07,
     -1.75
    ],
    "eyeR": [
     1.99,
     -1.31
    ],
    "mouth": [
     3.39,
     -2.67
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_mid_canny_loop/17.png": {
   "m": [
    1.0114,
    0.04162,
    12.11,
    -23.01
   ],
   "scale": 1.0123,
   "rot_deg": 2.36,
   "shift": [
    -2.6,
    -0.7
   ],
   "inliers": 65,
   "residual_px": 0.73,
   "ref_residual_px": {
    "eyeL": 4.0,
    "eyeR": 2.2,
    "mouth": 4.1,
    "nose": 4.1,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_mid_canny_loop_17.png",
    "rect": [166, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_mid_canny_loop_17.png",
    "rect": [166, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_mid_canny_loop_17_u.png",
    "rect": [295, 377, 227, 110]
   },
   "yield_eye_px": 84,
   "yield_px": 621,
   "cover_alien_px": 2,
   "occluded": 0.005,
   "feat": {
    "eyeL": [
     3.8,
     -0.14
    ],
    "eyeR": [
     1.8,
     -0.68
    ],
    "mouth": [
     3.36,
     -1.35
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_mid_canny_loop/18.png": {
   "m": [
    1.00515,
    0.05762,
    25.57,
    -26.84
   ],
   "scale": 1.0068,
   "rot_deg": 3.28,
   "shift": [
    0.9,
    -0.9
   ],
   "inliers": 80,
   "residual_px": 0.74,
   "ref_residual_px": {
    "eyeL": 2.0,
    "eyeR": 1.4,
    "mouth": 2.2,
    "nose": 2.2,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_mid_canny_loop_18.png",
    "rect": [170, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_mid_canny_loop_18.png",
    "rect": [170, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_mid_canny_loop_18_u.png",
    "rect": [299, 376, 227, 111]
   },
   "yield_eye_px": 61,
   "yield_px": 383,
   "cover_alien_px": 0,
   "occluded": 0.003,
   "feat": {
    "eyeL": [
     1.56,
     -0.14
    ],
    "eyeR": [
     0.71,
     -0.62
    ],
    "mouth": [
     1.5,
     -0.92
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_mid_canny_loop/19.png": {
   "m": [
    0.99752,
    0.08074,
    43.88,
    -33.17
   ],
   "scale": 1.0008,
   "rot_deg": 4.63,
   "shift": [
    5.3,
    -1.3
   ],
   "inliers": 120,
   "residual_px": 0.74,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_mid_canny_loop_19.png",
    "rect": [174, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_mid_canny_loop_19.png",
    "rect": [174, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_mid_canny_loop_19_u.png",
    "rect": [306, 375, 226, 114]
   },
   "yield_eye_px": 65,
   "yield_px": 348,
   "cover_alien_px": 4,
   "occluded": 0.004,
   "feat": {
    "eyeL": [
     -0.3,
     -0.14
    ],
    "eyeR": [
     -0.21,
     -0.1
    ],
    "mouth": [
     -0.57,
     -0.14
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_mid_canny_loop/20.png": {
   "m": [
    0.99517,
    0.08645,
    49.18,
    -34.49
   ],
   "scale": 0.9989,
   "rot_deg": 4.96,
   "shift": [
    7.0,
    -1.4
   ],
   "inliers": 99,
   "residual_px": 0.82,
   "ref_residual_px": {
    "eyeL": 2.0,
    "eyeR": 1.4,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_mid_canny_loop_20.png",
    "rect": [176, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_mid_canny_loop_20.png",
    "rect": [176, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_mid_canny_loop_20_u.png",
    "rect": [308, 375, 226, 114]
   },
   "yield_eye_px": 138,
   "yield_px": 406,
   "cover_alien_px": 5,
   "occluded": 0.008,
   "feat": {
    "eyeL": [
     -1.2,
     -0.07
    ],
    "eyeR": [
     -1.05,
     -0.03
    ],
    "mouth": [
     -1.59,
     -0.04
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_mid_canny_loop/21.png": {
   "m": [
    0.98895,
    0.09104,
    54.82,
    -34.02
   ],
   "scale": 0.9931,
   "rot_deg": 5.26,
   "shift": [
    7.9,
    -2.0
   ],
   "inliers": 61,
   "residual_px": 0.79,
   "ref_residual_px": {
    "eyeL": 3.0,
    "eyeR": 2.0,
    "mouth": 2.2,
    "nose": 2.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_mid_canny_loop_21.png",
    "rect": [177, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_mid_canny_loop_21.png",
    "rect": [177, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_mid_canny_loop_21_u.png",
    "rect": [310, 374, 224, 115]
   },
   "yield_eye_px": 278,
   "yield_px": 516,
   "cover_alien_px": 11,
   "occluded": 0.016,
   "feat": {
    "eyeL": [
     -2.37,
     0.11
    ],
    "eyeR": [
     -1.51,
     0.21
    ],
    "mouth": [
     -2.28,
     0.7
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_mid_canny_loop/22.png": {
   "m": [
    0.9744,
    0.09061,
    62.43,
    -29.06
   ],
   "scale": 0.9786,
   "rot_deg": 5.31,
   "shift": [
    9.8,
    -4.0
   ],
   "inliers": 63,
   "residual_px": 0.76,
   "ref_residual_px": {
    "eyeL": 6.3,
    "eyeR": 2.2,
    "mouth": 5.0,
    "nose": 4.5,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_mid_canny_loop_22.png",
    "rect": [179, 218, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_mid_canny_loop_22.png",
    "rect": [179, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_mid_canny_loop_22_u.png",
    "rect": [313, 373, 221, 114]
   },
   "yield_eye_px": 228,
   "yield_px": 719,
   "cover_alien_px": 3,
   "occluded": 0.014,
   "feat": {
    "eyeL": [
     -4.22,
     1.36
    ],
    "eyeR": [
     -2.48,
     0.41
    ],
    "mouth": [
     -3.38,
     1.82
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_mid_canny_loop/23.png": {
   "m": [
    0.98388,
    0.08166,
    51.65,
    -28.92
   ],
   "scale": 0.9873,
   "rot_deg": 4.74,
   "shift": [
    7.1,
    -3.0
   ],
   "inliers": 60,
   "residual_px": 0.7,
   "ref_residual_px": {
    "eyeL": 5.4,
    "eyeR": 2.0,
    "mouth": 3.6,
    "nose": 3.2,
    "pin": 2.2
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_mid_canny_loop_23.png",
    "rect": [176, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_mid_canny_loop_23.png",
    "rect": [176, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_mid_canny_loop_23_u.png",
    "rect": [309, 374, 223, 113]
   },
   "yield_eye_px": 176,
   "yield_px": 725,
   "cover_alien_px": 3,
   "occluded": 0.01,
   "feat": {
    "eyeL": [
     -4.22,
     1.36
    ],
    "eyeR": [
     -2.48,
     0.41
    ],
    "mouth": [
     -3.38,
     1.82
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_mid_canny_loop/24.png": {
   "m": [
    0.99328,
    0.07254,
    40.81,
    -28.66
   ],
   "scale": 0.9959,
   "rot_deg": 4.18,
   "shift": [
    4.3,
    -2.1
   ],
   "inliers": 58,
   "residual_px": 0.81,
   "ref_residual_px": {
    "eyeL": 2.2,
    "eyeR": 1.0,
    "mouth": 1.4,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_mid_canny_loop_24.png",
    "rect": [173, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_mid_canny_loop_24.png",
    "rect": [173, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_mid_canny_loop_24_u.png",
    "rect": [306, 375, 226, 112]
   },
   "yield_eye_px": 259,
   "yield_px": 558,
   "cover_alien_px": 13,
   "occluded": 0.015,
   "feat": {
    "eyeL": [
     -2.99,
     0.87
    ],
    "eyeR": [
     -1.82,
     0.41
    ],
    "mouth": [
     -2.7,
     1.52
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_mid_canny_loop/25.png": {
   "m": [
    0.98901,
    0.04808,
    29.78,
    -17.49
   ],
   "scale": 0.9902,
   "rot_deg": 2.78,
   "shift": [
    2.9,
    -3.0
   ],
   "inliers": 63,
   "residual_px": 0.82,
   "ref_residual_px": {
    "eyeL": 3.2,
    "eyeR": 2.2,
    "mouth": 2.8,
    "nose": 2.2,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_mid_canny_loop_25.png",
    "rect": [172, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_mid_canny_loop_25.png",
    "rect": [172, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_mid_canny_loop_25_u.png",
    "rect": [303, 376, 225, 109]
   },
   "yield_eye_px": 393,
   "yield_px": 695,
   "cover_alien_px": 17,
   "occluded": 0.023,
   "feat": {
    "eyeL": [
     -2.43,
     0.87
    ],
    "eyeR": [
     -1.36,
     0.57
    ],
    "mouth": [
     -2.15,
     1.52
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_mid_canny_loop/26.png": {
   "m": [
    0.98993,
    0.03355,
    20.52,
    -12.07
   ],
   "scale": 0.9905,
   "rot_deg": 1.94,
   "shift": [
    0.8,
    -3.0
   ],
   "inliers": 64,
   "residual_px": 0.8,
   "ref_residual_px": {
    "eyeL": 3.2,
    "eyeR": 1.4,
    "mouth": 2.8,
    "nose": 2.2,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_mid_canny_loop_26.png",
    "rect": [170, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_mid_canny_loop_26.png",
    "rect": [170, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_mid_canny_loop_26_u.png",
    "rect": [300, 377, 224, 106]
   },
   "yield_eye_px": 355,
   "yield_px": 618,
   "cover_alien_px": 14,
   "occluded": 0.021,
   "feat": {
    "eyeL": [
     -2.43,
     0.87
    ],
    "eyeR": [
     -1.36,
     0.57
    ],
    "mouth": [
     -2.15,
     1.52
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_mid_canny_loop/27.png": {
   "m": [
    0.9977,
    0.00452,
    -0.41,
    -2.64
   ],
   "scale": 0.9977,
   "rot_deg": 0.26,
   "shift": [
    -3.5,
    -1.9
   ],
   "inliers": 89,
   "residual_px": 0.9,
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
    "file": "track_ink/wave_h1_mid_canny_loop_27.png",
    "rect": [166, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_mid_canny_loop_27.png",
    "rect": [166, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_mid_canny_loop_27_u.png",
    "rect": [294, 380, 226, 103]
   },
   "yield_eye_px": 430,
   "yield_px": 770,
   "cover_alien_px": 4,
   "occluded": 0.025,
   "feat": {
    "eyeL": [
     -0.65,
     0.21
    ],
    "eyeR": [
     -0.43,
     -0.06
    ],
    "mouth": [
     -0.51,
     0.21
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_mid_canny_loop/28.png": {
   "m": [
    1.00033,
    -0.00988,
    -10.53,
    2.33
   ],
   "scale": 1.0004,
   "rot_deg": -0.57,
   "shift": [
    -5.8,
    -1.6
   ],
   "inliers": 79,
   "residual_px": 0.61,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_mid_canny_loop_28.png",
    "rect": [163, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_mid_canny_loop_28.png",
    "rect": [163, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_mid_canny_loop_28_u.png",
    "rect": [291, 379, 226, 105]
   },
   "yield_eye_px": 587,
   "yield_px": 924,
   "cover_alien_px": 5,
   "occluded": 0.034,
   "feat": {
    "eyeL": [
     0.14,
     0.17
    ],
    "eyeR": [
     0.16,
     -0.09
    ],
    "mouth": [
     0.27,
     -0.09
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_mid_canny_loop/29.png": {
   "m": [
    1.00901,
    -0.03306,
    -29.58,
    9.05
   ],
   "scale": 1.0096,
   "rot_deg": -1.88,
   "shift": [
    -10.5,
    -0.3
   ],
   "inliers": 56,
   "residual_px": 0.75,
   "ref_residual_px": {
    "eyeL": 3.2,
    "eyeR": 2.2,
    "mouth": 3.6,
    "nose": 3.2,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_mid_canny_loop_29.png",
    "rect": [158, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_mid_canny_loop_29.png",
    "rect": [158, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_mid_canny_loop_29_u.png",
    "rect": [284, 377, 233, 110]
   },
   "yield_eye_px": 710,
   "yield_px": 1390,
   "cover_alien_px": 1,
   "occluded": 0.04,
   "feat": {
    "eyeL": [
     2.94,
     -0.45
    ],
    "eyeR": [
     1.37,
     -0.94
    ],
    "mouth": [
     2.15,
     -1.6
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_mid_canny_loop/30.png": {
   "m": [
    1.00948,
    -0.05221,
    -39.41,
    17.54
   ],
   "scale": 1.0108,
   "rot_deg": -2.96,
   "shift": [
    -11.2,
    0.6
   ],
   "inliers": 53,
   "residual_px": 0.71,
   "ref_residual_px": {
    "eyeL": 4.2,
    "eyeR": 3.2,
    "mouth": 2.8,
    "nose": 2.8,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_mid_canny_loop_30.png",
    "rect": [158, 223, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_mid_canny_loop_30.png",
    "rect": [158, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_mid_canny_loop_30_u.png",
    "rect": [282, 377, 234, 112]
   },
   "yield_eye_px": 774,
   "yield_px": 1901,
   "cover_alien_px": 0,
   "occluded": 0.044,
   "feat": {
    "eyeL": [
     3.01,
     -1.76
    ],
    "eyeR": [
     1.69,
     -1.07
    ],
    "mouth": [
     2.73,
     -2.27
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_mid_canny_loop/31.png": {
   "m": [
    1.01075,
    -0.07697,
    -54.85,
    28.0
   ],
   "scale": 1.0137,
   "rot_deg": -4.35,
   "shift": [
    -14.6,
    1.6
   ],
   "inliers": 49,
   "residual_px": 0.86,
   "ref_residual_px": {
    "eyeL": 5.8,
    "eyeR": 3.6,
    "mouth": 5.0,
    "nose": 5.0,
    "pin": 1.4
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_mid_canny_loop_31.png",
    "rect": [154, 224, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_mid_canny_loop_31.png",
    "rect": [154, 224, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_mid_canny_loop_31_u.png",
    "rect": [278, 376, 234, 116]
   },
   "yield_eye_px": 1235,
   "yield_px": 2482,
   "cover_alien_px": 1,
   "occluded": 0.069,
   "feat": {
    "eyeL": [
     4.39,
     -2.16
    ],
    "eyeR": [
     2.33,
     -1.38
    ],
    "mouth": [
     3.32,
     -2.75
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_mid_canny_loop/32.png": {
   "m": [
    1.01453,
    -0.08861,
    -64.15,
    32.22
   ],
   "scale": 1.0184,
   "rot_deg": -4.99,
   "shift": [
    -17.0,
    2.8
   ],
   "inliers": 43,
   "residual_px": 0.67,
   "ref_residual_px": {
    "eyeL": 6.7,
    "eyeR": 4.5,
    "mouth": 6.4,
    "nose": 5.8,
    "pin": 1.4
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_mid_canny_loop_32.png",
    "rect": [152, 225, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_mid_canny_loop_32.png",
    "rect": [152, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_mid_canny_loop_32_u.png",
    "rect": [274, 376, 236, 118]
   },
   "yield_eye_px": 1122,
   "yield_px": 2455,
   "cover_alien_px": 2,
   "occluded": 0.063,
   "feat": {
    "eyeL": [
     5.8,
     -2.25
    ],
    "eyeR": [
     3.16,
     -1.97
    ],
    "mouth": [
     4.45,
     -3.55
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_mid_canny_loop/33.png": {
   "m": [
    1.01545,
    -0.09474,
    -68.1,
    34.83
   ],
   "scale": 1.0199,
   "rot_deg": -5.33,
   "shift": [
    -17.7,
    3.3
   ],
   "inliers": 55,
   "residual_px": 0.92,
   "ref_residual_px": {
    "eyeL": 7.6,
    "eyeR": 4.2,
    "mouth": 6.4,
    "nose": 5.8,
    "pin": 1.4
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_mid_canny_loop_33.png",
    "rect": [151, 225, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_mid_canny_loop_33.png",
    "rect": [151, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_mid_canny_loop_33_u.png",
    "rect": [273, 376, 231, 119]
   },
   "yield_eye_px": 931,
   "yield_px": 2178,
   "cover_alien_px": 2,
   "occluded": 0.052,
   "feat": {
    "eyeL": [
     6.09,
     -2.25
    ],
    "eyeR": [
     3.22,
     -1.97
    ],
    "mouth": [
     4.64,
     -3.55
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_mid_canny_loop/34.png": {
   "m": [
    1.01519,
    -0.11105,
    -76.48,
    42.46
   ],
   "scale": 1.0212,
   "rot_deg": -6.24,
   "shift": [
    -18.6,
    4.1
   ],
   "inliers": 52,
   "residual_px": 0.87,
   "ref_residual_px": {
    "eyeL": 7.3,
    "eyeR": 3.6,
    "mouth": 5.0,
    "nose": 5.8,
    "pin": 2.2
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_mid_canny_loop_34.png",
    "rect": [150, 226, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_mid_canny_loop_34.png",
    "rect": [150, 226, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_mid_canny_loop_34_u.png",
    "rect": [272, 375, 232, 122]
   },
   "yield_eye_px": 804,
   "yield_px": 1858,
   "cover_alien_px": 2,
   "occluded": 0.045,
   "feat": {
    "eyeL": [
     6.09,
     -2.25
    ],
    "eyeR": [
     3.16,
     -1.85
    ],
    "mouth": [
     4.64,
     -3.63
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_mid_canny_loop/35.png": {
   "m": [
    1.01343,
    -0.116,
    -76.87,
    45.87
   ],
   "scale": 1.0201,
   "rot_deg": -6.53,
   "shift": [
    -17.4,
    4.7
   ],
   "inliers": 62,
   "residual_px": 0.9,
   "ref_residual_px": {
    "eyeL": 6.7,
    "eyeR": 2.8,
    "mouth": 5.7,
    "nose": 5.0,
    "pin": 1.4
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_mid_canny_loop_35.png",
    "rect": [152, 227, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_mid_canny_loop_35.png",
    "rect": [152, 227, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_mid_canny_loop_35_u.png",
    "rect": [273, 376, 227, 122]
   },
   "yield_eye_px": 917,
   "yield_px": 2034,
   "cover_alien_px": 0,
   "occluded": 0.051,
   "feat": {
    "eyeL": [
     5.6,
     -2.7
    ],
    "eyeR": [
     2.71,
     -1.85
    ],
    "mouth": [
     3.99,
     -3.66
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_mid_canny_loop/36.png": {
   "m": [
    1.01488,
    -0.10687,
    -71.9,
    41.47
   ],
   "scale": 1.0205,
   "rot_deg": -6.01,
   "shift": [
    -16.1,
    4.7
   ],
   "inliers": 58,
   "residual_px": 0.77,
   "ref_residual_px": {
    "eyeL": 7.2,
    "eyeR": 2.8,
    "mouth": 5.7,
    "nose": 5.0,
    "pin": 1.4
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_mid_canny_loop_36.png",
    "rect": [153, 227, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_mid_canny_loop_36.png",
    "rect": [153, 227, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_mid_canny_loop_36_u.png",
    "rect": [274, 376, 232, 122]
   },
   "yield_eye_px": 479,
   "yield_px": 1637,
   "cover_alien_px": 0,
   "occluded": 0.027,
   "feat": {
    "eyeL": [
     5.33,
     -2.7
    ],
    "eyeR": [
     2.47,
     -1.87
    ],
    "mouth": [
     3.73,
     -3.78
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_mid_canny_loop/37.png": {
   "m": [
    1.01624,
    -0.09772,
    -66.9,
    37.11
   ],
   "scale": 1.0209,
   "rot_deg": -5.49,
   "shift": [
    -14.8,
    4.7
   ],
   "inliers": 71,
   "residual_px": 0.9,
   "ref_residual_px": {
    "eyeL": 7.2,
    "eyeR": 2.8,
    "mouth": 5.7,
    "nose": 5.7,
    "pin": 2.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_mid_canny_loop_37.png",
    "rect": [154, 227, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_mid_canny_loop_37.png",
    "rect": [154, 227, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_mid_canny_loop_37_u.png",
    "rect": [276, 377, 228, 120]
   },
   "yield_eye_px": 540,
   "yield_px": 1696,
   "cover_alien_px": 0,
   "occluded": 0.03,
   "feat": {
    "eyeL": [
     5.33,
     -2.6
    ],
    "eyeR": [
     2.2,
     -1.87
    ],
    "mouth": [
     3.73,
     -3.78
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_mid_canny_loop/38.png": {
   "m": [
    1.00513,
    -0.07829,
    -48.87,
    32.25
   ],
   "scale": 1.0082,
   "rot_deg": -4.45,
   "shift": [
    -10.3,
    2.6
   ],
   "inliers": 68,
   "residual_px": 0.81,
   "ref_residual_px": {
    "eyeL": 2.8,
    "eyeR": 1.4,
    "mouth": 2.8,
    "nose": 2.8,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_mid_canny_loop_38.png",
    "rect": [159, 225, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_mid_canny_loop_38.png",
    "rect": [159, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_mid_canny_loop_38_u.png",
    "rect": [283, 377, 229, 116]
   },
   "yield_eye_px": 294,
   "yield_px": 592,
   "cover_alien_px": 13,
   "occluded": 0.017,
   "feat": {
    "eyeL": [
     3.64,
     -1.28
    ],
    "eyeR": [
     1.68,
     -1.04
    ],
    "mouth": [
     3.04,
     -1.98
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_mid_canny_loop/39.png": {
   "m": [
    1.01099,
    -0.0652,
    -45.32,
    24.12
   ],
   "scale": 1.0131,
   "rot_deg": -3.69,
   "shift": [
    -10.5,
    2.6
   ],
   "inliers": 81,
   "residual_px": 0.8,
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
    "file": "track_ink/wave_h1_mid_canny_loop_39.png",
    "rect": [159, 225, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_mid_canny_loop_39.png",
    "rect": [159, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_mid_canny_loop_39_u.png",
    "rect": [282, 378, 232, 114]
   },
   "yield_eye_px": 0,
   "yield_px": 423,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     2.11,
     -0.94
    ],
    "eyeR": [
     0.82,
     -0.93
    ],
    "mouth": [
     1.75,
     -1.78
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_mid_canny_loop/40.png": {
   "m": [
    1.00644,
    -0.04637,
    -31.09,
    17.47
   ],
   "scale": 1.0075,
   "rot_deg": -2.64,
   "shift": [
    -6.9,
    1.5
   ],
   "inliers": 86,
   "residual_px": 0.84,
   "ref_residual_px": {
    "eyeL": 2.2,
    "eyeR": 1.0,
    "mouth": 2.2,
    "nose": 2.2,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_mid_canny_loop_40.png",
    "rect": [162, 224, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_mid_canny_loop_40.png",
    "rect": [162, 224, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_mid_canny_loop_40_u.png",
    "rect": [287, 378, 229, 112]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     1.98,
     -0.33
    ],
    "eyeR": [
     0.82,
     -0.54
    ],
    "mouth": [
     1.75,
     -1.03
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_mid_canny_loop/41.png": {
   "m": [
    1.00248,
    -0.03419,
    -22.29,
    13.2
   ],
   "scale": 1.0031,
   "rot_deg": -1.95,
   "shift": [
    -5.4,
    0.4
   ],
   "inliers": 130,
   "residual_px": 0.81,
   "ref_residual_px": {
    "eyeL": 2.2,
    "eyeR": 1.0,
    "mouth": 2.0,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/wave_h1_mid_canny_loop_41.png",
    "rect": [164, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_mid_canny_loop_41.png",
    "rect": [164, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_mid_canny_loop_41_u.png",
    "rect": [290, 378, 228, 110]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     1.17,
     0.39
    ],
    "eyeR": [
     0.57,
     0.07
    ],
    "mouth": [
     1.32,
     0.1
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_mid_canny_loop/42.png": {
   "m": [
    1.00145,
    -0.0202,
    -12.89,
    7.77
   ],
   "scale": 1.0017,
   "rot_deg": -1.16,
   "shift": [
    -2.9,
    0.2
   ],
   "inliers": 167,
   "residual_px": 0.71,
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
    "file": "track_ink/wave_h1_mid_canny_loop_42.png",
    "rect": [166, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_mid_canny_loop_42.png",
    "rect": [166, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_mid_canny_loop_42_u.png",
    "rect": [293, 379, 227, 108]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 1,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.52,
     0.39
    ],
    "eyeR": [
     0.22,
     0.07
    ],
    "mouth": [
     0.53,
     0.11
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_mid_canny_loop/43.png": {
   "m": [
    1.00099,
    -0.01244,
    -8.09,
    4.79
   ],
   "scale": 1.0011,
   "rot_deg": -0.71,
   "shift": [
    -1.9,
    0.2
   ],
   "inliers": 172,
   "residual_px": 0.64,
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
    "file": "track_ink/wave_h1_mid_canny_loop_43.png",
    "rect": [167, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_mid_canny_loop_43.png",
    "rect": [167, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_mid_canny_loop_43_u.png",
    "rect": [294, 380, 228, 106]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 1,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.32,
     0.25
    ],
    "eyeR": [
     0.11,
     0.15
    ],
    "mouth": [
     0.42,
     0.12
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_mid_canny_loop/44.png": {
   "m": [
    1.00024,
    -0.00551,
    -2.88,
    2.19
   ],
   "scale": 1.0003,
   "rot_deg": -0.32,
   "shift": [
    -0.2,
    0.1
   ],
   "inliers": 188,
   "residual_px": 0.53,
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
    "file": "track_ink/wave_h1_mid_canny_loop_44.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_mid_canny_loop_44.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_mid_canny_loop_44_u.png",
    "rect": [297, 381, 225, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.06,
     0.18
    ],
    "eyeR": [
     -0.09,
     0.03
    ],
    "mouth": [
     -0.09,
     0.11
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_mid_canny_loop/45.png": {
   "m": [
    1.00023,
    -0.00065,
    -0.55,
    0.28
   ],
   "scale": 1.0002,
   "rot_deg": -0.04,
   "shift": [
    -0.2,
    0.1
   ],
   "inliers": 183,
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
    "file": "track_ink/wave_h1_mid_canny_loop_45.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_mid_canny_loop_45.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_mid_canny_loop_45_u.png",
    "rect": [297, 381, 225, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.09,
     0.11
    ],
    "eyeR": [
     -0.09,
     -0.02
    ],
    "mouth": [
     -0.13,
     0.1
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_mid_canny_loop/46.png": {
   "m": [
    1.00013,
    -6e-05,
    -0.12,
    0.06
   ],
   "scale": 1.0001,
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
    "file": "track_ink/wave_h1_mid_canny_loop_46.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_mid_canny_loop_46.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_mid_canny_loop_46_u.png",
    "rect": [297, 381, 225, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.1,
     0.09
    ],
    "eyeR": [
     -0.08,
     -0.02
    ],
    "mouth": [
     -0.09,
     0.1
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_mid_canny_loop/47.png": {
   "m": [
    0.99987,
    8e-05,
    0.15,
    0.08
   ],
   "scale": 0.9999,
   "rot_deg": 0.0,
   "shift": [
    0.1,
    0.1
   ],
   "inliers": 186,
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
    "file": "track_ink/wave_h1_mid_canny_loop_47.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_mid_canny_loop_47.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_mid_canny_loop_47_u.png",
    "rect": [297, 381, 225, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.1,
     0.03
    ],
    "eyeR": [
     -0.04,
     -0.0
    ],
    "mouth": [
     -0.09,
     0.06
    ]
   },
   "w": 1.0
  },
  "frames/wave_h1_mid_canny_loop/48.png": {
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
    "file": "track_ink/wave_h1_mid_canny_loop_48.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/wave_h1_mid_canny_loop_48.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_h1_mid_canny_loop_48_u.png",
    "rect": [297, 381, 226, 104]
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
