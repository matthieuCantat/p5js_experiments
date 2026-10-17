import Vector2d from '../../utils/vector2d.js';
import Matrix2d from '../../utils/matrix2d.js';
import { COLORS } from '../../utils/draw.js'
import { get_body_sfx, get_swipe_navigation } from '../../template/event_action_template.js'
import { draw_anim_curve } from '../../template/scene_info_objs_utils.js'



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
        "root": {
			"m": [0, 0, 0, 1, 1],
			"shapes" : [
				{
					"m": [0, 0, 0, 10, 50],
					"color": [255,0,0],
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
		}      		
	},
	"cns": [],	
	"eventActions" : []					
}


scene_info.objs['anim_curve_root_ty'] = draw_anim_curve(
				'windmill_idle',
				'root',
				'translateY',
				[-200, 100, 0, 1., 1.0] )


scene_info.objs['anim_curve_root_r'] = draw_anim_curve(
	'windmill_idle',
	'root',
	'rotate',
	[-200, -200, 0, 1., 1.0] )

		




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
                    obj.Game_engine.Animation.start( `first_anim`,"windmill_idle", { volume : 1, fade_in_seconds : 0, loop : true } ); //"sfx_wii_short_tick_02"
				},
                duration : 1,
            },
            end : {}
        },

    },
   
 )




 for( let info of get_swipe_navigation("cns_bicycle","event_spawn", scene_info.objs) )
    scene_info.eventActions.push( info )
