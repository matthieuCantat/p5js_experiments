
import Vector2d from '../utils/vector2d.js';
import Matrix2d from '../utils/matrix2d.js';
import { User_interaction_info } from '../utils/interaction.js'
import { Constraints_info } from '../utils/constraint.js'
import { draw_bg, 
	draw_grid,
	draw_phone_dims,
	COLORS,
	canvas,
	draw_background} from '../utils/draw.js'
import { body_effects } from '../utils/shared.js';
import { body } from '../utils/body.js'

function setup_objs()
{

	// SETUP OBJS
	let p = new Vector2d(0,200)
	let p_offset = new Vector2d(0,-50)
	let scale = new Vector2d(100,20)


	let objs = []
	for( let i = 0; i < 1; i++)
	{
		let color_index = Math.floor(Math.random() * COLORS.length);

		let obj = new body( 
			{ m : new Matrix2d(p, 0, scale), 
			  color: COLORS[color_index], 
			  shape_type:'rectangle',

			  interaction_settings:{
				'enable':true,
				'coef':0.01,
				'rotate_resolution_priority':1.0,
				'radius_threshold':100,
			},

			  dyn_settings:{
				enable:true,
				enable_gravity:true,
				mass:0.3,
			  },

			  do_border_collision:true,

			  axe_cns_settings:{
					m_driver: new Matrix2d(p,-45),
					enable:false,
					enable_limits:true,
					limit_max:300,
					limit_min:0,
			  },

			} ) 

		
		objs.push( obj )
		p.add(p_offset)
	}

	return objs
}




///////////////////////////////////////////////////
/////////////////////////////////////////////////// STRUCTURE
///////////////////////////////////////////////////


var Objs = setup_objs()
var User_interaction = new User_interaction_info();
var Constraints = new Constraints_info(User_interaction)

function setup()
{
	// SETUP INTERACTION
	User_interaction.set_interaction_objs(Objs)
	// DRAW BG
	draw_bg('grey')
	draw_grid()
	draw_phone_dims()


}

function update()
{		
	//	INTERACTION
	User_interaction.update()
	User_interaction.update_objs_events_info( Objs )

	for( let elem of Objs )
		elem.update()
	
	for( let elem of body_effects )
		elem.update()
	
	Constraints.update()
	
}	

function draw() {

	draw_background()

	for( let elem of body_effects )
		elem.draw_background()
	
	for( let elem of Objs )
		elem.draw()
	
	for( let elem of body_effects )
		elem.draw_foreground()

	User_interaction.draw()
}

function game_loop()
{
	update()
	draw()
	requestAnimationFrame(game_loop);
}


///////////////////////////////////////////////////
/////////////////////////////////////////////////// EXEC
///////////////////////////////////////////////////


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
    event.preventDefault();
    return true
}
canvas.addEventListener('touchmove', disable_pull_to_refresh, { passive: false } );


