

import Vector2d from './vector2d.js';
import Matrix2d from './matrix2d.js';

export var COLORS = [
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

export var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 20;


// Create an offscreen canvas
export const backgroundCanvas = document.getElementById("backgroundCanvas");
console.log('backgroundCanvas',backgroundCanvas)
const bgCtx = backgroundCanvas.getContext("2d");
backgroundCanvas.width = canvas.width;
backgroundCanvas.height = canvas.height;

export function cX(pos) { return canvas.width / 2 + pos.x ; }
export function cY(pos) { return 0.4 * canvas.height - pos.y ; }
export function cR(rotation){ return rotation*-1 ; }

export function cX_inv(pos) { return pos.x - canvas.width / 2  ; }
export function cY_inv(pos) { return  0.4 * canvas.height - pos.y ; }
export function cR_inv(rotation){ return rotation*-1 ; }


export function draw_background()
{
    ctx.drawImage(backgroundCanvas, 0, 0);
}

export function draw_bg(
	color,
)
{
	bgCtx.fillStyle = color
	bgCtx.fillRect(0, 0, canvas.width, canvas.height);
}

export function draw_grid()
{
	
	let lineWidth = 2
	
	daw_line([{x:-1000,y:100},{x:1000,y:100}],'grey',lineWidth, bgCtx)
	daw_line([{x:-1000,y:200},{x:1000,y:200}],'grey',lineWidth, bgCtx)
	daw_line([{x:-1000,y:300},{x:1000,y:300}],'grey',lineWidth, bgCtx)
	daw_line([{x:-1000,y:400},{x:1000,y:400}],'grey',lineWidth, bgCtx)
	daw_line([{x:-1000,y:500},{x:1000,y:500}],'grey',lineWidth, bgCtx)
	
	daw_line([{x:-1000,y:-100},{x:1000,y:-100}],'grey',lineWidth, bgCtx)
	daw_line([{x:-1000,y:-200},{x:1000,y:-200}],'grey',lineWidth, bgCtx)
	daw_line([{x:-1000,y:-300},{x:1000,y:-300}],'grey',lineWidth, bgCtx)
	daw_line([{x:-1000,y:-400},{x:1000,y:-400}],'grey',lineWidth, bgCtx)
	daw_line([{x:-1000,y:-500},{x:1000,y:-500}],'grey',lineWidth, bgCtx)
	
	daw_line([{x:-1000,y:0},{x:1000,y:0}],'black',lineWidth, bgCtx)

	daw_line([{x:500,y:-1000},{x:500,y:1000}],'grey',lineWidth, bgCtx)
	daw_line([{x:400,y:-1000},{x:400,y:1000}],'grey',lineWidth, bgCtx)
	daw_line([{x:300,y:-1000},{x:300,y:1000}],'grey',lineWidth, bgCtx)
	daw_line([{x:200,y:-1000},{x:200,y:1000}],'grey',lineWidth, bgCtx)
	daw_line([{x:100,y:-1000},{x:100,y:1000}],'grey',lineWidth, bgCtx)
	
	daw_line([{x:-100,y:-1000},{x:-100,y:1000}],'grey',lineWidth, bgCtx)
	daw_line([{x:-200,y:-1000},{x:-200,y:1000}],'grey',lineWidth, bgCtx)
	daw_line([{x:-300,y:-1000},{x:-300,y:1000}],'grey',lineWidth, bgCtx)
	daw_line([{x:-400,y:-1000},{x:-400,y:1000}],'grey',lineWidth, bgCtx)
	daw_line([{x:-500,y:-1000},{x:-500,y:1000}],'grey',lineWidth, bgCtx)

	daw_line([{x:0,y:-1000},{x:0,y:1000}],'black',lineWidth, bgCtx)


}

export function daw_line(
	points,
	color,
	lineWidth,
    c,
)
{
    if( c == null )
        c = ctx
    c.save()
	c.beginPath()
    c.strokeStyle = color
	c.fillStyle = color
	c.lineWidth = lineWidth;

	if ( points.length == 0)
		return 

	c.moveTo( cX(points[0]), cY(points[0]) );
	for( let i = 1; i < points.length; i++)
		c.lineTo( cX(points[i]), cY(points[i]) )

	c.stroke();
    c.restore()
    
}


export class body
{
	constructor(
		in_options,
	)
	{
		const defaultOptions = {
			m: new Matrix2d(),
			shape_type: "rectangle",
			color: "white",
			stroke_color: "black",
			stroke_width: 2,
            interaction: null,
			effect_name: null,
		}
		const args = { ...defaultOptions, ...in_options };

		this.m = args.m
		this.m_init = new Matrix2d(args.m)
		this.shape_type = args.shape_type
		this.color = args.color
		this.stroke_color = args.stroke_color
		this.stroke_width = args.stroke_width	
		this.isSelected = false
        this.interaction = args.interaction

		this.stroke_color_highlight = "yellow"
        this.stroke_width_highlight = 5

		this.visibility = true

		this.effect_name = args.effect_name
	}

	duplicate()
	{
		return new body(
			{	m : new Matrix2d(this.m), 
				shape_type: this.shape_type,
				color: this.color, 
				interaction:this.interaction})
	}

	draw()
	{
		if( this.visibility == false )
			return false

        ctx.save()
		ctx.beginPath()

		

		if( this.color != null)
			ctx.fillStyle = this.color

		if( this.isSelected )
        {
            ctx.strokeStyle = this.stroke_color_highlight
            ctx.lineWidth = this.stroke_width_highlight
        }
        else
        {
            ctx.strokeStyle = this.stroke_color
            ctx.lineWidth = this.stroke_width
        }
			
		if( this.shape_type == "rectangle" )
			draw_rectangle(ctx,this.m)	
		else if( this.shape_type == "circle" )
			draw_circle_from_matrix(ctx, this.m)
		else if( this.shape_type == "triangle" )
			draw_triangle(ctx, this.m)
		else if( this.shape_type == "trapezoid" )
			draw_trapezoid(ctx, this.m)

		if( this.color != null)
			ctx.fill()

		if( this.stroke_color != null)
			ctx.stroke()

		ctx.resetTransform();	
        ctx.restore()	
		
		return true
	}

	isPointInside(point)
	{
		if( this.shape_type == "rectangle" )
			return isPointInside_rectangle(point,this.m)
		else if( this.shape_type == "circle" )
			return isPointInside_circle(point,this.m)
		else if( this.shape_type == "triangle" )
			return isPointInside_triangle(point,this.m)
		else if( this.shape_type == "trapezoid" )
			return isPointInside_trapezoid(point,this.m)
	
		return false
	}

}

function draw_rectangle(ctx, m)
{
	let p = m.get_row(2)
	let orient = m.getRotation()
	let scale = m.getScale()
	
	ctx.translate(cX(p), cY(p));
	ctx.rotate(cR(orient));
	
	ctx.rect(
		-scale.x, 
		-scale.y, 
		scale.x*2, 
		scale.y*2);
	
}

function draw_circle_from_matrix(ctx, m, draw_mark=true)
{
	let p = m.get_row(2)
	let orient = m.getRotation()
	let scale = m.getScale()
	let radius = Math.max( scale.x,scale.y )

	ctx.arc(  cX(p), 
			cY(p), 
			radius, 
			0.0, 
			2.0 * Math.PI); 
	ctx.closePath();

	
	if( draw_mark)
	{
		let vY =m.get_row(1)
		vY.normalize()
		vY.mult(radius/2)
		let p_mark = p.getAdd( vY )
		let scale_mark = new Vector2d(1.0,radius/2)
		let m_mark = new Matrix2d(p_mark,orient,scale_mark)
		draw_rectangle(ctx, m_mark)
	}		
}


function draw_triangle(ctx, m)
{
	let vA = new Vector2d(0,1)
	let vB = vA.getRotated(3.14*2/3)
	let vC = vA.getRotated(-3.14*2/3)

	vA.normalize()
	vB.normalize()
	vC.normalize()
	
	let pA = vA.getMult(m)
	let pB = vB.getMult(m)
	let pC = vC.getMult(m)

	//let vBCenter = pB.getSub(p)
	//vY.normalize().mult(vBCenter.mag())
	//let pA = p.getAdd(vY)

	ctx.moveTo(cX(pA), cY(pA));            // Move to the first point (x1, y1)
	ctx.lineTo(cX(pB), cY(pB));           // Draw line to second point (x2, y2)
	ctx.lineTo(cX(pC), cY(pC));          // Draw line to third point (x3, y3)
	ctx.closePath();               // Close the path (connects back to first point)
	
}


function draw_trapezoid(ctx, m)
{
	let ANGLE = 3.14/4

	let vX = m.get_row(0)
	let vY = m.get_row(1)
	let p = m.get_row(2)

	let pC = p.getAdd(vY).getAdd(vX)
	let pD = p.getAdd(vY).getAdd(vX.getMult(-1))

	let vDC = pD.getSub(pC)
	vDC.rotate(ANGLE)
	let dist = Math.sin(ANGLE)*vY.mag()*2
	vDC.normalize()
	vDC.mult(dist)

	
	let vCD = pC.getSub(pD)
	vCD.rotate(-ANGLE)
	vCD.normalize()
	vCD.mult(dist)

	let pA = pD.getAdd(vCD)
	let pB = pC.getAdd(vDC)



	ctx.moveTo(cX(pA), cY(pA));            // Move to the first point (x1, y1)
	ctx.lineTo(cX(pB), cY(pB));           // Draw line to second point (x2, y2)
	ctx.lineTo(cX(pC), cY(pC));          // Draw line to third point (x3, y3)
	ctx.lineTo(cX(pD), cY(pD)); 
	ctx.closePath();               // Close the path (connects back to first point)
	
}


function isPointInside_rectangle(point,m)
{

	let vX = m.get_row(0)
	let vY = m.get_row(1)
	let p = m.get_row(2)
	
	let pA = p.getSub(vX).getAdd(vY)
	let pB = p.getAdd(vX).getAdd(vY)
	let pC = p.getAdd(vX).getSub(vY)
	let pD = p.getSub(vX).getSub(vY)
	
	let vTestA = point.getSub(pA)
	let vBA = pB.getSub(pA)
	let dBA = vTestA.dot(vBA)
	
	let vDA = pD.getSub(pA)
	let dDA = vTestA.dot(vDA)
	
	let vTestC = point.getSub(pC)
	let vBC = pB.getSub(pC)
	let dBC = vTestC.dot(vBC)
	
	let vDC = pD.getSub(pC)
	let dDC = vTestC.dot(vDC)
	
	return 0 < dBA && 0 < dDA && 0 < dBC && 0 < dDC
}


function isPointInside_trapezoid(point,m)
{
	let ANGLE = 3.14/4

	let vX = m.get_row(0)
	let vY = m.get_row(1)
	let p = m.get_row(2)

	let pC = p.getAdd(vY).getAdd(vX)
	let pD = p.getAdd(vY).getAdd(vX.getMult(-1))

	let vDC = pD.getSub(pC)
	vDC.rotate(ANGLE)
	let dist = Math.sin(ANGLE)*vY.mag()*2
	vDC.normalize()
	vDC.mult(dist)

	
	let vCD = pC.getSub(pD)
	vCD.rotate(-ANGLE)
	vCD.normalize()
	vCD.mult(dist)

	let pA = pD.getAdd(vCD)
	let pB = pC.getAdd(vDC)

	
	let vTestA = point.getSub(pA)
	let vBA = pB.getSub(pA)
	let dBA = vTestA.dot(vBA)
	
	let vDA = pD.getSub(pA)
	let dDA = vTestA.dot(vDA)
	
	let vTestC = point.getSub(pC)
	let vBC = pB.getSub(pC)
	let dBC = vTestC.dot(vBC)
	
	let _vDC = pD.getSub(pC)
	let dDC = vTestC.dot(_vDC)
	
	return 0 < dBA && 0 < dDA && 0 < dBC && 0 < dDC
}


function isPointInside_circle(point,m)
{

	let vX = m.get_row(0)
	let vY = m.get_row(1)
	let p = m.get_row(2)
	let radius = Math.max( vX.mag(), vY.mag() )
	
	let vDelta = point.getSub(p)
	
	return vDelta.mag() <= radius
}


function isPointInside_triangle(point,m)
{
	let vA = new Vector2d(0,1)
	let vB = vA.getRotated(3.14*2/3)
	let vC = vA.getRotated(-3.14*2/3)

	vA.normalize()
	vB.normalize()
	vC.normalize()
	
	let pA = vA.getMult(m)
	let pB = vB.getMult(m)
	let pC = vC.getMult(m)

	
	const v0x = pC.x - pA.x;
	const v0y = pC.y - pA.y;
	const v1x = pB.x - pA.x;
	const v1y = pB.y - pA.y;
	const v2x = point.x - pA.x;
	const v2y = point.y - pA.y;
  
	const dot00 = v0x * v0x + v0y * v0y;
	const dot01 = v0x * v1x + v0y * v1y;
	const dot02 = v0x * v2x + v0y * v2y;
	const dot11 = v1x * v1x + v1y * v1y;
	const dot12 = v1x * v2x + v1y * v2y;
  
	const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
	const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
	const v = (dot00 * dot12 - dot01 * dot02) * invDenom;
  
	return u >= 0 && v >= 0 && (u + v <= 1);
}


export function get_randow_color()
{
	let color_index = Math.floor(Math.random() * COLORS.length);
	return COLORS[color_index]
}


export function draw_circle(
	point,
	radius,
	color,
	stroke_color,
	stroke_width,
)
{
	ctx.beginPath()
	
	ctx.fillStyle = color;
	ctx.strokeStyle = stroke_color
	ctx.lineWidth = stroke_width
	
		
	ctx.arc(  cX(point), 
			cY(point), 
			radius, 
			0.0, 
			2.0 * Math.PI); 
	ctx.closePath();
	ctx.fill();
	ctx.stroke()
}
