import Vector2d from '../../utils/vector2d.js';
import Matrix2d from '../../utils/matrix2d.js';
import { COLORS } from '../../utils/draw.js'
import { get_body_sfx } from '../../template/event_action_template.js'


export var scene_info = {
    "objs":{
		"GAIN": {
			"m": [-100, 0, 0, 1, 1],
			"shapes" : [
				{
					"m": [-100, 0, 0, 50, 50],
					"color": "red",
					"type": "circle",
					"stroke_color":"black",
					"stroke_width":1,
				}
			],
			"interaction_shapes": [
				{
					"m" :  [-100, 0, 0, 50, 50],
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
				translate_limits: [[-130,130],[-300,300]],
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
		},		
        "OSCILLATOR": {
			"m": [0, 0, 0, 1, 1],
			"shapes" : [
				{
					"m": [0, 0, 0, 50, 50],
					"color": "yellow",
					"type": "circle",
					"stroke_color":"black",
					"stroke_width":1,
				}
			],
			"interaction_shapes": [
				{
					"m" :  [0, 0, 0, 50, 50],
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
				translate_limits: [[-130,130],[-300,300]],
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
		},					
	},
	"cns": [],	
	"eventActions" : []					
}



scene_info.eventActions.push( 
    {
        event : {
            start : {
                in_args : [ 'GAIN' ],
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
                in_args : [ 'GAIN' ],
                fn : (obj) => {
                    obj.Game_engine.Sound.start( `gain_whiteSound`,"ost_quest2_whiteSound_02", { volume : 1, fade_in_seconds : 0, loop : true } ); //"sfx_wii_short_tick_02"
                },
                duration : 1,
            },
            
            duration : {
                in_args : [ 'GAIN' ],
                fn : (obj) => {
                    let p = obj.trsf.get().get_row(2)
                    obj.Game_engine.Sound.modif( `gain_whiteSound`,{ volume :  (p.y +300)/600} ); //"sfx_wii_short_tick_02"
                },
                duration : 1,
            },
            
            end : {
                in_args : [ 'GAIN' ],
                fn : (obj) => {
                    obj.Game_engine.Sound.end( `gain_whiteSound`, { fade_in_seconds : 1 } ); //"sfx_wii_short_tick_02"
                },
                duration : 1,
            }
        },

    },
    {
        event : {
            start : {
                in_args : [ 'OSCILLATOR' ],
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
                in_args : [ 'OSCILLATOR' ],
                fn : (obj) => {
                    obj.Game_engine.Sound.start( `oscillator_grab`,"oscillator", { volume : 1, fade_in_seconds : 0, loop : true } ); //"sfx_wii_short_tick_02"
                },
                duration : 1,
            },
            
            duration : {
                in_args : [ 'OSCILLATOR' ],
                fn : (obj) => {
                    let p = obj.trsf.get().get_row(2)
                    obj.Game_engine.Sound.modif( `oscillator_grab`,{ volume :  (p.y +300)/600} ); //"sfx_wii_short_tick_02"
                },
                duration : 1,
            },
            
            end : {
                in_args : [ 'OSCILLATOR' ],
                fn : (obj) => {
                    obj.Game_engine.Sound.end( `oscillator_grab`, { fade_in_seconds : 1 } ); //"sfx_wii_short_tick_02"
                },
                duration : 1,
            }
        },

    },

 )
