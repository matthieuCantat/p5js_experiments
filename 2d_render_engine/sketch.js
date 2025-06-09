
import Vector from '../fidget_three/js/utils/vector.js';
import Matrix from '../fidget_three/js/utils/matrix.js';

var COLORS = [
	"aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque",
	"black", "blanchedalmond", "blue", "blueviolet", "brown", "burlywood",
	"cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue",
	"cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod",
	"darkgray", "darkgreen", "darkgrey", "darkkhaki", "darkmagenta", "darkolivegreen",
	"darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen",
	"darkslateblue", "darkslategray", "darkslategrey", "darkturquoise",
	"darkviolet", "deeppink", "deepskyblue", "dimgray", "dimgrey", "dodgerblue",
	"firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro",
	"ghostwhite", "gold", "goldenrod", "gray", "green", "greenyellow", "grey",
	"honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender",
	"lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral",
	"lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightgrey",
	"lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray",
	"lightslategrey", "lightsteelblue", "lightyellow", "lime", "limegreen",
	"linen", "magenta", "maroon", "mediumaquamarine", "mediumblue", "mediumorchid",
	"mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen",
	"mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose",
	"moccasin", "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange",
	"orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise",
	"palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue",
	"purple", "rebeccapurple", "red", "rosybrown", "royalblue", "saddlebrown",
	"salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue",
	"slateblue", "slategray", "slategrey", "snow", "springgreen", "steelblue",
	"tan", "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white",
	"whitesmoke", "yellow", "yellowgreen"
  ]

var canvas = document.getElementById("myCanvas");
var c = canvas.getContext("2d");
canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 20;

function cX(pos) { return canvas.width / 2 + pos.x ; }
function cY(pos) { return 0.4 * canvas.height - pos.y ; }
function cR(rotation){ return rotation*-1 ; }

function cX_inv(pos) { return pos.x - canvas.width / 2  ; }
function cY_inv(pos) { return  0.4 * canvas.height - pos.y ; }
function cR_inv(rotation){ return rotation*-1 ; }

function draw_bg(
	color,
)
{
	c.fillStyle = color
	c.fillRect(0, 0, canvas.width, canvas.height);
}

function draw_grid()
{
	
	let lineWidth = 2
	
	daw_line([{x:-1000,y:100},{x:1000,y:100}],'grey',lineWidth)
	daw_line([{x:-1000,y:200},{x:1000,y:200}],'grey',lineWidth)
	daw_line([{x:-1000,y:300},{x:1000,y:300}],'grey',lineWidth)
	daw_line([{x:-1000,y:400},{x:1000,y:400}],'grey',lineWidth)
	daw_line([{x:-1000,y:500},{x:1000,y:500}],'grey',lineWidth)
	
	daw_line([{x:-1000,y:-100},{x:1000,y:-100}],'grey',lineWidth)
	daw_line([{x:-1000,y:-200},{x:1000,y:-200}],'grey',lineWidth)
	daw_line([{x:-1000,y:-300},{x:1000,y:-300}],'grey',lineWidth)
	daw_line([{x:-1000,y:-400},{x:1000,y:-400}],'grey',lineWidth)
	daw_line([{x:-1000,y:-500},{x:1000,y:-500}],'grey',lineWidth)
	
	daw_line([{x:-1000,y:0},{x:1000,y:0}],'black',lineWidth)

	daw_line([{x:500,y:-1000},{x:500,y:1000}],'grey',lineWidth)
	daw_line([{x:400,y:-1000},{x:400,y:1000}],'grey',lineWidth)
	daw_line([{x:300,y:-1000},{x:300,y:1000}],'grey',lineWidth)
	daw_line([{x:200,y:-1000},{x:200,y:1000}],'grey',lineWidth)
	daw_line([{x:100,y:-1000},{x:100,y:1000}],'grey',lineWidth)
	
	daw_line([{x:-100,y:-1000},{x:-100,y:1000}],'grey',lineWidth)
	daw_line([{x:-200,y:-1000},{x:-200,y:1000}],'grey',lineWidth)
	daw_line([{x:-300,y:-1000},{x:-300,y:1000}],'grey',lineWidth)
	daw_line([{x:-400,y:-1000},{x:-400,y:1000}],'grey',lineWidth)
	daw_line([{x:-500,y:-1000},{x:-500,y:1000}],'grey',lineWidth)

	daw_line([{x:0,y:-1000},{x:0,y:1000}],'black',lineWidth)


}

