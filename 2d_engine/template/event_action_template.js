
import { list_get_random } from '../utils/utils.js'


export function get_body_sfx( body_name)
{

    let hit_bells = [
        "sfx_wii_bell_simple_01",
        "sfx_wii_bell_simple_02",
        "sfx_wii_bell_simple_03",
        "sfx_wii_bell_simple_04",
        "sfx_wii_bell_simple_05",
        "sfx_wii_bell_simple_06", 
    ]

    let move_wooshs = [     
        //"sfx_woosh_01",
        //"sfx_woosh_02",
        //"sfx_woosh_03",
        //"sfx_woosh_04",
        "sfx_wii_artificial_slide_down_01",
        "sfx_wii_artificial_slide_up_01",
        "sfx_wii_low_vibration_up_01",
    ]
    let sounds = {
        'hold' : list_get_random( [ "sfx_creature_synth_03" ] ),
        "tap" : list_get_random( [ "sfx_wii_bell_long_01" ] ),
        "doubleTap" : list_get_random( [ "sfx_wii_synth_bell_melodie_01" ] ),
        "grab" : list_get_random( [ "sfx_wii_short_tick_02" ] ),
        "release": list_get_random( [ "sfx_occulus_tap_dry_hollow_01" ] ),
        "limit_hit_tx+" : list_get_random( hit_bells ),
        "limit_hit_tx-" : list_get_random( hit_bells ),
        "limit_hit_ty+" : list_get_random( hit_bells ),
        "limit_hit_ty-" : list_get_random( hit_bells ),
        "limit_hit_r+" : list_get_random( hit_bells ),
        "limit_hit_r-" : list_get_random( hit_bells ),
        "move_tx+" : list_get_random( move_wooshs ),
        "move_tx-" : list_get_random( move_wooshs),
        "move_ty+" : list_get_random( move_wooshs ),
        "move_ty-" : list_get_random( move_wooshs ),
        "move_r+" : list_get_random( move_wooshs ),
        "move_r-" : list_get_random( move_wooshs ), 
        "UserPullStretch" : list_get_random( [ "sfx_ballon_squeak_stretch_01" ] ),   
    }

    

return [
    {
        event : {
            start : {
                in_args : [ body_name ],
                fn : (obj) => {return obj.Event.data.user['hold'].status;}
            },
            end : null,
            max_duration : 1,
        },
        action : {
            
            start : {
                in_args : [ body_name ],
                fn : (obj) => {
                    obj.Game_engine.Sound.start( `${body_name}hold`,sounds['hold'], { volume : 1, fade_in_seconds : 2, loop : true } ); //"sfx_wii_short_tick_02"
                },
                duration : 1,
            },	
            
            end : {
                in_args : [ body_name ],
                fn : (obj) => {
                    obj.Game_engine.Sound.end( `${body_name}hold`, { fade_out_seconds : 2 } );
                },
                duration : 1,
            },
        },

    },
    {
        event : {
            start : {
                in_args : [ body_name ],
                fn : (obj) => {return obj.Event.data.user['tap'].status;}
            },
            end : null,
            max_duration : 1,
        },
        action : {
            
            start : {
                in_args : [ body_name ],
                fn : (obj) => {
                    obj.Game_engine.Sound.start( `${body_name}tap`,sounds['tap'], { volume : 1, fade_in_seconds : 0, loop : false } ); //"sfx_wii_short_tick_02"
                },
                duration : 1,
            },	
            
            end : {}
        },

    },
    {
        event : {
            start : {
                in_args : [ body_name ],
                fn : (obj) => {return obj.Event.data.user['doubleTap'].status;}
            },
            end : null,
            max_duration : 1,
        },
        action : {
            
            start : {
                in_args : [ body_name ],
                fn : (obj) => {
                    obj.Game_engine.Sound.start( `${body_name}doubleTap`,sounds['doubleTap'], { volume : 1, fade_in_seconds : 0, loop : false } ); //"sfx_wii_short_tick_02"
                },
                duration : 1,
            },	
            
            end : {}
        },

    },	
    {
        event : {
            start : {
                in_args : [ body_name ],
                fn : (obj) => {return obj.Event.data.user['grab'].status;}
            },
            end : null,
            max_duration : 1,
        },
        action : {
            
            start : {
                in_args : [ body_name ],
                fn : (obj) => {
                    obj.Game_engine.Sound.start( `${body_name}grab`,sounds['grab'], { volume : 1, fade_in_seconds : 0, loop : false } ); //"sfx_wii_short_tick_02"
                },
                duration : 1,
            },	
            
            end : {}
        },

    },
    {
        event : {
            start : {
                in_args : [ body_name ],
                fn : (obj) => {return obj.Event.data.user['release'].status;}
            },
            end : null,
            max_duration : 1,
        },
        action : {
            
            start : {
                in_args : [ body_name ],
                fn : (obj) => {
                    obj.Game_engine.Sound.start( `${body_name}release`,sounds['release'], { volume : 1, fade_in_seconds : 0, loop : false } ); //"sfx_wii_short_tick_02"
                },
                duration : 1,
            },	
            
            end : {}
        },

    },
    {
        event : {
            start : {
                in_args : [ body_name ],
                fn : (obj) => {return obj.Event.data.obj['limit_hit_tx+'].status;}
            },
            end : null,
            max_duration : 1,
        },
        action : {
            
            start : {
                in_args : [ body_name ],
                fn : (obj) => {
                    obj.Game_engine.Sound.start( `${body_name}hit_tx+`,sounds['limit_hit_tx+'], { volume : 1, fade_in_seconds : 0, loop : false } ); //"sfx_wii_short_tick_02"
                },
                duration : 1,
            },	
            
            end : {}
        },

    },
    {
        event : {
            start : {
                in_args : [ body_name ],
                fn : (obj) => {return obj.Event.data.obj['limit_hit_tx-'].status;}
            },
            end : null,
            max_duration : 1,
        },
        action : {
            
            start : {
                in_args : [ body_name ],
                fn : (obj) => {
                    obj.Game_engine.Sound.start( `${body_name}hit_tx-`,sounds['limit_hit_tx-'], { volume : 1, fade_in_seconds : 0, loop : false } ); //"sfx_wii_short_tick_02"
                },
                duration : 1,
            },	
            
            end : {}
        },

    },
    {
        event : {
            start : {
                in_args : [ body_name ],
                fn : (obj) => {return obj.Event.data.obj['limit_hit_ty+'].status;}
            },
            end : null,
            max_duration : 1,
        },
        action : {
            
            start : {
                in_args : [ body_name ],
                fn : (obj) => {
                    obj.Game_engine.Sound.start( "limit_hit_ty+",sounds['limit_hit_ty+'], { volume : 1, fade_in_seconds : 0, loop : false } ); //"sfx_wii_short_tick_02"
                },
                duration : 1,
            },	
            
            end : {}
        },

    },
    {
        event : {
            start : {
                in_args : [ body_name ],
                fn : (obj) => {return obj.Event.data.obj['limit_hit_ty-'].status;}
            },
            end : null,
            max_duration : 1,
        },
        action : {
            
            start : {
                in_args : [ body_name ],
                fn : (obj) => {
                    obj.Game_engine.Sound.start( "limit_hit_ty-",sounds['limit_hit_ty-'], { volume : 1, fade_in_seconds : 0, loop : false } ); //"sfx_wii_short_tick_02"
                },
                duration : 1,
            },	
            
            end : {}
        },

    },	
    {
        event : {
            start : {
                in_args : [ body_name ],
                fn : (obj) => {return obj.Event.data.obj['limit_hit_r+'].status;}
            },
            end : null,
            max_duration : 1,
        },
        action : {
            
            start : {
                in_args : [ body_name ],
                fn : (obj) => {
                    obj.Game_engine.Sound.start( `${body_name}hit_r+`,sounds['limit_hit_r+'], { volume : 1, fade_in_seconds : 0, loop : false } ); //"sfx_wii_short_tick_02"
                },
                duration : 1,
            },	
            
            end : {}
        },

    },
    {
        event : {
            start : {
                in_args : [ body_name ],
                fn : (obj) => {return obj.Event.data.obj['limit_hit_r-'].status;}
            },
            end : null,
            max_duration : 1,
        },
        action : {
            
            start : {
                in_args : [ body_name ],
                fn : (obj) => {
                    obj.Game_engine.Sound.start( `${body_name}hit_r-`,sounds['limit_hit_r-'], { volume : 1, fade_in_seconds : 0, loop : false } ); //"sfx_wii_short_tick_02"
                },
                duration : 1,
            },	
            
            end : {}
        },

    },	
    {
        event : {
            start : {
                in_args : [ body_name ],
                fn : (obj) => {return obj.Event.data.obj['move_tx+'].status;}
            },
            end : null,
            max_duration : 1,
        },
        action : {
            
            start : {
                in_args : [ body_name ],
                fn : (obj) => {
                    obj.Game_engine.Sound.start( 
                        `${body_name}move_tx+`,
                        sounds['move_tx+'], 
                        { volume : 1, 
                            fade_in_seconds : 0, 
                            loop : false } ); //"sfx_wii_short_tick_02"
                },
                duration : 1,
            },	
            end : {
                in_args : [ body_name ],
                fn : (obj) => {
                    obj.Game_engine.Sound.end( `${body_name}move_tx+`, { fade_out_seconds :  0.1 } );
                },
                duration : 1,
            },
        },

    },	
    {
        event : {
            start : {
                in_args : [ body_name ],
                fn : (obj) => {return obj.Event.data.obj['move_tx-'].status;}
            },
            end : null,
            max_duration : 1,
        },
        action : {
            
            start : {
                in_args : [ body_name ],
                fn : (obj) => {
                    obj.Game_engine.Sound.start( 
                        `${body_name}move_tx-`,
                        sounds['move_tx-'], 
                        { volume : 1, 
                            fade_in_seconds : 0, 
                            loop : false } ); //"sfx_wii_short_tick_02"
                },
                duration : 1,
            },	
            end : {
                in_args : [ body_name ],
                fn : (obj) => {
                    obj.Game_engine.Sound.end( `${body_name}move_tx-`, { fade_out_seconds :  0.1 } );
                },
                duration : 1,
            },
        },

    },	
    {
        event : {
            start : {
                in_args : [ body_name ],
                fn : (obj) => {return obj.Event.data.obj['move_r+'].status;}
            },
            end : null,
            max_duration : 1,
        },
        action : {
            
            start : {
                in_args : [ body_name ],
                fn : (obj) => {
                    obj.Game_engine.Sound.start( 
                        `${body_name}move_r+`,
                        sounds['move_r+'], 
                        { volume : 1, 
                            fade_in_seconds : 0, 
                            loop : false } ); //"sfx_wii_short_tick_02"
                },
                duration : 1,
            },	
            end : {
                in_args : [ body_name ],
                fn : (obj) => {
                    obj.Game_engine.Sound.end( `${body_name}move_r+`, { fade_out_seconds :  0.1 } );
                },
                duration : 1,
            },
        },

    },	
    {
        event : {
            start : {
                in_args : [ body_name ],
                fn : (obj) => {return obj.Event.data.obj['move_r-'].status;}
            },
            end : null,
            max_duration : 1,
        },
        action : {
            
            start : {
                in_args : [ body_name ],
                fn : (obj) => {
                    obj.Game_engine.Sound.start( 
                        `${body_name}move_r-`,
                        sounds['move_r-'], 
                        { volume : 1, 
                            fade_in_seconds : 0, 
                            loop : false } ); //"sfx_wii_short_tick_02"
                },
                duration : 1,
            },	
            end : {
                in_args : [ body_name ],
                fn : (obj) => {
                    obj.Game_engine.Sound.end( `${body_name}move_r-`, { fade_out_seconds :  0.1 } );
                },
                duration : 1,
            },
        },

    },	
    {
        event : {
            start : {
                in_args : [ body_name ],
                fn : (obj) => {
                    let status = false
                    if( obj.Event.data.user['grab'].status )
                    {
                        status = 10 < obj.User.speed 
                    }
                    return status;
                }
            },
            end : null,
            max_duration : 1,
        },
        action : {
            
            start : {
                in_args : [ body_name ],
                fn : (obj) => {
                    obj.Game_engine.Sound.start( `${body_name}UserPullStretch`,sounds['UserPullStretch'], { volume : 1, fade_in_seconds : 0, loop : false } ); //"sfx_wii_short_tick_02"
                },
                duration : 1,
            },	
            
            end : {}
        },

    },

    ]

}


