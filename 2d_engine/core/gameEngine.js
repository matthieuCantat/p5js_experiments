


import { Time } from './time.js'
import { User } from './user.js'
import { Constraints_info } from './constraint.js'
import {
	COLORS,
	canvas,} from '../utils/draw.js'
import { body } from './body.js'
import { Logger } from './logger.js';
import { Render } from './render.js';
import Matrix2d from '../utils/matrix2d.js';
import Vector2d from '../utils/vector2d.js';


const logger = new Logger("gameEngine");

export class gameEngine {

    DEBUG = {
        draw_body_interaction_shapes : true,
        draw_body_matrices : false,
    }
    
    constructor() {
        logger.info("constructor")
        
        this.Canvas = canvas;

        this.Time = new Time();
        this.User = new User( this, this.Time );
        this.Constraints = new Constraints_info( this.User, this, this.Time );
        this.Objs = {};
        this.body_effects = [];
        this.Render = new Render();

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

        this.Render.queue_background = []

        // background
        this.Render.queue_background.push( { 
            shape_type : 'uniform_background', 
            color: 'grey' } )
        
        // grid
        for( let i = 0 ; i < 10; i++ )
            this.Render.queue_background.push( { 
                shape_type : 'line', 
                points : [{x:-1000,y:-500 + 100*i},{x:1000,y:-500 + 100*i}], 
                stroke_color : 'black', 
                stroke_width : 1 } )

        for( let i = 0 ; i < 10; i++ )
            this.Render.queue_background.push( { 
                shape_type : 'line', 
                points : [{x:-500+100*i,y:-1000},{x:-500+100*i,y:1000}], 
                stroke_color : 'black', 
                stroke_width : 1 } )
        
        this.Render.queue_background.push( { 
            shape_type : 'line', 
            points : [{x:-1000,y:0},{x:1000,y:0}], 
            stroke_color : 'black', 
            stroke_width : 3 } )

        this.Render.queue_background.push( { 
            shape_type : 'line', 
            points : [{x:0,y:-1000},{x:0,y:1000}], 
            stroke_color : 'black', 
            stroke_width : 3 } )
            
        //phone dims

        this.Render.queue_background.push( { 
            shape_type : 'line', 
            points : [{x:-1000,y:-420},{x:1000,y:-420}], 
            stroke_color : 'red', 
            stroke_width : 3 } )                

        this.Render.queue_background.push( { 
            shape_type : 'line', 
            points : [{x:-1000,y:280},{x:1000,y:280}], 
            stroke_color : 'red', 
            stroke_width : 3 } )         

        this.Render.queue_background.push( { 
            shape_type : 'line', 
            points : [{x:-180,y:-1000},{x:-180,y:1000}], 
            stroke_color : 'red', 
            stroke_width : 3 } )       

        this.Render.queue_background.push( { 
            shape_type : 'line', 
            points : [{x:170,y:-1000},{x:170,y:1000}], 
            stroke_color : 'red', 
            stroke_width : 3 } ) 
        
        
        this.Render.draw_background()
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


        //this.Render.draw_background()

        
        /*
        for( let elem of this.body_effects )
            elem.draw_background()
        
        for( let elem in this.Objs )
            this.Objs[elem].draw()
        
        for( let elem of this.body_effects )
            elem.draw_foreground()
        */
        

        
        // OTHER TEST 
        this.Render.queue = []


        //console.log(this.event_effects)
        // BACKGROUND EFFECTS
        for( let event in this.event_effects)
        {
            if(this.event_effects[event] == null)
                continue
            
            for(let i=0; i < this.event_effects[event].effects.length; i++)
            {
                for( let j = 0; j < this.event_effects[event].effects[i].background_objs.length; j++)
                {
                    let Body = this.event_effects[event].effects[i].background_objs[j]
                    
                    this.Render.queue.push( {
                        shape_type : Body.shape_type,      
                        m : Body.m, 
                        color : Body.color,
                        stroke_color : Body.stroke_color, 
                        stroke_width : Body.stroke_width,        
                    })                
                }
            }
        }        

        // BODYS
        for( let elem in this.Objs )
        {
            if( this.DEBUG.draw_body_interaction_shapes)
                this.Render.queue.push( ...this.Objs[elem].get_render_infos_interaction_shape_debug() )
            
            if( this.Objs[elem].shape_visibility == true )
                this.Render.queue.push( ...this.Objs[elem].get_render_infos() )

            this.Render.queue.push( ...this.Objs[elem].get_render_infos_interaction_debug() )
            
            if( this.DEBUG.draw_body_matrices)
                this.Render.queue.push( ...this.Objs[elem].get_render_infos_matrix_debug() )
        }



        // FOREGROUND EFFECTS
        for( let event in this.event_effects)
        {
            if(this.event_effects[event] == null)
                continue
            
            for(let i=0; i < this.event_effects[event].effects.length; i++)
            {
                for( let j = 0; j < this.event_effects[event].effects[i].foreground_objs.length; j++)
                {
                    let Body = this.event_effects[event].effects[i].foreground_objs[j]
                    
                    this.Render.queue.push( {
                        shape_type : Body.shape_type,      
                        m : Body.m, 
                        color : Body.color,
                        stroke_color : Body.stroke_color, 
                        stroke_width : Body.stroke_width,        
                    })                
                }
            }
        }        

        // DEBUG
        this.Render.queue.push( ...this.User.draw() ) 



        this.Render.draw()
       
                
    }


    
}


