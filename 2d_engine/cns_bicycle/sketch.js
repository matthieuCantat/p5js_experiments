
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


// BEFORE SETUP
var User_interaction = new User_interaction_info();
var Constraints = new Constraints_info(User_interaction)



// CUSTOM PART
function setup_objs()
{

	// SETUP OBJS
	let p = new Vector2d(-170,200)
	let p_offset = new Vector2d(0,-50)
	let scale = new Vector2d(70,20)

	let objs = []	

	let m_ground = new Matrix2d(new Vector2d(100,-70), 0, new Vector2d(50,320))
	let obj_ground = new body( 
		{ m : m_ground, 
		  color: 'yellow', 
		  shape_type:'rectangle',

		  interaction_settings: {
			'enable':true,
			'coef':0.01,
			'rotate_resolution_priority':0.0,
			'radius_threshold':0,
			'do_translation':true,
		  },
		  dyn_settings: {
			'enable':true,
			'mass':0,
			'friction_translate':0.0001,
			'friction_rotate':0.001,
			'speed_limit_translate': 30,
			'speed_limit_rotate':0.3,
		  },
		  axe_cns_settings :{
			m_driver: new Matrix2d(m_ground),
			v_axe: new Vector2d(0,1),
			rotation_constraint_axe:1,
			rotation_constraint_coef:1.0,
			enable:true,
			enable_limits:true,
			limit_max:600,
			limit_min:-600,
			dyn_bounce_coef:0.05,
		}		  

		} ) 

	objs.push( obj_ground )

	let m_bicycle = new Matrix2d(new Vector2d(-110,0), 0, new Vector2d(50,100))
	let obj_bicycle = new body( 
		{ m : m_bicycle, 
		  color: 'green', 
		  shape_type:'rectangle',

		  interaction_settings: {
			'enable':true,
			'coef':0.2,
			'rotate_resolution_priority':0.0,
			'radius_threshold':0,
			'do_translation':true,
		  },
		  dyn_settings: {
			'enable':true,
			'mass':0,
			'friction_translate':0.0001,
			'friction_rotate':0.001,
			'speed_limit_translate': 30,
			'speed_limit_rotate':0.3,
		  },
		  axe_cns_settings :{
			m_driver: new Matrix2d(m_bicycle),
			v_axe: new Vector2d(0,1),
			rotation_constraint_axe:1,
			rotation_constraint_coef:1.0,
			enable:true,
			enable_limits:true,
			limit_max:300,
			limit_min:-400,
			dyn_bounce_coef:0.5,
		}			  

		} ) 

	objs.push( obj_bicycle )

	let m_wheelA = new Matrix2d(new Vector2d(-10,100), 0, 60)
	let obj_wheelA = new body( 
		{ m : m_wheelA, 
		  color: 'blue', 
		  shape_type:'circle_rot',

		  interaction_settings: {
			'enable':true,
			'coef':0.01,
			'rotate_resolution_priority':1.0,
			'radius_threshold':0,
			'do_translation':true,
		  },
		  dyn_settings: {
			'enable':true,
			'mass':0,
			'friction_translate':0.0001,
			'friction_rotate':0.001,
			'speed_limit_translate': 30,
			'speed_limit_rotate':0.3,
		  },
		  axe_cns_settings :{
			m_driver: new Matrix2d(m_wheelA),
			v_axe: new Vector2d(0,1),
			rotation_constraint_axe:1,
			rotation_constraint_coef:0.0,
			enable:true,
			enable_limits:true,
			limit_max:300,
			limit_min:-400,
			//dyn_bounce_coef:0.05,
		}			  

		} ) 

	objs.push( obj_wheelA )


	let m_wheelB = new Matrix2d(new Vector2d(-10,-100), 0, 60)
	let obj_wheelB = new body( 
		{ m : m_wheelB, 
		  color: 'blue', 
		  shape_type:'circle_rot',

		  interaction_settings: {
			'enable':true,
			'coef':0.01,
			'rotate_resolution_priority':1.0,
			'radius_threshold':0,
			'do_translation':true,
		  },
		  dyn_settings: {
			'enable':true,
			'mass':0,
			'friction_translate':0.0001,
			'friction_rotate':0.001,
			'speed_limit_translate': 30,
			'speed_limit_rotate':0.3,
		  },
		  axe_cns_settings :{
			m_driver: new Matrix2d(m_wheelB),
			v_axe: new Vector2d(0,1),
			rotation_constraint_axe:1,
			rotation_constraint_coef:0.0,
			enable:true,
			enable_limits:true,
			limit_max:300,
			limit_min:-400,
			//dyn_bounce_coef:0.05,
		}			  

		} ) 

	objs.push( obj_wheelB )
	

	let m_gear_pedals = new Matrix2d(new Vector2d(-50,10), 0, 20)
	let obj_gear_pedals= new body( 
		{ m : m_gear_pedals, 
		  color: 'red', 
		  shape_type:'circle_rot',

		  interaction_settings: {
			'enable':true,
			'coef':0.01,
			'rotate_resolution_priority':1.0,
			'radius_threshold':0,
			'do_translation':true,
		  },
		  dyn_settings: {
			'enable':true,
			'mass':0,
			'friction_translate':0.0001,
			'friction_rotate':0.001,
			'speed_limit_translate': 30,
			'speed_limit_rotate':0.3,
		  },
		  axe_cns_settings :{
			m_driver: new Matrix2d(m_gear_pedals),
			v_axe: new Vector2d(0,1),
			rotation_constraint_axe:1,
			rotation_constraint_coef:0.0,
			enable:true,
			enable_limits:true,
			limit_max:300,
			limit_min:-400,
			//dyn_bounce_coef:0.05,
		}			  

		} ) 

	objs.push( obj_gear_pedals )
	// SETUP CONSTRAINT
	
	let cns_data = [
		{ objs:[ obj_bicycle, obj_wheelA, obj_wheelB,obj_gear_pedals], attrs:[ 'ty' , 'ty', 'ty','ty'], mult: 1    },
		{ objs:[ obj_bicycle, obj_wheelA, obj_wheelB], attrs:[ 'ty' , 'r', 'r'], mult: -0.02    },
		{ objs:[ obj_bicycle, obj_gear_pedals], attrs:[ 'ty', 'r'], mult: -0.01    },
	]
	Constraints.setup( cns_data )
		
	
	return objs
}




///////////////////////////////////////////////////
/////////////////////////////////////////////////// STRUCTURE
///////////////////////////////////////////////////


var Objs = setup_objs()


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


