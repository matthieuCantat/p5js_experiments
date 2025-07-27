
import Vector2d from '../utils/vector2d.js';
import Matrix2d from '../utils/matrix2d.js';
import { User_interaction_info } from '../utils/interaction.js'
import { Constraints_info } from '../utils/constraint.js'
import { draw_bg, 
	draw_grid,
	draw_circle,
	daw_line, 
	COLORS,
	canvas,
	draw_background,
	get_randow_color} from '../utils/draw.js'
import { body } from '../utils/body.js'
	


var Objs = []
var User_interaction = new User_interaction_info();
var Constraints = new Constraints_info(User_interaction)


function setup()
{
	
	// SETUP OBJS
	let unit = 40
	let p = new Vector2d(-150,200)
	let p_offset_Y = new Vector2d(0,-unit*2)
	let p_offset_X = new Vector2d(unit*2,0)
	let scales = [ new Vector2d(unit,unit), new Vector2d(unit/2,unit), new Vector2d(unit,unit/2) ]
	
	let shape_types = [ 
		'rectangle', 
		'circle', 
		'circle_rot',
		'triangle' , 
		'cross',
		'trapezoid',
		'star_classic',
		'star_ai',
		'star_realistic'  ]

	for( let j = 0; j <scales.length; j++)
	{
		let pStartCol = new Vector2d(p)
		for( let i = 0; i < shape_types.length; i++)
		{
			let color_index = Math.floor(Math.random() * COLORS.length);
	
			let obj = new body( 
				{ m : new Matrix2d(pStartCol, 0, scales[j]), 
					color: COLORS[color_index], 
					interaction_settings :{attr:'r'},
					shape_type:shape_types[i] } ) 
	
			Objs.push( obj )
			pStartCol.add(p_offset_Y)
		}
		p.add(p_offset_X)
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
			  interaction_settings:{attr:'r'},
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

	
	Constraints.update()
	
}	

var draw_count = 0;
function draw() {

	draw_background()
	
	for( let elem of Objs )
		elem.draw()
	
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


