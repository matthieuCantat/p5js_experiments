
import Vector2d from './utils/vector2d.js';
import Matrix2d from './utils/matrix2d.js';
import { User_interaction_info }from './utils/interaction.js'
import { draw_bg, 
	draw_grid,
	draw_circle,
	daw_line, 
	rectangle,
	COLORS,
	canvas} from './utils/draw.js'



var draw_elements = []
var user_interaction = new User_interaction_info();

function setup()
{
	let p = new Vector2d(-100,100)
	let p_offset = new Vector2d(200,0)
	for( let i = 0; i < 3; i++)
	{
		let m = new Matrix2d()
		m.set_row(2, p)
		m.setRotation(Math.random()*10)
		m.setScale( 200, 40)

		const color_index = Math.floor(Math.random() * COLORS.length);
		draw_elements.push( new rectangle( {m : m, color: COLORS[color_index]})  )

		p.add(p_offset)
	}
}

function update()
{		
	
	//	INTERACTION
	user_interaction.update()
	user_interaction.scan_for_selection(draw_elements)

	if( ( user_interaction.something_is_selected )&&( user_interaction.isInteracting ))
	{
		let obj = user_interaction.selection_info.obj;
		let vOffset = user_interaction.selection_info.vOffset;
		let pCurrent = user_interaction.p

		let pSelection_init = vOffset.getMult( obj.m )
		let pObj = obj.m.get_row(2)
		let vInit = pSelection_init.getSub(pObj)
		let vCurrent = pCurrent.getSub(pObj)
		let angle = vInit.getRotation(vCurrent)
		
		let rObj = obj.m.getRotation()
		let rObjNew = rObj + angle
		obj.m.setRotation(rObjNew)	
	}

	// CONSTRAINT
	let rotateConstraint_A = { objs:[ draw_elements[0], draw_elements[1]], mult:2 }
	let rotateConstraint_B =  { objs:[ draw_elements[0], draw_elements[2]], mult:-3 }
	if( (user_interaction.something_is_selected )&&(user_interaction.isInteracting))
	{
		if( rotateConstraint_A.objs[1] == user_interaction.selection_info.obj)
		{
			rotateConstraint_A.objs = [ rotateConstraint_A.objs[1], rotateConstraint_A.objs[0]]
			rotateConstraint_A.mult = 1/rotateConstraint_A.mult
		}
			
		if( rotateConstraint_B.objs[1] == user_interaction.selection_info.obj)
		{
			rotateConstraint_B.objs = [ rotateConstraint_B.objs[1], rotateConstraint_B.objs[0]]		
			rotateConstraint_B.mult = 1/rotateConstraint_B.mult
		}
	}

	rotateConstraint_A.objs[1].m.setRotation(rotateConstraint_A.objs[0].m.getRotation()*rotateConstraint_A.mult)
	rotateConstraint_B.objs[1].m.setRotation(rotateConstraint_B.objs[0].m.getRotation()*rotateConstraint_B.mult)

}	


var draw_count = 0;
function draw() {
	draw_bg('white')
	draw_grid()

	daw_line(
		[{x:-100,y:10},{x:20,y:50},{x:160,y:140}],
		"rgb(100,255,255)",
		10,
	)
	
	let pCircle = {	
		x:Math.sin(draw_count*0.01-3)*200,
		y:Math.sin(draw_count*0.02)*200
	}

	

	for( let elem of draw_elements )
		elem.draw()
	
		
	draw_circle(
		pCircle,
		5,
		"yellow",
		"black",
		5,
	)		

	user_interaction.draw()


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
	user_interaction.interactionEvent_addToListener(canvas)   
}
////////////////////////////////////////////////// mouse pressed


setup();
game_loop();	





