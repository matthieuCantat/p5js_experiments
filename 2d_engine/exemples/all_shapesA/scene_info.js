import Vector2d from '../../utils/vector2d.js';
import Matrix2d from '../../utils/matrix2d.js';
import {COLORS, COLORS_TO_RGB} from '../../utils/draw.js'
import { get_body_sfx, get_swipe_navigation } from '../../template/event_action_template.js'

export var scene_info = {
    "objs":{},
    "cns":[],
}




// SETUP OBJS
let unit = 40
let p = new Vector2d(-150,300)
let p_offset_Y = new Vector2d(0,-unit*2)
let p_offset_X = new Vector2d(unit*2,0)
let scales = [ new Vector2d(unit,unit), new Vector2d(unit/2,unit), new Vector2d(unit,unit/2) ]

let shape_types = [ 
    'rectangle', 
    'circle', 
    'triangle' , 
    'cross',
    'trapezoid',
    'star_classic',
    'star_ai',
    'star_realistic'  ]


var curve_points = []
for( let i = 0; i < 200; i++ )
{
    let i_normalize = (i-50)*0.01
    curve_points.push( new Vector2d(i_normalize , Math.sin(i_normalize*10) ))
}    

for( let j = 0; j <scales.length; j++)
{
    let pStartCol = new Vector2d(p)
    for( let i = 0; i < shape_types.length; i++)
    {
        let color_index = Math.floor(Math.random() * COLORS.length);

        
        scene_info["objs"]['shape'+j+'_'+i] = { 
                m : [ pStartCol.x, pStartCol.y, 0, scales[j].x, scales[j].y], 
                shapes : [
                    {
                        m :[ pStartCol.x, pStartCol.y, 0, scales[j].x, scales[j].y],  
                        color: COLORS[color_index], 
                        type : shape_types[i],
                        stroke_color: "black",
                        stroke_width: 1,
                    }
                ],
                interaction_settings :{attr:'r'},
                 }

        
        pStartCol.add(p_offset_Y)
    }

    scene_info.objs[`curve${j}`] = {
        m : [ pStartCol.x, pStartCol.y, 0, scales[j].x, scales[j].y], 
        shapes : [
            {
                m :[ pStartCol.x, pStartCol.y, 0, scales[j].x, scales[j].y], 
                //color : COLORS_TO_RGB['red'],
                stroke_color : 'red',
                type : 'line',
                points : curve_points,
                stroke_width: 2,
            }
        ]
    }

    p.add(p_offset_X)
}




for( let info of get_swipe_navigation("stick_man","cns_bicycle") )
    scene_info.eventActions.push( info )

