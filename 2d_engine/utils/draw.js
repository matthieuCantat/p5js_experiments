

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

export var COLORS_TO_RGB =
{
  aliceblue: [240, 248, 255],
  antiquewhite: [250, 235, 215],
  aqua: [0, 255, 255],
  aquamarine: [127, 255, 212],
  azure: [240, 255, 255],
  beige: [245, 245, 220],
  bisque: [255, 228, 196],
  black: [0, 0, 0],
  blanchedalmond: [255, 235, 205],
  blue: [0, 0, 255],
  blueviolet: [138, 43, 226],
  brown: [165, 42, 42],
  burlywood: [222, 184, 135],
  cadetblue: [95, 158, 160],
  chartreuse: [127, 255, 0],
  chocolate: [210, 105, 30],
  coral: [255, 127, 80],
  cornflowerblue: [100, 149, 237],
  cornsilk: [255, 248, 220],
  crimson: [220, 20, 60],
  cyan: [0, 255, 255],
  darkblue: [0, 0, 139],
  darkcyan: [0, 139, 139],
  darkgoldenrod: [184, 134, 11],
  darkgray: [169, 169, 169],
  darkgreen: [0, 100, 0],
  darkgrey: [169, 169, 169],
  darkkhaki: [189, 183, 107],
  darkmagenta: [139, 0, 139],
  darkolivegreen: [85, 107, 47],
  darkorange: [255, 140, 0],
  darkorchid: [153, 50, 204],
  darkred: [139, 0, 0],
  darksalmon: [233, 150, 122],
  darkseagreen: [143, 188, 143],
  darkslateblue: [72, 61, 139],
  darkslategray: [47, 79, 79],
  darkslategrey: [47, 79, 79],
  darkturquoise: [0, 206, 209],
  darkviolet: [148, 0, 211],
  deeppink: [255, 20, 147],
  deepskyblue: [0, 191, 255],
  dimgray: [105, 105, 105],
  dimgrey: [105, 105, 105],
  dodgerblue: [30, 144, 255],
  firebrick: [178, 34, 34],
  floralwhite: [255, 250, 240],
  forestgreen: [34, 139, 34],
  fuchsia: [255, 0, 255],
  gainsboro: [220, 220, 220],
  ghostwhite: [248, 248, 255],
  gold: [255, 215, 0],
  goldenrod: [218, 165, 32],
  gray: [128, 128, 128],
  green: [0, 128, 0],
  greenyellow: [173, 255, 47],
  grey: [128, 128, 128],
  honeydew: [240, 255, 240],
  hotpink: [255, 105, 180],
  indianred: [205, 92, 92],
  indigo: [75, 0, 130],
  ivory: [255, 255, 240],
  khaki: [240, 230, 140],
  lavender: [230, 230, 250],
  lavenderblush: [255, 240, 245],
  lawngreen: [124, 252, 0],
  lemonchiffon: [255, 250, 205],
  lightblue: [173, 216, 230],
  lightcoral: [240, 128, 128],
  lightcyan: [224, 255, 255],
  lightgoldenrodyellow: [250, 250, 210],
  lightgray: [211, 211, 211],
  lightgreen: [144, 238, 144],
  lightgrey: [211, 211, 211],
  lightpink: [255, 182, 193],
  lightsalmon: [255, 160, 122],
  lightseagreen: [32, 178, 170],
  lightskyblue: [135, 206, 250],
  lightslategray: [119, 136, 153],
  lightslategrey: [119, 136, 153],
  lightsteelblue: [176, 196, 222],
  lightyellow: [255, 255, 224],
  lime: [0, 255, 0],
  limegreen: [50, 205, 50],
  linen: [250, 240, 230],
  magenta: [255, 0, 255],
  maroon: [128, 0, 0],
  mediumaquamarine: [102, 205, 170],
  mediumblue: [0, 0, 205],
  mediumorchid: [186, 85, 211],
  mediumpurple: [147, 112, 219],
  mediumseagreen: [60, 179, 113],
  mediumslateblue: [123, 104, 238],
  mediumspringgreen: [0, 250, 154],
  mediumturquoise: [72, 209, 204],
  mediumvioletred: [199, 21, 133],
  midnightblue: [25, 25, 112],
  mintcream: [245, 255, 250],
  mistyrose: [255, 228, 225],
  moccasin: [255, 228, 181],
  navajowhite: [255, 222, 173],
  navy: [0, 0, 128],
  oldlace: [253, 245, 230],
  olive: [128, 128, 0],
  olivedrab: [107, 142, 35],
  orange: [255, 165, 0],
  orangered: [255, 69, 0],
  orchid: [218, 112, 214],
  palegoldenrod: [238, 232, 170],
  palegreen: [152, 251, 152],
  paleturquoise: [175, 238, 238],
  palevioletred: [219, 112, 147],
  papayawhip: [255, 239, 213],
  peachpuff: [255, 218, 185],
  peru: [205, 133, 63],
  pink: [255, 192, 203],
  plum: [221, 160, 221],
  powderblue: [176, 224, 230],
  purple: [128, 0, 128],
  rebeccapurple: [102, 51, 153],
  red: [255, 0, 0],
  rosybrown: [188, 143, 143],
  royalblue: [65, 105, 225],
  saddlebrown: [139, 69, 19],
  salmon: [250, 128, 114],
  sandybrown: [244, 164, 96],
  seagreen: [46, 139, 87],
  seashell: [255, 245, 238],
  sienna: [160, 82, 45],
  silver: [192, 192, 192],
  skyblue: [135, 206, 235],
  slateblue: [106, 90, 205],
  slategray: [112, 128, 144],
  slategrey: [112, 128, 144],
  snow: [255, 250, 250],
  springgreen: [0, 255, 127],
  steelblue: [70, 130, 180],
  tan: [210, 180, 140],
  teal: [0, 128, 128],
  thistle: [216, 191, 216],
  tomato: [255, 99, 71],
  turquoise: [64, 224, 208],
  violet: [238, 130, 238],
  wheat: [245, 222, 179],
  white: [255, 255, 255],
  whitesmoke: [245, 245, 245],
  yellow: [255, 255, 0],
  yellowgreen: [154, 205, 50]
}


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


