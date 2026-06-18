
import { 
draw_rectangle,
draw_text,
draw_circle_simple,
draw_circle_from_matrix,
draw_triangle,
draw_trapezoid,
draw_star_classic,
draw_star_ai,
draw_star_realistic,
draw_cross,
isPointInside_rectangle,
isPointInside_circle,
isPointInside_triangle,
draw_line,
draw_uniform_background,
} from '../utils/draw.js';
import Matrix2d from '../utils/matrix2d.js';
import Vector2d from '../utils/vector2d.js';
import { Logger } from './logger.js';

const logger = new Logger("render");



var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 20;


// Create an offscreen canvas
export const backgroundCanvas = document.getElementById("backgroundCanvas");
console.log('backgroundCanvas',backgroundCanvas)
const bgCtx = backgroundCanvas.getContext("2d");
backgroundCanvas.width = canvas.width;
backgroundCanvas.height = canvas.height;

export class Render
{
    drawFactory = {
        rectangle   : draw_rectangle,
        circle    : draw_circle_from_matrix,
        //circle_rot    : draw_circle_from_matrix,
        triangle :  draw_triangle,
        trapezoid : draw_trapezoid,
        star_classic    : draw_star_classic,
        star_ai    : draw_star_ai,
        star_realistic    : draw_star_realistic,
        cross : draw_cross,
        text : draw_text,
        line : draw_line,
        uniform_background : draw_uniform_background,
    }

    BORDERS_CENTER_POINTS = [
        new Vector2d(0,280),
        new Vector2d(170,0),
        new Vector2d(0,-420),
        new Vector2d(-180,0)
    ]
    BORDERS_NORMALS = [
        new Vector2d(0,-1),
        new Vector2d(-1,0),
        new Vector2d(0,1),
        new Vector2d(1,0)
    ]	

    GRAVITY_VECTOR = new Vector2d(0,-0.981)

    constructor(
        in_options
    )
    {
        logger.info("constructor")

        const defaultOptions = {
        }
        const args = { ...defaultOptions, ...in_options };

        this.queue_background = []
        this.queue = []

        

    }


    draw_background(){
        
        for( let i = 0 ; i < this.queue_background.length; i++ )
        {
            this.drawObj( bgCtx, this.queue_background[i], i )
        }
    }


    draw()
    {
        ctx.drawImage(backgroundCanvas, 0, 0);
        for( let i = 0 ; i < this.queue.length; i++ )
        {
            this.drawObj( ctx, this.queue[i], i )
        }

        return true
    }

    drawObj( ctx, in_draw_args, i )
    {
        let draw_args = { color: null, stroke_color: null, stroke_width: 0, ...in_draw_args }


        if(in_draw_args.visibility == false)
            return false

        ctx.save()// save current drawing style
        
        // STYLE
        if( draw_args.color != null )
            ctx.fillStyle = draw_args.color
        ctx.strokeStyle = draw_args.stroke_color
        ctx.lineWidth = draw_args.stroke_width


        // DRAW SHAPE
        const drawFunction = this.drawFactory[draw_args.shape_type];
        if (!drawFunction) {
            console.warn("Unknown shape:", draw_args.shape_type);
            ctx.restore();
            return false
        }		
        drawFunction( ctx, draw_args );
        
        // RENDER
        if( draw_args.color != null)
            ctx.fill()
        
        if( draw_args.stroke_color != null)
            ctx.stroke()

        //ctx.resetTransform();	
        ctx.restore();// restore drawing style
        
    }

    

}
