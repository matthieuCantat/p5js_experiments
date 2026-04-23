
import { 
draw_rectangle,
draw_text,
draw_circle_simple,
draw_circle_from_matrix,
draw_triangle,
draw_trapezoid,
draw_star_classic,
draw_star_ai,
draw_star_realistic,
draw_cross,
isPointInside_rectangle,
isPointInside_circle,
isPointInside_triangle,
} from '../utils/draw.js';
import Matrix2d from '../utils/matrix2d.js';
import { body_effect } from './effect.js';
import Vector2d from '../utils/vector2d.js';
import { Logger } from './logger.js';

const logger = new Logger("body");



var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");


export class body
{
	drawFactory = {
		rectangle   : draw_rectangle,
		circle    : draw_circle_simple,
		circle_rot    : draw_circle_from_matrix,
		triangle :  draw_triangle,
		trapezoid : draw_trapezoid,
		star_classic    : draw_star_classic,
		star_ai    : draw_star_ai,
		star_realistic    : draw_star_realistic,
		cross : draw_cross,
		text : draw_text,
	}
	isPointInsideFactory = {
		rectangle   : isPointInside_rectangle,
		circle    : isPointInside_circle,
		circle_rot    : isPointInside_circle,
		triangle :  isPointInside_triangle,
		trapezoid : isPointInside_rectangle,
		star_classic    : isPointInside_circle,	
		star_ai    : isPointInside_circle,		
		star_realistic    : isPointInside_circle,		
		cross: isPointInside_rectangle,
		text: isPointInside_rectangle,
	}

	BORDERS_CENTER_POINTS = [
		new Vector2d(0,280),
		new Vector2d(170,0),
		new Vector2d(0,-420),
		new Vector2d(-180,0)
	]
	BORDERS_NORMALS = [
		new Vector2d(0,-1),
		new Vector2d(-1,0),
		new Vector2d(0,1),
		new Vector2d(1,0)
	]	

	GRAVITY_VECTOR = new Vector2d(0,-0.981)

	constructor(
		in_options
	)
	{
		logger.info("constructor",in_options.name)

		const defaultOptions = {
			m: new Matrix2d(),
			shape_type: "rectangle",
			color: "white",
			stroke_color: "black",
			stroke_width: 2,
            interaction: null,
			effect_name: null,
			event_effects: {},
			event_cmds: {},
			dyn_settings: {},
			do_border_collision:false,
			txt : '',
			Game_engine: null,
			Time: null,
		}
		const args = { ...defaultOptions, ...in_options };

		this.Game_engine = args.Game_engine
		this.Time = args.Time

		this.m = null
		if( args.m instanceof Matrix2d)
			this.m = args.m
		else
			this.m = new Matrix2d(args.m) // if not a matrix, convert it to one
		
		


		this.last_m = new Matrix2d(args.m) // to keep track of the last position
		this.m_init = new Matrix2d(args.m)
		this.momentum = new Vector2d()
		this.angular_momentum = 0
		this.shape_type = args.shape_type
		this.color = args.color
		this.stroke_color = args.stroke_color
		this.stroke_width = args.stroke_width	
		this.isSelected = false
        this.interaction = args.interaction
		this.txt = args.txt

		this.stroke_color_highlight = "yellow"
        this.stroke_width_highlight = 5

		this.visibility = true
		
		// INTERACTION
		let interaction_settings_default = {
			'enable':false,
			'coef':1.0,
			'rotate_resolution_priority':1.0,
			'do_translation':true,
			'attr':'tr',
			'radius_threshold':0,
			'scale_selection_shape' : 1.0,
		}

		this.interaction_settings = {...interaction_settings_default, ...in_options.interaction_settings}

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
		
		this.do_border_collision = args.do_border_collision

		/////////////////////////////////////////////////////////
		///////////////////////////////////////////////////////// EFFECTS
		/////////////////////////////////////////////////////////

		this.effect_name = args.effect_name
		
		this.event_cmds = args.event_cmds
	
		this.events = {
			'touchDown':      { name:'touchDown'     , status: false, count:0, effect_insts: [] },
			'touchUp':        { name:'touchUp'       , status: false, count:0, effect_insts: [] },
			'tap':            { name:'tap'           , status: false, count:0, effect_insts: [] },
			'doubleTap':      { name:'doubleTap'     , status: false, count:0, effect_insts: [] },
			'fingerOnScreen': { name:'fingerOnScreen', status: false, count:0, effect_insts: [] },
			'hold':           { name:'hold'          , status: false, count:0, effect_insts: [] },
			'drag':           { name:'drag'          , status: false, count:0, effect_insts: [] },
			'idle':           { name:'idle'          , status: false, count:0, effect_insts: [] },
		}
		
		this.interaction_info = null
		
		// update effect duration with event ref
		this.event_effects = args.event_effects
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
	}



