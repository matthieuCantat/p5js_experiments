

export var windmill_transformation = {
    "default_settings":
    {
        "in_tan" : { "orient" : "linear", "length" : "auto5"},
        "out_tan" : { "orient" : "linear", "length" : "auto5"},
        "loop" : 35,
        "loop_mode" : "pingpong",// loop pingpong
        "loop_range_mode" : "obj",//"attr"
        "offset":20,
    },
}

let d = 10

let tA = 40 
let tB = 100
let tC = 130

windmill_transformation["round_center"] = {
    "scaleX" : [
        { "t" : 0   , "v" : 1 },
        { "t" : 5   , "v" : 1.5 },
        { "t" : 20  , "v" : 1 },           
    ],
    "scaleY" : [
        { "t" : 0   , "v" : 1 },
        { "t" : 5   , "v" : 1.5 },
        { "t" : 20  , "v" : 1 },           
    ],
}



let obj_names_rectangles = [
    "rectangle_translate_top", 
    "rectangle_translate_left", 
    "rectangle_translate_down", 
    "rectangle_translate_right"]
for( let n of obj_names_rectangles )
{
    windmill_transformation[n] = {
        "translateY" : [
            { "t" : 0      , "v" : 0 },
            { "t" : 4      , "v" : 0  , "out_tan" : { "orient" : "flat", "length" : "auto3"}  },  
            { "t" : tA     , "v" : 100, "in_tan" : { "orient" : "flat", "length" : "auto3" } },  
            { "t" : tA+d   , "v" : 100 },  
            { "t" : tB     , "v" : 100 },       
            { "t" : tB+d   , "v" : 100 },   
            { "t" : tC     , "v" : 0 },  
            { "t" : tC+d   , "v" : 0 },  
            { "t" : tC+d+20, "v" : 0 },  
        ]
    }
}



windmill_transformation["rectangle_rotate_top"] = {
    "rotate" : [
        { "t" : tA+d  , "v" : 0 },       
        { "t" : tB  , "v" : 90 },  
    ]
}


windmill_transformation["rectangle_rotate_left"] = {
    "rotate" : [
        { "t" : tA+d  , "v" : 0 },       
        { "t" : tB  , "v" : 180 },  
    ]
}

windmill_transformation["rectangle_rotate_down"] = {
    "rotate" : [
        { "t" : tA+d  , "v" : 0 },       
        { "t" : tB  , "v" : 270 },  
    ]
}




windmill_transformation["traps"] = {
    "rotate" : [
        { "t" : tA+d  , "v" : 0},       
        { "t" : tB  , "v" : 270 },  
    ]
}

let obj_names_trap = [
    "trap_topRight", 
    "trap_downRight", 
    "trap_downLeft", 
    "trap_topLeft"]
for( let n of obj_names_trap )
{
    windmill_transformation[n] = {
        "translateY" : [
            { "t" : 0     , "v" : 0 },
            { "t" : 4     , "v" : 0  , "out_tan" : { "orient" : "flat", "length" : "auto3"}  },  
            { "t" : tA    , "v" : 25, "in_tan" : { "orient" : "flat", "length" : "auto3" } },              
            { "t" : tA+d  , "v" : 25 },       
            { "t" : tB    , "v" : -25 },              
        ],
        "rotate" : [   
            { "t" : tB+d  , "v" : 0 },  
            { "t" : tC  , "v" : 45 },              
        ]
    }
}
    
