export var scene_info = {
    "objs": {
        "root": {
            "m": [0, 0, 0, 18, 18],
            //"m_interaction": [0, -60, 0, 200, 340],
            "color": "yellow",
            "shape_type": "circle",
            "stroke_color": "yellow",
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
            "m_shape":null,
            "shape_visibility": false,
            "m_interaction": [0, 140, 0, 50, 50],
            "parent":"root",
            "color": "green",
            "shape_type": "rectangle",
            "stroke_color": null,
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
            "m_shape": null,
            "shape_visibility": false,
            "m_interaction": [140, 0, 0, 50, 50],
            "parent":"root",
            "color": "green",
            "shape_type": "rectangle",
            "stroke_color": null,
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
            "m_shape":null,
            "shape_visibility": false,
            "m_interaction": [0, -140, 0, 50, 50],
            "parent":"root",
            "color": "green",
            "shape_type": "rectangle",
            "stroke_color": null,
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
            "m_shape": null,
            "shape_visibility": false,
            "m_interaction": [-140, 0, 0, 50, 50],
            "parent":"root",
            "color": "green",
            "shape_type": "rectangle",
            "stroke_color": null,
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
            "m_shape": [0, 70, 0, 8, 40],
            //"m_interaction": [0, 50, 0, 200, 30],
            "parent":"rectangle_rotate_top",
            "color": "white",
            "shape_type": "rectangle",
            "stroke_color": "white",
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
            "m_shape": [70, 0, 0, 40, 8],
            //"m_interaction": [0, 50, 0, 200, 30],
            "parent":"rectangle_rotate_left",
            "color": "white",
            "shape_type": "rectangle",
            "stroke_color": "white",
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
            "m_shape": [0, -70, 0, 8, 40],
            //"m_interaction": [0, 50, 0, 200, 30],
            "parent":"rectangle_rotate_down",
            "color": "white",
            "shape_type": "rectangle",
            "stroke_color": "white",
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
            "m_shape": [-70, 0, 0, 40, 8],
            //"m_interaction": [0, 50, 0, 200, 30],
            "parent":"rectangle_rotate_right",
            "color": "white",
            "shape_type": "rectangle",
            "stroke_color": "white",
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
            "m_shape": [50, 50, 45, 55, 10],
            //"m_interaction": [0, 50, 0, 200, 30],
            "parent":"root",
            "color": "red",
            "shape_type": "trapezoid",
            "stroke_color": "red",
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
            "m_shape": [50, -50, 135, 55, 10],
            //"m_interaction": [0, 50, 0, 200, 30],
            "parent":"root",
            "color": "red",
            "shape_type": "trapezoid",
            "stroke_color": "red",
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
            "m_shape": [-50, -50, -135, 55, 10],
            //"m_interaction": [0, 50, 0, 200, 30],
            "parent":"root",
            "color": "red",
            "shape_type": "trapezoid",
            "stroke_color": "red",
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
            "m_shape": [-50, 50, -45, 55, 10],
            //"m_interaction": [0, 50, 0, 200, 30],
            "parent":"root",
            "color": "red",
            "shape_type": "trapezoid",
            "stroke_color": "red",
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
                                                              
    },
    "cns": []
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