import { draw_circle, draw_line, cX_inv, cY_inv} from '../utils/draw.js'
import Vector2d from '../utils/vector2d.js';
import Matrix2d from '../utils/matrix2d.js';
import { body_effect } from './effect.js';
import { Logger } from './logger.js';

const logger = new Logger("user");

let draw_count = 0
////////////////////////////////////////////////// mouse pressed
// Declare the boolean value as a global variable
export class User
{
	static DEBUG = false
	static BOT_MODE = false

	static DRAW_DEFAULT = {
		circle_size : 10,
		circle_size_anim_start : 30,
	}


    constructor( Game_engine, Time )
    {
		logger.info(" User constructor")
		this.Game_engine = Game_engine
		this.Time = Time

		this.Observer = new Observer()
		this.State = new State()
		this.Counter =  new Counter()
		this.Coords = new Coords()
		this.Event = new Event()
		this.Selection = new Selection()     
    }

	setup()
	{
		logger.info("User setup")
        // SETUP WEB PAGE BEHAVIOR
        this.Game_engine.Canvas.addEventListener('touchmove', disable_pull_to_refresh, { passive: false } );			
        // SETUP INTERACTION LISTENERS
		this.Observer.setup( this.Game_engine.Canvas )
	}

	update()
	{
	
        if( this.Time.one_update_debug_time_passed )
            logger.info("update");

		let p = this.Observer.p
		if( User.BOT_MODE 	)
			p = get_fake_user_pos( draw_count , 0, 300, 0, 200 )

		this.State.update(this.Observer)
		this.Counter.update(this.State)
		this.Coords.update(p, this.State)
		this.Event.update(this.State, this.Coords)
		this.Selection.update(this.State, this.Coords, this.Game_engine)
		
		//user_move_selection( this.Selection, this.State, this.Coords )
				
        draw_count += 1
	}	

		
	draw()
	{

		let draw_queue = []

        if( this.Time.one_update_debug_time_passed )
            logger.info("draw");		
		
		let HELPER_START_POINT_LIFTIME = 50
		
		
		let draw_press_position = (0 < this.Counter.isInteracting < HELPER_START_POINT_LIFTIME )&&( this.Event.data.fingerOnScreen.status )
		if( draw_press_position )
		{	
			let start_size = User.DRAW_DEFAULT.circle_size_anim_start + User.DRAW_DEFAULT.circle_size
			let end_size = User.DRAW_DEFAULT.circle_size
			let shrink_speed = this.Counter.isInteracting*5
			let size_animated = Math.max( end_size, start_size - shrink_speed)

			draw_queue.push({
				shape_type : 'circle',  
				m : new Matrix2d().setTranslation(this.Coords.pPressed).setScale(size_animated), 
				color : 'red',
				stroke_color : 'black', 
				strokes_width : 5,            
			})
		}
		


		/*
		let draw_release_position = ( 0 < this.Counter.isNotInteracting < HELPER_START_POINT_LIFTIME )&&( this.State.isInteracting )
		if( draw_release_position )
		{
			let start_size = User.DRAW_DEFAULT.circle_size_anim_start + User.DRAW_DEFAULT.circle_size
			let end_size = User.DRAW_DEFAULT.circle_size
			let shrink_speed =this.Counter.isNotInteracting*5
			let size_animated = Math.max( end_size, start_size - shrink_speed)
			
			draw_queue.push({
				shape_type : 'circle',  
                m : new Matrix2d().setTranslation(this.Coords.pPressed).setScale(size_animated), 
                color : 'blue',
                stroke_color : 'black', 
				strokes_width : 5,            
            } )
			

		}
			*/
		
		if( this.Event.data.fingerOnScreen.status )
		{
			// CURRENT MOUSE PRESSED
						
			draw_queue.push({
				shape_type : 'circle',  
                m : new Matrix2d().setTranslation(this.Coords.p).setScale(10), 
                color : 'red',
                stroke_color : 'black', 
				strokes_width : 5,            
            } )

			
		
			/*
			// SELECTED OBJ SELECTION
			const selected_obj = this.Selection.get_selected_obj( this.Game_engine)
			if( selected_obj != null)
			{
				let m = selected_obj.m
				let m_init = selected_obj.m_init
				let v = selected_obj.interaction.vCenter_to_userFirstGrab_mLocal
				let interaction_type = selected_obj.interaction_settings.attr
				let interaction = selected_obj.interaction
				let pObjAttachInteraction = v.getMult(m)

				let pObjCenter = m.get_row(2)
				let pObjCenterInit = m_init.get_row(2)
				let vScale = m.getScale()

				


				if(interaction_type == 'r')
				{
		
					draw_queue.push({
						shape_type : 'circle',  
						m : new Matrix2d().setTranslation(pObjAttachInteraction).setScale(10), 
						color : 'yellow',
						stroke_color : 'black', 
						strokes_width : 5,            
					} )
									
					draw_queue.push({
						shape_type : 'circle',  
						m : new Matrix2d().setTranslation(pObjCenter).setScale(10), 
						color : 'yellow',
						stroke_color : 'black', 
						strokes_width : 5,            
					} )


					draw_queue.push({
						shape_type : 'line',
						points : [pObjAttachInteraction,pObjCenter] , 
						stroke_color : 'yellow', 
						lineWidth : 2 })
									
					draw_queue.push({
						shape_type : 'line',
						points : [pObjAttachInteraction,this.Coords.p] , 
						stroke_color : 'red', 
						lineWidth : 2 })						
			
				}
				else if(interaction_type == 'tx')
				{
			
					
					draw_queue.push({
						shape_type : 'circle',  
						m : new Matrix2d().setTranslation(pObjCenter).setScale(10), 
						color : 'yellow',
						stroke_color : 'black', 
						strokes_width : 5,            
					} )

					let pCenter_axeX_min = pObjCenterInit.getAdd(1000,0)
					let pCenter_axeX_max = pObjCenterInit.getAdd(-1000,0)						
					if( interaction.limit != null )
					{
						pCenter_axeX_min = pObjCenterInit.getAdd(interaction.limit[0],0)
						pCenter_axeX_max = pObjCenterInit.getAdd(interaction.limit[1],0)		
						
						
					
						let col_min_top = pObjCenterInit.getAdd(interaction.limit[0]-vScale.x,1000)
						let col_min_dwn = pObjCenterInit.getAdd(interaction.limit[0]-vScale.x,-1000)	
						

						draw_queue.push({
							shape_type : 'line',
							points : [col_min_dwn, col_min_top] , 
							stroke_color : 'yellow', 
							lineWidth : 2 })


						let col_max_top = pObjCenterInit.getAdd(interaction.limit[1]+vScale.x,1000)
						let col_max_dwn = pObjCenterInit.getAdd(interaction.limit[1]+vScale.x,-1000)	
						
						draw_queue.push({
							shape_type : 'line',
							points : [col_max_dwn, col_max_top] , 
							stroke_color : 'yellow', 
							lineWidth : 2 })

						
					}
			

					draw_queue.push({
						shape_type : 'line',
						points : [pCenter_axeX_min, pCenter_axeX_max] , 
						stroke_color : 'yellow', 
						lineWidth : 2 })

					draw_queue.push({
						shape_type : 'line',
						points : [pObjAttachInteraction, this.Coords.p] , 
						stroke_color : 'red', 
						lineWidth : 2 })

	
				}			
				else if(interaction_type == 'ty')
				{

					draw_queue.push({
						shape_type : 'circle',  
						m : new Matrix2d().setTranslation(pObjCenter).setScale(10), 
						color : 'yellow',
						stroke_color : 'black', 
						strokes_width : 5,            
					} )
		
						
					let pCenter_axeX_min = pObjCenter.getAdd(0,1000)
					let pCenter_axeX_max = pObjCenter.getAdd(0,-1000)
					if( interaction.limit != null )
					{
						pCenter_axeX_min = pObjCenterInit.getAdd(0,interaction.limit[0])
						pCenter_axeX_max = pObjCenterInit.getAdd(0,interaction.limit[1])		
						
						
					
						let col_min_top = pObjCenterInit.getAdd(1000,interaction.limit[0]-vScale.y)
						let col_min_dwn = pObjCenterInit.getAdd(-1000,interaction.limit[0]-vScale.y)	
						
						draw_queue.push({
							shape_type : 'line',
							points : [col_min_dwn, col_min_top] , 
							stroke_color : 'yellow', 
							lineWidth : 2 })
	

						let col_max_top = pObjCenterInit.getAdd(1000,interaction.limit[1]+vScale.y)
						let col_max_dwn = pObjCenterInit.getAdd(-1000,interaction.limit[1]+vScale.y)	

						draw_queue.push({
							shape_type : 'line',
							points : [col_max_dwn, col_max_top] , 
							stroke_color : 'yellow', 
							lineWidth : 2 })
							
						
					}		
					

					draw_queue.push({
						shape_type : 'line',
						points : [pCenter_axeX_min, pCenter_axeX_max] , 
						stroke_color : 'yellow', 
						lineWidth : 2 })

					draw_queue.push({
						shape_type : 'line',
						points : [pObjAttachInteraction, this.Coords.p] , 
						stroke_color : 'red', 
						lineWidth : 2 })

						
				}
				else if(interaction_type == 'tr')
				{

				}				
				else if(interaction_type == 'button_hold')
				{
					let Shape = selected_obj.obj.duplicate()
					//Shape.color = null
					let current_scale = Shape.m.getScale()

					let anim = Math.abs(Math.sin(this.Counter.isInteracting*0.1))
					let animated_scale = new Vector2d(
						current_scale.x + 5*anim, 
						current_scale.y + 5*anim)
					Shape.m.setScale(animated_scale )
					Shape.draw()
					
				}					
				else if(interaction_type == 'button_first_press')
				{
					console.log("button_first_press", selected_obj.obj)
					
					let effect_inst = new body_effect(
						selected_obj.obj,
						selected_obj.obj.effects,
						this.Time)
					this.Game_engine.body_effects.push(effect_inst)
				
					selected_obj.clear()
				}	
			}
				*/

			// TRAIL
			
			draw_queue.push({
				shape_type : 'line',  
                points : this.Coords.Trail.get(),
                stroke_color : 'purple',
				line_width : 5,            
            })
		
			

		}

		return draw_queue
	}




		
	objs_update_events_info( Game_engine )
	{
		let Objs = Game_engine.Objs
		// GET SELECTED OBJ

		// UPDATE EVENTS INFO
		
		var no_selection = true
		for( let n in Objs )
		{
			if( this.Selection.is_selected( Objs[n] ) )
			{
				Objs[n].Event.update_from_user(Game_engine)
				no_selection = false
			}
			
			Objs[n].Event.clear()
		}
		


		return true
	}

}


