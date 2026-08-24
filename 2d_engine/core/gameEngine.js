


import { Time } from './time.js'
import { User } from './user.js'
import { Constraints_info } from './constraint.js'
import { EventActions } from './eventActions.js'
import {
	COLORS,
	canvas,} from '../utils/draw.js'
import { body } from './body.js'
import { Logger } from './logger.js';
import { Render } from './render.js';
import { playSoundSample } from './sound.js';
import Matrix2d from '../utils/matrix2d.js';
import Vector2d from '../utils/vector2d.js';


const logger = new Logger("gameEngine");

export class gameEngine {

    DEBUG = {
        draw_body_interaction_shapes : true,
        draw_body_matrices : false,
    }
    PHONE_HALF_DIMENTIONS = [ 180, 350 ]
    DESKTOP_HALF_DIMENTIONS = [ 250, 400 ]
    
    constructor() {
        logger.info("constructor")
        
        this.Canvas = canvas;

        this.Time = new Time();
        this.User = new User( this, this.Time );
        this.Constraints = new Constraints_info( this.User, this, this.Time );
        this.EventActions = new EventActions( this, this.Time );
        this.Objs = {};
        this.body_effects = [];
        this.Render = new Render();


        // BACKGROUND
       

    }

    load_scene( scene_info )
    {
        logger.info("load_scene")
        let background_info = get_background_info()

        // LOAD OBJS
        this.Objs = {}

        for( let obj in background_info.objs )
            this.Objs[obj] = new body( { ...background_info.objs[obj], name : obj, Game_engine:this, Time: this.Time } )
        
        
        for( let obj in scene_info.objs )
            this.Objs[obj] = new body( { ...scene_info.objs[obj], name : obj, Game_engine:this, Time: this.Time } )
        
        // LOAD CONSTRAINTS
        this.Constraints.setup( scene_info.cns )

        
        // LOAD EVENT ACTIONS
        this.EventActions.setup( scene_info.eventActions )
            
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
        

        // grid A
        {
            let grid_thickness = 0.2
            let grid_incr = 10
            for( let i = 0 ; i < 100; i++ )
            {
                let x_abs = this.DESKTOP_HALF_DIMENTIONS[0]
                let y_abs = grid_incr*i
                if ( this.DESKTOP_HALF_DIMENTIONS[1] < y_abs)
                    break
                this.Render.queue_background.push( { 
                    shape_type : 'line', 
                    points : [
                        {x:-x_abs, y: y_abs},
                        {x: x_abs, y: y_abs}
                    ], 
                    stroke_color : 'black', 
                    stroke_width : grid_thickness } )
                this.Render.queue_background.push( { 
                    shape_type : 'line', 
                    points : [
                        {x:-x_abs, y:-y_abs},
                        {x: x_abs, y:-y_abs}
                    ], 
                    stroke_color : 'black', 
                    stroke_width : grid_thickness } ) 
            }

            for( let i = 0 ; i < 100; i++ )
            {
                let x_abs = grid_incr*i
                let y_abs = this.DESKTOP_HALF_DIMENTIONS[1]
                if ( this.DESKTOP_HALF_DIMENTIONS[0] < x_abs)
                    break

                this.Render.queue_background.push( { 
                    shape_type : 'line', 
                    points : [
                        {x:x_abs, y:-y_abs},
                        {x:x_abs, y:y_abs}
                    ], 
                    stroke_color : 'black', 
                    stroke_width : grid_thickness } )

                this.Render.queue_background.push( { 
                    shape_type : 'line', 
                    points : [
                        {x:-x_abs, y:-y_abs},
                        {x:-x_abs, y:y_abs}
                    ], 
                    stroke_color : 'black', 
                    stroke_width : grid_thickness } )                
            }
        }


        // grid A
        {
            let grid_thickness = 0.4
            let grid_incr = 50
            for( let i = 0 ; i < 100; i++ )
            {
                let x_abs = this.DESKTOP_HALF_DIMENTIONS[0]
                let y_abs = grid_incr*i
                if ( this.DESKTOP_HALF_DIMENTIONS[1] < y_abs)
                    break
                this.Render.queue_background.push( { 
                    shape_type : 'line', 
                    points : [
                        {x:-x_abs, y: y_abs},
                        {x: x_abs, y: y_abs}
                    ], 
                    stroke_color : 'black', 
                    stroke_width : grid_thickness } )
                this.Render.queue_background.push( { 
                    shape_type : 'line', 
                    points : [
                        {x:-x_abs, y:-y_abs},
                        {x: x_abs, y:-y_abs}
                    ], 
                    stroke_color : 'black', 
                    stroke_width : grid_thickness } ) 
            }

            for( let i = 0 ; i < 100; i++ )
            {
                let x_abs = grid_incr*i
                let y_abs = this.DESKTOP_HALF_DIMENTIONS[1]
                if ( this.DESKTOP_HALF_DIMENTIONS[0] < x_abs)
                    break

                this.Render.queue_background.push( { 
                    shape_type : 'line', 
                    points : [
                        {x:x_abs, y:-y_abs},
                        {x:x_abs, y:y_abs}
                    ], 
                    stroke_color : 'black', 
                    stroke_width : grid_thickness } )

                this.Render.queue_background.push( { 
                    shape_type : 'line', 
                    points : [
                        {x:-x_abs, y:-y_abs},
                        {x:-x_abs, y:y_abs}
                    ], 
                    stroke_color : 'black', 
                    stroke_width : grid_thickness } )                
            }
        }


        // grid A
        {
            let grid_thickness = 2
            let grid_incr = 100
            let grid_color = 'lightgrey'
            for( let i = 0 ; i < 100; i++ )
            {
                let y_abs = grid_incr*i
                if ( this.DESKTOP_HALF_DIMENTIONS[1] < y_abs)
                    break
                this.Render.queue_background.push( { 
                    shape_type : 'text', 
                    text : `${y_abs}`,
                    m : new Matrix2d().setTranslation(0,y_abs).setScale(grid_thickness),
                    color : grid_color } )
                this.Render.queue_background.push( { 
                    shape_type : 'text', 
                    text : `${-y_abs}`,
                    m : new Matrix2d().setTranslation(0,-y_abs).setScale(grid_thickness),
                    color : grid_color } ) 
            }

            for( let i = 0 ; i < 100; i++ )
            {
                let x_abs = grid_incr*i
                if ( this.DESKTOP_HALF_DIMENTIONS[0] < x_abs)
                    break

                this.Render.queue_background.push( { 
                    shape_type : 'text', 
                    text : `${x_abs}`,
                    m : new Matrix2d().setTranslation(x_abs,0).setScale(grid_thickness),
                    color : grid_color } )
                this.Render.queue_background.push( { 
                    shape_type : 'text', 
                    text : `${-x_abs}`,
                    m : new Matrix2d().setTranslation(-x_abs,0).setScale(grid_thickness),
                    color : grid_color } )              
            }
        }        

        // MAIN GRID AXIS
        this.Render.queue_background.push( { 
            shape_type : 'line', 
            points : [{x:-this.DESKTOP_HALF_DIMENTIONS[0],y:0},{x:this.DESKTOP_HALF_DIMENTIONS[0],y:0}], 
            stroke_color : 'black', 
            stroke_width : 3 } )

        this.Render.queue_background.push( { 
            shape_type : 'line', 
            points : [{x:0,y:-this.DESKTOP_HALF_DIMENTIONS[1]},{x:0,y:this.DESKTOP_HALF_DIMENTIONS[1]}], 
            stroke_color : 'black', 
            stroke_width : 3 } )
            
        //PHONE DIMS
        this.Render.queue_background.push( { 
            shape_type : 'line', 
            points : [{x:-this.DESKTOP_HALF_DIMENTIONS[0],y:-this.PHONE_HALF_DIMENTIONS[1]},{x:this.DESKTOP_HALF_DIMENTIONS[0],y:-this.PHONE_HALF_DIMENTIONS[1]}], 
            stroke_color : 'red', 
            stroke_width : 3 } )                

        this.Render.queue_background.push( { 
            shape_type : 'line', 
            points : [{x:-this.DESKTOP_HALF_DIMENTIONS[0],y:this.PHONE_HALF_DIMENTIONS[1]},{x:this.DESKTOP_HALF_DIMENTIONS[0],y:this.PHONE_HALF_DIMENTIONS[1]}], 
            stroke_color : 'red', 
            stroke_width : 3 } )         

        this.Render.queue_background.push( { 
            shape_type : 'line', 
            points : [{x:-this.PHONE_HALF_DIMENTIONS[0],y:-this.DESKTOP_HALF_DIMENTIONS[1]},{x:-this.PHONE_HALF_DIMENTIONS[0],y:this.DESKTOP_HALF_DIMENTIONS[1]}], 
            stroke_color : 'red', 
            stroke_width : 3 } )       

        this.Render.queue_background.push( { 
            shape_type : 'line', 
            points : [{x:this.PHONE_HALF_DIMENTIONS[0],y:-this.DESKTOP_HALF_DIMENTIONS[1]},{x:this.PHONE_HALF_DIMENTIONS[0],y:this.DESKTOP_HALF_DIMENTIONS[1]}], 
            stroke_color : 'red', 
            stroke_width : 3 } ) 
        
        
        this.Render.draw_background()
    }