	update_event_effects()
	{
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
			this.Game_engine.body_effects.push(effect_inst)	
		
		}					

	}

	duplicate()
	{
		return new body(
			{	m : new Matrix2d(this.m), 
				shape_type: this.shape_type,
				color: this.color, 
				interaction:this.interaction,
				Game_engine:this.Game_engine,
				Time:this.Time,}
			)
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

		this.update_event_effects()
		
		
	
		if( this.dyn_settings.enable )
		{
			//ADD DYN
			let p = this.m.get_row(2)
			let vMomentum = this.momentum.getMult(1-this.dyn_settings.friction_translate)
		
			let pNext = p.getAdd(vMomentum)
			let aNext = this.angular_momentum*(1-this.dyn_settings.friction_rotate)
		
			if(this.dyn_settings.enable_gravity)
			{
				pNext.add(this.GRAVITY_VECTOR.getMult(this.dyn_settings.mass))
			}

			for(let i = 0; i < this.dyn_settings.custom_forces.length; i++)
			{
				let force_info = this.dyn_settings.custom_forces[i]
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

			this.m.setRow(2,pNext)
			this.m.rotate(aNext)
		}

		// add interaction
		if(this.interaction_settings.enable)
			this.update_matrix_with_user_interaction()
	
		/*
		let axe_cns_info = { vCollisionLimit : null}
		if(this.axe_cns_settings.enable)
			axe_cns_info = this.update_matrix_axe_cns()
		*/
	

		if( this.do_border_collision )
		{
			let pCenter = this.m.get_row(2)
			let vX = this.m.get_row(0)
			let vY = this.m.get_row(1)
			let min_radius = Math.min(vX.mag(),vY.mag())

			
			// first resolve center core
			for( let i = 0 ; i < 4 ;i++)
			{
				let v = pCenter.getSub(this.BORDERS_CENTER_POINTS[i])
				let vBorder = this.BORDERS_NORMALS[i].getNormal()
				vBorder.normalize()
				let dot_proj = v.dot(vBorder)
				let pProj = vBorder.mult(dot_proj).getAdd(this.BORDERS_CENTER_POINTS[i])
				let v_proj_to_center = pCenter.getSub(pProj)
				
				let side_dot = v_proj_to_center.dot(this.BORDERS_NORMALS[i])
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
			this.m.setRow(2,pCenter)

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


					let v = points[j].getSub(this.BORDERS_CENTER_POINTS[i])
					let vBorder = this.BORDERS_NORMALS[i].getNormal()
					vBorder.normalize()
					let dot_proj = v.dot(vBorder)
					let pProj = vBorder.mult(dot_proj).getAdd(this.BORDERS_CENTER_POINTS[i])
					let v_proj_to_center = pCenter.getSub(pProj).normalize()
					let v_proj_to_point = points[j].getSub(pProj)

					let side_dot = v_proj_to_point.dot(this.BORDERS_NORMALS[i])
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

		// FOR NEXT EVAL
		let momentum = this.m.get_row(2).getSub(this.last_m.get_row(2))
		/*
		if( ( 0 < this.axe_cns_settings.dyn_bounce_coef)&&(axe_cns_info.vCollisionLimit!=null))
		{
			let vCollisionAdjust = axe_cns_info.vCollisionLimit
			let momentum_inv = momentum.getMult(-1)

			let new_momentum = vCollisionAdjust.getAdd(momentum_inv)
			momentum = new_momentum.getMult(this.axe_cns_settings.dyn_bounce_coef)
		}
			*/

		let momentum_mag = Math.max(-this.dyn_settings.speed_limit_translate,
			Math.min( this.dyn_settings.speed_limit_translate, momentum.mag()))
		momentum.normalize()
		momentum.mult(momentum_mag)	
		this.momentum = momentum	

		let angular_momentum = this.m.getRotation() - this.last_m.getRotation()
		
		if( 3.14 < angular_momentum )
			angular_momentum -= 2*3.14
		if( angular_momentum < -3.14 )
			angular_momentum += 2*3.14	
		this.angular_momentum = angular_momentum	

		this.angular_momentum = Math.max(-this.dyn_settings.speed_limit_rotate,
			Math.min( this.dyn_settings.speed_limit_rotate, angular_momentum))
		
		this.last_m = new Matrix2d(this.m) // to keep track of the last position
	
	}

	update_matrix_with_user_interaction()
	{
		if(this.interaction_info == null )
			return false

		let mode = 'rotate_priority'

		if( mode = 'rotate_priority' )
		{
			let pCenter = this.m.get_row(2)
			let pAttach = this.interaction_info.vAttach.getMult( this.m )
			let pMouse = this.interaction_info.pUser

			// pATTACH
			let vMouseToAttach = pAttach.getSub(pMouse)
			let vMouseToAttach_mag = Math.min( vMouseToAttach.mag(),
				this.interaction_settings.radius_threshold)
			
			vMouseToAttach.normalize()
			vMouseToAttach.mult(vMouseToAttach_mag)
			let pTarget = pMouse.getAdd(vMouseToAttach)
			

			let vAttach_world = pAttach.getSub(pCenter)
			let _mCurrent = new Matrix2d(this.m)
			
			
			// solve angle
			let vCenterToMouse = pTarget.getSub(pCenter)
			vCenterToMouse.normalize()
			vAttach_world.normalize()
			let aDelta = vAttach_world.getRotation(vCenterToMouse,false)
			_mCurrent.rotate(aDelta*this.interaction_settings.rotate_resolution_priority)
	
			// solve translate
			let pSelectionAttach_afterRotate = this.interaction_info.vAttach.getMult( _mCurrent )
			let vDelta = pTarget.getSub(pSelectionAttach_afterRotate)
			
			// get force
			let aMouseAttract = aDelta*this.interaction_settings.rotate_resolution_priority*this.interaction_settings.coef
			let vMouseAttract = vDelta.getMult(this.interaction_settings.coef)
	
			
			//add to matrix
			if( this.interaction_settings.do_translation == true)
				this.m.setRow(2,this.m.get_row(2).getAdd(vMouseAttract))

			this.m.rotate(aMouseAttract)	

		}
		else if ( mode == 'split_force' )
		{
	
		}


		return true
	}



	draw()
	{
        if( this.Time.one_update_debug_time_passed )
            logger.info("draw");

		if(this.visibility == false)
			return false

        ctx.save()// save current drawing style

		// STYLE
		this.drawApplyStyle(ctx)

		// DRAW SHAPE
		const drawFunction = this.drawFactory[this.shape_type];
		if (!drawFunction) {
			console.warn("Unknown shape:", this.shape_type);
			ctx.restore();
			return false
		}		
		drawFunction( ctx, this.m, this.txt);
       
		// RENDER
		if( this.color != null)
			ctx.fill()

		if( this.stroke_color != null)
			ctx.stroke()

		//ctx.resetTransform();	
        ctx.restore();// restore drawing style
		
		return true
	}


	drawApplyStyle(ctx)
	{


		if( this.color != null)
			ctx.fillStyle = this.color

		if( this.isSelected )
        {
            ctx.strokeStyle = this.stroke_color_highlight
            ctx.lineWidth = this.stroke_width_highlight
        }
        else
        {
            ctx.strokeStyle = this.stroke_color
            ctx.lineWidth = this.stroke_width
        }
				
	}

	isPointInside(point)
	{
		let mShape = new Matrix2d(this.m);
		let s = this.interaction_settings.scale_selection_shape;
		mShape = mShape.scale(s,s);
		
		return this.isPointInsideFactory[this.shape_type](point, mShape);
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