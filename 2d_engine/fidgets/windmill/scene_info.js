
import { get_windmill_objs } from "../../assets/windmill.js";
import { draw_anim_curve } from '../../template/scene_info_objs_utils.js'


export var scene_info = {
    "objs": get_windmill_objs(),          
    "cns": [],
    "eventActions":[],
}



//____________________________ CNS
scene_info.cns = [

// OTHER RECTANGLES TRANSLATE
{
    mode: 'connection',
    src : [ 'rectangle_translate_down', 'trsf.get_local().getTranslateY()' ],
    dst : [ 'rectangle_translate_left', 'trsf.set_local_translateX()' ],
}, 	
{
    mode: 'expression',
    A : [ 'rectangle_translate_down', 'trsf.get_local().getTranslateY()' ],
    expression : ' A * -1 ',
    out : [ 'rectangle_translate_top', 'trsf.set_local_translateY()' ],
}, 	
{
    mode: 'expression',
    A : [ 'rectangle_translate_down', 'trsf.get_local().getTranslateY()' ],
    expression : ' A * -1 ',
    out : [ 'rectangle_translate_right', 'trsf.set_local_translateX()' ],
},



// OTHER RECTANGLES ROTATE
{
    mode: 'expression',
    A : [ 'rectangle_rotate_down', 'trsf.get_local().getRotation()' ],
    expression : ' A * 180 / 270 ',
    out : [ 'rectangle_rotate_left', 'trsf.set_local_rotationDeg()' ],
},
{
    mode: 'expression',
    A : [ 'rectangle_rotate_down', 'trsf.get_local().getRotation()' ],
    expression : ' A * 90 / 270 ',
    out : [ 'rectangle_rotate_top', 'trsf.set_local_rotationDeg()' ],
}, 


// OTHER TRAPS TRANSLATE
{
    mode: 'expression',
    A : [ 'rectangle_translate_down', 'trsf.get_local_modif().getTranslateY()' ],
    B : [ 'rectangle_rotate_down', 'trsf.get_local_modif().getRotation()' ],
    expression : ' ( B / 270 ) * -25 + ( A / 70 ) * 10 * ( 1 - ( B / 270 )) ',
    out : [ 'trap_downRight', 'trsf.set_local_translateY()' ],
},  
{
    mode: 'expression',
    A : [ 'rectangle_translate_down', 'trsf.get_local_modif().getTranslateY()' ],
    B : [ 'rectangle_rotate_down', 'trsf.get_local_modif().getRotation()' ],
    expression : ' ( B / 270 ) * -25 + ( A / 70 ) * 10 * ( 1 - ( B / 270 )) ',
    out : [ 'trap_downLeft', 'trsf.set_local_translateY()' ],
},
{
    mode: 'expression',
    A : [ 'rectangle_translate_down', 'trsf.get_local_modif().getTranslateY()' ],
    B : [ 'rectangle_rotate_down', 'trsf.get_local_modif().getRotation()' ],
    expression : ' ( B / 270 ) * -25 + ( A / 70 ) * 10 * ( 1 - ( B / 270 )) ',
    out : [ 'trap_topLeft', 'trsf.set_local_translateY()' ],
},
{
    mode: 'expression',
    A : [ 'rectangle_translate_down', 'trsf.get_local_modif().getTranslateY()' ],
    B : [ 'rectangle_rotate_down', 'trsf.get_local_modif().getRotation()' ],
    expression : ' ( B / 270 ) * -25 + ( A / 70 ) * 10 * ( 1 - ( B / 270 )) ',
    out : [ 'trap_topRight', 'trsf.set_local_translateY()' ],
},   



// OTHER TRAPS ROTATE
{
    mode: 'expression',
    A : [ 'rectangle_translate_down', 'trsf.get_local_modif().getTranslateY()' ],
    B : [ 'rectangle_rotate_down', 'trsf.get_local_modif().getRotation()' ],
    expression : ' ( 1 - A / 70 ) * 45 * ( B / 270 ) ',
    out : [ 'trap_topRight', 'trsf.set_local_modif_rotationDeg()' ],
},
{
    mode: 'expression',
    A : [ 'rectangle_translate_down', 'trsf.get_local_modif().getTranslateY()' ],
    B : [ 'rectangle_rotate_down', 'trsf.get_local_modif().getRotation()' ],
    expression : ' ( 1 - A / 70 ) * 45 * ( B / 270 )',
    out : [ 'trap_topLeft', 'trsf.set_local_modif_rotationDeg()' ],
},
{
    mode: 'expression',
    A : [ 'rectangle_translate_down', 'trsf.get_local_modif().getTranslateY()' ],
    B : [ 'rectangle_rotate_down', 'trsf.get_local_modif().getRotation()' ],
    expression : ' ( 1 - A / 70 ) * 45 * ( B / 270 )',
    out : [ 'trap_downRight', 'trsf.set_local_modif_rotationDeg()' ],
},
{
    mode: 'expression',
    A : [ 'rectangle_translate_down', 'trsf.get_local_modif().getTranslateY()' ],
    B : [ 'rectangle_rotate_down', 'trsf.get_local_modif().getRotation()' ],
    expression : ' ( 1 - A / 70 ) * 45 * ( B / 270 )',
    out : [ 'trap_downLeft', 'trsf.set_local_modif_rotationDeg()' ],
},



// STOP DYN ROTATION
{
    mode: 'expression',
    A : [ 'rectangle_translate_down', 'trsf.get_local_modif().getTranslateY()' ],
    condition : '( 1 - A / 70 ) > 0.5',
    expression : '0',
    out : [ 'traps', 'trsf.set_local_modif_rotationDeg()' ],
},  
{
    mode: 'expression',
    A : [ 'rectangle_translate_down', 'trsf.get_local_modif().getTranslateY()' ],
    condition : '( 1 - A / 70 ) > 0.5',
    expression : '0',
    out : [ 'traps', 'trsf.dyn_data.angular_momentum' ],
},  

// INTERACTION DISABLE
{
    mode: 'expression',
    A : [ 'rectangle_translate_down', 'trsf.get_local_modif().getTranslateY()' ],
    expression : ' 0.5 > ( 1 - A / 70 ) ',
    out : [ 'rectangle_rotate_down', 'interaction.settings.enable' ],
},
{
    mode: 'expression',
    A : [ 'rectangle_translate_down', 'trsf.get_local_modif().getTranslateY()' ],
    expression : ' 0.5 > ( 1 - A / 70 ) ',
    out : [ 'traps', 'interaction.settings.enable' ],
},


]	




/*
scene_info.objs['anim_curve_root_r'] = draw_anim_curve(
	'windmill_entrance',
	'root',
	'translateY',
	[-200, -200, 0, 1.0, 1.0] )
*/

/*
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
                    obj.Game_engine.Animation.start( `first_anim`,"windmill_explode", { volume : 1, fade_in_seconds : 0, loop : true } ); //"sfx_wii_short_tick_02"
                },
                duration : 1,
            },
            end : {}
        },

    },
   
 )
//windmill_transformation
//windmill_idle
*/