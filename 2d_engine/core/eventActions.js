import Vector2d from '../utils/vector2d.js';
import Matrix2d from '../utils/matrix2d.js';
import { project_point_on_line, round } from '../utils/math.js';
import { Logger } from './logger.js';
import { build_expression_function, execute_expression_function } from './constraint.js';


const logger = new Logger("constraints Manager");

export class EventActions
{
    constructor(Game_engine, Time)
    {
        logger.info("constructor")

        this.data = []
        this.Game_engine = Game_engine
        this.Time = Time
        /*
        let axe_cns_settings_default = {
			'enable':false,
			'm_driver':new Matrix2d(),
			'v_axe':new Vector2d(1,0),
			'enable_limits':false,
			'limit_min':null,
			'limit_max':null,
			'rotation_constraint_coef':0.0,
			'rotation_constraint_axe':0,
			'dyn_bounce_coef':0,
            step_incr: null,
		}
            */

        
    }

    setup(raw_data)
    {
        if( raw_data === undefined )
            return false
        


        logger.info("setup")

        this.data = raw_data   
        // store offset
        for( let cns of this.data )
        {
            /*
            // EVENT START FUNTION
            {
                var in_args = {}    
                for( let attr in cns.event_start )
                {
                    if( attr == 'expression' )
                        continue
                    if( attr == 'out' )
                        continue
                    in_args[attr] = cns.event_start[attr]
                }
                
                let out_attr = null
                if( cns.event_start.out instanceof Array )
                    out_attr = cns.event_start.out[1]
                
                let out_info = build_expression_function( cns.event_start.expression, 
                                                        in_args, 
                                                        out_attr )
                
                cns.event_start.expression_fn = out_info.function;
                cns.event_start.args_names = out_info.args_names   
            }    

            // EVENT END FUNTION
            if( cns.event_end !== null )
            {
                var in_args = {}    
                for( let attr in cns.event_end )
                {
                    if( attr == 'expression' )
                        continue
                    if( attr == 'out' )
                        continue
                    in_args[attr] = cns.event_end[attr]
                }
                
                let out_attr = null
                if( cns.event_end.out instanceof Array )
                    out_attr = cns.event_end.out[1]
                
                let out_info = build_expression_function( cns.event_end.expression, 
                                                        in_args, 
                                                        out_attr )
                
                cns.event_end.expression_fn = out_info.function;
                cns.event_end.args_names = out_info.args_names   
            }    
            
            // OUT FUNCTION
            {
                var in_args = {}    
                for( let attr in cns.action )
                {
                    if( attr == 'expression' )
                        continue
                    if( attr == 'out' )
                        continue
                    in_args[attr] = cns.action[attr]
                }
                
                let out_attr = null
                if( cns.action.out instanceof Array )
                    out_attr = cns.action.out[1]
                
                let out_info = build_expression_function( cns.action.expression, 
                                                        in_args, 
                                                        out_attr )
                
                cns.action.expression_fn = out_info.function;
                cns.action.args_names = out_info.args_names
                cns.action.nbr_eval = 0   
            }  
            */   
                                
        }
    }

    
	// CONSTRAINT
	update()
    {
        if( this.Time.one_update_debug_time_passed )
            logger.info("update");  

        
        for( let cns of this.data )
        {
        
            let event_start_args = []
            for( let obj_name of cns.event_start.in_args )
            {
                if( cns.event_start[obj_name] == 'fn' )
                    continue
                event_start_args.push(this.Game_engine.Objs[obj_name])
            }
            var event_start_out = cns.event_start.fn(...event_start_args)
            

            var event_end_out = false
            if( cns.event_end !== null )
            {
                let event_end_args = []
                for( let obj_name of cns.event_end.in_args )
                {
                    if( cns.event_end[obj_name] == 'fn' )
                        continue
                    event_end_args.push(this.Game_engine.Objs[obj_name])
                }
                event_end_out = cns.event_end.fn(...event_end_args)   
            }

            var duration_end_out = 0 < cns.event_max_duration && cns.event_max_duration < cns.action.nbr_eval

            
            if( event_start_out && !event_end_out && !duration_end_out )
            {
                let action_args = []
                for( let obj_name of cns.action.in_args)
                {
                    if( cns.action[obj_name] == 'fn' )
                        continue
                    action_args.push(this.Game_engine.Objs[obj_name])
                }
                cns.action.fn(...action_args) 
                cns.action.nbr_eval += 1
            }


        }
    }



}


