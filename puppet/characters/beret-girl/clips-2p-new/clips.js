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
  "nod_s1_loop": {
   "label": "点头·s1",
   "from": "idle",
   "to": "idle",
   "fps": 16,
   "frames": [
    "frames/nod_s1_loop/00.png",
    "frames/nod_s1_loop/01.png",
    "frames/nod_s1_loop/02.png",
    "frames/nod_s1_loop/03.png",
    "frames/nod_s1_loop/04.png",
    "frames/nod_s1_loop/05.png",
    "frames/nod_s1_loop/06.png",
    "frames/nod_s1_loop/07.png",
    "frames/nod_s1_loop/08.png",
    "frames/nod_s1_loop/09.png",
    "frames/nod_s1_loop/10.png",
    "frames/nod_s1_loop/11.png",
    "frames/nod_s1_loop/12.png",
    "frames/nod_s1_loop/13.png",
    "frames/nod_s1_loop/14.png",
    "frames/nod_s1_loop/15.png",
    "frames/nod_s1_loop/16.png",
    "frames/nod_s1_loop/17.png",
    "frames/nod_s1_loop/18.png",
    "frames/nod_s1_loop/19.png",
    "frames/nod_s1_loop/20.png",
    "frames/nod_s1_loop/21.png",
    "frames/nod_s1_loop/22.png",
    "frames/nod_s1_loop/23.png",
    "frames/nod_s1_loop/24.png",
    "frames/nod_s1_loop/25.png",
    "frames/nod_s1_loop/26.png",
    "frames/nod_s1_loop/27.png",
    "frames/nod_s1_loop/28.png",
    "frames/nod_s1_loop/29.png",
    "frames/nod_s1_loop/30.png",
    "frames/nod_s1_loop/31.png",
    "frames/nod_s1_loop/32.png",
    "frames/nod_s1_loop/33.png",
    "frames/nod_s1_loop/34.png",
    "frames/nod_s1_loop/35.png",
    "frames/nod_s1_loop/36.png",
    "frames/nod_s1_loop/37.png",
    "frames/nod_s1_loop/38.png",
    "frames/nod_s1_loop/39.png",
    "frames/nod_s1_loop/40.png",
    "frames/nod_s1_loop/41.png",
    "frames/nod_s1_loop/42.png",
    "frames/nod_s1_loop/43.png",
    "frames/nod_s1_loop/44.png",
    "frames/nod_s1_loop/45.png",
    "frames/nod_s1_loop/46.png",
    "frames/nod_s1_loop/47.png",
    "frames/nod_s1_loop/48.png"
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
    [184, 138, 648, 1000],
    [182, 138, 648, 1000],
    [182, 138, 648, 1000],
    [182, 138, 648, 1000],
    [180, 140, 647, 1000],
    [180, 140, 646, 1000],
    [180, 142, 646, 1000],
    [180, 142, 646, 1000],
    [178, 140, 646, 1000],
    [178, 138, 646, 1000],
    [178, 136, 646, 1000],
    [180, 136, 646, 1000],
    [180, 136, 646, 1000],
    [180, 136, 646, 1000],
    [182, 136, 648, 1000],
    [184, 136, 648, 1000],
    [184, 138, 648, 1000],
    [184, 138, 648, 1000],
    [184, 138, 648, 1000],
    [182, 136, 646, 1000],
    [182, 136, 646, 1000],
    [180, 136, 644, 1000],
    [176, 136, 642, 1000],
    [176, 136, 642, 1000],
    [174, 136, 640, 1000],
    [174, 136, 640, 1000],
    [174, 136, 640, 1000],
    [174, 134, 638, 1000],
    [174, 134, 638, 1000],
    [174, 134, 638, 1000],
    [174, 136, 640, 1000],
    [176, 136, 642, 1000],
    [178, 136, 644, 1000],
    [178, 136, 644, 1000],
    [180, 136, 644, 1000],
    [180, 136, 646, 1000],
    [182, 136, 646, 1000],
    [182, 136, 646, 1000],
    [182, 138, 648, 1000],
    [184, 136, 648, 1000],
    [184, 136, 648, 1000],
    [184, 136, 648, 1000],
    [184, 136, 648, 1000],
    [184, 136, 648, 1000],
    [183, 137, 649, 1000]
   ],
   "bbox": [174, 134, 649, 1000],
   "margin": [174, 134, 183, 104],
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
    0.0,
    0.0,
    0.0035,
    0.0084,
    0.0812,
    0.1119,
    0.1721,
    0.1789,
    0.2114,
    0.2114,
    0.2361,
    0.2565,
    0.3133,
    0.3649,
    0.3687,
    0.4179,
    0.4548,
    0.4902,
    0.4933,
    0.498,
    0.498,
    0.5245,
    0.5245,
    0.5659,
    0.6195,
    0.6502,
    0.655,
    0.6726,
    0.6726,
    0.7324,
    0.786,
    0.7922,
    0.844,
    0.8644,
    0.9384,
    0.9384,
    0.9738,
    0.9798,
    0.9963,
    0.9966,
    0.9999,
    0.9999,
    0.9999,
    0.9999,
    0.9999,
    0.9999,
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
    "frames/clap_s1_loop/00.png",
    "frames/clap_s1_loop/01.png",
    "frames/clap_s1_loop/02.png",
    "frames/clap_s1_loop/03.png",
    "frames/clap_s1_loop/04.png",
    "frames/clap_s1_loop/05.png",
    "frames/clap_s1_loop/06.png",
    "frames/clap_s1_loop/07.png",
    "frames/clap_s1_loop/08.png",
    "frames/clap_s1_loop/09.png",
    "frames/clap_s1_loop/10.png",
    "frames/clap_s1_loop/11.png",
    "frames/clap_s1_loop/12.png",
    "frames/clap_s1_loop/13.png",
    "frames/clap_s1_loop/14.png",
    "frames/clap_s1_loop/15.png",
    "frames/clap_s1_loop/16.png",
    "frames/clap_s1_loop/17.png",
    "frames/clap_s1_loop/18.png",
    "frames/clap_s1_loop/19.png",
    "frames/clap_s1_loop/20.png",
    "frames/clap_s1_loop/21.png",
    "frames/clap_s1_loop/22.png",
    "frames/clap_s1_loop/23.png",
    "frames/clap_s1_loop/24.png",
    "frames/clap_s1_loop/25.png",
    "frames/clap_s1_loop/26.png",
    "frames/clap_s1_loop/27.png",
    "frames/clap_s1_loop/28.png",
    "frames/clap_s1_loop/29.png",
    "frames/clap_s1_loop/30.png",
    "frames/clap_s1_loop/31.png",
    "frames/clap_s1_loop/32.png",
    "frames/clap_s1_loop/33.png",
    "frames/clap_s1_loop/34.png",
    "frames/clap_s1_loop/35.png",
    "frames/clap_s1_loop/36.png",
    "frames/clap_s1_loop/37.png",
    "frames/clap_s1_loop/38.png",
    "frames/clap_s1_loop/39.png",
    "frames/clap_s1_loop/40.png",
    "frames/clap_s1_loop/41.png",
    "frames/clap_s1_loop/42.png",
    "frames/clap_s1_loop/43.png",
    "frames/clap_s1_loop/44.png",
    "frames/clap_s1_loop/45.png",
    "frames/clap_s1_loop/46.png",
    "frames/clap_s1_loop/47.png",
    "frames/clap_s1_loop/48.png"
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
    [182, 138, 646, 1000],
    [180, 140, 646, 1000],
    [176, 138, 642, 1000],
    [176, 138, 642, 1000],
    [176, 136, 642, 1000],
    [178, 134, 642, 1000],
    [180, 136, 646, 1000],
    [182, 136, 646, 1000],
    [180, 136, 646, 1000],
    [180, 136, 644, 1000],
    [180, 138, 646, 1000],
    [182, 140, 648, 1000],
    [184, 140, 650, 1000],
    [184, 140, 648, 1000],
    [184, 140, 650, 1000],
    [186, 140, 652, 1000],
    [186, 140, 650, 1000],
    [182, 138, 646, 1000],
    [180, 136, 644, 1000],
    [176, 136, 640, 1000],
    [176, 136, 640, 1000],
    [180, 138, 644, 1000],
    [182, 138, 646, 1000],
    [184, 140, 648, 1000],
    [184, 140, 648, 1000],
    [182, 138, 646, 1000],
    [180, 138, 646, 1000],
    [178, 136, 642, 1000],
    [176, 136, 640, 1000],
    [176, 136, 640, 1000],
    [176, 140, 640, 1000],
    [176, 140, 640, 1000],
    [176, 138, 642, 1000],
    [176, 136, 642, 1000],
    [176, 132, 642, 1000],
    [176, 132, 642, 1000],
    [178, 134, 644, 1000],
    [180, 136, 644, 1000],
    [182, 136, 646, 1000],
    [182, 136, 648, 1000],
    [184, 136, 648, 1000],
    [184, 137, 648, 1000],
    [184, 138, 648, 1000],
    [184, 136, 648, 1000],
    [183, 137, 649, 1000]
   ],
   "bbox": [176, 132, 652, 1000],
   "margin": [176, 132, 180, 104],
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
  "hips_s1_loop": {
   "label": "叉腰·s1",
   "from": "idle",
   "to": "idle",
   "fps": 16,
   "frames": [
    "frames/hips_s1_loop/00.png",
    "frames/hips_s1_loop/01.png",
    "frames/hips_s1_loop/02.png",
    "frames/hips_s1_loop/03.png",
    "frames/hips_s1_loop/04.png",
    "frames/hips_s1_loop/05.png",
    "frames/hips_s1_loop/06.png",
    "frames/hips_s1_loop/07.png",
    "frames/hips_s1_loop/08.png",
    "frames/hips_s1_loop/09.png",
    "frames/hips_s1_loop/10.png",
    "frames/hips_s1_loop/11.png",
    "frames/hips_s1_loop/12.png",
    "frames/hips_s1_loop/13.png",
    "frames/hips_s1_loop/14.png",
    "frames/hips_s1_loop/15.png",
    "frames/hips_s1_loop/16.png",
    "frames/hips_s1_loop/17.png",
    "frames/hips_s1_loop/18.png",
    "frames/hips_s1_loop/19.png",
    "frames/hips_s1_loop/20.png",
    "frames/hips_s1_loop/21.png",
    "frames/hips_s1_loop/22.png",
    "frames/hips_s1_loop/23.png",
    "frames/hips_s1_loop/24.png",
    "frames/hips_s1_loop/25.png",
    "frames/hips_s1_loop/26.png",
    "frames/hips_s1_loop/27.png",
    "frames/hips_s1_loop/28.png",
    "frames/hips_s1_loop/29.png",
    "frames/hips_s1_loop/30.png",
    "frames/hips_s1_loop/31.png",
    "frames/hips_s1_loop/32.png",
    "frames/hips_s1_loop/33.png",
    "frames/hips_s1_loop/34.png",
    "frames/hips_s1_loop/35.png",
    "frames/hips_s1_loop/36.png",
    "frames/hips_s1_loop/37.png",
    "frames/hips_s1_loop/38.png",
    "frames/hips_s1_loop/39.png",
    "frames/hips_s1_loop/40.png",
    "frames/hips_s1_loop/41.png",
    "frames/hips_s1_loop/42.png",
    "frames/hips_s1_loop/43.png",
    "frames/hips_s1_loop/44.png",
    "frames/hips_s1_loop/45.png",
    "frames/hips_s1_loop/46.png",
    "frames/hips_s1_loop/47.png",
    "frames/hips_s1_loop/48.png"
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
    [182, 138, 652, 1000],
    [180, 138, 654, 1000],
    [180, 138, 652, 1000],
    [180, 136, 646, 1000],
    [182, 134, 646, 1000],
    [182, 134, 648, 1000],
    [186, 136, 650, 1000],
    [188, 140, 652, 1000],
    [190, 144, 652, 1000],
    [192, 146, 654, 1000],
    [192, 146, 654, 1000],
    [190, 144, 654, 1000],
    [190, 144, 654, 1000],
    [188, 142, 652, 1000],
    [188, 140, 652, 1000],
    [186, 140, 650, 1000],
    [186, 140, 650, 1000],
    [186, 140, 650, 1000],
    [186, 140, 650, 1000],
    [186, 140, 650, 1000],
    [186, 140, 650, 1000],
    [186, 140, 650, 1000],
    [186, 140, 650, 1000],
    [186, 140, 650, 1000],
    [184, 140, 650, 1000],
    [184, 138, 648, 1000],
    [182, 138, 646, 1000],
    [180, 136, 644, 1000],
    [178, 136, 644, 1000],
    [178, 136, 642, 1000],
    [178, 134, 642, 1000],
    [178, 134, 642, 1000],
    [178, 134, 644, 1000],
    [178, 132, 644, 1000],
    [178, 130, 644, 1000],
    [178, 130, 654, 1000],
    [180, 132, 650, 1000],
    [180, 134, 646, 1000],
    [182, 136, 646, 1000],
    [182, 136, 648, 1000],
    [182, 136, 648, 1000],
    [182, 136, 648, 1000],
    [182, 136, 648, 1000],
    [184, 136, 648, 1000],
    [183, 137, 649, 1000]
   ],
   "bbox": [178, 130, 654, 1000],
   "margin": [178, 130, 178, 104],
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
    0.1075,
    0.1471,
    0.1953,
    0.2283,
    0.3076,
    0.359,
    0.4237,
    0.4512,
    0.5011,
    0.5152,
    0.5545,
    0.5669,
    0.568,
    0.5819,
    0.5861,
    0.5885,
    0.5885,
    0.5885,
    0.5885,
    0.5885,
    0.5885,
    0.5885,
    0.5888,
    0.5901,
    0.5903,
    0.5995,
    0.6036,
    0.6264,
    0.6398,
    0.6417,
    0.6799,
    0.6982,
    0.7474,
    0.7704,
    0.8418,
    0.8701,
    0.9051,
    0.9313,
    0.9689,
    0.9828,
    0.9991,
    1.0,
    1.0,
    1.0,
    1.0
   ],
   "minSeconds": 0.6
  },
  "gesture_s1_loop": {
   "label": "双手比划·s1",
   "from": "idle",
   "to": "idle",
   "fps": 16,
   "frames": [
    "frames/gesture_s1_loop/00.png",
    "frames/gesture_s1_loop/01.png",
    "frames/gesture_s1_loop/02.png",
    "frames/gesture_s1_loop/03.png",
    "frames/gesture_s1_loop/04.png",
    "frames/gesture_s1_loop/05.png",
    "frames/gesture_s1_loop/06.png",
    "frames/gesture_s1_loop/07.png",
    "frames/gesture_s1_loop/08.png",
    "frames/gesture_s1_loop/09.png",
    "frames/gesture_s1_loop/10.png",
    "frames/gesture_s1_loop/11.png",
    "frames/gesture_s1_loop/12.png",
    "frames/gesture_s1_loop/13.png",
    "frames/gesture_s1_loop/14.png",
    "frames/gesture_s1_loop/15.png",
    "frames/gesture_s1_loop/16.png",
    "frames/gesture_s1_loop/17.png",
    "frames/gesture_s1_loop/18.png",
    "frames/gesture_s1_loop/19.png",
    "frames/gesture_s1_loop/20.png",
    "frames/gesture_s1_loop/21.png",
    "frames/gesture_s1_loop/22.png",
    "frames/gesture_s1_loop/23.png",
    "frames/gesture_s1_loop/24.png",
    "frames/gesture_s1_loop/25.png",
    "frames/gesture_s1_loop/26.png",
    "frames/gesture_s1_loop/27.png",
    "frames/gesture_s1_loop/28.png",
    "frames/gesture_s1_loop/29.png",
    "frames/gesture_s1_loop/30.png",
    "frames/gesture_s1_loop/31.png",
    "frames/gesture_s1_loop/32.png",
    "frames/gesture_s1_loop/33.png",
    "frames/gesture_s1_loop/34.png",
    "frames/gesture_s1_loop/35.png",
    "frames/gesture_s1_loop/36.png",
    "frames/gesture_s1_loop/37.png",
    "frames/gesture_s1_loop/38.png",
    "frames/gesture_s1_loop/39.png",
    "frames/gesture_s1_loop/40.png",
    "frames/gesture_s1_loop/41.png",
    "frames/gesture_s1_loop/42.png",
    "frames/gesture_s1_loop/43.png",
    "frames/gesture_s1_loop/44.png",
    "frames/gesture_s1_loop/45.png",
    "frames/gesture_s1_loop/46.png",
    "frames/gesture_s1_loop/47.png",
    "frames/gesture_s1_loop/48.png"
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
    [184, 140, 650, 1000],
    [186, 140, 650, 1000],
    [160, 140, 678, 1000],
    [144, 138, 690, 1000],
    [130, 136, 706, 1000],
    [128, 134, 708, 1000],
    [130, 134, 710, 1000],
    [128, 136, 710, 1000],
    [130, 138, 710, 1000],
    [130, 140, 710, 1000],
    [128, 142, 710, 1000],
    [128, 144, 710, 1000],
    [130, 146, 708, 1000],
    [130, 146, 706, 1000],
    [130, 146, 706, 1000],
    [130, 146, 706, 1000],
    [130, 146, 706, 1000],
    [130, 144, 706, 1000],
    [130, 144, 706, 1000],
    [130, 144, 708, 1000],
    [130, 144, 708, 1000],
    [130, 142, 708, 1000],
    [130, 140, 708, 1000],
    [128, 138, 708, 1000],
    [128, 136, 708, 1000],
    [128, 134, 708, 1000],
    [128, 132, 708, 1000],
    [128, 132, 706, 1000],
    [128, 132, 706, 1000],
    [128, 132, 704, 1000],
    [128, 132, 704, 1000],
    [128, 132, 704, 1000],
    [124, 132, 710, 1000],
    [128, 134, 708, 1000],
    [144, 134, 696, 1000],
    [154, 134, 686, 1000],
    [174, 132, 670, 1000],
    [178, 134, 654, 1000],
    [180, 134, 645, 1000],
    [180, 136, 646, 1000],
    [182, 136, 646, 1000],
    [182, 136, 648, 1000],
    [184, 136, 648, 1000],
    [182, 136, 648, 1000],
    [184, 136, 648, 1000],
    [182, 136, 648, 1000],
    [183, 137, 649, 1000]
   ],
   "bbox": [124, 132, 710, 1000],
   "margin": [124, 132, 122, 104],
   "facePaste": true,
   "browSwap": false,
   "faceBlank": true,
   "faceClass": 1,
   "attrManual": [
    "faceBlank"
   ],
   "arc": [
    0.0,
    0.0004,
    0.0275,
    0.055,
    0.1092,
    0.1435,
    0.2078,
    0.2409,
    0.2672,
    0.2746,
    0.2897,
    0.3044,
    0.3379,
    0.3544,
    0.3825,
    0.4013,
    0.4045,
    0.4103,
    0.4103,
    0.4161,
    0.4168,
    0.4218,
    0.4264,
    0.45,
    0.4595,
    0.4928,
    0.5156,
    0.5637,
    0.5881,
    0.6301,
    0.6423,
    0.6648,
    0.672,
    0.6771,
    0.7262,
    0.7503,
    0.8,
    0.8354,
    0.8927,
    0.9179,
    0.9516,
    0.9693,
    0.9884,
    0.9942,
    0.9998,
    0.9999,
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
    "frames/stepbeat_s1_loop/00.png",
    "frames/stepbeat_s1_loop/01.png",
    "frames/stepbeat_s1_loop/02.png",
    "frames/stepbeat_s1_loop/03.png",
    "frames/stepbeat_s1_loop/04.png",
    "frames/stepbeat_s1_loop/05.png",
    "frames/stepbeat_s1_loop/06.png",
    "frames/stepbeat_s1_loop/07.png",
    "frames/stepbeat_s1_loop/08.png",
    "frames/stepbeat_s1_loop/09.png",
    "frames/stepbeat_s1_loop/10.png",
    "frames/stepbeat_s1_loop/11.png",
    "frames/stepbeat_s1_loop/12.png",
    "frames/stepbeat_s1_loop/13.png",
    "frames/stepbeat_s1_loop/14.png",
    "frames/stepbeat_s1_loop/15.png",
    "frames/stepbeat_s1_loop/16.png",
    "frames/stepbeat_s1_loop/17.png",
    "frames/stepbeat_s1_loop/18.png",
    "frames/stepbeat_s1_loop/19.png",
    "frames/stepbeat_s1_loop/20.png",
    "frames/stepbeat_s1_loop/21.png",
    "frames/stepbeat_s1_loop/22.png",
    "frames/stepbeat_s1_loop/23.png",
    "frames/stepbeat_s1_loop/24.png",
    "frames/stepbeat_s1_loop/25.png",
    "frames/stepbeat_s1_loop/26.png",
    "frames/stepbeat_s1_loop/27.png",
    "frames/stepbeat_s1_loop/28.png",
    "frames/stepbeat_s1_loop/29.png",
    "frames/stepbeat_s1_loop/30.png",
    "frames/stepbeat_s1_loop/31.png",
    "frames/stepbeat_s1_loop/32.png",
    "frames/stepbeat_s1_loop/33.png",
    "frames/stepbeat_s1_loop/34.png",
    "frames/stepbeat_s1_loop/35.png",
    "frames/stepbeat_s1_loop/36.png",
    "frames/stepbeat_s1_loop/37.png",
    "frames/stepbeat_s1_loop/38.png",
    "frames/stepbeat_s1_loop/39.png",
    "frames/stepbeat_s1_loop/40.png",
    "frames/stepbeat_s1_loop/41.png",
    "frames/stepbeat_s1_loop/42.png",
    "frames/stepbeat_s1_loop/43.png",
    "frames/stepbeat_s1_loop/44.png",
    "frames/stepbeat_s1_loop/45.png",
    "frames/stepbeat_s1_loop/46.png",
    "frames/stepbeat_s1_loop/47.png",
    "frames/stepbeat_s1_loop/48.png"
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
    [182, 142, 646, 1000],
    [180, 146, 644, 1000],
    [174, 154, 638, 998],
    [172, 156, 636, 998],
    [172, 158, 636, 998],
    [175, 156, 640, 996],
    [188, 146, 652, 984],
    [194, 144, 658, 994],
    [206, 140, 668, 1000],
    [210, 136, 672, 1000],
    [216, 132, 680, 1000],
    [208, 136, 674, 1000],
    [200, 140, 664, 1000],
    [184, 152, 648, 1000],
    [178, 150, 642, 1000],
    [172, 142, 636, 1000],
    [172, 138, 636, 1000],
    [184, 140, 648, 980],
    [188, 138, 654, 992],
    [200, 130, 662, 1000],
    [202, 130, 666, 1000],
    [198, 136, 662, 1000],
    [192, 142, 656, 1000],
    [180, 148, 644, 1000],
    [174, 146, 638, 1000],
    [166, 144, 630, 1000],
    [164, 140, 626, 1000],
    [164, 128, 626, 1000],
    [166, 120, 630, 996],
    [166, 120, 630, 996],
    [170, 116, 636, 996],
    [174, 114, 638, 994],
    [178, 118, 642, 994],
    [178, 124, 642, 994],
    [180, 136, 644, 990],
    [180, 144, 646, 992],
    [182, 148, 646, 1000],
    [182, 148, 646, 1000],
    [182, 144, 646, 1000],
    [182, 140, 646, 1000],
    [184, 138, 648, 1000],
    [182, 138, 648, 1000],
    [182, 138, 648, 1000],
    [184, 138, 648, 1000],
    [183, 137, 649, 1000]
   ],
   "bbox": [164, 114, 680, 1000],
   "margin": [164, 114, 152, 104],
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
  }
 },
 "actions": [
  {
   "id": "nod_s1",
   "label": "点头·s1",
   "in": "nod_s1_loop",
   "oneshot": true,
   "group": "nod_s1"
  },
  {
   "id": "clap_s1",
   "label": "鼓掌·s1",
   "in": "clap_s1_loop",
   "oneshot": true,
   "group": "clap_s1"
  },
  {
   "id": "hips_s1",
   "label": "叉腰·s1",
   "in": "hips_s1_loop",
   "oneshot": true,
   "group": "hips_s1"
  },
  {
   "id": "gesture_s1",
   "label": "双手比划·s1",
   "in": "gesture_s1_loop",
   "oneshot": true,
   "group": "gesture_s1"
  },
  {
   "id": "stepbeat_s1",
   "label": "小幅踩拍·s1",
   "in": "stepbeat_s1_loop",
   "oneshot": true,
   "group": "stepbeat_s1"
  }
 ],
 "minMargin": {
  "left": 124,
  "top": 114,
  "right": 122,
  "bottom": 104,
  "min": 104
 },
 "faceMode": "ink",
 "headTracks": {
  "frames/nod_s1_loop/00.png": {
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
    "file": "track_ink/nod_s1_loop_00.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/nod_s1_loop_00.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/nod_s1_loop_00_u.png",
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
  "frames/nod_s1_loop/01.png": {
   "m": [
    0.99975,
    -7e-05,
    0.12,
    0.09
   ],
   "scale": 0.9998,
   "rot_deg": -0.0,
   "shift": [
    0.1,
    -0.1
   ],
   "inliers": 210,
   "residual_px": 0.33,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/nod_s1_loop_01.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/nod_s1_loop_01.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/nod_s1_loop_01_u.png",
    "rect": [297, 381, 226, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.03,
     0.0
    ],
    "eyeR": [
     0.0,
     0.05
    ],
    "mouth": [
     0.04,
     -0.0
    ]
   },
   "w": 1.0
  },
  "frames/nod_s1_loop/02.png": {
   "m": [
    0.99972,
    5e-05,
    0.28,
    -0.05
   ],
   "scale": 0.9997,
   "rot_deg": 0.0,
   "shift": [
    0.1,
    -0.2
   ],
   "inliers": 197,
   "residual_px": 0.35,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/nod_s1_loop_02.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/nod_s1_loop_02.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/nod_s1_loop_02_u.png",
    "rect": [297, 381, 227, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 1,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.03,
     -0.0
    ],
    "eyeR": [
     0.01,
     0.05
    ],
    "mouth": [
     0.04,
     -0.0
    ]
   },
   "w": 1.0
  },
  "frames/nod_s1_loop/03.png": {
   "m": [
    0.99993,
    6e-05,
    0.17,
    -0.07
   ],
   "scale": 0.9999,
   "rot_deg": 0.0,
   "shift": [
    0.1,
    -0.1
   ],
   "inliers": 202,
   "residual_px": 0.39,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/nod_s1_loop_03.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/nod_s1_loop_03.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/nod_s1_loop_03_u.png",
    "rect": [297, 381, 227, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 1,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.03,
     -0.0
    ],
    "eyeR": [
     -0.01,
     0.05
    ],
    "mouth": [
     0.02,
     -0.0
    ]
   },
   "w": 1.0
  },
  "frames/nod_s1_loop/04.png": {
   "m": [
    0.99939,
    0.00022,
    0.37,
    0.77
   ],
   "scale": 0.9994,
   "rot_deg": 0.01,
   "shift": [
    0.0,
    0.6
   ],
   "inliers": 162,
   "residual_px": 0.69,
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
    "file": "track_ink/nod_s1_loop_04.png",
    "rect": [169, 223, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/nod_s1_loop_04.png",
    "rect": [169, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/nod_s1_loop_04_u.png",
    "rect": [297, 382, 227, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.03,
     1.36
    ],
    "eyeR": [
     -0.07,
     1.26
    ],
    "mouth": [
     -0.06,
     0.34
    ]
   },
   "w": 1.0
  },
  "frames/nod_s1_loop/05.png": {
   "m": [
    0.99865,
    -0.00321,
    -0.46,
    4.24
   ],
   "scale": 0.9987,
   "rot_deg": -0.18,
   "shift": [
    0.5,
    2.3
   ],
   "inliers": 106,
   "residual_px": 0.96,
   "ref_residual_px": {
    "eyeL": 5.0,
    "eyeR": 6.3,
    "mouth": 1.0,
    "nose": 1.4,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/nod_s1_loop_05.png",
    "rect": [169, 224, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/nod_s1_loop_05.png",
    "rect": [169, 224, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/nod_s1_loop_05_u.png",
    "rect": [297, 383, 225, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.11,
     6.52
    ],
    "eyeR": [
     -1.21,
     7.22
    ],
    "mouth": [
     -0.63,
     0.34
    ]
   },
   "w": 1.0
  },
  "frames/nod_s1_loop/06.png": {
   "m": [
    1.00683,
    -0.01365,
    -8.59,
    12.25
   ],
   "scale": 1.0069,
   "rot_deg": -0.78,
   "shift": [
    0.6,
    9.8
   ],
   "inliers": 37,
   "residual_px": 0.9,
   "ref_residual_px": {
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/nod_s1_loop_06.png",
    "rect": [170, 232, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/nod_s1_loop_06.png",
    "rect": [170, 232, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/nod_s1_loop_06_u.png",
    "rect": [296, 389, 228, 107]
   },
   "yield_eye_px": 0,
   "yield_px": 756,
   "cover_alien_px": 11,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.11,
     6.52
    ],
    "eyeR": [
     -1.21,
     7.22
    ],
    "mouth": [
     -0.96,
     0.48
    ]
   },
   "w": 1.0
  },
  "frames/nod_s1_loop/07.png": {
   "m": [
    1.00347,
    -0.02308,
    -10.48,
    20.89
   ],
   "scale": 1.0037,
   "rot_deg": -1.32,
   "shift": [
    1.7,
    13.1
   ],
   "inliers": 32,
   "residual_px": 0.94,
   "ref_residual_px": {
    "mouth": 1.0,
    "nose": 2.2,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/nod_s1_loop_07.png",
    "rect": [171, 235, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/nod_s1_loop_07.png",
    "rect": [171, 235, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/nod_s1_loop_07_u.png",
    "rect": [297, 392, 227, 108]
   },
   "yield_eye_px": 0,
   "yield_px": 1106,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.05,
     6.36
    ],
    "eyeR": [
     -1.12,
     6.95
    ],
    "mouth": [
     -2.07,
     0.25
    ]
   },
   "w": 1.0
  },
  "frames/nod_s1_loop/08.png": {
   "m": [
    1.01036,
    -0.03608,
    -18.48,
    30.3
   ],
   "scale": 1.011,
   "rot_deg": -2.05,
   "shift": [
    2.5,
    20.4
   ],
   "inliers": 24,
   "residual_px": 0.73,
   "ref_residual_px": {
    "mouth": 2.8,
    "nose": 3.2,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/nod_s1_loop_08.png",
    "rect": [172, 242, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/nod_s1_loop_08.png",
    "rect": [172, 242, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/nod_s1_loop_08_u.png",
    "rect": [297, 398, 226, 110]
   },
   "yield_eye_px": 0,
   "yield_px": 2319,
   "cover_alien_px": 2,
   "occluded": 0.004,
   "feat": {
    "eyeL": [
     0.01,
     6.2
    ],
    "eyeR": [
     -1.02,
     6.68
    ],
    "mouth": [
     -2.72,
     -1.8
    ]
   },
   "w": 1.0
  },
  "frames/nod_s1_loop/09.png": {
   "m": [
    1.01497,
    -0.03745,
    -21.6,
    30.8
   ],
   "scale": 1.0157,
   "rot_deg": -2.11,
   "shift": [
    1.9,
    22.5
   ],
   "inliers": 26,
   "residual_px": 0.85,
   "ref_residual_px": {
    "mouth": 2.8,
    "nose": 2.2,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/nod_s1_loop_09.png",
    "rect": [171, 244, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/nod_s1_loop_09.png",
    "rect": [171, 244, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/nod_s1_loop_09_u.png",
    "rect": [296, 399, 227, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 2498,
   "cover_alien_px": 6,
   "occluded": 0.005,
   "feat": {
    "eyeL": [
     0.07,
     6.04
    ],
    "eyeR": [
     -0.93,
     6.41
    ],
    "mouth": [
     -2.72,
     -2.06
    ]
   },
   "w": 1.0
  },
  "frames/nod_s1_loop/10.png": {
   "m": [
    1.01516,
    -0.03587,
    -22.19,
    32.55
   ],
   "scale": 1.0158,
   "rot_deg": -2.02,
   "shift": [
    0.7,
    24.9
   ],
   "inliers": 28,
   "residual_px": 0.8,
   "ref_residual_px": {
    "mouth": 2.2,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/nod_s1_loop_10.png",
    "rect": [170, 247, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/nod_s1_loop_10.png",
    "rect": [170, 247, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/nod_s1_loop_10_u.png",
    "rect": [294, 402, 228, 110]
   },
   "yield_eye_px": 0,
   "yield_px": 2750,
   "cover_alien_px": 5,
   "occluded": 0.008,
   "feat": {
    "eyeL": [
     0.12,
     5.88
    ],
    "eyeR": [
     -0.83,
     6.13
    ],
    "mouth": [
     -1.22,
     -2.06
    ]
   },
   "w": 1.0
  },
  "frames/nod_s1_loop/11.png": {
   "m": [
    1.00924,
    -0.03369,
    -18.74,
    32.75
   ],
   "scale": 1.0098,
   "rot_deg": -1.91,
   "shift": [
    0.7,
    23.3
   ],
   "inliers": 25,
   "residual_px": 0.94,
   "ref_residual_px": {
    "mouth": 1.0,
    "nose": 1.4,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/nod_s1_loop_11.png",
    "rect": [170, 245, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/nod_s1_loop_11.png",
    "rect": [170, 245, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/nod_s1_loop_11_u.png",
    "rect": [295, 401, 227, 110]
   },
   "yield_eye_px": 0,
   "yield_px": 2348,
   "cover_alien_px": 0,
   "occluded": 0.004,
   "feat": {
    "eyeL": [
     0.18,
     5.72
    ],
    "eyeR": [
     -0.74,
     5.86
    ],
    "mouth": [
     -1.2,
     -2.06
    ]
   },
   "w": 1.0
  },
  "frames/nod_s1_loop/12.png": {
   "m": [
    1.02211,
    -0.04586,
    -30.48,
    33.35
   ],
   "scale": 1.0231,
   "rot_deg": -2.57,
   "shift": [
    -0.1,
    24.9
   ],
   "inliers": 23,
   "residual_px": 0.97,
   "ref_residual_px": {
    "mouth": 4.0,
    "nose": 2.2,
    "pin": 1.4
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/nod_s1_loop_12.png",
    "rect": [169, 247, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/nod_s1_loop_12.png",
    "rect": [169, 247, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/nod_s1_loop_12_u.png",
    "rect": [292, 401, 229, 112]
   },
   "yield_eye_px": 0,
   "yield_px": 3086,
   "cover_alien_px": 19,
   "occluded": 0.012,
   "feat": {
    "eyeL": [
     0.24,
     5.56
    ],
    "eyeR": [
     -0.65,
     5.59
    ],
    "mouth": [
     -1.2,
     -0.23
    ]
   },
   "w": 1.0
  },
  "frames/nod_s1_loop/13.png": {
   "m": [
    0.99117,
    -0.04552,
    -16.54,
    38.03
   ],
   "scale": 0.9922,
   "rot_deg": -2.63,
   "shift": [
    1.0,
    15.3
   ],
   "inliers": 20,
   "residual_px": 1.13,
   "ref_residual_px": {
    "mouth": 5.4,
    "nose": 6.3,
    "pin": 4.2
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/nod_s1_loop_13.png",
    "rect": [170, 237, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/nod_s1_loop_13.png",
    "rect": [170, 237, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/nod_s1_loop_13_u.png",
    "rect": [297, 394, 223, 109]
   },
   "yield_eye_px": 1052,
   "yield_px": 1364,
   "cover_alien_px": 0,
   "occluded": 0.062,
   "feat": {
    "eyeL": [
     0.3,
     5.4
    ],
    "eyeR": [
     -0.55,
     5.32
    ],
    "mouth": [
     -1.5,
     4.82
    ]
   },
   "w": 1.0
  },
  "frames/nod_s1_loop/14.png": {
   "m": [
    0.98677,
    -0.00898,
    0.82,
    16.69
   ],
   "scale": 0.9868,
   "rot_deg": -0.52,
   "shift": [
    -0.4,
    6.9
   ],
   "inliers": 22,
   "residual_px": 1.04,
   "ref_residual_px": {
    "mouth": 8.1,
    "nose": 8.1,
    "pin": 1.4
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/nod_s1_loop_14.png",
    "rect": [169, 229, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/nod_s1_loop_14.png",
    "rect": [169, 229, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/nod_s1_loop_14_u.png",
    "rect": [298, 388, 220, 104]
   },
   "yield_eye_px": 1098,
   "yield_px": 1154,
   "cover_alien_px": 1,
   "occluded": 0.065,
   "feat": {
    "eyeL": [
     0.35,
     5.24
    ],
    "eyeR": [
     -0.46,
     5.05
    ],
    "mouth": [
     -1.5,
     4.97
    ]
   },
   "w": 1.0
  },
  "frames/nod_s1_loop/15.png": {
   "m": [
    0.99057,
    -0.01593,
    -3.16,
    15.87
   ],
   "scale": 0.9907,
   "rot_deg": -0.92,
   "shift": [
    0.4,
    5.0
   ],
   "inliers": 26,
   "residual_px": 0.78,
   "ref_residual_px": {
    "mouth": 5.1,
    "nose": 5.1,
    "pin": 1.4
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/nod_s1_loop_15.png",
    "rect": [169, 227, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/nod_s1_loop_15.png",
    "rect": [169, 227, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/nod_s1_loop_15_u.png",
    "rect": [298, 386, 222, 105]
   },
   "yield_eye_px": 870,
   "yield_px": 698,
   "cover_alien_px": 3,
   "occluded": 0.051,
   "feat": {
    "eyeL": [
     0.41,
     5.08
    ],
    "eyeR": [
     -0.36,
     4.77
    ],
    "mouth": [
     -1.5,
     5.12
    ]
   },
   "w": 1.0
  },
  "frames/nod_s1_loop/16.png": {
   "m": [
    0.98864,
    -0.01695,
    -2.35,
    16.83
   ],
   "scale": 0.9888,
   "rot_deg": -0.98,
   "shift": [
    0.9,
    4.6
   ],
   "inliers": 28,
   "residual_px": 0.86,
   "ref_residual_px": {
    "mouth": 6.3,
    "nose": 5.4,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/nod_s1_loop_16.png",
    "rect": [170, 227, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/nod_s1_loop_16.png",
    "rect": [170, 227, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/nod_s1_loop_16_u.png",
    "rect": [298, 385, 221, 106]
   },
   "yield_eye_px": 1150,
   "yield_px": 964,
   "cover_alien_px": 1,
   "occluded": 0.068,
   "feat": {
    "eyeL": [
     0.47,
     4.92
    ],
    "eyeR": [
     -0.27,
     4.5
    ],
    "mouth": [
     -0.97,
     5.12
    ]
   },
   "w": 1.0
  },
  "frames/nod_s1_loop/17.png": {
   "m": [
    0.99453,
    -0.00485,
    -0.32,
    5.9
   ],
   "scale": 0.9945,
   "rot_deg": -0.28,
   "shift": [
    -0.3,
    1.4
   ],
   "inliers": 53,
   "residual_px": 0.87,
   "ref_residual_px": {
    "eyeL": 8.0,
    "eyeR": 8.2,
    "mouth": 3.2,
    "nose": 3.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/nod_s1_loop_17.png",
    "rect": [169, 223, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/nod_s1_loop_17.png",
    "rect": [169, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/nod_s1_loop_17_u.png",
    "rect": [297, 382, 223, 105]
   },
   "yield_eye_px": 417,
   "yield_px": 392,
   "cover_alien_px": 0,
   "occluded": 0.024,
   "feat": {
    "eyeL": [
     0.53,
     4.76
    ],
    "eyeR": [
     -0.17,
     4.23
    ],
    "mouth": [
     0.1,
     3.51
    ]
   },
   "w": 1.0
  },
  "frames/nod_s1_loop/18.png": {
   "m": [
    1.00077,
    -0.00332,
    -2.55,
    1.62
   ],
   "scale": 1.0008,
   "rot_deg": -0.19,
   "shift": [
    -0.7,
    0.6
   ],
   "inliers": 116,
   "residual_px": 0.9,
   "ref_residual_px": {
    "eyeL": 4.1,
    "eyeR": 3.0,
    "mouth": 1.4,
    "nose": 1.4,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/nod_s1_loop_18.png",
    "rect": [168, 223, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/nod_s1_loop_18.png",
    "rect": [168, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/nod_s1_loop_18_u.png",
    "rect": [296, 381, 226, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.53,
     4.59
    ],
    "eyeR": [
     -0.08,
     3.96
    ],
    "mouth": [
     0.1,
     1.13
    ]
   },
   "w": 1.0
  },
  "frames/nod_s1_loop/19.png": {
   "m": [
    1.00019,
    -0.00034,
    0.1,
    -0.47
   ],
   "scale": 1.0002,
   "rot_deg": -0.02,
   "shift": [
    0.3,
    -0.5
   ],
   "inliers": 197,
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
    "file": "track_ink/nod_s1_loop_19.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/nod_s1_loop_19.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/nod_s1_loop_19_u.png",
    "rect": [298, 380, 226, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.05,
     -0.2
    ],
    "eyeR": [
     -0.08,
     0.25
    ],
    "mouth": [
     -0.14,
     0.09
    ]
   },
   "w": 1.0
  },
  "frames/nod_s1_loop/20.png": {
   "m": [
    0.99894,
    -0.00071,
    1.06,
    -0.35
   ],
   "scale": 0.9989,
   "rot_deg": -0.04,
   "shift": [
    1.0,
    -1.1
   ],
   "inliers": 174,
   "residual_px": 0.72,
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
    "file": "track_ink/nod_s1_loop_20.png",
    "rect": [170, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/nod_s1_loop_20.png",
    "rect": [170, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/nod_s1_loop_20_u.png",
    "rect": [298, 380, 226, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.56,
     -0.2
    ],
    "eyeR": [
     -0.33,
     0.25
    ],
    "mouth": [
     -0.82,
     0.09
    ]
   },
   "w": 1.0
  },
  "frames/nod_s1_loop/21.png": {
   "m": [
    0.99978,
    0.00071,
    1.86,
    -1.74
   ],
   "scale": 0.9998,
   "rot_deg": 0.04,
   "shift": [
    1.4,
    -1.5
   ],
   "inliers": 129,
   "residual_px": 0.81,
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
    "file": "track_ink/nod_s1_loop_21.png",
    "rect": [170, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/nod_s1_loop_21.png",
    "rect": [170, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/nod_s1_loop_21_u.png",
    "rect": [299, 379, 225, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.73,
     -0.2
    ],
    "eyeR": [
     -0.5,
     0.25
    ],
    "mouth": [
     -1.19,
     0.09
    ]
   },
   "w": 1.0
  },
  "frames/nod_s1_loop/22.png": {
   "m": [
    0.99872,
    -0.00188,
    0.63,
    -0.04
   ],
   "scale": 0.9987,
   "rot_deg": -0.11,
   "shift": [
    1.0,
    -1.4
   ],
   "inliers": 138,
   "residual_px": 0.87,
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
    "file": "track_ink/nod_s1_loop_22.png",
    "rect": [170, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/nod_s1_loop_22.png",
    "rect": [170, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/nod_s1_loop_22_u.png",
    "rect": [298, 380, 226, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.73,
     -0.29
    ],
    "eyeR": [
     -0.5,
     0.18
    ],
    "mouth": [
     -1.19,
     0.03
    ]
   },
   "w": 1.0
  },
  "frames/nod_s1_loop/23.png": {
   "m": [
    1.00039,
    -0.00845,
    -4.59,
    2.32
   ],
   "scale": 1.0004,
   "rot_deg": -0.48,
   "shift": [
    -0.5,
    -1.0
   ],
   "inliers": 155,
   "residual_px": 0.64,
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
    "file": "track_ink/nod_s1_loop_23.png",
    "rect": [168, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/nod_s1_loop_23.png",
    "rect": [168, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/nod_s1_loop_23_u.png",
    "rect": [296, 379, 226, 106]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.15,
     -0.31
    ],
    "eyeR": [
     -0.23,
     -0.1
    ],
    "mouth": [
     -0.45,
     -0.37
    ]
   },
   "w": 1.0
  },
  "frames/nod_s1_loop/24.png": {
   "m": [
    1.00057,
    -0.00829,
    -4.67,
    2.11
   ],
   "scale": 1.0006,
   "rot_deg": -0.47,
   "shift": [
    -0.6,
    -1.0
   ],
   "inliers": 178,
   "residual_px": 0.69,
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
    "file": "track_ink/nod_s1_loop_24.png",
    "rect": [168, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/nod_s1_loop_24.png",
    "rect": [168, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/nod_s1_loop_24_u.png",
    "rect": [296, 379, 226, 106]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.12,
     -0.31
    ],
    "eyeR": [
     -0.21,
     -0.1
    ],
    "mouth": [
     -0.43,
     -0.37
    ]
   },
   "w": 1.0
  },
  "frames/nod_s1_loop/25.png": {
   "m": [
    1.00211,
    -0.01738,
    -11.76,
    6.2
   ],
   "scale": 1.0023,
   "rot_deg": -0.99,
   "shift": [
    -2.8,
    0.1
   ],
   "inliers": 161,
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
    "file": "track_ink/nod_s1_loop_25.png",
    "rect": [166, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/nod_s1_loop_25.png",
    "rect": [166, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/nod_s1_loop_25_u.png",
    "rect": [293, 380, 229, 106]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.58,
     0.02
    ],
    "eyeR": [
     0.2,
     -0.05
    ],
    "mouth": [
     0.75,
     -0.23
    ]
   },
   "w": 1.0
  },
  "frames/nod_s1_loop/26.png": {
   "m": [
    0.99771,
    -0.02625,
    -15.61,
    13.45
   ],
   "scale": 0.9981,
   "rot_deg": -1.51,
   "shift": [
    -4.3,
    1.7
   ],
   "inliers": 122,
   "residual_px": 0.94,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 2.0,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/nod_s1_loop_26.png",
    "rect": [165, 224, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/nod_s1_loop_26.png",
    "rect": [165, 224, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/nod_s1_loop_26_u.png",
    "rect": [292, 381, 228, 107]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 1,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.58,
     0.06
    ],
    "eyeR": [
     1.11,
     0.14
    ],
    "mouth": [
     1.34,
     0.58
    ]
   },
   "w": 1.0
  },
  "frames/nod_s1_loop/27.png": {
   "m": [
    0.99168,
    -0.03795,
    -19.03,
    23.47
   ],
   "scale": 0.9924,
   "rot_deg": -2.19,
   "shift": [
    -4.8,
    4.1
   ],
   "inliers": 82,
   "residual_px": 1.13,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 2.0,
    "mouth": 2.2,
    "nose": 1.4,
    "pin": 3.2
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/nod_s1_loop_27.png",
    "rect": [164, 226, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/nod_s1_loop_27.png",
    "rect": [164, 226, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/nod_s1_loop_27_u.png",
    "rect": [291, 383, 227, 108]
   },
   "yield_eye_px": 0,
   "yield_px": 12,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.8,
     0.29
    ],
    "eyeR": [
     1.65,
     0.47
    ],
    "mouth": [
     1.43,
     1.13
    ]
   },
   "w": 1.0
  },
  "frames/nod_s1_loop/28.png": {
   "m": [
    0.99569,
    -0.03789,
    -21.57,
    20.71
   ],
   "scale": 0.9964,
   "rot_deg": -2.18,
   "shift": [
    -5.7,
    3.2
   ],
   "inliers": 66,
   "residual_px": 0.85,
   "ref_residual_px": {
    "eyeL": 2.8,
    "eyeR": 2.8,
    "mouth": 3.6,
    "nose": 3.6,
    "pin": 3.2
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/nod_s1_loop_28.png",
    "rect": [163, 225, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/nod_s1_loop_28.png",
    "rect": [163, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/nod_s1_loop_28_u.png",
    "rect": [290, 382, 227, 109]
   },
   "yield_eye_px": 53,
   "yield_px": 73,
   "cover_alien_px": 0,
   "occluded": 0.003,
   "feat": {
    "eyeL": [
     1.43,
     2.41
    ],
    "eyeR": [
     2.02,
     2.43
    ],
    "mouth": [
     2.21,
     3.02
    ]
   },
   "w": 1.0
  },
  "frames/nod_s1_loop/29.png": {
   "m": [
    0.99969,
    -0.03782,
    -24.11,
    17.96
   ],
   "scale": 1.0004,
   "rot_deg": -2.17,
   "shift": [
    -6.6,
    2.4
   ],
   "inliers": 49,
   "residual_px": 0.79,
   "ref_residual_px": {
    "eyeL": 5.8,
    "eyeR": 5.8,
    "mouth": 6.7,
    "nose": 6.7,
    "pin": 5.4
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/nod_s1_loop_29.png",
    "rect": [162, 224, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/nod_s1_loop_29.png",
    "rect": [162, 224, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/nod_s1_loop_29_u.png",
    "rect": [289, 381, 226, 109]
   },
   "yield_eye_px": 666,
   "yield_px": 838,
   "cover_alien_px": 2,
   "occluded": 0.038,
   "feat": {
    "eyeL": [
     2.48,
     5.74
    ],
    "eyeR": [
     2.63,
     5.41
    ],
    "mouth": [
     3.1,
     5.84
    ]
   },
   "w": 1.0
  },
  "frames/nod_s1_loop/30.png": {
   "m": [
    1.0037,
    -0.03776,
    -26.65,
    15.2
   ],
   "scale": 1.0044,
   "rot_deg": -2.15,
   "shift": [
    -7.6,
    1.5
   ],
   "inliers": 47,
   "residual_px": 0.72,
   "ref_residual_px": {
    "eyeL": 7.2,
    "eyeR": 6.7,
    "mouth": 8.1,
    "nose": 8.1,
    "pin": 6.7
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/nod_s1_loop_30.png",
    "rect": [161, 223, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/nod_s1_loop_30.png",
    "rect": [161, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/nod_s1_loop_30_u.png",
    "rect": [287, 380, 227, 109]
   },
   "yield_eye_px": 796,
   "yield_px": 1436,
   "cover_alien_px": 5,
   "occluded": 0.046,
   "feat": {
    "eyeL": [
     3.55,
     5.74
    ],
    "eyeR": [
     2.65,
     5.41
    ],
    "mouth": [
     3.58,
     5.84
    ]
   },
   "w": 1.0
  },
  "frames/nod_s1_loop/31.png": {
   "m": [
    1.0077,
    -0.03769,
    -29.19,
    12.44
   ],
   "scale": 1.0084,
   "rot_deg": -2.14,
   "shift": [
    -8.5,
    0.6
   ],
   "inliers": 84,
   "residual_px": 0.96,
   "ref_residual_px": {
    "eyeL": 4.5,
    "eyeR": 2.8,
    "mouth": 4.5,
    "nose": 4.5,
    "pin": 3.6
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/nod_s1_loop_31.png",
    "rect": [161, 223, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/nod_s1_loop_31.png",
    "rect": [161, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/nod_s1_loop_31_u.png",
    "rect": [286, 378, 230, 110]
   },
   "yield_eye_px": 51,
   "yield_px": 158,
   "cover_alien_px": 5,
   "occluded": 0.003,
   "feat": {
    "eyeL": [
     3.68,
     2.64
    ],
    "eyeR": [
     2.65,
     2.36
    ],
    "mouth": [
     3.58,
     2.05
    ]
   },
   "w": 1.0
  },
  "frames/nod_s1_loop/32.png": {
   "m": [
    1.0117,
    -0.03763,
    -31.72,
    9.69
   ],
   "scale": 1.0124,
   "rot_deg": -2.13,
   "shift": [
    -9.4,
    -0.2
   ],
   "inliers": 70,
   "residual_px": 0.86,
   "ref_residual_px": {
    "eyeL": 4.1,
    "eyeR": 2.2,
    "mouth": 3.6,
    "nose": 4.5,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/nod_s1_loop_32.png",
    "rect": [160, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/nod_s1_loop_32.png",
    "rect": [160, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/nod_s1_loop_32_u.png",
    "rect": [286, 377, 230, 110]
   },
   "yield_eye_px": 0,
   "yield_px": 284,
   "cover_alien_px": 12,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     3.68,
     -0.72
    ],
    "eyeR": [
     1.97,
     -0.99
    ],
    "mouth": [
     3.35,
     -1.98
    ]
   },
   "w": 1.0
  },
  "frames/nod_s1_loop/33.png": {
   "m": [
    1.01099,
    -0.03897,
    -31.91,
    9.78
   ],
   "scale": 1.0117,
   "rot_deg": -2.21,
   "shift": [
    -9.3,
    -1.0
   ],
   "inliers": 66,
   "residual_px": 0.97,
   "ref_residual_px": {
    "eyeL": 4.1,
    "eyeR": 1.4,
    "mouth": 3.6,
    "nose": 3.6,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/nod_s1_loop_33.png",
    "rect": [160, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/nod_s1_loop_33.png",
    "rect": [160, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/nod_s1_loop_33_u.png",
    "rect": [286, 376, 230, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 255,
   "cover_alien_px": 15,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     3.1,
     -0.72
    ],
    "eyeR": [
     1.57,
     -0.99
    ],
    "mouth": [
     2.8,
     -1.98
    ]
   },
   "w": 1.0
  },
  "frames/nod_s1_loop/34.png": {
   "m": [
    1.00477,
    -0.03694,
    -25.76,
    13.44
   ],
   "scale": 1.0055,
   "rot_deg": -2.11,
   "shift": [
    -6.6,
    0.6
   ],
   "inliers": 115,
   "residual_px": 0.81,
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
    "file": "track_ink/nod_s1_loop_34.png",
    "rect": [162, 223, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/nod_s1_loop_34.png",
    "rect": [162, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/nod_s1_loop_34_u.png",
    "rect": [288, 378, 228, 110]
   },
   "yield_eye_px": 0,
   "yield_px": 16,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     1.35,
     -0.6
    ],
    "eyeR": [
     0.6,
     -0.36
    ],
    "mouth": [
     1.42,
     -0.85
    ]
   },
   "w": 1.0
  },
  "frames/nod_s1_loop/35.png": {
   "m": [
    1.00366,
    -0.03521,
    -23.12,
    15.25
   ],
   "scale": 1.0043,
   "rot_deg": -2.01,
   "shift": [
    -5.2,
    2.6
   ],
   "inliers": 146,
   "residual_px": 0.85,
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
    "file": "track_ink/nod_s1_loop_35.png",
    "rect": [164, 225, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/nod_s1_loop_35.png",
    "rect": [164, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/nod_s1_loop_35_u.png",
    "rect": [290, 380, 228, 110]
   },
   "yield_eye_px": 0,
   "yield_px": 11,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.88,
     -0.42
    ],
    "eyeR": [
     0.24,
     -0.32
    ],
    "mouth": [
     1.04,
     -0.74
    ]
   },
   "w": 1.0
  },
  "frames/nod_s1_loop/36.png": {
   "m": [
    1.00154,
    -0.02769,
    -16.06,
    14.8
   ],
   "scale": 1.0019,
   "rot_deg": -1.58,
   "shift": [
    -2.5,
    4.2
   ],
   "inliers": 135,
   "residual_px": 0.73,
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
    "file": "track_ink/nod_s1_loop_36.png",
    "rect": [166, 226, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/nod_s1_loop_36.png",
    "rect": [166, 226, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/nod_s1_loop_36_u.png",
    "rect": [293, 383, 228, 108]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.07,
     0.08
    ],
    "eyeR": [
     -0.15,
     0.07
    ],
    "mouth": [
     -0.1,
     0.24
    ]
   },
   "w": 1.0
  },
  "frames/nod_s1_loop/37.png": {
   "m": [
    1.00078,
    -0.02688,
    -15.29,
    14.02
   ],
   "scale": 1.0011,
   "rot_deg": -1.54,
   "shift": [
    -2.5,
    3.4
   ],
   "inliers": 137,
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
    "file": "track_ink/nod_s1_loop_37.png",
    "rect": [167, 225, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/nod_s1_loop_37.png",
    "rect": [167, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/nod_s1_loop_37_u.png",
    "rect": [293, 382, 227, 108]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.22,
     0.08
    ],
    "eyeR": [
     -0.15,
     0.07
    ],
    "mouth": [
     -0.11,
     0.24
    ]
   },
   "w": 1.0
  },
  "frames/nod_s1_loop/38.png": {
   "m": [
    0.99953,
    -0.02179,
    -12.09,
    9.91
   ],
   "scale": 0.9998,
   "rot_deg": -1.25,
   "shift": [
    -2.1,
    0.8
   ],
   "inliers": 139,
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
    "file": "track_ink/nod_s1_loop_38.png",
    "rect": [167, 223, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/nod_s1_loop_38.png",
    "rect": [167, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/nod_s1_loop_38_u.png",
    "rect": [294, 380, 226, 107]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.22,
     0.08
    ],
    "eyeR": [
     -0.09,
     0.0
    ],
    "mouth": [
     -0.1,
     0.28
    ]
   },
   "w": 1.0
  },
  "frames/nod_s1_loop/39.png": {
   "m": [
    1.00021,
    -0.01496,
    -9.2,
    6.01
   ],
   "scale": 1.0003,
   "rot_deg": -0.86,
   "shift": [
    -2.1,
    -0.0
   ],
   "inliers": 160,
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
    "file": "track_ink/nod_s1_loop_39.png",
    "rect": [167, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/nod_s1_loop_39.png",
    "rect": [167, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/nod_s1_loop_39_u.png",
    "rect": [294, 380, 228, 106]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.14,
     0.02
    ],
    "eyeR": [
     0.05,
     -0.02
    ],
    "mouth": [
     0.08,
     0.13
    ]
   },
   "w": 1.0
  },
  "frames/nod_s1_loop/40.png": {
   "m": [
    1.00097,
    -0.00955,
    -6.17,
    3.66
   ],
   "scale": 1.001,
   "rot_deg": -0.55,
   "shift": [
    -1.3,
    0.2
   ],
   "inliers": 182,
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
    "file": "track_ink/nod_s1_loop_40.png",
    "rect": [168, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/nod_s1_loop_40.png",
    "rect": [168, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/nod_s1_loop_40_u.png",
    "rect": [296, 380, 226, 106]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 15,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.21,
     0.05
    ],
    "eyeR": [
     0.1,
     0.0
    ],
    "mouth": [
     0.24,
     0.12
    ]
   },
   "w": 1.0
  },
  "frames/nod_s1_loop/41.png": {
   "m": [
    1.00086,
    -0.00758,
    -4.86,
    2.84
   ],
   "scale": 1.0009,
   "rot_deg": -0.43,
   "shift": [
    -1.0,
    0.1
   ],
   "inliers": 174,
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
    "file": "track_ink/nod_s1_loop_41.png",
    "rect": [168, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/nod_s1_loop_41.png",
    "rect": [168, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/nod_s1_loop_41_u.png",
    "rect": [296, 380, 226, 106]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.21,
     0.05
    ],
    "eyeR": [
     0.06,
     0.09
    ],
    "mouth": [
     0.24,
     0.12
    ]
   },
   "w": 1.0
  },
  "frames/nod_s1_loop/42.png": {
   "m": [
    1.00065,
    -0.00405,
    -2.64,
    1.42
   ],
   "scale": 1.0007,
   "rot_deg": -0.23,
   "shift": [
    -0.5,
    0.1
   ],
   "inliers": 192,
   "residual_px": 0.51,
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
    "file": "track_ink/nod_s1_loop_42.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/nod_s1_loop_42.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/nod_s1_loop_42_u.png",
    "rect": [296, 381, 226, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 12,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.12,
     0.06
    ],
    "eyeR": [
     0.06,
     0.09
    ],
    "mouth": [
     0.12,
     0.12
    ]
   },
   "w": 1.0
  },
  "frames/nod_s1_loop/43.png": {
   "m": [
    1.00064,
    0.00046,
    -0.42,
    -0.34
   ],
   "scale": 1.0006,
   "rot_deg": 0.03,
   "shift": [
    -0.4,
    0.1
   ],
   "inliers": 182,
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
    "file": "track_ink/nod_s1_loop_43.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/nod_s1_loop_43.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/nod_s1_loop_43_u.png",
    "rect": [297, 381, 227, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.12,
     0.06
    ],
    "eyeR": [
     0.03,
     0.0
    ],
    "mouth": [
     0.0,
     0.1
    ]
   },
   "w": 1.0
  },
  "frames/nod_s1_loop/44.png": {
   "m": [
    1.00003,
    -0.00028,
    -0.26,
    0.15
   ],
   "scale": 1.0,
   "rot_deg": -0.02,
   "shift": [
    -0.1,
    0.0
   ],
   "inliers": 193,
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
    "file": "track_ink/nod_s1_loop_44.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/nod_s1_loop_44.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/nod_s1_loop_44_u.png",
    "rect": [297, 381, 227, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.03,
     0.05
    ],
    "eyeR": [
     -0.01,
     0.0
    ],
    "mouth": [
     -0.01,
     0.1
    ]
   },
   "w": 1.0
  },
  "frames/nod_s1_loop/45.png": {
   "m": [
    1.00014,
    -0.0002,
    -0.23,
    0.05
   ],
   "scale": 1.0001,
   "rot_deg": -0.01,
   "shift": [
    -0.1,
    0.0
   ],
   "inliers": 195,
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
    "file": "track_ink/nod_s1_loop_45.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/nod_s1_loop_45.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/nod_s1_loop_45_u.png",
    "rect": [297, 381, 227, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.03,
     0.04
    ],
    "eyeR": [
     -0.03,
     0.03
    ],
    "mouth": [
     -0.03,
     0.15
    ]
   },
   "w": 1.0
  },
  "frames/nod_s1_loop/46.png": {
   "m": [
    1.00025,
    -0.00028,
    -0.28,
    0.03
   ],
   "scale": 1.0003,
   "rot_deg": -0.02,
   "shift": [
    -0.0,
    0.0
   ],
   "inliers": 198,
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
    "file": "track_ink/nod_s1_loop_46.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/nod_s1_loop_46.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/nod_s1_loop_46_u.png",
    "rect": [297, 381, 227, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.02,
     0.04
    ],
    "eyeR": [
     -0.04,
     0.04
    ],
    "mouth": [
     -0.04,
     0.15
    ]
   },
   "w": 1.0
  },
  "frames/nod_s1_loop/47.png": {
   "m": [
    1.0002,
    -0.00024,
    -0.2,
    0.02
   ],
   "scale": 1.0002,
   "rot_deg": -0.01,
   "shift": [
    -0.0,
    0.0
   ],
   "inliers": 207,
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
    "file": "track_ink/nod_s1_loop_47.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/nod_s1_loop_47.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/nod_s1_loop_47_u.png",
    "rect": [297, 381, 227, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.02,
     0.02
    ],
    "eyeR": [
     -0.04,
     0.03
    ],
    "mouth": [
     -0.04,
     0.13
    ]
   },
   "w": 1.0
  },
  "frames/nod_s1_loop/48.png": {
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
    "file": "track_ink/nod_s1_loop_48.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/nod_s1_loop_48.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/nod_s1_loop_48_u.png",
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
  "frames/clap_s1_loop/00.png": {
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
    "file": "track_ink/clap_s1_loop_00.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_00.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_00_u.png",
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
  "frames/clap_s1_loop/01.png": {
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
    "file": "track_ink/clap_s1_loop_01.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_01.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_01_u.png",
    "rect": [297, 381, 227, 104]
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
  "frames/clap_s1_loop/02.png": {
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
    "file": "track_ink/clap_s1_loop_02.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_02.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_02_u.png",
    "rect": [297, 381, 227, 104]
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
  "frames/clap_s1_loop/03.png": {
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
    "file": "track_ink/clap_s1_loop_03.png",
    "rect": [169, 223, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_03.png",
    "rect": [169, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_03_u.png",
    "rect": [297, 382, 227, 104]
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
  "frames/clap_s1_loop/04.png": {
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
    "file": "track_ink/clap_s1_loop_04.png",
    "rect": [169, 229, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_04.png",
    "rect": [169, 229, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_04_u.png",
    "rect": [297, 386, 227, 107]
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
  "frames/clap_s1_loop/05.png": {
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
    "file": "track_ink/clap_s1_loop_05.png",
    "rect": [167, 234, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_05.png",
    "rect": [167, 234, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_05_u.png",
    "rect": [294, 390, 230, 108]
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
  "frames/clap_s1_loop/06.png": {
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
    "file": "track_ink/clap_s1_loop_06.png",
    "rect": [166, 234, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_06.png",
    "rect": [166, 234, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_06_u.png",
    "rect": [292, 390, 228, 109]
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
  "frames/clap_s1_loop/07.png": {
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
    "file": "track_ink/clap_s1_loop_07.png",
    "rect": [166, 231, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_07.png",
    "rect": [166, 231, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_07_u.png",
    "rect": [291, 386, 228, 110]
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
  "frames/clap_s1_loop/08.png": {
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
    "file": "track_ink/clap_s1_loop_08.png",
    "rect": [165, 227, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_08.png",
    "rect": [165, 227, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_08_u.png",
    "rect": [292, 383, 226, 109]
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
  "frames/clap_s1_loop/09.png": {
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
    "file": "track_ink/clap_s1_loop_09.png",
    "rect": [166, 224, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_09.png",
    "rect": [166, 224, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_09_u.png",
    "rect": [292, 380, 226, 109]
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
  "frames/clap_s1_loop/10.png": {
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
    "file": "track_ink/clap_s1_loop_10.png",
    "rect": [166, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_10.png",
    "rect": [166, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_10_u.png",
    "rect": [294, 379, 228, 106]
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
  "frames/clap_s1_loop/11.png": {
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
    "file": "track_ink/clap_s1_loop_11.png",
    "rect": [166, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_11.png",
    "rect": [166, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_11_u.png",
    "rect": [294, 379, 228, 105]
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
  "frames/clap_s1_loop/12.png": {
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
    "file": "track_ink/clap_s1_loop_12.png",
    "rect": [165, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_12.png",
    "rect": [165, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_12_u.png",
    "rect": [292, 379, 228, 106]
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
  "frames/clap_s1_loop/13.png": {
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
    "file": "track_ink/clap_s1_loop_13.png",
    "rect": [165, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_13.png",
    "rect": [165, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_13_u.png",
    "rect": [291, 380, 229, 107]
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
  "frames/clap_s1_loop/14.png": {
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
    "file": "track_ink/clap_s1_loop_14.png",
    "rect": [167, 224, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_14.png",
    "rect": [167, 224, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_14_u.png",
    "rect": [294, 381, 228, 107]
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
  "frames/clap_s1_loop/15.png": {
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
    "file": "track_ink/clap_s1_loop_15.png",
    "rect": [169, 227, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_15.png",
    "rect": [169, 227, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_15_u.png",
    "rect": [297, 386, 229, 103]
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
  "frames/clap_s1_loop/16.png": {
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
    "file": "track_ink/clap_s1_loop_16.png",
    "rect": [170, 227, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_16.png",
    "rect": [170, 227, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_16_u.png",
    "rect": [300, 386, 226, 104]
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
  "frames/clap_s1_loop/17.png": {
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
    "file": "track_ink/clap_s1_loop_17.png",
    "rect": [171, 225, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_17.png",
    "rect": [171, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_17_u.png",
    "rect": [300, 385, 224, 103]
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
  "frames/clap_s1_loop/18.png": {
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
    "file": "track_ink/clap_s1_loop_18.png",
    "rect": [171, 224, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_18.png",
    "rect": [171, 224, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_18_u.png",
    "rect": [300, 383, 226, 104]
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
  "frames/clap_s1_loop/19.png": {
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
    "file": "track_ink/clap_s1_loop_19.png",
    "rect": [173, 223, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_19.png",
    "rect": [173, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_19_u.png",
    "rect": [302, 382, 228, 106]
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
  "frames/clap_s1_loop/20.png": {
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
    "file": "track_ink/clap_s1_loop_20.png",
    "rect": [172, 224, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_20.png",
    "rect": [172, 224, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_20_u.png",
    "rect": [302, 382, 229, 106]
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
  "frames/clap_s1_loop/21.png": {
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
    "file": "track_ink/clap_s1_loop_21.png",
    "rect": [170, 224, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_21.png",
    "rect": [170, 224, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_21_u.png",
    "rect": [298, 383, 230, 104]
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
  "frames/clap_s1_loop/22.png": {
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
    "file": "track_ink/clap_s1_loop_22.png",
    "rect": [167, 224, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_22.png",
    "rect": [167, 224, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_22_u.png",
    "rect": [294, 382, 230, 106]
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
  "frames/clap_s1_loop/23.png": {
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
    "file": "track_ink/clap_s1_loop_23.png",
    "rect": [162, 227, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_23.png",
    "rect": [162, 227, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_23_u.png",
    "rect": [287, 382, 231, 110]
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
  "frames/clap_s1_loop/24.png": {
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
    "file": "track_ink/clap_s1_loop_24.png",
    "rect": [162, 226, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_24.png",
    "rect": [162, 226, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_24_u.png",
    "rect": [288, 381, 230, 111]
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
  "frames/clap_s1_loop/25.png": {
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
    "file": "track_ink/clap_s1_loop_25.png",
    "rect": [166, 226, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_25.png",
    "rect": [166, 226, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_25_u.png",
    "rect": [293, 383, 225, 107]
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
  "frames/clap_s1_loop/26.png": {
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
    "file": "track_ink/clap_s1_loop_26.png",
    "rect": [168, 225, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_26.png",
    "rect": [168, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_26_u.png",
    "rect": [296, 384, 226, 104]
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
  "frames/clap_s1_loop/27.png": {
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
    "file": "track_ink/clap_s1_loop_27.png",
    "rect": [171, 225, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_27.png",
    "rect": [171, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_27_u.png",
    "rect": [301, 384, 225, 104]
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
  "frames/clap_s1_loop/28.png": {
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
    "file": "track_ink/clap_s1_loop_28.png",
    "rect": [171, 225, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_28.png",
    "rect": [171, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_28_u.png",
    "rect": [300, 384, 228, 104]
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
  "frames/clap_s1_loop/29.png": {
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
    "file": "track_ink/clap_s1_loop_29.png",
    "rect": [169, 225, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_29.png",
    "rect": [169, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_29_u.png",
    "rect": [298, 384, 228, 104]
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
  "frames/clap_s1_loop/30.png": {
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
    "file": "track_ink/clap_s1_loop_30.png",
    "rect": [167, 225, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_30.png",
    "rect": [167, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_30_u.png",
    "rect": [296, 383, 228, 106]
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
  "frames/clap_s1_loop/31.png": {
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
    "file": "track_ink/clap_s1_loop_31.png",
    "rect": [163, 225, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_31.png",
    "rect": [163, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_31_u.png",
    "rect": [290, 381, 230, 109]
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
  "frames/clap_s1_loop/32.png": {
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
    "file": "track_ink/clap_s1_loop_32.png",
    "rect": [161, 225, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_32.png",
    "rect": [161, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_32_u.png",
    "rect": [287, 381, 229, 110]
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
  "frames/clap_s1_loop/33.png": {
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
    "file": "track_ink/clap_s1_loop_33.png",
    "rect": [162, 226, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_33.png",
    "rect": [162, 226, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_33_u.png",
    "rect": [288, 382, 228, 110]
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
  "frames/clap_s1_loop/34.png": {
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
    "file": "track_ink/clap_s1_loop_34.png",
    "rect": [163, 231, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_34.png",
    "rect": [163, 231, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_34_u.png",
    "rect": [289, 387, 229, 110]
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
  "frames/clap_s1_loop/35.png": {
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
    "file": "track_ink/clap_s1_loop_35.png",
    "rect": [164, 232, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_35.png",
    "rect": [164, 232, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_35_u.png",
    "rect": [290, 388, 228, 110]
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
  "frames/clap_s1_loop/36.png": {
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
    "file": "track_ink/clap_s1_loop_36.png",
    "rect": [165, 229, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_36.png",
    "rect": [165, 229, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_36_u.png",
    "rect": [291, 385, 229, 110]
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
  "frames/clap_s1_loop/37.png": {
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
    "file": "track_ink/clap_s1_loop_37.png",
    "rect": [165, 226, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_37.png",
    "rect": [165, 226, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_37_u.png",
    "rect": [291, 382, 229, 109]
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
  "frames/clap_s1_loop/38.png": {
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
    "file": "track_ink/clap_s1_loop_38.png",
    "rect": [166, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_38.png",
    "rect": [166, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_38_u.png",
    "rect": [292, 377, 228, 109]
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
  "frames/clap_s1_loop/39.png": {
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
    "file": "track_ink/clap_s1_loop_39.png",
    "rect": [166, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_39.png",
    "rect": [166, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_39_u.png",
    "rect": [292, 376, 228, 109]
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
  "frames/clap_s1_loop/40.png": {
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
    "file": "track_ink/clap_s1_loop_40.png",
    "rect": [167, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_40.png",
    "rect": [167, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_40_u.png",
    "rect": [294, 378, 228, 107]
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
  "frames/clap_s1_loop/41.png": {
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
    "file": "track_ink/clap_s1_loop_41.png",
    "rect": [167, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_41.png",
    "rect": [167, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_41_u.png",
    "rect": [295, 379, 227, 107]
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
  "frames/clap_s1_loop/42.png": {
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
    "file": "track_ink/clap_s1_loop_42.png",
    "rect": [168, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_42.png",
    "rect": [168, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_42_u.png",
    "rect": [296, 381, 226, 104]
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
  "frames/clap_s1_loop/43.png": {
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
    "file": "track_ink/clap_s1_loop_43.png",
    "rect": [168, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_43.png",
    "rect": [168, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_43_u.png",
    "rect": [296, 381, 226, 104]
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
  "frames/clap_s1_loop/44.png": {
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
    "file": "track_ink/clap_s1_loop_44.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_44.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_44_u.png",
    "rect": [297, 381, 226, 104]
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
  "frames/clap_s1_loop/45.png": {
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
    "file": "track_ink/clap_s1_loop_45.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_45.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_45_u.png",
    "rect": [297, 381, 226, 104]
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
  "frames/clap_s1_loop/46.png": {
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
    "file": "track_ink/clap_s1_loop_46.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_46.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_46_u.png",
    "rect": [297, 381, 226, 104]
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
  "frames/clap_s1_loop/47.png": {
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
    "file": "track_ink/clap_s1_loop_47.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_47.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_47_u.png",
    "rect": [297, 381, 226, 104]
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
  "frames/clap_s1_loop/48.png": {
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
    "file": "track_ink/clap_s1_loop_48.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/clap_s1_loop_48.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/clap_s1_loop_48_u.png",
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
  "frames/hips_s1_loop/00.png": {
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
    "file": "track_ink/hips_s1_loop_00.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_loop_00.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_loop_00_u.png",
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
  "frames/hips_s1_loop/01.png": {
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
    "file": "track_ink/hips_s1_loop_01.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_loop_01.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_loop_01_u.png",
    "rect": [297, 381, 225, 104]
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
  "frames/hips_s1_loop/02.png": {
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
    "file": "track_ink/hips_s1_loop_02.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_loop_02.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_loop_02_u.png",
    "rect": [297, 381, 225, 104]
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
  "frames/hips_s1_loop/03.png": {
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
    "file": "track_ink/hips_s1_loop_03.png",
    "rect": [169, 223, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_loop_03.png",
    "rect": [169, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_loop_03_u.png",
    "rect": [297, 382, 225, 104]
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
  "frames/hips_s1_loop/04.png": {
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
    "file": "track_ink/hips_s1_loop_04.png",
    "rect": [169, 230, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_loop_04.png",
    "rect": [169, 230, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_loop_04_u.png",
    "rect": [296, 387, 228, 107]
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
  "frames/hips_s1_loop/05.png": {
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
    "file": "track_ink/hips_s1_loop_05.png",
    "rect": [170, 235, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_loop_05.png",
    "rect": [170, 235, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_loop_05_u.png",
    "rect": [296, 391, 228, 108]
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
  "frames/hips_s1_loop/06.png": {
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
    "file": "track_ink/hips_s1_loop_06.png",
    "rect": [170, 242, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_loop_06.png",
    "rect": [170, 242, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_loop_06_u.png",
    "rect": [295, 397, 228, 111]
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
  "frames/hips_s1_loop/07.png": {
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
    "file": "track_ink/hips_s1_loop_07.png",
    "rect": [170, 237, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_loop_07.png",
    "rect": [170, 237, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_loop_07_u.png",
    "rect": [295, 393, 228, 109]
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
  "frames/hips_s1_loop/08.png": {
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
    "file": "track_ink/hips_s1_loop_08.png",
    "rect": [169, 227, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_loop_08.png",
    "rect": [169, 227, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_loop_08_u.png",
    "rect": [296, 385, 226, 106]
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
  "frames/hips_s1_loop/09.png": {
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
    "file": "track_ink/hips_s1_loop_09.png",
    "rect": [168, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_loop_09.png",
    "rect": [168, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_loop_09_u.png",
    "rect": [296, 380, 226, 103]
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
  "frames/hips_s1_loop/10.png": {
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
    "file": "track_ink/hips_s1_loop_10.png",
    "rect": [169, 214, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_loop_10.png",
    "rect": [169, 214, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_loop_10_u.png",
    "rect": [298, 372, 226, 106]
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
  "frames/hips_s1_loop/11.png": {
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
    "file": "track_ink/hips_s1_loop_11.png",
    "rect": [169, 211, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_loop_11.png",
    "rect": [169, 211, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_loop_11_u.png",
    "rect": [300, 368, 226, 109]
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
  "frames/hips_s1_loop/12.png": {
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
    "file": "track_ink/hips_s1_loop_12.png",
    "rect": [171, 210, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_loop_12.png",
    "rect": [171, 210, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_loop_12_u.png",
    "rect": [303, 366, 225, 112]
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
  "frames/hips_s1_loop/13.png": {
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
    "file": "track_ink/hips_s1_loop_13.png",
    "rect": [172, 211, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_loop_13.png",
    "rect": [172, 211, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_loop_13_u.png",
    "rect": [304, 366, 224, 113]
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
  "frames/hips_s1_loop/14.png": {
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
    "file": "track_ink/hips_s1_loop_14.png",
    "rect": [172, 216, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_loop_14.png",
    "rect": [172, 216, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_loop_14_u.png",
    "rect": [304, 371, 226, 113]
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
  "frames/hips_s1_loop/15.png": {
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
    "file": "track_ink/hips_s1_loop_15.png",
    "rect": [172, 218, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_loop_15.png",
    "rect": [172, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_loop_15_u.png",
    "rect": [304, 373, 226, 113]
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
  "frames/hips_s1_loop/16.png": {
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
    "file": "track_ink/hips_s1_loop_16.png",
    "rect": [173, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_loop_16.png",
    "rect": [173, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_loop_16_u.png",
    "rect": [305, 375, 225, 111]
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
  "frames/hips_s1_loop/17.png": {
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
    "file": "track_ink/hips_s1_loop_17.png",
    "rect": [171, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_loop_17.png",
    "rect": [171, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_loop_17_u.png",
    "rect": [303, 376, 225, 109]
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
  "frames/hips_s1_loop/18.png": {
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
    "file": "track_ink/hips_s1_loop_18.png",
    "rect": [171, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_loop_18.png",
    "rect": [171, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_loop_18_u.png",
    "rect": [302, 377, 224, 108]
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
  "frames/hips_s1_loop/19.png": {
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
    "file": "track_ink/hips_s1_loop_19.png",
    "rect": [171, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_loop_19.png",
    "rect": [171, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_loop_19_u.png",
    "rect": [301, 377, 225, 107]
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
  "frames/hips_s1_loop/20.png": {
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
    "file": "track_ink/hips_s1_loop_20.png",
    "rect": [171, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_loop_20.png",
    "rect": [171, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_loop_20_u.png",
    "rect": [301, 377, 225, 107]
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
  "frames/hips_s1_loop/21.png": {
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
    "file": "track_ink/hips_s1_loop_21.png",
    "rect": [171, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_loop_21.png",
    "rect": [171, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_loop_21_u.png",
    "rect": [300, 378, 226, 106]
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
  "frames/hips_s1_loop/22.png": {
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
    "file": "track_ink/hips_s1_loop_22.png",
    "rect": [171, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_loop_22.png",
    "rect": [171, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_loop_22_u.png",
    "rect": [301, 378, 225, 106]
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
  "frames/hips_s1_loop/23.png": {
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
    "file": "track_ink/hips_s1_loop_23.png",
    "rect": [171, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_loop_23.png",
    "rect": [171, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_loop_23_u.png",
    "rect": [301, 378, 225, 106]
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
  "frames/hips_s1_loop/24.png": {
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
    "file": "track_ink/hips_s1_loop_24.png",
    "rect": [171, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_loop_24.png",
    "rect": [171, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_loop_24_u.png",
    "rect": [301, 378, 225, 106]
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
  "frames/hips_s1_loop/25.png": {
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
    "file": "track_ink/hips_s1_loop_25.png",
    "rect": [171, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_loop_25.png",
    "rect": [171, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_loop_25_u.png",
    "rect": [301, 378, 225, 106]
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
  "frames/hips_s1_loop/26.png": {
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
    "file": "track_ink/hips_s1_loop_26.png",
    "rect": [170, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_loop_26.png",
    "rect": [170, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_loop_26_u.png",
    "rect": [300, 377, 226, 107]
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
  "frames/hips_s1_loop/27.png": {
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
    "file": "track_ink/hips_s1_loop_27.png",
    "rect": [170, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_loop_27.png",
    "rect": [170, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_loop_27_u.png",
    "rect": [300, 378, 226, 105]
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
  "frames/hips_s1_loop/28.png": {
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
    "file": "track_ink/hips_s1_loop_28.png",
    "rect": [170, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_loop_28.png",
    "rect": [170, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_loop_28_u.png",
    "rect": [299, 378, 227, 105]
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
  "frames/hips_s1_loop/29.png": {
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
    "file": "track_ink/hips_s1_loop_29.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_loop_29.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_loop_29_u.png",
    "rect": [297, 380, 227, 103]
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
  "frames/hips_s1_loop/30.png": {
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
    "file": "track_ink/hips_s1_loop_30.png",
    "rect": [168, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_loop_30.png",
    "rect": [168, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_loop_30_u.png",
    "rect": [297, 379, 226, 104]
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
  "frames/hips_s1_loop/31.png": {
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
    "file": "track_ink/hips_s1_loop_31.png",
    "rect": [167, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_loop_31.png",
    "rect": [167, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_loop_31_u.png",
    "rect": [294, 378, 226, 107]
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
  "frames/hips_s1_loop/32.png": {
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
    "file": "track_ink/hips_s1_loop_32.png",
    "rect": [166, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_loop_32.png",
    "rect": [166, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_loop_32_u.png",
    "rect": [292, 378, 226, 109]
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
  "frames/hips_s1_loop/33.png": {
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
    "file": "track_ink/hips_s1_loop_33.png",
    "rect": [166, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_loop_33.png",
    "rect": [166, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_loop_33_u.png",
    "rect": [292, 378, 226, 110]
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
  "frames/hips_s1_loop/34.png": {
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
    "file": "track_ink/hips_s1_loop_34.png",
    "rect": [167, 228, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_loop_34.png",
    "rect": [167, 228, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_loop_34_u.png",
    "rect": [292, 382, 228, 112]
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
  "frames/hips_s1_loop/35.png": {
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
    "file": "track_ink/hips_s1_loop_35.png",
    "rect": [167, 231, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_loop_35.png",
    "rect": [167, 231, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_loop_35_u.png",
    "rect": [292, 385, 228, 112]
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
  "frames/hips_s1_loop/36.png": {
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
    "file": "track_ink/hips_s1_loop_36.png",
    "rect": [170, 238, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_loop_36.png",
    "rect": [170, 238, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_loop_36_u.png",
    "rect": [292, 390, 230, 116]
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
  "frames/hips_s1_loop/37.png": {
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
    "file": "track_ink/hips_s1_loop_37.png",
    "rect": [170, 236, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_loop_37.png",
    "rect": [170, 236, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_loop_37_u.png",
    "rect": [293, 388, 228, 116]
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
  "frames/hips_s1_loop/38.png": {
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
    "file": "track_ink/hips_s1_loop_38.png",
    "rect": [169, 226, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_loop_38.png",
    "rect": [169, 226, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_loop_38_u.png",
    "rect": [294, 381, 226, 112]
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
  "frames/hips_s1_loop/39.png": {
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
    "file": "track_ink/hips_s1_loop_39.png",
    "rect": [168, 223, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_loop_39.png",
    "rect": [168, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_loop_39_u.png",
    "rect": [294, 378, 226, 111]
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
  "frames/hips_s1_loop/40.png": {
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
    "file": "track_ink/hips_s1_loop_40.png",
    "rect": [168, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_loop_40.png",
    "rect": [168, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_loop_40_u.png",
    "rect": [294, 378, 226, 108]
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
  "frames/hips_s1_loop/41.png": {
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
    "file": "track_ink/hips_s1_loop_41.png",
    "rect": [168, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_loop_41.png",
    "rect": [168, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_loop_41_u.png",
    "rect": [295, 379, 225, 107]
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
  "frames/hips_s1_loop/42.png": {
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
    "file": "track_ink/hips_s1_loop_42.png",
    "rect": [168, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_loop_42.png",
    "rect": [168, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_loop_42_u.png",
    "rect": [295, 380, 227, 106]
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
  "frames/hips_s1_loop/43.png": {
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
    "file": "track_ink/hips_s1_loop_43.png",
    "rect": [168, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_loop_43.png",
    "rect": [168, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_loop_43_u.png",
    "rect": [296, 381, 226, 104]
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
  "frames/hips_s1_loop/44.png": {
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
    "file": "track_ink/hips_s1_loop_44.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_loop_44.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_loop_44_u.png",
    "rect": [297, 381, 225, 104]
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
  "frames/hips_s1_loop/45.png": {
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
    "file": "track_ink/hips_s1_loop_45.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_loop_45.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_loop_45_u.png",
    "rect": [297, 381, 225, 104]
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
  "frames/hips_s1_loop/46.png": {
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
    "file": "track_ink/hips_s1_loop_46.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_loop_46.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_loop_46_u.png",
    "rect": [297, 381, 227, 104]
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
  "frames/hips_s1_loop/47.png": {
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
    "file": "track_ink/hips_s1_loop_47.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_loop_47.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_loop_47_u.png",
    "rect": [297, 381, 227, 104]
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
  "frames/hips_s1_loop/48.png": {
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
    "file": "track_ink/hips_s1_loop_48.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_loop_48.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_loop_48_u.png",
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
  "frames/gesture_s1_loop/00.png": {
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
    "file": "track_ink/gesture_s1_loop_00.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/gesture_s1_loop_00.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/gesture_s1_loop_00_u.png",
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
  "frames/gesture_s1_loop/01.png": {
   "m": [
    0.99881,
    0.00238,
    1.92,
    0.48
   ],
   "scale": 0.9988,
   "rot_deg": 0.14,
   "shift": [
    0.3,
    0.9
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
    "file": "track_ink/gesture_s1_loop_01.png",
    "rect": [169, 223, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/gesture_s1_loop_01.png",
    "rect": [169, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/gesture_s1_loop_01_u.png",
    "rect": [298, 382, 224, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.21,
     0.0
    ],
    "eyeR": [
     0.0,
     0.15
    ],
    "mouth": [
     0.0,
     -0.0
    ]
   },
   "w": 1.0
  },
  "frames/gesture_s1_loop/02.png": {
   "m": [
    0.99937,
    0.00902,
    4.97,
    -0.16
   ],
   "scale": 0.9994,
   "rot_deg": 0.52,
   "shift": [
    0.5,
    3.2
   ],
   "inliers": 150,
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
    "file": "track_ink/gesture_s1_loop_02.png",
    "rect": [170, 225, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/gesture_s1_loop_02.png",
    "rect": [170, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/gesture_s1_loop_02_u.png",
    "rect": [298, 385, 226, 103]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 2,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.24,
     -0.03
    ],
    "eyeR": [
     -0.13,
     0.15
    ],
    "mouth": [
     -0.13,
     0.08
    ]
   },
   "w": 1.0
  },
  "frames/gesture_s1_loop/03.png": {
   "m": [
    0.9985,
    0.01543,
    8.96,
    -1.39
   ],
   "scale": 0.9986,
   "rot_deg": 0.89,
   "shift": [
    1.2,
    4.2
   ],
   "inliers": 124,
   "residual_px": 0.79,
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
    "file": "track_ink/gesture_s1_loop_03.png",
    "rect": [170, 226, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/gesture_s1_loop_03.png",
    "rect": [170, 226, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/gesture_s1_loop_03_u.png",
    "rect": [299, 385, 225, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.58,
     -0.03
    ],
    "eyeR": [
     -0.28,
     0.15
    ],
    "mouth": [
     -0.25,
     0.18
    ]
   },
   "w": 1.0
  },
  "frames/gesture_s1_loop/04.png": {
   "m": [
    0.99551,
    0.03079,
    18.5,
    -8.33
   ],
   "scale": 0.996,
   "rot_deg": 1.77,
   "shift": [
    2.3,
    2.2
   ],
   "inliers": 98,
   "residual_px": 0.91,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.4,
    "mouth": 0.0,
    "nose": 1.4,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/gesture_s1_loop_04.png",
    "rect": [171, 224, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/gesture_s1_loop_04.png",
    "rect": [171, 224, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/gesture_s1_loop_04_u.png",
    "rect": [302, 382, 226, 106]
   },
   "yield_eye_px": 0,
   "yield_px": 6,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.77,
     0.23
    ],
    "eyeR": [
     -0.29,
     0.32
    ],
    "mouth": [
     -0.51,
     0.18
    ]
   },
   "w": 1.0
  },
  "frames/gesture_s1_loop/05.png": {
   "m": [
    0.99601,
    0.03783,
    21.81,
    -13.82
   ],
   "scale": 0.9967,
   "rot_deg": 2.18,
   "shift": [
    2.6,
    -0.2
   ],
   "inliers": 95,
   "residual_px": 1.03,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 3.2,
    "nose": 1.4,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/gesture_s1_loop_05.png",
    "rect": [172, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/gesture_s1_loop_05.png",
    "rect": [172, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/gesture_s1_loop_05_u.png",
    "rect": [302, 379, 226, 108]
   },
   "yield_eye_px": 0,
   "yield_px": 4,
   "cover_alien_px": 12,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.77,
     0.23
    ],
    "eyeR": [
     -0.28,
     0.32
    ],
    "mouth": [
     -0.51,
     0.09
    ]
   },
   "w": 1.0
  },
  "frames/gesture_s1_loop/06.png": {
   "m": [
    0.99395,
    0.04867,
    28.11,
    -23.16
   ],
   "scale": 0.9951,
   "rot_deg": 2.8,
   "shift": [
    3.0,
    -6.1
   ],
   "inliers": 101,
   "residual_px": 0.91,
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
    "file": "track_ink/gesture_s1_loop_06.png",
    "rect": [172, 216, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/gesture_s1_loop_06.png",
    "rect": [172, 216, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/gesture_s1_loop_06_u.png",
    "rect": [304, 373, 224, 108]
   },
   "yield_eye_px": 0,
   "yield_px": 2,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.6,
     -0.16
    ],
    "eyeR": [
     0.0,
     -0.4
    ],
    "mouth": [
     -0.43,
     -0.06
    ]
   },
   "w": 1.0
  },
  "frames/gesture_s1_loop/07.png": {
   "m": [
    0.99562,
    0.05034,
    28.24,
    -26.11
   ],
   "scale": 0.9969,
   "rot_deg": 2.89,
   "shift": [
    3.0,
    -7.6
   ],
   "inliers": 81,
   "residual_px": 0.83,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/gesture_s1_loop_07.png",
    "rect": [172, 214, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/gesture_s1_loop_07.png",
    "rect": [172, 214, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/gesture_s1_loop_07_u.png",
    "rect": [304, 371, 224, 109]
   },
   "yield_eye_px": 0,
   "yield_px": 2,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.07,
     -1.54
    ],
    "eyeR": [
     0.18,
     -1.47
    ],
    "mouth": [
     -0.1,
     -0.21
    ]
   },
   "w": 1.0
  },
  "frames/gesture_s1_loop/08.png": {
   "m": [
    0.99532,
    0.05251,
    29.38,
    -28.11
   ],
   "scale": 0.9967,
   "rot_deg": 3.02,
   "shift": [
    3.0,
    -8.8
   ],
   "inliers": 65,
   "residual_px": 0.88,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 2.0,
    "nose": 2.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/gesture_s1_loop_08.png",
    "rect": [172, 213, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/gesture_s1_loop_08.png",
    "rect": [172, 213, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/gesture_s1_loop_08_u.png",
    "rect": [304, 370, 224, 109]
   },
   "yield_eye_px": 0,
   "yield_px": 2,
   "cover_alien_px": 10,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.0,
     -1.54
    ],
    "eyeR": [
     0.33,
     -1.79
    ],
    "mouth": [
     0.23,
     -0.37
    ]
   },
   "w": 1.0
  },
  "frames/gesture_s1_loop/09.png": {
   "m": [
    0.99514,
    0.06046,
    32.63,
    -31.91
   ],
   "scale": 0.997,
   "rot_deg": 3.48,
   "shift": [
    2.5,
    -9.5
   ],
   "inliers": 88,
   "residual_px": 1.14,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 2.2,
    "nose": 1.4,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/gesture_s1_loop_09.png",
    "rect": [172, 213, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/gesture_s1_loop_09.png",
    "rect": [172, 213, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/gesture_s1_loop_09_u.png",
    "rect": [302, 368, 226, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 151,
   "cover_alien_px": 12,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.31,
     -0.91
    ],
    "eyeR": [
     0.73,
     -1.79
    ],
    "mouth": [
     0.56,
     -0.53
    ]
   },
   "w": 1.0
  },
  "frames/gesture_s1_loop/10.png": {
   "m": [
    0.99556,
    0.07061,
    37.88,
    -34.87
   ],
   "scale": 0.9981,
   "rot_deg": 4.06,
   "shift": [
    3.2,
    -8.1
   ],
   "inliers": 83,
   "residual_px": 0.95,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 2.2,
    "nose": 2.2,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/gesture_s1_loop_10.png",
    "rect": [172, 214, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/gesture_s1_loop_10.png",
    "rect": [172, 214, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/gesture_s1_loop_10_u.png",
    "rect": [303, 369, 227, 112]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.5,
     -0.8
    ],
    "eyeR": [
     0.73,
     -1.79
    ],
    "mouth": [
     0.89,
     -0.68
    ]
   },
   "w": 1.0
  },
  "frames/gesture_s1_loop/11.png": {
   "m": [
    0.99779,
    0.07773,
    40.66,
    -37.27
   ],
   "scale": 1.0008,
   "rot_deg": 4.45,
   "shift": [
    3.6,
    -6.5
   ],
   "inliers": 80,
   "residual_px": 0.94,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 2.2,
    "mouth": 2.8,
    "nose": 2.2,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/gesture_s1_loop_11.png",
    "rect": [173, 215, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/gesture_s1_loop_11.png",
    "rect": [173, 215, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/gesture_s1_loop_11_u.png",
    "rect": [304, 370, 226, 113]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.5,
     -0.8
    ],
    "eyeR": [
     0.65,
     -1.97
    ],
    "mouth": [
     0.89,
     -0.68
    ]
   },
   "w": 1.0
  },
  "frames/gesture_s1_loop/12.png": {
   "m": [
    0.99612,
    0.0847,
    46.08,
    -36.82
   ],
   "scale": 0.9997,
   "rot_deg": 4.86,
   "shift": [
    5.1,
    -4.0
   ],
   "inliers": 71,
   "residual_px": 0.93,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 2.0,
    "nose": 1.4,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/gesture_s1_loop_12.png",
    "rect": [174, 218, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/gesture_s1_loop_12.png",
    "rect": [174, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/gesture_s1_loop_12_u.png",
    "rect": [306, 372, 226, 114]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.32,
     -0.82
    ],
    "eyeR": [
     0.18,
     -1.97
    ],
    "mouth": [
     0.72,
     -0.63
    ]
   },
   "w": 1.0
  },
  "frames/gesture_s1_loop/13.png": {
   "m": [
    0.99435,
    0.09009,
    49.71,
    -36.95
   ],
   "scale": 0.9984,
   "rot_deg": 5.18,
   "shift": [
    5.5,
    -2.8
   ],
   "inliers": 75,
   "residual_px": 0.98,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 2.2,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/gesture_s1_loop_13.png",
    "rect": [174, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/gesture_s1_loop_13.png",
    "rect": [174, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/gesture_s1_loop_13_u.png",
    "rect": [307, 373, 225, 115]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.03,
     -0.97
    ],
    "eyeR": [
     0.17,
     -1.97
    ],
    "mouth": [
     0.23,
     -0.41
    ]
   },
   "w": 1.0
  },
  "frames/gesture_s1_loop/14.png": {
   "m": [
    0.99486,
    0.09972,
    54.8,
    -39.0
   ],
   "scale": 0.9998,
   "rot_deg": 5.72,
   "shift": [
    6.3,
    -0.6
   ],
   "inliers": 68,
   "residual_px": 0.87,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 2.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/gesture_s1_loop_14.png",
    "rect": [175, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/gesture_s1_loop_14.png",
    "rect": [175, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/gesture_s1_loop_14_u.png",
    "rect": [308, 374, 224, 117]
   },
   "yield_eye_px": 0,
   "yield_px": 56,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.02,
     -0.82
    ],
    "eyeR": [
     -0.01,
     -1.86
    ],
    "mouth": [
     -0.27,
     -0.2
    ]
   },
   "w": 1.0
  },
  "frames/gesture_s1_loop/15.png": {
   "m": [
    0.99196,
    0.10979,
    61.66,
    -42.28
   ],
   "scale": 0.998,
   "rot_deg": 6.32,
   "shift": [
    7.3,
    -1.2
   ],
   "inliers": 76,
   "residual_px": 0.93,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 2.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/gesture_s1_loop_15.png",
    "rect": [176, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/gesture_s1_loop_15.png",
    "rect": [176, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/gesture_s1_loop_15_u.png",
    "rect": [309, 373, 225, 118]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.47,
     -0.97
    ],
    "eyeR": [
     -0.01,
     -1.34
    ],
    "mouth": [
     -0.77,
     0.02
    ]
   },
   "w": 1.0
  },
  "frames/gesture_s1_loop/16.png": {
   "m": [
    0.99216,
    0.10877,
    61.63,
    -41.82
   ],
   "scale": 0.9981,
   "rot_deg": 6.26,
   "shift": [
    7.8,
    -1.0
   ],
   "inliers": 96,
   "residual_px": 0.95,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/gesture_s1_loop_16.png",
    "rect": [177, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/gesture_s1_loop_16.png",
    "rect": [177, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/gesture_s1_loop_16_u.png",
    "rect": [310, 374, 226, 117]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.49,
     -1.19
    ],
    "eyeR": [
     -0.02,
     -1.23
    ],
    "mouth": [
     -1.26,
     0.23
    ]
   },
   "w": 1.0
  },
  "frames/gesture_s1_loop/17.png": {
   "m": [
    0.98892,
    0.11044,
    64.42,
    -41.83
   ],
   "scale": 0.9951,
   "rot_deg": 6.37,
   "shift": [
    8.5,
    -1.9
   ],
   "inliers": 92,
   "residual_px": 0.94,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 1.0,
    "mouth": 2.2,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/gesture_s1_loop_17.png",
    "rect": [178, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/gesture_s1_loop_17.png",
    "rect": [178, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/gesture_s1_loop_17_u.png",
    "rect": [311, 373, 225, 118]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.71,
     -1.19
    ],
    "eyeR": [
     0.03,
     -1.16
    ],
    "mouth": [
     -1.26,
     0.45
    ]
   },
   "w": 1.0
  },
  "frames/gesture_s1_loop/18.png": {
   "m": [
    0.98716,
    0.1147,
    66.67,
    -44.01
   ],
   "scale": 0.9938,
   "rot_deg": 6.63,
   "shift": [
    8.1,
    -3.1
   ],
   "inliers": 88,
   "residual_px": 1.04,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 1.0,
    "mouth": 2.2,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/gesture_s1_loop_18.png",
    "rect": [177, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/gesture_s1_loop_18.png",
    "rect": [177, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/gesture_s1_loop_18_u.png",
    "rect": [312, 371, 224, 119]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 12,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.77,
     -0.64
    ],
    "eyeR": [
     -0.04,
     -0.93
    ],
    "mouth": [
     -1.24,
     1.41
    ]
   },
   "w": 1.0
  },
  "frames/gesture_s1_loop/19.png": {
   "m": [
    0.98794,
    0.11083,
    64.7,
    -42.44
   ],
   "scale": 0.9941,
   "rot_deg": 6.4,
   "shift": [
    8.2,
    -2.8
   ],
   "inliers": 76,
   "residual_px": 0.98,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/gesture_s1_loop_19.png",
    "rect": [177, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/gesture_s1_loop_19.png",
    "rect": [177, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/gesture_s1_loop_19_u.png",
    "rect": [312, 372, 224, 118]
   },
   "yield_eye_px": 0,
   "yield_px": 227,
   "cover_alien_px": 10,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.71,
     -0.64
    ],
    "eyeR": [
     0.14,
     -0.93
    ],
    "mouth": [
     -1.24,
     1.41
    ]
   },
   "w": 1.0
  },
  "frames/gesture_s1_loop/20.png": {
   "m": [
    0.98976,
    0.11089,
    63.51,
    -43.15
   ],
   "scale": 0.996,
   "rot_deg": 6.39,
   "shift": [
    7.7,
    -2.6
   ],
   "inliers": 64,
   "residual_px": 1.05,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/gesture_s1_loop_20.png",
    "rect": [177, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/gesture_s1_loop_20.png",
    "rect": [177, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/gesture_s1_loop_20_u.png",
    "rect": [310, 372, 226, 118]
   },
   "yield_eye_px": 0,
   "yield_px": 247,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.77,
     -0.64
    ],
    "eyeR": [
     -0.04,
     -0.93
    ],
    "mouth": [
     -1.27,
     1.28
    ]
   },
   "w": 1.0
  },
  "frames/gesture_s1_loop/21.png": {
   "m": [
    0.98476,
    0.10549,
    63.38,
    -39.66
   ],
   "scale": 0.9904,
   "rot_deg": 6.11,
   "shift": [
    8.1,
    -3.6
   ],
   "inliers": 69,
   "residual_px": 0.81,
   "ref_residual_px": {
    "eyeL": 2.0,
    "eyeR": 1.0,
    "nose": 2.2,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/gesture_s1_loop_21.png",
    "rect": [177, 218, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/gesture_s1_loop_21.png",
    "rect": [177, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/gesture_s1_loop_21_u.png",
    "rect": [311, 372, 225, 116]
   },
   "yield_eye_px": 6,
   "yield_px": 259,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -1.55,
     -0.74
    ],
    "eyeR": [
     -0.21,
     -0.58
    ],
    "mouth": [
     -1.3,
     1.14
    ]
   },
   "w": 1.0
  },
  "frames/gesture_s1_loop/22.png": {
   "m": [
    0.98059,
    0.09409,
    60.41,
    -33.3
   ],
   "scale": 0.9851,
   "rot_deg": 5.48,
   "shift": [
    8.7,
    -3.9
   ],
   "inliers": 79,
   "residual_px": 0.94,
   "ref_residual_px": {
    "eyeL": 3.0,
    "eyeR": 1.0,
    "nose": 2.8,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/gesture_s1_loop_22.png",
    "rect": [178, 218, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/gesture_s1_loop_22.png",
    "rect": [178, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/gesture_s1_loop_22_u.png",
    "rect": [311, 373, 225, 114]
   },
   "yield_eye_px": 5,
   "yield_px": 302,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -1.98,
     -0.8
    ],
    "eyeR": [
     -0.37,
     -0.56
    ],
    "mouth": [
     -1.33,
     1.0
    ]
   },
   "w": 1.0
  },
  "frames/gesture_s1_loop/23.png": {
   "m": [
    0.98488,
    0.07473,
    47.47,
    -27.72
   ],
   "scale": 0.9877,
   "rot_deg": 4.34,
   "shift": [
    6.5,
    -4.2
   ],
   "inliers": 79,
   "residual_px": 0.89,
   "ref_residual_px": {
    "eyeL": 3.0,
    "eyeR": 0.0,
    "mouth": 3.0,
    "nose": 1.4,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/gesture_s1_loop_23.png",
    "rect": [176, 218, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/gesture_s1_loop_23.png",
    "rect": [176, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/gesture_s1_loop_23_u.png",
    "rect": [308, 373, 224, 112]
   },
   "yield_eye_px": 0,
   "yield_px": 34,
   "cover_alien_px": 10,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -1.98,
     -0.8
    ],
    "eyeR": [
     -0.37,
     -0.56
    ],
    "mouth": [
     -1.33,
     0.92
    ]
   },
   "w": 1.0
  },
  "frames/gesture_s1_loop/24.png": {
   "m": [
    0.99373,
    0.06405,
    36.68,
    -26.75
   ],
   "scale": 0.9958,
   "rot_deg": 3.69,
   "shift": [
    4.3,
    -3.5
   ],
   "inliers": 85,
   "residual_px": 0.97,
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
    "file": "track_ink/gesture_s1_loop_24.png",
    "rect": [173, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/gesture_s1_loop_24.png",
    "rect": [173, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/gesture_s1_loop_24_u.png",
    "rect": [306, 374, 226, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 29,
   "cover_alien_px": 10,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.22,
     -1.36
    ],
    "eyeR": [
     0.3,
     -1.08
    ],
    "mouth": [
     -1.18,
     0.92
    ]
   },
   "w": 1.0
  },
  "frames/gesture_s1_loop/25.png": {
   "m": [
    0.99469,
    0.03462,
    20.22,
    -15.21
   ],
   "scale": 0.9953,
   "rot_deg": 1.99,
   "shift": [
    1.9,
    -3.5
   ],
   "inliers": 86,
   "residual_px": 0.9,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/gesture_s1_loop_25.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/gesture_s1_loop_25.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/gesture_s1_loop_25_u.png",
    "rect": [302, 376, 226, 107]
   },
   "yield_eye_px": 244,
   "yield_px": 465,
   "cover_alien_px": 1,
   "occluded": 0.014,
   "feat": {
    "eyeL": [
     -0.15,
     -1.36
    ],
    "eyeR": [
     0.3,
     -1.08
    ],
    "mouth": [
     -0.99,
     0.97
    ]
   },
   "w": 1.0
  },
  "frames/gesture_s1_loop/26.png": {
   "m": [
    0.99557,
    0.01986,
    11.45,
    -10.06
   ],
   "scale": 0.9958,
   "rot_deg": 1.14,
   "shift": [
    0.4,
    -4.0
   ],
   "inliers": 76,
   "residual_px": 0.91,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/gesture_s1_loop_26.png",
    "rect": [169, 218, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/gesture_s1_loop_26.png",
    "rect": [169, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/gesture_s1_loop_26_u.png",
    "rect": [300, 377, 228, 104]
   },
   "yield_eye_px": 11,
   "yield_px": 141,
   "cover_alien_px": 7,
   "occluded": 0.001,
   "feat": {
    "eyeL": [
     -0.11,
     -0.57
    ],
    "eyeR": [
     0.42,
     -0.73
    ],
    "mouth": [
     -0.8,
     1.02
    ]
   },
   "w": 1.0
  },
  "frames/gesture_s1_loop/27.png": {
   "m": [
    0.99702,
    -0.01031,
    -6.29,
    1.87
   ],
   "scale": 0.9971,
   "rot_deg": -0.59,
   "shift": [
    -2.7,
    -3.7
   ],
   "inliers": 96,
   "residual_px": 0.86,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/gesture_s1_loop_27.png",
    "rect": [166, 218, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/gesture_s1_loop_27.png",
    "rect": [166, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/gesture_s1_loop_27_u.png",
    "rect": [294, 377, 228, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 7,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.07,
     -0.08
    ],
    "eyeR": [
     0.42,
     -0.59
    ],
    "mouth": [
     -0.61,
     1.07
    ]
   },
   "w": 1.0
  },
  "frames/gesture_s1_loop/28.png": {
   "m": [
    0.99912,
    -0.02224,
    -14.17,
    6.1
   ],
   "scale": 0.9994,
   "rot_deg": -1.28,
   "shift": [
    -4.2,
    -3.4
   ],
   "inliers": 101,
   "residual_px": 0.83,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.4,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/gesture_s1_loop_28.png",
    "rect": [165, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/gesture_s1_loop_28.png",
    "rect": [165, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/gesture_s1_loop_28_u.png",
    "rect": [292, 376, 226, 107]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.15,
     0.13
    ],
    "eyeR": [
     0.42,
     -0.53
    ],
    "mouth": [
     -0.42,
     1.12
    ]
   },
   "w": 1.0
  },
  "frames/gesture_s1_loop/29.png": {
   "m": [
    0.99718,
    -0.04047,
    -24.04,
    14.23
   ],
   "scale": 0.998,
   "rot_deg": -2.32,
   "shift": [
    -6.4,
    -3.6
   ],
   "inliers": 86,
   "residual_px": 0.94,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 1.0,
    "nose": 1.4,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/gesture_s1_loop_29.png",
    "rect": [163, 218, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/gesture_s1_loop_29.png",
    "rect": [163, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/gesture_s1_loop_29_u.png",
    "rect": [289, 374, 227, 110]
   },
   "yield_eye_px": 0,
   "yield_px": 12,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.15,
     0.41
    ],
    "eyeR": [
     0.42,
     -0.32
    ],
    "mouth": [
     -0.23,
     1.17
    ]
   },
   "w": 1.0
  },
  "frames/gesture_s1_loop/30.png": {
   "m": [
    0.99196,
    -0.05609,
    -29.87,
    22.81
   ],
   "scale": 0.9935,
   "rot_deg": -3.24,
   "shift": [
    -7.1,
    -3.9
   ],
   "inliers": 68,
   "residual_px": 1.05,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.4,
    "nose": 1.4,
    "pin": 2.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/gesture_s1_loop_30.png",
    "rect": [162, 218, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/gesture_s1_loop_30.png",
    "rect": [162, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/gesture_s1_loop_30_u.png",
    "rect": [288, 373, 226, 112]
   },
   "yield_eye_px": 140,
   "yield_px": 158,
   "cover_alien_px": 3,
   "occluded": 0.008,
   "feat": {
    "eyeL": [
     0.01,
     0.41
    ],
    "eyeR": [
     0.24,
     -0.32
    ],
    "mouth": [
     -0.04,
     1.22
    ]
   },
   "w": 1.0
  },
  "frames/gesture_s1_loop/31.png": {
   "m": [
    0.99429,
    -0.05794,
    -32.41,
    24.23
   ],
   "scale": 0.996,
   "rot_deg": -3.34,
   "shift": [
    -7.8,
    -2.1
   ],
   "inliers": 67,
   "residual_px": 0.89,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "nose": 0.0,
    "pin": 1.4
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/gesture_s1_loop_31.png",
    "rect": [161, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/gesture_s1_loop_31.png",
    "rect": [161, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/gesture_s1_loop_31_u.png",
    "rect": [287, 375, 225, 112]
   },
   "yield_eye_px": 273,
   "yield_px": 354,
   "cover_alien_px": 2,
   "occluded": 0.016,
   "feat": {
    "eyeL": [
     -0.32,
     0.11
    ],
    "eyeR": [
     -0.16,
     -1.32
    ],
    "mouth": [
     0.15,
     1.27
    ]
   },
   "w": 1.0
  },
  "frames/gesture_s1_loop/32.png": {
   "m": [
    0.99661,
    -0.05979,
    -34.96,
    25.64
   ],
   "scale": 0.9984,
   "rot_deg": -3.43,
   "shift": [
    -8.5,
    -0.4
   ],
   "inliers": 65,
   "residual_px": 0.75,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 2.0,
    "nose": 1.4,
    "pin": 3.6
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/gesture_s1_loop_32.png",
    "rect": [160, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/gesture_s1_loop_32.png",
    "rect": [160, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/gesture_s1_loop_32_u.png",
    "rect": [286, 376, 225, 113]
   },
   "yield_eye_px": 322,
   "yield_px": 416,
   "cover_alien_px": 21,
   "occluded": 0.019,
   "feat": {
    "eyeL": [
     -0.32,
     -0.24
    ],
    "eyeR": [
     -0.16,
     -2.43
    ],
    "mouth": [
     0.34,
     1.32
    ]
   },
   "w": 1.0
  },
  "frames/gesture_s1_loop/33.png": {
   "m": [
    0.99893,
    -0.06166,
    -37.51,
    27.07
   ],
   "scale": 1.0008,
   "rot_deg": -3.53,
   "shift": [
    -9.3,
    1.4
   ],
   "inliers": 66,
   "residual_px": 0.87,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 3.0,
    "nose": 1.4,
    "pin": 2.8
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/gesture_s1_loop_33.png",
    "rect": [160, 223, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/gesture_s1_loop_33.png",
    "rect": [160, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/gesture_s1_loop_33_u.png",
    "rect": [285, 378, 225, 112]
   },
   "yield_eye_px": 329,
   "yield_px": 433,
   "cover_alien_px": 16,
   "occluded": 0.019,
   "feat": {
    "eyeL": [
     0.27,
     -0.24
    ],
    "eyeR": [
     -0.13,
     -2.43
    ],
    "mouth": [
     0.53,
     1.37
    ]
   },
   "w": 1.0
  },
  "frames/gesture_s1_loop/34.png": {
   "m": [
    1.00125,
    -0.06353,
    -40.06,
    28.49
   ],
   "scale": 1.0033,
   "rot_deg": -3.63,
   "shift": [
    -10.0,
    3.1
   ],
   "inliers": 51,
   "residual_px": 0.67,
   "ref_residual_px": {
    "eyeL": 3.6,
    "eyeR": 1.4,
    "nose": 3.6,
    "pin": 1.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/gesture_s1_loop_34.png",
    "rect": [159, 225, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/gesture_s1_loop_34.png",
    "rect": [159, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/gesture_s1_loop_34_u.png",
    "rect": [284, 379, 226, 113]
   },
   "yield_eye_px": 623,
   "yield_px": 971,
   "cover_alien_px": 0,
   "occluded": 0.036,
   "feat": {
    "eyeL": [
     0.77,
     2.59
    ],
    "eyeR": [
     -0.1,
     0.82
    ],
    "mouth": [
     0.72,
     1.42
    ]
   },
   "w": 1.0
  },
  "frames/gesture_s1_loop/35.png": {
   "m": [
    1.00253,
    -0.06233,
    -38.52,
    29.06
   ],
   "scale": 1.0045,
   "rot_deg": -3.56,
   "shift": [
    -8.5,
    4.8
   ],
   "inliers": 52,
   "residual_px": 0.66,
   "ref_residual_px": {
    "eyeL": 2.2,
    "eyeR": 0.0,
    "nose": 3.2,
    "pin": 1.4
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/gesture_s1_loop_35.png",
    "rect": [161, 227, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/gesture_s1_loop_35.png",
    "rect": [161, 227, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/gesture_s1_loop_35_u.png",
    "rect": [285, 381, 227, 113]
   },
   "yield_eye_px": 805,
   "yield_px": 1040,
   "cover_alien_px": 0,
   "occluded": 0.046,
   "feat": {
    "eyeL": [
     0.77,
     2.59
    ],
    "eyeR": [
     -0.02,
     0.82
    ],
    "mouth": [
     0.91,
     1.47
    ]
   },
   "w": 1.0
  },
  "frames/gesture_s1_loop/36.png": {
   "m": [
    1.0038,
    -0.06113,
    -36.98,
    29.62
   ],
   "scale": 1.0057,
   "rot_deg": -3.48,
   "shift": [
    -7.0,
    6.4
   ],
   "inliers": 56,
   "residual_px": 0.76,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 2.2,
    "nose": 1.4,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/gesture_s1_loop_36.png",
    "rect": [162, 228, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/gesture_s1_loop_36.png",
    "rect": [162, 228, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/gesture_s1_loop_36_u.png",
    "rect": [287, 382, 227, 113]
   },
   "yield_eye_px": 37,
   "yield_px": 285,
   "cover_alien_px": 0,
   "occluded": 0.002,
   "feat": {
    "eyeL": [
     0.76,
     0.23
    ],
    "eyeR": [
     -0.1,
     0.04
    ],
    "mouth": [
     0.91,
     1.47
    ]
   },
   "w": 1.0
  },
  "frames/gesture_s1_loop/37.png": {
   "m": [
    1.00164,
    -0.05482,
    -32.29,
    25.81
   ],
   "scale": 1.0031,
   "rot_deg": -3.13,
   "shift": [
    -6.1,
    4.2
   ],
   "inliers": 84,
   "residual_px": 0.79,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.4,
    "nose": 1.4,
    "pin": 0.0
   },
   "ok": true,
   "trackedFrom": "A",
   "maskInk": {
    "file": "track_ink/gesture_s1_loop_37.png",
    "rect": [163, 226, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/gesture_s1_loop_37.png",
    "rect": [163, 226, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/gesture_s1_loop_37_u.png",
    "rect": [288, 381, 226, 112]
   },
   "yield_eye_px": 0,
   "yield_px": 19,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.25,
     0.23
    ],
    "eyeR": [
     -0.1,
     0.04
    ],
    "mouth": [
     0.76,
     0.93
    ]
   },
   "w": 1.0
  },
  "frames/gesture_s1_loop/38.png": {
   "m": [
    0.99675,
    -0.04275,
    -22.53,
    18.96
   ],
   "scale": 0.9977,
   "rot_deg": -2.46,
   "shift": [
    -4.0,
    -0.0
   ],
   "inliers": 134,
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
    "file": "track_ink/gesture_s1_loop_38.png",
    "rect": [165, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/gesture_s1_loop_38.png",
    "rect": [165, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/gesture_s1_loop_38_u.png",
    "rect": [291, 378, 227, 110]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.22,
     0.34
    ],
    "eyeR": [
     -0.1,
     0.5
    ],
    "mouth": [
     -0.01,
     0.93
    ]
   },
   "w": 1.0
  },
  "frames/gesture_s1_loop/39.png": {
   "m": [
    0.99676,
    -0.03538,
    -18.7,
    15.02
   ],
   "scale": 0.9974,
   "rot_deg": -2.03,
   "shift": [
    -3.6,
    -0.9
   ],
   "inliers": 134,
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
    "file": "track_ink/gesture_s1_loop_39.png",
    "rect": [165, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/gesture_s1_loop_39.png",
    "rect": [165, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/gesture_s1_loop_39_u.png",
    "rect": [292, 378, 227, 108]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.22,
     0.34
    ],
    "eyeR": [
     0.22,
     0.5
    ],
    "mouth": [
     -0.01,
     0.93
    ]
   },
   "w": 1.0
  },
  "frames/gesture_s1_loop/40.png": {
   "m": [
    0.99769,
    -0.02569,
    -13.41,
    10.8
   ],
   "scale": 0.998,
   "rot_deg": -1.48,
   "shift": [
    -2.4,
    -0.8
   ],
   "inliers": 113,
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
    "file": "track_ink/gesture_s1_loop_40.png",
    "rect": [167, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/gesture_s1_loop_40.png",
    "rect": [167, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/gesture_s1_loop_40_u.png",
    "rect": [294, 378, 226, 108]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.0,
     0.16
    ],
    "eyeR": [
     0.25,
     0.29
    ],
    "mouth": [
     0.06,
     0.67
    ]
   },
   "w": 1.0
  },
  "frames/gesture_s1_loop/41.png": {
   "m": [
    0.99808,
    -0.01831,
    -9.58,
    7.82
   ],
   "scale": 0.9983,
   "rot_deg": -1.05,
   "shift": [
    -1.8,
    -0.6
   ],
   "inliers": 141,
   "residual_px": 0.78,
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
    "file": "track_ink/gesture_s1_loop_41.png",
    "rect": [167, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/gesture_s1_loop_41.png",
    "rect": [167, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/gesture_s1_loop_41_u.png",
    "rect": [295, 379, 227, 107]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     0.0,
     0.16
    ],
    "eyeR": [
     0.25,
     0.25
    ],
    "mouth": [
     0.06,
     0.61
    ]
   },
   "w": 1.0
  },
  "frames/gesture_s1_loop/42.png": {
   "m": [
    0.99969,
    -0.00885,
    -4.95,
    3.65
   ],
   "scale": 0.9997,
   "rot_deg": -0.51,
   "shift": [
    -1.0,
    -0.1
   ],
   "inliers": 178,
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
    "file": "track_ink/gesture_s1_loop_42.png",
    "rect": [168, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/gesture_s1_loop_42.png",
    "rect": [168, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/gesture_s1_loop_42_u.png",
    "rect": [296, 380, 227, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.04,
     0.18
    ],
    "eyeR": [
     0.0,
     0.09
    ],
    "mouth": [
     -0.05,
     0.22
    ]
   },
   "w": 1.0
  },
  "frames/gesture_s1_loop/43.png": {
   "m": [
    1.00033,
    -0.00473,
    -2.99,
    1.78
   ],
   "scale": 1.0003,
   "rot_deg": -0.27,
   "shift": [
    -0.6,
    0.0
   ],
   "inliers": 178,
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
    "file": "track_ink/gesture_s1_loop_43.png",
    "rect": [168, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/gesture_s1_loop_43.png",
    "rect": [168, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/gesture_s1_loop_43_u.png",
    "rect": [296, 381, 226, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.1,
     0.18
    ],
    "eyeR": [
     -0.06,
     0.05
    ],
    "mouth": [
     -0.05,
     0.18
    ]
   },
   "w": 1.0
  },
  "frames/gesture_s1_loop/44.png": {
   "m": [
    0.9998,
    -0.00395,
    -1.93,
    1.84
   ],
   "scale": 0.9998,
   "rot_deg": -0.23,
   "shift": [
    -0.2,
    0.1
   ],
   "inliers": 175,
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
    "file": "track_ink/gesture_s1_loop_44.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/gesture_s1_loop_44.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/gesture_s1_loop_44_u.png",
    "rect": [297, 381, 225, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.12,
     0.06
    ],
    "eyeR": [
     -0.07,
     0.02
    ],
    "mouth": [
     -0.04,
     0.1
    ]
   },
   "w": 1.0
  },
  "frames/gesture_s1_loop/45.png": {
   "m": [
    1.00005,
    -0.00029,
    -0.33,
    0.24
   ],
   "scale": 1.0,
   "rot_deg": -0.02,
   "shift": [
    -0.2,
    0.1
   ],
   "inliers": 174,
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
    "file": "track_ink/gesture_s1_loop_45.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/gesture_s1_loop_45.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/gesture_s1_loop_45_u.png",
    "rect": [297, 381, 227, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.12,
     0.03
    ],
    "eyeR": [
     -0.08,
     -0.06
    ],
    "mouth": [
     -0.04,
     0.1
    ]
   },
   "w": 1.0
  },
  "frames/gesture_s1_loop/46.png": {
   "m": [
    1.00016,
    -0.00018,
    -0.26,
    0.11
   ],
   "scale": 1.0002,
   "rot_deg": -0.01,
   "shift": [
    -0.1,
    0.1
   ],
   "inliers": 179,
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
    "file": "track_ink/gesture_s1_loop_46.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/gesture_s1_loop_46.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/gesture_s1_loop_46_u.png",
    "rect": [297, 381, 225, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.11,
     0.03
    ],
    "eyeR": [
     -0.08,
     -0.06
    ],
    "mouth": [
     -0.02,
     0.08
    ]
   },
   "w": 1.0
  },
  "frames/gesture_s1_loop/47.png": {
   "m": [
    1.00019,
    -0.00011,
    -0.18,
    0.04
   ],
   "scale": 1.0002,
   "rot_deg": -0.01,
   "shift": [
    -0.0,
    0.1
   ],
   "inliers": 184,
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
    "file": "track_ink/gesture_s1_loop_47.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/gesture_s1_loop_47.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/gesture_s1_loop_47_u.png",
    "rect": [297, 381, 227, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "feat": {
    "eyeL": [
     -0.06,
     0.0
    ],
    "eyeR": [
     -0.04,
     -0.02
    ],
    "mouth": [
     0.0,
     0.06
    ]
   },
   "w": 1.0
  },
  "frames/gesture_s1_loop/48.png": {
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
    "file": "track_ink/gesture_s1_loop_48.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/gesture_s1_loop_48.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/gesture_s1_loop_48_u.png",
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
  "frames/stepbeat_s1_loop/00.png": {
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
    "file": "track_ink/stepbeat_s1_loop_00.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_00.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_00_u.png",
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
  "frames/stepbeat_s1_loop/01.png": {
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
    "file": "track_ink/stepbeat_s1_loop_01.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_01.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_01_u.png",
    "rect": [297, 381, 225, 104]
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
  "frames/stepbeat_s1_loop/02.png": {
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
    "file": "track_ink/stepbeat_s1_loop_02.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_02.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_02_u.png",
    "rect": [297, 381, 225, 104]
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
  "frames/stepbeat_s1_loop/03.png": {
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
    "file": "track_ink/stepbeat_s1_loop_03.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_03.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_03_u.png",
    "rect": [297, 381, 225, 104]
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
  "frames/stepbeat_s1_loop/04.png": {
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
    "file": "track_ink/stepbeat_s1_loop_04.png",
    "rect": [167, 227, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_04.png",
    "rect": [167, 227, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_04_u.png",
    "rect": [295, 385, 225, 105]
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
  "frames/stepbeat_s1_loop/05.png": {
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
    "file": "track_ink/stepbeat_s1_loop_05.png",
    "rect": [164, 231, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_05.png",
    "rect": [164, 231, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_05_u.png",
    "rect": [292, 389, 226, 105]
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
  "frames/stepbeat_s1_loop/06.png": {
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
    "file": "track_ink/stepbeat_s1_loop_06.png",
    "rect": [159, 239, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_06.png",
    "rect": [159, 239, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_06_u.png",
    "rect": [287, 397, 225, 107]
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
  "frames/stepbeat_s1_loop/07.png": {
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
    "file": "track_ink/stepbeat_s1_loop_07.png",
    "rect": [158, 243, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_07.png",
    "rect": [158, 243, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_07_u.png",
    "rect": [285, 400, 225, 107]
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
  "frames/stepbeat_s1_loop/08.png": {
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
    "file": "track_ink/stepbeat_s1_loop_08.png",
    "rect": [158, 244, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_08.png",
    "rect": [158, 244, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_08_u.png",
    "rect": [285, 402, 227, 106]
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
  "frames/stepbeat_s1_loop/09.png": {
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
    "file": "track_ink/stepbeat_s1_loop_09.png",
    "rect": [162, 243, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_09.png",
    "rect": [162, 243, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_09_u.png",
    "rect": [290, 401, 226, 105]
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
  "frames/stepbeat_s1_loop/10.png": {
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
    "file": "track_ink/stepbeat_s1_loop_10.png",
    "rect": [172, 233, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_10.png",
    "rect": [172, 233, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_10_u.png",
    "rect": [300, 391, 228, 105]
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
  "frames/stepbeat_s1_loop/11.png": {
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
    "file": "track_ink/stepbeat_s1_loop_11.png",
    "rect": [179, 228, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_11.png",
    "rect": [179, 228, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_11_u.png",
    "rect": [308, 387, 226, 105]
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
  "frames/stepbeat_s1_loop/12.png": {
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
    "file": "track_ink/stepbeat_s1_loop_12.png",
    "rect": [188, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_12.png",
    "rect": [188, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_12_u.png",
    "rect": [317, 379, 227, 107]
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
  "frames/stepbeat_s1_loop/13.png": {
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
    "file": "track_ink/stepbeat_s1_loop_13.png",
    "rect": [191, 218, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_13.png",
    "rect": [191, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_13_u.png",
    "rect": [322, 375, 226, 108]
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
  "frames/stepbeat_s1_loop/14.png": {
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
    "file": "track_ink/stepbeat_s1_loop_14.png",
    "rect": [197, 213, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_14.png",
    "rect": [197, 213, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_14_u.png",
    "rect": [328, 370, 226, 109]
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
  "frames/stepbeat_s1_loop/15.png": {
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
    "file": "track_ink/stepbeat_s1_loop_15.png",
    "rect": [189, 216, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_15.png",
    "rect": [189, 216, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_15_u.png",
    "rect": [320, 373, 226, 108]
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
  "frames/stepbeat_s1_loop/16.png": {
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
    "file": "track_ink/stepbeat_s1_loop_16.png",
    "rect": [181, 224, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_16.png",
    "rect": [181, 224, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_16_u.png",
    "rect": [310, 383, 228, 104]
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
  "frames/stepbeat_s1_loop/17.png": {
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
    "file": "track_ink/stepbeat_s1_loop_17.png",
    "rect": [168, 234, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_17.png",
    "rect": [168, 234, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_17_u.png",
    "rect": [296, 393, 227, 105]
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
  "frames/stepbeat_s1_loop/18.png": {
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
    "file": "track_ink/stepbeat_s1_loop_18.png",
    "rect": [164, 235, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_18.png",
    "rect": [164, 235, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_18_u.png",
    "rect": [292, 393, 226, 106]
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
  "frames/stepbeat_s1_loop/19.png": {
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
    "file": "track_ink/stepbeat_s1_loop_19.png",
    "rect": [158, 228, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_19.png",
    "rect": [158, 228, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_19_u.png",
    "rect": [285, 385, 227, 107]
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
  "frames/stepbeat_s1_loop/20.png": {
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
    "file": "track_ink/stepbeat_s1_loop_20.png",
    "rect": [157, 226, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_20.png",
    "rect": [157, 226, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_20_u.png",
    "rect": [284, 382, 228, 109]
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
  "frames/stepbeat_s1_loop/21.png": {
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
    "file": "track_ink/stepbeat_s1_loop_21.png",
    "rect": [168, 228, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_21.png",
    "rect": [168, 228, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_21_u.png",
    "rect": [295, 386, 229, 105]
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
  "frames/stepbeat_s1_loop/22.png": {
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
    "file": "track_ink/stepbeat_s1_loop_22.png",
    "rect": [174, 225, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_22.png",
    "rect": [174, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_22_u.png",
    "rect": [304, 383, 226, 105]
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
  "frames/stepbeat_s1_loop/23.png": {
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
    "file": "track_ink/stepbeat_s1_loop_23.png",
    "rect": [183, 215, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_23.png",
    "rect": [183, 215, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_23_u.png",
    "rect": [312, 373, 226, 106]
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
  "frames/stepbeat_s1_loop/24.png": {
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
    "file": "track_ink/stepbeat_s1_loop_24.png",
    "rect": [184, 212, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_24.png",
    "rect": [184, 212, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_24_u.png",
    "rect": [314, 370, 226, 107]
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
  "frames/stepbeat_s1_loop/25.png": {
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
    "file": "track_ink/stepbeat_s1_loop_25.png",
    "rect": [179, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_25.png",
    "rect": [179, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_25_u.png",
    "rect": [310, 379, 226, 104]
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
  "frames/stepbeat_s1_loop/26.png": {
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
    "file": "track_ink/stepbeat_s1_loop_26.png",
    "rect": [173, 227, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_26.png",
    "rect": [173, 227, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_26_u.png",
    "rect": [302, 387, 228, 103]
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
  "frames/stepbeat_s1_loop/27.png": {
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
    "file": "track_ink/stepbeat_s1_loop_27.png",
    "rect": [163, 233, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_27.png",
    "rect": [163, 233, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_27_u.png",
    "rect": [292, 391, 226, 106]
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
  "frames/stepbeat_s1_loop/28.png": {
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
    "file": "track_ink/stepbeat_s1_loop_28.png",
    "rect": [159, 231, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_28.png",
    "rect": [159, 231, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_28_u.png",
    "rect": [287, 390, 226, 106]
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
  "frames/stepbeat_s1_loop/29.png": {
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
    "file": "track_ink/stepbeat_s1_loop_29.png",
    "rect": [152, 231, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_29.png",
    "rect": [152, 231, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_29_u.png",
    "rect": [280, 388, 226, 108]
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
  "frames/stepbeat_s1_loop/30.png": {
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
    "file": "track_ink/stepbeat_s1_loop_30.png",
    "rect": [150, 229, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_30.png",
    "rect": [150, 229, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_30_u.png",
    "rect": [277, 385, 227, 109]
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
  "frames/stepbeat_s1_loop/31.png": {
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
    "file": "track_ink/stepbeat_s1_loop_31.png",
    "rect": [149, 217, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_31.png",
    "rect": [149, 217, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_31_u.png",
    "rect": [276, 373, 228, 110]
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
  "frames/stepbeat_s1_loop/32.png": {
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
    "file": "track_ink/stepbeat_s1_loop_32.png",
    "rect": [152, 209, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_32.png",
    "rect": [152, 209, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_32_u.png",
    "rect": [278, 365, 228, 109]
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
  "frames/stepbeat_s1_loop/33.png": {
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
    "file": "track_ink/stepbeat_s1_loop_33.png",
    "rect": [153, 207, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_33.png",
    "rect": [153, 207, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_33_u.png",
    "rect": [280, 363, 228, 109]
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
  "frames/stepbeat_s1_loop/34.png": {
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
    "file": "track_ink/stepbeat_s1_loop_34.png",
    "rect": [158, 202, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_34.png",
    "rect": [158, 202, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_34_u.png",
    "rect": [285, 359, 227, 108]
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
  "frames/stepbeat_s1_loop/35.png": {
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
    "file": "track_ink/stepbeat_s1_loop_35.png",
    "rect": [160, 200, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_35.png",
    "rect": [160, 200, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_35_u.png",
    "rect": [287, 357, 227, 107]
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
  "frames/stepbeat_s1_loop/36.png": {
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
    "file": "track_ink/stepbeat_s1_loop_36.png",
    "rect": [164, 204, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_36.png",
    "rect": [164, 204, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_36_u.png",
    "rect": [291, 362, 227, 106]
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
  "frames/stepbeat_s1_loop/37.png": {
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
    "file": "track_ink/stepbeat_s1_loop_37.png",
    "rect": [165, 210, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_37.png",
    "rect": [165, 210, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_37_u.png",
    "rect": [293, 368, 225, 106]
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
  "frames/stepbeat_s1_loop/38.png": {
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
    "file": "track_ink/stepbeat_s1_loop_38.png",
    "rect": [166, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_38.png",
    "rect": [166, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_38_u.png",
    "rect": [294, 381, 226, 105]
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
  "frames/stepbeat_s1_loop/39.png": {
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
    "file": "track_ink/stepbeat_s1_loop_39.png",
    "rect": [167, 228, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_39.png",
    "rect": [167, 228, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_39_u.png",
    "rect": [294, 387, 226, 105]
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
  "frames/stepbeat_s1_loop/40.png": {
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
    "file": "track_ink/stepbeat_s1_loop_40.png",
    "rect": [168, 233, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_40.png",
    "rect": [168, 233, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_40_u.png",
    "rect": [295, 392, 227, 104]
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
  "frames/stepbeat_s1_loop/41.png": {
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
    "file": "track_ink/stepbeat_s1_loop_41.png",
    "rect": [168, 232, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_41.png",
    "rect": [168, 232, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_41_u.png",
    "rect": [296, 391, 226, 104]
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
  "frames/stepbeat_s1_loop/42.png": {
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
    "file": "track_ink/stepbeat_s1_loop_42.png",
    "rect": [168, 228, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_42.png",
    "rect": [168, 228, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_42_u.png",
    "rect": [296, 387, 226, 104]
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
  "frames/stepbeat_s1_loop/43.png": {
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
    "file": "track_ink/stepbeat_s1_loop_43.png",
    "rect": [169, 226, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_43.png",
    "rect": [169, 226, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_43_u.png",
    "rect": [297, 385, 225, 104]
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
  "frames/stepbeat_s1_loop/44.png": {
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
    "file": "track_ink/stepbeat_s1_loop_44.png",
    "rect": [169, 223, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_44.png",
    "rect": [169, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_44_u.png",
    "rect": [297, 382, 225, 104]
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
  "frames/stepbeat_s1_loop/45.png": {
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
    "file": "track_ink/stepbeat_s1_loop_45.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_45.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_45_u.png",
    "rect": [297, 381, 225, 104]
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
  "frames/stepbeat_s1_loop/46.png": {
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
    "file": "track_ink/stepbeat_s1_loop_46.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_46.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_46_u.png",
    "rect": [297, 381, 225, 104]
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
  "frames/stepbeat_s1_loop/47.png": {
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
    "file": "track_ink/stepbeat_s1_loop_47.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_47.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_47_u.png",
    "rect": [297, 381, 225, 104]
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
  "frames/stepbeat_s1_loop/48.png": {
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
    "file": "track_ink/stepbeat_s1_loop_48.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/stepbeat_s1_loop_48.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/stepbeat_s1_loop_48_u.png",
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
