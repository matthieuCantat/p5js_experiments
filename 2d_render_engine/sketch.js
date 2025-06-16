
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
	let p_offset = new Vector2d(100,0)

	let m = null
	let color_index = null
	for( let i = 0; i < 3; i++)
	{
		m = new Matrix2d()
		m.set_row(2, p)
		m.setRotation(Math.random()*10)
		m.setScale( 100, 20)

		color_index = Math.floor(Math.random() * COLORS.length);
		draw_elements.push( new rectangle( {m : m, color: COLORS[color_index], interaction:'r'})  )

		p.add(p_offset)
	}

	m = new Matrix2d()
	m.set_row(2, new Vector2d(-100,-100))
	m.setRotation(3.14/2)
	m.setScale( 100, 20)
	color_index = Math.floor(Math.random() * COLORS.length);
	draw_elements.push( new rectangle( {m : m, color: COLORS[color_index], interaction:'ty'})  )

	m = new Matrix2d()
	m.set_row(2, new Vector2d(100,-100))
	m.setRotation(Math.random()*10)
	m.setScale( 100, 20)
	color_index = Math.floor(Math.random() * COLORS.length);
	draw_elements.push( new rectangle( {m : m, color: COLORS[color_index], interaction:'r'})  )


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

		if( obj.interaction == 'r' )
		{
			
			
			let vCurrent = pCurrent.getSub(pObj)
			let angle = vInit.getRotation(vCurrent)
			
			let rObj = obj.m.getRotation()
			let rObjNew = rObj + angle
			obj.m.setRotation(rObjNew)
		}
		else if( obj.interaction == 'tx' )
		{
			let p = obj.m.get_row(2)
			p.x = pCurrent.x - vInit.x
			obj.m.set_row(2,p)
		}
		else if( obj.interaction == 'ty' )
		{
			let p = obj.m.get_row(2)
			p.y = pCurrent.y- vInit.y
			obj.m.set_row(2,p)
		}
	}

	// CONSTRAINT
	let rotateConstraint_A = { objs:[ draw_elements[0], draw_elements[1]], attrs:[ 'r', 'r'], mult: 2 }
	let rotateConstraint_B = { objs:[ draw_elements[0], draw_elements[2]], attrs:[ 'r', 'r'], mult:-3 }
	let rotateConstraint_C = { objs:[ draw_elements[3], draw_elements[4]], attrs:[ 'ty', 'r'], mult:-2 }
	if( (user_interaction.something_is_selected )&&(user_interaction.isInteracting))
	{
		if( rotateConstraint_A.objs[1] == user_interaction.selection_info.obj)
		{
			rotateConstraint_A.objs = [ rotateConstraint_A.objs[1], rotateConstraint_A.objs[0]]
			rotateConstraint_A.mult = 1/rotateConstraint_A.mult
			rotateConstraint_A.attrs = [ rotateConstraint_A.attrs[1], rotateConstraint_A.attrs[0]]
		}
			
		if( rotateConstraint_B.objs[1] == user_interaction.selection_info.obj)
		{
			rotateConstraint_B.objs = [ rotateConstraint_B.objs[1], rotateConstraint_B.objs[0]]		
			rotateConstraint_B.mult = 1/rotateConstraint_B.mult
			rotateConstraint_B.attrs = [ rotateConstraint_B.attrs[1], rotateConstraint_B.attrs[0]]		
		}

		if( rotateConstraint_C.objs[1] == user_interaction.selection_info.obj)
		{
			rotateConstraint_C.objs = [ rotateConstraint_C.objs[1], rotateConstraint_C.objs[0]]		
			rotateConstraint_C.mult = 1/rotateConstraint_C.mult
			rotateConstraint_C.attrs = [ rotateConstraint_C.attrs[1], rotateConstraint_C.attrs[0]]		
		}		
	}

	let value = rotateConstraint_A.objs[0].m.getRotation()*rotateConstraint_A.mult
	rotateConstraint_A.objs[1].m.setRotation(value)

	value = rotateConstraint_B.objs[0].m.getRotation()*rotateConstraint_B.mult
	rotateConstraint_B.objs[1].m.setRotation(value)
	
	value = 0
	if( rotateConstraint_C.attrs[0] == 'r')
		value = rotateConstraint_C.objs[0].m.getRotation()
	else if( rotateConstraint_C.attrs[0] == 'tx')
		value = rotateConstraint_C.objs[0].m.get_row(2).x
	else if( rotateConstraint_C.attrs[0] == 'ty')
		value = rotateConstraint_C.objs[0].m.get_row(2).y
	value *= rotateConstraint_B.mult

	if( rotateConstraint_C.attrs[1] == 'r')
		rotateConstraint_C.objs[1].m.setRotation(value)
	else if( rotateConstraint_C.attrs[1] == 'tx')
	{
		let p = rotateConstraint_C.objs[1].m.get_row(2)
		p.x = value
		rotateConstraint_C.objs[1].m.set_row(2,p)
	}	
	else if( rotateConstraint_C.attrs[1] == 'ty')
	{
		let p = rotateConstraint_C.objs[1].m.get_row(2)
		p.y = value
		rotateConstraint_C.objs[1].m.set_row(2,p)		
	}
	
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





