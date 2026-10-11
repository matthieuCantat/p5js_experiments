import { get_objs } from "../../template/scene_info_objs_utils.js";

//____________________________OBJS HIERARCHY
var hierarchy = {
    "root": {
        "m": [0,0,0,1,1],
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
    "rectangle_rotate_top" : {
        interaction_shapes: [
            {
                m : [0, 140, 0, 50, 50],
                "type": "rectangle",
            }
        ],
    },   
    "rectangle_rotate_left" : {
        interaction_shapes: [
            {
                m : [140, 0, 0, 50, 50],
                "type": "rectangle",
            }
        ],           
    },
    "rectangle_rotate_down" : {    
        interaction_shapes: [
            {
                m : [0, -140, 0, 50, 50],
                "type": "rectangle",
            }
        ],
    },
    "rectangle_rotate_right" : {        
        interaction_shapes: [
            {
                m : [-140, 0, 0, 50, 50],
                "type": "rectangle",
            }
        ],
    },

}


var options = {
    "rectangle_rotate_top" : {
        transform_settings : {
            parent_limit_space : false,
            translate_limits: [[0,0],[-0,0]],
            rotate_limits: [-90,0],
        },           
    },   
    "rectangle_rotate_left" : {
        transform_settings : {
            parent_limit_space : false,
            translate_limits: [[0,0],[-0,0]],
            rotate_limits: [-0,0],
        },            
    },
    "rectangle_rotate_down" : {    
        transform_settings : {
            parent_limit_space : false,
            translate_limits: [[0,0],[-0,0]],
            rotate_limits: [-270,0],
        },
    },
    "rectangle_rotate_right" : {        
        transform_settings : {
            parent_limit_space : false,
            translate_limits: [[0,0],[-0,0]],
            rotate_limits: [-180,0],
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
        ],
        interaction_shapes: [
            {
                m_local : [0, 0, 0, 8, 40],
                "type": "rectangle",
            }
        ],
    }
    options[n] = {
        transform_settings : {
            parent_limit_space : false,
            translate_limits: [[0,0],[-0,70]],
            rotate_limits: [0,0],
        }
    }
}
    

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
                stroke_color: "red",
                stroke_width: 1,
            }
        ],
        interaction_shapes: [
            {
                m_local : [0, 0, 0, 55, 10],
                "type": "trapezoid",
            }
        ],
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



for ( let obj_name in shapes )
{
    if( shapes[obj_name].hasOwnProperty("interaction_shapes") === false )
        continue
    if( options.hasOwnProperty(obj_name) === false )
        options[obj_name] = {}
    options[obj_name]["interaction_settings"] = {
        "enable": true,
        "coef": 0.2,
        "rotate_resolution_priority": 1.0,
        "radius_threshold": 0,
        "do_translation": true
    }
}

export var scene_info = {
    "objs": get_objs(hierarchy, shapes, options),          
    "cns": [],
    "eventActions":[],
}




scene_info.eventActions.push( 
    {
        event : {
            start : {
                in_args : [ 'root' ],
                fn : (obj) => {
                    let status = false
                    if( 5 < obj.Game_engine.Time.frame)
                        status = true
                    
                    return status;
                }
            },
            end : null,
            max_duration : 1,
        },
        action : {
            
            start : {
                in_args : [ 'root' ],
                fn : (obj) => {
                    obj.Game_engine.Animation.start( `first_anim`,"windmill_transformation", { volume : 1, fade_in_seconds : 0, loop : true } ); //"sfx_wii_short_tick_02"
                },
                duration : 1,
            },
            end : {}
        },

    },
   
 )
