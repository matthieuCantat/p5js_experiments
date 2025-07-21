import { draw_circle, daw_line, cX_inv, cY_inv} from './draw.js'
import Vector2d from './vector2d.js';
import Matrix2d from './matrix2d.js';
import { body_effects } from './shared.js';
import { body_effect } from './effect.js';

let draw_count = 0
////////////////////////////////////////////////// mouse pressed
// Declare the boolean value as a global variable
export class User_interaction_info
{
	DEBUG = false
	BOT_MODE = false

	PRESSED_CIRCLE_SIZE = 10
	PRESSED_CIRCLE_SIZE_ANIM_START = 30

	EVENT_HISTORY_SIZE = 40
	POINT_HISTORY_SIZE = 40

	FIX_TOUCHUP_FRAME_NBR_THRESHOLD = 30

	EVENT_TAP_FRAME_NBR_THRESHOLD = 30
	EVENT_HOLD_FRAME_NBR_THRESHOLD = 40
	EVENT_HOLD_DISTANCE_THRESHOLD = 0.01
	EVENT_DRAG_FRAME_NBR_THRESHOLD = 4
	EVENT_DRAG_DISTANCE_THRESHOLD = 0.01

	

    constructor()
    {
		//
        this._isInteracting_last = null



		this.touch_down = false
		this.touch_move = false
		this.touch_up = false

		// INTERACTION
		this.isInteracting = false
		this.isInteractingExtend = false
		this.isPressed = false
		this.isReleased = false
		this.interactionChanged = false
		this.isInteractingCount = 0
		this.isNotInteractingCount = 0

		this.p = null
		this.p_last = null
		this.pReleased = null
		this.pPressed = null

		this.trailPoints = []
		this.trailPoints_nbrMax = 200
		for( let i = 0; i < this.trailPoints_nbrMax; i++)
			this.trailPoints.push(null)

		// OBJ TO INTERACT
		this.something_is_selected = false
		this.selection_info = { obj : null , vOffset : null }
        this.interaction_objs = []

		this.events = {
			'touchDown':{status:false,count:0}, 
			'touchUp':{status:false,count:0},  
			'tap':{status:false,count:0}, 
			'doubleTap':{status:false,count:0}, 
			'fingerOnScreen':{status:false,count:0},
			'hold':{status:false,count:0}, 
			'drag':{status:false,count:0}, 
			'swipe':{status:false,count:0}, 
			'swipeLeft':{status:false,count:0}, 
			'swipeRight':{status:false,count:0}, 
			'swipeUp':{status:false,count:0}, 
			'swipeDown':{status:false,count:0}, 
			'flick':{status:false,count:0}, 
		}

		
		this.events_history = {}
		for( let event in this.events )
			this.events_history[event] = []
		this.p_history = []

		// UTILS
		this._touch_down_last = false
		this._isInteracting_last = false
		
    }

	interactionEvent_getPos(event, interaction_type, action )
	{
		// skip on computer if mouse move without interaction
		let mouse_move = (( interaction_type == 'mouse')&&( action == 'move'))
		let mouse_move_across_screen_without_interaction = (( mouse_move)&&(this.p == null))
		if( mouse_move_across_screen_without_interaction )
			return
			
		// get event 
		let e = event
		if( interaction_type == 'touch')
			e = event.touches[0] || event.changedTouches[0]
		
		// store position
		if( ( action == 'down')||( action == 'move') )
			this.p = this.get_input_coords_as_vector( e.clientX, e.clientY)
		else if( action == 'up')
			this.p = null	

		// get event
		this.touch_down = false
		this.touch_move = false
		this.touch_up = false
		if( action == 'down')
			this.touch_down	= true
		if( action == 'move')
			this.touch_move	= true	
		if( action == 'up')
			this.touch_up	= true			
    }
    
	// LISTENERS
	interactionEvent_addToListener(doc)
	{
		doc.addEventListener('mousedown',  (event) => {this.interactionEvent_getPos(event,'mouse','down')});
		doc.addEventListener('mouseup',    (event) => {this.interactionEvent_getPos(event,'mouse','up')});
		doc.addEventListener('mousemove',  (event) => {this.interactionEvent_getPos(event,'mouse','move')});
		doc.addEventListener('touchstart', (event) => {this.interactionEvent_getPos(event,'touch','down')});
		doc.addEventListener('touchend',   (event) => {this.interactionEvent_getPos(event,'touch','up')});
		doc.addEventListener('touchmove',  (event) => {this.interactionEvent_getPos(event,'touch','move')}); 
	}