function daw_line(
	points,
	color,
	lineWidth,
)
{
	c.beginPath()

	c.fillStyle = color
	c.lineWidth = lineWidth;

	if ( points.length == 0)
		return 

	c.moveTo( cX(points[0]), cY(points[0]) );
	for( let i = 1; i < points.length; i++)
		c.lineTo( cX(points[i]), cY(points[i]) )

	c.stroke();
}

function draw_circle(
	point,
	radius,
	color,
	stroke_color,
	stroke_width,
)
{
	c.beginPath()
	
	c.fillStyle = color;
	c.strokeStyle = stroke_color
	c.lineWidth = stroke_width
	
		
	c.arc(  cX(point), 
			cY(point), 
			radius, 
			0.0, 
			2.0 * Math.PI); 
	c.closePath();
	c.fill();
	c.stroke()
}

class rectangle
{
	constructor(
		in_options,
	)
	{
		const defaultOptions = {
			m: new Matrix(),
			color: "white",
			stroke_color: "black",
			stroke_width: 5,
		}
		const args = { ...defaultOptions, ...in_options };

		this.m = args.m
		this.color = args.color
		this.stroke_color = args.stroke_color
		this.stroke_width = args.stroke_width	
		this.isSelected = false

		this.stroke_color_highligth = "yellow"
	}

	draw()
	{
		c.beginPath()

		c.fillStyle = this.color
		c.strokeStyle = this.stroke_color
		if( this.isSelected )
			c.strokeStyle = this.stroke_color_highligth

		c.lineWidth = this.stroke_width
		
		let p = this.m.get_row(2)
		let orient = this.m.getRotation()
		let scale = this.m.getScale()
		
		c.translate(cX(p.v), cY(p.v));
		c.rotate(cR(orient));
		
		c.rect(
			-scale[0], 
			-scale[1], 
			scale[0]*2, 
			scale[1]*2);
		c.fill()
		c.stroke()	
	
		c.resetTransform();			
	}

	isPointInside(x, y) {
		let pTest = new Vector(x, y)

		let vX = this.m.get_row(0)
		let vY = this.m.get_row(1)
		let p = this.m.get_row(2)

		let pA = p.getSub(vX).getAdd(vY)
		let pB = p.getAdd(vX).getAdd(vY)
		let pC = p.getAdd(vX).getSub(vY)
		let pD = p.getSub(vX).getSub(vY)

		let vTestA = pTest.getSub(pA)
		let vBA = pB.getSub(pA)
		let dBA = vTestA.dot(vBA)

		let vDA = pD.getSub(pA)
		let dDA = vTestA.dot(vDA)

		let vTestC = pTest.getSub(pC)
		let vBC = pB.getSub(pC)
		let dBC = vTestC.dot(vBC)

		let vDC = pD.getSub(pC)
		let dDC = vTestC.dot(vDC)

		return 0 < dBA && 0 < dDA && 0 < dBC && 0 < dDC
	
	  }

}



////////////////////////////////////////////////// mouse pressed
// Declare the boolean value as a global variable
class User_interaction_info
{
	LOG_LISTENERS = false
	BOT_MODE = false
    constructor()
    {
		//
        this._isInteracting_last = null

		// INTERACTION
		this.isInteracting = false
		this.isPressed = false
		this.isReleased = false
		this.interactionChanged = false
		this.isInteractingCount = 0
		this.isNotInteractingCount = 0

		this.p = null
		this.p_last = null
		this.pReleased = null
		this.pPressed = null

		this.trailPoints = []
		this.trailPoints_nbrMax = 200
		for( let i = 0; i < this.trailPoints_nbrMax; i++)
			this.trailPoints.push(null)

		// OBJ TO INTERACT
		this.something_is_selected = false
		this.selection_info = { obj : null , vOffset : null }
		
    }

