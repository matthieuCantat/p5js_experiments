import { draw_circle, daw_line, cX_inv, cY_inv} from './draw.js'
import Vector2d from './vector2d.js';
import Matrix2d from './matrix2d.js';


let draw_count = 0
////////////////////////////////////////////////// mouse pressed
// Declare the boolean value as a global variable
export class User_interaction_info
{
	LOG_LISTENERS = false
	BOT_MODE = false

	PRESSED_CIRCLE_SIZE = 10
	PRESSED_CIRCLE_SIZE_ANIM_START = 30


    constructor()
    {
		//
        this._isInteracting_last = null

		// INTERACTION
		this.isInteracting = false
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
		
    }

	interactionEvent_getPos(event, interaction_type, action )
	{
        if(this.LOG_LISTENERS)
			console.log('interactionEvent_hande', interaction_type, action)

		if( ( interaction_type == 'mouse')&&( action == 'move')&&(this.p == null))
			return

		let e = event
		if( interaction_type == 'touch')
			e = event.touches[0] || event.changedTouches[0]
		
		if( ( action == 'down')||( action == 'move') )
			this.p = this.get_input_coords_as_vector( e.clientX, e.clientY)
		else if( action == 'up')
			this.p = null	
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

		if( this.isInteracting )
		{
			if(( this.something_is_selected == false )&&(this.isPressed == true))
			{
						
				for( let obj of objs )
					obj.isSelected = false
					
				for( let i = objs.length -1 ; 0 <= i; i-- )
				{
					if( objs[i].isPointInside( this.p.x, 
														this.p.y) )
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
			obj.m.set_row(2,pCenter)
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
			obj.m.set_row(2,pCenter)		
        }
        else if( obj.interaction.attr == 't' )
		{
			obj.m.set_row(2,this.p)
		}		
        else if( obj.interaction.attr == 'button' )
		{
			//obj.m.set_row(2,Vector2d())
			console.log("do something")
		}        
    }

	update_states()
	{
		// is interacting
		if( this.p != null)
			this.isInteracting = true
		else
			this.isInteracting = false

		// others
		this.interactionChanged = false
		this.isPressed = false
		this.isReleased = false
		if( this.isInteracting != this._isInteracting_last)
		{
			this.interactionChanged = true
			if(this.isInteracting == true)
				this.isPressed = true
			else
				this.isReleased = true
		}
     
		// for next eval
		this._isInteracting_last = this.isInteracting
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
	}

	update()
	{
		if( this.BOT_MODE 	)
			this.override_pos()
		this.update_states()
		this.update_counters()
		this.update_coords()		
        draw_count += 1
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
						
						
					
						let col_min_top = pObjCenterInit.getAdd(interaction.limit[0]-vScale[0],1000)
						let col_min_dwn = pObjCenterInit.getAdd(interaction.limit[0]-vScale[0],-1000)	
						
						daw_line([col_min_dwn, col_min_top],
							'yellow',
							2,)

						let col_max_top = pObjCenterInit.getAdd(interaction.limit[1]+vScale[0],1000)
						let col_max_dwn = pObjCenterInit.getAdd(interaction.limit[1]+vScale[0],-1000)	
							
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
						
						
					
						let col_min_top = pObjCenterInit.getAdd(1000,interaction.limit[0]-vScale[1])
						let col_min_dwn = pObjCenterInit.getAdd(-1000,interaction.limit[0]-vScale[1])	
						
						daw_line([col_min_dwn, col_min_top],
							'yellow',
							2,)

						let col_max_top = pObjCenterInit.getAdd(1000,interaction.limit[1]+vScale[1])
						let col_max_dwn = pObjCenterInit.getAdd(-1000,interaction.limit[1]+vScale[1])	
							
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
					let animated_scale = [
						current_scale[0] + 5*anim, 
						current_scale[1] + 5*anim]
					Shape.m.setScale(animated_scale[0], animated_scale[1] )
					Shape.draw()
					
				}					
				else if(interaction.attr == 'button_first_press')
				{
					let Shape = this.selection_info.obj.duplicate()
					//Shape.color = null
					let current_scale = Shape.m.getScale()

					let duration = 100
					let speed = 10
					let anim = this.isInteractingCount*speed
					let animated_scale = [
						current_scale[0] + anim, 
						current_scale[1] + anim]					
					Shape.m.setScale(animated_scale[0], animated_scale[1])
					if( anim < duration )
						Shape.draw()
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