	override_pos()
	{
		let sinA_0 = Math.sin(draw_count*0.01)
		let sinA_1 = Math.sin(draw_count*0.01+1)
		let sinB_0 = Math.sin(draw_count*0.02)
		let sinB_1 = Math.sin(draw_count*0.02+1)
		let sinC_0 = Math.sin(draw_count*0.03)
		let sinC_1 = Math.sin(draw_count*0.03+1)
		let sinD_0 = Math.sin(draw_count*0.04)
		let sinD_1 = Math.sin(draw_count*0.04+1)


		let pSin = {	
			x:sinA_1*300*sinB_1,
			y:sinC_0*200*sinD_1
		}

		let activation = Math.abs(sinD_0) -0.1
        

		this.p = new Vector2d(pSin.x,pSin.y)
		if( activation < 0 )
			this.p = null
	}

	trail_clear()
	{
		this.trailPoints = []
		for( let i = 0; i < this.trailPoints_nbrMax; i++)
			this.trailPoints.push(null)
	}	
	
	trail_add(p)
	{
		for( let i = this.trailPoints_nbrMax-1; 0 < i; i--)
			this.trailPoints[i] = this.trailPoints[i-1]
		this.trailPoints[0] = p
	}

	get_input_coords_as_vector(x,y)
	{
		return new Vector2d( cX_inv( { x : x} ), cY_inv( { y : y} ) )
	}



	add_selection_info(obj)
	{
		this.selection_info.obj = obj
		this.selection_info.vOffset = this.pPressed.getMult( obj.m.getInverse())
	}

	clear_selection_info()
	{
		this.selection_info.obj = null
		this.selection_info.vOffset = null
	}

    set_interaction_objs(objs)
    {
        this.interaction_objs = objs
    }

	get_selected_obj()
	{
        let objs = this.interaction_objs

		if( this.isInteractingExtend)
		{
			if(( this.something_is_selected == false )&&(this.isPressed == true))
			{
						
				for( let obj of objs )
					obj.isSelected = false
					
				for( let i = objs.length -1 ; 0 <= i; i-- )
				{
					if( objs[i].isPointInside( this.p ))
					{
						objs[i].isSelected = true
						this.something_is_selected = true
						this.add_selection_info(objs[i])
						break
					}
				}
			}
		}
		else
		{
			this.something_is_selected = false
			this.clear_selection_info()
			for( let obj of objs )
				obj.isSelected = false		
		}		
	}


    handle_interaction_with_selected_obj()
    {
		

        let do_handle_interaction = ( ( this.something_is_selected )&&( this.isInteracting ))

        if( do_handle_interaction == false) 
            return false

        let obj = this.selection_info.obj;
		if( obj == null )
			return false

		this.selection_info.obj.save_last_m()


        let vOffset = this.selection_info.vOffset;

        let pCenter = obj.m.get_row(2)
        let pSelection_init = vOffset.getMult( obj.m )
        let vCenterSelection = pSelection_init.getSub(pCenter)        
        
        if( obj.interaction.attr == 'r' )
        {
            let vCenterCurrent = this.p.getSub(pCenter)
            let angle_delta = vCenterSelection.getRotation(vCenterCurrent)
            
            let rObj = obj.m.getRotation()
            let rObjNew = rObj + angle_delta
            obj.m.setRotation(rObjNew)
        }
        else if( obj.interaction.attr == 'tx' )
        {
            let x_delta = this.p.x - vCenterSelection.x
            pCenter.x = x_delta

			if( obj.interaction.limit != null )
			{
				let pObj_init = obj.m_init.get_row(2)
				let x_min = pObj_init.x + obj.interaction.limit[0]
				if ( pCenter.x < x_min)
					pCenter.x = x_min
				let x_max = pObj_init.x + obj.interaction.limit[1]
				if ( x_max < pCenter.x )
					pCenter.x = x_max
			}
			obj.m.setRow(2,pCenter)
        }
        else if( obj.interaction.attr == 'ty' )
        {
            let y_delta = this.p.y- vCenterSelection.y
            pCenter.y = y_delta
            
			if( obj.interaction.limit != null )
			{
				let pObj_init = obj.m_init.get_row(2)
				let y_min = pObj_init.y + obj.interaction.limit[0]
				if ( pCenter.y < y_min)
					pCenter.y = y_min
				let y_max = pObj_init.y + obj.interaction.limit[1]
				if ( y_max < pCenter.y )
					pCenter.y = y_max
			}	
			obj.m.setRow(2,pCenter)		
        }
        else if( obj.interaction.attr == 't' )
		{
			obj.m.setRow(2,this.p)
		}		
        else if( obj.interaction.attr == 'button' )
		{
			//obj.m.setRow(2,Vector2d())
			console.log("do something")
		}        
    }

