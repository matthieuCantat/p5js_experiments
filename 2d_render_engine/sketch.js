
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
    constructor()
    {
        this.isMousePressed = false
        this.isScreenTouched = false
        this.userIsInteracting = false
        this.userIsInteracting_last = null
        this.userInteractionChange = false
        this.mouseX = 0
        this.mouseY = 0
        this._eventTimer = null;

		this.p = null
		this.pStart = null
		this.pEnd = null
		this.trailPoints = []
		this.trailPoints_nbrMax = 200
		for( let i = 0; i < this.trailPoints_nbrMax; i++)
		{
			this.trailPoints.push(null)
		}

		this.ON_COMPUTER = true
    }

	trail_clear()
	{
		this.trailPoints = []
		for( let i = 0; i < this.trailPoints_nbrMax; i++)
		{
			this.trailPoints.push(null)
		}
	}	
	
	trail_add(p)
	{
		for( let i = this.trailPoints_nbrMax-1; 0 < i; i--)
		{
			this.trailPoints[i] = this.trailPoints[i-1]
		}
		this.trailPoints[0] = p
	}


    handleMouseDown(event) {
        console.log('handleMouseDown')
        this.isMousePressed = true;
        this.userIsInteracting_last = this.userIsInteracting
        this.userIsInteracting = this.isScreenTouched || this.isMousePressed
        if( this.userIsInteracting != this.userIsInteracting_last)
            this.userInteractionChange = true
        else
        this.userInteractionChange = false
        //console.log('Mouse is pressed:', user_interaction_info.isMousePressed);
        this.user_idle_check()
    }
    
    handleMouseUp(event) {
        console.log('handleMouseUp')
        this.isMousePressed = false;
      
        this.userIsInteracting_last = this.userIsInteracting
        this.userIsInteracting = false
        if( this.userIsInteracting != this.userIsInteracting_last)
            this.userInteractionChange = true
        else
            this.userInteractionChange = false
        //console.log('Mouse is pressed:', user_interaction_info.isMousePressed);
        this.user_idle_check()

		this.p = null
		this.trail_clear()
    }

    // Function to handle the mousemove event
    handleMouseMove(event) {
		if( ( this.ON_COMPUTER )&&(this.isMousePressed == false) )
			return 
		console.log('handleMouseMove')
		this.mouseX = cX_inv( { x : event.clientX} )
		this.mouseY = cY_inv( { y : event.clientY} )		
		this.p = new Vector(this.mouseX,this.mouseY)
		this.trail_add(this.p)
    }
	

    handleTouchDown(event) {
        console.log('handleTouchDown')
        this.isScreenTouched = true;
        this.userIsInteracting_last = this.userIsInteracting
        this.userIsInteracting = this.isScreenTouched || this.isMousePressed
        if( this.userIsInteracting != this.userIsInteracting_last)
            this.userInteractionChange = true
        else
        this.userInteractionChange = false  
        //console.log('Mouse is pressed:', this.isMousePressed);
        // mouse must be update sooner
        const touch = event.touches[0] || event.changedTouches[0]; 

		this.mouseX = cX_inv( { x : touch.clientX} )
		this.mouseY = cY_inv( { y : touch.clientY} )
		this.p = new Vector(this.mouseX,this.mouseY)
		this.trail_add(this.p)
		this.pStart = this.p

        this.user_idle_check()  
    }

    handleTouchUp(event) {
        console.log('handleTouchUp')
        this.isScreenTouched = false;
    
        this.userIsInteracting_last = this.userIsInteracting
        this.userIsInteracting = false
        if( this.userIsInteracting != this.userIsInteracting_last)
            this.userInteractionChange = true
        else
        this.userInteractionChange = false
        
        this.user_idle_check()
		this.p = null
		this.trail_clear()
    }   
    

    handleTouchMove(event)
    {
	  console.log('handleTouchMove')
      const touch = event.touches[0] || event.changedTouches[0];
      
	  this.mouseX = cX_inv( { x : touch.clientX} )
	  this.mouseY = cY_inv( { y : touch.clientY} )
	  this.p = new Vector(this.mouseX,this.mouseY)
	  this.trail_add(this.p)

      //console.log('Mouse is pressed:', user_interaction_info.isMousePressed);
    }


    // Reset the timer whenever an event is detected
    user_idle_check()
    {
        // CLEAR EXECUTION COUNTER
        clearTimeout(this._eventTimer);

        // SETUP EXECUTION COUNTER
        let waiting_time_before_execution = 50; // == 5 seconde
        this._eventTimer = setTimeout( 
            () => {this.user_do_idle }, 
            waiting_time_before_execution);
    }

    user_do_idle()
    {
        if( this.userInteractionChange == true)
        {
            this.userIsInteracting_last = this.userIsInteracting
            this.userInteractionChange = false 
        } 
    }

	draw()
	{
		if( this.isMousePressed)
		{
		
			let p = new Vector( this.mouseX, this.mouseY)
			
			draw_circle( p.v,
						10,
						'red',
						'back',
						5)

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
var user_interaction_info = new User_interaction_info();

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
		elem.m.rotate(0.01)

	for( let elem of draw_elements )
		elem.isSelected = false

	
	if( user_interaction_info.p != null )
	{
		for( let i = draw_elements.length -1 ; 0 < i; i-- )
			if( draw_elements[i].isPointInside( user_interaction_info.p.v.x, 
												user_interaction_info.p.v.y) )
			{
				draw_elements[i].isSelected = true
				break
			}
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

	user_interaction_info.draw()


	draw_count += 1
	requestAnimationFrame(draw);
}





// Attach event listeners when the document is fully loaded
window.onload = function() {
    canvas.addEventListener('mousedown', (event) => {user_interaction_info.handleMouseDown(event)});
    canvas.addEventListener('mouseup', (event) => {user_interaction_info.handleMouseUp(event)});
    canvas.addEventListener('mousemove', (event) => {user_interaction_info.handleMouseMove(event)});
    canvas.addEventListener('touchstart', (event) => {user_interaction_info.handleTouchDown(event)});
    canvas.addEventListener('touchend', (event) => {user_interaction_info.handleTouchUp(event)});
    canvas.addEventListener('touchmove', (event) => {user_interaction_info.handleTouchMove(event)});    
}
////////////////////////////////////////////////// mouse pressed

/*
var user_interaction_info = {}
canvas.addEventListener('click', (event) => {
	const rect = canvas.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const y = event.clientY - rect.top;
}
	*/

setup();
draw();	





