

export var scene_info = {
    "objs":{

        "obj":{ 
            m : [0,300, 0, 100,20], 
            shapes : [
              {
                m : [0,300, 0, 100,20], 
                color: "blue", 
                type : 'rectangle',
              }
            ],
            interaction_shapes:[
              {
                m : [0,300, 0, 100,20], 
                "type": "rectangle",
              }
            ],
            interaction_settings:{
              'enable':true,
              'coef':0.5,
              'rotate_resolution_priority':0.9,
              'radius_threshold':100,
            },

            dyn_settings:{
              enable:false,
              enable_gravity:false,
              mass:0.1,
            },

            do_border_collision:true,
          } 
    },
    "cns":[],
}




		