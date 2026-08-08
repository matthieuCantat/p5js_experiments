
import { 
isPointInside_rectangle,
isPointInside_circle,
isPointInside_triangle,
COLORS_TO_RGB,
} from '../utils/draw.js';
import Matrix2d from '../utils/matrix2d.js';
import { body_effect } from './effect.js';
import Vector2d from '../utils/vector2d.js';
import { Logger } from './logger.js';
import { build_expression_function, execute_expression_function } from './constraint.js';

const logger = new Logger("body");




export class body
{
	
	isPointInsideFactory = {
		rectangle   : isPointInside_rectangle,
		circle    : isPointInside_circle,
		//circle_rot    : isPointInside_circle,
		triangle :  isPointInside_triangle,
		trapezoid : isPointInside_rectangle,
		star_classic    : isPointInside_circle,	
		star_ai    : isPointInside_circle,		
		star_realistic    : isPointInside_circle,		
		cross: isPointInside_rectangle,
		text: isPointInside_rectangle,
	}


	HIGHLIGHT_STROKE_COLOR = "yellow"
	HIGHLIGHT_STROKE_WIDTH = 5
	
	constructor(
		in_options
	)
	{
		logger.info("constructor",in_options.name)

		const defaultOptions = {
			name : '',
			parent : null,
			m: new Matrix2d(),
			visibility : true,
			shapes_visibility : true,
			shapes : [
				{
					m : null,
					type : "rectangle",
					color : "white",
					color_brigthness:0.7,
					stroke_color:"black",
					stoke_width: 2,
					text : '',
					text_centered : false,
				}
			],
			interaction_shapes :[
				{
					m :null,
					type : "rectangle"
				}
			],

			//shape_visibility : true,
			//m_shape: null,
			//shape_type: "rectangle",
			//color: "white",
			//stroke_color: "black",
			//stroke_width: 2,
			//color_brignthess: 0.7,
			//text : '',

			//m_interaction: null,
			//shape_type_interaction: null,
			
            interaction: null,
			event_effects: {},
			dyn_settings: {},
			do_border_collision:false,
			
			Game_engine: null,
			Time: null,
			debug : {},
			//eventActions : [],
		}
		this.args = { ...defaultOptions, ...in_options };

		this.Game_engine = this.args.Game_engine
		this.Time = this.args.Time


		this.name = this.args.name
		// POSITION AND MOVEMENT
		//let mShape = null
		//if( this.args.m instanceof Matrix2d)
		//	mShape = this.args.m
		//else
		//	mShape = new Matrix2d(this.args.m) // if not a matrix, convert it to one
		//
		//this.m = new Matrix2d(mShape)
		//this.m.normalize()

		//this.m_shape = mShape.getMult(this.m.getInverse()) // to keep track of the shape matrix without the position and rotation
		//
		//this.m_init = new Matrix2d(this.args.m)
		
		let parent_obj = null
		if( this.args.parent != null )
			parent_obj = this.Game_engine.Objs[this.args.parent]
		this.trsf = new Transform(  this.args.m, 
									this.args.shapes,
									this.args.interaction_shapes,
									parent_obj )
		
		// FOR DYN
		//this.last_m = new Matrix2d(this.args.m) // to keep track of the last position
		//this.momentum = new Vector2d()
		//this.angular_momentum = 0

		// ASPECT
		/*
		this.shape_type = this.args.shape_type
		this.color = this.args.color
		if( this.args.color_brignthess != 1.0 )
		{
			let new_color = [ 
			Math.floor(COLORS_TO_RGB[this.color][0] * this.args.color_brignthess),
			Math.floor(COLORS_TO_RGB[this.color][1] * this.args.color_brignthess),
				Math.floor(COLORS_TO_RGB[this.color][2] * this.args.color_brignthess)]
			this.color = 'rgb('+new_color[0]+','+new_color[1]+','+new_color[2]+')'
		}

		this.stroke_color = this.args.stroke_color
		this.stroke_width = this.args.stroke_width
		this.text = this.args.text
		this.shape_visibility = this.args.shape_visibility
		*/

		this.shapes_dynamic_data = []
		for( let shape_info of this.args.shapes )
		{
			this.shapes_dynamic_data.push(
				{
					stroke_color : shape_info.stoke_color,
					stroke_width : shape_info.stroke_width,
				}
			)
		}

		// OTHER
        this.interaction = this.args.interaction
		


		this.visibility = this.args.visibility
		this.shapes_visibility = this.args.shapes_visibility
		
		// TRANSFORM

		let transform_settings_default = {
			parent_limit_space : false,
			translate_limits: null,
			rotate_limits: null,
		}
		this.transform_settings = {...transform_settings_default, ...in_options.transform_settings}

		// INTERACTION
		let interaction_settings_default = {
			'enable':false,
			'type':['move','button','switch'][0],
			'coef':1.0,
			'rotate_resolution_priority':1.0,
			'do_translation':true,
			'radius_threshold':0,
			'scale_selection_shape' : 1.0,
		}

		let _interaction_settings = {...interaction_settings_default, ...in_options.interaction_settings}

		// DYN
		let dyn_settings_default = {
			'enable':false,
			'enable_gravity':false,
			'mass':1,
			'friction_translate':0.01,
			'friction_rotate':0.01,
			'speed_limit_translate': 30,
			'speed_limit_rotate':0.3,
			'custom_forces':[],
		}
		this.dyn_settings = { ...dyn_settings_default, ...in_options.dyn_settings };

		// AXE_CNS
		/*
		let axe_cns_settings_default = {
			'enable':false,
			'm_driver':new Matrix2d(),
			'v_axe':new Vector2d(1,0),
			'enable_limits':false,
			'limit_min':null,
			'limit_max':null,
			'rotation_constraint_coef':0.0,
			'rotation_constraint_axe':0,
			'dyn_bounce_coef':0,
		}
		this.axe_cns_settings = { ...axe_cns_settings_default, ...in_options.axe_cns_settings };
		*/
		this.border_collision_info = {
			do_border_collision : this.args.do_border_collision,		
			borders_center_points : [
				new Vector2d(0,280),
				new Vector2d(170,0),
				new Vector2d(0,-420),
				new Vector2d(-180,0)
			],
			borders_normals : [
				new Vector2d(0,-1),
				new Vector2d(-1,0),
				new Vector2d(0,1),
				new Vector2d(1,0)
			]	
		}
		

		this.interaction = {
			settings : _interaction_settings,
			vCenter_to_userFirstGrab_mLocal : null,
			pUser : this.Game_engine.User.Coords.p,
			vOffset : null,	
		}

		/////////////////////////////////////////////////////////
		///////////////////////////////////////////////////////// EFFECTS
		/////////////////////////////////////////////////////////
		this.Event = new Event( this.Game_engine, this )
		
			
		
		
		
		// update effect duration with event ref
		this.event_effects = this.args.event_effects
		for( let event in this.event_effects)
		{
			if(this.event_effects[event] == null)
				continue
			
			for(let i=0; i < this.event_effects[event].effects.length; i++)
			{
				let effect_info = this.event_effects[event].effects[i]
				if( 'duration' in effect_info == false)
					continue

				let duration = effect_info.duration
				if(typeof duration === 'string' )
				{
					let event_target_name = duration
					//REPLACE
					this.event_effects[event].effects[i].duration = this.events[event_target_name]	
				}	
			}
		}

		//this.eventActions = this.args.eventActions

		/////////////////////////////////////////////////////////
		///////////////////////////////////////////////////////// OTHERS
		/////////////////////////////////////////////////////////

		// PARENT
		
		this.shape_type_interaction = this.args.shape_type_interaction
		if( this.shape_type_interaction == null )
			this.shape_type_interaction = this.shape_type
		
		
		this.debug = this.args.debug

	}


	
	update_event_effects()
	{
		

		/*
		// Check if any event is triggered and create the effect instance if needed	
		for( const eventAction of this.eventActions)
		{
			const event_name = eventAction.event;
			
			if( this.events[event_name].status == false ) 
				continue
			
			var action = eventAction.action
			if( action.mode == 'expression' )
			{

                let in_expr_txt = action.expression

                var in_args = {}    
                for( let attr in action )
                {
                    if( attr == 'expression' )
                        continue
                    if( attr == 'mode' )
                        continue
                    if( attr == 'out' )
                        continue
                    in_args[attr] = action[attr]
                }

                let out_attr = null
                if( action.out instanceof Array )
                    out_attr = action.out[1]
                
			

				let out_info = build_expression_function( in_expr_txt , in_args, out_attr)
				
				out_info.args_names
				out_info.function

                let objs = []
                for( let arg_name of out_info.args_names)
                {
					if( action[arg_name] == undefined )
                        continue
                    let obj_name = action[arg_name][0]
                    objs.push(this.Game_engine.Objs[obj_name])
                }

				execute_expression_function( out_info.function, objs )
                
			}
		}
		*/


		for( const key in this.events)
		{
			
			let no_effects_linked = ( this.event_effects[key] == null )
			if( no_effects_linked )
				continue

			let isTriggered = (this.events[key].status == true)
			if( isTriggered == false ) 
				continue

			let effect_already_running = (0 < this.events[key].effect_insts.length )
			let isNotRepeatable = this.event_effects[key].isRepeatable == false
			let oneEffectAtTheTime = ((isNotRepeatable)&&(effect_already_running))
		
			if(oneEffectAtTheTime)
				continue

			
			let effect_inst = new body_effect(
				this,
				this.event_effects[key].effects,
				this.Time,)

			this.events[key].effect_insts.push( effect_inst	)
			this.Game_engine.body_effects.push( effect_inst )	
		
		}
		//this.eventActions					
	



		// clean
		for( const key in this.events)
		{
			let effect_insts = this.events[key].effect_insts
			if( effect_insts.length == 0 )
				continue

			let effect_inst_cleaned = []
			for( let i = 0; i < effect_insts.length; i++ )
			{
				if ( effect_insts[i].isFinished() == true )
				{
					effect_insts[i].clean()
				}
				else
				{
					effect_inst_cleaned.push(effect_insts[i])
				}		
			}
			this.events[key].effect_insts = effect_inst_cleaned
		}


		// Check if any event is triggered and create the effect instance if needed	
		for( const key in this.events)
		{
			
			let no_effects_linked = ( this.event_effects[key] == null )
			if( no_effects_linked )
				continue

			let isTriggered = (this.events[key].status == true)
			if( isTriggered == false ) 
				continue

			let effect_already_running = (0 < this.events[key].effect_insts.length )
			let isNotRepeatable = this.event_effects[key].isRepeatable == false
			let oneEffectAtTheTime = ((isNotRepeatable)&&(effect_already_running))
		
			if(oneEffectAtTheTime)
				continue

			
			let effect_inst = new body_effect(
				this,
				this.event_effects[key].effects,
				this.Time,)

			this.events[key].effect_insts.push( effect_inst	)
			this.Game_engine.body_effects.push( effect_inst )	
		
		
		}					

	}

