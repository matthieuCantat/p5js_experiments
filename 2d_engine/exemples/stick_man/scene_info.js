export var scene_info = {
    "objs": {
        "root": {
            "m": [0, 0, 0, 50, 20],
            shapes: [
                {
                    m: [0, 0, 0, 50, 20],
                    color: "yellow",
                    type: 'rectangle',
                }
            ],
            interaction_shapes: [
                {
                    m: [0, -60, 0, 200, 340],
                    "type": "rectangle",
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
            "debug": {
                "shape_interaction_visibility": true
            }
        },
        "spine1": {
            "m": [0, 50, 0, 50, 20],
            "parent":"root",
            shapes: [
                {
                    m: [0, 50, 0, 50, 20],
                    color: "green",
                    type: 'rectangle',
                }
            ],
            interaction_shapes: [
                {
                    m: [0, 50, 0, 200, 30],
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
            "debug": {
                "shape_interaction_visibility": true
            }            
        },   
        "spine2": {
            "m": [0, 100, 0, 50, 20],
            "parent":"spine1",
            shapes: [
                {
                    m: [0, 100, 0, 50, 20],
                    color: "green",
                    type: 'rectangle',
                }
            ],
            interaction_shapes: [
                {
                    m: [0, 100, 0, 200, 30],
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
            "debug": {
                "shape_interaction_visibility": true
            }    
        }, 
        "head": {
            "m": [0, 185, 0, 1, 1],
            "parent":"spine2",
            shapes : [
                {
                    m : [0, 220, 0, 30, 50],
                    color: "green", 
                    type : 'rectangle',
                }
            ],
            interaction_shapes : [
                {
                    m : [0, 220, 0, 100, 70],
                    "type": "circle",
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
            "debug": {
                "shape_interaction_visibility": true
            }    
        },          
        "clavicle_L": {
            "m": [20, 150, 0, 1, 1],
            "parent":"spine2",
            shapes : [
                {
                    m : [50, 150, 0, 50, 20],
                    color: "blue",
                    type : 'rectangle',
                }
            ],
            interaction_shapes : [
                {
                    m : [50, 150, 0, 70, 40],
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
            "debug": {
                "shape_interaction_visibility": true
            }    
        },     
        "arm_L": {
            "m": [110, 120, -10, 1, 1],
            "parent":"clavicle_L",
            shapes : [
                {
                    m : [120, 80, -10, 20, 50],
                    color: "blue",
                    type : 'rectangle',
                }
            ],
            interaction_shapes : [
                {
                    m : [120, 80, -10, 40, 80],
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
            "debug": {
                "shape_interaction_visibility": true
            }    
        },   
        "armLower_L": {
            "m": [130, 10, -10, 1, 1],
            "parent":"arm_L",
            shapes : [
                {
                    m : [140, -30, -10, 20, 50],
                    color: "blue",
                    type : 'rectangle',
                }
            ],
            interaction_shapes : [
                {
                    m : [140, -30, -10, 40, 80],
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
            "debug": {
                "shape_interaction_visibility": true
            }    
        },   
        "hand_L": {
            "m": [150, -100, -10, 1, 1],
            "parent":"armLower_L",
            shapes : [
                {
                    m : [155, -120, -10, 20, 30],
                    color: "blue",
                    type : 'rectangle',
                }
            ],
            interaction_shapes : [
                {
                    m : [155, -120, -10, 40, 50],
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
            "debug": {
                "shape_interaction_visibility": true
            }    
            
        },      
        "clavicle_R": {
            "m": [-20, 150, 0, 1, 1],
            "parent":"spine2",
            shapes : [
                {
                    m : [-50, 150, 0, 50, 20],
                    color: "red",
                    type : 'rectangle',
                }
            ],
            interaction_shapes : [
                {
                    m : [-50, 150, 0, 80, 40],
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
            "debug": {
                "shape_interaction_visibility": true
            }    
        },     
        "arm_R": {
            "m": [-110, 120, 10, 1, 1],
            "parent":"clavicle_R",
            shapes : [
                {
                    m : [-120, 80, 10, 20, 50],
                    color: "red",
                    type : 'rectangle',
                }
            ],
            interaction_shapes : [
                {
                    m : [-120, 80, 10, 40, 80],
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
            "debug": {
                "shape_interaction_visibility": true
            }    
        },   
        "armLower_R": {
            "m": [-130, 10, 10, 1, 1],
            "parent":"arm_R",
            shapes : [  
                {
                    m : [-140, -30, 10, 20, 50],
                    color: "red",
                    type : 'rectangle',
                }
            ],
            interaction_shapes : [
                {
                    m : [-140, -30, 10, 40, 80],
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
            "debug": {
                "shape_interaction_visibility": true
            }    
        },   
        "hand_R": {
            "m": [-150, -100, 10, 1, 1],
            "parent":"armLower_R",
            shapes : [
                {
                    m : [-155, -120, 10, 20, 30],
                    color: "red",
                    type : 'rectangle',
                }
            ],
            interaction_shapes : [
                {
                    m : [-155, -120, 10, 40, 50],
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
            "debug": {
                "shape_interaction_visibility": true
            }    
        },                                                           
        "hip": {
            "m": [0, -50, 0, 50, 20],
            "parent":"root",
            shapes : [
                {
                    m : [0, -50, 0, 50, 20],
                    color: "green",
                    type : 'rectangle',
                }
            ],
            interaction_shapes : [
                {
                    m : [0, -50, 0, 100, 30],
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
            "debug": {
                "shape_interaction_visibility": true
            }    
        },
        "leg_L": {
            "m": [50, -100, 0, 1, 1],
            "parent":"hip",
            shapes : [
                {
                    m : [50, -130, 0, 20, 50],
                    color: "blue",
                    type : 'rectangle',
                }
            ],
            interaction_shapes : [
                {
                    m : [70, -130, 0, 70, 55],
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
            "debug": {
                "shape_interaction_visibility": true
            }    
        },
        "legLower_L": {
            "m": [50, -210, 0, 1, 1],
            "parent":"leg_L",
            shapes : [
                {
                    m : [50, -240, 0, 20, 50],
                    color: "blue",
                    type : 'rectangle',
                }
            ],
            interaction_shapes : [
                {
                    m : [70, -240, 0, 70, 55],
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
            "debug": {
                "shape_interaction_visibility": true
            }    
        },
        "foot_L": {
            "m": [50, -320, 0, 20, 20],
            "parent":"legLower_L",
            shapes : [
                {
                    m : [70, -320, 0, 40, 20],
                    color: "blue",
                    type : 'rectangle',
                }
            ],
            interaction_shapes : [
                {
                    m : [70, -340, 0, 70, 45],
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
            "debug": {
                "shape_interaction_visibility": true
            }    
        },          
        "leg_R": {
            "m": [-50, -100, 0, 20, 20],
            "parent":"hip",
            shapes : [
                {
                    m : [-50, -130, 0, 20, 50],
                    color: "red",
                    type : 'rectangle',
                }
            ],
            interaction_shapes : [
                {
                    m : [-70, -130, 0, 70, 55],
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
            "debug": {
                "shape_interaction_visibility": true
            }    
        }, 
        "legLower_R": {
            "m": [-50, -210, 0, 20, 20],
            "parent":"leg_R",
            shapes : [
                {
                    m : [-50, -240, 0, 20, 50],
                    color: "red",
                    type : 'rectangle',
                }
            ],
            interaction_shapes : [
                {
                    m : [-70, -240, 0, 70, 55],
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
            "debug": {
                "shape_interaction_visibility": true
            }    
        },     
        "foot_R": {
            "m": [-50, -320, 0, 20, 20],
            "parent":"legLower_R",
            shapes : [
                {
                    m : [-70, -320, 0, 40, 20],
                    color: "red",
                    type : 'rectangle',
                }
            ],
            interaction_shapes : [
                {
                    m : [-70, -340, 0, 70, 45],
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
            "debug": {
                "shape_interaction_visibility": true
            }    
        },                                
    },
    "cns": []
  
              
}