    update() {
  
        if( this.Time.one_update_debug_time_passed )
            logger.info("update");   

        //	INTERACTION
        this.User.update()
        this.User.objs_update_events_info( this )

        for( let elem in this.Objs )
            this.Objs[elem].update()
        
        for( let elem of this.body_effects )
            elem.update()
        
        this.Constraints.update()

        this.EventActions.update()

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
            
            if( this.Objs[elem].shapes_visibility == true )
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

    playSoundSample(name)
    {
        playSoundSample(name)
    }


    
}



function get_background_info()
{
    let background_info = {
        "objs": {
            "_bg_center": {
                "m": [0, 0, 0, 1, 1],
                "shapes" : [
                    {
                        "m": [0, 0, 0, 130, 300],
                        "color": null,
                        "type": "rectangle",
                        "stroke_color":null,
                        "stroke_width":1,
                        
                    }
                ],
                "interaction_shapes": [
                    {
                        "m": [0, 0, 0, 130, 300],
                        "type": "rectangle",
                    }
                ],
                "interaction_settings": {
                    "enable": true,
                    "coef": 0.2,
                    "rotate_resolution_priority": 1.0,
                    "radius_threshold": 0,
                    "do_translation": true
                },
                transform_settings : {
                    parent_limit_space : false,
                    translate_limits: [[0,0],[-0,0]],
                    rotate_limits: [0,0],
                },            
                "debug":{
                    "shape_interaction_visibility" : false,
                },
                "highlight_when_selected":false,
            },
            "_bg_up": {
                "m": [0, 0, 0, 1, 1],
                "shapes" : [
                    {
                        "m": [0, 330, 0, 190, 30],
                        "color": null,
                        "type": "rectangle",
                        "stroke_color":null,
                        "stroke_width":1,
                        
                    }
                ],
                "interaction_shapes": [
                    {
                        "m": [0, 330, 0, 190, 30],
                        "type": "rectangle",
                    }
                ],
                "interaction_settings": {
                    "enable": true,
                    "coef": 0.2,
                    "rotate_resolution_priority": 1.0,
                    "radius_threshold": 0,
                    "do_translation": true
                },
                transform_settings : {
                    parent_limit_space : false,
                    translate_limits: [[0,0],[-0,0]],
                    rotate_limits: [0,0],
                },            
                "debug":{
                    "shape_interaction_visibility" : false,
                },
                "highlight_when_selected":false,
            },
            "_bg_down": {
                "m": [0, 0, 0, 1, 1],
                "shapes" : [
                    {
                        "m": [0, -330, 0, 190, 30],
                        "color": null,
                        "type": "rectangle",
                        "stroke_color":null,
                        "stroke_width":1,
                        
                    }
                ],
                "interaction_shapes": [
                    {
                        "m": [0, -330, 0, 190, 30],
                        "type": "rectangle",
                    }
                ],
                "interaction_settings": {
                    "enable": true,
                    "coef": 0.2,
                    "rotate_resolution_priority": 1.0,
                    "radius_threshold": 0,
                    "do_translation": true
                },
                transform_settings : {
                    parent_limit_space : false,
                    translate_limits: [[0,0],[-0,0]],
                    rotate_limits: [0,0],
                },            
                "debug":{
                    "shape_interaction_visibility" : false,
                },
                "highlight_when_selected":false,
            },
            "_bg_left": {
                "m": [0, 0, 0, 1, 1],
                "shapes" : [
                    {
                        "m": [-160, 0, 0, 30, 300],
                        "color": null,
                        "type": "rectangle",
                        "stroke_color":null,
                        "stroke_width":1,
                        
                    }
                ],
                "interaction_shapes": [
                    {
                        "m": [-160, 0, 0, 30, 300],
                        "type": "rectangle",
                    }
                ],
                "interaction_settings": {
                    "enable": true,
                    "coef": 0.2,
                    "rotate_resolution_priority": 1.0,
                    "radius_threshold": 0,
                    "do_translation": true
                },
                transform_settings : {
                    parent_limit_space : false,
                    translate_limits: [[0,0],[-0,0]],
                    rotate_limits: [0,0],
                },            
                "debug":{
                    "shape_interaction_visibility" : false,
                },
                "highlight_when_selected":false,
            },
            "_bg_right": {
                "m": [0, 0, 0, 1, 1],
                "shapes" : [
                    {
                        "m": [160, 0, 0, 30, 300],
                        "color": null,
                        "type": "rectangle",
                        "stroke_color":null,
                        "stroke_width":1,
                        
                    }
                ],
                "interaction_shapes": [
                    {
                        "m": [160, 0, 0, 30, 300],
                        "type": "rectangle",
                    }
                ],
                "interaction_settings": {
                    "enable": true,
                    "coef": 0.2,
                    "rotate_resolution_priority": 1.0,
                    "radius_threshold": 0,
                    "do_translation": true
                },
                transform_settings : {
                    parent_limit_space : false,
                    translate_limits: [[0,0],[-0,0]],
                    rotate_limits: [0,0],
                },            
                "debug":{
                    "shape_interaction_visibility" : false,
                },
                "highlight_when_selected":false,
            },
        }
    }
    return background_info
}


