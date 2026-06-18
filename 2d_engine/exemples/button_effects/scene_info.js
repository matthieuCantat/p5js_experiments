
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
    'body_transform_bounce' ,
    'body_transform_shake',
    'body_transform_occilate',	
    'body_color_acid_rainbow' ,
    'body_color_explosion' ,		
    'particles_escape' ,
    'particles_effervescent' ,
    'particles_radial_strokes' ,
    'particles_shiny' ,
    'particles_new' ,
    'disco_ripple' ,
    'water_ripple' ,
    'glow',
    'rays',
]


for( let j = 0; j <3; j++)
{
    let pStartCol = new Vector2d(p)
    for( let i = 0; i < shape_types.length; i++)
    {

        let i_effect = (j*shape_types.length+i)% effect_names.length

        scene_info['objs']['button_effect_'+j+'_'+i] = {
            m : [pStartCol.x, pStartCol.y, 0, 40,40], 
            color : getRandomColor(), 
            interaction_settings : { enable:true, attr:'button_first_press'},
            shape_type : shape_types[i],
            event_effects : {'touchDown': { effects:[{ type:effect_names[i_effect] }], isRepeatable:true},},          
        }

        pStartCol.add(p_offset_Y)
    }
    p.add(p_offset_X)
}



//event_effects : {'touchDown': { effects:[{ type:effect_names[i_effect] }], isRepeatable:true},},
/*

    event_effects : {
        'touchDown': { effects:[{ type:'particles_radial_strokes' }], isRepeatable:true},
        'hold'     : { effects:[{ type:'particles_effervescent', duration:'hold' } ], isRepeatable:false},
        'drag'     : { effects:[{ type:'body_color_acid_rainbow', duration:'drag'}], isRepeatable:false},
        'idle'     : { effects:[{ type:'particles_new', duration:'idle'}], isRepeatable:false},
    }
 

    effects : [
        { event:'touchDown', isRepeatable:true , type:'particles_radial_strokes' },
        { event:'hold'     , isRepeatable:false, type:'particles_effervescent'  , duration:'hold' },
        { event:'drag'     , isRepeatable:false, type:'body_color_acid_rainbow' , duration:'drag'},
        { event:'idle'     , isRepeatable:false, type:'particles_new'           , duration:'idle'},
    ]

*/