class Observer{

	constructor()
	{
		logger.info("Observer constructor")

		this.p = new Vector2d()
		//this.touching = false
		this.touch_down = false
		this.touch_move = false	
		
			
	}

	setup(doc)
	{
		logger.info("Observer setup")

		globalThis.window.onload = () => {this.setup_listeners(doc);}
	}

	setup_listeners(doc)
	{
		doc.addEventListener('mousedown',  (event) => {this.fill_from_event(event,'mouse','down')});
		doc.addEventListener('mouseup',    (event) => {this.fill_from_event(event,'mouse','up')});
		doc.addEventListener('mousemove',  (event) => {this.fill_from_event(event,'mouse','move')});
		doc.addEventListener('touchstart', (event) => {this.fill_from_event(event,'touch','down')});
		doc.addEventListener('touchend',   (event) => {this.fill_from_event(event,'touch','up')});
		doc.addEventListener('touchmove',  (event) => {this.fill_from_event(event,'touch','move')}); 
	}

	fill_from_event(event, interaction_type, action )
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
		{
			this.p = get_user_coords_from_event( e )
			//this.touching = true
		}
		else if( action == 'up')
		{
			//this.touching = false	
		}
			

		// get event
		this.touch_down = false
		if( action == 'down')
			this.touch_down	= true

