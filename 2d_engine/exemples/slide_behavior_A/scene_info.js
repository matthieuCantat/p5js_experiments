import Vector2d from '../../utils/vector2d.js';
import Matrix2d from '../../utils/matrix2d.js';
import { COLORS } from '../../utils/draw.js'


export var scene_info = {
    "objs":{},
    "cns":[],
}


let p_start = new Vector2d(-150,200)
let p_offset = new Vector2d(0,-50)

let settings_list = [
	{
		'title':'rigid short grab - no dyn',
		'inter':{
			'enable':true,
			'coef':1.0,
			'rotate_resolution_priority':0.0,
		},
		'dyn':{
			'enable':false,
		},
	},
	{
		'title':'rigid long grab - no dyn',
		'inter':{
			'enable':true,
			'coef':1.0,
			'rotate_resolution_priority':0.0,
			'radius_threshold':100,
		},
		'dyn':{
			'enable':false,
		},
	},		
	{
		'title':'elastic short grab - no dyn',
		'inter':{
			'enable':true,
			'coef':0.05,
			'rotate_resolution_priority':0.0,
		},
		'dyn':{
			'enable':false,
		},
	},
	{
		'title':'elastic long grab - no dyn',
		'inter':{
			'enable':true,
			'coef':0.05,
			'rotate_resolution_priority':0.0,
			'radius_threshold':100,
		},
		'dyn':{
			'enable':false,
		},
	},		
	{		
		'title':'rigid short grab - dyn',
		'inter':{
			'enable':true,
			'coef':1.0,
			'rotate_resolution_priority':0.0,
		},
		'dyn':{
			'enable':true,
			'mass':1,
			'friction_translate':0.0001,
			'friction_rotate':1.0,
			'speed_limit_translate': 30,
			'speed_limit_rotate':0.3,				
		},
	},
	{
		'title':'rigid long grab - dyn',
		'inter':{
			'enable':true,
			'coef':1.0,
			'rotate_resolution_priority':0.0,
			'radius_threshold':100,
		},
		'dyn':{
			'enable':true,
			'mass':1,
			'friction_translate':0.0001,
			'friction_rotate':1.0,
			'speed_limit_translate': 30,
			'speed_limit_rotate':0.3,
		},
	},		
	{
		'title':'elastic short grab - dyn',
		'inter':{
			'enable':true,
			'coef':0.05,
			'rotate_resolution_priority':0.0,
		},
		'dyn':{
			'enable':true,
			'mass':1,
			'friction_translate':0.0001,
			'friction_rotate':1.0,
			'speed_limit_translate': 30,
			'speed_limit_rotate':0.3,
		},
	},
	{
		'title':'elastic long grab - dyn',
		'inter':{
			'enable':true,
			'coef':0.05,
			'rotate_resolution_priority':0.0,
			'radius_threshold':100,
		},
		'dyn':{
			'enable':true,
			'mass':1,
			'friction_translate':0.0001,
			'friction_rotate':1.0,
			'speed_limit_translate': 30,
			'speed_limit_rotate':0.3,
		},
	},		
	{
		'title':'elastic short grab - dyn attract start',
		'inter':{
			'enable':true,
			'coef':0.05,
			'rotate_resolution_priority':0.0,
		},
		'dyn':{
			'enable':true,
			'mass':1,
			'friction_translate':0.1,
			'friction_rotate':1.0,
			'speed_limit_translate': 30,
			'speed_limit_rotate':0.3,
			'custom_forces':[
				{
					'p': p_start.getAdd(p_offset.getMult(8)),
					'strength': -0.03,
					'influence_radius':-1,
				}
			]
			
		},
	},	
	{
		'title':'elastic short grab - dyn glue start',
		'inter':{
			'enable':true,
			'coef':0.05,
			'rotate_resolution_priority':0.0,
		},
		'dyn':{
			'enable':true,
			'mass':1,
			'friction_translate':0.1,
			'friction_rotate':1.0,
			'speed_limit_translate': 30,
			'speed_limit_rotate':0.3,
			'custom_forces':[
				{
					'p': p_start.getAdd(p_offset.getMult(8)),
					'strength': -0.1,
					'influence_radius':100,
				}
			]
		},		
	},	
	{
		'title':'elastic short grab - dyn repulse middle',
		'inter':{
			'enable':true,
			'coef':0.05,
			'rotate_resolution_priority':0.0,
		},
		'dyn':{
			'enable':true,
			'mass':1,
			'friction_translate':0.01,
			'friction_rotate':1.0,
			'speed_limit_translate': 30,
			'speed_limit_rotate':0.3,
			'custom_forces':[
				{
					'p': p_start.getAdd(p_offset.getMult(9)).add(new Vector2d(170,0)),
					'strength': 0.1,
					'influence_radius':100,
				}
			]
		},		
	},	
	{
		'title':'elastic short grab - dyn multi attract',
		'inter':{
			'enable':true,
			'coef':0.05,
			'rotate_resolution_priority':0.0,
		},
		'dyn':{
			'enable':true,
			'mass':1,
			'friction_translate':0.001,
			'friction_rotate':1.0,
			'speed_limit_translate': 30,
			'speed_limit_rotate':0.3,
			'custom_forces':[
				{
					'p': p_start.getAdd(p_offset.getMult(11)),
					'strength': -0.1,
					'influence_radius':50,
				},
				{
					'p': p_start.getAdd(p_offset.getMult(11)).add(new Vector2d(100,0)),
					'strength': -0.1,
					'influence_radius':50,
				},		
				{
					'p': p_start.getAdd(p_offset.getMult(11)).add(new Vector2d(200,0)),
					'strength': -0.1,
					'influence_radius':50,
				},								
			]
		},		
	},									
]


scene_info.objs["root"] = {}

let p = new Vector2d(p_start)
let scale = new Vector2d(60,20)
for( let i = 0; i < settings_list.length; i++)
{
    let color_index = Math.floor(Math.random() * COLORS.length);

    scene_info.objs["slide"+i] = {
            m : new Matrix2d(p, 0, scale), 
            color: COLORS[color_index], 
            shape_type:'rectangle',

            interaction_settings: settings_list[i].inter,
            dyn_settings: settings_list[i].dyn,
        } 
	
    scene_info.cns.push(
        {
			"mode": "axe",
			"driver_obj": "root",
			"driven_objs":['slide'+i],
			"p_axe": new Vector2d( p ),
			"v_axe": new Vector2d(1,0),
			"enable":true,
			"enable_limits":true,
			"limit_max":350,
			"limit_min":0,
			"dyn_bounce_coef":0.5,			
        }
    )
	
	
    p.add(p_offset)
}
