export var scene_info = {
    "objs": {
        "root": {
            "m": [0, 0, 0, 50, 20],
            //"m_interaction": [0, -60, 0, 200, 340],
            "color": "yellow",
            "shape_type": "rectangle",
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
        "spine1": {
            "m": [0, 50, 0, 50, 20],
            //"m_interaction": [0, 50, 0, 200, 30],
            "parent":"root",
            "color": "green",
            "shape_type": "rectangle",
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
                rotate_limits: [-90,90],
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
        "spine2": {
            "m": [0, 100, 0, 50, 20],
            //"m_interaction": [0, 100, 0, 200, 30],
            "parent":"spine1",
            "color": "green",
            "shape_type": "rectangle",
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
                rotate_limits: [-90,90],
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
        "head": {
            "m": [0, 185, 0, 1, 1],
            "m_shape": [0, 220, 0, 30, 50],
            "parent":"spine2",
            "color": "green",
            "shape_type": "rectangle",
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
                rotate_limits: [-90,90],
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
        "clavicle_L": {
            "m": [20, 150, 0, 1, 1],
            "m_shape": [50, 150, 0, 50, 20],
            "parent":"spine2",
            "color": "blue",
            "shape_type": "rectangle",
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
                rotate_limits: [-90,90],
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
        "arm_L": {
            "m": [110, 120, -10, 1, 1],
            "m_shape": [120, 80, -10, 20, 50],
            "parent":"clavicle_L",
            "color": "blue",
            "shape_type": "rectangle",
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
                rotate_limits: [-90,90],
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
        "armLower_L": {
            "m": [130, 10, -10, 1, 1],
            "m_shape": [140, -30, -10, 20, 50],
            "parent":"arm_L",
            "color": "blue",
            "shape_type": "rectangle",
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
                rotate_limits: [-90,90],
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
        "hand_L": {
            "m": [150, -100, -10, 1, 1],
            "m_shape": [155, -120, -10, 20, 30],
            "parent":"armLower_L",
            "color": "blue",
            "shape_type": "rectangle",
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
                rotate_limits: [-90,90],
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
        "clavicle_R": {
            "m": [-20, 150, 0, 1, 1],
            "m_shape": [-50, 150, 0, 50, 20],
            "parent":"spine2",
            "color": "red",
            "shape_type": "rectangle",
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
                rotate_limits: [-90,90],
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
        "arm_R": {
            "m": [-110, 120, 10, 1, 1],
            "m_shape": [-120, 80, 10, 20, 50],
            "parent":"clavicle_R",
            "color": "red",
            "shape_type": "rectangle",
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
                rotate_limits: [-90,90],
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
        "armLower_R": {
            "m": [-130, 10, 10, 1, 1],
            "m_shape": [-140, -30, 10, 20, 50],
            "parent":"arm_R",
            "color": "red",
            "shape_type": "rectangle",
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
                rotate_limits: [-90,90],
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
        "hand_R": {
            "m": [-150, -100, 10, 1, 1],
            "m_shape": [-155, -120, 10, 20, 30],
            "parent":"armLower_R",
            "color": "red",
            "shape_type": "rectangle",
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
                rotate_limits: [-90,90],
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
        "hip": {
            "m": [0, -50, 0, 50, 20],
            //"m_interaction": [0, -50, 0, 100, 30],
            "parent":"root",
            "color": "green",
            "shape_type": "rectangle",
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
                rotate_limits: [-90,90],
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
        "leg_L": {
            "m": [50, -100, 0, 1, 1],
            "m_shape": [50, -130, 0, 20, 50],
            //"m_interaction": [70, -130, 0, 70, 55],
            "parent":"hip",
            "color": "blue",
            "shape_type": "rectangle",
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
                rotate_limits: [-90,90],
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
        "legLower_L": {
            "m": [50, -210, 0, 1, 1],
            "m_shape": [50, -240, 0, 20, 50],
            //"m_interaction": [70, -240, 0, 70, 55],
            "parent":"leg_L",
            "color": "blue",
            "shape_type": "rectangle",
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
                rotate_limits: [-90,90],
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
        "foot_L": {
            "m": [50, -320, 0, 20, 20],
            "m_shape": [70, -320, 0, 40, 20],
            //"m_interaction": [70, -340, 0, 70, 45],
            "parent":"legLower_L",
            "color": "blue",
            "shape_type": "rectangle",
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
                rotate_limits: [-90,90],
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
        "leg_R": {
            "m": [-50, -100, 0, 20, 20],
            "m_shape": [-50, -130, 0, 20, 50],
            //"m_interaction": [-70, -130, 0, 70, 55],
            "parent":"hip",
            "color": "red",
            "shape_type": "rectangle",
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
                rotate_limits: [-90,90],
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
        "legLower_R": {
            "m": [-50, -210, 0, 20, 20],
            "m_shape": [-50, -240, 0, 20, 50],
            //"m_interaction": [-70, -240, 0, 70, 55],
            "parent":"leg_R",
            "color": "red",
            "shape_type": "rectangle",
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
                rotate_limits: [-90,90],
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
        "foot_R": {
            "m": [-50, -320, 0, 20, 20],
            "m_shape": [-70, -320, 0, 40, 20],
            //"m_interaction": [-70, -340, 0, 70, 45],
            "parent":"legLower_R",
            "color": "red",
            "shape_type": "rectangle",
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
                rotate_limits: [-90,90],
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