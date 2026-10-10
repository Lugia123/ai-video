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
  "hips_s1_fix_loop": {
   "label": "叉腰·s1·修嘴",
   "from": "idle",
   "to": "idle",
   "fps": 16,
   "frames": [
    "frames/hips_s1_fix_loop/00.png",
    "frames/hips_s1_fix_loop/01.png",
    "frames/hips_s1_fix_loop/02.png",
    "frames/hips_s1_fix_loop/03.png",
    "frames/hips_s1_fix_loop/04.png",
    "frames/hips_s1_fix_loop/05.png",
    "frames/hips_s1_fix_loop/06.png",
    "frames/hips_s1_fix_loop/07.png",
    "frames/hips_s1_fix_loop/08.png",
    "frames/hips_s1_fix_loop/09.png",
    "frames/hips_s1_fix_loop/10.png",
    "frames/hips_s1_fix_loop/11.png",
    "frames/hips_s1_fix_loop/12.png",
    "frames/hips_s1_fix_loop/13.png",
    "frames/hips_s1_fix_loop/14.png",
    "frames/hips_s1_fix_loop/15.png",
    "frames/hips_s1_fix_loop/16.png",
    "frames/hips_s1_fix_loop/17.png",
    "frames/hips_s1_fix_loop/18.png",
    "frames/hips_s1_fix_loop/19.png",
    "frames/hips_s1_fix_loop/20.png",
    "frames/hips_s1_fix_loop/21.png",
    "frames/hips_s1_fix_loop/22.png",
    "frames/hips_s1_fix_loop/23.png",
    "frames/hips_s1_fix_loop/24.png",
    "frames/hips_s1_fix_loop/25.png",
    "frames/hips_s1_fix_loop/26.png",
    "frames/hips_s1_fix_loop/27.png",
    "frames/hips_s1_fix_loop/28.png",
    "frames/hips_s1_fix_loop/29.png",
    "frames/hips_s1_fix_loop/30.png",
    "frames/hips_s1_fix_loop/31.png",
    "frames/hips_s1_fix_loop/32.png",
    "frames/hips_s1_fix_loop/33.png",
    "frames/hips_s1_fix_loop/34.png",
    "frames/hips_s1_fix_loop/35.png",
    "frames/hips_s1_fix_loop/36.png",
    "frames/hips_s1_fix_loop/37.png",
    "frames/hips_s1_fix_loop/38.png",
    "frames/hips_s1_fix_loop/39.png",
    "frames/hips_s1_fix_loop/40.png",
    "frames/hips_s1_fix_loop/41.png",
    "frames/hips_s1_fix_loop/42.png",
    "frames/hips_s1_fix_loop/43.png",
    "frames/hips_s1_fix_loop/44.png",
    "frames/hips_s1_fix_loop/45.png",
    "frames/hips_s1_fix_loop/46.png",
    "frames/hips_s1_fix_loop/47.png",
    "frames/hips_s1_fix_loop/48.png"
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
   "id": "hips_s1_fix",
   "label": "叉腰·s1·修嘴",
   "in": "hips_s1_fix_loop",
   "oneshot": true,
   "group": "hips_s1_fix"
  }
 ],
 "minMargin": {
  "left": 178,
  "top": 130,
  "right": 178,
  "bottom": 104,
  "min": 104
 },
 "faceMode": "ink",
 "headTracks": {
  "frames/hips_s1_fix_loop/00.png": {
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
    "file": "track_ink/hips_s1_fix_loop_00.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_00.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_00_u.png",
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
  "frames/hips_s1_fix_loop/01.png": {
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
    "file": "track_ink/hips_s1_fix_loop_01.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_01.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_01_u.png",
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
  "frames/hips_s1_fix_loop/02.png": {
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
    "file": "track_ink/hips_s1_fix_loop_02.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_02.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_02_u.png",
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
  "frames/hips_s1_fix_loop/03.png": {
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
    "file": "track_ink/hips_s1_fix_loop_03.png",
    "rect": [169, 223, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_03.png",
    "rect": [169, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_03_u.png",
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
  "frames/hips_s1_fix_loop/04.png": {
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
    "file": "track_ink/hips_s1_fix_loop_04.png",
    "rect": [169, 230, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_04.png",
    "rect": [169, 230, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_04_u.png",
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
  "frames/hips_s1_fix_loop/05.png": {
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
    "file": "track_ink/hips_s1_fix_loop_05.png",
    "rect": [170, 235, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_05.png",
    "rect": [170, 235, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_05_u.png",
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
  "frames/hips_s1_fix_loop/06.png": {
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
    "file": "track_ink/hips_s1_fix_loop_06.png",
    "rect": [170, 242, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_06.png",
    "rect": [170, 242, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_06_u.png",
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
  "frames/hips_s1_fix_loop/07.png": {
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
    "file": "track_ink/hips_s1_fix_loop_07.png",
    "rect": [170, 237, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_07.png",
    "rect": [170, 237, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_07_u.png",
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
  "frames/hips_s1_fix_loop/08.png": {
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
    "file": "track_ink/hips_s1_fix_loop_08.png",
    "rect": [169, 227, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_08.png",
    "rect": [169, 227, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_08_u.png",
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
  "frames/hips_s1_fix_loop/09.png": {
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
    "file": "track_ink/hips_s1_fix_loop_09.png",
    "rect": [168, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_09.png",
    "rect": [168, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_09_u.png",
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
  "frames/hips_s1_fix_loop/10.png": {
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
    "file": "track_ink/hips_s1_fix_loop_10.png",
    "rect": [169, 214, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_10.png",
    "rect": [169, 214, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_10_u.png",
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
  "frames/hips_s1_fix_loop/11.png": {
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
    "file": "track_ink/hips_s1_fix_loop_11.png",
    "rect": [169, 211, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_11.png",
    "rect": [169, 211, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_11_u.png",
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
  "frames/hips_s1_fix_loop/12.png": {
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
    "file": "track_ink/hips_s1_fix_loop_12.png",
    "rect": [171, 210, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_12.png",
    "rect": [171, 210, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_12_u.png",
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
  "frames/hips_s1_fix_loop/13.png": {
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
    "file": "track_ink/hips_s1_fix_loop_13.png",
    "rect": [172, 211, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_13.png",
    "rect": [172, 211, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_13_u.png",
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
  "frames/hips_s1_fix_loop/14.png": {
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
    "file": "track_ink/hips_s1_fix_loop_14.png",
    "rect": [172, 216, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_14.png",
    "rect": [172, 216, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_14_u.png",
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
  "frames/hips_s1_fix_loop/15.png": {
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
    "file": "track_ink/hips_s1_fix_loop_15.png",
    "rect": [172, 218, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_15.png",
    "rect": [172, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_15_u.png",
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
  "frames/hips_s1_fix_loop/16.png": {
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
    "file": "track_ink/hips_s1_fix_loop_16.png",
    "rect": [173, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_16.png",
    "rect": [173, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_16_u.png",
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
  "frames/hips_s1_fix_loop/17.png": {
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
    "file": "track_ink/hips_s1_fix_loop_17.png",
    "rect": [171, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_17.png",
    "rect": [171, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_17_u.png",
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
  "frames/hips_s1_fix_loop/18.png": {
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
    "file": "track_ink/hips_s1_fix_loop_18.png",
    "rect": [171, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_18.png",
    "rect": [171, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_18_u.png",
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
  "frames/hips_s1_fix_loop/19.png": {
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
    "file": "track_ink/hips_s1_fix_loop_19.png",
    "rect": [171, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_19.png",
    "rect": [171, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_19_u.png",
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
  "frames/hips_s1_fix_loop/20.png": {
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
    "file": "track_ink/hips_s1_fix_loop_20.png",
    "rect": [171, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_20.png",
    "rect": [171, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_20_u.png",
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
  "frames/hips_s1_fix_loop/21.png": {
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
    "file": "track_ink/hips_s1_fix_loop_21.png",
    "rect": [171, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_21.png",
    "rect": [171, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_21_u.png",
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
  "frames/hips_s1_fix_loop/22.png": {
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
    "file": "track_ink/hips_s1_fix_loop_22.png",
    "rect": [171, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_22.png",
    "rect": [171, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_22_u.png",
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
  "frames/hips_s1_fix_loop/23.png": {
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
    "file": "track_ink/hips_s1_fix_loop_23.png",
    "rect": [171, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_23.png",
    "rect": [171, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_23_u.png",
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
  "frames/hips_s1_fix_loop/24.png": {
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
    "file": "track_ink/hips_s1_fix_loop_24.png",
    "rect": [171, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_24.png",
    "rect": [171, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_24_u.png",
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
  "frames/hips_s1_fix_loop/25.png": {
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
    "file": "track_ink/hips_s1_fix_loop_25.png",
    "rect": [171, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_25.png",
    "rect": [171, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_25_u.png",
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
  "frames/hips_s1_fix_loop/26.png": {
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
    "file": "track_ink/hips_s1_fix_loop_26.png",
    "rect": [170, 219, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_26.png",
    "rect": [170, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_26_u.png",
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
  "frames/hips_s1_fix_loop/27.png": {
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
    "file": "track_ink/hips_s1_fix_loop_27.png",
    "rect": [170, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_27.png",
    "rect": [170, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_27_u.png",
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
  "frames/hips_s1_fix_loop/28.png": {
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
    "file": "track_ink/hips_s1_fix_loop_28.png",
    "rect": [170, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_28.png",
    "rect": [170, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_28_u.png",
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
  "frames/hips_s1_fix_loop/29.png": {
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
    "file": "track_ink/hips_s1_fix_loop_29.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_29.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_29_u.png",
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
  "frames/hips_s1_fix_loop/30.png": {
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
    "file": "track_ink/hips_s1_fix_loop_30.png",
    "rect": [168, 220, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_30.png",
    "rect": [168, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_30_u.png",
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
  "frames/hips_s1_fix_loop/31.png": {
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
    "file": "track_ink/hips_s1_fix_loop_31.png",
    "rect": [167, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_31.png",
    "rect": [167, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_31_u.png",
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
  "frames/hips_s1_fix_loop/32.png": {
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
    "file": "track_ink/hips_s1_fix_loop_32.png",
    "rect": [166, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_32.png",
    "rect": [166, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_32_u.png",
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
  "frames/hips_s1_fix_loop/33.png": {
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
    "file": "track_ink/hips_s1_fix_loop_33.png",
    "rect": [166, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_33.png",
    "rect": [166, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_33_u.png",
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
  "frames/hips_s1_fix_loop/34.png": {
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
    "file": "track_ink/hips_s1_fix_loop_34.png",
    "rect": [167, 228, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_34.png",
    "rect": [167, 228, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_34_u.png",
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
  "frames/hips_s1_fix_loop/35.png": {
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
    "file": "track_ink/hips_s1_fix_loop_35.png",
    "rect": [167, 231, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_35.png",
    "rect": [167, 231, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_35_u.png",
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
  "frames/hips_s1_fix_loop/36.png": {
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
    "file": "track_ink/hips_s1_fix_loop_36.png",
    "rect": [170, 238, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_36.png",
    "rect": [170, 238, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_36_u.png",
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
  "frames/hips_s1_fix_loop/37.png": {
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
    "file": "track_ink/hips_s1_fix_loop_37.png",
    "rect": [170, 236, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_37.png",
    "rect": [170, 236, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_37_u.png",
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
  "frames/hips_s1_fix_loop/38.png": {
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
    "file": "track_ink/hips_s1_fix_loop_38.png",
    "rect": [169, 226, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_38.png",
    "rect": [169, 226, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_38_u.png",
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
  "frames/hips_s1_fix_loop/39.png": {
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
    "file": "track_ink/hips_s1_fix_loop_39.png",
    "rect": [168, 223, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_39.png",
    "rect": [168, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_39_u.png",
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
  "frames/hips_s1_fix_loop/40.png": {
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
    "file": "track_ink/hips_s1_fix_loop_40.png",
    "rect": [168, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_40.png",
    "rect": [168, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_40_u.png",
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
  "frames/hips_s1_fix_loop/41.png": {
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
    "file": "track_ink/hips_s1_fix_loop_41.png",
    "rect": [168, 221, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_41.png",
    "rect": [168, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_41_u.png",
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
  "frames/hips_s1_fix_loop/42.png": {
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
    "file": "track_ink/hips_s1_fix_loop_42.png",
    "rect": [168, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_42.png",
    "rect": [168, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_42_u.png",
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
  "frames/hips_s1_fix_loop/43.png": {
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
    "file": "track_ink/hips_s1_fix_loop_43.png",
    "rect": [168, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_43.png",
    "rect": [168, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_43_u.png",
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
  "frames/hips_s1_fix_loop/44.png": {
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
    "file": "track_ink/hips_s1_fix_loop_44.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_44.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_44_u.png",
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
  "frames/hips_s1_fix_loop/45.png": {
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
    "file": "track_ink/hips_s1_fix_loop_45.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_45.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_45_u.png",
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
  "frames/hips_s1_fix_loop/46.png": {
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
    "file": "track_ink/hips_s1_fix_loop_46.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_46.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_46_u.png",
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
  "frames/hips_s1_fix_loop/47.png": {
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
    "file": "track_ink/hips_s1_fix_loop_47.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_47.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_47_u.png",
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
  "frames/hips_s1_fix_loop/48.png": {
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
    "file": "track_ink/hips_s1_fix_loop_48.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "base",
     "top"
    ]
   },
   "mask": {
    "file": "track/hips_s1_fix_loop_48.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/hips_s1_fix_loop_48_u.png",
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
