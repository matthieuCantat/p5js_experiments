import Vector2d from '../../utils/vector2d.js';
import Matrix2d from '../../utils/matrix2d.js';
import { COLORS } from '../../utils/draw.js'


		
export var scene_info = {
    "objs":{
        "rotate": {
            "m": [0, 0, 0, 150],
            "color": "blue",
            "shape_type": "circle_rot",
            "interaction_settings": {
                'enable':true,
                'coef':0.01,
                'rotate_resolution_priority':1.0,
                'radius_threshold':0,
                'do_translation':false,
            },
            "dyn_settings": {
                'enable':true,
                'mass':1,
                'friction_translate':0.0001,
                'friction_rotate':0.001,
                'speed_limit_translate': 30,
                'speed_limit_rotate':0.3,
            }
        },
    },
    "cns":[],
}

let nbr = 10
let aIncr = 3.14*2/nbr
let aCurrent = 0
for( let i = 0; i < nbr; i++)
{
    let color_index = Math.floor(Math.random() * COLORS.length);

    let p = new Vector2d(0,100)
    p.rotate(aCurrent)
    
    let v_axe = new Vector2d(Math.cos(aCurrent),Math.sin(aCurrent))
    
    scene_info.objs['slide'+i] = {
            m : [p.x, p.y, aCurrent+3.14/2, 70, 20], 
            color: COLORS[color_index], 
            shape_type:'rectangle',
            dyn_settings: {
                enable:true,
                enable_gravity:true,
                mass:0.3,
            },
        }

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
	
    scene_info.cns.push(axe_cns)


    aCurrent += aIncr
}


