import Vector2d from '../../utils/vector2d.js';
import Matrix2d from '../../utils/matrix2d.js';
import { COLORS } from '../../utils/draw.js'
import { get_body_sfx } from '../../template/event_action_template.js'


export var scene_info = {
    "objs":{
		"pos": {
			"m": [-100, 0, 0, 1, 1],
			"shapes" : [
				{
					"m": [-100, 0, 0, 50, 50],
					"color": "red",
					"type": "circle",
					"stroke_color":"black",
					"stroke_width":1,
				}
			],
			"interaction_shapes": [
				{
					"m" :  [-100, 0, 0, 50, 50],
					"type": "circle",
				}
			],
			"interaction_settings": {
				"enable": true,
				"coef": 1.0,
				"rotate_resolution_priority": 0.0,
				"radius_threshold": 0,
				"do_translation": true
			},
			transform_settings : {
				parent_limit_space : false,
				translate_limits: [[-30,230],[-300,300]],
				rotate_limits: [0,0],
			},            
			"dyn_settings": {
				"enable": false,
				enable_gravity:false,
				mass:0.9,
				"friction_translate": 0.1,
				"friction_rotate": 0.001,
				"speed_limit_translate": 30,
				"speed_limit_rotate": 0.3
			},
			"debug":{
				"shape_interaction_visibility" : false,
			},		
			event_type : "simple",		        
		},		
        "MVT": {
			"m": [0, 0, 0, 1, 1],
			"shapes" : [
				{
					"m": [0, 0, 0, 50, 50],
					"color": "yellow",
					"type": "circle",
					"stroke_color":"black",
					"stroke_width":1,
				}
			],
			"interaction_shapes": [
				{
					"m" :  [0, 0, 0, 50, 50],
					"type": "circle",
				}
			],
			"interaction_settings": {
				"enable": true,
				"coef": 1.0,
				"rotate_resolution_priority": 0.0,
				"radius_threshold": 0,
				"do_translation": true
			},
			transform_settings : {
				parent_limit_space : false,
				translate_limits: [[-130,130],[-300,300]],
				rotate_limits: [0,0],
			},            
			"dyn_settings": {
				"enable": false,
				enable_gravity:false,
				mass:0.9,
				"friction_translate": 0.1,
				"friction_rotate": 0.001,
				"speed_limit_translate": 30,
				"speed_limit_rotate": 0.3
			},
			"debug":{
				"shape_interaction_visibility" : false,
			},		
			event_type : "simple",		        
		},	
		"robot": {
			"m": [100, 0, 0, 1, 1],
			"shapes" : [
				{
					"m": [100, 0, 0, 50, 50],
					"color": "blue",
					"type": "circle",
					"stroke_color":"black",
					"stroke_width":1,
				}
			],
			"interaction_shapes": [
				{
					"m" :  [100, 0, 0, 50, 50],
					"type": "circle",
				}
			],
			"interaction_settings": {
				"enable": true,
				"coef": 1.0,
				"rotate_resolution_priority": 0.0,
				"radius_threshold": 0,
				"do_translation": true
			},
			transform_settings : {
				parent_limit_space : false,
				translate_limits: [[-230,30],[-300,300]],
				rotate_limits: [0,0],
			},            
			"dyn_settings": {
				"enable": false,
				enable_gravity:false,
				mass:0.9,
				"friction_translate": 0.1,
				"friction_rotate": 0.001,
				"speed_limit_translate": 30,
				"speed_limit_rotate": 0.3
			},
			"debug":{
				"shape_interaction_visibility" : false,
			},		
			event_type : "simple",		        
		},
		"woosh": {
			"m": [100, 100, 0, 1, 1],
			"shapes" : [
				{
					"m": [100, 100, 0, 50, 50],
					"color": "green",
					"type": "circle",
					"stroke_color":"black",
					"stroke_width":1,
				}
			],
			"interaction_shapes": [
				{
					"m" :  [100, 100, 0, 50, 50],
					"type": "circle",
				}
			],
			"interaction_settings": {
				"enable": true,
				"coef": 1.0,
				"rotate_resolution_priority": 0.0,
				"radius_threshold": 0,
				"do_translation": true
			},
			transform_settings : {
				parent_limit_space : false,
				translate_limits: [[-230,30],[-500,200]],
				rotate_limits: [0,0],
			},            
			"dyn_settings": {
				"enable": false,
				enable_gravity:false,
				mass:0.9,
				"friction_translate": 0.1,
				"friction_rotate": 0.001,
				"speed_limit_translate": 30,
				"speed_limit_rotate": 0.3
			},
			"debug":{
				"shape_interaction_visibility" : false,
			},		
			event_type : "simple",		        
		},	
		"muse": {
			"m": [0, 100, 0, 1, 1],
			"shapes" : [
				{
					"m": [0, 100, 0, 50, 50],
					"color": "purple",
					"type": "circle",
					"stroke_color":"black",
					"stroke_width":1,
				}
			],
			"interaction_shapes": [
				{
					"m" :  [0, 100, 0, 50, 50],
					"type": "circle",
				}
			],
			"interaction_settings": {
				"enable": true,
				"coef": 1.0,
				"rotate_resolution_priority": 0.0,
				"radius_threshold": 0,
				"do_translation": true
			},
			transform_settings : {
				parent_limit_space : false,
				translate_limits: [[-130,130],[-500,200]],
				rotate_limits: [0,0],
			},            
			"dyn_settings": {
				"enable": false,
				enable_gravity:false,
				mass:0.9,
				"friction_translate": 0.1,
				"friction_rotate": 0.001,
				"speed_limit_translate": 30,
				"speed_limit_rotate": 0.3
			},
			"debug":{
				"shape_interaction_visibility" : false,
			},		
			event_type : "simple",		        
		},					
	},
	"cns": [],	
	"eventActions" : []					
}



