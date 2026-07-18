import Vector2d from '../../utils/vector2d.js';
import Matrix2d from '../../utils/matrix2d.js';
import { COLORS } from '../../utils/draw.js'


export var scene_info = {
    "objs":{
		"rotate": {
			"m": [0, 0, 0, 1, 1],
			"m_shape": [0, 50, 0, 10, 50],
			"m_interaction": [0, 50, 0, 100, 100],
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
				"shape_interaction_visibility" : true,
			}
		},
		"rotate_value": {
			"m": [0, 100, 0, 1, 1],
			"m_shape": [0, 100, 0, 2, 2],
			"parent":"rotate",
			"color": "blue",
			"shape_type": "text",
			"txt": "0.0",
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
		"rotate_connect": {
			"m": [0, 200, 0, 1, 1],
			"m_shape": [0, 250, 0, 10, 50],
			"color": "green",
			"shape_type": "rectangle",
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
			"m_shape": [0, -200, 0, 50, 10],
			"m_interaction": [0, -200, 0, 100, 100],
			"color": "red",
			"shape_type": "rectangle",
			"shape_type_interaction": "circle",
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
			"m_shape": [-20, -200, 0, 2, 2],
			"parent":"translate",
			"color": "blue",
			"shape_type": "text",
			"txt": "0.0",
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
			"m_shape": [-50, -200, 0, 10, 50],
			"color": "green",
			"parent":"translate",
			"shape_type": "rectangle",
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
			"m_shape": [-150, -50, 0, 10, 50],
			"color": "orange",
			"shape_type": "rectangle",
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
			mode: 'connection',
			src : [ 'rotate', 'trsf.get_shape().getRotation()' ],
			dst : [ 'rotate_value', 'txt'],
		},
		
		{
			mode: 'connection',
			src : [ 'rotate', 'trsf.get_shape().getRotation()'],
			dst : [ 'rotate_connect', 'trsf.m_body_modif.setRotationDeg()' ],
		}, 
		
		{
			mode: 'connection',
			src : [ 'translate', 'trsf.get_shape().getTranslateX()'],
			dst : [ 'translate_value', 'txt'],
		}, 	
		{
			mode: 'connection',
			src : [ 'translate', 'trsf.get_shape().getTranslateX()' ],
			dst : [ 'translate_connect', 'trsf.m_body_modif.setRotationDeg()' ],
		}, 	
		
		{
			mode: 'expression',
			A : [ 'translate', 'trsf.get_shape().getTranslateX()' ],
			B : [ 'rotate', 'trsf.get_shape().getRotation()' ],
			C : 2,
			expression : ' A + B * C ',
			out : [ 'translate_connectB', 'trsf.m_body_modif.setRotationDeg()' ],
		}, 
			 		 
	],	
						
}