	interactionEvent_getPos(event, interaction_type, action )
	{
        if(this.LOG_LISTENERS)
			console.log('interactionEvent_hande', interaction_type, action)

		if( ( interaction_type == 'mouse')&&( action == 'move')&&(this.p == null))
			return

		let e = event
		if( interaction_type == 'touch')
			e = event.touches[0] || event.changedTouches[0]
		
		if( ( action == 'down')||( action == 'move') )
			this.p = this.get_input_coords_as_vector( e.clientX, e.clientY)
		else if( action == 'up')
			this.p = null	
    }
    
	// LISTENERS
	interactionEvent_addToListener(doc)
	{
		doc.addEventListener('mousedown',  (event) => {this.interactionEvent_getPos(event,'mouse','down')});
		doc.addEventListener('mouseup',    (event) => {this.interactionEvent_getPos(event,'mouse','up')});
		doc.addEventListener('mousemove',  (event) => {this.interactionEvent_getPos(event,'mouse','move')});
		doc.addEventListener('touchstart', (event) => {this.interactionEvent_getPos(event,'touch','down')});
		doc.addEventListener('touchend',   (event) => {this.interactionEvent_getPos(event,'touch','up')});
		doc.addEventListener('touchmove',  (event) => {this.interactionEvent_getPos(event,'touch','move')}); 
	}

	override_pos()
	{
		let sinA_0 = Math.sin(draw_count*0.01)
		let sinA_1 = Math.sin(draw_count*0.01+1)
		let sinB_0 = Math.sin(draw_count*0.02)
		let sinB_1 = Math.sin(draw_count*0.02+1)
		let sinC_0 = Math.sin(draw_count*0.03)
		let sinC_1 = Math.sin(draw_count*0.03+1)
		let sinD_0 = Math.sin(draw_count*0.04)
		let sinD_1 = Math.sin(draw_count*0.04+1)


		let pSin = {	
			x:sinA_1*600*sinB_1,
			y:sinC_0*400*sinD_1
		}

		let activation = Math.abs(sinD_0) -0.1

		this.p = new Vector(pSin.x,pSin.y)
		if( activation < 0 )
			this.p = null
	}

	trail_clear()
	{
		this.trailPoints = []
		for( let i = 0; i < this.trailPoints_nbrMax; i++)
			this.trailPoints.push(null)
	}	
	
	trail_add(p)
	{
		for( let i = this.trailPoints_nbrMax-1; 0 < i; i--)
			this.trailPoints[i] = this.trailPoints[i-1]
		this.trailPoints[0] = p
	}

	get_input_coords_as_vector(x,y)
	{
		return new Vector( cX_inv( { x : x} ), cY_inv( { y : y} ) )
	}



	add_selection_info(obj)
	{
		this.selection_info.obj = obj
		this.selection_info.vOffset = this.pPressed.getMult( obj.m.getInverse())
	}

	clear_selection_info()
	{
		this.selection_info.obj = null
		this.selection_info.vOffset = null
	}

	scan_for_selection(objs)
	{

		if( this.isInteracting )
		{
			if(( this.something_is_selected == false )&&(this.isPressed == true))
			{
						
				for( let obj of objs )
					obj.isSelected = false
					
				for( let i = objs.length -1 ; 0 <= i; i-- )
				{
					if( objs[i].isPointInside( this.p.v.x, 
														this.p.v.y) )
					{
						objs[i].isSelected = true
						this.something_is_selected = true
						this.add_selection_info(objs[i])
						break
					}
				}
			}
		}
		else
		{
			this.something_is_selected = false
			this.clear_selection_info()
			for( let obj of objs )
				obj.isSelected = false		
		}		
	}

	update_state()
	{
		// is interacting
		if( this.p != null)
			this.isInteracting = true
		else
			this.isInteracting = false

		// others
		this.interactionChanged = false
		this.isPressed = false
		this.isReleased = false
		if( this.isInteracting != this._isInteracting_last)
		{
			this.interactionChanged = true
			if(this.isInteracting == true)
				this.isPressed = true
			else
				this.isReleased = true
		}
     
		// for next eval
		this._isInteracting_last = this.isInteracting
	}