		this.touch_move = false
		if( action == 'move')
			this.touch_move	= true	
					
    }	
}

class State{
	constructor()
	{
		this.isPressed = false
		this.isInteracting = false
		this.isInteracting_last = null
		this.isInteractingExtend = false
		this.isReleased = false
		this.interactionChanged = false
		this.touchDown_last = null
	}

	update( Observer )
	{
		// isPressed - must be one frame long
		if (Observer.touch_down == true)
		{
			if(this.touchDown_last == false)
				this.isPressed = true
			else
				this.isPressed = false
		}
		else
			this.isPressed = false


		// is interacting
		if( ( Observer.touch_down)||( Observer.touch_move))
			this.isInteracting = true
		else
			this.isInteracting = false

		
		// isReleased - must be one frame long
		if (this.isInteracting == false)
		{
			if(this.isInteracting_last == true)
				this.isReleased = true
			else
				this.isReleased = false
		}
		else
			this.isReleased = false
		
		
		
		this.isInteractingExtend = false
		if((this.isInteracting)||(this.isReleased))
			this.isInteractingExtend = true
		
		// others
		this.interactionChanged = false
		
		if( this.isInteracting != this.isInteracting_last)
			this.interactionChanged = true
		
		
		// for next eval
		this.isInteracting_last = this.isInteracting
		this.touchDown_last = Observer.touch_down
	}
}



