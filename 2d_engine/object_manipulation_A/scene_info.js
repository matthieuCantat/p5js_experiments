

export var scene_info = {
    "objs":{

        "obj":{ 
            m : [0,200, 0, 100,20], 
            color: 'blue', 
            shape_type:'rectangle',

            interaction_settings:{
              'enable':true,
              'coef':0.01,
              'rotate_resolution_priority':1.0,
              'radius_threshold':100,
            },

            dyn_settings:{
              enable:true,
              enable_gravity:true,
              mass:0.3,
            },

            do_border_collision:true,
          } 
    },
    "cns":[],
}




		