	update_counter()
	{
		if(this.isInteracting)
		{
			this.isInteractingCount +=1
			this.isNotInteractingCount = 0
		}
		else
		{
			this.isInteractingCount = 0
			this.isNotInteractingCount += 1
		}
	}

	update_coords()
	{
		if( this.isPressed)
			this.pPressed = this.p

		if(this.isReleased)
			this.pReleased = this.p_last
			

		if(this.isInteracting)
		{
			this.trail_add(this.p)
			this.pReleased = null
		}
		else
		{
			this.trail_clear()
			this.pPressed = null
		}
			
		this.p_last = this.p
	}

	update()
	{
		if( this.BOT_MODE 	)
			this.override_pos()
		this.update_state()
		this.update_counter()
		this.update_coords()		
	}

	draw()
	{
		
		/*
		if( true )
		{
			console.log('==============================')
			console.log('isInteracting',this.isInteracting)
			//console.log('isInteracting_last',this._isInteracting_last)
			console.log('interactionChanged',this.interactionChanged)
			console.log('isPressed',this.isPressed)
			console.log('isReleased',this.isReleased)
		}
		*/
		
		
		
		if((0<this.isInteractingCount)&&(this.isInteractingCount<50)&&(this.pPressed!= null))
		{	
			
			draw_circle( this.pPressed.v,
				Math.max( 30, 70 -this.isInteractingCount*5),
				'red',
				'back',
				5)


		}
		
		if((this.isNotInteractingCount)&&(this.isNotInteractingCount<50)&&(this.pReleased!= null))
		{
			draw_circle( this.pReleased.v,
				Math.max( 30, 70 -this.isNotInteractingCount*5),
				'blue',
				'back',
				5)		

		}

		if( this.isInteracting)
		{
			// CURRENT MOUSE PRESSED
			draw_circle( this.p.v,
						10,
						'red',
						'back',
						5)

			
			// SELECTED OBJ SELECTION
			if( this.selection_info.obj != null)
			{
				let m = this.selection_info.obj.m
				let v = this.selection_info.vOffset
				let p = v.getMult(m)
				draw_circle( p.v,
					10,
					'yellow',
					'back',
					5)

				let m_p = m.get_row(2)
				draw_circle( m_p.v,
					10,
					'yellow',
					'back',
					5)				
					
				daw_line([p.v,m_p.v],
						'yellow',
						2,)

				daw_line([p.v,this.p.v],
						'red',
						2,)						
			}

			// TRAIL
			let points = []
			for( let i = 0; i < this.trailPoints_nbrMax; i++)
			{
				if( this.trailPoints[i] == null)
					break
				points.push(this.trailPoints[i].v)
			}
			
			daw_line(
				points,
				'purple',
				2,
			)

		}


	}

}





var draw_elements = []
var user_interaction = new User_interaction_info();

function setup()
{
	for( let i = 0; i < 10; i++)
	{
		let m = new Matrix()
		m.set_row(2, new Vector(Math.random()*500 -250,Math.random()*500 -250))
		m.setRotation(Math.random()*10)
		m.setScale( 500, 50)

		const color_index = Math.floor(Math.random() * COLORS.length);
		draw_elements.push( new rectangle( {m : m, color: COLORS[color_index]})  )
	}
}

function update()
{		
	//for( let elem of draw_elements )
	//	elem.m.rotate(0.01)
	user_interaction.update()
	user_interaction.scan_for_selection(draw_elements)


	if( (user_interaction.something_is_selected )&&(user_interaction.isInteracting))
	{
		let obj = user_interaction.selection_info.obj;
		let vOffset = user_interaction.selection_info.vOffset;
		let pSelection_init = vOffset.getMult( obj.m )
		let pCurrent = user_interaction.p
		let pObj = obj.m.get_row(2)
		let vInit = pSelection_init.getSub(pObj)
		let vCurrent = pCurrent.getSub(pObj)
		let angle = vInit.getRotation(vCurrent)
		
		let rObj = obj.m.getRotation()
		let rObjNew = rObj + angle
		obj.m.setRotation(rObjNew)
		
		
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





