import Vector2d from '../../utils/vector2d.js';
import Matrix2d from '../../utils/matrix2d.js';
import { COLORS } from '../../utils/draw.js'



export var scene_info = {
    "objs":{
		"ROT": {
			"m": [-100, 50, 0, 1, 1],
			"shapes" : [
				{
					"m": [-100, 100, 0, 10, 50],
					"color": "red",
					"type": "rectangle",
					"stroke_color":"black",
					"stroke_width":1,
				}
			],
			"interaction_shapes": [
				{
					"m" : [-100, 50, 0, 120, 120],
					"type": "rectangle",
				}
			],
			"interaction_settings": {
				"enable": true,
				"coef": 0.2,
				"rotate_resolution_priority": 1.0,
				"radius_threshold": 0,
				"do_translation": true
			},
			transform_settings : {
				parent_limit_space : false,
				translate_limits: [[0,0],[-0,0]],
				//rotate_limits: [0,90],
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
				
		},
		"TRA": {
			"m": [-100, -300, 0, 1, 1],
			"shapes" : [
				{
					"m": [-100, -300, 90, 10, 50],
					"color": "red",
					"type": "rectangle",
					"stroke_color":"black",
					"stroke_width":1,
				}
			],
			"interaction_shapes": [
				{
					"m" :  [-100, -300, 90, 120, 120],
					"type": "rectangle",
				}
			],
			"interaction_settings": {
				"enable": true,
				"coef": 0.2,
				"rotate_resolution_priority": 1.0,
				"radius_threshold": 0,
				"do_translation": true
			},
			transform_settings : {
				parent_limit_space : false,
				translate_limits: [[0,200],[-0,0]],
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
		},		
				
	},
	"cns": [],	
	"eventActions" : []					
}



var info = {
	'ROT' : {
		'y' : 240,
		'events_names': [ ["touchDown","touchUp"], ["fingerOnScreen"], ["tap", "doubleTap", "pause", "hold", "move", "swipeLeft", "swipeRight", "swipeUp", "swipeDown",'idle']],
		'events_pos' : [-100, 0 , 100],
	},
	'TRA' : {
		'y' : 220,
		'events_names': [ ["touchDown","touchUp"], ["fingerOnScreen"], ["tap", "doubleTap", "pause", "hold", "move", "swipeLeft", "swipeRight", "swipeUp", "swipeDown",'idle']],
		'events_pos' : [-100, 0 , 100],
	},
	'_bg_center' : {
		'y' : 340,
		'events_names': [ ["touchDown","touchUp"], ["fingerOnScreen"], ["tap", "doubleTap", "pause", "hold", "move", "swipeLeft", "swipeRight", "swipeUp", "swipeDown",'idle']],
		'events_pos' : [-100, 0 , 100],
	},
	'_bg_up' : {
		'y' : 320,
		'events_names': [ ["touchDown","touchUp"], ["fingerOnScreen"], ["tap", "doubleTap", "pause", "hold", "move", "swipeLeft", "swipeRight", "swipeUp", "swipeDown",'idle']],
		'events_pos' : [-100, 0 , 100],
	},
	'_bg_down' : {
		'y' : 300,
		'events_names': [ ["touchDown","touchUp"], ["fingerOnScreen"], ["tap", "doubleTap", "pause", "hold", "move", "swipeLeft", "swipeRight", "swipeUp", "swipeDown",'idle']],
		'events_pos' : [-100, 0 , 100],
	},
	'_bg_left' : {
		'y' : 280,
		'events_names': [ ["touchDown","touchUp"], ["fingerOnScreen"], ["tap", "doubleTap", "pause", "hold", "move", "swipeLeft", "swipeRight", "swipeUp", "swipeDown",'idle']],
		'events_pos' : [-100, 0 , 100],
	},
	'_bg_right' : {
		'y' : 260,
		'events_names': [ ["touchDown","touchUp"], ["fingerOnScreen"], ["tap", "doubleTap", "pause", "hold", "move", "swipeLeft", "swipeRight", "swipeUp", "swipeDown",'idle']],
		'events_pos' : [-100, 0 , 100],
	},
}



var y_min = -1000

let x = -165
let font_size = 2
let h = font_size * 5


for( let obj_name in info )
{
	let obj_y = info[obj_name].y
	let obj_w = obj_name.length*5

	for( let i = 0 ; i < info[obj_name]['events_names'].length ; i++ )
	{
		let event_names = info[obj_name]['events_names'][i]
		let event_pos = info[obj_name]['events_pos'][i]
		
		for( let event_name of event_names )
		{

			let event_w = event_name.length*5

			let n = `${obj_name}TriggerLastEvent_${event_name}`

			scene_info.objs[n] = {
				"m":  [0, y_min, 0, 1, 1],
				"shapes" : [
					{
						"m":  [x, y_min, 0, obj_w, h],
						"color": "black",
						"type": "rectangle",
					},
					{
						"m":  [x, y_min, 0, font_size, font_size],
						"color": "white",
						"type": "text",
						"text": `${obj_name}`,	
						"text_centered": true,
					},
					{
						"m":  [event_pos, y_min, 0, event_w, h],
						"color": "black",
						"type": "rectangle",
					},
					{
						"m":  [ event_pos , y_min, 0, font_size, font_size],
						"color": "white",
						"type": "text",
						"text": `${event_name}`,	
						"text_centered": true,
					}
				]        
			}

			scene_info.cns.push(
				{
					mode: 'expression',
					A : [ n, 'trsf.getTranslateY()' ],
					expression : 'A - 5',
					out : [ n, 'trsf.setTranslateY()' ],
				},
			)

			scene_info.eventActions.push(
				{
					event_start : {
						in_args : [ obj_name ],
						fn : (obj) => {
							return obj.Event.data[event_name].status;
						  }
					},
					event_end : null,
					event_max_duration : 1000,
					action : {
						in_args : [ n ],
						fn : (obj) => {
							obj.trsf.setTranslateY( obj_y );
						  },
					}
				},
			)

		}
	}
}



// ADD SOME SOUND

scene_info.eventActions.push(
	{
		event_start : {
			in_args : [ 'TRA' ],
			fn : (obj) => {return obj.Event.data['touchDown'].status;}
		},
		event_end : null,
		event_max_duration : 1,
		action : {
			in_args : [ 'TRA' ],
			fn : (obj) => {obj.Game_engine.playSoundSample( "sfx_wii_short_tick_02" );},
		}
	},
)


scene_info.eventActions.push(
	{
		event_start : {
			in_args : [ 'TRA' ],
			fn : (obj) => {return obj.Event.data['tap'].status;}
		},
		event_end : null,
		event_max_duration : 1,
		action : {
			in_args : [ 'TRA' ],
			fn : (obj) => {obj.Game_engine.playSoundSample( "sfx_wii_bell_long_01" );},
		}
	},
)

scene_info.eventActions.push(
	{
		event_start : {
			in_args : [ 'TRA' ],
			fn : (obj) => {return obj.Event.data['doubleTap'].status;}
		},
		event_end : null,
		event_max_duration : 1,
		action : {
			in_args : [ 'TRA' ],
			fn : (obj) => {obj.Game_engine.playSoundSample( "sfx_wii_synth_bell_melodie_01" );},
		}
	},
)


scene_info.eventActions.push(
	{
		event_start : {
			in_args : [ 'TRA' ],
			fn : (obj) => {return obj.Event.data['idle'].status;}
		},
		event_end : null,
		event_max_duration : 1,
		action : {
			in_args : [ 'TRA' ],
			fn : (obj) => {obj.Game_engine.playSoundSample( "ost_creature_04" );},
		}
	},
)
