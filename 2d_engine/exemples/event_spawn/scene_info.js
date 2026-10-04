import Vector2d from '../../utils/vector2d.js';
import Matrix2d from '../../utils/matrix2d.js';
import { COLORS } from '../../utils/draw.js'
import { get_body_sfx, get_swipe_navigation} from '../../template/event_action_template.js'


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
				rotate_limits: [-180,150],
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
				"enable": true,
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

const event_names = {
	'user' : [
		["touchDown","touchUp"], 
		["tap", "doubleTap", "grab", "release", "swipeLeft", "swipeRight", "swipeUp", "swipeDown",'idle'],
		["pause", "hold", "move",],
	],
	'obj' : [
		[ 'move_tx+','move_tx-', 'move_ty+','move_ty-','move_r+','move_r-', 'limit_hit_tx+', 'limit_hit_tx-', 'limit_hit_ty+', 'limit_hit_ty-', 'limit_hit_r+', 'limit_hit_r-',]
	]
} 
	


const event_pos = [-100, -20 , 40, 120]

var info = {
	'ROT' : {
		'y' : 240,
		'events_names':event_names,
		'events_pos' : event_pos,
	},
	'TRA' : {
		'y' : 220,
		'events_names': event_names,
		'events_pos' : event_pos,
	},
	'_bg_center' : {
		'y' : 340,
		'events_names': event_names,
		'events_pos' : event_pos,
	},
	'_bg_up' : {
		'y' : 320,
		'events_names': event_names,
		'events_pos' : event_pos,
	},
	'_bg_down' : {
		'y' : 300,
		'events_names': event_names,
		'events_pos' : event_pos,
	},
	'_bg_left' : {
		'y' : 280,
		'events_names': event_names,
		'events_pos' : event_pos,
	},
	'_bg_right' : {
		'y' : 260,
		'events_names': event_names,
		'events_pos' : event_pos,
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

	let i_pos = 0
	for( let event_type in info[obj_name]['events_names'] )
	{
		for( let i = 0; i < info[obj_name]['events_names'][event_type].length; i++ )
		{
			let event_names = info[obj_name]['events_names'][event_type][i]
			let event_pos = info[obj_name]['events_pos'][i_pos]
			
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
						event : {
							start : {
								in_args : [ obj_name ],
								fn : (obj) => {
									//if( event_name == "swipeUp" )
									//	console.log(`event ${event_name} status : ${obj.Event.data[event_name].status}`);
									return obj.Event.data[event_type][event_name].status;},
							},
							end : null,
							max_duration : 1000,
						},
						action : {
							start : {
								in_args : [ n ],
								fn : (obj) => {
									obj.trsf.setTranslateY( obj_y );
								},
								duration : 1,
							},
							end : {},
						},
					},
				)
			}

			i_pos += 1
		}
	}
}



// ADD SOME SOUND
for( let info of get_body_sfx('TRA') )
	scene_info.eventActions.push( info )

for( let info of get_body_sfx('ROT') )
	scene_info.eventActions.push( info )



for( let info of get_swipe_navigation("curve_editor","object_manipulation_A", scene_info.objs) )
    scene_info.eventActions.push( info )
