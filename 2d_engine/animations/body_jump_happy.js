

import { keys_generate_loop,keys_blend_with_value } from "../template/animation_utils.js";

export var body_jump_happy ={
    "default_settings":
    {
        "in_tan" : { "orient" : "neighbor", "length" : "auto8"},
        "out_tan" : { "orient" : "neighbor", "length" : "auto8"},
        "loop" : 1,
        "loop_mode" : "loop",// "loop","pingpong"        
        "loop_range_mode" : "obj",//"obj","attr"
    },
    "body_A" : {
        "translateY" : [
            { "t" : 5   , "v" : 0},
            { "t" : 10 , "v" :  -10 , "in_tan" : { "orient" : -90   , "length" : "auto8" }, "out_tan" : { "orient" : 90    , "length" : "auto8"} },
            { "t" : 50  , "v" : 500 , "in_tan" : { "orient" : "flat", "length" : "auto8" }, "out_tan" : { "orient" : "flat", "length" : "auto8"} },
            { "t" : 100 , "v" : 0   , "in_tan" : { "orient" : -90   , "length" : "auto8" }, "out_tan" : { "orient" : 90    , "length" : "auto8"} },
            { "t" : 150 , "v" : 200, "in_tan" : { "orient" : "flat", "length" : "auto8" }, "out_tan" : { "orient" : "flat", "length" : "auto8"} },
            { "t" : 200 , "v" : 0   , "in_tan" : { "orient" : -90   , "length" : "auto8" }, "out_tan" : { "orient" : 90    , "length" : "auto8"} },
            { "t" : 250 , "v" : 50  , "in_tan" : { "orient" : "flat", "length" : "auto8" }, "out_tan" : { "orient" : "flat", "length" : "auto8"} },
            { "t" : 300 , "v" : 0   , "in_tan" : { "orient" : -90   , "length" : "auto8" }, "out_tan" : { "orient" : 90    , "length" : "auto8"} },
                
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
        "colorX" : keys_blend_with_value( keys_generate_loop( 20, [0,255], 20, 5), 255, 20 ),
        "colorY" : keys_blend_with_value( keys_generate_loop( 15, [0,255], 20, 5),   0, 20 ),
        "colorZ" : keys_blend_with_value( keys_generate_loop( 15, [0,255], 20, 5),   0, 20 ),
        "colorStrokeX" : keys_blend_with_value( keys_generate_loop( 20, [0,255], 20, 10),  0, 20 ),
        "colorStrokeY" : keys_blend_with_value( keys_generate_loop( 15, [0,255], 20, 10),  0, 20 ),
        "colorStrokeZ" : keys_blend_with_value( keys_generate_loop( 15, [0,255], 20, 10),  0, 20 ),
    }
}