	duplicate()
	{
		return null
		/*
		return new body(
			{	m : new Matrix2d(this.trsf.get_shapes()), 
				shape_type: this.shape_type,
				color: this.color, 
				interaction:this.interaction,
				Game_engine:this.Game_engine,
				Time:this.Time,}
			)
				*/
	}

	isMoving()
	{

		let vDelta = this.m.get_row(2).getSub(this.last_m.get_row(2))
		return vDelta.mag() > 0.0001
	}


	update()
	{
        if( this.Time.one_update_debug_time_passed )
            logger.info("update");

		if( this.visibility == false )
			return false

		
		this.Event.update()
		//this.update_event_effects()
		
		this.trsf.update(
			this.transform_settings,
			this.interaction,
			this.dyn_settings,
			this.border_collision_info
		)
	
		//let axe_cns_info = { vCollisionLimit : null}
		//if(this.axe_cns_settings.enable)
		//	axe_cns_info = this.update_matrix_axe_cns()
		

		let is_selected = this.isSelected()
		for( let i = 0; i < this.args.shapes.length; i++ )
		{
			if(is_selected)
			{
				this.shapes_dynamic_data[i].stroke_color = this.HIGHLIGHT_STROKE_COLOR
				this.shapes_dynamic_data[i].stroke_width = this.HIGHLIGHT_STROKE_WIDTH	
			}
			else
			{
				this.shapes_dynamic_data[i].stroke_color = this.args.shapes[i].stroke_color
				this.shapes_dynamic_data[i].stroke_width = this.args.shapes[i].stroke_width	
			}
			
		}
		


	}

