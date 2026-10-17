
import { get_windmill_objs } from "../../assets/windmill.js";

export var scene_info = {
    "objs": get_windmill_objs(),          
    "cns": [],
    "eventActions":[],
}

scene_info["objs"]["play_idle"] =
{
    "m": [-150, -300, 0, 1, 1],
    "shapes" : [
        {
            "m": [-150, -300, 0, 25, 25],
            "color": "green",
            "type": "circle",
            "stroke_color":"black",
            "stroke_width":1,
        }
    ],
    "interaction_shapes": [
        {
            "m": [-100, -300, 0, 50, 25],
            "type": "circle",
        }
    ],
    "interaction_settings": {
        "enable": true,
        "coef": 1.0,
        "rotate_resolution_priority": 0.0,
        "radius_threshold": 0,
        "do_translation": true
    },
    transform_settings : {
        parent_limit_space : false,
        translate_limits: [[0,300],[0,0]],
        rotate_limits: [0,0],
    },            
    "dyn_settings": {
        "enable": false,
        enable_gravity:false,
        mass:0.9,
        "friction_translate": 0.1,
        "friction_rotate": 0.001,
        "speed_limit_translate": 30,
        "speed_limit_rotate": 0.3
    },
    "debug":{
        "shape_interaction_visibility" : false,
    },		
    event_type : "simple",		        

}




scene_info.eventActions.push( 
    {
        event : {
            start : {
                in_args : [ 'play_idle' ],
                fn : (obj) => {
                    let status = false
                    if( obj.Event.data.user['grab'].status )
                    {
                        status = true
                    }
                    return status;
                }
            },
            end : null,
            max_duration : 1,
        },
        action : {
            
            start : {
                in_args : [ 'play_idle' ],
                fn : (obj) => {
                    obj.Game_engine.Animation.start( `idle_anim`,"windmill_idle", { volume : 1, fade_in_seconds : 0, loop : true } ); //"sfx_wii_short_tick_02"
                },
                duration : 1,
            },
            duration : {
                in_args : [ 'play_idle' ],
                fn : (obj) => {
                    obj.Game_engine.Animation.update( 10); //"sfx_wii_short_tick_02"
                },
                duration : 100,
            },
            end : {}
        },

    },
   
)