class Counter{
	constructor()
	{
		this.isInteracting = 0
		this.isNotInteracting = 0	
	}

	update( State )
	{
		if(State.isInteracting)
		{
			this.isInteracting +=1
			this.isNotInteracting = 0
		}
		else
		{
			this.isInteracting = 0
			this.isNotInteracting += 1
		}		
	}
}

class Coords{

	static POINT_HISTORY_MAX_SIZE = 40

	constructor()
	{
		this.p = new Vector2d()
		this.pPressed = new Vector2d()
		this.pReleased = new Vector2d()
		this.p_last = new Vector2d()
		this.pPressed_last = new Vector2d()
		this.pReleased_last = new Vector2d()
		this.Trail = new trail_points( 200 )
		this.p_history = []
	}
	update(p, State)
	{	
		if( State.isInteracting)
			this.p.set( p )
		
		if( State.isPressed)
			this.pPressed.set( this.p )

		if(State.isReleased)
			this.pReleased.set( this.p_last )
			

		if(State.isInteracting)
		{
			this.Trail.add(this.p)
			//this.pReleased = null
		}
		else
		{
			this.Trail.clear()
			//this.pPressed = null
		}
			
		this.p_last.set( this.p )


		this.p_history.unshift(new Vector2d(this.p))
		if ( this.POINT_HISTORY_MAX_SIZE < this.p_history.length)
			this.p_history.pop(); // Remove the oldest if over size		
		
		
	}
}



class Event{

	static HISTORY_NBR = 40

