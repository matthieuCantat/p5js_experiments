import Vector2d from '../utils/vector2d.js';
import Matrix2d from '../utils/matrix2d.js';
import {COLORS} from '../utils/draw.js'


export var scene_info = {
    "objs":{},
    "cns":[],
}




// SETUP OBJS
let unit = 40
let p = new Vector2d(-150,200)
let p_offset_Y = new Vector2d(0,-unit*2)
let p_offset_X = new Vector2d(unit*2,0)
let scales = [ new Vector2d(unit,unit), new Vector2d(unit/2,unit), new Vector2d(unit,unit/2) ]

let shape_types = [ 
    'rectangle', 
    'circle', 
    'circle_rot',
    'triangle' , 
    'cross',
    'trapezoid',
    'star_classic',
    'star_ai',
    'star_realistic'  ]

for( let j = 0; j <scales.length; j++)
{
    let pStartCol = new Vector2d(p)
    for( let i = 0; i < shape_types.length; i++)
    {
        let color_index = Math.floor(Math.random() * COLORS.length);

        
        scene_info["objs"]['shape'+j+'_'+i] = { 
                m : [ pStartCol.x, pStartCol.y, 0, scales[j].x, scales[j].y], 
                color: COLORS[color_index], 
                interaction_settings :{attr:'r'},
                shape_type:shape_types[i] }

        
        pStartCol.add(p_offset_Y)
    }
    p.add(p_offset_X)
}

