
import Vector2d from '../../utils/vector2d.js';
import Matrix2d from '../../utils/matrix2d.js';
import {getRandomColor} from '../../utils/draw.js'

export var scene_info = {
    "objs":{},
    "cns":[],

}


// SETUP OBJS
let p = new Vector2d(-150,200)
let p_offset_Y = new Vector2d(0,-140)
let p_offset_X = new Vector2d(140,0)

let shape_types = [ 
    'rectangle', 
    'circle', 
    'triangle',
    'rectangle', 
    'circle' ]

let effect_names = [ 
    [{ type:'body_transform_bounce' }],
    [{ type:'body_transform_shake'}],
    [{ type:'body_transform_occilate'}],	
    [{ type:'body_color_acid_rainbow' }],
    [{ type:'body_color_explosion' }],		
    [{ type:'particles_escape' }],
    [{ type:'particles_effervescent' }],
    [{ type:'particles_radial_strokes' }],
    [{ type:'particles_shiny' }],
    [{ type:'particles_new' }],
    [{ type:'disco_ripple' }],
    [{ type:'water_ripple' }],
    [{ type:'glow'}],
    [{ type:'rays'}],
]

for( let j = 0; j <3; j++)
{
    let pStartCol = new Vector2d(p)
    for( let i = 0; i < shape_types.length; i++)
    {

        let i_effect = (j*shape_types.length+i)% effect_names.length

        scene_info['objs']['button_effect_'+j+'_'+i] ={
            m : [pStartCol.x, pStartCol.y, 0, 40,40], 
            color: getRandomColor(), 
            interaction_settings :{attr:'button_first_press'},
            shape_type:shape_types[i],
            effect_name:effect_names[i_effect] 
        }

        pStartCol.add(p_offset_Y)
    }
    p.add(p_offset_X)
}