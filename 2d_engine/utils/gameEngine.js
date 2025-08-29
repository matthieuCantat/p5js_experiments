
import Vector2d from '../utils/vector2d.js';
import Matrix2d from '../utils/matrix2d.js';
import { User_interaction_info } from '../utils/interaction.js'
import { Constraints_info } from '../utils/constraint.js'
import { draw_bg, 
	draw_grid,
	draw_phone_dims,
	COLORS,
	canvas,
	draw_background} from '../utils/draw.js'
import { body_effects } from '../utils/shared.js';
import { body } from '../utils/body.js'


export class gameEngine {
    constructor() {
        this.Canvas = canvas;
        this.User_interaction = new User_interaction_info();
        this.Constraints = new Constraints_info(this.User_interaction);
        this.Objs = {};
    }

    load_scene( scene_info )
    {
        this.Objs = {}
        for( let obj in scene_info.objs )
            this.Objs[obj] = new body( scene_info.objs[obj] )
        
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
                
                if( typeof cns_arg.driven_obj === 'string' )
                    cns_arg.driven_obj = this.Objs[cns_arg.driven_obj]
            }
            
            cns_args.push( cns_arg )
        }
        this.Constraints.setup( cns_args )
            
    }

    setup() {
        // SETUP INTERACTION
        this.User_interaction.set_interaction_objs(this.Objs)
        // SETUP WEB PAGE BEHAVIOR
        this.Canvas.addEventListener('touchmove', disable_pull_to_refresh, { passive: false } );
                    
          

        // DRAW BG
        draw_bg('grey')
        draw_grid()
        draw_phone_dims()
    }

    setup_listeners()
    {
        this.User_interaction.interactionEvent_addToListener(this.Canvas)  
    }

    update() {
        //	INTERACTION
        this.User_interaction.update()
        this.User_interaction.update_objs_events_info( this.Objs )

        for( let elem in this.Objs )
            this.Objs[elem].update()
        
        for( let elem of body_effects )
            elem.update()
        
        this.Constraints.update()
    }

    draw() {

        draw_background()

        for( let elem of body_effects )
            elem.draw_background()
        
        for( let elem in this.Objs )
            this.Objs[elem].draw()
        
        for( let elem of body_effects )
            elem.draw_foreground()
    
        this.User_interaction.draw()        
    }


    game_tick()
    {
        this.update()
        this.draw()
    }
    
}



// Disable pull-to-refresh using JavaScript
function disable_pull_to_refresh(event)
{
    event.preventDefault();
    return true
}
