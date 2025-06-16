import { draw_circle, daw_line, cX_inv, cY_inv} from './draw.js'
import Vector2d from './vector2d.js';
import Matrix2d from './matrix2d.js';


////////////////////////////////////////////////// mouse pressed
// Declare the boolean value as a global variable
export class User_interaction_info
{
	LOG_LISTENERS = false
	BOT_MODE = false
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
			x:sinA_1*600*sinB_1,
			y:sinC_0*400*sinD_1
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

	scan_for_selection(objs)
	{

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

	update_state()
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

	update_counter()
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
		this.update_state()
		this.update_counter()
		this.update_coords()		
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
			
			draw_circle( this.pPressed,
				Math.max( 30, 70 -this.isInteractingCount*5),
				'red',
				'back',
				5)


		}
		
		if((this.isNotInteractingCount)&&(this.isNotInteractingCount<50)&&(this.pReleased!= null))
		{
			draw_circle( this.pReleased,
				Math.max( 30, 70 -this.isNotInteractingCount*5),
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
				let v = this.selection_info.vOffset
				let p = v.getMult(m)
				draw_circle( p,
					10,
					'yellow',
					'back',
					5)

				let m_p = m.get_row(2)
				draw_circle( m_p,
					10,
					'yellow',
					'back',
					5)				
					
				daw_line([p,m_p],
						'yellow',
						2,)

				daw_line([p,this.p],
						'red',
						2,)						
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
