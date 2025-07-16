
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
	User_interaction.get_selected_obj()
	User_interaction.handle_interaction_with_selected_obj()

	let create_mode =
    User_interaction.something_is_selected == false &&
    User_interaction.isInteracting &&
    created_obj === null;

	let edit_scale_mode =
    User_interaction.something_is_selected == false &&
    User_interaction.isInteracting &&
    created_obj !== null;

	if( create_mode )
	{
		p = new Vector2d( User_interaction.p )
		let m = new Matrix2d(User_interaction.p,0,10)
		created_obj = new body( 
			{ m : m, 
			  color: get_randow_color(), 
			  interaction:{attr:'r'},
			  shape_type:'rectangle' } )
		Objs.push( created_obj )
	}
	else if(edit_scale_mode)
	{
		let vDelta = User_interaction.p.getSub(p)
		let sX = Math.abs(vDelta.x)+0.001
		let sY = Math.abs(vDelta.y)+0.001
		created_obj.m.setScale(sX,sY)
	}
	else
	{
		created_obj = null
	}

	
	for( let elem of body_effects )
		elem.update()
	
	Constraints.update()
	
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