	isSelected()
	{
		return this.interaction.vCenter_to_userFirstGrab_mLocal != null
	}

	cleanUserInteractionInfo()
	{
		this.interaction.vCenter_to_userFirstGrab_mLocal = null
	}

	setUserFirstInteractionInfo( pUser, pUserPressed )
	{			
		if( this.isPointInside(pUser) == false)
			return false

		if( this.interaction.vCenter_to_userFirstGrab_mLocal != null)
			return false

		
		
		// vOffset
		let m = this.trsf.get()
		let pCenter= m.get_row(2)
		let vCenter_to_pPressed = pUserPressed.getSub( pCenter )
		this.interaction.vCenter_to_userFirstGrab_mLocal = vCenter_to_pPressed.getMult(m.getInverse(), true)	
		
		return true		
	}

	isPointInside(point)
	{
		
		var shapes_matrices = this.trsf.get_interaction_shapes()
		for( let i = 0; i < shapes_matrices.length; i++ )
		{
			let mShape = shapes_matrices[i]
			let s = this.interaction.settings.scale_selection_shape;
			mShape = mShape.scale(s,s);

			let shape_type = this.args.interaction_shapes[i].type

			let is_inside = this.isPointInsideFactory[shape_type](point, mShape);
			if( is_inside )
				return true
		}

		return false
	}

	get_render_infos_interaction_shape_debug()
	{
		var color = 'black'
		if( 0 < this.args.shapes.length )
			color = this.args.shapes[0].color

		let draw_info = []
		if( this.debug.shape_interaction_visibility )
		{
			var shapes_matrices = this.trsf.get_interaction_shapes()
			for( let i = 0; i < shapes_matrices.length; i++ )
			{
				draw_info.push(
					{
						shape_type : this.args.interaction_shapes[i].type,      
						m : shapes_matrices[i], 
						color : null,
						stroke_color : color, 
						stroke_width : 1,   	
					}
				)
			}
		}

		return draw_info
	}


