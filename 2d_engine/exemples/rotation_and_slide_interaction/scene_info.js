import Vector2d from '../../utils/vector2d.js';
import Matrix2d from '../../utils/matrix2d.js';
import { COLORS } from '../../utils/draw.js'


export var scene_info = {
    "objs":{
		"rotate": {
			"m": [0, 0, 0, 1, 1],
			shapes : [
				{
					m : [0, 50, 0, 10, 50], 
					color: "red", 
					type : 'rectangle',
					"stroke_color":"black",
					"stroke_width":1,
				}
			],
			interaction_shapes: [
				{
					m : [0, 50, 0, 100, 100],
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
				//rotate_limits: [0,0],
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
				"shape_interaction_visibility" : true,
			}
		},
		"rotate_value": {
			"m": [0, 100, 0, 1, 1],
			"parent":"rotate",
			shapes : [
				{
					m : [0, 100, 0, 3, 3],
					color: "blue", 
					type : 'text',
					"text": "0.0",
				}
			],
			"interaction_settings": {
				"enable": false,
				"coef": 0.2,
				"rotate_resolution_priority": 1.0,
				"radius_threshold": 0,
				"do_translation": true
			},
			transform_settings : {
				parent_limit_space : false,
				//translate_limits: [[0,0],[-0,0]],
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
			//"debug":["toto"]
		},	
		"rotate_connect": {
			"m": [0, 200, 0, 1, 1],
			shapes : [
				{
					m : [0, 250, 0, 10, 50],
					color: "green", 
					type : 'rectangle',
					"stroke_color":"black",
					"stroke_width":1,
				}
			],
			"interaction_settings": {
				"enable": false,
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
			//"debug":["toto"]
		},			
		"translate": {
			"m": [0, -200, 0, 1, 1],
			shapes : [
				{
					m : [0, -200, 0, 50, 10],
					color: "red", 
					type : 'rectangle',
					"stroke_color":"black",
					"stroke_width":1,
				}
			],
			interaction_shapes: [
				{
					m : [0, -200, 0, 100, 100],
					"type": "circle",
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
				translate_limits: [[-150,150],[-0,0]],
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
				"shape_interaction_visibility" : true,
			}
		},		
		"translate_value": {
			"m": [-20, -200, 0, 1, 1],
			"parent":"translate",
			shapes : [
				{
					m : [-20, -200, 0, 3, 3],
					color: "blue", 
					type : 'text',
					"text": "0.0",
				}
			],
			"interaction_settings": {
				"enable": false,
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
		},
		"translate_connect": {
			"m": [-50, -200, 0, 1, 1],
			"parent":"translate",
			shapes : [
				{
					m : [-50, -200, 0, 10, 50],
					color: "green", 
					type : 'rectangle',
					"stroke_color":"black",
					"stroke_width":1,
				}
			],
			"interaction_settings": {
				"enable": false,
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
		},
		"translate_connectB": {
			"m": [-150, -50, 0, 1, 1],
			shapes : [
				{
					m : [-150, -50, 0, 10, 50],
					color: "orange", 
					type : 'rectangle',
					"stroke_color":"black",
					"stroke_width":1,
				}
			],
			"interaction_settings": {
				"enable": false,
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
		},					
						
	},
	
	"cns": [		
		{
			mode: 'expression',
			A : [ 'rotate', 'trsf.get_shapes()[0].getRotation()' ],
			expression : 'ctx.round( A , 1 )',
			out : [ 'rotate_value', 'args.shapes[0].text'],
		}, 		
		
		{
			mode: 'connection',
			src : [ 'rotate', 'trsf.get_shapes()[0].getRotation()'],
			dst : [ 'rotate_connect', 'trsf.setRotationDeg()' ],
		}, 
		{
			mode: 'expression',
			A : [ 'translate', 'trsf.get_shapes()[0].getTranslateX()'],
			expression : 'ctx.round( A , 1 )',
			out : [ 'translate_value', 'args.shapes[0].text'],
		}, 

		{
			mode: 'connection',
			src : [ 'translate', 'trsf.get_shapes()[0].getTranslateX()' ],
			dst : [ 'translate_connect', 'trsf.setRotationDeg()' ],
		}, 	
		
		{
			mode: 'expression',
			A : [ 'translate', 'trsf.get_shapes()[0].getTranslateX()' ],
			B : [ 'rotate', 'trsf.get_shapes()[0].getRotation()' ],
			C : 2,
			expression : ' A + B * C ',
			out : [ 'translate_connectB', 'trsf.setRotationDeg()' ],
		}, 
		{
			mode: 'expression',
			A : [ 'translate', 'Game_engine.Time.get()' ],
			expression : ' Math.sin( A * 3 ) * 150',
			out : [ 'translate_connectB', 'trsf.setTranslateY()' ],
		}, 	
			 		 
	],	
	
						
}
