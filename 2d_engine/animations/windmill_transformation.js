

export var windmill_transformation = {
    "default_settings":
    {
        "in_tan" : { "orient" : "neighbor", "length" : "auto6"},
        "out_tan" : { "orient" : "neighbor", "length" : "auto6"},
        "loop" : 15,
        "loop_mode" : "pingpong",// loop pingpong
        "loop_range_mode" : "obj",//"attr"
    },
}
/*
windmill_transformation["round_center"] = {
    "scaleX" : [
        { "t" : 0   , "v" : 1 },
        { "t" : 5  , "v" : 1.5 },
        { "t" : 10  , "v" : 1 },           
    ],
    "scaleY" : [
        { "t" : 0   , "v" : 1 },
        { "t" : 5  , "v" : 1.5 },
        { "t" : 10  , "v" : 1 },           
    ],
}
*/


let obj_names_rectangles = [
    "rectangle_translate_top", 
    "rectangle_translate_left", 
    "rectangle_translate_down", 
    "rectangle_translate_right"]
for( let n of obj_names_rectangles )
{
    windmill_transformation[n] = {
        "translateY" : [
            { "t" : 0   , "v" : 0 },
            { "t" : 12  , "v" : 0 },  
            { "t" : 20  , "v" : 100 },  
            { "t" : 65  , "v" : 100 },       
            { "t" : 80  , "v" : 0 },  
        ]
    }
}



windmill_transformation["rectangle_rotate_top"] = {
    "rotate" : [
        { "t" : 25  , "v" : 0 },       
        { "t" : 65  , "v" : 90 },  
    ]
}


windmill_transformation["rectangle_rotate_left"] = {
    "rotate" : [
        { "t" : 25  , "v" : 0 },       
        { "t" : 65  , "v" : 180 },  
    ]
}

windmill_transformation["rectangle_rotate_down"] = {
    "rotate" : [
        { "t" : 25  , "v" : 0 },       
        { "t" : 65  , "v" : 270 },  
    ]
}




windmill_transformation["traps"] = {
    "rotate" : [
        { "t" : 25  , "v" : 0},       
        { "t" : 65  , "v" : 270 },  
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
            { "t" : 25  , "v" : 0 },       
            { "t" : 65  , "v" : -25 },              
        ],
        "rotate" : [
            { "t" : 65  , "v" : 0 },       
            { "t" : 80  , "v" : 45 },              
        ]
    }
}
    