	get_render_infos_matrix_debug()
	{
		let SIZE = 10
		let THICKNESS = 2
		let STROKE_THICKENESS = 1

		let m = this.trsf.get()
		let vX = m.get_row(0).getMult(SIZE)
		let vY = m.get_row(1).getMult(SIZE)
		let p = m.get_row(2)

		let mAxeX = new Matrix2d(m)
		mAxeX.setRow(2,p.getAdd(vX))
		mAxeX.setScale(SIZE,THICKNESS)

		let mAxeY = new Matrix2d(m)
		mAxeY.setRow(2,p.getAdd(vY))
		mAxeY.setScale(THICKNESS,SIZE)

		return [ {
			shape_type : 'circle',      
			m : m, 
			color : 'black',
			stroke_color : 'black', 
			stroke_width : STROKE_THICKENESS,        
		},
		{
			shape_type : 'rectangle',      
			m : mAxeX, 
			color : 'red',
			stroke_color : 'black', 
			stroke_width : STROKE_THICKENESS,        
		},
		{
			shape_type : 'rectangle',      
			m : mAxeY, 
			color : 'green',
			stroke_color : 'black', 
			stroke_width : STROKE_THICKENESS,        
		},	
	]		
	}	

	get_render_infos()
	{
		let shapes_matrices = this.trsf.get_shapes()

		var draw_info = []
		for( let i = 0; i < shapes_matrices.length; i++ )
		{
			draw_info.push(
				{
					shape_type : this.args.shapes[i].type,      
					m : shapes_matrices[i], 
					text: this.args.shapes[i].text,
					text_centered : this.args.shapes[i].text_centered,
					color : this.args.shapes[i].color,
					stroke_color : this.shapes_dynamic_data[i].stroke_color, 
					stroke_width : this.shapes_dynamic_data[i].stroke_width,   	
				}
			)
		}
		
		

		return draw_info
	}

	get_render_infos_interaction_debug()
	{
		if( this.interaction.vCenter_to_userFirstGrab_mLocal == null )
			return []

		let pUser = this.Game_engine.User.Coords.p
		let m = this.trsf.get()
		let pCenter = m.get_row(2)

		let vCenter_to_userFirstGrab_mLocal = this.interaction.vCenter_to_userFirstGrab_mLocal
		let vCenter_to_userFirstGrab = vCenter_to_userFirstGrab_mLocal.getMult(m, true )
		let pUserFirstGrab = pCenter.getAdd( vCenter_to_userFirstGrab )

		let render_infos = []
		render_infos.push({
			shape_type : 'circle',  
			m : new Matrix2d().setTranslation(pUserFirstGrab).setScale(5), 
			color : 'yellow',
			stroke_color : 'black', 
			strokes_width : 5,            
		} )
		
		render_infos.push({
			shape_type : 'circle',  
			m : new Matrix2d().setTranslation(pCenter).setScale(5), 
			color : 'yellow',
			stroke_color : 'black', 
			strokes_width : 5,            
		} )
		
		render_infos.push({
			shape_type : 'line',
			points : [pUserFirstGrab, pCenter] , 
			stroke_color : 'yellow', 
			lineWidth : 2 })

		render_infos.push({
			shape_type : 'line',
			points : [pUserFirstGrab, pUser] , 
			stroke_color : 'red', 
			lineWidth : 2 })
		
		return render_infos
	}

}

/*

class Effect
{
	constructor( args )
	{
		for( let event in args)
		{
			
			for(let i=0; i < args[event].effects.length; i++)
			{
				let effect_info = args[event].effects[i]
				if( 'duration' in effect_info == false)
					continue

				let duration = effect_info.duration
				if(typeof duration === 'string' )
				{
					let event_target_name = duration
					//REPLACE
					this[event].effects[i].duration = this.events[event_target_name]	
				}	
			}
		}
	}
}
*/


class Transform
{
	GRAVITY_VECTOR = new Vector2d(0,-0.981)

