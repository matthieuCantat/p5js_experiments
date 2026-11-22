
import { get_windmill_objs } from "../../assets/windmill.js";
import { draw_anim_curve } from '../../template/scene_info_objs_utils.js'


export var scene_info = {
    "objs": get_windmill_objs(),          
    "cns": [],
    "eventActions":[],
}


let T_BUFFER = 0.01
let R_BUFFER = 0.01
//____________________________ CNS
scene_info.cns = [


//__________________________________user_interaction_A - TRANSFORM LIMIT - ROTATE

{
    mode: 'expression',
    A : [ 'user_interaction_A', 'trsf.get_local_modif().getTranslateY()' ],
    B : [ 'user_interaction_A', 'trsf.get_local_modif().getRotation()' ],
    condition : '( B / 270 ) < 0.5',
    expression : ` ( A / -70 )  < 1.0 - ${T_BUFFER} ? [0,0] : [0,270] `,
    out : [ 'user_interaction_A', 'trsf.transform_limit_args.rotate_limits' ],
},
{
    mode: 'expression',
    A : [ 'user_interaction_A', 'trsf.get_local_modif().getTranslateX()' ],
    B : [ 'user_interaction_A', 'trsf.get_local_modif().getRotation()' ],
    condition : '0.5 < ( B / 270 )',
    expression : ` 0.0 + ${T_BUFFER} < ( A / -70 )   ? [270,270] : [0,270]`,
    out : [ 'user_interaction_A', 'trsf.transform_limit_args.rotate_limits' ],
},
{
    mode: 'expression',
    A : [ 'user_interaction_A', 'trsf.get_local_modif().getRotation()' ],
    expression : `( A / 270 ) < 0.0 + ${R_BUFFER} ? [-70,0] : [-70,-70]`,
    out : [ 'user_interaction_A', 'trsf.transform_limit_args.translate_limits[1]' ],
},
{
    mode: 'expression',
    A : [ 'user_interaction_A', 'trsf.get_local_modif().getRotation()' ],
    expression : ` 1.0 - ${R_BUFFER} < ( A / 270 )? [-70,0] : [0,0]`,
    out : [ 'user_interaction_A', 'trsf.transform_limit_args.translate_limits[0]' ],
},







// OTHER RECTANGLES TRANSLATE
{
    mode: 'expression',
    A : [ 'user_interaction_A', 'trsf.get_local_modif().getTranslateY()' ],
    B : [ 'user_interaction_A', 'trsf.get_local_modif().getTranslateX()' ],
    USED : [ 'user_interaction_A', 'interaction.isLastActive' ],
    ////condition :  'USED',
    expression : 'A * -1 + B',
    out : [ 'rectangle_translate_down', 'trsf.set_local_modif_translateY()' ],
}, 		
{
    mode: 'expression',
    A : [ 'user_interaction_A', 'trsf.get_local_modif().getTranslateY()' ],
    B : [ 'user_interaction_A', 'trsf.get_local_modif().getTranslateX()' ],
    USED : [ 'user_interaction_A', 'interaction.isLastActive' ],
    //condition :  'USED',
    expression : 'A * -1 + B',
    out : [ 'rectangle_translate_left', 'trsf.set_local_modif_translateY()' ],
}, 		
{
    mode: 'expression',
    A : [ 'user_interaction_A', 'trsf.get_local_modif().getTranslateY()' ],
    B : [ 'user_interaction_A', 'trsf.get_local_modif().getTranslateX()' ],
    USED : [ 'user_interaction_A', 'interaction.isLastActive' ],
    //condition :  'USED',
    expression : 'A * -1 + B',
    out : [ 'rectangle_translate_top', 'trsf.set_local_modif_translateY()' ],
}, 
{
    mode: 'expression',
    A : [ 'user_interaction_A', 'trsf.get_local_modif().getTranslateY()' ],
    B : [ 'user_interaction_A', 'trsf.get_local_modif().getTranslateX()' ],
    USED : [ 'user_interaction_A', 'interaction.isLastActive' ],
    //condition :  'USED',
    expression : ' A * -1 + B',
    out : [ 'rectangle_translate_right', 'trsf.set_local_modif_translateY()' ],
},




// OTHER RECTANGLES ROTATE
{
    mode: 'expression',
    A : [ 'user_interaction_A', 'trsf.get_local().getRotation()' ],
    USED : [ 'user_interaction_A', 'interaction.isLastActive' ],
    //condition :  'USED',
    expression : ' A ',
    out : [ 'rectangle_rotate_down', 'trsf.set_local_rotationDeg()' ],
},
{
    mode: 'expression',
    A : [ 'user_interaction_A', 'trsf.get_local().getRotation()' ],
    USED : [ 'user_interaction_A', 'interaction.isLastActive' ],
    //condition :  'USED',
    expression : ' A * 180 / 270 ',
    out : [ 'rectangle_rotate_left', 'trsf.set_local_rotationDeg()' ],
},
{
    mode: 'expression',
    A : [ 'user_interaction_A', 'trsf.get_local().getRotation()' ],
    USED : [ 'user_interaction_A', 'interaction.isLastActive' ],
    //condition :  'USED',
    expression : ' A * 90 / 270 ',
    out : [ 'rectangle_rotate_top', 'trsf.set_local_rotationDeg()' ],
}, 


// OTHER TRAPS TRANSLATE
{
    mode: 'expression',
    A : [ 'user_interaction_A', 'trsf.get_local_modif().getTranslateY()' ],
    B : [ 'user_interaction_A', 'trsf.get_local_modif().getRotation()' ],
    USED : [ 'user_interaction_A', 'interaction.isLastActive' ],
    //condition :  'USED',
    expression : ' ( B / 270 ) * -25 + ( A / -70 ) * 10 * ( 1 - ( B / 270 )) ',
    out : [ 'trap_downRight', 'trsf.set_local_translateY()' ],
},  
{
    mode: 'expression',
    A : [ 'user_interaction_A', 'trsf.get_local_modif().getTranslateY()' ],
    B : [ 'user_interaction_A', 'trsf.get_local_modif().getRotation()' ],
    USED : [ 'user_interaction_A', 'interaction.isLastActive' ],
    //condition :  'USED',
    expression : ' ( B / 270 ) * -25 + ( A / -70 ) * 10 * ( 1 - ( B / 270 )) ',
    out : [ 'trap_downLeft', 'trsf.set_local_translateY()' ],
},
{
    mode: 'expression',
    A : [ 'user_interaction_A', 'trsf.get_local_modif().getTranslateY()' ],
    B : [ 'user_interaction_A', 'trsf.get_local_modif().getRotation()' ],
    USED : [ 'user_interaction_A', 'interaction.isLastActive' ],
    //condition :  'USED',
    expression : ' ( B / 270 ) * -25 + ( A / -70 ) * 10 * ( 1 - ( B / 270 )) ',
    out : [ 'trap_topLeft', 'trsf.set_local_translateY()' ],
},
{
    mode: 'expression',
    A : [ 'user_interaction_A', 'trsf.get_local_modif().getTranslateY()' ],
    B : [ 'user_interaction_A', 'trsf.get_local_modif().getRotation()' ],
    USED : [ 'user_interaction_A', 'interaction.isLastActive' ],
    //condition :  'USED',
    expression : ' ( B / 270 ) * -25 + ( A / -70 ) * 10 * ( 1 - ( B / 270 )) ',
    out : [ 'trap_topRight', 'trsf.set_local_translateY()' ],
},   


// OTHER TRAPS ROTATE
{
    mode: 'expression',
    A : [ 'user_interaction_A', 'trsf.get_local_modif().getTranslateX()' ],
    B : [ 'user_interaction_A', 'trsf.get_local_modif().getRotation()' ],
    USED : [ 'user_interaction_A', 'interaction.isLastActive' ],
    //condition :  'USED',
    expression : ' ( A / -70 ) * 45 * ( B / 270 ) ',
    out : [ 'trap_topRight', 'trsf.set_local_modif_rotationDeg()' ],
},
{
    mode: 'expression',
    A : [ 'user_interaction_A', 'trsf.get_local_modif().getTranslateX()' ],
    B : [ 'user_interaction_A', 'trsf.get_local_modif().getRotation()' ],
    USED : [ 'user_interaction_A', 'interaction.isLastActive' ],
    //condition :  'USED',
    expression : ' ( A / -70 ) * 45 * ( B / 270 )',
    out : [ 'trap_topLeft', 'trsf.set_local_modif_rotationDeg()' ],
},
{
    mode: 'expression',
    A : [ 'user_interaction_A', 'trsf.get_local_modif().getTranslateX()' ],
    B : [ 'user_interaction_A', 'trsf.get_local_modif().getRotation()' ],
    USED : [ 'user_interaction_A', 'interaction.isLastActive' ],
    //condition :  'USED',
    expression : ' ( A / -70 ) * 45 * ( B / 270 )',
    out : [ 'trap_downRight', 'trsf.set_local_modif_rotationDeg()' ],
},
{
    mode: 'expression',
    A : [ 'user_interaction_A', 'trsf.get_local_modif().getTranslateX()' ],
    B : [ 'user_interaction_A', 'trsf.get_local_modif().getRotation()' ],
    USED : [ 'user_interaction_A', 'interaction.isLastActive' ],
    //condition :  'USED',
    expression : ' ( A / -70 ) * 45 * ( B / 270 )',
    out : [ 'trap_downLeft', 'trsf.set_local_modif_rotationDeg()' ],
},


// OTHERS




// STOP DYN ROTATION
{
    mode: 'expression',
    A : [ 'user_interaction_A', 'trsf.get_local_modif().getTranslateY()' ],
    USER : [ 'user_interaction_A', 'interaction.isLastActive' ],
    condition : '( USER !== null )&&( 0.5 > ( A / -70 )  )',
    expression : '0',
    out : [ 'traps', 'trsf.set_local_modif_rotationDeg()' ],
},  
{
    mode: 'expression',
    A : [ 'user_interaction_A', 'trsf.get_local_modif().getTranslateY()' ],
    USER : [ 'user_interaction_A', 'interaction.isLastActive' ],
    condition : '( USER !== null )&&( 0.5 > ( A / -70 ) )',
    expression : '0',
    out : [ 'traps', 'trsf.dyn_data.angular_momentum' ],
},  
{
    mode: 'expression',
    A : [ 'user_interaction_A', 'trsf.get_local_modif().getTranslateX()' ],
    USER : [ 'user_interaction_A', 'interaction.isLastActive' ],
    condition : '( USER !== null )&&( ( A / -70 ) > 0.5 )',
    expression : '0',
    out : [ 'traps', 'trsf.set_local_modif_rotationDeg()' ],
},  
{
    mode: 'expression',
    A : [ 'user_interaction_A', 'trsf.get_local_modif().getTranslateX()' ],
    USER : [ 'user_interaction_A', 'interaction.isLastActive' ],
    condition : '( USER !== null )&&( ( A / -70 ) > 0.5 )',
    expression : '0',
    out : [ 'traps', 'trsf.dyn_data.angular_momentum' ],
},  

]	



 
scene_info.eventActions.push( 
    {
        event : {
            start : {
                in_args : [  ],
                fn : (obj) => {
                    return true;
                }
            },
            end : null,
            max_duration : 1,
        },
        action : {
            
            start : {
                in_args : [ 'root' ],
                fn : (obj) => {

                    for( let cns of obj.Game_engine.Constraints.data )cns.enable = false

                    obj.Game_engine.Animation.end(  null,{ fade_out_seconds  : 20 } )
                    obj.Game_engine.Animation.start( 
                        `transform_anim`,
                        "windmill_entrance", 
                        { volume : 1, fade_in_seconds : 20, loop : true, end_fn : ()=>{ for( let cns of obj.Game_engine.Constraints.data )cns.enable = true } } ); //"sfx_wii_short_tick_02"
                },
                duration : 1,
            },
            end : {}
        },

    },
   
 )


 
 scene_info.eventActions.push( 
    {
        event : {
            start : {
                in_args : [ 'user_interaction_A' ],
                fn : (obj) => {
                    let status = false
                    if( 0.99 < obj.trsf.get_local_modif().getTranslateX() / -70  )
                    {
                        status = true
                    }
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
                    for( let cns of obj.Game_engine.Constraints.data )cns.enable = false
                    obj.Game_engine.Animation.end(  null,{ fade_out_seconds  : 20 } )
                    obj.Game_engine.Animation.start( `explode_anim`,"windmill_explode", { volume : 1, fade_in_seconds : 20, loop : true } ); //"sfx_wii_short_tick_02"
                },
                duration : 1,
            },
            end : {}
        },

    },
   
 )
