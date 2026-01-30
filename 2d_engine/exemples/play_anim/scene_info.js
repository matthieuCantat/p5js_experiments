import Vector2d from '../../utils/vector2d.js';
import Matrix2d from '../../utils/matrix2d.js';
import { COLORS } from '../../utils/draw.js'


		
export var scene_info = {"objs":{}, 'cns':[]}

let timeline_zoom = 1.0;
let incr = 10 * timeline_zoom
for( let i=0; i<Math.ceil(110*2/incr)+1; i++ ){
scene_info["objs"]["step"+i] = {
        "m": [-90+incr*i, -350, 0, 0.5,10],
        "color": "blue",
        "shape_type": "rectangle",
        "stroke_width": 0.1,
    } 
}


scene_info["objs"] = {
    ...scene_info["objs"],        
    "play_timeline": {
        "m": [20, -350, 0, 110,3],
        "color": "blue",
        "shape_type": "rectangle",
    },

    "play_cursor": {
        "m": [20, -350, 0, 5,20],
        "color": "blue",
        "shape_type": "rectangle",
        "txt": 1,
        "interaction_settings": {
            'enable':true,
            'coef':1.0,
            'rotate_resolution_priority':0.0,
            'radius_threshold':0,
            'do_translation':true,
            'scale_selection_shape':4,
        }, 
        "event_effects" : {
            'touchDown': { effects:[{ type:'particles_radial_strokes' }], isRepeatable:true},
            'touchUp': { effects:[{ type:'water_ripple'}], isRepeatable:true},
            'drag': { effects:[{ type:'body_color_acid_rainbow', duration:'drag'}], isRepeatable:false},
        },                      
    }, 
    "play_cursor_txt": {
        "m": [20, -320, 0, 5,20],
        "color": "red",
        "shape_type": "text",
        "txt": 1,                     
    },       
    "play_button": {
        "m": [-145, -350, 90, 20,20],
        "color": "blue",
        "shape_type": "triangle",
        "interaction_settings": {
            'enable':true,
            'coef':0.0,
            'rotate_resolution_priority':1.0,
            'radius_threshold':0,
            'do_translation':false,
            'scale_selection_shape':3.0,
        },
        

        "event_effects" : {
            'touchDown': { effects:[{ type:'particles_radial_strokes' }], isRepeatable:true},
            'touchUp': { effects:[{ type:'water_ripple'}], isRepeatable:true},
        },    
        
    },            
}

scene_info['cns'] = [
    {
        mode: 'axe',
        driver_obj: [20, -350, 0 , 60,20],
        driven_objs: ['play_cursor',"play_cursor_txt"],
        v_axe: [1,0],
        enable:true,
        enable_limits:true,
        limit_max: 110,
        limit_min: -110,
        rotation_constraint_coef:1.0,
        rotation_constraint_axe: 0,
        step_incr: incr
    },    
]

scene_info["objs"]["play_button"]["event_cmds"] = {
    'touchDown': [ "scene_info['cns']['step_incr'] = 0" ],
}