	constructor( arg_m, 
		arg_shapes_info = null,
		arg_interaction_shapes_info = null,
		obj_parent = null )
	{
		
		this.obj_parent = obj_parent

		// BODY
		let in_body_matrix = null
		if( arg_m instanceof Matrix2d)
			in_body_matrix = arg_m
		else
			in_body_matrix = new Matrix2d(arg_m) // if not a matrix, convert it to one

		let m_body_world = new Matrix2d(in_body_matrix).normalize()

		// PARENT
		this.m_parent_to_body = m_body_world
		if( this.obj_parent != null )
			this.m_parent_to_body = m_body_world.getMult(this.obj_parent.trsf.get().getInverse())

		// SHAPES
		var in_shapes_matices = []
		for( const shape_info of arg_shapes_info )
		{
			let m = null
			if( ( shape_info.m === null)||( shape_info.m === undefined) )
				m = in_body_matrix
			else if( shape_info.m instanceof Matrix2d)
				m = shape_info.m
			else
				m = new Matrix2d(shape_info.m) // if not a matrix, convert it to one	
			in_shapes_matices.push( m )
		}

		//if( arg_shapes_info.length === 0 )
		//	in_shapes_matices.push( new Matrix2d(in_body_matrix) )
		
		this.m_body_to_shapes = []
		for( const m of in_shapes_matices )
			this.m_body_to_shapes.push( m.getMult(m_body_world.getInverse())  )
		

		// INTERACTION
		var in_interactions_matices = []
		for( let i = 0; i < arg_interaction_shapes_info.length; i++ )
		{
			let shape_info = arg_interaction_shapes_info[i]

			let m = null
			if( shape_info.m === null)
				m = in_shapes_matices[i]
			if( shape_info.m instanceof Matrix2d)
				m = shape_info.m
			else
				m = new Matrix2d(shape_info.m) // if not a matrix, convert it to one	
				in_interactions_matices.push( m )
		}

		if( arg_interaction_shapes_info.length === 0 )
			in_interactions_matices = in_shapes_matices

		this.m_body_to_interactions = []
		for( let m of in_interactions_matices )
		{
			this.m_body_to_interactions.push( m.getMult(m_body_world.getInverse()) )// to keep track of the interaction matrix without the position and rotation
		}
		


		// ANIMATION
		this.m_body_modif = new Matrix2d() // to keep track of the user interaction movement
	

		// FOR DYN
		this.dyn_data = {
			last_m : new Matrix2d(this.get()),
			momentum : new Vector2d(),
			angular_momentum : 0,
		}
		

	}


	set(m)
	{
		this.m_body_modif = m.getMult(this.get_body().getInverse())
	}

	setTranslate(p)
	{
		let m = this.get()
		m.setRow(2,p)
		this.set(m)
	}
	
	setTranslateX( value )
	{
		let m = this.get()
		m.setRow(2,new Vector2d(value,m.get_row(2).y))
		this.set(m)
	}

	setTranslateY( value )
	{
		let m = this.get()
		m.setRow(2,new Vector2d(m.get_row(2).x,value))
		this.set(m)
	}

	setRotationDeg( value )
	{
		let m = this.get()
		m.setRotationDeg(value)
		this.set(m)
	}


	get_body()
	{
		// m_body
		let m_body_init = this.m_parent_to_body
		if( this.obj_parent != null )
			 m_body_init = this.m_parent_to_body.getMult(this.obj_parent.trsf.get())
		return m_body_init		
	}

	get()
	{
		// m_body
		let m_body_init = this.get_body()
		// m_body_dyn
		let m_body_modified = this.m_body_modif.getMult(m_body_init)		

		return m_body_modified
	}

	
	getTranslate()
	{
		let m = this.get()
		return m.get_row(2)
	}

	getTranslateX()
	{
		return this.getTranslate().x
	}

	getTranslateY( )
	{
		return this.getTranslate().y
	}


	get_shapes()
	{
		let m_body_dyn = this.get()

		var shape_matrices = []
		for( const m of this.m_body_to_shapes )
			shape_matrices.push( m.getMult(m_body_dyn) )

		return shape_matrices
	}	

	get_interaction_shapes()
	{
		let m_body_dyn = this.get()

		var interaction_shape_matrices = []
		for( const m of this.m_body_to_interactions )
			interaction_shape_matrices.push( m.getMult(m_body_dyn) )

		return interaction_shape_matrices
	}		

	update(
		transform_settings,
		interaction,
		dyn_settings,
		border_collision_info
	)
	{
		let do_interaction = ( (interaction.vCenter_to_userFirstGrab_mLocal != null )&&(interaction.settings.type == 'move' ) )
		


		let m = new Matrix2d( this.get() )
		
		if( do_interaction )
		{
			m = this.update_with_user_interaction( m, interaction )
			m = this.update_with_transform_settings( m, transform_settings )
		}


		if( dyn_settings.enable )
		{
			m = this.update_with_dynamics( m , dyn_settings )
			m = this.update_with_transform_settings( m, transform_settings )
			m = this.update_with_border_collision( m, border_collision_info )
			this.update_dynamic_data(m,dyn_settings)
		}
		
		this.set(m)
		//this.m_body_modif = m.getMult(this.get_body().getInverse())

	}
	
