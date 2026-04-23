


import { Time } from './time.js'
import { User } from './user.js'
import { Constraints_info } from './constraint.js'
import { draw_bg, 
	draw_grid,
	draw_phone_dims,
	COLORS,
	canvas,
	draw_background} from '../utils/draw.js'
import { body } from './body.js'
import { Logger } from './logger.js';



const logger = new Logger("gameEngine");

export class gameEngine {
    
    constructor() {
        logger.info("constructor")
        
        this.Canvas = canvas;

        this.Time = new Time();
        this.User = new User( this, this.Time );
        this.Constraints = new Constraints_info( this.User, this, this.Time );
        this.Objs = {};
        this.body_effects = [];
        this.render_queue = [];

    }

    load_scene( scene_info )
    {
        logger.info("load_scene")

        // LOAD OBJS
        this.Objs = {}
        for( let obj in scene_info.objs )
            this.Objs[obj] = new body( { ...scene_info.objs[obj], Game_engine:this, Time: this.Time } )
        
        // LOAD CONSTRAINTS
        let cns_args = []
        for( let cns_arg of scene_info.cns )
        {
            // Convert to obj 
            if(cns_arg.mode === 'instance')
            {
                for( let i = 0 ; i < cns_arg.objs.length; i++ )
                    cns_arg.objs[i] = this.Objs[cns_arg.objs[i]]
            }
            else if(cns_arg.mode === 'axe')
            {
                if( typeof cns_arg.driver_obj === 'string' ){
                    cns_arg.driver_obj = this.Objs[cns_arg.driver_obj]
                }
                
                for ( let i = 0 ; i < cns_arg.driven_objs.length; i++ )
                    if( typeof cns_arg.driven_objs[i] === 'string' )
                        cns_arg.driven_objs[i] = this.Objs[cns_arg.driven_objs[i]]
            }
            
            cns_args.push( cns_arg )
        }
        this.Constraints.setup( cns_args )
            
    }

    setup() {
        logger.info("setup")

        this.User.setup()
        // DRAW BG   
        draw_bg('grey')
        draw_grid()
        draw_phone_dims()
    }


    update() {
  
        if( this.Time.one_update_debug_time_passed )
            logger.info("update");   

        //	INTERACTION
        this.User.update()
        this.User.objs_update_events_info( this.Objs )

        for( let elem in this.Objs )
            this.Objs[elem].update()
        
        for( let elem of this.body_effects )
            elem.update()
        
        this.Constraints.update()

        this.Time.update()
    }

    draw() {
        if( this.Time.one_update_debug_time_passed )
            logger.info("draw");   


        draw_background()

        this.render_queue = []

        for( let elem of this.body_effects )
            elem.draw_background()
        
        for( let elem in this.Objs )
            this.Objs[elem].draw()
        
        for( let elem of this.body_effects )
            elem.draw_foreground()
    
        this.User.draw()        
    }


    
}


