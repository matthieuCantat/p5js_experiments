
import Vector2d from '../utils/vector2d.js';
import Matrix2d from '../utils/matrix2d.js';
import { User_interaction_info } from '../utils/interaction.js'
import { Constraints_info } from '../utils/constraint.js'
import { draw_bg, 
	draw_grid,
	draw_circle,
	daw_line, 
	body,
	COLORS,
	canvas,
	draw_background,
	get_randow_color} from '../utils/draw.js'
import { body_effects } from '../utils/shared.js';


var Objs = []
var User_interaction = new User_interaction_info();
var Constraints = new Constraints_info(User_interaction)


function setup()
{
	
	// SETUP OBJS
	let p = new Vector2d(0,200)
	let p_offset = new Vector2d(0,-100)
	let scale = new Vector2d(60,20)
	let interactions = [
		{attr:'tx',limit:[-100,100]},
		{attr:'ty',limit:[-400,0]},		
	]


	let event_effect = {
		'touchstart': [{ type:'particles_escape' }],
		'touchend': [{ type:'water_ripple' }],
		'touchmove': [{ type:'body_color_acid_rainbow' }],
		'touchidle': [{ type:'particles_effervescent' }],
		'idle': [{ type:'particles_new' }],
		'selectedidle': [{ type:'glow'}],
		'collision': [{ type:'particles_radial_strokes' }],
	}



	for( let i = 0; i < interactions.length; i++)
	{
		let color_index = Math.floor(Math.random() * COLORS.length);

		let obj = new body( 
			{ m : new Matrix2d(p, 0, scale), 
			  color: COLORS[color_index], 
			  interaction :interactions[i],
			  shape_type:'rectangle',
			  event_effects : event_effect } ) 

		Objs.push( obj )
		p.add(p_offset)
	}

	// SETUP INTERACTION
	User_interaction.set_interaction_objs(Objs)

	// SETUP CONSTRAINT
	/*
	let cns_data = [{ objs:[ Objs[0], Objs[1]], attrs:[ 'r' , 'r'], mult: 2    },
					{ objs:[ Objs[0], Objs[2]], attrs:[ 'r' , 'r'], mult:-3    },
					{ objs:[ Objs[3], Objs[4]], attrs:[ 'ty', 'r'], mult:-0.01 }	]
	Constraints.setup( cns_data )
	*/
	

	draw_bg('white')
	draw_grid()
}

var created_obj = null
var p = null

function update()
{		
	//	INTERACTION
	User_interaction.update()

	update_events_info( User_interaction, Objs )

	for( let elem of Objs )
		elem.update()
	
	for( let elem of body_effects )
		elem.update()
	
	Constraints.update()
	
}	


function update_events_info( Inter, Objs )
{
	//console.log('dowm',Inter.touch_down, 'move',Inter.touch_move, 'up',Inter.touch_up)
	//if( Inter.isPressed )
	//	console.log('isPressed')
	//else
	//	console.log('nothing pressed')
	//console.log('isPressed',Inter.isPressed, 'isInteracting',Inter.isInteracting)
	for( let obj of Objs )
	{
		if(Inter.selection_info.obj == obj)
		{
			obj.events.touchstart.status = false
			if( Inter.isPressed )
				obj.events.touchstart.status = true
			
			if( Inter.isReleased )
				obj.events.touchend.status = true
			if( Inter.isInteracting )
			{
				if (obj.isMoving())
					obj.events.touchmove.status = true	
				else
					obj.events.touchmove.status = false	
			}

		}
		else
		{
			obj.events.touchstart.status = false
			obj.events.touchend.status = false
			obj.events.touchmove.status = false
			obj.events.touchidle.status = false
			obj.events.idle.status = false
			obj.events.selectedidle.status = false
			obj.events.collision.status = false
		}

	}
	return true
}

var draw_count = 0;
function draw() {


	draw_background()

	for( let elem of body_effects )
		elem.draw_background()
	
	for( let elem of Objs )
		elem.draw()
	
	for( let elem of body_effects )
		elem.draw_foreground()

	User_interaction.draw()

	draw_count += 1
}

function game_loop()
{
	update()
	draw()
	requestAnimationFrame(game_loop);
}




// Attach event listeners when the document is fully loaded
window.onload = function() {
	User_interaction.interactionEvent_addToListener(canvas)   
}
////////////////////////////////////////////////// mouse pressed


setup();
game_loop();	





// Disable pull-to-refresh using JavaScript

function disable_pull_to_refresh(event)
{
    //const canvas = document.getElementById("three_canvas");
    //const menu = document.getElementById("debug_menu");
    //const debug_menu_is_open = menu.style.display === "block";
    //if( debug_menu_is_open)
    //{
    //    //console.log('debug_menu_is_open')
    //    return false
    //}

    // Disable pull-to-refresh
    //console.log('debug_menu_is_close')
    event.preventDefault();
    return true
}
//const canvas = document.getElementById("three_canvas");
canvas.addEventListener('touchmove', disable_pull_to_refresh, { passive: false } );