	update_with_user_interaction( m , Interaction )
	{
		
		
		let pUser = Interaction.pUser
		let pCenter = m.get_row(2)

		let vCenter_to_userFirstGrab_mLocal = Interaction.vCenter_to_userFirstGrab_mLocal
		let vCenter_to_userFirstGrab = vCenter_to_userFirstGrab_mLocal.getMult(m, true)
		
		/*
		let pUserGrab = pCenter.getAdd( vCenter_to_userFirstGrab )
		
		//vCenter_to_userGrab.log('vCenter_to_userGrab')

		// pATTACH
		
		let _vUser_to_userGrab = pUserGrab.getSub(pUser)
		let _vUser_to_userGrab_mag = Math.min( _vUser_to_userGrab.mag(),
			Interaction.settings.radius_threshold)
		
			_vUser_to_userGrab.normalize()
			_vUser_to_userGrab.mult(_vUser_to_userGrab_mag )
		let _pUserGrab_modif = pUser.getAdd(_vUser_to_userGrab)
		
		let vCenter_to_userGrab_adjusted = _pUserGrab_modif.getSub(pCenter)
		*/

		// SOLVE MATRIX
		let _m = new Matrix2d(m)
		
		// SOLVE MATRIX ROTATE
		let aMouseAttract = 0
		if( 0 < Interaction.settings.rotate_resolution_priority)
		{
			// update matrix tmp
			let vCenter_to_user = Interaction.pUser.getSub(pCenter)
			vCenter_to_user.normalize()			
			vCenter_to_userFirstGrab.normalize()
			let aDelta = vCenter_to_user.getRotation(vCenter_to_userFirstGrab, false)
			_m.rotate(aDelta*Interaction.settings.rotate_resolution_priority)
			
			// get force
			aMouseAttract = aDelta*Interaction.settings.rotate_resolution_priority*Interaction.settings.coef
			
		}
		// solve translate
		let _vCenter_to_userGrab_afterRotate = vCenter_to_userFirstGrab_mLocal.getMult( _m, true )
		let pUserGrab_afterRotate = pCenter.getAdd( _vCenter_to_userGrab_afterRotate )	 
		let vDelta = pUser.getSub(pUserGrab_afterRotate)
		
		// get force
		let vMouseAttract = vDelta.getMult(Interaction.settings.coef)

		//add to matrix
		if( Interaction.settings.do_translation == true)
			m.setRow(2,m.get_row(2).getAdd(vMouseAttract))

		//console.log(aMouseAttract)
		m.rotate(aMouseAttract)	

		return m
	}





	update_with_dynamics( m, dyn_settings )
	{
		//ADD DYN

		let p = m.get_row(2)
		let vMomentum = this.dyn_data.momentum.getMult(1-dyn_settings.friction_translate)
	
		let pNext = p.getAdd(vMomentum)
		let aNext = this.dyn_data.angular_momentum*(1-dyn_settings.friction_rotate)
	
		if(dyn_settings.enable_gravity)
		{
			pNext.add(this.GRAVITY_VECTOR.getMult(dyn_settings.mass))
		}

		for(let i = 0; i < dyn_settings.custom_forces.length; i++)
		{
			let force_info = dyn_settings.custom_forces[i]
			let v = pNext.getSub(force_info.p)
			
			if(0 < force_info.influence_radius)
			{
				
				if(v.mag() < force_info.influence_radius)
				{
					
					let vForce =  v.getMult(force_info.strength)
					pNext.add(vForce)
				}
			}
			else
			{
				let vForce = v.getMult(force_info.strength)
				pNext.add(vForce)
			}
			
		}

		m.setRow(2,pNext)
		m.rotate(aNext)

		return m
	}

	update_with_border_collision( m, border_collision_info )
	{
		if( border_collision_info.do_border_collision )
		{
			let pCenter = m.get_row(2)
			let vX = m.get_row(0)
			let vY = m.get_row(1)
			let min_radius = Math.min(vX.mag(),vY.mag())

			
			// first resolve center core
			for( let i = 0 ; i < 4 ;i++)
			{
				let v = pCenter.getSub(border_collision_info.borders_center_points[i])
				let vBorder = border_collision_info.borders_normals[i].getNormal()
				vBorder.normalize()
				let dot_proj = v.dot(vBorder)
				let pProj = vBorder.mult(dot_proj).getAdd(border_collision_info.borders_center_points[i])
				let v_proj_to_center = pCenter.getSub(pProj)
				
				let side_dot = v_proj_to_center.dot(border_collision_info.borders_normals[i])
				let isOnScreenSide = 0 < side_dot
				if ( isOnScreenSide )
				{
					if( v_proj_to_center.mag() < min_radius )
					{
						let push_mag = min_radius - v_proj_to_center.mag() 
						let vPush =  v_proj_to_center.getNormalized()
						vPush.mult(push_mag )
						pCenter.add(vPush)
					}
				}
				else
				{
					let push_mag = v_proj_to_center.mag()+min_radius
					let vPush =  v_proj_to_center.getNormalized()
					vPush.mult(-push_mag )
					pCenter.add(vPush)
				}
			}
			m.setRow(2,pCenter)

			// solve
		
			/*

			for( let i = 0 ; i < 4 ;i++)
			{
				pCenter = this.m.get_row(2)

				vX = this.m.get_row(0)
				vY = this.m.get_row(1)					
				let points = [
					pCenter.getAdd(vX.getMult(-1)).getAdd(vY),
					pCenter.getAdd(vX).getAdd(vY),
					pCenter.getAdd(vX).getAdd(vY.getMult(-1)),
					pCenter.getAdd(vX.getMult(-1)).getAdd(vY.getMult(-1)),
				]

				for( let j = 0 ; j < 4 ;j++)
				{


					let v = points[j].getSub(this.borders_center_points[i])
					let vBorder = this.borders_normals[i].getNormal()
					vBorder.normalize()
					let dot_proj = v.dot(vBorder)
					let pProj = vBorder.mult(dot_proj).getAdd(this.borders_center_points[i])
					let v_proj_to_center = pCenter.getSub(pProj).normalize()
					let v_proj_to_point = points[j].getSub(pProj)

					let side_dot = v_proj_to_point.dot(this.borders_normals[i])
					let isOnScreenSide = 0 < side_dot
					if ( isOnScreenSide == false )
					{
						let push_mag = v_proj_to_point.mag()
						
						let vPushToCenter_mag = v_proj_to_point.dot(v_proj_to_center)
						let vPushToCenter = v_proj_to_center.getMult(vPushToCenter_mag)

						let vPushRot = v_proj_to_point.getSub(vPushToCenter)
						let _p = points[i].getAdd(vPushRot)
						let vA = points[i].getSub(pCenter)
						let vB = _p.getSub(pCenter)
						let rot = vA.getRotation(vB)

						this.m.setRow(2,this.m.get_row(2).add(vPushToCenter))
						this.m.rotate(rot)
						

					}
				}
			}
			this.m.setRow(2,pCenter)			
			*/

		}	
		
		return m
	}