	update_states()
	{
		// isPressed - must be one frame long
		if (this.touch_down == true)
		{
			if(this._touch_down_last == false)
				this.isPressed = true
			else
				this.isPressed = false
		}
		else
			this.isPressed = false


		// is interacting
		if( ( this.touch_down)||( this.touch_move))
			this.isInteracting = true
		else
			this.isInteracting = false

		
		// isReleased - must be one frame long
		if (this.isInteracting == false)
		{
			if(this._isInteracting_last == true)
				this.isReleased = true
			else
				this.isReleased = false
		}
		else
			this.isReleased = false
		//console.log('isInteracting',this.isInteracting,'isReleased',this.isReleased)
		
		this.isInteractingExtend = false
		if((this.isInteracting)||(this.isReleased))
			this.isInteractingExtend = true
		
		// others
		this.interactionChanged = false
		
		if( this.isInteracting != this._isInteracting_last)
		{
			this.interactionChanged = true
		}
     
		// for next eval
		this._isInteracting_last = this.isInteracting
		this._touch_down_last = this.touch_down
	}

	update_counters()
	{
		if(this.isInteracting)
		{
			this.isInteractingCount +=1
			this.isNotInteractingCount = 0
		}
		else
		{
			this.isInteractingCount = 0
			this.isNotInteractingCount += 1
		}
	}

	update_coords()
	{
		if( this.isPressed)
			this.pPressed = this.p

		if(this.isReleased)
			this.pReleased = this.p_last
			

		if(this.isInteracting)
		{
			this.trail_add(this.p)
			this.pReleased = null
		}
		else
		{
			this.trail_clear()
			this.pPressed = null
		}
			
		this.p_last = this.p
		this.p_history.unshift(this.p)
		if ( this.POINT_HISTORY_SIZE < this.p_history.length)
			this.p_history.pop(); // Remove the oldest if over size		
	}
	
	update_events()
	{
		this.events.touchDown.status = this.isPressed
		this.events.touchUp.status = this.isReleased
		this.events.fingerOnScreen.status = this.isInteracting
		
		//fix touchUp
		if( this.events.touchDown.status === true )
		{
			let history_is_valid_size = (this.FIX_TOUCHUP_FRAME_NBR_THRESHOLD <= this.events_history.touchDown.length )
			if(history_is_valid_size === true)
			{
				for( let i = 0 ; i < this.FIX_TOUCHUP_FRAME_NBR_THRESHOLD ; i++)
				{

					if( this.events_history.touchUp[i] == true )
						break
					if( this.events_history.touchDown[i] == true )
						this.events.touchUp.status = true
				}
			}
		}

		//Tap
		this.events.tap.status = false	
		if( this.events.touchUp.status === true )
		{
			let history_is_valid_size = (this.EVENT_TAP_FRAME_NBR_THRESHOLD <= this.events_history.touchDown.length )
			if(history_is_valid_size === true)
			{
				for( let i = 0 ; i < this.EVENT_TAP_FRAME_NBR_THRESHOLD ; i++)
				{
					if( this.events_history.touchDown[i] === true )
					{
						this.events.tap.status = true
						break
					}
				}
			}
		}
		// doubleTap
		this.events.doubleTap.status = false	
		if( this.events.tap.status === true )
		{
			let history_is_valid_size = (this.EVENT_TAP_FRAME_NBR_THRESHOLD <= this.events_history.tap.length )
			if(history_is_valid_size === true)
			{
				for( let i = 0 ; i < this.EVENT_TAP_FRAME_NBR_THRESHOLD ; i++)
				{
					if( this.events_history.tap[i] === true )
					{
						this.events.doubleTap.status = true
						break
					}
				}
			}
		}
			
		

		//hold
		this.events.hold.status = false
		if( this.isInteracting )
		{
			let history_is_valid_size = ( this.EVENT_HOLD_FRAME_NBR_THRESHOLD <= this.p_history.length )
			
			let history_contain_only_points = true
			if(history_is_valid_size === true)
			{
				for( let i = 0; i < this.EVENT_HOLD_FRAME_NBR_THRESHOLD; i++)
				{
					if( this.p_history[i] == null)
					{
						history_contain_only_points = false
						break
					}
				}
			}

			let each_points_delta_respect_threshold = true
			if( (history_is_valid_size === true) && (history_contain_only_points === true) )
			{
				for( let i = 1; i < this.EVENT_HOLD_FRAME_NBR_THRESHOLD; i++)
				{
					let distance = this.p_history[i].getSub(this.p_history[i-1]).mag()
					if(  this.EVENT_HOLD_DISTANCE_THRESHOLD < distance)
					{
						each_points_delta_respect_threshold = false
						break
					}
				}
			}

			if( (history_is_valid_size === true) 
				&& (history_contain_only_points === true) 
				&& (each_points_delta_respect_threshold === true) )
				this.events.hold.status = true
		}

		
		//drag
		this.events.drag.status = false
		if( this.isInteracting )
		{
			let history_is_valid_size = ( this.EVENT_DRAG_FRAME_NBR_THRESHOLD <= this.p_history.length )
			
			let history_contain_only_points = true
			if(history_is_valid_size === true)
			{
				for( let i = 0; i < this.EVENT_DRAG_FRAME_NBR_THRESHOLD; i++)
				{
					if( this.p_history[i] === null)
					{
						history_contain_only_points = false
						break
					}
				}
			}

			let each_points_delta_respect_threshold = true
			if( (history_is_valid_size === true) && (history_contain_only_points === true) )
			{
				for( let i = 1; i < this.EVENT_DRAG_FRAME_NBR_THRESHOLD; i++)
				{
					let distance = this.p_history[i].getSub(this.p_history[i-1]).mag()
					if( distance < this.EVENT_DRAG_DISTANCE_THRESHOLD)
					{
						each_points_delta_respect_threshold = false
						break
					}
				}
			}

			if( (history_is_valid_size === true) 
				&& (history_contain_only_points === true) 
				&& (each_points_delta_respect_threshold === true) )
				this.events.drag.status = true
		}
	
		//
		this.events.swipe.status = false
		this.events.swipeLeft.status = false
		this.events.swipeRight.status = false
		this.events.swipeUp.status = false
		this.events.swipeDown.status = false
		this.events.flick.status = false


		for( let eventType in this.events)
		{
			this.events_history[eventType].unshift(this.events[eventType].status)
			if ( this.EVENT_HISTORY_SIZE < this.events_history[eventType].length)
				this.events_history[eventType].pop(); // Remove the oldest if over size
		}
	}

		
	update_objs_events_info( Objs )
	{
		for( let obj of Objs )
		{
			if(this.selection_info.obj == obj)
			{
				for(let event in obj.events)
					obj.events[event].status = this.events[event].status
			}
			else
			{
				for(let event in obj.events)
					obj.events[event].status = false
			}
		}
		return true
	}

