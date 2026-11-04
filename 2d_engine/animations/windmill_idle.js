import { keys_generate_loop,keys_blend_with_value, keys_generate_fix_size_loop } from "../template/animation_utils.js";

export var windmill_idle = {
    "default_settings":
    {
        "in_tan" : { "orient" : "neighbor", "length" : "auto4"},
        "out_tan" : { "orient" : "neighbor", "length" : "auto4"},
        "loop" : 2,
        "loop_mode" : "loop",// "loop","pingpong"
        "loop_range_mode" : "obj",//"obj","attr"
    },
}

windmill_idle["root"] = {
    "translateY" : keys_generate_fix_size_loop( 400 , [ 0, 35 , 0, -35,  0 ], 3  ),
    "translateX" : keys_generate_fix_size_loop( 400 , [ 0, 5  , 0, -5 ,  0 ], 2  ),
    "rotate"     : keys_generate_fix_size_loop( 400 , [ 0, 200, 0, -230, 0]  ),
}



let obj_names_rectangles = [
    "rectangle_translate_top", 
    "rectangle_translate_left", 
    "rectangle_translate_down", 
    "rectangle_translate_right"]
for( let n of obj_names_rectangles )
{
    windmill_idle[n] = {
        "translateY" : keys_generate_fix_size_loop( 400 , [ 0, 30, 30, 0, 0]  ),
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
        "translateY" : keys_generate_fix_size_loop( 400 , [ 0, 20, 20, 0, 0]  ),
          
    }
}

    