	update_with_transform_settings( m , transform_settings)
	{

		let m_ref = null
		if( transform_settings.parent_limit_space == true )
			m_ref = this.obj_parent.trsf.get()
		else
			m_ref = this.get_body()	

		let m_local = m.getMult(m_ref.getInverse())
		
		if ( transform_settings.translate_limits != null )
		{
			let xLimits = transform_settings.translate_limits[0]
			let yLimits = transform_settings.translate_limits[1]

			let p_local = m_local.get_row(2)
			p_local.x = Math.max(xLimits[0], Math.min(xLimits[1], p_local.x))
			p_local.y = Math.max(yLimits[0], Math.min(yLimits[1], p_local.y))				
			
			m_local.setRow( 2, p_local )
			let _m = m_local.getMult(m_ref) 

			let _p = _m.get_row(2)
			m.setRow( 2, _p)
			//m = _m
		}
		
		
		if ( transform_settings.rotate_limits != null )
		{
			let r = m_local.getRotation() // 0 to 360
			let r_pos = r // 0 to 360

			// -180 to 180
			let r_max =  transform_settings.rotate_limits[1]
			let r_min = transform_settings.rotate_limits[0]
			
			// -0 to -360
			let r_max_pos = r_max 
			if( r_max < 0  )
				r_max_pos = r_max + 360

			let r_min_pos = r_min
			if( r_min_pos < 0 )
				r_min_pos = r_min + 360

			let r_middle = ( (r_max - r_min)/2 + r_min )% 360
			let r_middle_opposite = ( r_middle + 180 )% 360

			// compute new r
			let r_pos_clamped = r_pos

			// MAX CLAMP
			if( r_max_pos < r_middle_opposite )
			{
				if( ( r_max_pos < r_pos_clamped )&&( r_pos_clamped <= r_middle_opposite ) )
					r_pos_clamped = r_max_pos
			}
			else
			{
				if( ( r_max_pos < r_pos_clamped )&&( r_pos_clamped <= 360 ) )
					r_pos_clamped = r_max_pos	
				if( ( 0 < r_pos_clamped )&&( r_pos_clamped <= r_middle_opposite ) )
					r_pos_clamped = r_max_pos						
			}

			// MIN CLAMP
			if( r_middle_opposite < r_min_pos  )
			{
				if( ( r_middle_opposite < r_pos_clamped )&&( r_pos_clamped <= r_min_pos ) )
					r_pos_clamped = r_min_pos
			}
			else
			{
				if( ( r_middle_opposite < r_pos_clamped )&&( r_pos_clamped <= 360 ) )
					r_pos_clamped = r_min_pos	
				if( ( 0 < r_pos_clamped )&&( r_pos_clamped <= r_min_pos ) )
					r_pos_clamped = r_min_pos						
			}


			let r_clamped = r_pos_clamped 
			
			m_local.setRotation(r_clamped)
			let _m = m_local.getMult(m_ref) 

			
			m.setRow( 0,  _m.get_row(0) )
			m.setRow( 1,  _m.get_row(1) )
		}	
			
		//parent_limit_space : false,
		//translate_limits: [[-100,100],[0,0]],
		//rotate_limits: [-15,14],
		return m
	}


