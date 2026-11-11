

export var windmill_explode = {
    "default_settings":
    {
        "in_tan" : { "orient" : "linear", "length" : "auto5"},
        "out_tan" : { "orient" : "linear", "length" : "auto5"},
        "loop" : 0,
        "loop_mode" : "pingpong",// loop pingpong
        "loop_range_mode" : "obj",//"attr"
        "offset":20,
    },
}

/////////////////////////////////////////////////////
//////////////////////////////////////// INIT
/////////////////////////////////////////////////////


windmill_explode['root'] = {
    "rotate" : [
        { "t" : 0       , "v" : 0 },
    ],
    "translateY" : [  
        { "t" : 0   , "v" : 0 },   
    ]
}


let obj_names_trap = [
    "trap_topRight", 
    "trap_downRight", 
    "trap_downLeft", 
    "trap_topLeft"]

for( let n of obj_names_trap )
{
    windmill_explode[n] = {
        "translateY" : [
            { "t" : 0     , "v" : -25 },                
        ],
        "rotate" : [   
            { "t" : 0  , "v" : 45 },           
        ],
    }
}


let obj_names_rectangles = [
    "rectangle_translate_top", 
    "rectangle_translate_left", 
    "rectangle_translate_down", 
    "rectangle_translate_right"]
for( let n of obj_names_rectangles )
{
    windmill_explode[n] = {
        "translateY" : [
            { "t" : 0      , "v" : 20 },
        ],
    }
}


windmill_explode["rectangle_rotate_top"] = {
    "rotate" : [
        { "t" : 0},       
    ]
}
windmill_explode["rectangle_rotate_left"] = {
    "rotate" : [
        { "t" : 0  , "v" : 180, },       
    ]
}

windmill_explode["rectangle_rotate_down"] = {
    "rotate" : [
        { "t" : 0  , "v" : 270},      
    ]
}
windmill_explode["traps"] = {
    "rotate" : [
        { "t" : 0  , "v" : 270},       
    ]
}


/////////////////////////////////////////////////////
//////////////////////////////////////// FIRST PHASE
/////////////////////////////////////////////////////

let dA = 4

let tA = 0 
let tB = 5
let tC = 10


windmill_explode["round_center"] = {
    "scaleX" : [
        { "t" : tA   , "v" : 1 },
        { "t" : tB   , "v" : 1.2 },
        { "t" : tC  , "v" : 1 },           
    ],
    "scaleY" : [
        { "t" : tA   , "v" : 1 },
        { "t" : tB   , "v" : 1.2 },
        { "t" : tC  , "v" : 1 },           
    ],
    "colorR" : [
        { "t" : tA+dA*0      , "v" : 255 },
        { "t" : tB+dA*0      , "v" : 255 },
        { "t" : tC+dA*0      , "v" : 255 },
    ],
    "colorG" : [
        { "t" : tA+dA*0      , "v" : 255 },
        { "t" : tB+dA*0      , "v" : 255 },
        { "t" : tC+dA*0      , "v" : 255 },
    ],
    "colorB" : [
        { "t" : tA+dA*0      , "v" : 0 },
        { "t" : tB+dA*0      , "v" : 255 },
        { "t" : tC+dA*0      , "v" : 0 },
    ],   
    "strokeSize" : [
        { "t" : tA      , "v" : 2 },
        { "t" : tB      , "v" : 2 },
        { "t" : tB+dA*2 , "v" : 2 },
        { "t" : tC+dA*2 , "v" : 1 },
    ], 
    "colorStrokeR" : [
        { "t" : tA+dA*1      , "v" : 0 },
        { "t" : tB+dA*1      , "v" : 255 },
        { "t" : tC+dA*1      , "v" : 0 },
    ],
    "colorStrokeG" : [
        { "t" : tA+dA*1      , "v" : 0 },
        { "t" : tB+dA*1      , "v" : 255 },
        { "t" : tC+dA*1      , "v" : 0 },
    ],
    "colorStrokeB" : [
        { "t" : tA+dA*1      , "v" : 0 },
        { "t" : tB+dA*1      , "v" : 255 },
        { "t" : tC+dA*1      , "v" : 0 },
    ],             

}