scene_info.eventActions.push( 
    {
        event : {
            start : {
                in_args : [ 'pos' ],
                fn : (obj) => {
                    let status = false
                    if( obj.Event.data.user['grab'].status )
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
                in_args : [ 'pos' ],
                fn : (obj) => {
                    obj.Game_engine.Sound.start( `gain_whiteSound`,"ost_quest2_whiteSound_02", { volume : 1, fade_in_seconds : 0, loop : true } ); //"sfx_wii_short_tick_02"
                },
                duration : 1,
            },
            
            duration : {
                in_args : [ 'pos' ],
                fn : (obj) => {
                    let p = obj.trsf.get().get_row(2)
					// POSITION BASED
					let volume =  (p.y +300)/600;
					let lowPass = (p.x +200)/400*1500;


                    obj.Game_engine.Sound.modif( `gain_whiteSound`,{ volume : volume, lowPass : lowPass } ); //"sfx_wii_short_tick_02"
                },
                duration : 1,
            },
            
            end : {
                in_args : [ 'pos' ],
                fn : (obj) => {
                    obj.Game_engine.Sound.end( `gain_whiteSound`, { fade_in_seconds : 1 } ); //"sfx_wii_short_tick_02"
                },
                duration : 1,
            }
        },

    },
    {
        event : {
            start : {
                in_args : [ 'MVT' ],
                fn : (obj) => {
                    let status = false
                    if( obj.Event.data.user['grab'].status )
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
                in_args : [ 'MVT' ],
                fn : (obj) => {
                    obj.Game_engine.Sound.start( `mvt`,"ost_quest2_whiteSound_02", { volume : 1, fade_in_seconds : 0, loop : true } ); //"sfx_wii_short_tick_02"
                },
                duration : 1,
            },
            
            duration : {
                in_args : [ 'MVT' ],
                fn : (obj) => {
					// MVT BASED
					let volume = obj.trsf.dyn_data.t_speed*0.5
					let lowPass = obj.trsf.dyn_data.t_accelecation

                    obj.Game_engine.Sound.modif( `gain_whiteSound`,{ volume : volume, lowPass : lowPass } ); 
				},
                duration : 1,
            },
            
            end : {
                in_args : [ 'MVT' ],
                fn : (obj) => {
                    obj.Game_engine.Sound.end( `mvt`, { fade_in_seconds : 1 } ); //"sfx_wii_short_tick_02"
                },
                duration : 1,
            }
        },

    },
	{
        event : {
            start : {
                in_args : [ 'robot' ],
                fn : (obj) => {
                    let status = false
                    if( obj.Event.data.user['grab'].status )
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
                in_args : [ 'robot' ],
                fn : (obj) => {
                    obj.Game_engine.Sound.start( `oscillator`,"oscillator", { volume : 1, fade_in_seconds : 0, loop : true } ); //"sfx_wii_short_tick_02"
                },
                duration : 1,
            },
            
            duration : {
                in_args : [ 'robot' ],
                fn : (obj) => {
                    let p = obj.trsf.get().get_row(2)
					// POSITION BASED
					let volume =  (p.y +300)/600;
					let lowPass = null//(p.x +200)/400*1500;
					// MVT BASED
					//console.log(  obj.trsf.dyn_data.t_acceleration )

					let oscillator_frequency = obj.trsf.dyn_data.t_speed*10.01 * 440
					let oscillator_amplitude = obj.trsf.dyn_data.t_speed*0.5

                    obj.Game_engine.Sound.modif( `oscillator`,{ volume : volume, lowPass : lowPass, oscillator_amplitude : oscillator_amplitude, oscillator_frequency:oscillator_frequency } ); //"sfx_wii_short_tick_02"
                },
                duration : 1,
            },
            
            end : {
                in_args : [ 'robot' ],
                fn : (obj) => {
                    obj.Game_engine.Sound.end( `oscillator`, { fade_in_seconds : 1 } ); //"sfx_wii_short_tick_02"
                },
                duration : 1,
            }
        },
	},
	{
        event : {
            start : {
                in_args : [ 'woosh' ],
                fn : (obj) => {
                    let status = false
                    if( obj.Event.data.user['grab'].status )
                    {
						if( 90 < obj.trsf.dyn_data.t_speed)
                        	status = true
                    }
                    return status;
                }
            },
            end : null,
            max_duration : 1000,
        },
        action : {
            
            start : {
                in_args : [ 'woosh' ],
                fn : (obj) => {
                    obj.Game_engine.Sound.start( `woosh`,"sfx_woosh_04", { volume : 1, fade_in_seconds : 0, loop : false } ); //"sfx_wii_short_tick_02"
                },
                duration : 1,
            },

            duration : {
                in_args : [ 'woosh' ],
                fn : (obj) => {
                    let p = obj.trsf.get().get_row(2)
					// POSITION BASED
					let volume =  Math.min( 1, obj.trsf.dyn_data.t_speed/90);
					let lowPass = 0//obj.trsf.dyn_data.t_accelecation*1500
					// MVT BASED
					
                    obj.Game_engine.Sound.modif( `woosh`,{ volume : volume, lowPass : lowPass } ); //"sfx_wii_short_tick_02"
                },
                duration : 1,
            },
            end : {
                in_args : [ 'woosh' ],
                fn : (obj) => {
                    obj.Game_engine.Sound.end( `woosh`, { fade_in_seconds : 1 } ); //"sfx_wii_short_tick_02"
                },
                duration : 1,
            }
        },
	}
	,
	{
        event : {
            start : {
                in_args : [ 'muse' ],
                fn : (obj) => {
                    let status = false
                    if( obj.Event.data.user['grab'].status )
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
                in_args : [ 'muse' ],
                fn : (obj) => {
                    obj.Game_engine.Sound.start( `oscillator`,"oscillator", { volume : 1, fade_in_seconds : 0, loop : true } ); //"sfx_wii_short_tick_02"
                },
                duration : 1,
            },
            
            duration : {
                in_args : [ 'muse' ],
                fn : (obj) => {
                    let p = obj.trsf.get().get_row(2)
					

                    obj.Game_engine.Sound.modif( `oscillator`,
						{ volume : 1, 
						  lowPass : null, 
						  oscillator_amplitude : 0, 
						  oscillator_frequency:(p.y +300)/600*0.1,
						  oscillator_offset : (p.y +300)/600 * 440 } ); //"sfx_wii_short_tick_02"
                },
                duration : 1,
            },
            
            end : {
                in_args : [ 'muse' ],
                fn : (obj) => {
                    obj.Game_engine.Sound.end( `oscillator`, { fade_in_seconds : 1 } ); //"sfx_wii_short_tick_02"
                },
                duration : 1,
            }
        },
	},
 )