	update()
	{
		if( this.BOT_MODE 	)
			this.override_pos()
		this.update_states()
		this.update_counters()
		this.update_coords()
		this.update_events()

		this.get_selected_obj()
		this.handle_interaction_with_selected_obj()				
        draw_count += 1

		//console.log('----',draw_count)
		//console.log('----',this.events_history.touchDown)//draw_count)
		if(this.DEBUG === true)
			for( let n in this.events )
				if(this.events[n].status)
					console.log(draw_count,n)
		
	}	
		

	draw()
	{
		
		/*
		if( true )
		{
			console.log('==============================')
			console.log('isInteracting',this.isInteracting)
			//console.log('isInteracting_last',this._isInteracting_last)
			console.log('interactionChanged',this.interactionChanged)
			console.log('isPressed',this.isPressed)
			console.log('isReleased',this.isReleased)
		}
		*/
		
		
		
		if((0<this.isInteractingCount)&&(this.isInteractingCount<50)&&(this.pPressed!= null))
		{	
			let start_size = this.PRESSED_CIRCLE_SIZE_ANIM_START + this.PRESSED_CIRCLE_SIZE
			let end_size = this.PRESSED_CIRCLE_SIZE
			let shrink_speed =this.isInteractingCount*5
			let size_animated = Math.max( end_size, start_size - shrink_speed)

			draw_circle( this.pPressed,
				size_animated,
				'red',
				'back',
				5)


		}
		
		if((this.isNotInteractingCount)&&(this.isNotInteractingCount<50)&&(this.pReleased!= null))
		{
			let start_size = this.PRESSED_CIRCLE_SIZE_ANIM_START + this.PRESSED_CIRCLE_SIZE
			let end_size = this.PRESSED_CIRCLE_SIZE
			let shrink_speed =this.isNotInteractingCount*5
			let size_animated = Math.max( end_size, start_size - shrink_speed)
						
			draw_circle( this.pReleased,
				size_animated,
				'blue',
				'back',
				5)		

		}

		if( this.isInteracting)
		{
			// CURRENT MOUSE PRESSED
			draw_circle( this.p,
						10,
						'red',
						'back',
						5)

			
			// SELECTED OBJ SELECTION
			if( this.selection_info.obj != null)
			{
				let m = this.selection_info.obj.m
				let m_init = this.selection_info.obj.m_init
				let v = this.selection_info.vOffset
				let interaction = this.selection_info.obj.interaction
				let pObjAttachInteraction = v.getMult(m)

				let pObjCenter = m.get_row(2)
				let pObjCenterInit = m_init.get_row(2)
				let vScale = m.getScale()

				if(interaction.attr == 'r')
				{
					draw_circle( pObjAttachInteraction,
						10,
						'yellow',
						'back',
						5)
	
					draw_circle( pObjCenter,
						10,
						'yellow',
						'back',
						5)				
						
					daw_line([pObjAttachInteraction,pObjCenter],
							'yellow',
							2,)
	
					daw_line([pObjAttachInteraction,this.p],
							'red',
							2,)			
				}
				else if(interaction.attr == 'tx')
				{
			
					draw_circle( pObjCenter,
						10,
						'yellow',
						'back',
						5)				
							
				
					let pCenter_axeX_min = pObjCenterInit.getAdd(1000,0)
					let pCenter_axeX_max = pObjCenterInit.getAdd(-1000,0)						
					if( interaction.limit != null )
					{
						pCenter_axeX_min = pObjCenterInit.getAdd(interaction.limit[0],0)
						pCenter_axeX_max = pObjCenterInit.getAdd(interaction.limit[1],0)		
						
						
					
						let col_min_top = pObjCenterInit.getAdd(interaction.limit[0]-vScale.x,1000)
						let col_min_dwn = pObjCenterInit.getAdd(interaction.limit[0]-vScale.x,-1000)	
						
						daw_line([col_min_dwn, col_min_top],
							'yellow',
							2,)

						let col_max_top = pObjCenterInit.getAdd(interaction.limit[1]+vScale.x,1000)
						let col_max_dwn = pObjCenterInit.getAdd(interaction.limit[1]+vScale.x,-1000)	
							
						daw_line([col_max_dwn, col_max_top],
							'yellow',
							2,)							
						
					}
			



					daw_line([pCenter_axeX_min, pCenter_axeX_max],
							'yellow',
							2,)
	
					daw_line([pObjAttachInteraction,this.p],
							'red',
							2,)		
				}			
				else if(interaction.attr == 'ty')
				{
			
					draw_circle( pObjCenter,
						10,
						'yellow',
						'back',
						5)				
						
					let pCenter_axeX_min = pObjCenter.getAdd(0,1000)
					let pCenter_axeX_max = pObjCenter.getAdd(0,-1000)
					if( interaction.limit != null )
					{
						pCenter_axeX_min = pObjCenterInit.getAdd(0,interaction.limit[0])
						pCenter_axeX_max = pObjCenterInit.getAdd(0,interaction.limit[1])		
						
						
					
						let col_min_top = pObjCenterInit.getAdd(1000,interaction.limit[0]-vScale.y)
						let col_min_dwn = pObjCenterInit.getAdd(-1000,interaction.limit[0]-vScale.y)	
						
						daw_line([col_min_dwn, col_min_top],
							'yellow',
							2,)

						let col_max_top = pObjCenterInit.getAdd(1000,interaction.limit[1]+vScale.y)
						let col_max_dwn = pObjCenterInit.getAdd(-1000,interaction.limit[1]+vScale.y)	
							
						daw_line([col_max_dwn, col_max_top],
							'yellow',
							2,)							
						
					}					
					daw_line([pCenter_axeX_min, pCenter_axeX_max],
							'yellow',
							2,)
	
					daw_line([pObjAttachInteraction,this.p],
							'red',
							2,)		
				}
				else if(interaction.attr == 'button_hold')
				{
					let Shape = this.selection_info.obj.duplicate()
					//Shape.color = null
					let current_scale = Shape.m.getScale()

					let anim = Math.abs(Math.sin(this.isInteractingCount*0.1))
					let animated_scale = new Vector2d(
						current_scale.x + 5*anim, 
						current_scale.y + 5*anim)
					Shape.m.setScale(animated_scale )
					Shape.draw()
					
				}					
				else if(interaction.attr == 'button_first_press')
				{
				
					let effect_inst = new body_effect(
						this.selection_info.obj,
						this.selection_info.obj.effect_name,)
					body_effects.push(effect_inst)
				
					this.clear_selection_info()
				}	
			}

			// TRAIL
			let points = []
			for( let i = 0; i < this.trailPoints_nbrMax; i++)
			{
				if( this.trailPoints[i] == null)
					break
				points.push(this.trailPoints[i])
			}
			
			daw_line(
				points,
				'purple',
				2,
			)
		}
	}
}