for( let i = 0 ; i < obj_names_trap.length ; i++ )
{
    let n = obj_names_trap[i]
    windmill_explode[n]["scaleX"] = [
        { "t" : tA+dA*1      , "v" : 1 },
        { "t" : tB+dA*1      , "v" : 1.2 },
        { "t" : tC+dA*1      , "v" : 1 },
    ]
    windmill_explode[n]["scaleY"] = [
        { "t" : tA+dA*1      , "v" : 1 },
        { "t" : tB+dA*1      , "v" : 1.2 },
        { "t" : tC+dA*1      , "v" : 1 },
    ]
    windmill_explode[n]["colorR"] = [
        { "t" : tA+dA*1      , "v" : 255 },
        { "t" : tB+dA*1      , "v" : 255 },
        { "t" : tC+dA*1      , "v" : 255 },
    ]
    windmill_explode[n]["colorG"] = [
        { "t" : tA+dA*1      , "v" : 0 },
        { "t" : tB+dA*1      , "v" : 255 },
        { "t" : tC+dA*1      , "v" : 0 },
    ]
    windmill_explode[n]["colorB"] = [
        { "t" : tA+dA*1      , "v" : 0 },
        { "t" : tB+dA*1      , "v" : 255 },
        { "t" : tC+dA*1      , "v" : 0 },
    ]
    windmill_explode[n]["strokeSize"] = [
        { "t" : tA      , "v" : 2 },
        { "t" : tB      , "v" : 2 },
        { "t" : tB+dA*2 , "v" : 2 },
        { "t" : tC+dA*2 , "v" : 1 },
    ]      
    windmill_explode[n]["colorStrokeR"] = [
        { "t" : tA+dA*2      , "v" : 0 },
        { "t" : tB+dA*2      , "v" : 255 },
        { "t" : tC+dA*2      , "v" : 0 },
    ]
    windmill_explode[n]["colorStrokeG"] = [
        { "t" : tA+dA*2      , "v" : 0 },
        { "t" : tB+dA*2      , "v" : 255 },
        { "t" : tC+dA*2      , "v" : 0 },
    ]
    windmill_explode[n]["colorStrokeB"] = [
        { "t" : tA+dA*2      , "v" : 0 },
        { "t" : tB+dA*2      , "v" : 255 },
        { "t" : tC+dA*2      , "v" : 0 },
    ]            
    
}



for( let i = 0 ; i < obj_names_rectangles.length ; i++ )
{
    let n = obj_names_rectangles[i]
    windmill_explode[n]["scaleX"] = [
        { "t" : tA+dA*2      , "v" : 1 },
        { "t" : tB+dA*2      , "v" : 1.2 },
        { "t" : tC+dA*2      , "v" : 1 },
    ]
    windmill_explode[n]["scaleY"] = [
        { "t" : tA+dA*2      , "v" : 1 },
        { "t" : tB+dA*2      , "v" : 1.2 },
        { "t" : tC+dA*2      , "v" : 1 },
    ]
    windmill_explode[n]["strokeSize"] = [
        { "t" : tA      , "v" : 2 },
        { "t" : tB      , "v" : 2 },
        { "t" : tB+dA*2 , "v" : 2 },
        { "t" : tC+dA*2 , "v" : 1 },
    ]  
    windmill_explode[n]["colorStrokeR"] = [
        { "t" : tA+dA*3      , "v" : 0 },
        { "t" : tB+dA*3      , "v" : 255 },
        { "t" : tC+dA*3      , "v" : 0 },
    ]
    windmill_explode[n]["colorStrokeG"] = [
        { "t" : tA+dA*3      , "v" : 0 },
        { "t" : tB+dA*3      , "v" : 255 },
        { "t" : tC+dA*3      , "v" : 0 },
    ]
    windmill_explode[n]["colorStrokeB"] = [
        { "t" : tA+dA*3      , "v" : 0 },
        { "t" : tB+dA*3      , "v" : 255 },
        { "t" : tC+dA*3      , "v" : 0 },
    ]       

}


/////////////////////////////////////////////////////
//////////////////////////////////////// SECOND PHASE
/////////////////////////////////////////////////////

let tD = 20
let tE = 50
let tF = 150



windmill_explode["round_center"]["translateY"] = []
windmill_explode["round_center"]["translateY"].push({ "t" : tD       , "v" : 0   })
windmill_explode["round_center"]["translateY"].push({ "t" : tD+dA*1  , "v" : -10  , "out_tan" : { "orient" : 90    , "length" : "auto8"} })
windmill_explode["round_center"]["translateY"].push({ "t" : tE       , "v" : 300   })
windmill_explode["round_center"]["translateY"].push({ "t" : tF       , "v" : -1200  })

windmill_explode["round_center"]["rotate"] = []
windmill_explode["round_center"]["rotate"].push({ "t" : tD     , "v" : 0 })
windmill_explode["round_center"]["rotate"].push({ "t" : tF     , "v" : 2000 })

for( let n of obj_names_trap )
{
    windmill_explode[n]["translateY"].push({ "t" : tD       , "v" : -25 })
    windmill_explode[n]["translateY"].push({ "t" : tD+dA*2  , "v" : -10 })
    windmill_explode[n]["translateY"].push({ "t" : tE       , "v" : -500 })


    windmill_explode[n]["rotate"].push({ "t" : tD     , "v" : 45 })
    windmill_explode[n]["rotate"].push({ "t" : tF     , "v" : 2000 })
      
}


for( let n of obj_names_rectangles )
{
    windmill_explode[n]["translateY"].push({ "t" : tD       , "v" : 20 })
    windmill_explode[n]["translateY"].push({ "t" : tD+dA*2  , "v" : 10 })
    windmill_explode[n]["translateY"].push({ "t" : tE       , "v" : 500 })
 
}
