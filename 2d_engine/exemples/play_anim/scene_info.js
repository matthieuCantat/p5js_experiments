import Vector2d from '../../utils/vector2d.js';
import Matrix2d from '../../utils/matrix2d.js';
import { COLORS } from '../../utils/draw.js'
import { get_body_sfx } from '../../template/event_action_template.js'


export var scene_info = {
    "objs":{
		"play_btn": {
			"m": [0, -300, 0, 1, 1],
			"shapes" : [
				{
					"m": [0, -300, 0, 25, 25],
					"color": "red",
					"type": "circle",
					"stroke_color":"black",
					"stroke_width":1,
				}
			],
			"interaction_shapes": [
				{
					"m" :  [ 0, -300, 0, 25, 25],
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
				translate_limits: [[0,0],[0,0]],
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
        "body_A": {
			"m": [0, -200, 0, 1, 1],
			"shapes" : [
				{
					"m": [0, -200, 0, 10, 50],
					"color": "red",
					"type": "rectangle",
					"stroke_color":"black",
					"stroke_width":1,
				}
			],
			"interaction_shapes": [
				{
					"m" :  [0, -200, 0, 10, 50],
					"type": "rectangle",
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
				translate_limits: [[0,0],[0,0]],
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
                in_args : [ 'play_btn' ],
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
                in_args : [ 'play_btn' ],
                fn : (obj) => {
                    obj.Game_engine.Animation.start( `first_anim`,"body_jump_happy", { volume : 1, fade_in_seconds : 0, loop : true } ); //"sfx_wii_short_tick_02"
                },
                duration : 1,
            },
            /*
            duration : {
                in_args : [ 'pos' ],
                fn : (obj) => {
                    let p = obj.trsf.get().get_row(2)
					// POSITION BASED
					let volume =  (p.y +300)/600;
					let lowPass = (p.x +200)/400*1500;


                    obj.Game_engine.Sound.modif( `gain_whiteSound`,{ volume : volume, lowPass : lowPass } ); //"sfx_wii_short_tick_02"
                },
                duration : 1,
            },
            */
            end : {}
        },

    },
   
 )
