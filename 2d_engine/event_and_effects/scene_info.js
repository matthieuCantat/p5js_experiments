



export var scene_info = {
    objs:{
        'A':{ 
			m : [0,200, 0 , 60,20], 
			color: 'blue', 
			shape_type:'rectangle',

			interaction_settings: {
				'enable':true,
				'coef':1.,
				'rotate_resolution_priority':0.0,
				'radius_threshold':0,
				'do_translation':true,
			},


			event_effects : {
                'touchDown': { effects:[{ type:'particles_radial_strokes' }], isRepeatable:true},
                'touchUp': { effects:[{ type:'water_ripple'}], isRepeatable:true},
                'tap': { effects:[{ type:'particles_escape'}], isRepeatable:true},
                'doubleTap': { effects:[{ type:'disco_ripple'}], isRepeatable:true},
                'fingerOnScreen': null,
                'hold': { effects:[{ type:'particles_effervescent', duration:'hold' }], isRepeatable:false},
                'drag': { effects:[{ type:'body_color_acid_rainbow', duration:'drag'}], isRepeatable:false},
                'idle': { effects:[{ type:'particles_new', duration:'idle'}], isRepeatable:false},
                //'selectedidle': [{ type:'glow'}],
                //'collision': [{ type:'particles_radial_strokes' }],
            }
		},
        'B':{ 
			m : [0,100, 0 , 60,20], 
			color: 'red', 
			shape_type:'rectangle',

			interaction_settings: {
				'enable':true,
				'coef':1.,
				'rotate_resolution_priority':0.0,
				'radius_threshold':0,
				'do_translation':true,
			},

			event_effects : {
                'touchDown': { effects:[{ type:'particles_radial_strokes' }], isRepeatable:true},
                'touchUp': { effects:[{ type:'water_ripple'}], isRepeatable:true},
                'tap': { effects:[{ type:'particles_escape'}], isRepeatable:true},
                'doubleTap': { effects:[{ type:'disco_ripple'}], isRepeatable:true},
                'fingerOnScreen': null,
                'hold': { effects:[{ type:'particles_effervescent', duration:'hold' }], isRepeatable:false},
                'drag': { effects:[{ type:'body_color_acid_rainbow', duration:'drag'}], isRepeatable:false},
                'idle': { effects:[{ type:'particles_new', duration:'idle'}], isRepeatable:false},
                //'selectedidle': [{ type:'glow'}],
                //'collision': [{ type:'particles_radial_strokes' }],
            }
		}        
    },
    'cns':[
        {
            mode: 'axe',
            driver_obj: [0,200, 0 , 60,20],
            driven_objs: ['A'],
            v_axe: [1,0],
            enable:true,
            enable_limits:true,
            limit_max: 150,
            limit_min: -150,
            rotation_constraint_coef:1.0,
            rotation_constraint_axe: 0,
        },
        {
            mode: 'axe',
            driver_obj: [0,100, 0 , 60,20],
            driven_objs: ['B'],
            v_axe: [0,1],
            enable:true,
            enable_limits:true,
            limit_max: 0,
            limit_min: -400,
            rotation_constraint_coef:1.0,
            rotation_constraint_axe: 1,
        }        

    ]
}