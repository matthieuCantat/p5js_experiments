

import{ radian }from './math.js';
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

export function getRGB(color)
{
    let rgb = null
    if( color.startsWith('rgb('))
        rgb = color.match(/\d+/g).map(Number);
    else
        rgb = COLORS_TO_RGB[color]

    return rgb
}


export function draw_uniform_background( 
	ctx, 
	{ }
)
{
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}




export function draw_background_text(txt,p,color,size)
{
	
	bgCtx.fillStyle = color
	bgCtx.font = size + "px arial";
	bgCtx.fillText(txt, cX(p), cY(p));
	
	
}

export function draw_line( 
	ctx, 
	{ points = [] , stroke_color = 'red', lineWidth = 5 }

)
{
	
    //ctx.save()
	ctx.beginPath()
	//ctx.color = [1,0,0]
    //ctx.strokeStyle = stroke_color
	//ctx.fillStyle = color
	//ctx.lineWidth = lineWidth;

	if ( points.length == 0)
		return 

	ctx.moveTo( cX(points[0]), cY(points[0]) );
	for( let i = 1; i < points.length; i++)
		ctx.lineTo( cX(points[i]), cY(points[i]) )

	//ctx.stroke();
    //ctx.restore()
    
}



export function draw_rectangle(ctx, { m = null, sub_draw = false } )
{
	
	let p = m.get_row(2)
	let orient = m.getRotationRad()
	let scale = m.getScale()
	
	ctx.translate(cX(p), cY(p));
	ctx.rotate(orient);
	
	if( sub_draw == false )
		ctx.beginPath();
	ctx.rect(
		-scale.x, 
		-scale.y, 
		scale.x*2, 
		scale.y*2);

	if( sub_draw == false )
		ctx.closePath();
	
}



export function draw_text(ctx, { m = null , txt = '' })
{
	let p = m.get_row(2)
	let orient = m.getRotation()
	let scale = m.getScale()
	

	ctx.font =''+Math.ceil(scale.x)*7+'px serif';
	ctx.fillText(txt, cX(p), cY(p));
	
}

export function draw_circle_simple(ctx, { m = null } )
{
	draw_circle_from_matrix(ctx, { m : m, draw_mark : false } )
}

export function draw_circle_from_matrix(ctx, { m = null, draw_mark=true })
{
	
	let p = m.get_row(2)
	let orient = m.getRotationDeg()
	let scale = m.getScale()
	
	
	let radius = Math.max( scale.x,scale.y )

	ctx.beginPath();
	ctx.arc( cX(p), 
			cY(p), 
			radius, 
			0.0, 
			2.0 * Math.PI); 
	ctx.closePath();
	
	if( draw_mark)
	{
		let vY = m.get_row(1)
		vY.normalize()
		vY.mult(radius/2)
		let p_mark = p.getAdd( vY )
		let scale_mark = new Vector2d(1.0,radius/2)
		
		let m_mark = new Matrix2d( p_mark, orient, scale_mark)
		
		draw_rectangle(ctx, { m : m_mark, sub_draw : true } )
	}	
	
	
}


export function draw_triangle(ctx, { m = null } )
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

	ctx.beginPath();
	ctx.moveTo(cX(pA), cY(pA));            // Move to the first point (x1, y1)
	ctx.lineTo(cX(pB), cY(pB));           // Draw line to second point (x2, y2)
	ctx.lineTo(cX(pC), cY(pC));          // Draw line to third point (x3, y3)
	ctx.closePath();               // Close the path (connects back to first point)
	
}


export function draw_star(ctx, 
	{ m = null,
	nbr_branches=5, 
	radius_hole_from_radius=0.4 })
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

	ctx.beginPath();
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


export function draw_cross(ctx, 
	{ m = null, thickness=0.4 },)
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

	ctx.beginPath();
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


export function draw_star_classic(ctx,m)
{
	draw_star(ctx,
		m, 
		5, 
		0.4)
}

export function draw_star_ai(ctx,m)
{
	draw_star(ctx,
		m, 
		4, 
		0.25)
}

export function draw_star_realistic(ctx,m)
{
	draw_star(ctx,
		m, 
		6, 
		0.1)
}




export function draw_trapezoid(ctx, { m = null, sub_draw = false })
{
	let ANGLE = 45

	let p = m.get_row(2)
	let vX = m.get_row(0)
	let vY = m.get_row(1)
	

	let pA = p.getAdd(vX.getMult(-1)).getAdd(vY)
	let pB = p.getAdd(vX).getAdd(vY)
	let pC = p.getAdd(vX).getAdd(vY.getMult(-1))
	let pD = p.getAdd(vX.getMult(-1)).getAdd(vY.getMult(-1))


	let dist_axeY = vY.mag()*2

	let vAD = pD.getSub(pA)
	vAD.rotate(ANGLE)
	vAD.normalize()
	let dist_AD = dist_axeY / Math.cos(radian(ANGLE))
	vAD.mult(dist_AD)
	let pD_trap = pA.getAdd(vAD)

	let vBC = pC.getSub(pB)
	vBC.rotate(-ANGLE)
	vBC.normalize()
	let dist_BC = dist_axeY / Math.cos(radian(-ANGLE))
	vBC.mult(dist_BC)
	let pC_trap = pB.getAdd(vBC)


	if( sub_draw == false )
		ctx.beginPath();
	ctx.moveTo(cX(pA), cY(pA));            // Move to the first point (x1, y1)
	ctx.lineTo(cX(pB), cY(pB));           // Draw line to second point (x2, y2)
	ctx.lineTo(cX(pC_trap), cY(pC_trap));          // Draw line to third point (x3, y3)
	ctx.lineTo(cX(pD_trap), cY(pD_trap)); 
	if( sub_draw == false )
		ctx.closePath();

	
	
}


export function isPointInside_rectangle(point,m)
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


export function isPointInside_trapezoid(point,m)
{
	let ANGLE = 3.14/4

	let vX = m.get_row(0)
	let vY = m.get_row(1)
	let p = m.get_row(2)

	let pC = p.getAdd(vY).getAdd(vX)
	let pD = p.getAdd(vY).getAdd(vX.getMult(-1))

	let vDC = pD.getSub(pC)
	vDC.rotate(ANGLE)
	let dist = Math.sin(radian(ANGLE))*vY.mag()*2
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


export function isPointInside_circle(point,m)
{

	let vX = m.get_row(0)
	let vY = m.get_row(1)
	let p = m.get_row(2)
	let radius = Math.max( vX.mag(), vY.mag() )
	
	let vDelta = point.getSub(p)
	
	return vDelta.mag() <= radius
}


export function isPointInside_triangle(point,m)
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
