
import { get_windmill_objs } from "../../assets/windmill.js";
import { draw_anim_curve } from '../../template/scene_info_objs_utils.js'


export var scene_info = {
    "objs": get_windmill_objs(),          
    "cns": [],
    "eventActions":[],
}

/*

scene_info.objs['anim_curve_root_r'] = draw_anim_curve(
	'windmill_transformation',
	'rectangle_rotate_top',
	'rotate',
	[-200, -200, 0, 1.0, 1.0] )
*/


scene_info.eventActions.push( 
    {
        event : {
            start : {
                in_args : [ 'root' ],
                fn : (obj) => {
                    let status = false
                    if( 5 < obj.Game_engine.Time.frame)
                        status = true
                    
                    return status;
                }
            },
            end : null,
            max_duration : 1,
        },
        action : {
            
            start : {
                in_args : [ 'root' ],
                fn : (obj) => {
                    obj.Game_engine.Animation.start( `first_anim`,"windmill_idle", { volume : 1, fade_in_seconds : 0, loop : true } ); //"sfx_wii_short_tick_02"
                },
                duration : 1,
            },
            end : {}
        },

    },
   
 )
//windmill_transformation
//windmill_idle