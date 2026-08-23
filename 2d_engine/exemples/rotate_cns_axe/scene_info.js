import Vector2d from '../../utils/vector2d.js';
import Matrix2d from '../../utils/matrix2d.js';
import { COLORS } from '../../utils/draw.js'


		
export var scene_info = {
    "objs":{
        "rotate": {
            "m": [0, 0, 0, 1, 1],
            shapes : [
				{
					m : [0, 0, 0, 150],
					color: "blue", 
					type : 'circle',
				}
			],
            interaction_shapes: [
				{
					m : [0, 0, 0, 150],
					"type": "circle",
				}
			],
            "interaction_settings": {
                'type':'move',
                'enable':true,
                'coef':0.1,
                'rotate_resolution_priority':1.0,
                'radius_threshold':0,
                'do_translation':false,
            },
            "dyn_settings": {
                'enable':true,
                'mass':0.1,
                'friction_translate':0.0001,
                'friction_rotate':0.0001,
                'speed_limit_translate': 30,
                'speed_limit_rotate':1.0,
            }
        },
    },
    "cns":[],
}

let nbr = 10
let aIncr = 360/nbr
let aCurrent = 0
for( let i = 0; i < nbr; i++)
{
    let color_index = Math.floor(Math.random() * COLORS.length);

    let p = new Vector2d(0,100)
    p.rotate(aCurrent)
    
    scene_info.objs['slide'+i] = {
            name : 'slide'+i,
            m : [p.x, p.y, -aCurrent+90, 70, 20], 
            parent : 'rotate',
            shapes : [
				{
					m : [p.x, p.y, -aCurrent+90, 70, 20], 
					color: COLORS[color_index], 
					type : 'rectangle',
				}
			],
            interaction_shapes: [
				{
					m : [p.x, p.y, -aCurrent+90, 70, 20], 
					"type": "rectangle",
				}
			],
            transform_settings : {
                parent_limit_space : false,
                translate_limits: [[-100,0],[0,0]],
                rotate_limits: [-0,0],
            },
            "interaction_settings": {
                'enable':true,
                'type':'move',
                'coef':1.,
                'rotate_resolution_priority':1.,
                'radius_threshold':0,
                'do_translation':true,
            },            
            dyn_settings: {
                enable:true,
                enable_gravity:true,
                mass:0.3,
            },
        }

    let v_axe = new Vector2d().rotate(aCurrent*90)

    var axe_cns = {
        "mode": "axe",
        "driver_obj": "rotate",
        "driven_objs":['slide'+i],
        "v_axe": p,
        "enable":true,
        "enable_limits":true,
        "limit_max":300,
        "limit_min":100,
        "rotation_constraint_coef":1.0,
        'rotation_constraint_axe':0,
        "dyn_bounce_coef":0.5,
    }
	
    //scene_info.cns.push(axe_cns)


    aCurrent += aIncr
}


