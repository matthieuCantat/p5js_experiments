

export function get_body_sfx( body_name)
{

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
                    obj.Game_engine.Sound.start( `${body_name}hold`,"sfx_creature_synth_03", { volume : 1, fade_in_seconds : 2, loop : true } ); //"sfx_wii_short_tick_02"
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
                    obj.Game_engine.Sound.start( `${body_name}tap`,"sfx_wii_bell_long_01", { volume : 1, fade_in_seconds : 0, loop : false } ); //"sfx_wii_short_tick_02"
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
                    obj.Game_engine.Sound.start( `${body_name}doubleTap`,"sfx_wii_synth_bell_melodie_01", { volume : 1, fade_in_seconds : 0, loop : false } ); //"sfx_wii_short_tick_02"
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
                    obj.Game_engine.Sound.start( `${body_name}grab`,"sfx_wii_short_tick_02", { volume : 1, fade_in_seconds : 0, loop : false } ); //"sfx_wii_short_tick_02"
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
                    obj.Game_engine.Sound.start( `${body_name}release`,"sfx_occulus_tap_dry_hollow_01", { volume : 1, fade_in_seconds : 0, loop : false } ); //"sfx_wii_short_tick_02"
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
                    obj.Game_engine.Sound.start( `${body_name}hit_tx+`,"sfx_wii_bell_simple_05", { volume : 1, fade_in_seconds : 0, loop : false } ); //"sfx_wii_short_tick_02"
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
                    obj.Game_engine.Sound.start( `${body_name}hit_tx+`,"sfx_wii_bell_simple_04", { volume : 1, fade_in_seconds : 0, loop : false } ); //"sfx_wii_short_tick_02"
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
                    obj.Game_engine.Sound.start( "limit_hit_ty+","sfx_wii_bell_simple_05", { volume : 1, fade_in_seconds : 0, loop : false } ); //"sfx_wii_short_tick_02"
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
                    obj.Game_engine.Sound.start( "limit_hit_ty-","sfx_wii_bell_simple_04", { volume : 1, fade_in_seconds : 0, loop : false } ); //"sfx_wii_short_tick_02"
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
                    obj.Game_engine.Sound.start( `${body_name}hit_r+`,"sfx_wii_bell_simple_05", { volume : 1, fade_in_seconds : 0, loop : false } ); //"sfx_wii_short_tick_02"
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
                    obj.Game_engine.Sound.start( `${body_name}hit_r+`,"sfx_wii_bell_simple_04", { volume : 1, fade_in_seconds : 0, loop : false } ); //"sfx_wii_short_tick_02"
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
                        "sfx_wii_artificial_slide_down_01", 
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
                        "sfx_wii_artificial_slide_up_01", 
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
                        "sfx_wii_artificial_slide_down_01", 
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
                        "sfx_wii_artificial_slide_up_01", 
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

    }
    ]

}