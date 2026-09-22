export var scene_info = {

    "objs": {
        "root": {
            "m": [0, 0, 0, 18, 18],
            shapes : [
                {
                    m : [0, 0, 0, 18, 18],
                    color: "yellow",
                    type : 'circle',
                    stroke_color: "black",
                    stroke_width: 1,
                }
            ],
            interaction_shapes: [
                {
                    m : [0, 0, 0, 18, 18],
                    "type": "circle",
                }
            ],
            "interaction_settings": {
                "enable": true,
                "coef": 0.1,
                "rotate_resolution_priority": 0.0,
                "radius_threshold": 0,
                "do_translation": true
            },
            "dyn_settings": {
                "enable": false,
                "friction_translate": 0.0001,
                "friction_rotate": 0.001,
                "speed_limit_translate": 30,
                "speed_limit_rotate": 0.3
            },
        },
        "rectangle_rotate_top": {
            "m": [0, 0, 0, 1, 1],
            "parent":"root",
            interaction_shapes: [
                {
                    m : [0, 140, 0, 50, 50],
                    "type": "rectangle",
                }
            ],
            "shape_visibility": false,
            "interaction_settings": {
                "enable": true,
                "coef": 0.2,
                "rotate_resolution_priority": 1.0,
                "radius_threshold": 0,
                "do_translation": true
            },
            transform_settings : {
                parent_limit_space : false,
                translate_limits: [[0,0],[-0,0]],
                rotate_limits: [-90,0],
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
        },   
        "rectangle_rotate_left": {
            "m": [0, 0, 0, 1, 1],
            "parent":"root",
            interaction_shapes: [
                {
                    m : [140, 0, 0, 50, 50],
                    "type": "rectangle",
                }
            ],
            "shape_visibility": false,
            "interaction_settings": {
                "enable": true,
                "coef": 0.2,
                "rotate_resolution_priority": 1.0,
                "radius_threshold": 0,
                "do_translation": true
            },
            transform_settings : {
                parent_limit_space : false,
                translate_limits: [[0,0],[-0,0]],
                rotate_limits: [-0,0],
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
        },
        "rectangle_rotate_down": {
            "m": [0, 0, 0, 1, 1],
            "parent":"root",
            interaction_shapes: [
                {
                    m : [0, -140, 0, 50, 50],
                    "type": "rectangle",
                }
            ],
            "shape_visibility": false,
            "interaction_settings": {
                "enable": true,
                "coef": 0.2,
                "rotate_resolution_priority": 1.0,
                "radius_threshold": 0,
                "do_translation": true
            },
            transform_settings : {
                parent_limit_space : false,
                translate_limits: [[0,0],[-0,0]],
                rotate_limits: [-270,0],
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
        },   
        "rectangle_rotate_right": {
            "m": [0, 0, 0, 1, 1],
            "parent":"root",
            interaction_shapes: [
                {
                    m : [-140, 0, 0, 50, 50],
                    "type": "rectangle",
                }
            ],
            "shape_visibility": false,
            "interaction_settings": {
                "enable": true,
                "coef": 0.2,
                "rotate_resolution_priority": 1.0,
                "radius_threshold": 0,
                "do_translation": true
            },
            transform_settings : {
                parent_limit_space : false,
                translate_limits: [[0,0],[-0,0]],
                rotate_limits: [-180,0],
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
        },  
        "rectangle_translate_top": {
            "m": [0, 0, 0, 50, 20],
            "parent":"rectangle_rotate_top",
            shapes : [
                {
                    m : [0, 70, 0, 8, 40],
                    color: "white",
                    type : 'rectangle',
                    stroke_color: "black",
                    stroke_width: 1,    
                }
            ],
            interaction_shapes: [
                {
                    m : [0, 70, 0, 8, 40],
                    "type": "rectangle",
                }
            ],
            "interaction_settings": {
                "enable": true,
                "coef": 0.2,
                "rotate_resolution_priority": 1.0,
                "radius_threshold": 0,
                "do_translation": true
            },
            transform_settings : {
                parent_limit_space : false,
                translate_limits: [[0,0],[-0,70]],
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
        },   
        "rectangle_translate_left": {
            "m": [0, 0, 0, 50, 20],
            "parent":"rectangle_rotate_left",
            shapes : [
                {
                    m : [70, 0, 0, 40, 8],
                    color: "white",
                    type : 'rectangle',
                    stroke_color: "black",
                    stroke_width: 1,
                }
            ],
            interaction_shapes: [
                {
                    m : [70, 0, 0, 40, 8],
                    "type": "rectangle",
                }
            ],
            "interaction_settings": {
                "enable": true,
                "coef": 0.2,
                "rotate_resolution_priority": 1.0,
                "radius_threshold": 0,
                "do_translation": true
            },
            transform_settings : {
                parent_limit_space : false,
                translate_limits: [[0,70],[-0,0]],
                rotate_limits: [-170,170],
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
        },
        "rectangle_translate_down": {
            "m": [0, 0, 0, 20, 50],
            "parent":"rectangle_rotate_down",
            shapes : [
                {
                    m : [0, -70, 0, 8, 40],
                    color: "white",
                    type : 'rectangle',
                    stroke_color: "black",
                    stroke_width: 1,
                }
            ],
            interaction_shapes: [   
                {
                    m : [0, -70, 0, 8, 40],
                    "type": "rectangle",
                }
            ],
            "interaction_settings": {
                "enable": true,
                "coef": 0.2,
                "rotate_resolution_priority": 1.0,
                "radius_threshold": 0,
                "do_translation": true
            },
            transform_settings : {
                parent_limit_space : false,
                translate_limits: [[0,0],[-70,0]],
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
        },   
        "rectangle_translate_right": {
            "m": [0, 0, 0, 20, 50],
            parent : "rectangle_rotate_right",
            shapes : [
                {
                    m : [-70, 0, 0, 40, 8],
                    color: "white",
                    type : 'rectangle',
                    stroke_color: "black",
                    stroke_width: 1,
                }
            ],
            interaction_shapes: [
                {
                    m : [-70, 0, 0, 40, 8],
                    "type": "rectangle",
                }
            ],
            "interaction_settings": {
                "enable": true,
                "coef": 0.2,
                "rotate_resolution_priority": 1.0,
                "radius_threshold": 0,
                "do_translation": true
            },
            transform_settings : {
                parent_limit_space : false,
                translate_limits: [[-70,0],[-0,0]],
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
        },          
        "trap_topRight": {
            "m": [50, 50, 45, 55, 10],
            "parent":"root",
            shapes : [
                {
                    m : [50, 50, 45, 55, 10],
                    color: "red",
                    type : 'trapezoid',
                    stroke_color: "red",
                    stroke_width: 1,
                }
            ],
            "interaction_settings": {
                "enable": true,
                "coef": 0.2,
                "rotate_resolution_priority": 1.0,
                "radius_threshold": 0,
                "do_translation": true
            },
            transform_settings : {
                parent_limit_space : false,
                translate_limits: [[0,0],[-27,20]],
                rotate_limits: [0,45],
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
        },
        "trap_downRight": {
            "m": [50, -50, 135, 55, 10],
            "parent":"root",
            shapes : [
                {
                    m : [50, -50, 135, 55, 10],  
                    color: "red",
                    type : 'trapezoid',
                    stroke_color: "red",
                    stroke_width: 1,
                }
            ],
            interaction_shapes: [
                {
                    m : [50, -50, 135, 55, 10],
                    "type": "trapezoid",
                }
            ],
            "interaction_settings": {
                "enable": true,
                "coef": 0.2,
                "rotate_resolution_priority": 1.0,
                "radius_threshold": 0,
                "do_translation": true
            },
            transform_settings : {
                parent_limit_space : false,
                translate_limits: [[0,0],[-27,20]],
                rotate_limits: [0,45],
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
        },  
        "trap_downLeft": {
            "m": [-50, -50, -135, 55, 10],
            "parent":"root",
            shapes : [
                {
                    m : [-50, -50, -135, 55, 10],  
                    color: "red",
                    type : 'trapezoid',
                    stroke_color: "red",
                    stroke_width: 1,
                }
            ],
            interaction_shapes: [
                {
                    m : [-50, -50, -135, 55, 10],
                    "type": "trapezoid",
                }
            ],
            "interaction_settings": {
                "enable": true,
                "coef": 0.2,
                "rotate_resolution_priority": 1.0,
                "radius_threshold": 0,
                "do_translation": true
            },
            transform_settings : {
                parent_limit_space : false,
                translate_limits: [[0,0],[-27,20]],
                rotate_limits: [0,45],
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
        },   
        "trap_upLeft": {
            "m": [-50, 50, -45, 55, 10],
            "parent":"root",
            shapes : [
                {
                    m : [-50, 50, -45, 55, 10],
                    color: "red",
                    type : 'trapezoid',
                    stroke_color: "red",
                    stroke_width: 1,                    
                }
            ],
            interaction_shapes: [
                {
                    m : [-50, 50, -45, 55, 10],
                    type: "trapezoid",
                }
            ],          
            "interaction_settings": {
                "enable": true,
                "coef": 0.2,
                "rotate_resolution_priority": 1.0,
                "radius_threshold": 0,
                "do_translation": true
            },
            transform_settings : {
                parent_limit_space : false,
                translate_limits: [[0,0],[-27,20]],
                rotate_limits: [0,45],
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
        },   
         
        "play_btn": {
			"m": [0, -300, 0, 1, 1],
			"shapes" : [
				{
					"m": [0, -300, 0, 25, 25],
					"color": "red",
					"type": "circle",
					"stroke_color":"black",
					"stroke_width":1,
				}
			],
			"interaction_shapes": [
				{
					"m" :  [ 0, -300, 0, 25, 25],
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
				translate_limits: [[0,0],[0,0]],
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
    "eventActions":[],
    //    {
    //        "mode": "instance",
    //        "objs": ["bicycle", "wheelA", "wheelB", "gear_pedals"],
    //        "attrs": ["ty", "ty", "ty", "ty"],
    //        "mult": 1
    //    },
    //    {
    //        "mode": "instance",
    //        "objs": ["bicycle", "wheelA", "wheelB"],
    //        "attrs": ["ty", "r", "r"],
    //        "mult": -0.02
    //    },
    //    {
    //        "mode": "instance",
    //        "objs": ["bicycle", "gear_pedals"],
    //        "attrs": ["ty", "r"],
    //        "mult": -0.01
    //    }
    //]
              
}


scene_info.eventActions.push( 
    {
        event : {
            start : {
                in_args : [ 'play_btn' ],
                fn : (obj) => {
                    let status = false
                    if( 5 < obj.Game_engine.Time.frame)
                    //if( obj.Event.data.user['grab'].status )
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
                in_args : [ 'play_btn' ],
                fn : (obj) => {
                    obj.Game_engine.Animation.start( `first_anim`,"windmill_idle", { volume : 1, fade_in_seconds : 0, loop : true } ); //"sfx_wii_short_tick_02"
                },
                duration : 1,
            },
            end : {}
        },

    },
   
 )
