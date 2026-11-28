import { get_objs } from "../template/scene_info_objs_utils.js";

//____________________________OBJS HIERARCHY
var hierarchy = {
    "root": {
        "m": [0,0,0,1,1],
        "user_interaction_A": {
            "m": [0, 70, 0, 1, 1],
        },
        "round_center": {
            "m": null,
        },
        "rectangle_rotate_top": {
            "m": null,
            "rectangle_translate_top" : {
                "m": [0, 70, 0, 1, 1],
            },
        },
        "rectangle_rotate_left": {
            "m": null,
            "rectangle_translate_left": {
                "m": [-70, 0, -90, 1, 1],
            },
        },
        "rectangle_rotate_down": {
            "m": null,
            "rectangle_translate_down": {
                "m": [0, -70, 180, 1, 1],
            },
        },
        "rectangle_rotate_right": {
            "m": null,
            "rectangle_translate_right": {
                "m": [70, 0, 90, 1, 1],
            },
        },
        "traps" : {
            "m": null,
            "trap_topRight_parent": {
                "m": [50, 50, 45, 1, 1], 
                "trap_topRight" : {
                    "m": null, 
                },
            },
            "trap_downRight_parent": {
                "m": [50, -50, 135, 1,1],
                "trap_downRight" : {
                    "m": null,
                },
            },
            "trap_topLeft_parent": {
                "m": [-50, 50, -45, 1, 1],
                "trap_topLeft" : {
                    "m": null,
                },
            },
            "trap_downLeft_parent": {
                "m": [-50, -50, -135, 1, 1],
                "trap_downLeft" : {
                    "m": null,
                },
            }
        }
    },        
}




//____________________________OBJS SHAPES

var shapes = {
    "round_center" : {
        shapes : [
            {
                m_local : [0, 0, 0, 18, 18],
                color: "yellow",
                type : 'circle',
                stroke_color: "black",
                stroke_width: 1,
            }
        ],
        interaction_shapes: [
            {
                m : [0, 0, 0, 18, 18],
                type: "circle",
            }
        ],
    },
}






var options = {
    "rectangle_rotate_top" : {
        transform_settings : {
            parent_limit_space : false,
            translate_limits: [[0,0],[-0,0]],
            rotate_limits: [0,90],
        },           
    },   
    "rectangle_rotate_left" : {
        transform_settings : {
            parent_limit_space : false,
            translate_limits: [[0,0],[-0,0]],
            rotate_limits: [0,180],
        },            
    },
    "rectangle_rotate_down" : {    
        transform_settings : {
            parent_limit_space : false,
            translate_limits: [[0,0],[-0,0]],
            rotate_limits: [0,270],
        },
    },
    "rectangle_rotate_right" : {        
        transform_settings : {
            parent_limit_space : false,
            translate_limits: [[0,0],[-0,0]],
            rotate_limits: [0,0],
        },
    },
}










let obj_names_rectangles = [
    "rectangle_translate_top", 
    "rectangle_translate_left", 
    "rectangle_translate_down", 
    "rectangle_translate_right"]
for( let n of obj_names_rectangles )
{
    shapes[n] = {
        shapes : [
            {
                m_local : [0, 0, 0, 8, 40],
                color: "white",
                type : 'rectangle',
                stroke_color: "black",
                stroke_width: 1,    
            }
        ]
    }
    options[n] = {
        transform_settings : {
            parent_limit_space : false,
            translate_limits: [[0,0],[-0,70]],
            rotate_limits: [0,0],
        }
    }
}








shapes["traps"] = {
    interaction_shapes: [
        {
            m : [0, 0, 0, 105, 105],
            "type": "circle",   
        }
    ],    
}
options["traps"] = {
    transform_settings : {
        parent_limit_space : false,
        translate_limits: [[0,0],[0,0]],
        //rotate_limits: [0,45],
    }    
}
options["traps"]["interaction_settings"] = {
    "enable": true,
    "coef": 0.2,
    "rotate_resolution_priority": 1.0,
    "radius_threshold": 0,
    "do_translation": true,
    priority : 1,
}
options["traps"]["dyn_settings"] = {
    'enable':true,
    'mass':1,
    'friction_translate':0.01,
    'friction_rotate':0.01,
    'speed_limit_translate': 3000,
    'speed_limit_rotate':100.3,		
}
options["traps"]["debug"] = {
    "shape_interaction_visibility": true,
}




