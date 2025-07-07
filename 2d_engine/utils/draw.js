
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

export class rectangle
{
	constructor(
		in_options,
	)
	{
		const defaultOptions = {
			m: new Matrix2d(),
			color: "white",
			stroke_color: "black",
			stroke_width: 2,
            interaction: null,
		}
		const args = { ...defaultOptions, ...in_options };

		this.m = args.m
		this.m_init = new Matrix2d(args.m)
		this.color = args.color
		this.stroke_color = args.stroke_color
		this.stroke_width = args.stroke_width	
		this.isSelected = false
        this.interaction = args.interaction

		this.stroke_color_highlight = "yellow"
        this.stroke_width_highlight = 5
	}

	duplicate()
	{
		return new rectangle({m : new Matrix2d(this.m), color: this.color, interaction:this.interaction})
	}

	draw()
	{
        ctx.save()
		ctx.beginPath()

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
			

		
		
		let p = this.m.get_row(2)
		let orient = this.m.getRotation()
		let scale = this.m.getScale()
		
		ctx.translate(cX(p), cY(p));
		ctx.rotate(cR(orient));
		
		ctx.rect(
			-scale[0], 
			-scale[1], 
			scale[0]*2, 
			scale[1]*2);
		ctx.fill()
		ctx.stroke()	
	
		ctx.resetTransform();	
        ctx.restore()		
	}

	isPointInside(x, y) {
		let pTest = new Vector2d(x, y)

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


export function get_randow_color()
{
	let color_index = Math.floor(Math.random() * COLORS.length);
	return COLORS[color_index]
}