export function getRandomColor()
{
	let color_index = Math.floor(Math.random() * COLORS.length);
	return COLORS[color_index];
}

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
	
	daw_line([{x:-1000,y:100},{x:1000,y:100}],'black',lineWidth/2, bgCtx)
	daw_line([{x:-1000,y:200},{x:1000,y:200}],'black',lineWidth/2, bgCtx)
	daw_line([{x:-1000,y:300},{x:1000,y:300}],'black',lineWidth/2, bgCtx)
	daw_line([{x:-1000,y:400},{x:1000,y:400}],'black',lineWidth/2, bgCtx)
	daw_line([{x:-1000,y:500},{x:1000,y:500}],'black',lineWidth/2, bgCtx)
	
	daw_line([{x:-1000,y:-100},{x:1000,y:-100}],'black',lineWidth/2, bgCtx)
	daw_line([{x:-1000,y:-200},{x:1000,y:-200}],'black',lineWidth/2, bgCtx)
	daw_line([{x:-1000,y:-300},{x:1000,y:-300}],'black',lineWidth/2, bgCtx)
	daw_line([{x:-1000,y:-400},{x:1000,y:-400}],'black',lineWidth/2, bgCtx)
	daw_line([{x:-1000,y:-500},{x:1000,y:-500}],'black',lineWidth/2, bgCtx)
	
	daw_line([{x:-1000,y:0},{x:1000,y:0}],'black',lineWidth, bgCtx)

	daw_line([{x:500,y:-1000},{x:500,y:1000}],'black',lineWidth/2, bgCtx)
	daw_line([{x:400,y:-1000},{x:400,y:1000}],'black',lineWidth/2, bgCtx)
	daw_line([{x:300,y:-1000},{x:300,y:1000}],'black',lineWidth/2, bgCtx)
	daw_line([{x:200,y:-1000},{x:200,y:1000}],'black',lineWidth/2, bgCtx)
	daw_line([{x:100,y:-1000},{x:100,y:1000}],'black',lineWidth/2, bgCtx)
	
	daw_line([{x:-100,y:-1000},{x:-100,y:1000}],'black',lineWidth/2, bgCtx)
	daw_line([{x:-200,y:-1000},{x:-200,y:1000}],'black',lineWidth/2, bgCtx)
	daw_line([{x:-300,y:-1000},{x:-300,y:1000}],'black',lineWidth/2, bgCtx)
	daw_line([{x:-400,y:-1000},{x:-400,y:1000}],'black',lineWidth/2, bgCtx)
	daw_line([{x:-500,y:-1000},{x:-500,y:1000}],'black',lineWidth/2, bgCtx)

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
	drawFactory = {
		rectangle   : draw_rectangle,
		circle    : draw_circle_simple,
		circle_rot    : draw_circle_from_matrix,
		triangle :  draw_triangle,
		trapezoid : draw_trapezoid,
		star_classic    : draw_star_classic,
		star_ai    : draw_star_ai,
		star_realistic    : draw_star_realistic,
		cross : draw_cross,
	}
	isPointInsideFactory = {
		rectangle   : isPointInside_rectangle,
		circle    : isPointInside_circle,
		circle_rot    : isPointInside_circle,
		triangle :  isPointInside_triangle,
		trapezoid : isPointInside_rectangle,
		star_classic    : isPointInside_circle,	
		star_ai    : isPointInside_circle,		
		star_realistic    : isPointInside_circle,		
		cross: isPointInside_rectangle,
	}


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
		

		const drawFunction = this.drawFactory[this.shape_type];
		
		drawFunction(ctx,this.m);
       

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
		return this.isPointInsideFactory[this.shape_type](point, this.m);
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