	static THRESHOLD = {
		frame_nbr:{
			touch_up_fix : 30,
			tap : 7,
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

	constructor()
	{
		this.data = {
			// TOUCH
			touchDown : { status:false, count:0, history:[] },
			touchUp : { status:false, count:0, history:[] },
			fingerOnScreen : { status:false, count:0, history:[] }, // between touchDown and touchUp
			// TIMING AND DIRECTION
			tap : { status:false, count:0, history:[] }, 
			doubleTap : { status:false, count:0, history:[] }, 
			flick : { status:false, count:0, history:[] },  
			grab : { status:false, count:0, history:[] },
			release : { status:false, count:0, history:[] },
			swipeLeft : { status:false, count:0, history:[] },  
			swipeRight : { status:false, count:0, history:[] },  
			swipeUp : { status:false, count:0, history:[] },  
			swipeDown : { status:false, count:0, history:[] },  
			idle : { status:false, count:0, history:[] },   
			manipulate : { status:false, count:0, history:[] },
			// MANIPULATION DETAILS
			pause : { status:false, count:0, history:[] },//delete this  
			move : { status:false, count:0, history:[] },
			
		}

		
	}
		

	get_basic_interaction_event()
	{
		//console.log("get_basic_interaction_event")
		/////////////////////////////// INFO
		let FIRST_INTERVAL_MULT = 0

		let threshold = Event.THRESHOLD.frame_nbr.tap*4 + FIRST_INTERVAL_MULT
		threshold = Math.min( threshold, this.data.touchUp.history.length)
		threshold = Math.min( threshold, this.data.touchDown.history.length)	
	
		let touchDown_frames = []
		let touchUp_frames = []
		for( let i = 0 ; i < threshold ; i++)
		{
			if( this.data.touchDown.history[i] )
				touchDown_frames.push(i)
	
			if( this.data.touchUp.history[i] )
				touchUp_frames.push(i)
		}
	
		//console.log( touchDown_frames.length, touchUp_frames.length)
			
		//   tDn     tUp       tDn        tUp
		//    |-------|---------|---------|---------      (>
		//        10  |     10  |     10  |   10+
		//                                
		//     
		/////////////////////////////// DETECTION

		let nothing_detected = false
		if( (  touchDown_frames.length == 0 ) 
			&& (touchUp_frames.length == 0) )
		{
			nothing_detected = true
		}
		if( nothing_detected )
			return { grab : false , release : false , tap : false, doubleTap : false }


		

		var grab_detected = false
		if( (  touchDown_frames.length == 1 ) 
			&& (touchUp_frames.length == 0) )
		{
			if( Event.THRESHOLD.frame_nbr.tap + FIRST_INTERVAL_MULT < touchDown_frames[0] )
				grab_detected = true
	
		}
		if( grab_detected )
			return { grab : true , release : false , tap : false, doubleTap : false }





	
		var doubleTap_detected = false
		if( (touchDown_frames.length == 2 ) 
			&& (touchUp_frames.length == 2) )
		{
			let delta_btw_last_tap_and_now = touchUp_frames[0] 
			let last_tap_duration = touchDown_frames[0] - touchUp_frames[0]
			let first_tap_duration = touchDown_frames[1] - touchUp_frames[1]
			let delta_btw_taps = touchUp_frames[1] - touchDown_frames[0]
	
			if( (delta_btw_last_tap_and_now < Event.THRESHOLD.frame_nbr.tap + FIRST_INTERVAL_MULT ) 
				&& ( last_tap_duration < Event.THRESHOLD.frame_nbr.tap)
				&& ( first_tap_duration < Event.THRESHOLD.frame_nbr.tap )
				&& ( delta_btw_taps < Event.THRESHOLD.frame_nbr.tap ) )
				doubleTap_detected = true
		}
		if( doubleTap_detected )
		{
			this.data.touchDown.history = []
			this.data.touchUp.history  = []
			return { grab : false , release : false , tap : false, doubleTap : true }
		}


	
		var tap_detected = false
		if( (touchDown_frames.length == 1 ) 
			&& (touchUp_frames.length == 1) )
		{
			let delta_btw_last_tap_and_now = touchUp_frames[0] 
			let last_tap_duration = touchDown_frames[0] - touchUp_frames[0]
		
	
			if( (Event.THRESHOLD.frame_nbr.tap < delta_btw_last_tap_and_now   ) 
				&& ( last_tap_duration < Event.THRESHOLD.frame_nbr.tap)  )
				tap_detected = true
		}
		if( tap_detected )
			return { grab : false , release : false , tap : true, doubleTap : false }




		var release_detected = false
		if( ( touchDown_frames.length == 0 )
			&&( touchUp_frames.length == 1 ) )
		{
			if(  touchUp_frames[0] < Event.THRESHOLD.frame_nbr.tap *2 )
				release_detected = true
	
		}
		if( release_detected )
			return { grab : false , release : true , tap : false, doubleTap : false }


		return { grab : false , release : false , tap : false, doubleTap : false }
	}	


	update( State, Coords )
	{

		//////////////////////////////////////////////////////////////////////////////
		// TOUCH
		//////////////////////////////////////////////////////////////////////////////

		this.data.touchDown.status = State.isPressed
		this.data.touchUp.status = State.isReleased
		this.data.fingerOnScreen.status = State.isInteracting
		
		//fix touchUp
		let threshold = Math.min( Event.THRESHOLD.frame_nbr.touch_up_fix, this.data.touchDown.history.length)
		if( this.data.touchDown.status )
		{
			for( let i = 0 ; i < threshold ; i++)
			{
				if( this.data.touchUp.history[i] )
					break
				if( this.data.touchDown.history[i] )
					this.data.touchUp.status = true
			}
		}
		//fix fingerOnScreen
		threshold = Math.min( this.data.touchDown.history.length, this.data.touchUp.history.length)
		this.data.fingerOnScreen.status = false
		for( let i = 0 ; i < threshold ; i++)
		{
			if( this.data.touchUp.history[i] )
				break
			if( this.data.touchDown.history[i] )
			{
				this.data.fingerOnScreen.status = true
				break
			}
		}

		// fix coords
		if( this.data.fingerOnScreen.status == false )
		{
				Coords.p_history = [] // clear history on release
		}


		//////////////////////////////////////////////////////////////////////////////
		// TIME AND DIRECTION
		//////////////////////////////////////////////////////////////////////////////
		
			
		//   tDn     tUp       tDn        tUp
		//    |-------|---------|---------|      (>
		//        10  |     10  |     10  | 
		//                                
		//      
		
		let _info = this.get_basic_interaction_event()

		this.data.grab.status = _info['grab']
		this.data.release.status = _info['release']
		this.data.tap.status = _info['tap']
		this.data.doubleTap.status = _info['doubleTap']
		
		

		//manipulate
		this.data.manipulate.status = false
		threshold = Math.min( Event.THRESHOLD.frame_nbr.tap, this.data.fingerOnScreen.history.length)
		if( this.data.fingerOnScreen.status )
		{
			this.data.manipulate.status = true
			for( let i = 0 ; i < threshold ; i++)
			{
				if( this.data.fingerOnScreen.history[i] == false ) 
				{
					this.data.manipulate.status = false
					break
				}
			}
		}

		

		this.data.pause.status = false
		threshold = Math.min( Event.THRESHOLD.frame_nbr.pause, this.data.manipulate.history.length)
		if( this.data.manipulate.status )
		{
			this.data.pause.status = true
			for( let i = 0 ; i < threshold ; i++)
			{
				if( this.data.manipulate.history[i] == false ) 
				{
					this.data.pause.status = false
					break
				}
			}	
		}


		
		//move
		threshold =  Math.min( Event.THRESHOLD.frame_nbr.pause, Coords.p_history.length )

		let distance_total = 0
		let v_total = new Vector2d()
		for( let i = 1 ; i < threshold ; i++)
		{
			let p_new = Coords.p_history[i-1]
			let p_old = Coords.p_history[i]

			let v = p_new.getSub(p_old)
			let distance = v.mag()

			distance_total += distance
			v_total.add(v)
		}
		v_total.normalize()
		
		this.data.move.status = false
		if( this.data.manipulate.status )
		{
			this.data.move.status = Event.THRESHOLD.distance.move < distance_total
		}

		if( this.data.move.status )
		{
			this.data.pause.status = false
		}
		/*
		var obj_already_drag = false
		for( let drag_past of this.data.move.history )
		{
			if( drag_past )
			{
				obj_already_drag = true
				break
			}
		}

		if( this.data.pause.status && obj_already_drag )
		{
			this.data.pause.status = false
			this.data.pause.status = true
		}
		*/


		//flick
		this.data.flick.status = false
		if( this.data.tap.status )
		{
			
			if( Event.THRESHOLD.distance.flick < distance_total )
			{
				this.data.flick.status = true
				this.data.tap.status = false
			}
		}
		
		//
		this.data.swipeLeft.status = false
		this.data.swipeRight.status = false
		this.data.swipeUp.status = false
		this.data.swipeDown.status = false

		if( this.data.flick.status )
		{
			if( Event.THRESHOLD.dot.swipe < v_total.dot(Event.VECTORS.left) )
				this.data.swipeLeft.status = true
			if( Event.THRESHOLD.dot.swipe < v_total.dot(Event.VECTORS.right) )
				this.data.swipeRight.status = true
			if( Event.THRESHOLD.dot.swipe < v_total.dot(Event.VECTORS.up) )
				this.data.swipeUp.status = true
			if( Event.THRESHOLD.dot.swipe < v_total.dot(Event.VECTORS.down) )
				this.data.swipeDown.status = true
			
			
		}
		

			



		/////////////////////////////////////////////////////////////
		// HISTORY
		/////////////////////////////////////////////////////////////
		
		//this.add_to_history( )
		for (const key in this.data ) 
		{
			this.data[key].history.unshift(this.data[key].status)
			if ( this.HISTORY_NBR < this.data[key].history.length)
				this.data[key].history.pop(); // Remove the oldest if over size		
		}

		


		/////////////////////////////////////////////////////////////
		// IDLE
		/////////////////////////////////////////////////////////////

		
		// idle handle
		for (const key in this.data)
		{
			if( key == 'idle')
				continue
			if( this.data[key].status == true)
			{
				this.data.idle.count = 0
				this.data.idle.status = false
				break
			}	
		}
		

		

		if( Event.THRESHOLD.frame_nbr.idle < this.data.idle.count )
			this.data.idle.status = true

		this.data.idle.count += 1

		
		
	}


}


class Selection
{
	constructor()
	{
		this.obj = null
		this.obj_last_eval = null
	}

		
	is_selected( obj )
	{
		return ( ( this.obj == obj )||( this.obj_last_eval == obj ))
	}
	
	get_selectable_objs_names( Game_engine )
	{
		let selectable_objs_names = []
		for( let n in Game_engine.Objs )
		{
			if(Game_engine.Objs[n].interaction.settings.enable == false)
				continue
			selectable_objs_names.push(n)
		}
		return selectable_objs_names
	}


	update( State, Coords, Game_engine )
	{
		let selectable_objs_names = this.get_selectable_objs_names(Game_engine)		
		
		if( State.isInteracting == false )
		{			
			for( let n in Game_engine.Objs )
				Game_engine.Objs[n].interaction.vCenter_to_userFirstGrab_mLocal = null
			return false
		}
		
		if(State.isPressed)
		{
			for( let n of selectable_objs_names )
				Game_engine.Objs[n].cleanUserInteractionInfo()
				
			for( let n of selectable_objs_names.reverse() )
			{
				let isInteracting = Game_engine.Objs[n].setUserFirstInteractionInfo( Coords.p, Coords.pPressed )
				if( isInteracting )
					break	
			}
		}

		this.obj_last_eval = this.obj
		this.obj = this.get_selected_obj(Game_engine)

		return true
	}	

	get_selected_obj(Game_engine)
	{
		for( let n in Game_engine.Objs )
			if( Game_engine.Objs[n].interaction.vCenter_to_userFirstGrab_mLocal != null)
				return Game_engine.Objs[n]
		return null		
	}




}

/*

function user_move_selection( Selection, State, Coords )
{
	
	let obj = Selection.obj
	let vOffset = Selection.vOffset

	let something_is_selected = ( (Selection.active )&&(obj !== null))
	if( something_is_selected == false )
		return false

	obj.interaction.vCenter_to_userFirstGrab_mLocal = null

	let user_is_interacting = State.isInteracting
	if( user_is_interacting == false ) 
		return false

	let inter = obj.interaction.settings.attr
	let pMouse = Coords.p

	let pCenter = obj.m.get_row(2)
	let vCenter_to_userGrab = vOffset.getMult( obj.m, true )
	let pUserGrab = pCenter.getAdd( vCenter_to_userGrab )	
	
	if( inter == 'r' )
	{
		let vCenter_to_user = pMouse.getSub(pCenter)
		let angle_delta = vCenter_to_userGrab.getRotation(vCenter_to_user)
		obj.m.rotate(angle_delta)
	}
	else if( inter == 't' )
	{
		obj.m.setRow(2,pMouse)
	}			
	else if( inter == 'tx' )
	{
		let x_delta = pMouse.x - selected_v.x
		pCenter.x = x_delta

		if( obj.interaction.limit != null )
		{
			let _pInit = obj.m_init.get_row(2)
			let x_min = _pInit.x + obj.interaction.limit[0]
			let x_max = _pInit.x + obj.interaction.limit[1]
			pCenter.x = Math.min( x_max, Math.max( x_min, pCenter.x))
		}
		obj.m.setRow(2,pCenter)
	}
	else if( inter == 'ty' )
	{
		let y_delta = pMouse.y- selected_v.y
		pCenter.y = y_delta
		
		if( obj.interaction.settings.limit != null )
		{
			let pObj_init = obj.m_init.get_row(2)
			let y_min = pObj_init.y + obj.interaction.settings.limit[0]
			let y_max = pObj_init.y + obj.interaction.settings.limit[1]
			pCenter.y = Math.min( y_max, Math.max( y_min, pCenter.y))
		}	
		obj.m.setRow(2,pCenter)		
	}
	else if( inter == 'tr' )
	{
		obj.interaction.pUser = pMouse 
		obj.interaction.vAttach = vOffset 
	}	
	else if( inter == 'button' )
	{
		//obj.m.setRow(2,Vector2d())
		console.log("do something")
	} 	
	
}
*/

// Disable pull-to-refresh using JavaScript
function disable_pull_to_refresh(event)
{
    event.preventDefault();
    return true
}
	


function get_fake_user_pos( param, min_x, max_x, min_y, max_y)
{
	let sinD_0 = Math.sin(param*0.04)
	let activation = Math.abs(sinD_0) -0.1

	let p = null
	if( 0 < activation )
	{
		p = new Vector2d()
		p.set_random_continuous(param, min_x, max_x, min_y, max_y )			
	}
	
	return p
}

class trail_points
{
	constructor( nbr_max )
	{
		this.points = []
		for( let i = 0; i < nbr_max; i++)
			this.points.push(null)
	}

	clear()
	{
		for( let i = 0; i < this.points.length; i++)
			this.points[i] = null
	}	
	
	add( p )
	{
		for( let i = this.points.length-1; 0 < i; i--)
			this.points[i] = this.points[i-1]
		this.points[0] = p
	}

	get()
	{
		// TRAIL
		let points = []
		for( let i = 0; i < this.points.length; i++)
		{
			if( this.points[i] == null)
				break
			points.push(this.points[i])
		}
		return points
	}

	
}

	
function get_user_coords_from_event( event )
{
	return new Vector2d( cX_inv( { x : event.clientX} ), cY_inv( { y : event.clientY} ) )
}
