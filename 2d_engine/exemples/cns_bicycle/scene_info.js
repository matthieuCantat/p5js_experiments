export var scene_info = {
    "objs": {
        "ground": {
            "m": [100, -70, 0, 50, 320],
            shapes : [
                {
                    m : [100, -70, 0, 50, 320],
                    color: "yellow",
                    type : 'rectangle',
                }
            ],
            interaction_shapes: [
                {
                    m : [100, -70, 0, 50, 320],
                    "type": "rectangle",
                }
            ],
            "interaction_settings": {
                "enable": true,
                "coef": 0.1,
                "rotate_resolution_priority": 1.0,
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
            //"axe_cns_settings": {
            //    "m_driver": [100, -70, 0, 50, 320],
            //    "v_axe": [0, 1],
            //    "rotation_constraint_axe": 1,
            //    "rotation_constraint_coef": 1.0,
            //    "enable": true,
            //    "enable_limits": true,
            //    "limit_max": 600,
            //    "limit_min": -600,
            //    "dyn_bounce_coef": 0.05
            //}
        },
        "bicycle": {
            "m": [-110, 0, 0, 50, 100],
            "parent":"ground",
            shapes : [
                {
                    m : [-110, 0, 0, 50, 100],
                    color: "green",
                    type : 'rectangle',
                }
            ],
            interaction_shapes: [
                {
                    m : [-110, 0, 0, 50, 100],
                    "type": "rectangle",
                }
            ],
            "interaction_settings": {
                "enable": true,
                "coef": 0.2,
                "rotate_resolution_priority": 0.0,
                "radius_threshold": 0,
                "do_translation": true
            },
            transform_settings : {
                parent_limit_space : false,
                translate_limits: [[0,0],[-250,250]],
                rotate_limits: [-0,0],
            },            
            "dyn_settings": {
                "enable": true,
                enable_gravity:false,
                mass:0.9,
                "friction_translate": 0.1,
                "friction_rotate": 0.001,
                "speed_limit_translate": 30,
                "speed_limit_rotate": 0.3
            },
            //"axe_cns_settings": {
            //    "m_driver": [-110, 0, 0, 50, 100],
            //    "v_axe": [0, 1],
            //    "rotation_constraint_axe": 1,
            //    "rotation_constraint_coef": 1.0,
            //    "enable": true,
            //    "enable_limits": true,
            //    "limit_max": 300,
            //    "limit_min": -400,
            //    "dyn_bounce_coef": 0.5
            //}
        },
        "wheelA": {
            "m": [-10, 100, 0, 60],
            "parent":"bicycle",
            shapes : [
                {
                    m : [-10, 100, 0, 60],
                    color: "blue",
                    type : 'circle',
                    stroke_color: "black",
                    stroke_width: 1,                    
                }
            ],
            interaction_shapes: [
                {
                    m : [-10, 100, 0, 60],
                    "type": "circle",
                }
            ],
            "interaction_settings": {
                "enable": true,
                "coef": 0.1,
                "rotate_resolution_priority": 1.0,
                "radius_threshold": 0,
                "do_translation": true
            },
            "dyn_settings": {
                "enable": true,
                "mass": 0,
                "friction_translate": 0.0001,
                "friction_rotate": 0.001,
                "speed_limit_translate": 30,
                "speed_limit_rotate": 10.3
            },
            transform_settings : {
                parent_limit_space : false,
                translate_limits: [[0,0],[0,0]],
                //rotate_limits: [-0,0],
            },             
            //"axe_cns_settings": {
            //    "m_driver": [-10, 100, 0, 60],
            //    "v_axe": [0, 1],
            //    "rotation_constraint_axe": 1,
            //    "rotation_constraint_coef": 0.0,
            //    "enable": true,
            //    "enable_limits": true,
            //    "limit_max": 300,
            //    "limit_min": -400
            //}
        },
        "wheelB": {
            "m": [-10, -100, 0, 60],
            "parent":"bicycle",
            shapes : [
                {
                    m : [-10, -100, 0, 60],
                    color: "blue",
                    type : 'circle',
                    stroke_color: "black",
                    stroke_width: 1,
                }
            ],
            interaction_shapes: [
                {
                    m : [-10, -100, 0, 60],
                    "type": "circle",
                }
            ],
            "interaction_settings": {
                "enable": true,
                "coef": 0.1,
                "rotate_resolution_priority": 1.0,
                "radius_threshold": 0,
                "do_translation": true
            },
            "dyn_settings": {
                "enable": true,
                "mass": 0,
                "friction_translate": 0.0001,
                "friction_rotate": 0.001,
                "speed_limit_translate": 30,
                "speed_limit_rotate": 10.3
            },
            transform_settings : {
                parent_limit_space : false,
                translate_limits: [[0,0],[0,0]],
                //rotate_limits: [-0,0],
            },            
            //"axe_cns_settings": {
            //    "m_driver": [-10, -100, 0, 60],
            //    "v_axe": [0, 1],
            //    "rotation_constraint_axe": 1,
            //    "rotation_constraint_coef": 0.0,
            //    "enable": true,
            //    "enable_limits": true,
            //    "limit_max": 300,
            //    "limit_min": -400
            //}
        },
        "gear_pedals": {
            "m": [-50, 10, 0, 20],
            "parent":"bicycle",
            shapes : [
                {
                    m : [-50, 10, 0, 20],
                    color: "red",
                    type : 'circle',
                    stroke_color: "black",
                    stroke_width: 1,                    
                }
            ],
            interaction_shapes: [
                {
                    m : [-50, 10, 0, 20],
                    "type": "circle",
                }
            ],
            "interaction_settings": {
                "enable": true,
                "coef": 0.01,
                "rotate_resolution_priority": 1.0,
                "radius_threshold": 0,
                "do_translation": true
            },
            "dyn_settings": {
                "enable": false,
                "mass": 0,
                "friction_translate": 0.0001,
                "friction_rotate": 0.001,
                "speed_limit_translate": 30,
                "speed_limit_rotate": 0.3
            },
            transform_settings : {
                parent_limit_space : false,
                translate_limits: [[0,0],[0,0]],
                //rotate_limits: [-0,0],
            },            
            //"axe_cns_settings": {
            //    "m_driver": [-50, 10, 0, 20],
            //    "v_axe": [0, 1],
            //    "rotation_constraint_axe": 1,
            //    "rotation_constraint_coef": 0.0,
            //    "enable": true,
            //    "enable_limits": true,
            //    "limit_max": 300,
            //    "limit_min": -400
            //}
        }
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