
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
		}
		
		
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

			
			if((key == 'hold')&&( effect_inst_cleaned.length == 0))
				console.log('clean', key)
			
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

	save_last_m()
	{
		this.last_m = new Matrix2d(this.m) // to keep track of the last position
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