function draw_circle_simple(ctx, m)
{
	draw_circle_from_matrix(ctx, m, false)
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


function draw_star(ctx, 
	m, 
	nbr_branches=5, 
	radius_hole_from_radius=0.4)
{

	
	let vUp = new Vector2d(0,1)
	let angle_unit = 3.14*2/(nbr_branches*2)
	let local_vectors = []
	for( let i = 0; i < nbr_branches*2; i++ )
	{
		
		let v = vUp.getRotated(angle_unit*i)
		v.normalize()
		if(i%2 !== 0)	
			v.mult(radius_hole_from_radius)

		local_vectors.push(v)
	}

	for( let i = 0; i < local_vectors.length; i++ )
	{
		let p = local_vectors[i].getMult(m)

		if( i == 0 )
			ctx.moveTo(cX(p), cY(p))
		else
			ctx.lineTo(cX(p), cY(p))
	}

	ctx.closePath();               // Close the path (connects back to first point)	
}


function draw_cross(ctx, 
	m, 
	thickness=0.4)
{

	let vX = new Vector2d(1,0)
	let vY = new Vector2d(0,1)
	let vX_min = vX.getMult(thickness)
	let vY_min = vY.getMult(thickness)
	

	let angle_unit = 3.14*2/4
	let local_vectors = []
	for( let i = 0; i < 4; i++ )
	{	
		let vX_rotated = vX.getRotated(angle_unit*i)
		let vY_rotated = vY.getRotated(angle_unit*i)
		vX_rotated.normalize()
		vY_rotated.normalize()		
		let vX_rotated_min = vX_rotated.getMult(thickness)
		let vY_rotated_min = vY_rotated.getMult(thickness)	
	
		
		
		local_vectors.push(vY_rotated.getAdd(vX_rotated_min.getMult(0.5)))
		local_vectors.push(vY_rotated.getAdd(vX_rotated_min.getMult(-0.5)))
		local_vectors.push((vY_rotated_min.getMult(0.5)).getAdd(vX_rotated_min.getMult(-0.5)))
	}

	for( let i = 0; i < local_vectors.length; i++ )
	{
		let p = local_vectors[i].getMult(m)

		if( i == 0 )
			ctx.moveTo(cX(p), cY(p))
		else
			ctx.lineTo(cX(p), cY(p))
	}

	ctx.closePath();               // Close the path (connects back to first point)
	
}


function draw_star_classic(ctx,m)
{
	draw_star(ctx,
		m, 
		5, 
		0.4)
}

function draw_star_ai(ctx,m)
{
	draw_star(ctx,
		m, 
		4, 
		0.25)
}

function draw_star_realistic(ctx,m)
{
	draw_star(ctx,
		m, 
		6, 
		0.1)
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
