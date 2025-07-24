
import { 
draw_rectangle,
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
} from './draw.js';
import Matrix2d from './matrix2d.js';
import { body_effects } from './shared.js';
import { body_effect } from './effect.js';
import Vector2d from './vector2d.js';




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
	}

	DYN = false

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

	constructor(
		in_options,
	)
	{
		const defaultOptions = {
			m: new Matrix2d(),
			shape_type: "rectangle",
			color: "white",
			stroke_color: "black",
			stroke_width: 2,
            interaction: null,
			effect_name: null,
			event_effects: {},
		}
		const args = { ...defaultOptions, ...in_options };

		this.m = args.m
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

		this.stroke_color_highlight = "yellow"
        this.stroke_width_highlight = 5

		this.visibility = true

		this.effect_name = args.effect_name

		this.event_effects = args.event_effects
		/*
		this.events = {
			'isPressed': { status: false, count:0, effect_insts: [] },
			'isPressedHold': { status: false, count:0, effect_insts: [] },
			'isReleased': { status: false, count:0, effect_insts: [] },
			'touchmove': { status: false, count:0, effect_insts: [] },
			'touchidle': { status: false, count:0, effect_insts: [] },
			'idle': { status: false, count:0, effect_insts: [] },
			'selectedidle': { status: false, count:0, effect_insts: [] },
			'collision': { status: false, count:0, effect_insts: [] },			
		}
		*/
		this.events = {
			'touchDown': { name:'touchDown', status: false, count:0, effect_insts: [] },
			'touchUp': { name:'touchUp', status: false, count:0, effect_insts: [] },
			'tap': { name:'tap', status: false, count:0, effect_insts: [] },
			'doubleTap': { name:'doubleTap', status: false, count:0, effect_insts: [] },
			'fingerOnScreen': { name:'fingerOnScreen', status: false, count:0, effect_insts: [] },
			'hold': { name:'hold', status: false, count:0, effect_insts: [] },
			'drag': { name:'drag', status: false, count:0, effect_insts: [] },
			'idle': { name:'idle', status: false, count:0, effect_insts: [] },
		}
		
		this.interaction_info = null
		
		// update effect duration with event ref
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
					//console.log(this.event_effects[event].effects[i].duration)
					//console.log(event,i,event_target_name)
					this.event_effects[event].effects[i].duration = this.events[event_target_name]
					//console.log('A',this.event_effects[event].effects[i].duration === this.events[event_target_name])
					//console.log(this.event_effects[event].effects[i].duration)
					//this.events[event_target_name].status = true
					//console.log()
				}

			}
			
		}

		//if(this.event_effects['hold'] != null)
		//    console.log('B',this.event_effects['hold'].effects[0].duration === this.events['hold'])

		
		
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
				this.event_effects[key].effects)

			this.events[key].effect_insts.push( effect_inst	)
			body_effects.push(effect_inst)	
		
		}					

	}

	duplicate()
	{
		return new body(
			{	m : new Matrix2d(this.m), 
				shape_type: this.shape_type,
				color: this.color, 
				interaction:this.interaction})
	}

	isMoving()
	{

		let vDelta = this.m.get_row(2).getSub(this.last_m.get_row(2))
		return vDelta.mag() > 0.0001
	}


	update()
	{
		
		//if(this.events['hold'].status)
		//{
		//	console.log('-----')
		//	console.log(this.events['hold'])
		//	console.log(this.event_effects['hold'].effects[0].duration)
		//	console.log('C',this.event_effects['hold'].effects[0].duration === this.events['hold'])
		//}

		if( this.visibility == false )
			return false

		this.update_event_effects()
		
		
		let INTERACTION_COEF = 1.0
		let INTERACTION_PRIORITIZE_ROTATE_RESOLUTION = 1.0

		let DYN_FRICTION_TRANSLATE = 0.01
		let DYN_FRICTION_ROTATE = 0.01

		let DYN_ANGULAR_SPEED_LIMIT = 0.3
		let DYN_SPEED_LIMIT = 30

		let DO_AXE_CNS = false
		let DO_AXE_CNS_LIMIT = false

		let BORDER_COLLISION = true

		if( this.DYN )
		{
			//ADD DYN
			let p = this.m.get_row(2)
			let vMomentum = this.momentum.getMult(1-DYN_FRICTION_TRANSLATE)
		
			let pNext = p.getAdd(vMomentum)
			let aNext = this.angular_momentum*(1-DYN_FRICTION_ROTATE)
		
			this.m.setRow(2,pNext)
			this.m.rotate(aNext)
		}

		// add interaction
		if(this.interaction_info != null )
		{
			
			
			let pCenter = this.m.get_row(2)
			let pAttach_world = this.interaction_info.vAttach.getMult( this.m )
			let vAttach_world = pAttach_world.getSub(pCenter)
			let _mCurrent = new Matrix2d(this.m)
			
			// solve angle
			let vToMouse = this.interaction_info.pUser.getSub(pCenter)
			vToMouse.normalize()
			vAttach_world.normalize()
			let aDelta = vAttach_world.getRotation(vToMouse,false)
			_mCurrent.rotate(aDelta*INTERACTION_PRIORITIZE_ROTATE_RESOLUTION)

			// solve translate
			let pSelectionAttach_afterRotate = this.interaction_info.vAttach.getMult( _mCurrent )
			let vDelta = this.interaction_info.pUser.getSub(pSelectionAttach_afterRotate)
			
			// get force
			let aMouseAttract = aDelta*INTERACTION_PRIORITIZE_ROTATE_RESOLUTION*INTERACTION_COEF
			let vMouseAttract = vDelta.getMult(INTERACTION_COEF)

			
			//add to matrix
			this.m.setRow(2,this.m.get_row(2).getAdd(vMouseAttract))
			this.m.rotate(aMouseAttract)
		}
		
		if(DO_AXE_CNS)
		{

			let vAxeCns = new Vector2d(1,1)
			vAxeCns.normalize()
			let pAxeCns = new Vector2d(0,0)				
			// add axe constraint
			let pCurrent = this.m.get_row(2)

			let _v = pCurrent.getSub(pAxeCns)

			let _v_n = _v.getNormalized()
			let vAxeCn_n = vAxeCns.getNormalized()
			let dot = _v_n.dot(vAxeCn_n)

			let pProj = vAxeCns.getMult(_v.mag()*dot).getAdd(pAxeCns)
			
			this.m.setRow(2,pProj)

			if(DO_AXE_CNS_LIMIT)
			{
				pCurrent = this.m.get_row(2)
				// add axe limit
				let vAxeCenterToCurrent = pCurrent.getSub(pAxeCns)
				let _dot = vAxeCenterToCurrent.dot(vAxeCns)

				let LENGTH_MAX = 200
				let LENGTH_MIN = 50
				if( 0 < _dot )
				{
					let current_length = vAxeCenterToCurrent.mag()
					
					if( LENGTH_MAX < current_length )
					{
						let _v = vAxeCenterToCurrent.getNormalized().mult(LENGTH_MAX)
						pCurrent = pAxeCns.getAdd(_v)
					}
				}
				else
				{
					let current_length = vAxeCenterToCurrent.mag()
					if( LENGTH_MIN < current_length )
					{
						let _v = vAxeCenterToCurrent.getNormalized().mult(LENGTH_MIN)
						pCurrent = pAxeCns.getAdd(_v)
					}				
				}
				
				this.m.setRow(2,pCurrent)
			}
		
			
		}

		if( BORDER_COLLISION )
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
		let momentum_mag = Math.max(-DYN_SPEED_LIMIT,Math.min( DYN_SPEED_LIMIT, momentum.mag()))
		momentum.normalize()
		momentum.mult(momentum_mag)	
		this.momentum = momentum	

		let angular_momentum = this.m.getRotation() - this.last_m.getRotation()
		
		if( 3.14 < angular_momentum )
			angular_momentum -= 2*3.14
		if( angular_momentum < -3.14 )
			angular_momentum += 2*3.14	
		this.angular_momentum = angular_momentum	

		this.angular_momentum = Math.max(-DYN_ANGULAR_SPEED_LIMIT,
			Math.min( DYN_ANGULAR_SPEED_LIMIT, angular_momentum))
		
		this.last_m = new Matrix2d(this.m) // to keep track of the last position
	
		
	}

	draw()
	{
		if(this.visibility == false)
			return false

        ctx.save()
		ctx.beginPath()

		

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
		

		const drawFunction = this.drawFactory[this.shape_type];
		drawFunction(ctx,this.m);
       

		if( this.color != null)
			ctx.fill()

		if( this.stroke_color != null)
			ctx.stroke()

		ctx.resetTransform();	
        ctx.restore()	
		
		return true
	}

	isPointInside(point)
	{
		return this.isPointInsideFactory[this.shape_type](point, this.m);
	}

}