shapes["round_center"]['interaction_shapes'] = [
        {
            m : [0, 0, 0, 30, 30],
            "type": "circle",   
        }
    ]

options["round_center"] = {
    transform_settings : {
        parent_limit_space : false,
        translate_limits: [[0,0],[0,0]],
        rotate_limits: [0,0],
    }    
}
options["round_center"]["interaction_settings"] = {
    "enable": true,
    "coef": 0.2,
    "rotate_resolution_priority": 1.0,
    "radius_threshold": 0,
    "do_translation": true,
    priority : 2,
}
options["round_center"]["dyn_settings"] = {
    'enable':true,
    'mass':1,
    'friction_translate':0.01,
    'friction_rotate':0.01,
    'speed_limit_translate': 3000,
    'speed_limit_rotate':100.3,		
}
options["round_center"]["debug"] = {
    "shape_interaction_visibility": true,
}





/*
//________________________________________________________rectangle_translate_down

shapes["rectangle_translate_down"].interaction_shapes = [
    {
        m_local : [0, 0, 0, 60, 60],
        "type": "rectangle",   
    }
]
options["rectangle_translate_down"]["interaction_settings"] = {
    "enable": true,
    "coef": 0.2,
    "rotate_resolution_priority": 1.0,
    "radius_threshold": 0,
    "do_translation": true,
    priority : 3,
}
options["rectangle_translate_down"]["dyn_settings"] = {
    'enable':true,
    'mass':1,
    'friction_translate':0.01,
    'friction_rotate':0.01,
    'speed_limit_translate': 3000,
    'speed_limit_rotate':100.3,		
}
options["rectangle_translate_down"]["debug"] = {
    "shape_interaction_visibility": true,
}


//________________________________________________________rectangle_rotate_down
shapes["rectangle_rotate_down"] = {
    interaction_shapes: [
        {
            m : [0, -140, 0, 120, 80],
            "type": "rectangle",      
        }
    ],    
}
options["rectangle_rotate_down"]["interaction_settings"] = {
    "enable": true,
    "coef": 0.2,
    "rotate_resolution_priority": 1.0,
    "radius_threshold": 0,
    "do_translation": true,
    priority : 2,
}
options["rectangle_rotate_down"]["dyn_settings"] = {
    'enable':true,
    'mass':1,
    'friction_translate':0.01,
    'friction_rotate':0.01,
    'speed_limit_translate': 3000,
    'speed_limit_rotate':100.3,		
}
options["rectangle_rotate_down"]["debug"] = {
    "shape_interaction_visibility": true,
}
*/









let obj_names_trap = [
    "trap_topRight", 
    "trap_downRight", 
    "trap_downLeft", 
    "trap_topLeft"]
for( let n of obj_names_trap )
{
    shapes[n] = {
        shapes : [
            {
                m_local : [0, 0, 0, 55, 10],
                color: "red",
                type : 'trapezoid',
                stroke_color: "black",
                stroke_width: 1,
            }
        ],
        /*
        interaction_shapes: [
            {
                m_local : [0, 0, 0, 55, 10],
                "type": "trapezoid",
                
            }
        ],
         */
    }
    options[n] = {
        transform_settings : {
            parent_limit_space : false,
            translate_limits: [[0,0],[-27,20]],
            rotate_limits: [0,45],
        }    
    }
}


//____________________________OBJS OPTIONS






shapes["user_interaction_A"] = {
    /*
    shapes : [
        {
            m : [0, -80, 0, 50, 50],
            color: "red",
            type : 'rectangle',
            stroke_color: "black",
            stroke_width: 1,
        }
    ],
    */
    interaction_shapes: [
    {
        m : [0, -80, 0, 50, 50],
        "type": "rectangle",      
    }
    ] 
} 

options["user_interaction_A"] = {    
    transform_settings : {
        parent_limit_space : false,
        translate_limits: [[-70,0],[-0,70]],
        rotate_limits: [0,270],
    },
    interaction_settings : {
        "enable": true,
        "coef": 1.0,
        "rotate_resolution_priority": 1.0,
        "radius_threshold": 0,
        "do_translation": true,
        priority : 5,
    },
    dyn_settings : {
        'enable':true,
        'mass':0.1,
        'friction_translate':0.001,
        'friction_rotate':0.001,
        'speed_limit_translate': 3000,
        'speed_limit_rotate':1000.3,		
    },
    debug : {
    "shape_interaction_visibility": true,
    }
}




export function get_windmill_objs()
{
    return get_objs(hierarchy, shapes, options )
}



