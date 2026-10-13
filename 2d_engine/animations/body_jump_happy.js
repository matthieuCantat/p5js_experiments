

export var body_jump_happy ={
    "default_settings":
    {
        "in_tan" : { "orient" : "neighbor", "length" : "auto4"},
        "out_tan" : { "orient" : "neighbor", "length" : "auto4"}
    },
    "body_A" : {
        "translateY" : [
            { "t" : 5   , "v" : 0},
            { "t" : 10 , "v" :  -10 },
            { "t" : 50  , "v" : 500},
            { "t" : 100 , "v" : 0, "in_tan" : { "orient" : "linear"}, "out_tan" : { "orient" : "linear"} },
            { "t" : 150  , "v" : 100},
            { "t" : 200 , "v" : 0},
        ],
        "scaleY" : [
            { "t" : 5 , "v" : 1 },
            { "t" : 10 , "v" : 0.8 },
            { "t" : 50 , "v" : 1.1 },
            { "t" : 100 , "v" : 1 },
            { "t" : 200 , "v" : 1 }
        ],
        "_visibility" : [
            { "t" : 5 , "v" : 1 },
            { "t" : 50 , "v" : 1 },
            { "t" : 100 , "v" : 0 },
            { "t" : 200 , "v" : 0 }
        ],
        "colorX" : [
            { "t" : 5 , "v" : 255 },
            { "t" : 50 , "v" : 0 },
            { "t" : 100 , "v" : 255 },
            { "t" : 200 , "v" : 0 }
        ],
        "colorY" : [
            { "t" : 40 , "v" : 0 },
            { "t" : 70 , "v" : 0 },
            { "t" : 100 , "v" : 255 },
            { "t" : 200 , "v" : 0 }
        ]
        ,
        "colorZ" : [
            { "t" : 40 , "v" : 0 },
            { "t" : 70 , "v" : 0 },
            { "t" : 100 , "v" : 255 },
            { "t" : 200 , "v" : 0 }
        ],
        "colorStrokeZ" : [
            { "t" : 5 , "v" : 255 },
            { "t" : 50 , "v" : 0 },
            { "t" : 100 , "v" : 255 },
            { "t" : 200 , "v" : 0 }
        ]
    }
}