	update_dynamic_data(m, dyn_settings)
	{
		
		// FOR NEXT EVAL
		let momentum = m.get_row(2).getSub(this.dyn_data.last_m.get_row(2))
		/*
		if( ( 0 < this.axe_cns_settings.dyn_bounce_coef)&&(axe_cns_info.vCollisionLimit!=null))
		{
			let vCollisionAdjust = axe_cns_info.vCollisionLimit
			let momentum_inv = momentum.getMult(-1)

			let new_momentum = vCollisionAdjust.getAdd(momentum_inv)
			momentum = new_momentum.getMult(this.axe_cns_settings.dyn_bounce_coef)
		}
			*/

		let momentum_mag = Math.max(-dyn_settings.speed_limit_translate,
			Math.min( dyn_settings.speed_limit_translate, momentum.mag()))
		momentum.normalize()
		momentum.mult(momentum_mag)	
		this.dyn_data.momentum = momentum	

		let angular_momentum = m.getRotation() - this.dyn_data.last_m.getRotation()
		
		if( 180 < angular_momentum )
			angular_momentum -= 360
		if( angular_momentum < -180 )
			angular_momentum += 360	
		this.dyn_data.angular_momentum = angular_momentum	

		this.dyn_data.angular_momentum = Math.max(-dyn_settings.speed_limit_rotate,
			Math.min( dyn_settings.speed_limit_rotate, angular_momentum))
		
		this.dyn_data.last_m.set(m) 
			
	}



}




class Event{

	static HISTORY_NBR = 40

	static THRESHOLD = {
		frame_nbr:{
			touch_up_fix : 30,
			tap : 10,
			pause : 50,
			idle : 200,
		},
		distance:{
			move : 50,
			flick : 0,
		},
		dot:{
			swipe:0.5
		}
	}

	static VECTORS = {
		up: new Vector2d(0,1),
		down: new Vector2d(0,-1),
		left: new Vector2d(-1,0),
		right: new Vector2d(1,0),
	}

	static unselected_events_names = [
		'unselected',
		'idle'
	]

	constructor(Game_engine,Obj)
	{
		this.Game_engine = Game_engine
		this.Obj = Obj
		this.user_event_names = []


		this.data = {}
		// FILL FROM USER
		for( const key in Game_engine.User.Event.data )
		{
			this.user_event_names.push( key )
			this.data[key] ={ status:false, count:0, history:[]  }	
		}

		
		// HOLD
		this.data['hold']       = { status:false, count:0, history:[]  }// select and pause	
		this.data['unselected'] = { status:false, count:0, history:[]  }// select and pause	
		this.data['idle']       = { status:false, count:0, history:[]  }// select and pause	
		
		this.unselected_events_names = Event.unselected_events_names
		this.selected_events_names = []
		for( let event_name in this.data )
		{
			if( this.unselected_events_names.includes(event_name) == false )
				this.selected_events_names.push(event_name)
		}
	}

	update_from_user( Game_engine )
	{
		for( let event of this.user_event_names )
			this.data[event].status = Game_engine.User.Event.data[event].status
	}

	clear()
	{
		if( this.is_selected() )
		{
			for( let event of this.unselected_events_names )
				this.data[event] = { status:false, count:0, history:[] }
		}
		else
		{
			for( let event of this.selected_events_names )
				this.data[event] = { status:false, count:0, history:[] }
		}

			
	}

	is_selected()
	{
		return ( (this.Game_engine.User.Selection.obj == this.Obj )||( this.Game_engine.User.Selection.obj_last_eval == this.Obj ))
	}

	update()
	{
		
		if( this.is_selected() )
		{

			/////////////////////////////////////////////////////////////
			// OTHER
			/////////////////////////////////////////////////////////////

			// HOLD
			var obj_already_drag = false
			for( let drag_past of this.data.move.history )
			{
				if( drag_past )
				{
					obj_already_drag = true
					break
				}
			}
			
			this.data.hold.status = false
			if( this.data.pause.status && ( obj_already_drag == false ) )
			{
				this.data.pause.status = false
				this.data.hold.status = true
			}
			



			/////////////////////////////////////////////////////////////
			// HISTORY
			/////////////////////////////////////////////////////////////

			//this.add_to_history( )
			for (const key of this.selected_events_names) 
				this.fill_history(key)

		}
		else
		{

			/////////////////////////////////////////////////////////////
			// NOT SELECTED
			/////////////////////////////////////////////////////////////

			
			this.data['unselected'].status = true


			this.data.idle.status = false
			
			if( this.data.unselected.status )
			{
				this.data.idle.status = Event.THRESHOLD.frame_nbr.idle < this.data.unselected.history.length
				
			}
	

			for (const key of this.unselected_events_names) 
				this.fill_history(key)
			
	

		}
	}

	fill_history(event_name)
	{
		this.data[event_name].history.unshift(this.data[event_name].status)
		if ( this.HISTORY_NBR < this.data[event_name].history.length)
			this.data[event_name].history.pop(); // Remove the oldest if over size		
	}

}