import { keys_generate_loop,keys_blend_with_value } from "../template/animation_utils.js";

export var windmill_idle = {
    "default_settings":
    {
        "in_tan" : { "orient" : "neighbor", "length" : "auto6"},
        "out_tan" : { "orient" : "neighbor", "length" : "auto6"},
        "loop" : 15,
        "loop_mode" : "loop",// "loop","pingpong"
        "loop_range_mode" : "obj",//"obj","attr"
    },
}

windmill_idle["root"] = {
    "translateY" : keys_generate_loop( 25, [0,100,0,-100], 10, 0),
    "translateX" : keys_generate_loop( 30, [0,5,0,-5], 10, 0),
    "rotate"     : keys_generate_loop( 100, [0,180,0], 3, 0),
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
    

