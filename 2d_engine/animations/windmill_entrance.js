

export var windmill_entrance = {
    "default_settings":
    {
        "in_tan" : { "orient" : "neighbor", "length" : "auto5"},
        "out_tan" : { "orient" : "neighbor", "length" : "auto5"},
        "loop" : 0,
        "loop_mode" : "pingpong",// loop pingpong
        "loop_range_mode" : "obj",//"attr"
        "offset":20,
    },
}

let d = 10

let tTop = 25
let tA = 50 
let tB = 70
let tC = 90


windmill_entrance['root'] = {
    "rotate" : [
        { "t" : 0       , "v" : -40 },
        { "t" : tTop    , "v" : -90 },
        { "t" : tA-d  , "v" : -90 , "out_tan" : { "orient" : "flat", "length" : "auto4"}},
        { "t" : tB   , "v" : -0 , "in_tan" : { "orient" : "flat", "length" : "auto4"}},
    ],
    "translateY" : [
        { "t" : 0       , "v" : -500  , "out_tan" : { "orient" : 90, "length" : "auto15"}}, 
        { "t" : tTop    , "v" : 100 , "in_tan" : { "orient" : "flat", "length" : "auto15"}},       
        { "t" : tTop+5  , "v" : 100 },   
        { "t" : tA+20   , "v" : 0 },   
    ]
}


let obj_names_rectangles = [
    "rectangle_translate_top", 
    "rectangle_translate_left", 
    "rectangle_translate_down", 
    "rectangle_translate_right"]
for( let n of obj_names_rectangles )
{
    windmill_entrance[n] = {
        "translateY" : [
            { "t" : 0      , "v" : 20 },
            { "t" : tTop-7 , "v" : 20  },  
            { "t" : tTop+15 , "v" : 100  },  
            { "t" : tA     , "v" : 100 },  
            { "t" : tA+d   , "v" : 100 },  
            { "t" : tB     , "v" : 100 },       
            { "t" : tB+d   , "v" : 100 },   
            { "t" : tC     , "v" : 0 },  
            { "t" : tC+d   , "v" : 0 },  
         
        ]
    }
}



windmill_entrance["rectangle_rotate_top"] = {
    "rotate" : [
        { "t" : tA-d  , "v" : 90, "out_tan" : { "orient" : "flat", "length" : "auto10"}},       
        { "t" : tB  , "v" : 0 , "in_tan" : { "orient" : "flat", "length" : "auto10"}}, 
    ]
}


windmill_entrance["rectangle_rotate_left"] = {
    "rotate" : [
        { "t" : tA-d  , "v" : 180, "out_tan" : { "orient" : "flat", "length" : "auto10"}},       
        { "t" : tB  , "v" : 0 , "in_tan" : { "orient" : "flat", "length" : "auto10"}},
    ]
}

windmill_entrance["rectangle_rotate_down"] = {
    "rotate" : [
        { "t" : tA-d  , "v" : 270, "out_tan" : { "orient" : "flat", "length" : "auto10"}},      
        { "t" : tB  , "v" : 0 , "in_tan" : { "orient" : "flat", "length" : "auto10"}},
    ]
}




windmill_entrance["traps"] = {
    "rotate" : [
        { "t" : tA-d  , "v" : 270},       
        { "t" : tB  , "v" : 0 },  
    ]
}

let obj_names_trap = [
    "trap_topRight", 
    "trap_downRight", 
    "trap_downLeft", 
    "trap_topLeft"]
for( let n of obj_names_trap )
{
    windmill_entrance[n] = {
        "translateY" : [
            { "t" : tA     , "v" : -25 },    
            { "t" : tB    , "v" : 0 },              
        ],
        "rotate" : [   
            { "t" : tTop  , "v" : 45 },  
            { "t" : tA-10  , "v" : 0 },              
        ]
    }
}
    