export function get_swipe_navigation( file_left, file_right, objs_to_add )
{
    let BACKGROUND_OBJS_NAMES = ['_bg_center','_bg_left','_bg_right','_bg_up','_bg_down']
    
    let objs_names = BACKGROUND_OBJS_NAMES

    
    if( objs_to_add !== null )
        for( let obj in objs_to_add )
            objs_names.push(obj)

    
    let eventActions = []
    eventActions.push(
        {
            event : {
                start : {
                    in_args : [ '_bg_center' ],
                    fn : (obj) => {return obj.Event.data.user['swipeLeft'].status;}
                },
                end : null,
                max_duration : 1,
            },
            action : {
                
                start : {
                    in_args : [ ],
                    fn : () => {
                        console.log('<<<< PREVIOUS PAGE')
                        window.location.assign(`../${file_left}/index.html`);
                    },
                    duration : 1,
                },	
                end : {},
            },
    
        }
    )

    
    eventActions.push(
        {
            event : {
                start : {
                    in_args : [ '_bg_center' ],
                    fn : (obj) => {return obj.Event.data.user['swipeRight'].status;}
                },
                end : null,
                max_duration : 1,
            },
            action : {
                
                start : {
                    in_args : [  ],
                    fn : () => {
                        console.log('NEXT PAGE >>>>')
                        window.location.assign(`../${file_right}/index.html`);
                    },
                    duration : 1,
                },	
                end : {},
            },
    
        }            
    )


    return eventActions
}