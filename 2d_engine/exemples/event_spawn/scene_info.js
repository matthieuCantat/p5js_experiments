import Vector2d from '../../utils/vector2d.js';
import Matrix2d from '../../utils/matrix2d.js';
import { COLORS } from '../../utils/draw.js'


export var scene_info = {
    "objs":{
		"triggerRotate": {
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
		"triggerRotateLastEventTitle": {
			"m":  [-180, 330, 0, 2, 2],
			"shapes" : [
				{
					"m":  [-20, 334, 0, 120, 10],
					"color": "black",
					"type": "rectangle",
				},
				{
					"color": "yellow",
					"type": "text",
					"text": "      |  touch  | select | BEHAVIOR",					
				}
			],
			"interaction_shapes": [],
			
				        
		},
		
		"triggerRotateLastEvent_touchDown": {
			"m":  [-115, 0, 0, 2, 2],
			"shapes" : [
				{
					"m":  [-156, 0, 0, 25, 10],
					"color": "black",
					"type": "rectangle",
				},
				{
					"m":  [-110, 0, 0, 10, 10],
					"color": "black",
					"type": "rectangle",
				},
				{
					"color": "white",
					"type": "text",
					"text": "rotate| Dn      |",	
					"text_centered": true,
				}
			]        
		},
		
		"triggerRotateLastEvent_touchUp": {
			"m":  [-180, -1000, 0, 2, 2],
			"shapes":[
				{
					"m":  [-156, 4-1000, 0, 25, 10],
					"color": "black",
					"type": "rectangle",
				},
				{
					"m":  [-110, 4-1000, 0, 10, 10],
					"color": "black",
					"type": "rectangle",
				},
				{
					"color": "cyan",
					"type": "text",
					"text": "rotate| Up      |",	
				}
			]  	        
		},
		
		"triggerRotateLastEvent_fingerOnScreen": {
			"m":  [-180, -1000, 0, 2, 2],
			"shapes":[
				{
					"m":  [-156, 4-1000, 0, 25, 10],
					"color": "black",
					"type": "rectangle",
				},
				{
					"m":  [-80, 4-1000, 0, 10, 10],
					"color": "black",
					"type": "rectangle",
				},
				{
					"color": "yellow",
					"type": "text",
					"text": "rotate|     ON |",	
				}
			]  	        
		},
		/*
		"triggerRotateLastEvent_tap": {
			"m":  [-180, -1000, 0, 2, 2],
			"color": "black",
			"shape_type": "text",
			"text": "rotate|             |            | TAP 1",	 	        
		},
		"triggerRotateLastEvent_doubleTap": {
			"m":  [-180, -1000, 0, 2, 2],
			"color": "red",
			"shape_type": "text",
			"text": "rotate|             |            | TAP 2",	 	        
		},
		"triggerRotateLastEvent_grab": {
			"m":  [-180, -1000, 0, 2, 2],
			"color": "green",
			"shape_type": "text",
			"text": "rotate|             | GRAB",
		},
		"triggerRotateLastEvent_hold": {
			"m":  [-180, -1000, 0, 2, 2],
			"color": "red",
			"shape_type": "text",
			"text": "rotate|             |            | HOLD",      
		},
		"triggerRotateLastEvent_drag": {
			"m":  [-180, -1000, 0, 2, 2],
			"color": "blue",
			"shape_type": "text",
			"text": "rotate|             |            | DRAG",           
		},
		"triggerRotateLastEvent_flick": {
			"m":  [-180, -1000, 0, 2, 2],
			"color": "red",
			"shape_type": "text",
			"text": "rotate|             |            | flick",	        
		},
		"triggerRotateLastEvent_swipeLeft": {
			"m":  [-180, -1000, 0, 2, 2],
			"color": "red",
			"shape_type": "text",
			"text": "rotate|             |            |         <<<<",	        
		},
		"triggerRotateLastEvent_swipeRight": {
			"m":  [-180, -1000, 0, 2, 2],
			"color": "red",
			"shape_type": "text",
			"text": "rotate|             |            |         >>>>",	 	        
		},
		"triggerRotateLastEvent_swipeUp": {
			"m":  [-180, -1000, 0, 2, 2],
			"color": "red",
			"shape_type": "text",
			"text": "rotate|             |            |         ^^^^",	        
		},
		"triggerRotateLastEvent_swipeDown": {
			"m":  [-180, -1000, 0, 2, 2],
			"color": "red",
			"shape_type": "text",
			"text": "rotate|             |            |         vvvv",       
		},
		"triggerRotateLastEvent_idle": {
			"m":  [-180, -1000, 0, 2, 2],
			"color": "black",
			"shape_type": "text",
			"text": "rotate|             |            | idle",	        
		},
		"triggerTranslate": {
			"m": [-100, -300, 0, 1, 1],
			"m_shape": [-100, -300, 90, 10, 50],
			"m_interaction": [-100, -300, 90, 120, 120],
			"color": "red",
			"shape_type": "rectangle",
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
		*/				
	},
	
	"cns": [	
		{
			mode: 'expression',
			A : [ 'triggerRotateLastEvent_touchDown', 'trsf.getTranslateY()' ],
			expression : 'A',
			out : [ 'triggerRotateLastEvent_touchDown', 'trsf.setTranslateY()' ],
		}, 	
		{
			mode: 'expression',
			A : [ 'triggerRotateLastEvent_touchUp', 'trsf.getTranslateY()' ],
			expression : 'A - 10',
			out : [ 'triggerRotateLastEvent_touchUp', 'trsf.setTranslateY()' ],
		},
		{
			mode: 'expression',
			A : [ 'triggerRotateLastEvent_fingerOnScreen', 'trsf.getTranslateY()' ],
			expression : 'A - 10',
			out : [ 'triggerRotateLastEvent_fingerOnScreen', 'trsf.setTranslateY()' ],
		},		
		/*	
		{
			mode: 'expression',
			A : [ 'triggerRotateLastEvent_tap', 'trsf.getTranslateY()' ],
			expression : 'A - 10',
			out : [ 'triggerRotateLastEvent_tap', 'trsf.setTranslateY()' ],
		},	
		{
			mode: 'expression',
			A : [ 'triggerRotateLastEvent_doubleTap', 'trsf.getTranslateY()' ],
			expression : 'A - 10',
			out : [ 'triggerRotateLastEvent_doubleTap', 'trsf.setTranslateY()' ],
		},
		{
			mode: 'expression',
			A : [ 'triggerRotateLastEvent_grab', 'trsf.getTranslateY()' ],
			expression : 'A - 10',
			out : [ 'triggerRotateLastEvent_grab', 'trsf.setTranslateY()' ],
		},
		{
			mode: 'expression',
			A : [ 'triggerRotateLastEvent_hold', 'trsf.getTranslateY()' ],
			expression : 'A - 10',
			out : [ 'triggerRotateLastEvent_hold', 'trsf.setTranslateY()' ],
		},
		{
			mode: 'expression',
			A : [ 'triggerRotateLastEvent_drag', 'trsf.getTranslateY()' ],
			expression : 'A - 10',
			out : [ 'triggerRotateLastEvent_drag', 'trsf.setTranslateY()' ],
		},
		{
			mode: 'expression',
			A : [ 'triggerRotateLastEvent_flick', 'trsf.getTranslateY()' ],
			expression : 'A - 10',
			out : [ 'triggerRotateLastEvent_flick', 'trsf.setTranslateY()' ],
		},
		{
			mode: 'expression',
			A : [ 'triggerRotateLastEvent_swipeLeft', 'trsf.getTranslateY()' ],
			expression : 'A - 10',
			out : [ 'triggerRotateLastEvent_swipeLeft', 'trsf.setTranslateY()' ],
		},
		{
			mode: 'expression',
			A : [ 'triggerRotateLastEvent_swipeRight', 'trsf.getTranslateY()' ],
			expression : 'A - 10',
			out : [ 'triggerRotateLastEvent_swipeRight', 'trsf.setTranslateY()' ],
		},
		{
			mode: 'expression',
			A : [ 'triggerRotateLastEvent_swipeUp', 'trsf.getTranslateY()' ],
			expression : 'A - 10',
			out : [ 'triggerRotateLastEvent_swipeUp', 'trsf.setTranslateY()' ],
		},
		{
			mode: 'expression',
			A : [ 'triggerRotateLastEvent_swipeDown', 'trsf.getTranslateY()' ],
			expression : 'A - 10',
			out : [ 'triggerRotateLastEvent_swipeDown', 'trsf.setTranslateY()' ],
		},
		{
			mode: 'expression',
			A : [ 'triggerRotateLastEvent_idle', 'trsf.getTranslateY()' ],
			expression : 'A - 10',
			out : [ 'triggerRotateLastEvent_idle', 'trsf.setTranslateY()' ],
		},	
		*/
			
	],	
	"eventActions" : [
		{
			event_start : {
				in_args : [ 'triggerRotate' ],
				fn : (obj) => {
					return obj.events.touchDown.status;
				  }
			},
			event_end : null,
			event_max_duration : 1000,
			action : {
				in_args : [ 'triggerRotateLastEvent_touchDown' ],
				fn : (obj) => {
					obj.trsf.setTranslateY( 300 );
				  },
			}
		},
		{
			event_start : {
				in_args : [ 'triggerRotate' ],
				fn : (obj) => {
					return obj.events.touchUp.status;
				  }
			},
			event_end : null,
			event_max_duration : 1000,
			action : {
				in_args : [ 'triggerRotateLastEvent_touchUp' ],
				fn : (obj) => {
					obj.trsf.setTranslateY( 300 );
				  },
			}
		},
		{
			event_start : {
				in_args : [ 'triggerRotate' ],
				fn : (obj) => {
					return obj.events.fingerOnScreen.status;
				  }
			},
			event_end : null,
			event_max_duration : 1000,
			action : {
				in_args : [ 'triggerRotateLastEvent_fingerOnScreen' ],
				fn : (obj) => {
					obj.trsf.setTranslateY( 300 );
				  },
			}
		},
		/*
		{
			event_start : {
				in_args : [ 'triggerRotate' ],
				fn : (obj) => {
					return obj.events.tap.status;
				  }
			},
			event_end : null,
			event_max_duration : 1000,
			action : {
				in_args : [ 'triggerRotateLastEvent_tap' ],
				fn : (obj) => {
					obj.trsf.setTranslateY( 300 );
				  },
			}
		},
		{
			event_start : {
				in_args : [ 'triggerRotate' ],
				fn : (obj) => {
					return obj.events.doubleTap.status;
				  }
			},
			event_end : null,
			event_max_duration : 1000,
			action : {
				in_args : [ 'triggerRotateLastEvent_doubleTap' ],
				fn : (obj) => {
					obj.trsf.setTranslateY( 300 );
				  },
			}
		},
		{
			event_start : {
				in_args : [ 'triggerRotate' ],
				fn : (obj) => {
					return obj.events.grab.status;
				  }
			},
			event_end : null,
			event_max_duration : 1000,
			action : {
				in_args : [ 'triggerRotateLastEvent_grab' ],
				fn : (obj) => {
					obj.trsf.setTranslateY( 300 );
				  },
			}
		},
		{
			event_start : {
				in_args : [ 'triggerRotate' ],
				fn : (obj) => {
					return obj.events.hold.status;
				  }
			},
			event_end : null,
			event_max_duration : 1000,
			action : {
				in_args : [ 'triggerRotateLastEvent_hold' ],
				fn : (obj) => {
					obj.trsf.setTranslateY( 300 );
				  },
			}
		},
		{
			event_start : {
				in_args : [ 'triggerRotate' ],
				fn : (obj) => {
					return obj.events.drag.status;
				  }
			},
			event_end : null,
			event_max_duration : 1000,
			action : {
				in_args : [ 'triggerRotateLastEvent_drag' ],
				fn : (obj) => {
					obj.trsf.setTranslateY( 300 );
				  },
			}
		},
		{
			event_start : {
				in_args : [ 'triggerRotate' ],
				fn : (obj) => {
					return obj.events.flick.status;
				  }
			},
			event_end : null,
			event_max_duration : 1000,
			action : {
				in_args : [ 'triggerRotateLastEvent_flick' ],
				fn : (obj) => {
					obj.trsf.setTranslateY( 300 );
				  },
			}
		},
		{
			event_start : {
				in_args : [ 'triggerRotate' ],
				fn : (obj) => {
					return obj.events.swipeLeft.status;
				  }
			},
			event_end : null,
			event_max_duration : 1000,
			action : {
				in_args : [ 'triggerRotateLastEvent_swipeLeft' ],
				fn : (obj) => {
					obj.trsf.setTranslateY( 300 );
				  },
			}
		},
		{
			event_start : {
				in_args : [ 'triggerRotate' ],
				fn : (obj) => {
					return obj.events.swipeRight.status;
				  }
			},
			event_end : null,
			event_max_duration : 1000,
			action : {
				in_args : [ 'triggerRotateLastEvent_swipeRight' ],
				fn : (obj) => {
					obj.trsf.setTranslateY( 300 );
				  },
			}
		},
		{
			event_start : {
				in_args : [ 'triggerRotate' ],
				fn : (obj) => {
					return obj.events.swipeUp.status;
				  }
			},
			event_end : null,
			event_max_duration : 1000,
			action : {
				in_args : [ 'triggerRotateLastEvent_swipeUp' ],
				fn : (obj) => {
					obj.trsf.setTranslateY( 300 );
				  },
			}
		},
		{
			event_start : {
				in_args : [ 'triggerRotate' ],
				fn : (obj) => {
					return obj.events.swipeDown.status;
				  }
			},
			event_end : null,
			event_max_duration : 1000,
			action : {
				in_args : [ 'triggerRotateLastEvent_swipeDown' ],
				fn : (obj) => {
					obj.trsf.setTranslateY( 300 );
				  },
			}
		},
		{
			event_start : {
				in_args : [ 'triggerRotate' ],
				fn : (obj) => {
					return obj.events.idle.status;
				  }
			},
			event_end : null,
			event_max_duration : 1000,
			action : {
				in_args : [ 'triggerRotateLastEvent_idle' ],
				fn : (obj) => {
					obj.trsf.setTranslateY( 300 );
				  },
			}
		}
			*/
	]					
}
