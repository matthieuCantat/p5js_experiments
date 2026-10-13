

export var windmill_idle = {
    "default_settings":
    {
        "in_tan" : { "orient" : "neighbor", "length" : "auto4"},
        "out_tan" : { "orient" : "neighbor", "length" : "auto4"},
        "loop" : 2,
        "loop_mode" : "loop",// "loop","pingpong"
        "loop_range_mode" : "obj",//"obj","attr"
    },
    "root" : {
        "translateY" : [
            { "t" : 0   , "v" : 0 },
            { "t" : 25  , "v" : 100 },
            { "t" : 50  , "v" : 0 },
            { "t" : 75  , "v" : -100 },
            { "t" : 100 , "v" : 0 }            
        ],
        "translateX" : [
            { "t" : 0   , "v" : 0 },
            { "t" : 40  , "v" : 5 },
            { "t" : 80  , "v" : 0 },
            { "t" : 120  , "v" : -5 },
            { "t" : 160 , "v" : 0 }            
        ],
        "rotate" : [
            { "t" : 0 , "v" : 0 },
            { "t" : 100 , "v" : 180 },
            { "t" : 200 , "v" : 0 }
        ]
    },
}


let obj_names_rectangles = [
    "rectangle_translate_top", 
    "rectangle_translate_left", 
    "rectangle_translate_down", 
    "rectangle_translate_right"]
for( let n of obj_names_rectangles )
{
    windmill_idle[n] = {
        "translateY" : [
            { "t" : 0   , "v" : 0 },
            { "t" : 25  , "v" : 30 },
            { "t" : 75  , "v" : 30 },
            { "t" : 90  , "v" : 0 },          
            { "t" : 125 , "v" : 0 }  
        ]
    }
}

let obj_names_trap = [
    "trap_topRight", 
    "trap_downRight", 
    "trap_downLeft", 
    "trap_topLeft"]
for( let n of obj_names_trap )
{
    windmill_idle[n] = {
        "translateY" : [
            { "t" : 0   , "v" : 0 },
            { "t" : 50  , "v" : 20 },
            { "t" : 75  , "v" : 20 },
            { "t" : 90 , "v" : 0 },          
            { "t" : 125 , "v" : 0 }  
        ]
    }
}