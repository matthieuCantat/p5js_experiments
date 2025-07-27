
import Vector2d from '../utils/vector2d.js';
import Matrix2d from '../utils/matrix2d.js';
import { User_interaction_info } from '../utils/interaction.js'
import { Constraints_info } from '../utils/constraint.js'
import { draw_bg, 
	draw_grid,
	COLORS,
	canvas,
	draw_background} from '../utils/draw.js'
import { body_effects } from '../utils/shared.js';
import { body } from '../utils/body.js'




function setup_objs()
{
	
	// SETUP OBJS
	let p = new Vector2d(0,200)
	let p_offset = new Vector2d(0,-100)
	let scale = new Vector2d(60,20)
	let settings = [
		{v_axe:new Vector2d(1,0),min:-150,max:150,rotation_constraint_axe:0},
		{v_axe:new Vector2d(0,1),min:-400,max:0,rotation_constraint_axe:1},
	]

	let event_effect = {
		'touchDown': { effects:[{ type:'particles_radial_strokes' }], isRepeatable:true},
		'touchUp': { effects:[{ type:'water_ripple'}], isRepeatable:true},
		'tap': { effects:[{ type:'particles_escape'}], isRepeatable:true},
		'doubleTap': { effects:[{ type:'disco_ripple'}], isRepeatable:true},
		'fingerOnScreen': null,
		'hold': { effects:[{ type:'particles_effervescent', duration:'hold' }], isRepeatable:false},
		'drag': { effects:[{ type:'body_color_acid_rainbow', duration:'drag'}], isRepeatable:false},
		'idle': { effects:[{ type:'particles_new', duration:'idle'}], isRepeatable:false},
		//'selectedidle': [{ type:'glow'}],
		//'collision': [{ type:'particles_radial_strokes' }],
	}
	
	let objs = []
	for( let i = 0; i < settings.length; i++)
	{
		let color_index = Math.floor(Math.random() * COLORS.length);
		let m = new Matrix2d(p, 0, scale)
		let obj = new body( { 
			m : m, 
			color: COLORS[color_index], 
			shape_type:'rectangle',

			interaction_settings: {
				'enable':true,
				'coef':1.,
				'rotate_resolution_priority':0.0,
				'radius_threshold':0,
				'do_translation':true,
			},

			axe_cns_settings : {
				m_driver: new Matrix2d(m),
				v_axe: settings[i]['v_axe'],
				enable:true,
				enable_limits:true,
				limit_max: settings[i]['max'],
				limit_min: settings[i]['min'],
				rotation_constraint_coef:1.0,
				rotation_constraint_axe: settings[i]['rotation_constraint_axe'],
			},

			event_effects : structuredClone(event_effect) 
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


