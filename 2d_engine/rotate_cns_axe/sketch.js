
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
	let p = new Vector2d(-170,200)
	let p_offset = new Vector2d(0,-50)
	let scale = new Vector2d(20,20)


	let settings_list = [
		{
			'title':'rigid short grab - no dyn',
			'inter':{
				'enable':true,
				'coef':1.0,
				'rotate_resolution_priority':0.0,
			},
			'dyn':{
				'enable':false,
			},
		},
		{
			'title':'rigid long grab - no dyn',
			'inter':{
				'enable':true,
				'coef':1.0,
				'rotate_resolution_priority':0.0,
				'radius_threshold':100,
			},
			'dyn':{
				'enable':false,
			},
		},		
		{
			'title':'elastic short grab - no dyn',
			'inter':{
				'enable':true,
				'coef':0.05,
				'rotate_resolution_priority':0.0,
			},
			'dyn':{
				'enable':false,
			},
		},
		{
			'title':'elastic long grab - no dyn',
			'inter':{
				'enable':true,
				'coef':0.05,
				'rotate_resolution_priority':0.0,
				'radius_threshold':100,
			},
			'dyn':{
				'enable':false,
			},
		},		
		{		
			'title':'rigid short grab - dyn',
			'inter':{
				'enable':true,
				'coef':1.0,
				'rotate_resolution_priority':0.0,
			},
			'dyn':{
				'enable':true,
				'mass':1,
				'friction_translate':0.0001,
				'friction_rotate':1.0,
				'speed_limit_translate': 30,
				'speed_limit_rotate':0.3,				
			},
		},
		{
			'title':'rigid long grab - dyn',
			'inter':{
				'enable':true,
				'coef':1.0,
				'rotate_resolution_priority':0.0,
				'radius_threshold':100,
			},
			'dyn':{
				'enable':true,
				'mass':1,
				'friction_translate':0.0001,
				'friction_rotate':1.0,
				'speed_limit_translate': 30,
				'speed_limit_rotate':0.3,
			},
		},		
		{
			'title':'elastic short grab - dyn',
			'inter':{
				'enable':true,
				'coef':0.05,
				'rotate_resolution_priority':0.0,
			},
			'dyn':{
				'enable':true,
				'mass':1,
				'friction_translate':0.0001,
				'friction_rotate':1.0,
				'speed_limit_translate': 30,
				'speed_limit_rotate':0.3,
			},
		},
		{
			'title':'elastic long grab - dyn',
			'inter':{
				'enable':true,
				'coef':0.05,
				'rotate_resolution_priority':0.0,
				'radius_threshold':100,
			},
			'dyn':{
				'enable':true,
				'mass':1,
				'friction_translate':0.0001,
				'friction_rotate':1.0,
				'speed_limit_translate': 30,
				'speed_limit_rotate':0.3,
			},
		},		
						  	  
	]

	
	let objs = []	

	let obj_rotate = new body( 
		{ m : new Matrix2d(new Vector2d(), 0, 150), 
		  color: 'red', 
		  shape_type:'circle_rot',

		  interaction_settings: {
			'enable':true,
			'coef':1,
			'rotate_resolution_priority':1.0,
			'radius_threshold':0,
			'do_translation':false,
		  },
		  dyn_settings: {
			'enable':true,
			'mass':1,
			'friction_translate':0.0001,
			'friction_rotate':0.01,
			'speed_limit_translate': 30,
			'speed_limit_rotate':0.3,
		  }

		} ) 

	objs.push( obj_rotate )

	let nbr = 10
	let aIncr = 3.14*2/10
	let aCurrent = 0
	for( let i = 0; i < settings_list.length; i++)
	{
		let color_index = Math.floor(Math.random() * COLORS.length);

		let p = new Vector2d(0,100)
		p.rotate(aCurrent)
		
		let v_axe = new Vector2d(Math.cos(aCurrent),Math.sin(aCurrent))
		let axe_cns_settings = {
				m_driver: obj_rotate.m,
				v_axe: p,
				enable:true,
				enable_limits:true,
				limit_max:300,
				limit_min:0,
			}

		let obj = new body( 
			{ m : new Matrix2d(p, aCurrent+3.14/2, scale), 
			  color: COLORS[color_index], 
			  shape_type:'rectangle',

			  //interaction_settings: settings_list[i].inter,
			  dyn_settings: {
				enable:true,
				enable_gravity:true,
				mass:0.3,
			  },

			  axe_cns_settings: axe_cns_settings
			} ) 

		
		objs.push( obj )
		
		aCurrent += aIncr
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


