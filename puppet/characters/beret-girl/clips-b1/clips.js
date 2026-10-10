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
 "rest": "idle",
 "moveSeconds": 0.8,
 "poses": {
  "idle": {
   "label": "归位（待机）",
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
     "residual_px": 0.79
    },
    "mouth": {
     "closed": {
      "file": "patches/idle/mouth_closed.png",
      "rect": [371, 470, 81, 57],
      "color_shift_rgb": [
       4.0,
       8.0,
       11.0
      ],
      "skin_samples": 992,
      "occluded_px": 0
     },
     "small": {
      "file": "patches/idle/mouth_small.png",
      "rect": [371, 470, 81, 57],
      "color_shift_rgb": [
       4.0,
       8.0,
       11.0
      ],
      "skin_samples": 992,
      "occluded_px": 0
     },
     "big": {
      "file": "patches/idle/mouth_big.png",
      "rect": [371, 470, 81, 57],
      "color_shift_rgb": [
       4.0,
       8.0,
       11.0
      ],
      "skin_samples": 992,
      "occluded_px": 0
     },
     "smile": {
      "file": "patches/idle/mouth_smile.png",
      "rect": [371, 470, 81, 57],
      "color_shift_rgb": [
       4.0,
       8.0,
       11.0
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
     "skin_samples": 2044,
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
     "skin_samples": 3223,
     "occluded_px": 0
    },
    "face": {
     "angry": {
      "blush": {
       "file": "patches/idle/face_angry_blush.png",
       "rect": [300, 446, 224, 83],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/idle/face_angry_eyes.png",
       "rect": [297, 383, 232, 98],
       "color_shift_rgb": [
        -1.1,
        7.0,
        11.3
       ]
      },
      "mouth": {
       "file": "patches/idle/face_angry_mouth.png",
       "rect": [363, 464, 102, 63],
       "color_shift_rgb": [
        -0.0,
        6.8,
        10.3
       ]
      },
      "brow": {
       "file": "patches/idle/face_angry_brow.png",
       "rect": [326, 371, 179, 36],
       "color_shift_rgb": [
        -1.2,
        4.2,
        8.4
       ]
      }
     },
     "awkward": {
      "blush": {
       "file": "patches/idle/face_awkward_blush.png",
       "rect": [300, 446, 224, 83],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/idle/face_awkward_eyes.png",
       "rect": [297, 383, 232, 95],
       "color_shift_rgb": [
        -1.8,
        6.0,
        8.3
       ]
      },
      "mouth": {
       "file": "patches/idle/face_awkward_mouth.png",
       "rect": [371, 470, 81, 57],
       "color_shift_rgb": [
        -0.7,
        5.4,
        7.5
       ]
      },
      "brow": {
       "file": "patches/idle/face_awkward_brow.png",
       "rect": [318, 380, 181, 22],
       "color_shift_rgb": [
        -1.9,
        3.2,
        6.2
       ]
      }
     },
     "doubt": {
      "blush": {
       "file": "patches/idle/face_doubt_blush.png",
       "rect": [300, 446, 224, 83],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/idle/face_doubt_eyes.png",
       "rect": [297, 382, 232, 98],
       "color_shift_rgb": [
        -1.3,
        5.9,
        9.1
       ]
      },
      "mouth": {
       "file": "patches/idle/face_doubt_mouth.png",
       "rect": [371, 470, 81, 57],
       "color_shift_rgb": [
        0.0,
        6.0,
        9.7
       ]
      },
      "brow": {
       "file": "patches/idle/face_doubt_brow.png",
       "rect": [326, 373, 170, 27],
       "color_shift_rgb": [
        -1.7,
        4.0,
        8.0
       ]
      }
     },
     "flat": {
      "blush": {
       "file": "patches/idle/face_flat_blush.png",
       "rect": [300, 446, 224, 83],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/idle/face_flat_eyes.png",
       "rect": [297, 382, 232, 99],
       "color_shift_rgb": [
        -0.9,
        8.3,
        11.0
       ]
      },
      "mouth": {
       "file": "patches/idle/face_flat_mouth.png",
       "rect": [371, 470, 81, 57],
       "color_shift_rgb": [
        0.0,
        5.6,
        9.6
       ]
      },
      "brow": {
       "file": "patches/idle/face_flat_brow.png",
       "rect": [314, 377, 197, 21],
       "color_shift_rgb": [
        -1.0,
        3.4,
        7.3
       ]
      }
     },
     "happy": {
      "eyes": {
       "file": "patches/idle/face_happy_eyes.png",
       "rect": [297, 382, 232, 98],
       "color_shift_rgb": [
        -1.9,
        7.0,
        9.2
       ]
      },
      "mouth": {
       "file": "patches/idle/face_happy_mouth.png",
       "rect": [370, 458, 87, 73],
       "color_shift_rgb": [
        -0.7,
        6.0,
        8.4
       ]
      }
     },
     "love": {
      "blush": {
       "file": "patches/idle/face_love_blush.png",
       "rect": [300, 446, 224, 83],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/idle/face_love_eyes.png",
       "rect": [297, 383, 232, 102],
       "color_shift_rgb": [
        -1.3,
        7.0,
        10.2
       ]
      },
      "mouth": {
       "file": "patches/idle/face_love_mouth.png",
       "rect": [371, 470, 81, 57],
       "color_shift_rgb": [
        -0.9,
        8.0,
        11.0
       ]
      },
      "brow": {
       "file": "patches/idle/face_love_brow.png",
       "rect": [317, 355, 175, 15],
       "color_shift_rgb": [
        -2.2,
        1.0,
        3.5
       ]
      }
     },
     "squeeze": {
      "blush": {
       "file": "patches/idle/face_squeeze_blush.png",
       "rect": [300, 446, 224, 83],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/idle/face_squeeze_eyes.png",
       "rect": [297, 385, 232, 95],
       "color_shift_rgb": [
        -1.0,
        6.0,
        8.0
       ]
      },
      "mouth": {
       "file": "patches/idle/face_squeeze_mouth.png",
       "rect": [371, 470, 81, 57],
       "color_shift_rgb": [
        -0.0,
        5.1,
        7.0
       ]
      },
      "brow": {
       "file": "patches/idle/face_squeeze_brow.png",
       "rect": [335, 385, 154, 29],
       "color_shift_rgb": [
        -0.7,
        3.9,
        6.3
       ]
      }
     },
     "surprise": {
      "blush": {
       "file": "patches/idle/face_surprise_blush.png",
       "rect": [300, 446, 224, 83],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/idle/face_surprise_eyes.png",
       "rect": [297, 384, 232, 96],
       "color_shift_rgb": [
        -1.1,
        5.5,
        8.2
       ]
      },
      "mouth": {
       "file": "patches/idle/face_surprise_mouth.png",
       "rect": [371, 470, 81, 57],
       "color_shift_rgb": [
        -0.1,
        5.6,
        8.0
       ]
      },
      "brow": {
       "file": "patches/idle/face_surprise_brow.png",
       "rect": [314, 361, 189, 24],
       "color_shift_rgb": [
        -1.7,
        4.1,
        7.8
       ]
      }
     }
    },
    "eyeSkin": {
     "file": "patches/idle/eye_skin.png",
     "rect": [298, 380, 230, 105]
    },
    "browErase": {
     "file": "patches/idle/brow_erase.png",
     "rect": [183, 137, 466, 863],
     "source": "noBrow"
    }
   },
   "noBrow": {
    "frame": "frames/idle_nobrow.png",
    "brow_bbox": [300, 365, 527, 405],
    "found_shift": [
     [
      -1,
      0
     ],
     [
      -3,
      0
     ]
    ]
   },
   "browOk": true,
   "browRead": {
    "line_px": 0.0,
    "note": "归位帧恒为可换"
   },
   "facePaste": true,
   "browSwap": false,
   "faceBlank": false,
   "faceClass": 2
  },
  "think": {
   "label": "思考·正式 s1（幅度最大处，第 21 帧）",
   "frame": "frames/think_loop/21.png",
   "bbox": [176, 134, 638, 1002],
   "margin": [176, 134, 194, 102],
   "patches": {
    "align": {
     "scale": 0.3407,
     "rotate_deg": -2.61,
     "translate": [
      21.9,
      93.8
     ],
     "matches": 101,
     "inliers": 66,
     "residual_px": 0.8
    },
    "mouth": {
     "closed": {
      "file": "patches/think/mouth_closed.png",
      "rect": [364, 469, 82, 58],
      "color_shift_rgb": [
       7.0,
       9.0,
       13.7
      ],
      "skin_samples": 919,
      "occluded_px": 118
     },
     "small": {
      "file": "patches/think/mouth_small.png",
      "rect": [364, 469, 82, 58],
      "color_shift_rgb": [
       7.0,
       9.0,
       13.7
      ],
      "skin_samples": 919,
      "occluded_px": 118
     },
     "big": {
      "file": "patches/think/mouth_big.png",
      "rect": [364, 469, 82, 58],
      "color_shift_rgb": [
       7.0,
       9.0,
       13.7
      ],
      "skin_samples": 919,
      "occluded_px": 118
     },
     "smile": {
      "file": "patches/think/mouth_smile.png",
      "rect": [364, 469, 82, 58],
      "color_shift_rgb": [
       7.0,
       9.0,
       13.7
      ],
      "skin_samples": 919,
      "occluded_px": 118
     }
    },
    "blink": {
     "file": "patches/think/blink.png",
     "rect": [275, 380, 258, 106],
     "color_shift_rgb": [
      6.1,
      7.0,
      11.0
     ],
     "skin_samples": 2043,
     "occluded_px": 0
    },
    "clean": {
     "file": "patches/think/clean.png",
     "rect": [275, 352, 258, 175],
     "color_shift_rgb": [
      7.0,
      7.0,
      12.0
     ],
     "skin_samples": 3122,
     "occluded_px": 118
    },
    "face": {
     "angry": {
      "blush": {
       "file": "patches/think/face_angry_blush.png",
       "rect": [293, 441, 225, 90],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/think/face_angry_eyes.png",
       "rect": [289, 381, 232, 104],
       "color_shift_rgb": [
        2.2,
        8.0,
        13.2
       ]
      },
      "mouth": {
       "file": "patches/think/face_angry_mouth.png",
       "rect": [357, 463, 103, 64],
       "color_shift_rgb": [
        2.5,
        7.7,
        12.9
       ]
      },
      "brow": {
       "file": "patches/think/face_angry_brow.png",
       "rect": [316, 367, 179, 41],
       "color_shift_rgb": [
        2.3,
        6.9,
        12.7
       ]
      }
     },
     "awkward": {
      "blush": {
       "file": "patches/think/face_awkward_blush.png",
       "rect": [293, 441, 225, 90],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/think/face_awkward_eyes.png",
       "rect": [289, 381, 232, 99],
       "color_shift_rgb": [
        1.7,
        7.0,
        10.7
       ]
      },
      "mouth": {
       "file": "patches/think/face_awkward_mouth.png",
       "rect": [364, 469, 82, 58],
       "color_shift_rgb": [
        2.0,
        6.6,
        10.0
       ]
      },
      "brow": {
       "file": "patches/think/face_awkward_brow.png",
       "rect": [308, 381, 182, 25],
       "color_shift_rgb": [
        1.7,
        5.8,
        10.6
       ]
      }
     },
     "doubt": {
      "blush": {
       "file": "patches/think/face_doubt_blush.png",
       "rect": [293, 441, 225, 90],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/think/face_doubt_eyes.png",
       "rect": [289, 380, 232, 100],
       "color_shift_rgb": [
        2.0,
        7.0,
        11.9
       ]
      },
      "mouth": {
       "file": "patches/think/face_doubt_mouth.png",
       "rect": [364, 469, 82, 58],
       "color_shift_rgb": [
        2.9,
        7.0,
        12.1
       ]
      },
      "brow": {
       "file": "patches/think/face_doubt_brow.png",
       "rect": [316, 370, 170, 31],
       "color_shift_rgb": [
        2.1,
        6.6,
        12.9
       ]
      }
     },
     "flat": {
      "blush": {
       "file": "patches/think/face_flat_blush.png",
       "rect": [293, 441, 225, 90],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/think/face_flat_eyes.png",
       "rect": [289, 380, 232, 103],
       "color_shift_rgb": [
        2.6,
        9.7,
        13.1
       ]
      },
      "mouth": {
       "file": "patches/think/face_flat_mouth.png",
       "rect": [364, 469, 82, 58],
       "color_shift_rgb": [
        3.0,
        6.8,
        12.0
       ]
      },
      "brow": {
       "file": "patches/think/face_flat_brow.png",
       "rect": [304, 376, 198, 25],
       "color_shift_rgb": [
        2.7,
        5.9,
        11.6
       ]
      }
     },
     "happy": {
      "eyes": {
       "file": "patches/think/face_happy_eyes.png",
       "rect": [289, 380, 232, 101],
       "color_shift_rgb": [
        1.8,
        8.1,
        11.8
       ]
      },
      "mouth": {
       "file": "patches/think/face_happy_mouth.png",
       "rect": [363, 457, 88, 73],
       "color_shift_rgb": [
        2.1,
        7.0,
        11.0
       ]
      }
     },
     "love": {
      "blush": {
       "file": "patches/think/face_love_blush.png",
       "rect": [293, 441, 225, 90],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/think/face_love_eyes.png",
       "rect": [289, 382, 232, 105],
       "color_shift_rgb": [
        2.0,
        8.7,
        13.4
       ]
      },
      "mouth": {
       "file": "patches/think/face_love_mouth.png",
       "rect": [364, 469, 82, 58],
       "color_shift_rgb": [
        2.0,
        10.4,
        14.4
       ]
      },
      "brow": {
       "file": "patches/think/face_love_brow.png",
       "rect": [306, 353, 175, 20],
       "color_shift_rgb": [
        1.3,
        4.1,
        9.2
       ]
      }
     },
     "squeeze": {
      "blush": {
       "file": "patches/think/face_squeeze_blush.png",
       "rect": [293, 441, 225, 90],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/think/face_squeeze_eyes.png",
       "rect": [289, 382, 232, 100],
       "color_shift_rgb": [
        2.4,
        7.0,
        10.0
       ]
      },
      "mouth": {
       "file": "patches/think/face_squeeze_mouth.png",
       "rect": [364, 469, 82, 58],
       "color_shift_rgb": [
        2.7,
        6.2,
        9.9
       ]
      },
      "brow": {
       "file": "patches/think/face_squeeze_brow.png",
       "rect": [326, 383, 153, 32],
       "color_shift_rgb": [
        2.8,
        6.1,
        10.5
       ]
      }
     },
     "surprise": {
      "blush": {
       "file": "patches/think/face_surprise_blush.png",
       "rect": [293, 441, 225, 90],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/think/face_surprise_eyes.png",
       "rect": [289, 382, 232, 100],
       "color_shift_rgb": [
        2.0,
        6.7,
        10.9
       ]
      },
      "mouth": {
       "file": "patches/think/face_surprise_mouth.png",
       "rect": [364, 469, 82, 58],
       "color_shift_rgb": [
        2.3,
        6.6,
        10.7
       ]
      },
      "brow": {
       "file": "patches/think/face_surprise_brow.png",
       "rect": [303, 357, 189, 30],
       "color_shift_rgb": [
        1.9,
        6.1,
        11.8
       ]
      }
     }
    },
    "eyeSkin": {
     "file": "patches/think/eye_skin.png",
     "rect": [289, 378, 231, 110]
    },
    "browErase": {
     "file": "patches/think/brow_erase.png",
     "rect": [189, 143, 441, 859],
     "source": "noBrow"
    }
   },
   "browOk": false,
   "browRead": {
    "line_px": 1.25,
    "doubled": 0.171,
    "shift_px": 0.74,
    "region_px": 29269
   },
   "facePaste": true,
   "browSwap": true,
   "faceBlank": false,
   "faceClass": 1,
   "attrManual": [
    "browSwap"
   ]
  },
  "think_f2": {
   "label": "思考·正式 s2（幅度最大处，第 15 帧）",
   "frame": "frames/think_f2_loop/15.png",
   "bbox": [184, 140, 648, 1002],
   "margin": [184, 140, 184, 102],
   "patches": {
    "align": {
     "scale": 0.3414,
     "rotate_deg": 0.11,
     "translate": [
      45.7,
      79.7
     ],
     "matches": 90,
     "inliers": 59,
     "residual_px": 0.85
    },
    "mouth": {
     "closed": {
      "file": "patches/think_f2/mouth_closed.png",
      "rect": [370, 474, 82, 56],
      "color_shift_rgb": [
       3.0,
       6.0,
       10.0
      ],
      "skin_samples": 889,
      "occluded_px": 139
     },
     "small": {
      "file": "patches/think_f2/mouth_small.png",
      "rect": [370, 474, 82, 56],
      "color_shift_rgb": [
       3.0,
       6.0,
       10.0
      ],
      "skin_samples": 889,
      "occluded_px": 139
     },
     "big": {
      "file": "patches/think_f2/mouth_big.png",
      "rect": [370, 474, 82, 56],
      "color_shift_rgb": [
       3.0,
       6.0,
       10.0
      ],
      "skin_samples": 889,
      "occluded_px": 139
     },
     "smile": {
      "file": "patches/think_f2/mouth_smile.png",
      "rect": [370, 474, 82, 56],
      "color_shift_rgb": [
       3.0,
       6.0,
       10.0
      ],
      "skin_samples": 889,
      "occluded_px": 139
     }
    },
    "blink": {
     "file": "patches/think_f2/blink.png",
     "rect": [283, 388, 259, 99],
     "color_shift_rgb": [
      3.0,
      4.0,
      7.0
     ],
     "skin_samples": 2007,
     "occluded_px": 0
    },
    "clean": {
     "file": "patches/think_f2/clean.png",
     "rect": [283, 360, 259, 170],
     "color_shift_rgb": [
      3.0,
      4.0,
      7.0
     ],
     "skin_samples": 3091,
     "occluded_px": 139
    },
    "face": {
     "angry": {
      "blush": {
       "file": "patches/think_f2/face_angry_blush.png",
       "rect": [299, 449, 225, 85],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/think_f2/face_angry_eyes.png",
       "rect": [297, 389, 233, 96],
       "color_shift_rgb": [
        -1.3,
        5.0,
        9.5
       ]
      },
      "mouth": {
       "file": "patches/think_f2/face_angry_mouth.png",
       "rect": [362, 468, 103, 62],
       "color_shift_rgb": [
        -0.9,
        4.9,
        9.2
       ]
      },
      "brow": {
       "file": "patches/think_f2/face_angry_brow.png",
       "rect": [326, 376, 180, 35],
       "color_shift_rgb": [
        -0.6,
        3.9,
        8.2
       ]
      }
     },
     "awkward": {
      "blush": {
       "file": "patches/think_f2/face_awkward_blush.png",
       "rect": [299, 449, 225, 85],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/think_f2/face_awkward_eyes.png",
       "rect": [297, 389, 233, 94],
       "color_shift_rgb": [
        -2.1,
        4.0,
        6.8
       ]
      },
      "mouth": {
       "file": "patches/think_f2/face_awkward_mouth.png",
       "rect": [370, 474, 82, 56],
       "color_shift_rgb": [
        -1.4,
        3.7,
        6.0
       ]
      },
      "brow": {
       "file": "patches/think_f2/face_awkward_brow.png",
       "rect": [317, 384, 183, 23],
       "color_shift_rgb": [
        -1.3,
        3.0,
        6.4
       ]
      }
     },
     "doubt": {
      "blush": {
       "file": "patches/think_f2/face_doubt_blush.png",
       "rect": [299, 449, 225, 85],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/think_f2/face_doubt_eyes.png",
       "rect": [297, 387, 233, 96],
       "color_shift_rgb": [
        -1.7,
        3.9,
        8.0
       ]
      },
      "mouth": {
       "file": "patches/think_f2/face_doubt_mouth.png",
       "rect": [370, 474, 82, 56],
       "color_shift_rgb": [
        -0.9,
        4.0,
        8.3
       ]
      },
      "brow": {
       "file": "patches/think_f2/face_doubt_brow.png",
       "rect": [326, 378, 171, 26],
       "color_shift_rgb": [
        -0.6,
        3.9,
        8.7
       ]
      }
     },
     "flat": {
      "blush": {
       "file": "patches/think_f2/face_flat_blush.png",
       "rect": [299, 449, 225, 85],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/think_f2/face_flat_eyes.png",
       "rect": [297, 388, 233, 96],
       "color_shift_rgb": [
        -1.0,
        6.4,
        9.4
       ]
      },
      "mouth": {
       "file": "patches/think_f2/face_flat_mouth.png",
       "rect": [370, 474, 82, 56],
       "color_shift_rgb": [
        -0.9,
        3.9,
        8.1
       ]
      },
      "brow": {
       "file": "patches/think_f2/face_flat_brow.png",
       "rect": [314, 382, 198, 20],
       "color_shift_rgb": [
        0.0,
        3.0,
        7.8
       ]
      }
     },
     "happy": {
      "eyes": {
       "file": "patches/think_f2/face_happy_eyes.png",
       "rect": [297, 388, 233, 95],
       "color_shift_rgb": [
        -2.0,
        5.1,
        7.8
       ]
      },
      "mouth": {
       "file": "patches/think_f2/face_happy_mouth.png",
       "rect": [369, 463, 88, 70],
       "color_shift_rgb": [
        -1.2,
        4.1,
        7.1
       ]
      }
     },
     "love": {
      "blush": {
       "file": "patches/think_f2/face_love_blush.png",
       "rect": [299, 449, 225, 85],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/think_f2/face_love_eyes.png",
       "rect": [297, 389, 233, 100],
       "color_shift_rgb": [
        -1.5,
        5.5,
        9.5
       ]
      },
      "mouth": {
       "file": "patches/think_f2/face_love_mouth.png",
       "rect": [370, 474, 82, 56],
       "color_shift_rgb": [
        -1.5,
        8.6,
        11.0
       ]
      },
      "brow": {
       "file": "patches/think_f2/face_love_brow.png",
       "rect": [317, 360, 176, 13],
       "color_shift_rgb": [
        -3.7,
        0.7,
        4.7
       ]
      }
     },
     "squeeze": {
      "blush": {
       "file": "patches/think_f2/face_squeeze_blush.png",
       "rect": [299, 449, 225, 85],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/think_f2/face_squeeze_eyes.png",
       "rect": [297, 390, 233, 93],
       "color_shift_rgb": [
        -1.1,
        4.0,
        6.1
       ]
      },
      "mouth": {
       "file": "patches/think_f2/face_squeeze_mouth.png",
       "rect": [370, 474, 82, 56],
       "color_shift_rgb": [
        -0.9,
        3.2,
        6.0
       ]
      },
      "brow": {
       "file": "patches/think_f2/face_squeeze_brow.png",
       "rect": [336, 390, 154, 28],
       "color_shift_rgb": [
        0.4,
        3.1,
        6.0
       ]
      }
     },
     "surprise": {
      "blush": {
       "file": "patches/think_f2/face_surprise_blush.png",
       "rect": [299, 449, 225, 85],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/think_f2/face_surprise_eyes.png",
       "rect": [297, 391, 233, 91],
       "color_shift_rgb": [
        -1.7,
        3.6,
        6.9
       ]
      },
      "mouth": {
       "file": "patches/think_f2/face_surprise_mouth.png",
       "rect": [370, 474, 82, 56],
       "color_shift_rgb": [
        -1.0,
        3.8,
        6.8
       ]
      },
      "brow": {
       "file": "patches/think_f2/face_surprise_brow.png",
       "rect": [314, 365, 190, 25],
       "color_shift_rgb": [
        -1.3,
        3.1,
        7.2
       ]
      }
     }
    },
    "eyeSkin": {
     "file": "patches/think_f2/eye_skin.png",
     "rect": [298, 386, 230, 103]
    },
    "browErase": {
     "file": "patches/think_f2/brow_erase.png",
     "rect": [191, 158, 443, 844],
     "source": "noBrow"
    }
   },
   "browOk": true,
   "browRead": {
    "line_px": 0.64,
    "doubled": 0.094,
    "shift_px": 0.55,
    "region_px": 29336
   },
   "facePaste": true,
   "browSwap": true,
   "faceBlank": false,
   "faceClass": 1,
   "attrManual": [
    "browSwap"
   ]
  },
  "think_mid": {
   "label": "思考·折中（幅度最大处，第 23 帧）",
   "frame": "frames/think_mid_loop/23.png",
   "bbox": [174, 134, 636, 1002],
   "margin": [174, 134, 196, 102],
   "patches": {
    "align": {
     "scale": 0.3401,
     "rotate_deg": -3.12,
     "translate": [
      17.9,
      100.3
     ],
     "matches": 82,
     "inliers": 56,
     "residual_px": 0.96
    },
    "mouth": {
     "closed": {
      "file": "patches/think_mid/mouth_closed.png",
      "rect": [363, 471, 82, 58],
      "color_shift_rgb": [
       6.0,
       10.0,
       13.0
      ],
      "skin_samples": 845,
      "occluded_px": 522
     },
     "small": {
      "file": "patches/think_mid/mouth_small.png",
      "rect": [363, 471, 82, 58],
      "color_shift_rgb": [
       6.0,
       10.0,
       13.0
      ],
      "skin_samples": 845,
      "occluded_px": 522
     },
     "big": {
      "file": "patches/think_mid/mouth_big.png",
      "rect": [363, 471, 82, 58],
      "color_shift_rgb": [
       6.0,
       10.0,
       13.0
      ],
      "skin_samples": 845,
      "occluded_px": 522
     },
     "smile": {
      "file": "patches/think_mid/mouth_smile.png",
      "rect": [363, 471, 82, 58],
      "color_shift_rgb": [
       6.0,
       10.0,
       13.0
      ],
      "skin_samples": 845,
      "occluded_px": 522
     }
    },
    "blink": {
     "file": "patches/think_mid/blink.png",
     "rect": [273, 382, 258, 107],
     "color_shift_rgb": [
      6.0,
      8.0,
      10.0
     ],
     "skin_samples": 1979,
     "occluded_px": 847
    },
    "clean": {
     "file": "patches/think_mid/clean.png",
     "rect": [273, 354, 258, 175],
     "color_shift_rgb": [
      6.0,
      8.0,
      12.0
     ],
     "skin_samples": 2992,
     "occluded_px": 3164
    },
    "face": {
     "angry": {
      "blush": {
       "file": "patches/think_mid/face_angry_blush.png",
       "rect": [294, 443, 222, 91],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/think_mid/face_angry_eyes.png",
       "rect": [287, 383, 232, 105],
       "color_shift_rgb": [
        2.1,
        9.6,
        14.0
       ]
      },
      "mouth": {
       "file": "patches/think_mid/face_angry_mouth.png",
       "rect": [356, 465, 103, 64],
       "color_shift_rgb": [
        2.2,
        9.1,
        13.1
       ]
      },
      "brow": {
       "file": "patches/think_mid/face_angry_brow.png",
       "rect": [314, 369, 178, 42],
       "color_shift_rgb": [
        2.6,
        9.0,
        14.1
       ]
      }
     },
     "awkward": {
      "blush": {
       "file": "patches/think_mid/face_awkward_blush.png",
       "rect": [294, 443, 222, 91],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/think_mid/face_awkward_eyes.png",
       "rect": [287, 382, 232, 101],
       "color_shift_rgb": [
        1.7,
        8.7,
        11.2
       ]
      },
      "mouth": {
       "file": "patches/think_mid/face_awkward_mouth.png",
       "rect": [363, 471, 82, 58],
       "color_shift_rgb": [
        1.6,
        7.8,
        9.0
       ]
      },
      "brow": {
       "file": "patches/think_mid/face_awkward_brow.png",
       "rect": [306, 384, 181, 25],
       "color_shift_rgb": [
        1.9,
        8.7,
        12.3
       ]
      }
     },
     "doubt": {
      "blush": {
       "file": "patches/think_mid/face_doubt_blush.png",
       "rect": [294, 443, 222, 91],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/think_mid/face_doubt_eyes.png",
       "rect": [287, 381, 232, 102],
       "color_shift_rgb": [
        2.0,
        8.3,
        12.0
       ]
      },
      "mouth": {
       "file": "patches/think_mid/face_doubt_mouth.png",
       "rect": [363, 471, 82, 58],
       "color_shift_rgb": [
        2.1,
        8.1,
        11.0
       ]
      },
      "brow": {
       "file": "patches/think_mid/face_doubt_brow.png",
       "rect": [314, 372, 170, 32],
       "color_shift_rgb": [
        2.2,
        8.5,
        14.0
       ]
      }
     },
     "flat": {
      "blush": {
       "file": "patches/think_mid/face_flat_blush.png",
       "rect": [294, 443, 222, 91],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/think_mid/face_flat_eyes.png",
       "rect": [287, 381, 232, 103],
       "color_shift_rgb": [
        2.5,
        11.6,
        14.0
       ]
      },
      "mouth": {
       "file": "patches/think_mid/face_flat_mouth.png",
       "rect": [363, 471, 82, 58],
       "color_shift_rgb": [
        2.1,
        8.0,
        11.5
       ]
      },
      "brow": {
       "file": "patches/think_mid/face_flat_brow.png",
       "rect": [303, 378, 196, 26],
       "color_shift_rgb": [
        2.9,
        8.4,
        13.4
       ]
      }
     },
     "happy": {
      "eyes": {
       "file": "patches/think_mid/face_happy_eyes.png",
       "rect": [287, 381, 232, 102],
       "color_shift_rgb": [
        1.9,
        9.9,
        12.4
       ]
      },
      "mouth": {
       "file": "patches/think_mid/face_happy_mouth.png",
       "rect": [362, 459, 88, 72],
       "color_shift_rgb": [
        1.9,
        8.1,
        10.1
       ]
      }
     },
     "love": {
      "blush": {
       "file": "patches/think_mid/face_love_blush.png",
       "rect": [294, 443, 222, 91],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/think_mid/face_love_eyes.png",
       "rect": [287, 382, 232, 109],
       "color_shift_rgb": [
        1.9,
        11.2,
        15.0
       ]
      },
      "mouth": {
       "file": "patches/think_mid/face_love_mouth.png",
       "rect": [363, 471, 82, 58],
       "color_shift_rgb": [
        1.4,
        16.1,
        16.1
       ]
      },
      "brow": {
       "file": "patches/think_mid/face_love_brow.png",
       "rect": [304, 356, 175, 21],
       "color_shift_rgb": [
        2.2,
        6.2,
        9.8
       ]
      }
     },
     "squeeze": {
      "blush": {
       "file": "patches/think_mid/face_squeeze_blush.png",
       "rect": [294, 443, 222, 91],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/think_mid/face_squeeze_eyes.png",
       "rect": [287, 384, 232, 99],
       "color_shift_rgb": [
        2.5,
        9.0,
        10.9
       ]
      },
      "mouth": {
       "file": "patches/think_mid/face_squeeze_mouth.png",
       "rect": [363, 471, 82, 58],
       "color_shift_rgb": [
        2.1,
        7.4,
        8.7
       ]
      },
      "brow": {
       "file": "patches/think_mid/face_squeeze_brow.png",
       "rect": [324, 384, 153, 34],
       "color_shift_rgb": [
        2.9,
        8.7,
        12.0
       ]
      }
     },
     "surprise": {
      "blush": {
       "file": "patches/think_mid/face_surprise_blush.png",
       "rect": [294, 443, 222, 91],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/think_mid/face_surprise_eyes.png",
       "rect": [287, 383, 232, 100],
       "color_shift_rgb": [
        2.0,
        8.2,
        11.0
       ]
      },
      "mouth": {
       "file": "patches/think_mid/face_surprise_mouth.png",
       "rect": [363, 471, 82, 58],
       "color_shift_rgb": [
        2.0,
        7.9,
        9.3
       ]
      },
      "brow": {
       "file": "patches/think_mid/face_surprise_brow.png",
       "rect": [301, 359, 189, 31],
       "color_shift_rgb": [
        2.0,
        9.1,
        13.6
       ]
      }
     }
    },
    "eyeSkin": {
     "file": "patches/think_mid/eye_skin.png",
     "rect": [288, 380, 230, 111]
    },
    "browErase": {
     "file": "patches/think_mid/brow_erase.png",
     "rect": [179, 158, 440, 844],
     "source": "noBrow"
    }
   },
   "browOk": false,
   "browRead": {
    "line_px": 1.45,
    "doubled": 0.196,
    "shift_px": 0.63,
    "region_px": 30151
   },
   "facePaste": true,
   "browSwap": true,
   "faceBlank": false,
   "faceClass": 1,
   "attrManual": [
    "browSwap"
   ]
  },
  "think_d1": {
   "label": "思考·草稿 s1（幅度最大处，第 23 帧）",
   "frame": "frames/think_d1_loop/23.png",
   "bbox": [174, 132, 636, 1002],
   "margin": [174, 132, 196, 102],
   "patches": {
    "align": {
     "scale": 0.3405,
     "rotate_deg": -3.09,
     "translate": [
      17.9,
      100.4
     ],
     "matches": 84,
     "inliers": 58,
     "residual_px": 0.93
    },
    "mouth": {
     "closed": {
      "file": "patches/think_d1/mouth_closed.png",
      "rect": [363, 472, 82, 58],
      "color_shift_rgb": [
       7.0,
       9.0,
       14.0
      ],
      "skin_samples": 844,
      "occluded_px": 720
     },
     "small": {
      "file": "patches/think_d1/mouth_small.png",
      "rect": [363, 472, 82, 58],
      "color_shift_rgb": [
       7.0,
       9.0,
       14.0
      ],
      "skin_samples": 844,
      "occluded_px": 720
     },
     "big": {
      "file": "patches/think_d1/mouth_big.png",
      "rect": [363, 472, 82, 58],
      "color_shift_rgb": [
       7.0,
       9.0,
       14.0
      ],
      "skin_samples": 844,
      "occluded_px": 720
     },
     "smile": {
      "file": "patches/think_d1/mouth_smile.png",
      "rect": [363, 472, 82, 58],
      "color_shift_rgb": [
       7.0,
       9.0,
       14.0
      ],
      "skin_samples": 844,
      "occluded_px": 720
     }
    },
    "blink": {
     "file": "patches/think_d1/blink.png",
     "rect": [273, 383, 258, 106],
     "color_shift_rgb": [
      6.0,
      7.0,
      11.0
     ],
     "skin_samples": 2006,
     "occluded_px": 172
    },
    "clean": {
     "file": "patches/think_d1/clean.png",
     "rect": [273, 355, 258, 175],
     "color_shift_rgb": [
      6.0,
      7.0,
      12.0
     ],
     "skin_samples": 3017,
     "occluded_px": 2027
    },
    "face": {
     "angry": {
      "blush": {
       "file": "patches/think_d1/face_angry_blush.png",
       "rect": [292, 444, 225, 91],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/think_d1/face_angry_eyes.png",
       "rect": [287, 383, 232, 105],
       "color_shift_rgb": [
        1.8,
        8.4,
        13.3
       ]
      },
      "mouth": {
       "file": "patches/think_d1/face_angry_mouth.png",
       "rect": [356, 466, 103, 64],
       "color_shift_rgb": [
        2.1,
        8.2,
        13.0
       ]
      },
      "brow": {
       "file": "patches/think_d1/face_angry_brow.png",
       "rect": [314, 370, 179, 41],
       "color_shift_rgb": [
        2.2,
        7.0,
        12.0
       ]
      }
     },
     "awkward": {
      "blush": {
       "file": "patches/think_d1/face_awkward_blush.png",
       "rect": [292, 444, 225, 91],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/think_d1/face_awkward_eyes.png",
       "rect": [287, 384, 232, 100],
       "color_shift_rgb": [
        1.1,
        7.4,
        10.4
       ]
      },
      "mouth": {
       "file": "patches/think_d1/face_awkward_mouth.png",
       "rect": [363, 472, 82, 58],
       "color_shift_rgb": [
        1.9,
        6.8,
        10.0
       ]
      },
      "brow": {
       "file": "patches/think_d1/face_awkward_brow.png",
       "rect": [306, 384, 181, 25],
       "color_shift_rgb": [
        1.6,
        6.1,
        10.3
       ]
      }
     },
     "doubt": {
      "blush": {
       "file": "patches/think_d1/face_doubt_blush.png",
       "rect": [292, 444, 225, 91],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/think_d1/face_doubt_eyes.png",
       "rect": [287, 382, 232, 102],
       "color_shift_rgb": [
        1.5,
        7.2,
        12.0
       ]
      },
      "mouth": {
       "file": "patches/think_d1/face_doubt_mouth.png",
       "rect": [363, 472, 82, 58],
       "color_shift_rgb": [
        2.6,
        7.1,
        12.1
       ]
      },
      "brow": {
       "file": "patches/think_d1/face_doubt_brow.png",
       "rect": [314, 373, 170, 32],
       "color_shift_rgb": [
        2.0,
        6.9,
        12.0
       ]
      }
     },
     "flat": {
      "blush": {
       "file": "patches/think_d1/face_flat_blush.png",
       "rect": [292, 444, 225, 91],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/think_d1/face_flat_eyes.png",
       "rect": [287, 383, 232, 104],
       "color_shift_rgb": [
        2.0,
        10.2,
        13.0
       ]
      },
      "mouth": {
       "file": "patches/think_d1/face_flat_mouth.png",
       "rect": [363, 472, 82, 58],
       "color_shift_rgb": [
        2.7,
        7.0,
        12.0
       ]
      },
      "brow": {
       "file": "patches/think_d1/face_flat_brow.png",
       "rect": [303, 379, 197, 26],
       "color_shift_rgb": [
        2.5,
        6.1,
        10.8
       ]
      }
     },
     "happy": {
      "eyes": {
       "file": "patches/think_d1/face_happy_eyes.png",
       "rect": [287, 383, 232, 102],
       "color_shift_rgb": [
        1.2,
        8.3,
        11.6
       ]
      },
      "mouth": {
       "file": "patches/think_d1/face_happy_mouth.png",
       "rect": [362, 460, 88, 72],
       "color_shift_rgb": [
        2.0,
        7.4,
        11.2
       ]
      }
     },
     "love": {
      "blush": {
       "file": "patches/think_d1/face_love_blush.png",
       "rect": [292, 444, 225, 91],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/think_d1/face_love_eyes.png",
       "rect": [287, 384, 232, 107],
       "color_shift_rgb": [
        1.8,
        9.3,
        13.5
       ]
      },
      "mouth": {
       "file": "patches/think_d1/face_love_mouth.png",
       "rect": [363, 472, 82, 58],
       "color_shift_rgb": [
        1.7,
        16.4,
        18.1
       ]
      },
      "brow": {
       "file": "patches/think_d1/face_love_brow.png",
       "rect": [304, 356, 175, 21],
       "color_shift_rgb": [
        1.0,
        3.7,
        7.8
       ]
      }
     },
     "squeeze": {
      "blush": {
       "file": "patches/think_d1/face_squeeze_blush.png",
       "rect": [292, 444, 225, 91],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/think_d1/face_squeeze_eyes.png",
       "rect": [287, 385, 232, 102],
       "color_shift_rgb": [
        2.0,
        7.4,
        10.0
       ]
      },
      "mouth": {
       "file": "patches/think_d1/face_squeeze_mouth.png",
       "rect": [363, 472, 82, 58],
       "color_shift_rgb": [
        2.6,
        6.4,
        9.8
       ]
      },
      "brow": {
       "file": "patches/think_d1/face_squeeze_brow.png",
       "rect": [324, 385, 153, 33],
       "color_shift_rgb": [
        2.7,
        6.3,
        10.0
       ]
      }
     },
     "surprise": {
      "blush": {
       "file": "patches/think_d1/face_surprise_blush.png",
       "rect": [292, 444, 225, 91],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/think_d1/face_surprise_eyes.png",
       "rect": [287, 386, 232, 100],
       "color_shift_rgb": [
        1.8,
        7.0,
        10.8
       ]
      },
      "mouth": {
       "file": "patches/think_d1/face_surprise_mouth.png",
       "rect": [363, 472, 82, 58],
       "color_shift_rgb": [
        2.1,
        6.9,
        10.3
       ]
      },
      "brow": {
       "file": "patches/think_d1/face_surprise_brow.png",
       "rect": [301, 360, 189, 31],
       "color_shift_rgb": [
        1.9,
        6.4,
        11.7
       ]
      }
     }
    },
    "eyeSkin": {
     "file": "patches/think_d1/eye_skin.png",
     "rect": [288, 381, 231, 110]
    },
    "browErase": {
     "file": "patches/think_d1/brow_erase.png",
     "rect": [180, 160, 441, 842],
     "source": "noBrow"
    }
   },
   "browOk": false,
   "browRead": {
    "line_px": 1.57,
    "doubled": 0.203,
    "shift_px": 0.92,
    "region_px": 30713
   },
   "facePaste": true,
   "browSwap": true,
   "faceBlank": false,
   "faceClass": 1,
   "attrManual": [
    "browSwap"
   ]
  },
  "wave": {
   "label": "挥手·正式 s2（幅度最大处，第 20 帧）",
   "frame": "frames/wave_loop/20.png",
   "bbox": [190, 142, 660, 1002],
   "margin": [190, 142, 172, 102],
   "patches": {
    "align": {
     "scale": 0.3405,
     "rotate_deg": 5.34,
     "translate": [
      83.8,
      43.0
     ],
     "matches": 92,
     "inliers": 63,
     "residual_px": 0.89
    },
    "mouth": {
     "closed": {
      "file": "patches/wave/mouth_closed.png",
      "rect": [368, 466, 83, 59],
      "color_shift_rgb": [
       4.0,
       6.0,
       9.5
      ],
      "skin_samples": 1027,
      "occluded_px": 6
     },
     "small": {
      "file": "patches/wave/mouth_small.png",
      "rect": [368, 466, 83, 59],
      "color_shift_rgb": [
       4.0,
       6.0,
       9.5
      ],
      "skin_samples": 1027,
      "occluded_px": 6
     },
     "big": {
      "file": "patches/wave/mouth_big.png",
      "rect": [368, 466, 83, 59],
      "color_shift_rgb": [
       4.0,
       6.0,
       9.5
      ],
      "skin_samples": 1027,
      "occluded_px": 6
     },
     "smile": {
      "file": "patches/wave/mouth_smile.png",
      "rect": [368, 466, 83, 59],
      "color_shift_rgb": [
       4.0,
       6.0,
       9.5
      ],
      "skin_samples": 1027,
      "occluded_px": 6
     }
    },
    "blink": {
     "file": "patches/wave/blink.png",
     "rect": [287, 376, 257, 111],
     "color_shift_rgb": [
      4.0,
      4.0,
      7.0
     ],
     "skin_samples": 2045,
     "occluded_px": 0
    },
    "clean": {
     "file": "patches/wave/clean.png",
     "rect": [287, 348, 257, 177],
     "color_shift_rgb": [
      4.0,
      4.0,
      8.0
     ],
     "skin_samples": 3236,
     "occluded_px": 43
    },
    "face": {
     "angry": {
      "blush": {
       "file": "patches/wave/face_angry_blush.png",
       "rect": [298, 433, 225, 97],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/wave/face_angry_eyes.png",
       "rect": [301, 379, 231, 107],
       "color_shift_rgb": [
        -0.5,
        5.1,
        9.9
       ]
      },
      "mouth": {
       "file": "patches/wave/face_angry_mouth.png",
       "rect": [359, 464, 103, 61],
       "color_shift_rgb": [
        0.0,
        4.8,
        9.2
       ]
      },
      "brow": {
       "file": "patches/wave/face_angry_brow.png",
       "rect": [335, 368, 179, 40],
       "color_shift_rgb": [
        0.5,
        4.0,
        8.7
       ]
      }
     },
     "awkward": {
      "blush": {
       "file": "patches/wave/face_awkward_blush.png",
       "rect": [298, 433, 225, 97],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/wave/face_awkward_eyes.png",
       "rect": [301, 378, 231, 106],
       "color_shift_rgb": [
        -1.2,
        4.1,
        7.0
       ]
      },
      "mouth": {
       "file": "patches/wave/face_awkward_mouth.png",
       "rect": [368, 466, 83, 59],
       "color_shift_rgb": [
        -0.8,
        3.8,
        6.2
       ]
      },
      "brow": {
       "file": "patches/wave/face_awkward_brow.png",
       "rect": [324, 375, 181, 33],
       "color_shift_rgb": [
        -0.0,
        2.9,
        6.5
       ]
      }
     },
     "doubt": {
      "blush": {
       "file": "patches/wave/face_doubt_blush.png",
       "rect": [298, 433, 225, 97],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/wave/face_doubt_eyes.png",
       "rect": [301, 379, 231, 107],
       "color_shift_rgb": [
        -0.7,
        4.0,
        8.3
       ]
      },
      "mouth": {
       "file": "patches/wave/face_doubt_mouth.png",
       "rect": [368, 466, 83, 59],
       "color_shift_rgb": [
        0.0,
        4.0,
        8.5
       ]
      },
      "brow": {
       "file": "patches/wave/face_doubt_brow.png",
       "rect": [335, 366, 170, 33],
       "color_shift_rgb": [
        0.7,
        3.9,
        8.8
       ]
      }
     },
     "flat": {
      "blush": {
       "file": "patches/wave/face_flat_blush.png",
       "rect": [298, 433, 225, 97],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/wave/face_flat_eyes.png",
       "rect": [301, 378, 231, 108],
       "color_shift_rgb": [
        -0.1,
        6.8,
        9.9
       ]
      },
      "mouth": {
       "file": "patches/wave/face_flat_mouth.png",
       "rect": [368, 466, 83, 59],
       "color_shift_rgb": [
        0.0,
        3.9,
        8.2
       ]
      },
      "brow": {
       "file": "patches/wave/face_flat_brow.png",
       "rect": [322, 375, 197, 26],
       "color_shift_rgb": [
        1.2,
        3.0,
        7.8
       ]
      }
     },
     "happy": {
      "eyes": {
       "file": "patches/wave/face_happy_eyes.png",
       "rect": [301, 379, 231, 107],
       "color_shift_rgb": [
        -1.0,
        5.0,
        8.0
       ]
      },
      "mouth": {
       "file": "patches/wave/face_happy_mouth.png",
       "rect": [368, 454, 89, 76],
       "color_shift_rgb": [
        -0.3,
        4.2,
        7.3
       ]
      }
     },
     "love": {
      "blush": {
       "file": "patches/wave/face_love_blush.png",
       "rect": [298, 433, 225, 97],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/wave/face_love_eyes.png",
       "rect": [301, 385, 231, 104],
       "color_shift_rgb": [
        -0.8,
        5.8,
        9.9
       ]
      },
      "mouth": {
       "file": "patches/wave/face_love_mouth.png",
       "rect": [368, 466, 83, 59],
       "color_shift_rgb": [
        -0.9,
        6.5,
        9.9
       ]
      },
      "brow": {
       "file": "patches/wave/face_love_brow.png",
       "rect": [327, 350, 174, 25],
       "color_shift_rgb": [
        -2.9,
        1.9,
        4.8
       ]
      }
     },
     "squeeze": {
      "blush": {
       "file": "patches/wave/face_squeeze_blush.png",
       "rect": [298, 433, 225, 97],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/wave/face_squeeze_eyes.png",
       "rect": [301, 379, 231, 105],
       "color_shift_rgb": [
        -0.4,
        4.1,
        6.5
       ]
      },
      "mouth": {
       "file": "patches/wave/face_squeeze_mouth.png",
       "rect": [368, 466, 83, 59],
       "color_shift_rgb": [
        -0.0,
        3.3,
        6.0
       ]
      },
      "brow": {
       "file": "patches/wave/face_squeeze_brow.png",
       "rect": [343, 378, 153, 36],
       "color_shift_rgb": [
        1.4,
        3.3,
        6.9
       ]
      }
     },
     "surprise": {
      "blush": {
       "file": "patches/wave/face_surprise_blush.png",
       "rect": [298, 433, 225, 97],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/wave/face_surprise_eyes.png",
       "rect": [301, 378, 231, 105],
       "color_shift_rgb": [
        -0.9,
        3.8,
        7.0
       ]
      },
      "mouth": {
       "file": "patches/wave/face_surprise_mouth.png",
       "rect": [368, 466, 83, 59],
       "color_shift_rgb": [
        -0.2,
        3.9,
        7.0
       ]
      },
      "brow": {
       "file": "patches/wave/face_surprise_brow.png",
       "rect": [324, 351, 189, 38],
       "color_shift_rgb": [
        -0.7,
        3.2,
        7.7
       ]
      }
     }
    },
    "eyeSkin": {
     "file": "patches/wave/eye_skin.png",
     "rect": [302, 374, 230, 116]
    },
    "browErase": {
     "file": "patches/wave/brow_erase.png",
     "rect": [203, 154, 441, 848],
     "source": "noBrow"
    }
   },
   "browOk": false,
   "browRead": {
    "line_px": 2.48,
    "doubled": 0.345,
    "shift_px": 0.22,
    "region_px": 45884
   },
   "facePaste": true,
   "browSwap": false,
   "faceBlank": false,
   "faceClass": 2
  },
  "wave_f1": {
   "label": "挥手·正式 s1（幅度最大处，第 33 帧）",
   "frame": "frames/wave_f1_loop/33.png",
   "bbox": [178, 132, 738, 1002],
   "margin": [178, 132, 94, 102],
   "patches": {
    "align": {
     "scale": 0.3409,
     "rotate_deg": -2.03,
     "translate": [
      28.1,
      88.8
     ],
     "matches": 86,
     "inliers": 64,
     "residual_px": 0.76
    },
    "mouth": {
     "closed": {
      "file": "patches/wave_f1/mouth_closed.png",
      "rect": [367, 469, 82, 57],
      "color_shift_rgb": [
       7.0,
       10.0,
       14.0
      ],
      "skin_samples": 989,
      "occluded_px": 0
     },
     "small": {
      "file": "patches/wave_f1/mouth_small.png",
      "rect": [367, 469, 82, 57],
      "color_shift_rgb": [
       7.0,
       10.0,
       14.0
      ],
      "skin_samples": 989,
      "occluded_px": 0
     },
     "big": {
      "file": "patches/wave_f1/mouth_big.png",
      "rect": [367, 469, 82, 57],
      "color_shift_rgb": [
       7.0,
       10.0,
       14.0
      ],
      "skin_samples": 989,
      "occluded_px": 0
     },
     "smile": {
      "file": "patches/wave_f1/mouth_smile.png",
      "rect": [367, 469, 82, 57],
      "color_shift_rgb": [
       7.0,
       10.0,
       14.0
      ],
      "skin_samples": 989,
      "occluded_px": 0
     }
    },
    "blink": {
     "file": "patches/wave_f1/blink.png",
     "rect": [278, 380, 258, 104],
     "color_shift_rgb": [
      7.0,
      7.0,
      12.0
     ],
     "skin_samples": 2043,
     "occluded_px": 0
    },
    "clean": {
     "file": "patches/wave_f1/clean.png",
     "rect": [278, 352, 258, 174],
     "color_shift_rgb": [
      7.0,
      8.0,
      12.0
     ],
     "skin_samples": 3206,
     "occluded_px": 91
    },
    "face": {
     "angry": {
      "blush": {
       "file": "patches/wave_f1/face_angry_blush.png",
       "rect": [296, 442, 225, 88],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/wave_f1/face_angry_eyes.png",
       "rect": [292, 381, 232, 102],
       "color_shift_rgb": [
        2.5,
        9.1,
        14.1
       ]
      },
      "mouth": {
       "file": "patches/wave_f1/face_angry_mouth.png",
       "rect": [360, 462, 102, 64],
       "color_shift_rgb": [
        2.7,
        8.6,
        13.5
       ]
      },
      "brow": {
       "file": "patches/wave_f1/face_angry_brow.png",
       "rect": [319, 367, 180, 40],
       "color_shift_rgb": [
        2.6,
        8.0,
        13.2
       ]
      }
     },
     "awkward": {
      "blush": {
       "file": "patches/wave_f1/face_awkward_blush.png",
       "rect": [296, 442, 225, 88],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/wave_f1/face_awkward_eyes.png",
       "rect": [292, 381, 232, 98],
       "color_shift_rgb": [
        2.0,
        8.1,
        11.2
       ]
      },
      "mouth": {
       "file": "patches/wave_f1/face_awkward_mouth.png",
       "rect": [367, 469, 82, 57],
       "color_shift_rgb": [
        2.0,
        7.3,
        10.8
       ]
      },
      "brow": {
       "file": "patches/wave_f1/face_awkward_brow.png",
       "rect": [311, 380, 182, 24],
       "color_shift_rgb": [
        1.9,
        7.1,
        11.1
       ]
      }
     },
     "doubt": {
      "blush": {
       "file": "patches/wave_f1/face_doubt_blush.png",
       "rect": [296, 442, 225, 88],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/wave_f1/face_doubt_eyes.png",
       "rect": [292, 379, 232, 100],
       "color_shift_rgb": [
        2.3,
        7.9,
        12.7
       ]
      },
      "mouth": {
       "file": "patches/wave_f1/face_doubt_mouth.png",
       "rect": [367, 469, 82, 57],
       "color_shift_rgb": [
        3.0,
        7.9,
        13.0
       ]
      },
      "brow": {
       "file": "patches/wave_f1/face_doubt_brow.png",
       "rect": [319, 370, 171, 30],
       "color_shift_rgb": [
        2.2,
        8.0,
        13.2
       ]
      }
     },
     "flat": {
      "blush": {
       "file": "patches/wave_f1/face_flat_blush.png",
       "rect": [296, 442, 225, 88],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/wave_f1/face_flat_eyes.png",
       "rect": [292, 380, 232, 101],
       "color_shift_rgb": [
        3.0,
        10.6,
        14.1
       ]
      },
      "mouth": {
       "file": "patches/wave_f1/face_flat_mouth.png",
       "rect": [367, 469, 82, 57],
       "color_shift_rgb": [
        3.0,
        7.6,
        12.9
       ]
      },
      "brow": {
       "file": "patches/wave_f1/face_flat_brow.png",
       "rect": [308, 375, 197, 24],
       "color_shift_rgb": [
        2.9,
        7.0,
        12.2
       ]
      }
     },
     "happy": {
      "eyes": {
       "file": "patches/wave_f1/face_happy_eyes.png",
       "rect": [292, 380, 232, 99],
       "color_shift_rgb": [
        2.1,
        9.0,
        12.3
       ]
      },
      "mouth": {
       "file": "patches/wave_f1/face_happy_mouth.png",
       "rect": [366, 456, 88, 74],
       "color_shift_rgb": [
        2.1,
        7.8,
        11.6
       ]
      }
     },
     "love": {
      "blush": {
       "file": "patches/wave_f1/face_love_blush.png",
       "rect": [296, 442, 225, 88],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/wave_f1/face_love_eyes.png",
       "rect": [292, 381, 232, 105],
       "color_shift_rgb": [
        2.2,
        9.7,
        14.4
       ]
      },
      "mouth": {
       "file": "patches/wave_f1/face_love_mouth.png",
       "rect": [367, 469, 82, 57],
       "color_shift_rgb": [
        2.0,
        10.0,
        14.3
       ]
      },
      "brow": {
       "file": "patches/wave_f1/face_love_brow.png",
       "rect": [310, 353, 175, 18],
       "color_shift_rgb": [
        2.9,
        4.6,
        9.9
       ]
      }
     },
     "squeeze": {
      "blush": {
       "file": "patches/wave_f1/face_squeeze_blush.png",
       "rect": [296, 442, 225, 88],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/wave_f1/face_squeeze_eyes.png",
       "rect": [292, 382, 232, 99],
       "color_shift_rgb": [
        3.0,
        8.0,
        11.0
       ]
      },
      "mouth": {
       "file": "patches/wave_f1/face_squeeze_mouth.png",
       "rect": [367, 469, 82, 57],
       "color_shift_rgb": [
        2.8,
        7.0,
        10.3
       ]
      },
      "brow": {
       "file": "patches/wave_f1/face_squeeze_brow.png",
       "rect": [329, 382, 154, 32],
       "color_shift_rgb": [
        2.9,
        7.5,
        11.0
       ]
      }
     },
     "surprise": {
      "blush": {
       "file": "patches/wave_f1/face_surprise_blush.png",
       "rect": [296, 442, 225, 88],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/wave_f1/face_surprise_eyes.png",
       "rect": [292, 382, 232, 99],
       "color_shift_rgb": [
        2.3,
        7.9,
        11.5
       ]
      },
      "mouth": {
       "file": "patches/wave_f1/face_surprise_mouth.png",
       "rect": [367, 469, 82, 57],
       "color_shift_rgb": [
        2.5,
        7.4,
        11.1
       ]
      },
      "brow": {
       "file": "patches/wave_f1/face_surprise_brow.png",
       "rect": [307, 357, 189, 29],
       "color_shift_rgb": [
        2.1,
        7.4,
        12.2
       ]
      }
     }
    },
    "eyeSkin": {
     "file": "patches/wave_f1/eye_skin.png",
     "rect": [292, 378, 231, 108]
    },
    "browErase": {
     "file": "patches/wave_f1/brow_erase.png",
     "rect": [200, 154, 435, 848],
     "source": "noBrow"
    }
   },
   "browOk": false,
   "browRead": {
    "line_px": 1.81,
    "doubled": 0.24,
    "shift_px": 0.76,
    "region_px": 40930
   },
   "facePaste": true,
   "browSwap": false,
   "faceBlank": false,
   "faceClass": 2
  },
  "wave_d1": {
   "label": "挥手·草稿 s1（幅度最大处，第 37 帧）",
   "frame": "frames/wave_d1_loop/37.png",
   "bbox": [168, 130, 694, 1002],
   "margin": [168, 130, 138, 102],
   "patches": {
    "align": {
     "scale": 0.3394,
     "rotate_deg": -5.52,
     "translate": [
      0.7,
      115.3
     ],
     "matches": 85,
     "inliers": 42,
     "residual_px": 0.88
    },
    "mouth": {
     "closed": {
      "file": "patches/wave_d1/mouth_closed.png",
      "rect": [361, 468, 82, 59],
      "color_shift_rgb": [
       7.0,
       9.0,
       13.4
      ],
      "skin_samples": 1017,
      "occluded_px": 15
     },
     "small": {
      "file": "patches/wave_d1/mouth_small.png",
      "rect": [361, 468, 82, 59],
      "color_shift_rgb": [
       7.0,
       9.0,
       13.4
      ],
      "skin_samples": 1017,
      "occluded_px": 15
     },
     "big": {
      "file": "patches/wave_d1/mouth_big.png",
      "rect": [361, 468, 82, 59],
      "color_shift_rgb": [
       7.0,
       9.0,
       13.4
      ],
      "skin_samples": 1017,
      "occluded_px": 15
     },
     "smile": {
      "file": "patches/wave_d1/mouth_smile.png",
      "rect": [361, 468, 82, 59],
      "color_shift_rgb": [
       7.0,
       9.0,
       13.4
      ],
      "skin_samples": 1017,
      "occluded_px": 15
     }
    },
    "blink": {
     "file": "patches/wave_d1/blink.png",
     "rect": [269, 378, 257, 112],
     "color_shift_rgb": [
      7.0,
      7.0,
      12.0
     ],
     "skin_samples": 1645,
     "occluded_px": 5299
    },
    "clean": {
     "file": "patches/wave_d1/clean.png",
     "rect": [269, 350, 257, 177],
     "color_shift_rgb": [
      7.0,
      8.0,
      12.0
     ],
     "skin_samples": 2778,
     "occluded_px": 9063
    },
    "face": {
     "angry": {
      "blush": {
       "file": "patches/wave_d1/face_angry_blush.png",
       "rect": [291, 441, 217, 92],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/wave_d1/face_angry_eyes.png",
       "rect": [283, 378, 231, 111],
       "color_shift_rgb": [
        2.5,
        8.5,
        13.2
       ]
      },
      "mouth": {
       "file": "patches/wave_d1/face_angry_mouth.png",
       "rect": [355, 462, 103, 65],
       "color_shift_rgb": [
        2.7,
        7.9,
        13.0
       ]
      },
      "brow": {
       "file": "patches/wave_d1/face_angry_brow.png",
       "rect": [307, 364, 178, 46],
       "color_shift_rgb": [
        2.6,
        7.7,
        12.0
       ]
      }
     },
     "awkward": {
      "blush": {
       "file": "patches/wave_d1/face_awkward_blush.png",
       "rect": [291, 441, 217, 92],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/wave_d1/face_awkward_eyes.png",
       "rect": [283, 377, 231, 98],
       "color_shift_rgb": [
        2.0,
        7.6,
        10.0
       ]
      },
      "mouth": {
       "file": "patches/wave_d1/face_awkward_mouth.png",
       "rect": [361, 468, 82, 59],
       "color_shift_rgb": [
        2.0,
        7.0,
        10.1
       ]
      },
      "brow": {
       "file": "patches/wave_d1/face_awkward_brow.png",
       "rect": [301, 380, 180, 31],
       "color_shift_rgb": [
        1.8,
        6.8,
        10.3
       ]
      }
     },
     "doubt": {
      "blush": {
       "file": "patches/wave_d1/face_doubt_blush.png",
       "rect": [291, 441, 217, 92],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/wave_d1/face_doubt_eyes.png",
       "rect": [283, 376, 231, 103],
       "color_shift_rgb": [
        2.4,
        7.3,
        11.7
       ]
      },
      "mouth": {
       "file": "patches/wave_d1/face_doubt_mouth.png",
       "rect": [361, 468, 82, 59],
       "color_shift_rgb": [
        3.0,
        7.1,
        12.3
       ]
      },
      "brow": {
       "file": "patches/wave_d1/face_doubt_brow.png",
       "rect": [308, 367, 169, 37],
       "color_shift_rgb": [
        2.2,
        7.5,
        12.2
       ]
      }
     },
     "flat": {
      "blush": {
       "file": "patches/wave_d1/face_flat_blush.png",
       "rect": [291, 441, 217, 92],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/wave_d1/face_flat_eyes.png",
       "rect": [283, 376, 231, 109],
       "color_shift_rgb": [
        3.0,
        10.5,
        13.0
       ]
      },
      "mouth": {
       "file": "patches/wave_d1/face_flat_mouth.png",
       "rect": [361, 468, 82, 59],
       "color_shift_rgb": [
        3.0,
        7.0,
        12.1
       ]
      },
      "brow": {
       "file": "patches/wave_d1/face_flat_brow.png",
       "rect": [297, 372, 195, 33],
       "color_shift_rgb": [
        2.9,
        7.0,
        10.4
       ]
      }
     },
     "happy": {
      "eyes": {
       "file": "patches/wave_d1/face_happy_eyes.png",
       "rect": [283, 377, 231, 106],
       "color_shift_rgb": [
        2.1,
        8.5,
        11.5
       ]
      },
      "mouth": {
       "file": "patches/wave_d1/face_happy_mouth.png",
       "rect": [359, 456, 89, 75],
       "color_shift_rgb": [
        2.1,
        7.3,
        11.1
       ]
      }
     },
     "love": {
      "blush": {
       "file": "patches/wave_d1/face_love_blush.png",
       "rect": [291, 441, 217, 92],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/wave_d1/face_love_eyes.png",
       "rect": [283, 378, 231, 114],
       "color_shift_rgb": [
        2.1,
        10.0,
        14.0
       ]
      },
      "mouth": {
       "file": "patches/wave_d1/face_love_mouth.png",
       "rect": [361, 468, 82, 59],
       "color_shift_rgb": [
        2.0,
        9.6,
        13.6
       ]
      },
      "brow": {
       "file": "patches/wave_d1/face_love_brow.png",
       "rect": [298, 352, 173, 27],
       "color_shift_rgb": [
        1.3,
        7.5,
        10.8
       ]
      }
     },
     "squeeze": {
      "blush": {
       "file": "patches/wave_d1/face_squeeze_blush.png",
       "rect": [291, 441, 217, 92],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/wave_d1/face_squeeze_eyes.png",
       "rect": [283, 379, 231, 105],
       "color_shift_rgb": [
        2.9,
        7.5,
        9.6
       ]
      },
      "mouth": {
       "file": "patches/wave_d1/face_squeeze_mouth.png",
       "rect": [361, 468, 82, 59],
       "color_shift_rgb": [
        2.8,
        6.5,
        10.0
       ]
      },
      "brow": {
       "file": "patches/wave_d1/face_squeeze_brow.png",
       "rect": [318, 380, 152, 37],
       "color_shift_rgb": [
        2.9,
        7.1,
        10.2
       ]
      }
     },
     "surprise": {
      "blush": {
       "file": "patches/wave_d1/face_surprise_blush.png",
       "rect": [291, 441, 217, 92],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/wave_d1/face_surprise_eyes.png",
       "rect": [283, 378, 231, 107],
       "color_shift_rgb": [
        2.2,
        7.1,
        10.4
       ]
      },
      "mouth": {
       "file": "patches/wave_d1/face_surprise_mouth.png",
       "rect": [361, 468, 82, 59],
       "color_shift_rgb": [
        2.4,
        7.0,
        10.9
       ]
      },
      "brow": {
       "file": "patches/wave_d1/face_surprise_brow.png",
       "rect": [295, 354, 187, 36],
       "color_shift_rgb": [
        2.0,
        7.3,
        12.2
       ]
      }
     }
    },
    "eyeSkin": {
     "file": "patches/wave_d1/eye_skin.png",
     "rect": [283, 375, 225, 117]
    },
    "browErase": {
     "file": "patches/wave_d1/brow_erase.png",
     "rect": [186, 156, 436, 846],
     "source": "noBrow"
    }
   },
   "browOk": false,
   "browRead": {
    "line_px": 2.83,
    "doubled": 0.356,
    "shift_px": 0.47,
    "region_px": 51863
   },
   "facePaste": true,
   "browSwap": false,
   "faceBlank": false,
   "faceClass": 2
  },
  "shrug": {
   "label": "摊手·正式 s1（幅度最大处，第 20 帧）",
   "frame": "frames/shrug_loop/20.png",
   "bbox": [148, 132, 684, 1002],
   "margin": [148, 132, 148, 102],
   "patches": {
    "align": {
     "scale": 0.3406,
     "rotate_deg": -0.8,
     "translate": [
      40.5,
      79.7
     ],
     "matches": 89,
     "inliers": 46,
     "residual_px": 0.79
    },
    "mouth": {
     "closed": {
      "file": "patches/shrug/mouth_closed.png",
      "rect": [371, 468, 81, 57],
      "color_shift_rgb": [
       6.0,
       9.0,
       14.0
      ],
      "skin_samples": 988,
      "occluded_px": 0
     },
     "small": {
      "file": "patches/shrug/mouth_small.png",
      "rect": [371, 468, 81, 57],
      "color_shift_rgb": [
       6.0,
       9.0,
       14.0
      ],
      "skin_samples": 988,
      "occluded_px": 0
     },
     "big": {
      "file": "patches/shrug/mouth_big.png",
      "rect": [371, 468, 81, 57],
      "color_shift_rgb": [
       6.0,
       9.0,
       14.0
      ],
      "skin_samples": 988,
      "occluded_px": 0
     },
     "smile": {
      "file": "patches/shrug/mouth_smile.png",
      "rect": [371, 468, 81, 57],
      "color_shift_rgb": [
       6.0,
       9.0,
       14.0
      ],
      "skin_samples": 988,
      "occluded_px": 0
     }
    },
    "blink": {
     "file": "patches/shrug/blink.png",
     "rect": [283, 380, 258, 101],
     "color_shift_rgb": [
      6.0,
      7.0,
      11.0
     ],
     "skin_samples": 2026,
     "occluded_px": 0
    },
    "clean": {
     "file": "patches/shrug/clean.png",
     "rect": [283, 352, 258, 173],
     "color_shift_rgb": [
      6.0,
      7.0,
      12.0
     ],
     "skin_samples": 3194,
     "occluded_px": 0
    },
    "face": {
     "angry": {
      "blush": {
       "file": "patches/shrug/face_angry_blush.png",
       "rect": [300, 442, 224, 85],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/shrug/face_angry_eyes.png",
       "rect": [297, 381, 232, 99],
       "color_shift_rgb": [
        2.0,
        8.7,
        14.1
       ]
      },
      "mouth": {
       "file": "patches/shrug/face_angry_mouth.png",
       "rect": [363, 461, 103, 64],
       "color_shift_rgb": [
        2.2,
        8.0,
        13.8
       ]
      },
      "brow": {
       "file": "patches/shrug/face_angry_brow.png",
       "rect": [325, 368, 179, 37],
       "color_shift_rgb": [
        2.3,
        6.7,
        13.0
       ]
      }
     },
     "awkward": {
      "blush": {
       "file": "patches/shrug/face_awkward_blush.png",
       "rect": [300, 442, 224, 85],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/shrug/face_awkward_eyes.png",
       "rect": [297, 381, 232, 94],
       "color_shift_rgb": [
        1.3,
        7.6,
        11.5
       ]
      },
      "mouth": {
       "file": "patches/shrug/face_awkward_mouth.png",
       "rect": [371, 468, 81, 57],
       "color_shift_rgb": [
        1.7,
        7.0,
        11.0
       ]
      },
      "brow": {
       "file": "patches/shrug/face_awkward_brow.png",
       "rect": [317, 378, 181, 22],
       "color_shift_rgb": [
        1.7,
        5.6,
        11.0
       ]
      }
     },
     "doubt": {
      "blush": {
       "file": "patches/shrug/face_doubt_blush.png",
       "rect": [300, 442, 224, 85],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/shrug/face_doubt_eyes.png",
       "rect": [297, 380, 232, 95],
       "color_shift_rgb": [
        1.8,
        7.4,
        12.8
       ]
      },
      "mouth": {
       "file": "patches/shrug/face_doubt_mouth.png",
       "rect": [371, 468, 81, 57],
       "color_shift_rgb": [
        2.2,
        7.2,
        13.0
       ]
      },
      "brow": {
       "file": "patches/shrug/face_doubt_brow.png",
       "rect": [325, 370, 170, 28],
       "color_shift_rgb": [
        2.1,
        6.7,
        13.1
       ]
      }
     },
     "flat": {
      "blush": {
       "file": "patches/shrug/face_flat_blush.png",
       "rect": [300, 442, 224, 85],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/shrug/face_flat_eyes.png",
       "rect": [297, 380, 232, 98],
       "color_shift_rgb": [
        2.1,
        9.9,
        14.0
       ]
      },
      "mouth": {
       "file": "patches/shrug/face_flat_mouth.png",
       "rect": [371, 468, 81, 57],
       "color_shift_rgb": [
        2.3,
        7.1,
        13.0
       ]
      },
      "brow": {
       "file": "patches/shrug/face_flat_brow.png",
       "rect": [313, 375, 198, 21],
       "color_shift_rgb": [
        2.3,
        5.9,
        11.8
       ]
      }
     },
     "happy": {
      "eyes": {
       "file": "patches/shrug/face_happy_eyes.png",
       "rect": [297, 380, 232, 97],
       "color_shift_rgb": [
        1.5,
        8.6,
        12.4
       ]
      },
      "mouth": {
       "file": "patches/shrug/face_happy_mouth.png",
       "rect": [370, 456, 87, 72],
       "color_shift_rgb": [
        2.0,
        7.1,
        11.8
       ]
      }
     },
     "love": {
      "blush": {
       "file": "patches/shrug/face_love_blush.png",
       "rect": [300, 442, 224, 85],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/shrug/face_love_eyes.png",
       "rect": [297, 382, 232, 101],
       "color_shift_rgb": [
        1.8,
        8.9,
        14.1
       ]
      },
      "mouth": {
       "file": "patches/shrug/face_love_mouth.png",
       "rect": [371, 468, 81, 57],
       "color_shift_rgb": [
        1.6,
        9.4,
        14.5
       ]
      },
      "brow": {
       "file": "patches/shrug/face_love_brow.png",
       "rect": [316, 353, 175, 15],
       "color_shift_rgb": [
        1.7,
        3.8,
        9.5
       ]
      }
     },
     "squeeze": {
      "blush": {
       "file": "patches/shrug/face_squeeze_blush.png",
       "rect": [300, 442, 224, 85],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/shrug/face_squeeze_eyes.png",
       "rect": [297, 382, 232, 96],
       "color_shift_rgb": [
        2.0,
        7.7,
        11.0
       ]
      },
      "mouth": {
       "file": "patches/shrug/face_squeeze_mouth.png",
       "rect": [371, 468, 81, 57],
       "color_shift_rgb": [
        2.2,
        6.6,
        10.4
       ]
      },
      "brow": {
       "file": "patches/shrug/face_squeeze_brow.png",
       "rect": [335, 383, 153, 29],
       "color_shift_rgb": [
        2.8,
        6.0,
        11.0
       ]
      }
     },
     "surprise": {
      "blush": {
       "file": "patches/shrug/face_surprise_blush.png",
       "rect": [300, 442, 224, 85],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/shrug/face_surprise_eyes.png",
       "rect": [297, 382, 232, 96],
       "color_shift_rgb": [
        1.9,
        7.1,
        11.5
       ]
      },
      "mouth": {
       "file": "patches/shrug/face_surprise_mouth.png",
       "rect": [371, 467, 81, 58],
       "color_shift_rgb": [
        2.0,
        7.0,
        11.2
       ]
      },
      "brow": {
       "file": "patches/shrug/face_surprise_brow.png",
       "rect": [313, 358, 189, 25],
       "color_shift_rgb": [
        1.6,
        6.1,
        12.0
       ]
      }
     }
    },
    "eyeSkin": {
     "file": "patches/shrug/eye_skin.png",
     "rect": [297, 378, 231, 105]
    },
    "browErase": {
     "file": "patches/shrug/brow_erase.png",
     "rect": [197, 155, 437, 847],
     "source": "noBrow"
    }
   },
   "browOk": false,
   "browRead": {
    "line_px": 1.83,
    "doubled": 0.188,
    "shift_px": 0.65,
    "region_px": 47464
   },
   "facePaste": true,
   "browSwap": false,
   "faceBlank": false,
   "faceClass": 2
  },
  "shrug_f2": {
   "label": "摊手·正式 s2（幅度最大处，第 21 帧）",
   "frame": "frames/shrug_f2_loop/21.png",
   "bbox": [154, 136, 680, 1002],
   "margin": [154, 136, 152, 102],
   "patches": {
    "align": {
     "scale": 0.3411,
     "rotate_deg": 2.37,
     "translate": [
      63.2,
      57.9
     ],
     "matches": 95,
     "inliers": 62,
     "residual_px": 0.82
    },
    "mouth": {
     "closed": {
      "file": "patches/shrug_f2/mouth_closed.png",
      "rect": [371, 466, 82, 58],
      "color_shift_rgb": [
       4.0,
       6.0,
       10.0
      ],
      "skin_samples": 1005,
      "occluded_px": 0
     },
     "small": {
      "file": "patches/shrug_f2/mouth_small.png",
      "rect": [371, 466, 82, 58],
      "color_shift_rgb": [
       4.0,
       6.0,
       10.0
      ],
      "skin_samples": 1005,
      "occluded_px": 0
     },
     "big": {
      "file": "patches/shrug_f2/mouth_big.png",
      "rect": [371, 466, 82, 58],
      "color_shift_rgb": [
       4.0,
       6.0,
       10.0
      ],
      "skin_samples": 1005,
      "occluded_px": 0
     },
     "smile": {
      "file": "patches/shrug_f2/mouth_smile.png",
      "rect": [371, 466, 82, 58],
      "color_shift_rgb": [
       4.0,
       6.0,
       10.0
      ],
      "skin_samples": 1005,
      "occluded_px": 0
     }
    },
    "blink": {
     "file": "patches/shrug_f2/blink.png",
     "rect": [286, 377, 259, 105],
     "color_shift_rgb": [
      4.0,
      4.0,
      7.0
     ],
     "skin_samples": 2047,
     "occluded_px": 0
    },
    "clean": {
     "file": "patches/shrug_f2/clean.png",
     "rect": [286, 349, 259, 175],
     "color_shift_rgb": [
      4.0,
      4.0,
      8.0
     ],
     "skin_samples": 3213,
     "occluded_px": 0
    },
    "face": {
     "angry": {
      "blush": {
       "file": "patches/shrug_f2/face_angry_blush.png",
       "rect": [300, 436, 225, 90],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/shrug_f2/face_angry_eyes.png",
       "rect": [300, 382, 232, 98],
       "color_shift_rgb": [
        -0.5,
        5.1,
        9.9
       ]
      },
      "mouth": {
       "file": "patches/shrug_f2/face_angry_mouth.png",
       "rect": [362, 461, 103, 63],
       "color_shift_rgb": [
        0.1,
        4.9,
        9.2
       ]
      },
      "brow": {
       "file": "patches/shrug_f2/face_angry_brow.png",
       "rect": [331, 370, 180, 34],
       "color_shift_rgb": [
        0.2,
        4.0,
        8.4
       ]
      }
     },
     "awkward": {
      "blush": {
       "file": "patches/shrug_f2/face_awkward_blush.png",
       "rect": [300, 436, 225, 90],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/shrug_f2/face_awkward_eyes.png",
       "rect": [300, 382, 232, 94],
       "color_shift_rgb": [
        -1.1,
        4.1,
        7.0
       ]
      },
      "mouth": {
       "file": "patches/shrug_f2/face_awkward_mouth.png",
       "rect": [371, 466, 82, 58],
       "color_shift_rgb": [
        -0.8,
        3.8,
        6.1
       ]
      },
      "brow": {
       "file": "patches/shrug_f2/face_awkward_brow.png",
       "rect": [322, 375, 182, 27],
       "color_shift_rgb": [
        -1.0,
        2.9,
        6.4
       ]
      }
     },
     "doubt": {
      "blush": {
       "file": "patches/shrug_f2/face_doubt_blush.png",
       "rect": [300, 436, 225, 90],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/shrug_f2/face_doubt_eyes.png",
       "rect": [300, 382, 232, 98],
       "color_shift_rgb": [
        -0.7,
        4.0,
        8.1
       ]
      },
      "mouth": {
       "file": "patches/shrug_f2/face_doubt_mouth.png",
       "rect": [371, 466, 82, 58],
       "color_shift_rgb": [
        0.0,
        4.0,
        8.4
       ]
      },
      "brow": {
       "file": "patches/shrug_f2/face_doubt_brow.png",
       "rect": [332, 368, 170, 27],
       "color_shift_rgb": [
        0.3,
        3.8,
        8.7
       ]
      }
     },
     "flat": {
      "blush": {
       "file": "patches/shrug_f2/face_flat_blush.png",
       "rect": [300, 436, 225, 90],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/shrug_f2/face_flat_eyes.png",
       "rect": [300, 381, 232, 99],
       "color_shift_rgb": [
        -0.0,
        6.9,
        10.0
       ]
      },
      "mouth": {
       "file": "patches/shrug_f2/face_flat_mouth.png",
       "rect": [371, 466, 82, 58],
       "color_shift_rgb": [
        0.0,
        3.9,
        8.1
       ]
      },
      "brow": {
       "file": "patches/shrug_f2/face_flat_brow.png",
       "rect": [319, 374, 198, 21],
       "color_shift_rgb": [
        0.3,
        3.0,
        7.6
       ]
      }
     },
     "happy": {
      "eyes": {
       "file": "patches/shrug_f2/face_happy_eyes.png",
       "rect": [300, 382, 232, 98],
       "color_shift_rgb": [
        -1.0,
        5.0,
        8.0
       ]
      },
      "mouth": {
       "file": "patches/shrug_f2/face_happy_mouth.png",
       "rect": [370, 454, 89, 74],
       "color_shift_rgb": [
        -0.3,
        4.2,
        7.2
       ]
      }
     },
     "love": {
      "blush": {
       "file": "patches/shrug_f2/face_love_blush.png",
       "rect": [300, 436, 225, 90],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/shrug_f2/face_love_eyes.png",
       "rect": [300, 384, 232, 100],
       "color_shift_rgb": [
        -0.7,
        5.8,
        9.8
       ]
      },
      "mouth": {
       "file": "patches/shrug_f2/face_love_mouth.png",
       "rect": [371, 466, 82, 58],
       "color_shift_rgb": [
        -0.9,
        6.5,
        9.9
       ]
      },
      "brow": {
       "file": "patches/shrug_f2/face_love_brow.png",
       "rect": [323, 350, 175, 19],
       "color_shift_rgb": [
        -0.6,
        2.5,
        6.7
       ]
      }
     },
     "squeeze": {
      "blush": {
       "file": "patches/shrug_f2/face_squeeze_blush.png",
       "rect": [300, 436, 225, 90],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/shrug_f2/face_squeeze_eyes.png",
       "rect": [300, 382, 232, 93],
       "color_shift_rgb": [
        -0.3,
        4.3,
        6.5
       ]
      },
      "mouth": {
       "file": "patches/shrug_f2/face_squeeze_mouth.png",
       "rect": [371, 466, 82, 58],
       "color_shift_rgb": [
        -0.0,
        3.3,
        6.0
       ]
      },
      "brow": {
       "file": "patches/shrug_f2/face_squeeze_brow.png",
       "rect": [340, 379, 154, 31],
       "color_shift_rgb": [
        0.9,
        3.2,
        6.2
       ]
      }
     },
     "surprise": {
      "blush": {
       "file": "patches/shrug_f2/face_surprise_blush.png",
       "rect": [300, 436, 225, 90],
       "blend": "multiply"
      },
      "eyes": {
       "file": "patches/shrug_f2/face_surprise_eyes.png",
       "rect": [300, 382, 232, 92],
       "color_shift_rgb": [
        -0.8,
        3.8,
        7.0
       ]
      },
      "mouth": {
       "file": "patches/shrug_f2/face_surprise_mouth.png",
       "rect": [371, 466, 82, 58],
       "color_shift_rgb": [
        -0.2,
        3.9,
        6.9
       ]
      },
      "brow": {
       "file": "patches/shrug_f2/face_surprise_brow.png",
       "rect": [320, 354, 190, 30],
       "color_shift_rgb": [
        -0.8,
        3.3,
        7.7
       ]
      }
     }
    },
    "eyeSkin": {
     "file": "patches/shrug_f2/eye_skin.png",
     "rect": [301, 375, 231, 109]
    },
    "browErase": {
     "file": "patches/shrug_f2/brow_erase.png",
     "rect": [196, 141, 451, 861],
     "source": "noBrow"
    }
   },
   "browOk": false,
   "browRead": {
    "line_px": 2.84,
    "doubled": 0.311,
    "shift_px": 0.36,
    "region_px": 50195
   },
   "facePaste": true,
   "browSwap": false,
   "faceBlank": false,
   "faceClass": 2
  }
 },
 "clips": {
  "think_loop": {
   "label": "思考·正式 s1（一段做完去和回）",
   "from": "idle",
   "to": "idle",
   "fps": 16,
   "frames": [
    "frames/think_loop/00.png",
    "frames/think_loop/01.png",
    "frames/think_loop/02.png",
    "frames/think_loop/03.png",
    "frames/think_loop/04.png",
    "frames/think_loop/05.png",
    "frames/think_loop/06.png",
    "frames/think_loop/07.png",
    "frames/think_loop/08.png",
    "frames/think_loop/09.png",
    "frames/think_loop/10.png",
    "frames/think_loop/11.png",
    "frames/think_loop/12.png",
    "frames/think_loop/13.png",
    "frames/think_loop/14.png",
    "frames/think_loop/15.png",
    "frames/think_loop/16.png",
    "frames/think_loop/17.png",
    "frames/think_loop/18.png",
    "frames/think_loop/19.png",
    "frames/think_loop/20.png",
    "frames/think_loop/21.png",
    "frames/think_loop/22.png",
    "frames/think_loop/23.png",
    "frames/think_loop/24.png",
    "frames/think_loop/25.png",
    "frames/think_loop/26.png",
    "frames/think_loop/27.png",
    "frames/think_loop/28.png",
    "frames/think_loop/29.png",
    "frames/think_loop/30.png",
    "frames/think_loop/31.png",
    "frames/think_loop/32.png",
    "frames/think_loop/33.png",
    "frames/think_loop/34.png",
    "frames/think_loop/35.png",
    "frames/think_loop/36.png",
    "frames/think_loop/37.png",
    "frames/think_loop/38.png",
    "frames/think_loop/39.png",
    "frames/think_loop/40.png",
    "frames/think_loop/41.png",
    "frames/think_loop/42.png",
    "frames/think_loop/43.png",
    "frames/think_loop/44.png",
    "frames/think_loop/45.png",
    "frames/think_loop/46.png",
    "frames/think_loop/47.png",
    "frames/think_loop/48.png"
   ],
   "apex": 21,
   "away_pct": [
    0.0,
    1.19,
    1.57,
    1.99,
    2.95,
    3.56,
    4.65,
    5.23,
    6.03,
    6.53,
    7.22,
    7.67,
    8.31,
    8.66,
    8.97,
    9.09,
    9.14,
    9.17,
    9.15,
    9.15,
    9.16,
    9.18,
    9.18,
    9.18,
    9.18,
    9.16,
    9.11,
    9.0,
    8.9,
    8.51,
    8.18,
    7.55,
    6.73,
    6.1,
    5.09,
    4.43,
    3.09,
    2.31,
    1.48,
    1.32,
    1.19,
    1.14,
    1.13,
    1.14,
    1.14,
    1.13,
    1.13,
    1.13,
    0.0
   ],
   "frameBBox": [
    [183, 137, 649, 1000],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [182, 134, 646, 1002],
    [182, 134, 646, 1002],
    [182, 134, 646, 1002],
    [180, 134, 644, 1002],
    [180, 134, 644, 1002],
    [180, 134, 642, 1002],
    [178, 134, 642, 1002],
    [178, 134, 642, 1002],
    [176, 134, 640, 1002],
    [176, 134, 640, 1002],
    [176, 134, 640, 1002],
    [176, 134, 638, 1002],
    [176, 134, 638, 1002],
    [176, 134, 638, 1002],
    [176, 134, 638, 1002],
    [176, 134, 638, 1002],
    [176, 134, 638, 1002],
    [176, 134, 638, 1002],
    [176, 134, 638, 1002],
    [176, 134, 638, 1002],
    [176, 134, 638, 1002],
    [176, 134, 638, 1002],
    [176, 134, 638, 1002],
    [176, 134, 638, 1002],
    [176, 134, 640, 1002],
    [176, 134, 640, 1002],
    [176, 134, 640, 1002],
    [178, 134, 642, 1002],
    [178, 134, 642, 1002],
    [180, 134, 642, 1002],
    [180, 134, 644, 1002],
    [180, 134, 644, 1002],
    [182, 134, 646, 1002],
    [182, 134, 646, 1002],
    [182, 134, 646, 1002],
    [184, 134, 646, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 136, 648, 1002],
    [183, 137, 649, 1000]
   ],
   "bbox": [176, 134, 649, 1002],
   "margin": [176, 134, 183, 102],
   "active": [
    [
     2,
     38
    ]
   ],
   "dupes": [
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26
   ],
   "arc": [
    0.0,
    0.0135,
    0.0289,
    0.0539,
    0.0971,
    0.1312,
    0.1942,
    0.2342,
    0.2938,
    0.3246,
    0.3857,
    0.4259,
    0.4814,
    0.5023,
    0.5139,
    0.5139,
    0.5139,
    0.5139,
    0.5139,
    0.5139,
    0.5139,
    0.5139,
    0.5139,
    0.5139,
    0.5139,
    0.5139,
    0.5139,
    0.5244,
    0.532,
    0.5669,
    0.5983,
    0.6566,
    0.7229,
    0.7658,
    0.8298,
    0.8659,
    0.927,
    0.9571,
    0.9874,
    0.9874,
    0.9874,
    0.9874,
    0.9874,
    0.9874,
    0.9874,
    0.9874,
    0.9874,
    0.9874,
    1.0
   ],
   "minSeconds": 0.6,
   "browOk": true,
   "browRead": {
    "line_px_median": 0.11,
    "line_px_max": 0.12,
    "frames_over": 0,
    "longest_run_over": 0,
    "per_frame_line_px": [
     0.02,
     0.08,
     0.08,
     0.09,
     0.08,
     0.1,
     0.11,
     0.12,
     0.12,
     0.12,
     0.11,
     0.12,
     0.12,
     0.11,
     0.11,
     0.11,
     0.12,
     0.11,
     0.11,
     0.11,
     0.11,
     0.1,
     0.11,
     0.11,
     0.11,
     0.12,
     0.12,
     0.11,
     0.11,
     0.11,
     0.1,
     0.12,
     0.12,
     0.11,
     0.12,
     0.1,
     0.11,
     0.1,
     0.09,
     0.08,
     0.09,
     0.09,
     0.08,
     0.09,
     0.09,
     0.09,
     0.09,
     0.08,
     0.02
    ]
   },
   "facePaste": true,
   "browSwap": true,
   "faceBlank": false,
   "faceClass": 1,
   "attrManual": [
    "browSwap"
   ]
  },
  "think_in": {
   "label": "归位 → 思考·正式 s1",
   "from": "idle",
   "to": "think",
   "fps": 16,
   "frames": [
    "frames/think_loop/00.png",
    "frames/think_loop/01.png",
    "frames/think_loop/02.png",
    "frames/think_loop/03.png",
    "frames/think_loop/04.png",
    "frames/think_loop/05.png",
    "frames/think_loop/06.png",
    "frames/think_loop/07.png",
    "frames/think_loop/08.png",
    "frames/think_loop/09.png",
    "frames/think_loop/10.png",
    "frames/think_loop/11.png",
    "frames/think_loop/12.png",
    "frames/think_loop/13.png",
    "frames/think_loop/14.png",
    "frames/think_loop/15.png",
    "frames/think_loop/16.png",
    "frames/think_loop/17.png",
    "frames/think_loop/18.png",
    "frames/think_loop/19.png",
    "frames/think_loop/20.png",
    "frames/think_loop/21.png"
   ],
   "frameBBox": [
    [183, 137, 649, 1000],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [182, 134, 646, 1002],
    [182, 134, 646, 1002],
    [182, 134, 646, 1002],
    [180, 134, 644, 1002],
    [180, 134, 644, 1002],
    [180, 134, 642, 1002],
    [178, 134, 642, 1002],
    [178, 134, 642, 1002],
    [176, 134, 640, 1002],
    [176, 134, 640, 1002],
    [176, 134, 640, 1002],
    [176, 134, 638, 1002],
    [176, 134, 638, 1002],
    [176, 134, 638, 1002],
    [176, 134, 638, 1002],
    [176, 134, 638, 1002],
    [176, 134, 638, 1002],
    [176, 134, 638, 1002]
   ],
   "bbox": [176, 134, 649, 1002],
   "margin": [176, 134, 183, 102],
   "active": [
    [
     2,
     20
    ]
   ],
   "dupes": [
    15,
    16,
    17,
    18,
    19,
    20
   ],
   "arc": [
    0.0,
    0.0461,
    0.0754,
    0.1231,
    0.2054,
    0.2704,
    0.3906,
    0.4667,
    0.5804,
    0.6391,
    0.7555,
    0.8321,
    0.938,
    0.9778,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0
   ],
   "minSeconds": 0.3,
   "browOk": true,
   "browRead": {
    "line_px_median": 0.11,
    "line_px_max": 0.12,
    "frames_over": 0,
    "longest_run_over": 0,
    "per_frame_line_px": [
     0.02,
     0.08,
     0.08,
     0.09,
     0.08,
     0.1,
     0.11,
     0.12,
     0.12,
     0.12,
     0.11,
     0.12,
     0.12,
     0.11,
     0.11,
     0.11,
     0.12,
     0.11,
     0.11,
     0.11,
     0.11,
     0.1
    ]
   },
   "facePaste": true,
   "browSwap": true,
   "faceBlank": false,
   "faceClass": 1,
   "attrManual": [
    "browSwap"
   ]
  },
  "think_out": {
   "label": "思考·正式 s1 → 归位",
   "from": "think",
   "to": "idle",
   "fps": 16,
   "frames": [
    "frames/think_loop/21.png",
    "frames/think_loop/22.png",
    "frames/think_loop/23.png",
    "frames/think_loop/24.png",
    "frames/think_loop/25.png",
    "frames/think_loop/26.png",
    "frames/think_loop/27.png",
    "frames/think_loop/28.png",
    "frames/think_loop/29.png",
    "frames/think_loop/30.png",
    "frames/think_loop/31.png",
    "frames/think_loop/32.png",
    "frames/think_loop/33.png",
    "frames/think_loop/34.png",
    "frames/think_loop/35.png",
    "frames/think_loop/36.png",
    "frames/think_loop/37.png",
    "frames/think_loop/38.png",
    "frames/think_loop/39.png",
    "frames/think_loop/40.png",
    "frames/think_loop/41.png",
    "frames/think_loop/42.png",
    "frames/think_loop/43.png",
    "frames/think_loop/44.png",
    "frames/think_loop/45.png",
    "frames/think_loop/46.png",
    "frames/think_loop/47.png",
    "frames/think_loop/48.png"
   ],
   "frameBBox": [
    [176, 134, 638, 1002],
    [176, 134, 638, 1002],
    [176, 134, 638, 1002],
    [176, 134, 638, 1002],
    [176, 134, 638, 1002],
    [176, 134, 638, 1002],
    [176, 134, 638, 1002],
    [176, 134, 640, 1002],
    [176, 134, 640, 1002],
    [176, 134, 640, 1002],
    [178, 134, 642, 1002],
    [178, 134, 642, 1002],
    [180, 134, 642, 1002],
    [180, 134, 644, 1002],
    [180, 134, 644, 1002],
    [182, 134, 646, 1002],
    [182, 134, 646, 1002],
    [182, 134, 646, 1002],
    [184, 134, 646, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 136, 648, 1002],
    [183, 137, 649, 1000]
   ],
   "bbox": [176, 134, 649, 1002],
   "margin": [176, 134, 183, 102],
   "active": [
    [
     1,
     17
    ]
   ],
   "dupes": [
    1,
    2,
    3,
    4,
    5
   ],
   "arc": [
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.022,
    0.0381,
    0.1118,
    0.1782,
    0.3013,
    0.4414,
    0.532,
    0.6672,
    0.7434,
    0.8724,
    0.9359,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0
   ],
   "minSeconds": 0.3,
   "browOk": true,
   "browRead": {
    "line_px_median": 0.1,
    "line_px_max": 0.12,
    "frames_over": 0,
    "longest_run_over": 0,
    "per_frame_line_px": [
     0.1,
     0.11,
     0.11,
     0.11,
     0.12,
     0.12,
     0.11,
     0.11,
     0.11,
     0.1,
     0.12,
     0.12,
     0.11,
     0.12,
     0.1,
     0.11,
     0.1,
     0.09,
     0.08,
     0.09,
     0.09,
     0.08,
     0.09,
     0.09,
     0.09,
     0.09,
     0.08,
     0.02
    ]
   },
   "facePaste": true,
   "browSwap": true,
   "faceBlank": false,
   "faceClass": 1,
   "attrManual": [
    "browSwap"
   ]
  },
  "think_f2_loop": {
   "label": "思考·正式 s2（一段做完去和回）",
   "from": "idle",
   "to": "idle",
   "fps": 16,
   "frames": [
    "frames/think_f2_loop/00.png",
    "frames/think_f2_loop/01.png",
    "frames/think_f2_loop/02.png",
    "frames/think_f2_loop/03.png",
    "frames/think_f2_loop/04.png",
    "frames/think_f2_loop/05.png",
    "frames/think_f2_loop/06.png",
    "frames/think_f2_loop/07.png",
    "frames/think_f2_loop/08.png",
    "frames/think_f2_loop/09.png",
    "frames/think_f2_loop/10.png",
    "frames/think_f2_loop/11.png",
    "frames/think_f2_loop/12.png",
    "frames/think_f2_loop/13.png",
    "frames/think_f2_loop/14.png",
    "frames/think_f2_loop/15.png",
    "frames/think_f2_loop/16.png",
    "frames/think_f2_loop/17.png",
    "frames/think_f2_loop/18.png",
    "frames/think_f2_loop/19.png",
    "frames/think_f2_loop/20.png",
    "frames/think_f2_loop/21.png",
    "frames/think_f2_loop/22.png",
    "frames/think_f2_loop/23.png",
    "frames/think_f2_loop/24.png",
    "frames/think_f2_loop/25.png",
    "frames/think_f2_loop/26.png",
    "frames/think_f2_loop/27.png",
    "frames/think_f2_loop/28.png",
    "frames/think_f2_loop/29.png",
    "frames/think_f2_loop/30.png",
    "frames/think_f2_loop/31.png",
    "frames/think_f2_loop/32.png",
    "frames/think_f2_loop/33.png",
    "frames/think_f2_loop/34.png",
    "frames/think_f2_loop/35.png",
    "frames/think_f2_loop/36.png",
    "frames/think_f2_loop/37.png",
    "frames/think_f2_loop/38.png",
    "frames/think_f2_loop/39.png",
    "frames/think_f2_loop/40.png",
    "frames/think_f2_loop/41.png",
    "frames/think_f2_loop/42.png",
    "frames/think_f2_loop/43.png",
    "frames/think_f2_loop/44.png",
    "frames/think_f2_loop/45.png",
    "frames/think_f2_loop/46.png",
    "frames/think_f2_loop/47.png",
    "frames/think_f2_loop/48.png"
   ],
   "apex": 15,
   "away_pct": [
    0.0,
    1.2,
    1.64,
    1.91,
    2.66,
    3.17,
    4.34,
    4.89,
    5.53,
    5.78,
    5.91,
    5.93,
    5.94,
    5.96,
    5.96,
    5.96,
    5.94,
    5.94,
    5.93,
    5.89,
    5.81,
    5.57,
    5.29,
    4.67,
    4.19,
    3.47,
    3.09,
    2.21,
    1.78,
    1.32,
    1.21,
    1.1,
    1.13,
    1.14,
    1.14,
    1.14,
    1.15,
    1.14,
    1.13,
    1.13,
    1.14,
    1.14,
    1.13,
    1.13,
    1.14,
    1.12,
    1.11,
    1.12,
    0.0
   ],
   "frameBBox": [
    [183, 137, 649, 1000],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 138, 648, 1002],
    [184, 138, 648, 1002],
    [184, 140, 648, 1002],
    [184, 140, 648, 1002],
    [184, 140, 648, 1002],
    [184, 140, 648, 1002],
    [184, 140, 648, 1002],
    [184, 140, 648, 1002],
    [184, 140, 648, 1002],
    [184, 140, 648, 1002],
    [184, 140, 648, 1002],
    [184, 140, 648, 1002],
    [184, 140, 648, 1002],
    [184, 140, 648, 1002],
    [184, 140, 648, 1002],
    [184, 138, 648, 1002],
    [184, 138, 648, 1002],
    [184, 138, 648, 1002],
    [184, 138, 648, 1002],
    [184, 138, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [183, 137, 649, 1000]
   ],
   "bbox": [183, 134, 649, 1002],
   "margin": [183, 134, 183, 102],
   "active": [
    [
     2,
     29
    ]
   ],
   "dupes": [
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19
   ],
   "arc": [
    0.0,
    0.0041,
    0.0362,
    0.0688,
    0.1359,
    0.1863,
    0.2829,
    0.3401,
    0.413,
    0.4515,
    0.4824,
    0.4837,
    0.4847,
    0.4847,
    0.4847,
    0.4847,
    0.4847,
    0.4847,
    0.4847,
    0.4937,
    0.5055,
    0.5476,
    0.5942,
    0.6737,
    0.7434,
    0.8199,
    0.8667,
    0.9185,
    0.9495,
    0.9818,
    0.9903,
    0.9973,
    0.9973,
    0.9973,
    0.9973,
    0.9973,
    0.9973,
    0.9973,
    0.9973,
    0.9973,
    0.9973,
    0.9973,
    0.9973,
    0.9973,
    0.9973,
    0.9973,
    0.9973,
    0.9973,
    1.0
   ],
   "minSeconds": 0.6,
   "browOk": true,
   "browRead": {
    "line_px_median": 0.09,
    "line_px_max": 0.48,
    "frames_over": 0,
    "longest_run_over": 0,
    "per_frame_line_px": [
     0.02,
     0.07,
     0.07,
     0.08,
     0.12,
     0.2,
     0.39,
     0.48,
     0.44,
     0.4,
     0.4,
     0.4,
     0.4,
     0.4,
     0.41,
     0.4,
     0.41,
     0.42,
     0.42,
     0.41,
     0.4,
     0.35,
     0.33,
     0.33,
     0.38,
     0.2,
     0.15,
     0.11,
     0.09,
     0.08,
     0.07,
     0.07,
     0.09,
     0.08,
     0.08,
     0.08,
     0.08,
     0.09,
     0.09,
     0.08,
     0.09,
     0.09,
     0.08,
     0.08,
     0.09,
     0.09,
     0.08,
     0.08,
     0.02
    ]
   },
   "facePaste": true,
   "browSwap": true,
   "faceBlank": false,
   "faceClass": 1,
   "attrManual": [
    "browSwap"
   ]
  },
  "think_f2_in": {
   "label": "归位 → 思考·正式 s2",
   "from": "idle",
   "to": "think_f2",
   "fps": 16,
   "frames": [
    "frames/think_f2_loop/00.png",
    "frames/think_f2_loop/01.png",
    "frames/think_f2_loop/02.png",
    "frames/think_f2_loop/03.png",
    "frames/think_f2_loop/04.png",
    "frames/think_f2_loop/05.png",
    "frames/think_f2_loop/06.png",
    "frames/think_f2_loop/07.png",
    "frames/think_f2_loop/08.png",
    "frames/think_f2_loop/09.png",
    "frames/think_f2_loop/10.png",
    "frames/think_f2_loop/11.png",
    "frames/think_f2_loop/12.png",
    "frames/think_f2_loop/13.png",
    "frames/think_f2_loop/14.png",
    "frames/think_f2_loop/15.png"
   ],
   "frameBBox": [
    [183, 137, 649, 1000],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 138, 648, 1002],
    [184, 138, 648, 1002],
    [184, 140, 648, 1002],
    [184, 140, 648, 1002],
    [184, 140, 648, 1002],
    [184, 140, 648, 1002],
    [184, 140, 648, 1002],
    [184, 140, 648, 1002],
    [184, 140, 648, 1002],
    [184, 140, 648, 1002]
   ],
   "bbox": [183, 136, 649, 1002],
   "margin": [183, 136, 183, 102],
   "active": [
    [
     2,
     14
    ]
   ],
   "dupes": [11, 12, 13, 14],
   "arc": [
    0.0,
    0.0596,
    0.1224,
    0.1861,
    0.3175,
    0.416,
    0.6052,
    0.717,
    0.8597,
    0.9349,
    0.9953,
    0.998,
    1.0,
    1.0,
    1.0,
    1.0
   ],
   "minSeconds": 0.3,
   "browOk": true,
   "browRead": {
    "line_px_median": 0.4,
    "line_px_max": 0.48,
    "frames_over": 0,
    "longest_run_over": 0,
    "per_frame_line_px": [
     0.02,
     0.07,
     0.07,
     0.08,
     0.12,
     0.2,
     0.39,
     0.48,
     0.44,
     0.4,
     0.4,
     0.4,
     0.4,
     0.4,
     0.41,
     0.4
    ]
   },
   "facePaste": true,
   "browSwap": true,
   "faceBlank": false,
   "faceClass": 1,
   "attrManual": [
    "browSwap"
   ]
  },
  "think_f2_out": {
   "label": "思考·正式 s2 → 归位",
   "from": "think_f2",
   "to": "idle",
   "fps": 16,
   "frames": [
    "frames/think_f2_loop/15.png",
    "frames/think_f2_loop/16.png",
    "frames/think_f2_loop/17.png",
    "frames/think_f2_loop/18.png",
    "frames/think_f2_loop/19.png",
    "frames/think_f2_loop/20.png",
    "frames/think_f2_loop/21.png",
    "frames/think_f2_loop/22.png",
    "frames/think_f2_loop/23.png",
    "frames/think_f2_loop/24.png",
    "frames/think_f2_loop/25.png",
    "frames/think_f2_loop/26.png",
    "frames/think_f2_loop/27.png",
    "frames/think_f2_loop/28.png",
    "frames/think_f2_loop/29.png",
    "frames/think_f2_loop/30.png",
    "frames/think_f2_loop/31.png",
    "frames/think_f2_loop/32.png",
    "frames/think_f2_loop/33.png",
    "frames/think_f2_loop/34.png",
    "frames/think_f2_loop/35.png",
    "frames/think_f2_loop/36.png",
    "frames/think_f2_loop/37.png",
    "frames/think_f2_loop/38.png",
    "frames/think_f2_loop/39.png",
    "frames/think_f2_loop/40.png",
    "frames/think_f2_loop/41.png",
    "frames/think_f2_loop/42.png",
    "frames/think_f2_loop/43.png",
    "frames/think_f2_loop/44.png",
    "frames/think_f2_loop/45.png",
    "frames/think_f2_loop/46.png",
    "frames/think_f2_loop/47.png",
    "frames/think_f2_loop/48.png"
   ],
   "frameBBox": [
    [184, 140, 648, 1002],
    [184, 140, 648, 1002],
    [184, 140, 648, 1002],
    [184, 140, 648, 1002],
    [184, 140, 648, 1002],
    [184, 140, 648, 1002],
    [184, 138, 648, 1002],
    [184, 138, 648, 1002],
    [184, 138, 648, 1002],
    [184, 138, 648, 1002],
    [184, 138, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [183, 137, 649, 1000]
   ],
   "bbox": [183, 134, 649, 1002],
   "margin": [183, 134, 183, 102],
   "active": [
    [
     1,
     14
    ]
   ],
   "dupes": [1, 2, 3, 4],
   "arc": [
    0.0,
    0.0,
    0.0,
    0.0,
    0.0176,
    0.0405,
    0.1226,
    0.2136,
    0.3686,
    0.5047,
    0.654,
    0.7452,
    0.8464,
    0.9068,
    0.9698,
    0.9864,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0
   ],
   "minSeconds": 0.3,
   "browOk": true,
   "browRead": {
    "line_px_median": 0.09,
    "line_px_max": 0.42,
    "frames_over": 0,
    "longest_run_over": 0,
    "per_frame_line_px": [
     0.4,
     0.41,
     0.42,
     0.42,
     0.41,
     0.4,
     0.35,
     0.33,
     0.33,
     0.38,
     0.2,
     0.15,
     0.11,
     0.09,
     0.08,
     0.07,
     0.07,
     0.09,
     0.08,
     0.08,
     0.08,
     0.08,
     0.09,
     0.09,
     0.08,
     0.09,
     0.09,
     0.08,
     0.08,
     0.09,
     0.09,
     0.08,
     0.08,
     0.02
    ]
   },
   "facePaste": true,
   "browSwap": true,
   "faceBlank": false,
   "faceClass": 1,
   "attrManual": [
    "browSwap"
   ]
  },
  "think_mid_loop": {
   "label": "思考·折中（一段做完去和回）",
   "from": "idle",
   "to": "idle",
   "fps": 16,
   "frames": [
    "frames/think_mid_loop/00.png",
    "frames/think_mid_loop/01.png",
    "frames/think_mid_loop/02.png",
    "frames/think_mid_loop/03.png",
    "frames/think_mid_loop/04.png",
    "frames/think_mid_loop/05.png",
    "frames/think_mid_loop/06.png",
    "frames/think_mid_loop/07.png",
    "frames/think_mid_loop/08.png",
    "frames/think_mid_loop/09.png",
    "frames/think_mid_loop/10.png",
    "frames/think_mid_loop/11.png",
    "frames/think_mid_loop/12.png",
    "frames/think_mid_loop/13.png",
    "frames/think_mid_loop/14.png",
    "frames/think_mid_loop/15.png",
    "frames/think_mid_loop/16.png",
    "frames/think_mid_loop/17.png",
    "frames/think_mid_loop/18.png",
    "frames/think_mid_loop/19.png",
    "frames/think_mid_loop/20.png",
    "frames/think_mid_loop/21.png",
    "frames/think_mid_loop/22.png",
    "frames/think_mid_loop/23.png",
    "frames/think_mid_loop/24.png",
    "frames/think_mid_loop/25.png",
    "frames/think_mid_loop/26.png",
    "frames/think_mid_loop/27.png",
    "frames/think_mid_loop/28.png",
    "frames/think_mid_loop/29.png",
    "frames/think_mid_loop/30.png",
    "frames/think_mid_loop/31.png",
    "frames/think_mid_loop/32.png",
    "frames/think_mid_loop/33.png",
    "frames/think_mid_loop/34.png",
    "frames/think_mid_loop/35.png",
    "frames/think_mid_loop/36.png",
    "frames/think_mid_loop/37.png",
    "frames/think_mid_loop/38.png",
    "frames/think_mid_loop/39.png",
    "frames/think_mid_loop/40.png",
    "frames/think_mid_loop/41.png",
    "frames/think_mid_loop/42.png",
    "frames/think_mid_loop/43.png",
    "frames/think_mid_loop/44.png",
    "frames/think_mid_loop/45.png",
    "frames/think_mid_loop/46.png",
    "frames/think_mid_loop/47.png",
    "frames/think_mid_loop/48.png"
   ],
   "apex": 23,
   "away_pct": [
    0.0,
    1.17,
    1.19,
    1.23,
    1.77,
    2.44,
    4.47,
    5.32,
    5.74,
    5.62,
    6.98,
    8.11,
    9.55,
    9.93,
    10.04,
    10.15,
    10.22,
    10.27,
    10.25,
    10.26,
    10.27,
    10.26,
    10.24,
    10.25,
    10.26,
    10.25,
    10.24,
    10.26,
    10.27,
    10.52,
    10.67,
    10.83,
    10.76,
    10.2,
    9.27,
    8.43,
    6.54,
    5.6,
    4.57,
    4.0,
    2.78,
    2.06,
    1.5,
    1.3,
    1.15,
    1.11,
    1.11,
    1.12,
    0.0
   ],
   "frameBBox": [
    [183, 137, 649, 1000],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 136, 648, 1002],
    [182, 136, 646, 1002],
    [182, 136, 646, 1002],
    [180, 136, 644, 1002],
    [180, 134, 644, 1002],
    [178, 132, 642, 1002],
    [178, 130, 642, 1002],
    [176, 128, 640, 1002],
    [174, 130, 638, 1002],
    [174, 130, 638, 1002],
    [174, 132, 636, 1002],
    [174, 132, 636, 1002],
    [174, 134, 636, 1002],
    [174, 134, 636, 1002],
    [174, 134, 636, 1002],
    [174, 134, 636, 1002],
    [174, 134, 636, 1002],
    [174, 134, 636, 1002],
    [174, 134, 636, 1002],
    [174, 134, 636, 1002],
    [174, 134, 636, 1002],
    [174, 134, 636, 1002],
    [174, 134, 636, 1002],
    [174, 134, 636, 1002],
    [172, 132, 636, 1002],
    [172, 132, 636, 1002],
    [172, 132, 636, 1002],
    [172, 132, 636, 1002],
    [174, 132, 636, 1002],
    [176, 134, 638, 1002],
    [176, 134, 640, 1002],
    [178, 134, 642, 1002],
    [180, 134, 644, 1002],
    [180, 132, 644, 1002],
    [180, 132, 646, 1002],
    [182, 132, 646, 1002],
    [182, 134, 646, 1002],
    [182, 134, 646, 1002],
    [182, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [183, 137, 649, 1000]
   ],
   "bbox": [172, 128, 649, 1002],
   "margin": [172, 128, 183, 102],
   "active": [
    [
     4,
     42
    ]
   ],
   "dupes": [
    13,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    31,
    39,
    41
   ],
   "arc": [
    0.0,
    0.0077,
    0.0077,
    0.0085,
    0.0256,
    0.0572,
    0.1293,
    0.156,
    0.183,
    0.2284,
    0.3412,
    0.3874,
    0.4458,
    0.4534,
    0.4957,
    0.5237,
    0.5237,
    0.5237,
    0.5237,
    0.5237,
    0.5237,
    0.5237,
    0.5237,
    0.5237,
    0.5237,
    0.5237,
    0.5237,
    0.5237,
    0.5237,
    0.5298,
    0.5298,
    0.5391,
    0.5554,
    0.6252,
    0.6928,
    0.7159,
    0.8,
    0.8577,
    0.9411,
    0.9519,
    0.9707,
    0.9793,
    0.9918,
    0.9919,
    0.9927,
    0.9927,
    0.9927,
    0.9927,
    1.0
   ],
   "minSeconds": 0.6,
   "browOk": true,
   "browRead": {
    "line_px_median": 0.24,
    "line_px_max": 1.25,
    "frames_over": 1,
    "longest_run_over": 1,
    "per_frame_line_px": [
     0.02,
     0.07,
     0.08,
     0.08,
     0.13,
     0.34,
     0.68,
     1.13,
     1.25,
     0.86,
     0.57,
     0.21,
     0.18,
     0.18,
     0.24,
     0.26,
     0.26,
     0.27,
     0.27,
     0.23,
     0.25,
     0.28,
     0.28,
     0.24,
     0.25,
     0.28,
     0.29,
     0.27,
     0.24,
     0.23,
     0.27,
     0.35,
     0.39,
     0.75,
     1.04,
     0.81,
     0.46,
     0.23,
     0.18,
     0.14,
     0.12,
     0.11,
     0.11,
     0.08,
     0.08,
     0.08,
     0.08,
     0.08,
     0.02
    ]
   },
   "facePaste": true,
   "browSwap": true,
   "faceBlank": false,
   "faceClass": 1,
   "attrManual": [
    "browSwap"
   ]
  },
  "think_mid_in": {
   "label": "归位 → 思考·折中",
   "from": "idle",
   "to": "think_mid",
   "fps": 16,
   "frames": [
    "frames/think_mid_loop/00.png",
    "frames/think_mid_loop/01.png",
    "frames/think_mid_loop/02.png",
    "frames/think_mid_loop/03.png",
    "frames/think_mid_loop/04.png",
    "frames/think_mid_loop/05.png",
    "frames/think_mid_loop/06.png",
    "frames/think_mid_loop/07.png",
    "frames/think_mid_loop/08.png",
    "frames/think_mid_loop/09.png",
    "frames/think_mid_loop/10.png",
    "frames/think_mid_loop/11.png",
    "frames/think_mid_loop/12.png",
    "frames/think_mid_loop/13.png",
    "frames/think_mid_loop/14.png",
    "frames/think_mid_loop/15.png",
    "frames/think_mid_loop/16.png",
    "frames/think_mid_loop/17.png",
    "frames/think_mid_loop/18.png",
    "frames/think_mid_loop/19.png",
    "frames/think_mid_loop/20.png",
    "frames/think_mid_loop/21.png",
    "frames/think_mid_loop/22.png",
    "frames/think_mid_loop/23.png"
   ],
   "frameBBox": [
    [183, 137, 649, 1000],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 136, 648, 1002],
    [182, 136, 646, 1002],
    [182, 136, 646, 1002],
    [180, 136, 644, 1002],
    [180, 134, 644, 1002],
    [178, 132, 642, 1002],
    [178, 130, 642, 1002],
    [176, 128, 640, 1002],
    [174, 130, 638, 1002],
    [174, 130, 638, 1002],
    [174, 132, 636, 1002],
    [174, 132, 636, 1002],
    [174, 134, 636, 1002],
    [174, 134, 636, 1002],
    [174, 134, 636, 1002],
    [174, 134, 636, 1002],
    [174, 134, 636, 1002],
    [174, 134, 636, 1002],
    [174, 134, 636, 1002]
   ],
   "bbox": [174, 128, 649, 1002],
   "margin": [174, 128, 183, 102],
   "active": [
    [
     4,
     22
    ]
   ],
   "dupes": [
    13,
    16,
    17,
    18,
    19,
    20,
    21,
    22
   ],
   "arc": [
    0.0,
    0.015,
    0.015,
    0.0164,
    0.0492,
    0.1094,
    0.2471,
    0.298,
    0.3495,
    0.4362,
    0.6515,
    0.7397,
    0.8512,
    0.8657,
    0.9464,
    0.9998,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0
   ],
   "minSeconds": 0.3,
   "browOk": true,
   "browRead": {
    "line_px_median": 0.26,
    "line_px_max": 1.25,
    "frames_over": 1,
    "longest_run_over": 1,
    "per_frame_line_px": [
     0.02,
     0.07,
     0.08,
     0.08,
     0.13,
     0.34,
     0.68,
     1.13,
     1.25,
     0.86,
     0.57,
     0.21,
     0.18,
     0.18,
     0.24,
     0.26,
     0.26,
     0.27,
     0.27,
     0.23,
     0.25,
     0.28,
     0.28,
     0.24
    ]
   },
   "facePaste": true,
   "browSwap": true,
   "faceBlank": false,
   "faceClass": 1,
   "attrManual": [
    "browSwap"
   ]
  },
  "think_mid_out": {
   "label": "思考·折中 → 归位",
   "from": "think_mid",
   "to": "idle",
   "fps": 16,
   "frames": [
    "frames/think_mid_loop/23.png",
    "frames/think_mid_loop/24.png",
    "frames/think_mid_loop/25.png",
    "frames/think_mid_loop/26.png",
    "frames/think_mid_loop/27.png",
    "frames/think_mid_loop/28.png",
    "frames/think_mid_loop/29.png",
    "frames/think_mid_loop/30.png",
    "frames/think_mid_loop/31.png",
    "frames/think_mid_loop/32.png",
    "frames/think_mid_loop/33.png",
    "frames/think_mid_loop/34.png",
    "frames/think_mid_loop/35.png",
    "frames/think_mid_loop/36.png",
    "frames/think_mid_loop/37.png",
    "frames/think_mid_loop/38.png",
    "frames/think_mid_loop/39.png",
    "frames/think_mid_loop/40.png",
    "frames/think_mid_loop/41.png",
    "frames/think_mid_loop/42.png",
    "frames/think_mid_loop/43.png",
    "frames/think_mid_loop/44.png",
    "frames/think_mid_loop/45.png",
    "frames/think_mid_loop/46.png",
    "frames/think_mid_loop/47.png",
    "frames/think_mid_loop/48.png"
   ],
   "frameBBox": [
    [174, 134, 636, 1002],
    [174, 134, 636, 1002],
    [174, 134, 636, 1002],
    [174, 134, 636, 1002],
    [174, 134, 636, 1002],
    [174, 134, 636, 1002],
    [172, 132, 636, 1002],
    [172, 132, 636, 1002],
    [172, 132, 636, 1002],
    [172, 132, 636, 1002],
    [174, 132, 636, 1002],
    [176, 134, 638, 1002],
    [176, 134, 640, 1002],
    [178, 134, 642, 1002],
    [180, 134, 644, 1002],
    [180, 132, 644, 1002],
    [180, 132, 646, 1002],
    [182, 132, 646, 1002],
    [182, 134, 646, 1002],
    [182, 134, 646, 1002],
    [182, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [183, 137, 649, 1000]
   ],
   "bbox": [172, 132, 649, 1002],
   "margin": [172, 132, 183, 102],
   "active": [
    [
     1,
     19
    ]
   ],
   "dupes": [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    16,
    18
   ],
   "arc": [
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0128,
    0.0128,
    0.0323,
    0.0665,
    0.213,
    0.3549,
    0.4034,
    0.5801,
    0.7013,
    0.8764,
    0.899,
    0.9385,
    0.9566,
    0.9827,
    0.983,
    0.9847,
    0.9847,
    0.9847,
    0.9847,
    1.0
   ],
   "minSeconds": 0.3,
   "browOk": true,
   "browRead": {
    "line_px_median": 0.23,
    "line_px_max": 1.04,
    "frames_over": 0,
    "longest_run_over": 0,
    "per_frame_line_px": [
     0.24,
     0.25,
     0.28,
     0.29,
     0.27,
     0.24,
     0.23,
     0.27,
     0.35,
     0.39,
     0.75,
     1.04,
     0.81,
     0.46,
     0.23,
     0.18,
     0.14,
     0.12,
     0.11,
     0.11,
     0.08,
     0.08,
     0.08,
     0.08,
     0.08,
     0.02
    ]
   },
   "facePaste": true,
   "browSwap": true,
   "faceBlank": false,
   "faceClass": 1,
   "attrManual": [
    "browSwap"
   ]
  },
  "think_d1_loop": {
   "label": "思考·草稿 s1（一段做完去和回）",
   "from": "idle",
   "to": "idle",
   "fps": 16,
   "frames": [
    "frames/think_d1_loop/00.png",
    "frames/think_d1_loop/01.png",
    "frames/think_d1_loop/02.png",
    "frames/think_d1_loop/03.png",
    "frames/think_d1_loop/04.png",
    "frames/think_d1_loop/05.png",
    "frames/think_d1_loop/06.png",
    "frames/think_d1_loop/07.png",
    "frames/think_d1_loop/08.png",
    "frames/think_d1_loop/09.png",
    "frames/think_d1_loop/10.png",
    "frames/think_d1_loop/11.png",
    "frames/think_d1_loop/12.png",
    "frames/think_d1_loop/13.png",
    "frames/think_d1_loop/14.png",
    "frames/think_d1_loop/15.png",
    "frames/think_d1_loop/16.png",
    "frames/think_d1_loop/17.png",
    "frames/think_d1_loop/18.png",
    "frames/think_d1_loop/19.png",
    "frames/think_d1_loop/20.png",
    "frames/think_d1_loop/21.png",
    "frames/think_d1_loop/22.png",
    "frames/think_d1_loop/23.png",
    "frames/think_d1_loop/24.png",
    "frames/think_d1_loop/25.png",
    "frames/think_d1_loop/26.png",
    "frames/think_d1_loop/27.png",
    "frames/think_d1_loop/28.png",
    "frames/think_d1_loop/29.png",
    "frames/think_d1_loop/30.png",
    "frames/think_d1_loop/31.png",
    "frames/think_d1_loop/32.png",
    "frames/think_d1_loop/33.png",
    "frames/think_d1_loop/34.png",
    "frames/think_d1_loop/35.png",
    "frames/think_d1_loop/36.png",
    "frames/think_d1_loop/37.png",
    "frames/think_d1_loop/38.png",
    "frames/think_d1_loop/39.png",
    "frames/think_d1_loop/40.png",
    "frames/think_d1_loop/41.png",
    "frames/think_d1_loop/42.png",
    "frames/think_d1_loop/43.png",
    "frames/think_d1_loop/44.png",
    "frames/think_d1_loop/45.png",
    "frames/think_d1_loop/46.png",
    "frames/think_d1_loop/47.png",
    "frames/think_d1_loop/48.png"
   ],
   "apex": 23,
   "away_pct": [
    0.0,
    1.15,
    1.13,
    1.17,
    1.6,
    2.45,
    4.53,
    5.15,
    5.08,
    4.55,
    6.07,
    7.28,
    8.84,
    9.4,
    9.75,
    9.9,
    9.99,
    10.03,
    10.0,
    10.0,
    9.99,
    10.0,
    10.01,
    10.01,
    10.0,
    10.0,
    10.0,
    10.02,
    10.06,
    10.47,
    10.79,
    10.98,
    10.72,
    10.17,
    8.82,
    7.91,
    5.96,
    5.04,
    4.45,
    4.3,
    4.09,
    3.28,
    2.08,
    1.61,
    1.18,
    1.11,
    1.12,
    1.13,
    0.0
   ],
   "frameBBox": [
    [183, 137, 649, 1000],
    [184, 135, 648, 1002],
    [184, 136, 648, 1002],
    [184, 134, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [186, 138, 650, 1002],
    [184, 138, 650, 1002],
    [184, 138, 648, 1002],
    [182, 136, 648, 1002],
    [180, 132, 644, 1002],
    [180, 130, 644, 1002],
    [176, 130, 640, 1002],
    [176, 130, 640, 1002],
    [174, 130, 638, 1002],
    [174, 132, 636, 1002],
    [172, 132, 636, 1002],
    [174, 132, 636, 1002],
    [174, 132, 636, 1002],
    [174, 132, 636, 1002],
    [174, 132, 636, 1002],
    [174, 132, 636, 1002],
    [174, 132, 636, 1002],
    [174, 132, 636, 1002],
    [174, 132, 636, 1002],
    [174, 132, 636, 1002],
    [174, 132, 636, 1002],
    [174, 132, 636, 1002],
    [174, 132, 636, 1002],
    [172, 132, 636, 1002],
    [172, 132, 636, 1002],
    [172, 132, 634, 1002],
    [172, 132, 634, 1002],
    [174, 132, 636, 1002],
    [176, 134, 638, 1002],
    [176, 134, 640, 1002],
    [180, 134, 644, 1002],
    [180, 132, 646, 1002],
    [182, 132, 646, 1002],
    [182, 132, 646, 1002],
    [184, 132, 648, 1002],
    [184, 134, 648, 1002],
    [182, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [183, 137, 649, 1000]
   ],
   "bbox": [172, 130, 650, 1002],
   "margin": [172, 130, 182, 102],
   "active": [
    [
     4,
     42
    ]
   ],
   "dupes": [
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30
   ],
   "arc": [
    0.0,
    0.0062,
    0.0063,
    0.0065,
    0.0273,
    0.0595,
    0.1222,
    0.1405,
    0.1766,
    0.2272,
    0.33,
    0.3687,
    0.4248,
    0.4381,
    0.4752,
    0.4937,
    0.4939,
    0.4939,
    0.4939,
    0.4939,
    0.4939,
    0.4939,
    0.4939,
    0.4939,
    0.4939,
    0.4939,
    0.4939,
    0.4939,
    0.4939,
    0.5005,
    0.5015,
    0.512,
    0.5391,
    0.5701,
    0.6515,
    0.6828,
    0.7697,
    0.831,
    0.9163,
    0.9277,
    0.9457,
    0.9567,
    0.979,
    0.9848,
    0.9929,
    0.9935,
    0.9935,
    0.9935,
    1.0
   ],
   "minSeconds": 0.6,
   "browOk": true,
   "browRead": {
    "line_px_median": 0.3,
    "line_px_max": 1.31,
    "frames_over": 1,
    "longest_run_over": 1,
    "per_frame_line_px": [
     0.02,
     0.08,
     0.08,
     0.08,
     0.16,
     0.45,
     1.04,
     1.31,
     1.17,
     0.7,
     0.36,
     0.17,
     0.17,
     0.18,
     0.23,
     0.25,
     0.31,
     0.35,
     0.29,
     0.29,
     0.3,
     0.33,
     0.35,
     0.31,
     0.3,
     0.3,
     0.3,
     0.29,
     0.31,
     0.3,
     0.29,
     0.34,
     0.39,
     0.63,
     0.94,
     0.89,
     0.62,
     0.32,
     0.3,
     0.25,
     0.22,
     0.17,
     0.11,
     0.09,
     0.08,
     0.07,
     0.08,
     0.08,
     0.02
    ]
   },
   "facePaste": true,
   "browSwap": true,
   "faceBlank": false,
   "faceClass": 1,
   "attrManual": [
    "browSwap"
   ]
  },
  "think_d1_in": {
   "label": "归位 → 思考·草稿 s1",
   "from": "idle",
   "to": "think_d1",
   "fps": 16,
   "frames": [
    "frames/think_d1_loop/00.png",
    "frames/think_d1_loop/01.png",
    "frames/think_d1_loop/02.png",
    "frames/think_d1_loop/03.png",
    "frames/think_d1_loop/04.png",
    "frames/think_d1_loop/05.png",
    "frames/think_d1_loop/06.png",
    "frames/think_d1_loop/07.png",
    "frames/think_d1_loop/08.png",
    "frames/think_d1_loop/09.png",
    "frames/think_d1_loop/10.png",
    "frames/think_d1_loop/11.png",
    "frames/think_d1_loop/12.png",
    "frames/think_d1_loop/13.png",
    "frames/think_d1_loop/14.png",
    "frames/think_d1_loop/15.png",
    "frames/think_d1_loop/16.png",
    "frames/think_d1_loop/17.png",
    "frames/think_d1_loop/18.png",
    "frames/think_d1_loop/19.png",
    "frames/think_d1_loop/20.png",
    "frames/think_d1_loop/21.png",
    "frames/think_d1_loop/22.png",
    "frames/think_d1_loop/23.png"
   ],
   "frameBBox": [
    [183, 137, 649, 1000],
    [184, 135, 648, 1002],
    [184, 136, 648, 1002],
    [184, 134, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [186, 138, 650, 1002],
    [184, 138, 650, 1002],
    [184, 138, 648, 1002],
    [182, 136, 648, 1002],
    [180, 132, 644, 1002],
    [180, 130, 644, 1002],
    [176, 130, 640, 1002],
    [176, 130, 640, 1002],
    [174, 130, 638, 1002],
    [174, 132, 636, 1002],
    [172, 132, 636, 1002],
    [174, 132, 636, 1002],
    [174, 132, 636, 1002],
    [174, 132, 636, 1002],
    [174, 132, 636, 1002],
    [174, 132, 636, 1002],
    [174, 132, 636, 1002],
    [174, 132, 636, 1002]
   ],
   "bbox": [172, 130, 650, 1002],
   "margin": [172, 130, 182, 102],
   "active": [
    [
     4,
     22
    ]
   ],
   "dupes": [
    16,
    17,
    18,
    19,
    20,
    21,
    22
   ],
   "arc": [
    0.0,
    0.0126,
    0.0127,
    0.0132,
    0.0552,
    0.1204,
    0.2475,
    0.2845,
    0.3576,
    0.4601,
    0.6681,
    0.7465,
    0.8601,
    0.8869,
    0.9622,
    0.9996,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0
   ],
   "minSeconds": 0.3,
   "browOk": true,
   "browRead": {
    "line_px_median": 0.29,
    "line_px_max": 1.31,
    "frames_over": 1,
    "longest_run_over": 1,
    "per_frame_line_px": [
     0.02,
     0.08,
     0.08,
     0.08,
     0.16,
     0.45,
     1.04,
     1.31,
     1.17,
     0.7,
     0.36,
     0.17,
     0.17,
     0.18,
     0.23,
     0.25,
     0.31,
     0.35,
     0.29,
     0.29,
     0.3,
     0.33,
     0.35,
     0.31
    ]
   },
   "facePaste": true,
   "browSwap": true,
   "faceBlank": false,
   "faceClass": 1,
   "attrManual": [
    "browSwap"
   ]
  },
  "think_d1_out": {
   "label": "思考·草稿 s1 → 归位",
   "from": "think_d1",
   "to": "idle",
   "fps": 16,
   "frames": [
    "frames/think_d1_loop/23.png",
    "frames/think_d1_loop/24.png",
    "frames/think_d1_loop/25.png",
    "frames/think_d1_loop/26.png",
    "frames/think_d1_loop/27.png",
    "frames/think_d1_loop/28.png",
    "frames/think_d1_loop/29.png",
    "frames/think_d1_loop/30.png",
    "frames/think_d1_loop/31.png",
    "frames/think_d1_loop/32.png",
    "frames/think_d1_loop/33.png",
    "frames/think_d1_loop/34.png",
    "frames/think_d1_loop/35.png",
    "frames/think_d1_loop/36.png",
    "frames/think_d1_loop/37.png",
    "frames/think_d1_loop/38.png",
    "frames/think_d1_loop/39.png",
    "frames/think_d1_loop/40.png",
    "frames/think_d1_loop/41.png",
    "frames/think_d1_loop/42.png",
    "frames/think_d1_loop/43.png",
    "frames/think_d1_loop/44.png",
    "frames/think_d1_loop/45.png",
    "frames/think_d1_loop/46.png",
    "frames/think_d1_loop/47.png",
    "frames/think_d1_loop/48.png"
   ],
   "frameBBox": [
    [174, 132, 636, 1002],
    [174, 132, 636, 1002],
    [174, 132, 636, 1002],
    [174, 132, 636, 1002],
    [174, 132, 636, 1002],
    [174, 132, 636, 1002],
    [172, 132, 636, 1002],
    [172, 132, 636, 1002],
    [172, 132, 634, 1002],
    [172, 132, 634, 1002],
    [174, 132, 636, 1002],
    [176, 134, 638, 1002],
    [176, 134, 640, 1002],
    [180, 134, 644, 1002],
    [180, 132, 646, 1002],
    [182, 132, 646, 1002],
    [182, 132, 646, 1002],
    [184, 132, 648, 1002],
    [184, 134, 648, 1002],
    [182, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [183, 137, 649, 1000]
   ],
   "bbox": [172, 132, 649, 1002],
   "margin": [172, 132, 183, 102],
   "active": [
    [
     1,
     19
    ]
   ],
   "dupes": [
    1,
    2,
    3,
    4,
    5,
    6,
    7
   ],
   "arc": [
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.013,
    0.0151,
    0.0358,
    0.0894,
    0.1505,
    0.3113,
    0.3733,
    0.5449,
    0.6662,
    0.8346,
    0.8572,
    0.8928,
    0.9144,
    0.9585,
    0.97,
    0.9859,
    0.9871,
    0.9871,
    0.9871,
    1.0
   ],
   "minSeconds": 0.3,
   "browOk": true,
   "browRead": {
    "line_px_median": 0.3,
    "line_px_max": 0.94,
    "frames_over": 0,
    "longest_run_over": 0,
    "per_frame_line_px": [
     0.31,
     0.3,
     0.3,
     0.3,
     0.29,
     0.31,
     0.3,
     0.29,
     0.34,
     0.39,
     0.63,
     0.94,
     0.89,
     0.62,
     0.32,
     0.3,
     0.25,
     0.22,
     0.17,
     0.11,
     0.09,
     0.08,
     0.07,
     0.08,
     0.08,
     0.02
    ]
   },
   "facePaste": true,
   "browSwap": true,
   "faceBlank": false,
   "faceClass": 1,
   "attrManual": [
    "browSwap"
   ]
  },
  "wave_loop": {
   "label": "挥手·正式 s2（一段做完去和回）",
   "from": "idle",
   "to": "idle",
   "fps": 16,
   "frames": [
    "frames/wave_loop/00.png",
    "frames/wave_loop/01.png",
    "frames/wave_loop/02.png",
    "frames/wave_loop/03.png",
    "frames/wave_loop/04.png",
    "frames/wave_loop/05.png",
    "frames/wave_loop/06.png",
    "frames/wave_loop/07.png",
    "frames/wave_loop/08.png",
    "frames/wave_loop/09.png",
    "frames/wave_loop/10.png",
    "frames/wave_loop/11.png",
    "frames/wave_loop/12.png",
    "frames/wave_loop/13.png",
    "frames/wave_loop/14.png",
    "frames/wave_loop/15.png",
    "frames/wave_loop/16.png",
    "frames/wave_loop/17.png",
    "frames/wave_loop/18.png",
    "frames/wave_loop/19.png",
    "frames/wave_loop/20.png",
    "frames/wave_loop/21.png",
    "frames/wave_loop/22.png",
    "frames/wave_loop/23.png",
    "frames/wave_loop/24.png",
    "frames/wave_loop/25.png",
    "frames/wave_loop/26.png",
    "frames/wave_loop/27.png",
    "frames/wave_loop/28.png",
    "frames/wave_loop/29.png",
    "frames/wave_loop/30.png",
    "frames/wave_loop/31.png",
    "frames/wave_loop/32.png",
    "frames/wave_loop/33.png",
    "frames/wave_loop/34.png",
    "frames/wave_loop/35.png",
    "frames/wave_loop/36.png",
    "frames/wave_loop/37.png",
    "frames/wave_loop/38.png",
    "frames/wave_loop/39.png",
    "frames/wave_loop/40.png",
    "frames/wave_loop/41.png",
    "frames/wave_loop/42.png",
    "frames/wave_loop/43.png",
    "frames/wave_loop/44.png",
    "frames/wave_loop/45.png",
    "frames/wave_loop/46.png",
    "frames/wave_loop/47.png",
    "frames/wave_loop/48.png"
   ],
   "apex": 20,
   "away_pct": [
    0.0,
    1.81,
    5.32,
    6.94,
    9.5,
    10.71,
    12.79,
    13.42,
    12.94,
    12.31,
    12.06,
    12.15,
    12.83,
    13.26,
    12.95,
    12.34,
    12.15,
    12.18,
    12.27,
    13.22,
    13.01,
    12.26,
    12.14,
    12.21,
    12.29,
    13.04,
    13.14,
    12.43,
    12.11,
    12.07,
    12.17,
    12.59,
    13.29,
    13.3,
    11.77,
    11.01,
    9.21,
    8.48,
    7.04,
    6.07,
    4.25,
    3.29,
    2.07,
    1.55,
    1.21,
    1.17,
    1.15,
    1.15,
    0.0
   ],
   "frameBBox": [
    [183, 137, 649, 1000],
    [184, 136, 648, 1002],
    [186, 136, 650, 1002],
    [186, 136, 654, 1002],
    [186, 138, 678, 1002],
    [188, 138, 682, 1002],
    [188, 140, 682, 1002],
    [188, 140, 678, 1002],
    [190, 142, 662, 1002],
    [190, 142, 652, 1002],
    [190, 142, 652, 1002],
    [190, 142, 652, 1002],
    [190, 142, 658, 1002],
    [190, 142, 666, 1002],
    [190, 142, 660, 1002],
    [190, 142, 652, 1002],
    [190, 142, 652, 1002],
    [190, 142, 652, 1002],
    [190, 142, 652, 1002],
    [190, 142, 664, 1002],
    [190, 142, 660, 1002],
    [190, 142, 652, 1002],
    [190, 142, 652, 1002],
    [190, 142, 652, 1002],
    [190, 142, 652, 1002],
    [190, 142, 662, 1002],
    [190, 142, 664, 1002],
    [190, 142, 652, 1002],
    [190, 142, 652, 1002],
    [190, 142, 652, 1002],
    [190, 142, 652, 1002],
    [190, 142, 652, 1002],
    [190, 142, 662, 1002],
    [190, 140, 674, 1002],
    [188, 140, 684, 1002],
    [188, 140, 682, 1002],
    [188, 138, 670, 1002],
    [186, 138, 666, 1002],
    [186, 138, 650, 1002],
    [186, 136, 650, 1002],
    [186, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [183, 137, 649, 1000]
   ],
   "bbox": [183, 136, 684, 1002],
   "margin": [183, 136, 148, 102],
   "active": [
    [
     2,
     44
    ]
   ],
   "dupes": [
    26
   ],
   "arc": [
    0.0,
    0.0189,
    0.0665,
    0.0943,
    0.1497,
    0.1811,
    0.2342,
    0.2652,
    0.3093,
    0.3318,
    0.3526,
    0.3586,
    0.3824,
    0.3954,
    0.4074,
    0.4245,
    0.4431,
    0.4541,
    0.4672,
    0.4878,
    0.4969,
    0.5171,
    0.53,
    0.5413,
    0.5543,
    0.5765,
    0.5808,
    0.6006,
    0.6173,
    0.6333,
    0.6488,
    0.6777,
    0.715,
    0.7399,
    0.7855,
    0.8108,
    0.8531,
    0.8723,
    0.9042,
    0.9207,
    0.9473,
    0.9602,
    0.9763,
    0.9826,
    0.9906,
    0.9906,
    0.9906,
    0.9906,
    1.0
   ],
   "minSeconds": 0.6,
   "browOk": false,
   "browRead": {
    "line_px_median": 0.82,
    "line_px_max": 1.51,
    "frames_over": 9,
    "longest_run_over": 3,
    "per_frame_line_px": [
     0.03,
     0.08,
     0.31,
     0.51,
     0.73,
     0.7,
     0.73,
     0.88,
     1.41,
     1.15,
     0.86,
     0.85,
     1.4,
     1.45,
     1.44,
     1.06,
     0.85,
     0.82,
     0.98,
     1.5,
     1.5,
     0.99,
     0.84,
     0.82,
     0.8,
     1.49,
     1.51,
     1.16,
     0.88,
     0.82,
     0.81,
     1.23,
     0.89,
     0.92,
     0.67,
     0.71,
     0.69,
     0.65,
     0.47,
     0.4,
     0.24,
     0.16,
     0.11,
     0.09,
     0.08,
     0.07,
     0.07,
     0.07,
     0.02
    ]
   },
   "facePaste": true,
   "browSwap": false,
   "faceBlank": false,
   "faceClass": 2
  },
  "wave_in": {
   "label": "归位 → 挥手·正式 s2",
   "from": "idle",
   "to": "wave",
   "fps": 16,
   "frames": [
    "frames/wave_loop/00.png",
    "frames/wave_loop/01.png",
    "frames/wave_loop/02.png",
    "frames/wave_loop/03.png",
    "frames/wave_loop/04.png",
    "frames/wave_loop/05.png",
    "frames/wave_loop/06.png",
    "frames/wave_loop/07.png",
    "frames/wave_loop/08.png",
    "frames/wave_loop/09.png",
    "frames/wave_loop/10.png",
    "frames/wave_loop/11.png",
    "frames/wave_loop/12.png",
    "frames/wave_loop/13.png",
    "frames/wave_loop/14.png",
    "frames/wave_loop/15.png",
    "frames/wave_loop/16.png",
    "frames/wave_loop/17.png",
    "frames/wave_loop/18.png",
    "frames/wave_loop/19.png",
    "frames/wave_loop/20.png"
   ],
   "frameBBox": [
    [183, 137, 649, 1000],
    [184, 136, 648, 1002],
    [186, 136, 650, 1002],
    [186, 136, 654, 1002],
    [186, 138, 678, 1002],
    [188, 138, 682, 1002],
    [188, 140, 682, 1002],
    [188, 140, 678, 1002],
    [190, 142, 662, 1002],
    [190, 142, 652, 1002],
    [190, 142, 652, 1002],
    [190, 142, 652, 1002],
    [190, 142, 658, 1002],
    [190, 142, 666, 1002],
    [190, 142, 660, 1002],
    [190, 142, 652, 1002],
    [190, 142, 652, 1002],
    [190, 142, 652, 1002],
    [190, 142, 652, 1002],
    [190, 142, 664, 1002],
    [190, 142, 660, 1002]
   ],
   "bbox": [183, 136, 682, 1002],
   "margin": [183, 136, 150, 102],
   "active": [
    [
     2,
     19
    ]
   ],
   "dupes": [],
   "arc": [
    0.0,
    0.0433,
    0.1386,
    0.1942,
    0.305,
    0.368,
    0.4743,
    0.5362,
    0.6245,
    0.6696,
    0.7111,
    0.7232,
    0.7707,
    0.7967,
    0.8208,
    0.855,
    0.8923,
    0.9142,
    0.9404,
    0.9817,
    1.0
   ],
   "minSeconds": 0.3,
   "browOk": false,
   "browRead": {
    "line_px_median": 0.86,
    "line_px_max": 1.5,
    "frames_over": 6,
    "longest_run_over": 3,
    "per_frame_line_px": [
     0.03,
     0.08,
     0.31,
     0.51,
     0.73,
     0.7,
     0.73,
     0.88,
     1.41,
     1.15,
     0.86,
     0.85,
     1.4,
     1.45,
     1.44,
     1.06,
     0.85,
     0.82,
     0.98,
     1.5,
     1.5
    ]
   },
   "facePaste": true,
   "browSwap": false,
   "faceBlank": false,
   "faceClass": 2
  },
  "wave_out": {
   "label": "挥手·正式 s2 → 归位",
   "from": "wave",
   "to": "idle",
   "fps": 16,
   "frames": [
    "frames/wave_loop/20.png",
    "frames/wave_loop/21.png",
    "frames/wave_loop/22.png",
    "frames/wave_loop/23.png",
    "frames/wave_loop/24.png",
    "frames/wave_loop/25.png",
    "frames/wave_loop/26.png",
    "frames/wave_loop/27.png",
    "frames/wave_loop/28.png",
    "frames/wave_loop/29.png",
    "frames/wave_loop/30.png",
    "frames/wave_loop/31.png",
    "frames/wave_loop/32.png",
    "frames/wave_loop/33.png",
    "frames/wave_loop/34.png",
    "frames/wave_loop/35.png",
    "frames/wave_loop/36.png",
    "frames/wave_loop/37.png",
    "frames/wave_loop/38.png",
    "frames/wave_loop/39.png",
    "frames/wave_loop/40.png",
    "frames/wave_loop/41.png",
    "frames/wave_loop/42.png",
    "frames/wave_loop/43.png",
    "frames/wave_loop/44.png",
    "frames/wave_loop/45.png",
    "frames/wave_loop/46.png",
    "frames/wave_loop/47.png",
    "frames/wave_loop/48.png"
   ],
   "frameBBox": [
    [190, 142, 660, 1002],
    [190, 142, 652, 1002],
    [190, 142, 652, 1002],
    [190, 142, 652, 1002],
    [190, 142, 652, 1002],
    [190, 142, 662, 1002],
    [190, 142, 664, 1002],
    [190, 142, 652, 1002],
    [190, 142, 652, 1002],
    [190, 142, 652, 1002],
    [190, 142, 652, 1002],
    [190, 142, 652, 1002],
    [190, 142, 662, 1002],
    [190, 140, 674, 1002],
    [188, 140, 684, 1002],
    [188, 140, 682, 1002],
    [188, 138, 670, 1002],
    [186, 138, 666, 1002],
    [186, 138, 650, 1002],
    [186, 136, 650, 1002],
    [186, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [183, 137, 649, 1000]
   ],
   "bbox": [183, 136, 684, 1002],
   "margin": [183, 136, 148, 102],
   "active": [
    [
     1,
     24
    ]
   ],
   "dupes": [
    6
   ],
   "arc": [
    0.0,
    0.0326,
    0.0583,
    0.081,
    0.1072,
    0.1515,
    0.1602,
    0.1998,
    0.2333,
    0.2653,
    0.2963,
    0.3543,
    0.429,
    0.479,
    0.5703,
    0.6209,
    0.7058,
    0.7441,
    0.8081,
    0.8411,
    0.8944,
    0.9203,
    0.9525,
    0.9651,
    0.9811,
    0.9811,
    0.9811,
    0.9811,
    1.0
   ],
   "minSeconds": 0.3,
   "browOk": true,
   "browRead": {
    "line_px_median": 0.71,
    "line_px_max": 1.51,
    "frames_over": 4,
    "longest_run_over": 2,
    "per_frame_line_px": [
     1.5,
     0.99,
     0.84,
     0.82,
     0.8,
     1.49,
     1.51,
     1.16,
     0.88,
     0.82,
     0.81,
     1.23,
     0.89,
     0.92,
     0.67,
     0.71,
     0.69,
     0.65,
     0.47,
     0.4,
     0.24,
     0.16,
     0.11,
     0.09,
     0.08,
     0.07,
     0.07,
     0.07,
     0.02
    ]
   },
   "facePaste": true,
   "browSwap": false,
   "faceBlank": false,
   "faceClass": 2
  },
  "wave_f1_loop": {
   "label": "挥手·正式 s1（一段做完去和回）",
   "from": "idle",
   "to": "idle",
   "fps": 16,
   "frames": [
    "frames/wave_f1_loop/00.png",
    "frames/wave_f1_loop/01.png",
    "frames/wave_f1_loop/02.png",
    "frames/wave_f1_loop/03.png",
    "frames/wave_f1_loop/04.png",
    "frames/wave_f1_loop/05.png",
    "frames/wave_f1_loop/06.png",
    "frames/wave_f1_loop/07.png",
    "frames/wave_f1_loop/08.png",
    "frames/wave_f1_loop/09.png",
    "frames/wave_f1_loop/10.png",
    "frames/wave_f1_loop/11.png",
    "frames/wave_f1_loop/12.png",
    "frames/wave_f1_loop/13.png",
    "frames/wave_f1_loop/14.png",
    "frames/wave_f1_loop/15.png",
    "frames/wave_f1_loop/16.png",
    "frames/wave_f1_loop/17.png",
    "frames/wave_f1_loop/18.png",
    "frames/wave_f1_loop/19.png",
    "frames/wave_f1_loop/20.png",
    "frames/wave_f1_loop/21.png",
    "frames/wave_f1_loop/22.png",
    "frames/wave_f1_loop/23.png",
    "frames/wave_f1_loop/24.png",
    "frames/wave_f1_loop/25.png",
    "frames/wave_f1_loop/26.png",
    "frames/wave_f1_loop/27.png",
    "frames/wave_f1_loop/28.png",
    "frames/wave_f1_loop/29.png",
    "frames/wave_f1_loop/30.png",
    "frames/wave_f1_loop/31.png",
    "frames/wave_f1_loop/32.png",
    "frames/wave_f1_loop/33.png",
    "frames/wave_f1_loop/34.png",
    "frames/wave_f1_loop/35.png",
    "frames/wave_f1_loop/36.png",
    "frames/wave_f1_loop/37.png",
    "frames/wave_f1_loop/38.png",
    "frames/wave_f1_loop/39.png",
    "frames/wave_f1_loop/40.png",
    "frames/wave_f1_loop/41.png",
    "frames/wave_f1_loop/42.png",
    "frames/wave_f1_loop/43.png",
    "frames/wave_f1_loop/44.png",
    "frames/wave_f1_loop/45.png",
    "frames/wave_f1_loop/46.png",
    "frames/wave_f1_loop/47.png",
    "frames/wave_f1_loop/48.png"
   ],
   "apex": 33,
   "away_pct": [
    0.0,
    1.18,
    2.72,
    7.35,
    10.94,
    11.49,
    11.38,
    10.72,
    9.92,
    9.99,
    9.37,
    9.47,
    9.59,
    9.69,
    9.73,
    10.01,
    11.01,
    11.33,
    11.36,
    11.16,
    10.29,
    9.98,
    9.97,
    9.85,
    9.85,
    9.83,
    9.8,
    9.89,
    10.01,
    10.22,
    10.15,
    10.82,
    11.29,
    11.84,
    12.57,
    12.49,
    9.83,
    7.87,
    5.46,
    5.36,
    3.48,
    2.17,
    1.57,
    1.49,
    1.23,
    1.15,
    1.12,
    1.14,
    0.0
   ],
   "frameBBox": [
    [183, 137, 649, 1000],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [182, 134, 670, 1002],
    [182, 134, 726, 1002],
    [180, 134, 728, 1002],
    [180, 134, 728, 1002],
    [178, 132, 716, 1002],
    [178, 132, 678, 1002],
    [178, 132, 678, 1002],
    [176, 132, 652, 1002],
    [176, 132, 640, 1002],
    [176, 132, 638, 1002],
    [176, 132, 638, 1002],
    [176, 132, 638, 1002],
    [176, 132, 640, 1002],
    [176, 132, 682, 1002],
    [176, 132, 692, 1002],
    [176, 132, 696, 1002],
    [176, 132, 688, 1002],
    [176, 132, 664, 1002],
    [176, 132, 640, 1002],
    [176, 132, 638, 1002],
    [176, 132, 638, 1002],
    [176, 132, 638, 1002],
    [176, 132, 638, 1002],
    [176, 132, 638, 1002],
    [176, 132, 638, 1002],
    [176, 132, 648, 1002],
    [176, 132, 666, 1002],
    [176, 132, 668, 1002],
    [176, 132, 694, 1002],
    [178, 132, 714, 1002],
    [178, 132, 738, 1002],
    [180, 132, 734, 1002],
    [180, 132, 734, 1002],
    [180, 132, 700, 1002],
    [182, 134, 660, 1002],
    [182, 134, 646, 1002],
    [182, 134, 646, 1002],
    [182, 134, 646, 1002],
    [182, 134, 646, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [183, 137, 649, 1000]
   ],
   "bbox": [176, 132, 738, 1002],
   "margin": [176, 132, 94, 102],
   "active": [
    [
     2,
     42
    ]
   ],
   "dupes": [
    9,
    13,
    22,
    24,
    25,
    26,
    30,
    35,
    39
   ],
   "arc": [
    0.0,
    0.0099,
    0.0291,
    0.0661,
    0.1225,
    0.1336,
    0.1916,
    0.243,
    0.295,
    0.2954,
    0.3325,
    0.3598,
    0.3824,
    0.3831,
    0.393,
    0.4182,
    0.4537,
    0.4762,
    0.4832,
    0.5012,
    0.531,
    0.5589,
    0.5592,
    0.5757,
    0.5808,
    0.5841,
    0.5846,
    0.5983,
    0.6172,
    0.6418,
    0.6422,
    0.6833,
    0.725,
    0.7702,
    0.8229,
    0.8229,
    0.8794,
    0.917,
    0.9431,
    0.9431,
    0.9625,
    0.9782,
    0.9867,
    0.9867,
    0.9906,
    0.9914,
    0.9914,
    0.9914,
    1.0
   ],
   "minSeconds": 0.6,
   "browOk": false,
   "browRead": {
    "line_px_median": 0.68,
    "line_px_max": 1.36,
    "frames_over": 6,
    "longest_run_over": 3,
    "per_frame_line_px": [
     0.02,
     0.08,
     0.17,
     0.56,
     0.56,
     0.62,
     0.66,
     1.05,
     1.31,
     1.36,
     1.3,
     0.93,
     0.68,
     0.68,
     0.74,
     1.21,
     1.19,
     1.16,
     1.15,
     1.13,
     1.03,
     0.95,
     0.98,
     0.73,
     0.74,
     0.73,
     0.74,
     0.99,
     1.11,
     1.29,
     1.22,
     1.08,
     1.1,
     0.65,
     0.52,
     0.52,
     0.64,
     0.59,
     0.46,
     0.44,
     0.22,
     0.11,
     0.08,
     0.08,
     0.08,
     0.08,
     0.08,
     0.08,
     0.02
    ]
   },
   "facePaste": true,
   "browSwap": false,
   "faceBlank": false,
   "faceClass": 2
  },
  "wave_f1_in": {
   "label": "归位 → 挥手·正式 s1",
   "from": "idle",
   "to": "wave_f1",
   "fps": 16,
   "frames": [
    "frames/wave_f1_loop/00.png",
    "frames/wave_f1_loop/01.png",
    "frames/wave_f1_loop/02.png",
    "frames/wave_f1_loop/03.png",
    "frames/wave_f1_loop/04.png",
    "frames/wave_f1_loop/05.png",
    "frames/wave_f1_loop/06.png",
    "frames/wave_f1_loop/07.png",
    "frames/wave_f1_loop/08.png",
    "frames/wave_f1_loop/09.png",
    "frames/wave_f1_loop/10.png",
    "frames/wave_f1_loop/11.png",
    "frames/wave_f1_loop/12.png",
    "frames/wave_f1_loop/13.png",
    "frames/wave_f1_loop/14.png",
    "frames/wave_f1_loop/15.png",
    "frames/wave_f1_loop/16.png",
    "frames/wave_f1_loop/17.png",
    "frames/wave_f1_loop/18.png",
    "frames/wave_f1_loop/19.png",
    "frames/wave_f1_loop/20.png",
    "frames/wave_f1_loop/21.png",
    "frames/wave_f1_loop/22.png",
    "frames/wave_f1_loop/23.png",
    "frames/wave_f1_loop/24.png",
    "frames/wave_f1_loop/25.png",
    "frames/wave_f1_loop/26.png",
    "frames/wave_f1_loop/27.png",
    "frames/wave_f1_loop/28.png",
    "frames/wave_f1_loop/29.png",
    "frames/wave_f1_loop/30.png",
    "frames/wave_f1_loop/31.png",
    "frames/wave_f1_loop/32.png",
    "frames/wave_f1_loop/33.png"
   ],
   "frameBBox": [
    [183, 137, 649, 1000],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [182, 134, 670, 1002],
    [182, 134, 726, 1002],
    [180, 134, 728, 1002],
    [180, 134, 728, 1002],
    [178, 132, 716, 1002],
    [178, 132, 678, 1002],
    [178, 132, 678, 1002],
    [176, 132, 652, 1002],
    [176, 132, 640, 1002],
    [176, 132, 638, 1002],
    [176, 132, 638, 1002],
    [176, 132, 638, 1002],
    [176, 132, 640, 1002],
    [176, 132, 682, 1002],
    [176, 132, 692, 1002],
    [176, 132, 696, 1002],
    [176, 132, 688, 1002],
    [176, 132, 664, 1002],
    [176, 132, 640, 1002],
    [176, 132, 638, 1002],
    [176, 132, 638, 1002],
    [176, 132, 638, 1002],
    [176, 132, 638, 1002],
    [176, 132, 638, 1002],
    [176, 132, 638, 1002],
    [176, 132, 648, 1002],
    [176, 132, 666, 1002],
    [176, 132, 668, 1002],
    [176, 132, 694, 1002],
    [178, 132, 714, 1002],
    [178, 132, 738, 1002]
   ],
   "bbox": [176, 132, 738, 1002],
   "margin": [176, 132, 94, 102],
   "active": [
    [
     2,
     32
    ]
   ],
   "dupes": [
    9,
    13,
    22,
    24,
    25,
    26,
    30
   ],
   "arc": [
    0.0,
    0.0132,
    0.039,
    0.0884,
    0.1638,
    0.1787,
    0.2563,
    0.325,
    0.3947,
    0.3952,
    0.4447,
    0.4813,
    0.5115,
    0.5125,
    0.5257,
    0.5594,
    0.6069,
    0.637,
    0.6463,
    0.6704,
    0.7103,
    0.7477,
    0.748,
    0.7701,
    0.7768,
    0.7814,
    0.782,
    0.8003,
    0.8256,
    0.8585,
    0.8591,
    0.914,
    0.9698,
    1.0
   ],
   "minSeconds": 0.3,
   "browOk": false,
   "browRead": {
    "line_px_median": 0.96,
    "line_px_max": 1.36,
    "frames_over": 6,
    "longest_run_over": 3,
    "per_frame_line_px": [
     0.02,
     0.08,
     0.17,
     0.56,
     0.56,
     0.62,
     0.66,
     1.05,
     1.31,
     1.36,
     1.3,
     0.93,
     0.68,
     0.68,
     0.74,
     1.21,
     1.19,
     1.16,
     1.15,
     1.13,
     1.03,
     0.95,
     0.98,
     0.73,
     0.74,
     0.73,
     0.74,
     0.99,
     1.11,
     1.29,
     1.22,
     1.08,
     1.1,
     0.65
    ]
   },
   "facePaste": true,
   "browSwap": false,
   "faceBlank": false,
   "faceClass": 2
  },
  "wave_f1_out": {
   "label": "挥手·正式 s1 → 归位",
   "from": "wave_f1",
   "to": "idle",
   "fps": 16,
   "frames": [
    "frames/wave_f1_loop/33.png",
    "frames/wave_f1_loop/34.png",
    "frames/wave_f1_loop/35.png",
    "frames/wave_f1_loop/36.png",
    "frames/wave_f1_loop/37.png",
    "frames/wave_f1_loop/38.png",
    "frames/wave_f1_loop/39.png",
    "frames/wave_f1_loop/40.png",
    "frames/wave_f1_loop/41.png",
    "frames/wave_f1_loop/42.png",
    "frames/wave_f1_loop/43.png",
    "frames/wave_f1_loop/44.png",
    "frames/wave_f1_loop/45.png",
    "frames/wave_f1_loop/46.png",
    "frames/wave_f1_loop/47.png",
    "frames/wave_f1_loop/48.png"
   ],
   "frameBBox": [
    [178, 132, 738, 1002],
    [180, 132, 734, 1002],
    [180, 132, 734, 1002],
    [180, 132, 700, 1002],
    [182, 134, 660, 1002],
    [182, 134, 646, 1002],
    [182, 134, 646, 1002],
    [182, 134, 646, 1002],
    [182, 134, 646, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [183, 137, 649, 1000]
   ],
   "bbox": [178, 132, 738, 1002],
   "margin": [178, 132, 94, 102],
   "active": [
    [
     1,
     9
    ]
   ],
   "dupes": [
    2,
    6
   ],
   "arc": [
    0.0,
    0.0456,
    0.0456,
    0.3501,
    0.5531,
    0.694,
    0.694,
    0.7986,
    0.8832,
    0.9288,
    0.9288,
    0.9502,
    0.9544,
    0.9544,
    0.9544,
    1.0
   ],
   "minSeconds": 0.3,
   "browOk": true,
   "browRead": {
    "line_px_median": 0.17,
    "line_px_max": 0.65,
    "frames_over": 0,
    "longest_run_over": 0,
    "per_frame_line_px": [
     0.65,
     0.52,
     0.52,
     0.64,
     0.59,
     0.46,
     0.44,
     0.22,
     0.11,
     0.08,
     0.08,
     0.08,
     0.08,
     0.08,
     0.08,
     0.02
    ]
   },
   "facePaste": true,
   "browSwap": false,
   "faceBlank": false,
   "faceClass": 2
  },
  "wave_d1_loop": {
   "label": "挥手·草稿 s1（一段做完去和回）",
   "from": "idle",
   "to": "idle",
   "fps": 16,
   "frames": [
    "frames/wave_d1_loop/00.png",
    "frames/wave_d1_loop/01.png",
    "frames/wave_d1_loop/02.png",
    "frames/wave_d1_loop/03.png",
    "frames/wave_d1_loop/04.png",
    "frames/wave_d1_loop/05.png",
    "frames/wave_d1_loop/06.png",
    "frames/wave_d1_loop/07.png",
    "frames/wave_d1_loop/08.png",
    "frames/wave_d1_loop/09.png",
    "frames/wave_d1_loop/10.png",
    "frames/wave_d1_loop/11.png",
    "frames/wave_d1_loop/12.png",
    "frames/wave_d1_loop/13.png",
    "frames/wave_d1_loop/14.png",
    "frames/wave_d1_loop/15.png",
    "frames/wave_d1_loop/16.png",
    "frames/wave_d1_loop/17.png",
    "frames/wave_d1_loop/18.png",
    "frames/wave_d1_loop/19.png",
    "frames/wave_d1_loop/20.png",
    "frames/wave_d1_loop/21.png",
    "frames/wave_d1_loop/22.png",
    "frames/wave_d1_loop/23.png",
    "frames/wave_d1_loop/24.png",
    "frames/wave_d1_loop/25.png",
    "frames/wave_d1_loop/26.png",
    "frames/wave_d1_loop/27.png",
    "frames/wave_d1_loop/28.png",
    "frames/wave_d1_loop/29.png",
    "frames/wave_d1_loop/30.png",
    "frames/wave_d1_loop/31.png",
    "frames/wave_d1_loop/32.png",
    "frames/wave_d1_loop/33.png",
    "frames/wave_d1_loop/34.png",
    "frames/wave_d1_loop/35.png",
    "frames/wave_d1_loop/36.png",
    "frames/wave_d1_loop/37.png",
    "frames/wave_d1_loop/38.png",
    "frames/wave_d1_loop/39.png",
    "frames/wave_d1_loop/40.png",
    "frames/wave_d1_loop/41.png",
    "frames/wave_d1_loop/42.png",
    "frames/wave_d1_loop/43.png",
    "frames/wave_d1_loop/44.png",
    "frames/wave_d1_loop/45.png",
    "frames/wave_d1_loop/46.png",
    "frames/wave_d1_loop/47.png",
    "frames/wave_d1_loop/48.png"
   ],
   "apex": 37,
   "away_pct": [
    0.0,
    1.33,
    3.9,
    6.02,
    10.02,
    12.22,
    14.56,
    14.47,
    12.98,
    12.89,
    13.17,
    12.7,
    11.23,
    10.73,
    8.78,
    6.6,
    7.62,
    10.13,
    11.25,
    12.61,
    12.61,
    11.23,
    10.02,
    7.11,
    6.29,
    8.13,
    9.26,
    10.9,
    11.45,
    12.49,
    13.08,
    14.22,
    15.03,
    15.39,
    15.81,
    15.81,
    18.14,
    18.85,
    17.05,
    14.91,
    10.97,
    8.8,
    4.85,
    3.27,
    1.46,
    1.13,
    1.11,
    1.15,
    0.0
   ],
   "frameBBox": [
    [183, 137, 649, 1000],
    [184, 134, 648, 1002],
    [184, 135, 648, 1002],
    [184, 134, 652, 1002],
    [180, 134, 692, 1002],
    [178, 132, 706, 1002],
    [174, 130, 712, 1002],
    [172, 130, 702, 1002],
    [168, 128, 658, 1002],
    [168, 128, 628, 1002],
    [168, 128, 630, 1002],
    [168, 128, 632, 1002],
    [172, 128, 634, 1002],
    [174, 130, 636, 1002],
    [178, 132, 640, 1002],
    [184, 134, 648, 1002],
    [186, 136, 652, 1002],
    [192, 140, 656, 1002],
    [194, 142, 658, 1002],
    [198, 144, 662, 1002],
    [198, 144, 662, 1002],
    [194, 142, 660, 1002],
    [190, 140, 656, 1002],
    [184, 138, 650, 1002],
    [182, 136, 648, 1002],
    [178, 134, 642, 1002],
    [176, 132, 640, 1002],
    [172, 132, 636, 1002],
    [170, 132, 634, 1002],
    [168, 130, 632, 1002],
    [168, 130, 630, 1002],
    [166, 130, 626, 1002],
    [164, 130, 624, 1002],
    [164, 130, 624, 1002],
    [162, 130, 626, 1002],
    [164, 130, 644, 1002],
    [166, 130, 682, 1002],
    [168, 130, 694, 1002],
    [172, 132, 692, 1002],
    [174, 132, 682, 1002],
    [176, 132, 658, 1002],
    [178, 134, 646, 1002],
    [180, 134, 644, 1002],
    [182, 134, 646, 1002],
    [182, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [183, 137, 649, 1000]
   ],
   "bbox": [162, 128, 712, 1002],
   "margin": [162, 128, 120, 102],
   "active": [
    [
     2,
     44
    ]
   ],
   "dupes": [
    13,
    20
   ],
   "arc": [
    0.0,
    0.0048,
    0.0144,
    0.0233,
    0.0553,
    0.0777,
    0.1269,
    0.1544,
    0.2012,
    0.2216,
    0.2416,
    0.2513,
    0.2765,
    0.2807,
    0.3128,
    0.357,
    0.3835,
    0.4236,
    0.442,
    0.4658,
    0.4666,
    0.4914,
    0.5113,
    0.5522,
    0.5723,
    0.6069,
    0.623,
    0.6494,
    0.657,
    0.6742,
    0.6817,
    0.7004,
    0.717,
    0.7266,
    0.7451,
    0.7592,
    0.7985,
    0.8219,
    0.8653,
    0.8877,
    0.9293,
    0.946,
    0.9739,
    0.9823,
    0.9951,
    0.9968,
    0.997,
    0.997,
    1.0
   ],
   "minSeconds": 0.6,
   "browOk": false,
   "browRead": {
    "line_px_median": 0.71,
    "line_px_max": 2.05,
    "frames_over": 11,
    "longest_run_over": 4,
    "per_frame_line_px": [
     0.02,
     0.07,
     0.26,
     0.52,
     0.69,
     0.79,
     0.91,
     0.97,
     1.82,
     2.05,
     1.4,
     1.35,
     0.95,
     0.88,
     0.68,
     0.56,
     0.56,
     0.64,
     0.65,
     1.14,
     1.32,
     1.24,
     1.21,
     0.71,
     0.71,
     0.52,
     0.54,
     0.66,
     0.67,
     0.71,
     0.74,
     0.84,
     1.04,
     1.17,
     1.68,
     1.86,
     1.45,
     1.31,
     1.2,
     1.08,
     0.8,
     0.58,
     0.23,
     0.13,
     0.1,
     0.08,
     0.07,
     0.08,
     0.02
    ]
   },
   "facePaste": true,
   "browSwap": false,
   "faceBlank": false,
   "faceClass": 2
  },
  "wave_d1_in": {
   "label": "归位 → 挥手·草稿 s1",
   "from": "idle",
   "to": "wave_d1",
   "fps": 16,
   "frames": [
    "frames/wave_d1_loop/00.png",
    "frames/wave_d1_loop/01.png",
    "frames/wave_d1_loop/02.png",
    "frames/wave_d1_loop/03.png",
    "frames/wave_d1_loop/04.png",
    "frames/wave_d1_loop/05.png",
    "frames/wave_d1_loop/06.png",
    "frames/wave_d1_loop/07.png",
    "frames/wave_d1_loop/08.png",
    "frames/wave_d1_loop/09.png",
    "frames/wave_d1_loop/10.png",
    "frames/wave_d1_loop/11.png",
    "frames/wave_d1_loop/12.png",
    "frames/wave_d1_loop/13.png",
    "frames/wave_d1_loop/14.png",
    "frames/wave_d1_loop/15.png",
    "frames/wave_d1_loop/16.png",
    "frames/wave_d1_loop/17.png",
    "frames/wave_d1_loop/18.png",
    "frames/wave_d1_loop/19.png",
    "frames/wave_d1_loop/20.png",
    "frames/wave_d1_loop/21.png",
    "frames/wave_d1_loop/22.png",
    "frames/wave_d1_loop/23.png",
    "frames/wave_d1_loop/24.png",
    "frames/wave_d1_loop/25.png",
    "frames/wave_d1_loop/26.png",
    "frames/wave_d1_loop/27.png",
    "frames/wave_d1_loop/28.png",
    "frames/wave_d1_loop/29.png",
    "frames/wave_d1_loop/30.png",
    "frames/wave_d1_loop/31.png",
    "frames/wave_d1_loop/32.png",
    "frames/wave_d1_loop/33.png",
    "frames/wave_d1_loop/34.png",
    "frames/wave_d1_loop/35.png",
    "frames/wave_d1_loop/36.png",
    "frames/wave_d1_loop/37.png"
   ],
   "frameBBox": [
    [183, 137, 649, 1000],
    [184, 134, 648, 1002],
    [184, 135, 648, 1002],
    [184, 134, 652, 1002],
    [180, 134, 692, 1002],
    [178, 132, 706, 1002],
    [174, 130, 712, 1002],
    [172, 130, 702, 1002],
    [168, 128, 658, 1002],
    [168, 128, 628, 1002],
    [168, 128, 630, 1002],
    [168, 128, 632, 1002],
    [172, 128, 634, 1002],
    [174, 130, 636, 1002],
    [178, 132, 640, 1002],
    [184, 134, 648, 1002],
    [186, 136, 652, 1002],
    [192, 140, 656, 1002],
    [194, 142, 658, 1002],
    [198, 144, 662, 1002],
    [198, 144, 662, 1002],
    [194, 142, 660, 1002],
    [190, 140, 656, 1002],
    [184, 138, 650, 1002],
    [182, 136, 648, 1002],
    [178, 134, 642, 1002],
    [176, 132, 640, 1002],
    [172, 132, 636, 1002],
    [170, 132, 634, 1002],
    [168, 130, 632, 1002],
    [168, 130, 630, 1002],
    [166, 130, 626, 1002],
    [164, 130, 624, 1002],
    [164, 130, 624, 1002],
    [162, 130, 626, 1002],
    [164, 130, 644, 1002],
    [166, 130, 682, 1002],
    [168, 130, 694, 1002]
   ],
   "bbox": [162, 128, 712, 1002],
   "margin": [162, 128, 120, 102],
   "active": [
    [
     2,
     36
    ]
   ],
   "dupes": [
    13,
    20
   ],
   "arc": [
    0.0,
    0.0058,
    0.0176,
    0.0285,
    0.0676,
    0.095,
    0.155,
    0.1887,
    0.2458,
    0.2707,
    0.2951,
    0.307,
    0.3378,
    0.3429,
    0.3821,
    0.4361,
    0.4685,
    0.5174,
    0.54,
    0.569,
    0.5699,
    0.6003,
    0.6246,
    0.6745,
    0.6991,
    0.7413,
    0.761,
    0.7932,
    0.8026,
    0.8236,
    0.8327,
    0.8555,
    0.8758,
    0.8875,
    0.9101,
    0.9274,
    0.9754,
    1.0
   ],
   "minSeconds": 0.3,
   "browOk": false,
   "browRead": {
    "line_px_median": 0.81,
    "line_px_max": 2.05,
    "frames_over": 11,
    "longest_run_over": 4,
    "per_frame_line_px": [
     0.02,
     0.07,
     0.26,
     0.52,
     0.69,
     0.79,
     0.91,
     0.97,
     1.82,
     2.05,
     1.4,
     1.35,
     0.95,
     0.88,
     0.68,
     0.56,
     0.56,
     0.64,
     0.65,
     1.14,
     1.32,
     1.24,
     1.21,
     0.71,
     0.71,
     0.52,
     0.54,
     0.66,
     0.67,
     0.71,
     0.74,
     0.84,
     1.04,
     1.17,
     1.68,
     1.86,
     1.45,
     1.31
    ]
   },
   "facePaste": true,
   "browSwap": false,
   "faceBlank": false,
   "faceClass": 2
  },
  "wave_d1_out": {
   "label": "挥手·草稿 s1 → 归位",
   "from": "wave_d1",
   "to": "idle",
   "fps": 16,
   "frames": [
    "frames/wave_d1_loop/37.png",
    "frames/wave_d1_loop/38.png",
    "frames/wave_d1_loop/39.png",
    "frames/wave_d1_loop/40.png",
    "frames/wave_d1_loop/41.png",
    "frames/wave_d1_loop/42.png",
    "frames/wave_d1_loop/43.png",
    "frames/wave_d1_loop/44.png",
    "frames/wave_d1_loop/45.png",
    "frames/wave_d1_loop/46.png",
    "frames/wave_d1_loop/47.png",
    "frames/wave_d1_loop/48.png"
   ],
   "frameBBox": [
    [168, 130, 694, 1002],
    [172, 132, 692, 1002],
    [174, 132, 682, 1002],
    [176, 132, 658, 1002],
    [178, 134, 646, 1002],
    [180, 134, 644, 1002],
    [182, 134, 646, 1002],
    [182, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [183, 137, 649, 1000]
   ],
   "bbox": [168, 130, 694, 1002],
   "margin": [168, 130, 138, 102],
   "active": [
    [
     1,
     7
    ]
   ],
   "dupes": [],
   "arc": [
    0.0,
    0.0866,
    0.2385,
    0.5204,
    0.634,
    0.8234,
    0.8802,
    0.9668,
    0.978,
    0.9798,
    0.9798,
    1.0
   ],
   "minSeconds": 0.3,
   "browOk": true,
   "browRead": {
    "line_px_median": 0.18,
    "line_px_max": 1.31,
    "frames_over": 1,
    "longest_run_over": 1,
    "per_frame_line_px": [
     1.31,
     1.2,
     1.08,
     0.8,
     0.58,
     0.23,
     0.13,
     0.1,
     0.08,
     0.07,
     0.08,
     0.02
    ]
   },
   "facePaste": true,
   "browSwap": false,
   "faceBlank": false,
   "faceClass": 2
  },
  "shrug_loop": {
   "label": "摊手·正式 s1（一段做完去和回）",
   "from": "idle",
   "to": "idle",
   "fps": 16,
   "frames": [
    "frames/shrug_loop/00.png",
    "frames/shrug_loop/01.png",
    "frames/shrug_loop/02.png",
    "frames/shrug_loop/03.png",
    "frames/shrug_loop/04.png",
    "frames/shrug_loop/05.png",
    "frames/shrug_loop/06.png",
    "frames/shrug_loop/07.png",
    "frames/shrug_loop/08.png",
    "frames/shrug_loop/09.png",
    "frames/shrug_loop/10.png",
    "frames/shrug_loop/11.png",
    "frames/shrug_loop/12.png",
    "frames/shrug_loop/13.png",
    "frames/shrug_loop/14.png",
    "frames/shrug_loop/15.png",
    "frames/shrug_loop/16.png",
    "frames/shrug_loop/17.png",
    "frames/shrug_loop/18.png",
    "frames/shrug_loop/19.png",
    "frames/shrug_loop/20.png",
    "frames/shrug_loop/21.png",
    "frames/shrug_loop/22.png",
    "frames/shrug_loop/23.png",
    "frames/shrug_loop/24.png",
    "frames/shrug_loop/25.png",
    "frames/shrug_loop/26.png",
    "frames/shrug_loop/27.png",
    "frames/shrug_loop/28.png",
    "frames/shrug_loop/29.png",
    "frames/shrug_loop/30.png",
    "frames/shrug_loop/31.png",
    "frames/shrug_loop/32.png",
    "frames/shrug_loop/33.png",
    "frames/shrug_loop/34.png",
    "frames/shrug_loop/35.png",
    "frames/shrug_loop/36.png",
    "frames/shrug_loop/37.png",
    "frames/shrug_loop/38.png",
    "frames/shrug_loop/39.png",
    "frames/shrug_loop/40.png",
    "frames/shrug_loop/41.png",
    "frames/shrug_loop/42.png",
    "frames/shrug_loop/43.png",
    "frames/shrug_loop/44.png",
    "frames/shrug_loop/45.png",
    "frames/shrug_loop/46.png",
    "frames/shrug_loop/47.png",
    "frames/shrug_loop/48.png"
   ],
   "apex": 20,
   "away_pct": [
    0.0,
    1.15,
    3.99,
    8.54,
    13.98,
    15.36,
    16.91,
    17.06,
    16.83,
    16.59,
    15.93,
    15.59,
    15.12,
    15.2,
    15.38,
    15.51,
    15.52,
    15.54,
    15.53,
    15.53,
    15.54,
    15.54,
    15.53,
    15.53,
    15.54,
    15.53,
    15.53,
    15.54,
    15.54,
    15.53,
    15.52,
    15.52,
    15.52,
    15.48,
    15.35,
    15.14,
    13.95,
    12.4,
    8.75,
    6.37,
    3.29,
    2.32,
    1.4,
    1.19,
    1.14,
    1.13,
    1.13,
    1.14,
    0.0
   ],
   "frameBBox": [
    [183, 137, 649, 1000],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 652, 1002],
    [156, 134, 676, 1002],
    [144, 134, 688, 1002],
    [132, 132, 698, 1002],
    [132, 134, 698, 1002],
    [134, 134, 696, 1002],
    [138, 132, 694, 1002],
    [144, 132, 688, 1002],
    [146, 132, 684, 1002],
    [152, 132, 678, 1002],
    [152, 132, 678, 1002],
    [150, 132, 680, 1002],
    [148, 132, 682, 1002],
    [148, 132, 682, 1002],
    [148, 132, 682, 1002],
    [148, 132, 684, 1002],
    [148, 132, 684, 1002],
    [148, 132, 684, 1002],
    [148, 132, 684, 1002],
    [148, 132, 684, 1002],
    [148, 132, 684, 1002],
    [148, 132, 684, 1002],
    [148, 132, 684, 1002],
    [148, 132, 684, 1002],
    [148, 132, 684, 1002],
    [148, 132, 684, 1002],
    [148, 132, 684, 1002],
    [148, 132, 684, 1002],
    [148, 132, 684, 1002],
    [148, 132, 684, 1002],
    [148, 132, 684, 1002],
    [148, 132, 684, 1002],
    [150, 132, 682, 1002],
    [158, 134, 674, 1002],
    [166, 134, 666, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 136, 648, 1002],
    [183, 137, 649, 1000]
   ],
   "bbox": [132, 132, 698, 1002],
   "margin": [132, 132, 134, 102],
   "active": [
    [
     2,
     42
    ]
   ],
   "dupes": [
    7,
    13,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33
   ],
   "arc": [
    0.0,
    0.0029,
    0.0568,
    0.1283,
    0.23,
    0.3014,
    0.386,
    0.3862,
    0.4179,
    0.447,
    0.5017,
    0.5363,
    0.576,
    0.5763,
    0.5932,
    0.6015,
    0.6015,
    0.6015,
    0.6015,
    0.6015,
    0.6015,
    0.6015,
    0.6015,
    0.6015,
    0.6015,
    0.6015,
    0.6015,
    0.6015,
    0.6015,
    0.6015,
    0.6015,
    0.6015,
    0.6015,
    0.6015,
    0.6117,
    0.6389,
    0.7048,
    0.7634,
    0.8378,
    0.8869,
    0.9446,
    0.968,
    0.9916,
    0.9953,
    0.9974,
    0.9974,
    0.9974,
    0.9974,
    1.0
   ],
   "minSeconds": 0.6,
   "browOk": true,
   "browRead": {
    "line_px_median": 0.98,
    "line_px_max": 1.02,
    "frames_over": 0,
    "longest_run_over": 0,
    "per_frame_line_px": [
     0.02,
     0.08,
     0.23,
     0.67,
     0.89,
     0.96,
     0.99,
     1.0,
     1.02,
     1.01,
     1.01,
     1.01,
     0.98,
     0.96,
     0.97,
     0.98,
     0.98,
     0.99,
     0.98,
     0.99,
     0.98,
     0.98,
     0.98,
     0.98,
     0.98,
     1.0,
     1.0,
     0.99,
     0.99,
     0.98,
     0.98,
     0.97,
     0.98,
     0.98,
     0.97,
     0.96,
     0.95,
     0.91,
     0.72,
     0.54,
     0.17,
     0.11,
     0.09,
     0.08,
     0.08,
     0.08,
     0.08,
     0.07,
     0.02
    ]
   },
   "facePaste": true,
   "browSwap": false,
   "faceBlank": false,
   "faceClass": 2
  },
  "shrug_in": {
   "label": "归位 → 摊手·正式 s1",
   "from": "idle",
   "to": "shrug",
   "fps": 16,
   "frames": [
    "frames/shrug_loop/00.png",
    "frames/shrug_loop/01.png",
    "frames/shrug_loop/02.png",
    "frames/shrug_loop/03.png",
    "frames/shrug_loop/04.png",
    "frames/shrug_loop/05.png",
    "frames/shrug_loop/06.png",
    "frames/shrug_loop/07.png",
    "frames/shrug_loop/08.png",
    "frames/shrug_loop/09.png",
    "frames/shrug_loop/10.png",
    "frames/shrug_loop/11.png",
    "frames/shrug_loop/12.png",
    "frames/shrug_loop/13.png",
    "frames/shrug_loop/14.png",
    "frames/shrug_loop/15.png",
    "frames/shrug_loop/16.png",
    "frames/shrug_loop/17.png",
    "frames/shrug_loop/18.png",
    "frames/shrug_loop/19.png",
    "frames/shrug_loop/20.png"
   ],
   "frameBBox": [
    [183, 137, 649, 1000],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 652, 1002],
    [156, 134, 676, 1002],
    [144, 134, 688, 1002],
    [132, 132, 698, 1002],
    [132, 134, 698, 1002],
    [134, 134, 696, 1002],
    [138, 132, 694, 1002],
    [144, 132, 688, 1002],
    [146, 132, 684, 1002],
    [152, 132, 678, 1002],
    [152, 132, 678, 1002],
    [150, 132, 680, 1002],
    [148, 132, 682, 1002],
    [148, 132, 682, 1002],
    [148, 132, 682, 1002],
    [148, 132, 684, 1002],
    [148, 132, 684, 1002],
    [148, 132, 684, 1002]
   ],
   "bbox": [132, 132, 698, 1002],
   "margin": [132, 132, 134, 102],
   "active": [
    [
     2,
     19
    ]
   ],
   "dupes": [
    7,
    13,
    15,
    16,
    17,
    18,
    19
   ],
   "arc": [
    0.0,
    0.0266,
    0.1143,
    0.2304,
    0.3958,
    0.512,
    0.6495,
    0.6499,
    0.7014,
    0.7488,
    0.8377,
    0.894,
    0.9586,
    0.9591,
    0.9865,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0
   ],
   "minSeconds": 0.3,
   "browOk": true,
   "browRead": {
    "line_px_median": 0.98,
    "line_px_max": 1.02,
    "frames_over": 0,
    "longest_run_over": 0,
    "per_frame_line_px": [
     0.02,
     0.08,
     0.23,
     0.67,
     0.89,
     0.96,
     0.99,
     1.0,
     1.02,
     1.01,
     1.01,
     1.01,
     0.98,
     0.96,
     0.97,
     0.98,
     0.98,
     0.99,
     0.98,
     0.99,
     0.98
    ]
   },
   "facePaste": true,
   "browSwap": false,
   "faceBlank": false,
   "faceClass": 2
  },
  "shrug_out": {
   "label": "摊手·正式 s1 → 归位",
   "from": "shrug",
   "to": "idle",
   "fps": 16,
   "frames": [
    "frames/shrug_loop/20.png",
    "frames/shrug_loop/21.png",
    "frames/shrug_loop/22.png",
    "frames/shrug_loop/23.png",
    "frames/shrug_loop/24.png",
    "frames/shrug_loop/25.png",
    "frames/shrug_loop/26.png",
    "frames/shrug_loop/27.png",
    "frames/shrug_loop/28.png",
    "frames/shrug_loop/29.png",
    "frames/shrug_loop/30.png",
    "frames/shrug_loop/31.png",
    "frames/shrug_loop/32.png",
    "frames/shrug_loop/33.png",
    "frames/shrug_loop/34.png",
    "frames/shrug_loop/35.png",
    "frames/shrug_loop/36.png",
    "frames/shrug_loop/37.png",
    "frames/shrug_loop/38.png",
    "frames/shrug_loop/39.png",
    "frames/shrug_loop/40.png",
    "frames/shrug_loop/41.png",
    "frames/shrug_loop/42.png",
    "frames/shrug_loop/43.png",
    "frames/shrug_loop/44.png",
    "frames/shrug_loop/45.png",
    "frames/shrug_loop/46.png",
    "frames/shrug_loop/47.png",
    "frames/shrug_loop/48.png"
   ],
   "frameBBox": [
    [148, 132, 684, 1002],
    [148, 132, 684, 1002],
    [148, 132, 684, 1002],
    [148, 132, 684, 1002],
    [148, 132, 684, 1002],
    [148, 132, 684, 1002],
    [148, 132, 684, 1002],
    [148, 132, 684, 1002],
    [148, 132, 684, 1002],
    [148, 132, 684, 1002],
    [148, 132, 684, 1002],
    [148, 132, 684, 1002],
    [148, 132, 684, 1002],
    [148, 132, 684, 1002],
    [148, 132, 684, 1002],
    [150, 132, 682, 1002],
    [158, 134, 674, 1002],
    [166, 134, 666, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 136, 648, 1002],
    [183, 137, 649, 1000]
   ],
   "bbox": [148, 132, 684, 1002],
   "margin": [148, 132, 148, 102],
   "active": [
    [
     1,
     22
    ]
   ],
   "dupes": [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13
   ],
   "arc": [
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0258,
    0.0944,
    0.2609,
    0.409,
    0.5967,
    0.7208,
    0.8666,
    0.9256,
    0.9851,
    0.9945,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0
   ],
   "minSeconds": 0.3,
   "browOk": true,
   "browRead": {
    "line_px_median": 0.97,
    "line_px_max": 1.0,
    "frames_over": 0,
    "longest_run_over": 0,
    "per_frame_line_px": [
     0.98,
     0.98,
     0.98,
     0.98,
     0.98,
     1.0,
     1.0,
     0.99,
     0.99,
     0.98,
     0.98,
     0.97,
     0.98,
     0.98,
     0.97,
     0.96,
     0.95,
     0.91,
     0.72,
     0.54,
     0.17,
     0.11,
     0.09,
     0.08,
     0.08,
     0.08,
     0.08,
     0.07,
     0.02
    ]
   },
   "facePaste": true,
   "browSwap": false,
   "faceBlank": false,
   "faceClass": 2
  },
  "shrug_f2_loop": {
   "label": "摊手·正式 s2（一段做完去和回）",
   "from": "idle",
   "to": "idle",
   "fps": 16,
   "frames": [
    "frames/shrug_f2_loop/00.png",
    "frames/shrug_f2_loop/01.png",
    "frames/shrug_f2_loop/02.png",
    "frames/shrug_f2_loop/03.png",
    "frames/shrug_f2_loop/04.png",
    "frames/shrug_f2_loop/05.png",
    "frames/shrug_f2_loop/06.png",
    "frames/shrug_f2_loop/07.png",
    "frames/shrug_f2_loop/08.png",
    "frames/shrug_f2_loop/09.png",
    "frames/shrug_f2_loop/10.png",
    "frames/shrug_f2_loop/11.png",
    "frames/shrug_f2_loop/12.png",
    "frames/shrug_f2_loop/13.png",
    "frames/shrug_f2_loop/14.png",
    "frames/shrug_f2_loop/15.png",
    "frames/shrug_f2_loop/16.png",
    "frames/shrug_f2_loop/17.png",
    "frames/shrug_f2_loop/18.png",
    "frames/shrug_f2_loop/19.png",
    "frames/shrug_f2_loop/20.png",
    "frames/shrug_f2_loop/21.png",
    "frames/shrug_f2_loop/22.png",
    "frames/shrug_f2_loop/23.png",
    "frames/shrug_f2_loop/24.png",
    "frames/shrug_f2_loop/25.png",
    "frames/shrug_f2_loop/26.png",
    "frames/shrug_f2_loop/27.png",
    "frames/shrug_f2_loop/28.png",
    "frames/shrug_f2_loop/29.png",
    "frames/shrug_f2_loop/30.png",
    "frames/shrug_f2_loop/31.png",
    "frames/shrug_f2_loop/32.png",
    "frames/shrug_f2_loop/33.png",
    "frames/shrug_f2_loop/34.png",
    "frames/shrug_f2_loop/35.png",
    "frames/shrug_f2_loop/36.png",
    "frames/shrug_f2_loop/37.png",
    "frames/shrug_f2_loop/38.png",
    "frames/shrug_f2_loop/39.png",
    "frames/shrug_f2_loop/40.png",
    "frames/shrug_f2_loop/41.png",
    "frames/shrug_f2_loop/42.png",
    "frames/shrug_f2_loop/43.png",
    "frames/shrug_f2_loop/44.png",
    "frames/shrug_f2_loop/45.png",
    "frames/shrug_f2_loop/46.png",
    "frames/shrug_f2_loop/47.png",
    "frames/shrug_f2_loop/48.png"
   ],
   "apex": 21,
   "away_pct": [
    0.0,
    1.44,
    3.53,
    5.18,
    8.81,
    10.76,
    13.2,
    14.19,
    15.29,
    15.85,
    16.57,
    16.9,
    17.19,
    17.29,
    17.39,
    17.45,
    17.46,
    17.49,
    17.5,
    17.5,
    17.51,
    17.5,
    17.5,
    17.5,
    17.5,
    17.5,
    17.51,
    17.51,
    17.51,
    17.47,
    17.46,
    17.4,
    17.19,
    16.93,
    16.12,
    15.26,
    13.82,
    12.91,
    10.67,
    9.2,
    6.35,
    4.99,
    3.03,
    2.15,
    1.24,
    1.12,
    1.13,
    1.14,
    0.0
   ],
   "frameBBox": [
    [183, 137, 649, 1000],
    [184, 134, 648, 1002],
    [186, 136, 650, 1002],
    [186, 136, 650, 1002],
    [186, 136, 650, 1002],
    [186, 136, 650, 1002],
    [180, 136, 660, 1002],
    [174, 136, 666, 1002],
    [168, 136, 670, 1002],
    [166, 136, 674, 1002],
    [160, 136, 676, 1002],
    [158, 136, 678, 1002],
    [156, 136, 680, 1002],
    [156, 136, 680, 1002],
    [156, 136, 680, 1002],
    [154, 136, 680, 1002],
    [154, 136, 680, 1002],
    [154, 136, 680, 1002],
    [154, 136, 680, 1002],
    [154, 136, 680, 1002],
    [154, 136, 680, 1002],
    [154, 136, 680, 1002],
    [154, 136, 680, 1002],
    [154, 136, 680, 1002],
    [154, 136, 680, 1002],
    [154, 136, 680, 1002],
    [154, 136, 680, 1002],
    [154, 136, 680, 1002],
    [154, 136, 680, 1002],
    [154, 136, 680, 1002],
    [154, 136, 680, 1002],
    [154, 136, 680, 1002],
    [156, 136, 680, 1002],
    [156, 136, 680, 1002],
    [162, 136, 676, 1002],
    [170, 136, 666, 1002],
    [176, 136, 658, 1002],
    [184, 136, 654, 1002],
    [186, 136, 650, 1002],
    [186, 136, 650, 1002],
    [186, 136, 650, 1002],
    [186, 136, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 134, 648, 1002],
    [183, 137, 649, 1000]
   ],
   "bbox": [154, 134, 680, 1002],
   "margin": [154, 134, 152, 102],
   "active": [
    [
     2,
     44
    ]
   ],
   "dupes": [
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    31
   ],
   "arc": [
    0.0,
    0.012,
    0.0642,
    0.1002,
    0.1755,
    0.2217,
    0.2904,
    0.3296,
    0.3853,
    0.4115,
    0.4523,
    0.4723,
    0.4969,
    0.4992,
    0.5017,
    0.5017,
    0.5017,
    0.5017,
    0.5017,
    0.5017,
    0.5017,
    0.5017,
    0.5017,
    0.5017,
    0.5017,
    0.5017,
    0.5017,
    0.5017,
    0.5017,
    0.5017,
    0.5017,
    0.5017,
    0.5115,
    0.5199,
    0.5605,
    0.594,
    0.6573,
    0.6972,
    0.7652,
    0.8019,
    0.8613,
    0.8917,
    0.9353,
    0.9584,
    0.9867,
    0.9891,
    0.9891,
    0.9891,
    1.0
   ],
   "minSeconds": 0.6,
   "browOk": true,
   "browRead": {
    "line_px_median": 1.04,
    "line_px_max": 1.13,
    "frames_over": 0,
    "longest_run_over": 0,
    "per_frame_line_px": [
     0.02,
     0.08,
     0.12,
     0.2,
     0.51,
     0.64,
     0.82,
     0.89,
     0.96,
     1.01,
     1.07,
     1.09,
     1.1,
     1.08,
     1.08,
     1.07,
     1.06,
     1.09,
     1.1,
     1.13,
     1.12,
     1.12,
     1.08,
     1.07,
     1.06,
     1.08,
     1.12,
     1.1,
     1.12,
     1.12,
     1.13,
     1.12,
     1.11,
     1.11,
     1.04,
     1.03,
     0.94,
     0.86,
     0.73,
     0.62,
     0.38,
     0.24,
     0.12,
     0.09,
     0.08,
     0.07,
     0.07,
     0.07,
     0.02
    ]
   },
   "facePaste": true,
   "browSwap": false,
   "faceBlank": false,
   "faceClass": 2
  },
  "shrug_f2_in": {
   "label": "归位 → 摊手·正式 s2",
   "from": "idle",
   "to": "shrug_f2",
   "fps": 16,
   "frames": [
    "frames/shrug_f2_loop/00.png",
    "frames/shrug_f2_loop/01.png",
    "frames/shrug_f2_loop/02.png",
    "frames/shrug_f2_loop/03.png",
    "frames/shrug_f2_loop/04.png",
    "frames/shrug_f2_loop/05.png",
    "frames/shrug_f2_loop/06.png",
    "frames/shrug_f2_loop/07.png",
    "frames/shrug_f2_loop/08.png",
    "frames/shrug_f2_loop/09.png",
    "frames/shrug_f2_loop/10.png",
    "frames/shrug_f2_loop/11.png",
    "frames/shrug_f2_loop/12.png",
    "frames/shrug_f2_loop/13.png",
    "frames/shrug_f2_loop/14.png",
    "frames/shrug_f2_loop/15.png",
    "frames/shrug_f2_loop/16.png",
    "frames/shrug_f2_loop/17.png",
    "frames/shrug_f2_loop/18.png",
    "frames/shrug_f2_loop/19.png",
    "frames/shrug_f2_loop/20.png",
    "frames/shrug_f2_loop/21.png"
   ],
   "frameBBox": [
    [183, 137, 649, 1000],
    [184, 134, 648, 1002],
    [186, 136, 650, 1002],
    [186, 136, 650, 1002],
    [186, 136, 650, 1002],
    [186, 136, 650, 1002],
    [180, 136, 660, 1002],
    [174, 136, 666, 1002],
    [168, 136, 670, 1002],
    [166, 136, 674, 1002],
    [160, 136, 676, 1002],
    [158, 136, 678, 1002],
    [156, 136, 680, 1002],
    [156, 136, 680, 1002],
    [156, 136, 680, 1002],
    [154, 136, 680, 1002],
    [154, 136, 680, 1002],
    [154, 136, 680, 1002],
    [154, 136, 680, 1002],
    [154, 136, 680, 1002],
    [154, 136, 680, 1002],
    [154, 136, 680, 1002]
   ],
   "bbox": [154, 134, 680, 1002],
   "margin": [154, 134, 152, 102],
   "active": [
    [
     2,
     20
    ]
   ],
   "dupes": [
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20
   ],
   "arc": [
    0.0,
    0.0477,
    0.1492,
    0.2192,
    0.3656,
    0.4554,
    0.589,
    0.6652,
    0.7737,
    0.8245,
    0.9038,
    0.9428,
    0.9905,
    0.9951,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0
   ],
   "minSeconds": 0.3,
   "browOk": true,
   "browRead": {
    "line_px_median": 1.06,
    "line_px_max": 1.13,
    "frames_over": 0,
    "longest_run_over": 0,
    "per_frame_line_px": [
     0.02,
     0.08,
     0.12,
     0.2,
     0.51,
     0.64,
     0.82,
     0.89,
     0.96,
     1.01,
     1.07,
     1.09,
     1.1,
     1.08,
     1.08,
     1.07,
     1.06,
     1.09,
     1.1,
     1.13,
     1.12,
     1.12
    ]
   },
   "facePaste": true,
   "browSwap": false,
   "faceBlank": false,
   "faceClass": 2
  },
  "shrug_f2_out": {
   "label": "摊手·正式 s2 → 归位",
   "from": "shrug_f2",
   "to": "idle",
   "fps": 16,
   "frames": [
    "frames/shrug_f2_loop/21.png",
    "frames/shrug_f2_loop/22.png",
    "frames/shrug_f2_loop/23.png",
    "frames/shrug_f2_loop/24.png",
    "frames/shrug_f2_loop/25.png",
    "frames/shrug_f2_loop/26.png",
    "frames/shrug_f2_loop/27.png",
    "frames/shrug_f2_loop/28.png",
    "frames/shrug_f2_loop/29.png",
    "frames/shrug_f2_loop/30.png",
    "frames/shrug_f2_loop/31.png",
    "frames/shrug_f2_loop/32.png",
    "frames/shrug_f2_loop/33.png",
    "frames/shrug_f2_loop/34.png",
    "frames/shrug_f2_loop/35.png",
    "frames/shrug_f2_loop/36.png",
    "frames/shrug_f2_loop/37.png",
    "frames/shrug_f2_loop/38.png",
    "frames/shrug_f2_loop/39.png",
    "frames/shrug_f2_loop/40.png",
    "frames/shrug_f2_loop/41.png",
    "frames/shrug_f2_loop/42.png",
    "frames/shrug_f2_loop/43.png",
    "frames/shrug_f2_loop/44.png",
    "frames/shrug_f2_loop/45.png",
    "frames/shrug_f2_loop/46.png",
    "frames/shrug_f2_loop/47.png",
    "frames/shrug_f2_loop/48.png"
   ],
   "frameBBox": [
    [154, 136, 680, 1002],
    [154, 136, 680, 1002],
    [154, 136, 680, 1002],
    [154, 136, 680, 1002],
    [154, 136, 680, 1002],
    [154, 136, 680, 1002],
    [154, 136, 680, 1002],
    [154, 136, 680, 1002],
    [154, 136, 680, 1002],
    [154, 136, 680, 1002],
    [154, 136, 680, 1002],
    [156, 136, 680, 1002],
    [156, 136, 680, 1002],
    [162, 136, 676, 1002],
    [170, 136, 666, 1002],
    [176, 136, 658, 1002],
    [184, 136, 654, 1002],
    [186, 136, 650, 1002],
    [186, 136, 650, 1002],
    [186, 136, 650, 1002],
    [186, 136, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 134, 648, 1002],
    [183, 137, 649, 1000]
   ],
   "bbox": [154, 134, 680, 1002],
   "margin": [154, 134, 152, 102],
   "active": [
    [
     1,
     23
    ]
   ],
   "dupes": [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10
   ],
   "arc": [
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0196,
    0.0367,
    0.1185,
    0.1861,
    0.3138,
    0.3942,
    0.5312,
    0.6054,
    0.7251,
    0.7864,
    0.8744,
    0.921,
    0.978,
    0.9829,
    0.9829,
    0.9829,
    1.0
   ],
   "minSeconds": 0.3,
   "browOk": true,
   "browRead": {
    "line_px_median": 1.04,
    "line_px_max": 1.13,
    "frames_over": 0,
    "longest_run_over": 0,
    "per_frame_line_px": [
     1.12,
     1.08,
     1.07,
     1.06,
     1.08,
     1.12,
     1.1,
     1.12,
     1.12,
     1.13,
     1.12,
     1.11,
     1.11,
     1.04,
     1.03,
     0.94,
     0.86,
     0.73,
     0.62,
     0.38,
     0.24,
     0.12,
     0.09,
     0.08,
     0.07,
     0.07,
     0.07,
     0.02
    ]
   },
   "facePaste": true,
   "browSwap": false,
   "faceBlank": false,
   "faceClass": 2
  },
  "spin_loop": {
   "label": "单脚转·草稿 s4（一段做完去和回）",
   "from": "idle",
   "to": "idle",
   "fps": 16,
   "frames": [
    "frames/spin_loop/00.png",
    "frames/spin_loop/01.png",
    "frames/spin_loop/02.png",
    "frames/spin_loop/03.png",
    "frames/spin_loop/04.png",
    "frames/spin_loop/05.png",
    "frames/spin_loop/06.png",
    "frames/spin_loop/07.png",
    "frames/spin_loop/08.png",
    "frames/spin_loop/09.png",
    "frames/spin_loop/10.png",
    "frames/spin_loop/11.png",
    "frames/spin_loop/12.png",
    "frames/spin_loop/13.png",
    "frames/spin_loop/14.png",
    "frames/spin_loop/15.png",
    "frames/spin_loop/16.png",
    "frames/spin_loop/17.png",
    "frames/spin_loop/18.png",
    "frames/spin_loop/19.png",
    "frames/spin_loop/20.png",
    "frames/spin_loop/21.png",
    "frames/spin_loop/22.png",
    "frames/spin_loop/23.png",
    "frames/spin_loop/24.png",
    "frames/spin_loop/25.png",
    "frames/spin_loop/26.png",
    "frames/spin_loop/27.png",
    "frames/spin_loop/28.png",
    "frames/spin_loop/29.png",
    "frames/spin_loop/30.png",
    "frames/spin_loop/31.png",
    "frames/spin_loop/32.png",
    "frames/spin_loop/33.png",
    "frames/spin_loop/34.png",
    "frames/spin_loop/35.png",
    "frames/spin_loop/36.png",
    "frames/spin_loop/37.png",
    "frames/spin_loop/38.png",
    "frames/spin_loop/39.png",
    "frames/spin_loop/40.png",
    "frames/spin_loop/41.png",
    "frames/spin_loop/42.png",
    "frames/spin_loop/43.png",
    "frames/spin_loop/44.png",
    "frames/spin_loop/45.png",
    "frames/spin_loop/46.png",
    "frames/spin_loop/47.png",
    "frames/spin_loop/48.png",
    "frames/spin_loop/49.png",
    "frames/spin_loop/50.png",
    "frames/spin_loop/51.png",
    "frames/spin_loop/52.png",
    "frames/spin_loop/53.png",
    "frames/spin_loop/54.png",
    "frames/spin_loop/55.png",
    "frames/spin_loop/56.png",
    "frames/spin_loop/57.png",
    "frames/spin_loop/58.png",
    "frames/spin_loop/59.png",
    "frames/spin_loop/60.png",
    "frames/spin_loop/61.png",
    "frames/spin_loop/62.png",
    "frames/spin_loop/63.png",
    "frames/spin_loop/64.png",
    "frames/spin_loop/65.png",
    "frames/spin_loop/66.png",
    "frames/spin_loop/67.png",
    "frames/spin_loop/68.png",
    "frames/spin_loop/69.png",
    "frames/spin_loop/70.png",
    "frames/spin_loop/71.png",
    "frames/spin_loop/72.png",
    "frames/spin_loop/73.png",
    "frames/spin_loop/74.png",
    "frames/spin_loop/75.png",
    "frames/spin_loop/76.png",
    "frames/spin_loop/77.png",
    "frames/spin_loop/78.png",
    "frames/spin_loop/79.png",
    "frames/spin_loop/80.png"
   ],
   "apex": 51,
   "away_pct": [
    0.0,
    1.67,
    2.91,
    4.36,
    6.19,
    7.22,
    9.42,
    12.15,
    14.81,
    18.01,
    20.56,
    23.05,
    25.13,
    27.79,
    30.23,
    30.99,
    32.17,
    32.69,
    32.59,
    32.01,
    31.38,
    30.44,
    29.18,
    27.37,
    25.0,
    23.51,
    20.75,
    17.9,
    16.21,
    15.46,
    14.91,
    14.26,
    14.23,
    14.27,
    14.29,
    14.15,
    14.25,
    14.63,
    15.41,
    16.8,
    18.33,
    19.99,
    21.92,
    24.22,
    25.33,
    27.59,
    29.48,
    30.97,
    31.85,
    32.19,
    32.25,
    32.04,
    31.7,
    31.08,
    30.7,
    29.85,
    28.61,
    27.23,
    25.79,
    24.34,
    22.52,
    20.36,
    18.32,
    17.4,
    15.45,
    13.47,
    11.61,
    9.73,
    8.02,
    6.47,
    5.17,
    4.09,
    3.26,
    2.87,
    2.35,
    1.95,
    1.67,
    1.47,
    1.3,
    1.22,
    0.0
   ],
   "frameBBox": [
    [183, 137, 649, 1000],
    [184, 136, 648, 1002],
    [186, 136, 646, 1002],
    [188, 134, 644, 1002],
    [190, 134, 644, 1002],
    [192, 134, 644, 1002],
    [196, 134, 646, 1002],
    [202, 134, 648, 1002],
    [210, 132, 646, 1002],
    [220, 132, 646, 1002],
    [236, 132, 646, 1000],
    [244, 132, 646, 1000],
    [248, 132, 644, 998],
    [254, 132, 644, 998],
    [258, 132, 642, 998],
    [258, 132, 642, 996],
    [256, 132, 642, 996],
    [254, 132, 642, 996],
    [250, 132, 640, 996],
    [248, 132, 638, 996],
    [248, 132, 638, 996],
    [248, 132, 636, 994],
    [250, 132, 634, 996],
    [252, 132, 632, 996],
    [256, 132, 632, 996],
    [252, 132, 632, 996],
    [246, 132, 632, 996],
    [240, 132, 632, 996],
    [224, 132, 630, 996],
    [210, 132, 626, 994],
    [198, 132, 628, 994],
    [190, 132, 636, 994],
    [182, 132, 642, 994],
    [178, 132, 646, 992],
    [176, 130, 648, 990],
    [174, 130, 652, 994],
    [174, 130, 654, 994],
    [176, 130, 654, 990],
    [180, 130, 652, 990],
    [186, 130, 648, 992],
    [192, 130, 642, 992],
    [192, 130, 632, 994],
    [192, 130, 622, 994],
    [194, 130, 606, 994],
    [194, 130, 598, 994],
    [192, 130, 578, 994],
    [192, 130, 574, 994],
    [190, 130, 578, 994],
    [190, 130, 582, 994],
    [192, 130, 586, 994],
    [194, 130, 588, 996],
    [198, 130, 592, 996],
    [200, 130, 594, 996],
    [202, 130, 596, 998],
    [202, 132, 594, 998],
    [202, 132, 590, 998],
    [200, 132, 588, 998],
    [200, 132, 582, 1000],
    [200, 132, 578, 1000],
    [198, 132, 584, 1000],
    [198, 134, 588, 1000],
    [200, 134, 598, 1002],
    [200, 134, 608, 1002],
    [202, 134, 614, 1002],
    [204, 134, 622, 1002],
    [204, 136, 630, 1002],
    [204, 134, 636, 1002],
    [200, 134, 640, 1002],
    [194, 134, 644, 1002],
    [190, 134, 646, 1002],
    [188, 134, 648, 1002],
    [186, 134, 648, 1002],
    [184, 134, 648, 1002],
    [182, 134, 648, 1002],
    [182, 134, 648, 1002],
    [182, 134, 648, 1002],
    [182, 134, 648, 1002],
    [182, 134, 648, 1002],
    [184, 134, 648, 1002],
    [184, 134, 648, 1002],
    [183, 137, 649, 1000]
   ],
   "bbox": [174, 130, 654, 1002],
   "margin": [174, 130, 178, 102],
   "active": [
    [
     2,
     75
    ]
   ],
   "dupes": [
    73
   ],
   "arc": [
    0.0,
    0.0048,
    0.0118,
    0.0217,
    0.0351,
    0.0422,
    0.0606,
    0.0821,
    0.1042,
    0.1261,
    0.1467,
    0.167,
    0.1877,
    0.2079,
    0.2264,
    0.2369,
    0.2533,
    0.2687,
    0.2836,
    0.297,
    0.3098,
    0.3225,
    0.3355,
    0.3494,
    0.3636,
    0.3732,
    0.3872,
    0.4013,
    0.4152,
    0.4292,
    0.4425,
    0.4554,
    0.4672,
    0.4785,
    0.4856,
    0.498,
    0.5096,
    0.5215,
    0.5325,
    0.544,
    0.5556,
    0.5678,
    0.5802,
    0.5935,
    0.6019,
    0.6155,
    0.6295,
    0.643,
    0.656,
    0.6681,
    0.6805,
    0.6932,
    0.7062,
    0.7199,
    0.7288,
    0.7436,
    0.7588,
    0.774,
    0.7896,
    0.8059,
    0.8224,
    0.8391,
    0.8555,
    0.8643,
    0.8809,
    0.8976,
    0.914,
    0.9299,
    0.9448,
    0.9583,
    0.9704,
    0.9807,
    0.9894,
    0.9911,
    0.9962,
    0.9984,
    0.9988,
    0.9988,
    0.9988,
    0.9988,
    1.0
   ],
   "minSeconds": 0.6,
   "moveSeconds": 2.4,
   "browOk": false,
   "browRead": {
    "note": "没有头部跟踪 / 有不可贴的帧"
   },
   "facePaste": false,
   "browSwap": false,
   "faceBlank": false,
   "faceClass": 3
  },
  "spin_d5_loop": {
   "label": "单脚转·草稿 s5（一段做完去和回）",
   "from": "idle",
   "to": "idle",
   "fps": 16,
   "frames": [
    "frames/spin_d5_loop/00.png",
    "frames/spin_d5_loop/01.png",
    "frames/spin_d5_loop/02.png",
    "frames/spin_d5_loop/03.png",
    "frames/spin_d5_loop/04.png",
    "frames/spin_d5_loop/05.png",
    "frames/spin_d5_loop/06.png",
    "frames/spin_d5_loop/07.png",
    "frames/spin_d5_loop/08.png",
    "frames/spin_d5_loop/09.png",
    "frames/spin_d5_loop/10.png",
    "frames/spin_d5_loop/11.png",
    "frames/spin_d5_loop/12.png",
    "frames/spin_d5_loop/13.png",
    "frames/spin_d5_loop/14.png",
    "frames/spin_d5_loop/15.png",
    "frames/spin_d5_loop/16.png",
    "frames/spin_d5_loop/17.png",
    "frames/spin_d5_loop/18.png",
    "frames/spin_d5_loop/19.png",
    "frames/spin_d5_loop/20.png",
    "frames/spin_d5_loop/21.png",
    "frames/spin_d5_loop/22.png",
    "frames/spin_d5_loop/23.png",
    "frames/spin_d5_loop/24.png",
    "frames/spin_d5_loop/25.png",
    "frames/spin_d5_loop/26.png",
    "frames/spin_d5_loop/27.png",
    "frames/spin_d5_loop/28.png",
    "frames/spin_d5_loop/29.png",
    "frames/spin_d5_loop/30.png",
    "frames/spin_d5_loop/31.png",
    "frames/spin_d5_loop/32.png",
    "frames/spin_d5_loop/33.png",
    "frames/spin_d5_loop/34.png",
    "frames/spin_d5_loop/35.png",
    "frames/spin_d5_loop/36.png",
    "frames/spin_d5_loop/37.png",
    "frames/spin_d5_loop/38.png",
    "frames/spin_d5_loop/39.png",
    "frames/spin_d5_loop/40.png",
    "frames/spin_d5_loop/41.png",
    "frames/spin_d5_loop/42.png",
    "frames/spin_d5_loop/43.png",
    "frames/spin_d5_loop/44.png",
    "frames/spin_d5_loop/45.png",
    "frames/spin_d5_loop/46.png",
    "frames/spin_d5_loop/47.png",
    "frames/spin_d5_loop/48.png",
    "frames/spin_d5_loop/49.png",
    "frames/spin_d5_loop/50.png",
    "frames/spin_d5_loop/51.png",
    "frames/spin_d5_loop/52.png",
    "frames/spin_d5_loop/53.png",
    "frames/spin_d5_loop/54.png",
    "frames/spin_d5_loop/55.png",
    "frames/spin_d5_loop/56.png",
    "frames/spin_d5_loop/57.png",
    "frames/spin_d5_loop/58.png",
    "frames/spin_d5_loop/59.png",
    "frames/spin_d5_loop/60.png",
    "frames/spin_d5_loop/61.png",
    "frames/spin_d5_loop/62.png",
    "frames/spin_d5_loop/63.png",
    "frames/spin_d5_loop/64.png",
    "frames/spin_d5_loop/65.png",
    "frames/spin_d5_loop/66.png",
    "frames/spin_d5_loop/67.png",
    "frames/spin_d5_loop/68.png",
    "frames/spin_d5_loop/69.png",
    "frames/spin_d5_loop/70.png",
    "frames/spin_d5_loop/71.png",
    "frames/spin_d5_loop/72.png",
    "frames/spin_d5_loop/73.png",
    "frames/spin_d5_loop/74.png",
    "frames/spin_d5_loop/75.png",
    "frames/spin_d5_loop/76.png",
    "frames/spin_d5_loop/77.png",
    "frames/spin_d5_loop/78.png",
    "frames/spin_d5_loop/79.png",
    "frames/spin_d5_loop/80.png"
   ],
   "apex": 52,
   "away_pct": [
    0.0,
    1.33,
    1.97,
    3.0,
    4.6,
    5.72,
    8.24,
    10.79,
    13.91,
    17.97,
    20.94,
    23.17,
    25.79,
    28.37,
    29.69,
    30.29,
    31.23,
    31.97,
    32.48,
    31.91,
    30.6,
    29.62,
    28.51,
    27.21,
    26.0,
    25.3,
    23.73,
    21.63,
    19.03,
    15.82,
    13.38,
    12.63,
    12.12,
    12.05,
    11.97,
    11.72,
    12.13,
    13.25,
    14.48,
    15.72,
    16.84,
    18.15,
    19.35,
    20.59,
    21.17,
    23.46,
    26.45,
    29.01,
    30.42,
    31.26,
    32.26,
    33.35,
    34.0,
    34.09,
    34.1,
    33.84,
    33.02,
    31.72,
    30.13,
    28.37,
    26.71,
    24.8,
    22.85,
    21.83,
    19.87,
    17.83,
    15.91,
    14.06,
    12.36,
    10.73,
    9.16,
    7.56,
    6.36,
    5.81,
    4.87,
    3.81,
    2.99,
    2.34,
    1.82,
    1.37,
    0.0
   ],
   "frameBBox": [
    [183, 137, 649, 1000],
    [184, 134, 648, 1002],
    [184, 134, 648, 1004],
    [186, 134, 646, 1004],
    [190, 134, 644, 1004],
    [192, 134, 644, 1004],
    [196, 134, 648, 1004],
    [204, 132, 648, 1004],
    [212, 132, 648, 1004],
    [224, 132, 648, 1004],
    [238, 132, 646, 1004],
    [250, 132, 644, 1002],
    [252, 130, 640, 1002],
    [254, 130, 638, 1002],
    [258, 130, 636, 1000],
    [260, 130, 636, 1000],
    [260, 130, 636, 1000],
    [258, 130, 636, 1000],
    [258, 130, 636, 1000],
    [260, 130, 638, 1000],
    [262, 130, 640, 1000],
    [262, 130, 640, 998],
    [260, 130, 640, 998],
    [258, 130, 640, 998],
    [258, 132, 640, 998],
    [256, 130, 638, 998],
    [246, 130, 638, 998],
    [238, 130, 634, 998],
    [232, 132, 632, 998],
    [226, 130, 630, 998],
    [216, 132, 626, 998],
    [204, 132, 622, 996],
    [194, 132, 620, 994],
    [186, 130, 620, 996],
    [182, 130, 622, 996],
    [180, 130, 634, 996],
    [178, 130, 640, 996],
    [178, 130, 646, 996],
    [180, 130, 650, 998],
    [184, 130, 648, 998],
    [190, 130, 646, 998],
    [190, 130, 640, 998],
    [188, 130, 632, 998],
    [186, 130, 620, 1000],
    [186, 130, 614, 1000],
    [186, 130, 598, 1000],
    [186, 130, 582, 1000],
    [188, 130, 574, 1000],
    [190, 130, 568, 1000],
    [192, 130, 574, 1000],
    [194, 130, 578, 1000],
    [196, 130, 582, 1000],
    [198, 130, 582, 1000],
    [200, 132, 582, 998],
    [200, 132, 580, 998],
    [202, 132, 576, 994],
    [202, 132, 572, 992],
    [202, 132, 572, 992],
    [200, 132, 576, 994],
    [200, 132, 582, 994],
    [200, 132, 586, 996],
    [200, 134, 590, 998],
    [200, 134, 594, 998],
    [200, 134, 598, 1000],
    [200, 134, 602, 1002],
    [200, 134, 604, 1002],
    [202, 136, 612, 1004],
    [202, 136, 620, 1004],
    [204, 136, 626, 1004],
    [204, 136, 630, 1004],
    [198, 136, 634, 1004],
    [194, 136, 638, 1004],
    [190, 136, 642, 1004],
    [188, 136, 642, 1004],
    [186, 136, 644, 1004],
    [184, 136, 646, 1004],
    [184, 136, 646, 1004],
    [182, 136, 648, 1004],
    [182, 136, 648, 1002],
    [184, 136, 648, 1002],
    [183, 137, 649, 1000]
   ],
   "bbox": [178, 130, 650, 1004],
   "margin": [178, 130, 182, 100],
   "active": [
    [
     2,
     77
    ]
   ],
   "dupes": [],
   "arc": [
    0.0,
    0.0032,
    0.0081,
    0.0162,
    0.0287,
    0.0359,
    0.0548,
    0.0754,
    0.0981,
    0.1206,
    0.1423,
    0.1635,
    0.1843,
    0.2044,
    0.2223,
    0.2325,
    0.2483,
    0.263,
    0.2773,
    0.2909,
    0.3045,
    0.3175,
    0.3302,
    0.3432,
    0.3566,
    0.3652,
    0.3793,
    0.3935,
    0.4075,
    0.4218,
    0.4365,
    0.4504,
    0.463,
    0.474,
    0.4787,
    0.4888,
    0.4992,
    0.5088,
    0.5181,
    0.5274,
    0.5375,
    0.5487,
    0.5606,
    0.5733,
    0.5811,
    0.5937,
    0.6061,
    0.6186,
    0.6307,
    0.6434,
    0.6556,
    0.6679,
    0.6802,
    0.6924,
    0.6998,
    0.7127,
    0.7267,
    0.7417,
    0.7571,
    0.773,
    0.7888,
    0.8048,
    0.8201,
    0.8283,
    0.8433,
    0.859,
    0.875,
    0.8915,
    0.9076,
    0.9232,
    0.9377,
    0.9519,
    0.9645,
    0.968,
    0.9774,
    0.9851,
    0.9906,
    0.994,
    0.9958,
    0.9971,
    1.0
   ],
   "minSeconds": 0.6,
   "moveSeconds": 2.4,
   "browOk": false,
   "browRead": {
    "note": "没有头部跟踪 / 有不可贴的帧"
   },
   "facePaste": false,
   "browSwap": false,
   "faceBlank": false,
   "faceClass": 3
  },
  "spin_d6_loop": {
   "label": "单脚转·草稿 s6（一段做完去和回）",
   "from": "idle",
   "to": "idle",
   "fps": 16,
   "frames": [
    "frames/spin_d6_loop/00.png",
    "frames/spin_d6_loop/01.png",
    "frames/spin_d6_loop/02.png",
    "frames/spin_d6_loop/03.png",
    "frames/spin_d6_loop/04.png",
    "frames/spin_d6_loop/05.png",
    "frames/spin_d6_loop/06.png",
    "frames/spin_d6_loop/07.png",
    "frames/spin_d6_loop/08.png",
    "frames/spin_d6_loop/09.png",
    "frames/spin_d6_loop/10.png",
    "frames/spin_d6_loop/11.png",
    "frames/spin_d6_loop/12.png",
    "frames/spin_d6_loop/13.png",
    "frames/spin_d6_loop/14.png",
    "frames/spin_d6_loop/15.png",
    "frames/spin_d6_loop/16.png",
    "frames/spin_d6_loop/17.png",
    "frames/spin_d6_loop/18.png",
    "frames/spin_d6_loop/19.png",
    "frames/spin_d6_loop/20.png",
    "frames/spin_d6_loop/21.png",
    "frames/spin_d6_loop/22.png",
    "frames/spin_d6_loop/23.png",
    "frames/spin_d6_loop/24.png",
    "frames/spin_d6_loop/25.png",
    "frames/spin_d6_loop/26.png",
    "frames/spin_d6_loop/27.png",
    "frames/spin_d6_loop/28.png",
    "frames/spin_d6_loop/29.png",
    "frames/spin_d6_loop/30.png",
    "frames/spin_d6_loop/31.png",
    "frames/spin_d6_loop/32.png",
    "frames/spin_d6_loop/33.png",
    "frames/spin_d6_loop/34.png",
    "frames/spin_d6_loop/35.png",
    "frames/spin_d6_loop/36.png",
    "frames/spin_d6_loop/37.png",
    "frames/spin_d6_loop/38.png",
    "frames/spin_d6_loop/39.png",
    "frames/spin_d6_loop/40.png",
    "frames/spin_d6_loop/41.png",
    "frames/spin_d6_loop/42.png",
    "frames/spin_d6_loop/43.png",
    "frames/spin_d6_loop/44.png",
    "frames/spin_d6_loop/45.png",
    "frames/spin_d6_loop/46.png",
    "frames/spin_d6_loop/47.png",
    "frames/spin_d6_loop/48.png",
    "frames/spin_d6_loop/49.png",
    "frames/spin_d6_loop/50.png",
    "frames/spin_d6_loop/51.png",
    "frames/spin_d6_loop/52.png",
    "frames/spin_d6_loop/53.png",
    "frames/spin_d6_loop/54.png",
    "frames/spin_d6_loop/55.png",
    "frames/spin_d6_loop/56.png",
    "frames/spin_d6_loop/57.png",
    "frames/spin_d6_loop/58.png",
    "frames/spin_d6_loop/59.png",
    "frames/spin_d6_loop/60.png",
    "frames/spin_d6_loop/61.png",
    "frames/spin_d6_loop/62.png",
    "frames/spin_d6_loop/63.png",
    "frames/spin_d6_loop/64.png",
    "frames/spin_d6_loop/65.png",
    "frames/spin_d6_loop/66.png",
    "frames/spin_d6_loop/67.png",
    "frames/spin_d6_loop/68.png",
    "frames/spin_d6_loop/69.png",
    "frames/spin_d6_loop/70.png",
    "frames/spin_d6_loop/71.png",
    "frames/spin_d6_loop/72.png",
    "frames/spin_d6_loop/73.png",
    "frames/spin_d6_loop/74.png",
    "frames/spin_d6_loop/75.png",
    "frames/spin_d6_loop/76.png",
    "frames/spin_d6_loop/77.png",
    "frames/spin_d6_loop/78.png",
    "frames/spin_d6_loop/79.png",
    "frames/spin_d6_loop/80.png"
   ],
   "apex": 47,
   "away_pct": [
    0.0,
    1.23,
    1.69,
    2.72,
    4.41,
    5.44,
    7.78,
    10.74,
    13.89,
    17.32,
    20.31,
    23.08,
    25.88,
    28.33,
    30.34,
    31.18,
    32.64,
    33.68,
    33.67,
    33.55,
    33.26,
    32.03,
    30.15,
    27.57,
    24.64,
    23.09,
    20.05,
    17.0,
    14.38,
    12.77,
    11.54,
    12.58,
    12.97,
    13.11,
    12.96,
    14.54,
    16.59,
    18.81,
    21.1,
    23.27,
    25.23,
    26.76,
    28.13,
    30.22,
    31.26,
    33.1,
    34.2,
    34.71,
    34.53,
    33.56,
    31.88,
    29.93,
    27.93,
    26.2,
    25.43,
    24.07,
    22.66,
    21.3,
    20.23,
    19.25,
    18.24,
    17.23,
    16.06,
    15.44,
    14.01,
    12.37,
    10.54,
    8.72,
    6.96,
    5.54,
    4.38,
    3.36,
    2.5,
    2.09,
    1.7,
    1.43,
    1.3,
    1.24,
    1.18,
    1.16,
    0.0
   ],
   "frameBBox": [
    [183, 137, 649, 1000],
    [184, 136, 648, 1002],
    [184, 136, 646, 1002],
    [186, 134, 646, 1002],
    [188, 134, 642, 1002],
    [190, 134, 642, 1002],
    [196, 132, 644, 1002],
    [204, 132, 646, 1002],
    [212, 132, 648, 1002],
    [226, 130, 648, 1002],
    [240, 130, 648, 1002],
    [248, 130, 646, 1002],
    [252, 130, 644, 1002],
    [258, 130, 640, 1000],
    [266, 130, 638, 1000],
    [264, 130, 636, 1000],
    [260, 130, 636, 1000],
    [256, 130, 636, 998],
    [250, 131, 636, 998],
    [248, 132, 634, 998],
    [244, 132, 634, 998],
    [244, 132, 632, 998],
    [244, 132, 632, 998],
    [248, 132, 630, 998],
    [244, 134, 630, 998],
    [242, 134, 630, 998],
    [230, 134, 628, 996],
    [216, 134, 626, 996],
    [202, 134, 624, 996],
    [190, 134, 622, 994],
    [182, 134, 628, 994],
    [178, 134, 636, 992],
    [176, 136, 644, 992],
    [176, 136, 650, 992],
    [178, 136, 652, 992],
    [184, 136, 652, 994],
    [192, 136, 648, 994],
    [190, 136, 642, 994],
    [188, 136, 632, 996],
    [186, 136, 618, 996],
    [188, 136, 602, 996],
    [190, 136, 586, 996],
    [192, 136, 578, 996],
    [196, 136, 576, 996],
    [198, 136, 576, 996],
    [200, 136, 578, 996],
    [202, 136, 578, 996],
    [202, 134, 580, 996],
    [204, 134, 580, 998],
    [202, 134, 578, 998],
    [200, 134, 576, 998],
    [200, 134, 576, 998],
    [200, 134, 580, 998],
    [200, 132, 582, 1000],
    [202, 132, 582, 1000],
    [202, 132, 588, 1000],
    [204, 132, 594, 1000],
    [204, 132, 598, 1000],
    [204, 132, 604, 1000],
    [204, 132, 610, 1000],
    [204, 132, 616, 1000],
    [204, 132, 620, 1000],
    [204, 132, 626, 1000],
    [204, 132, 628, 1002],
    [202, 134, 634, 1002],
    [200, 134, 638, 1002],
    [198, 134, 642, 1002],
    [192, 134, 646, 1002],
    [188, 134, 648, 1002],
    [186, 136, 650, 1002],
    [184, 136, 650, 1002],
    [184, 136, 650, 1002],
    [184, 136, 650, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [183, 137, 649, 1000]
   ],
   "bbox": [176, 130, 652, 1002],
   "margin": [176, 130, 180, 102],
   "active": [
    [
     2,
     74
    ]
   ],
   "dupes": [
    73
   ],
   "arc": [
    0.0,
    0.0023,
    0.0062,
    0.0144,
    0.0241,
    0.03,
    0.0476,
    0.068,
    0.09,
    0.1127,
    0.1356,
    0.1575,
    0.179,
    0.2,
    0.2197,
    0.2313,
    0.2476,
    0.2623,
    0.2764,
    0.2909,
    0.3057,
    0.3211,
    0.3367,
    0.3521,
    0.3671,
    0.3769,
    0.3916,
    0.4064,
    0.4218,
    0.4372,
    0.452,
    0.4657,
    0.4787,
    0.4921,
    0.4982,
    0.5106,
    0.5246,
    0.5393,
    0.5536,
    0.5677,
    0.5821,
    0.5965,
    0.6106,
    0.624,
    0.6331,
    0.6466,
    0.6598,
    0.6729,
    0.6867,
    0.7015,
    0.7172,
    0.7336,
    0.7499,
    0.7651,
    0.7724,
    0.785,
    0.7962,
    0.8067,
    0.8165,
    0.8261,
    0.8364,
    0.8478,
    0.8612,
    0.8675,
    0.883,
    0.8993,
    0.9156,
    0.9318,
    0.9471,
    0.9608,
    0.9725,
    0.9828,
    0.9906,
    0.9915,
    0.994,
    0.9963,
    0.9981,
    0.9989,
    0.9989,
    0.9989,
    1.0
   ],
   "minSeconds": 0.6,
   "moveSeconds": 2.4,
   "browOk": false,
   "browRead": {
    "note": "没有头部跟踪 / 有不可贴的帧"
   },
   "facePaste": false,
   "browSwap": false,
   "faceBlank": false,
   "faceClass": 3
  },
  "spin_f1_loop": {
   "label": "单脚转·正式 s1（没转满、原路转回）（一段做完去和回）",
   "from": "idle",
   "to": "idle",
   "fps": 16,
   "frames": [
    "frames/spin_f1_loop/00.png",
    "frames/spin_f1_loop/01.png",
    "frames/spin_f1_loop/02.png",
    "frames/spin_f1_loop/03.png",
    "frames/spin_f1_loop/04.png",
    "frames/spin_f1_loop/05.png",
    "frames/spin_f1_loop/06.png",
    "frames/spin_f1_loop/07.png",
    "frames/spin_f1_loop/08.png",
    "frames/spin_f1_loop/09.png",
    "frames/spin_f1_loop/10.png",
    "frames/spin_f1_loop/11.png",
    "frames/spin_f1_loop/12.png",
    "frames/spin_f1_loop/13.png",
    "frames/spin_f1_loop/14.png",
    "frames/spin_f1_loop/15.png",
    "frames/spin_f1_loop/16.png",
    "frames/spin_f1_loop/17.png",
    "frames/spin_f1_loop/18.png",
    "frames/spin_f1_loop/19.png",
    "frames/spin_f1_loop/20.png",
    "frames/spin_f1_loop/21.png",
    "frames/spin_f1_loop/22.png",
    "frames/spin_f1_loop/23.png",
    "frames/spin_f1_loop/24.png",
    "frames/spin_f1_loop/25.png",
    "frames/spin_f1_loop/26.png",
    "frames/spin_f1_loop/27.png",
    "frames/spin_f1_loop/28.png",
    "frames/spin_f1_loop/29.png",
    "frames/spin_f1_loop/30.png",
    "frames/spin_f1_loop/31.png",
    "frames/spin_f1_loop/32.png",
    "frames/spin_f1_loop/33.png",
    "frames/spin_f1_loop/34.png",
    "frames/spin_f1_loop/35.png",
    "frames/spin_f1_loop/36.png",
    "frames/spin_f1_loop/37.png",
    "frames/spin_f1_loop/38.png",
    "frames/spin_f1_loop/39.png",
    "frames/spin_f1_loop/40.png",
    "frames/spin_f1_loop/41.png",
    "frames/spin_f1_loop/42.png",
    "frames/spin_f1_loop/43.png",
    "frames/spin_f1_loop/44.png",
    "frames/spin_f1_loop/45.png",
    "frames/spin_f1_loop/46.png",
    "frames/spin_f1_loop/47.png",
    "frames/spin_f1_loop/48.png",
    "frames/spin_f1_loop/49.png",
    "frames/spin_f1_loop/50.png",
    "frames/spin_f1_loop/51.png",
    "frames/spin_f1_loop/52.png",
    "frames/spin_f1_loop/53.png",
    "frames/spin_f1_loop/54.png",
    "frames/spin_f1_loop/55.png",
    "frames/spin_f1_loop/56.png",
    "frames/spin_f1_loop/57.png",
    "frames/spin_f1_loop/58.png",
    "frames/spin_f1_loop/59.png",
    "frames/spin_f1_loop/60.png",
    "frames/spin_f1_loop/61.png",
    "frames/spin_f1_loop/62.png",
    "frames/spin_f1_loop/63.png",
    "frames/spin_f1_loop/64.png",
    "frames/spin_f1_loop/65.png",
    "frames/spin_f1_loop/66.png",
    "frames/spin_f1_loop/67.png",
    "frames/spin_f1_loop/68.png",
    "frames/spin_f1_loop/69.png",
    "frames/spin_f1_loop/70.png",
    "frames/spin_f1_loop/71.png",
    "frames/spin_f1_loop/72.png",
    "frames/spin_f1_loop/73.png",
    "frames/spin_f1_loop/74.png",
    "frames/spin_f1_loop/75.png",
    "frames/spin_f1_loop/76.png",
    "frames/spin_f1_loop/77.png",
    "frames/spin_f1_loop/78.png",
    "frames/spin_f1_loop/79.png",
    "frames/spin_f1_loop/80.png"
   ],
   "apex": 20,
   "away_pct": [
    0.0,
    2.0,
    3.73,
    4.7,
    7.17,
    8.59,
    11.25,
    12.69,
    15.85,
    17.74,
    20.73,
    21.78,
    23.58,
    24.99,
    27.27,
    28.49,
    30.08,
    30.58,
    31.57,
    31.59,
    31.86,
    31.95,
    31.82,
    31.81,
    31.51,
    30.86,
    28.59,
    27.4,
    24.27,
    22.08,
    18.17,
    15.21,
    14.45,
    13.77,
    13.68,
    13.51,
    13.4,
    12.86,
    13.05,
    14.28,
    14.67,
    15.35,
    15.78,
    16.83,
    17.36,
    17.84,
    17.77,
    17.71,
    17.69,
    17.5,
    16.97,
    15.99,
    15.39,
    14.45,
    14.68,
    14.71,
    15.17,
    16.93,
    18.42,
    21.64,
    25.42,
    27.48,
    31.38,
    31.92,
    32.44,
    32.68,
    32.36,
    31.93,
    30.52,
    29.38,
    25.94,
    23.83,
    20.1,
    18.23,
    15.12,
    13.47,
    10.4,
    8.89,
    5.57,
    3.63,
    0.0
   ],
   "frameBBox": [
    [183, 137, 649, 1000],
    [186, 136, 650, 1002],
    [190, 136, 652, 1002],
    [192, 136, 652, 1002],
    [198, 136, 654, 1002],
    [202, 136, 652, 1002],
    [208, 136, 652, 1004],
    [212, 136, 648, 1004],
    [220, 136, 642, 1004],
    [228, 136, 636, 1004],
    [238, 138, 626, 1004],
    [246, 138, 622, 1004],
    [248, 138, 620, 1004],
    [252, 138, 620, 1004],
    [258, 138, 620, 1004],
    [256, 138, 618, 1004],
    [258, 138, 616, 1002],
    [258, 138, 616, 1002],
    [260, 138, 614, 1002],
    [264, 138, 612, 1002],
    [264, 138, 608, 1004],
    [262, 140, 608, 1004],
    [260, 140, 604, 1004],
    [260, 140, 602, 1004],
    [262, 140, 602, 1002],
    [256, 140, 602, 1002],
    [248, 142, 602, 1002],
    [246, 140, 602, 1002],
    [240, 142, 604, 1002],
    [238, 142, 604, 1000],
    [234, 140, 604, 1000],
    [228, 140, 604, 998],
    [224, 140, 604, 998],
    [216, 140, 610, 998],
    [212, 140, 616, 998],
    [204, 140, 622, 996],
    [200, 140, 624, 996],
    [196, 142, 628, 996],
    [196, 142, 632, 996],
    [198, 144, 632, 996],
    [200, 144, 632, 996],
    [202, 144, 630, 996],
    [202, 144, 628, 996],
    [204, 144, 626, 996],
    [202, 144, 626, 996],
    [202, 144, 628, 998],
    [202, 142, 630, 998],
    [202, 142, 632, 998],
    [202, 140, 632, 998],
    [200, 138, 632, 998],
    [200, 138, 628, 998],
    [202, 138, 622, 998],
    [204, 138, 620, 998],
    [210, 140, 612, 998],
    [214, 140, 608, 998],
    [226, 142, 606, 1000],
    [234, 142, 606, 1000],
    [240, 142, 604, 1000],
    [242, 142, 604, 1000],
    [244, 142, 604, 1000],
    [248, 142, 604, 1000],
    [252, 142, 602, 1000],
    [264, 140, 604, 1000],
    [264, 140, 604, 1002],
    [264, 140, 606, 1002],
    [264, 140, 606, 1002],
    [266, 140, 608, 1002],
    [266, 140, 608, 1002],
    [262, 140, 610, 1004],
    [262, 140, 612, 1004],
    [262, 138, 616, 1004],
    [258, 138, 620, 1004],
    [246, 138, 628, 1004],
    [236, 138, 636, 1004],
    [216, 136, 648, 1004],
    [208, 136, 652, 1004],
    [200, 136, 654, 1004],
    [196, 136, 652, 1004],
    [190, 134, 652, 1004],
    [186, 134, 650, 1004],
    [183, 137, 649, 1000]
   ],
   "bbox": [183, 134, 654, 1004],
   "margin": [183, 134, 178, 100],
   "active": [
    [
     2,
     79
    ]
   ],
   "dupes": [
    42,
    44,
    46
   ],
   "arc": [
    0.0,
    0.0104,
    0.0226,
    0.0278,
    0.0432,
    0.0506,
    0.0666,
    0.0748,
    0.0926,
    0.1026,
    0.1207,
    0.1314,
    0.1494,
    0.1602,
    0.1792,
    0.1914,
    0.2104,
    0.2234,
    0.2418,
    0.2532,
    0.271,
    0.2824,
    0.2996,
    0.312,
    0.33,
    0.3415,
    0.3596,
    0.3711,
    0.3889,
    0.3995,
    0.4161,
    0.4317,
    0.4406,
    0.4552,
    0.4632,
    0.4766,
    0.4837,
    0.4956,
    0.5,
    0.5097,
    0.5137,
    0.5218,
    0.5241,
    0.5277,
    0.5289,
    0.533,
    0.5352,
    0.5434,
    0.5473,
    0.5564,
    0.5612,
    0.5729,
    0.5796,
    0.5915,
    0.5975,
    0.61,
    0.6172,
    0.6297,
    0.638,
    0.6522,
    0.6699,
    0.6817,
    0.7006,
    0.7131,
    0.7321,
    0.7446,
    0.7638,
    0.7769,
    0.7972,
    0.8123,
    0.8345,
    0.8504,
    0.874,
    0.8887,
    0.9107,
    0.9249,
    0.9467,
    0.9571,
    0.9766,
    0.9884,
    1.0
   ],
   "minSeconds": 0.6,
   "moveSeconds": 2.4,
   "browOk": false,
   "browRead": {
    "note": "没有头部跟踪 / 有不可贴的帧"
   },
   "facePaste": false,
   "browSwap": false,
   "faceBlank": false,
   "faceClass": 3
  },
  "turn_loop": {
   "label": "双脚转·草稿 s3（一段做完去和回）",
   "from": "idle",
   "to": "idle",
   "fps": 16,
   "frames": [
    "frames/turn_loop/00.png",
    "frames/turn_loop/01.png",
    "frames/turn_loop/02.png",
    "frames/turn_loop/03.png",
    "frames/turn_loop/04.png",
    "frames/turn_loop/05.png",
    "frames/turn_loop/06.png",
    "frames/turn_loop/07.png",
    "frames/turn_loop/08.png",
    "frames/turn_loop/09.png",
    "frames/turn_loop/10.png",
    "frames/turn_loop/11.png",
    "frames/turn_loop/12.png",
    "frames/turn_loop/13.png",
    "frames/turn_loop/14.png",
    "frames/turn_loop/15.png",
    "frames/turn_loop/16.png",
    "frames/turn_loop/17.png",
    "frames/turn_loop/18.png",
    "frames/turn_loop/19.png",
    "frames/turn_loop/20.png",
    "frames/turn_loop/21.png",
    "frames/turn_loop/22.png",
    "frames/turn_loop/23.png",
    "frames/turn_loop/24.png",
    "frames/turn_loop/25.png",
    "frames/turn_loop/26.png",
    "frames/turn_loop/27.png",
    "frames/turn_loop/28.png",
    "frames/turn_loop/29.png",
    "frames/turn_loop/30.png",
    "frames/turn_loop/31.png",
    "frames/turn_loop/32.png",
    "frames/turn_loop/33.png",
    "frames/turn_loop/34.png",
    "frames/turn_loop/35.png",
    "frames/turn_loop/36.png",
    "frames/turn_loop/37.png",
    "frames/turn_loop/38.png",
    "frames/turn_loop/39.png",
    "frames/turn_loop/40.png",
    "frames/turn_loop/41.png",
    "frames/turn_loop/42.png",
    "frames/turn_loop/43.png",
    "frames/turn_loop/44.png",
    "frames/turn_loop/45.png",
    "frames/turn_loop/46.png",
    "frames/turn_loop/47.png",
    "frames/turn_loop/48.png",
    "frames/turn_loop/49.png",
    "frames/turn_loop/50.png",
    "frames/turn_loop/51.png",
    "frames/turn_loop/52.png",
    "frames/turn_loop/53.png",
    "frames/turn_loop/54.png",
    "frames/turn_loop/55.png",
    "frames/turn_loop/56.png",
    "frames/turn_loop/57.png",
    "frames/turn_loop/58.png",
    "frames/turn_loop/59.png",
    "frames/turn_loop/60.png",
    "frames/turn_loop/61.png",
    "frames/turn_loop/62.png",
    "frames/turn_loop/63.png",
    "frames/turn_loop/64.png",
    "frames/turn_loop/65.png",
    "frames/turn_loop/66.png",
    "frames/turn_loop/67.png",
    "frames/turn_loop/68.png",
    "frames/turn_loop/69.png",
    "frames/turn_loop/70.png",
    "frames/turn_loop/71.png",
    "frames/turn_loop/72.png",
    "frames/turn_loop/73.png",
    "frames/turn_loop/74.png",
    "frames/turn_loop/75.png",
    "frames/turn_loop/76.png",
    "frames/turn_loop/77.png",
    "frames/turn_loop/78.png",
    "frames/turn_loop/79.png",
    "frames/turn_loop/80.png"
   ],
   "apex": 52,
   "away_pct": [
    0.0,
    1.45,
    2.37,
    3.48,
    4.83,
    5.67,
    7.63,
    10.37,
    13.24,
    16.31,
    19.2,
    22.0,
    24.73,
    27.35,
    29.42,
    30.37,
    32.04,
    32.94,
    33.3,
    32.94,
    32.29,
    31.36,
    29.79,
    27.82,
    25.64,
    24.52,
    22.05,
    19.79,
    17.73,
    15.74,
    14.1,
    12.76,
    11.51,
    10.97,
    10.91,
    10.87,
    10.91,
    11.63,
    12.8,
    14.36,
    15.95,
    17.71,
    19.64,
    21.91,
    23.07,
    25.7,
    27.88,
    29.88,
    31.47,
    32.83,
    33.51,
    34.17,
    34.62,
    34.35,
    33.88,
    32.84,
    31.6,
    30.29,
    29.06,
    27.5,
    25.98,
    24.2,
    22.48,
    21.52,
    19.57,
    17.6,
    15.77,
    14.0,
    12.4,
    10.73,
    9.25,
    7.87,
    6.57,
    5.87,
    4.89,
    3.97,
    3.12,
    2.45,
    1.92,
    1.45,
    0.0
   ],
   "frameBBox": [
    [183, 137, 649, 1000],
    [184, 136, 646, 1002],
    [182, 136, 644, 1002],
    [184, 136, 642, 1002],
    [184, 136, 640, 1002],
    [186, 136, 642, 1002],
    [190, 136, 644, 1002],
    [196, 136, 646, 1002],
    [204, 136, 648, 1004],
    [216, 136, 648, 1004],
    [228, 136, 650, 1004],
    [244, 136, 650, 1004],
    [254, 136, 648, 1004],
    [262, 134, 646, 1004],
    [266, 134, 646, 1004],
    [268, 134, 644, 1004],
    [272, 134, 644, 1002],
    [268, 134, 642, 1002],
    [266, 134, 644, 1002],
    [266, 134, 644, 1000],
    [266, 134, 644, 1000],
    [266, 134, 642, 1000],
    [266, 136, 642, 1000],
    [266, 136, 640, 998],
    [264, 136, 640, 998],
    [258, 136, 638, 998],
    [252, 136, 636, 998],
    [246, 136, 632, 998],
    [240, 136, 628, 996],
    [230, 136, 624, 996],
    [216, 136, 630, 996],
    [206, 136, 638, 996],
    [196, 136, 642, 994],
    [190, 136, 646, 994],
    [186, 134, 648, 994],
    [182, 134, 650, 992],
    [180, 134, 652, 992],
    [180, 134, 648, 996],
    [182, 132, 646, 998],
    [188, 132, 640, 998],
    [194, 132, 634, 1000],
    [194, 132, 622, 1000],
    [192, 132, 610, 1000],
    [192, 132, 596, 1000],
    [192, 132, 592, 1000],
    [192, 130, 582, 1000],
    [194, 130, 574, 1000],
    [194, 130, 568, 1000],
    [194, 130, 570, 1000],
    [194, 132, 570, 1000],
    [192, 132, 572, 1002],
    [192, 132, 572, 1002],
    [192, 134, 572, 1002],
    [192, 134, 570, 1004],
    [192, 134, 570, 1004],
    [192, 134, 570, 1004],
    [190, 136, 570, 1004],
    [192, 136, 572, 1004],
    [192, 136, 574, 1004],
    [192, 136, 578, 1006],
    [194, 136, 582, 1006],
    [194, 136, 588, 1006],
    [196, 136, 592, 1006],
    [196, 136, 596, 1006],
    [198, 136, 602, 1006],
    [200, 138, 608, 1004],
    [202, 138, 616, 1004],
    [204, 136, 622, 1004],
    [206, 136, 628, 1004],
    [206, 136, 634, 1004],
    [206, 136, 638, 1004],
    [200, 136, 640, 1004],
    [196, 136, 644, 1004],
    [194, 136, 644, 1004],
    [190, 136, 646, 1004],
    [188, 136, 646, 1004],
    [186, 136, 648, 1004],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [183, 137, 649, 1000]
   ],
   "bbox": [180, 130, 652, 1006],
   "margin": [180, 130, 180, 98],
   "active": [
    [
     2,
     79
    ]
   ],
   "dupes": [],
   "arc": [
    0.0,
    0.007,
    0.0151,
    0.0246,
    0.0365,
    0.0426,
    0.0588,
    0.0773,
    0.0962,
    0.1158,
    0.1354,
    0.1554,
    0.1751,
    0.1944,
    0.2124,
    0.2235,
    0.2398,
    0.2552,
    0.2701,
    0.284,
    0.2976,
    0.3116,
    0.3252,
    0.3388,
    0.3525,
    0.3613,
    0.3751,
    0.3892,
    0.4033,
    0.4173,
    0.4313,
    0.4449,
    0.4576,
    0.4692,
    0.4751,
    0.4856,
    0.4961,
    0.5065,
    0.5178,
    0.5301,
    0.543,
    0.5562,
    0.5696,
    0.5833,
    0.5916,
    0.6055,
    0.6191,
    0.6321,
    0.6449,
    0.6572,
    0.6694,
    0.6817,
    0.694,
    0.7067,
    0.7155,
    0.7293,
    0.7434,
    0.7577,
    0.7718,
    0.7855,
    0.7991,
    0.8128,
    0.8264,
    0.8331,
    0.8469,
    0.8611,
    0.8752,
    0.8894,
    0.9035,
    0.9176,
    0.9311,
    0.9441,
    0.9559,
    0.9592,
    0.9679,
    0.975,
    0.9808,
    0.9855,
    0.9899,
    0.9941,
    1.0
   ],
   "minSeconds": 0.6,
   "moveSeconds": 2.4,
   "browOk": false,
   "browRead": {
    "note": "没有头部跟踪 / 有不可贴的帧"
   },
   "facePaste": false,
   "browSwap": false,
   "faceBlank": false,
   "faceClass": 3
  },
  "turn_d4_loop": {
   "label": "双脚转·草稿 s4（一段做完去和回）",
   "from": "idle",
   "to": "idle",
   "fps": 16,
   "frames": [
    "frames/turn_d4_loop/00.png",
    "frames/turn_d4_loop/01.png",
    "frames/turn_d4_loop/02.png",
    "frames/turn_d4_loop/03.png",
    "frames/turn_d4_loop/04.png",
    "frames/turn_d4_loop/05.png",
    "frames/turn_d4_loop/06.png",
    "frames/turn_d4_loop/07.png",
    "frames/turn_d4_loop/08.png",
    "frames/turn_d4_loop/09.png",
    "frames/turn_d4_loop/10.png",
    "frames/turn_d4_loop/11.png",
    "frames/turn_d4_loop/12.png",
    "frames/turn_d4_loop/13.png",
    "frames/turn_d4_loop/14.png",
    "frames/turn_d4_loop/15.png",
    "frames/turn_d4_loop/16.png",
    "frames/turn_d4_loop/17.png",
    "frames/turn_d4_loop/18.png",
    "frames/turn_d4_loop/19.png",
    "frames/turn_d4_loop/20.png",
    "frames/turn_d4_loop/21.png",
    "frames/turn_d4_loop/22.png",
    "frames/turn_d4_loop/23.png",
    "frames/turn_d4_loop/24.png",
    "frames/turn_d4_loop/25.png",
    "frames/turn_d4_loop/26.png",
    "frames/turn_d4_loop/27.png",
    "frames/turn_d4_loop/28.png",
    "frames/turn_d4_loop/29.png",
    "frames/turn_d4_loop/30.png",
    "frames/turn_d4_loop/31.png",
    "frames/turn_d4_loop/32.png",
    "frames/turn_d4_loop/33.png",
    "frames/turn_d4_loop/34.png",
    "frames/turn_d4_loop/35.png",
    "frames/turn_d4_loop/36.png",
    "frames/turn_d4_loop/37.png",
    "frames/turn_d4_loop/38.png",
    "frames/turn_d4_loop/39.png",
    "frames/turn_d4_loop/40.png",
    "frames/turn_d4_loop/41.png",
    "frames/turn_d4_loop/42.png",
    "frames/turn_d4_loop/43.png",
    "frames/turn_d4_loop/44.png",
    "frames/turn_d4_loop/45.png",
    "frames/turn_d4_loop/46.png",
    "frames/turn_d4_loop/47.png",
    "frames/turn_d4_loop/48.png",
    "frames/turn_d4_loop/49.png",
    "frames/turn_d4_loop/50.png",
    "frames/turn_d4_loop/51.png",
    "frames/turn_d4_loop/52.png",
    "frames/turn_d4_loop/53.png",
    "frames/turn_d4_loop/54.png",
    "frames/turn_d4_loop/55.png",
    "frames/turn_d4_loop/56.png",
    "frames/turn_d4_loop/57.png",
    "frames/turn_d4_loop/58.png",
    "frames/turn_d4_loop/59.png",
    "frames/turn_d4_loop/60.png",
    "frames/turn_d4_loop/61.png",
    "frames/turn_d4_loop/62.png",
    "frames/turn_d4_loop/63.png",
    "frames/turn_d4_loop/64.png",
    "frames/turn_d4_loop/65.png",
    "frames/turn_d4_loop/66.png",
    "frames/turn_d4_loop/67.png",
    "frames/turn_d4_loop/68.png",
    "frames/turn_d4_loop/69.png",
    "frames/turn_d4_loop/70.png",
    "frames/turn_d4_loop/71.png",
    "frames/turn_d4_loop/72.png",
    "frames/turn_d4_loop/73.png",
    "frames/turn_d4_loop/74.png",
    "frames/turn_d4_loop/75.png",
    "frames/turn_d4_loop/76.png",
    "frames/turn_d4_loop/77.png",
    "frames/turn_d4_loop/78.png",
    "frames/turn_d4_loop/79.png",
    "frames/turn_d4_loop/80.png"
   ],
   "apex": 50,
   "away_pct": [
    0.0,
    1.67,
    2.95,
    4.63,
    6.3,
    7.28,
    9.34,
    11.87,
    14.23,
    16.42,
    18.4,
    21.26,
    24.44,
    27.04,
    28.87,
    29.73,
    31.35,
    32.01,
    30.87,
    29.65,
    28.2,
    26.28,
    24.34,
    22.43,
    20.34,
    18.99,
    16.36,
    14.02,
    12.24,
    11.19,
    10.86,
    10.95,
    11.95,
    13.42,
    13.99,
    15.28,
    16.75,
    17.77,
    18.47,
    19.49,
    20.76,
    22.86,
    25.24,
    27.78,
    28.89,
    30.88,
    32.22,
    32.84,
    33.25,
    33.52,
    33.37,
    33.6,
    33.18,
    32.38,
    31.65,
    30.33,
    28.93,
    27.31,
    25.69,
    23.5,
    21.27,
    19.47,
    17.48,
    16.47,
    14.14,
    12.11,
    10.3,
    8.45,
    6.5,
    4.87,
    3.69,
    2.91,
    2.45,
    2.31,
    2.16,
    2.02,
    1.92,
    1.77,
    1.55,
    1.33,
    0.0
   ],
   "frameBBox": [
    [183, 137, 649, 1000],
    [186, 136, 648, 1002],
    [188, 136, 646, 1002],
    [190, 134, 644, 1002],
    [194, 134, 646, 1002],
    [196, 134, 646, 1002],
    [202, 134, 648, 1002],
    [210, 134, 650, 1002],
    [218, 134, 648, 1002],
    [232, 134, 646, 1002],
    [246, 134, 644, 1002],
    [250, 134, 644, 1002],
    [256, 134, 642, 1002],
    [264, 134, 642, 1002],
    [268, 134, 644, 1002],
    [268, 134, 644, 1000],
    [268, 134, 646, 1000],
    [266, 134, 646, 996],
    [264, 134, 644, 992],
    [262, 134, 642, 992],
    [260, 134, 638, 994],
    [260, 134, 636, 996],
    [260, 134, 634, 996],
    [252, 134, 632, 996],
    [244, 136, 632, 996],
    [238, 136, 630, 996],
    [234, 134, 630, 996],
    [228, 134, 628, 996],
    [226, 134, 632, 994],
    [212, 134, 640, 992],
    [200, 134, 648, 994],
    [192, 134, 652, 994],
    [184, 134, 654, 996],
    [180, 134, 652, 996],
    [178, 134, 652, 996],
    [180, 134, 646, 996],
    [184, 134, 640, 992],
    [192, 134, 630, 992],
    [194, 134, 616, 992],
    [192, 136, 606, 990],
    [192, 136, 604, 992],
    [192, 136, 598, 994],
    [194, 135, 592, 996],
    [194, 134, 582, 996],
    [194, 134, 578, 996],
    [192, 134, 574, 996],
    [190, 134, 574, 996],
    [188, 134, 572, 996],
    [186, 134, 570, 996],
    [186, 134, 568, 996],
    [188, 134, 566, 996],
    [190, 134, 566, 998],
    [192, 134, 566, 996],
    [194, 134, 564, 994],
    [196, 134, 564, 992],
    [196, 134, 568, 990],
    [196, 134, 572, 992],
    [196, 134, 576, 992],
    [194, 134, 580, 994],
    [192, 134, 582, 998],
    [192, 136, 588, 1000],
    [192, 136, 594, 1002],
    [194, 136, 606, 1002],
    [196, 134, 612, 1002],
    [200, 134, 622, 1002],
    [204, 134, 630, 1002],
    [200, 134, 636, 1002],
    [196, 134, 642, 1002],
    [192, 134, 646, 1002],
    [188, 134, 648, 1002],
    [186, 136, 648, 1002],
    [184, 136, 648, 1002],
    [184, 136, 648, 1002],
    [182, 136, 648, 1002],
    [182, 136, 648, 1002],
    [182, 136, 648, 1002],
    [182, 136, 648, 1002],
    [182, 136, 648, 1002],
    [182, 136, 648, 1002],
    [184, 136, 648, 1002],
    [183, 137, 649, 1000]
   ],
   "bbox": [178, 134, 654, 1002],
   "margin": [178, 134, 178, 102],
   "active": [
    [
     2,
     72
    ]
   ],
   "dupes": [],
   "arc": [
    0.0,
    0.0062,
    0.0146,
    0.0249,
    0.0376,
    0.0444,
    0.0612,
    0.0804,
    0.0994,
    0.1192,
    0.139,
    0.1596,
    0.18,
    0.1994,
    0.217,
    0.2269,
    0.2426,
    0.2583,
    0.2741,
    0.2901,
    0.306,
    0.3218,
    0.3365,
    0.3507,
    0.365,
    0.3742,
    0.3883,
    0.4023,
    0.4168,
    0.4308,
    0.4453,
    0.4601,
    0.4735,
    0.4866,
    0.4946,
    0.5071,
    0.5191,
    0.5322,
    0.5457,
    0.5603,
    0.5751,
    0.5897,
    0.6045,
    0.6202,
    0.6304,
    0.6455,
    0.6605,
    0.6754,
    0.6898,
    0.703,
    0.7148,
    0.727,
    0.7392,
    0.7518,
    0.7594,
    0.7731,
    0.7871,
    0.8022,
    0.8191,
    0.8369,
    0.8537,
    0.8697,
    0.8844,
    0.8917,
    0.9052,
    0.9193,
    0.9344,
    0.9496,
    0.9634,
    0.975,
    0.9848,
    0.9925,
    0.9972,
    0.9974,
    0.9978,
    0.9978,
    0.9978,
    0.9978,
    0.9979,
    0.9982,
    1.0
   ],
   "minSeconds": 0.6,
   "moveSeconds": 2.4,
   "browOk": false,
   "browRead": {
    "note": "没有头部跟踪 / 有不可贴的帧"
   },
   "facePaste": false,
   "browSwap": false,
   "faceBlank": false,
   "faceClass": 3
  }
 },
 "actions": [
  {
   "id": "think",
   "label": "思考·正式 s1",
   "in": "think_loop",
   "oneshot": true,
   "group": "思考",
   "variant": "正式 s1"
  },
  {
   "id": "think_hold",
   "label": "思考·正式 s1（停在幅度最大处）",
   "in": "think_in",
   "pose": "think",
   "out": "think_out",
   "group": "思考",
   "variant": "正式 s1"
  },
  {
   "id": "think_f2",
   "label": "思考·正式 s2",
   "in": "think_f2_loop",
   "oneshot": true,
   "group": "思考",
   "variant": "正式 s2"
  },
  {
   "id": "think_f2_hold",
   "label": "思考·正式 s2（停在幅度最大处）",
   "in": "think_f2_in",
   "pose": "think_f2",
   "out": "think_f2_out",
   "group": "思考",
   "variant": "正式 s2"
  },
  {
   "id": "think_mid",
   "label": "思考·折中",
   "in": "think_mid_loop",
   "oneshot": true,
   "group": "思考",
   "variant": "折中"
  },
  {
   "id": "think_mid_hold",
   "label": "思考·折中（停在幅度最大处）",
   "in": "think_mid_in",
   "pose": "think_mid",
   "out": "think_mid_out",
   "group": "思考",
   "variant": "折中"
  },
  {
   "id": "think_d1",
   "label": "思考·草稿 s1",
   "in": "think_d1_loop",
   "oneshot": true,
   "group": "思考",
   "variant": "草稿 s1"
  },
  {
   "id": "think_d1_hold",
   "label": "思考·草稿 s1（停在幅度最大处）",
   "in": "think_d1_in",
   "pose": "think_d1",
   "out": "think_d1_out",
   "group": "思考",
   "variant": "草稿 s1"
  },
  {
   "id": "wave",
   "label": "挥手·正式 s2",
   "in": "wave_loop",
   "oneshot": true,
   "group": "挥手",
   "variant": "正式 s2"
  },
  {
   "id": "wave_hold",
   "label": "挥手·正式 s2（停在幅度最大处）",
   "in": "wave_in",
   "pose": "wave",
   "out": "wave_out",
   "group": "挥手",
   "variant": "正式 s2",
   "host": false,
   "host_note": "讲解员里这个动作整段一次播完，不在停顿帧停"
  },
  {
   "id": "wave_f1",
   "label": "挥手·正式 s1",
   "in": "wave_f1_loop",
   "oneshot": true,
   "group": "挥手",
   "variant": "正式 s1"
  },
  {
   "id": "wave_f1_hold",
   "label": "挥手·正式 s1（停在幅度最大处）",
   "in": "wave_f1_in",
   "pose": "wave_f1",
   "out": "wave_f1_out",
   "group": "挥手",
   "variant": "正式 s1",
   "host": false,
   "host_note": "讲解员里这个动作整段一次播完，不在停顿帧停"
  },
  {
   "id": "wave_d1",
   "label": "挥手·草稿 s1",
   "in": "wave_d1_loop",
   "oneshot": true,
   "group": "挥手",
   "variant": "草稿 s1"
  },
  {
   "id": "wave_d1_hold",
   "label": "挥手·草稿 s1（停在幅度最大处）",
   "in": "wave_d1_in",
   "pose": "wave_d1",
   "out": "wave_d1_out",
   "group": "挥手",
   "variant": "草稿 s1",
   "host": false,
   "host_note": "讲解员里这个动作整段一次播完，不在停顿帧停"
  },
  {
   "id": "shrug",
   "label": "摊手·正式 s1",
   "in": "shrug_loop",
   "oneshot": true,
   "group": "摊手",
   "variant": "正式 s1"
  },
  {
   "id": "shrug_hold",
   "label": "摊手·正式 s1（停在幅度最大处）",
   "in": "shrug_in",
   "pose": "shrug",
   "out": "shrug_out",
   "group": "摊手",
   "variant": "正式 s1"
  },
  {
   "id": "shrug_f2",
   "label": "摊手·正式 s2",
   "in": "shrug_f2_loop",
   "oneshot": true,
   "group": "摊手",
   "variant": "正式 s2"
  },
  {
   "id": "shrug_f2_hold",
   "label": "摊手·正式 s2（停在幅度最大处）",
   "in": "shrug_f2_in",
   "pose": "shrug_f2",
   "out": "shrug_f2_out",
   "group": "摊手",
   "variant": "正式 s2"
  },
  {
   "id": "spin",
   "label": "单脚转·草稿 s4",
   "in": "spin_loop",
   "oneshot": true,
   "group": "单脚转",
   "variant": "草稿 s4"
  },
  {
   "id": "spin_d5",
   "label": "单脚转·草稿 s5",
   "in": "spin_d5_loop",
   "oneshot": true,
   "group": "单脚转",
   "variant": "草稿 s5"
  },
  {
   "id": "spin_d6",
   "label": "单脚转·草稿 s6",
   "in": "spin_d6_loop",
   "oneshot": true,
   "group": "单脚转",
   "variant": "草稿 s6"
  },
  {
   "id": "spin_f1",
   "label": "单脚转·正式 s1（没转满、原路转回）",
   "in": "spin_f1_loop",
   "oneshot": true,
   "group": "单脚转",
   "variant": "正式 s1（没转满、原路转回）"
  },
  {
   "id": "turn",
   "label": "双脚转·草稿 s3",
   "in": "turn_loop",
   "oneshot": true,
   "group": "双脚转",
   "variant": "草稿 s3"
  },
  {
   "id": "turn_d4",
   "label": "双脚转·草稿 s4",
   "in": "turn_d4_loop",
   "oneshot": true,
   "group": "双脚转",
   "variant": "草稿 s4"
  }
 ],
 "minMargin": {
  "left": 132,
  "top": 128,
  "right": 94,
  "bottom": 98,
  "min": 94
 },
 "tier": "final-candidate",
 "note": "第一批的候选库（新舞台 832×1104、人高 78%）：同一个动作的几条候选并存，留哪条等用户看片定。帧是出片时抠好的，没有重抠。",
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
 "headTracks": {
  "frames/think_loop/00.png": {
   "m": [
    1.0006,
    -0.00027,
    -0.42,
    -0.28
   ],
   "scale": 1.0006,
   "rot_deg": -0.02,
   "shift": [
    -0.0,
    -0.1
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
   "mask": {
    "file": "track/think_loop_00.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_loop_00_u.png",
    "rect": [297, 381, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_loop/01.png": {
   "m": [
    1.00212,
    -0.00127,
    -1.64,
    -0.88
   ],
   "scale": 1.0021,
   "rot_deg": -0.07,
   "shift": [
    -0.2,
    -0.4
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
   "mask": {
    "file": "track/think_loop_01.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_loop_01_u.png",
    "rect": [297, 380, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 13,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_loop/02.png": {
   "m": [
    1.00247,
    -0.00246,
    -2.48,
    -0.66
   ],
   "scale": 1.0025,
   "rot_deg": -0.14,
   "shift": [
    -0.3,
    -0.5
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
   "mask": {
    "file": "track/think_loop_02.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_loop_02_u.png",
    "rect": [296, 380, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 14,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_loop/03.png": {
   "m": [
    1.00241,
    -0.00352,
    -3.21,
    -0.23
   ],
   "scale": 1.0024,
   "rot_deg": -0.2,
   "shift": [
    -0.6,
    -0.5
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
   "mask": {
    "file": "track/think_loop_03.png",
    "rect": [168, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_loop_03_u.png",
    "rect": [296, 380, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 14,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_loop/04.png": {
   "m": [
    1.00242,
    -0.00561,
    -4.61,
    0.6
   ],
   "scale": 1.0024,
   "rot_deg": -0.32,
   "shift": [
    -1.0,
    -0.6
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
   "mask": {
    "file": "track/think_loop_04.png",
    "rect": [168, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_loop_04_u.png",
    "rect": [295, 380, 231, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 13,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_loop/05.png": {
   "m": [
    1.00253,
    -0.00883,
    -6.67,
    1.92
   ],
   "scale": 1.0026,
   "rot_deg": -0.5,
   "shift": [
    -1.5,
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
   "mask": {
    "file": "track/think_loop_05.png",
    "rect": [167, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_loop_05_u.png",
    "rect": [295, 380, 231, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 21,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_loop/06.png": {
   "m": [
    1.00235,
    -0.01244,
    -8.94,
    3.55
   ],
   "scale": 1.0024,
   "rot_deg": -0.71,
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
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_loop_06.png",
    "rect": [167, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_loop_06_u.png",
    "rect": [294, 379, 230, 106]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 15,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_loop/07.png": {
   "m": [
    1.002,
    -0.01601,
    -11.01,
    5.29
   ],
   "scale": 1.0021,
   "rot_deg": -0.92,
   "shift": [
    -2.7,
    -0.3
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
   "mask": {
    "file": "track/think_loop_07.png",
    "rect": [166, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_loop_07_u.png",
    "rect": [293, 379, 231, 107]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 26,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_loop/08.png": {
   "m": [
    1.00186,
    -0.0198,
    -13.35,
    7.03
   ],
   "scale": 1.0021,
   "rot_deg": -1.13,
   "shift": [
    -3.4,
    -0.2
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
   "mask": {
    "file": "track/think_loop_08.png",
    "rect": [166, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_loop_08_u.png",
    "rect": [293, 379, 230, 107]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 13,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_loop/09.png": {
   "m": [
    1.00162,
    -0.02313,
    -15.4,
    8.56
   ],
   "scale": 1.0019,
   "rot_deg": -1.32,
   "shift": [
    -4.0,
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
   "mask": {
    "file": "track/think_loop_09.png",
    "rect": [165, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_loop_09_u.png",
    "rect": [292, 379, 230, 107]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 13,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_loop/10.png": {
   "m": [
    1.00153,
    -0.0267,
    -17.68,
    10.1
   ],
   "scale": 1.0019,
   "rot_deg": -1.53,
   "shift": [
    -4.6,
    -0.1
   ],
   "inliers": 194,
   "residual_px": 0.58,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_loop_10.png",
    "rect": [164, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_loop_10_u.png",
    "rect": [291, 379, 230, 108]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 19,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_loop/11.png": {
   "m": [
    1.00164,
    -0.02979,
    -19.69,
    11.4
   ],
   "scale": 1.0021,
   "rot_deg": -1.7,
   "shift": [
    -5.2,
    -0.0
   ],
   "inliers": 191,
   "residual_px": 0.6,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_loop_11.png",
    "rect": [164, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_loop_11_u.png",
    "rect": [290, 378, 231, 109]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 19,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_loop/12.png": {
   "m": [
    1.00161,
    -0.03305,
    -21.71,
    12.88
   ],
   "scale": 1.0022,
   "rot_deg": -1.89,
   "shift": [
    -5.7,
    0.1
   ],
   "inliers": 165,
   "residual_px": 0.56,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_loop_12.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_loop_12_u.png",
    "rect": [290, 378, 230, 109]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 11,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_loop/13.png": {
   "m": [
    1.00149,
    -0.03586,
    -23.41,
    14.14
   ],
   "scale": 1.0021,
   "rot_deg": -2.05,
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
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_loop_13.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_loop_13_u.png",
    "rect": [289, 378, 231, 110]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 26,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_loop/14.png": {
   "m": [
    1.00111,
    -0.03818,
    -24.68,
    15.31
   ],
   "scale": 1.0018,
   "rot_deg": -2.18,
   "shift": [
    -6.5,
    0.2
   ],
   "inliers": 163,
   "residual_px": 0.6,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_loop_14.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_loop_14_u.png",
    "rect": [289, 378, 230, 110]
   },
   "yield_eye_px": 0,
   "yield_px": 48,
   "cover_alien_px": 14,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_loop/15.png": {
   "m": [
    1.00086,
    -0.03963,
    -25.42,
    16.1
   ],
   "scale": 1.0016,
   "rot_deg": -2.27,
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
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_loop_15.png",
    "rect": [162, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_loop_15_u.png",
    "rect": [288, 378, 231, 110]
   },
   "yield_eye_px": 0,
   "yield_px": 51,
   "cover_alien_px": 18,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_loop/16.png": {
   "m": [
    1.00088,
    -0.0408,
    -25.98,
    16.56
   ],
   "scale": 1.0017,
   "rot_deg": -2.33,
   "shift": [
    -6.6,
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
   "mask": {
    "file": "track/think_loop_16.png",
    "rect": [162, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_loop_16_u.png",
    "rect": [288, 378, 231, 110]
   },
   "yield_eye_px": 0,
   "yield_px": 52,
   "cover_alien_px": 14,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_loop/17.png": {
   "m": [
    1.00089,
    -0.04143,
    -26.27,
    16.78
   ],
   "scale": 1.0017,
   "rot_deg": -2.37,
   "shift": [
    -6.6,
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
   "mask": {
    "file": "track/think_loop_17.png",
    "rect": [162, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_loop_17_u.png",
    "rect": [288, 378, 231, 110]
   },
   "yield_eye_px": 0,
   "yield_px": 51,
   "cover_alien_px": 14,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_loop/18.png": {
   "m": [
    1.00084,
    -0.0412,
    -26.19,
    16.7
   ],
   "scale": 1.0017,
   "rot_deg": -2.36,
   "shift": [
    -6.7,
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
   "mask": {
    "file": "track/think_loop_18.png",
    "rect": [162, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_loop_18_u.png",
    "rect": [288, 378, 231, 110]
   },
   "yield_eye_px": 0,
   "yield_px": 51,
   "cover_alien_px": 12,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_loop/19.png": {
   "m": [
    1.00082,
    -0.04108,
    -26.15,
    16.67
   ],
   "scale": 1.0017,
   "rot_deg": -2.35,
   "shift": [
    -6.7,
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
   "mask": {
    "file": "track/think_loop_19.png",
    "rect": [162, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_loop_19_u.png",
    "rect": [288, 378, 231, 110]
   },
   "yield_eye_px": 0,
   "yield_px": 50,
   "cover_alien_px": 10,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_loop/20.png": {
   "m": [
    1.00078,
    -0.0411,
    -26.13,
    16.74
   ],
   "scale": 1.0016,
   "rot_deg": -2.35,
   "shift": [
    -6.7,
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
   "mask": {
    "file": "track/think_loop_20.png",
    "rect": [162, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_loop_20_u.png",
    "rect": [288, 378, 231, 110]
   },
   "yield_eye_px": 0,
   "yield_px": 53,
   "cover_alien_px": 11,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_loop/21.png": {
   "m": [
    1.00071,
    -0.04104,
    -26.07,
    16.76
   ],
   "scale": 1.0016,
   "rot_deg": -2.35,
   "shift": [
    -6.7,
    0.3
   ],
   "inliers": 164,
   "residual_px": 0.58,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_loop_21.png",
    "rect": [162, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_loop_21_u.png",
    "rect": [288, 378, 231, 110]
   },
   "yield_eye_px": 0,
   "yield_px": 52,
   "cover_alien_px": 11,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_loop/22.png": {
   "m": [
    1.00089,
    -0.04103,
    -26.19,
    16.64
   ],
   "scale": 1.0017,
   "rot_deg": -2.35,
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
   "mask": {
    "file": "track/think_loop_22.png",
    "rect": [162, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_loop_22_u.png",
    "rect": [288, 378, 231, 110]
   },
   "yield_eye_px": 0,
   "yield_px": 50,
   "cover_alien_px": 11,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_loop/23.png": {
   "m": [
    1.00119,
    -0.04081,
    -26.26,
    16.41
   ],
   "scale": 1.002,
   "rot_deg": -2.33,
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
   "mask": {
    "file": "track/think_loop_23.png",
    "rect": [162, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_loop_23_u.png",
    "rect": [288, 378, 231, 110]
   },
   "yield_eye_px": 0,
   "yield_px": 51,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_loop/24.png": {
   "m": [
    1.00112,
    -0.04074,
    -26.18,
    16.4
   ],
   "scale": 1.0019,
   "rot_deg": -2.33,
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
   "mask": {
    "file": "track/think_loop_24.png",
    "rect": [162, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_loop_24_u.png",
    "rect": [288, 378, 231, 110]
   },
   "yield_eye_px": 0,
   "yield_px": 50,
   "cover_alien_px": 11,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_loop/25.png": {
   "m": [
    1.00117,
    -0.0405,
    -26.08,
    16.27
   ],
   "scale": 1.002,
   "rot_deg": -2.32,
   "shift": [
    -6.8,
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
   "mask": {
    "file": "track/think_loop_25.png",
    "rect": [162, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_loop_25_u.png",
    "rect": [288, 378, 231, 110]
   },
   "yield_eye_px": 0,
   "yield_px": 49,
   "cover_alien_px": 12,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_loop/26.png": {
   "m": [
    1.00114,
    -0.04021,
    -25.81,
    16.2
   ],
   "scale": 1.0019,
   "rot_deg": -2.3,
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
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_loop_26.png",
    "rect": [162, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_loop_26_u.png",
    "rect": [288, 378, 231, 110]
   },
   "yield_eye_px": 0,
   "yield_px": 40,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_loop/27.png": {
   "m": [
    1.00109,
    -0.03978,
    -25.44,
    16.05
   ],
   "scale": 1.0019,
   "rot_deg": -2.28,
   "shift": [
    -6.5,
    0.3
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
   "mask": {
    "file": "track/think_loop_27.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_loop_27_u.png",
    "rect": [289, 378, 230, 110]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_loop/28.png": {
   "m": [
    1.00115,
    -0.03869,
    -24.75,
    15.55
   ],
   "scale": 1.0019,
   "rot_deg": -2.21,
   "shift": [
    -6.3,
    0.3
   ],
   "inliers": 160,
   "residual_px": 0.61,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_loop_28.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_loop_28_u.png",
    "rect": [289, 378, 230, 110]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_loop/29.png": {
   "m": [
    1.00151,
    -0.03635,
    -23.51,
    14.41
   ],
   "scale": 1.0022,
   "rot_deg": -2.08,
   "shift": [
    -6.0,
    0.3
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
   "mask": {
    "file": "track/think_loop_29.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_loop_29_u.png",
    "rect": [289, 378, 231, 110]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 11,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_loop/30.png": {
   "m": [
    1.00207,
    -0.03354,
    -22.09,
    12.95
   ],
   "scale": 1.0026,
   "rot_deg": -1.92,
   "shift": [
    -5.6,
    0.2
   ],
   "inliers": 167,
   "residual_px": 0.61,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_loop_30.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_loop_30_u.png",
    "rect": [290, 378, 230, 109]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 13,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_loop/31.png": {
   "m": [
    1.00233,
    -0.02983,
    -19.87,
    11.21
   ],
   "scale": 1.0028,
   "rot_deg": -1.7,
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
   "mask": {
    "file": "track/think_loop_31.png",
    "rect": [164, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_loop_31_u.png",
    "rect": [290, 379, 231, 108]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 15,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_loop/32.png": {
   "m": [
    1.00224,
    -0.02634,
    -17.51,
    9.75
   ],
   "scale": 1.0026,
   "rot_deg": -1.51,
   "shift": [
    -4.3,
    0.0
   ],
   "inliers": 174,
   "residual_px": 0.57,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_loop_32.png",
    "rect": [165, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_loop_32_u.png",
    "rect": [291, 379, 231, 108]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 12,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_loop/33.png": {
   "m": [
    1.00222,
    -0.0229,
    -15.32,
    8.28
   ],
   "scale": 1.0025,
   "rot_deg": -1.31,
   "shift": [
    -3.8,
    -0.0
   ],
   "inliers": 170,
   "residual_px": 0.58,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_loop_33.png",
    "rect": [165, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_loop_33_u.png",
    "rect": [292, 379, 230, 107]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 14,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_loop/34.png": {
   "m": [
    1.00241,
    -0.01874,
    -12.84,
    6.4
   ],
   "scale": 1.0026,
   "rot_deg": -1.07,
   "shift": [
    -3.1,
    -0.1
   ],
   "inliers": 190,
   "residual_px": 0.58,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_loop_34.png",
    "rect": [166, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_loop_34_u.png",
    "rect": [293, 379, 230, 107]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 15,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_loop/35.png": {
   "m": [
    1.00221,
    -0.0154,
    -10.63,
    5.07
   ],
   "scale": 1.0023,
   "rot_deg": -0.88,
   "shift": [
    -2.6,
    -0.2
   ],
   "inliers": 187,
   "residual_px": 0.59,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_loop_35.png",
    "rect": [166, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_loop_35_u.png",
    "rect": [293, 379, 231, 107]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_loop/36.png": {
   "m": [
    1.00215,
    -0.0127,
    -8.67,
    3.92
   ],
   "scale": 1.0022,
   "rot_deg": -0.73,
   "shift": [
    -1.9,
    -0.3
   ],
   "inliers": 176,
   "residual_px": 0.58,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_loop_36.png",
    "rect": [167, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_loop_36_u.png",
    "rect": [294, 380, 231, 106]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 10,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_loop/37.png": {
   "m": [
    1.0025,
    -0.01044,
    -7.29,
    2.77
   ],
   "scale": 1.0025,
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
   "mask": {
    "file": "track/think_loop_37.png",
    "rect": [168, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_loop_37_u.png",
    "rect": [295, 380, 231, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 14,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_loop/38.png": {
   "m": [
    1.00273,
    -0.0077,
    -5.74,
    1.5
   ],
   "scale": 1.0028,
   "rot_deg": -0.44,
   "shift": [
    -1.0,
    -0.4
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
   "mask": {
    "file": "track/think_loop_38.png",
    "rect": [168, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_loop_38_u.png",
    "rect": [295, 380, 231, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 15,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_loop/39.png": {
   "m": [
    1.00278,
    -0.00561,
    -4.47,
    0.6
   ],
   "scale": 1.0028,
   "rot_deg": -0.32,
   "shift": [
    -0.7,
    -0.4
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
   "mask": {
    "file": "track/think_loop_39.png",
    "rect": [168, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_loop_39_u.png",
    "rect": [296, 380, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_loop/40.png": {
   "m": [
    1.0027,
    -0.00391,
    -3.37,
    -0.1
   ],
   "scale": 1.0027,
   "rot_deg": -0.22,
   "shift": [
    -0.4,
    -0.4
   ],
   "inliers": 190,
   "residual_px": 0.54,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_loop_40.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_loop_40_u.png",
    "rect": [296, 380, 231, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_loop/41.png": {
   "m": [
    1.00288,
    -0.00264,
    -2.74,
    -0.78
   ],
   "scale": 1.0029,
   "rot_deg": -0.15,
   "shift": [
    -0.3,
    -0.5
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
   "mask": {
    "file": "track/think_loop_41.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_loop_41_u.png",
    "rect": [296, 380, 231, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 10,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_loop/42.png": {
   "m": [
    1.00282,
    -0.00219,
    -2.42,
    -0.95
   ],
   "scale": 1.0028,
   "rot_deg": -0.13,
   "shift": [
    -0.2,
    -0.5
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
   "mask": {
    "file": "track/think_loop_42.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_loop_42_u.png",
    "rect": [296, 380, 231, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_loop/43.png": {
   "m": [
    1.00268,
    -0.00191,
    -2.15,
    -0.99
   ],
   "scale": 1.0027,
   "rot_deg": -0.11,
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
   "mask": {
    "file": "track/think_loop_43.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_loop_43_u.png",
    "rect": [296, 380, 231, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 11,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_loop/44.png": {
   "m": [
    1.0026,
    -0.00166,
    -1.95,
    -1.08
   ],
   "scale": 1.0026,
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
   "mask": {
    "file": "track/think_loop_44.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_loop_44_u.png",
    "rect": [297, 380, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 12,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_loop/45.png": {
   "m": [
    1.00262,
    -0.00143,
    -1.84,
    -1.17
   ],
   "scale": 1.0026,
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
   "mask": {
    "file": "track/think_loop_45.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_loop_45_u.png",
    "rect": [297, 380, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 12,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_loop/46.png": {
   "m": [
    1.00269,
    -0.00115,
    -1.72,
    -1.28
   ],
   "scale": 1.0027,
   "rot_deg": -0.07,
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
   "mask": {
    "file": "track/think_loop_46.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_loop_46_u.png",
    "rect": [297, 380, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 12,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_loop/47.png": {
   "m": [
    1.00217,
    -0.00062,
    -1.24,
    -1.17
   ],
   "scale": 1.0022,
   "rot_deg": -0.04,
   "shift": [
    -0.1,
    -0.4
   ],
   "inliers": 189,
   "residual_px": 0.52,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_loop_47.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_loop_47_u.png",
    "rect": [297, 380, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_loop/48.png": {
   "m": [
    1.0006,
    -0.00013,
    -0.33,
    -0.34
   ],
   "scale": 1.0006,
   "rot_deg": -0.01,
   "shift": [
    -0.0,
    -0.1
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
   "mask": {
    "file": "track/think_loop_48.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_loop_48_u.png",
    "rect": [297, 381, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_f2_loop/00.png": {
   "m": [
    1.00051,
    -0.0001,
    -0.27,
    -0.31
   ],
   "scale": 1.0005,
   "rot_deg": -0.01,
   "shift": [
    -0.0,
    -0.1
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
   "mask": {
    "file": "track/think_f2_loop_00.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_f2_loop_00_u.png",
    "rect": [297, 381, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_f2_loop/01.png": {
   "m": [
    1.00178,
    -0.00028,
    -0.91,
    -1.1
   ],
   "scale": 1.0018,
   "rot_deg": -0.02,
   "shift": [
    -0.0,
    -0.4
   ],
   "inliers": 218,
   "residual_px": 0.49,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_f2_loop_01.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_f2_loop_01_u.png",
    "rect": [297, 380, 231, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_f2_loop/02.png": {
   "m": [
    1.00194,
    -0.00015,
    -0.92,
    -1.26
   ],
   "scale": 1.0019,
   "rot_deg": -0.01,
   "shift": [
    -0.1,
    -0.4
   ],
   "inliers": 213,
   "residual_px": 0.44,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_f2_loop_02.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_f2_loop_02_u.png",
    "rect": [297, 380, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_f2_loop/03.png": {
   "m": [
    1.00163,
    -0.00011,
    -0.74,
    -0.93
   ],
   "scale": 1.0016,
   "rot_deg": -0.01,
   "shift": [
    -0.0,
    -0.2
   ],
   "inliers": 192,
   "residual_px": 0.44,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_f2_loop_03.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_f2_loop_03_u.png",
    "rect": [297, 381, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_f2_loop/04.png": {
   "m": [
    1.00136,
    0.00018,
    -0.45,
    -0.44
   ],
   "scale": 1.0014,
   "rot_deg": 0.01,
   "shift": [
    0.0,
    0.3
   ],
   "inliers": 193,
   "residual_px": 0.58,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_f2_loop_04.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_f2_loop_04_u.png",
    "rect": [297, 381, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 13,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_f2_loop/05.png": {
   "m": [
    1.0015,
    0.00138,
    0.02,
    -0.2
   ],
   "scale": 1.0015,
   "rot_deg": 0.08,
   "shift": [
    -0.0,
    1.1
   ],
   "inliers": 185,
   "residual_px": 0.57,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_f2_loop_05.png",
    "rect": [169, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_f2_loop_05_u.png",
    "rect": [297, 382, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_f2_loop/06.png": {
   "m": [
    1.002,
    0.00252,
    0.34,
    0.2
   ],
   "scale": 1.002,
   "rot_deg": 0.14,
   "shift": [
    -0.0,
    2.2
   ],
   "inliers": 153,
   "residual_px": 0.56,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_f2_loop_06.png",
    "rect": [169, 224, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_f2_loop_06_u.png",
    "rect": [297, 383, 229, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 10,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_f2_loop/07.png": {
   "m": [
    1.00243,
    0.00351,
    0.61,
    0.45
   ],
   "scale": 1.0024,
   "rot_deg": 0.2,
   "shift": [
    -0.0,
    3.0
   ],
   "inliers": 160,
   "residual_px": 0.59,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_f2_loop_07.png",
    "rect": [169, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_f2_loop_07_u.png",
    "rect": [297, 384, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_f2_loop/08.png": {
   "m": [
    1.00246,
    0.00418,
    0.92,
    0.81
   ],
   "scale": 1.0025,
   "rot_deg": 0.24,
   "shift": [
    -0.0,
    3.7
   ],
   "inliers": 153,
   "residual_px": 0.63,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_f2_loop_08.png",
    "rect": [169, 226, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_f2_loop_08_u.png",
    "rect": [297, 385, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_f2_loop/09.png": {
   "m": [
    1.00241,
    0.00477,
    1.21,
    0.92
   ],
   "scale": 1.0024,
   "rot_deg": 0.27,
   "shift": [
    -0.0,
    4.0
   ],
   "inliers": 149,
   "residual_px": 0.62,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_f2_loop_09.png",
    "rect": [169, 226, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_f2_loop_09_u.png",
    "rect": [297, 385, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 36,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_f2_loop/10.png": {
   "m": [
    1.00274,
    0.00491,
    1.18,
    0.85
   ],
   "scale": 1.0028,
   "rot_deg": 0.28,
   "shift": [
    0.0,
    4.1
   ],
   "inliers": 152,
   "residual_px": 0.64,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_f2_loop_10.png",
    "rect": [169, 226, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_f2_loop_10_u.png",
    "rect": [297, 385, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 96,
   "cover_alien_px": 7,
   "occluded": 0.001,
   "w": 1.0
  },
  "frames/think_f2_loop/11.png": {
   "m": [
    1.00311,
    0.00512,
    1.12,
    0.68
   ],
   "scale": 1.0031,
   "rot_deg": 0.29,
   "shift": [
    0.0,
    4.2
   ],
   "inliers": 145,
   "residual_px": 0.61,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_f2_loop_11.png",
    "rect": [169, 226, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_f2_loop_11_u.png",
    "rect": [297, 385, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 99,
   "cover_alien_px": 8,
   "occluded": 0.001,
   "w": 1.0
  },
  "frames/think_f2_loop/12.png": {
   "m": [
    1.00301,
    0.00503,
    1.1,
    0.74
   ],
   "scale": 1.003,
   "rot_deg": 0.29,
   "shift": [
    -0.0,
    4.2
   ],
   "inliers": 152,
   "residual_px": 0.65,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_f2_loop_12.png",
    "rect": [169, 226, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_f2_loop_12_u.png",
    "rect": [297, 385, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_f2_loop/13.png": {
   "m": [
    1.00285,
    0.00516,
    1.21,
    0.77
   ],
   "scale": 1.0029,
   "rot_deg": 0.3,
   "shift": [
    -0.0,
    4.2
   ],
   "inliers": 141,
   "residual_px": 0.57,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_f2_loop_13.png",
    "rect": [169, 226, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_f2_loop_13_u.png",
    "rect": [297, 385, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_f2_loop/14.png": {
   "m": [
    1.00308,
    0.00504,
    1.06,
    0.72
   ],
   "scale": 1.0031,
   "rot_deg": 0.29,
   "shift": [
    -0.0,
    4.2
   ],
   "inliers": 157,
   "residual_px": 0.64,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_f2_loop_14.png",
    "rect": [169, 226, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_f2_loop_14_u.png",
    "rect": [297, 385, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_f2_loop/15.png": {
   "m": [
    1.00301,
    0.00508,
    1.09,
    0.73
   ],
   "scale": 1.003,
   "rot_deg": 0.29,
   "shift": [
    -0.0,
    4.2
   ],
   "inliers": 151,
   "residual_px": 0.64,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_f2_loop_15.png",
    "rect": [169, 226, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_f2_loop_15_u.png",
    "rect": [297, 385, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_f2_loop/16.png": {
   "m": [
    1.00305,
    0.00458,
    0.87,
    0.92
   ],
   "scale": 1.0031,
   "rot_deg": 0.26,
   "shift": [
    -0.0,
    4.2
   ],
   "inliers": 154,
   "residual_px": 0.62,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_f2_loop_16.png",
    "rect": [169, 226, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_f2_loop_16_u.png",
    "rect": [297, 385, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_f2_loop/17.png": {
   "m": [
    1.00324,
    0.00437,
    0.69,
    0.92
   ],
   "scale": 1.0033,
   "rot_deg": 0.25,
   "shift": [
    -0.0,
    4.2
   ],
   "inliers": 144,
   "residual_px": 0.62,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_f2_loop_17.png",
    "rect": [169, 226, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_f2_loop_17_u.png",
    "rect": [297, 385, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 90,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_f2_loop/18.png": {
   "m": [
    1.00242,
    0.00499,
    1.31,
    0.96
   ],
   "scale": 1.0024,
   "rot_deg": 0.29,
   "shift": [
    -0.0,
    4.1
   ],
   "inliers": 145,
   "residual_px": 0.65,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_f2_loop_18.png",
    "rect": [169, 226, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_f2_loop_18_u.png",
    "rect": [297, 385, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 78,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_f2_loop/19.png": {
   "m": [
    1.00156,
    0.00465,
    1.55,
    1.37
   ],
   "scale": 1.0016,
   "rot_deg": 0.27,
   "shift": [
    0.0,
    4.0
   ],
   "inliers": 108,
   "residual_px": 0.63,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_f2_loop_19.png",
    "rect": [169, 226, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_f2_loop_19_u.png",
    "rect": [297, 385, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 43,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_f2_loop/20.png": {
   "m": [
    1.0026,
    0.00495,
    1.15,
    0.7
   ],
   "scale": 1.0026,
   "rot_deg": 0.28,
   "shift": [
    -0.1,
    3.9
   ],
   "inliers": 143,
   "residual_px": 0.7,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_f2_loop_20.png",
    "rect": [169, 226, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_f2_loop_20_u.png",
    "rect": [297, 385, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_f2_loop/21.png": {
   "m": [
    1.00248,
    0.00456,
    1.06,
    0.69
   ],
   "scale": 1.0025,
   "rot_deg": 0.26,
   "shift": [
    -0.0,
    3.7
   ],
   "inliers": 151,
   "residual_px": 0.63,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_f2_loop_21.png",
    "rect": [169, 226, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_f2_loop_21_u.png",
    "rect": [297, 385, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 16,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_f2_loop/22.png": {
   "m": [
    1.00231,
    0.0042,
    1.01,
    0.62
   ],
   "scale": 1.0023,
   "rot_deg": 0.24,
   "shift": [
    -0.0,
    3.4
   ],
   "inliers": 155,
   "residual_px": 0.64,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_f2_loop_22.png",
    "rect": [169, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_f2_loop_22_u.png",
    "rect": [297, 384, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 13,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_f2_loop/23.png": {
   "m": [
    1.00233,
    0.00389,
    0.83,
    0.4
   ],
   "scale": 1.0023,
   "rot_deg": 0.22,
   "shift": [
    -0.0,
    3.1
   ],
   "inliers": 152,
   "residual_px": 0.61,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_f2_loop_23.png",
    "rect": [169, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_f2_loop_23_u.png",
    "rect": [297, 384, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 12,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_f2_loop/24.png": {
   "m": [
    1.00208,
    0.00331,
    0.65,
    0.28
   ],
   "scale": 1.0021,
   "rot_deg": 0.19,
   "shift": [
    -0.0,
    2.6
   ],
   "inliers": 162,
   "residual_px": 0.6,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_f2_loop_24.png",
    "rect": [169, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_f2_loop_24_u.png",
    "rect": [297, 384, 230, 103]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_f2_loop/25.png": {
   "m": [
    1.00094,
    0.00286,
    0.9,
    0.26
   ],
   "scale": 1.0009,
   "rot_deg": 0.16,
   "shift": [
    -0.0,
    1.9
   ],
   "inliers": 153,
   "residual_px": 0.78,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_f2_loop_25.png",
    "rect": [169, 224, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_f2_loop_25_u.png",
    "rect": [297, 383, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_f2_loop/26.png": {
   "m": [
    1.00109,
    0.0019,
    0.39,
    0.19
   ],
   "scale": 1.0011,
   "rot_deg": 0.11,
   "shift": [
    -0.0,
    1.5
   ],
   "inliers": 180,
   "residual_px": 0.67,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_f2_loop_26.png",
    "rect": [169, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_f2_loop_26_u.png",
    "rect": [297, 382, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_f2_loop/27.png": {
   "m": [
    1.00154,
    0.00092,
    -0.22,
    -0.02
   ],
   "scale": 1.0015,
   "rot_deg": 0.05,
   "shift": [
    -0.0,
    1.1
   ],
   "inliers": 175,
   "residual_px": 0.59,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_f2_loop_27.png",
    "rect": [169, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_f2_loop_27_u.png",
    "rect": [297, 382, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 12,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_f2_loop/28.png": {
   "m": [
    1.0014,
    0.00035,
    -0.4,
    -0.23
   ],
   "scale": 1.0014,
   "rot_deg": 0.02,
   "shift": [
    0.0,
    0.6
   ],
   "inliers": 199,
   "residual_px": 0.67,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_f2_loop_28.png",
    "rect": [169, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_f2_loop_28_u.png",
    "rect": [297, 381, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 12,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_f2_loop/29.png": {
   "m": [
    1.00167,
    0.00022,
    -0.62,
    -0.74
   ],
   "scale": 1.0017,
   "rot_deg": 0.01,
   "shift": [
    -0.0,
    0.1
   ],
   "inliers": 190,
   "residual_px": 0.56,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_f2_loop_29.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_f2_loop_29_u.png",
    "rect": [297, 381, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 12,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_f2_loop/30.png": {
   "m": [
    1.00209,
    0.00013,
    -0.86,
    -1.17
   ],
   "scale": 1.0021,
   "rot_deg": 0.01,
   "shift": [
    -0.1,
    -0.1
   ],
   "inliers": 201,
   "residual_px": 0.53,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_f2_loop_30.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_f2_loop_30_u.png",
    "rect": [297, 381, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 15,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_f2_loop/31.png": {
   "m": [
    1.00241,
    -0.00022,
    -1.14,
    -1.37
   ],
   "scale": 1.0024,
   "rot_deg": -0.01,
   "shift": [
    -0.1,
    -0.3
   ],
   "inliers": 194,
   "residual_px": 0.51,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_f2_loop_31.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_f2_loop_31_u.png",
    "rect": [297, 380, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 13,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_f2_loop/32.png": {
   "m": [
    1.00263,
    -0.00036,
    -1.31,
    -1.58
   ],
   "scale": 1.0026,
   "rot_deg": -0.02,
   "shift": [
    -0.1,
    -0.5
   ],
   "inliers": 197,
   "residual_px": 0.54,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_f2_loop_32.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_f2_loop_32_u.png",
    "rect": [297, 380, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 12,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_f2_loop/33.png": {
   "m": [
    1.00272,
    -0.00038,
    -1.37,
    -1.68
   ],
   "scale": 1.0027,
   "rot_deg": -0.02,
   "shift": [
    -0.1,
    -0.6
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
   "mask": {
    "file": "track/think_f2_loop_33.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_f2_loop_33_u.png",
    "rect": [297, 380, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 13,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_f2_loop/34.png": {
   "m": [
    1.00272,
    -0.00063,
    -1.46,
    -1.58
   ],
   "scale": 1.0027,
   "rot_deg": -0.04,
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
   "mask": {
    "file": "track/think_f2_loop_34.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_f2_loop_34_u.png",
    "rect": [297, 380, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 12,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_f2_loop/35.png": {
   "m": [
    1.00268,
    -0.00047,
    -1.37,
    -1.64
   ],
   "scale": 1.0027,
   "rot_deg": -0.03,
   "shift": [
    -0.1,
    -0.6
   ],
   "inliers": 202,
   "residual_px": 0.54,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_f2_loop_35.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_f2_loop_35_u.png",
    "rect": [297, 380, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 12,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_f2_loop/36.png": {
   "m": [
    1.00268,
    -0.00031,
    -1.3,
    -1.71
   ],
   "scale": 1.0027,
   "rot_deg": -0.02,
   "shift": [
    -0.1,
    -0.6
   ],
   "inliers": 198,
   "residual_px": 0.54,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_f2_loop_36.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_f2_loop_36_u.png",
    "rect": [297, 380, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 11,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_f2_loop/37.png": {
   "m": [
    1.00266,
    -0.00044,
    -1.35,
    -1.65
   ],
   "scale": 1.0027,
   "rot_deg": -0.03,
   "shift": [
    -0.1,
    -0.6
   ],
   "inliers": 204,
   "residual_px": 0.54,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_f2_loop_37.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_f2_loop_37_u.png",
    "rect": [297, 380, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 13,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_f2_loop/38.png": {
   "m": [
    1.00266,
    -0.0004,
    -1.33,
    -1.66
   ],
   "scale": 1.0027,
   "rot_deg": -0.02,
   "shift": [
    -0.1,
    -0.6
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
   "mask": {
    "file": "track/think_f2_loop_38.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_f2_loop_38_u.png",
    "rect": [297, 380, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 10,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_f2_loop/39.png": {
   "m": [
    1.00273,
    -0.00053,
    -1.44,
    -1.64
   ],
   "scale": 1.0027,
   "rot_deg": -0.03,
   "shift": [
    -0.1,
    -0.6
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
   "mask": {
    "file": "track/think_f2_loop_39.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_f2_loop_39_u.png",
    "rect": [297, 380, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_f2_loop/40.png": {
   "m": [
    1.00273,
    -0.0005,
    -1.44,
    -1.67
   ],
   "scale": 1.0027,
   "rot_deg": -0.03,
   "shift": [
    -0.1,
    -0.6
   ],
   "inliers": 200,
   "residual_px": 0.55,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_f2_loop_40.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_f2_loop_40_u.png",
    "rect": [297, 380, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_f2_loop/41.png": {
   "m": [
    1.00272,
    -0.0005,
    -1.42,
    -1.66
   ],
   "scale": 1.0027,
   "rot_deg": -0.03,
   "shift": [
    -0.1,
    -0.6
   ],
   "inliers": 200,
   "residual_px": 0.55,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_f2_loop_41.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_f2_loop_41_u.png",
    "rect": [297, 380, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_f2_loop/42.png": {
   "m": [
    1.00262,
    -0.00057,
    -1.39,
    -1.55
   ],
   "scale": 1.0026,
   "rot_deg": -0.03,
   "shift": [
    -0.1,
    -0.6
   ],
   "inliers": 197,
   "residual_px": 0.51,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_f2_loop_42.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_f2_loop_42_u.png",
    "rect": [297, 380, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_f2_loop/43.png": {
   "m": [
    1.00248,
    -0.00052,
    -1.3,
    -1.49
   ],
   "scale": 1.0025,
   "rot_deg": -0.03,
   "shift": [
    -0.0,
    -0.6
   ],
   "inliers": 189,
   "residual_px": 0.5,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_f2_loop_43.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_f2_loop_43_u.png",
    "rect": [297, 380, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_f2_loop/44.png": {
   "m": [
    1.00271,
    -0.00061,
    -1.47,
    -1.59
   ],
   "scale": 1.0027,
   "rot_deg": -0.03,
   "shift": [
    -0.1,
    -0.6
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
   "mask": {
    "file": "track/think_f2_loop_44.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_f2_loop_44_u.png",
    "rect": [297, 380, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_f2_loop/45.png": {
   "m": [
    1.00277,
    -0.00062,
    -1.49,
    -1.63
   ],
   "scale": 1.0028,
   "rot_deg": -0.04,
   "shift": [
    -0.1,
    -0.6
   ],
   "inliers": 205,
   "residual_px": 0.54,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_f2_loop_45.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_f2_loop_45_u.png",
    "rect": [297, 380, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_f2_loop/46.png": {
   "m": [
    1.00273,
    -0.00063,
    -1.46,
    -1.59
   ],
   "scale": 1.0027,
   "rot_deg": -0.04,
   "shift": [
    -0.1,
    -0.6
   ],
   "inliers": 207,
   "residual_px": 0.54,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_f2_loop_46.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_f2_loop_46_u.png",
    "rect": [297, 380, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_f2_loop/47.png": {
   "m": [
    1.00215,
    -0.00041,
    -1.1,
    -1.29
   ],
   "scale": 1.0021,
   "rot_deg": -0.02,
   "shift": [
    -0.0,
    -0.5
   ],
   "inliers": 207,
   "residual_px": 0.53,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_f2_loop_47.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_f2_loop_47_u.png",
    "rect": [297, 380, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_f2_loop/48.png": {
   "m": [
    1.00059,
    -0.0001,
    -0.3,
    -0.36
   ],
   "scale": 1.0006,
   "rot_deg": -0.01,
   "shift": [
    -0.0,
    -0.1
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
   "mask": {
    "file": "track/think_f2_loop_48.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_f2_loop_48_u.png",
    "rect": [297, 381, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_mid_loop/00.png": {
   "m": [
    1.00051,
    -0.0001,
    -0.25,
    -0.32
   ],
   "scale": 1.0005,
   "rot_deg": -0.01,
   "shift": [
    0.0,
    -0.1
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
   "mask": {
    "file": "track/think_mid_loop_00.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_mid_loop_00_u.png",
    "rect": [297, 381, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_mid_loop/01.png": {
   "m": [
    1.00186,
    -0.00027,
    -0.85,
    -1.24
   ],
   "scale": 1.0019,
   "rot_deg": -0.02,
   "shift": [
    0.0,
    -0.5
   ],
   "inliers": 202,
   "residual_px": 0.5,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_mid_loop_01.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_mid_loop_01_u.png",
    "rect": [297, 380, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 15,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_mid_loop/02.png": {
   "m": [
    1.00233,
    -8e-05,
    -0.92,
    -1.73
   ],
   "scale": 1.0023,
   "rot_deg": -0.0,
   "shift": [
    0.1,
    -0.7
   ],
   "inliers": 185,
   "residual_px": 0.51,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_mid_loop_02.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_mid_loop_02_u.png",
    "rect": [297, 380, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 20,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_mid_loop/03.png": {
   "m": [
    1.00198,
    -4e-05,
    -0.77,
    -1.43
   ],
   "scale": 1.002,
   "rot_deg": -0.0,
   "shift": [
    0.1,
    -0.5
   ],
   "inliers": 185,
   "residual_px": 0.52,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_mid_loop_03.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_mid_loop_03_u.png",
    "rect": [297, 380, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 24,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_mid_loop/04.png": {
   "m": [
    1.00013,
    -0.00047,
    -0.31,
    0.69
   ],
   "scale": 1.0001,
   "rot_deg": -0.03,
   "shift": [
    -0.0,
    0.6
   ],
   "inliers": 188,
   "residual_px": 0.61,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_mid_loop_04.png",
    "rect": [169, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_mid_loop_04_u.png",
    "rect": [297, 381, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 13,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_mid_loop/05.png": {
   "m": [
    0.99833,
    -0.00116,
    -0.19,
    4.64
   ],
   "scale": 0.9983,
   "rot_deg": -0.07,
   "shift": [
    -0.3,
    3.4
   ],
   "inliers": 125,
   "residual_px": 0.92,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.4
   },
   "ok": true,
   "mask": {
    "file": "track/think_mid_loop_05.png",
    "rect": [169, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_mid_loop_05_u.png",
    "rect": [297, 384, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 21,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_mid_loop/06.png": {
   "m": [
    1.00026,
    -0.00218,
    -2.07,
    8.4
   ],
   "scale": 1.0003,
   "rot_deg": -0.12,
   "shift": [
    -0.9,
    7.6
   ],
   "inliers": 79,
   "residual_px": 0.89,
   "ref_residual_px": {
    "eyeL": 2.0,
    "eyeR": 1.0,
    "mouth": 2.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_mid_loop_06.png",
    "rect": [168, 230, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_mid_loop_06_u.png",
    "rect": [296, 388, 228, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 35,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_mid_loop/07.png": {
   "m": [
    0.99826,
    -0.00622,
    -3.48,
    13.58
   ],
   "scale": 0.9983,
   "rot_deg": -0.36,
   "shift": [
    -1.3,
    10.2
   ],
   "inliers": 71,
   "residual_px": 1.11,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 1.4,
    "nose": 0.0,
    "pin": 1.4
   },
   "ok": true,
   "mask": {
    "file": "track/think_mid_loop_07.png",
    "rect": [168, 232, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_mid_loop_07_u.png",
    "rect": [296, 391, 229, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 40,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_mid_loop/08.png": {
   "m": [
    0.99934,
    -0.01029,
    -6.31,
    14.83
   ],
   "scale": 0.9994,
   "rot_deg": -0.59,
   "shift": [
    -1.8,
    10.3
   ],
   "inliers": 65,
   "residual_px": 0.9,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 1.4
   },
   "ok": true,
   "mask": {
    "file": "track/think_mid_loop_08.png",
    "rect": [167, 232, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_mid_loop_08_u.png",
    "rect": [295, 391, 229, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 138,
   "cover_alien_px": 41,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_mid_loop/09.png": {
   "m": [
    1.00074,
    -0.01478,
    -9.85,
    12.85
   ],
   "scale": 1.0008,
   "rot_deg": -0.85,
   "shift": [
    -2.7,
    7.2
   ],
   "inliers": 80,
   "residual_px": 0.97,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_mid_loop_09.png",
    "rect": [166, 229, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_mid_loop_09_u.png",
    "rect": [294, 387, 228, 106]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 36,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_mid_loop/10.png": {
   "m": [
    1.00027,
    -0.02118,
    -13.94,
    10.35
   ],
   "scale": 1.0005,
   "rot_deg": -1.21,
   "shift": [
    -4.0,
    1.8
   ],
   "inliers": 118,
   "residual_px": 0.85,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 2.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_mid_loop_10.png",
    "rect": [165, 224, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_mid_loop_10_u.png",
    "rect": [292, 381, 230, 107]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 20,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_mid_loop/11.png": {
   "m": [
    1.00063,
    -0.02869,
    -18.65,
    9.77
   ],
   "scale": 1.001,
   "rot_deg": -1.64,
   "shift": [
    -5.0,
    -1.7
   ],
   "inliers": 131,
   "residual_px": 0.76,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 1.4
   },
   "ok": true,
   "mask": {
    "file": "track/think_mid_loop_11.png",
    "rect": [164, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_mid_loop_11_u.png",
    "rect": [291, 377, 230, 108]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 16,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_mid_loop/12.png": {
   "m": [
    1.00186,
    -0.03582,
    -23.7,
    10.32
   ],
   "scale": 1.0025,
   "rot_deg": -2.05,
   "shift": [
    -6.3,
    -3.5
   ],
   "inliers": 122,
   "residual_px": 0.75,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 1.0,
    "mouth": 0.0,
    "nose": 1.4,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_mid_loop_12.png",
    "rect": [163, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_mid_loop_12_u.png",
    "rect": [289, 375, 230, 109]
   },
   "yield_eye_px": 0,
   "yield_px": 145,
   "cover_alien_px": 9,
   "occluded": 0.003,
   "w": 1.0
  },
  "frames/think_mid_loop/13.png": {
   "m": [
    1.00184,
    -0.0417,
    -27.22,
    13.04
   ],
   "scale": 1.0027,
   "rot_deg": -2.38,
   "shift": [
    -7.1,
    -3.1
   ],
   "inliers": 123,
   "residual_px": 0.75,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 1.0,
    "mouth": 0.0,
    "nose": 1.4,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_mid_loop_13.png",
    "rect": [162, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_mid_loop_13_u.png",
    "rect": [288, 374, 231, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 297,
   "cover_alien_px": 8,
   "occluded": 0.01,
   "w": 1.0
  },
  "frames/think_mid_loop/14.png": {
   "m": [
    1.00005,
    -0.04584,
    -28.93,
    17.49
   ],
   "scale": 1.0011,
   "rot_deg": -2.62,
   "shift": [
    -7.6,
    -1.2
   ],
   "inliers": 123,
   "residual_px": 0.71,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_mid_loop_14.png",
    "rect": [161, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_mid_loop_14_u.png",
    "rect": [287, 376, 230, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 383,
   "cover_alien_px": 16,
   "occluded": 0.014,
   "w": 1.0
  },
  "frames/think_mid_loop/15.png": {
   "m": [
    0.99882,
    -0.04792,
    -29.74,
    20.86
   ],
   "scale": 1.0,
   "rot_deg": -2.75,
   "shift": [
    -7.9,
    0.7
   ],
   "inliers": 124,
   "residual_px": 0.76,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.4,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_mid_loop_15.png",
    "rect": [161, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_mid_loop_15_u.png",
    "rect": [287, 378, 229, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 398,
   "cover_alien_px": 9,
   "occluded": 0.014,
   "w": 1.0
  },
  "frames/think_mid_loop/16.png": {
   "m": [
    0.99868,
    -0.04895,
    -30.3,
    22.46
   ],
   "scale": 0.9999,
   "rot_deg": -2.81,
   "shift": [
    -8.1,
    1.8
   ],
   "inliers": 129,
   "residual_px": 0.75,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_mid_loop_16.png",
    "rect": [161, 224, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_mid_loop_16_u.png",
    "rect": [287, 379, 230, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 410,
   "cover_alien_px": 10,
   "occluded": 0.015,
   "w": 1.0
  },
  "frames/think_mid_loop/17.png": {
   "m": [
    0.99807,
    -0.04854,
    -30.02,
    23.1
   ],
   "scale": 0.9993,
   "rot_deg": -2.78,
   "shift": [
    -8.2,
    2.4
   ],
   "inliers": 124,
   "residual_px": 0.87,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.4,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_mid_loop_17.png",
    "rect": [161, 224, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_mid_loop_17_u.png",
    "rect": [287, 380, 230, 110]
   },
   "yield_eye_px": 0,
   "yield_px": 417,
   "cover_alien_px": 8,
   "occluded": 0.016,
   "w": 1.0
  },
  "frames/think_mid_loop/18.png": {
   "m": [
    0.99807,
    -0.04854,
    -30.08,
    23.31
   ],
   "scale": 0.9993,
   "rot_deg": -2.78,
   "shift": [
    -8.3,
    2.6
   ],
   "inliers": 117,
   "residual_px": 0.81,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_mid_loop_18.png",
    "rect": [161, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_mid_loop_18_u.png",
    "rect": [287, 380, 230, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 426,
   "cover_alien_px": 9,
   "occluded": 0.016,
   "w": 1.0
  },
  "frames/think_mid_loop/19.png": {
   "m": [
    1.0006,
    -0.0496,
    -31.5,
    22.83
   ],
   "scale": 1.0018,
   "rot_deg": -2.84,
   "shift": [
    -8.2,
    2.8
   ],
   "inliers": 117,
   "residual_px": 0.71,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_mid_loop_19.png",
    "rect": [161, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_mid_loop_19_u.png",
    "rect": [287, 380, 230, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 443,
   "cover_alien_px": 12,
   "occluded": 0.017,
   "w": 1.0
  },
  "frames/think_mid_loop/20.png": {
   "m": [
    0.99979,
    -0.04953,
    -31.1,
    23.1
   ],
   "scale": 1.001,
   "rot_deg": -2.84,
   "shift": [
    -8.1,
    2.8
   ],
   "inliers": 121,
   "residual_px": 0.78,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_mid_loop_20.png",
    "rect": [161, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_mid_loop_20_u.png",
    "rect": [287, 380, 230, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 438,
   "cover_alien_px": 11,
   "occluded": 0.016,
   "w": 1.0
  },
  "frames/think_mid_loop/21.png": {
   "m": [
    0.99805,
    -0.04908,
    -30.17,
    23.61
   ],
   "scale": 0.9993,
   "rot_deg": -2.82,
   "shift": [
    -8.1,
    2.6
   ],
   "inliers": 115,
   "residual_px": 0.77,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_mid_loop_21.png",
    "rect": [161, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_mid_loop_21_u.png",
    "rect": [287, 380, 230, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 431,
   "cover_alien_px": 10,
   "occluded": 0.016,
   "w": 1.0
  },
  "frames/think_mid_loop/22.png": {
   "m": [
    0.99773,
    -0.04864,
    -29.88,
    23.54
   ],
   "scale": 0.9989,
   "rot_deg": -2.79,
   "shift": [
    -8.2,
    2.6
   ],
   "inliers": 112,
   "residual_px": 0.8,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_mid_loop_22.png",
    "rect": [161, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_mid_loop_22_u.png",
    "rect": [287, 380, 230, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 429,
   "cover_alien_px": 10,
   "occluded": 0.016,
   "w": 1.0
  },
  "frames/think_mid_loop/23.png": {
   "m": [
    0.99994,
    -0.04986,
    -31.27,
    23.17
   ],
   "scale": 1.0012,
   "rot_deg": -2.85,
   "shift": [
    -8.1,
    2.8
   ],
   "inliers": 112,
   "residual_px": 0.69,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_mid_loop_23.png",
    "rect": [161, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_mid_loop_23_u.png",
    "rect": [287, 380, 230, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 441,
   "cover_alien_px": 13,
   "occluded": 0.016,
   "w": 1.0
  },
  "frames/think_mid_loop/24.png": {
   "m": [
    0.99937,
    -0.04963,
    -30.89,
    23.16
   ],
   "scale": 1.0006,
   "rot_deg": -2.84,
   "shift": [
    -8.1,
    2.6
   ],
   "inliers": 127,
   "residual_px": 0.86,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_mid_loop_24.png",
    "rect": [161, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_mid_loop_24_u.png",
    "rect": [287, 380, 230, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 432,
   "cover_alien_px": 11,
   "occluded": 0.016,
   "w": 1.0
  },
  "frames/think_mid_loop/25.png": {
   "m": [
    0.99804,
    -0.04911,
    -30.12,
    23.39
   ],
   "scale": 0.9993,
   "rot_deg": -2.82,
   "shift": [
    -8.1,
    2.4
   ],
   "inliers": 122,
   "residual_px": 0.89,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_mid_loop_25.png",
    "rect": [161, 224, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_mid_loop_25_u.png",
    "rect": [287, 380, 230, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 418,
   "cover_alien_px": 9,
   "occluded": 0.016,
   "w": 1.0
  },
  "frames/think_mid_loop/26.png": {
   "m": [
    0.99773,
    -0.04865,
    -29.84,
    23.31
   ],
   "scale": 0.9989,
   "rot_deg": -2.79,
   "shift": [
    -8.1,
    2.4
   ],
   "inliers": 121,
   "residual_px": 0.89,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_mid_loop_26.png",
    "rect": [161, 224, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_mid_loop_26_u.png",
    "rect": [287, 380, 230, 110]
   },
   "yield_eye_px": 0,
   "yield_px": 418,
   "cover_alien_px": 8,
   "occluded": 0.016,
   "w": 1.0
  },
  "frames/think_mid_loop/27.png": {
   "m": [
    0.99844,
    -0.04811,
    -29.96,
    22.82
   ],
   "scale": 0.9996,
   "rot_deg": -2.76,
   "shift": [
    -8.2,
    2.4
   ],
   "inliers": 125,
   "residual_px": 0.9,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_mid_loop_27.png",
    "rect": [161, 224, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_mid_loop_27_u.png",
    "rect": [287, 380, 230, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 425,
   "cover_alien_px": 9,
   "occluded": 0.016,
   "w": 1.0
  },
  "frames/think_mid_loop/28.png": {
   "m": [
    1.0006,
    -0.04942,
    -31.41,
    22.31
   ],
   "scale": 1.0018,
   "rot_deg": -2.83,
   "shift": [
    -8.2,
    2.4
   ],
   "inliers": 107,
   "residual_px": 0.72,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_mid_loop_28.png",
    "rect": [161, 224, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_mid_loop_28_u.png",
    "rect": [286, 379, 231, 112]
   },
   "yield_eye_px": 0,
   "yield_px": 431,
   "cover_alien_px": 12,
   "occluded": 0.016,
   "w": 1.0
  },
  "frames/think_mid_loop/29.png": {
   "m": [
    1.00069,
    -0.05164,
    -32.56,
    22.59
   ],
   "scale": 1.002,
   "rot_deg": -2.95,
   "shift": [
    -8.2,
    1.8
   ],
   "inliers": 108,
   "residual_px": 0.73,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_mid_loop_29.png",
    "rect": [161, 224, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_mid_loop_29_u.png",
    "rect": [286, 379, 231, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 483,
   "cover_alien_px": 6,
   "occluded": 0.018,
   "w": 1.0
  },
  "frames/think_mid_loop/30.png": {
   "m": [
    0.99827,
    -0.05307,
    -32.42,
    24.01
   ],
   "scale": 0.9997,
   "rot_deg": -3.04,
   "shift": [
    -8.4,
    1.5
   ],
   "inliers": 121,
   "residual_px": 0.78,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_mid_loop_30.png",
    "rect": [161, 224, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_mid_loop_30_u.png",
    "rect": [286, 378, 231, 112]
   },
   "yield_eye_px": 0,
   "yield_px": 489,
   "cover_alien_px": 10,
   "occluded": 0.019,
   "w": 1.0
  },
  "frames/think_mid_loop/31.png": {
   "m": [
    0.99625,
    -0.05532,
    -32.75,
    26.64
   ],
   "scale": 0.9978,
   "rot_deg": -3.18,
   "shift": [
    -8.5,
    2.3
   ],
   "inliers": 108,
   "residual_px": 0.91,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_mid_loop_31.png",
    "rect": [160, 224, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_mid_loop_31_u.png",
    "rect": [286, 379, 230, 112]
   },
   "yield_eye_px": 0,
   "yield_px": 202,
   "cover_alien_px": 10,
   "occluded": 0.005,
   "w": 1.0
  },
  "frames/think_mid_loop/32.png": {
   "m": [
    1.00111,
    -0.05863,
    -35.9,
    28.07
   ],
   "scale": 1.0028,
   "rot_deg": -3.35,
   "shift": [
    -8.2,
    4.6
   ],
   "inliers": 92,
   "residual_px": 0.88,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 1.4,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_mid_loop_32.png",
    "rect": [161, 227, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_mid_loop_32_u.png",
    "rect": [286, 381, 230, 112]
   },
   "yield_eye_px": 0,
   "yield_px": 11,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_mid_loop/33.png": {
   "m": [
    1.00155,
    -0.05749,
    -34.34,
    30.78
   ],
   "scale": 1.0032,
   "rot_deg": -3.29,
   "shift": [
    -7.0,
    8.0
   ],
   "inliers": 66,
   "residual_px": 0.86,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_mid_loop_33.png",
    "rect": [162, 230, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_mid_loop_33_u.png",
    "rect": [287, 384, 230, 113]
   },
   "yield_eye_px": 0,
   "yield_px": 20,
   "cover_alien_px": 1,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_mid_loop/34.png": {
   "m": [
    0.99902,
    -0.05186,
    -29.35,
    31.99
   ],
   "scale": 1.0004,
   "rot_deg": -2.97,
   "shift": [
    -5.6,
    10.3
   ],
   "inliers": 60,
   "residual_px": 0.82,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 1.0,
    "mouth": 1.4,
    "nose": 1.4,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_mid_loop_34.png",
    "rect": [163, 232, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_mid_loop_34_u.png",
    "rect": [289, 387, 229, 112]
   },
   "yield_eye_px": 0,
   "yield_px": 12,
   "cover_alien_px": 1,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_mid_loop/35.png": {
   "m": [
    0.99772,
    -0.04249,
    -23.6,
    27.51
   ],
   "scale": 0.9986,
   "rot_deg": -2.44,
   "shift": [
    -4.8,
    9.1
   ],
   "inliers": 73,
   "residual_px": 1.05,
   "ref_residual_px": {
    "eyeL": 2.0,
    "eyeR": 1.0,
    "mouth": 2.0,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_mid_loop_35.png",
    "rect": [164, 231, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_mid_loop_35_u.png",
    "rect": [291, 387, 228, 110]
   },
   "yield_eye_px": 0,
   "yield_px": 58,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_mid_loop/36.png": {
   "m": [
    0.9977,
    -0.03192,
    -17.77,
    19.04
   ],
   "scale": 0.9982,
   "rot_deg": -1.83,
   "shift": [
    -3.9,
    4.9
   ],
   "inliers": 95,
   "residual_px": 1.17,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.4,
    "nose": 1.4,
    "pin": 1.4
   },
   "ok": true,
   "mask": {
    "file": "track/think_mid_loop_36.png",
    "rect": [165, 227, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_mid_loop_36_u.png",
    "rect": [292, 384, 230, 108]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_mid_loop/37.png": {
   "m": [
    0.99948,
    -0.02793,
    -15.75,
    13.06
   ],
   "scale": 0.9999,
   "rot_deg": -1.6,
   "shift": [
    -3.0,
    1.4
   ],
   "inliers": 136,
   "residual_px": 0.82,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_mid_loop_37.png",
    "rect": [166, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_mid_loop_37_u.png",
    "rect": [293, 380, 230, 108]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_mid_loop/38.png": {
   "m": [
    1.00177,
    -0.0236,
    -13.95,
    7.14
   ],
   "scale": 1.002,
   "rot_deg": -1.35,
   "shift": [
    -2.2,
    -1.7
   ],
   "inliers": 148,
   "residual_px": 0.67,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.4,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_mid_loop_38.png",
    "rect": [167, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_mid_loop_38_u.png",
    "rect": [294, 377, 230, 108]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_mid_loop/39.png": {
   "m": [
    1.00261,
    -0.01941,
    -11.79,
    3.97
   ],
   "scale": 1.0028,
   "rot_deg": -1.11,
   "shift": [
    -1.7,
    -2.7
   ],
   "inliers": 159,
   "residual_px": 0.68,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_mid_loop_39.png",
    "rect": [167, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_mid_loop_39_u.png",
    "rect": [294, 376, 231, 108]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 17,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_mid_loop/40.png": {
   "m": [
    1.00232,
    -0.01495,
    -9.0,
    2.59
   ],
   "scale": 1.0024,
   "rot_deg": -0.85,
   "shift": [
    -1.1,
    -2.4
   ],
   "inliers": 176,
   "residual_px": 0.75,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_mid_loop_40.png",
    "rect": [168, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_mid_loop_40_u.png",
    "rect": [295, 377, 231, 107]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_mid_loop/41.png": {
   "m": [
    1.00246,
    -0.01069,
    -6.76,
    1.49
   ],
   "scale": 1.0025,
   "rot_deg": -0.61,
   "shift": [
    -0.8,
    -1.7
   ],
   "inliers": 163,
   "residual_px": 0.59,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_mid_loop_41.png",
    "rect": [168, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_mid_loop_41_u.png",
    "rect": [295, 378, 231, 106]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_mid_loop/42.png": {
   "m": [
    1.00286,
    -0.00678,
    -4.92,
    0.48
   ],
   "scale": 1.0029,
   "rot_deg": -0.39,
   "shift": [
    -0.6,
    -1.0
   ],
   "inliers": 180,
   "residual_px": 0.56,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_mid_loop_42.png",
    "rect": [168, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_mid_loop_42_u.png",
    "rect": [296, 379, 231, 106]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_mid_loop/43.png": {
   "m": [
    1.00273,
    -0.00421,
    -3.49,
    -0.15
   ],
   "scale": 1.0027,
   "rot_deg": -0.24,
   "shift": [
    -0.4,
    -0.6
   ],
   "inliers": 180,
   "residual_px": 0.52,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_mid_loop_43.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_mid_loop_43_u.png",
    "rect": [296, 380, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_mid_loop/44.png": {
   "m": [
    1.00267,
    -0.00257,
    -2.55,
    -0.71
   ],
   "scale": 1.0027,
   "rot_deg": -0.15,
   "shift": [
    -0.3,
    -0.5
   ],
   "inliers": 187,
   "residual_px": 0.56,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_mid_loop_44.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_mid_loop_44_u.png",
    "rect": [296, 380, 231, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_mid_loop/45.png": {
   "m": [
    1.00265,
    -0.00182,
    -2.1,
    -0.99
   ],
   "scale": 1.0027,
   "rot_deg": -0.1,
   "shift": [
    -0.2,
    -0.5
   ],
   "inliers": 190,
   "residual_px": 0.53,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_mid_loop_45.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_mid_loop_45_u.png",
    "rect": [296, 380, 231, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_mid_loop/46.png": {
   "m": [
    1.00254,
    -0.00144,
    -1.83,
    -1.07
   ],
   "scale": 1.0025,
   "rot_deg": -0.08,
   "shift": [
    -0.1,
    -0.5
   ],
   "inliers": 194,
   "residual_px": 0.51,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_mid_loop_46.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_mid_loop_46_u.png",
    "rect": [297, 380, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_mid_loop/47.png": {
   "m": [
    1.00203,
    -0.00089,
    -1.32,
    -0.96
   ],
   "scale": 1.002,
   "rot_deg": -0.05,
   "shift": [
    -0.1,
    -0.4
   ],
   "inliers": 198,
   "residual_px": 0.52,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_mid_loop_47.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_mid_loop_47_u.png",
    "rect": [297, 380, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 11,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_mid_loop/48.png": {
   "m": [
    1.00056,
    -0.00022,
    -0.35,
    -0.28
   ],
   "scale": 1.0006,
   "rot_deg": -0.01,
   "shift": [
    -0.0,
    -0.1
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
   "mask": {
    "file": "track/think_mid_loop_48.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_mid_loop_48_u.png",
    "rect": [297, 381, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_d1_loop/00.png": {
   "m": [
    1.00052,
    -0.00015,
    -0.28,
    -0.3
   ],
   "scale": 1.0005,
   "rot_deg": -0.01,
   "shift": [
    0.0,
    -0.1
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
   "mask": {
    "file": "track/think_d1_loop_00.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_d1_loop_00_u.png",
    "rect": [297, 381, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_d1_loop/01.png": {
   "m": [
    1.00185,
    -0.00057,
    -1.0,
    -1.11
   ],
   "scale": 1.0019,
   "rot_deg": -0.03,
   "shift": [
    0.0,
    -0.5
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
   "mask": {
    "file": "track/think_d1_loop_01.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_d1_loop_01_u.png",
    "rect": [297, 380, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 13,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_d1_loop/02.png": {
   "m": [
    1.00225,
    -0.00063,
    -1.16,
    -1.44
   ],
   "scale": 1.0023,
   "rot_deg": -0.04,
   "shift": [
    0.1,
    -0.7
   ],
   "inliers": 198,
   "residual_px": 0.55,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_d1_loop_02.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_d1_loop_02_u.png",
    "rect": [297, 380, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 18,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_d1_loop/03.png": {
   "m": [
    1.00219,
    -0.00012,
    -0.79,
    -1.35
   ],
   "scale": 1.0022,
   "rot_deg": -0.01,
   "shift": [
    0.2,
    -0.4
   ],
   "inliers": 181,
   "residual_px": 0.54,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_d1_loop_03.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_d1_loop_03_u.png",
    "rect": [297, 380, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 18,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_d1_loop/04.png": {
   "m": [
    1.00135,
    0.00157,
    0.62,
    -0.32
   ],
   "scale": 1.0014,
   "rot_deg": 0.09,
   "shift": [
    0.4,
    1.0
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
   "mask": {
    "file": "track/think_d1_loop_04.png",
    "rect": [169, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_d1_loop_04_u.png",
    "rect": [297, 382, 231, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_d1_loop/05.png": {
   "m": [
    1.00006,
    0.00448,
    2.81,
    2.06
   ],
   "scale": 1.0001,
   "rot_deg": 0.26,
   "shift": [
    0.8,
    3.9
   ],
   "inliers": 116,
   "residual_px": 1.04,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_d1_loop_05.png",
    "rect": [170, 226, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_d1_loop_05_u.png",
    "rect": [298, 385, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 11,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_d1_loop/06.png": {
   "m": [
    1.00062,
    0.00441,
    2.95,
    5.98
   ],
   "scale": 1.0006,
   "rot_deg": 0.25,
   "shift": [
    1.1,
    8.1
   ],
   "inliers": 71,
   "residual_px": 0.94,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 2.0,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_d1_loop_06.png",
    "rect": [170, 230, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_d1_loop_06_u.png",
    "rect": [298, 389, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_d1_loop/07.png": {
   "m": [
    1.00167,
    0.0033,
    2.03,
    7.55
   ],
   "scale": 1.0017,
   "rot_deg": 0.19,
   "shift": [
    1.2,
    9.7
   ],
   "inliers": 61,
   "residual_px": 1.0,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 2.0,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_d1_loop_07.png",
    "rect": [170, 232, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_d1_loop_07_u.png",
    "rect": [298, 391, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_d1_loop/08.png": {
   "m": [
    1.00242,
    0.00092,
    0.09,
    6.9
   ],
   "scale": 1.0024,
   "rot_deg": 0.05,
   "shift": [
    0.6,
    8.4
   ],
   "inliers": 63,
   "residual_px": 0.99,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.4,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_d1_loop_08.png",
    "rect": [170, 230, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_d1_loop_08_u.png",
    "rect": [297, 389, 231, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 1,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_d1_loop/09.png": {
   "m": [
    1.00212,
    -0.00427,
    -3.35,
    5.62
   ],
   "scale": 1.0021,
   "rot_deg": -0.24,
   "shift": [
    -0.5,
    4.9
   ],
   "inliers": 71,
   "residual_px": 0.89,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 2.0,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_d1_loop_09.png",
    "rect": [169, 227, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_d1_loop_09_u.png",
    "rect": [296, 385, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_d1_loop/10.png": {
   "m": [
    1.00036,
    -0.01309,
    -8.44,
    5.42
   ],
   "scale": 1.0004,
   "rot_deg": -0.75,
   "shift": [
    -2.2,
    0.2
   ],
   "inliers": 133,
   "residual_px": 0.79,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 0.0,
    "nose": 1.0,
    "pin": 2.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_d1_loop_10.png",
    "rect": [167, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_d1_loop_10_u.png",
    "rect": [294, 380, 231, 106]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 15,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_d1_loop/11.png": {
   "m": [
    1.00065,
    -0.02259,
    -14.59,
    6.71
   ],
   "scale": 1.0009,
   "rot_deg": -1.29,
   "shift": [
    -3.8,
    -2.2
   ],
   "inliers": 146,
   "residual_px": 0.72,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_d1_loop_11.png",
    "rect": [165, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_d1_loop_11_u.png",
    "rect": [292, 377, 230, 107]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 15,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_d1_loop/12.png": {
   "m": [
    1.00172,
    -0.03181,
    -21.14,
    9.05
   ],
   "scale": 1.0022,
   "rot_deg": -1.82,
   "shift": [
    -5.6,
    -3.1
   ],
   "inliers": 131,
   "residual_px": 0.9,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.4
   },
   "ok": true,
   "mask": {
    "file": "track/think_d1_loop_12.png",
    "rect": [163, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_d1_loop_12_u.png",
    "rect": [290, 375, 230, 109]
   },
   "yield_eye_px": 0,
   "yield_px": 263,
   "cover_alien_px": 10,
   "occluded": 0.008,
   "w": 1.0
  },
  "frames/think_d1_loop/13.png": {
   "m": [
    1.0011,
    -0.03931,
    -25.47,
    13.03
   ],
   "scale": 1.0019,
   "rot_deg": -2.25,
   "shift": [
    -6.7,
    -2.5
   ],
   "inliers": 130,
   "residual_px": 0.91,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.4,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_d1_loop_13.png",
    "rect": [162, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_d1_loop_13_u.png",
    "rect": [288, 375, 231, 110]
   },
   "yield_eye_px": 0,
   "yield_px": 446,
   "cover_alien_px": 13,
   "occluded": 0.015,
   "w": 1.0
  },
  "frames/think_d1_loop/14.png": {
   "m": [
    1.00054,
    -0.04615,
    -29.04,
    18.12
   ],
   "scale": 1.0016,
   "rot_deg": -2.64,
   "shift": [
    -7.3,
    -0.5
   ],
   "inliers": 112,
   "residual_px": 0.85,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 3.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_d1_loop_14.png",
    "rect": [162, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_d1_loop_14_u.png",
    "rect": [287, 377, 231, 110]
   },
   "yield_eye_px": 0,
   "yield_px": 603,
   "cover_alien_px": 12,
   "occluded": 0.022,
   "w": 1.0
  },
  "frames/think_d1_loop/15.png": {
   "m": [
    1.00045,
    -0.04971,
    -31.04,
    21.63
   ],
   "scale": 1.0017,
   "rot_deg": -2.84,
   "shift": [
    -7.7,
    1.5
   ],
   "inliers": 116,
   "residual_px": 0.81,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "nose": 1.4,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_d1_loop_15.png",
    "rect": [161, 224, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_d1_loop_15_u.png",
    "rect": [287, 379, 230, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 624,
   "cover_alien_px": 13,
   "occluded": 0.023,
   "w": 1.0
  },
  "frames/think_d1_loop/16.png": {
   "m": [
    0.99734,
    -0.05068,
    -30.32,
    24.25
   ],
   "scale": 0.9986,
   "rot_deg": -2.91,
   "shift": [
    -7.8,
    2.3
   ],
   "inliers": 105,
   "residual_px": 1.0,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 4.0,
    "nose": 1.4,
    "pin": 1.4
   },
   "ok": true,
   "mask": {
    "file": "track/think_d1_loop_16.png",
    "rect": [161, 224, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_d1_loop_16_u.png",
    "rect": [287, 380, 230, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 624,
   "cover_alien_px": 2,
   "occluded": 0.023,
   "w": 1.0
  },
  "frames/think_d1_loop/17.png": {
   "m": [
    0.99645,
    -0.05103,
    -30.09,
    25.5
   ],
   "scale": 0.9978,
   "rot_deg": -2.93,
   "shift": [
    -7.8,
    3.0
   ],
   "inliers": 107,
   "residual_px": 0.97,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "nose": 1.4,
    "pin": 1.4
   },
   "ok": true,
   "mask": {
    "file": "track/think_d1_loop_17.png",
    "rect": [161, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_d1_loop_17_u.png",
    "rect": [287, 380, 230, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 626,
   "cover_alien_px": 2,
   "occluded": 0.023,
   "w": 1.0
  },
  "frames/think_d1_loop/18.png": {
   "m": [
    0.99982,
    -0.05152,
    -31.67,
    24.65
   ],
   "scale": 1.0011,
   "rot_deg": -2.95,
   "shift": [
    -7.8,
    3.5
   ],
   "inliers": 104,
   "residual_px": 0.8,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "nose": 1.4,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_d1_loop_18.png",
    "rect": [161, 226, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_d1_loop_18_u.png",
    "rect": [287, 380, 230, 112]
   },
   "yield_eye_px": 0,
   "yield_px": 658,
   "cover_alien_px": 6,
   "occluded": 0.024,
   "w": 1.0
  },
  "frames/think_d1_loop/19.png": {
   "m": [
    1.00044,
    -0.05176,
    -32.01,
    24.45
   ],
   "scale": 1.0018,
   "rot_deg": -2.96,
   "shift": [
    -7.7,
    3.5
   ],
   "inliers": 109,
   "residual_px": 0.84,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "nose": 1.4,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_d1_loop_19.png",
    "rect": [161, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_d1_loop_19_u.png",
    "rect": [287, 380, 230, 112]
   },
   "yield_eye_px": 0,
   "yield_px": 659,
   "cover_alien_px": 4,
   "occluded": 0.024,
   "w": 1.0
  },
  "frames/think_d1_loop/20.png": {
   "m": [
    0.99911,
    -0.0513,
    -31.24,
    24.67
   ],
   "scale": 1.0004,
   "rot_deg": -2.94,
   "shift": [
    -7.7,
    3.3
   ],
   "inliers": 106,
   "residual_px": 0.93,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "nose": 1.4,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_d1_loop_20.png",
    "rect": [161, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_d1_loop_20_u.png",
    "rect": [287, 380, 230, 112]
   },
   "yield_eye_px": 0,
   "yield_px": 643,
   "cover_alien_px": 5,
   "occluded": 0.024,
   "w": 1.0
  },
  "frames/think_d1_loop/21.png": {
   "m": [
    0.99772,
    -0.05092,
    -30.55,
    25.16
   ],
   "scale": 0.999,
   "rot_deg": -2.92,
   "shift": [
    -7.8,
    3.3
   ],
   "inliers": 115,
   "residual_px": 0.83,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "nose": 1.4,
    "pin": 1.4
   },
   "ok": true,
   "mask": {
    "file": "track/think_d1_loop_21.png",
    "rect": [161, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_d1_loop_21_u.png",
    "rect": [287, 380, 230, 112]
   },
   "yield_eye_px": 0,
   "yield_px": 639,
   "cover_alien_px": 3,
   "occluded": 0.024,
   "w": 1.0
  },
  "frames/think_d1_loop/22.png": {
   "m": [
    0.99715,
    -0.05045,
    -30.16,
    25.15
   ],
   "scale": 0.9984,
   "rot_deg": -2.9,
   "shift": [
    -7.8,
    3.2
   ],
   "inliers": 121,
   "residual_px": 0.95,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "nose": 1.4,
    "pin": 1.4
   },
   "ok": true,
   "mask": {
    "file": "track/think_d1_loop_22.png",
    "rect": [161, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_d1_loop_22_u.png",
    "rect": [287, 380, 230, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 631,
   "cover_alien_px": 3,
   "occluded": 0.024,
   "w": 1.0
  },
  "frames/think_d1_loop/23.png": {
   "m": [
    0.99909,
    -0.05092,
    -31.16,
    24.65
   ],
   "scale": 1.0004,
   "rot_deg": -2.92,
   "shift": [
    -7.8,
    3.4
   ],
   "inliers": 115,
   "residual_px": 0.81,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 5.1,
    "nose": 1.4,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_d1_loop_23.png",
    "rect": [161, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_d1_loop_23_u.png",
    "rect": [287, 380, 230, 112]
   },
   "yield_eye_px": 0,
   "yield_px": 652,
   "cover_alien_px": 3,
   "occluded": 0.024,
   "w": 1.0
  },
  "frames/think_d1_loop/24.png": {
   "m": [
    0.99915,
    -0.05139,
    -31.4,
    24.81
   ],
   "scale": 1.0005,
   "rot_deg": -2.94,
   "shift": [
    -7.8,
    3.4
   ],
   "inliers": 114,
   "residual_px": 0.87,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 5.1,
    "nose": 1.4,
    "pin": 1.4
   },
   "ok": true,
   "mask": {
    "file": "track/think_d1_loop_24.png",
    "rect": [161, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_d1_loop_24_u.png",
    "rect": [287, 380, 230, 112]
   },
   "yield_eye_px": 0,
   "yield_px": 651,
   "cover_alien_px": 1,
   "occluded": 0.024,
   "w": 1.0
  },
  "frames/think_d1_loop/25.png": {
   "m": [
    0.99956,
    -0.05142,
    -31.54,
    24.64
   ],
   "scale": 1.0009,
   "rot_deg": -2.95,
   "shift": [
    -7.8,
    3.4
   ],
   "inliers": 105,
   "residual_px": 0.83,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 5.1,
    "nose": 1.4,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_d1_loop_25.png",
    "rect": [161, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_d1_loop_25_u.png",
    "rect": [287, 380, 230, 112]
   },
   "yield_eye_px": 0,
   "yield_px": 654,
   "cover_alien_px": 4,
   "occluded": 0.024,
   "w": 1.0
  },
  "frames/think_d1_loop/26.png": {
   "m": [
    1.00027,
    -0.0503,
    -31.39,
    23.85
   ],
   "scale": 1.0015,
   "rot_deg": -2.88,
   "shift": [
    -7.9,
    3.4
   ],
   "inliers": 109,
   "residual_px": 0.83,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 5.1,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_d1_loop_26.png",
    "rect": [161, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_d1_loop_26_u.png",
    "rect": [287, 380, 230, 112]
   },
   "yield_eye_px": 0,
   "yield_px": 655,
   "cover_alien_px": 4,
   "occluded": 0.024,
   "w": 1.0
  },
  "frames/think_d1_loop/27.png": {
   "m": [
    0.99969,
    -0.05057,
    -31.34,
    24.05
   ],
   "scale": 1.001,
   "rot_deg": -2.9,
   "shift": [
    -7.9,
    3.2
   ],
   "inliers": 119,
   "residual_px": 0.86,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 5.1,
    "nose": 1.4,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_d1_loop_27.png",
    "rect": [161, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_d1_loop_27_u.png",
    "rect": [287, 380, 230, 112]
   },
   "yield_eye_px": 0,
   "yield_px": 652,
   "cover_alien_px": 4,
   "occluded": 0.025,
   "w": 1.0
  },
  "frames/think_d1_loop/28.png": {
   "m": [
    0.99798,
    -0.05234,
    -31.52,
    25.07
   ],
   "scale": 0.9994,
   "rot_deg": -3.0,
   "shift": [
    -8.0,
    2.7
   ],
   "inliers": 121,
   "residual_px": 0.93,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "nose": 1.4,
    "pin": 1.4
   },
   "ok": true,
   "mask": {
    "file": "track/think_d1_loop_28.png",
    "rect": [161, 225, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_d1_loop_28_u.png",
    "rect": [287, 380, 230, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 646,
   "cover_alien_px": 3,
   "occluded": 0.024,
   "w": 1.0
  },
  "frames/think_d1_loop/29.png": {
   "m": [
    0.99754,
    -0.05601,
    -33.3,
    26.05
   ],
   "scale": 0.9991,
   "rot_deg": -3.21,
   "shift": [
    -8.2,
    2.0
   ],
   "inliers": 125,
   "residual_px": 0.91,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "nose": 1.0,
    "pin": 1.4
   },
   "ok": true,
   "mask": {
    "file": "track/think_d1_loop_29.png",
    "rect": [161, 224, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_d1_loop_29_u.png",
    "rect": [286, 379, 231, 112]
   },
   "yield_eye_px": 0,
   "yield_px": 691,
   "cover_alien_px": 2,
   "occluded": 0.026,
   "w": 1.0
  },
  "frames/think_d1_loop/30.png": {
   "m": [
    0.99783,
    -0.05976,
    -35.53,
    27.18
   ],
   "scale": 0.9996,
   "rot_deg": -3.43,
   "shift": [
    -8.6,
    1.7
   ],
   "inliers": 115,
   "residual_px": 0.99,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 6.3,
    "nose": 1.0,
    "pin": 1.4
   },
   "ok": true,
   "mask": {
    "file": "track/think_d1_loop_30.png",
    "rect": [160, 224, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_d1_loop_30_u.png",
    "rect": [286, 378, 230, 113]
   },
   "yield_eye_px": 0,
   "yield_px": 693,
   "cover_alien_px": 8,
   "occluded": 0.026,
   "w": 1.0
  },
  "frames/think_d1_loop/31.png": {
   "m": [
    0.99756,
    -0.06298,
    -36.92,
    29.17
   ],
   "scale": 0.9995,
   "rot_deg": -3.61,
   "shift": [
    -8.6,
    2.3
   ],
   "inliers": 99,
   "residual_px": 0.88,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_d1_loop_31.png",
    "rect": [160, 224, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_d1_loop_31_u.png",
    "rect": [286, 378, 230, 113]
   },
   "yield_eye_px": 0,
   "yield_px": 233,
   "cover_alien_px": 8,
   "occluded": 0.007,
   "w": 1.0
  },
  "frames/think_d1_loop/32.png": {
   "m": [
    1.00109,
    -0.06427,
    -38.67,
    29.95
   ],
   "scale": 1.0032,
   "rot_deg": -3.67,
   "shift": [
    -8.3,
    4.2
   ],
   "inliers": 102,
   "residual_px": 1.01,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_d1_loop_32.png",
    "rect": [161, 226, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_d1_loop_32_u.png",
    "rect": [286, 380, 230, 113]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 12,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_d1_loop/33.png": {
   "m": [
    1.00202,
    -0.06156,
    -36.59,
    30.88
   ],
   "scale": 1.0039,
   "rot_deg": -3.52,
   "shift": [
    -7.1,
    6.7
   ],
   "inliers": 84,
   "residual_px": 0.91,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 1.0,
    "mouth": 0.0,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_d1_loop_33.png",
    "rect": [162, 229, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_d1_loop_33_u.png",
    "rect": [287, 383, 231, 113]
   },
   "yield_eye_px": 0,
   "yield_px": 7,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_d1_loop/34.png": {
   "m": [
    0.99951,
    -0.05258,
    -29.47,
    30.79
   ],
   "scale": 1.0009,
   "rot_deg": -3.01,
   "shift": [
    -5.2,
    9.1
   ],
   "inliers": 78,
   "residual_px": 1.02,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 2.2,
    "nose": 1.4,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_d1_loop_34.png",
    "rect": [164, 231, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_d1_loop_34_u.png",
    "rect": [289, 386, 231, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_d1_loop/35.png": {
   "m": [
    0.99964,
    -0.04311,
    -23.49,
    26.54
   ],
   "scale": 1.0006,
   "rot_deg": -2.47,
   "shift": [
    -3.6,
    8.8
   ],
   "inliers": 76,
   "residual_px": 1.05,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 2.0,
    "nose": 2.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_d1_loop_35.png",
    "rect": [165, 231, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_d1_loop_35_u.png",
    "rect": [291, 386, 231, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_d1_loop/36.png": {
   "m": [
    1.00165,
    -0.03289,
    -18.23,
    17.77
   ],
   "scale": 1.0022,
   "rot_deg": -1.88,
   "shift": [
    -2.3,
    5.1
   ],
   "inliers": 93,
   "residual_px": 0.82,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_d1_loop_36.png",
    "rect": [167, 227, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_d1_loop_36_u.png",
    "rect": [293, 383, 231, 109]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_d1_loop/37.png": {
   "m": [
    1.00208,
    -0.02361,
    -13.24,
    9.45
   ],
   "scale": 1.0024,
   "rot_deg": -1.35,
   "shift": [
    -1.4,
    0.8
   ],
   "inliers": 121,
   "residual_px": 0.75,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_d1_loop_37.png",
    "rect": [168, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_d1_loop_37_u.png",
    "rect": [294, 380, 231, 107]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_d1_loop/38.png": {
   "m": [
    1.00281,
    -0.01365,
    -8.58,
    1.31
   ],
   "scale": 1.0029,
   "rot_deg": -0.78,
   "shift": [
    -1.1,
    -3.0
   ],
   "inliers": 141,
   "residual_px": 0.64,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_d1_loop_38.png",
    "rect": [168, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_d1_loop_38_u.png",
    "rect": [295, 377, 231, 106]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 12,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_d1_loop/39.png": {
   "m": [
    1.00268,
    -0.00897,
    -6.05,
    -1.6
   ],
   "scale": 1.0027,
   "rot_deg": -0.51,
   "shift": [
    -0.8,
    -4.0
   ],
   "inliers": 159,
   "residual_px": 0.67,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_d1_loop_39.png",
    "rect": [168, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_d1_loop_39_u.png",
    "rect": [296, 376, 230, 106]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 12,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_d1_loop/40.png": {
   "m": [
    1.0024,
    -0.00591,
    -4.23,
    -2.03
   ],
   "scale": 1.0024,
   "rot_deg": -0.34,
   "shift": [
    -0.5,
    -3.3
   ],
   "inliers": 161,
   "residual_px": 0.66,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_d1_loop_40.png",
    "rect": [168, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_d1_loop_40_u.png",
    "rect": [296, 377, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_d1_loop/41.png": {
   "m": [
    1.00249,
    -0.00375,
    -3.16,
    -1.75
   ],
   "scale": 1.0025,
   "rot_deg": -0.21,
   "shift": [
    -0.4,
    -2.1
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
   "mask": {
    "file": "track/think_d1_loop_41.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_d1_loop_41_u.png",
    "rect": [296, 378, 231, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 15,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_d1_loop/42.png": {
   "m": [
    1.00263,
    -0.00221,
    -2.46,
    -1.36
   ],
   "scale": 1.0026,
   "rot_deg": -0.13,
   "shift": [
    -0.4,
    -1.0
   ],
   "inliers": 183,
   "residual_px": 0.51,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/think_d1_loop_42.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_d1_loop_42_u.png",
    "rect": [296, 380, 231, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_d1_loop/43.png": {
   "m": [
    1.00257,
    -0.00137,
    -1.96,
    -1.24
   ],
   "scale": 1.0026,
   "rot_deg": -0.08,
   "shift": [
    -0.3,
    -0.6
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
   "mask": {
    "file": "track/think_d1_loop_43.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_d1_loop_43_u.png",
    "rect": [296, 380, 231, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_d1_loop/44.png": {
   "m": [
    1.00241,
    -0.00109,
    -1.67,
    -1.18
   ],
   "scale": 1.0024,
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
   "mask": {
    "file": "track/think_d1_loop_44.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_d1_loop_44_u.png",
    "rect": [297, 380, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_d1_loop/45.png": {
   "m": [
    1.00245,
    -0.00083,
    -1.54,
    -1.31
   ],
   "scale": 1.0025,
   "rot_deg": -0.05,
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
   "mask": {
    "file": "track/think_d1_loop_45.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_d1_loop_45_u.png",
    "rect": [297, 380, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_d1_loop/46.png": {
   "m": [
    1.00243,
    -0.00073,
    -1.47,
    -1.33
   ],
   "scale": 1.0024,
   "rot_deg": -0.04,
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
   "mask": {
    "file": "track/think_d1_loop_46.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_d1_loop_46_u.png",
    "rect": [297, 380, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 12,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_d1_loop/47.png": {
   "m": [
    1.00199,
    -0.00055,
    -1.17,
    -1.11
   ],
   "scale": 1.002,
   "rot_deg": -0.03,
   "shift": [
    -0.1,
    -0.4
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
   "mask": {
    "file": "track/think_d1_loop_47.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_d1_loop_47_u.png",
    "rect": [297, 380, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/think_d1_loop/48.png": {
   "m": [
    1.00055,
    -0.00015,
    -0.32,
    -0.31
   ],
   "scale": 1.0006,
   "rot_deg": -0.01,
   "shift": [
    -0.0,
    -0.1
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
   "mask": {
    "file": "track/think_d1_loop_48.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/think_d1_loop_48_u.png",
    "rect": [297, 381, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_loop/00.png": {
   "m": [
    1.00056,
    0.00158,
    0.5,
    -1.05
   ],
   "scale": 1.0006,
   "rot_deg": 0.09,
   "shift": [
    -0.0,
    -0.1
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
   "mask": {
    "file": "track/wave_loop_00.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_loop_00_u.png",
    "rect": [297, 381, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_loop/01.png": {
   "m": [
    1.00192,
    0.00827,
    3.07,
    -4.85
   ],
   "scale": 1.002,
   "rot_deg": 0.47,
   "shift": [
    0.0,
    -0.6
   ],
   "inliers": 190,
   "residual_px": 0.5,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_loop_01.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_loop_01_u.png",
    "rect": [297, 381, 230, 103]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_loop/02.png": {
   "m": [
    1.00202,
    0.01913,
    8.14,
    -9.64
   ],
   "scale": 1.0022,
   "rot_deg": 1.09,
   "shift": [
    0.1,
    -0.9
   ],
   "inliers": 161,
   "residual_px": 0.57,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_loop_02.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_loop_02_u.png",
    "rect": [298, 380, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_loop/03.png": {
   "m": [
    1.00179,
    0.02966,
    13.19,
    -13.95
   ],
   "scale": 1.0022,
   "rot_deg": 1.7,
   "shift": [
    0.1,
    -1.0
   ],
   "inliers": 160,
   "residual_px": 0.58,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_loop_03.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_loop_03_u.png",
    "rect": [298, 379, 230, 106]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_loop/04.png": {
   "m": [
    1.00156,
    0.0424,
    19.28,
    -19.14
   ],
   "scale": 1.0025,
   "rot_deg": 2.42,
   "shift": [
    0.2,
    -1.1
   ],
   "inliers": 141,
   "residual_px": 0.62,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_loop_04.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_loop_04_u.png",
    "rect": [299, 378, 230, 108]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 10,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_loop/05.png": {
   "m": [
    1.00072,
    0.05516,
    25.44,
    -24.13
   ],
   "scale": 1.0022,
   "rot_deg": 3.15,
   "shift": [
    0.1,
    -1.3
   ],
   "inliers": 138,
   "residual_px": 0.6,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_loop_05.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_loop_05_u.png",
    "rect": [299, 377, 230, 110]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 10,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_loop/06.png": {
   "m": [
    0.99975,
    0.06768,
    31.59,
    -28.96
   ],
   "scale": 1.002,
   "rot_deg": 3.87,
   "shift": [
    -0.0,
    -1.4
   ],
   "inliers": 129,
   "residual_px": 0.56,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_loop_06.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_loop_06_u.png",
    "rect": [300, 376, 229, 112]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 15,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_loop/07.png": {
   "m": [
    0.99906,
    0.077,
    36.16,
    -32.5
   ],
   "scale": 1.002,
   "rot_deg": 4.41,
   "shift": [
    -0.1,
    -1.5
   ],
   "inliers": 132,
   "residual_px": 0.59,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_loop_07.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_loop_07_u.png",
    "rect": [300, 375, 229, 113]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_loop/08.png": {
   "m": [
    0.99836,
    0.08462,
    39.99,
    -35.33
   ],
   "scale": 1.0019,
   "rot_deg": 4.84,
   "shift": [
    -0.1,
    -1.5
   ],
   "inliers": 127,
   "residual_px": 0.59,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_loop_08.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_loop_08_u.png",
    "rect": [300, 374, 229, 115]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 10,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_loop/09.png": {
   "m": [
    0.99761,
    0.08934,
    42.54,
    -36.91
   ],
   "scale": 1.0016,
   "rot_deg": 5.12,
   "shift": [
    -0.0,
    -1.5
   ],
   "inliers": 133,
   "residual_px": 0.61,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_loop_09.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_loop_09_u.png",
    "rect": [301, 374, 229, 115]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_loop/10.png": {
   "m": [
    0.99719,
    0.09261,
    44.22,
    -38.08
   ],
   "scale": 1.0015,
   "rot_deg": 5.31,
   "shift": [
    -0.0,
    -1.5
   ],
   "inliers": 128,
   "residual_px": 0.57,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_loop_10.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_loop_10_u.png",
    "rect": [301, 374, 228, 115]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_loop/11.png": {
   "m": [
    0.99699,
    0.09452,
    45.18,
    -38.78
   ],
   "scale": 1.0015,
   "rot_deg": 5.42,
   "shift": [
    -0.0,
    -1.6
   ],
   "inliers": 127,
   "residual_px": 0.59,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_loop_11.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_loop_11_u.png",
    "rect": [301, 374, 229, 116]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_loop/12.png": {
   "m": [
    0.99693,
    0.09515,
    45.48,
    -39.01
   ],
   "scale": 1.0015,
   "rot_deg": 5.45,
   "shift": [
    -0.0,
    -1.6
   ],
   "inliers": 130,
   "residual_px": 0.6,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_loop_12.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_loop_12_u.png",
    "rect": [301, 374, 229, 116]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_loop/13.png": {
   "m": [
    0.99699,
    0.09587,
    45.77,
    -39.32
   ],
   "scale": 1.0016,
   "rot_deg": 5.49,
   "shift": [
    -0.1,
    -1.5
   ],
   "inliers": 129,
   "residual_px": 0.55,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_loop_13.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_loop_13_u.png",
    "rect": [301, 374, 229, 116]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_loop/14.png": {
   "m": [
    0.99703,
    0.09615,
    45.88,
    -39.43
   ],
   "scale": 1.0017,
   "rot_deg": 5.51,
   "shift": [
    -0.1,
    -1.5
   ],
   "inliers": 132,
   "residual_px": 0.55,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_loop_14.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_loop_14_u.png",
    "rect": [301, 374, 229, 116]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_loop/15.png": {
   "m": [
    0.99704,
    0.09601,
    45.8,
    -39.37
   ],
   "scale": 1.0016,
   "rot_deg": 5.5,
   "shift": [
    -0.1,
    -1.5
   ],
   "inliers": 126,
   "residual_px": 0.61,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_loop_15.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_loop_15_u.png",
    "rect": [301, 374, 229, 116]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_loop/16.png": {
   "m": [
    0.99702,
    0.09631,
    45.93,
    -39.5
   ],
   "scale": 1.0017,
   "rot_deg": 5.52,
   "shift": [
    -0.1,
    -1.5
   ],
   "inliers": 123,
   "residual_px": 0.58,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_loop_16.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_loop_16_u.png",
    "rect": [301, 374, 229, 116]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_loop/17.png": {
   "m": [
    0.99702,
    0.09625,
    45.9,
    -39.47
   ],
   "scale": 1.0017,
   "rot_deg": 5.51,
   "shift": [
    -0.1,
    -1.5
   ],
   "inliers": 121,
   "residual_px": 0.53,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_loop_17.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_loop_17_u.png",
    "rect": [301, 374, 229, 116]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_loop/18.png": {
   "m": [
    0.99714,
    0.09568,
    45.61,
    -39.27
   ],
   "scale": 1.0017,
   "rot_deg": 5.48,
   "shift": [
    -0.1,
    -1.5
   ],
   "inliers": 126,
   "residual_px": 0.58,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_loop_18.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_loop_18_u.png",
    "rect": [301, 374, 229, 116]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_loop/19.png": {
   "m": [
    0.99715,
    0.09543,
    45.53,
    -39.14
   ],
   "scale": 1.0017,
   "rot_deg": 5.47,
   "shift": [
    -0.0,
    -1.5
   ],
   "inliers": 123,
   "residual_px": 0.6,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_loop_19.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_loop_19_u.png",
    "rect": [301, 374, 229, 116]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_loop/20.png": {
   "m": [
    0.99687,
    0.09607,
    45.92,
    -39.33
   ],
   "scale": 1.0015,
   "rot_deg": 5.5,
   "shift": [
    -0.1,
    -1.5
   ],
   "inliers": 129,
   "residual_px": 0.56,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_loop_20.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_loop_20_u.png",
    "rect": [301, 374, 229, 116]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_loop/21.png": {
   "m": [
    0.99678,
    0.0962,
    46.0,
    -39.39
   ],
   "scale": 1.0014,
   "rot_deg": 5.51,
   "shift": [
    -0.1,
    -1.6
   ],
   "inliers": 134,
   "residual_px": 0.61,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 1.4,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_loop_21.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_loop_21_u.png",
    "rect": [301, 374, 229, 116]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_loop/22.png": {
   "m": [
    0.99669,
    0.09655,
    46.18,
    -39.5
   ],
   "scale": 1.0014,
   "rot_deg": 5.53,
   "shift": [
    -0.1,
    -1.6
   ],
   "inliers": 132,
   "residual_px": 0.57,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 1.4,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_loop_22.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_loop_22_u.png",
    "rect": [301, 374, 229, 116]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_loop/23.png": {
   "m": [
    0.99677,
    0.09628,
    46.05,
    -39.38
   ],
   "scale": 1.0014,
   "rot_deg": 5.52,
   "shift": [
    -0.1,
    -1.5
   ],
   "inliers": 132,
   "residual_px": 0.55,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_loop_23.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_loop_23_u.png",
    "rect": [301, 374, 229, 116]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_loop/24.png": {
   "m": [
    0.99696,
    0.09574,
    45.74,
    -39.22
   ],
   "scale": 1.0015,
   "rot_deg": 5.49,
   "shift": [
    -0.1,
    -1.5
   ],
   "inliers": 135,
   "residual_px": 0.58,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_loop_24.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_loop_24_u.png",
    "rect": [301, 374, 229, 116]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_loop/25.png": {
   "m": [
    0.9969,
    0.09562,
    45.72,
    -39.17
   ],
   "scale": 1.0015,
   "rot_deg": 5.48,
   "shift": [
    -0.0,
    -1.5
   ],
   "inliers": 132,
   "residual_px": 0.6,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_loop_25.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_loop_25_u.png",
    "rect": [301, 374, 229, 116]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 10,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_loop/26.png": {
   "m": [
    0.99674,
    0.09582,
    45.86,
    -39.21
   ],
   "scale": 1.0013,
   "rot_deg": 5.49,
   "shift": [
    -0.1,
    -1.6
   ],
   "inliers": 126,
   "residual_px": 0.55,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 1.4,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_loop_26.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_loop_26_u.png",
    "rect": [301, 374, 229, 116]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_loop/27.png": {
   "m": [
    0.99682,
    0.09601,
    45.91,
    -39.33
   ],
   "scale": 1.0014,
   "rot_deg": 5.5,
   "shift": [
    -0.1,
    -1.6
   ],
   "inliers": 131,
   "residual_px": 0.59,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 1.4,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_loop_27.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_loop_27_u.png",
    "rect": [301, 374, 229, 116]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_loop/28.png": {
   "m": [
    0.99677,
    0.0964,
    46.11,
    -39.47
   ],
   "scale": 1.0014,
   "rot_deg": 5.52,
   "shift": [
    -0.1,
    -1.6
   ],
   "inliers": 131,
   "residual_px": 0.54,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 1.4,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_loop_28.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_loop_28_u.png",
    "rect": [301, 374, 229, 116]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_loop/29.png": {
   "m": [
    0.99683,
    0.09606,
    45.94,
    -39.37
   ],
   "scale": 1.0015,
   "rot_deg": 5.5,
   "shift": [
    -0.0,
    -1.6
   ],
   "inliers": 130,
   "residual_px": 0.54,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 1.4,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_loop_29.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_loop_29_u.png",
    "rect": [301, 374, 229, 116]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_loop/30.png": {
   "m": [
    0.99685,
    0.09468,
    45.29,
    -38.83
   ],
   "scale": 1.0013,
   "rot_deg": 5.43,
   "shift": [
    -0.1,
    -1.6
   ],
   "inliers": 133,
   "residual_px": 0.59,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 1.4,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_loop_30.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_loop_30_u.png",
    "rect": [301, 374, 229, 116]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_loop/31.png": {
   "m": [
    0.99687,
    0.09143,
    43.73,
    -37.51
   ],
   "scale": 1.0011,
   "rot_deg": 5.24,
   "shift": [
    -0.1,
    -1.6
   ],
   "inliers": 139,
   "residual_px": 0.57,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 1.4,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_loop_31.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_loop_31_u.png",
    "rect": [301, 374, 229, 115]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_loop/32.png": {
   "m": [
    0.99762,
    0.0853,
    40.53,
    -35.29
   ],
   "scale": 1.0013,
   "rot_deg": 4.89,
   "shift": [
    -0.1,
    -1.5
   ],
   "inliers": 129,
   "residual_px": 0.63,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 1.4,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_loop_32.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_loop_32_u.png",
    "rect": [300, 374, 229, 115]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 12,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_loop/33.png": {
   "m": [
    0.99852,
    0.07742,
    36.55,
    -32.37
   ],
   "scale": 1.0015,
   "rot_deg": 4.43,
   "shift": [
    -0.1,
    -1.4
   ],
   "inliers": 128,
   "residual_px": 0.57,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_loop_33.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_loop_33_u.png",
    "rect": [300, 375, 229, 113]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_loop/34.png": {
   "m": [
    0.99932,
    0.06761,
    31.72,
    -28.63
   ],
   "scale": 1.0016,
   "rot_deg": 3.87,
   "shift": [
    -0.0,
    -1.3
   ],
   "inliers": 139,
   "residual_px": 0.58,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_loop_34.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_loop_34_u.png",
    "rect": [300, 376, 229, 112]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 12,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_loop/35.png": {
   "m": [
    0.99978,
    0.05903,
    27.62,
    -25.27
   ],
   "scale": 1.0015,
   "rot_deg": 3.38,
   "shift": [
    0.1,
    -1.2
   ],
   "inliers": 141,
   "residual_px": 0.56,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_loop_35.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_loop_35_u.png",
    "rect": [299, 376, 230, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_loop/36.png": {
   "m": [
    1.0004,
    0.04898,
    22.79,
    -21.33
   ],
   "scale": 1.0016,
   "rot_deg": 2.8,
   "shift": [
    0.2,
    -1.1
   ],
   "inliers": 140,
   "residual_px": 0.66,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_loop_36.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_loop_36_u.png",
    "rect": [299, 377, 229, 110]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_loop/37.png": {
   "m": [
    1.00093,
    0.04117,
    18.93,
    -18.29
   ],
   "scale": 1.0018,
   "rot_deg": 2.36,
   "shift": [
    0.1,
    -1.0
   ],
   "inliers": 143,
   "residual_px": 0.57,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_loop_37.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_loop_37_u.png",
    "rect": [299, 378, 229, 108]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_loop/38.png": {
   "m": [
    1.00142,
    0.03227,
    14.68,
    -14.76
   ],
   "scale": 1.0019,
   "rot_deg": 1.85,
   "shift": [
    0.2,
    -0.9
   ],
   "inliers": 162,
   "residual_px": 0.69,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_loop_38.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_loop_38_u.png",
    "rect": [298, 379, 230, 107]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 16,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_loop/39.png": {
   "m": [
    1.00185,
    0.02542,
    11.29,
    -12.04
   ],
   "scale": 1.0022,
   "rot_deg": 1.45,
   "shift": [
    0.2,
    -0.8
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
   "mask": {
    "file": "track/wave_loop_39.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_loop_39_u.png",
    "rect": [298, 379, 230, 106]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 10,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_loop/40.png": {
   "m": [
    1.00209,
    0.01903,
    8.17,
    -9.49
   ],
   "scale": 1.0023,
   "rot_deg": 1.09,
   "shift": [
    0.2,
    -0.7
   ],
   "inliers": 168,
   "residual_px": 0.64,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_loop_40.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_loop_40_u.png",
    "rect": [298, 380, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_loop/41.png": {
   "m": [
    1.0024,
    0.01436,
    5.84,
    -7.72
   ],
   "scale": 1.0025,
   "rot_deg": 0.82,
   "shift": [
    0.1,
    -0.7
   ],
   "inliers": 185,
   "residual_px": 0.63,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_loop_41.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_loop_41_u.png",
    "rect": [297, 380, 231, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_loop/42.png": {
   "m": [
    1.00243,
    0.01017,
    3.83,
    -6.0
   ],
   "scale": 1.0025,
   "rot_deg": 0.58,
   "shift": [
    0.1,
    -0.7
   ],
   "inliers": 197,
   "residual_px": 0.57,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_loop_42.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_loop_42_u.png",
    "rect": [297, 380, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_loop/43.png": {
   "m": [
    1.00253,
    0.00705,
    2.29,
    -4.72
   ],
   "scale": 1.0026,
   "rot_deg": 0.4,
   "shift": [
    0.0,
    -0.7
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
   "mask": {
    "file": "track/wave_loop_43.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_loop_43_u.png",
    "rect": [297, 380, 231, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 11,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_loop/44.png": {
   "m": [
    1.00267,
    0.00456,
    1.02,
    -3.72
   ],
   "scale": 1.0027,
   "rot_deg": 0.26,
   "shift": [
    -0.0,
    -0.6
   ],
   "inliers": 204,
   "residual_px": 0.54,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_loop_44.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_loop_44_u.png",
    "rect": [297, 380, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 15,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_loop/45.png": {
   "m": [
    1.00267,
    0.00244,
    -0.01,
    -2.8
   ],
   "scale": 1.0027,
   "rot_deg": 0.14,
   "shift": [
    -0.1,
    -0.6
   ],
   "inliers": 193,
   "residual_px": 0.49,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_loop_45.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_loop_45_u.png",
    "rect": [297, 380, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_loop/46.png": {
   "m": [
    1.00273,
    0.00124,
    -0.58,
    -2.33
   ],
   "scale": 1.0027,
   "rot_deg": 0.07,
   "shift": [
    -0.0,
    -0.6
   ],
   "inliers": 213,
   "residual_px": 0.52,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_loop_46.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_loop_46_u.png",
    "rect": [297, 380, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 12,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_loop/47.png": {
   "m": [
    1.00222,
    0.00056,
    -0.69,
    -1.69
   ],
   "scale": 1.0022,
   "rot_deg": 0.03,
   "shift": [
    -0.0,
    -0.4
   ],
   "inliers": 201,
   "residual_px": 0.52,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_loop_47.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_loop_47_u.png",
    "rect": [297, 380, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 10,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_loop/48.png": {
   "m": [
    1.00061,
    0.00012,
    -0.21,
    -0.45
   ],
   "scale": 1.0006,
   "rot_deg": 0.01,
   "shift": [
    -0.0,
    -0.1
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
   "mask": {
    "file": "track/wave_loop_48.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_loop_48_u.png",
    "rect": [297, 381, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_f1_loop/00.png": {
   "m": [
    1.00058,
    -0.00051,
    -0.51,
    -0.18
   ],
   "scale": 1.0006,
   "rot_deg": -0.03,
   "shift": [
    -0.0,
    -0.1
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
   "mask": {
    "file": "track/wave_f1_loop_00.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_f1_loop_00_u.png",
    "rect": [297, 381, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_f1_loop/01.png": {
   "m": [
    1.00217,
    -0.00247,
    -2.24,
    -0.43
   ],
   "scale": 1.0022,
   "rot_deg": -0.14,
   "shift": [
    -0.2,
    -0.4
   ],
   "inliers": 202,
   "residual_px": 0.53,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_f1_loop_01.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_f1_loop_01_u.png",
    "rect": [296, 380, 231, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 20,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_f1_loop/02.png": {
   "m": [
    1.00282,
    -0.00545,
    -4.27,
    0.32
   ],
   "scale": 1.0028,
   "rot_deg": -0.31,
   "shift": [
    -0.6,
    -0.6
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
   "mask": {
    "file": "track/wave_f1_loop_02.png",
    "rect": [168, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_f1_loop_02_u.png",
    "rect": [296, 380, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 25,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_f1_loop/03.png": {
   "m": [
    1.00275,
    -0.00932,
    -6.63,
    1.89
   ],
   "scale": 1.0028,
   "rot_deg": -0.53,
   "shift": [
    -1.2,
    -0.6
   ],
   "inliers": 171,
   "residual_px": 0.57,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_f1_loop_03.png",
    "rect": [168, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_f1_loop_03_u.png",
    "rect": [295, 379, 231, 106]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 32,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_f1_loop/04.png": {
   "m": [
    1.0026,
    -0.0141,
    -9.49,
    3.91
   ],
   "scale": 1.0027,
   "rot_deg": -0.81,
   "shift": [
    -1.9,
    -0.6
   ],
   "inliers": 164,
   "residual_px": 0.57,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_f1_loop_04.png",
    "rect": [167, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_f1_loop_04_u.png",
    "rect": [294, 379, 230, 106]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 24,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_f1_loop/05.png": {
   "m": [
    1.00254,
    -0.01804,
    -11.79,
    5.56
   ],
   "scale": 1.0027,
   "rot_deg": -1.03,
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
   "mask": {
    "file": "track/wave_f1_loop_05.png",
    "rect": [167, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_f1_loop_05_u.png",
    "rect": [294, 379, 230, 107]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 33,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_f1_loop/06.png": {
   "m": [
    1.00247,
    -0.02351,
    -15.04,
    7.87
   ],
   "scale": 1.0027,
   "rot_deg": -1.34,
   "shift": [
    -3.1,
    -0.6
   ],
   "inliers": 159,
   "residual_px": 0.59,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_f1_loop_06.png",
    "rect": [166, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_f1_loop_06_u.png",
    "rect": [293, 378, 229, 108]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 17,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_f1_loop/07.png": {
   "m": [
    1.00229,
    -0.02909,
    -18.33,
    10.29
   ],
   "scale": 1.0027,
   "rot_deg": -1.66,
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
   "mask": {
    "file": "track/wave_f1_loop_07.png",
    "rect": [165, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_f1_loop_07_u.png",
    "rect": [292, 378, 230, 108]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 27,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_f1_loop/08.png": {
   "m": [
    1.00194,
    -0.03315,
    -20.64,
    12.14
   ],
   "scale": 1.0025,
   "rot_deg": -1.9,
   "shift": [
    -4.4,
    -0.5
   ],
   "inliers": 149,
   "residual_px": 0.64,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_f1_loop_08.png",
    "rect": [165, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_f1_loop_08_u.png",
    "rect": [291, 378, 230, 109]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 19,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_f1_loop/09.png": {
   "m": [
    1.00162,
    -0.03572,
    -22.02,
    13.33
   ],
   "scale": 1.0023,
   "rot_deg": -2.04,
   "shift": [
    -4.7,
    -0.5
   ],
   "inliers": 130,
   "residual_px": 0.57,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_f1_loop_09.png",
    "rect": [164, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_f1_loop_09_u.png",
    "rect": [290, 378, 231, 109]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 28,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_f1_loop/10.png": {
   "m": [
    1.00196,
    -0.03903,
    -24.13,
    14.6
   ],
   "scale": 1.0027,
   "rot_deg": -2.23,
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
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_f1_loop_10.png",
    "rect": [164, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_f1_loop_10_u.png",
    "rect": [290, 377, 230, 110]
   },
   "yield_eye_px": 0,
   "yield_px": 31,
   "cover_alien_px": 23,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_f1_loop/11.png": {
   "m": [
    1.00192,
    -0.04181,
    -25.88,
    15.79
   ],
   "scale": 1.0028,
   "rot_deg": -2.39,
   "shift": [
    -5.6,
    -0.4
   ],
   "inliers": 132,
   "residual_px": 0.6,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_f1_loop_11.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_f1_loop_11_u.png",
    "rect": [289, 377, 231, 110]
   },
   "yield_eye_px": 6,
   "yield_px": 139,
   "cover_alien_px": 18,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_f1_loop/12.png": {
   "m": [
    1.00164,
    -0.04413,
    -27.19,
    16.9
   ],
   "scale": 1.0026,
   "rot_deg": -2.52,
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
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_f1_loop_12.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_f1_loop_12_u.png",
    "rect": [289, 377, 230, 110]
   },
   "yield_eye_px": 98,
   "yield_px": 311,
   "cover_alien_px": 9,
   "occluded": 0.006,
   "w": 1.0
  },
  "frames/wave_f1_loop/13.png": {
   "m": [
    1.00182,
    -0.04648,
    -28.49,
    17.79
   ],
   "scale": 1.0029,
   "rot_deg": -2.66,
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
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_f1_loop_13.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_f1_loop_13_u.png",
    "rect": [289, 377, 230, 111]
   },
   "yield_eye_px": 74,
   "yield_px": 281,
   "cover_alien_px": 11,
   "occluded": 0.004,
   "w": 1.0
  },
  "frames/wave_f1_loop/14.png": {
   "m": [
    1.00175,
    -0.04707,
    -28.89,
    18.04
   ],
   "scale": 1.0029,
   "rot_deg": -2.69,
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
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_f1_loop_14.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_f1_loop_14_u.png",
    "rect": [288, 377, 231, 111]
   },
   "yield_eye_px": 14,
   "yield_px": 212,
   "cover_alien_px": 11,
   "occluded": 0.001,
   "w": 1.0
  },
  "frames/wave_f1_loop/15.png": {
   "m": [
    1.00135,
    -0.04689,
    -28.67,
    18.12
   ],
   "scale": 1.0024,
   "rot_deg": -2.68,
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
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_f1_loop_15.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_f1_loop_15_u.png",
    "rect": [288, 377, 231, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 56,
   "cover_alien_px": 12,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_f1_loop/16.png": {
   "m": [
    1.00136,
    -0.04851,
    -29.32,
    18.76
   ],
   "scale": 1.0025,
   "rot_deg": -2.77,
   "shift": [
    -6.2,
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
   "mask": {
    "file": "track/wave_f1_loop_16.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_f1_loop_16_u.png",
    "rect": [288, 377, 231, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 10,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_f1_loop/17.png": {
   "m": [
    1.00161,
    -0.04924,
    -29.77,
    18.96
   ],
   "scale": 1.0028,
   "rot_deg": -2.81,
   "shift": [
    -6.2,
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
   "mask": {
    "file": "track/wave_f1_loop_17.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_f1_loop_17_u.png",
    "rect": [288, 377, 231, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 13,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_f1_loop/18.png": {
   "m": [
    1.00202,
    -0.0487,
    -29.83,
    18.56
   ],
   "scale": 1.0032,
   "rot_deg": -2.78,
   "shift": [
    -6.3,
    -0.4
   ],
   "inliers": 138,
   "residual_px": 0.65,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_f1_loop_18.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_f1_loop_18_u.png",
    "rect": [288, 377, 231, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 12,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_f1_loop/19.png": {
   "m": [
    1.00204,
    -0.0487,
    -29.81,
    18.59
   ],
   "scale": 1.0032,
   "rot_deg": -2.78,
   "shift": [
    -6.3,
    -0.4
   ],
   "inliers": 130,
   "residual_px": 0.59,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_f1_loop_19.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_f1_loop_19_u.png",
    "rect": [288, 377, 231, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 11,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_f1_loop/20.png": {
   "m": [
    1.0016,
    -0.04821,
    -29.31,
    18.6
   ],
   "scale": 1.0028,
   "rot_deg": -2.76,
   "shift": [
    -6.2,
    -0.4
   ],
   "inliers": 127,
   "residual_px": 0.55,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_f1_loop_20.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_f1_loop_20_u.png",
    "rect": [288, 377, 231, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 22,
   "cover_alien_px": 10,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_f1_loop/21.png": {
   "m": [
    1.00174,
    -0.04859,
    -29.55,
    18.67
   ],
   "scale": 1.0029,
   "rot_deg": -2.78,
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
   "mask": {
    "file": "track/wave_f1_loop_21.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_f1_loop_21_u.png",
    "rect": [288, 377, 231, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 119,
   "cover_alien_px": 14,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_f1_loop/22.png": {
   "m": [
    1.00168,
    -0.04958,
    -29.89,
    19.07
   ],
   "scale": 1.0029,
   "rot_deg": -2.83,
   "shift": [
    -6.1,
    -0.4
   ],
   "inliers": 130,
   "residual_px": 0.53,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_f1_loop_22.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_f1_loop_22_u.png",
    "rect": [288, 377, 231, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 126,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_f1_loop/23.png": {
   "m": [
    1.0015,
    -0.04978,
    -29.9,
    19.19
   ],
   "scale": 1.0027,
   "rot_deg": -2.85,
   "shift": [
    -6.1,
    -0.5
   ],
   "inliers": 134,
   "residual_px": 0.57,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_f1_loop_23.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_f1_loop_23_u.png",
    "rect": [288, 376, 231, 112]
   },
   "yield_eye_px": 14,
   "yield_px": 205,
   "cover_alien_px": 7,
   "occluded": 0.001,
   "w": 1.0
  },
  "frames/wave_f1_loop/24.png": {
   "m": [
    1.00181,
    -0.04927,
    -29.89,
    18.83
   ],
   "scale": 1.003,
   "rot_deg": -2.82,
   "shift": [
    -6.2,
    -0.5
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
   "mask": {
    "file": "track/wave_f1_loop_24.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_f1_loop_24_u.png",
    "rect": [288, 376, 231, 112]
   },
   "yield_eye_px": 21,
   "yield_px": 227,
   "cover_alien_px": 10,
   "occluded": 0.001,
   "w": 1.0
  },
  "frames/wave_f1_loop/25.png": {
   "m": [
    1.00209,
    -0.0487,
    -29.83,
    18.51
   ],
   "scale": 1.0033,
   "rot_deg": -2.78,
   "shift": [
    -6.3,
    -0.4
   ],
   "inliers": 137,
   "residual_px": 0.66,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_f1_loop_25.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_f1_loop_25_u.png",
    "rect": [288, 377, 231, 111]
   },
   "yield_eye_px": 28,
   "yield_px": 212,
   "cover_alien_px": 11,
   "occluded": 0.002,
   "w": 1.0
  },
  "frames/wave_f1_loop/26.png": {
   "m": [
    1.00227,
    -0.04872,
    -29.89,
    18.46
   ],
   "scale": 1.0035,
   "rot_deg": -2.78,
   "shift": [
    -6.3,
    -0.4
   ],
   "inliers": 137,
   "residual_px": 0.67,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_f1_loop_26.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_f1_loop_26_u.png",
    "rect": [288, 377, 231, 111]
   },
   "yield_eye_px": 24,
   "yield_px": 206,
   "cover_alien_px": 12,
   "occluded": 0.001,
   "w": 1.0
  },
  "frames/wave_f1_loop/27.png": {
   "m": [
    1.00196,
    -0.04877,
    -29.62,
    18.62
   ],
   "scale": 1.0031,
   "rot_deg": -2.79,
   "shift": [
    -6.1,
    -0.4
   ],
   "inliers": 125,
   "residual_px": 0.57,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_f1_loop_27.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_f1_loop_27_u.png",
    "rect": [288, 377, 231, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 138,
   "cover_alien_px": 11,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_f1_loop/28.png": {
   "m": [
    1.00169,
    -0.04754,
    -28.85,
    18.21
   ],
   "scale": 1.0028,
   "rot_deg": -2.72,
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
   "mask": {
    "file": "track/wave_f1_loop_28.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_f1_loop_28_u.png",
    "rect": [289, 377, 230, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 60,
   "cover_alien_px": 14,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_f1_loop/29.png": {
   "m": [
    1.00194,
    -0.0453,
    -27.76,
    17.16
   ],
   "scale": 1.003,
   "rot_deg": -2.59,
   "shift": [
    -5.9,
    -0.4
   ],
   "inliers": 133,
   "residual_px": 0.59,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_f1_loop_29.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_f1_loop_29_u.png",
    "rect": [289, 377, 231, 111]
   },
   "yield_eye_px": 0,
   "yield_px": 1,
   "cover_alien_px": 20,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_f1_loop/30.png": {
   "m": [
    1.00217,
    -0.04293,
    -26.53,
    16.07
   ],
   "scale": 1.0031,
   "rot_deg": -2.45,
   "shift": [
    -5.7,
    -0.5
   ],
   "inliers": 135,
   "residual_px": 0.64,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_f1_loop_30.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_f1_loop_30_u.png",
    "rect": [289, 377, 231, 110]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 19,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_f1_loop/31.png": {
   "m": [
    1.00209,
    -0.03987,
    -24.54,
    14.83
   ],
   "scale": 1.0029,
   "rot_deg": -2.28,
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
   "mask": {
    "file": "track/wave_f1_loop_31.png",
    "rect": [164, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_f1_loop_31_u.png",
    "rect": [290, 377, 230, 110]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 15,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_f1_loop/32.png": {
   "m": [
    1.00222,
    -0.03649,
    -22.38,
    13.35
   ],
   "scale": 1.0029,
   "rot_deg": -2.09,
   "shift": [
    -4.5,
    -0.5
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
   "mask": {
    "file": "track/wave_f1_loop_32.png",
    "rect": [165, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_f1_loop_32_u.png",
    "rect": [291, 377, 230, 110]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 11,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_f1_loop/33.png": {
   "m": [
    1.00244,
    -0.03207,
    -19.83,
    11.44
   ],
   "scale": 1.003,
   "rot_deg": -1.83,
   "shift": [
    -3.9,
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
   "mask": {
    "file": "track/wave_f1_loop_33.png",
    "rect": [165, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_f1_loop_33_u.png",
    "rect": [291, 378, 231, 109]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 19,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_f1_loop/34.png": {
   "m": [
    1.00263,
    -0.02802,
    -17.43,
    9.66
   ],
   "scale": 1.003,
   "rot_deg": -1.6,
   "shift": [
    -3.3,
    -0.6
   ],
   "inliers": 159,
   "residual_px": 0.59,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_f1_loop_34.png",
    "rect": [166, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_f1_loop_34_u.png",
    "rect": [292, 378, 231, 108]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 21,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_f1_loop/35.png": {
   "m": [
    1.00251,
    -0.02505,
    -15.62,
    8.49
   ],
   "scale": 1.0028,
   "rot_deg": -1.43,
   "shift": [
    -2.9,
    -0.6
   ],
   "inliers": 170,
   "residual_px": 0.58,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_f1_loop_35.png",
    "rect": [166, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_f1_loop_35_u.png",
    "rect": [293, 378, 230, 108]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 15,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_f1_loop/36.png": {
   "m": [
    1.00232,
    -0.02067,
    -12.98,
    6.83
   ],
   "scale": 1.0025,
   "rot_deg": -1.18,
   "shift": [
    -2.4,
    -0.5
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
   "mask": {
    "file": "track/wave_f1_loop_36.png",
    "rect": [167, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_f1_loop_36_u.png",
    "rect": [293, 379, 231, 107]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 11,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_f1_loop/37.png": {
   "m": [
    1.00278,
    -0.01691,
    -10.95,
    5.07
   ],
   "scale": 1.0029,
   "rot_deg": -0.97,
   "shift": [
    -1.9,
    -0.6
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
   "mask": {
    "file": "track/wave_f1_loop_37.png",
    "rect": [167, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_f1_loop_37_u.png",
    "rect": [294, 379, 231, 107]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 16,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_f1_loop/38.png": {
   "m": [
    1.00285,
    -0.01426,
    -9.35,
    3.9
   ],
   "scale": 1.003,
   "rot_deg": -0.81,
   "shift": [
    -1.6,
    -0.6
   ],
   "inliers": 177,
   "residual_px": 0.55,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_f1_loop_38.png",
    "rect": [167, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_f1_loop_38_u.png",
    "rect": [294, 379, 231, 106]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 14,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_f1_loop/39.png": {
   "m": [
    1.00269,
    -0.01221,
    -8.07,
    3.14
   ],
   "scale": 1.0028,
   "rot_deg": -0.7,
   "shift": [
    -1.3,
    -0.6
   ],
   "inliers": 171,
   "residual_px": 0.52,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_f1_loop_39.png",
    "rect": [168, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_f1_loop_39_u.png",
    "rect": [295, 379, 230, 106]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 15,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_f1_loop/40.png": {
   "m": [
    1.00268,
    -0.00974,
    -6.59,
    2.13
   ],
   "scale": 1.0027,
   "rot_deg": -0.56,
   "shift": [
    -1.0,
    -0.6
   ],
   "inliers": 180,
   "residual_px": 0.55,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_f1_loop_40.png",
    "rect": [168, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_f1_loop_40_u.png",
    "rect": [295, 379, 231, 106]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 13,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_f1_loop/41.png": {
   "m": [
    1.00273,
    -0.00714,
    -5.12,
    1.05
   ],
   "scale": 1.0028,
   "rot_deg": -0.41,
   "shift": [
    -0.7,
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
   "mask": {
    "file": "track/wave_f1_loop_41.png",
    "rect": [168, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_f1_loop_41_u.png",
    "rect": [296, 380, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 14,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_f1_loop/42.png": {
   "m": [
    1.00267,
    -0.00536,
    -4.04,
    0.37
   ],
   "scale": 1.0027,
   "rot_deg": -0.31,
   "shift": [
    -0.5,
    -0.6
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
   "mask": {
    "file": "track/wave_f1_loop_42.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_f1_loop_42_u.png",
    "rect": [296, 380, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 11,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_f1_loop/43.png": {
   "m": [
    1.00261,
    -0.00374,
    -3.14,
    -0.28
   ],
   "scale": 1.0026,
   "rot_deg": -0.21,
   "shift": [
    -0.3,
    -0.6
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
   "mask": {
    "file": "track/wave_f1_loop_43.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_f1_loop_43_u.png",
    "rect": [296, 380, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 12,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_f1_loop/44.png": {
   "m": [
    1.00277,
    -0.00269,
    -2.64,
    -0.8
   ],
   "scale": 1.0028,
   "rot_deg": -0.15,
   "shift": [
    -0.3,
    -0.6
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
   "mask": {
    "file": "track/wave_f1_loop_44.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_f1_loop_44_u.png",
    "rect": [296, 380, 231, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_f1_loop/45.png": {
   "m": [
    1.00278,
    -0.00207,
    -2.26,
    -1.01
   ],
   "scale": 1.0028,
   "rot_deg": -0.12,
   "shift": [
    -0.2,
    -0.6
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
   "mask": {
    "file": "track/wave_f1_loop_45.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_f1_loop_45_u.png",
    "rect": [296, 380, 231, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 11,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_f1_loop/46.png": {
   "m": [
    1.00277,
    -0.00152,
    -1.94,
    -1.21
   ],
   "scale": 1.0028,
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
   "mask": {
    "file": "track/wave_f1_loop_46.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_f1_loop_46_u.png",
    "rect": [297, 380, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 13,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_f1_loop/47.png": {
   "m": [
    1.00234,
    -0.00084,
    -1.42,
    -1.17
   ],
   "scale": 1.0023,
   "rot_deg": -0.05,
   "shift": [
    -0.1,
    -0.4
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
   "mask": {
    "file": "track/wave_f1_loop_47.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_f1_loop_47_u.png",
    "rect": [297, 380, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 14,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_f1_loop/48.png": {
   "m": [
    1.00066,
    -0.0002,
    -0.38,
    -0.34
   ],
   "scale": 1.0007,
   "rot_deg": -0.01,
   "shift": [
    -0.0,
    -0.1
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
   "mask": {
    "file": "track/wave_f1_loop_48.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_f1_loop_48_u.png",
    "rect": [297, 381, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_d1_loop/00.png": {
   "m": [
    1.00052,
    2e-05,
    -0.14,
    -0.36
   ],
   "scale": 1.0005,
   "rot_deg": 0.0,
   "shift": [
    0.1,
    -0.1
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
   "mask": {
    "file": "track/wave_d1_loop_00.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_d1_loop_00_u.png",
    "rect": [297, 381, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_d1_loop/01.png": {
   "m": [
    1.00188,
    0.00012,
    -0.45,
    -1.37
   ],
   "scale": 1.0019,
   "rot_deg": 0.01,
   "shift": [
    0.3,
    -0.4
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
   "mask": {
    "file": "track/wave_d1_loop_01.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_d1_loop_01_u.png",
    "rect": [297, 380, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 21,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_d1_loop/02.png": {
   "m": [
    1.0023,
    -0.00044,
    -0.76,
    -1.58
   ],
   "scale": 1.0023,
   "rot_deg": -0.02,
   "shift": [
    0.4,
    -0.7
   ],
   "inliers": 189,
   "residual_px": 0.71,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_d1_loop_02.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_d1_loop_02_u.png",
    "rect": [297, 380, 231, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 21,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_d1_loop/03.png": {
   "m": [
    1.00199,
    -0.00598,
    -3.77,
    0.73
   ],
   "scale": 1.002,
   "rot_deg": -0.34,
   "shift": [
    -0.2,
    -0.8
   ],
   "inliers": 174,
   "residual_px": 0.82,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_d1_loop_03.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_d1_loop_03_u.png",
    "rect": [297, 380, 229, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 22,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_d1_loop/04.png": {
   "m": [
    1.00111,
    -0.01993,
    -11.41,
    6.87
   ],
   "scale": 1.0013,
   "rot_deg": -1.14,
   "shift": [
    -1.7,
    -0.8
   ],
   "inliers": 127,
   "residual_px": 0.8,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_d1_loop_04.png",
    "rect": [167, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_d1_loop_04_u.png",
    "rect": [294, 379, 231, 107]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 19,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_d1_loop/05.png": {
   "m": [
    1.00111,
    -0.03768,
    -21.36,
    14.19
   ],
   "scale": 1.0018,
   "rot_deg": -2.16,
   "shift": [
    -3.4,
    -0.7
   ],
   "inliers": 122,
   "residual_px": 0.89,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_d1_loop_05.png",
    "rect": [166, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_d1_loop_05_u.png",
    "rect": [292, 377, 230, 110]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 16,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_d1_loop/06.png": {
   "m": [
    1.00078,
    -0.05899,
    -33.66,
    23.01
   ],
   "scale": 1.0025,
   "rot_deg": -3.37,
   "shift": [
    -5.9,
    -0.7
   ],
   "inliers": 126,
   "residual_px": 0.65,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.4
   },
   "ok": true,
   "mask": {
    "file": "track/wave_d1_loop_06.png",
    "rect": [163, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_d1_loop_06_u.png",
    "rect": [288, 376, 230, 112]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_d1_loop/07.png": {
   "m": [
    0.9999,
    -0.07492,
    -42.85,
    29.67
   ],
   "scale": 1.0027,
   "rot_deg": -4.28,
   "shift": [
    -8.0,
    -1.0
   ],
   "inliers": 120,
   "residual_px": 0.86,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_d1_loop_07.png",
    "rect": [161, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_d1_loop_07_u.png",
    "rect": [286, 374, 230, 115]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_d1_loop/08.png": {
   "m": [
    0.99765,
    -0.09014,
    -50.37,
    36.33
   ],
   "scale": 1.0017,
   "rot_deg": -5.16,
   "shift": [
    -9.4,
    -1.6
   ],
   "inliers": 83,
   "residual_px": 0.79,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 1.4
   },
   "ok": true,
   "mask": {
    "file": "track/wave_d1_loop_08.png",
    "rect": [160, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_d1_loop_08_u.png",
    "rect": [284, 372, 228, 118]
   },
   "yield_eye_px": 214,
   "yield_px": 232,
   "cover_alien_px": 5,
   "occluded": 0.012,
   "w": 1.0
  },
  "frames/wave_d1_loop/09.png": {
   "m": [
    0.99727,
    -0.09702,
    -53.99,
    39.01
   ],
   "scale": 1.002,
   "rot_deg": -5.56,
   "shift": [
    -10.0,
    -1.9
   ],
   "inliers": 74,
   "residual_px": 0.85,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_d1_loop_09.png",
    "rect": [159, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_d1_loop_09_u.png",
    "rect": [283, 372, 228, 118]
   },
   "yield_eye_px": 792,
   "yield_px": 1000,
   "cover_alien_px": 0,
   "occluded": 0.046,
   "w": 1.0
  },
  "frames/wave_d1_loop/10.png": {
   "m": [
    0.99811,
    -0.09343,
    -52.39,
    37.05
   ],
   "scale": 1.0025,
   "rot_deg": -5.35,
   "shift": [
    -9.7,
    -2.0
   ],
   "inliers": 56,
   "residual_px": 0.78,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_d1_loop_10.png",
    "rect": [159, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_d1_loop_10_u.png",
    "rect": [283, 372, 227, 118]
   },
   "yield_eye_px": 1501,
   "yield_px": 1967,
   "cover_alien_px": 0,
   "occluded": 0.086,
   "w": 1.0
  },
  "frames/wave_d1_loop/11.png": {
   "m": [
    0.99905,
    -0.08316,
    -47.12,
    32.29
   ],
   "scale": 1.0025,
   "rot_deg": -4.76,
   "shift": [
    -8.8,
    -2.1
   ],
   "inliers": 48,
   "residual_px": 0.77,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 2.2,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_d1_loop_11.png",
    "rect": [160, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_d1_loop_11_u.png",
    "rect": [285, 372, 231, 117]
   },
   "yield_eye_px": 1843,
   "yield_px": 2401,
   "cover_alien_px": 0,
   "occluded": 0.106,
   "w": 1.0
  },
  "frames/wave_d1_loop/12.png": {
   "m": [
    1.00123,
    -0.0673,
    -39.36,
    24.73
   ],
   "scale": 1.0035,
   "rot_deg": -3.85,
   "shift": [
    -7.5,
    -2.2
   ],
   "inliers": 53,
   "residual_px": 0.79,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_d1_loop_12.png",
    "rect": [161, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_d1_loop_12_u.png",
    "rect": [286, 373, 232, 114]
   },
   "yield_eye_px": 2313,
   "yield_px": 2964,
   "cover_alien_px": 1,
   "occluded": 0.133,
   "w": 1.0
  },
  "frames/wave_d1_loop/13.png": {
   "m": [
    1.00165,
    -0.05291,
    -31.56,
    18.55
   ],
   "scale": 1.0031,
   "rot_deg": -3.02,
   "shift": [
    -6.3,
    -2.3
   ],
   "inliers": 52,
   "residual_px": 0.82,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 2.2,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 1.4
   },
   "ok": true,
   "mask": {
    "file": "track/wave_d1_loop_13.png",
    "rect": [163, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_d1_loop_13_u.png",
    "rect": [288, 374, 231, 112]
   },
   "yield_eye_px": 2378,
   "yield_px": 3018,
   "cover_alien_px": 0,
   "occluded": 0.137,
   "w": 1.0
  },
  "frames/wave_d1_loop/14.png": {
   "m": [
    1.00267,
    -0.02748,
    -18.02,
    7.65
   ],
   "scale": 1.0031,
   "rot_deg": -1.57,
   "shift": [
    -4.1,
    -2.3
   ],
   "inliers": 64,
   "residual_px": 0.78,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.4,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.4
   },
   "ok": true,
   "mask": {
    "file": "track/wave_d1_loop_14.png",
    "rect": [165, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_d1_loop_14_u.png",
    "rect": [291, 376, 232, 108]
   },
   "yield_eye_px": 1490,
   "yield_px": 2125,
   "cover_alien_px": 0,
   "occluded": 0.086,
   "w": 1.0
  },
  "frames/wave_d1_loop/15.png": {
   "m": [
    1.00274,
    0.00655,
    0.67,
    -6.34
   ],
   "scale": 1.0028,
   "rot_deg": 0.37,
   "shift": [
    -1.3,
    -2.4
   ],
   "inliers": 82,
   "residual_px": 0.84,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 1.4
   },
   "ok": true,
   "mask": {
    "file": "track/wave_d1_loop_15.png",
    "rect": [168, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_d1_loop_15_u.png",
    "rect": [296, 379, 230, 103]
   },
   "yield_eye_px": 446,
   "yield_px": 944,
   "cover_alien_px": 5,
   "occluded": 0.026,
   "w": 1.0
  },
  "frames/wave_d1_loop/16.png": {
   "m": [
    1.00193,
    0.03522,
    16.92,
    -17.81
   ],
   "scale": 1.0026,
   "rot_deg": 2.01,
   "shift": [
    1.3,
    -2.5
   ],
   "inliers": 107,
   "residual_px": 0.75,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_d1_loop_16.png",
    "rect": [170, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_d1_loop_16_u.png",
    "rect": [299, 377, 230, 107]
   },
   "yield_eye_px": 379,
   "yield_px": 915,
   "cover_alien_px": 4,
   "occluded": 0.022,
   "w": 1.0
  },
  "frames/wave_d1_loop/17.png": {
   "m": [
    0.99995,
    0.06359,
    33.6,
    -28.56
   ],
   "scale": 1.002,
   "rot_deg": 3.64,
   "shift": [
    4.0,
    -2.6
   ],
   "inliers": 91,
   "residual_px": 0.74,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_d1_loop_17.png",
    "rect": [173, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_d1_loop_17_u.png",
    "rect": [304, 375, 230, 111]
   },
   "yield_eye_px": 125,
   "yield_px": 636,
   "cover_alien_px": 5,
   "occluded": 0.007,
   "w": 1.0
  },
  "frames/wave_d1_loop/18.png": {
   "m": [
    0.99786,
    0.08326,
    45.24,
    -35.57
   ],
   "scale": 1.0013,
   "rot_deg": 4.77,
   "shift": [
    5.6,
    -2.5
   ],
   "inliers": 84,
   "residual_px": 0.89,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_d1_loop_18.png",
    "rect": [175, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_d1_loop_18_u.png",
    "rect": [307, 374, 229, 114]
   },
   "yield_eye_px": 171,
   "yield_px": 703,
   "cover_alien_px": 7,
   "occluded": 0.01,
   "w": 1.0
  },
  "frames/wave_d1_loop/19.png": {
   "m": [
    0.99636,
    0.09739,
    53.21,
    -40.41
   ],
   "scale": 1.0011,
   "rot_deg": 5.58,
   "shift": [
    6.4,
    -2.3
   ],
   "inliers": 67,
   "residual_px": 0.74,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 1.4
   },
   "ok": true,
   "mask": {
    "file": "track/wave_d1_loop_19.png",
    "rect": [175, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_d1_loop_19_u.png",
    "rect": [311, 373, 227, 116]
   },
   "yield_eye_px": 1052,
   "yield_px": 1838,
   "cover_alien_px": 0,
   "occluded": 0.061,
   "w": 1.0
  },
  "frames/wave_d1_loop/20.png": {
   "m": [
    0.99575,
    0.09817,
    53.3,
    -40.22
   ],
   "scale": 1.0006,
   "rot_deg": 5.63,
   "shift": [
    5.9,
    -2.1
   ],
   "inliers": 72,
   "residual_px": 0.83,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 1.4
   },
   "ok": true,
   "mask": {
    "file": "track/wave_d1_loop_20.png",
    "rect": [175, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_d1_loop_20_u.png",
    "rect": [311, 373, 225, 116]
   },
   "yield_eye_px": 1201,
   "yield_px": 1984,
   "cover_alien_px": 3,
   "occluded": 0.069,
   "w": 1.0
  },
  "frames/wave_d1_loop/21.png": {
   "m": [
    0.99716,
    0.08452,
    44.66,
    -35.03
   ],
   "scale": 1.0007,
   "rot_deg": 4.85,
   "shift": [
    4.2,
    -1.8
   ],
   "inliers": 57,
   "residual_px": 0.87,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 1.4,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_d1_loop_21.png",
    "rect": [173, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_d1_loop_21_u.png",
    "rect": [307, 374, 228, 115]
   },
   "yield_eye_px": 1056,
   "yield_px": 1832,
   "cover_alien_px": 4,
   "occluded": 0.061,
   "w": 1.0
  },
  "frames/wave_d1_loop/22.png": {
   "m": [
    0.99982,
    0.06335,
    31.66,
    -27.35
   ],
   "scale": 1.0018,
   "rot_deg": 3.63,
   "shift": [
    2.1,
    -1.5
   ],
   "inliers": 61,
   "residual_px": 0.98,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 1.4
   },
   "ok": true,
   "mask": {
    "file": "track/wave_d1_loop_22.png",
    "rect": [171, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_d1_loop_22_u.png",
    "rect": [304, 376, 228, 111]
   },
   "yield_eye_px": 857,
   "yield_px": 1623,
   "cover_alien_px": 12,
   "occluded": 0.049,
   "w": 1.0
  },
  "frames/wave_d1_loop/23.png": {
   "m": [
    1.00121,
    0.0347,
    15.07,
    -15.92
   ],
   "scale": 1.0018,
   "rot_deg": 1.99,
   "shift": [
    -0.6,
    -1.2
   ],
   "inliers": 93,
   "residual_px": 0.68,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 2.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_d1_loop_23.png",
    "rect": [168, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_d1_loop_23_u.png",
    "rect": [298, 378, 231, 107]
   },
   "yield_eye_px": 187,
   "yield_px": 675,
   "cover_alien_px": 12,
   "occluded": 0.011,
   "w": 1.0
  },
  "frames/wave_d1_loop/24.png": {
   "m": [
    1.00249,
    0.01127,
    1.27,
    -6.54
   ],
   "scale": 1.0026,
   "rot_deg": 0.64,
   "shift": [
    -3.0,
    -0.8
   ],
   "inliers": 112,
   "residual_px": 0.73,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_d1_loop_24.png",
    "rect": [166, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_d1_loop_24_u.png",
    "rect": [294, 380, 232, 104]
   },
   "yield_eye_px": 96,
   "yield_px": 573,
   "cover_alien_px": 18,
   "occluded": 0.006,
   "w": 1.0
  },
  "frames/wave_d1_loop/25.png": {
   "m": [
    1.00406,
    -0.01247,
    -12.75,
    2.8
   ],
   "scale": 1.0041,
   "rot_deg": -0.71,
   "shift": [
    -5.3,
    -0.4
   ],
   "inliers": 94,
   "residual_px": 0.88,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.4,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_d1_loop_25.png",
    "rect": [164, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_d1_loop_25_u.png",
    "rect": [291, 379, 231, 106]
   },
   "yield_eye_px": 147,
   "yield_px": 605,
   "cover_alien_px": 6,
   "occluded": 0.008,
   "w": 1.0
  },
  "frames/wave_d1_loop/26.png": {
   "m": [
    1.00408,
    -0.03118,
    -23.13,
    10.61
   ],
   "scale": 1.0046,
   "rot_deg": -1.78,
   "shift": [
    -7.0,
    -0.2
   ],
   "inliers": 72,
   "residual_px": 0.97,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_d1_loop_26.png",
    "rect": [162, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_d1_loop_26_u.png",
    "rect": [288, 378, 231, 109]
   },
   "yield_eye_px": 132,
   "yield_px": 557,
   "cover_alien_px": 8,
   "occluded": 0.008,
   "w": 1.0
  },
  "frames/wave_d1_loop/27.png": {
   "m": [
    1.00144,
    -0.04874,
    -31.55,
    18.95
   ],
   "scale": 1.0026,
   "rot_deg": -2.79,
   "shift": [
    -8.3,
    -0.3
   ],
   "inliers": 69,
   "residual_px": 0.67,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 1.4,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_d1_loop_27.png",
    "rect": [161, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_d1_loop_27_u.png",
    "rect": [286, 377, 232, 111]
   },
   "yield_eye_px": 535,
   "yield_px": 955,
   "cover_alien_px": 7,
   "occluded": 0.031,
   "w": 1.0
  },
  "frames/wave_d1_loop/28.png": {
   "m": [
    1.00019,
    -0.06116,
    -37.87,
    24.68
   ],
   "scale": 1.0021,
   "rot_deg": -3.5,
   "shift": [
    -9.3,
    -0.2
   ],
   "inliers": 66,
   "residual_px": 0.77,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_d1_loop_28.png",
    "rect": [160, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_d1_loop_28_u.png",
    "rect": [285, 376, 231, 113]
   },
   "yield_eye_px": 654,
   "yield_px": 1042,
   "cover_alien_px": 6,
   "occluded": 0.038,
   "w": 1.0
  },
  "frames/wave_d1_loop/29.png": {
   "m": [
    0.99921,
    -0.07269,
    -44.03,
    29.97
   ],
   "scale": 1.0019,
   "rot_deg": -4.16,
   "shift": [
    -10.5,
    -0.1
   ],
   "inliers": 69,
   "residual_px": 0.75,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_d1_loop_29.png",
    "rect": [158, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_d1_loop_29_u.png",
    "rect": [283, 375, 231, 115]
   },
   "yield_eye_px": 1236,
   "yield_px": 1695,
   "cover_alien_px": 4,
   "occluded": 0.071,
   "w": 1.0
  },
  "frames/wave_d1_loop/30.png": {
   "m": [
    0.99832,
    -0.08361,
    -49.89,
    35.01
   ],
   "scale": 1.0018,
   "rot_deg": -4.79,
   "shift": [
    -11.7,
    0.1
   ],
   "inliers": 56,
   "residual_px": 0.67,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_d1_loop_30.png",
    "rect": [157, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_d1_loop_30_u.png",
    "rect": [282, 375, 231, 116]
   },
   "yield_eye_px": 1314,
   "yield_px": 1739,
   "cover_alien_px": 7,
   "occluded": 0.076,
   "w": 1.0
  },
  "frames/wave_d1_loop/31.png": {
   "m": [
    0.99659,
    -0.09785,
    -57.16,
    41.94
   ],
   "scale": 1.0014,
   "rot_deg": -5.61,
   "shift": [
    -13.0,
    0.4
   ],
   "inliers": 57,
   "residual_px": 0.76,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_d1_loop_31.png",
    "rect": [156, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_d1_loop_31_u.png",
    "rect": [280, 374, 231, 118]
   },
   "yield_eye_px": 1516,
   "yield_px": 1947,
   "cover_alien_px": 5,
   "occluded": 0.087,
   "w": 1.0
  },
  "frames/wave_d1_loop/32.png": {
   "m": [
    0.99496,
    -0.10991,
    -63.12,
    47.95
   ],
   "scale": 1.001,
   "rot_deg": -6.3,
   "shift": [
    -14.0,
    0.7
   ],
   "inliers": 69,
   "residual_px": 0.69,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_d1_loop_32.png",
    "rect": [155, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_d1_loop_32_u.png",
    "rect": [279, 373, 229, 121]
   },
   "yield_eye_px": 642,
   "yield_px": 942,
   "cover_alien_px": 5,
   "occluded": 0.037,
   "w": 1.0
  },
  "frames/wave_d1_loop/33.png": {
   "m": [
    0.9944,
    -0.11649,
    -66.53,
    51.2
   ],
   "scale": 1.0012,
   "rot_deg": -6.68,
   "shift": [
    -14.6,
    1.0
   ],
   "inliers": 71,
   "residual_px": 0.72,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_d1_loop_33.png",
    "rect": [154, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_d1_loop_33_u.png",
    "rect": [278, 373, 229, 121]
   },
   "yield_eye_px": 314,
   "yield_px": 491,
   "cover_alien_px": 6,
   "occluded": 0.018,
   "w": 1.0
  },
  "frames/wave_d1_loop/34.png": {
   "m": [
    0.99408,
    -0.11943,
    -68.01,
    52.77
   ],
   "scale": 1.0012,
   "rot_deg": -6.85,
   "shift": [
    -14.9,
    1.2
   ],
   "inliers": 66,
   "residual_px": 0.74,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_d1_loop_34.png",
    "rect": [154, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_d1_loop_34_u.png",
    "rect": [277, 373, 229, 122]
   },
   "yield_eye_px": 360,
   "yield_px": 454,
   "cover_alien_px": 4,
   "occluded": 0.021,
   "w": 1.0
  },
  "frames/wave_d1_loop/35.png": {
   "m": [
    0.99452,
    -0.1159,
    -65.82,
    51.18
   ],
   "scale": 1.0012,
   "rot_deg": -6.65,
   "shift": [
    -14.1,
    1.3
   ],
   "inliers": 83,
   "residual_px": 0.81,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_d1_loop_35.png",
    "rect": [155, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_d1_loop_35_u.png",
    "rect": [278, 374, 229, 121]
   },
   "yield_eye_px": 420,
   "yield_px": 476,
   "cover_alien_px": 3,
   "occluded": 0.024,
   "w": 1.0
  },
  "frames/wave_d1_loop/36.png": {
   "m": [
    0.99507,
    -0.10442,
    -59.0,
    46.02
   ],
   "scale": 1.0005,
   "rot_deg": -5.99,
   "shift": [
    -12.4,
    1.1
   ],
   "inliers": 80,
   "residual_px": 0.69,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_d1_loop_36.png",
    "rect": [157, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_d1_loop_36_u.png",
    "rect": [280, 374, 230, 120]
   },
   "yield_eye_px": 376,
   "yield_px": 441,
   "cover_alien_px": 2,
   "occluded": 0.022,
   "w": 1.0
  },
  "frames/wave_d1_loop/37.png": {
   "m": [
    0.99646,
    -0.09024,
    -51.35,
    39.28
   ],
   "scale": 1.0005,
   "rot_deg": -5.17,
   "shift": [
    -10.8,
    0.7
   ],
   "inliers": 68,
   "residual_px": 0.79,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_d1_loop_37.png",
    "rect": [158, 223, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_d1_loop_37_u.png",
    "rect": [282, 375, 230, 117]
   },
   "yield_eye_px": 306,
   "yield_px": 394,
   "cover_alien_px": 3,
   "occluded": 0.018,
   "w": 1.0
  },
  "frames/wave_d1_loop/38.png": {
   "m": [
    0.9991,
    -0.07315,
    -42.74,
    30.77
   ],
   "scale": 1.0018,
   "rot_deg": -4.19,
   "shift": [
    -9.1,
    0.5
   ],
   "inliers": 86,
   "residual_px": 0.79,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 2.0,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_d1_loop_38.png",
    "rect": [160, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_d1_loop_38_u.png",
    "rect": [285, 376, 230, 115]
   },
   "yield_eye_px": 169,
   "yield_px": 209,
   "cover_alien_px": 3,
   "occluded": 0.01,
   "w": 1.0
  },
  "frames/wave_d1_loop/39.png": {
   "m": [
    1.00115,
    -0.05713,
    -34.96,
    23.11
   ],
   "scale": 1.0028,
   "rot_deg": -3.27,
   "shift": [
    -7.9,
    0.3
   ],
   "inliers": 93,
   "residual_px": 1.24,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 1.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_d1_loop_39.png",
    "rect": [161, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_d1_loop_39_u.png",
    "rect": [286, 377, 232, 112]
   },
   "yield_eye_px": 110,
   "yield_px": 149,
   "cover_alien_px": 3,
   "occluded": 0.006,
   "w": 1.0
  },
  "frames/wave_d1_loop/40.png": {
   "m": [
    1.00098,
    -0.04228,
    -25.76,
    16.83
   ],
   "scale": 1.0019,
   "rot_deg": -2.42,
   "shift": [
    -5.7,
    0.0
   ],
   "inliers": 135,
   "residual_px": 0.97,
   "ref_residual_px": {
    "eyeL": 2.0,
    "eyeR": 1.0,
    "mouth": 2.0,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_d1_loop_40.png",
    "rect": [163, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_d1_loop_40_u.png",
    "rect": [289, 378, 231, 110]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 1,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_d1_loop/41.png": {
   "m": [
    1.00109,
    -0.03029,
    -18.5,
    11.69
   ],
   "scale": 1.0015,
   "rot_deg": -1.73,
   "shift": [
    -4.0,
    -0.2
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
   "mask": {
    "file": "track/wave_d1_loop_41.png",
    "rect": [165, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_d1_loop_41_u.png",
    "rect": [292, 378, 230, 109]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_d1_loop/42.png": {
   "m": [
    1.00223,
    -0.01847,
    -12.18,
    6.19
   ],
   "scale": 1.0024,
   "rot_deg": -1.06,
   "shift": [
    -2.7,
    -0.3
   ],
   "inliers": 164,
   "residual_px": 0.71,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_d1_loop_42.png",
    "rect": [166, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_d1_loop_42_u.png",
    "rect": [293, 379, 231, 107]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 10,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_d1_loop/43.png": {
   "m": [
    1.00255,
    -0.01108,
    -7.81,
    2.97
   ],
   "scale": 1.0026,
   "rot_deg": -0.63,
   "shift": [
    -1.6,
    -0.4
   ],
   "inliers": 177,
   "residual_px": 0.65,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_d1_loop_43.png",
    "rect": [167, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_d1_loop_43_u.png",
    "rect": [295, 380, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_d1_loop/44.png": {
   "m": [
    1.00269,
    -0.00591,
    -4.51,
    0.79
   ],
   "scale": 1.0027,
   "rot_deg": -0.34,
   "shift": [
    -0.7,
    -0.4
   ],
   "inliers": 172,
   "residual_px": 0.62,
   "ref_residual_px": {
    "eyeL": 1.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/wave_d1_loop_44.png",
    "rect": [168, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_d1_loop_44_u.png",
    "rect": [296, 380, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 12,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_d1_loop/45.png": {
   "m": [
    1.00252,
    -0.00281,
    -2.66,
    -0.49
   ],
   "scale": 1.0025,
   "rot_deg": -0.16,
   "shift": [
    -0.3,
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
   "mask": {
    "file": "track/wave_d1_loop_45.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_d1_loop_45_u.png",
    "rect": [296, 380, 231, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_d1_loop/46.png": {
   "m": [
    1.00234,
    -0.00146,
    -1.81,
    -1.02
   ],
   "scale": 1.0023,
   "rot_deg": -0.08,
   "shift": [
    -0.2,
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
   "mask": {
    "file": "track/wave_d1_loop_46.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_d1_loop_46_u.png",
    "rect": [297, 380, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_d1_loop/47.png": {
   "m": [
    1.00187,
    -0.00047,
    -1.07,
    -1.13
   ],
   "scale": 1.0019,
   "rot_deg": -0.03,
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
   "mask": {
    "file": "track/wave_d1_loop_47.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_d1_loop_47_u.png",
    "rect": [297, 380, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 11,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/wave_d1_loop/48.png": {
   "m": [
    1.00052,
    -6e-05,
    -0.26,
    -0.34
   ],
   "scale": 1.0005,
   "rot_deg": -0.0,
   "shift": [
    -0.0,
    -0.1
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
   "mask": {
    "file": "track/wave_d1_loop_48.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/wave_d1_loop_48_u.png",
    "rect": [297, 381, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_loop/00.png": {
   "m": [
    1.00059,
    -0.00026,
    -0.39,
    -0.34
   ],
   "scale": 1.0006,
   "rot_deg": -0.02,
   "shift": [
    -0.0,
    -0.2
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
   "mask": {
    "file": "track/shrug_loop_00.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_loop_00_u.png",
    "rect": [297, 381, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_loop/01.png": {
   "m": [
    1.00203,
    -0.00114,
    -1.46,
    -1.19
   ],
   "scale": 1.002,
   "rot_deg": -0.07,
   "shift": [
    -0.1,
    -0.7
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
   "mask": {
    "file": "track/shrug_loop_01.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_loop_01_u.png",
    "rect": [297, 380, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 10,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_loop/02.png": {
   "m": [
    1.00222,
    -0.00208,
    -2.0,
    -1.33
   ],
   "scale": 1.0022,
   "rot_deg": -0.12,
   "shift": [
    -0.1,
    -1.1
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
   "mask": {
    "file": "track/shrug_loop_02.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_loop_02_u.png",
    "rect": [297, 379, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 16,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_loop/03.png": {
   "m": [
    1.00207,
    -0.00299,
    -2.34,
    -1.21
   ],
   "scale": 1.0021,
   "rot_deg": -0.17,
   "shift": [
    -0.1,
    -1.5
   ],
   "inliers": 180,
   "residual_px": 0.53,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_loop_03.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_loop_03_u.png",
    "rect": [297, 379, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 16,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_loop/04.png": {
   "m": [
    1.00189,
    -0.00429,
    -2.85,
    -0.94
   ],
   "scale": 1.0019,
   "rot_deg": -0.25,
   "shift": [
    -0.1,
    -1.8
   ],
   "inliers": 176,
   "residual_px": 0.55,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_loop_04.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_loop_04_u.png",
    "rect": [297, 379, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 11,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_loop/05.png": {
   "m": [
    1.00183,
    -0.0054,
    -3.39,
    -0.68
   ],
   "scale": 1.0018,
   "rot_deg": -0.31,
   "shift": [
    -0.1,
    -2.0
   ],
   "inliers": 173,
   "residual_px": 0.56,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_loop_05.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_loop_05_u.png",
    "rect": [296, 378, 231, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 12,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_loop/06.png": {
   "m": [
    1.0016,
    -0.006,
    -3.6,
    -0.49
   ],
   "scale": 1.0016,
   "rot_deg": -0.34,
   "shift": [
    -0.2,
    -2.2
   ],
   "inliers": 182,
   "residual_px": 0.55,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_loop_06.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_loop_06_u.png",
    "rect": [296, 378, 231, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 12,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_loop/07.png": {
   "m": [
    1.00123,
    -0.00677,
    -3.79,
    -0.12
   ],
   "scale": 1.0013,
   "rot_deg": -0.39,
   "shift": [
    -0.1,
    -2.3
   ],
   "inliers": 173,
   "residual_px": 0.56,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_loop_07.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_loop_07_u.png",
    "rect": [296, 378, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 10,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_loop/08.png": {
   "m": [
    1.0012,
    -0.0079,
    -4.29,
    0.25
   ],
   "scale": 1.0012,
   "rot_deg": -0.45,
   "shift": [
    -0.1,
    -2.4
   ],
   "inliers": 169,
   "residual_px": 0.57,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_loop_08.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_loop_08_u.png",
    "rect": [296, 378, 231, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_loop/09.png": {
   "m": [
    1.00145,
    -0.00861,
    -4.74,
    0.39
   ],
   "scale": 1.0015,
   "rot_deg": -0.49,
   "shift": [
    -0.1,
    -2.5
   ],
   "inliers": 176,
   "residual_px": 0.57,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_loop_09.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_loop_09_u.png",
    "rect": [296, 378, 231, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_loop/10.png": {
   "m": [
    1.00176,
    -0.0092,
    -5.15,
    0.46
   ],
   "scale": 1.0018,
   "rot_deg": -0.53,
   "shift": [
    -0.1,
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
   "mask": {
    "file": "track/shrug_loop_10.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_loop_10_u.png",
    "rect": [296, 378, 231, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_loop/11.png": {
   "m": [
    1.00187,
    -0.00926,
    -5.28,
    0.41
   ],
   "scale": 1.0019,
   "rot_deg": -0.53,
   "shift": [
    -0.2,
    -2.5
   ],
   "inliers": 162,
   "residual_px": 0.56,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_loop_11.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_loop_11_u.png",
    "rect": [296, 378, 231, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_loop/12.png": {
   "m": [
    1.00166,
    -0.00969,
    -5.35,
    0.69
   ],
   "scale": 1.0017,
   "rot_deg": -0.55,
   "shift": [
    -0.2,
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
   "mask": {
    "file": "track/shrug_loop_12.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_loop_12_u.png",
    "rect": [296, 378, 231, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_loop/13.png": {
   "m": [
    1.00147,
    -0.00997,
    -5.37,
    0.9
   ],
   "scale": 1.0015,
   "rot_deg": -0.57,
   "shift": [
    -0.1,
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
   "mask": {
    "file": "track/shrug_loop_13.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_loop_13_u.png",
    "rect": [296, 378, 231, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_loop/14.png": {
   "m": [
    1.00138,
    -0.01015,
    -5.4,
    1.03
   ],
   "scale": 1.0014,
   "rot_deg": -0.58,
   "shift": [
    -0.1,
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
   "mask": {
    "file": "track/shrug_loop_14.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_loop_14_u.png",
    "rect": [296, 378, 231, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_loop/15.png": {
   "m": [
    1.00121,
    -0.01013,
    -5.31,
    1.1
   ],
   "scale": 1.0013,
   "rot_deg": -0.58,
   "shift": [
    -0.1,
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
   "mask": {
    "file": "track/shrug_loop_15.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_loop_15_u.png",
    "rect": [296, 378, 231, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_loop/16.png": {
   "m": [
    1.00135,
    -0.00981,
    -5.26,
    0.89
   ],
   "scale": 1.0014,
   "rot_deg": -0.56,
   "shift": [
    -0.1,
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
   "mask": {
    "file": "track/shrug_loop_16.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_loop_16_u.png",
    "rect": [296, 378, 231, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_loop/17.png": {
   "m": [
    1.00154,
    -0.00946,
    -5.23,
    0.64
   ],
   "scale": 1.0016,
   "rot_deg": -0.54,
   "shift": [
    -0.2,
    -2.5
   ],
   "inliers": 170,
   "residual_px": 0.57,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_loop_17.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_loop_17_u.png",
    "rect": [296, 378, 231, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_loop/18.png": {
   "m": [
    1.00157,
    -0.00981,
    -5.38,
    0.77
   ],
   "scale": 1.0016,
   "rot_deg": -0.56,
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
   "mask": {
    "file": "track/shrug_loop_18.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_loop_18_u.png",
    "rect": [296, 378, 231, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 12,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_loop/19.png": {
   "m": [
    1.00164,
    -0.00969,
    -5.39,
    0.68
   ],
   "scale": 1.0017,
   "rot_deg": -0.55,
   "shift": [
    -0.2,
    -2.5
   ],
   "inliers": 162,
   "residual_px": 0.57,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_loop_19.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_loop_19_u.png",
    "rect": [296, 378, 231, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 11,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_loop/20.png": {
   "m": [
    1.00151,
    -0.00996,
    -5.43,
    0.86
   ],
   "scale": 1.0016,
   "rot_deg": -0.57,
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
   "mask": {
    "file": "track/shrug_loop_20.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_loop_20_u.png",
    "rect": [296, 378, 231, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 12,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_loop/21.png": {
   "m": [
    1.0016,
    -0.00984,
    -5.42,
    0.78
   ],
   "scale": 1.0017,
   "rot_deg": -0.56,
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
   "mask": {
    "file": "track/shrug_loop_21.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_loop_21_u.png",
    "rect": [296, 378, 231, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 11,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_loop/22.png": {
   "m": [
    1.00154,
    -0.01,
    -5.42,
    0.9
   ],
   "scale": 1.0016,
   "rot_deg": -0.57,
   "shift": [
    -0.1,
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
   "mask": {
    "file": "track/shrug_loop_22.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_loop_22_u.png",
    "rect": [296, 378, 231, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_loop/23.png": {
   "m": [
    1.00152,
    -0.00998,
    -5.39,
    0.9
   ],
   "scale": 1.0016,
   "rot_deg": -0.57,
   "shift": [
    -0.1,
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
   "mask": {
    "file": "track/shrug_loop_23.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_loop_23_u.png",
    "rect": [296, 378, 231, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_loop/24.png": {
   "m": [
    1.00161,
    -0.00969,
    -5.34,
    0.73
   ],
   "scale": 1.0017,
   "rot_deg": -0.55,
   "shift": [
    -0.2,
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
   "mask": {
    "file": "track/shrug_loop_24.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_loop_24_u.png",
    "rect": [296, 378, 231, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_loop/25.png": {
   "m": [
    1.00183,
    -0.00916,
    -5.25,
    0.38
   ],
   "scale": 1.0019,
   "rot_deg": -0.52,
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
   "mask": {
    "file": "track/shrug_loop_25.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_loop_25_u.png",
    "rect": [296, 378, 231, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_loop/26.png": {
   "m": [
    1.00203,
    -0.00887,
    -5.25,
    0.13
   ],
   "scale": 1.0021,
   "rot_deg": -0.51,
   "shift": [
    -0.3,
    -2.6
   ],
   "inliers": 147,
   "residual_px": 0.52,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_loop_26.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_loop_26_u.png",
    "rect": [296, 378, 231, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_loop/27.png": {
   "m": [
    1.00189,
    -0.00929,
    -5.31,
    0.41
   ],
   "scale": 1.0019,
   "rot_deg": -0.53,
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
   "mask": {
    "file": "track/shrug_loop_27.png",
    "rect": [169, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_loop_27_u.png",
    "rect": [296, 378, 231, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_loop/28.png": {
   "m": [
    1.00177,
    -0.00971,
    -5.4,
    0.66
   ],
   "scale": 1.0018,
   "rot_deg": -0.56,
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
   "mask": {
    "file": "track/shrug_loop_28.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_loop_28_u.png",
    "rect": [296, 378, 231, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_loop/29.png": {
   "m": [
    1.00153,
    -0.00987,
    -5.34,
    0.86
   ],
   "scale": 1.0016,
   "rot_deg": -0.56,
   "shift": [
    -0.1,
    -2.5
   ],
   "inliers": 179,
   "residual_px": 0.62,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_loop_29.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_loop_29_u.png",
    "rect": [296, 378, 231, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_loop/30.png": {
   "m": [
    1.00142,
    -0.00994,
    -5.3,
    0.95
   ],
   "scale": 1.0015,
   "rot_deg": -0.57,
   "shift": [
    -0.1,
    -2.4
   ],
   "inliers": 182,
   "residual_px": 0.62,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_loop_30.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_loop_30_u.png",
    "rect": [296, 378, 231, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_loop/31.png": {
   "m": [
    1.0014,
    -0.01001,
    -5.31,
    1.0
   ],
   "scale": 1.0015,
   "rot_deg": -0.57,
   "shift": [
    -0.1,
    -2.4
   ],
   "inliers": 172,
   "residual_px": 0.61,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_loop_31.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_loop_31_u.png",
    "rect": [296, 378, 231, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_loop/32.png": {
   "m": [
    1.00146,
    -0.00997,
    -5.33,
    0.97
   ],
   "scale": 1.0015,
   "rot_deg": -0.57,
   "shift": [
    -0.1,
    -2.4
   ],
   "inliers": 174,
   "residual_px": 0.59,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_loop_32.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_loop_32_u.png",
    "rect": [296, 378, 231, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_loop/33.png": {
   "m": [
    1.00157,
    -0.00995,
    -5.38,
    0.93
   ],
   "scale": 1.0016,
   "rot_deg": -0.57,
   "shift": [
    -0.1,
    -2.4
   ],
   "inliers": 177,
   "residual_px": 0.6,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_loop_33.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_loop_33_u.png",
    "rect": [296, 378, 231, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_loop/34.png": {
   "m": [
    1.00158,
    -0.00965,
    -5.23,
    0.85
   ],
   "scale": 1.0016,
   "rot_deg": -0.55,
   "shift": [
    -0.1,
    -2.4
   ],
   "inliers": 169,
   "residual_px": 0.55,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_loop_34.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_loop_34_u.png",
    "rect": [296, 378, 231, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_loop/35.png": {
   "m": [
    1.00169,
    -0.00891,
    -4.96,
    0.57
   ],
   "scale": 1.0017,
   "rot_deg": -0.51,
   "shift": [
    -0.1,
    -2.3
   ],
   "inliers": 177,
   "residual_px": 0.59,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_loop_35.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_loop_35_u.png",
    "rect": [296, 378, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_loop/36.png": {
   "m": [
    1.00192,
    -0.00807,
    -4.7,
    0.26
   ],
   "scale": 1.002,
   "rot_deg": -0.46,
   "shift": [
    -0.2,
    -2.1
   ],
   "inliers": 167,
   "residual_px": 0.55,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_loop_36.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_loop_36_u.png",
    "rect": [296, 378, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_loop/37.png": {
   "m": [
    1.00205,
    -0.00748,
    -4.47,
    0.17
   ],
   "scale": 1.0021,
   "rot_deg": -0.43,
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
   "mask": {
    "file": "track/shrug_loop_37.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_loop_37_u.png",
    "rect": [296, 378, 231, 106]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 11,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_loop/38.png": {
   "m": [
    1.00194,
    -0.00658,
    -3.97,
    0.09
   ],
   "scale": 1.002,
   "rot_deg": -0.38,
   "shift": [
    -0.1,
    -1.7
   ],
   "inliers": 178,
   "residual_px": 0.56,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_loop_38.png",
    "rect": [169, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_loop_38_u.png",
    "rect": [296, 379, 231, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 12,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_loop/39.png": {
   "m": [
    1.0019,
    -0.00571,
    -3.5,
    -0.03
   ],
   "scale": 1.0019,
   "rot_deg": -0.33,
   "shift": [
    -0.1,
    -1.5
   ],
   "inliers": 184,
   "residual_px": 0.5,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_loop_39.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_loop_39_u.png",
    "rect": [296, 379, 231, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 10,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_loop/40.png": {
   "m": [
    1.00203,
    -0.00467,
    -3.07,
    -0.24
   ],
   "scale": 1.002,
   "rot_deg": -0.27,
   "shift": [
    -0.1,
    -1.2
   ],
   "inliers": 190,
   "residual_px": 0.56,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_loop_40.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_loop_40_u.png",
    "rect": [297, 379, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 11,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_loop/41.png": {
   "m": [
    1.0024,
    -0.00361,
    -2.75,
    -0.6
   ],
   "scale": 1.0024,
   "rot_deg": -0.21,
   "shift": [
    -0.1,
    -1.0
   ],
   "inliers": 197,
   "residual_px": 0.55,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_loop_41.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_loop_41_u.png",
    "rect": [296, 380, 231, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_loop/42.png": {
   "m": [
    1.00263,
    -0.00264,
    -2.41,
    -0.95
   ],
   "scale": 1.0026,
   "rot_deg": -0.15,
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
   "mask": {
    "file": "track/shrug_loop_42.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_loop_42_u.png",
    "rect": [296, 380, 231, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_loop/43.png": {
   "m": [
    1.00261,
    -0.00194,
    -2.07,
    -1.11
   ],
   "scale": 1.0026,
   "rot_deg": -0.11,
   "shift": [
    -0.1,
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
   "mask": {
    "file": "track/shrug_loop_43.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_loop_43_u.png",
    "rect": [297, 380, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 11,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_loop/44.png": {
   "m": [
    1.00254,
    -0.00138,
    -1.75,
    -1.24
   ],
   "scale": 1.0025,
   "rot_deg": -0.08,
   "shift": [
    -0.1,
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
   "mask": {
    "file": "track/shrug_loop_44.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_loop_44_u.png",
    "rect": [297, 380, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 12,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_loop/45.png": {
   "m": [
    1.00257,
    -0.00129,
    -1.68,
    -1.27
   ],
   "scale": 1.0026,
   "rot_deg": -0.07,
   "shift": [
    -0.0,
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
   "mask": {
    "file": "track/shrug_loop_45.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_loop_45_u.png",
    "rect": [297, 380, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 11,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_loop/46.png": {
   "m": [
    1.00255,
    -0.00104,
    -1.54,
    -1.33
   ],
   "scale": 1.0025,
   "rot_deg": -0.06,
   "shift": [
    -0.0,
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
   "mask": {
    "file": "track/shrug_loop_46.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_loop_46_u.png",
    "rect": [297, 380, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 10,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_loop/47.png": {
   "m": [
    1.00195,
    -0.00036,
    -1.0,
    -1.2
   ],
   "scale": 1.0019,
   "rot_deg": -0.02,
   "shift": [
    -0.0,
    -0.4
   ],
   "inliers": 189,
   "residual_px": 0.51,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_loop_47.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_loop_47_u.png",
    "rect": [297, 380, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_loop/48.png": {
   "m": [
    1.00052,
    -4e-05,
    -0.25,
    -0.35
   ],
   "scale": 1.0005,
   "rot_deg": -0.0,
   "shift": [
    -0.0,
    -0.1
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
   "mask": {
    "file": "track/shrug_loop_48.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_loop_48_u.png",
    "rect": [297, 381, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_f2_loop/00.png": {
   "m": [
    1.00056,
    0.00086,
    0.21,
    -0.76
   ],
   "scale": 1.0006,
   "rot_deg": 0.05,
   "shift": [
    0.0,
    -0.1
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
   "mask": {
    "file": "track/shrug_f2_loop_00.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_f2_loop_00_u.png",
    "rect": [297, 381, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_f2_loop/01.png": {
   "m": [
    1.00198,
    0.00445,
    1.48,
    -3.35
   ],
   "scale": 1.002,
   "rot_deg": 0.25,
   "shift": [
    0.2,
    -0.6
   ],
   "inliers": 196,
   "residual_px": 0.47,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_f2_loop_01.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_f2_loop_01_u.png",
    "rect": [297, 380, 231, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_f2_loop/02.png": {
   "m": [
    1.00227,
    0.01014,
    4.3,
    -6.21
   ],
   "scale": 1.0023,
   "rot_deg": 0.58,
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
   "mask": {
    "file": "track/shrug_f2_loop_02.png",
    "rect": [170, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_f2_loop_02_u.png",
    "rect": [298, 380, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 11,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_f2_loop/03.png": {
   "m": [
    1.00204,
    0.01542,
    7.13,
    -8.56
   ],
   "scale": 1.0022,
   "rot_deg": 0.88,
   "shift": [
    0.8,
    -1.3
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
   "mask": {
    "file": "track/shrug_f2_loop_03.png",
    "rect": [170, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_f2_loop_03_u.png",
    "rect": [298, 379, 231, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_f2_loop/04.png": {
   "m": [
    1.00168,
    0.02094,
    10.25,
    -11.02
   ],
   "scale": 1.0019,
   "rot_deg": 1.2,
   "shift": [
    1.2,
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
   "mask": {
    "file": "track/shrug_f2_loop_04.png",
    "rect": [170, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_f2_loop_04_u.png",
    "rect": [299, 379, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 14,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_f2_loop/05.png": {
   "m": [
    1.00142,
    0.0259,
    12.89,
    -13.3
   ],
   "scale": 1.0018,
   "rot_deg": 1.48,
   "shift": [
    1.4,
    -2.1
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
   "mask": {
    "file": "track/shrug_f2_loop_05.png",
    "rect": [170, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_f2_loop_05_u.png",
    "rect": [299, 378, 230, 106]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_f2_loop/06.png": {
   "m": [
    1.0011,
    0.03171,
    15.78,
    -15.96
   ],
   "scale": 1.0016,
   "rot_deg": 1.81,
   "shift": [
    1.5,
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
   "mask": {
    "file": "track/shrug_f2_loop_06.png",
    "rect": [170, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_f2_loop_06_u.png",
    "rect": [300, 377, 230, 107]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_f2_loop/07.png": {
   "m": [
    1.0006,
    0.03534,
    17.81,
    -17.54
   ],
   "scale": 1.0012,
   "rot_deg": 2.02,
   "shift": [
    1.6,
    -2.8
   ],
   "inliers": 149,
   "residual_px": 0.6,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_f2_loop_07.png",
    "rect": [171, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_f2_loop_07_u.png",
    "rect": [300, 377, 230, 107]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 7,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_f2_loop/08.png": {
   "m": [
    1.00018,
    0.03761,
    19.23,
    -18.51
   ],
   "scale": 1.0009,
   "rot_deg": 2.15,
   "shift": [
    1.8,
    -3.1
   ],
   "inliers": 148,
   "residual_px": 0.72,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_f2_loop_08.png",
    "rect": [171, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_f2_loop_08_u.png",
    "rect": [300, 376, 230, 108]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_f2_loop/09.png": {
   "m": [
    1.00006,
    0.04064,
    20.72,
    -19.93
   ],
   "scale": 1.0009,
   "rot_deg": 2.33,
   "shift": [
    1.8,
    -3.3
   ],
   "inliers": 150,
   "residual_px": 0.64,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_f2_loop_09.png",
    "rect": [171, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_f2_loop_09_u.png",
    "rect": [300, 376, 230, 108]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_f2_loop/10.png": {
   "m": [
    1.00036,
    0.04203,
    21.35,
    -20.71
   ],
   "scale": 1.0012,
   "rot_deg": 2.41,
   "shift": [
    1.9,
    -3.4
   ],
   "inliers": 158,
   "residual_px": 0.74,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_f2_loop_10.png",
    "rect": [171, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_f2_loop_10_u.png",
    "rect": [301, 376, 229, 108]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_f2_loop/11.png": {
   "m": [
    0.99983,
    0.04236,
    21.84,
    -20.59
   ],
   "scale": 1.0007,
   "rot_deg": 2.43,
   "shift": [
    2.1,
    -3.4
   ],
   "inliers": 138,
   "residual_px": 0.74,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_f2_loop_11.png",
    "rect": [171, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_f2_loop_11_u.png",
    "rect": [301, 376, 229, 108]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_f2_loop/12.png": {
   "m": [
    0.99932,
    0.0434,
    22.5,
    -20.9
   ],
   "scale": 1.0003,
   "rot_deg": 2.49,
   "shift": [
    2.0,
    -3.5
   ],
   "inliers": 140,
   "residual_px": 0.75,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_f2_loop_12.png",
    "rect": [171, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_f2_loop_12_u.png",
    "rect": [301, 375, 229, 109]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_f2_loop/13.png": {
   "m": [
    1.00003,
    0.04459,
    22.65,
    -21.76
   ],
   "scale": 1.001,
   "rot_deg": 2.55,
   "shift": [
    1.9,
    -3.5
   ],
   "inliers": 146,
   "residual_px": 0.69,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_f2_loop_13.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_f2_loop_13_u.png",
    "rect": [301, 375, 229, 109]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_f2_loop/14.png": {
   "m": [
    1.00077,
    0.04524,
    22.52,
    -22.32
   ],
   "scale": 1.0018,
   "rot_deg": 2.59,
   "shift": [
    1.8,
    -3.5
   ],
   "inliers": 141,
   "residual_px": 0.65,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_f2_loop_14.png",
    "rect": [171, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_f2_loop_14_u.png",
    "rect": [300, 375, 230, 109]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_f2_loop/15.png": {
   "m": [
    1.00053,
    0.04659,
    23.1,
    -22.86
   ],
   "scale": 1.0016,
   "rot_deg": 2.67,
   "shift": [
    1.6,
    -3.6
   ],
   "inliers": 131,
   "residual_px": 0.59,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_f2_loop_15.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_f2_loop_15_u.png",
    "rect": [300, 375, 230, 109]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_f2_loop/16.png": {
   "m": [
    1.00026,
    0.04669,
    23.25,
    -22.81
   ],
   "scale": 1.0014,
   "rot_deg": 2.67,
   "shift": [
    1.6,
    -3.6
   ],
   "inliers": 130,
   "residual_px": 0.6,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_f2_loop_16.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_f2_loop_16_u.png",
    "rect": [300, 375, 230, 109]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_f2_loop/17.png": {
   "m": [
    1.00013,
    0.0453,
    22.77,
    -22.1
   ],
   "scale": 1.0012,
   "rot_deg": 2.59,
   "shift": [
    1.7,
    -3.5
   ],
   "inliers": 140,
   "residual_px": 0.63,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_f2_loop_17.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_f2_loop_17_u.png",
    "rect": [300, 375, 230, 109]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_f2_loop/18.png": {
   "m": [
    1.00039,
    0.04442,
    22.34,
    -21.76
   ],
   "scale": 1.0014,
   "rot_deg": 2.54,
   "shift": [
    1.8,
    -3.4
   ],
   "inliers": 134,
   "residual_px": 0.6,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_f2_loop_18.png",
    "rect": [171, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_f2_loop_18_u.png",
    "rect": [300, 375, 230, 109]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_f2_loop/19.png": {
   "m": [
    0.99957,
    0.04307,
    22.25,
    -20.75
   ],
   "scale": 1.0005,
   "rot_deg": 2.47,
   "shift": [
    2.0,
    -3.3
   ],
   "inliers": 142,
   "residual_px": 0.77,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_f2_loop_19.png",
    "rect": [171, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_f2_loop_19_u.png",
    "rect": [301, 376, 229, 108]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_f2_loop/20.png": {
   "m": [
    0.99909,
    0.04249,
    22.27,
    -20.27
   ],
   "scale": 1.0,
   "rot_deg": 2.44,
   "shift": [
    2.1,
    -3.3
   ],
   "inliers": 127,
   "residual_px": 0.73,
   "ref_residual_px": {
    "eyeL": 1.4,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_f2_loop_20.png",
    "rect": [171, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_f2_loop_20_u.png",
    "rect": [301, 376, 229, 108]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_f2_loop/21.png": {
   "m": [
    0.99969,
    0.04313,
    22.25,
    -20.87
   ],
   "scale": 1.0006,
   "rot_deg": 2.47,
   "shift": [
    2.1,
    -3.4
   ],
   "inliers": 141,
   "residual_px": 0.8,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_f2_loop_21.png",
    "rect": [171, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_f2_loop_21_u.png",
    "rect": [301, 375, 229, 109]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_f2_loop/22.png": {
   "m": [
    1.00012,
    0.04517,
    22.82,
    -22.04
   ],
   "scale": 1.0011,
   "rot_deg": 2.59,
   "shift": [
    1.8,
    -3.5
   ],
   "inliers": 133,
   "residual_px": 0.6,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_f2_loop_22.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_f2_loop_22_u.png",
    "rect": [301, 375, 229, 109]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_f2_loop/23.png": {
   "m": [
    0.99978,
    0.04591,
    23.25,
    -22.29
   ],
   "scale": 1.0008,
   "rot_deg": 2.63,
   "shift": [
    1.8,
    -3.6
   ],
   "inliers": 141,
   "residual_px": 0.68,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_f2_loop_23.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_f2_loop_23_u.png",
    "rect": [301, 375, 229, 109]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_f2_loop/24.png": {
   "m": [
    0.99979,
    0.04652,
    23.45,
    -22.6
   ],
   "scale": 1.0009,
   "rot_deg": 2.66,
   "shift": [
    1.7,
    -3.7
   ],
   "inliers": 128,
   "residual_px": 0.64,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_f2_loop_24.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_f2_loop_24_u.png",
    "rect": [300, 375, 230, 109]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_f2_loop/25.png": {
   "m": [
    1.00035,
    0.04597,
    22.96,
    -22.52
   ],
   "scale": 1.0014,
   "rot_deg": 2.63,
   "shift": [
    1.7,
    -3.6
   ],
   "inliers": 122,
   "residual_px": 0.56,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_f2_loop_25.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_f2_loop_25_u.png",
    "rect": [300, 375, 230, 109]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 3,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_f2_loop/26.png": {
   "m": [
    1.0003,
    0.04381,
    22.22,
    -21.48
   ],
   "scale": 1.0013,
   "rot_deg": 2.51,
   "shift": [
    2.0,
    -3.4
   ],
   "inliers": 145,
   "residual_px": 0.79,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_f2_loop_26.png",
    "rect": [171, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_f2_loop_26_u.png",
    "rect": [301, 375, 229, 109]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_f2_loop/27.png": {
   "m": [
    1.00068,
    0.04427,
    22.25,
    -21.85
   ],
   "scale": 1.0017,
   "rot_deg": 2.53,
   "shift": [
    1.9,
    -3.4
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
   "mask": {
    "file": "track/shrug_f2_loop_27.png",
    "rect": [171, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_f2_loop_27_u.png",
    "rect": [301, 375, 229, 109]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_f2_loop/28.png": {
   "m": [
    1.00029,
    0.04401,
    22.38,
    -21.57
   ],
   "scale": 1.0013,
   "rot_deg": 2.52,
   "shift": [
    2.0,
    -3.4
   ],
   "inliers": 143,
   "residual_px": 0.8,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_f2_loop_28.png",
    "rect": [171, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_f2_loop_28_u.png",
    "rect": [301, 375, 229, 109]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 4,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_f2_loop/29.png": {
   "m": [
    1.00029,
    0.04354,
    22.1,
    -21.34
   ],
   "scale": 1.0012,
   "rot_deg": 2.49,
   "shift": [
    2.0,
    -3.4
   ],
   "inliers": 134,
   "residual_px": 0.62,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_f2_loop_29.png",
    "rect": [171, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_f2_loop_29_u.png",
    "rect": [301, 375, 229, 109]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_f2_loop/30.png": {
   "m": [
    0.99994,
    0.0431,
    22.02,
    -21.06
   ],
   "scale": 1.0009,
   "rot_deg": 2.47,
   "shift": [
    1.9,
    -3.5
   ],
   "inliers": 144,
   "residual_px": 0.69,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_f2_loop_30.png",
    "rect": [171, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_f2_loop_30_u.png",
    "rect": [301, 375, 229, 109]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_f2_loop/31.png": {
   "m": [
    1.00057,
    0.04269,
    21.53,
    -21.16
   ],
   "scale": 1.0015,
   "rot_deg": 2.44,
   "shift": [
    1.9,
    -3.4
   ],
   "inliers": 147,
   "residual_px": 0.68,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_f2_loop_31.png",
    "rect": [171, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_f2_loop_31_u.png",
    "rect": [300, 375, 230, 109]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_f2_loop/32.png": {
   "m": [
    0.99959,
    0.04167,
    21.44,
    -20.34
   ],
   "scale": 1.0005,
   "rot_deg": 2.39,
   "shift": [
    1.9,
    -3.5
   ],
   "inliers": 146,
   "residual_px": 0.66,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_f2_loop_32.png",
    "rect": [171, 218, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_f2_loop_32_u.png",
    "rect": [301, 375, 229, 109]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_f2_loop/33.png": {
   "m": [
    0.99968,
    0.03982,
    20.47,
    -19.46
   ],
   "scale": 1.0005,
   "rot_deg": 2.28,
   "shift": [
    1.8,
    -3.3
   ],
   "inliers": 140,
   "residual_px": 0.69,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 1.4,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_f2_loop_33.png",
    "rect": [171, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_f2_loop_33_u.png",
    "rect": [300, 376, 230, 108]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_f2_loop/34.png": {
   "m": [
    1.00068,
    0.03828,
    19.08,
    -19.13
   ],
   "scale": 1.0014,
   "rot_deg": 2.19,
   "shift": [
    1.6,
    -3.2
   ],
   "inliers": 142,
   "residual_px": 0.55,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_f2_loop_34.png",
    "rect": [171, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_f2_loop_34_u.png",
    "rect": [300, 376, 230, 108]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 6,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_f2_loop/35.png": {
   "m": [
    1.00073,
    0.03465,
    17.31,
    -17.45
   ],
   "scale": 1.0013,
   "rot_deg": 1.98,
   "shift": [
    1.5,
    -2.9
   ],
   "inliers": 165,
   "residual_px": 0.65,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 1.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_f2_loop_35.png",
    "rect": [170, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_f2_loop_35_u.png",
    "rect": [300, 376, 230, 108]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_f2_loop/36.png": {
   "m": [
    1.00046,
    0.03008,
    15.16,
    -15.12
   ],
   "scale": 1.0009,
   "rot_deg": 1.72,
   "shift": [
    1.4,
    -2.6
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
   "mask": {
    "file": "track/shrug_f2_loop_36.png",
    "rect": [170, 219, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_f2_loop_36_u.png",
    "rect": [299, 377, 230, 107]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 11,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_f2_loop/37.png": {
   "m": [
    1.0012,
    0.02583,
    12.65,
    -13.39
   ],
   "scale": 1.0015,
   "rot_deg": 1.48,
   "shift": [
    1.1,
    -2.3
   ],
   "inliers": 160,
   "residual_px": 0.56,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_f2_loop_37.png",
    "rect": [170, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_f2_loop_37_u.png",
    "rect": [299, 378, 230, 106]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 14,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_f2_loop/38.png": {
   "m": [
    1.00169,
    0.02021,
    9.66,
    -10.91
   ],
   "scale": 1.0019,
   "rot_deg": 1.16,
   "shift": [
    0.9,
    -1.9
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
   "mask": {
    "file": "track/shrug_f2_loop_38.png",
    "rect": [170, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_f2_loop_38_u.png",
    "rect": [299, 379, 229, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 10,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_f2_loop/39.png": {
   "m": [
    1.0018,
    0.01566,
    7.32,
    -8.77
   ],
   "scale": 1.0019,
   "rot_deg": 0.9,
   "shift": [
    0.8,
    -1.5
   ],
   "inliers": 181,
   "residual_px": 0.6,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 0.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_f2_loop_39.png",
    "rect": [170, 220, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_f2_loop_39_u.png",
    "rect": [298, 379, 231, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 5,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_f2_loop/40.png": {
   "m": [
    1.00228,
    0.01191,
    5.14,
    -7.15
   ],
   "scale": 1.0023,
   "rot_deg": 0.68,
   "shift": [
    0.5,
    -1.2
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
   "mask": {
    "file": "track/shrug_f2_loop_40.png",
    "rect": [170, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_f2_loop_40_u.png",
    "rect": [298, 380, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 11,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_f2_loop/41.png": {
   "m": [
    1.00271,
    0.00909,
    3.47,
    -5.98
   ],
   "scale": 1.0028,
   "rot_deg": 0.52,
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
   "mask": {
    "file": "track/shrug_f2_loop_41.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_f2_loop_41_u.png",
    "rect": [297, 380, 231, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 8,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_f2_loop/42.png": {
   "m": [
    1.00286,
    0.00671,
    2.18,
    -4.92
   ],
   "scale": 1.0029,
   "rot_deg": 0.38,
   "shift": [
    0.2,
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
   "mask": {
    "file": "track/shrug_f2_loop_42.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_f2_loop_42_u.png",
    "rect": [297, 380, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_f2_loop/43.png": {
   "m": [
    1.00273,
    0.0048,
    1.26,
    -3.92
   ],
   "scale": 1.0027,
   "rot_deg": 0.27,
   "shift": [
    0.1,
    -0.7
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
   "mask": {
    "file": "track/shrug_f2_loop_43.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_f2_loop_43_u.png",
    "rect": [297, 380, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_f2_loop/44.png": {
   "m": [
    1.00248,
    0.00324,
    0.57,
    -3.06
   ],
   "scale": 1.0025,
   "rot_deg": 0.19,
   "shift": [
    0.1,
    -0.6
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
   "mask": {
    "file": "track/shrug_f2_loop_44.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_f2_loop_44_u.png",
    "rect": [297, 380, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 10,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_f2_loop/45.png": {
   "m": [
    1.00258,
    0.00201,
    -0.12,
    -2.55
   ],
   "scale": 1.0026,
   "rot_deg": 0.11,
   "shift": [
    -0.0,
    -0.5
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
   "mask": {
    "file": "track/shrug_f2_loop_45.png",
    "rect": [169, 221, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_f2_loop_45_u.png",
    "rect": [297, 380, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 10,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_f2_loop/46.png": {
   "m": [
    1.00252,
    0.00124,
    -0.5,
    -2.18
   ],
   "scale": 1.0025,
   "rot_deg": 0.07,
   "shift": [
    -0.1,
    -0.5
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
   "mask": {
    "file": "track/shrug_f2_loop_46.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_f2_loop_46_u.png",
    "rect": [297, 380, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 10,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_f2_loop/47.png": {
   "m": [
    1.00182,
    0.00046,
    -0.58,
    -1.41
   ],
   "scale": 1.0018,
   "rot_deg": 0.03,
   "shift": [
    -0.0,
    -0.4
   ],
   "inliers": 196,
   "residual_px": 0.5,
   "ref_residual_px": {
    "eyeL": 0.0,
    "eyeR": 0.0,
    "mouth": 0.0,
    "nose": 0.0,
    "pin": 1.0
   },
   "ok": true,
   "mask": {
    "file": "track/shrug_f2_loop_47.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_f2_loop_47_u.png",
    "rect": [297, 380, 230, 105]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 9,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/shrug_f2_loop/48.png": {
   "m": [
    1.00048,
    7e-05,
    -0.17,
    -0.35
   ],
   "scale": 1.0005,
   "rot_deg": 0.0,
   "shift": [
    -0.0,
    -0.1
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
   "mask": {
    "file": "track/shrug_f2_loop_48.png",
    "rect": [169, 222, 484, 402],
    "halves": [
     "under_hair",
     "over_hair"
    ]
   },
   "under": {
    "file": "track/shrug_f2_loop_48_u.png",
    "rect": [297, 381, 230, 104]
   },
   "yield_eye_px": 0,
   "yield_px": 0,
   "cover_alien_px": 0,
   "occluded": 0.0,
   "w": 1.0
  },
  "frames/spin_d5_loop/00.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/01.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/02.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/03.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/04.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/05.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/06.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/07.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/08.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/09.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/10.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/11.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/12.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/13.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/14.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/15.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/16.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/17.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/18.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/19.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/20.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/21.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/22.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/23.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/24.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/25.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/26.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/27.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/28.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/29.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/30.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/31.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/32.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/33.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/34.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/35.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/36.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/37.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/38.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/39.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/40.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/41.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/42.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/43.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/44.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/45.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/46.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/47.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/48.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/49.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/50.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/51.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/52.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/53.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/54.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/55.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/56.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/57.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/58.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/59.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/60.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/61.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/62.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/63.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/64.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/65.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/66.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/67.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/68.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/69.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/70.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/71.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/72.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/73.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/74.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/75.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/76.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/77.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/78.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/79.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d5_loop/80.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/00.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/01.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/02.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/03.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/04.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/05.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/06.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/07.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/08.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/09.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/10.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/11.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/12.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/13.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/14.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/15.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/16.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/17.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/18.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/19.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/20.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/21.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/22.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/23.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/24.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/25.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/26.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/27.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/28.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/29.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/30.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/31.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/32.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/33.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/34.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/35.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/36.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/37.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/38.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/39.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/40.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/41.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/42.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/43.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/44.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/45.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/46.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/47.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/48.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/49.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/50.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/51.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/52.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/53.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/54.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/55.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/56.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/57.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/58.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/59.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/60.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/61.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/62.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/63.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/64.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/65.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/66.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/67.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/68.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/69.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/70.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/71.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/72.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/73.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/74.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/75.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/76.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/77.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/78.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/79.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_d6_loop/80.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/00.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/01.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/02.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/03.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/04.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/05.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/06.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/07.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/08.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/09.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/10.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/11.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/12.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/13.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/14.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/15.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/16.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/17.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/18.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/19.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/20.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/21.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/22.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/23.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/24.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/25.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/26.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/27.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/28.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/29.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/30.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/31.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/32.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/33.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/34.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/35.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/36.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/37.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/38.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/39.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/40.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/41.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/42.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/43.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/44.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/45.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/46.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/47.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/48.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/49.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/50.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/51.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/52.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/53.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/54.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/55.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/56.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/57.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/58.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/59.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/60.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/61.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/62.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/63.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/64.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/65.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/66.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/67.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/68.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/69.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/70.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/71.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/72.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/73.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/74.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/75.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/76.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/77.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/78.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/79.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_f1_loop/80.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/00.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/01.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/02.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/03.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/04.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/05.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/06.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/07.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/08.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/09.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/10.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/11.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/12.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/13.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/14.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/15.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/16.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/17.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/18.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/19.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/20.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/21.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/22.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/23.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/24.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/25.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/26.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/27.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/28.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/29.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/30.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/31.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/32.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/33.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/34.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/35.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/36.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/37.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/38.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/39.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/40.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/41.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/42.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/43.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/44.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/45.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/46.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/47.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/48.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/49.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/50.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/51.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/52.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/53.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/54.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/55.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/56.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/57.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/58.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/59.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/60.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/61.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/62.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/63.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/64.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/65.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/66.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/67.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/68.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/69.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/70.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/71.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/72.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/73.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/74.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/75.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/76.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/77.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/78.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/79.png": {
   "ok": false,
   "w": 0
  },
  "frames/spin_loop/80.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/00.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/01.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/02.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/03.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/04.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/05.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/06.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/07.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/08.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/09.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/10.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/11.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/12.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/13.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/14.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/15.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/16.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/17.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/18.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/19.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/20.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/21.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/22.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/23.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/24.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/25.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/26.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/27.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/28.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/29.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/30.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/31.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/32.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/33.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/34.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/35.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/36.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/37.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/38.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/39.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/40.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/41.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/42.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/43.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/44.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/45.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/46.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/47.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/48.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/49.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/50.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/51.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/52.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/53.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/54.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/55.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/56.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/57.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/58.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/59.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/60.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/61.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/62.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/63.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/64.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/65.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/66.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/67.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/68.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/69.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/70.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/71.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/72.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/73.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/74.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/75.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/76.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/77.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/78.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/79.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_d4_loop/80.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/00.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/01.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/02.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/03.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/04.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/05.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/06.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/07.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/08.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/09.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/10.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/11.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/12.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/13.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/14.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/15.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/16.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/17.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/18.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/19.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/20.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/21.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/22.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/23.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/24.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/25.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/26.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/27.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/28.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/29.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/30.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/31.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/32.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/33.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/34.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/35.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/36.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/37.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/38.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/39.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/40.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/41.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/42.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/43.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/44.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/45.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/46.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/47.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/48.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/49.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/50.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/51.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/52.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/53.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/54.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/55.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/56.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/57.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/58.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/59.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/60.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/61.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/62.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/63.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/64.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/65.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/66.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/67.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/68.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/69.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/70.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/71.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/72.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/73.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/74.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/75.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/76.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/77.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/78.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/79.png": {
   "ok": false,
   "w": 0
  },
  "frames/turn_loop/80.png": {
   "ok": false,
   "w": 0
  }
 },
 "headTrackBasis": "idle",
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
 "browRule": {
  "thresh_line_px": 1.2,
  "run_frames": 3,
  "note": "见 clips/brow_ok.py"
 }
};
